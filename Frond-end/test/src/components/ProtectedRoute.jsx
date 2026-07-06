import React, { useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ShieldCheck, Mail, Lock, ArrowRight, RefreshCw } from 'lucide-react';
import { Link } from 'react-router-dom';
import Loader from './atoms/Loader';

// ─── Animated Lock Gate (shown to logged-in but unverified users) ─────────────
const VerificationGate = ({ email }) => {
    const [dots, setDots] = useState(0);

    useEffect(() => {
        const t = setInterval(() => setDots(d => (d + 1) % 4), 500);
        return () => clearInterval(t);
    }, []);

    return (
        <div className="min-h-screen bg-gray-950 flex items-center justify-center px-4 relative overflow-hidden">
            {/* Animated background */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl animate-pulse" />
                <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-indigo-600/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
                {/* Grid pattern */}
                <div className="absolute inset-0 opacity-[0.03]"
                    style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.1) 1px, transparent 1px)', backgroundSize: '40px 40px' }}
                />
            </div>

            <div className="relative z-10 max-w-md w-full text-center">
                {/* Animated Lock Icon */}
                <div className="relative mx-auto mb-8 w-28 h-28">
                    <div className="absolute inset-0 rounded-3xl bg-blue-500/20 animate-ping" style={{ animationDuration: '2s' }} />
                    <div className="relative w-28 h-28 rounded-3xl bg-gradient-to-br from-blue-600 to-indigo-700 flex items-center justify-center shadow-2xl shadow-blue-500/30">
                        <Lock size={48} className="text-white" />
                    </div>
                </div>

                {/* Heading */}
                <h1 className="text-4xl font-black text-white mb-3 tracking-tight">
                    Accès Restreint
                </h1>
                <p className="text-gray-400 text-lg font-medium mb-2">
                    Vérifiez votre email pour accéder à la boutique
                </p>

                {/* Email display */}
                <div className="inline-flex items-center gap-2 bg-white/5 border border-white/10 text-blue-400 font-bold px-5 py-2.5 rounded-2xl mb-8">
                    <Mail size={16} />
                    <span className="text-sm">{email || 'votre email'}</span>
                </div>

                {/* Status */}
                <div className="bg-white/5 border border-white/10 rounded-3xl p-6 mb-6 text-left space-y-4">
                    {[
                        { done: true, label: 'Compte créé avec succès' },
                        { done: false, label: `Email de vérification envoyé${'.'.repeat(dots)}` },
                        { done: false, label: 'En attente de votre vérification OTP' },
                    ].map(({ done, label }, i) => (
                        <div key={i} className="flex items-center gap-3">
                            <div className={`w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 ${
                                done ? 'bg-green-500' : i === 1 ? 'bg-blue-500 animate-pulse' : 'bg-gray-700'
                            }`}>
                                {done
                                    ? <ShieldCheck size={14} className="text-white" />
                                    : <span className="text-white text-[10px] font-black">{i + 1}</span>
                                }
                            </div>
                            <p className={`text-sm font-medium ${done ? 'text-green-400' : i === 1 ? 'text-blue-400' : 'text-gray-500'}`}>
                                {label}
                            </p>
                        </div>
                    ))}
                </div>

                {/* Actions */}
                <Link
                    to="/verify-otp"
                    state={{ email }}
                    className="flex items-center justify-center gap-2 w-full py-4 bg-blue-600 hover:bg-blue-700 text-white font-black rounded-2xl transition-all mb-3 shadow-xl shadow-blue-500/20 text-lg"
                >
                    <ShieldCheck size={20} />
                    Entrer mon code OTP
                    <ArrowRight size={18} />
                </Link>

                <p className="text-gray-500 text-sm">
                    Pas reçu ?{' '}
                    <Link to="/verify-otp" state={{ email, resend: true }} className="text-blue-400 font-bold hover:underline inline-flex items-center gap-1">
                        <RefreshCw size={12} /> Renvoyer le code
                    </Link>
                </p>
            </div>
        </div>
    );
};

// ─── Main ProtectedRoute ──────────────────────────────────────────────────────
const ProtectedRoute = ({ children, adminOnly = false, requireVerified = false }) => {
    const { user, loading, isAdmin } = useAuth();
    const location = useLocation();

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
                <Loader />
            </div>
        );
    }

    // Not logged in → login
    if (!user) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    // Admin-only route but not admin
    if (adminOnly && !isAdmin) {
        return <Navigate to="/" replace />;
    }

    // Email verification gate
    if (requireVerified && !user.email_verified && !isAdmin) {
        return <VerificationGate email={user.email} />;
    }

    return children;
};

export default ProtectedRoute;
