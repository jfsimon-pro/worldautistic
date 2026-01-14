'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

// Import translations
import ptTranslations from '../locales/pt.json';
import enTranslations from '../locales/en.json';
import esTranslations from '../locales/es.json';

type Language = 'pt' | 'en' | 'es';

type TranslationValue = string | { [key: string]: TranslationValue };
type Translations = { [key: string]: TranslationValue };

const translations: { [key in Language]: Translations } = {
    pt: ptTranslations,
    en: enTranslations,
    es: esTranslations,
};

interface LanguageContextType {
    language: Language;
    setLanguage: (lang: Language) => void;
    t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const STORAGE_KEY = 'world-autistic-language';

export function LanguageProvider({ children }: { children: React.ReactNode }) {
    const [language, setLanguageState] = useState<Language>('pt');
    const [mounted, setMounted] = useState(false);

    // Load language from localStorage on mount
    useEffect(() => {
        const savedLanguage = localStorage.getItem(STORAGE_KEY) as Language | null;
        if (savedLanguage && ['pt', 'en', 'es'].includes(savedLanguage)) {
            setLanguageState(savedLanguage);
        }
        setMounted(true);
    }, []);

    // Save language to localStorage when it changes
    const setLanguage = useCallback((lang: Language) => {
        setLanguageState(lang);
        localStorage.setItem(STORAGE_KEY, lang);
    }, []);

    // Translation function with dot notation support
    const t = useCallback((key: string): string => {
        const keys = key.split('.');
        let value: TranslationValue = translations[language];

        for (const k of keys) {
            if (typeof value === 'object' && value !== null && k in value) {
                value = value[k];
            } else {
                // Return the key if translation not found
                console.warn(`Translation not found for key: ${key}`);
                return key;
            }
        }

        return typeof value === 'string' ? value : key;
    }, [language]);

    // Prevent hydration mismatch by rendering null until mounted
    if (!mounted) {
        return null;
    }

    return (
        <LanguageContext.Provider value={{ language, setLanguage, t }}>
            {children}
        </LanguageContext.Provider>
    );
}

export function useLanguage() {
    const context = useContext(LanguageContext);
    if (context === undefined) {
        throw new Error('useLanguage must be used within a LanguageProvider');
    }
    return context;
}

// Alias for convenience
export function useTranslation() {
    const { t, language } = useLanguage();
    return { t, language };
}
