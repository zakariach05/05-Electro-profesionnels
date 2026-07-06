/** @type {import('tailwindcss').Config} */
module.exports = {
    darkMode: 'class',
    content: [
        "./src/**/*.{js,jsx,ts,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                primary:   '#544F7D',
                secondary: '#FFCB50',
                // Glassmorphism palette
                glass: {
                    light: 'rgba(255, 255, 255, 0.15)',
                    dark:  'rgba(15, 23, 42, 0.6)',
                    border:'rgba(255, 255, 255, 0.1)',
                },
                // Dark mode surface colors
                dark: {
                    50:  '#f8fafc',
                    100: '#1e293b',
                    200: '#0f172a',
                    300: '#020617',
                },
            },
            backgroundImage: {
                'premium-gradient':  'linear-gradient(135deg, #544F7D 0%, #FFCB50 100%)',
                'glass-gradient':    'linear-gradient(135deg, rgba(255,255,255,0.1), rgba(255,255,255,0.05))',
                'blue-gradient':     'linear-gradient(135deg, #3b82f6 0%, #6366f1 100%)',
                'dark-gradient':     'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)',
                'hero-radial':       'radial-gradient(ellipse at top, #1e3a5f 0%, #0f172a 60%)',
            },
            fontFamily: {
                sans:   ['Inter', 'sans-serif'],
                arabic: ['Cairo', 'sans-serif'],
            },
            boxShadow: {
                'glass':       '0 8px 32px rgba(0, 0, 0, 0.12), inset 0 1px 0 rgba(255,255,255,0.15)',
                'glass-dark':  '0 8px 32px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(255,255,255,0.05)',
                'neon-blue':   '0 0 20px rgba(59, 130, 246, 0.5)',
                'neon-purple': '0 0 20px rgba(99, 102, 241, 0.5)',
                'premium':     '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
                'card-hover':  '0 20px 60px -10px rgba(84, 79, 125, 0.3)',
            },
            backdropBlur: {
                xs:  '2px',
                sm:  '4px',
                md:  '8px',
                lg:  '16px',
                xl:  '24px',
                '2xl': '40px',
            },
            borderRadius: {
                '4xl': '2rem',
                '5xl': '2.5rem',
            },
            animation: {
                'fade-in':        'fadeIn 0.5s ease-out forwards',
                'fade-up':        'fadeUp 0.6s cubic-bezier(0.16,1,0.3,1) forwards',
                'scale-in':       'scaleIn 0.4s cubic-bezier(0.16,1,0.3,1) forwards',
                'slide-in-right': 'slideInRight 0.5s cubic-bezier(0.16,1,0.3,1) forwards',
                'float':          'float 6s ease-in-out infinite',
                'glow':           'glow 2s ease-in-out infinite alternate',
                'shake':          'shake 0.4s ease-in-out',
                'pulse-slow':     'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
                'spin-slow':      'spin 3s linear infinite',
                'bounce-subtle':  'bounceSubtle 2s ease-in-out infinite',
            },
            keyframes: {
                fadeIn: {
                    '0%':   { opacity: '0' },
                    '100%': { opacity: '1' },
                },
                fadeUp: {
                    '0%':   { opacity: '0', transform: 'translateY(24px)' },
                    '100%': { opacity: '1', transform: 'translateY(0)' },
                },
                scaleIn: {
                    '0%':   { opacity: '0', transform: 'scale(0.9)' },
                    '100%': { opacity: '1', transform: 'scale(1)' },
                },
                slideInRight: {
                    '0%':   { opacity: '0', transform: 'translateX(32px)' },
                    '100%': { opacity: '1', transform: 'translateX(0)' },
                },
                float: {
                    '0%, 100%': { transform: 'translateY(0px)' },
                    '50%':      { transform: 'translateY(-16px)' },
                },
                glow: {
                    '0%':   { boxShadow: '0 0 10px rgba(84,79,125,0.3)' },
                    '100%': { boxShadow: '0 0 30px rgba(84,79,125,0.7)' },
                },
                shake: {
                    '0%, 100%': { transform: 'translateX(0)' },
                    '20%':      { transform: 'translateX(-6px)' },
                    '40%':      { transform: 'translateX(6px)' },
                    '60%':      { transform: 'translateX(-4px)' },
                    '80%':      { transform: 'translateX(4px)' },
                },
                bounceSubtle: {
                    '0%, 100%': { transform: 'translateY(0)' },
                    '50%':      { transform: 'translateY(-6px)' },
                },
            },
            transitionTimingFunction: {
                'spring': 'cubic-bezier(0.16, 1, 0.3, 1)',
            },
        },
    },
    plugins: [],
};
