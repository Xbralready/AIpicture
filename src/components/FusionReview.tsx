import { useState } from 'react';
import { motion } from 'framer-motion';
import { Lock, Camera, Sparkles, AlertCircle } from 'lucide-react';
import { useLocale } from '../i18n/LocaleContext';
import type { AnalysisResult } from '../types';

interface FusionReviewProps {
  analysis: AnalysisResult;
  onConfirm: (updatedPrompt: string) => void;
  isGenerating: boolean;
}

export function FusionReview({ analysis, onConfirm, isGenerating }: FusionReviewProps) {
  const { t, locale } = useLocale();
  const { fusion, productDescription, referenceStyle } = analysis;

  const [prompt, setPrompt] = useState(fusion.generation_prompt);
  const [isEditingPrompt, setIsEditingPrompt] = useState(false);

  const handleGenerate = () => {
    onConfirm(prompt);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="fusion-review"
    >
      {/* 核心说明 */}
      <div className="fusion-explanation">
        <h3>
          {locale === 'zh' ? '爆款融合原理' : 'Style Fusion Principle'}
        </h3>
        <p>
          {locale === 'zh'
            ? '用爆款图的「拍法」，重新拍你的产品。参考图只提供摄影风格，产品属性完全来自你的产品图。'
            : 'Apply the "shooting style" from the reference to re-shoot your product. Reference provides only photography style, product attributes come entirely from your product image.'}
        </p>
      </div>

      {/* 产品描述 - 不可变 */}
      {productDescription && (
        <div className="constraint-section product-constraint">
          <div className="constraint-header">
            <Lock size={18} />
            <h3>
              {locale === 'zh' ? '产品约束（不可变）' : 'Product Constraints (Immutable)'}
            </h3>
          </div>
          <p className="constraint-hint">
            {locale === 'zh'
              ? '以下产品描述将被严格遵守，生成图片必须准确还原产品的所有属性'
              : 'The following product description must be strictly followed. Generated images must accurately represent all product attributes.'}
          </p>
          <div className="constraint-content">
            {productDescription}
          </div>
        </div>
      )}

      {/* 参考图风格 - 仅视觉表达 */}
      {referenceStyle && (
        <div className="constraint-section style-reference">
          <div className="constraint-header">
            <Camera size={18} />
            <h3>
              {locale === 'zh' ? '风格参考（仅视觉表达）' : 'Style Reference (Visual Expression Only)'}
            </h3>
          </div>
          <p className="constraint-hint">
            {locale === 'zh'
              ? '从参考图提取的摄影风格：光影、构图、背景、氛围（不包含任何产品信息）'
              : 'Photography style extracted from reference: lighting, composition, background, mood (no product information included)'}
          </p>
          <div className="constraint-content">
            {referenceStyle}
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
        <p className="prompt-hint">
          {locale === 'zh'
            ? '最终生成提示词，结构化确保产品准确性优先于风格'
            : 'Final generation prompt, structured to ensure product accuracy takes priority over style'}
        </p>
        {isEditingPrompt ? (
          <textarea
            className="prompt-editor"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            rows={12}
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
          {locale === 'zh'
            ? '只学爆款的拍法，不学爆款的货'
            : 'Learn only the shooting style, not the product'}
        </p>
      </div>
    </motion.div>
  );
}
