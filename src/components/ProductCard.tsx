"use client";

import Image from "next/image";
import Link from "next/link";
import { useCurrency } from "@/context/CurrencyContext";

const CONDITION_LABELS: Record<string, string> = {
    new: "novo",
    mint: "impecável",
    like_new: "praticamente novo",
    good: "bom",
    fair: "ok",
    poor: "tem uso",
};

interface ProductCardProps {
    id: number;
    title: string;
    price: number;
    currency: string;
    image_url: string;
    condition: string;
    className?: string;
    variant?: "grid" | "list" | "mosaic";
}

/**
 * TODO: Quality Control Rule
 * Validation Rule: User uploads must be rejected if dimensions are smaller than 500x500px.
 */

export default function ProductCard({
    id,
    title,
    price,
    currency: productCurrency,
    image_url,
    condition,
    className = "",
    variant = "mosaic",
}: ProductCardProps) {
    const { formatPrice } = useCurrency();

    const conditionKey = condition.toLowerCase().replace(" ", "_");

    // ── Grid variant (square card) ─────────────────────────
    if (variant === "grid") {
        return (
            <Link href={`/product/${id}`}>
                <div
                    className={`group bg-card-bg rounded-[2rem] border-2 border-slate-700 shadow-clay-card hover:shadow-clay-hover overflow-hidden isolate cursor-pointer transition-all duration-300 hover:scale-[1.03] hover:-translate-y-1 will-change-transform select-none ${className}`}
                >
                    <div className="relative aspect-square overflow-hidden bg-hover-bg">
                        <div className="absolute top-3 left-3 z-10 px-2.5 py-1 bg-card-bg/90 backdrop-blur-md rounded-full text-[9px] font-black uppercase tracking-widest text-periwinkle shadow-sm">
                            {CONDITION_LABELS[conditionKey] || conditionKey}
                        </div>
                        <Image
                            src={image_url}
                            alt={title}
                            fill
                            loading="lazy"
                            draggable={false}
                            className="object-cover group-hover:scale-110 transition-transform duration-700 ease-out pointer-events-none"
                            sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, 25vw"
                        />
                    </div>
                    <div className="p-4 bg-card-bg/50 backdrop-blur-sm border-t border-slate-700">
                        <h4 className="font-bold text-off-white truncate mb-0.5 select-text text-sm">
                            {title}
                        </h4>
                        <p className="text-lg font-black text-periwinkle">
                            {formatPrice(price, productCurrency)}
                        </p>
                    </div>
                </div>
            </Link>
        );
    }

    // ── List variant (horizontal card) ─────────────────────
    if (variant === "list") {
        return (
            <Link href={`/product/${id}`}>
                <div
                    className={`group flex bg-card-bg rounded-[2rem] border-2 border-slate-700 shadow-clay-card hover:shadow-clay-hover overflow-hidden isolate cursor-pointer transition-all duration-300 hover:translate-x-1 will-change-transform select-none ${className}`}
                >
                    <div className="relative w-32 sm:w-44 aspect-square flex-shrink-0 overflow-hidden bg-hover-bg">
                        <div className="absolute top-3 left-3 z-10 px-2.5 py-1 bg-card-bg/90 backdrop-blur-md rounded-full text-[9px] font-black uppercase tracking-widest text-periwinkle shadow-sm">
                            {CONDITION_LABELS[conditionKey] || conditionKey}
                        </div>
                        <Image
                            src={image_url}
                            alt={title}
                            fill
                            loading="lazy"
                            draggable={false}
                            className="object-cover group-hover:scale-110 transition-transform duration-700 ease-out pointer-events-none"
                            sizes="180px"
                        />
                    </div>
                    <div className="flex-1 p-5 flex flex-col justify-center min-w-0">
                        <h4 className="font-black text-off-white truncate select-text text-lg mb-1">
                            {title}
                        </h4>
                        <p className="text-xl font-black text-periwinkle mb-2">
                            {formatPrice(price, productCurrency)}
                        </p>
                        <span className="text-xs font-bold text-slate-lighter uppercase italic">
                            ver detalhes →
                        </span>
                    </div>
                </div>
            </Link>
        );
    }

    // ── Mosaic variant (current bento) ────────────────────
    return (
        <Link href={`/product/${id}`}>
            <div
                className={`group h-full flex flex-col bg-card-bg rounded-[2rem] border-2 border-slate-700 shadow-clay-card hover:shadow-clay-hover overflow-hidden isolate cursor-pointer transition-all duration-300 hover:scale-[1.02] hover:rotate-[0.5deg] will-change-transform select-none ${className}`}
            >
            <div className="relative flex-grow min-h-[250px] overflow-hidden rounded-t-[inherit] bg-hover-bg">
                <div className="absolute top-4 left-4 z-10 px-3 py-1 bg-card-bg/90 backdrop-blur-md rounded-full text-[10px] font-black uppercase tracking-widest text-periwinkle shadow-sm">
                    {CONDITION_LABELS[conditionKey] || conditionKey}
                </div>
                <Image
                    src={image_url}
                    alt={title}
                    fill
                    loading="lazy"
                    draggable={false}
                    className="object-cover group-hover:scale-110 transition-transform duration-700 ease-out pointer-events-none"
                    sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, 33vw"
                />
            </div>

            <div className="p-6 bg-card-bg/50 backdrop-blur-sm border-t border-slate-700">
                <h4 className="font-bold text-off-white truncate mb-1 select-text">
                    {title}
                </h4>
                <div className="flex justify-between items-end">
                    <p className="text-xl font-black text-periwinkle">
                        {formatPrice(price, productCurrency)}
                    </p>
                    <span className="text-[10px] font-bold text-slate-lighter uppercase italic">ver detalhes →</span>
                </div>
            </div>
            </div>
        </Link>
    );
}
