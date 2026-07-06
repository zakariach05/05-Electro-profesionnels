import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { API_URL } from '../services/api';
import { useAuth } from './AuthContext';
import toast from 'react-hot-toast';

const WishlistContext = createContext();

export const WishlistProvider = ({ children }) => {
    const { user, token } = useAuth();

    // Full product objects for display
    const [wishlist, setWishlist] = useState([]);
    // Just IDs for quick O(1) lookup
    const [wishlistIds, setWishlistIds] = useState(new Set());
    const [loading, setLoading] = useState(false);

    // ── Sync with backend when user logs in ──────────────────────────────────
    useEffect(() => {
        if (user && token) {
            fetchWishlist();
        } else {
            // Clear on logout
            setWishlist([]);
            setWishlistIds(new Set());
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [user, token]);

    const fetchWishlist = async () => {
        setLoading(true);
        try {
            const { data } = await axios.get(`${API_URL}/wishlist`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setWishlist(data);
            setWishlistIds(new Set(data.map(p => p.id)));
        } catch (err) {
            console.error('Wishlist fetch error:', err);
        } finally {
            setLoading(false);
        }
    };

    /**
     * Toggle product in wishlist.
     * If logged in → backend API; else → local state with toast to login.
     */
    const toggle = useCallback(async (product) => {
        if (!user) {
            toast.error('Connectez-vous pour utiliser la liste de souhaits');
            return;
        }

        const wasInWishlist = wishlistIds.has(product.id);

        // Optimistic update
        if (wasInWishlist) {
            setWishlist(prev => prev.filter(p => p.id !== product.id));
            setWishlistIds(prev => { const s = new Set(prev); s.delete(product.id); return s; });
        } else {
            setWishlist(prev => [...prev, product]);
            setWishlistIds(prev => new Set([...prev, product.id]));
        }

        try {
            const { data } = await axios.post(
                `${API_URL}/wishlist/toggle`,
                { product_id: product.id },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            if (data.added) {
                toast.success('❤️ Ajouté aux souhaits');
            } else {
                toast.success('Retiré des souhaits');
            }
        } catch (err) {
            // Rollback on error
            if (wasInWishlist) {
                setWishlist(prev => [...prev, product]);
                setWishlistIds(prev => new Set([...prev, product.id]));
            } else {
                setWishlist(prev => prev.filter(p => p.id !== product.id));
                setWishlistIds(prev => { const s = new Set(prev); s.delete(product.id); return s; });
            }
            toast.error('Erreur lors de la mise à jour');
        }
    }, [user, token, wishlistIds]);

    const isInWishlist = useCallback((id) => wishlistIds.has(id), [wishlistIds]);

    const clearWishlist = useCallback(async () => {
        if (!user) return;
        try {
            await axios.delete(`${API_URL}/wishlist`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setWishlist([]);
            setWishlistIds(new Set());
            toast.success('Liste de souhaits vidée');
        } catch { toast.error('Erreur'); }
    }, [user, token]);

    return (
        <WishlistContext.Provider value={{
            wishlist,
            wishlistIds: [...wishlistIds], // array for components that need to iterate
            loading,
            toggle,
            isInWishlist,
            clearWishlist,
            fetchWishlist,
            count: wishlist.length,
        }}>
            {children}
        </WishlistContext.Provider>
    );
};

export const useWishlist = () => useContext(WishlistContext);
