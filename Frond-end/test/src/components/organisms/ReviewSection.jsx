import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { API_URL } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { Star, ThumbsUp, ShieldCheck, MessageSquare, Send, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';

// ─── Star Rating Component ─────────────────────────────────────────────────────
const StarRating = ({ value, onChange, readonly = false, size = 20 }) => (
    <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map(star => (
            <button
                key={star}
                type="button"
                disabled={readonly}
                onClick={() => onChange?.(star)}
                className={`transition-transform ${!readonly ? 'hover:scale-125 cursor-pointer' : 'cursor-default'}`}
            >
                <Star
                    size={size}
                    className={`transition-colors ${star <= value ? 'text-amber-400 fill-amber-400' : 'text-gray-300 dark:text-gray-600'}`}
                />
            </button>
        ))}
    </div>
);

// ─── Rating Distribution Bar ──────────────────────────────────────────────────
const RatingBar = ({ star, count, total }) => (
    <div className="flex items-center gap-2 text-sm">
        <span className="w-4 text-gray-500 text-right font-medium">{star}</span>
        <Star size={12} className="text-amber-400 fill-amber-400 flex-shrink-0" />
        <div className="flex-1 bg-gray-100 dark:bg-gray-700 rounded-full h-2 overflow-hidden">
            <div
                className="h-full bg-amber-400 rounded-full transition-all duration-700"
                style={{ width: total > 0 ? `${(count / total) * 100}%` : '0%' }}
            />
        </div>
        <span className="w-6 text-gray-400 text-xs">{count}</span>
    </div>
);

// ─── Review Card ───────────────────────────────────────────────────────────────
const ReviewCard = ({ review, currentUserId, onDelete }) => (
    <div className="bg-gray-50 dark:bg-gray-800/50 rounded-2xl p-5 border border-gray-100 dark:border-white/5 hover:border-blue-200 dark:hover:border-blue-500/20 transition-all">
        <div className="flex items-start justify-between gap-4 mb-3">
            <div className="flex items-center gap-3">
                {/* Avatar */}
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-black text-sm flex-shrink-0">
                    {review.user.avatar
                        ? <img src={review.user.avatar} alt="" className="w-full h-full rounded-xl object-cover" />
                        : review.user.name.charAt(0).toUpperCase()
                    }
                </div>
                <div>
                    <div className="flex items-center gap-2">
                        <span className="font-bold text-gray-900 dark:text-white text-sm">{review.user.name}</span>
                        {review.verified_purchase && (
                            <span className="flex items-center gap-1 text-xs text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-500/10 px-2 py-0.5 rounded-full font-bold">
                                <ShieldCheck size={10} /> Achat vérifié
                            </span>
                        )}
                    </div>
                    <span className="text-xs text-gray-400">{review.created_at}</span>
                </div>
            </div>
            <StarRating value={review.rating} readonly size={14} />
        </div>

        {review.title && (
            <h4 className="font-bold text-gray-900 dark:text-white mb-1 text-sm">{review.title}</h4>
        )}
        {review.body && (
            <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">{review.body}</p>
        )}

        {currentUserId && review.user && (
            <button
                onClick={() => onDelete(review.id)}
                className="mt-3 text-xs text-red-400 hover:text-red-600 transition-colors"
            >
                Supprimer
            </button>
        )}
    </div>
);

