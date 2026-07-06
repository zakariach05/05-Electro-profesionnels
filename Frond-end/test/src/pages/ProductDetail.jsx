import React, { useState, useRef, useEffect } from 'react';
import { Star, Heart, Share2, ShieldCheck, Truck, RotateCcw, ZoomIn, X, ChevronLeft, ChevronRight } from 'lucide-react';
import gsap from 'gsap';
import MainLayout from '../layouts/MainLayout';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { API_URL } from '../services/api';
import Loader from '../components/atoms/Loader';
import { getImageUrl } from '../services/image';
import SEO from '../components/atoms/SEO';
import Breadcrumb from '../components/atoms/Breadcrumb';
import ReviewSection from '../components/organisms/ReviewSection';
import RelatedProducts from '../components/organisms/RelatedProducts';
import { DELIVERY_DATA } from '../data/delivery';
import toast from 'react-hot-toast';

const ProductDetail = () => {
    const { id } = useParams();
    const [product, setProduct]         = useState(null);
    const [loading, setLoading]         = useState(true);
    const [selectedImage, setSelectedImage] = useState(0);
    const [quantity, setQuantity]       = useState(1);
    const [selectedCity, setSelectedCity] = useState(DELIVERY_DATA[0]);
    const [lightbox, setLightbox]       = useState(false);
    const [tab, setTab]                 = useState('description'); // description | specs

    const titleRef = useRef(null);
    const imageRef = useRef(null);

    // ── Use updated WishlistContext API ───────────────────────────────────────
    const { addToCart }                 = useCart();
    const { toggle, isInWishlist }      = useWishlist();
    const isWishlisted = isInWishlist(parseInt(id));

    useEffect(() => {
        setLoading(true);
        axios.get(`${API_URL}/products/${id}`)
            .then(r => setProduct(r.data))
            .catch(() => toast.error('Produit introuvable'))
            .finally(() => setLoading(false));
    }, [id]);

    useEffect(() => {
        if (!loading && product && titleRef.current) {
            gsap.from(titleRef.current, { y: 24, opacity: 0, duration: 0.8, ease: 'power3.out' });
        }
    }, [loading, product]);

    // Reset selected image when product changes
    useEffect(() => { setSelectedImage(0); }, [id]);

    // Keyboard nav for lightbox
    useEffect(() => {
        if (!lightbox) return;
        const handler = (e) => {
            if (e.key === 'ArrowRight') nextImage();
            if (e.key === 'ArrowLeft')  prevImage();
            if (e.key === 'Escape')     setLightbox(false);
        };
        window.addEventListener('keydown', handler);
        return () => window.removeEventListener('keydown', handler);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [lightbox, selectedImage]);

    if (loading) return (
        <MainLayout>
            <div className="min-h-screen flex items-center justify-center">
                <Loader />
            </div>
        </MainLayout>
    );

    if (!product) return (
        <MainLayout>
            <div className="min-h-screen flex flex-col items-center justify-center gap-4">
                <p className="text-2xl font-black text-gray-400">Produit introuvable</p>
                <Link to="/shop" className="text-blue-500 font-bold hover:underline">← Retour à la boutique</Link>
            </div>
        </MainLayout>
    );

    const images = (product.images && product.images.length > 0)
        ? product.images.map(img => getImageUrl(img))
        : [getImageUrl(product.image)];

    const nextImage = () => setSelectedImage(p => (p + 1) % images.length);
    const prevImage = () => setSelectedImage(p => (p - 1 + images.length) % images.length);

    const discount  = product.promo > 0 ? product.promo : 0;
    const oldPrice  = discount > 0 ? Math.round(product.price / (1 - discount / 100)) : null;
    const inStock   = product.stock > 0;

    const handleAddToCart = () => {
        addToCart(product, quantity);
        toast.success('✅ Ajouté au panier !');
    };

    return (
        <MainLayout>
            <SEO
                title={product.name}
                description={`Acheter ${product.name} sur Electro-05. ${product.description?.slice(0, 120) || ''}`}
                image={images[0]}
                type="product"
                product={{
                    id: product.id,
                    name: product.name,
                    description: product.description,
                    price: product.price,
                    stock: product.stock,
                    brand: product.brand,
                    rating: product.average_rating,
                    reviewCount: product.reviews_count,
                }}
                breadcrumbs={[
                    { name: 'Boutique', url: '/shop' },
                    ...(product.category ? [{ name: product.category.name, url: `/shop?category=${product.category.id}` }] : []),
                    { name: product.name, url: `/product/${product.id}` },
                ]}
            />

            {/* ── Lightbox ───────────────────────────────────────────────── */}
            {lightbox && (
                <div
                    className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-4"
                    onClick={() => setLightbox(false)}
                >
                    <button className="absolute top-5 right-5 text-white/70 hover:text-white transition-colors" onClick={() => setLightbox(false)}>
                        <X size={32} />
                    </button>
                    {images.length > 1 && <>
                        <button className="absolute left-4 text-white/70 hover:text-white transition-colors" onClick={e => { e.stopPropagation(); prevImage(); }}>
                            <ChevronLeft size={40} />
                        </button>
                        <button className="absolute right-4 text-white/70 hover:text-white transition-colors" onClick={e => { e.stopPropagation(); nextImage(); }}>
                            <ChevronRight size={40} />
                        </button>
                    </>}
                    <img
                        src={images[selectedImage]}
                        alt={product.name}
                        className="max-w-full max-h-[90vh] object-contain"
                        onClick={e => e.stopPropagation()}
                    />
                    <div className="absolute bottom-5 text-white/50 text-sm font-medium">
                        {selectedImage + 1} / {images.length}
                    </div>
                </div>
            )}

            <div className="bg-white dark:bg-gray-900 min-h-[calc(100vh-4rem)] transition-colors">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

                    {/* ── Breadcrumb ─────────────────────────────────────── */}
                    <Breadcrumb
                        items={[
                            { label: 'Boutique', href: '/shop' },
                            ...(product.category ? [{ label: product.category.name, href: `/shop?category=${product.category.id}` }] : []),
                            { label: product.name },
                        ]}
                        className="mb-8"
                    />

                    {/* ── Main grid ──────────────────────────────────────── */}
                    <div className="lg:grid lg:grid-cols-2 lg:gap-x-14 xl:gap-x-20">

                        {/* ── Image Gallery ──────────────────────────────── */}
                        <div className="mb-10 lg:mb-0">
                            {/* Main image */}
                            <div className="relative aspect-square bg-gray-50 dark:bg-gray-800 rounded-3xl overflow-hidden border border-gray-100 dark:border-white/5 shadow-sm group cursor-zoom-in mb-4"
                                onClick={() => setLightbox(true)}>

                                {discount > 0 && (
                                    <div className="absolute top-5 left-5 z-10 bg-red-500 text-white text-xs font-black px-3 py-1.5 rounded-full shadow-lg">
                                        -{discount}%
                                    </div>
                                )}

                                {/* Action buttons */}
                                <div className="absolute top-5 right-5 z-10 flex flex-col gap-2.5">
                                    <button
                                        onClick={e => { e.stopPropagation(); toggle(product); }}
                                        className={`p-2.5 backdrop-blur-md rounded-2xl shadow-xl transition-all duration-300 ${
                                            isWishlisted
                                                ? 'bg-red-500 text-white scale-110'
                                                : 'bg-white/90 dark:bg-gray-800/90 text-gray-400 hover:text-red-500 hover:bg-white dark:hover:bg-gray-700'
                                        }`}
                                    >
                                        <Heart size={20} fill={isWishlisted ? 'currentColor' : 'none'} />
                                    </button>
                                    <button
                                        onClick={e => { e.stopPropagation(); setLightbox(true); }}
                                        className="p-2.5 bg-white/90 dark:bg-gray-800/90 backdrop-blur-md rounded-2xl text-gray-400 hover:text-gray-900 dark:hover:text-white shadow-xl transition-all duration-300"
                                    >
                                        <ZoomIn size={20} />
                                    </button>
                                    <button
                                        onClick={e => {
                                            e.stopPropagation();
                                            navigator.clipboard?.writeText(window.location.href);
                                            toast.success('Lien copié !');
                                        }}
                                        className="p-2.5 bg-white/90 dark:bg-gray-800/90 backdrop-blur-md rounded-2xl text-gray-400 hover:text-gray-900 dark:hover:text-white shadow-xl transition-all duration-300"
                                    >
                                        <Share2 size={20} />
                                    </button>
                                </div>

                                <img
                                    ref={imageRef}
                                    src={images[selectedImage]}
                                    alt={product.name}
                                    className="w-full h-full object-contain p-8 transition-transform duration-700 group-hover:scale-105"
                                    loading="eager"
                                />

                                {/* Arrow nav on hover */}
                                {images.length > 1 && (
                                    <>
                                        <button
                                            onClick={e => { e.stopPropagation(); prevImage(); }}
                                            className="absolute left-3 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-white/80 dark:bg-gray-800/80 p-2 rounded-xl shadow-lg"
                                        >
                                            <ChevronLeft size={18} />
                                        </button>
                                        <button
                                            onClick={e => { e.stopPropagation(); nextImage(); }}
                                            className="absolute right-3 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-white/80 dark:bg-gray-800/80 p-2 rounded-xl shadow-lg"
                                        >
                                            <ChevronRight size={18} />
                                        </button>
                                    </>
                                )}
                            </div>

                            {/* Thumbnail strip */}
                            <div className="flex gap-3 overflow-x-auto scrollbar-hide pb-1">
                                {images.map((img, idx) => (
                                    <button
                                        key={idx}
                                        onClick={() => setSelectedImage(idx)}
                                        className={`flex-shrink-0 w-16 h-16 rounded-2xl bg-gray-50 dark:bg-gray-800 border-2 transition-all duration-200 overflow-hidden ${
                                            selectedImage === idx
                                                ? 'border-blue-500 ring-4 ring-blue-500/20 scale-105'
                                                : 'border-transparent hover:border-gray-300 dark:hover:border-gray-600'
                                        }`}
                                    >
                                        <img src={img} alt="" className="w-full h-full object-contain p-1.5" />
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* ── Product Info ────────────────────────────────── */}
                        <div className="flex flex-col">
                            {/* Brand / category */}
                            {product.category && (
                                <Link
                                    to={`/shop?category=${product.category.id}`}
                                    className="text-xs font-black text-blue-500 uppercase tracking-widest mb-3 hover:underline"
                                >
                                    {product.category.name}
                                </Link>
                            )}

                            <h1 ref={titleRef} className="text-3xl xl:text-4xl font-black text-gray-900 dark:text-white leading-tight mb-4">
                                {product.name}
                            </h1>

                            {/* Rating row */}
                            <div className="flex items-center gap-4 mb-6">
                                <div className="flex">
                                    {[1,2,3,4,5].map(s => (
                                        <Star key={s} size={16}
                                            className={s <= Math.round(product.average_rating || 4) ? 'text-amber-400 fill-amber-400' : 'text-gray-300 dark:text-gray-600'}
                                        />
                                    ))}
                                </div>
                                <span className="text-sm text-gray-400 font-medium">
                                    {product.average_rating || '4.2'} ({product.reviews_count || 0} avis)
                                </span>
                                <span className={`text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest ${
                                    inStock ? 'bg-emerald-100 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-400' : 'bg-red-100 dark:bg-red-500/20 text-red-700 dark:text-red-400'
                                }`}>
                                    {inStock ? `En Stock (${product.stock})` : 'Épuisé'}
                                </span>
                            </div>

                            {/* Price card */}
                            <div className="mb-6 p-6 rounded-3xl bg-gray-900 dark:bg-gray-800 text-white relative overflow-hidden shadow-2xl">
                                <div className="absolute -right-8 -bottom-8 opacity-10">
                                    <ShieldCheck size={160} />
                                </div>
                                <div className="relative z-10">
                                    <div className="flex items-baseline gap-4 mb-2">
                                        <span className="text-4xl xl:text-5xl font-black">
                                            {parseFloat(product.price).toLocaleString('fr-MA')} DH
                                        </span>
                                        {oldPrice && (
                                            <span className="text-xl text-gray-500 line-through font-medium">
                                                {oldPrice.toLocaleString('fr-MA')} DH
                                            </span>
                                        )}
                                    </div>
                                    {discount > 0 && (
                                        <div className="inline-flex items-center gap-1.5 bg-red-500/20 text-red-400 text-sm font-black px-3 py-1 rounded-full">
                                            Économisez {(oldPrice - product.price).toLocaleString('fr-MA')} DH
                                        </div>
                                    )}
                                    <div className="flex items-center gap-2 text-blue-400 font-bold text-sm mt-3">
                                        <ShieldCheck size={16} />
                                        Garantie Premium Electro-05 Incluse
                                    </div>
                                </div>
                            </div>

                            {/* Delivery estimator */}
                            <div className="mb-6 p-5 rounded-2xl bg-blue-50 dark:bg-blue-500/5 border border-blue-100 dark:border-blue-500/20">
                                <div className="flex items-center justify-between mb-3">
                                    <h4 className="font-bold text-gray-900 dark:text-white flex items-center gap-2 text-sm">
                                        <Truck size={18} className="text-blue-500" />
                                        Estimation Livraison
                                    </h4>
                                    <select
                                        className="bg-white dark:bg-gray-800 border border-blue-200 dark:border-blue-500/30 rounded-xl px-3 py-1.5 text-sm font-bold text-blue-600 dark:text-blue-400 focus:outline-none cursor-pointer"
                                        onChange={e => setSelectedCity(DELIVERY_DATA.find(c => c.city === e.target.value))}
                                        value={selectedCity.city}
                                    >
                                        {DELIVERY_DATA.map(c => <option key={c.city} value={c.city}>{c.city}</option>)}
                                    </select>
                                </div>
                                <div className="grid grid-cols-2 gap-3">
                                    <div className="bg-white dark:bg-gray-800 p-3 rounded-xl flex items-center justify-between border border-blue-50 dark:border-white/5">
                                        <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Frais</span>
                                        <span className="font-black text-emerald-600 dark:text-emerald-400 text-sm">
                                            {selectedCity.price === 0 ? 'Gratuit' : `${selectedCity.price} DH`}
                                        </span>
                                    </div>
                                    <div className="bg-white dark:bg-gray-800 p-3 rounded-xl flex items-center justify-between border border-blue-50 dark:border-white/5">
                                        <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Délai</span>
                                        <span className="font-black text-gray-900 dark:text-white text-sm">{selectedCity.time}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Quantity + Add to cart */}
                            <div className="flex items-stretch gap-3 mb-4">
                                <div className="flex items-center bg-gray-100 dark:bg-gray-800 rounded-2xl p-1">
                                    <button
                                        onClick={() => setQuantity(q => Math.max(1, q - 1))}
                                        className="w-11 h-11 flex items-center justify-center rounded-xl hover:bg-white dark:hover:bg-gray-700 transition-all font-black text-xl text-gray-400 hover:text-gray-900 dark:hover:text-white"
                                    >−</button>
                                    <span className="w-10 text-center font-black text-lg text-gray-900 dark:text-white">{quantity}</span>
                                    <button
                                        onClick={() => setQuantity(q => q + 1)}
                                        className="w-11 h-11 flex items-center justify-center rounded-xl hover:bg-white dark:hover:bg-gray-700 transition-all font-black text-xl text-gray-400 hover:text-gray-900 dark:hover:text-white"
                                    >+</button>
                                </div>
                                <button
                                    onClick={handleAddToCart}
                                    disabled={!inStock}
                                    className="flex-1 bg-gray-900 dark:bg-gray-700 hover:bg-blue-600 dark:hover:bg-blue-600 disabled:opacity-50 text-white font-black text-base rounded-2xl transition-all shadow-xl"
                                >
                                    {inStock ? 'Ajouter au Panier' : 'Épuisé'}
                                </button>
                            </div>

                            <button
                                onClick={handleAddToCart}
                                disabled={!inStock}
                                className="w-full bg-gradient-to-r from-primary to-secondary text-white py-5 rounded-2xl font-black text-lg transition-all shadow-xl shadow-primary/20 mb-6 hover:opacity-90 disabled:opacity-50"
                            >
                                Commander Maintenant
                            </button>

                            {/* Trust badges */}
                            <div className="grid grid-cols-3 gap-3 border-t border-gray-100 dark:border-white/5 pt-6">
                                <Feature icon={<Truck size={22} className="text-blue-500" />} title="Expédition Rapide" desc="Toute l'Algérie" />
                                <Feature icon={<ShieldCheck size={22} className="text-green-500" />} title="100% Original" desc="Certifié Algérie" />
                                <Feature icon={<RotateCcw size={22} className="text-orange-500" />} title="Retours" desc="Sous 7 Jours" />
                            </div>
                        </div>
                    </div>

                    {/* ── Description / Specs Tabs ──────────────────────── */}
                    <div className="mt-16">
                        <div className="border-b border-gray-200 dark:border-gray-700 mb-8 flex gap-2">
                            {['description', 'specs'].map(t => (
                                <button
                                    key={t}
                                    onClick={() => setTab(t)}
                                    className={`pb-3 px-5 text-sm font-black uppercase tracking-widest transition-all border-b-2 -mb-px ${
                                        tab === t
                                            ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                                            : 'border-transparent text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'
                                    }`}
                                >
                                    {t === 'description' ? 'Description' : 'Caractéristiques'}
                                </button>
                            ))}
                        </div>

                        {tab === 'description' && (
                            <div className="prose dark:prose-invert max-w-none text-gray-600 dark:text-gray-300 leading-relaxed">
                                {product.description
                                    ? product.description.split('\n').map((p, i) => <p key={i}>{p}</p>)
                                    : <p className="text-gray-400 italic">Aucune description disponible.</p>
                                }
                            </div>
                        )}

                        {tab === 'specs' && (
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                {[
                                    ['Référence', `ELEC-${product.id}`],
                                    ['Marque', product.brand || 'N/A'],
                                    ['Catégorie', product.category?.name || 'N/A'],
                                    ['Stock disponible', product.stock || 0],
                                    ['État', product.state || 'Neuf'],
                                    ['Livraison', product.delivery_type || 'Standard'],
                                ].map(([key, val]) => (
                                    <div key={key} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800/50 rounded-2xl border border-gray-100 dark:border-white/5">
                                        <span className="text-xs font-black text-gray-400 uppercase tracking-widest">{key}</span>
                                        <span className="font-bold text-gray-900 dark:text-white text-sm">{val}</span>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* ── Reviews Section ────────────────────────────────── */}
                    <ReviewSection productId={id} />

                    {/* ── Related Products ───────────────────────────────── */}
                    <RelatedProducts productId={id} categoryId={product.category?.id} />

                </div>
            </div>
        </MainLayout>
    );
};

const Feature = ({ icon, title, desc }) => (
    <div className="flex flex-col items-center text-center gap-2 p-3">
        <div className="w-12 h-12 rounded-2xl bg-gray-50 dark:bg-gray-800 flex items-center justify-center transition-colors">
            {icon}
        </div>
        <div>
            <p className="font-black text-xs text-gray-900 dark:text-white">{title}</p>
            <p className="text-[11px] text-gray-400 font-medium mt-0.5">{desc}</p>
        </div>
    </div>
);

export default ProductDetail;
