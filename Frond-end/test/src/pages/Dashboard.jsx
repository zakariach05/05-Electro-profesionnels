import React, { useState, useEffect } from 'react';
import AdminLayout from '../layouts/AdminLayout';
import {
    BarChart3, TrendingUp, ShoppingBag, MapPin, DollarSign,
    Plus, History, Users, AlertTriangle, ArrowUpRight, ArrowDownRight,
    ShieldAlert, Zap
} from 'lucide-react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { API_URL } from '../services/api';
import SEO from '../components/atoms/SEO';
import { getImageUrl } from '../services/image';

const SparkBar = ({ data, color = 'bg-blue-500' }) => {
    if (!data?.length) return null;
    const max = Math.max(...data.map(d => d.revenue || d.orders || d || 0), 1);
    const containerH = 48; // h-12 = 48px
    return (
        <div className="flex items-end gap-0.5" style={{ height: `${containerH}px` }}>
            {data.slice(-20).map((d, i) => {
                const val = d.revenue ?? d.orders ?? d ?? 0;
                const h = Math.max(3, (val / max) * containerH);
                return (
                    <div key={i} title={`${val.toLocaleString('fr-MA')} DH`}
                        className={`flex-1 ${color} rounded-t-sm opacity-70 hover:opacity-100 transition-all cursor-pointer`}
                        style={{ height: `${h}px` }} />
                );
            })}
        </div>
    );
};

const StatCard = ({ title, value, icon, color, trend, trendUp, sparkData, sparkColor, subtitle }) => (
    <div className="bg-white dark:bg-gray-800 p-5 rounded-2xl border border-gray-100 dark:border-white/5 shadow-sm hover:shadow-lg transition-all overflow-hidden relative">
        <div className="flex items-start justify-between mb-3">
            <div className={`w-11 h-11 ${color} rounded-xl flex items-center justify-center flex-shrink-0`}>{icon}</div>
            {trend !== undefined && (
                <span className={`text-xs font-black px-2.5 py-1 rounded-full flex items-center gap-1 ${trendUp ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-600'}`}>
                    {trendUp ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}{Math.abs(trend)}%
                </span>
            )}
        </div>
        <p className="text-xs font-black text-gray-400 uppercase tracking-widest mb-1">{title}</p>
        <h3 className="text-2xl font-black text-gray-900 dark:text-white leading-tight">{value}</h3>
        {subtitle && <p className="text-xs text-gray-400 mt-1 font-medium">{subtitle}</p>}
        {sparkData && <div className="mt-3"><SparkBar data={sparkData} color={sparkColor} /></div>}
    </div>
);

const Skeleton = ({ className = '' }) => (
    <div className={`animate-pulse bg-gray-200 dark:bg-gray-700 rounded-xl ${className}`} />
);

