import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, ArrowRight, Eye, EyeOff } from 'lucide-react';
import SEO from '../components/atoms/SEO';
import toast from 'react-hot-toast';
import ReCAPTCHA from 'react-google-recaptcha';
import { GoogleOAuthProvider, useGoogleLogin } from '@react-oauth/google';

const RECAPTCHA_SITE_KEY = process.env.REACT_APP_RECAPTCHA_SITE_KEY || '6LfkQt8sAAAAAPPHX1Nk9Qcvx85dkukZjY4bci73';
const BRAND = '#544F7D';
const ACCENT = '#7c78b8';
const GOOGLE_CLIENT_ID = process.env.REACT_APP_GOOGLE_CLIENT_ID;

/* ── Input Field ── */
const Field = ({ label, id, icon: Icon, action, ...props }) => {
    const [focused, setFocused] = useState(false);
    return (
        <div>
            <label htmlFor={id} style={{
                display: 'block', fontSize: 11, fontWeight: 700, letterSpacing: '0.1em',
                textTransform: 'uppercase', color: '#8b8fa8', marginBottom: 6
            }}>{label}</label>
            <div style={{ position: 'relative' }}>
                <Icon size={15} style={{
                    position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)',
                    color: focused ? ACCENT : '#b0b4c8', transition: 'color 0.2s'
                }} />
                <input id={id} {...props}
                    onFocus={e => { setFocused(true); props.onFocus && props.onFocus(e); }}
                    onBlur={e => { setFocused(false); props.onBlur && props.onBlur(e); }}
                    style={{
                        width: '100%', paddingLeft: 40, paddingRight: action ? 44 : 14, paddingTop: 13, paddingBottom: 13,
                        boxSizing: 'border-box',
                        background: focused ? 'rgba(255,255,255,0.98)' : 'rgba(248,249,255,0.8)',
                        border: `1.5px solid ${focused ? ACCENT : 'rgba(84,79,125,0.15)'}`,
                        borderRadius: 12, outline: 'none', color: '#1a1a2e', fontSize: 14, fontWeight: 500,
                        transition: 'all 0.2s', backdropFilter: 'blur(4px)'
                    }} />
                {action}
            </div>
        </div>
    );
};

