import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Wand2, Download, RefreshCw, RotateCcw } from 'lucide-react';
import { ImageUploader } from './ImageUploader';
import { LoadingState } from './LoadingState';
import { useLocale } from '../i18n/LocaleContext';
import { generateFromProductWithPrompt } from '../services/openai';
import type { GenerationResult, ImageToImageStep } from '../types';

export function ImageToImage() {
  const { t } = useLocale();
  const [step, setStep] = useState<ImageToImageStep>('upload');
  const [productImage, setProductImage] = useState<string>('');
  const [prompt, setPrompt] = useState<string>('');
  const [result, setResult] = useState<GenerationResult | null>(null);
  const [error, setError] = useState<string>('');
  const [isGenerating, setIsGenerating] = useState(false);

  const handleImageSelect = useCallback((base64: string) => {
    setProductImage(base64);
    setError('');
  }, []);

  const handleGenerate = useCallback(async () => {
    if (!productImage || !prompt.trim()) return;

    setIsGenerating(true);
    setStep('generating');
    setError('');

    try {
      const generatedResult = await generateFromProductWithPrompt(productImage, prompt);
      setResult(generatedResult);
      setStep('complete');
    } catch (err) {
      setError(err instanceof Error ? err.message : '生成失败，请重试');
      setStep('upload');
    } finally {
      setIsGenerating(false);
    }
  }, [productImage, prompt]);

  const handleRegenerate = useCallback(async () => {
    if (!productImage || !prompt.trim()) return;

    setIsGenerating(true);
    setError('');

    try {
      const generatedResult = await generateFromProductWithPrompt(productImage, prompt);
      setResult(generatedResult);
    } catch (err) {
      setError(err instanceof Error ? err.message : '重新生成失败，请重试');
    } finally {
      setIsGenerating(false);
    }
  }, [productImage, prompt]);

  const handleReset = useCallback(() => {
    setStep('upload');
    setProductImage('');
    setPrompt('');
    setResult(null);
    setError('');
  }, []);

  const handleDownload = async () => {
    if (!result) return;
    try {
      const response = await fetch(result.imageUrl);
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `generated-${Date.now()}.png`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Download failed:', err);
    }
  };

  return (
    <div className="image-to-image">
      {error && (
        <div className="error-message">
          <pre style={{ whiteSpace: 'pre-wrap', margin: 0 }}>{error}</pre>
        </div>
      )}

      <AnimatePresence mode="wait">
        {step === 'generating' && (
          <LoadingState
            message={t('i2iGeneratingTitle')}
            subMessage={t('i2iGeneratingSub')}
          />
        )}
      </AnimatePresence>

      {step === 'upload' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="i2i-upload-step"
        >
          <div className="i2i-content">
            <div className="i2i-image-section">
              <ImageUploader
                label={t('productLabel')}
                description={t('productDesc')}
                onImageSelect={handleImageSelect}
                currentImage={productImage}
              />
            </div>

            <div className="i2i-prompt-section">
              <h3 className="prompt-label">{t('i2iPromptLabel')}</h3>
              <p className="prompt-description">
                {t('i2iPromptDesc')}
              </p>
              <textarea
                className="prompt-input"
                placeholder={t('i2iPromptPlaceholder')}
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                rows={6}
              />
            </div>
          </div>

          {productImage && prompt.trim() && (
            <div className="action-area">
              <button className="action-btn primary large" onClick={handleGenerate}>
                <Wand2 size={20} />
                {t('generateBtn')}
              </button>
            </div>
          )}
        </motion.div>
      )}

      {step === 'complete' && result && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="i2i-result-step"
        >
          <div className="i2i-result-layout">
            <div className="i2i-source">
              <div className="source-item">
                <img src={productImage} alt="Product" />
                <span>{t('product')}</span>
              </div>
            </div>

            <div className="i2i-generated">
              <h3>{t('resultTitle')}</h3>
              <div className="result-image-container">
                <img src={result.imageUrl} alt="Generated" className="result-image" />
              </div>
              <div className="result-actions">
                <button className="action-btn primary" onClick={handleDownload}>
                  <Download size={18} />
                  {t('downloadBtn')}
                </button>
                <button
                  className="action-btn secondary"
                  onClick={handleRegenerate}
                  disabled={isGenerating}
                >
                  <RefreshCw size={18} className={isGenerating ? 'spinning' : ''} />
                  {t('regenerateBtn')}
                </button>
              </div>
            </div>
          </div>

          <div className="prompt-info">
            <h4>{t('promptUsedAlt')}</h4>
            <p className="revised-prompt">{result.revisedPrompt}</p>
          </div>

          <div className="action-area">
            <button className="action-btn secondary" onClick={handleReset}>
              <RotateCcw size={18} />
              {t('resetBtn')}
            </button>
          </div>
        </motion.div>
      )}
    </div>
  );
}
