"use client";

import { motion } from "framer-motion";
import { Home, Grid, Plus, MessageCircle, User } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const DOCK_ITEMS = [
    { icon: Home, label: "home", href: "/" },
    { icon: Grid, label: "browse", href: "#discover" },
    { icon: Plus, label: "sell", href: "/create-listing", primary: true },
    { icon: MessageCircle, label: "chat", href: "/messages" },
    { icon: User, label: "profile", href: "/dashboard" },
];

export default function MobileDock() {
    const pathname = usePathname();

    // Hide dock on product pages to avoid collision with the fixed action bar
    if (pathname?.startsWith('/product/')) return null;

    return (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 md:hidden w-[90%] max-w-[400px]">
            <div className="bg-card-bg/95 backdrop-blur-xl rounded-full p-2 flex items-center justify-between shadow-2xl border border-slate-700 px-4">
                {DOCK_ITEMS.map((item) => {
                    const isActive = pathname === item.href;
                    const Icon = item.icon;

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
