"use client";

import Link from "next/link";
import { Ruler, ChevronUp } from "lucide-react";
import { useState } from "react";

const UNITS = [
    { key: "metric", label: "Métrico (cm, kg)" },
    { key: "imperial", label: "Imperial (in, lbs)" },
] as const;

export default function Footer() {
    const [unitKey, setUnitKey] = useState<string>(UNITS[0].key);

    const [showUnit, setShowUnit] = useState(false);

    return (
        <footer className="mt-20 border-t border-slate-700 bg-card-bg/50 backdrop-blur-xl pt-16 pb-24 md:pb-8">
            <div className="max-w-7xl mx-auto px-4 md:px-8">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
                    {/* Brand Col */}
                    <div className="md:col-span-1 space-y-6">
                        <Link href="/" className="flex items-center gap-3">
                            <div className="h-8 w-8 bg-periwinkle rounded-full flex items-center justify-center shadow-inner">
                                <span className="text-off-white font-black text-xl leading-[0] -translate-y-[3px]">s</span>
                            </div>
                            <span className="text-lg font-black tracking-tight text-off-white lowercase">
                                secondavenue
                            </span>
                        </Link>
                        <p className="text-slate-light font-medium text-sm leading-relaxed">
                            Um mercado para todos. Compra, vende e descobre peças únicas para o teu mundo.
                        </p>
                    </div>

                    {/* Links */}
                    <div className="grid grid-cols-2 gap-8 md:col-span-2">
                        <div className="space-y-4">
                            <h4 className="font-black text-off-white">Marketplace</h4>
                            <ul className="space-y-2 text-sm font-bold text-slate-lighter italic">
                                <li><Link href="/feed" className="hover:text-periwinkle transition-colors">Todos os drops</Link></li>
                                <li><Link href="#" className="hover:text-periwinkle transition-colors">Seleções</Link></li>
                                <li><Link href="#" className="hover:text-periwinkle transition-colors">Curadoria</Link></li>
                            </ul>
                        </div>
                        <div className="space-y-4">
                            <h4 className="font-black text-off-white">Estúdio</h4>
                            <ul className="space-y-2 text-sm font-bold text-slate-lighter italic">
                                <li><Link href="/dashboard" className="hover:text-periwinkle transition-colors">Estúdio</Link></li>
                                <li><Link href="/create-listing" className="hover:text-periwinkle transition-colors">Publica a tua peça</Link></li>
                                <li><Link href="#" className="hover:text-periwinkle transition-colors">Guias</Link></li>
                            </ul>
                        </div>
                    </div>

                    {/* Selectors */}
                    <div className="md:col-span-1 space-y-4">
                        {/* Unit Selector */}
                        <div className="relative">
                            <button
                                onClick={() => { setShowUnit(!showUnit); }}
                                className="w-full flex items-center justify-between px-4 py-2.5 bg-card-bg rounded-2xl border-2 border-slate-700 hover:border-periwinkle/50 transition-all shadow-sm"
                            >
                                <div className="flex items-center gap-2 text-off-white">
                                    <Ruler className="w-4 h-4 text-periwinkle" />
                                    <span className="text-xs font-bold">{UNITS.find(u => u.key === unitKey)?.label.split(' ')[0]}</span>
                                </div>
                                <ChevronUp className={`w-4 h-4 text-slate-lighter transition-transform ${showUnit ? 'rotate-0' : 'rotate-180'}`} />
                            </button>

                            {showUnit && (
                                <div className="absolute bottom-full mb-2 w-48 bg-card-bg rounded-2xl shadow-xl border border-slate-700 p-2 z-50 animate-in fade-in slide-in-from-bottom-2">
                                    {UNITS.map((unit) => (
                                        <button
                                            key={unit.key}
                                            onClick={() => { setUnitKey(unit.key); setShowUnit(false); }}
                                            className="w-full text-left px-3 py-2 hover:bg-hover-bg rounded-xl transition-colors text-xs font-bold text-off-white"
                                        >
                                            {unit.label}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="flex flex-col md:flex-row justify-between items-center gap-6 pt-8 border-t border-slate-700">
                    <p className="text-xs font-bold text-slate-lighter">
                        © 2026 secondavenue. Feito com amor para ti.
                    </p>
                    <div className="flex gap-8 text-xs font-bold text-slate-lighter">
                        <Link href="#" className="hover:text-off-white">Privacidade</Link>
                        <Link href="#" className="hover:text-off-white">Termos</Link>
                        <Link href="#" className="hover:text-off-white">Cookies</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}
