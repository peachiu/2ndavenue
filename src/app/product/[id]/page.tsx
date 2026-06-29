"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Heart, Share2, ShoppingBag, ShieldCheck, User, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useTranslation } from "@/context/TranslationContext";
import { useCurrency } from "@/context/CurrencyContext";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

export default function ProductDetailPage() {
    const { t } = useTranslation();
    const { formatPrice } = useCurrency();
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    // Placeholder data - in a real app, this would come from a database based on the ID
    const product = {
        title: "Vintage Denim Jacket",
        price: 85.00,
        currency: "EUR",
        condition: "mint",
        description: "rare 90s vintage denim jacket with custom patch details. perfectly worn-in feel, oversized aesthetic. ethically sourced and curated for secondavenue.",
        tags: ['#vintage', '#denim', '#y2k', '#aesthetic'],
        seller: {
            name: "dinis.v",
            rating: 4.9,
            reviews: 128
        }
    };

    const conditionKey = `cond.${product.condition.toLowerCase().replace(" ", "_")}`;

    return (
        <main className="min-h-screen bg-charcoal pb-32 md:pb-20 pt-8">
            <div className="max-w-7xl mx-auto px-4 md:px-8">
                {/* Back Button */}
                <Link href="/" className="inline-flex items-center gap-2 text-sm font-black text-slate-lighter lowercase hover:text-periwinkle transition-colors mb-8 group">
                    <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                    {t("back_to_feed") || "back to feed"}
                </Link>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-12 items-start">

                    {/* Left: Messy Content (Images + Description) */}
                    <div className="md:col-span-2 space-y-12">
                        {/* Image Gallery */}
                        <div className="flex flex-col gap-6">
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="clay-card aspect-square md:aspect-video w-full overflow-hidden relative group"
                            >
                                <div className="absolute inset-0 bg-gradient-to-br from-periwinkle/20 to-indigo-900 flex items-center justify-center">
                                    <span className="text-slate-lighter font-bold lowercase">imagens do produto</span>
                                </div>
                                <div className="absolute top-6 right-6 flex flex-col gap-3">
                                    <button className="p-4 bg-card-bg/90 backdrop-blur-md rounded-full shadow-lg hover:text-rose-500 transition-colors">
                                        <Heart className="w-5 h-5" />
                                    </button>
                                    <button className="p-4 bg-card-bg/90 backdrop-blur-md rounded-full shadow-lg transition-colors">
                                        <Share2 className="w-5 h-5" />
                                    </button>
                                </div>
                            </motion.div>

                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                                {[1, 2, 3, 4].map((i) => (
                                    <motion.div
                                        key={i}
                                        initial={{ opacity: 0, scale: 0.9 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        transition={{ delay: i * 0.1 }}
                                        className="clay-card aspect-square bg-hover-bg cursor-pointer hover:scale-95 transition-transform"
                                    />
                                ))}
                            </div>
                        </div>

                        {/* Mobile-only Title/Price (Visible only if not in desktop) */}
                        <div className="md:hidden space-y-2">
                            <h1 className="text-4xl font-black lowercase tracking-tighter">
                                {product.title}
                            </h1>
                            <p className="text-2xl font-bold text-periwinkle">{formatPrice(product.price, product.currency)}</p>
                        </div>

                        {/* Full Description & Details */}
                        <div className="space-y-10 pr-0 md:pr-12">
                            <section className="space-y-4">
                                <h2 className="text-2xl font-black lowercase tracking-tight">{t("about_the_item")}</h2>
                                <p className="text-xl text-slate-light font-medium leading-relaxed">
                                    {product.description}
                                </p>
                                <div className="flex flex-wrap gap-3 pt-2">
                                    {product.tags.map(tag => (
                                        <span key={tag} className="px-4 py-2 bg-card-bg rounded-full text-sm font-bold text-slate-lighter cursor-pointer hover:text-periwinkle border border-slate-700 transition-colors">
                                            {tag}
                                        </span>
                                    ))}
                                </div>
                            </section>

                            <section className="space-y-4 pt-4 border-t border-slate-700">
                                <h3 className="text-lg font-black lowercase tracking-tight">{t("item_specifics")}</h3>
                                <div className="grid grid-cols-2 gap-6">
                                    <div className="space-y-1">
                                        <p className="text-xs font-bold text-slate-lighter uppercase tracking-widest">{t("size")}</p>
                                        <p className="font-bold text-off-white">L (Large)</p>
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-xs font-bold text-slate-lighter uppercase tracking-widest">{t("condition")}</p>
                                        <p className="font-bold text-periwinkle">{t(conditionKey)}</p>
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-xs font-bold text-slate-lighter uppercase tracking-widest">{t("category")}</p>
                                        <p className="font-bold text-off-white">{t("cat.apparel")}</p>
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-xs font-bold text-slate-lighter uppercase tracking-widest">{t("aesthetic")}</p>
                                        <p className="font-bold text-off-white">vintage / 90s</p>
                                    </div>
                                </div>
                            </section>

                            {/* Seller Info */}
                            <section className="clay-card p-8 flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                    <div className="h-14 w-14 bg-hover-bg rounded-full flex items-center justify-center shadow-inner text-slate-lighter">
                                        <User className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <p className="font-black text-off-white lowercase leading-none mb-1">{product.seller.name}</p>
                                        <p className="text-xs font-bold text-periwinkle">{product.seller.rating} ★ ({product.seller.reviews} avaliações)</p>
                                    </div>
                                </div>
                                <button className="px-5 py-2 rounded-full border-2 border-slate-700 font-bold text-off-white hover:bg-hover-bg transition-colors">
                                    {t("follow")}
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
                                <h1 className="text-4xl font-black lowercase tracking-tighter mb-2 leading-none">
                                    {product.title}
                                </h1>
                                <p className="text-3xl font-bold text-periwinkle">{formatPrice(product.price, product.currency)}</p>
                            </div>

                            <div className="space-y-4">
                                <button className="clay-btn w-full py-5 text-xl flex items-center justify-center gap-3">
                                    <ShoppingBag className="w-6 h-6" />
                                    {t("add_to_bag")}
                                </button>
                                <p className="text-center text-[10px] text-slate-lighter font-bold flex items-center justify-center gap-1 uppercase tracking-widest">
                                    <ShieldCheck className="w-3 h-3" />
                                    {t("secondavenue_guarantee")}
                                </p>
                            </div>

                            <div className="pt-6 border-t border-slate-700 space-y-4">
                                <div className="flex items-center gap-3 text-sm text-slate-light font-medium">
                                    <div className="w-2 h-2 rounded-full bg-emerald-400" />
                                    {t("available_viewing")}
                                </div>
                                <div className="flex items-center gap-3 text-sm text-slate-light font-medium">
                                    <div className="w-2 h-2 rounded-full bg-periwinkle" />
                                    {t("ships_soon")}
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
                    className="md:hidden fixed bottom-0 left-0 right-0 z-[60] bg-card-bg/90 backdrop-blur-xl border-t border-slate-700 px-6 py-6 pb-8 flex items-center justify-between"
                >
                    <div>
                        <p className="text-xs font-black text-slate-lighter uppercase tracking-widest mb-1">{t("price")}</p>
                        <p className="text-3xl font-black text-periwinkle leading-none">
                            {formatPrice(product.price, product.currency)}
                        </p>
                    </div>
                    <button className="clay-btn px-10 py-5 text-lg flex items-center gap-3 h-full">
                        {t("buy_now")}
                    </button>
                </motion.div>
            )}
        </main>
    );
}
