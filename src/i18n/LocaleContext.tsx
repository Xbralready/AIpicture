import { createContext, useContext, useMemo, type ReactNode } from 'react';
import { translations, type Locale, type TranslationKey } from './index';

type TranslateFn = (key: TranslationKey) => string;

export interface LocaleContextValue {
  locale: Locale;
  t: TranslateFn;
}

// eslint-disable-next-line react-refresh/only-export-components
export const LocaleContext = createContext<LocaleContextValue | null>(null);

function detectLocale(): Locale {
  const browserLang = navigator.language.toLowerCase();
  if (browserLang.startsWith('zh')) {
    return 'zh';
  }
  return 'en';
}

export function LocaleProvider({ children }: { children: ReactNode }) {
  const value = useMemo(() => {
    const locale = detectLocale();
    const dict = translations[locale];
    const t: TranslateFn = (key) => dict[key] || key;
    return { locale, t };
  }, []);

  return (
    <LocaleContext.Provider value={value}>
      {children}
    </LocaleContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useLocale(): LocaleContextValue {
  const context = useContext(LocaleContext);
  if (!context) {
    throw new Error('useLocale must be used within LocaleProvider');
  }
  return context;
}
