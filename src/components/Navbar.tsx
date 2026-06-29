"use client";

import Link from "next/link";
import { ShoppingBag, Search } from "lucide-react";
import { useTranslation } from "@/context/TranslationContext";

export default function Navbar() {
    const { t } = useTranslation();

    return (
        <nav className="fixed top-6 left-1/2 -translate-x-1/2 w-[95%] max-w-7xl z-50">
            <div className="bg-card-bg/90 backdrop-blur-md border border-slate-700 rounded-full px-6 py-3 flex items-center justify-between shadow-clay-card hover:shadow-clay-hover transition-all duration-500 group">

                {/* Logo Section */}
                <Link href="/" className="flex items-center gap-3">
                    <div className="h-10 w-10 bg-periwinkle rounded-full flex items-center justify-center shadow-inner text-off-white font-black text-2xl leading-none pb-[6px] group-hover:scale-110 transition-transform">
                        s
                    </div>
                    <span className="text-xl font-black tracking-tight text-off-white lowercase hidden sm:block">
                        secondavenue
                    </span>
                </Link>

                {/* Navigation Links */}
                <div className="hidden md:flex items-center gap-8">
                    <Link href="/feed" className="text-sm font-bold text-slate-light hover:text-periwinkle transition-colors lowercase">
                        {t("nav.feed")}
                    </Link>
                    <Link href="#" className="text-sm font-bold text-slate-light hover:text-periwinkle transition-colors lowercase">
                        {t("nav.collections")}
                    </Link>
                    <Link href="#" className="text-sm font-bold text-slate-light hover:text-periwinkle transition-colors lowercase">
                        {t("nav.about")}
                    </Link>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-3">
                    <button className="h-10 w-10 rounded-full flex items-center justify-center text-slate-lighter hover:bg-hover-bg transition-colors">
                        <Search className="w-5 h-5" />
                    </button>

                    <Link href="/dashboard">
                        <button className="hidden sm:flex items-center gap-2 bg-periwinkle text-white px-5 py-2 rounded-full font-bold text-sm shadow-clay-btn hover:scale-105 active:scale-95 transition-all">
                            <ShoppingBag className="w-4 h-4" />
                            {t("nav.cart")} (0)
                        </button>
                        {/* Mobile Mobile Icon */}
                        <button className="sm:hidden h-10 w-10 bg-periwinkle text-white rounded-full flex items-center justify-center shadow-clay-btn">
                            <ShoppingBag className="w-5 h-5" />
                        </button>
                    </Link>
                </div>

            </div>
        </nav>
    );
}
