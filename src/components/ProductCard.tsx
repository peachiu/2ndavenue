"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { useCurrency } from "@/context/CurrencyContext";
import { useTranslation } from "@/context/TranslationContext";

interface ProductCardProps {
    title: string;
    price: number;
    currency: string;
    image_url: string;
    condition: string;
    className?: string;
}

/**
 * TODO: Quality Control Rule
 * Validation Rule: User uploads must be rejected if dimensions are smaller than 500x500px.
 */

export default function ProductCard({
    title,
    price,
    currency: productCurrency,
    image_url,
    condition,
    className = ""
}: ProductCardProps) {
    const { formatPrice } = useCurrency();
    const { t } = useTranslation();

    const conditionKey = `cond.${condition.toLowerCase().replace(" ", "_")}`;

    return (
        <motion.div
            whileHover={{ scale: 1.02, rotate: 1 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
            className={`group h-full flex flex-col bg-card-bg rounded-[2rem] border-2 border-slate-700 shadow-clay-card hover:shadow-clay-hover overflow-hidden isolate cursor-pointer transition-shadow ${className}`}
        >
            <div className="relative flex-grow min-h-[250px] overflow-hidden rounded-t-[inherit] bg-hover-bg">
                <div className="absolute top-4 left-4 z-10 px-3 py-1 bg-card-bg/90 backdrop-blur-md rounded-full text-[10px] font-black uppercase tracking-widest text-periwinkle shadow-sm">
                    {t(conditionKey)}
                </div>
                <Image
                    src={image_url}
                    alt={title}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
                    sizes="(max-w-768px) 100vw, (max-w-1200px) 50vw, 33vw"
                    priority={false}
                />
            </div>

            <div className="p-6 bg-card-bg/50 backdrop-blur-sm border-t border-slate-700">
                <h4 className="font-bold text-off-white lowercase truncate mb-1">
                    {title}
                </h4>
                <div className="flex justify-between items-end">
                    <p className="text-xl font-black text-periwinkle">
                        {formatPrice(price, productCurrency)}
                    </p>
                    <span className="text-[10px] font-bold text-slate-lighter uppercase italic">ver detalhes →</span>
                </div>
            </div>
        </motion.div>
    );
}