const Dashboard = () => {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) { setLoading(false); return; }
        console.log('Fetching stats from:', `${API_URL}/admin/stats`);
        axios.get(`${API_URL}/admin/stats`, { headers: { Authorization: `Bearer ${token}` } })
            .then(r => { console.log('Dashboard stats OK:', r.data); setStats(r.data); })
            .catch(e => { console.error('Dashboard API error:', e.response?.status, e.message, e); setStats({}); })
            .finally(() => setLoading(false));
    }, []);

    const ov = stats?.overview || {};
    const fmt = (n) => (n || 0).toLocaleString('fr-MA');
    const trend = stats?.revenue_trend || [];
    const maxRev = Math.max(...trend.map(d => d.revenue || 0), 1);
    // eslint-disable-next-line no-unused-vars
    const maxOrders = Math.max(...trend.map(d => d.orders || 0), 1);

    if (loading) return (
        <AdminLayout>
            <div className="bg-gray-50 min-h-full py-6">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
                    <Skeleton className="h-40 w-full" />
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                        {[1, 2, 3, 4].map(i => <Skeleton key={i} className="h-32" />)}
                    </div>
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
                        <Skeleton className="h-64 lg:col-span-2" />
                        <Skeleton className="h-64" />
                    </div>
                </div>
            </div>
        </AdminLayout>
    );

    return (
        <AdminLayout>
            <SEO title="Tableau de bord Admin" description="Suivez vos performances de vente en temps réel sur Electro-05." />
            <div className="bg-gray-50 dark:bg-gray-900 min-h-full py-6 transition-colors">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">

                    <div className="bg-gradient-to-r from-gray-900 via-blue-900 to-indigo-900 rounded-3xl p-6 md:p-8 text-white relative overflow-hidden shadow-2xl">
                        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                            <div>
                                <div className="flex items-center gap-2 mb-2">
                                    <Zap size={18} className="text-yellow-400" />
                                    <span className="text-white/60 text-sm font-medium">Tableau de bord</span>
                                </div>
                                <h1 className="text-3xl font-black mb-1">Bon retour, Admin !</h1>
                                <p className="text-white/70 font-medium">
                                    {ov.daily_orders || 0} commandes aujourd'hui -
                                    Croissance {ov.growth >= 0 ? '+' : ''}{ov.growth || 0}% ce mois
                                </p>
                            </div>
                            <div className="flex gap-3">
                                <Link to="/admin/products/new" className="flex items-center gap-2 bg-white text-gray-900 px-5 py-2.5 rounded-2xl font-bold hover:bg-gray-100 transition-all shadow-xl text-sm">
                                    <Plus size={16} /> Nouveau produit
                                </Link>
                                <Link to="/admin/orders" className="flex items-center gap-2 bg-white/10 border border-white/20 text-white px-5 py-2.5 rounded-2xl font-bold hover:bg-white/20 transition-all text-sm">
                                    <ShoppingBag size={16} /> Commandes
                                </Link>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                        <StatCard title="Chiffre d'Affaires" value={`${fmt(ov.total_revenue)} DH`}
                            icon={<DollarSign size={20} className="text-green-600" />} color="bg-green-100"
                            trend={ov.growth} trendUp={ov.growth >= 0}
                            subtitle={`Ce mois: ${fmt(ov.this_month)} DH`}
                            sparkData={stats?.revenue_trend} sparkColor="bg-green-400" />
                        <StatCard title="Commandes" value={fmt(ov.total_orders)}
                            icon={<ShoppingBag size={20} className="text-blue-600" />} color="bg-blue-100"
                            subtitle={`Aujourd'hui: ${ov.daily_orders || 0}`}
                            sparkData={stats?.revenue_trend} sparkColor="bg-blue-400" />
                        <StatCard title="Clients" value={fmt(ov.total_users)}
                            icon={<Users size={20} className="text-purple-600" />} color="bg-purple-100"
                            subtitle="Comptes vérifiés" />
                        <StatCard title="Stock Critique" value={ov.low_stock || 0}
                            icon={<AlertTriangle size={20} className="text-orange-600" />} color="bg-orange-100"
                            subtitle={`${ov.out_of_stock || 0} épuisés`} trendUp={false} />
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
                        <div className="lg:col-span-2 bg-white dark:bg-gray-800 p-6 rounded-2xl border border-gray-100 dark:border-white/5 shadow-sm">
                            <div className="flex items-center justify-between mb-5">
                                <div>
                                    <h2 className="text-lg font-black text-gray-900 dark:text-white flex items-center gap-2">
                                        <BarChart3 size={20} className="text-blue-500" /> Tendance Revenue
                                    </h2>
                                    <p className="text-xs text-gray-400 mt-0.5">30 derniers jours</p>
                                </div>
                            </div>
                            <div className="bg-gray-50 dark:bg-gray-900/50 rounded-xl p-4">
                                {trend.length > 0 ? (
                                    <div className="space-y-4">
                                        <div className="relative flex items-end gap-1" style={{ height: '192px' }}>
                                            {trend.slice(-30).map((d, i) => {
                                                const rev = d.revenue || 0;
                                                const barH = Math.max(3, (rev / maxRev) * 192);
                                                return (
                                                    <div key={i} className="flex-1 flex flex-col justify-end items-center group relative" style={{ height: '192px' }}>
                                                        <div className="absolute bottom-full mb-1 bg-gray-900 text-white text-[10px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition whitespace-nowrap z-10 shadow-lg pointer-events-none">
                                                            {d.date} : {rev.toLocaleString('fr-MA')} DH
                                                        </div>
                                                        <div className="w-full rounded-t-sm bg-blue-500 group-hover:bg-blue-600 transition-colors"
                                                            style={{ height: `${barH}px` }} />
                                                        {i % 7 === 0 && <span className="absolute bottom-0 translate-y-full text-[8px] text-gray-400 mt-1">{d.date.slice(5)}</span>}
                                                    </div>
                                                );
                                            })}
                                        </div>
                                        <div className="flex items-center justify-between text-[10px] text-gray-400 font-medium">
                                            <span>CA Total: {fmt(ov.total_revenue)} DH</span>
                                            <span className="flex items-center gap-4">
                                                <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-sm bg-blue-500 inline-block" /> Revenus</span>
                                                <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-sm bg-gray-300 inline-block" /> 0 DH</span>
                                            </span>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="h-48 flex items-center justify-center text-sm text-gray-400">
                                        Aucune donnée de revenu pour les 30 derniers jours
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl border border-gray-100 dark:border-white/5 shadow-sm">
                            <h2 className="text-lg font-black text-gray-900 dark:text-white mb-5 flex items-center gap-2">
                                <DollarSign size={20} className="text-primary" /> Paiements
                            </h2>
                            <div className="space-y-4">
                                {[
                                    { label: 'Encaissé', val: stats?.payment?.paid, bg: 'bg-green-50', txt: 'text-green-700', bar: 'bg-green-500' },
                                    { label: 'À Recevoir (COD)', val: stats?.payment?.unpaid, bg: 'bg-orange-50', txt: 'text-orange-700', bar: 'bg-orange-400' },
                                    { label: 'Remboursé', val: stats?.payment?.refunded, bg: 'bg-purple-50', txt: 'text-purple-700', bar: 'bg-purple-400' },
                                ].map(({ label, val, bg, txt, bar }) => {
                                    const total = (stats?.payment?.paid || 0) + (stats?.payment?.unpaid || 0) + (stats?.payment?.refunded || 0) || 1;
                                    return (
                                        <div key={label} className={`${bg} p-4 rounded-2xl`}>
                                            <div className="flex justify-between mb-2">
                                                <p className={`text-xs font-black uppercase tracking-widest ${txt}`}>{label}</p>
                                                <p className={`text-sm font-black ${txt}`}>{fmt(val)} DH</p>
                                            </div>
                                            <div className="h-2 bg-white/80 rounded-full overflow-hidden">
                                                <div className={`h-full ${bar} rounded-full transition-all`} style={{ width: `${((val || 0) / total) * 100}%` }} />
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                            <div className="mt-5 pt-4 border-t border-gray-100">
                                <h3 className="text-xs font-black text-gray-500 uppercase tracking-widest mb-3">Statuts Commandes</h3>
                                <div className="grid grid-cols-2 gap-2">
                                    {Object.entries(stats?.order_statuses || {}).map(([status, count]) => {
                                        const colors = { pending: 'bg-orange-100 text-orange-600', processing: 'bg-blue-100 text-blue-600', paid: 'bg-green-100 text-green-600', completed: 'bg-emerald-100 text-emerald-600', delivered: 'bg-green-100 text-green-600', cancelled: 'bg-red-100 text-red-600' };
                                        return (
                                            <div key={status} className={`${colors[status] || 'bg-gray-100 text-gray-600'} rounded-xl px-3 py-2 flex items-center justify-between`}>
                                                <span className="text-[10px] font-black uppercase tracking-wider">{status}</span>
                                                <span className="text-sm font-black">{count}</span>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
                        <div className="lg:col-span-2 bg-white dark:bg-gray-800 p-6 rounded-2xl border border-gray-100 dark:border-white/5 shadow-sm">
                            <div className="flex items-center justify-between mb-5">
                                <h2 className="text-lg font-black text-gray-900 dark:text-white flex items-center gap-2">
                                    <TrendingUp size={20} className="text-blue-500" /> Meilleures Ventes
                                </h2>
                                <Link to="/admin/products" className="text-xs text-blue-500 font-bold hover:underline">Voir tout</Link>
                            </div>
                            <div className="space-y-3">
                                {(stats?.top_products || []).length > 0 ? (
                                    stats.top_products.slice(0, 8).map((item, idx) => {
                                        const maxSold = Math.max(...stats.top_products.map(p => p.total_sold || 0), 1);
                                        return (
                                            <div key={idx} className="flex items-center gap-3 hover:bg-gray-50 dark:hover:bg-white/5 p-2 rounded-xl transition-all">
                                                <div className="w-7 h-7 flex items-center justify-center bg-gray-100 dark:bg-gray-700 text-gray-500 rounded-lg font-black text-xs flex-shrink-0">
                                                    {idx + 1}
                                                </div>
                                                <div className="w-10 h-10 bg-gray-50 dark:bg-gray-700 rounded-xl overflow-hidden flex-shrink-0">
                                                    <img src={getImageUrl(item.image)} alt={item.name} className="w-full h-full object-contain p-1" onError={e => { e.target.style.display = 'none'; }} />
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <p className="text-sm font-bold text-gray-900 dark:text-white truncate">{item.name}</p>
                                                    <div className="flex items-center gap-2 mt-1">
                                                        <div className="flex-1 h-1.5 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                                                            <div className="h-full bg-blue-500 rounded-full" style={{ width: `${((item.total_sold || 0) / maxSold) * 100}%` }} />
                                                        </div>
                                                        <span className="text-xs text-gray-400 font-medium flex-shrink-0">{item.total_sold || 0} ventes</span>
                                                    </div>
                                                </div>
                                                <div className="text-right flex-shrink-0">
                                                    <p className="text-sm font-black text-gray-900 dark:text-white">{fmt(item.total_revenue)} DH</p>
                                                    <p className={`text-[10px] font-black mt-0.5 ${item.stock <= 5 ? 'text-red-500' : 'text-green-500'}`}>Stock: {item.stock}</p>
                                                </div>
                                            </div>
                                        );
                                    })
                                ) : (
                                    <p className="text-sm text-gray-400 text-center py-8">Aucune vente enregistrée</p>
                                )}
                            </div>
                        </div>

                        <div className="space-y-5">
                            <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl border border-orange-100 dark:border-orange-500/20 shadow-sm">
                                <h2 className="text-sm font-black text-orange-600 dark:text-orange-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                                    <ShieldAlert size={16} /> Alertes Stock
                                </h2>
                                <div className="space-y-2">
                                    {(stats?.stock_alerts || []).length > 0 ? (
                                        stats.stock_alerts.slice(0, 6).map((p, i) => (
                                            <div key={i} className="flex items-center justify-between p-2.5 bg-orange-50 dark:bg-orange-500/10 rounded-xl">
                                                <p className="text-xs font-bold text-gray-700 dark:text-gray-300 truncate flex-1">{p.name}</p>
                                                <span className={`text-xs font-black ml-2 px-2 py-0.5 rounded-full flex-shrink-0 ${p.stock === 0 ? 'bg-red-100 text-red-600' : 'bg-orange-100 text-orange-600'}`}>
                                                    {p.stock === 0 ? 'Épuisé' : `${p.stock} restant`}
                                                </span>
                                            </div>
                                        ))
                                    ) : (
                                        <p className="text-xs text-gray-400 text-center py-4">Tous les stocks sont OK</p>
                                    )}
                                </div>
                            </div>

                            <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl border border-gray-100 dark:border-white/5 shadow-sm">
                                <h2 className="text-sm font-black text-gray-700 dark:text-gray-300 uppercase tracking-widest mb-4 flex items-center gap-2">
                                    <MapPin size={16} className="text-blue-500" /> Wilayas
                                </h2>
                                <div className="space-y-3">
                                    {(stats?.cities || []).length > 0 ? (
                                        stats.cities.slice(0, 6).map((city, idx) => {
                                            const maxCount = Math.max(...(stats?.cities || []).map(c => c.count || 0), 1);
                                            const pct = ((city.count || 0) / maxCount) * 100;
                                            return (
                                                <div key={idx}>
                                                    <div className="flex justify-between text-xs font-medium mb-1">
                                                        <span className="text-gray-600 dark:text-gray-400">{city.customer_city || 'N/A'}</span>
                                                        <span className="text-gray-900 dark:text-white font-black">{city.count}</span>
                                                    </div>
                                                    <div className="h-2 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                                                        <div className="h-full bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full transition-all" style={{ width: `${pct}%` }} />
                                                    </div>
                                                </div>
                                            );
                                        })
                                    ) : (
                                        <p className="text-xs text-gray-400 text-center py-4">Aucune commande par wilaya</p>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl border border-gray-100 dark:border-white/5 shadow-sm">
                        <h2 className="text-lg font-black text-gray-900 dark:text-white mb-5 flex items-center gap-2">
                            <History size={20} className="text-gray-400" /> Journal d'Activité
                        </h2>
                        <div className="space-y-2 max-h-64 overflow-y-auto">
                            {(stats?.activity || []).length > 0 ? (
                                stats.activity.map((log, idx) => (
                                    <div key={idx} className="flex items-start gap-3 p-3 hover:bg-gray-50 dark:hover:bg-white/5 rounded-xl transition-colors">
                                        <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white text-xs font-black flex-shrink-0">
                                            {log.user?.name?.charAt(0) || '?'}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-bold text-gray-900 dark:text-white">{log.action}</p>
                                            {log.details && <p className="text-xs text-gray-500 truncate">{log.details}</p>}
                                            <p className="text-[10px] text-gray-400 mt-0.5">
                                                Par {log.user?.name || 'Système'} - {new Date(log.created_at).toLocaleString('fr-MA')}
                                            </p>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <p className="text-sm text-gray-400 text-center py-8">Aucune activité récente</p>
                            )}
                        </div>
                    </div>

                </div>
            </div>
        </AdminLayout>
    );
};

export default Dashboard;
