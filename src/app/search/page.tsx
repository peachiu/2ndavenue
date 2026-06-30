"use client";

import { useEffect, useState } from "react";
import { Search, ArrowLeft, Loader2 } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import ProductGrid from "@/components/ProductGrid";

export default function SearchPage() {
    const searchParams = useSearchParams();
    const query = searchParams.get("q") || "";
    const [products, setProducts] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!query) {
            setLoading(false);
            setProducts([]);
            return;
        }

        setLoading(true);
        fetch(`/api/listings?search=${encodeURIComponent(query)}`)
            .then(r => r.json())
            .then(data => {
                setProducts(Array.isArray(data) ? data : []);
                setLoading(false);
            })
            .catch(() => setLoading(false));
    }, [query]);

    return (
        <main className="min-h-screen bg-charcoal pb-32 pt-32 md:pt-28 select-none">
            <div className="max-w-7xl mx-auto px-4 md:px-8">
                {/* Header */}
                <div className="flex items-center gap-4 mb-8">
                    <Link href="/" className="p-3 text-slate-lighter hover:text-periwinkle hover:bg-hover-bg rounded-2xl transition-all">
                        <ArrowLeft className="w-5 h-5" />
                    </Link>
                    <div>
                        <h1 className="text-3xl font-black tracking-tighter lowercase">
                            {query ? (
                                <>resultados para <span className="text-periwinkle">&ldquo;{query}&rdquo;</span></>
                            ) : (
                                <span className="text-slate-light">pesquisa</span>
                            )}
                        </h1>
                        {!loading && (
                            <p className="text-sm text-slate-lighter font-medium lowercase italic mt-1">
                                {products.length} {products.length === 1 ? "resultado" : "resultados"}
                            </p>
                        )}
                    </div>
                </div>

                {/* Results */}
                {loading ? (
                    <div className="flex items-center justify-center py-32">
                        <Loader2 className="w-8 h-8 text-periwinkle animate-spin" />
                    </div>
                ) : !query ? (
                    <div className="text-center py-32 space-y-4">
                        <Search className="w-12 h-12 text-slate-lighter mx-auto" />
                        <p className="text-xl font-bold text-slate-light lowercase italic">
                            pesquisa por produtos, marcas, categorias...
                        </p>
                    </div>
                ) : products.length === 0 ? (
                    <div className="text-center py-32 space-y-4">
                        <Search className="w-12 h-12 text-slate-lighter mx-auto" />
                        <p className="text-xl font-bold text-slate-light lowercase italic">
                            nenhum resultado para &ldquo;{query}&rdquo;
                        </p>
                        <Link href="/" className="clay-btn inline-block px-8 py-4 text-sm">
                            voltar ao feed
                        </Link>
                    </div>
                ) : (
                    <ProductGrid
                        products={products.map((p: any) => ({
                            id: p.id,
                            title: p.title,
                            price: p.price,
                            currency: p.currency,
                            condition_rating: p.condition_rating,
                            image_url: p.image_url,
                        }))}
                        layout="grid"
                    />
                )}
            </div>
        </main>
    );
}
