import React from 'react';
import MainLayout from '../layouts/MainLayout';
import SEO from '../components/atoms/SEO';
import { useWishlist } from '../context/WishlistContext';
import { useCart } from '../context/CartContext';
import { Link } from 'react-router-dom';
import { Heart, ShoppingCart, Trash2, X, Star, ArrowRight, Package } from 'lucide-react';
import { getImageUrl } from '../services/image';
import toast from 'react-hot-toast';

const Wishlist = () => {
    const { wishlist, toggle, clearWishlist, loading } = useWishlist();
    const { addToCart, addItem } = useCart();

    const handleAddToCart = (product) => {
        const addFn = addToCart || addItem;
        if (addFn) addFn(product);
        toast.success('✅ Ajouté au panier !');
    };

    const handleMoveAllToCart = () => {
        wishlist.forEach(p => handleAddToCart(p));
        wishlist.forEach(p => toggle(p));
        toast.success(`${wishlist.length} articles ajoutés au panier !`);
    };

    return (
        <MainLayout>
            <SEO
                title="Ma Liste de Souhaits"
                description="Retrouvez tous vos produits favoris sur Electro-05."
            />

            <div className="min-h-[80vh] bg-gray-50 dark:bg-gray-900 transition-colors">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">

                    {/* Header */}
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <h1 className="text-3xl font-black text-gray-900 dark:text-white flex items-center gap-3">
                                <Heart className="text-red-500 fill-red-500" size={28} />
                                Ma Liste de Souhaits
                            </h1>
                            <p className="text-gray-400 mt-1 text-sm font-medium">
                                {wishlist.length} {wishlist.length === 1 ? 'article sauvegardé' : 'articles sauvegardés'}
                            </p>
                        </div>

                        {wishlist.length > 0 && (
                            <div className="flex items-center gap-3">
                                <button
                                    onClick={handleMoveAllToCart}
                                    className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm rounded-2xl transition-all shadow-lg shadow-blue-500/20"
                                >
                                    <ShoppingCart size={16} />
                                    Tout au panier
                                </button>
                                <button
                                    onClick={clearWishlist}
                                    className="flex items-center gap-2 px-5 py-2.5 border-2 border-red-100 dark:border-red-500/20 text-red-500 font-bold text-sm rounded-2xl hover:bg-red-50 dark:hover:bg-red-500/10 transition-all"
                                >
                                    <Trash2 size={16} />
                                    Tout supprimer
                                </button>
                            </div>
                        )}
                    </div>

                    {/* Empty State */}
                    {!loading && wishlist.length === 0 && (
                        <div className="flex flex-col items-center justify-center py-24 text-center">
                            <div className="w-24 h-24 bg-red-50 dark:bg-red-500/10 rounded-full flex items-center justify-center mb-6">
                                <Heart className="text-red-300 dark:text-red-400" size={40} />
                            </div>
                            <h2 className="text-2xl font-black text-gray-900 dark:text-white mb-2">Votre liste est vide</h2>
                            <p className="text-gray-400 mb-8 max-w-sm">
                                Explorez notre boutique et ajoutez vos produits préférés pour les retrouver facilement.
                            </p>
                            <Link
                                to="/shop"
                                className="inline-flex items-center gap-2 px-8 py-4 bg-gray-900 dark:bg-blue-600 hover:bg-blue-600 dark:hover:bg-blue-700 text-white font-black rounded-2xl transition-all shadow-xl"
                            >
                                <Package size={20} />
                                Explorer la boutique
                                <ArrowRight size={18} />
                            </Link>
                        </div>
                    )}

                    {/* Loading skeletons */}
                    {loading && (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                            {[1,2,3,4].map(i => (
                                <div key={i} className="bg-white dark:bg-gray-800 rounded-3xl overflow-hidden animate-pulse">
                                    <div className="aspect-square bg-gray-200 dark:bg-gray-700" />
                                    <div className="p-5 space-y-3">
                                        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4" />
                                        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2" />
                                        <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded-2xl mt-2" />
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Product Grid */}
                    {!loading && wishlist.length > 0 && (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                            {wishlist.map(product => {
                                const inStock = product.stock > 0;
                                return (
                                    <div
                                        key={product.id}
                                        className="group bg-white dark:bg-gray-800/80 rounded-3xl overflow-hidden border border-gray-100 dark:border-white/5 hover:border-blue-200 dark:hover:border-blue-500/20 hover:shadow-xl dark:hover:shadow-blue-500/5 transition-all duration-300 animate-fade-up"
                                    >
                                        {/* Remove button */}
                                        <button
                                            onClick={() => toggle(product)}
                                            className="absolute top-4 right-4 z-10 w-8 h-8 bg-white/90 dark:bg-gray-700/90 backdrop-blur-sm rounded-xl flex items-center justify-center text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition-all opacity-0 group-hover:opacity-100 shadow-lg"
                                        >
                                            <X size={14} />
                                        </button>

                                        {/* Image */}
                                        <Link to={`/product/${product.id}`} className="block relative aspect-square bg-gray-50 dark:bg-gray-900 overflow-hidden">
                                            <img
                                                src={getImageUrl(product.image)}
                                                alt={product.name}
                                                className="w-full h-full object-contain p-6 group-hover:scale-105 transition-transform duration-500"
                                                loading="lazy"
                                                onError={e => { e.target.src = '/placeholder.png'; }}
                                            />
                                            {!inStock && (
                                                <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                                                    <span className="bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-xs font-black px-4 py-2 rounded-full">Épuisé</span>
                                                </div>
                                            )}
                                        </Link>

                                        {/* Info */}
                                        <div className="p-5">
                                            {product.category?.name && (
                                                <p className="text-xs font-black text-blue-500 uppercase tracking-widest mb-1">{product.category.name}</p>
                                            )}
                                            <Link to={`/product/${product.id}`}>
                                                <h3 className="font-bold text-gray-900 dark:text-white text-sm line-clamp-2 mb-3 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors leading-snug">
                                                    {product.name}
                                                </h3>
                                            </Link>

                                            {/* Stars */}
                                            <div className="flex items-center gap-1 mb-3">
                                                {[1,2,3,4,5].map(s => (
                                                    <Star key={s} size={11} className={s <= 4 ? 'text-amber-400 fill-amber-400' : 'text-gray-300 dark:text-gray-600'} />
                                                ))}
                                                <span className="text-xs text-gray-400 ml-1">4.0</span>
                                            </div>

                                            <div className="flex items-center justify-between mb-4">
                                                <span className="text-xl font-black text-gray-900 dark:text-white">
                                                    {parseFloat(product.price).toLocaleString('fr-MA')} DH
                                                </span>
                                                {product.promo > 0 && (
                                                    <span className="text-xs bg-red-100 dark:bg-red-500/20 text-red-600 dark:text-red-400 font-black px-2 py-0.5 rounded-full">
                                                        -{product.promo}%
                                                    </span>
                                                )}
                                            </div>

                                            <div className="flex gap-2">
                                                <button
                                                    onClick={() => handleAddToCart(product)}
                                                    disabled={!inStock}
                                                    className="flex-1 flex items-center justify-center gap-1.5 py-3 bg-gray-900 dark:bg-blue-600 hover:bg-blue-600 dark:hover:bg-blue-700 disabled:opacity-40 text-white text-xs font-black rounded-2xl transition-all"
                                                >
                                                    <ShoppingCart size={14} />
                                                    {inStock ? 'Ajouter' : 'Épuisé'}
                                                </button>
                                                <button
                                                    onClick={() => toggle(product)}
                                                    className="w-10 h-10 flex items-center justify-center rounded-2xl border-2 border-gray-100 dark:border-gray-700 text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 hover:border-red-200 dark:hover:border-red-500/30 transition-all"
                                                >
                                                    <Heart size={15} fill="currentColor" />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            </div>
        </MainLayout>
    );
};

export default Wishlist;
