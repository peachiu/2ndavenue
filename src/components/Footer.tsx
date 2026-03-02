"use client";

import Link from "next/link";
import { Globe, Ruler, ChevronUp, Coins } from "lucide-react";
import { useState } from "react";
import { useTranslation } from "@/context/TranslationContext";
import { useCurrency } from "@/context/CurrencyContext";

const LANGUAGES = [
    { name: "English", nativeName: "English", code: "en", flag: "🇺🇸/🇬🇧" },
    { name: "Chinese", nativeName: "中文", code: "zh", flag: "🇨🇳" },
    { name: "German", nativeName: "Deutsch", code: "de", flag: "🇩🇪" },
    { name: "French", nativeName: "Français", code: "fr", flag: "🇫🇷" },
    { name: "Italian", nativeName: "Italiano", code: "it", flag: "🇮🇹" },
    { name: "Spanish", nativeName: "Español", code: "es", flag: "🇪🇸/🇲🇽" },
    { name: "Portuguese", nativeName: "Português", code: "pt", flag: "🇵🇹/🇧🇷" },
] as const;

const CURRENCIES = [
    { code: 'EUR', symbol: '€', name: 'Euro' },
    { code: 'USD', symbol: '$', name: 'US Dollar' },
    { code: 'GBP', symbol: '£', name: 'British Pound' },
    { code: 'JPY', symbol: '¥', name: 'Japanese Yen' },
] as const;

const UNITS_KEYS = ["footer.unit.metric", "footer.unit.imperial"] as const;

