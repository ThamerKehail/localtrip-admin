import { createContext, useContext, useState, useEffect } from 'react';
import translations from '../utils/translations';

const LanguageContext = createContext(null);

export function LanguageProvider({ children }) {
  const [lang, setLang] = useState(() => localStorage.getItem('admin_lang') || 'en');
  const isRTL = lang === 'ar';

  useEffect(() => {
    document.documentElement.dir = isRTL ? 'rtl' : 'ltr';
    document.documentElement.lang = lang;
    // Switch font family on body
    document.body.style.fontFamily = isRTL
      ? "'Almarai', sans-serif"
      : "'Inter', sans-serif";
    localStorage.setItem('admin_lang', lang);
  }, [lang, isRTL]);

  const toggle = () => setLang((l) => (l === 'en' ? 'ar' : 'en'));
  const t = (key) => translations[lang][key] ?? translations['en'][key] ?? key;

  return (
    <LanguageContext.Provider value={{ lang, isRTL, toggle, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export const useLang = () => useContext(LanguageContext);
