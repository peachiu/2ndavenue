"use client";

import { motion } from "framer-motion";
import { Home, Heart, Plus, MessageCircle, ShoppingBag } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCart } from "@/context/CartContext";

const DOCK_ITEMS = [
    { icon: Home, label: "home", href: "/" },
    { icon: Heart, label: "favoritos", href: "/favorites" },
    { icon: Plus, label: "sell", href: "/create-listing", primary: true },
    { icon: MessageCircle, label: "chat", href: "/messages" },
    { icon: ShoppingBag, label: "carrinho", href: "#cart", cart: true },
];

export default function MobileDock() {
    const pathname = usePathname();
    const { openCart, totalItems } = useCart();

    // Hide dock on product pages to avoid collision with the fixed action bar
    if (pathname?.startsWith('/product/')) return null;

    return (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 md:hidden w-[90%] max-w-[400px]">
            <div className="bg-card-bg/95 backdrop-blur-xl rounded-full p-2 flex items-center justify-between shadow-2xl border border-slate-700 px-4">
                {DOCK_ITEMS.map((item) => {
                    const isActive = pathname === item.href;
                    const Icon = item.icon;

                    // Cart button — opens the cart side panel
                    if (item.cart) {
                        return (
                            <motion.button
                                key={item.label}
                                whileTap={{ scale: 1.2 }}
                                transition={{ type: "spring", stiffness: 400, damping: 17 }}
                                onClick={openCart}
                                className="relative flex flex-col items-center gap-1 p-2 rounded-2xl transition-colors text-slate-lighter"
                            >
                                <Icon className="w-5 h-5" />
                                {totalItems > 0 && (
                                    <span className="absolute -top-0.5 -right-0.5 bg-periwinkle text-charcoal text-[9px] font-black min-w-[16px] h-4 flex items-center justify-center rounded-full px-1 shadow-lg">
                                        {totalItems > 99 ? "99+" : totalItems}
                                    </span>
                                )}
                            </motion.button>
                        );
                    }

                    // Primary (sell) button
                    if (item.primary) {
                        return (
                            <Link key={item.label} href={item.href}>
                                <motion.button
                                    whileTap={{ scale: 1.2 }}
                                    transition={{ type: "spring", stiffness: 400, damping: 17 }}
                                    className="bg-periwinkle p-4 rounded-full shadow-lg shadow-periwinkle/30 border-2 border-slate-lighter -mt-8"
                                >
                                    <Icon className="w-6 h-6 text-white" />
                                </motion.button>
                            </Link>
                        );
                    }

                    // Regular nav buttons
                    return (
                        <Link key={item.label} href={item.href}>
                            <motion.button
                                whileTap={{ scale: 1.2 }}
                                transition={{ type: "spring", stiffness: 400, damping: 17 }}
                                className={`flex flex-col items-center gap-1 p-2 rounded-2xl transition-colors ${isActive ? 'text-periwinkle' : 'text-slate-lighter'
                                    }`}
                            >
                                <Icon className="w-5 h-5" />
                            </motion.button>
                        </Link>
                    );
                })}
            </div>
        </div>
    );
}
