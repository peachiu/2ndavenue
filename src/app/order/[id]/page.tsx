"use client";

import { motion } from "framer-motion";
import { CheckCircle, ShoppingBag, ArrowLeft, Loader2, MapPin, Mail, Calendar } from "lucide-react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useCurrency } from "@/context/CurrencyContext";

interface OrderData {
    id: number;
    total: number;
    currency: string;
    status: string;
    shipping_name: string;
    shipping_address: string;
    shipping_city: string;
    shipping_postal_code: string;
    shipping_phone: string;
    receipt_sent: number;
    created_at: string;
    items: {
        listing_id: number;
        title: string;
        price: number;
        quantity: number;
        image_url: string;
    }[];
}

export default function OrderConfirmationPage() {
    const params = useParams();
    const router = useRouter();
    const { data: session } = useSession();
    const { formatPrice } = useCurrency();
    const [order, setOrder] = useState<OrderData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!params?.id) return;

        const id = Array.isArray(params.id) ? params.id[0] : params.id;

        fetch(`/api/orders/${id}`)
            .then((res) => {
                if (!res.ok) throw new Error("Encomenda não encontrada");
                return res.json();
            })
            .then((data) => {
                setOrder(data);
                setLoading(false);
            })
            .catch((err) => {
                setError(err.message);
                setLoading(false);
            });
    }, [params?.id]);

    if (loading) {
        return (
            <main className="min-h-screen bg-charcoal flex items-center justify-center">
                <Loader2 className="w-8 h-8 text-periwinkle animate-spin" />
            </main>
        );
    }

    if (error || !order) {
        return (
            <main className="min-h-screen bg-charcoal flex items-center justify-center">
                <div className="text-center space-y-4">
                    <p className="text-6xl">😕</p>
                    <p className="text-slate-light font-bold lowercase italic">{error || "encomenda não encontrada"}</p>
                    <Link href="/" className="clay-btn inline-block px-8 py-4 text-sm">
                        voltar ao início
                    </Link>
                </div>
            </main>
        );
    }

    const orderDate = new Date(order.created_at).toLocaleDateString("pt-PT", {
        day: "numeric",
        month: "long",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
    });

    return (
        <main className="min-h-screen bg-charcoal pb-32 md:pb-20 pt-8 select-none">
            <div className="max-w-2xl mx-auto px-4 md:px-8">
                {/* Success Animation */}
                <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", damping: 15, stiffness: 200 }}
                    className="flex justify-center mb-8"
                >
                    <div className="w-24 h-24 bg-emerald-500/20 rounded-full flex items-center justify-center">
                        <CheckCircle className="w-14 h-14 text-emerald-400" />
                    </div>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="text-center mb-12"
                >
                    <h1 className="text-4xl md:text-5xl font-black tracking-tighter mb-4">
                        Compra concluída! 🎉
                    </h1>
                    <p className="text-lg text-slate-light font-medium">
                        Obrigado pela tua compra. O recibo será enviado para o teu email.
                    </p>
                </motion.div>

                {/* PAP Warning Box */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="bg-amber-500/10 border border-amber-500/30 rounded-2xl p-6 mb-8"
                >
                    <p className="text-amber-400 text-sm font-bold leading-relaxed">
                        ⚠️ Este site foi desenvolvido como projeto para a{" "}
                        <strong>PAP (Prova de Aptidão Profissional)</strong>.
                        O processo de pagamento não é real e não foram cobrados valores reais.
                        No entanto, um recibo/confirmação de compra foi enviado para o teu email
                        <strong> ({session?.user?.email})</strong>, como um site de compras real faria.
                    </p>
                </motion.div>

                {/* Order Details */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="clay-card p-8 space-y-6 mb-8"
                >
                    <div className="flex items-center justify-between">
                        <h2 className="text-xl font-black tracking-tight">Detalhes da encomenda</h2>
                        <span className="text-emerald-400 text-sm font-bold bg-emerald-500/10 px-4 py-1.5 rounded-full">
                            {order.status === "paid" ? "Pago" : order.status}
                        </span>
                    </div>

                    <div className="space-y-3 text-sm">
                        <div className="flex items-center gap-3 text-slate-light">
                            <Calendar className="w-4 h-4 text-periwinkle" />
                            <span className="font-medium">{orderDate}</span>
                        </div>
                        <div className="flex items-center gap-3 text-slate-light">
                            <Mail className="w-4 h-4 text-periwinkle" />
                            <span className="font-medium">{session?.user?.email}</span>
                        </div>
                        <div className="flex items-start gap-3 text-slate-light">
                            <MapPin className="w-4 h-4 text-periwinkle mt-0.5" />
                            <span className="font-medium">
                                {order.shipping_name}<br />
                                {order.shipping_address}<br />
                                {order.shipping_postal_code}, {order.shipping_city}<br />
                                📞 {order.shipping_phone}
                            </span>
                        </div>
                    </div>

                    <div className="pt-4 border-t border-slate-700 space-y-3">
                        <h3 className="font-bold text-off-white text-sm">Itens</h3>
                        {order.items.map((item) => (
                            <div key={item.listing_id} className="flex gap-3">
                                <div className="relative w-12 h-12 rounded-xl overflow-hidden bg-hover-bg flex-shrink-0">
                                    <img
                                        src={item.image_url}
                                        alt={item.title}
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <Link
                                        href={`/product/${item.listing_id}`}
                                        className="text-sm font-bold text-off-white hover:text-periwinkle transition-colors line-clamp-1"
                                    >
                                        {item.title}
                                    </Link>
                                    <p className="text-xs text-slate-lighter font-medium">
                                        {item.quantity}x {formatPrice(item.price)}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="pt-4 border-t border-slate-700 flex items-center justify-between">
                        <span className="font-bold text-off-white text-lg">Total</span>
                        <span className="font-black text-2xl text-periwinkle">
                            {formatPrice(order.total)}
                        </span>
                    </div>
                </motion.div>

                {/* Back to Home */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className="text-center"
                >
                    <Link
                        href="/"
                        className="clay-btn inline-flex items-center gap-2 px-10 py-5 text-lg"
                    >
                        <ArrowLeft className="w-5 h-5" />
                        Voltar à página inicial
                    </Link>
                </motion.div>
            </div>
        </main>
    );
}
