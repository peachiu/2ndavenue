"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Heart, Share2, ShoppingBag, ShieldCheck, User, ArrowLeft, Loader2, Check, CheckCheck, MessageCircle, Send, X } from "lucide-react";
import Link from "next/link";
import { useCurrency } from "@/context/CurrencyContext";
import { useCart } from "@/context/CartContext";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import Toast from "@/components/Toast";

const CONDITION_LABELS: Record<string, string> = {
    new: "novo",
    mint: "impecável",
    like_new: "praticamente novo",
    good: "bom",
    fair: "ok",
    poor: "tem uso",
};

interface ProductData {
    id: number;
    title: string;
    price: number;
    currency: string;
    condition_rating: string;
    description: string;
    category_name: string;
    category_slug: string;
    stock: number;
    views: number;
    status: string;
    tags: string[];
    images: string[];
    seller_id: number;
    seller_name: string;
    seller_image: string | null;
}

export default function ProductDetailPage() {
    const { formatPrice } = useCurrency();
    const { addItem, openCart } = useCart();
    const { data: session } = useSession();
    const params = useParams();
    const [product, setProduct] = useState<ProductData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isMounted, setIsMounted] = useState(false);
    const [favorited, setFavorited] = useState(false);
    const [togglingFav, setTogglingFav] = useState(false);
    const [followState, setFollowState] = useState<{ isFollowing: boolean; isFollowedBy: boolean; isFriend: boolean } | null>(null);
    const [togglingFollow, setTogglingFollow] = useState(false);
    const [shareCopied, setShareCopied] = useState(false);
    const [showContactModal, setShowContactModal] = useState(false);
    const [contactMessage, setContactMessage] = useState("");
    const [sendingContact, setSendingContact] = useState(false);
    const [toastVisible, setToastVisible] = useState(false);
    const [toastMessage, setToastMessage] = useState("");
    const router = useRouter();

    useEffect(() => {
        setIsMounted(true);
    }, []);

    useEffect(() => {
        if (!params?.id) return;
        const id = Array.isArray(params.id) ? params.id[0] : params.id;

        fetch(`/api/products/${id}`)
            .then((res) => {
                if (!res.ok) throw new Error("Produto não encontrado");
                return res.json();
            })
            .then((data) => {
                setProduct(data);
                setLoading(false);
            })
            .catch((err) => {
                setError(err.message);
                setLoading(false);
            });
    }, [params?.id]);

    // Check if favorited
    useEffect(() => {
        if (!params?.id || !session?.user) return;
        const id = Array.isArray(params.id) ? params.id[0] : params.id;
        fetch(`/api/favorites?listing_id=${id}`)
            .then(r => r.json())
            .then(d => setFavorited(d.favorited))
            .catch(() => {});
    }, [params?.id, session?.user]);

    // Check follow relationship with seller
    useEffect(() => {
        if (!product?.seller_id || !session?.user) return;
        fetch(`/api/follows?user_id=${product.seller_id}`)
            .then(r => r.json())
            .then(d => {
                if (d && typeof d.isFriend === 'boolean') {
                    setFollowState(d);
                }
            })
            .catch(() => {});
    }, [product?.seller_id, session?.user]);

    // Toggle favorite
    const toggleFavorite = async () => {
        if (!session?.user) return;
        setTogglingFav(true);
        try {
            const res = await fetch('/api/favorites', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ listing_id: product?.id }),
            });
            const data = await res.json();
            setFavorited(data.favorited);
        } catch {}
        setTogglingFav(false);
    };

    // Toggle follow
    const toggleFollow = async () => {
        if (!session?.user || !product?.seller_id) return;
        setTogglingFollow(true);
        try {
            const res = await fetch('/api/follows', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ user_id: product.seller_id }),
            });
            const data = await res.json();
            if (data && typeof data.isFriend === 'boolean') {
                setFollowState({ isFollowing: data.isFollowing, isFollowedBy: data.isFollowedBy, isFriend: data.isFriend });
            }
        } catch {}
        setTogglingFollow(false);
    };

    // Add to cart
    const handleAddToCart = () => {
        if (!product) return;
        addItem({
            id: product.id,
            listing_id: product.id,
            title: product.title,
            price: product.price,
            currency: product.currency,
            image_url: product.images?.[0] || "/images/placeholder.svg",
            seller_name: product.seller_name,
        });
        setToastMessage(`${product.title} adicionado à bag`);
        setToastVisible(true);
    };

    // Share
    const shareProduct = async () => {
        if (navigator.share) {
            await navigator.share({ title: product?.title, url: window.location.href });
        } else {
            await navigator.clipboard.writeText(window.location.href);
            setShareCopied(true);
            setTimeout(() => setShareCopied(false), 2000);
        }
    };

    if (loading) {
        return (
            <main className="min-h-screen bg-charcoal flex items-center justify-center">
                <Loader2 className="w-8 h-8 text-periwinkle animate-spin" />
            </main>
        );
    }

    if (error || !product) {
        return (
            <main className="min-h-screen bg-charcoal flex items-center justify-center">
                <div className="text-center space-y-4">
                    <p className="text-6xl">😕</p>
                    <p className="text-slate-light font-bold lowercase italic">{error || "produto não encontrado"}</p>
                    <Link href="/" className="clay-btn inline-block px-8 py-4 text-sm">
                        voltar ao feed
                    </Link>
                </div>
            </main>
        );
    }

    const conditionKey = product.condition_rating?.toLowerCase().replace(" ", "_") || "good";

    return (
        <main className="min-h-screen bg-charcoal pb-36 md:pb-20 pt-8 select-none">
            <div className="max-w-7xl mx-auto px-4 md:px-8">
                {/* Back Button */}
                <Link href="/" className="inline-flex items-center gap-2 text-sm font-black text-slate-lighter lowercase hover:text-periwinkle transition-colors mb-4 md:mb-8 group">
                    <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                    voltar ao feed
                </Link>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12 items-start">

                    {/* Left: Messy Content (Images + Description) */}
                    <div className="md:col-span-2 space-y-8 md:space-y-12">
                        {/* Image Gallery */}
                        <div className="flex flex-col gap-6">
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="clay-card aspect-square md:aspect-video w-full overflow-hidden relative group"
                            >
                                {product.images?.length > 0 ? (
                                <img
                                    src={product.images[0]}
                                    alt={product.title}
                                    draggable={false}
                                    className="w-full h-full object-cover pointer-events-none select-none"
                                />
                            ) : (
                                <div className="absolute inset-0 bg-gradient-to-br from-periwinkle/20 to-indigo-900 flex items-center justify-center">
                                    <span className="text-slate-lighter font-bold">Sem imagem</span>
                                </div>
                            )}
                                <div className="absolute top-6 right-6 flex flex-col gap-3">
                                    <button
                                        onClick={toggleFavorite}
                                        disabled={togglingFav || !session}
                                        className={`p-3 md:p-4 bg-card-bg/90 backdrop-blur-md rounded-full shadow-lg transition-all active:scale-90 ${
                                            favorited
                                                ? 'text-rose-400 bg-rose-500/20 shadow-rose-500/20'
                                                : 'text-slate-lighter hover:text-rose-400'
                                        } disabled:opacity-50`}
                                    >
                                        <Heart className={`w-5 h-5 ${favorited ? 'fill-rose-400' : ''}`} />
                                    </button>
                                    <button
                                        onClick={shareProduct}
                                        className="p-3 md:p-4 bg-card-bg/90 backdrop-blur-md rounded-full shadow-lg text-slate-lighter hover:text-periwinkle transition-all active:scale-90"
                                    >
                                        {shareCopied ? <Check className="w-5 h-5 text-emerald-400" /> : <Share2 className="w-5 h-5" />}
                                    </button>
                                </div>
                            </motion.div>

                            {product.images?.length > 1 && (
                                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                                    {product.images.slice(1).map((img, i) => (
                                        <motion.div
                                            key={i}
                                            initial={{ opacity: 0, scale: 0.9 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            transition={{ delay: i * 0.1 }}
                                            className="clay-card aspect-square bg-hover-bg overflow-hidden cursor-pointer hover:scale-95 transition-transform"
                                        >
                                            <img
                                                src={img}
                                                alt={`${product.title} ${i + 2}`}
                                                draggable={false}
                                                className="w-full h-full object-cover pointer-events-none select-none"
                                            />
                                        </motion.div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Mobile-only Title/Price (Visible only if not in desktop) */}
                        <div className="md:hidden space-y-1">
                            <h1 className="text-2xl font-black tracking-tighter mb-1 leading-none select-text">
                                {product.title}
                            </h1>
                            <p className="text-base font-bold text-periwinkle">{formatPrice(product.price, product.currency)}</p>
                        </div>

                        {/* Full Description & Details */}
                        <div className="space-y-6 md:space-y-10 pr-0 md:pr-12">
                            <section className="space-y-3 md:space-y-4">
                                <h2 className="text-xl md:text-2xl font-black tracking-tight">Sobre a peça</h2>
                                <p className="text-sm md:text-xl text-slate-light font-medium leading-relaxed select-text">
                                    {product.description}
                                </p>
                                {product.tags?.length > 0 && (
                                    <div className="flex flex-wrap gap-2 md:gap-3 pt-2">
                                        {product.tags.map(tag => (
                                            <span key={tag} className="px-3 py-1.5 md:px-4 md:py-2 bg-card-bg rounded-full text-xs md:text-sm font-bold text-slate-lighter cursor-pointer hover:text-periwinkle border border-slate-700 transition-colors">
                                                {tag}
                                            </span>
                                        ))}
                                    </div>
                                )}
                            </section>

                            <section className="space-y-3 md:space-y-4 pt-4 border-t border-slate-700">
                                <h3 className="text-base md:text-lg font-black tracking-tight">Detalhes da peça</h3>
                                <div className="grid grid-cols-2 gap-4 md:gap-6">
                                    <div className="space-y-1">
                                        <p className="text-xs font-bold text-slate-lighter uppercase tracking-widest">tamanho</p>
                                        <p className="font-bold text-off-white">—</p>
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-xs font-bold text-slate-lighter uppercase tracking-widest">estado</p>
                                        <p className="font-bold text-periwinkle">{CONDITION_LABELS[conditionKey] || conditionKey}</p>
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-xs font-bold text-slate-lighter uppercase tracking-widest">categoria</p>
                                        <p className="font-bold text-off-white">{product.category_name || "—"}</p>
                                    </div>
                                </div>
                            </section>

                            {/* Seller Info */}
                            <section className="clay-card p-4 md:p-8 flex items-center justify-between">
                                <div className="flex items-center gap-3 md:gap-4">
                                    <div className="h-10 w-10 md:h-14 md:w-14 bg-hover-bg rounded-full flex items-center justify-center overflow-hidden shadow-inner text-slate-lighter">
                                        {product.seller_image ? (
                                            <img src={product.seller_image} alt={product.seller_name} draggable={false} className="w-full h-full object-cover pointer-events-none" />
                                        ) : (
                                            <User className="w-6 h-6" />
                                        )}
                                    </div>
                                    <div>
                                        <p className="text-sm md:text-base font-black text-off-white leading-none mb-1">{product.seller_name}</p>
                                        <p className="text-[10px] md:text-xs font-bold text-slate-lighter">vendedor</p>
                                    </div>
                                </div>
                                <button
                                    onClick={toggleFollow}
                                    disabled={!session || Number((session.user as any)?.id) === Number(product?.seller_id)}
                                    className={`px-3 md:px-5 py-1.5 md:py-2 rounded-full border-2 font-bold text-xs md:text-sm transition-all active:scale-95 disabled:opacity-30 ${
                                        followState?.isFriend
                                            ? 'border-periwinkle bg-periwinkle/10 text-periwinkle'
                                            : followState?.isFollowing
                                            ? 'border-slate-700 bg-card-bg text-periwinkle'
                                            : 'border-slate-700 text-off-white hover:bg-hover-bg'
                                    }`}
                                >
                                    {followState?.isFriend ? 'amigos ⭐' : followState?.isFollowing ? 'a seguir' : 'seguir'}
                                </button>
                            </section>
                        </div>
                    </div>

                    {/* Right: Sticky Action Card (Desktop Only) */}
                    <div className="hidden md:block sticky top-32">
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="clay-card p-10 space-y-8 bg-card-bg/90 backdrop-blur-md"
                        >
                            <div>
                                <h1 className="text-4xl font-black tracking-tighter mb-2 leading-none">
                                    {product.title}
                                </h1>
                                <p className="text-3xl font-bold text-periwinkle">{formatPrice(product.price, product.currency)}</p>
                            </div>

                            <div className="space-y-4">
                                <button
                                    onClick={handleAddToCart}
                                    className="clay-btn w-full py-5 text-xl flex items-center justify-center gap-3"
                                >
                                    <ShoppingBag className="w-6 h-6" />
                                    Adiciona à bag
                                </button>
                                {session?.user && Number((session.user as any).id) !== Number(product?.seller_id) && (
                                    <button
                                        onClick={() => setShowContactModal(true)}
                                        className="clay-btn-secondary w-full py-4 text-base flex items-center justify-center gap-2"
                                    >
                                        <MessageCircle className="w-5 h-5" />
                                        Contactar vendedor
                                    </button>
                                )}
                                <p className="text-center text-[10px] text-slate-lighter font-bold flex items-center justify-center gap-1 uppercase tracking-widest">
                                    <ShieldCheck className="w-3 h-3" />
                                    Garantia SecondAvenue
                                </p>
                            </div>

                            <div className="pt-6 border-t border-slate-700 space-y-4">
                                <div className="flex items-center gap-3 text-sm text-slate-light font-medium">
                                    <div className="w-2 h-2 rounded-full bg-emerald-400" />
                                    Disponível para ver no estúdio
                                </div>
                                <div className="flex items-center gap-3 text-sm text-slate-light font-medium">
                                    <div className="w-2 h-2 rounded-full bg-periwinkle" />
                                    Envia em 24-48h
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </div>

            {/* Mobile Fixed Action Bar (The "Clean Bottom") */}
            {isMounted && (
                <motion.div
                    initial={{ y: 100 }}
                    animate={{ y: 0 }}
                    transition={{ type: "spring", damping: 25, stiffness: 200 }}
                    className="md:hidden fixed bottom-0 left-0 right-0 z-[60] bg-card-bg/90 backdrop-blur-xl border-t border-slate-700 px-4 md:px-6 py-3 md:py-4 pb-24 flex items-center justify-between"
                >
                    <div>
                        <p className="text-xs font-black text-slate-lighter uppercase tracking-widest mb-1">Preço</p>
                        <p className="text-lg font-black text-periwinkle leading-none">
                            {formatPrice(product.price, product.currency)}
                        </p>
                    </div>
                    <div className="flex items-center gap-2">
                        {session?.user && Number((session.user as any).id) !== Number(product?.seller_id) && (
                            <button
                                onClick={() => setShowContactModal(true)}
                                className="clay-btn-secondary px-3 md:px-4 py-3 md:py-4 text-xs flex items-center gap-2 whitespace-nowrap"
                            >
                                <MessageCircle className="w-4 h-4" />
                                <span className="md:hidden">Contactar</span>
                            </button>
                        )}
                        <button
                            onClick={handleAddToCart}
                            className="clay-btn px-4 md:px-8 py-3 md:py-4 text-xs md:text-base flex items-center gap-2"
                        >
                            <ShoppingBag className="w-5 h-5" />
                            <span className="hidden sm:inline">Adicionar</span>
                            <span className="sm:hidden">Bag</span>
                        </button>
                    </div>
                </motion.div>
            )}

            {/* Toast Notification */}
            <Toast
                message={toastMessage}
                visible={toastVisible}
                onClose={() => setToastVisible(false)}
            />

            {/* Contact Modal */}
            <AnimatePresence>
                {showContactModal && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
                        onClick={() => setShowContactModal(false)}
                    >
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            transition={{ type: "spring", damping: 25, stiffness: 300 }}
                            className="clay-card p-6 w-full max-w-md bg-card-bg"
                            onClick={e => e.stopPropagation()}
                        >
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-lg font-black tracking-tight">Contactar vendedor</h3>
                                <button
                                    onClick={() => setShowContactModal(false)}
                                    className="p-2 text-slate-lighter hover:text-off-white hover:bg-hover-bg rounded-xl transition-all"
                                >
                                    <X className="w-4 h-4" />
                                </button>
                            </div>
                            <p className="text-sm text-slate-light font-medium mb-3">
                                Mensagem para <span className="text-periwinkle">{product.seller_name}</span>
                            </p>
                            <textarea
                                value={contactMessage}
                                onChange={e => setContactMessage(e.target.value)}
                                placeholder="Olá! Tenho interesse neste anúncio..."
                                rows={4}
                                className="w-full bg-charcoal border border-slate-700 rounded-2xl px-4 py-3 text-sm text-off-white placeholder-slate-lighter/50 focus:outline-none focus:border-periwinkle resize-none transition-colors"
                            />
                            <div className="flex justify-end gap-3 mt-4">
                                <button
                                    onClick={() => setShowContactModal(false)}
                                    className="px-5 py-3 rounded-2xl text-sm font-bold text-slate-lighter hover:text-off-white hover:bg-hover-bg transition-all"
                                >
                                    Cancelar
                                </button>
                                <button
                                    onClick={async () => {
                                        if (!contactMessage.trim() || sendingContact || !product) return;
                                        setSendingContact(true);
                                        try {
                                            const res = await fetch("/api/conversations", {
                                                method: "POST",
                                                headers: { "Content-Type": "application/json" },
                                                body: JSON.stringify({
                                                    listing_id: product.id,
                                                    receiver_id: product.seller_id,
                                                    content: contactMessage.trim(),
                                                }),
                                            });
                                            if (!res.ok) throw new Error("Erro ao enviar");
                                            const data = await res.json();
                                            router.push(`/messages/${data.conversation_id}`);
                                        } catch (err) {
                                            console.error(err);
                                        } finally {
                                            setSendingContact(false);
                                        }
                                    }}
                                    disabled={!contactMessage.trim() || sendingContact}
                                    className="clay-btn px-6 py-3 text-sm flex items-center gap-2 disabled:opacity-30"
                                >
                                    {sendingContact ? (
                                        <Loader2 className="w-4 h-4 animate-spin" />
                                    ) : (
                                        <Send className="w-4 h-4" />
                                    )}
                                    Enviar
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </main>
    );
}
