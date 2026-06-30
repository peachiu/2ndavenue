"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle, X } from "lucide-react";

interface ToastProps {
    message: string;
    visible: boolean;
    onClose: () => void;
    duration?: number;
}

export default function Toast({ message, visible, onClose, duration = 4000 }: ToastProps) {
    useEffect(() => {
        if (!visible) return;
        const timer = setTimeout(onClose, duration);
        return () => clearTimeout(timer);
    }, [visible, duration, onClose]);

    return (
        <AnimatePresence>
            {visible && (
                <motion.div
                    initial={{ y: 100, opacity: 0, scale: 0.95 }}
                    animate={{ y: 0, opacity: 1, scale: 1 }}
                    exit={{ y: 100, opacity: 0, scale: 0.95 }}
                    transition={{ type: "spring", damping: 25, stiffness: 300 }}
                    className="fixed z-[100] bottom-28 md:bottom-8 left-1/2 -translate-x-1/2 w-[calc(100%-2rem)] max-w-md"
                >
                    <div className="flex items-center gap-3 bg-card-bg/95 backdrop-blur-xl border border-slate-700/80 shadow-2xl rounded-2xl px-6 py-4">
                        <div className="h-10 w-10 rounded-full bg-emerald-500/20 flex items-center justify-center flex-shrink-0">
                            <CheckCircle className="w-5 h-5 text-emerald-400" />
                        </div>
                        <p className="font-bold text-off-white text-sm leading-tight flex-1">
                            {message}
                        </p>
                        <button
                            onClick={onClose}
                            className="h-8 w-8 rounded-full bg-hover-bg flex items-center justify-center hover:bg-slate-700 transition-colors flex-shrink-0"
                        >
                            <X className="w-4 h-4 text-slate-light" />
                        </button>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
