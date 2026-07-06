import React, { useState, useEffect } from 'react';
import { Mail, Lock, X, ArrowRight, Facebook } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';

/* ────────────────────────────────────────────────────────────────
   LoginModal Component
──────────────────────────────────────────────────────────────── */
const LoginModal = ({ isOpen, onClose, onGuestContinue }) => {
    const [email,    setEmail]    = useState('');
    const [password, setPassword] = useState('');
    const [loading,  setLoading]  = useState(false);
    const [showPass, setShowPass] = useState(false);

    const { login } = useAuth();

    // Fermer le modal si l'utilisateur se connecte
    const { user } = useAuth();
    useEffect(() => {
        if (user && isOpen) onClose();
    }, [user, isOpen, onClose]);

    if (!isOpen) return null;

    // ── Email/Password Login ──────────────────────────────────────
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await login(email, password);
            toast.success('Bon retour parmi nous ! 👋');
            onClose();
        } catch (err) {
            toast.error(err.response?.data?.message || 'Identifiants incorrects.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300"
            onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
            role="dialog"
            aria-modal="true"
            aria-label="Connexion"
        >
            <div className="bg-white w-full max-w-md rounded-[40px] shadow-2xl relative overflow-hidden animate-in zoom-in-95 duration-300">

                {/* ── Close Button ──────────────────────────────── */}
                <button
                    id="login-modal-close"
                    onClick={onClose}
                    aria-label="Fermer"
                    className="absolute top-6 right-6 p-2 rounded-full hover:bg-slate-100 transition-all text-slate-400 hover:text-slate-900"
                >
                    <X size={24} />
                </button>

                <div className="p-8 md:p-10">

                    {/* ── Header ──────────────────────────────────── */}
                    <div className="mb-8">
                        <h2 className="text-3xl font-black text-slate-900 tracking-tight">
                            Connectez-vous
                        </h2>
                        <p className="text-sm text-slate-400 font-medium mt-1">
                            Accédez à votre espace Electro-05
                        </p>
                    </div>

                    {/* Divider */}
                    <div className="relative my-6">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-slate-100"></div>
                        </div>
                        <div className="relative flex justify-center text-sm">
                            <span className="px-4 bg-white text-slate-400 font-bold uppercase tracking-widest text-[10px]">
                                Ou avec email
                            </span>
                        </div>
                    </div>

                    {/* ── Email/Password Form ──────────────────── */}
                    <form onSubmit={handleSubmit} className="space-y-4 text-left">
                        {/* Email */}
                        <div className="relative">
                            <Mail
                                size={16}
                                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
                            />
                            <input
                                id="login-email"
                                type="email"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="Adresse email"
                                autoComplete="email"
                                className="w-full pl-10 pr-4 py-4 bg-white border border-slate-200 rounded-xl outline-none focus:border-[#E52E1E] focus:ring-4 focus:ring-red-50 transition-all font-medium text-slate-900 text-sm"
                            />
                        </div>

                        {/* Password */}
                        <div className="relative">
                            <Lock
                                size={16}
                                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
                            />
                            <input
                                id="login-password"
                                type={showPass ? 'text' : 'password'}
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="Mot de passe"
                                autoComplete="current-password"
                                className="w-full pl-10 pr-12 py-4 bg-white border border-slate-200 rounded-xl outline-none focus:border-[#E52E1E] focus:ring-4 focus:ring-red-50 transition-all font-medium text-slate-900 text-sm"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPass(v => !v)}
                                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 transition-colors text-xs font-semibold"
                                aria-label={showPass ? 'Masquer le mot de passe' : 'Afficher le mot de passe'}
                            >
                                {showPass ? 'Masquer' : 'Voir'}
                            </button>
                        </div>

                        {/* Remember & Forgot */}
                        <div className="flex items-center justify-between">
                            <label className="flex items-center gap-2 cursor-pointer group">
                                <input
                                    type="checkbox"
                                    id="login-remember"
                                    className="w-4 h-4 border-2 border-slate-200 rounded cursor-pointer"
                                />
                                <span className="text-xs font-bold text-slate-500 group-hover:text-slate-900 transition-colors">
                                    Resté connecté
                                </span>
                            </label>
                            <button
                                type="button"
                                id="login-forgot-password"
                                className="text-xs font-bold text-slate-500 hover:text-slate-900 transition-colors"
                            >
                                Mot de passe oublié ?
                            </button>
                        </div>

                        {/* Submit */}
                        <button
                            id="login-submit"
                            type="submit"
                            disabled={loading}
                            className="w-full bg-[#E52E1E] text-white py-4 rounded-xl font-black text-base transition-all shadow-xl shadow-red-500/10 active:scale-95 flex items-center justify-center gap-3 disabled:opacity-50 hover:bg-red-700"
                        >
                            {loading ? (
                                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                            ) : (
                                <>
                                    Connexion
                                    <ArrowRight size={18} />
                                </>
                            )}
                        </button>
                    </form>

                    {/* ── Facebook ─────────────────────────────── */}
                    <div className="mt-3">
                        <button
                            id="login-facebook"
                            type="button"
                            className="w-full flex items-center justify-center gap-3 py-3 bg-[#2D4473] text-white rounded-xl font-bold text-sm active:scale-95 transition-all shadow-md shadow-[#2D4473]/20"
                        >
                            <Facebook size={18} fill="currentColor" />
                            Connectez-vous avec Facebook
                        </button>
                    </div>

                    {/* ── Guest ────────────────────────────────── */}
                    <div className="mt-3">
                        <button
                            id="login-guest"
                            onClick={onGuestContinue}
                            type="button"
                            className="w-full py-3 bg-white border-2 border-slate-900 text-slate-900 rounded-xl font-black text-sm active:scale-95 transition-all hover:bg-slate-900 hover:text-white"
                        >
                            Continuer en tant qu'invité
                        </button>
                    </div>

                    {/* ── Register link ─────────────────────────── */}
                    <div className="mt-6 text-center pt-4 border-t border-slate-100">
                        <p className="text-sm text-slate-400">
                            Pas encore de compte ?{' '}
                            <button
                                id="login-register-link"
                                type="button"
                                className="text-[#E52E1E] font-black hover:underline"
                            >
                                Inscrivez-vous
                            </button>
                        </p>
                    </div>

                </div>{/* /p-8 */}
            </div>{/* /card */}
        </div>
    );
};

export default LoginModal;
