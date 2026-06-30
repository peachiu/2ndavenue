"use client";

import ProductFeed from "@/components/ProductFeed";
import Link from "next/link";
import { motion } from "framer-motion";

export default function Home() {

    return (
        <div className="min-h-screen pb-20">
            {/* Hero Section */}
            <section className="max-w-7xl mx-auto px-4 md:px-8 mb-16 pt-16 text-center">
                <motion.h1
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                    className="text-5xl md:text-7xl font-black tracking-tight mb-6 px-2"
                >
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-periwinkle to-indigo-400 leading-[1.1] inline-block">
                        A avenida que tem<br />tudo para todos
                    </span>
                </motion.h1>
                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
                    className="text-lg md:text-2xl font-medium text-slate-light max-w-2xl mx-auto leading-relaxed"
                >
                    Um mercado para todos. Compra, vende e descobre peças únicas para o teu mundo.
                </motion.p>

                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5, delay: 0.3, ease: "easeOut" }}
                    className="mt-10 flex flex-col sm:flex-row justify-center gap-4 max-w-sm mx-auto sm:max-w-none items-stretch sm:items-center"
                >
                    <Link href="/create-listing" className="flex">
                        <motion.button
                            whileHover={{ scale: 1.05, y: -2 }}
                            whileTap={{ scale: 0.95 }}
                            className="clay-btn w-full sm:w-auto px-8 py-4 text-lg"
                        >
                            Começa a vender
                        </motion.button>
                    </Link>
                    <Link href="#discover" className="flex">
                        <motion.button
                            whileHover={{ scale: 1.05, y: -2 }}
                            whileTap={{ scale: 0.95 }}
                            className="w-full sm:w-auto px-8 py-4 rounded-full font-bold text-charcoal bg-off-white shadow-sm hover:shadow-md transition-all border border-slate-700"
                        >
                            Descobre
                        </motion.button>
                    </Link>
                </motion.div>
            </section>

            <ProductFeed />
        </div>
    );
}
