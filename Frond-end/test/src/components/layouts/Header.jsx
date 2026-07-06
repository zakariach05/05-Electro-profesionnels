import React, { useState, useEffect, useRef } from 'react';
import { ShoppingBag, Search, User, Menu, X, Moon, Sun, ChevronDown, Percent, Mail, Zap, LifeBuoy, Package, HelpCircle, RefreshCcw, Gavel } from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import md5 from 'js-md5';
import { CATEGORIES } from '../../data/categories';
import BRANDS from '../../data/brands.json';
import { useCart } from '../../context/CartContext';
import { useLanguage } from '../../context/LanguageContext';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import LanguageSelector from '../../components/molecules/LanguageSelector';

const getAvatarUrl = (user) => {
    if (user?.avatar) return user.avatar;
    if (!user?.email) {
        const name = encodeURIComponent((user?.name || 'U').replace(/\s+/g, '+'));
        return `https://ui-avatars.com/api/?name=${name}&background=E52E1E&color=fff&size=128&bold=true`;
    }
    const emailHash = md5(user.email.toLowerCase().trim());
    return `https://www.gravatar.com/avatar/${emailHash}?d=identicon&s=128`;
};

// ─── Announcement Bar Messages ───────────────────────────────────────────────
const MESSAGES = [
    { icon: '⚡', text: 'LIVRAISON GRATUITE PARTOUT AU MAROC À PARTIR DE 2000 DH', color: '#FFCB50' },
    { icon: '🎁', text: 'JUSQU\'À -35% SUR LES SMARTPHONES & PC — PROMO 2026', color: '#a78bfa' },
    { icon: '🔒', text: 'PAIEMENT SÉCURISÉ · GARANTIE OFFICIELLE · SAV PREMIUM', color: '#34d399' },
    { icon: '🚀', text: 'LIVRAISON EXPRESS 24H DISPONIBLE SUR CASABLANCA', color: '#fb923c' },
];

