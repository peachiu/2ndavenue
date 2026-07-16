"use client";

import { motion, AnimatePresence } from "framer-motion";
import { ShoppingBag, X, Plus, Minus, Trash2, ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useCart } from "@/context/CartContext";
import { useCurrency } from "@/context/CurrencyContext";

export default function CartSidePanel() {
    const { items, isOpen, closeCart, removeItem, updateQuantity, totalItems, totalPrice } = useCart();
    const { formatPrice } = useCurrency();

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Overlay */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="fixed inset-0 z-[60] bg-black/60 backdrop-blur-sm"
                        onClick={closeCart}
                    />

                    {/* Panel */}
                    <motion.div
                        initial={{ x: "100%" }}
                        animate={{ x: 0 }}
                        exit={{ x: "100%" }}
                        transition={{ type: "spring", damping: 25, stiffness: 300 }}
                        className="fixed top-0 right-0 z-[70] h-full w-full max-w-md bg-charcoal border-l border-slate-700 shadow-2xl flex flex-col"
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between p-6 border-b border-slate-700">
                            <div className="flex items-center gap-3">
                                <ShoppingBag className="w-5 h-5 text-periwinkle" />
                                <h2 className="font-black text-lg text-off-white">
                                    A tua bag
                                </h2>
                                {totalItems > 0 && (
                                    <span className="text-sm font-bold text-slate-lighter">
                                        ({totalItems} {totalItems === 1 ? "item" : "itens"})
                                    </span>
                                )}
                            </div>
                            <button
                                onClick={closeCart}
                                className="p-2 hover:bg-hover-bg rounded-xl transition-colors text-slate-lighter hover:text-off-white"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        {/* Items */}
                        <div className="flex-1 overflow-y-auto p-6 space-y-4">
                            {items.length === 0 ? (
                                <div className="flex flex-col items-center justify-center h-full text-center space-y-4">
                                    <ShoppingBag className="w-16 h-16 text-slate-700" />
                                    <p className="text-slate-light font-bold text-lg">A tua bag está vazia</p>
                                    <p className="text-slate-lighter text-sm">Adiciona peças para começar</p>
                                    <button
                                        onClick={closeCart}
                                        className="clay-btn px-6 py-3 text-sm"
                                    >
                                        Continuar a ver
                                    </button>
                                </div>
                            ) : (
                                items.map((item) => (
                                    <motion.div
                                        key={item.listing_id}
                                        layout
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, x: 50 }}
                                        className="flex gap-4 bg-card-bg rounded-2xl p-3 border border-slate-700"
                                    >
                                        {/* Image */}
                                        <div className="relative w-20 h-20 rounded-xl overflow-hidden bg-hover-bg flex-shrink-0">
                                            <Image
                                                src={item.image_url}
                                                alt={item.title}
                                                fill
                                                className="object-cover"
                                                sizes="80px"
                                            />
                                        </div>

                                        {/* Info */}
                                        <div className="flex-1 min-w-0">
                                            <Link
                                                href={`/product/${item.listing_id}`}
                                                onClick={closeCart}
                                                className="font-bold text-off-white text-sm hover:text-periwinkle transition-colors line-clamp-1"
                                            >
                                                {item.title}
                                            </Link>
                                            <p className="text-periwinkle font-black text-sm mt-1">
                                                {formatPrice(item.price, item.currency)}
                                            </p>
                                            <p className="text-[10px] text-slate-lighter font-medium">
                                                {item.seller_name}
                                            </p>

                                            {/* Quantity controls */}
                                            <div className="flex items-center gap-2 mt-2">
                                                <button
                                                    onClick={() => updateQuantity(item.listing_id, item.quantity - 1)}
                                                    className="p-1 rounded-lg bg-hover-bg hover:bg-slate-700 transition-colors text-slate-lighter"
                                                >
                                                    <Minus className="w-3 h-3" />
                                                </button>
                                                <span className="text-sm font-bold text-off-white w-6 text-center">
                                                    {item.quantity}
                                                </span>
                                                <button
                                                    onClick={() => updateQuantity(item.listing_id, item.quantity + 1)}
                                                    className="p-1 rounded-lg bg-hover-bg hover:bg-slate-700 transition-colors text-slate-lighter"
                                                >
                                                    <Plus className="w-3 h-3" />
                                                </button>
                                                <button
                                                    onClick={() => removeItem(item.listing_id)}
                                                    className="ml-auto p-1 rounded-lg text-rose-400 hover:bg-rose-500/10 transition-colors"
                                                >
                                                    <Trash2 className="w-3.5 h-3.5" />
                                                </button>
                                            </div>
                                        </div>
                                    </motion.div>
                                ))
                            )}
                        </div>

                        {/* Footer */}
                        {items.length > 0 && (
                            <div className="border-t border-slate-700 p-6 space-y-4 bg-card-bg/50 backdrop-blur-md">
                                <div className="flex items-center justify-between">
                                    <span className="font-bold text-off-white">Total</span>
                                    <span className="font-black text-xl text-periwinkle">
                                        {formatPrice(totalPrice)}
                                    </span>
                                </div>
                                <Link
                                    href="/checkout"
                                    onClick={closeCart}
                                    className="clay-btn w-full py-4 text-lg flex items-center justify-center gap-2"
                                >
                                    Finalizar compra
                                    <ArrowRight className="w-5 h-5" />
                                </Link>
                            </div>
                        )}
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
