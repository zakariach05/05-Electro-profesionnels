import React, { useState, useRef } from 'react';
import MainLayout from '../layouts/MainLayout';
import SEO from '../components/atoms/SEO';
import { useAuth } from '../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, ArrowRight, KeyRound, ShieldCheck, Eye, EyeOff } from 'lucide-react';
import toast from 'react-hot-toast';

const STEPS = { EMAIL: 1, OTP: 2, NEW_PASSWORD: 3, SUCCESS: 4 };
const OTP_LENGTH = 6;

const ForgotPassword = () => {
    const { sendPasswordReset, resetPassword } = useAuth();
    const navigate = useNavigate();

    const [step, setStep]         = useState(STEPS.EMAIL);
    const [email, setEmail]       = useState('');
    const [digits, setDigits]     = useState(Array(OTP_LENGTH).fill(''));
    const [password, setPassword] = useState('');
    const [confirm, setConfirm]   = useState('');
    const [showPw, setShowPw]     = useState(false);
    const [loading, setLoading]   = useState(false);
    const [error, setError]       = useState('');
    const [cooldown, setCooldown] = useState(0);
    const inputRefs = useRef([]);

    // ── Step 1: Send OTP ──────────────────────────────────────────────────────
    const handleSendOtp = async (e) => {
        e.preventDefault();
        setLoading(true); setError('');
        try {
            await sendPasswordReset(email);
            setStep(STEPS.OTP);
            setCooldown(60);
            const timer = setInterval(() => setCooldown(p => p > 0 ? p - 1 : 0), 1000);
            setTimeout(() => clearInterval(timer), 61000);
            toast.success('Code OTP envoyé !');
            setTimeout(() => inputRefs.current[0]?.focus(), 300);
        } catch (err) {
            setError(err.response?.data?.message || 'Aucun compte trouvé avec cet email');
        } finally { setLoading(false); }
    };

    // ── OTP digit handlers ────────────────────────────────────────────────────
    const handleDigitChange = (i, val) => {
        if (!/^\d*$/.test(val)) return;
        const next = [...digits]; next[i] = val.slice(-1); setDigits(next);
        if (val && i < OTP_LENGTH - 1) inputRefs.current[i + 1]?.focus();
        if (val && i === OTP_LENGTH - 1 && next.join('').length === OTP_LENGTH) handleVerifyOtp(next.join(''));
    };
    const handleKeyDown = (i, e) => {
        if (e.key === 'Backspace' && !digits[i] && i > 0) inputRefs.current[i - 1]?.focus();
    };
    const handlePaste = (e) => {
        const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, OTP_LENGTH);
        if (pasted.length === OTP_LENGTH) { setDigits(pasted.split('')); handleVerifyOtp(pasted); }
    };

    // ── Step 2: Verify OTP ────────────────────────────────────────────────────
    const handleVerifyOtp = async (code) => {
        const finalCode = code || digits.join('');
        if (finalCode.length < OTP_LENGTH) { setError('Entrez les 6 chiffres'); return; }
        // Just validate the code format and move to step 3
        // Actual verification happens with password reset
        setStep(STEPS.NEW_PASSWORD);
        setError('');
    };

    // ── Step 3: Reset password ────────────────────────────────────────────────
    const handleReset = async (e) => {
        e.preventDefault();
        if (password !== confirm) { setError('Les mots de passe ne correspondent pas'); return; }
        if (password.length < 8) { setError('Minimum 8 caractères'); return; }
        setLoading(true); setError('');
        try {
            await resetPassword(email, digits.join(''), password, confirm);
            setStep(STEPS.SUCCESS);
            toast.success('Mot de passe réinitialisé !');
        } catch (err) {
            setError(err.response?.data?.message || 'Code invalide ou expiré');
            setStep(STEPS.OTP);
            setDigits(Array(OTP_LENGTH).fill(''));
        } finally { setLoading(false); }
    };

    const pwStrength = () => {
        let s = 0;
        if (password.length >= 8) s++;
        if (/[A-Z]/.test(password)) s++;
        if (/[0-9]/.test(password)) s++;
        if (/[^A-Za-z0-9]/.test(password)) s++;
        return s;
    };
    const strengthLabels = ['', 'Faible', 'Moyen', 'Bien', 'Fort'];
    const strengthColors = ['', 'bg-red-400', 'bg-yellow-400', 'bg-blue-400', 'bg-green-400'];

    return (
        <MainLayout>
            <SEO title="Mot de passe oublié" description="Réinitialisez votre mot de passe via code OTP." />
            <div className="min-h-[90vh] flex items-center justify-center bg-gray-50 dark:bg-gray-900 px-4 py-16">
                <div className="max-w-md w-full">
                    {/* Step indicator */}
                    <div className="flex items-center justify-center gap-2 mb-8">
                        {[1, 2, 3].map(s => (
                            <div key={s} className="flex items-center gap-2">
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-black transition-all ${
                                    step >= s
                                        ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/30'
                                        : 'bg-gray-200 dark:bg-gray-700 text-gray-400'
                                }`}>{s}</div>
                                {s < 3 && <div className={`w-12 h-1 rounded-full transition-all ${step > s ? 'bg-blue-600' : 'bg-gray-200 dark:bg-gray-700'}`} />}
                            </div>
                        ))}
                    </div>

                    <div className="bg-white dark:bg-gray-800/80 backdrop-blur-xl rounded-[32px] shadow-2xl border border-gray-100 dark:border-white/10 p-10">
                        {/* ── STEP 1: Email ─────────────────────────────── */}
                        {step === STEPS.EMAIL && (
                            <>
                                <div className="w-16 h-16 rounded-2xl bg-blue-500/10 flex items-center justify-center mx-auto mb-6">
                                    <Mail className="text-blue-500" size={30} />
                                </div>
                                <h1 className="text-2xl font-black text-gray-900 dark:text-white text-center mb-2">Mot de passe oublié ?</h1>
                                <p className="text-gray-500 dark:text-gray-400 text-center text-sm mb-8">
                                    Entrez votre email pour recevoir un code de réinitialisation.
                                </p>
                                <form onSubmit={handleSendOtp} className="space-y-4">
                                    {error && <p className="text-red-500 text-sm font-bold bg-red-50 dark:bg-red-500/10 p-3 rounded-xl">{error}</p>}
                                    <div className="relative">
                                        <Mail size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                                        <input
                                            type="email" required value={email} onChange={e => setEmail(e.target.value)}
                                            placeholder="votre@email.com"
                                            className="w-full pl-11 pr-4 py-4 bg-gray-50 dark:bg-gray-700/50 border-2 border-transparent focus:border-blue-500 rounded-2xl outline-none transition-all font-medium dark:text-white"
                                        />
                                    </div>
                                    <button type="submit" disabled={loading}
                                        className="w-full py-4 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-black rounded-2xl transition-all flex items-center justify-center gap-2 shadow-xl shadow-blue-500/20">
                                        {loading ? <div className="w-5 h-5 border-[3px] border-white/30 border-t-white rounded-full animate-spin" /> : <>Envoyer le code <ArrowRight size={18} /></>}
                                    </button>
                                </form>
                            </>
                        )}

                        {/* ── STEP 2: OTP ────────────────────────────────── */}
                        {step === STEPS.OTP && (
                            <>
                                <div className="w-16 h-16 rounded-2xl bg-blue-500/10 flex items-center justify-center mx-auto mb-6">
                                    <KeyRound className="text-blue-500" size={30} />
                                </div>
                                <h1 className="text-2xl font-black text-gray-900 dark:text-white text-center mb-2">Code de vérification</h1>
                                <p className="text-gray-500 dark:text-gray-400 text-center text-sm mb-8">Code envoyé à <span className="text-blue-500 font-bold">{email}</span></p>

                                {error && <p className="text-red-500 text-sm font-bold bg-red-50 dark:bg-red-500/10 p-3 rounded-xl mb-4">{error}</p>}

                                <div className="flex gap-3 justify-center mb-6" onPaste={handlePaste}>
                                    {digits.map((d, i) => (
                                        <input key={i} ref={el => (inputRefs.current[i] = el)}
                                            type="text" inputMode="numeric" maxLength={1} value={d}
                                            onChange={e => handleDigitChange(i, e.target.value)}
                                            onKeyDown={e => handleKeyDown(i, e)}
                                            className={`w-11 h-13 text-center text-xl font-black rounded-xl border-2 outline-none transition-all bg-gray-50 dark:bg-gray-700/50 dark:text-white ${d ? 'border-blue-500 bg-blue-50 dark:bg-blue-500/10' : 'border-gray-200 dark:border-gray-600'} focus:border-blue-500`}
                                        />
                                    ))}
                                </div>

                                <button onClick={() => handleVerifyOtp()} disabled={digits.join('').length < OTP_LENGTH}
                                    className="w-full py-4 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-black rounded-2xl transition-all flex items-center justify-center gap-2 shadow-xl shadow-blue-500/20 mb-4">
                                    Vérifier le code <ArrowRight size={18} />
                                </button>

                                <button onClick={() => { setDigits(Array(OTP_LENGTH).fill('')); handleSendOtp({ preventDefault: () => {} }); }}
                                    disabled={cooldown > 0}
                                    className="w-full text-center text-blue-500 text-sm font-bold disabled:opacity-50">
                                    {cooldown > 0 ? `Renvoyer dans ${cooldown}s` : 'Renvoyer le code'}
                                </button>
                            </>
                        )}

                        {/* ── STEP 3: New Password ─────────────────────── */}
                        {step === STEPS.NEW_PASSWORD && (
                            <>
                                <div className="w-16 h-16 rounded-2xl bg-green-500/10 flex items-center justify-center mx-auto mb-6">
                                    <Lock className="text-green-500" size={30} />
                                </div>
                                <h1 className="text-2xl font-black text-gray-900 dark:text-white text-center mb-2">Nouveau mot de passe</h1>
                                <p className="text-gray-500 dark:text-gray-400 text-center text-sm mb-8">Choisissez un mot de passe sécurisé.</p>

                                <form onSubmit={handleReset} className="space-y-4">
                                    {error && <p className="text-red-500 text-sm font-bold bg-red-50 dark:bg-red-500/10 p-3 rounded-xl">{error}</p>}

                                    <div className="relative">
                                        <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                                        <input type={showPw ? 'text' : 'password'} required minLength={8}
                                            value={password} onChange={e => setPassword(e.target.value)}
                                            placeholder="Nouveau mot de passe"
                                            className="w-full pl-11 pr-12 py-4 bg-gray-50 dark:bg-gray-700/50 border-2 border-transparent focus:border-blue-500 rounded-2xl outline-none transition-all font-medium dark:text-white"
                                        />
                                        <button type="button" onClick={() => setShowPw(v => !v)} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400">
                                            {showPw ? <EyeOff size={18} /> : <Eye size={18} />}
                                        </button>
                                    </div>

                                    {/* Password strength */}
                                    {password && (
                                        <div className="space-y-1">
                                            <div className="flex gap-1">
                                                {[1, 2, 3, 4].map(i => (
                                                    <div key={i} className={`h-1 flex-1 rounded-full transition-all ${i <= pwStrength() ? strengthColors[pwStrength()] : 'bg-gray-200 dark:bg-gray-700'}`} />
                                                ))}
                                            </div>
                                            <p className="text-xs text-gray-500 text-right">{strengthLabels[pwStrength()]}</p>
                                        </div>
                                    )}

                                    <div className="relative">
                                        <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                                        <input type="password" required value={confirm} onChange={e => setConfirm(e.target.value)}
                                            placeholder="Confirmer le mot de passe"
                                            className="w-full pl-11 pr-4 py-4 bg-gray-50 dark:bg-gray-700/50 border-2 border-transparent focus:border-blue-500 rounded-2xl outline-none transition-all font-medium dark:text-white"
                                        />
                                    </div>

                                    <button type="submit" disabled={loading}
                                        className="w-full py-4 bg-green-600 hover:bg-green-700 disabled:opacity-50 text-white font-black rounded-2xl transition-all flex items-center justify-center gap-2 shadow-xl shadow-green-500/20">
                                        {loading ? <div className="w-5 h-5 border-[3px] border-white/30 border-t-white rounded-full animate-spin" /> : <>Réinitialiser <ShieldCheck size={18} /></>}
                                    </button>
                                </form>
                            </>
                        )}

                        {/* ── STEP 4: Success ──────────────────────────── */}
                        {step === STEPS.SUCCESS && (
                            <div className="text-center py-4">
                                <div className="w-20 h-20 rounded-full bg-green-500/10 flex items-center justify-center mx-auto mb-6">
                                    <ShieldCheck className="text-green-500" size={40} />
                                </div>
                                <h1 className="text-2xl font-black text-gray-900 dark:text-white mb-3">Mot de passe réinitialisé !</h1>
                                <p className="text-gray-500 dark:text-gray-400 mb-8 text-sm">Vous pouvez maintenant vous connecter avec votre nouveau mot de passe.</p>
                                <Link to="/login" className="inline-flex items-center gap-2 py-4 px-8 bg-blue-600 hover:bg-blue-700 text-white font-black rounded-2xl transition-all shadow-xl shadow-blue-500/20">
                                    Se connecter <ArrowRight size={18} />
                                </Link>
                            </div>
                        )}

                        {step !== STEPS.SUCCESS && (
                            <div className="text-center mt-6">
                                <Link to="/login" className="text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 text-sm font-medium transition-colors">
                                    ← Retour à la connexion
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </MainLayout>
    );
};

export default ForgotPassword;
