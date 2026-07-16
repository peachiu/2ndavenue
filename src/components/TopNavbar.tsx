"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import {
    Search, Shirt, Footprints, Watch, Monitor,
    Sofa, Car, Trophy, BookOpen, Palette, Baby,
    Sparkles, PawPrint, Package, Heart, MessageCircle, X, type LucideIcon
} from "lucide-react";
import { useState, useEffect, useRef } from "react";
import UserNav from "./UserNav";

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

    const [categories, setCategories] = useState<Category[]>([]);
    const [searchQuery, setSearchQuery] = useState("");
    const inputRef = useRef<HTMLInputElement>(null);
    const searchContainerRef = useRef<HTMLFormElement>(null);

    useEffect(() => {
        fetch('/api/categories?parent_id=null')
            .then(res => res.json())
            .then(data => setCategories(data.slice(0, 4))) // Show first 4
            .catch(() => {});
    }, []);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const q = searchQuery.trim();
        if (q) {
            router.push(`/search?q=${encodeURIComponent(q)}`);
            setSearchQuery("");
        }
    };

    return (
        <nav className="fixed top-0 left-0 right-0 z-50 bg-card-bg/90 backdrop-blur-md border-b border-slate-700">
            <div className="max-w-7xl mx-auto px-4 md:px-8 h-20 flex items-center justify-between">
                {/* Left: Floating Logo */}
                <Link href="/" className="flex items-center gap-3 group">
                    <img src="/logo.png" alt="SecondAvenue"
                        className="h-10 w-10 object-contain"
                        style={{ borderRadius: 16 }}
                    />
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

                {/* Center: Always-open search bar (Apple-style pill) */}
                <div className="flex-1 flex justify-center px-4">
                    <form onSubmit={handleSubmit} ref={searchContainerRef} className="w-full max-w-lg">
                        <div className="relative">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-lighter pointer-events-none" />
                            <input
                                ref={inputRef}
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                onKeyDown={(e) => e.key === 'Escape' && setSearchQuery('')}
                                placeholder="Pesquisa artigos..."
                                className="w-full bg-card-bg text-off-white placeholder-slate-lighter/60 rounded-full py-2.5 pl-11 pr-10 text-sm font-medium border border-slate-700 focus:outline-none focus:border-periwinkle focus:ring-2 focus:ring-periwinkle/20 transition-all text-center md:text-left"
                            />
                            {searchQuery && (
                                <button
                                    type="button"
                                    onClick={() => setSearchQuery('')}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 p-0.5 rounded-full text-slate-lighter hover:text-off-white transition-colors"
                                >
                                    <X className="w-4 h-4" />
                                </button>
                            )}
                        </div>
                    </form>
                </div>

                {/* Right: Actions */}
                <div className="flex items-center gap-2 md:gap-3">
                    <Link href="/favorites" className="hidden md:inline-flex">
                        <button className="p-2 md:p-2.5 text-slate-lighter hover:text-rose-400 hover:bg-hover-bg rounded-2xl transition-all">
                            <Heart className="w-4 h-4 md:w-5 md:h-5" />
                        </button>
                    </Link>
                    <Link href="/messages" className="hidden md:inline-flex">
                        <button className="p-2 md:p-2.5 text-slate-lighter hover:text-periwinkle hover:bg-hover-bg rounded-2xl transition-all">
                            <MessageCircle className="w-4 h-4 md:w-5 md:h-5" />
                        </button>
                    </Link>
                    <UserNav />
                </div>
            </div>
        </nav>
    );
}
