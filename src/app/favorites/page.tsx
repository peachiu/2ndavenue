"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { Heart, Loader2, ArrowLeft } from "lucide-react";
import Link from "next/link";
import ProductGrid from "@/components/ProductGrid";

export default function FavoritesPage() {
    const { data: session, status } = useSession();
    const [favorites, setFavorites] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (status === "loading") return;
        if (!session?.user) {
            setLoading(false);
            return;
        }

        fetch("/api/favorites")
            .then(r => r.json())
            .then(data => {
                setFavorites(Array.isArray(data) ? data : []);
                setLoading(false);
            })
            .catch(() => setLoading(false));
    }, [session, status]);

    if (status === "loading") {
        return (
            <main className="min-h-screen bg-charcoal flex items-center justify-center">
                <Loader2 className="w-8 h-8 text-periwinkle animate-spin" />
            </main>
        );
    }

    if (!session) {
        return (
            <main className="min-h-screen bg-charcoal flex items-center justify-center">
                <div className="text-center space-y-6">
                    <Heart className="w-16 h-16 text-slate-lighter mx-auto" />
                    <p className="text-2xl font-black text-off-white lowercase">precisas de entrar</p>
                    <p className="text-slate-light font-medium">faz login para ver os teus favoritos</p>
                    <Link href="/login" className="clay-btn inline-block px-8 py-4 text-sm">
                        entrar
                    </Link>
                </div>
            </main>
        );
    }

    return (
        <main className="min-h-screen bg-charcoal pb-20 md:pb-32 pt-16 md:pt-28 select-none">
            <div className="max-w-7xl mx-auto px-4 md:px-8">
                <div className="flex items-center gap-3 md:gap-4 mb-8 md:mb-12">
                    <Link href="/" className="p-2 md:p-3 text-slate-lighter hover:text-periwinkle hover:bg-hover-bg rounded-2xl transition-all">
                        <ArrowLeft className="w-4 md:w-5 h-4 md:h-5" />
                    </Link>
                    <div>
                        <h1 className="text-2xl md:text-4xl font-black tracking-tighter lowercase">
                            <span className="text-periwinkle">meus</span> favoritos
                        </h1>
                        <p className="text-xs md:text-sm text-slate-lighter font-medium lowercase italic mt-0.5 md:mt-1">
                            {favorites.length} {favorites.length === 1 ? "peça guardada" : "peças guardadas"}
                        </p>
                    </div>
                </div>

                {loading ? (
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-6">
                        {[...Array(4)].map((_, i) => (
                            <div key={i} className="aspect-square rounded-[2rem] bg-card-bg border border-slate-700 animate-pulse" />
                        ))}
                    </div>
                ) : favorites.length === 0 ? (
                    <div className="text-center py-16 md:py-32 space-y-3 md:space-y-4">
                        <Heart className="w-10 md:w-12 h-10 md:h-12 text-slate-lighter mx-auto" />
                        <p className="text-lg md:text-xl font-bold text-slate-light lowercase italic">ainda não tens favoritos</p>
                        <Link href="/" className="clay-btn inline-block px-8 py-4 text-sm">
                            explorar produtos
                        </Link>
                    </div>
                ) : (
                    <ProductGrid
                        products={favorites.map((f: any) => ({
                            id: f.listing_id,
                            title: f.title,
                            price: f.price,
                            currency: f.currency,
                            condition_rating: f.condition_rating,
                            image_url: f.image_url,
                        }))}
                        layout="mosaic"
                    />
                )}
            </div>
        </main>
    );
}
