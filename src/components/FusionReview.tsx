import { useState } from 'react';
import { motion } from 'framer-motion';
import { Lock, RefreshCw, Sparkles, AlertCircle, Zap } from 'lucide-react';
import type { AnalysisResult } from '../types';

interface FusionReviewProps {
  analysis: AnalysisResult;
  onConfirm: (updatedPrompt: string) => void;
  isGenerating: boolean;
}

export function FusionReview({ analysis, onConfirm, isGenerating }: FusionReviewProps) {
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
          <h3>爆款素材分析</h3>
          <div className="analysis-content">
            <div className="info-row">
              <span className="label">场景类型</span>
              <span className="value">{reference.scene_type}</span>
            </div>
            <div className="info-row">
              <span className="label">视觉风格</span>
              <span className="value">{reference.visual_style}</span>
            </div>
            <div className="info-row">
              <span className="label">情绪</span>
              <div className="tags">
                {reference.mood.map((m, i) => (
                  <span key={i} className="tag">{m}</span>
                ))}
              </div>
            </div>
            <div className="info-row">
              <span className="label">主体</span>
              <span className="value">{reference.subject.gender} / {reference.subject.pose}</span>
            </div>
            <div className="info-row">
              <span className="label">光线</span>
              <span className="value">{reference.lighting.type} / {reference.lighting.direction}</span>
            </div>
          </div>
        </div>

        {/* 产品分析 */}
        <div className="analysis-card">
          <h3>产品分析</h3>
          <div className="analysis-content">
            <div className="info-row">
              <span className="label">类型</span>
              <span className="value">{product.type}</span>
            </div>
            {product.exact_color && (
              <div className="info-row">
                <span className="label">颜色</span>
                <span className="value highlight">{product.exact_color}</span>
              </div>
            )}
            {product.material && (
              <div className="info-row">
                <span className="label">材质</span>
                <span className="value highlight">{product.material}</span>
              </div>
            )}
            <div className="info-row">
              <span className="label">目标性别</span>
              <span className="value">{product.target_gender}</span>
            </div>
          </div>
        </div>
      </div>

      {/* 产品精确描述 */}
      {productDesc && (
        <div className="product-desc-section">
          <div className="product-desc-header">
            <h3>产品精确描述（用于生成）</h3>
            <button
              className="edit-prompt-btn"
              onClick={() => setIsEditingProductDesc(!isEditingProductDesc)}
            >
              {isEditingProductDesc ? '完成' : '修正描述'}
            </button>
          </div>
          <p className="product-desc-hint">如果以下描述与你的产品不符，请点击修正</p>
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
          <h3><Lock size={18} /> 视觉DNA（100%保留）</h3>
          <p className="section-hint">以下元素将从爆款完全复制，确保风格一致</p>
          <div className="dna-grid">
            <div className="dna-item">
              <span className="dna-label">灯光</span>
              <span className="dna-value">{visualDna.lighting}</span>
            </div>
            <div className="dna-item">
              <span className="dna-label">构图</span>
              <span className="dna-value">{visualDna.composition}</span>
            </div>
            <div className="dna-item">
              <span className="dna-label">氛围</span>
              <span className="dna-value">{visualDna.atmosphere}</span>
            </div>
            <div className="dna-item">
              <span className="dna-label">后期</span>
              <span className="dna-value">{visualDna.post_processing}</span>
            </div>
            <div className="dna-item">
              <span className="dna-label">配饰</span>
              <span className="dna-value">{visualDna.accessories}</span>
            </div>
            <div className="dna-item">
              <span className="dna-label">情绪</span>
              <span className="dna-value">{visualDna.mood}</span>
            </div>
          </div>
        </div>
      )}

      {/* 产品替换 + 级联影响 */}
      {productReplacement && (
        <div className="replacement-section">
          <h3><RefreshCw size={18} /> 产品替换</h3>
          <div className="replacement-comparison">
            <div className="replacement-item original">
              <span className="replacement-label">原产品</span>
              <span className="replacement-value">{productReplacement.original_product}</span>
            </div>
            <span className="replacement-arrow">→</span>
            <div className="replacement-item new">
              <span className="replacement-label">你的产品</span>
              <span className="replacement-value">{productReplacement.new_product}</span>
            </div>
          </div>
          {productReplacement.cascading_effects && productReplacement.cascading_effects.length > 0 && (
            <div className="cascading-effects">
              <h4><Zap size={14} /> 级联影响</h4>
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
          <h3>主体适配</h3>
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
          <h3>风格关键词</h3>
          <div className="keywords-row">
            <span className="keywords-label">保留</span>
            <div className="keywords-tags">
              {keywordsAdaptation.preserved_keywords?.map((kw, i) => (
                <span key={i} className="keyword-tag preserved">{kw}</span>
              ))}
            </div>
          </div>
          <div className="keywords-row">
            <span className="keywords-label">适配</span>
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
          <h3>生成提示词</h3>
          <button
            className="edit-prompt-btn"
            onClick={() => setIsEditingPrompt(!isEditingPrompt)}
          >
            {isEditingPrompt ? '完成编辑' : '编辑提示词'}
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
          <h4><AlertCircle size={16} /> 注意事项</h4>
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
          {isGenerating ? '生成中...' : '生成营销素材'}
        </button>
        <p className="generate-hint">
          保留80-90%视觉DNA，智能替换产品
        </p>
      </div>
    </motion.div>
  );
}
