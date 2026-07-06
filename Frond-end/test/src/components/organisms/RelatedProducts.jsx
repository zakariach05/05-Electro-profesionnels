import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { API_URL } from '../../services/api';
import { Link } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';
import { ShoppingCart, Heart, Star, ArrowRight, Zap } from 'lucide-react';
import toast from 'react-hot-toast';
import { getImageUrl } from '../../services/image';

const RelatedProducts = ({ productId, categoryId }) => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading]   = useState(true);

    const { addToCart }         = useCart();
    const { wishlistIds, toggle } = useWishlist();

    useEffect(() => {
        if (!categoryId) return;
        const fetch = async () => {
            setLoading(true);
            try {
                const { data } = await axios.get(`${API_URL}/products`, {
                    params: { category_id: categoryId, limit: 8 }
                });
                const items = (data.data || data).filter(p => p.id !== parseInt(productId)).slice(0, 4);
                setProducts(items);
            } catch {}
            finally { setLoading(false); }
        };
        fetch();
    }, [productId, categoryId]);

    if (!loading && products.length === 0) return null;

    return (
        <section className="mt-16">
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
                <h2 className="text-2xl font-black text-gray-900 dark:text-white flex items-center gap-3">
                    <Zap className="text-amber-500" size={24} />
                    Produits similaires
                </h2>
                {categoryId && (
                    <Link
                        to={`/shop?category=${categoryId}`}
                        className="flex items-center gap-1 text-blue-500 hover:text-blue-700 text-sm font-bold transition-colors"
                    >
                        Voir tout <ArrowRight size={16} />
                    </Link>
                )}
            </div>

            {/* Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {loading
                    ? [...Array(4)].map((_, i) => (
                        <div key={i} className="bg-gray-100 dark:bg-gray-800 rounded-2xl overflow-hidden animate-pulse">
                            <div className="aspect-square bg-gray-200 dark:bg-gray-700" />
                            <div className="p-4 space-y-2">
                                <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-3/4" />
                                <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2" />
                                <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded-xl mt-3" />
                            </div>
                        </div>
                    ))
                    : products.map(product => {
                        const isWished = wishlistIds.includes(product.id);
                        const inStock  = product.stock > 0;

                        return (
                            <div
                                key={product.id}
                                className="group bg-white dark:bg-gray-800/50 rounded-2xl border border-gray-100 dark:border-white/5 overflow-hidden hover:border-blue-200 dark:hover:border-blue-500/20 hover:shadow-lg dark:hover:shadow-blue-500/5 transition-all duration-300"
                            >
                                {/* Image */}
                                <Link to={`/product/${product.id}`} className="block aspect-square overflow-hidden bg-gray-50 dark:bg-gray-800 relative">
                                    <img
                                        src={getImageUrl(product.image)}
                                        alt={product.name}
                                        className="w-full h-full object-contain p-4 group-hover:scale-105 transition-transform duration-500"
                                        loading="lazy"
                                        onError={e => { e.target.src = '/placeholder.png'; }}
                                    />
                                    {/* Wishlist btn */}
                                    <button
                                        onClick={e => { e.preventDefault(); toggle(product); }}
                                        className={`absolute top-3 right-3 w-8 h-8 rounded-xl flex items-center justify-center transition-all ${
                                            isWished
                                                ? 'bg-red-500 text-white shadow-lg'
                                                : 'bg-white/80 dark:bg-gray-800/80 text-gray-400 hover:text-red-500 backdrop-blur-sm'
                                        }`}
                                    >
                                        <Heart size={14} fill={isWished ? 'currentColor' : 'none'} />
                                    </button>
                                    {!inStock && (
                                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                                            <span className="bg-white text-gray-900 text-xs font-black px-3 py-1 rounded-full">Épuisé</span>
                                        </div>
                                    )}
                                </Link>

                                {/* Info */}
                                <div className="p-4">
                                    <Link to={`/product/${product.id}`}>
                                        <h3 className="font-bold text-gray-900 dark:text-white text-sm line-clamp-2 mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                                            {product.name}
                                        </h3>
                                    </Link>

                                    {/* Stars placeholder */}
                                    <div className="flex items-center gap-1 mb-3">
                                        {[1,2,3,4,5].map(s => (
                                            <Star key={s} size={10} className={`${s <= 4 ? 'text-amber-400 fill-amber-400' : 'text-gray-300'}`} />
                                        ))}
                                    </div>

                                    <div className="flex items-center justify-between gap-2">
                                        <span className="text-lg font-black text-gray-900 dark:text-white">
                                            {parseFloat(product.price).toLocaleString('fr-MA')} DH
                                        </span>
                                    </div>

                                    <button
                                        onClick={() => {
                                            if (!inStock) return;
                                            addToCart(product);
                                            toast.success('Ajouté au panier !');
                                        }}
                                        disabled={!inStock}
                                        className="w-full mt-3 py-2.5 bg-gray-900 dark:bg-blue-600 hover:bg-blue-600 dark:hover:bg-blue-700 disabled:opacity-40 text-white text-xs font-black rounded-xl transition-all flex items-center justify-center gap-1.5"
                                    >
                                        <ShoppingCart size={14} />
                                        {inStock ? 'Ajouter' : 'Épuisé'}
                                    </button>
                                </div>
                            </div>
                        );
                    })
                }
            </div>
        </section>
    );
};

export default RelatedProducts;
