"use client";

import { useTranslation } from "@/context/TranslationContext";
import { Filter } from "lucide-react";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import ProductGrid from "./ProductGrid";

const CATEGORIES = ['all', 'apparel', 'accessories', 'home', 'tech', 'vintage', 'vehicles', 'media'] as const;

interface Product {
    id: number;
    title: string;
    price: number;
    currency: string;
    image_url: string;
    category: string;
    condition_rating: string;
    tags?: string;
    stock?: number;
    views?: number;
}

export default function ProductFeed() {
    const { t } = useTranslation();
    const [activeCategory, setActiveCategory] = useState<string>('all');
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await fetch('/api/listings');
                const data = await response.json();
                setProducts(data);
            } catch (error) {
                console.error('Error fetching products:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, []);

    const filteredProducts = activeCategory === 'all'
        ? products
        : products.filter(p => p.category === activeCategory);

    return (
        <section id="discover" className="max-w-7xl mx-auto px-4 md:px-8 mb-20 scroll-mt-32">
            {/* Header Content */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
                <div className="space-y-4">
                    <motion.h2
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                        className="text-5xl md:text-7xl font-black lowercase tracking-tighter"
                    >
                        {t("feed.title")}
                    </motion.h2>
                    <div className="flex flex-wrap gap-2">
                        {CATEGORIES.map((cat, idx) => (
                            <motion.button
                                key={cat}
                                initial={{ opacity: 0, scale: 0.8 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                viewport={{ once: true }}
                                transition={{ delay: idx * 0.05 }}
                                onClick={() => setActiveCategory(cat)}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className={`px-5 py-2 rounded-full font-bold text-sm transition-all ${activeCategory === cat
                                    ? 'bg-periwinkle text-white shadow-clay-btn scale-105'
                                    : 'bg-white text-slate-500 hover:bg-slate-50 hover:text-periwinkle border border-slate-100'
                                    }`}
                            >
                                {t(`cat.${cat}`)}
                            </motion.button>
                        ))}
                    </div>
                </div>

                <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    className="flex items-center gap-4"
                >
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="flex items-center gap-2 px-6 py-3 bg-white rounded-full font-bold text-slate-600 shadow-sm border border-slate-100"
                    >
                        <Filter className="w-4 h-4" />
                        <span>{t("feed.filters")}</span>
                    </motion.button>
                    <div className="px-6 py-3 bg-white rounded-full font-bold text-slate-600 shadow-sm border border-slate-100 flex items-center gap-2">
                        <span>{t("feed.sort")}:</span>
                        <span className="text-periwinkle capitalize">{t("feed.sort.newest")}</span>
                    </div>
                </motion.div>
            </div>

            {/* Smart Bento Grid */}
            {loading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 animate-pulse">
                    {[...Array(8)].map((_, i) => (
                        <div key={i} className="h-64 bg-slate-100 rounded-3xl" />
                    ))}
                </div>
            ) : (
                <ProductGrid products={filteredProducts} />
            )}
        </section>
    );
}