export default function Footer() {
    const { language, setLanguage, t } = useTranslation();
    const { currency, setCurrency } = useCurrency();
    const [unitKey, setUnitKey] = useState<typeof UNITS_KEYS[number]>(UNITS_KEYS[0]);

    const [showLang, setShowLang] = useState(false);
    const [showUnit, setShowUnit] = useState(false);
    const [showCurr, setShowCurr] = useState(false);

    const currentLang = LANGUAGES.find(l => l.code === language) || LANGUAGES[0];
    const currentCurr = CURRENCIES.find(c => c.code === currency) || CURRENCIES[0];

    return (
        <footer className="mt-20 border-t border-slate-100 bg-white/50 backdrop-blur-xl pt-16 pb-24 md:pb-8">
            <div className="max-w-7xl mx-auto px-4 md:px-8">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
                    {/* Brand Col */}
                    <div className="md:col-span-1 space-y-6">
                        <Link href="/" className="flex items-center gap-3">
                            <div className="h-8 w-8 bg-periwinkle rounded-full flex items-center justify-center shadow-inner text-white font-black text-xl leading-none pb-0.5">s</div>
                            <span className="text-lg font-black tracking-tight text-slate-800 lowercase">
                                secondavenue
                            </span>
                        </Link>
                        <p className="text-slate-500 font-medium text-sm leading-relaxed lowercase">
                            {t("hero.subtitle")}
                        </p>
                    </div>

                    {/* Links */}
                    <div className="grid grid-cols-2 gap-8 md:col-span-2">
                        <div className="space-y-4">
                            <h4 className="font-black lowercase text-slate-900">{t("footer.marketplace")}</h4>
                            <ul className="space-y-2 text-sm font-bold text-slate-400 lowercase italic">
                                <li><Link href="/feed" className="hover:text-periwinkle transition-colors">{t("footer.all_drops")}</Link></li>
                                <li><Link href="#" className="hover:text-periwinkle transition-colors">{t("nav.collections")}</Link></li>
                                <li><Link href="#" className="hover:text-periwinkle transition-colors">curations</Link></li>
                            </ul>
                        </div>
                        <div className="space-y-4">
                            <h4 className="font-black lowercase text-slate-900">{t("footer.studio")}</h4>
                            <ul className="space-y-2 text-sm font-bold text-slate-400 lowercase italic">
                                <li><Link href="/dashboard" className="hover:text-periwinkle transition-colors">dashboard</Link></li>
                                <li><Link href="/create-listing" className="hover:text-periwinkle transition-colors">{t("footer.list_item")}</Link></li>
                                <li><Link href="#" className="hover:text-periwinkle transition-colors">guidelines</Link></li>
                            </ul>
                        </div>
                    </div>

                    {/* Selectors */}
                    <div className="md:col-span-1 space-y-4">
                        {/* Language Selector */}
                        <div className="relative">
                            <button
                                onClick={() => { setShowLang(!showLang); setShowUnit(false); setShowCurr(false); }}
                                className="w-full flex items-center justify-between px-4 py-2.5 bg-white rounded-2xl border-2 border-slate-50 hover:border-periwinkle/30 transition-all shadow-sm group"
                            >
                                <div className="flex items-center gap-3">
                                    <span className="text-lg">{currentLang.flag}</span>
                                    <span className="text-sm font-bold text-slate-700">{currentLang.nativeName}</span>
                                </div>
                                <ChevronUp className={`w-4 h-4 text-slate-300 transition-transform ${showLang ? 'rotate-0' : 'rotate-180'}`} />
                            </button>

                            {showLang && (
                                <div className="absolute bottom-full mb-2 w-full bg-white rounded-2xl shadow-xl border border-slate-50 p-2 z-50 animate-in fade-in slide-in-from-bottom-2">
                                    {LANGUAGES.map((l) => (
                                        <button
                                            key={l.code}
                                            onClick={() => { setLanguage(l.code); setShowLang(false); }}
                                            className="w-full flex items-center gap-3 px-3 py-2 hover:bg-slate-50 rounded-xl transition-colors text-left"
                                        >
                                            <span>{l.flag}</span>
                                            <span className="text-sm font-bold text-slate-600">{l.nativeName}</span>
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>

                        <div className="grid grid-cols-2 gap-2">
                            {/* Unit Selector */}
                            <div className="relative">
                                <button
                                    onClick={() => { setShowUnit(!showUnit); setShowLang(false); setShowCurr(false); }}
                                    className="w-full flex items-center justify-between px-4 py-2.5 bg-white rounded-2xl border-2 border-slate-50 hover:border-periwinkle/30 transition-all shadow-sm group"
                                >
                                    <div className="flex items-center gap-2 text-slate-700">
                                        <Ruler className="w-4 h-4 text-periwinkle" />
                                        <span className="text-xs font-bold">{t(unitKey).split(' ')[0]}</span>
                                    </div>
                                    <ChevronUp className={`w-4 h-4 text-slate-300 transition-transform ${showUnit ? 'rotate-0' : 'rotate-180'}`} />
                                </button>

                                {showUnit && (
                                    <div className="absolute bottom-full mb-2 w-48 bg-white rounded-2xl shadow-xl border border-slate-50 p-2 z-50 animate-in fade-in slide-in-from-bottom-2">
                                        {UNITS_KEYS.map((key) => (
                                            <button
                                                key={key}
                                                onClick={() => { setUnitKey(key); setShowUnit(false); }}
                                                className="w-full text-left px-3 py-2 hover:bg-slate-50 rounded-xl transition-colors text-xs font-bold text-slate-600"
                                            >
                                                {t(key)}
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {/* Currency Selector */}
                            <div className="relative">
                                <button
                                    onClick={() => { setShowCurr(!showCurr); setShowLang(false); setShowUnit(false); }}
                                    className="w-full flex items-center justify-between px-4 py-2.5 bg-white rounded-2xl border-2 border-slate-50 hover:border-periwinkle/30 transition-all shadow-sm group"
                                >
                                    <div className="flex items-center gap-2 text-slate-700">
                                        <Coins className="w-4 h-4 text-periwinkle" />
                                        <span className="text-xs font-bold">{currentCurr.code}</span>
                                    </div>
                                    <ChevronUp className={`w-4 h-4 text-slate-300 transition-transform ${showCurr ? 'rotate-0' : 'rotate-180'}`} />
                                </button>

                                {showCurr && (
                                    <div className="absolute bottom-full right-0 mb-2 w-40 bg-white rounded-2xl shadow-xl border border-slate-50 p-2 z-50 animate-in fade-in slide-in-from-bottom-2">
                                        {CURRENCIES.map((c) => (
                                            <button
                                                key={c.code}
                                                onClick={() => { setCurrency(c.code as any); setShowCurr(false); }}
                                                className="w-full flex items-center justify-between px-3 py-2 hover:bg-slate-50 rounded-xl transition-colors"
                                            >
                                                <span className="text-xs font-bold text-slate-600">{c.code}</span>
                                                <span className="text-xs font-black text-periwinkle">{c.symbol}</span>
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="flex flex-col md:flex-row justify-between items-center gap-6 pt-8 border-t border-slate-50">
                    <p className="text-xs font-bold text-slate-400 lowercase">
                        © 2026 secondavenue. built for people with love.
                    </p>
                    <div className="flex gap-8 text-xs font-bold text-slate-400 lowercase">
                        <Link href="#" className="hover:text-slate-600">privacy</Link>
                        <Link href="#" className="hover:text-slate-600">terms</Link>
                        <Link href="#" className="hover:text-slate-600">cookies</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}
