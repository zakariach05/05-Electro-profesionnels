import React from 'react';
import brandsData from '../../data/brands.json';
import { getImageUrl } from '../../services/image';

const BrandLogo = ({ brand }) => {
    const logoUrl = brand.logo ? getImageUrl(brand.logo) : null;

    return (
        <div
            className="brand-logo-item flex-shrink-0 mx-10 flex flex-col items-center justify-center transition-all duration-500"
            style={{
                width: '140px',
                height: '80px',
                cursor: 'pointer',
            }}
        >
            {logoUrl ? (
                /* ACTUAL LOGO IMAGE - CLEAN TRANSPARENT */
                <img
                    src={logoUrl}
                    alt={brand.name}
                    style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'contain',
                        objectPosition: 'center',
                        transition: 'transform 0.4s ease',
                    }}
                    onMouseEnter={(e) => {
                        e.target.style.transform = 'scale(1.15)';
                    }}
                    onMouseLeave={(e) => {
                        e.target.style.transform = 'scale(1)';
                    }}
                    onError={(e) => {
                        e.target.style.display = 'none';
                        e.target.nextSibling.style.display = 'flex';
                    }}
                />
            ) : null}

            {/* Brand Text Fallback */}
            <div style={{
                display: logoUrl ? 'none' : 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
            }}>
                <span style={{
                    color: '#94A3B8',
                    fontWeight: '900',
                    fontSize: '1.2rem',
                    letterSpacing: '0.1em',
                    fontFamily: "'Inter', sans-serif",
                    textTransform: 'uppercase',
                }}>
                    {brand.name}
                </span>
            </div>
        </div>
    );
};

const BrandsMarquee = () => {
    const brands = brandsData;
    if (!brands || brands.length === 0) return null;

    const marqueeBrands = [...brands, ...brands, ...brands];

    return (
        <section style={{
            padding: '4rem 0',
            background: '#FFFFFF',
            overflow: 'hidden',
            borderTop: '1px solid #F1F5F9',
            borderBottom: '1px solid #F1F5F9',
        }}>
            <style>{`
                @keyframes marquee-infinite-scroll {
                    0%   { transform: translateX(0); }
                    100% { transform: translateX(-33.333%); }
                }
                .marquee-infinite-track {
                    animation: marquee-infinite-scroll 40s linear infinite;
                    display: flex;
                    width: max-content;
                    align-items: center;
                }
                .marquee-infinite-wrapper:hover .marquee-infinite-track {
                    animation-play-state: paused;
                }
            `}</style>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-10 text-center">
                <span style={{
                    color: '#EF4444',
                    fontWeight: '900',
                    fontSize: '10px',
                    letterSpacing: '0.3em',
                    textTransform: 'uppercase',
                    display: 'block',
                    marginBottom: '8px',
                }}>
                    ✦ Partenaires Officiels ✦
                </span>
                <h2 style={{
                    fontSize: '2rem',
                    fontWeight: '900',
                    color: '#0F172A',
                    textTransform: 'uppercase',
                    letterSpacing: '-0.02em',
                    fontFamily: "'Inter', sans-serif",
                }}>
                    Marques <span style={{ color: '#EF4444' }}>disponibles</span>
                </h2>
            </div>

            <div className="marquee-infinite-wrapper relative w-full overflow-hidden">
                <div style={{
                    position: 'absolute', insetBlock: 0, left: 0, width: '150px', zIndex: 10,
                    background: 'linear-gradient(to right, white, transparent)', pointerEvents: 'none'
                }} />
                <div style={{
                    position: 'absolute', insetBlock: 0, right: 0, width: '150px', zIndex: 10,
                    background: 'linear-gradient(to left, white, transparent)', pointerEvents: 'none'
                }} />

                <div className="marquee-infinite-track">
                    {marqueeBrands.map((brand, idx) => (
                        <BrandLogo key={`${brand.name}-${idx}`} brand={brand} />
                    ))}
                </div>
            </div>

            {/* WHITE STATS SECTION */}
            <div style={{
                marginTop: '4rem',
                backgroundColor: '#FFFFFF',
                padding: '4rem 1.5rem',
                width: '100%',
                borderTop: '1px solid #F1F5F9',
                position: 'relative',
                overflow: 'hidden'
            }}>
                <div style={{
                    maxWidth: '1200px',
                    margin: '0 auto',
                    display: 'grid',
                    gridTemplateColumns: 'repeat(4, 1fr)',
                    gap: '2rem',
                    textAlign: 'center',
                    position: 'relative',
                    zIndex: 2
                }}>
                    {[
                        { n: brands.length, label: 'Marques Partenaires', icon: '✦' },
                        { n: '46', label: 'Produits en Stock', icon: '🛒' },
                        { n: '3', label: 'Boutiques Physiques', icon: '📍' },
                        { n: '100%', label: 'Certifié Authentique', icon: '✓' },
                    ].map((s, i) => (
                        <div key={i} style={{ borderRight: i < 3 ? '1px solid #F1F5F9' : 'none' }}>
                            <div style={{ color: '#EF4444', fontSize: '14px', marginBottom: '8px' }}>{s.icon}</div>
                            <div style={{ 
                                fontSize: '2.5rem', 
                                fontWeight: '900', 
                                color: '#0F172A', 
                                fontFamily: "'Inter', sans-serif",
                                letterSpacing: '-0.02em',
                                marginBottom: '4px'
                            }}>
                                {s.n}
                            </div>
                            <div style={{ 
                                fontSize: '0.65rem', 
                                fontWeight: '700', 
                                color: '#94A3B8', 
                                textTransform: 'uppercase', 
                                letterSpacing: '0.2em' 
                            }}>
                                {s.label}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default BrandsMarquee;
