"use client";

import ProductFeed from "@/components/ProductFeed";
import { useTranslation } from "@/context/TranslationContext";

export default function FeedPage() {
    const { t } = useTranslation();

    return (
        <main className="min-h-screen pb-20 pt-12 bg-charcoal">
            <div className="max-w-7xl mx-auto">
                {/* 
                  We removed the redundant local Navbar and 'Discover Everything' header 
                  because ProductFeed already includes the animated header and 
                  the global TopNavbar handles navigation.
                */}
                <ProductFeed />

                {/* Secondary Actions */}
                <div className="text-center pb-20">
                    <button className="clay-btn px-10 py-4 text-lg lowercase">
                        {t("load_more")}
                    </button>
                </div>
            </div>
        </main>
    );
}
