import React, { useEffect, useState } from 'react';

const SplashScreen = ({ onComplete }) => {
    const [fadeOut, setFadeOut] = useState(false);
    const [zoomIn, setZoomIn] = useState(false);

    useEffect(() => {
        // Start zoom animation after 2.5 seconds
        const zoomTimer = setTimeout(() => {
            setZoomIn(true);
        }, 2500);

        // Start fade out after 3 seconds
        const fadeTimer = setTimeout(() => {
            setFadeOut(true);
        }, 3000);

        // Complete and hide (3.5s total)
        const hideTimer = setTimeout(() => {
            if (onComplete) onComplete();
        }, 3500);

        return () => {
            clearTimeout(zoomTimer);
            clearTimeout(fadeTimer);
            clearTimeout(hideTimer);
        };
    }, [onComplete]);

    return (
        <div
            className={`fixed inset-0 z-[9999] bg-black transition-opacity duration-500 ${fadeOut ? 'opacity-0' : 'opacity-100'
                }`}
        >
            {/* Video Background with Zoom Animation */}
            <video
                autoPlay
                muted
                loop
                playsInline
                className={`absolute inset-0 w-full h-full object-cover transition-transform duration-1000 ease-in-out ${zoomIn ? 'scale-150' : 'scale-100'
                    }`}
            >
                <source src="/Magasine05.mp4" type="video/mp4" />
            </video>





            {/* Loading indicator */}
            <div className={`absolute bottom-12 left-1/2 -translate-x-1/2 transition-opacity duration-500 ${zoomIn ? 'opacity-0' : 'opacity-100'
                }`}>
                <div className="flex gap-2">
                    <div className="w-2 h-2 bg-white rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                    <div className="w-2 h-2 bg-white rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                    <div className="w-2 h-2 bg-white rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                </div>
            </div>
        </div>
    );
};

export default SplashScreen;
