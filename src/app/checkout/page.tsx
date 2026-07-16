"use client";

import { motion } from "framer-motion";
import { ShoppingBag, ArrowLeft, Loader2, CreditCard, MapPin, Phone, Mail, User as UserIcon } from "lucide-react";
import Link from "next/link";
import { useCart } from "@/context/CartContext";
import { useCurrency } from "@/context/CurrencyContext";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";

export default function CheckoutPage() {
    const { items, totalPrice, clearCart } = useCart();
    const { formatPrice } = useCurrency();
    const { data: session } = useSession();
    const router = useRouter();

    const [form, setForm] = useState({
        shipping_name: "",
        shipping_address: "",
        shipping_city: "",
        shipping_postal_code: "",
        shipping_phone: "",
    });
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    // Redirect if cart is empty
    useEffect(() => {
        if (isMounted && items.length === 0) {
            router.push("/");
        }
    }, [isMounted, items, router]);

    // Pre-fill name from session
    useEffect(() => {
        const name = session?.user?.name;
        if (name) {
            setForm((prev) => ({ ...prev, shipping_name: name }));
        }
    }, [session]);

    if (!isMounted) return null;

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!session?.user) {
            setError("Precisas de fazer login para finalizar a compra.");
            return;
        }

        // Validate form
        if (!form.shipping_name || !form.shipping_address || !form.shipping_city || !form.shipping_postal_code || !form.shipping_phone) {
            setError("Por favor, preenche todos os campos.");
            return;
        }

        setSubmitting(true);
        setError(null);

        try {
            const res = await fetch("/api/checkout", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    items: items.map((i) => ({
                        listing_id: i.listing_id,
                        price: i.price,
                        currency: i.currency,
                        quantity: i.quantity,
                    })),
                    shipping: form,
                }),
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.error || "Erro ao processar compra");
            }

            clearCart();
            router.push(`/order/${data.order_id}`);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <main className="min-h-screen bg-charcoal pb-32 md:pb-20 pt-8 select-none">
            <div className="max-w-4xl mx-auto px-4 md:px-8">
                {/* Back Button */}
                <Link href="/" className="inline-flex items-center gap-2 text-sm font-black text-slate-lighter lowercase hover:text-periwinkle transition-colors mb-8 group">
                    <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                    voltar ao feed
                </Link>

                <motion.h1
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-4xl md:text-5xl font-black tracking-tighter mb-12"
                >
                    Finalizar compra
                </motion.h1>

                <div className="grid grid-cols-1 md:grid-cols-5 gap-12 items-start">
                    {/* Form */}
                    <motion.form
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        onSubmit={handleSubmit}
                        className="md:col-span-3 space-y-6"
                    >
                        {/* Delivery Details */}
                        <div className="clay-card p-8 space-y-6">
                            <div className="flex items-center gap-3 mb-6">
                                <MapPin className="w-5 h-5 text-periwinkle" />
                                <h2 className="text-xl font-black tracking-tight">Morada de envio</h2>
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-bold text-slate-lighter uppercase tracking-widest">
                                    Nome completo
                                </label>
                                <input
                                    type="text"
                                    name="shipping_name"
                                    value={form.shipping_name}
                                    onChange={handleChange}
                                    placeholder="O teu nome"
                                    className="w-full bg-card-bg text-off-white placeholder-slate-lighter rounded-2xl py-3 px-4 text-sm font-medium border border-slate-700 focus:outline-none focus:border-periwinkle transition-colors"
                                    required
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-bold text-slate-lighter uppercase tracking-widest">
                                    Morada
                                </label>
                                <input
                                    type="text"
                                    name="shipping_address"
                                    value={form.shipping_address}
                                    onChange={handleChange}
                                    placeholder="Rua, número, apartamento"
                                    className="w-full bg-card-bg text-off-white placeholder-slate-lighter rounded-2xl py-3 px-4 text-sm font-medium border border-slate-700 focus:outline-none focus:border-periwinkle transition-colors"
                                    required
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-slate-lighter uppercase tracking-widest">
                                        Cidade
                                    </label>
                                    <input
                                        type="text"
                                        name="shipping_city"
                                        value={form.shipping_city}
                                        onChange={handleChange}
                                        placeholder="Cidade"
                                        className="w-full bg-card-bg text-off-white placeholder-slate-lighter rounded-2xl py-3 px-4 text-sm font-medium border border-slate-700 focus:outline-none focus:border-periwinkle transition-colors"
                                        required
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-slate-lighter uppercase tracking-widest">
                                        Código postal
                                    </label>
                                    <input
                                        type="text"
                                        name="shipping_postal_code"
                                        value={form.shipping_postal_code}
                                        onChange={handleChange}
                                        placeholder="0000-000"
                                        className="w-full bg-card-bg text-off-white placeholder-slate-lighter rounded-2xl py-3 px-4 text-sm font-medium border border-slate-700 focus:outline-none focus:border-periwinkle transition-colors"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-bold text-slate-lighter uppercase tracking-widest">
                                    Telemóvel
                                </label>
                                <input
                                    type="tel"
                                    name="shipping_phone"
                                    value={form.shipping_phone}
                                    onChange={handleChange}
                                    placeholder="+351 900 000 000"
                                    className="w-full bg-card-bg text-off-white placeholder-slate-lighter rounded-2xl py-3 px-4 text-sm font-medium border border-slate-700 focus:outline-none focus:border-periwinkle transition-colors"
                                    required
                                />
                            </div>
                        </div>

                        {error && (
                            <div className="bg-rose-500/10 border border-rose-500/30 rounded-2xl p-4">
                                <p className="text-rose-400 text-sm font-bold">{error}</p>
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={submitting}
                            className="clay-btn w-full py-5 text-xl flex items-center justify-center gap-3 disabled:opacity-50"
                        >
                            {submitting ? (
                                <>
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                    A processar...
                                </>
                            ) : (
                                <>
                                    <CreditCard className="w-5 h-5" />
                                    Pagar {formatPrice(totalPrice)}
                                </>
                            )}
                        </button>

                        {/* PAP Project Warning */}
                        <div className="bg-amber-500/10 border border-amber-500/30 rounded-2xl p-5">
                            <p className="text-amber-400 text-xs font-bold leading-relaxed">
                                ⚠️ Este site foi desenvolvido como projeto para a PAP (Prova de Aptidão Profissional).
                                O processo de pagamento não é real. Não serão cobrados valores reais.
                                No entanto, um recibo/confirmação de compra será enviado para o teu email
                                como um site de compras real faria.
                            </p>
                        </div>
                    </motion.form>

                    {/* Order Summary */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2 }}
                        className="md:col-span-2 md:sticky md:top-32"
                    >
                        <div className="clay-card p-8 space-y-6">
                            <div className="flex items-center gap-3">
                                <ShoppingBag className="w-5 h-5 text-periwinkle" />
                                <h2 className="text-lg font-black tracking-tight">Resumo</h2>
                            </div>

                            <div className="space-y-4 divide-y divide-slate-700">
                                {items.map((item) => (
                                    <div key={item.listing_id} className="flex gap-3 pt-4 first:pt-0">
                                        <div className="relative w-14 h-14 rounded-xl overflow-hidden bg-hover-bg flex-shrink-0">
                                            <img
                                                src={item.image_url}
                                                alt={item.title}
                                                className="w-full h-full object-cover"
                                            />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-bold text-off-white line-clamp-1">{item.title}</p>
                                            <p className="text-xs text-slate-lighter font-medium">Qty: {item.quantity}</p>
                                            <p className="text-sm font-black text-periwinkle">
                                                {formatPrice(item.price * item.quantity)}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="pt-4 border-t border-slate-700">
                                <div className="flex items-center justify-between">
                                    <span className="font-bold text-off-white">Total</span>
                                    <span className="font-black text-xl text-periwinkle">
                                        {formatPrice(totalPrice)}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>
        </main>
    );
}
