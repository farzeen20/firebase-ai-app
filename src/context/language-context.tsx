'use client';

import React, { createContext, useContext, useState, ReactNode, useMemo } from 'react';
import en from '@/locales/en.json';

type Language = 'en';

interface LanguageContextType {
  language: Language;
  setLanguage: (language: Language) => void;
  translations: any;
  t: (key: string) => string;
}

const translationsData: { [key in Language]: any } = { en };

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>('en');

  const setLanguage = (lang: Language) => {
    // No need to set in localStorage if only English is supported
    setLanguageState(lang);
  };
  
  const translations = useMemo(() => translationsData[language], [language]);

  const t = (key: string): string => {
    const keys = key.split('.');
    let result = translations;
    for (const k of keys) {
      result = result?.[k];
    }
    return typeof result === 'string' ? result : key;
  };


  const value = {
    language,
    setLanguage,
    translations,
    t,
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
