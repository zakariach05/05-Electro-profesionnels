import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const SITE_NAME  = 'Electro-05';
const SITE_TITLE = "Electro-05 — Électronique Professionnelle en Algérie";
const SITE_URL   = 'https://05-electro.kesug.com';
const DEFAULT_IMG= `${SITE_URL}/og-default.jpg`;
const TWITTER_HANDLE = '@electro05dz';

const SEO = ({
    title,
    description = "Découvrez notre gamme d'appareils électroniques professionnels. Livraison rapide en Algérie. Prix compétitifs, qualité garantie.",
    image,
    type     = 'website',
    product  = null,   // Product object for product schema markup
    breadcrumbs = [],  // Array of { name, url }
    noIndex  = false,
    canonical,
}) => {
    const location = useLocation();
    const currentUrl = canonical || `${SITE_URL}${location.pathname}`;
    const fullTitle  = title ? `${title} | ${SITE_NAME}` : SITE_TITLE;
    const ogImage    = image || DEFAULT_IMG;

    useEffect(() => {
        document.title = fullTitle;

        const setMeta = (selector, attr, value) => {
            if (!value) return;
            let el = document.querySelector(selector);
            if (!el) {
                el = document.createElement('meta');
                document.head.appendChild(el);
            }
            el.setAttribute(attr, value);
        };

        const setMetaName = (name, content) => {
            if (!content) return;
            setMeta(`meta[name="${name}"]`, 'content', content);
            document.querySelector(`meta[name="${name}"]`)?.setAttribute('name', name);
        };

        const setMetaProp = (property, content) => {
            if (!content) return;
            let el = document.querySelector(`meta[property="${property}"]`);
            if (!el) { el = document.createElement('meta'); el.setAttribute('property', property); document.head.appendChild(el); }
            el.setAttribute('content', content);
        };

        // ── Basic ─────────────────────────────────────────────────────────────
        setMetaName('description', description);
        setMetaName('robots', noIndex ? 'noindex, nofollow' : 'index, follow');

        // ── Canonical ─────────────────────────────────────────────────────────
        let canonicalEl = document.querySelector('link[rel="canonical"]');
        if (!canonicalEl) { canonicalEl = document.createElement('link'); canonicalEl.setAttribute('rel', 'canonical'); document.head.appendChild(canonicalEl); }
        canonicalEl.setAttribute('href', currentUrl);

        // ── Open Graph ────────────────────────────────────────────────────────
        setMetaProp('og:site_name', SITE_NAME);
        setMetaProp('og:title',     fullTitle);
        setMetaProp('og:description', description);
        setMetaProp('og:type',      type);
        setMetaProp('og:url',       currentUrl);
        setMetaProp('og:image',     ogImage);
        setMetaProp('og:image:width',  '1200');
        setMetaProp('og:image:height', '630');
        setMetaProp('og:locale',    'fr_DZ');

        // ── Twitter Cards ─────────────────────────────────────────────────────
        setMetaName('twitter:card',        'summary_large_image');
        setMetaName('twitter:site',        TWITTER_HANDLE);
        setMetaName('twitter:title',       fullTitle);
        setMetaName('twitter:description', description);
        setMetaName('twitter:image',       ogImage);

        // ── JSON-LD Structured Data ───────────────────────────────────────────
        const removeJsonLd = (id) => { const el = document.getElementById(id); if (el) el.remove(); };

        // Organization schema (always)
        removeJsonLd('jsonld-org');
        const orgSchema = {
            '@context': 'https://schema.org',
            '@type': 'Organization',
            name: SITE_NAME,
            url: SITE_URL,
            logo: `${SITE_URL}/logo.png`,
            contactPoint: { '@type': 'ContactPoint', contactType: 'customer service', availableLanguage: ['French', 'Arabic'] },
        };
        const orgEl = document.createElement('script');
        orgEl.id = 'jsonld-org';
        orgEl.type = 'application/ld+json';
        orgEl.text = JSON.stringify(orgSchema);
        document.head.appendChild(orgEl);

        // Breadcrumb schema
        if (breadcrumbs.length > 0) {
            removeJsonLd('jsonld-breadcrumb');
            const bcSchema = {
                '@context': 'https://schema.org',
                '@type': 'BreadcrumbList',
                itemListElement: [
                    { '@type': 'ListItem', position: 1, name: 'Accueil', item: SITE_URL },
                    ...breadcrumbs.map((b, i) => ({
                        '@type': 'ListItem',
                        position: i + 2,
                        name: b.name,
                        item: `${SITE_URL}${b.url}`,
                    }))
                ],
            };
            const bcEl = document.createElement('script');
            bcEl.id = 'jsonld-breadcrumb';
            bcEl.type = 'application/ld+json';
            bcEl.text = JSON.stringify(bcSchema);
            document.head.appendChild(bcEl);
        }

        // Product schema
        if (product) {
            removeJsonLd('jsonld-product');
            const productSchema = {
                '@context': 'https://schema.org',
                '@type': 'Product',
                name: product.name,
                description: product.description,
                image: ogImage,
                sku: `ELEC-${product.id}`,
                brand: { '@type': 'Brand', name: product.brand || SITE_NAME },
                offers: {
                    '@type': 'Offer',
                    price: product.price,
                    priceCurrency: 'MAD',
                    availability: product.stock > 0 ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
                    url: currentUrl,
                    seller: { '@type': 'Organization', name: SITE_NAME },
                },
                ...(product.rating && {
                    aggregateRating: {
                        '@type': 'AggregateRating',
                        ratingValue: product.rating,
                        reviewCount: product.reviewCount || 1,
                    }
                }),
            };
            const pEl = document.createElement('script');
            pEl.id = 'jsonld-product';
            pEl.type = 'application/ld+json';
            pEl.text = JSON.stringify(productSchema);
            document.head.appendChild(pEl);
        }

        return () => {
            removeJsonLd('jsonld-product');
            removeJsonLd('jsonld-breadcrumb');
        };
    }, [fullTitle, description, ogImage, type, currentUrl, noIndex, product, breadcrumbs]);

    return null;
};

export default SEO;