const AnnouncementBar = ({ isScrolled }) => {
    const [current, setCurrent] = useState(0);
    const [flipping, setFlipping] = useState(false);

    useEffect(() => {
        const interval = setInterval(() => {
            setFlipping(true);
            setTimeout(() => {
                setCurrent(prev => (prev + 1) % MESSAGES.length);
                setFlipping(false);
            }, 450);
        }, 3800);
        return () => clearInterval(interval);
    }, []);

    const msg = MESSAGES[current];

    return (
        <div
            style={{
                width: '100%',
                background: 'linear-gradient(90deg, #0a0a0f 0%, #111827 40%, #0f0f1a 100%)',
                overflow: 'hidden',
                position: 'relative',
                zIndex: 70,
                transition: 'height 0.4s cubic-bezier(0.4,0,0.2,1), opacity 0.4s ease',
                height: isScrolled ? 0 : 36,
                opacity: isScrolled ? 0 : 1,
            }}
        >
            <style>{`
                @keyframes bar3d-in {
                    0%   { opacity: 0; transform: perspective(600px) rotateX(-90deg) translateY(-8px); }
                    100% { opacity: 1; transform: perspective(600px) rotateX(0deg)   translateY(0px); }
                }
                @keyframes bar3d-out {
                    0%   { opacity: 1; transform: perspective(600px) rotateX(0deg)  translateY(0px); }
                    100% { opacity: 0; transform: perspective(600px) rotateX(90deg) translateY(8px); }
                }
                @keyframes bar-shimmer {
                    0%   { transform: translateX(-120%) skewX(-20deg); }
                    100% { transform: translateX(120%)  skewX(-20deg); }
                }
                @keyframes bar-dot-pulse {
                    0%, 100% { transform: scale(1);   opacity: 1; }
                    50%       { transform: scale(1.8); opacity: 0.5; }
                }
                @keyframes bar-particle {
                    0%   { transform: translateY(0px) scale(1);   opacity: 0.5; }
                    50%  { transform: translateY(-6px) scale(1.3); opacity: 1; }
                    100% { transform: translateY(0px) scale(1);   opacity: 0.5; }
                }
                .bar3d-enter { animation: bar3d-in  0.45s cubic-bezier(0.34,1.56,0.64,1) forwards; }
                .bar3d-exit  { animation: bar3d-out 0.45s cubic-bezier(0.4,0,0.2,1)      forwards; }
            `}</style>

            {/* Shimmer sweep */}
            <div style={{
                position: 'absolute', inset: 0, pointerEvents: 'none', overflow: 'hidden',
            }}>
                <div style={{
                    position: 'absolute', top: 0, left: 0, width: '40%', height: '100%',
                    background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.07), transparent)',
                    animation: 'bar-shimmer 3s ease-in-out infinite',
                }} />
            </div>

            {/* Floating particles */}
            {[10, 25, 50, 75, 90].map((left, i) => (
                <div key={i} style={{
                    position: 'absolute',
                    top: '50%',
                    left: `${left}%`,
                    width: 3, height: 3,
                    borderRadius: '50%',
                    background: msg.color,
                    opacity: 0.4,
                    transform: 'translateY(-50%)',
                    animation: `bar-particle ${1.8 + i * 0.4}s ease-in-out infinite`,
                    animationDelay: `${i * 0.3}s`,
                    transition: 'background 0.6s ease',
                }} />
            ))}

            {/* Content */}
            <div style={{
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                height: '100%', gap: 10, padding: '0 16px',
                transformStyle: 'preserve-3d',
            }}>
                {/* Live dot */}
                <div style={{
                    width: 7, height: 7, borderRadius: '50%',
                    background: msg.color,
                    animation: 'bar-dot-pulse 1.4s ease-in-out infinite',
                    flexShrink: 0,
                    transition: 'background 0.5s ease',
                    boxShadow: `0 0 8px ${msg.color}`,
                }} />

                {/* 3D flipping message */}
                <div
                    key={current}
                    className={flipping ? 'bar3d-exit' : 'bar3d-enter'}
                    style={{
                        display: 'flex', alignItems: 'center', gap: 8,
                        color: '#fff',
                        fontSize: 11,
                        fontWeight: 800,
                        letterSpacing: '0.14em',
                        textTransform: 'uppercase',
                        textShadow: `0 0 16px ${msg.color}55`,
                        whiteSpace: 'nowrap',
                    }}
                >
                    <span style={{ fontSize: 13 }}>{msg.icon}</span>
                    <span style={{ color: msg.color, transition: 'color 0.4s' }}>{msg.text}</span>
                </div>

                {/* Indicator dots */}
                <div style={{ display: 'flex', gap: 4, flexShrink: 0 }}>
                    {MESSAGES.map((_, i) => (
                        <div key={i} style={{
                            width: i === current ? 14 : 4,
                            height: 4,
                            borderRadius: 4,
                            background: i === current ? msg.color : 'rgba(255,255,255,0.2)',
                            transition: 'all 0.4s cubic-bezier(0.34,1.56,0.64,1)',
                            boxShadow: i === current ? `0 0 6px ${msg.color}` : 'none',
                        }} />
                    ))}
                </div>
            </div>
        </div>
    );
};

