import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import fr from './locales/fr.json';
import en from './locales/en.json';
import ar from './locales/ar.json';
import es from './locales/es.json';

const savedLang = localStorage.getItem('lang');

i18n
    .use(LanguageDetector)
    .use(initReactI18next)
    .init({
        resources: { fr: { translation: fr }, en: { translation: en }, ar: { translation: ar }, es: { translation: es } },
        lng: savedLang || 'fr',
        fallbackLng: 'fr',
        detection: {
            order: ['localStorage', 'navigator'],
            caches: ['localStorage'],
            lookupLocalStorage: 'lang',
        },
        interpolation: { escapeValue: false },
        returnObjects: false,
    })
    .then(() => {
        const dir = i18n.language === 'ar' ? 'rtl' : 'ltr';
        document.documentElement.dir = dir;
        document.documentElement.lang = i18n.language;
    });

i18n.on('languageChanged', (lng) => {
    localStorage.setItem('lang', lng);
    document.documentElement.dir = lng === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = lng;
});

export default i18n;
