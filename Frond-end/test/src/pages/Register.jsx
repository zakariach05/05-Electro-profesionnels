import React, { useState } from 'react';
import MainLayout from '../layouts/MainLayout';
import { useAuth } from '../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, User, ArrowRight, UserPlus, Eye, EyeOff, Phone } from 'lucide-react';
import SEO from '../components/atoms/SEO';
import toast from 'react-hot-toast';

const Register = () => {
    const [formData, setFormData] = useState({
        name: '', email: '', phone: '', password: '', password_confirmation: ''
    });
    const [showPw, setShowPw]   = useState(false);
    const [error, setError]     = useState('');
    const [loading, setLoading] = useState(false);

    const { register } = useAuth();
    const navigate = useNavigate();

    const handleChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });

    const pwStrength = () => {
        let s = 0;
        if (formData.password.length >= 8) s++;
        if (/[A-Z]/.test(formData.password)) s++;
        if (/[0-9]/.test(formData.password)) s++;
        if (/[^A-Za-z0-9]/.test(formData.password)) s++;
        return s;
    };
    const strengthLabels = ['', 'Faible', 'Moyen', 'Bien', 'Fort'];
    const strengthColors = ['', 'bg-red-400', 'bg-yellow-400', 'bg-blue-400', 'bg-green-400'];

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (formData.password !== formData.password_confirmation) {
            setError('Les mots de passe ne correspondent pas');
            return;
        }
        if (formData.password.length < 8) {
            setError('Le mot de passe doit contenir au moins 8 caractères');
            return;
        }

        setLoading(true);
        try {
            const data = await register(formData);
            toast.success('Compte créé ! Vérifiez votre email.');
            // Redirect to OTP verification
            navigate('/verify-otp', { state: { email: formData.email } });
        } catch (err) {
            const msg = err.response?.data?.message
                || err.response?.data?.errors?.email?.[0]
                || 'Une erreur est survenue';
            setError(msg);
        } finally {
            setLoading(false);
        }
    };

    return (
        <MainLayout>
            <SEO
                title="Inscription"
                description="Créez votre compte Electro-05 et accédez à tous nos produits électroniques professionnels."
            />
            <div className="min-h-[90vh] flex items-center justify-center bg-gray-50 dark:bg-gray-900 py-16 px-4">
                <div className="max-w-md w-full">
                    <div className="bg-white dark:bg-gray-800/80 backdrop-blur-xl rounded-[32px] shadow-2xl border border-gray-100 dark:border-white/10 p-10">
                        {/* Header */}
                        <div className="text-center mb-8">
                            <div className="w-20 h-20 bg-blue-500/10 rounded-3xl flex items-center justify-center mx-auto mb-5">
                                <UserPlus size={36} className="text-blue-500" />
                            </div>
                            <h1 className="text-3xl font-black text-gray-900 dark:text-white tracking-tight">Bienvenue !</h1>
                            <p className="mt-2 text-gray-500 dark:text-gray-400 font-medium">Rejoignez la communauté Electro-05</p>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            {error && (
                                <div className="bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400 p-4 rounded-2xl text-sm font-bold flex items-center gap-2 border border-red-100 dark:border-red-500/20">
                                    <div className="w-1.5 h-1.5 bg-red-600 dark:bg-red-400 rounded-full flex-shrink-0" />
                                    {error}
                                </div>
                            )}

                            {/* Name */}
                            <div>
                                <label className="text-xs font-black text-gray-400 uppercase tracking-widest pl-1 block mb-1">Nom complet</label>
                                <div className="relative">
                                    <User size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                                    <input name="name" type="text" required value={formData.name} onChange={handleChange}
                                        className="w-full pl-11 pr-4 py-4 bg-gray-50 dark:bg-gray-700/50 border-2 border-transparent focus:border-blue-500 rounded-2xl outline-none transition-all font-medium dark:text-white"
                                        placeholder="Zakaria Chamekh"
                                    />
                                </div>
                            </div>

                            {/* Email */}
                            <div>
                                <label className="text-xs font-black text-gray-400 uppercase tracking-widest pl-1 block mb-1">Email</label>
                                <div className="relative">
                                    <Mail size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                                    <input name="email" type="email" required value={formData.email} onChange={handleChange}
                                        className="w-full pl-11 pr-4 py-4 bg-gray-50 dark:bg-gray-700/50 border-2 border-transparent focus:border-blue-500 rounded-2xl outline-none transition-all font-medium dark:text-white"
                                        placeholder="votre@email.com"
                                    />
                                </div>
                            </div>

                            {/* Phone (optional) */}
                            <div>
                                <label className="text-xs font-black text-gray-400 uppercase tracking-widest pl-1 block mb-1">
                                    Téléphone <span className="text-gray-300 normal-case font-normal">(optionnel)</span>
                                </label>
                                <div className="relative">
                                    <Phone size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                                    <input name="phone" type="tel" value={formData.phone} onChange={handleChange}
                                        className="w-full pl-11 pr-4 py-4 bg-gray-50 dark:bg-gray-700/50 border-2 border-transparent focus:border-blue-500 rounded-2xl outline-none transition-all font-medium dark:text-white"
                                        placeholder="+213 6XX XXX XXX"
                                    />
                                </div>
                            </div>

                            {/* Password */}
                            <div>
                                <label className="text-xs font-black text-gray-400 uppercase tracking-widest pl-1 block mb-1">Mot de passe</label>
                                <div className="relative">
                                    <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                                    <input name="password" type={showPw ? 'text' : 'password'} required value={formData.password} onChange={handleChange}
                                        className="w-full pl-11 pr-12 py-4 bg-gray-50 dark:bg-gray-700/50 border-2 border-transparent focus:border-blue-500 rounded-2xl outline-none transition-all font-medium dark:text-white"
                                        placeholder="••••••••"
                                    />
                                    <button type="button" onClick={() => setShowPw(v => !v)} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                                        {showPw ? <EyeOff size={18} /> : <Eye size={18} />}
                                    </button>
                                </div>

                                {/* Strength bar */}
                                {formData.password && (
                                    <div className="mt-2 space-y-1">
                                        <div className="flex gap-1">
                                            {[1, 2, 3, 4].map(i => (
                                                <div key={i} className={`h-1 flex-1 rounded-full transition-all ${i <= pwStrength() ? strengthColors[pwStrength()] : 'bg-gray-200 dark:bg-gray-700'}`} />
                                            ))}
                                        </div>
                                        <p className="text-xs text-gray-400 text-right">{strengthLabels[pwStrength()]}</p>
                                    </div>
                                )}
                            </div>

                            {/* Confirm Password */}
                            <div>
                                <label className="text-xs font-black text-gray-400 uppercase tracking-widest pl-1 block mb-1">Confirmer le mot de passe</label>
                                <div className="relative">
                                    <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                                    <input name="password_confirmation" type="password" required value={formData.password_confirmation} onChange={handleChange}
                                        className={`w-full pl-11 pr-4 py-4 bg-gray-50 dark:bg-gray-700/50 border-2 rounded-2xl outline-none transition-all font-medium dark:text-white ${
                                            formData.password_confirmation && formData.password !== formData.password_confirmation
                                                ? 'border-red-400'
                                                : formData.password_confirmation && formData.password === formData.password_confirmation
                                                    ? 'border-green-400'
                                                    : 'border-transparent focus:border-blue-500'
                                        }`}
                                        placeholder="••••••••"
                                    />
                                </div>
                            </div>

                            {/* Submit */}
                            <button type="submit" disabled={loading}
                                className="group w-full flex justify-center items-center py-4 px-4 bg-gray-900 dark:bg-blue-600 hover:bg-blue-600 dark:hover:bg-blue-700 text-white text-lg font-black rounded-2xl transition-all shadow-xl disabled:opacity-50 mt-2">
                                {loading ? (
                                    <div className="w-5 h-5 border-[3px] border-white/30 border-t-white rounded-full animate-spin" />
                                ) : (
                                    <>Créer mon compte <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" size={20} /></>
                                )}
                            </button>

                            <p className="text-xs text-gray-400 text-center mt-2">
                                En créant un compte, vous acceptez nos{' '}
                                <Link to="/conditions" className="text-blue-500 hover:underline">conditions d'utilisation</Link>
                            </p>
                        </form>

                        <div className="text-center pt-6">
                            <p className="text-gray-500 dark:text-gray-400 text-sm font-medium">
                                Déjà un compte ?{' '}
                                <Link to="/login" className="text-blue-500 font-black hover:underline">Se connecter</Link>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </MainLayout>
    );
};

export default Register;