const Header = () => {

    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [activeDropdown, setActiveDropdown] = useState(null); // 'boutique' | 'marques' | null
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [logoError, setLogoError] = useState(false);

    const location = useLocation();
    const navigate = useNavigate();
    const dropdownRef = useRef(null);

    const { cartCount, setIsCartOpen } = useCart();
    const { t } = useLanguage();
    const { user, logout, isAdmin } = useAuth();
    const { theme, toggleTheme } = useTheme();

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    useEffect(() => {
        setIsMobileMenuOpen(false);
        setActiveDropdown(null);
        setIsSearchOpen(false);
    }, [location]);

    // Close dropdown on click outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setActiveDropdown(null);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleSearch = (e) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            navigate(`/shop?search=${encodeURIComponent(searchQuery)}`);
            setIsSearchOpen(false);
        }
    };

    return (
        <>
            {/* Announcement Bar - 3D Animated */}
            <AnnouncementBar isScrolled={isScrolled} />

            <header
                className={`fixed ${isScrolled ? 'top-0' : 'top-8'} left-0 w-full z-50 transition-all duration-500 ${isScrolled
                    ? 'bg-white/80 dark:bg-black/80 backdrop-blur-xl shadow-lg border-b border-gray-100 dark:border-white/10'
                    : 'bg-white dark:bg-black border-transparent'
                    }`}
            >
                <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
                    <div className="flex items-center h-24 gap-4">

                        {/* 1. Logo Left — always shrink-0 so it NEVER compresses */}
                        <div className="flex items-center shrink-0 -ml-4 sm:-ml-6 lg:-ml-8">
                            <Link to="/" className="flex items-center gap-2 group transition-transform hover:scale-105 active:scale-95">
                                {/* shrink-0 + explicit min-width ensure the image is NEVER compressed by flex siblings */}
                                <div className="relative shrink-0">
                                    {!logoError ? (
                                        <img
                                            src="/logo-nv.png"
                                            alt="Electro-05"
                                            className="h-10 md:h-14 w-auto object-contain shrink-0"
                                            style={{ minWidth: 'max-content' }}
                                            onError={() => setLogoError(true)}
                                        />
                                    ) : (
                                        <span className="text-xl font-black bg-premium-gradient bg-clip-text text-transparent whitespace-nowrap">
                                            05 ELECTRO
                                        </span>
                                    )}
                                    <div className="absolute -inset-1 bg-primary/20 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                </div>
                            </Link>
                        </div>

                        {/* 2. Navigation Links Center — grows naturally, min-w-0 prevents overflow into adjacent zones */}
                        <nav className="hidden lg:flex items-center gap-1 xl:gap-3 min-w-0 ml-4 xl:ml-8">
                            {!user && (
                                <Link
                                    to="/"
                                    className={`px-4 py-2 rounded-xl text-sm font-bold transition-all relative group ${location.pathname === '/' ? 'text-primary' : 'text-gray-700 dark:text-gray-300 hover:text-primary'}`}
                                >
                                    {t('nav.home') || 'Accueil'}
                                    <span className={`absolute bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 bg-primary rounded-full transition-all ${location.pathname === '/' ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}></span>
                                </Link>
                            )}

                            {/* Boutique Dropdown */}
                            <div className="relative group" onMouseEnter={() => setActiveDropdown('boutique')} onMouseLeave={() => setActiveDropdown(null)}>
                                <button
                                    className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-bold transition-all ${activeDropdown === 'boutique' ? 'text-primary bg-primary/5' : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-white/5 hover:text-primary'}`}
                                >
                                    {t('nav.shop') || 'Boutique'}
                                    <ChevronDown size={14} className={`transition-transform duration-300 ${activeDropdown === 'boutique' ? 'rotate-180' : ''}`} />
                                </button>

                                {/* Categories Dropdown Menu */}
                                <div className={`absolute top-full left-0 w-[600px] mt-2 bg-white dark:bg-gray-900 rounded-2xl shadow-2xl border border-gray-100 dark:border-white/10 p-6 flex transition-all duration-300 origin-top ${activeDropdown === 'boutique' ? 'opacity-100 scale-100 pointer-events-auto' : 'opacity-0 scale-95 pointer-events-none'}`}>
                                    <div className="grid grid-cols-2 w-full gap-8">
                                        <div className="space-y-4">
                                            <h4 className="text-xs font-black text-gray-400 uppercase tracking-widest border-b border-gray-100 dark:border-white/5 pb-2">Catégories Principales</h4>
                                            <div className="grid grid-cols-1 gap-2">
                                                {CATEGORIES.slice(0, 6).map((cat) => (
                                                    <Link
                                                        key={cat.id}
                                                        to={cat.path}
                                                        className="flex items-center gap-3 p-2 rounded-xl hover:bg-gray-50 dark:hover:bg-white/5 group/cat transition-all"
                                                    >
                                                        <div className="w-8 h-8 rounded-lg bg-gray-100 dark:bg-white/10 flex items-center justify-center text-gray-400 group-hover/cat:bg-primary group-hover/cat:text-white transition-all">
                                                            <cat.icon size={16} />
                                                        </div>
                                                        <span className="text-sm font-bold text-gray-700 dark:text-gray-200">{cat.name}</span>
                                                    </Link>
                                                ))}
                                            </div>
                                        </div>
                                        <div className="bg-gray-50 dark:bg-white/5 rounded-2xl p-4 flex flex-col items-center justify-center text-center">
                                            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                                                <ShoppingBag className="text-primary" size={24} />
                                            </div>
                                            <p className="font-bold text-gray-900 dark:text-white text-lg">Offres Spéciales</p>
                                            <p className="text-xs text-gray-500 mt-2 mb-4">Découvrez nos produits en promotion et profitez des meilleurs prix.</p>
                                            <Link to="/shop?on_sale=1" className="bg-gray-900 dark:bg-primary text-white text-xs font-black px-6 py-2.5 rounded-xl uppercase tracking-widest hover:scale-105 active:scale-95 transition-all">
                                                Voir tout
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Marques Dropdown */}
                            <div className="relative group" onMouseEnter={() => setActiveDropdown('marques')} onMouseLeave={() => setActiveDropdown(null)}>
                                <button
                                    className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-bold transition-all ${activeDropdown === 'marques' ? 'text-primary bg-primary/5' : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-white/5 hover:text-primary'}`}
                                >
                                    Marques
                                    <ChevronDown size={14} className={`transition-transform duration-300 ${activeDropdown === 'marques' ? 'rotate-180' : ''}`} />
                                </button>

                                {/* Brands Dropdown Menu */}
                                <div className={`absolute top-full left-0 w-[450px] mt-2 bg-white dark:bg-gray-900 rounded-2xl shadow-2xl border border-gray-100 dark:border-white/10 p-6 transition-all duration-300 origin-top ${activeDropdown === 'marques' ? 'opacity-100 scale-100 pointer-events-auto' : 'opacity-0 scale-95 pointer-events-none'}`}>
                                    <h4 className="text-xs font-black text-gray-400 uppercase tracking-widest border-b border-gray-100 dark:border-white/5 pb-2 mb-4">Partenaires Officiels</h4>
                                    <div className="grid grid-cols-3 gap-3">
                                        {BRANDS.map((brand) => (
                                            <Link
                                                key={brand.name}
                                                to={`/shop?brand=${encodeURIComponent(brand.name)}`}
                                                className="flex flex-col items-center justify-center p-3 rounded-xl hover:bg-gray-50 dark:hover:bg-white/5 border border-transparent hover:border-gray-100 dark:hover:border-white/10 transition-all font-bold text-xs"
                                            >
                                                <span className="text-gray-700 dark:text-gray-200">{brand.name}</span>
                                            </Link>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            <Link
                                to="/promotions"
                                className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-bold text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition-all group"
                            >
                                <Percent size={14} className="group-hover:animate-bounce" />
                                Promotions
                            </Link>

                            {/* Support Link - Only for connected users */}
                            {user && (
                                <Link
                                    to="/support"
                                    className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-bold transition-all ${location.pathname === '/support' ? 'text-primary bg-primary/10 shadow-sm border border-primary/20' : 'text-gray-700 dark:text-gray-300 hover:text-primary hover:bg-primary/5'}`}
                                >
                                    <LifeBuoy size={16} className={location.pathname === '/support' ? 'animate-spin' : ''} />
                                    Support
                                </Link>
                            )}

                            <Link
                                to="/contact"
                                className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${location.pathname === '/contact' ? 'text-primary bg-primary/5' : 'text-gray-700 dark:text-gray-300 hover:text-primary hover:bg-gray-50 dark:hover:bg-white/5'}`}
                            >
                                Contact
                            </Link>
                        </nav>

                        {/* 3. Right Icons — ml-auto pushes the whole zone to the far right, shrink-0 locks its size */}
                        <div className="flex items-center gap-1 md:gap-2 lg:gap-3 ml-auto shrink-0 -mr-4 sm:-mr-6 lg:-mr-8">

                            {/* Theme Toggle */}
                            <button
                                onClick={toggleTheme}
                                className="p-2.5 rounded-full text-gray-500 dark:text-sky-200 hover:bg-gray-100 dark:hover:bg-white/10 transition-all"
                                aria-label="Toggle theme"
                            >
                                {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
                            </button>

                            {/* Search */}
                            <button
                                onClick={() => setIsSearchOpen(!isSearchOpen)}
                                className={`p-2.5 rounded-full transition-all ${isSearchOpen ? 'bg-primary text-white' : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/10'}`}
                            >
                                <Search size={20} />
                            </button>

                            {/* Language Selector */}
                            <LanguageSelector />

                            {/* Cart */}
                            <button
                                onClick={() => setIsCartOpen(true)}
                                className="relative p-2.5 rounded-full text-gray-600 dark:text-gray-300 hover:bg-primary/10 hover:text-primary transition-all active:scale-90 ring-inset focus:ring-1 focus:ring-primary/20"
                            >
                                <ShoppingBag size={20} />
                                {cartCount > 0 && (
                                    <span className="absolute top-[6px] right-[6px] bg-primary text-white text-[9px] font-black w-4 h-4 rounded-full flex items-center justify-center border-2 border-white dark:border-gray-900 animate-in zoom-in duration-300">
                                        {cartCount}
                                    </span>
                                )}
                            </button>

                            {/* Account */}
                            <div className="relative group">
                                {user ? (
                                    <>
                                        <button
                                            className="hidden sm:flex items-center gap-2 p-1 pl-2.5 rounded-full bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/10 hover:border-primary/30 transition-all"
                                            onClick={() => navigate(isAdmin ? '/admin/dashboard' : '/account')}
                                        >
                                            <span className="text-xs font-bold text-gray-700 dark:text-gray-200 hidden xl:block">{user.name.split(' ')[0]}</span>
                                            <div className="w-8 h-8 rounded-full overflow-hidden bg-gray-100 dark:bg-gray-800 shadow-sm border border-gray-100 dark:border-gray-700 flex-shrink-0">
                                                <img 
                                                    src={getAvatarUrl(user)} 
                                                    alt={user.name} 
                                                    className="w-full h-full object-cover" 
                                                    onError={(e) => { e.target.onerror = null; e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name||'U')}&background=E52E1E&color=fff&size=128&bold=true`; }}
                                                />
                                            </div>
                                        </button>

                                        {/* Desktop Account Dropdown */}
                                        <div className="absolute top-full right-0 mt-2 w-64 bg-white dark:bg-gray-900 shadow-2xl rounded-2xl border border-gray-100 dark:border-white/10 p-4 transition-all duration-300 origin-top opacity-0 scale-95 pointer-events-none group-hover:opacity-100 group-hover:scale-100 group-hover:pointer-events-auto z-[60]">
                                            <div className="mb-4 pb-4 border-b border-gray-100 dark:border-white/5">
                                                <p className="text-sm font-black text-gray-900 dark:text-white uppercase truncate">{user.name}</p>
                                                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-0.5">{user.role}</p>
                                            </div>
                                            <div className="space-y-1">
                                                <Link to={isAdmin ? '/admin/dashboard' : '/account'} className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-gray-50 dark:hover:bg-white/5 text-sm font-bold text-gray-700 dark:text-gray-200 transition-all">
                                                    <User size={16} className="text-primary" />
                                                    {isAdmin ? 'Tableau de bord' : 'Mon Compte'}
                                                </Link>
                                                <Link to="/order-tracking" className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-gray-50 dark:hover:bg-white/5 text-sm font-bold text-gray-700 dark:text-gray-200 transition-all">
                                                    <Package size={16} className="text-primary" />
                                                    Suivre ma commande
                                                </Link>
                                                <Link to="/faq" className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-gray-50 dark:hover:bg-white/5 text-sm font-bold text-gray-700 dark:text-gray-200 transition-all">
                                                    <HelpCircle size={16} className="text-primary" />
                                                    FAQ
                                                </Link>
                                                <Link to="/retours" className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-gray-50 dark:hover:bg-white/5 text-sm font-bold text-gray-700 dark:text-gray-200 transition-all">
                                                    <RefreshCcw size={16} className="text-primary" />
                                                    Politique de retour
                                                </Link>
                                                <Link to="/conditions" className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-gray-50 dark:hover:bg-white/5 text-sm font-bold text-gray-700 dark:text-gray-200 transition-all">
                                                    <Gavel size={16} className="text-primary" />
                                                    Conditions générales
                                                </Link>
                                            </div>
                                            <div className="mt-4 pt-4 border-t border-gray-100 dark:border-white/5">
                                                <button onClick={async () => { await logout(); navigate('/login') }} className="w-full p-2.5 flex items-center gap-3 rounded-xl bg-red-50 dark:bg-red-500/10 text-sm font-bold text-red-500 transition-all hover:brightness-105">
                                                    <Zap size={16} />
                                                    Déconnexion
                                                </button>
                                            </div>
                                        </div>
                                    </>
                                ) : (
                                    <Link to="/login" className="p-2.5 rounded-full text-gray-600 dark:text-gray-300 hover:bg-primary/10 hover:text-primary transition-all active:scale-90">
                                        <User size={20} />
                                    </Link>
                                )}
                            </div>

                            {/* Mobile menu trigger */}
                            <button
                                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                                className="lg:hidden p-2.5 rounded-full text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/10 transition-all"
                            >
                                {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                            </button>
                        </div>
                    </div>
                </div>

                {/* Sub-Header: Expanded Search Bar */}
                <div className={`absolute top-full left-0 w-full bg-white dark:bg-gray-950 border-b border-gray-100 dark:border-white/10 shadow-2xl transition-all duration-300 origin-top ${isSearchOpen ? 'opacity-100 scale-y-100' : 'opacity-0 scale-y-0 pointer-events-none'}`}>
                    <div className="max-w-4xl mx-auto px-4 py-8">
                        <form onSubmit={handleSearch} className="relative flex items-center group">
                            <Search className="absolute left-6 text-gray-400 group-focus-within:text-primary transition-colors" size={24} />
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="Rechercher un Smartphone, PC, marque..."
                                className="w-full bg-gray-50 dark:bg-white/5 border-2 border-transparent focus:border-primary/20 rounded-3xl py-5 pl-16 pr-32 text-xl font-medium outline-none transition-all placeholder:text-gray-400 dark:text-white"
                                autoFocus={isSearchOpen}
                            />
                            <button
                                type="submit"
                                className="absolute right-3 bg-primary text-white px-8 py-3 rounded-2xl text-sm font-black uppercase tracking-widest hover:brightness-110 active:scale-95 transition-all shadow-lg shadow-primary/20"
                            >
                                Trouver
                            </button>
                        </form>
                        <div className="mt-4 flex flex-wrap gap-2 justify-center">
                            <span className="text-xs font-bold text-gray-400 uppercase tracking-widest mr-2">Populaire :</span>
                            {['iPhone 15', 'MacBook Air', 'PS5 Slim', 'RTX 4090'].map(tag => (
                                <button key={tag} onClick={() => { setSearchQuery(tag); navigate(`/shop?search=${tag}`); setIsSearchOpen(false) }} className="text-xs font-bold px-3 py-1.5 rounded-lg bg-gray-100 dark:bg-white/5 text-gray-600 dark:text-gray-400 hover:bg-primary/10 hover:text-primary transition-all">
                                    {tag}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Mobile Slide-out Menu */}
                <div className={`lg:hidden fixed inset-0 z-50 bg-black/60 backdrop-blur-sm transition-opacity duration-300 ${isMobileMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`} onClick={() => setIsMobileMenuOpen(false)}>
                    <div className={`absolute top-0 right-0 w-[85%] max-w-sm h-full bg-white dark:bg-gray-900 shadow-2xl p-6 transition-transform duration-500 ease-out ${isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'}`} onClick={e => e.stopPropagation()}>
                        <div className="flex justify-between items-center mb-10">
                            <span className="font-black text-2xl tracking-tighter text-gray-900 dark:text-white">
                                05 <span className="text-primary tracking-normal">ELECTRO</span>
                            </span>
                            <button onClick={() => setIsMobileMenuOpen(false)} className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-white/10">
                                <X size={24} />
                            </button>
                        </div>

                        <div className="space-y-6 overflow-y-auto max-h-[calc(100vh-160px)] pr-2 custom-scrollbar">
                            {!user && <Link to="/" className="block text-lg font-bold text-gray-900 dark:text-white pb-3 border-b border-gray-50 dark:border-white/5">Accueil</Link>}

                            <div className="space-y-3">
                                <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest">Nos Rayons</h3>
                                <div className="grid grid-cols-1 gap-2">
                                    {CATEGORIES.map(cat => (
                                        <Link key={cat.id} to={cat.path} className="flex items-center gap-4 p-3 rounded-2xl bg-gray-50 dark:bg-white/5 font-bold text-gray-700 dark:text-gray-200">
                                            <cat.icon size={18} className="text-primary" />
                                            {cat.name}
                                        </Link>
                                    ))}
                                </div>
                            </div>

                            <div className="space-y-3 pt-4 border-t border-gray-50 dark:border-white/5">
                                <Link to="/promotions" className="flex items-center gap-4 text-lg font-bold text-red-500">
                                    <Percent size={20} />
                                    Promotions
                                </Link>
                                {user && (
                                    <Link to="/support" className="flex items-center gap-4 text-lg font-bold text-primary">
                                        <LifeBuoy size={20} />
                                        Support Client
                                    </Link>
                                )}
                                <Link to="/contact" className="flex items-center gap-4 text-lg font-bold text-gray-900 dark:text-white">
                                    <Mail size={20} />
                                    Contact
                                </Link>
                            </div>

                            <div className="space-y-3 pt-4 border-t border-gray-50 dark:border-white/5">
                                <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-1">Espace Client</h3>
                                <Link to="/order-tracking" className="block text-sm font-bold text-gray-600 dark:text-gray-400">Suivre ma commande</Link>
                                <Link to="/faq" className="block text-sm font-bold text-gray-600 dark:text-gray-400">FAQ</Link>
                                <Link to="/retours" className="block text-sm font-bold text-gray-600 dark:text-gray-400">Politique de retour</Link>
                                <Link to="/conditions" className="block text-sm font-bold text-gray-600 dark:text-gray-400">Conditions générales</Link>
                            </div>

                            <LanguageSelector isMobile />{/* Language switcher in mobile */}

                            {user ? (
                                <div className="pt-6 mt-6 border-t border-gray-50 dark:border-white/5">
                                    <div className="flex items-center gap-4 mb-4">
                                        <div className="w-12 h-12 rounded-2xl overflow-hidden bg-gray-100 dark:bg-gray-800 shadow-sm flex-shrink-0">
                                            <img 
                                                src={getAvatarUrl(user)} 
                                                alt={user.name} 
                                                className="w-full h-full object-cover" 
                                                onError={(e) => { e.target.onerror = null; e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name||'U')}&background=E52E1E&color=fff&size=128&bold=true`; }}
                                            />
                                        </div>
                                        <div>
                                            <p className="font-black text-gray-900 dark:text-white leading-none">{user.name}</p>
                                            <p className="text-xs text-gray-500 mt-1 uppercase tracking-widest font-bold">{user.role}</p>
                                        </div>
                                    </div>
                                    <Link
                                        to={isAdmin ? '/admin/dashboard' : '/account'}
                                        className="block w-full py-4 mb-3 text-center font-black uppercase tracking-widest text-primary bg-primary/10 rounded-2xl"
                                        onClick={() => setIsMobileMenuOpen(false)}
                                    >
                                        {isAdmin ? 'Tableau de bord' : 'Mon Compte'}
                                    </Link>
                                    <button onClick={async () => { await logout(); navigate('/login') }} className="w-full py-4 text-center font-black uppercase tracking-widest text-red-500 bg-red-50 dark:bg-red-500/10 rounded-2xl">
                                        Déconnexion
                                    </button>
                                </div>
                            ) : (
                                <Link to="/login" className="block w-full py-4 mt-10 text-center font-black uppercase tracking-widest text-white bg-gray-900 dark:bg-primary rounded-2xl">
                                    Connexion / Inscription
                                </Link>
                            )}
                        </div>
                    </div>
                </div>
            </header>
        </>
    );
};

export default Header;
