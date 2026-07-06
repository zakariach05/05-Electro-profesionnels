import React, { useState, useRef, useEffect } from 'react';
import { Globe, ChevronDown } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

const FlagFR = () => <svg width="22" height="16" viewBox="0 0 3 2"><rect width="3" height="2" fill="#ED2939"/><rect width="2" height="2" fill="#fff"/><rect width="1" height="2" fill="#002395"/></svg>;
const FlagUS = () => <svg width="22" height="16" viewBox="0 0 60 30"><rect width="60" height="30" fill="#fff"/><rect y="0" width="60" height="2.3" fill="#b22234"/><rect y="4.6" width="60" height="2.3" fill="#b22234"/><rect y="9.2" width="60" height="2.3" fill="#b22234"/><rect y="13.8" width="60" height="2.3" fill="#b22234"/><rect y="18.4" width="60" height="2.3" fill="#b22234"/><rect y="23" width="60" height="2.3" fill="#b22234"/><rect width="24" height="16.1" fill="#3c3b6e"/><g fill="#fff"><circle cx="3" cy="2.3" r="1"/><circle cx="9" cy="2.3" r="1"/><circle cx="15" cy="2.3" r="1"/><circle cx="21" cy="2.3" r="1"/><circle cx="6" cy="5.75" r="1"/><circle cx="12" cy="5.75" r="1"/><circle cx="18" cy="5.75" r="1"/><circle cx="3" cy="9.2" r="1"/><circle cx="9" cy="9.2" r="1"/><circle cx="15" cy="9.2" r="1"/><circle cx="21" cy="9.2" r="1"/><circle cx="6" cy="12.65" r="1"/><circle cx="12" cy="12.65" r="1"/><circle cx="18" cy="12.65" r="1"/></g></svg>;
const FlagMA = () => <svg width="22" height="16" viewBox="0 0 900 600"><rect width="900" height="600" fill="#c1272d"/><path d="M450 190l-41 126-122-91h151l41-126 41 126h151l-122 91 41 126-122-92-122 92 41-126-122-91h151z" fill="#006233" fillRule="evenodd"/></svg>;
const FlagES = () => <svg width="22" height="16" viewBox="0 0 900 600"><rect width="900" height="600" fill="#c60b1e"/><rect y="200" width="900" height="200" fill="#ffc400"/></svg>;

const languages = [
    { code: 'fr', label: 'Français', labelLocal: 'Français', flag: <FlagFR /> },
    { code: 'en', label: 'English', labelLocal: 'English', flag: <FlagUS /> },
    { code: 'es', label: 'Español', labelLocal: 'Español', flag: <FlagES /> },
    { code: 'ar', label: 'العربية', labelLocal: 'العربية', flag: <FlagMA /> },
];

const LanguageSelector = ({ isMobile = false }) => {
    const { language, setLanguage } = useLanguage();
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const current = languages.find(l => l.code === language) || languages[0];

    if (isMobile) {
        return (
            <div className="px-4 py-3 space-y-1.5">
                <p className="text-xs font-bold uppercase tracking-widest text-gray-400 dark:text-gray-500 mb-2">
                    Langue / Language
                </p>
                {languages.map((lang) => (
                    <button
                        key={lang.code}
                        onClick={() => { setLanguage(lang.code); setIsOpen(false); }}
                        className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all ${language === lang.code ? 'bg-primary/10 text-primary' : 'text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-white/5'}`}
                    >
                        <span className="inline-flex items-center">{lang.flag}</span>
                        <span>{lang.labelLocal}</span>
                        {language === lang.code && <span className="mr-auto text-primary text-xs">✓</span>}
                    </button>
                ))}
            </div>
        );
    }

    return (
        <div className="relative" ref={dropdownRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={`flex items-center gap-1.5 p-2.5 rounded-xl hover:bg-gray-100 dark:hover:bg-white/10 text-gray-600 dark:text-gray-300 transition-all uppercase text-[10px] font-black tracking-widest ${isOpen ? 'bg-gray-100 dark:bg-white/10' : ''}`}
                aria-label="Changer la langue"
            >
                <span className="inline-flex items-center">{current.flag}</span>
                <ChevronDown size={12} className={`transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
            </button>

            {isOpen && (
                <div className="absolute top-full right-0 mt-2 w-44 bg-white dark:bg-gray-900 shadow-2xl rounded-2xl border border-gray-100 dark:border-white/10 p-2 z-[60] animate-fade-in">
                    {languages.map((lang) => (
                        <button
                            key={lang.code}
                            onClick={() => { setLanguage(lang.code); setIsOpen(false); }}
                            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold transition-all ${language === lang.code ? 'bg-primary/10 text-primary' : 'hover:bg-gray-50 dark:hover:bg-white/5 text-gray-700 dark:text-gray-200'}`}
                        >
                            <span className="inline-flex items-center">{lang.flag}</span>
                            <span>{lang.label}</span>
                            {language === lang.code && (
                                <span className="ml-auto w-1.5 h-1.5 rounded-full bg-primary" />
                            )}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
};

export default LanguageSelector;
