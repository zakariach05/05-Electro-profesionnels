import React, { useState, useEffect, useRef, useCallback } from 'react';
import { SlidersHorizontal } from 'lucide-react';
import MainLayout from '../layouts/MainLayout';
import ProductCard from '../components/molecules/ProductCard';
import FilterSidebar from '../components/organisms/FilterSidebar';
import axios from 'axios';
import { API_URL } from '../services/api';
import { useParams, useSearchParams } from 'react-router-dom';
import Loader from '../components/atoms/Loader';
import SEO from '../components/atoms/SEO';

const slugToNameMap = {
    'smartphones': 'Smartphones', 'pc-mac': 'PC & Mac', 'gaming': 'Gaming',
    'tv-son': 'TV & Son', 'tv': 'TV & Son', 'tablettes': 'Tablettes',
    'tablets': 'Tablettes', 'accessoires': 'Accessoires', 'accessories': 'Accessoires',
    'domotique': 'Domotique', 'smart-home': 'Domotique', 'electromenager': 'Électroménager',
    'appliances': 'Électroménager', 'reseaux': 'Réseaux', 'networks': 'Réseaux',
};

const categorySlugMap = {
    'Smartphones': 'smartphones', 'PC & Mac': 'pc-mac', 'Gaming': 'gaming',
    'TV & Son': 'tv-son', 'Tablettes': 'tablettes', 'Accessoires': 'accessoires',
    'Domotique': 'domotique', 'smartphones': 'smartphones', 'pc-mac': 'pc-mac',
    'gaming': 'gaming', 'tv-son': 'tv-son', 'tablettes': 'tablettes',
    'accessoires': 'accessoires', 'domotique': 'domotique', 'accessories': 'accessoires',
    'tablets': 'tablettes', 'smart-home': 'domotique', 'appliances': 'electromenager',
    'reseaux': 'reseaux', 'networks': 'reseaux',
};

const categoryNames = {
    'smartphones': 'Smartphones', 'pc-mac': 'PC & Mac', 'gaming': 'Gaming',
    'tv-son': 'TV & Son', 'tv': 'TV & Son', 'tablettes': 'Tablettes',
    'tablets': 'Tablettes', 'accessoires': 'Accessoires', 'accessories': 'Accessoires',
    'domotique': 'Domotique', 'smart-home': 'Domotique', 'electromenager': 'Électroménager',
    'appliances': 'Électroménager', 'reseaux': 'Réseaux', 'networks': 'Réseaux',
};

