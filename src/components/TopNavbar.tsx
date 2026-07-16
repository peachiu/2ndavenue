"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Search, Heart, MessageCircle, X, Home, Plus, ShoppingBag } from "lucide-react";
import { useState, useRef } from "react";
import UserNav from "./UserNav";
import { useCart } from "@/context/CartContext";

export default function TopNavbar() {
    const router = useRouter();
    const { openCart, totalItems } = useCart();

    const [searchQuery, setSearchQuery] = useState("");
    const inputRef = useRef<HTMLInputElement>(null);

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
            <div className="max-w-7xl mx-auto px-4 md:px-8 h-16 md:h-20 flex items-center justify-between gap-3">
                {/* Left: Logo */}
                <Link href="/" className="flex items-center gap-2 md:gap-3 group flex-shrink-0">
                    <img src="/logo.png" alt="SecondAvenue"
                        className="h-8 w-8 md:h-10 md:w-10 object-contain"
                        style={{ borderRadius: 16 }}
                    />
                    <span className="text-lg md:text-xl font-black tracking-tighter text-off-white lowercase hidden sm:block">
                        secondavenue
                    </span>
                </Link>

                {/* Center: Search bar (Apple-style pill) */}
                <div className="flex-1 flex justify-center max-w-lg">
                    <form onSubmit={handleSubmit} className="w-full">
                        <div className="relative">
                            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 md:w-4 md:h-4 text-slate-lighter pointer-events-none" />
                            <input
                                ref={inputRef}
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                onKeyDown={(e) => e.key === 'Escape' && setSearchQuery('')}
                                placeholder="Pesquisa..."
                                className="w-full bg-card-bg text-off-white placeholder-slate-lighter/60 rounded-full py-2 md:py-2.5 pl-10 pr-9 text-xs md:text-sm font-medium border border-slate-700 focus:outline-none focus:border-periwinkle focus:ring-2 focus:ring-periwinkle/20 transition-all"
                            />
                            {searchQuery && (
                                <button
                                    type="button"
                                    onClick={() => setSearchQuery('')}
                                    className="absolute right-2.5 top-1/2 -translate-y-1/2 p-0.5 rounded-full text-slate-lighter hover:text-off-white transition-colors"
                                >
                                    <X className="w-3.5 h-3.5" />
                                </button>
                            )}
                        </div>
                    </form>
                </div>

                {/* Right: Actions — desktop gets full nav, mobile delegates to dock */}
                <div className="flex items-center gap-0.5 md:gap-2">
                    <Link href="/" className="hidden md:inline-flex">
                        <button className="p-2 md:p-2.5 text-slate-lighter hover:text-periwinkle hover:bg-hover-bg rounded-2xl transition-all">
                            <Home className="w-4 h-4 md:w-5 md:h-5" />
                        </button>
                    </Link>
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
                    <Link href="/create-listing" className="hidden md:inline-flex">
                        <button className="p-2 md:p-2.5 text-slate-lighter hover:text-periwinkle hover:bg-hover-bg rounded-2xl transition-all">
                            <Plus className="w-4 h-4 md:w-5 md:h-5" />
                        </button>
                    </Link>
                    <button onClick={openCart} className="hidden md:inline-flex p-2 md:p-2.5 text-slate-lighter hover:text-periwinkle hover:bg-hover-bg rounded-2xl transition-all relative">
                        <ShoppingBag className="w-4 h-4 md:w-5 md:h-5" />
                        {totalItems > 0 && (
                            <span className="absolute -top-0.5 -right-0.5 bg-periwinkle text-charcoal text-[9px] font-black min-w-[16px] h-4 flex items-center justify-center rounded-full px-1 shadow-lg">
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
