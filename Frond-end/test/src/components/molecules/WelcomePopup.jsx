import React, { useState, useEffect } from 'react';
import { X, CheckCircle, ArrowRight, User } from 'lucide-react';

const WelcomePopup = () => {
    const [isVisible, setIsVisible] = useState(false);
    const [shouldRender, setShouldRender] = useState(false);

    useEffect(() => {
        // Only show once per session
        const hasSeenPopup = sessionStorage.getItem('welcome_popup_seen');
        
        if (!hasSeenPopup) {
            const timer = setTimeout(() => {
                setShouldRender(true);
                // Trigger animation after render
                setTimeout(() => setIsVisible(true), 10);
                sessionStorage.setItem('welcome_popup_seen', 'true');
            }, 2000); // 2 seconds delay

            return () => clearTimeout(timer);
        }
    }, []);

    const closePopup = () => {
        setIsVisible(false);
        // Wait for animation to finish before unmounting
        setTimeout(() => setShouldRender(false), 300);
    };

    if (!shouldRender) return null;

    return (
        <div 
            className={`fixed inset-0 z-[1000] flex items-center justify-center p-4 transition-all duration-500 ${isVisible ? 'bg-slate-950/40 backdrop-blur-sm' : 'bg-transparent pointer-events-none'}`}
            onClick={closePopup}
        >
            <div 
                className={`bg-white w-full max-w-[380px] rounded-[40px] shadow-2xl relative overflow-hidden transition-all duration-500 transform ${isVisible ? 'scale-100 opacity-100 translate-y-0' : 'scale-90 opacity-0 translate-y-8'}`}
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header with Close */}
                <button 
                    onClick={closePopup}
                    className="absolute top-6 right-6 p-2 rounded-full hover:bg-slate-100 transition-all text-slate-300 hover:text-slate-900 z-10"
                >
                    <X size={20} />
                </button>

                <div className="p-8 pt-12 text-center">
                    {/* Brand Logo / Avatar */}
                    <div className="relative inline-block mb-6">
                        <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center border-4 border-white shadow-lg overflow-hidden">
                            <img 
                                src="/logo-nv.png" 
                                alt="Zisco 05" 
                                className="w-16 h-16 object-contain"
                                onError={(e) => e.target.src = 'https://ui-avatars.com/api/?name=Zisco+05&background=3b82f6&color=fff'}
                            />
                        </div>
                        <div className="absolute -right-1 -bottom-1 bg-green-500 text-white p-1.5 rounded-full border-4 border-white shadow-sm">
                            <CheckCircle size={14} fill="currentColor" />
                        </div>
                    </div>

                    {/* Content */}
                    <div className="space-y-1 mb-8">
                        <h2 className="text-2xl font-black text-slate-900 tracking-tight flex items-center justify-center gap-2">
                            Zisco 05
                        </h2>
                        <p className="text-sm font-bold text-slate-400">zisco7039@gmail.com</p>
                    </div>

                    {/* Main Button */}
                    <button
                        onClick={closePopup}
                        className="w-full bg-slate-900 text-white py-5 rounded-2xl font-black text-lg transition-all shadow-xl shadow-slate-900/20 active:scale-95 flex items-center justify-center gap-3 group relative overflow-hidden"
                    >
                        <span className="relative z-10 flex items-center gap-3">
                            Continuer sur la boutique
                            <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                        </span>
                        <div className="absolute inset-0 bg-primary translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
                    </button>

                    {/* Description text */}
                    <div className="mt-8 pt-6 border-t border-slate-100 text-left">
                        <p className="text-[11px] leading-relaxed text-slate-400 font-medium text-center">
                            En continuant, vous acceptez de recevoir nos meilleures offres High-Tech et les exclusivités <strong>Electro-05</strong> directement sur votre espace client.
                        </p>
                    </div>
                </div>

                {/* Bottom decorative bar */}
                <div className="h-2 bg-gradient-to-r from-primary via-blue-400 to-indigo-500 w-full"></div>
            </div>
        </div>
    );
};

export default WelcomePopup;
