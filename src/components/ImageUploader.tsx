import { useCallback } from 'react';
import { Upload, Image as ImageIcon } from 'lucide-react';
import { motion } from 'framer-motion';
import { useLocale } from '../i18n/LocaleContext';

interface ImageUploaderProps {
  onImageSelect: (base64: string) => void;
  label: string;
  description: string;
  currentImage?: string;
  disabled?: boolean;
}

export function ImageUploader({
  onImageSelect,
  label,
  description,
  currentImage,
  disabled = false,
}: ImageUploaderProps) {
  const { t } = useLocale();

  const handleFileChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = () => {
        const base64 = reader.result as string;
        onImageSelect(base64);
      };
      reader.readAsDataURL(file);
    },
    [onImageSelect]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      const file = e.dataTransfer.files?.[0];
      if (!file || !file.type.startsWith('image/')) return;

      const reader = new FileReader();
      reader.onload = () => {
        const base64 = reader.result as string;
        onImageSelect(base64);
      };
      reader.readAsDataURL(file);
    },
    [onImageSelect]
  );

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="image-uploader"
    >
      <h3 className="uploader-label">{label}</h3>
      <p className="uploader-description">{description}</p>

      <label
        className={`upload-area ${disabled ? 'disabled' : ''} ${currentImage ? 'has-image' : ''}`}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
      >
        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          disabled={disabled}
          style={{ display: 'none' }}
        />

        {currentImage ? (
          <div className="preview-container">
            <img src={currentImage} alt="Preview" className="preview-image" />
            <div className="preview-overlay">
              <ImageIcon size={24} />
              <span>{t('changeImage')}</span>
            </div>
          </div>
        ) : (
          <div className="upload-placeholder">
            <Upload size={48} />
            <span>{t('uploadHint')}</span>
            <span className="upload-hint">{t('uploadFormat')}</span>
          </div>
        )}
      </label>
    </motion.div>
  );
}