/* ── Right Panel ── */
const RightPanel = () => {
    const canvasRef = useRef(null);
    useEffect(() => {
        const c = canvasRef.current; if (!c) return;
        const ctx = c.getContext('2d');
        const resize = () => { c.width = c.offsetWidth; c.height = c.offsetHeight; };
        resize();
        window.addEventListener('resize', resize);
        const pts = Array.from({ length: 70 }, () => ({
            x: Math.random() * c.width, y: Math.random() * c.height,
            dx: (Math.random() - .5) * .35, dy: (Math.random() - .5) * .35,
            r: Math.random() * 1.8 + .3, o: Math.random() * .5 + .1
        }));
        let raf;
        const draw = () => {
            ctx.clearRect(0, 0, c.width, c.height);
            pts.forEach(p => {
                p.x += p.dx; p.y += p.dy;
                if (p.x < 0) p.x = c.width; if (p.x > c.width) p.x = 0;
                if (p.y < 0) p.y = c.height; if (p.y > c.height) p.y = 0;
                ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(180,175,230,${p.o})`; ctx.fill();
            });
            for (let i = 0; i < pts.length; i++) for (let j = i + 1; j < pts.length; j++) {
                const d = Math.hypot(pts[i].x - pts[j].x, pts[i].y - pts[j].y);
                if (d < 110) {
                    ctx.beginPath(); ctx.strokeStyle = `rgba(140,135,200,${.15 * (1 - d / 110)})`;
                    ctx.lineWidth = .6; ctx.moveTo(pts[i].x, pts[i].y); ctx.lineTo(pts[j].x, pts[j].y); ctx.stroke();
                }
            }
            raf = requestAnimationFrame(draw);
        };
        draw();
        return () => { cancelAnimationFrame(raf); window.removeEventListener('resize', resize); };
    }, []);

    return (
        <div style={{
            position: 'relative', overflow: 'hidden', flex: 1,
            background: `linear-gradient(145deg,${BRAND} 0%,#3e3a5f 40%,#1e1b35 70%,#12101e 100%)`,
            display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
            padding: '60px 48px', minHeight: '100vh'
        }}>
            <canvas ref={canvasRef} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', opacity: .55 }} />
            <div style={{
                position: 'absolute', top: '-15%', right: '-15%', width: 550, height: 550, borderRadius: '50%',
                background: 'radial-gradient(circle,rgba(124,120,184,0.25) 0%,transparent 65%)', animation: 'orb1 10s ease-in-out infinite'
            }} />
            <div style={{
                position: 'absolute', bottom: '-20%', left: '-10%', width: 650, height: 650, borderRadius: '50%',
                background: 'radial-gradient(circle,rgba(84,79,125,0.18) 0%,transparent 65%)', animation: 'orb2 13s ease-in-out infinite'
            }} />
            <div style={{ position: 'relative', zIndex: 2, textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <div style={{ animation: 'logoFloat 5s ease-in-out infinite' }}>
                    <img src="/logo-nv.png" alt="Electro-05" style={{
                        height: 200, width: 'auto', objectFit: 'contain',
                        filter: 'drop-shadow(0 0 60px rgba(124,120,184,0.55)) drop-shadow(0 16px 40px rgba(0,0,0,0.5)) brightness(1.1)'
                    }} />
                </div>
                <h2 style={{
                    marginTop: 32, fontSize: 13, fontWeight: 700, color: 'rgba(200,196,255,0.7)',
                    letterSpacing: '0.35em', textTransform: 'uppercase', textShadow: '0 2px 12px rgba(0,0,0,0.4)'
                }}>
                    L'excellence électronique
                </h2>
                <div style={{ marginTop: 14, display: 'flex', gap: 8, alignItems: 'center' }}>
                    {['Premium', '·', 'Fiable', '·', 'Rapide'].map((t, i) => (
                        <span key={i} style={{
                            fontSize: 11, fontWeight: i % 2 === 0 ? 600 : 400,
                            color: i % 2 === 0 ? 'rgba(180,176,230,0.85)' : 'rgba(180,176,230,0.35)', letterSpacing: '0.05em'
                        }}>{t}</span>
                    ))}
                </div>
            </div>
            <style>{`
        @keyframes orb1{0%,100%{transform:translate(0,0) scale(1)}50%{transform:translate(-25px,35px) scale(1.06)}}
        @keyframes orb2{0%,100%{transform:translate(0,0) scale(1)}50%{transform:translate(25px,-25px) scale(1.09)}}
        @keyframes logoFloat{0%,100%{transform:translateY(0) scale(1)}50%{transform:translateY(-10px) scale(1.02)}}
      `}</style>
        </div>
    );
};

/* ── Google Section (child of GoogleOAuthProvider) ── */
const GoogleSection = ({ loading, setLoading, setError }) => {
    const { googleLogin } = useAuth();
    const navigate = useNavigate();

    const handleGoogleSuccess = useCallback(async (tokenResponse) => {
        setLoading(true);
        setError('');
        try {
            const d = await googleLogin(tokenResponse.access_token);
            toast.success(`Bienvenue, ${d.user.name} !`);
            navigate(d.user?.role === 'admin' ? '/admin/dashboard' : '/');
        } catch {
            setError('Authentification Google échouée. Veuillez réessayer.');
        } finally {
            setLoading(false);
        }
    }, [googleLogin, navigate, setLoading, setError]);

    const googleSignIn = useGoogleLogin({
        onSuccess: handleGoogleSuccess,
        onError: () => setError('Authentification Google annulée'),
        flow: 'implicit',
    });

    return (
        <div>
            {/* ── Separator ── */}
            <div style={{
                display: 'flex', alignItems: 'center', gap: 12, margin: '18px 0 0'
            }}>
                <span style={{ flex: 1, height: 1, background: 'linear-gradient(90deg,transparent,rgba(84,79,125,0.2),transparent)' }} />
                <span style={{
                    fontSize: 11, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase',
                    color: '#9ca3af', whiteSpace: 'nowrap'
                }}>Ou continuer avec</span>
                <span style={{ flex: 1, height: 1, background: 'linear-gradient(90deg,transparent,rgba(84,79,125,0.2),transparent)' }} />
            </div>

            {/* ── Google Button ── */}
            <button type="button" onClick={() => googleSignIn()} disabled={loading}
                style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
                    width: '100%', padding: '12px 0', borderRadius: 12, marginTop: 12,
                    border: '1.5px solid rgba(84,79,125,0.15)',
                    background: loading ? 'rgba(248,249,255,0.5)' : 'rgba(248,249,255,0.8)',
                    cursor: loading ? 'not-allowed' : 'pointer',
                    color: '#1a1a2e', fontSize: 14, fontWeight: 600,
                    transition: 'all 0.2s', opacity: loading ? .6 : 1,
                    boxSizing: 'border-box',
                }}
                onMouseEnter={e => { if (!loading) { e.currentTarget.style.borderColor = '#544F7D'; e.currentTarget.style.background = 'rgba(255,255,255,0.98)'; e.currentTarget.style.boxShadow = '0 4px 16px rgba(84,79,125,0.15)'; } }}
                onMouseLeave={e => { if (!loading) { e.currentTarget.style.borderColor = 'rgba(84,79,125,0.15)'; e.currentTarget.style.background = 'rgba(248,249,255,0.8)'; e.currentTarget.style.boxShadow = 'none'; } }}>
                <svg width="20" height="20" viewBox="0 0 48 48">
                    <path fill="#FFC107" d="M43.611 20.083H42V20H24v8h11.303c-1.649 4.657-6.08 8-11.303 8-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 12.955 4 4 12.955 4 24s8.955 20 20 20 20-8.955 20-20c0-1.341-.138-2.65-.389-3.917z" />
                    <path fill="#FF3D00" d="m6.306 14.691 6.571 4.819C14.655 15.108 18.961 12 24 12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 16.318 4 9.656 8.337 6.306 14.691z" />
                    <path fill="#4CAF50" d="M24 44c5.166 0 9.86-1.977 13.409-5.192l-6.19-5.238A11.91 11.91 0 0 1 24 36c-5.202 0-9.619-3.317-11.283-7.946l-6.522 5.025C9.505 39.556 16.227 44 24 44z" />
                    <path fill="#1976D2" d="M43.611 20.083H42V20H24v8h11.303a12.04 12.04 0 0 1-4.087 5.571l.003-.002 6.19 5.238C36.971 39.205 44 34 44 24c0-1.341-.138-2.65-.389-3.917z" />
                </svg>
                {loading ? 'Connexion en cours…' : 'Continuer avec Google'}
            </button>
        </div>
    );
};

/* ── Login ── */
const Login = () => {
    const [email, setEmail] = useState(localStorage.getItem('remember_email') || '');
    const [password, setPassword] = useState('');
    const [rememberMe, setRememberMe] = useState(!!localStorage.getItem('remember_email'));
    const [showPw, setShowPw] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [captchaToken, setCaptchaToken] = useState(null);
    const recaptchaRef = useRef(null);

    const { login } = useAuth();
    const { t } = useLanguage();
    const navigate = useNavigate();

    const handleSubmit = useCallback(async (e) => {
        e.preventDefault();
        if (!captchaToken) { setError('Veuillez cocher la case reCAPTCHA'); return; }
        setLoading(true); setError('');
        try {
            const d = await login(email, password, captchaToken);
            rememberMe ? localStorage.setItem('remember_email', email) : localStorage.removeItem('remember_email');
            toast.success(`Bienvenue, ${d.user.name} !`);
            navigate(d.user?.role === 'admin' ? '/admin/dashboard' : '/');
        } catch (e) {
            setError(e.response?.data?.message || 'Identifiants incorrects');
            recaptchaRef.current?.reset();
            setCaptchaToken(null);
        } finally { setLoading(false); }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [captchaToken, email, password, rememberMe]);

    return (
        <>
            <SEO title="Connexion" description="Connectez-vous à votre compte Electro-05." />
            <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
            <div style={{ display: 'flex', minHeight: '100vh', fontFamily: "'Inter',-apple-system,BlinkMacSystemFont,sans-serif", background: '#fafbff', justifyContent: 'center', alignItems: 'stretch' }}>

                {/* LEFT */}
                <div style={{
                    flex: '0 0 560px', maxWidth: 560, width: '100%', display: 'flex', flexDirection: 'column',
                    justifyContent: 'center', padding: '56px 56px', position: 'relative',
                    background: 'rgba(255,255,255,0.93)', backdropFilter: 'blur(20px)',
                    boxShadow: '0 0 80px rgba(84,79,125,0.12)'
                }}>

                    <Link to="/" style={{
                        position: 'absolute', top: 28, left: 48, fontSize: 12, color: '#9ca3af',
                        textDecoration: 'none', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 5, transition: 'color 0.2s'
                    }}
                        onMouseEnter={e => e.currentTarget.style.color = BRAND}
                        onMouseLeave={e => e.currentTarget.style.color = '#9ca3af'}>← Accueil</Link>

                    {/* Header */}
                    <div style={{ marginBottom: 32, textAlign: 'center' }}>
                        <img src="/logo-nv.png" alt="Electro-05" style={{
                            display: 'block',
                            height: 80, width: 'auto', objectFit: 'contain',
                            margin: '0 auto 18px auto',
                            filter: 'drop-shadow(0 4px 16px rgba(84,79,125,0.35))',
                            animation: 'pulseLogo 4s ease-in-out infinite',
                        }} />
                        <h1 style={{ margin: 0, fontSize: 28, fontWeight: 800, color: '#0f0e1a', letterSpacing: '-0.04em' }}>
                            Bon retour
                        </h1>
                        <p style={{ margin: '6px 0 0', fontSize: 14, color: '#8b8fa8' }}>Connectez-vous à votre compte</p>
                    </div>

                    {/* Error */}
                    {error && (
                        <div style={{
                            background: '#fff0f0', border: '1px solid #fecaca', borderRadius: 12,
                            padding: '11px 14px', marginBottom: 16, color: '#dc2626', fontSize: 13, fontWeight: 600,
                            display: 'flex', alignItems: 'center', gap: 8
                        }}>
                            <span style={{ width: 6, height: 6, background: '#ef4444', borderRadius: '50%', flexShrink: 0 }} />
                            {error}
                        </div>
                    )}

                    {/* Form */}
                    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                        <Field id="login-email" label="Adresse email" icon={Mail} type="email" required
                            value={email} placeholder="votre@email.com" onChange={e => setEmail(e.target.value)} />

                        <Field id="login-password" label="Mot de passe" icon={Lock}
                            type={showPw ? 'text' : 'password'} required
                            value={password} placeholder="••••••••" onChange={e => setPassword(e.target.value)}
                            action={
                                <button type="button" onClick={() => setShowPw(v => !v)}
                                    style={{
                                        position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)',
                                        background: 'none', border: 'none', cursor: 'pointer', color: '#b0b4c8', padding: 4, transition: 'color 0.2s'
                                    }}
                                    onMouseEnter={e => e.currentTarget.style.color = BRAND}
                                    onMouseLeave={e => e.currentTarget.style.color = '#b0b4c8'}>
                                    {showPw ? <EyeOff size={15} /> : <Eye size={15} />}
                                </button>
                            } />

                        {/* Remember + Forgot */}
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                            <label style={{ display: 'flex', alignItems: 'center', gap: 7, cursor: 'pointer' }}>
                                <input type="checkbox" checked={rememberMe} onChange={e => setRememberMe(e.target.checked)}
                                    style={{ width: 14, height: 14, accentColor: BRAND, cursor: 'pointer' }} />
                                <span style={{ fontSize: 12, color: '#8b8fa8', fontWeight: 500 }}>Se souvenir de moi</span>
                            </label>
                            <Link to="/forgot-password" style={{ fontSize: 12, color: ACCENT, fontWeight: 700, textDecoration: 'none' }}>
                                Mot de passe oublié ?
                            </Link>
                        </div>

                        {/* ── Real reCAPTCHA v2 Widget ── */}
                        <div style={{ display: 'flex', justifyContent: 'center', margin: '4px 0' }}>
                            <ReCAPTCHA
                                ref={recaptchaRef}
                                sitekey={RECAPTCHA_SITE_KEY}
                                onChange={token => setCaptchaToken(token)}
                                onExpired={() => setCaptchaToken(null)}
                                onError={() => setCaptchaToken(null)}
                                hl="fr"
                            />
                        </div>

                        {/* Submit */}
                        <button type="submit" disabled={loading || !captchaToken}
                            style={{
                                padding: '14px 0', border: 'none', borderRadius: 14,
                                cursor: (loading || !captchaToken) ? 'not-allowed' : 'pointer',
                                background: captchaToken
                                    ? `linear-gradient(135deg,${BRAND} 0%,${ACCENT} 100%)`
                                    : 'linear-gradient(135deg,#c8cad8,#d8dae4)',
                                color: '#fff', fontSize: 15, fontWeight: 800, letterSpacing: '0.01em',
                                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                                boxShadow: captchaToken ? `0 6px 24px rgba(84,79,125,0.4)` : 'none',
                                opacity: loading ? .75 : 1, transition: 'all 0.35s'
                            }}
                            onMouseEnter={e => { if (captchaToken && !loading) { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 10px 32px rgba(84,79,125,0.5)'; } }}
                            onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = captchaToken ? `0 6px 24px rgba(84,79,125,0.4)` : 'none'; }}>
                            {loading
                                ? <div style={{ width: 20, height: 20, borderRadius: '50%', border: '3px solid rgba(255,255,255,0.3)', borderTopColor: '#fff', animation: 'spin 0.8s linear infinite' }} />
                                : <>Se connecter <ArrowRight size={16} /></>}
                        </button>
                    </form>

                    <GoogleSection loading={loading} setLoading={setLoading} setError={setError} />

                    <p style={{ textAlign: 'center', marginTop: 22, fontSize: 13, color: '#9ca3af', fontWeight: 500 }}>
                        Pas encore de compte ?{' '}
                        <Link to="/register" style={{ color: BRAND, fontWeight: 800, textDecoration: 'none' }}>Créer un compte</Link>
                    </p>
                    <p style={{ textAlign: 'center', marginTop: 'auto', paddingTop: 28, fontSize: 10, color: '#d1d5db' }}>
                        © 2025 Electro-05. Tous droits réservés.
                    </p>
                </div>

                {/* RIGHT */}
                <div style={{ flex: 1, display: 'none' }} className="login-right-panel">
                    <RightPanel />
                </div>
            </div>
            </GoogleOAuthProvider>

            <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes pulseLogo {
          0%,100% { filter: drop-shadow(0 4px 16px rgba(84,79,125,0.35)); transform: scale(1); }
          50% { filter: drop-shadow(0 6px 24px rgba(84,79,125,0.55)); transform: scale(1.04); }
        }
        @media (min-width: 900px) { .login-right-panel { display: flex !important; } }
        @media (max-width: 899px) { .login-right-panel { display: none !important; } }
        input::placeholder { color: #c4c7d8; }
        .grecaptcha-badge { visibility: hidden !important; }
      `}</style>
        </>
    );
};

export default Login;
