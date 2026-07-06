import React, { useState, useEffect, useRef } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { API_URL } from '../services/api';
import toast from 'react-hot-toast';
import { ShieldCheck, ChevronLeft, Lock, CheckCircle, CreditCard, Receipt, Package } from 'lucide-react';
import MainLayout from '../layouts/MainLayout';
import { gsap } from 'gsap';

const VirtualPayment = () => {
    const { id } = useParams();
    const location = useLocation();
    const navigate = useNavigate();
    const amount = location.state?.amount || 0;
    const itemsCount = location.state?.itemCount || 1;

    const [cardData, setCardData] = useState({ number: '', name: '', expiry: '', cvv: '' });
    const [focusedField, setFocusedField] = useState(null);
    const [loading, setLoading] = useState(false);
    const [receipt, setReceipt] = useState(null);

    // Refs pour GSAP
    const cardRef = useRef(null);
    const receiptContainerRef = useRef(null);
    const buttonRef = useRef(null);
    
    // Animation Flip de la carte avec GSAP
    useEffect(() => {
        if (!cardRef.current) return;
        
        if (focusedField === 'cvv') {
            gsap.to(cardRef.current, {
                rotationY: 180,
                duration: 0.8,
                ease: "power3.inOut"
            });
        } else {
            gsap.to(cardRef.current, {
                rotationY: 0,
                duration: 0.8,
                ease: "power3.inOut"
            });
        }
    }, [focusedField]);

    // Animation d'apparition du reçu
    useEffect(() => {
        if (receipt && receiptContainerRef.current) {
            const elements = receiptContainerRef.current.children;
            gsap.fromTo(elements, 
                { y: 30, opacity: 0 }, 
                { y: 0, opacity: 1, duration: 0.6, stagger: 0.1, ease: "power3.out" }
            );
        }
    }, [receipt]);

    const handleDownloadReceipt = () => {
        const url = `${API_URL}/orders/${id}/receipt?last4=${receipt.card_last4}&type=${receipt.card_type}`;
        window.open(url, '_blank');
    };
    const handleNumberChange = (e) => {
        let val = e.target.value.replace(/\D/g, '');
        if (val.length > 16) val = val.slice(0, 16);
        const formatted = val.replace(/(.{4})/g, '$1 ').trim();
        setCardData({ ...cardData, number: formatted });
    };

    const handleExpiryChange = (e) => {
        let val = e.target.value.replace(/\D/g, '');
        if (val.length > 4) val = val.slice(0, 4);
        if (val.length >= 2) val = val.slice(0, 2) + '/' + val.slice(2);
        setCardData({ ...cardData, expiry: val });
    };

    const handleCvvChange = (e) => {
        let val = e.target.value.replace(/\D/g, '');
        if (val.length > 3) val = val.slice(0, 3);
        setCardData({ ...cardData, cvv: val });
    };

    const getCardType = () => {
        const firstDigit = cardData.number.charAt(0);
        if (firstDigit === '4') return 'Visa';
        if (firstDigit === '5') return 'Mastercard';
        return 'Card';
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const response = await axios.post(`${API_URL}/orders/${id}/pay`, {
                card_number: cardData.number.replace(/\s/g, ''),
                expiry: cardData.expiry,
                cvv: cardData.cvv,
                card_name: cardData.name
            });

            // Animation du bouton au succès
            gsap.to(buttonRef.current, {
                scale: 1.05,
                backgroundColor: "#10B981", 
                duration: 0.3,
                yoyo: true,
                repeat: 1,
                onComplete: () => {
                    setReceipt(response.data.receipt);
                    toast.success('Paiement validé avec succès !');
                }
            });

        } catch (error) {
            gsap.to(buttonRef.current, {
                x: [-10, 10, -10, 10, 0],
                duration: 0.4,
                ease: "power2.inOut"
            });
            toast.error(error.response?.data?.message || 'Erreur lors du paiement.');
        } finally {
            setLoading(false);
        }
    };

    // ────────────────────────────────────────────────────────────
    // VUE: Reçu (Succès)
    // ────────────────────────────────────────────────────────────
    if (receipt) {
        return (
            <MainLayout>
                <div className="min-h-[85vh] flex items-center justify-center bg-slate-50 py-12 px-4">
                    <div ref={receiptContainerRef} className="max-w-xl w-full bg-white rounded-[40px] shadow-2xl border border-slate-100 p-8 md:p-12 relative overflow-hidden text-center">
                        
                        <div className="w-24 h-24 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-6 relative">
                            <div className="absolute inset-0 bg-green-500/20 rounded-full animate-ping"></div>
                            <CheckCircle size={48} className="text-green-500 relative z-10" />
                        </div>
                        
                        <h2 className="text-4xl font-black text-slate-900 tracking-tight mb-2">Paiement Accepté</h2>
                        <div className="inline-flex items-center gap-2 bg-green-50 text-green-700 px-4 py-1.5 rounded-full font-bold text-xs uppercase tracking-widest mb-8 border border-green-100">
                            Transaction Virtuelle Sécurisée
                        </div>

                        {/* Order Info & Final Price */}
                        <div className="bg-slate-50 rounded-3xl p-6 text-left space-y-4 mb-8">
                            <div className="flex justify-between items-end pb-5 border-b border-slate-200/60">
                                <div>
                                    <span className="text-slate-500 text-xs font-bold uppercase tracking-widest block mb-1">Montant Total</span>
                                    <span className="font-black text-4xl text-primary">{amount.toLocaleString()} <span className="text-xl">DH</span></span>
                                </div>
                                <div className="text-right">
                                    <span className="text-slate-400 text-[10px] uppercase font-bold tracking-widest block mb-1">N° Commande</span>
                                    <span className="font-bold text-slate-700 text-lg">#{id.toString().padStart(6, '0')}</span>
                                </div>
                            </div>
                            
                            <div className="py-2 space-y-3">
                                <div className="flex justify-between items-center">
                                    <span className="text-slate-500 text-sm font-medium">Carte Utilisée</span>
                                    <div className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-lg border border-slate-200 shadow-sm">
                                        <CreditCard size={14} className="text-primary" />
                                        <span className="font-mono text-sm font-bold text-slate-700">**** {receipt.card_last4}</span>
                                    </div>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-slate-500 text-sm font-medium">Date</span>
                                    <span className="font-bold text-slate-700">{new Date(receipt.date).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
                                </div>
                            </div>

                            {/* Items List */}
                            {receipt.items && receipt.items.length > 0 && (
                                <div className="pt-4 border-t border-slate-200/60">
                                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3 flex items-center gap-2">
                                        <Package size={14} /> Articles Commandés
                                    </p>
                                    <div className="space-y-2 max-h-[150px] overflow-y-auto custom-scrollbar pr-2">
                                        {receipt.items.map((item, idx) => (
                                            <div key={idx} className="flex justify-between items-center text-sm p-3 bg-white rounded-xl border border-slate-100 shadow-sm">
                                                <div className="flex-1 truncate mr-4">
                                                    <span className="font-bold text-slate-800">{item.quantity}x</span>{' '}
                                                    <span className="text-slate-600 truncate">{item.name}</span>
                                                </div>
                                                <span className="font-black text-slate-900 shrink-0">{(item.price * item.quantity).toLocaleString()} DH</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="flex flex-col gap-3">
                            <button 
                                onClick={handleDownloadReceipt}
                                className="w-full bg-[#E52E1E] hover:bg-[#c82216] text-white py-4 rounded-xl font-bold transition-all shadow-lg flex justify-center items-center gap-3 text-base"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
                                Télécharger le reçu PDF
                            </button>

                            <button 
                                onClick={() => navigate(`/track/${id}`)}
                                className="w-full bg-slate-900 hover:bg-slate-800 text-white py-4 rounded-xl font-bold transition-all shadow-lg flex justify-center items-center gap-3 text-base"
                            >
                                <Receipt size={20} />
                                Suivre ma commande
                            </button>
                        </div>
                    </div>
                </div>
            </MainLayout>
        );
    }


    // ────────────────────────────────────────────────────────────
    // VUE: Formulaire de Paiement
    // ────────────────────────────────────────────────────────────
    return (
        <MainLayout>
            <div className="min-h-[90vh] bg-[#f8fafc] py-12 px-4 sm:px-6 lg:px-8">
                <div className="max-w-5xl mx-auto">
                    
                    {/* Header */}
                    <div className="mb-10 flex items-center justify-between px-2">
                        <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-slate-500 hover:text-slate-900 transition-colors font-bold text-sm tracking-wide">
                            <ChevronLeft size={20} />
                            Retour
                        </button>
                        <div className="flex items-center gap-2 bg-green-50 px-4 py-2 rounded-xl border border-green-200/60 shadow-sm">
                            <ShieldCheck size={18} className="text-green-600" />
                            <span className="text-[11px] font-black text-green-700 uppercase tracking-widest">Connexion TLS 1.3 Sécurisée</span>
                        </div>
                    </div>

                    <div className="grid lg:grid-cols-12 gap-10 lg:gap-14 items-start">
                        
                        {/* LEFT: Animation Carte Bancaire 3D */}
                        <div className="lg:col-span-5 flex flex-col items-center justify-start lg:sticky lg:top-32">
                            
                            {/* Card Wrapper (GSAP rotation target) */}
                            <div className="w-[360px] sm:w-[400px] h-[240px] perspective-1000 mb-10 z-10">
                                <div ref={cardRef} className="relative w-full h-full transform-style-3d">
                                    
                                    {/* Front side */}
                                    <div className="absolute w-full h-full backface-hidden rounded-[24px] p-7 flex flex-col justify-between shadow-2xl bg-[#0f172a] overflow-hidden border border-slate-700">
                                        <div className="relative z-10 flex justify-between items-start">
                                            <div className="w-14 h-10 bg-gradient-to-tr from-amber-200 to-yellow-400 rounded-lg shadow-sm" />
                                            <span className="text-white font-black italic tracking-wider text-2xl opacity-90">{getCardType()}</span>
                                        </div>
                                        
                                        <div className="relative z-10">
                                            <div className="text-white font-mono text-[26px] tracking-[0.18em] mb-6 drop-shadow-md">
                                                {cardData.number || '•••• •••• •••• ••••'}
                                            </div>
                                            <div className="flex justify-between items-end text-slate-300 font-mono">
                                                <div className="flex flex-col">
                                                    <span className="text-[9px] uppercase font-sans tracking-widest text-slate-500 mb-1">Titulaire</span>
                                                    <span className="font-bold text-base truncate max-w-[200px] text-white tracking-widest">
                                                        {cardData.name.toUpperCase() || 'VOTRE NOM'}
                                                    </span>
                                                </div>
                                                <div className="flex flex-col items-end">
                                                    <span className="text-[9px] uppercase font-sans tracking-widest text-slate-500 mb-1">Expire</span>
                                                    <span className="font-bold text-base text-white tracking-widest">{cardData.expiry || 'MM/YY'}</span>
                                                </div>
                                            </div>
                                        </div>
                                        
                                        {/* Glossy Overlay */}
                                        <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-gradient-to-br from-white/10 to-transparent rounded-full blur-2xl pointer-events-none transform translate-x-1/3 -translate-y-1/2" />
                                    </div>

                                    {/* Back side */}
                                    <div className="absolute w-full h-full backface-hidden rotate-y-180 rounded-[24px] bg-[#0f172a] shadow-2xl overflow-hidden border border-slate-700">
                                        <div className="w-full h-14 bg-black/80 mt-8" />
                                        <div className="p-7">
                                            <div className="bg-white px-4 py-2 w-full h-12 rounded-lg text-right flex items-center justify-end font-mono text-slate-900 font-black italic tracking-widest text-lg">
                                                {cardData.cvv || '•••'}
                                            </div>
                                            <div className="mt-4 text-[10px] text-slate-400 font-sans max-w-[200px] leading-relaxed">
                                                Crypto test. Utilisez n'importe quel code CVV à 3 chiffres (ex: 123) pour finaliser l'achat virtuel.
                                            </div>
                                        </div>
                                    </div>

                                </div>
                            </div>

                            {/* Facture mini */}
                            <div className="w-[360px] sm:w-[400px] bg-white rounded-3xl p-6 shadow-xl shadow-slate-200/30 border border-slate-100">
                                <h3 className="font-black text-sm text-slate-400 uppercase tracking-widest mb-4 border-b border-slate-100 pb-3">Montant à régler</h3>
                                <div className="space-y-2 mb-6">
                                    <div className="flex justify-between items-center text-sm font-medium">
                                        <span className="text-slate-600">Sous-total ({itemsCount} articles)</span>
                                        <span className="text-slate-900">{(amount - 40).toLocaleString()} DH</span>
                                    </div>
                                    <div className="flex justify-between items-center text-sm font-medium">
                                        <span className="text-slate-600">Frais d'expédition</span>
                                        <span className="text-slate-900">40 DH</span>
                                    </div>
                                </div>
                                <div className="flex justify-between items-end border-t border-slate-100 pt-4">
                                    <span className="text-sm font-black uppercase tracking-widest text-slate-900">Total Net</span>
                                    <span className="text-4xl font-black text-primary">{amount.toLocaleString()} <span className="text-xl">DH</span></span>
                                </div>
                            </div>

                        </div>

                        {/* RIGHT: Formulaire */}
                        <div className="lg:col-span-7 bg-white rounded-[40px] shadow-2xl shadow-slate-200/50 p-8 sm:p-12 border border-slate-100">
                            <div className="mb-10">
                                <h2 className="text-3xl font-black text-slate-900 mb-3 tracking-tight">Portail de Paiement</h2>
                                <p className="text-sm font-medium text-slate-500 leading-relaxed max-w-md">Veuillez entrer les coordonnées de votre carte de crédit. Il s'agit d'une simulation sécurisée et aucune donnée bancaire réelle n'est requise.</p>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">Numéro de carte</label>
                                    <div className={`relative rounded-2xl border-[3px] transition-all bg-slate-50 ${focusedField === 'number' ? 'border-primary bg-blue-50/10 shadow-lg shadow-blue-500/10' : 'border-transparent'}`}>
                                        <CreditCard size={20} className={`absolute left-5 top-1/2 -translate-y-1/2 transition-colors ${focusedField === 'number' ? 'text-primary' : 'text-slate-400'}`} />
                                        <input
                                            type="text"
                                            required
                                            value={cardData.number}
                                            onChange={handleNumberChange}
                                            onFocus={() => { setFocusedField('number'); }}
                                            onBlur={() => setFocusedField(null)}
                                            placeholder="0000 0000 0000 0000"
                                            className="w-full pl-14 pr-5 py-5 bg-transparent outline-none font-mono font-bold text-slate-900 text-lg placeholder:text-slate-300"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">Nom du titulaire</label>
                                    <input
                                        type="text"
                                        required
                                        value={cardData.name}
                                        onChange={e => setCardData({...cardData, name: e.target.value.toUpperCase()})}
                                        onFocus={() => setFocusedField('name')}
                                        onBlur={() => setFocusedField(null)}
                                        placeholder="EX: M ZAKARIA"
                                        className={`w-full px-5 py-5 rounded-2xl border-[3px] transition-all bg-slate-50 outline-none font-bold text-slate-900 uppercase text-base placeholder:text-slate-300 ${focusedField === 'name' ? 'border-primary bg-blue-50/10 shadow-lg shadow-blue-500/10' : 'border-transparent'}`}
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">Date d'exp.</label>
                                        <input
                                            type="text"
                                            required
                                            value={cardData.expiry}
                                            onChange={handleExpiryChange}
                                            onFocus={() => setFocusedField('expiry')}
                                            onBlur={() => setFocusedField(null)}
                                            placeholder="MM/YY"
                                            className={`w-full px-5 py-5 rounded-2xl border-[3px] transition-all bg-slate-50 outline-none font-mono font-bold text-slate-900 text-lg placeholder:text-slate-300 tracking-wider ${focusedField === 'expiry' ? 'border-primary bg-blue-50/10 shadow-lg shadow-blue-500/10' : 'border-transparent'}`}
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">Cryptogramme (CVV)</label>
                                        <input
                                            type="password"
                                            required
                                            value={cardData.cvv}
                                            onChange={handleCvvChange}
                                            onFocus={() => setFocusedField('cvv')}
                                            onBlur={() => setFocusedField(null)}
                                            placeholder="•••"
                                            maxLength="3"
                                            className={`w-full px-5 py-5 rounded-2xl border-[3px] transition-all bg-slate-50 outline-none font-mono tracking-[0.3em] text-center font-black text-slate-900 text-xl placeholder:text-slate-300 placeholder:font-sans placeholder:tracking-normal ${focusedField === 'cvv' ? 'border-primary bg-blue-50/10 shadow-lg shadow-blue-500/10' : 'border-transparent'}`}
                                        />
                                    </div>
                                </div>

                                <button
                                    ref={buttonRef}
                                    type="submit"
                                    disabled={loading || cardData.number.replace(/\s/g, '').length < 16 || cardData.cvv.length < 3 || cardData.expiry.length < 5 || !cardData.name}
                                    className="w-full bg-primary hover:bg-blue-600 text-white py-6 rounded-2xl font-black text-lg transition-all shadow-xl shadow-primary/25 active:scale-[0.98] disabled:opacity-50 disabled:grayscale disabled:cursor-not-allowed mt-10 flex items-center justify-center gap-3"
                                >
                                    {loading ? (
                                        <div className="w-6 h-6 border-[3px] border-white/30 border-t-white rounded-full animate-spin"></div>
                                    ) : (
                                        <>
                                            <Lock size={20} />
                                            Valider et Payer {amount.toLocaleString()} DH
                                        </>
                                    )}
                                </button>

                                <div className="text-center mt-6">
                                    <p className="text-[10px] uppercase font-bold text-slate-400 tracking-widest flex items-center justify-center gap-2">
                                        <Lock size={12} />
                                        Données fictives uniquement • Ne pas utiliser votre vraie carte
                                    </p>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>

            <style>{`
                .perspective-1000 { perspective: 1000px; }
                .transform-style-3d { transform-style: preserve-3d; }
                .backface-hidden { backface-visibility: hidden; }
                .rotate-y-180 { transform: rotateY(180deg); }
                
                .custom-scrollbar::-webkit-scrollbar { width: 4px; }
                .custom-scrollbar::-webkit-scrollbar-track { background: #f1f5f9; border-radius: 10px; }
                .custom-scrollbar::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 10px; }
            `}</style>
        </MainLayout>
    );
};

export default VirtualPayment;
