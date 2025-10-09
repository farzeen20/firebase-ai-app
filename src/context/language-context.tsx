'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode, useMemo } from 'react';
import en from '@/locales/en.json';
import ur from '@/locales/ur.json';

type Language = 'en' | 'ur';

interface LanguageContextType {
  language: Language;
  setLanguage: (language: Language) => void;
  translations: any;
  t: (key: string) => string;
}

const translationsData: { [key in Language]: any } = { en, ur };

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>('en');

  useEffect(() => {
    const storedLanguage = localStorage.getItem('bachat-buddy-language') as Language;
    if (storedLanguage && ['en', 'ur'].includes(storedLanguage)) {
      setLanguageState(storedLanguage);
    }
  }, []);

  const setLanguage = (lang: Language) => {
    localStorage.setItem('bachat-buddy-language', lang);
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
