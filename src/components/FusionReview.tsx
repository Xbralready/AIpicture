import { useState } from 'react';
import { motion } from 'framer-motion';
import { Lock, RefreshCw, Sparkles, AlertCircle, Zap } from 'lucide-react';
import { useLocale } from '../i18n/LocaleContext';
import type { AnalysisResult } from '../types';

interface FusionReviewProps {
  analysis: AnalysisResult;
  onConfirm: (updatedPrompt: string) => void;
  isGenerating: boolean;
}

export function FusionReview({ analysis, onConfirm, isGenerating }: FusionReviewProps) {
  const { t } = useLocale();
  const { reference, product, fusion, productDescription } = analysis;

  const [prompt, setPrompt] = useState(fusion.generation_prompt);
  const [isEditingPrompt, setIsEditingPrompt] = useState(false);
  const [productDesc, setProductDesc] = useState(productDescription || '');
  const [isEditingProductDesc, setIsEditingProductDesc] = useState(false);

  const handleGenerate = () => {
    onConfirm(prompt);
  };

  // 获取视觉DNA数据
  const visualDna = fusion.visual_dna_preserved;
  const productReplacement = fusion.product_replacement;
  const subjectAdaptation = fusion.subject_adaptation;
  const keywordsAdaptation = fusion.style_keywords_adaptation;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="fusion-review"
    >
      {/* 分析结果概览 */}
      <div className="analysis-grid">
        {/* 爆款素材分析 */}
        <div className="analysis-card">
          <h3>{t('refAnalysis')}</h3>
          <div className="analysis-content">
            <div className="info-row">
              <span className="label">{t('sceneType')}</span>
              <span className="value">{reference.scene_type}</span>
            </div>
            <div className="info-row">
              <span className="label">{t('visualStyle')}</span>
              <span className="value">{reference.visual_style}</span>
            </div>
            <div className="info-row">
              <span className="label">{t('mood')}</span>
              <div className="tags">
                {reference.mood.map((m, i) => (
                  <span key={i} className="tag">{m}</span>
                ))}
              </div>
            </div>
            <div className="info-row">
              <span className="label">{t('subject')}</span>
              <span className="value">{reference.subject.gender} / {reference.subject.pose}</span>
            </div>
            <div className="info-row">
              <span className="label">{t('lighting')}</span>
              <span className="value">{reference.lighting.type} / {reference.lighting.direction}</span>
            </div>
          </div>
        </div>

        {/* 产品分析 */}
        <div className="analysis-card">
          <h3>{t('productAnalysis')}</h3>
          <div className="analysis-content">
            <div className="info-row">
              <span className="label">{t('type')}</span>
              <span className="value">{product.type}</span>
            </div>
            {product.exact_color && (
              <div className="info-row">
                <span className="label">{t('color')}</span>
                <span className="value highlight">{product.exact_color}</span>
              </div>
            )}
            {product.material && (
              <div className="info-row">
                <span className="label">{t('material')}</span>
                <span className="value highlight">{product.material}</span>
              </div>
            )}
            <div className="info-row">
              <span className="label">{t('targetGender')}</span>
              <span className="value">{product.target_gender}</span>
            </div>
          </div>
        </div>
      </div>

      {/* 产品精确描述 */}
      {productDesc && (
        <div className="product-desc-section">
          <div className="product-desc-header">
            <h3>{t('productDescSection')}</h3>
            <button
              className="edit-prompt-btn"
              onClick={() => setIsEditingProductDesc(!isEditingProductDesc)}
            >
              {isEditingProductDesc ? t('done') : t('fixDesc')}
            </button>
          </div>
          <p className="product-desc-hint">{t('productDescNote')}</p>
          {isEditingProductDesc ? (
            <textarea
              className="product-desc-editor"
              value={productDesc}
              onChange={(e) => setProductDesc(e.target.value)}
              rows={4}
            />
          ) : (
            <div className="product-desc-preview">
              {productDesc}
            </div>
          )}
        </div>
      )}

      {/* 视觉DNA - 100%保留 */}
      {visualDna && (
        <div className="visual-dna-section">
          <h3><Lock size={18} /> {t('visualDnaSection')}</h3>
          <p className="section-hint">{t('visualDnaNote')}</p>
          <div className="dna-grid">
            <div className="dna-item">
              <span className="dna-label">{t('lighting')}</span>
              <span className="dna-value">{visualDna.lighting}</span>
            </div>
            <div className="dna-item">
              <span className="dna-label">{t('dnaComposition')}</span>
              <span className="dna-value">{visualDna.composition}</span>
            </div>
            <div className="dna-item">
              <span className="dna-label">{t('dnaAtmosphere')}</span>
              <span className="dna-value">{visualDna.atmosphere}</span>
            </div>
            <div className="dna-item">
              <span className="dna-label">{t('postProcessing')}</span>
              <span className="dna-value">{visualDna.post_processing}</span>
            </div>
            <div className="dna-item">
              <span className="dna-label">{t('accessories')}</span>
              <span className="dna-value">{visualDna.accessories}</span>
            </div>
            <div className="dna-item">
              <span className="dna-label">{t('moodLabel')}</span>
              <span className="dna-value">{visualDna.mood}</span>
            </div>
          </div>
        </div>
      )}

      {/* 产品替换 + 级联影响 */}
      {productReplacement && (
        <div className="replacement-section">
          <h3><RefreshCw size={18} /> {t('productReplace')}</h3>
          <div className="replacement-comparison">
            <div className="replacement-item original">
              <span className="replacement-label">{t('originalProductLabel')}</span>
              <span className="replacement-value">{productReplacement.original_product}</span>
            </div>
            <span className="replacement-arrow">→</span>
            <div className="replacement-item new">
              <span className="replacement-label">{t('yourProduct')}</span>
              <span className="replacement-value">{productReplacement.new_product}</span>
            </div>
          </div>
          {productReplacement.cascading_effects && productReplacement.cascading_effects.length > 0 && (
            <div className="cascading-effects">
              <h4><Zap size={14} /> {t('cascadingEffectsLabel')}</h4>
              <ul>
                {productReplacement.cascading_effects.map((effect, i) => (
                  <li key={i}>{effect}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}

      {/* 主体适配 */}
      {subjectAdaptation && subjectAdaptation.original_gender !== subjectAdaptation.target_gender && (
        <div className="adaptation-section">
          <h3>{t('subjectAdapt')}</h3>
          <div className="adaptation-change">
            <span>{subjectAdaptation.original_gender}</span>
            <span className="arrow">→</span>
            <span>{subjectAdaptation.target_gender}</span>
          </div>
          {subjectAdaptation.body_adaptations && subjectAdaptation.body_adaptations.length > 0 && (
            <div className="body-adaptations">
              {subjectAdaptation.body_adaptations.map((adapt, i) => (
                <span key={i} className="adaptation-tag">{adapt}</span>
              ))}
            </div>
          )}
        </div>
      )}

      {/* 风格关键词 */}
      {keywordsAdaptation && (
        <div className="keywords-section">
          <h3>{t('styleKeywords')}</h3>
          <div className="keywords-row">
            <span className="keywords-label">{t('preserved')}</span>
            <div className="keywords-tags">
              {keywordsAdaptation.preserved_keywords?.map((kw, i) => (
                <span key={i} className="keyword-tag preserved">{kw}</span>
              ))}
            </div>
          </div>
          <div className="keywords-row">
            <span className="keywords-label">{t('adapted')}</span>
            <div className="keywords-tags">
              {keywordsAdaptation.adapted_keywords?.map((kw, i) => (
                <span key={i} className="keyword-tag adapted">{kw}</span>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 生成提示词 */}
      <div className="prompt-section">
        <div className="prompt-header">
          <h3>{t('genPrompt')}</h3>
          <button
            className="edit-prompt-btn"
            onClick={() => setIsEditingPrompt(!isEditingPrompt)}
          >
            {isEditingPrompt ? t('doneEdit') : t('editPrompt')}
          </button>
        </div>
        {isEditingPrompt ? (
          <textarea
            className="prompt-editor"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            rows={8}
          />
        ) : (
          <div className="prompt-preview">
            {prompt}
          </div>
        )}
      </div>

      {/* 注意事项 */}
      {fusion.notes && fusion.notes.length > 0 && (
        <div className="notes-section">
          <h4><AlertCircle size={16} /> {t('notes')}</h4>
          <ul>
            {fusion.notes.map((note, i) => (
              <li key={i}>{note}</li>
            ))}
          </ul>
        </div>
      )}

      {/* 生成按钮 */}
      <div className="generate-section">
        <button
          className="generate-btn"
          onClick={handleGenerate}
          disabled={isGenerating}
        >
          <Sparkles size={20} />
          {isGenerating ? t('generating') : t('generateMaterial')}
        </button>
        <p className="generate-hint">
          {t('generateNote')}
        </p>
      </div>
    </motion.div>
  );
}
