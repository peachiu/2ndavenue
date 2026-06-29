"use client";

import Link from "next/link";
import { Search } from "lucide-react";
import { motion } from "framer-motion";
import UserNav from "./UserNav";
import { useTranslation } from "@/context/TranslationContext";

export default function TopNavbar() {
    const { t } = useTranslation();

    return (
        <nav className="fixed top-0 left-0 right-0 z-50 bg-card-bg/90 backdrop-blur-md border-b border-slate-700">
            <div className="max-w-7xl mx-auto px-4 md:px-8 h-20 flex items-center justify-between">
                {/* Left: Floating Logo */}
                <Link href="/" className="flex items-center gap-3 group">
                    <div className="h-10 w-10 bg-periwinkle rounded-2xl flex items-center justify-center shadow-clay-card group-hover:shadow-clay-hover group-hover:-rotate-2 transition-all duration-300">
                        <span className="text-charcoal font-black text-2xl lowercase leading-none pb-[4px]">s</span>
                    </div>
                    <span className="text-xl font-black tracking-tighter text-off-white lowercase hidden sm:block">
                        secondavenue
                    </span>
                </Link>

                {/* Center: Desktop Links */}
                <div className="hidden md:flex items-center gap-8 translate-x-4">
                    {['tech', 'apparel', 'home'].map((cat) => (
                        <Link
                            key={cat}
                            href={`/feed?cat=${cat}`}
                            className="text-sm font-bold text-slate-light hover:text-periwinkle transition-all lowercase"
                        >
                            {t(`cat.${cat}`)}
                        </Link>
                    ))}
                </div>

                {/* Right: Actions */}
                <div className="flex items-center gap-2 md:gap-4">
                    <button className="p-3 text-slate-lighter hover:text-periwinkle hover:bg-hover-bg rounded-2xl transition-all">
                        <Search className="w-5 h-5" />
                    </button>
                    <UserNav />
                </div>
            </div>
        </nav>
    );
}
