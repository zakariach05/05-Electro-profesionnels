import React, { useState, useEffect, useRef } from 'react';
import MainLayout from '../layouts/MainLayout';
import SEO from '../components/atoms/SEO';
import { useAuth } from '../context/AuthContext';
import { useNavigate, useLocation } from 'react-router-dom';
import { ShieldCheck, RefreshCw, ArrowRight, Mail } from 'lucide-react';
import toast from 'react-hot-toast';

const OTP_LENGTH = 6;
const RESEND_COOLDOWN = 60; // seconds

const OtpVerify = () => {
    const { verifyEmailOtp, sendOtpVerification } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    // email passed via router state: navigate('/verify-otp', { state: { email } })
    const email = location.state?.email || '';

    const [digits, setDigits] = useState(Array(OTP_LENGTH).fill(''));
    const [loading, setLoading] = useState(false);
    const [resending, setResending] = useState(false);
    const [cooldown, setCooldown] = useState(RESEND_COOLDOWN);
    const [error, setError] = useState('');
    const inputRefs = useRef([]);

    // Start cooldown on mount (OTP was sent during register)
    useEffect(() => {
        const timer = setInterval(() => {
            setCooldown(prev => (prev > 0 ? prev - 1 : 0));
        }, 1000);
        return () => clearInterval(timer);
    }, []);

    // Auto-focus first input
    useEffect(() => { inputRefs.current[0]?.focus(); }, []);

    // If no email, redirect to register
    useEffect(() => {
        if (!email) navigate('/register');
    }, [email, navigate]);

    // Auto-resend if coming from VerificationGate with resend flag
    useEffect(() => {
        if (location.state?.resend && email && cooldown === RESEND_COOLDOWN) {
            handleResend();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleChange = (index, value) => {
        if (!/^\d*$/.test(value)) return;
        const newDigits = [...digits];
        newDigits[index] = value.slice(-1);
        setDigits(newDigits);
        setError('');

        if (value && index < OTP_LENGTH - 1) {
            inputRefs.current[index + 1]?.focus();
        }
        // Auto-submit when all filled
        if (value && index === OTP_LENGTH - 1) {
            const code = [...newDigits.slice(0, -1), value.slice(-1)].join('');
            if (code.length === OTP_LENGTH) handleSubmit(code);
        }
    };

    const handleKeyDown = (index, e) => {
        if (e.key === 'Backspace' && !digits[index] && index > 0) {
            inputRefs.current[index - 1]?.focus();
        }
    };

    const handlePaste = (e) => {
        const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, OTP_LENGTH);
        if (pasted.length === OTP_LENGTH) {
            setDigits(pasted.split(''));
            handleSubmit(pasted);
        }
    };

    const handleSubmit = async (code) => {
        const finalCode = code || digits.join('');
        if (finalCode.length < OTP_LENGTH) {
            setError('Entrez les 6 chiffres du code');
            return;
        }
        setLoading(true);
        setError('');
        try {
            await verifyEmailOtp(email, finalCode);
            toast.success('✅ Email vérifié ! Bienvenue !');
            navigate('/');
        } catch (err) {
            setError(err.response?.data?.message || 'Code invalide ou expiré');
            setDigits(Array(OTP_LENGTH).fill(''));
            inputRefs.current[0]?.focus();
        } finally {
            setLoading(false);
        }
    };

    const handleResend = async () => {
        if (cooldown > 0 || resending) return;
        setResending(true);
        try {
            await sendOtpVerification(email);
            setCooldown(RESEND_COOLDOWN);
            setDigits(Array(OTP_LENGTH).fill(''));
            setError('');
            toast.success('Nouveau code envoyé !');
            inputRefs.current[0]?.focus();
        } catch (err) {
            toast.error(err.response?.data?.message || 'Erreur lors de l\'envoi');
        } finally {
            setResending(false);
        }
    };

    return (
        <MainLayout>
            <SEO title="Vérification OTP" description="Vérifiez votre adresse email avec le code OTP." />
            <div className="min-h-[90vh] flex items-center justify-center bg-gray-50 dark:bg-gray-900 px-4 py-16">
                <div className="max-w-md w-full">
                    {/* Card */}
                    <div className="bg-white dark:bg-gray-800/80 backdrop-blur-xl rounded-[32px] shadow-2xl border border-gray-100 dark:border-white/10 p-10">
                        {/* Icon */}
                        <div className="w-20 h-20 rounded-3xl bg-blue-500/10 flex items-center justify-center mx-auto mb-6">
                            <ShieldCheck className="text-blue-500" size={38} />
                        </div>

                        <h1 className="text-3xl font-black text-gray-900 dark:text-white text-center mb-2">
                            Vérification Email
                        </h1>
                        <p className="text-gray-500 dark:text-gray-400 text-center mb-1 font-medium">
                            Code envoyé à
                        </p>
                        <div className="flex items-center justify-center gap-2 mb-8">
                            <Mail size={16} className="text-blue-500" />
                            <span className="text-blue-500 font-bold text-sm">{email}</span>
                        </div>

                        {/* OTP Inputs */}
                        <div className="flex gap-3 justify-center mb-6" onPaste={handlePaste}>
                            {digits.map((digit, i) => (
                                <input
                                    key={i}
                                    ref={el => (inputRefs.current[i] = el)}
                                    type="text"
                                    inputMode="numeric"
                                    maxLength={1}
                                    value={digit}
                                    onChange={e => handleChange(i, e.target.value)}
                                    onKeyDown={e => handleKeyDown(i, e)}
                                    className={`
                                        w-12 h-14 text-center text-2xl font-black rounded-2xl outline-none transition-all duration-200
                                        border-2 bg-gray-50 dark:bg-gray-700/50
                                        ${digit
                                            ? 'border-blue-500 text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-500/10'
                                            : 'border-gray-200 dark:border-gray-600 text-gray-900 dark:text-white'
                                        }
                                        focus:border-blue-500 focus:bg-blue-50 dark:focus:bg-blue-500/10
                                        ${error ? 'border-red-400 animate-shake' : ''}
                                    `}
                                />
                            ))}
                        </div>

                        {/* Error */}
                        {error && (
                            <div className="bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400 p-3 rounded-xl text-sm font-bold text-center mb-4 border border-red-100 dark:border-red-500/20">
                                {error}
                            </div>
                        )}

                        {/* Submit */}
                        <button
                            onClick={() => handleSubmit()}
                            disabled={loading || digits.join('').length < OTP_LENGTH}
                            className="w-full py-4 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-black rounded-2xl transition-all flex items-center justify-center gap-2 text-lg shadow-xl shadow-blue-500/20 mb-6"
                        >
                            {loading ? (
                                <div className="w-5 h-5 border-[3px] border-white/30 border-t-white rounded-full animate-spin" />
                            ) : (
                                <><ShieldCheck size={20} /> Vérifier mon email</>
                            )}
                        </button>

                        {/* Resend */}
                        <div className="text-center">
                            <p className="text-gray-500 dark:text-gray-400 text-sm mb-2">
                                Vous n'avez pas reçu le code ?
                            </p>
                            <button
                                onClick={handleResend}
                                disabled={cooldown > 0 || resending}
                                className="text-blue-500 font-black text-sm hover:underline disabled:opacity-50 flex items-center gap-1.5 mx-auto"
                            >
                                <RefreshCw size={14} className={resending ? 'animate-spin' : ''} />
                                {cooldown > 0 ? `Renvoyer dans ${cooldown}s` : 'Renvoyer le code'}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </MainLayout>
    );
};

export default OtpVerify;
