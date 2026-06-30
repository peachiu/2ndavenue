"use client";

import { useState } from "react";
import { useSession, signOut } from "next-auth/react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { User, LayoutDashboard, LogOut, ChevronDown, Shield } from "lucide-react";

export default function UserNav() {
    const { data: session, status } = useSession();
    const [isOpen, setIsOpen] = useState(false);

    if (status === "loading") {
        return <div className="w-10 h-10 rounded-full bg-slate-100 animate-pulse" />;
    }

    if (!session) {
        return (
            <Link href="/login">
                <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="px-6 py-2 bg-card-bg text-off-white rounded-full font-bold text-sm shadow-sm hover:shadow-md transition-all border border-slate-700"
                >
                    Entra
                </motion.button>
            </Link>
        );
    }

    const user = session.user;

    return (
        <div className="relative">
            <motion.button
                onClick={() => setIsOpen(!isOpen)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center gap-2 p-1 pr-3 bg-card-bg rounded-full border border-slate-700 shadow-sm hover:shadow-md transition-all group"
            >
                <div className="w-8 h-8 rounded-full bg-periwinkle/20 flex items-center justify-center overflow-hidden border-2 border-card-bg shadow-inner">
                    {user?.image ? (
                        <img src={user.image} alt={user.name || ""} className="w-full h-full object-cover" />
                    ) : (
                        <User className="w-5 h-5 text-periwinkle" />
                    )}
                </div>
                <span className="text-sm font-bold text-off-white">{user?.name?.split(' ')[0] || 'conta'}</span>
                <ChevronDown className={`w-4 h-4 text-slate-lighter transition-transform ${isOpen ? 'rotate-180' : ''}`} />
            </motion.button>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        className="absolute right-0 mt-2 w-48 bg-card-bg rounded-3xl shadow-xl border border-slate-700 p-2 z-[60] origin-top-right"
                    >
                        {(user as any)?.role === "admin" && (
                            <Link href="/admin" onClick={() => setIsOpen(false)}>
                                <div className="flex items-center gap-3 px-4 py-3 hover:bg-hover-bg rounded-2xl transition-colors group">
                                    <Shield className="w-4 h-4 text-periwinkle" />
                                    <span className="text-sm font-bold text-periwinkle italic">Admin</span>
                                </div>
                            </Link>
                        )}
                        <Link href="/dashboard" onClick={() => setIsOpen(false)}>
                            <div className="flex items-center gap-3 px-4 py-3 hover:bg-hover-bg rounded-2xl transition-colors group">
                                <LayoutDashboard className="w-4 h-4 text-slate-lighter group-hover:text-periwinkle transition-colors" />
                                <span className="text-sm font-bold text-off-white italic">Estúdio</span>
                            </div>
                        </Link>
                        <Link href="/profile" onClick={() => setIsOpen(false)}>
                            <div className="flex items-center gap-3 px-4 py-3 hover:bg-hover-bg rounded-2xl transition-colors group">
                                <User className="w-4 h-4 text-slate-lighter group-hover:text-periwinkle transition-colors" />
                                <span className="text-sm font-bold text-off-white italic">Perfil</span>
                            </div>
                        </Link>
                        <button
                            onClick={() => { signOut(); setIsOpen(false); }}
                            className="w-full flex items-center gap-3 px-4 py-3 hover:bg-red-900/30 rounded-2xl transition-colors group text-left"
                        >
                            <LogOut className="w-4 h-4 text-slate-lighter group-hover:text-red-500 transition-colors" />
                            <span className="text-sm font-bold text-off-white group-hover:text-red-500 italic">Sair</span>
                        </button>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
