"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { Loader2, ChevronRight, MapPin, User, Phone, Cookie, Sparkles, Check } from "lucide-react";

const STEPS = [
    { id: "welcome", icon: Sparkles, title: "Bem-vindo" },
    { id: "profile", icon: User, title: "Perfil" },
    { id: "location", icon: MapPin, title: "Localização" },
    { id: "preferences", icon: Cookie, title: "Preferências" },
];

export default function SetupPage() {
    const { data: session, status } = useSession();
    const router = useRouter();
    const [step, setStep] = useState(0);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [done, setDone] = useState(false);

    // Form fields
    const [name, setName] = useState(session?.user?.name || "");
    const [location, setLocation] = useState("");
    const [phone, setPhone] = useState("");
    const [cookieConsent, setCookieConsent] = useState(true);

    // Check if already onboarded
    useEffect(() => {
        if (status === "loading") return;
        if (!session) {
            router.push("/login");
            return;
        }

        fetch("/api/setup")
            .then((r) => r.json())
            .then((data) => {
                if (data.onboarded) {
                    router.push("/");
                } else {
                    setName(session?.user?.name || "");
                    setLoading(false);
                }
            })
            .catch(() => {
                setLoading(false);
            });
    }, [session, status, router]);

    const handleNext = () => {
        if (step < STEPS.length - 1) {
            setStep((s) => s + 1);
        } else {
            handleSubmit();
        }
    };

    const handleSubmit = async () => {
        setSaving(true);
        try {
            const res = await fetch("/api/setup", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    name,
                    location,
                    phone,
                    cookieConsent,
                }),
            });

            if (res.ok) {
                setDone(true);
                setTimeout(() => {
                    router.push("/");
                    router.refresh();
                }, 2000);
            }
        } catch (err) {
            console.error("Setup error:", err);
        } finally {
            setSaving(false);
        }
    };

    if (loading || status === "loading") {
        return (
            <main className="min-h-screen bg-charcoal flex items-center justify-center">
                <Loader2 className="w-8 h-8 text-periwinkle animate-spin" />
            </main>
        );
    }

    if (done) {
        return (
            <main className="min-h-screen bg-charcoal flex items-center justify-center">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-center space-y-6"
                >
                    <div className="w-20 h-20 bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto">
                        <Check className="w-10 h-10 text-emerald-400" />
                    </div>
                    <h1 className="text-3xl font-black text-off-white">Tudo pronto!</h1>
                    <p className="text-slate-light font-medium">Bem-vindo à SecondAvenue 🎉</p>
                </motion.div>
            </main>
        );
    }

    const currentStep = STEPS[step];

    return (
        <main className="min-h-screen bg-charcoal flex items-center justify-center px-4 py-12">
            <div className="w-full max-w-lg">
                {/* Progress */}
                <div className="flex items-center justify-center gap-2 mb-12">
                    {STEPS.map((s, i) => (
                        <div key={s.id} className="flex items-center gap-2">
                            <div
                                className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                                    i <= step
                                        ? "bg-periwinkle text-charcoal"
                                        : "bg-card-bg text-slate-light border border-slate-700"
                                }`}
                            >
                                {i < step ? <Check className="w-4 h-4" /> : i + 1}
                            </div>
                            {i < STEPS.length - 1 && (
                                <div
                                    className={`w-8 md:w-12 h-0.5 rounded transition-colors ${
                                        i < step ? "bg-periwinkle" : "bg-slate-700"
                                    }`}
                                />
                            )}
                        </div>
                    ))}
                </div>

                <AnimatePresence mode="wait">
                    <motion.div
                        key={step}
                        initial={{ opacity: 0, x: 40 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -40 }}
                        transition={{ duration: 0.3, ease: "easeInOut" }}
                        className="clay-card p-8 md:p-10 space-y-6"
                    >
                        {/* Step Icon */}
                        <div className="w-14 h-14 bg-periwinkle/10 rounded-2xl flex items-center justify-center mx-auto">
                            <currentStep.icon className="w-7 h-7 text-periwinkle" />
                        </div>

                        <div className="text-center">
                            <h2 className="text-2xl font-black text-off-white">{currentStep.title}</h2>
                            <p className="text-sm text-slate-light font-medium mt-1">
                                {step === 0 && "Estamos felizes por ter-te aqui! Vamos configurar a tua experiência."}
                                {step === 1 && "Como queres que apareças na comunidade?"}
                                {step === 2 && "Onde é que encontras os melhores achados?"}
                                {step === 3 && "Um cookie ou dois para tornar tudo melhor?"}
                            </p>
                        </div>

                        {/* Step Content */}
                        {step === 0 && (
                            <div className="text-center space-y-4 pt-2">
                                <p className="text-off-white font-medium">
                                    Olá, <span className="text-periwinkle">{session?.user?.name}</span>! 👋
                                </p>
                                <p className="text-sm text-slate-light leading-relaxed">
                                    A SecondAvenue é o mercado para todos. Aqui podes comprar, vender e
                                    descobrir peças únicas. Vamos só afinar alguns detalhes para começares!
                                </p>
                            </div>
                        )}

                        {step === 1 && (
                            <div className="space-y-4 pt-2">
                                <div>
                                    <label className="block text-sm font-bold text-slate-light mb-1.5">
                                        O teu nome
                                    </label>
                                    <div className="relative">
                                        <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-light" />
                                        <input
                                            type="text"
                                            value={name}
                                            onChange={(e) => setName(e.target.value)}
                                            placeholder="O teu nome público"
                                            className="w-full bg-charcoal border border-slate-700 rounded-2xl pl-11 pr-4 py-3 text-sm text-off-white placeholder-slate-lighter/50 focus:outline-none focus:border-periwinkle transition-colors"
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-slate-light mb-1.5">
                                        Telemóvel <span className="text-slate-lighter/50 font-normal">(opcional)</span>
                                    </label>
                                    <div className="relative">
                                        <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-light" />
                                        <input
                                            type="tel"
                                            value={phone}
                                            onChange={(e) => setPhone(e.target.value)}
                                            placeholder="Telemóvel para entregas"
                                            className="w-full bg-charcoal border border-slate-700 rounded-2xl pl-11 pr-4 py-3 text-sm text-off-white placeholder-slate-lighter/50 focus:outline-none focus:border-periwinkle transition-colors"
                                        />
                                    </div>
                                </div>
                            </div>
                        )}

                        {step === 2 && (
                            <div className="space-y-4 pt-2">
                                <div>
                                    <label className="block text-sm font-bold text-slate-light mb-1.5">
                                        A tua localização <span className="text-slate-lighter/50 font-normal">(opcional)</span>
                                    </label>
                                    <div className="relative">
                                        <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-light" />
                                        <input
                                            type="text"
                                            value={location}
                                            onChange={(e) => setLocation(e.target.value)}
                                            placeholder="Ex: Lisboa, Portugal"
                                            className="w-full bg-charcoal border border-slate-700 rounded-2xl pl-11 pr-4 py-3 text-sm text-off-white placeholder-slate-lighter/50 focus:outline-none focus:border-periwinkle transition-colors"
                                        />
                                    </div>
                                </div>
                                <p className="text-xs text-slate-lighter/60 font-medium">
                                    A localização aparece no teu perfil e ajuda outros membros a saberem de onde és.
                                </p>
                            </div>
                        )}

                        {step === 3 && (
                            <div className="space-y-4 pt-2">
                                <div className="bg-charcoal border border-slate-700 rounded-2xl p-5">
                                    <label className="flex items-start gap-4 cursor-pointer">
                                        <input
                                            type="checkbox"
                                            checked={cookieConsent}
                                            onChange={(e) => setCookieConsent(e.target.checked)}
                                            className="mt-0.5 w-4 h-4 rounded border-slate-700 bg-charcoal text-periwinkle focus:ring-periwinkle"
                                        />
                                        <div>
                                            <p className="font-bold text-off-white text-sm">Aceito cookies</p>
                                            <p className="text-xs text-slate-light mt-1">
                                                Usamos cookies para melhorar a tua experiência, analisar tráfego
                                                e personalizar conteúdos. Podes alterar as tuas preferências a qualquer momento.
                                            </p>
                                        </div>
                                    </label>
                                </div>
                                <div className="bg-charcoal border border-slate-700 rounded-2xl p-5">
                                    <label className="flex items-start gap-4 cursor-pointer">
                                        <input
                                            type="checkbox"
                                            defaultChecked
                                            className="mt-0.5 w-4 h-4 rounded border-slate-700 bg-charcoal text-periwinkle focus:ring-periwinkle"
                                        />
                                        <div>
                                            <p className="font-bold text-off-white text-sm">Notificações por email</p>
                                            <p className="text-xs text-slate-light mt-1">
                                                Recebe notificações sobre mensagens, novos seguidores e promoções.
                                            </p>
                                        </div>
                                    </label>
                                </div>
                            </div>
                        )}

                        {/* Actions */}
                        <div className="flex items-center justify-between pt-2">
                            <button
                                onClick={() => setStep((s) => Math.max(0, s - 1))}
                                disabled={step === 0}
                                className="px-5 py-3 rounded-2xl text-sm font-bold text-slate-light hover:text-off-white hover:bg-hover-bg transition-all disabled:opacity-0"
                            >
                                Anterior
                            </button>
                            <button
                                onClick={handleNext}
                                disabled={saving || (step === 1 && !name.trim())}
                                className="clay-btn px-6 py-3 text-sm flex items-center gap-2 disabled:opacity-30 disabled:cursor-not-allowed"
                            >
                                {saving ? (
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                ) : step === STEPS.length - 1 ? (
                                    "Concluir"
                                ) : (
                                    <>
                                        Próximo
                                        <ChevronRight className="w-4 h-4" />
                                    </>
                                )}
                            </button>
                        </div>
                    </motion.div>
                </AnimatePresence>
            </div>
        </main>
    );
}