const Shop = () => {
    const { category } = useParams();
    const [searchParams] = useSearchParams();
    const searchQuery = searchParams.get('search');

    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [pagination, setPagination] = useState({ current: 1, total: 1, totalItems: 0 });
    const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);
    const [filters, setFilters] = useState({
        maxPrice: 30000,
        brands: [],
        states: [],
        categories: [],
        promoOnly: false,
        inStock: false
    });

    const [currentPage, setCurrentPage] = useState(1);
    const PAGE_SIZE = 24;
    const abortRef = useRef(null);

    const buildParams = useCallback((page, currentFilters) => {
        const params = {
            max_price: currentFilters.maxPrice,
            page,
            per_page: PAGE_SIZE
        };
        if (currentFilters.categories?.length > 0) {
            const slugs = currentFilters.categories.map(cat => categorySlugMap[cat]).filter(Boolean);
            if (slugs.length > 0) params.categories = slugs.join(',');
        }
        if (searchQuery) params.search = searchQuery;
        if (currentFilters.brands?.length > 0) params.brands = currentFilters.brands.join(',');
        if (currentFilters.states?.length > 0) params.states = currentFilters.states.map(s => s.toLowerCase()).join(',');
        if (currentFilters.promoOnly) params.promo = 1;
        if (currentFilters.inStock) params.in_stock = 1;
        return params;
    }, [searchQuery]);

    // Sync URL category to filters
    useEffect(() => {
        if (category && category !== 'all') {
            const n = slugToNameMap[category];
            if (n) setFilters(prev => ({ ...prev, categories: [n] }));
        } else {
            setFilters(prev => ({ ...prev, categories: [] }));
        }
    }, [category]);

    // Fetch products when filters or page change
    useEffect(() => {
        if (abortRef.current) abortRef.current.abort();
        const controller = new AbortController();
        abortRef.current = controller;

        const fetchProducts = async () => {
            setLoading(true);
            try {
                const params = buildParams(currentPage, filters);
                const response = await axios.get(`${API_URL}/products`, { params, signal: controller.signal });
                const rd = response.data;

                if (rd && rd.data && rd.current_page !== undefined) {
                    setPagination({ current: rd.current_page, total: rd.last_page || 1, totalItems: rd.total || 0 });
                    setProducts(currentPage === 1 ? rd.data : prev => [...prev, ...rd.data]);
                } else {
                    const all = Array.isArray(rd) ? rd : (rd.data || []);
                    setPagination({ current: 1, total: 1, totalItems: all.length });
                    setProducts(all);
                }
            } catch (err) {
                if (err.code !== 'ERR_CANCELED' && err.name !== 'CanceledError') {
                    console.error("Fetch error:", err);
                }
            } finally {
                setLoading(false);
            }
        };
        fetchProducts();
    }, [filters, searchQuery, currentPage, buildParams]);

    // Reset page when filters change
    useEffect(() => {
        setCurrentPage(1);
    }, [filters, searchQuery]);

    const displayCategoryName = categoryNames[category] || (category ? category.replace('-', ' ') : 'Boutique');
    const pageTitle = category ? (category === 'all' ? 'Toute la Boutique' : displayCategoryName) : 'Boutique';



    return (
        <MainLayout>
            <SEO title={pageTitle} description={`Découvrez notre sélection de produits dans la catégorie ${pageTitle}. Qualité garantie et meilleurs prix au Maroc.`} />
            <div className="bg-gray-50 min-h-screen pt-6 pb-20">

                <div className="bg-white border-b border-gray-200 py-8 mb-8">
                    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                        <h1 className="text-3xl font-bold text-gray-900 capitalize">
                            {category === 'all' || !category ? 'Boutique' : displayCategoryName}
                        </h1>
                        <p className="text-gray-500 mt-2">Découvrez nos meilleurs produits électroniques.</p>
                    </div>
                </div>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="lg:hidden mb-6">
                        <button
                            onClick={() => setIsMobileFilterOpen(true)}
                            className="flex items-center gap-2 bg-white px-4 py-2 rounded-lg border border-gray-200 shadow-sm text-gray-700 font-medium"
                        >
                            <SlidersHorizontal size={18} />
                            Filtres
                        </button>
                    </div>

                    <div className="flex gap-8">
                        <div className="hidden lg:block w-1/4 flex-shrink-0 sticky top-24 h-[calc(100vh-8rem)]">
                            <FilterSidebar
                                filters={filters}
                                setFilters={setFilters}
                            />
                        </div>

                        {isMobileFilterOpen && (
                            <div className="fixed inset-0 z-50 lg:hidden flex">
                                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setIsMobileFilterOpen(false)}></div>
                                <div className="relative w-4/5 max-w-sm bg-white h-full shadow-2xl animate-slide-in-right">
                                    <FilterSidebar
                                        filters={filters}
                                        setFilters={setFilters}
                                        closeMobileFilters={() => setIsMobileFilterOpen(false)}
                                    />
                                </div>
                            </div>
                        )}

                        <div className="flex-1">
                            {loading && currentPage === 1 ? (
                                <div className="flex justify-center py-20">
                                    <Loader />
                                </div>
                            ) : products.length > 0 ? (
                                <>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                                        {products.map(product => (
                                            <ProductCard key={product.id} product={product} />
                                        ))}
                                    </div>

                                    {/* Load More (append) pagination */}
                                    {pagination.total > currentPage && (
                                        <div className="mt-12 flex flex-col items-center gap-4">
                                            <p className="text-sm text-gray-500">
                                                {pagination.totalItems > 0 ? `Affichage de ${products.length} sur ${pagination.totalItems} produits` : ''}
                                            </p>
                                            <button
                                                disabled={loading}
                                                onClick={() => setCurrentPage(prev => prev + 1)}
                                                className="px-8 py-4 bg-white border border-gray-200 text-gray-900 rounded-full font-bold hover:bg-gray-50 hover:border-gray-300 transition-all shadow-sm flex items-center gap-2"
                                            >
                                                {loading ? 'Chargement...' : `Afficher ${Math.min(PAGE_SIZE, pagination.totalItems - products.length)} produits suivants`}
                                            </button>
                                        </div>
                                    )}
                                </>
                            ) : (
                                <div className="text-center py-20 bg-white rounded-xl border border-gray-100">
                                    <p className="text-gray-500 text-lg">Aucun produit ne correspond à vos critères.</p>
                                    <button
                                        onClick={() => setFilters({ maxPrice: 30000, brands: [], states: [], categories: [], promoOnly: false, inStock: false })}
                                        className="mt-4 text-primary font-bold hover:underline"
                                    >
                                        Réinitialiser les filtres
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </MainLayout>
    );
};

export default Shop;
