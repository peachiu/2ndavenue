"use client";

import {
    Filter, Grid3X3, Shirt, Footprints, Watch, Monitor,
    Sofa, Car, Trophy, BookOpen, Palette, Baby,
    Sparkles, PawPrint, Package, LayoutGrid, List, LayoutDashboard,
    type LucideIcon
} from "lucide-react";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import ProductGrid from "./ProductGrid";

// Map icon names from DB to Lucide components
const iconMap: Record<string, LucideIcon> = {
    Shirt, Footprints, Watch, Monitor, Sofa, Car,
    Trophy, BookOpen, Palette, Baby, Sparkles, PawPrint, Package,
};

interface Category {
    id: number;
    slug: string;
    name_pt: string;
    name_en: string;
    icon: string;
    parent_id: number | null;
    sort_order: number;
}

interface Product {
    id: number;
    title: string;
    price: number;
    currency: string;
    image_url: string;
    category_id: number;
    condition_rating: string;
    tags?: string;
    stock?: number;
    views?: number;
}

export default function ProductFeed() {
    const [activeCategoryId, setActiveCategoryId] = useState<number | null>(null);
    const [categories, setCategories] = useState<Category[]>([]);
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [layout, setLayout] = useState<"grid" | "list" | "mosaic">("grid");

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [catRes, prodRes] = await Promise.all([
                    fetch('/api/categories?parent_id=null'),
                    fetch('/api/listings'),
                ]);
                const catData = await catRes.json();
                const prodData = await prodRes.json();
                setCategories(catData);
                setProducts(prodData);
            } catch (error) {
                console.error('Error fetching data:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const filteredProducts = activeCategoryId === null
        ? products
        : products.filter(p => p.category_id === activeCategoryId);

    return (
        <section id="discover" className="max-w-7xl mx-auto px-4 md:px-8 mb-20 scroll-mt-32">
            {/* Header Content */}
            <div className="mb-12 space-y-6">
                <h2 className="text-5xl md:text-7xl font-black tracking-tighter animate-in">
                    Descobre tudo
                </h2>
                <style jsx>{`
                    .animate-in {
                        animation: fadeSlideIn 0.6s ease-out both;
                    }
                    @keyframes fadeSlideIn {
                        from { opacity: 0; transform: translateX(-20px); }
                        to { opacity: 1; transform: translateX(0); }
                    }
                `}</style>

                {/* Row 1: Tudo + Layout switcher + Filters + Sort */}
                <div className="flex flex-wrap items-center gap-3">
                    <button
                        onClick={() => setActiveCategoryId(null)}
                        className={`px-5 py-2 rounded-full font-bold text-sm flex items-center gap-1.5 transition-all will-change-transform active:scale-95 ${
                            activeCategoryId === null
                                ? 'bg-periwinkle text-charcoal shadow-clay-btn'
                                : 'bg-card-bg text-slate-light hover:bg-hover-bg hover:text-periwinkle border border-slate-700'
                        }`}
                    >
                        <Grid3X3 className="w-4 h-4" />
                        Tudo
                    </button>

                    <div className="flex items-center gap-3">
                        {/* Layout switcher */}
                        <div className="flex items-center gap-1 bg-card-bg rounded-full border border-slate-700 p-1">
                            {[
                                { key: "grid", icon: LayoutGrid, label: "Grelha" },
                                { key: "list", icon: List, label: "Lista" },
                                { key: "mosaic", icon: LayoutDashboard, label: "Mosaico" },
                            ].map(({ key, icon: Icon, label }) => (
                                <button
                                    key={key}
                                    onClick={() => setLayout(key as typeof layout)}
                                    className={`px-3 py-1.5 rounded-full font-bold text-xs flex items-center gap-1.5 transition-all will-change-transform active:scale-95 ${
                                        layout === key
                                            ? "bg-periwinkle text-charcoal shadow-sm"
                                            : "text-slate-light hover:text-periwinkle"
                                    }`}
                                    title={label}
                                >
                                    <Icon className="w-3.5 h-3.5" />
                                    <span className="hidden sm:inline">{label}</span>
                                </button>
                            ))}
                        </div>

                        <button className="flex items-center gap-2 px-4 py-2 bg-card-bg rounded-full font-bold text-sm text-slate-light shadow-sm border border-slate-700 transition-all will-change-transform hover:brightness-110 active:scale-95">
                            <Filter className="w-4 h-4" />
                            <span className="hidden sm:inline">Filtros</span>
                        </button>
                        <div className="px-4 py-2 bg-card-bg rounded-full font-bold text-sm text-slate-light shadow-sm border border-slate-700 flex items-center gap-2 select-none">
                            <span className="hidden sm:inline">Ordenar:</span>
                            <span className="text-periwinkle capitalize text-xs sm:text-sm">Mais recente</span>
                        </div>
                    </div>
                </div>

                {/* Row 2: Dynamic categories */}
                <motion.div
                    initial="hidden"
                    animate="visible"
                    variants={{
                        visible: { transition: { staggerChildren: 0.02 } },
                    }}
                    className="flex flex-wrap gap-2"
                >
                    {categories.map((cat) => {
                        const IconComponent = iconMap[cat.icon];
                        return (
                            <motion.button
                                key={cat.id}
                                variants={{
                                    hidden: { opacity: 0, y: 12 },
                                    visible: { opacity: 1, y: 0 },
                                }}
                                transition={{ type: "spring", stiffness: 260, damping: 24 }}
                                onClick={() => setActiveCategoryId(cat.id)}
                                className={`px-5 py-2 rounded-full font-bold text-sm flex items-center gap-1.5 will-change-transform ${activeCategoryId === cat.id
                                    ? 'bg-periwinkle text-charcoal shadow-clay-btn'
                                    : 'bg-card-bg text-slate-light hover:bg-hover-bg hover:text-periwinkle border border-slate-700'
                                    }`}
                            >
                                {IconComponent && <IconComponent className="w-4 h-4" />}
                                {cat.name_pt}
                            </motion.button>
                        );
                    })}
                </motion.div>
            </div>

            {/* Smart Bento Grid */}
            {loading ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
                    {[...Array(8)].map((_, i) => (
                        <div key={i} className="aspect-square rounded-[2rem] bg-card-bg border border-slate-700 animate-pulse" />
                    ))}
                </div>
            ) : (
                <ProductGrid products={filteredProducts} layout={layout} />
            )}
        </section>
    );
}
