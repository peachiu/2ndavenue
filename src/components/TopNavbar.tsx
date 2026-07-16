"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import {
    Search, Shirt, Footprints, Watch, Monitor,
    Sofa, Car, Trophy, BookOpen, Palette, Baby,
    Sparkles, PawPrint, Package, Heart, MessageCircle, ShoppingBag, X, type LucideIcon
} from "lucide-react";
import { useState, useEffect, useRef } from "react";
import UserNav from "./UserNav";
import { useCart } from "@/context/CartContext";

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

export default function TopNavbar() {
    const router = useRouter();
    const { openCart, totalItems } = useCart();
    const [categories, setCategories] = useState<Category[]>([]);
    const [searchOpen, setSearchOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const inputRef = useRef<HTMLInputElement>(null);
    const searchContainerRef = useRef<HTMLFormElement>(null);

    useEffect(() => {
        fetch('/api/categories?parent_id=null')
            .then(res => res.json())
            .then(data => setCategories(data.slice(0, 4))) // Show first 4
            .catch(() => {});
    }, []);

    // Focus input when search opens
    useEffect(() => {
        if (searchOpen && inputRef.current) {
            inputRef.current.focus();
        }
    }, [searchOpen]);

    // Close search on click outside
    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (searchContainerRef.current && !searchContainerRef.current.contains(e.target as Node)) {
                setSearchOpen(false);
                setSearchQuery("");
            }
        };
        if (searchOpen) {
            document.addEventListener("mousedown", handleClickOutside);
        }
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [searchOpen]);

    const handleSearchIcon = () => {
        if (searchOpen) {
            // Second click → execute search
            const q = searchQuery.trim();
            if (q) {
                router.push(`/search?q=${encodeURIComponent(q)}`);
                setSearchQuery("");
                setSearchOpen(false);
            }
        } else {
            // First click → open search bar
            setSearchOpen(true);
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const q = searchQuery.trim();
        if (q) {
            router.push(`/search?q=${encodeURIComponent(q)}`);
            setSearchQuery("");
            setSearchOpen(false);
        }
    };

    return (
        <nav className="fixed top-0 left-0 right-0 z-50 bg-card-bg/90 backdrop-blur-md border-b border-slate-700">
            <div className="max-w-7xl mx-auto px-4 md:px-8 h-20 flex items-center justify-between">
                {/* Left: Floating Logo */}
                <Link href="/" className="flex items-center gap-3 group">
                    <div className="h-10 w-10 bg-periwinkle rounded-2xl flex items-center justify-center shadow-clay-card group-hover:shadow-clay-hover group-hover:-rotate-2 transition-all duration-300">
                        <span className="text-off-white font-black text-2xl leading-[0] -translate-y-1">s</span>
                    </div>
                    <span className="text-xl font-black tracking-tighter text-off-white lowercase hidden sm:block">
                        secondavenue
                    </span>
                </Link>

                {/* Center: Desktop Links (dynamic from DB) — hide on tablet, show on lg+ */}
                <div className="hidden lg:flex items-center gap-5 translate-x-4">
                    {categories.map((cat) => {
                        const IconComponent = iconMap[cat.icon];
                        return (
                            <Link
                                key={cat.id}
                                href={`/feed?cat=${cat.slug}`}
                                className="text-sm font-bold text-slate-light hover:text-periwinkle transition-all flex items-center gap-1.5"
                            >
                                {IconComponent && <IconComponent className="w-4 h-4" />}
                                {cat.name_pt}
                            </Link>
                        );
                    })}
                    <Link
                        href="/feed"
                        className="text-sm font-bold text-periwinkle hover:text-off-white transition-all"
                    >
                        Ver tudo
                    </Link>
                </div>

                {/* Right: Actions */}
                <div className="flex items-center gap-2 md:gap-4">
                    {/* Expandable search */}
                    <form onSubmit={handleSubmit} ref={searchContainerRef}>
                        <div className="relative flex items-center">
                            <button
                                type="button"
                                onClick={handleSearchIcon}
                                className={`p-2 md:p-3 rounded-2xl transition-all ${
                                    searchOpen
                                        ? 'text-periwinkle bg-hover-bg'
                                        : 'text-slate-lighter hover:text-periwinkle hover:bg-hover-bg'
                                }`}
                                aria-label="Pesquisar"
                            >
                                <Search className="w-4 h-4 md:w-5 md:h-5" />
                            </button>
                            <div className={`relative transition-all duration-300 ease-in-out overflow-hidden ${
                                searchOpen ? 'opacity-100 w-48 md:w-64 ml-2' : 'opacity-0 w-0 ml-0'
                            }`}>
                                <input
                                    ref={inputRef}
                                    type="text"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    onKeyDown={(e) => e.key === 'Escape' && (setSearchOpen(false), setSearchQuery(''))}
                                    placeholder="Pesquisar..."
                                    className="w-full bg-card-bg text-off-white placeholder-slate-lighter rounded-2xl py-2 pl-4 pr-10 text-sm font-medium border border-slate-700 focus:outline-none focus:border-periwinkle"
                                />
                                {searchQuery && (
                                    <button
                                        type="button"
                                        onClick={() => setSearchQuery('')}
                                        className="absolute right-1 top-1/2 -translate-y-1/2 p-1 rounded-full text-slate-lighter hover:text-off-white transition-colors"
                                    >
                                        <X className="w-4 h-4" />
                                    </button>
                                )}
                            </div>
                        </div>
                    </form>

                    <Link href="/favorites">
                        <button className="p-2 md:p-3 text-slate-lighter hover:text-rose-400 hover:bg-hover-bg rounded-2xl transition-all">
                            <Heart className="w-4 h-4 md:w-5 md:h-5" />
                        </button>
                    </Link>
                    <Link href="/messages">
                        <button className="p-2 md:p-3 text-slate-lighter hover:text-periwinkle hover:bg-hover-bg rounded-2xl transition-all">
                            <MessageCircle className="w-4 h-4 md:w-5 md:h-5" />
                        </button>
                    </Link>

                    {/* Cart Button */}
                    <button
                        onClick={openCart}
                        className="relative p-2 md:p-3 text-slate-lighter hover:text-periwinkle hover:bg-hover-bg rounded-2xl transition-all"
                        aria-label="Abrir carrinho"
                    >
                        <ShoppingBag className="w-4 h-4 md:w-5 md:h-5" />
                        {totalItems > 0 && (
                            <span className="absolute -top-0.5 -right-0.5 md:-top-1 md:-right-1 bg-periwinkle text-charcoal text-[9px] md:text-[10px] font-black min-w-[16px] md:min-w-[20px] h-4 md:h-5 flex items-center justify-center rounded-full px-1 shadow-lg">
                                {totalItems > 99 ? "99+" : totalItems}
                            </span>
                        )}
                    </button>

                    <UserNav />
                </div>
            </div>
        </nav>
    );
}
