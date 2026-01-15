import { motion } from 'framer-motion';
import { Download, RefreshCw } from 'lucide-react';
import type { GenerationResult as GenerationResultType } from '../types';

interface GenerationResultProps {
  result: GenerationResultType;
  onRegenerate: () => void;
  isRegenerating: boolean;
}

export function GenerationResult({
  result,
  onRegenerate,
  isRegenerating,
}: GenerationResultProps) {
  const handleDownload = async () => {
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
    } catch (error) {
      console.error('Download failed:', error);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="generation-result"
    >
      <h3>生成结果</h3>

      <div className="result-image-container">
        <img src={result.imageUrl} alt="Generated" className="result-image" />
      </div>

      <div className="result-actions">
        <button
          className="action-btn primary"
          onClick={handleDownload}
        >
          <Download size={18} />
          下载图片
        </button>
        <button
          className="action-btn secondary"
          onClick={onRegenerate}
          disabled={isRegenerating}
        >
          <RefreshCw size={18} className={isRegenerating ? 'spinning' : ''} />
          重新生成
        </button>
      </div>

      <div className="prompt-info">
        <h4>生成提示词</h4>
        <p className="revised-prompt">{result.revisedPrompt}</p>
      </div>
    </motion.div>
  );
}
