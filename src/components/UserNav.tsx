"use client";

import { useState } from "react";
import { useSession, signOut } from "next-auth/react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { User, LayoutDashboard, LogOut, ChevronDown } from "lucide-react";

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
                    className="px-6 py-2 bg-slate-900 text-white rounded-full font-bold text-sm shadow-sm hover:shadow-md transition-all lowercase"
                >
                    login
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
                className="flex items-center gap-2 p-1 pr-3 bg-white rounded-full border border-slate-100 shadow-sm hover:shadow-md transition-all group"
            >
                <div className="w-8 h-8 rounded-full bg-periwinkle/20 flex items-center justify-center overflow-hidden border-2 border-white shadow-inner">
                    {user?.image ? (
                        <img src={user.image} alt={user.name || ""} className="w-full h-full object-cover" />
                    ) : (
                        <User className="w-5 h-5 text-periwinkle" />
                    )}
                </div>
                <span className="text-sm font-bold text-slate-700 lowercase">{user?.name?.split(' ')[0] || 'account'}</span>
                <ChevronDown className={`w-4 h-4 text-slate-300 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
            </motion.button>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        className="absolute right-0 mt-2 w-48 bg-white rounded-3xl shadow-xl border border-slate-50 p-2 z-[60] origin-top-right"
                    >
                        <Link href="/dashboard" onClick={() => setIsOpen(false)}>
                            <div className="flex items-center gap-3 px-4 py-3 hover:bg-slate-50 rounded-2xl transition-colors group">
                                <LayoutDashboard className="w-4 h-4 text-slate-400 group-hover:text-periwinkle transition-colors" />
                                <span className="text-sm font-bold text-slate-600 lowercase italic">dashboard</span>
                            </div>
                        </Link>
                        <Link href="/profile" onClick={() => setIsOpen(false)}>
                            <div className="flex items-center gap-3 px-4 py-3 hover:bg-slate-50 rounded-2xl transition-colors group">
                                <User className="w-4 h-4 text-slate-400 group-hover:text-periwinkle transition-colors" />
                                <span className="text-sm font-bold text-slate-600 lowercase italic">profile</span>
                            </div>
                        </Link>
                        <button
                            onClick={() => { signOut(); setIsOpen(false); }}
                            className="w-full flex items-center gap-3 px-4 py-3 hover:bg-red-50 rounded-2xl transition-colors group text-left"
                        >
                            <LogOut className="w-4 h-4 text-slate-400 group-hover:text-red-500 transition-colors" />
                            <span className="text-sm font-bold text-slate-600 group-hover:text-red-600 lowercase italic">logout</span>
                        </button>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
