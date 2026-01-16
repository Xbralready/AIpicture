import { Blend, Wand2 } from 'lucide-react';
import { useLocale } from '../i18n/LocaleContext';
import type { TabType } from '../types';

interface TabSwitcherProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
}

export function TabSwitcher({ activeTab, onTabChange }: TabSwitcherProps) {
  const { t } = useLocale();

  return (
    <div className="tab-switcher">
      <button
        className={`tab-btn ${activeTab === 'fusion' ? 'active' : ''}`}
        onClick={() => onTabChange('fusion')}
      >
        <Blend size={18} />
        <span>{t('tabFusion')}</span>
      </button>
      <button
        className={`tab-btn ${activeTab === 'imageToImage' ? 'active' : ''}`}
        onClick={() => onTabChange('imageToImage')}
      >
        <Wand2 size={18} />
        <span>{t('tabImageToImage')}</span>
      </button>
    </div>
  );
}