// ─── Main ReviewSection Component ─────────────────────────────────────────────
const ReviewSection = ({ productId }) => {
    const { user, token } = useAuth();

    const [reviews, setReviews] = useState([]);
    const [stats, setStats]     = useState({ average: 0, count: 0, by_star: {} });
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);

    const [form, setForm] = useState({ rating: 0, title: '', body: '' });
    const [hoverRating, setHoverRating] = useState(0);
    const [showForm, setShowForm] = useState(false);

    useEffect(() => { fetchReviews(); }, [productId]);

    const fetchReviews = async () => {
        setLoading(true);
        try {
            const { data } = await axios.get(`${API_URL}/products/${productId}/reviews`);
            setReviews(data.reviews);
            setStats(data.stats);
        } catch {}
        finally { setLoading(false); }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!form.rating) { toast.error('Veuillez choisir une note'); return; }
        setSubmitting(true);
        try {
            await axios.post(`${API_URL}/products/${productId}/reviews`, form, {
                headers: { Authorization: `Bearer ${token}` }
            });
            toast.success('Votre avis a été publié !');
            setForm({ rating: 0, title: '', body: '' });
            setShowForm(false);
            fetchReviews();
        } catch (err) {
            toast.error(err.response?.data?.message || 'Erreur lors de la soumission');
        } finally { setSubmitting(false); }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Supprimer cet avis ?')) return;
        try {
            await axios.delete(`${API_URL}/reviews/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            toast.success('Avis supprimé');
            fetchReviews();
        } catch { toast.error('Erreur'); }
    };

    const totalCount = stats.count || 0;

    return (
        <section className="mt-16">
            {/* Section Header */}
            <div className="flex items-center justify-between mb-8">
                <h2 className="text-2xl font-black text-gray-900 dark:text-white flex items-center gap-3">
                    <MessageSquare className="text-blue-500" size={24} />
                    Avis clients
                    <span className="bg-blue-500/10 text-blue-600 dark:text-blue-400 text-base px-3 py-1 rounded-full font-bold">{totalCount}</span>
                </h2>
                {user && !showForm && (
                    <button
                        onClick={() => setShowForm(true)}
                        className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition-all text-sm shadow-lg shadow-blue-500/20"
                    >
                        <Star size={16} /> Laisser un avis
                    </button>
                )}
            </div>

            {/* Stats Row */}
            {totalCount > 0 && (
                <div className="bg-white dark:bg-gray-800/50 rounded-2xl border border-gray-100 dark:border-white/5 p-6 mb-8 grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Average score */}
                    <div className="flex items-center gap-6">
                        <div className="text-center">
                            <div className="text-6xl font-black text-gray-900 dark:text-white leading-none">{stats.average}</div>
                            <StarRating value={Math.round(stats.average)} readonly size={18} />
                            <div className="text-sm text-gray-400 mt-1">{totalCount} avis</div>
                        </div>
                    </div>
                    {/* Distribution */}
                    <div className="space-y-2">
                        {[5, 4, 3, 2, 1].map(star => (
                            <RatingBar key={star} star={star} count={stats.by_star[star] || 0} total={totalCount} />
                        ))}
                    </div>
                </div>
            )}

            {/* Write Review Form */}
            {showForm && (
                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-500/5 dark:to-indigo-500/5 border-2 border-blue-100 dark:border-blue-500/20 rounded-2xl p-6 mb-8">
                    <h3 className="font-black text-gray-900 dark:text-white mb-5 text-lg">Partagez votre expérience</h3>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        {/* Star Picker */}
                        <div>
                            <label className="text-xs font-black text-gray-500 uppercase tracking-widest block mb-2">Votre note *</label>
                            <div className="flex gap-1">
                                {[1, 2, 3, 4, 5].map(star => (
                                    <button key={star} type="button"
                                        onMouseEnter={() => setHoverRating(star)}
                                        onMouseLeave={() => setHoverRating(0)}
                                        onClick={() => setForm({ ...form, rating: star })}
                                        className="transition-transform hover:scale-125"
                                    >
                                        <Star size={28}
                                            className={`transition-colors ${star <= (hoverRating || form.rating) ? 'text-amber-400 fill-amber-400' : 'text-gray-300 dark:text-gray-600'}`}
                                        />
                                    </button>
                                ))}
                                {form.rating > 0 && (
                                    <span className="ml-2 text-sm text-gray-500 self-center">
                                        {['', 'Très mauvais', 'Mauvais', 'Correct', 'Bien', 'Excellent'][form.rating]}
                                    </span>
                                )}
                            </div>
                        </div>

                        {/* Title */}
                        <div>
                            <label className="text-xs font-black text-gray-500 uppercase tracking-widest block mb-1">Titre (optionnel)</label>
                            <input type="text" maxLength={120}
                                value={form.title} onChange={e => setForm({ ...form, title: e.target.value })}
                                placeholder="Résumez votre expérience..."
                                className="w-full px-4 py-3 bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 focus:border-blue-500 rounded-xl outline-none transition-all text-sm font-medium dark:text-white"
                            />
                        </div>

                        {/* Body */}
                        <div>
                            <label className="text-xs font-black text-gray-500 uppercase tracking-widest block mb-1">Votre avis (optionnel)</label>
                            <textarea rows={4} maxLength={1000}
                                value={form.body} onChange={e => setForm({ ...form, body: e.target.value })}
                                placeholder="Décrivez ce que vous avez aimé ou non, votre utilisation..."
                                className="w-full px-4 py-3 bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 focus:border-blue-500 rounded-xl outline-none transition-all text-sm resize-none dark:text-white"
                            />
                            <div className="text-right text-xs text-gray-400 mt-1">{form.body.length}/1000</div>
                        </div>

                        <div className="flex gap-3">
                            <button type="submit" disabled={submitting || !form.rating}
                                className="flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-black rounded-xl transition-all shadow-lg shadow-blue-500/20">
                                {submitting ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />}
                                Publier mon avis
                            </button>
                            <button type="button" onClick={() => setShowForm(false)}
                                className="px-6 py-3 border-2 border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 font-bold rounded-xl hover:border-gray-400 transition-all">
                                Annuler
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {/* Not logged in prompt */}
            {!user && (
                <div className="bg-blue-50 dark:bg-blue-500/5 border border-blue-100 dark:border-blue-500/20 rounded-2xl p-4 mb-6 text-center text-sm">
                    <span className="text-gray-500 dark:text-gray-400">
                        <a href="/login" className="text-blue-500 font-bold hover:underline">Connectez-vous</a> pour laisser un avis
                    </span>
                </div>
            )}

            {/* Review List */}
            {loading ? (
                <div className="space-y-4">
                    {[1, 2, 3].map(i => (
                        <div key={i} className="bg-gray-100 dark:bg-gray-800 rounded-2xl p-5 animate-pulse">
                            <div className="flex gap-3 mb-3">
                                <div className="w-10 h-10 bg-gray-200 dark:bg-gray-700 rounded-xl" />
                                <div className="flex-1 space-y-2">
                                    <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-32" />
                                    <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-20" />
                                </div>
                            </div>
                            <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-full mb-2" />
                            <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-3/4" />
                        </div>
                    ))}
                </div>
            ) : reviews.length === 0 ? (
                <div className="text-center py-12 text-gray-400">
                    <Star size={40} className="mx-auto mb-3 opacity-30" />
                    <p className="font-medium">Aucun avis pour ce produit</p>
                    <p className="text-sm mt-1">Soyez le premier à partager votre expérience !</p>
                </div>
            ) : (
                <div className="space-y-4">
                    {reviews.map(review => (
                        <ReviewCard
                            key={review.id}
                            review={review}
                            currentUserId={user?.id}
                            onDelete={handleDelete}
                        />
                    ))}
                </div>
            )}
        </section>
    );
};

export default ReviewSection;
