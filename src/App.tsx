import { useState, useCallback } from 'react';
import { AnimatePresence } from 'framer-motion';
import { Sparkles, ArrowRight, RotateCcw } from 'lucide-react';
import { TabSwitcher } from './components/TabSwitcher';
import { ImageUploader } from './components/ImageUploader';
import { FusionReview } from './components/FusionReview';
import { GenerationResult } from './components/GenerationResult';
import { LoadingState } from './components/LoadingState';
import { ImageToImage } from './components/ImageToImage';
import { useLocale } from './i18n/LocaleContext';
import { analyzeAndSuggest, generateImage } from './services/openai';
import type { AnalysisResult, GenerationResult as GenerationResultType, WorkflowStep, TabType } from './types';
import './App.css';

function App() {
  const { t } = useLocale();
  const [activeTab, setActiveTab] = useState<TabType>('fusion');
  const [step, setStep] = useState<WorkflowStep>('upload');
  const [referenceImage, setReferenceImage] = useState<string>('');
  const [productImage, setProductImage] = useState<string>('');
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);
  const [generationResult, setGenerationResult] = useState<GenerationResultType | null>(null);
  const [error, setError] = useState<string>('');
  const [isGenerating, setIsGenerating] = useState(false);

  const handleReferenceImageSelect = useCallback((base64: string) => {
    setReferenceImage(base64);
    setError('');
  }, []);

  const handleProductImageSelect = useCallback((base64: string) => {
    setProductImage(base64);
    setError('');
  }, []);

  // 同时分析两张图并获取融合建议
  const handleAnalyze = useCallback(async () => {
    if (!referenceImage || !productImage) return;

    setStep('analyzing');
    setError('');

    try {
      const result = await analyzeAndSuggest(referenceImage, productImage);
      setAnalysis(result);
      setStep('review');
    } catch (err) {
      setError(err instanceof Error ? err.message : '分析失败，请重试');
      setStep('upload');
    }
  }, [referenceImage, productImage]);

  // 确认建议并生成图片（接收可能被用户修改过的提示词）
  const handleGenerate = useCallback(async (customPrompt?: string) => {
    if (!analysis) return;

    const promptToUse = customPrompt || analysis.fusion.generation_prompt;

    setIsGenerating(true);
    setStep('generating');
    setError('');

    try {
      const result = await generateImage(promptToUse);
      setGenerationResult(result);
      setStep('complete');
    } catch (err) {
      setError(err instanceof Error ? err.message : '生成失败，请重试');
      setStep('review');
    } finally {
      setIsGenerating(false);
    }
  }, [analysis]);

  // 重新生成
  const handleRegenerate = useCallback(async () => {
    if (!analysis) return;

    setIsGenerating(true);
    setError('');

    try {
      const result = await generateImage(analysis.fusion.generation_prompt);
      setGenerationResult(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : '重新生成失败，请重试');
    } finally {
      setIsGenerating(false);
    }
  }, [analysis]);

  // 重置
  const handleReset = useCallback(() => {
    setStep('upload');
    setReferenceImage('');
    setProductImage('');
    setAnalysis(null);
    setGenerationResult(null);
    setError('');
  }, []);

  // 返回编辑
  const handleBackToReview = useCallback(() => {
    setStep('review');
    setGenerationResult(null);
  }, []);

  return (
    <div className="app">
      <header className="header">
        <div className="logo">
          <Sparkles size={28} />
          <h1>{t('title')}</h1>
        </div>
        <p className="tagline">{t('tagline')}</p>
      </header>

      <main className="main">
        {/* Tab 切换 */}
        <TabSwitcher activeTab={activeTab} onTabChange={setActiveTab} />

        {/* 图生图模式 */}
        {activeTab === 'imageToImage' && <ImageToImage />}

        {/* 爆款融合模式 */}
        {activeTab === 'fusion' && (
          <>
        {/* 步骤指示器 */}
        <div className="steps-indicator">
          <div className={`step-item ${step === 'upload' || step === 'analyzing' ? 'active' : ''} ${analysis ? 'completed' : ''}`}>
            <span className="step-number">1</span>
            <span className="step-label">{t('step1')}</span>
          </div>
          <ArrowRight size={20} className="step-arrow" />
          <div className={`step-item ${step === 'review' || step === 'generating' ? 'active' : ''} ${generationResult ? 'completed' : ''}`}>
            <span className="step-number">2</span>
            <span className="step-label">{t('step2')}</span>
          </div>
          <ArrowRight size={20} className="step-arrow" />
          <div className={`step-item ${step === 'complete' ? 'active completed' : ''}`}>
            <span className="step-number">3</span>
            <span className="step-label">{t('step3')}</span>
          </div>
        </div>

        {error && (
          <div className="error-message">
            <pre style={{ whiteSpace: 'pre-wrap', margin: 0 }}>{error}</pre>
          </div>
        )}

        <div className="content">
          <AnimatePresence mode="wait">
            {step === 'analyzing' && (
              <LoadingState
                message={t('analyzingTitle')}
                subMessage={t('analyzingSub')}
              />
            )}

            {step === 'generating' && (
              <LoadingState
                message={t('generatingTitle')}
                subMessage={t('generatingSub')}
              />
            )}
          </AnimatePresence>

          {/* 上传步骤 */}
          {step === 'upload' && (
            <div className="upload-step">
              <div className="upload-grid">
                <ImageUploader
                  label={t('referenceLabel')}
                  description={t('referenceDesc')}
                  onImageSelect={handleReferenceImageSelect}
                  currentImage={referenceImage}
                />
                <ImageUploader
                  label={t('productLabel')}
                  description={t('productDesc')}
                  onImageSelect={handleProductImageSelect}
                  currentImage={productImage}
                />
              </div>

              {referenceImage && productImage && (
                <div className="action-area">
                  <button className="action-btn primary large" onClick={handleAnalyze}>
                    <Sparkles size={20} />
                    {t('analyzeBtn')}
                  </button>
                </div>
              )}
            </div>
          )}

          {/* 融合建议查看步骤 */}
          {(step === 'review' || step === 'generating') && analysis && (
            <div className="review-step">
              <div className="preview-images">
                <div className="preview-item">
                  <img src={referenceImage} alt="Reference" />
                  <span>{t('reference')}</span>
                </div>
                <div className="preview-item">
                  <img src={productImage} alt="Product" />
                  <span>{t('product')}</span>
                </div>
              </div>
              <FusionReview
                analysis={analysis}
                onConfirm={handleGenerate}
                isGenerating={isGenerating}
              />
            </div>
          )}

          {/* 生成结果步骤 */}
          {step === 'complete' && generationResult && (
            <div className="result-step">
              <div className="result-comparison">
                <div className="comparison-images">
                  <div className="comparison-item">
                    <img src={referenceImage} alt="Reference" />
                    <span>{t('reference')}</span>
                  </div>
                  <div className="comparison-item">
                    <img src={productImage} alt="Product" />
                    <span>{t('product')}</span>
                  </div>
                </div>
              </div>
              <GenerationResult
                result={generationResult}
                onRegenerate={handleRegenerate}
                isRegenerating={isGenerating}
              />
              <div className="result-actions">
                <button className="action-btn secondary" onClick={handleBackToReview}>
                  {t('backToReview')}
                </button>
                <button className="action-btn secondary" onClick={handleReset}>
                  <RotateCcw size={18} />
                  {t('resetBtn')}
                </button>
              </div>
            </div>
          )}
        </div>
          </>
        )}
      </main>

      <footer className="footer">
        <p>{t('poweredBy')}</p>
      </footer>
    </div>
  );
}

export default App;
