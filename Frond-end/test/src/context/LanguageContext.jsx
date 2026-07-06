import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import i18n from '../i18n';

const LanguageContext = createContext();

export const LanguageProvider = ({ children }) => {
    const [language, setLanguageState] = useState(i18n.language);
    const { t: i18nT } = useTranslation();

    useEffect(() => {
        const handleLanguageChanged = (lng) => {
            setLanguageState(lng);
        };
        i18n.on('languageChanged', handleLanguageChanged);
        return () => i18n.off('languageChanged', handleLanguageChanged);
    }, []);

    const setLanguage = useCallback((lng) => {
        i18n.changeLanguage(lng);
    }, []);

    const t = useCallback((key, options) => {
        return i18nT(key, options);
    }, [i18nT]);

    return (
        <LanguageContext.Provider value={{ language, setLanguage, t }}>
            {children}
        </LanguageContext.Provider>
    );
};

export const useLanguage = () => useContext(LanguageContext);
