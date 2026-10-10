import React, { createContext, useContext, useState, useEffect } from 'react';
import { en } from './translations/en';
import { fr } from './translations/fr';
import { Language } from '../types';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: typeof en;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>(() => {
    try {
      // « ?lang=fr|en » : langue demandée par le bouton Aide de TSA (prioritaire, non mémorisée).
      const requested = new URLSearchParams(window.location.search).get('lang');
      if (requested === 'fr' || requested === 'en') return requested;
      const saved = localStorage.getItem('tsa_lang');
      if (saved === 'fr' || saved === 'en') return saved;
      return navigator.language.startsWith('fr') ? 'fr' : 'en';
    } catch {
      return 'fr';
    }
  });

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    try {
      localStorage.setItem('tsa_lang', lang);
    } catch (e) {
      console.warn('Could not save language to localStorage', e);
    }
  };

  useEffect(() => {
    document.documentElement.lang = language;
  }, [language]);

  const t = language === 'fr' ? fr : en;

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
