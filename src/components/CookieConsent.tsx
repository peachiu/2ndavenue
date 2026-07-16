"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Cookie, Check, Settings } from "lucide-react";
import Link from "next/link";

type CookiePreferences = {
    necessary: boolean;
    analytics: boolean;
    marketing: boolean;
};

const DEFAULT_PREFS: CookiePreferences = {
    necessary: true,  // always required
    analytics: false,
    marketing: false,
};

const STORAGE_KEY = "sa-cookie-consent";

export default function CookieConsent() {
    const [showBanner, setShowBanner] = useState(false);
    const [showSettings, setShowSettings] = useState(false);
    const [prefs, setPrefs] = useState<CookiePreferences>(DEFAULT_PREFS);

    useEffect(() => {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (!stored) {
            setShowBanner(true);
        } else {
            try {
                setPrefs({ ...DEFAULT_PREFS, ...JSON.parse(stored) });
            } catch {
                setShowBanner(true);
            }
        }
    }, []);

    const acceptAll = () => {
        const all: CookiePreferences = { necessary: true, analytics: true, marketing: true };
        setPrefs(all);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(all));
        setShowBanner(false);
        setShowSettings(false);
    };

    const acceptNecessary = () => {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_PREFS));
        setPrefs(DEFAULT_PREFS);
        setShowBanner(false);
        setShowSettings(false);
    };

    const savePreferences = () => {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(prefs));
        setShowBanner(false);
        setShowSettings(false);
    };

    return (
        <AnimatePresence>
            {showBanner && (
                <motion.div
                    initial={{ y: 100, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: 100, opacity: 0 }}
                    transition={{ type: "spring", stiffness: 260, damping: 24 }}
                    className="fixed bottom-0 left-0 right-0 z-[100] p-4 md:p-6"
                >
                    <div className="max-w-2xl mx-auto bg-card-bg/95 backdrop-blur-xl border border-slate-700 rounded-3xl shadow-2xl p-6 md:p-8">
                        {!showSettings ? (
                            <>
                                <div className="flex items-start gap-4">
                                    <div className="shrink-0 w-10 h-10 bg-periwinkle/20 rounded-2xl flex items-center justify-center">
                                        <Cookie className="w-5 h-5 text-periwinkle" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <h3 className="font-black text-off-white text-lg mb-2">
                                            Este website utiliza cookies
                                        </h3>
                                        <p className="text-sm text-slate-light leading-relaxed mb-4">
                                            Utilizamos cookies para melhorar a tua experiência, analisar o tráfego e mostrar conteúdo relevante.
                                            Podes escolher quais cookies aceitas.{" "}
                                            <Link href="/cookies" className="text-periwinkle hover:underline font-bold">
                                                Saber mais
                                            </Link>
                                        </p>
                                        <div className="flex flex-wrap gap-3">
                                            <button
                                                onClick={acceptAll}
                                                className="px-5 py-2.5 bg-periwinkle text-charcoal font-bold rounded-full text-sm hover:brightness-110 transition-all"
                                            >
                                                Aceitar todos
                                            </button>
                                            <button
                                                onClick={acceptNecessary}
                                                className="px-5 py-2.5 bg-card-bg text-slate-light font-bold rounded-full text-sm border border-slate-700 hover:border-periwinkle/50 transition-all"
                                            >
                                                Só necessários
                                            </button>
                                            <button
                                                onClick={() => setShowSettings(true)}
                                                className="px-5 py-2.5 text-slate-light font-bold rounded-full text-sm flex items-center gap-1.5 hover:text-periwinkle transition-all"
                                            >
                                                <Settings className="w-4 h-4" />
                                                Personalizar
                                            </button>
                                        </div>
                                    </div>
                                    <button
                                        onClick={acceptNecessary}
                                        className="shrink-0 p-2 text-slate-lighter hover:text-off-white transition-colors"
                                        aria-label="Fechar"
                                    >
                                        <X className="w-5 h-5" />
                                    </button>
                                </div>
                            </>
                        ) : (
                            <>
                                <div className="flex items-center justify-between mb-6">
                                    <h3 className="font-black text-off-white text-lg">
                                        Personalizar cookies
                                    </h3>
                                    <button
                                        onClick={() => setShowSettings(false)}
                                        className="p-2 text-slate-lighter hover:text-off-white transition-colors"
                                    >
                                        <X className="w-5 h-5" />
                                    </button>
                                </div>

                                <div className="space-y-4 mb-6">
                                    {/* Necessary - always on */}
                                    <label className="flex items-center justify-between p-4 bg-card-bg rounded-2xl border border-slate-700">
                                        <div>
                                            <p className="font-bold text-off-white text-sm">Necessários</p>
                                            <p className="text-xs text-slate-light mt-0.5">Essenciais para o funcionamento do site.</p>
                                        </div>
                                        <div className="w-10 h-6 bg-periwinkle rounded-full flex items-center px-1 justify-end opacity-60">
                                            <div className="w-4 h-4 bg-charcoal rounded-full" />
                                        </div>
                                    </label>

                                    {/* Analytics */}
                                    <label className="flex items-center justify-between p-4 bg-card-bg rounded-2xl border border-slate-700 cursor-pointer">
                                        <div>
                                            <p className="font-bold text-off-white text-sm">Analíticos</p>
                                            <p className="text-xs text-slate-light mt-0.5">Ajudam-nos a perceber como o site é usado.</p>
                                        </div>
                                        <input
                                            type="checkbox"
                                            checked={prefs.analytics}
                                            onChange={e => setPrefs(p => ({ ...p, analytics: e.target.checked }))}
                                            className="sr-only"
                                            id="cookie-analytics"
                                        />
                                        <div className={`w-10 h-6 rounded-full flex items-center px-1 transition-colors cursor-pointer ${prefs.analytics ? 'bg-periwinkle justify-end' : 'bg-slate-700 justify-start'}`}>
                                            <div className="w-4 h-4 bg-white rounded-full shadow" />
                                        </div>
                                    </label>

                                    {/* Marketing */}
                                    <label className="flex items-center justify-between p-4 bg-card-bg rounded-2xl border border-slate-700 cursor-pointer">
                                        <div>
                                            <p className="font-bold text-off-white text-sm">Marketing</p>
                                            <p className="text-xs text-slate-light mt-0.5">Para mostrar anúncios relevantes.</p>
                                        </div>
                                        <input
                                            type="checkbox"
                                            checked={prefs.marketing}
                                            onChange={e => setPrefs(p => ({ ...p, marketing: e.target.checked }))}
                                            className="sr-only"
                                            id="cookie-marketing"
                                        />
                                        <div className={`w-10 h-6 rounded-full flex items-center px-1 transition-colors cursor-pointer ${prefs.marketing ? 'bg-periwinkle justify-end' : 'bg-slate-700 justify-start'}`}>
                                            <div className="w-4 h-4 bg-white rounded-full shadow" />
                                        </div>
                                    </label>
                                </div>

                                <div className="flex gap-3">
                                    <button
                                        onClick={savePreferences}
                                        className="px-6 py-2.5 bg-periwinkle text-charcoal font-bold rounded-full text-sm hover:brightness-110 transition-all flex items-center gap-2"
                                    >
                                        <Check className="w-4 h-4" />
                                        Guardar preferências
                                    </button>
                                    <button
                                        onClick={acceptAll}
                                        className="px-6 py-2.5 bg-card-bg text-slate-light font-bold rounded-full text-sm border border-slate-700 hover:border-periwinkle/50 transition-all"
                                    >
                                        Aceitar todos
                                    </button>
                                </div>
                            </>
                        )}
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
