import { useState, useCallback } from 'react';
import { AnimatePresence } from 'framer-motion';
import { Sparkles, ArrowRight, RotateCcw } from 'lucide-react';
import { ImageUploader } from './components/ImageUploader';
import { FusionReview } from './components/FusionReview';
import { GenerationResult } from './components/GenerationResult';
import { LoadingState } from './components/LoadingState';
import { analyzeAndSuggest, generateImage } from './services/openai';
import type { AnalysisResult, GenerationResult as GenerationResultType, WorkflowStep } from './types';
import './App.css';

function App() {
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
          <h1>AI Marketing Studio</h1>
        </div>
        <p className="tagline">智能营销素材生成工具</p>
      </header>

      <main className="main">
        {/* 步骤指示器 */}
        <div className="steps-indicator">
          <div className={`step-item ${step === 'upload' || step === 'analyzing' ? 'active' : ''} ${analysis ? 'completed' : ''}`}>
            <span className="step-number">1</span>
            <span className="step-label">上传素材</span>
          </div>
          <ArrowRight size={20} className="step-arrow" />
          <div className={`step-item ${step === 'review' || step === 'generating' ? 'active' : ''} ${generationResult ? 'completed' : ''}`}>
            <span className="step-number">2</span>
            <span className="step-label">融合建议</span>
          </div>
          <ArrowRight size={20} className="step-arrow" />
          <div className={`step-item ${step === 'complete' ? 'active completed' : ''}`}>
            <span className="step-number">3</span>
            <span className="step-label">生成结果</span>
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
                message="正在分析素材..."
                subMessage="AI 正在同时分析爆款素材和产品图，生成融合建议"
              />
            )}

            {step === 'generating' && (
              <LoadingState
                message="正在生成营销素材..."
                subMessage="AI 正在根据融合建议生成图片，请耐心等待"
              />
            )}
          </AnimatePresence>

          {/* 上传步骤 */}
          {step === 'upload' && (
            <div className="upload-step">
              <div className="upload-grid">
                <ImageUploader
                  label="爆款参考素材"
                  description="上传一张成功的营销图片作为参考"
                  onImageSelect={handleReferenceImageSelect}
                  currentImage={referenceImage}
                />
                <ImageUploader
                  label="产品图"
                  description="上传你要推广的产品图片"
                  onImageSelect={handleProductImageSelect}
                  currentImage={productImage}
                />
              </div>

              {referenceImage && productImage && (
                <div className="action-area">
                  <button className="action-btn primary large" onClick={handleAnalyze}>
                    <Sparkles size={20} />
                    分析并获取融合建议
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
                  <span>爆款参考</span>
                </div>
                <div className="preview-item">
                  <img src={productImage} alt="Product" />
                  <span>产品图</span>
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
                    <span>爆款参考</span>
                  </div>
                  <div className="comparison-item">
                    <img src={productImage} alt="Product" />
                    <span>产品图</span>
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
                  返回查看建议
                </button>
                <button className="action-btn secondary" onClick={handleReset}>
                  <RotateCcw size={18} />
                  重新开始
                </button>
              </div>
            </div>
          )}
        </div>
      </main>

      <footer className="footer">
        <p>Powered by OpenAI GPT-4o</p>
      </footer>
    </div>
  );
}

export default App;
