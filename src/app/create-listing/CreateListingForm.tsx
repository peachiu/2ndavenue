"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Camera, ArrowRight, X, Loader2 } from "lucide-react";

interface Category {
    id: number;
    name_pt: string;
    slug: string;
}

export default function CreateListingForm({ categories }: { categories: Category[] }) {
    const router = useRouter();
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [form, setForm] = useState({
        title: "",
        price: "",
        currency: "EUR",
        category_id: "",
        condition_rating: "good",
        size: "",
        description: "",
    });

    function handleChange(
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
    ) {
        setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    }

    async function handleSubmit(status: "active" | "draft") {
        if (!form.title.trim()) {
            setError("O título é obrigatório");
            return;
        }
        if (!form.price || Number(form.price) <= 0) {
            setError("O preço deve ser maior que zero");
            return;
        }
        if (!form.category_id) {
            setError("Seleciona uma categoria");
            return;
        }

        setError(null);
        setSubmitting(true);

        try {
            const res = await fetch("/api/listings", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    ...form,
                    price: Number(form.price),
                    category_id: Number(form.category_id),
                    status,
                }),
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.error || "Erro ao criar anúncio");
            }

            // Store toast message
            sessionStorage.setItem("toast", "Anúncio criado com sucesso! 🎉");
            router.push("/dashboard");
            router.refresh();
        } catch (err: any) {
            setError(err.message);
        } finally {
            setSubmitting(false);
        }
    }

    return (
        <>
            {error && (
                <div className="clay-card p-4 mb-8 bg-red-900/20 border border-red-500/30">
                    <p className="text-sm font-bold text-red-400">{error}</p>
                </div>
            )}

            {/* Step 1: Photos */}
            <section className="space-y-6">
                <div className="flex items-end justify-between">
                    <h2 className="text-2xl font-black tracking-tight">1. Vibe check (fotos)</h2>
                    <span className="text-sm font-bold text-slate-lighter">até 8 fotos</span>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <button
                        type="button"
                        className="aspect-square clay-card bg-card-bg border-dashed border-2 flex flex-col items-center justify-center gap-3 text-slate-lighter hover:text-periwinkle transition-all group"
                        onClick={() => alert("Upload de imagens será implementado em breve.")}
                    >
                        <div className="h-12 w-12 rounded-full bg-hover-bg flex items-center justify-center group-hover:bg-periwinkle/10 transition-colors">
                            <Camera className="w-6 h-6" />
                        </div>
                        <span className="text-sm font-bold">Envia</span>
                    </button>
                    {[1, 2, 3].map((i) => (
                        <div
                            key={i}
                            className="aspect-square clay-card bg-hover-bg flex items-center justify-center relative"
                        >
                            <button
                                type="button"
                                className="absolute -top-2 -right-2 p-1.5 bg-card-bg rounded-full shadow-md text-slate-lighter hover:text-rose-500"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        </div>
                    ))}
                </div>
            </section>

            {/* Step 2: Details */}
            <section className="space-y-6">
                <h2 className="text-2xl font-black tracking-tight">2. Os detalhes</h2>
                <div className="clay-card p-10 space-y-8">
                    <div className="space-y-2">
                        <label className="text font-bold text-off-white ml-1">Título</label>
                        <input
                            type="text"
                            name="title"
                            value={form.title}
                            onChange={handleChange}
                            placeholder="e.g. vintage 90s knit sweater"
                            className="w-full bg-hover-bg px-6 py-5 rounded-3xl border-2 border-transparent focus:border-periwinkle focus:outline-none transition-all placeholder:text-slate-lighter font-bold text-off-white shadow-inner text-lg"
                        />
                    </div>

                    <div className="grid md:grid-cols-2 gap-8">
                        <div className="space-y-2">
                            <label className="text font-bold text-off-white ml-1">Preço</label>
                            <div className="relative">
                                <span className="absolute left-6 top-1/2 -translate-y-1/2 font-black text-slate-lighter">€</span>
                                <input
                                    type="number"
                                    name="price"
                                    value={form.price}
                                    onChange={handleChange}
                                    placeholder="00.00"
                                    step="0.01"
                                    min="0"
                                    className="w-full bg-hover-bg pl-12 pr-6 py-5 rounded-3xl border-2 border-transparent focus:border-periwinkle focus:outline-none transition-all placeholder:text-slate-lighter font-bold text-off-white shadow-inner text-lg"
                                />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <label className="text font-bold text-off-white ml-1">Categoria</label>
                            <select
                                name="category_id"
                                value={form.category_id}
                                onChange={handleChange}
                                className="w-full bg-hover-bg px-6 py-5 rounded-3xl border-2 border-transparent focus:border-periwinkle focus:outline-none transition-all font-bold text-off-white shadow-inner text-lg appearance-none"
                            >
                                <option value="">Escolhe categoria</option>
                                {categories.map((cat) => (
                                    <option key={cat.id} value={cat.id}>
                                        {cat.name_pt}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-8">
                        <div className="space-y-2">
                            <label className="text font-bold text-off-white ml-1">Estado</label>
                            <select
                                name="condition_rating"
                                value={form.condition_rating}
                                onChange={handleChange}
                                className="w-full bg-hover-bg px-6 py-5 rounded-3xl border-2 border-transparent focus:border-periwinkle focus:outline-none transition-all font-bold text-off-white shadow-inner text-lg appearance-none"
                            >
                                <option value="new">Novo</option>
                                <option value="mint">Impecável</option>
                                <option value="like_new">Praticamente novo</option>
                                <option value="good">Bom</option>
                                <option value="fair">Ok</option>
                                <option value="poor">Tem uso</option>
                            </select>
                        </div>
                        <div className="space-y-2">
                            <label className="text font-bold text-off-white ml-1">Tamanho (opcional)</label>
                            <input
                                type="text"
                                name="size"
                                value={form.size}
                                onChange={handleChange}
                                placeholder="e.g. M, 42, One size"
                                className="w-full bg-hover-bg px-6 py-5 rounded-3xl border-2 border-transparent focus:border-periwinkle focus:outline-none transition-all placeholder:text-slate-lighter font-bold text-off-white shadow-inner text-lg"
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text font-bold text-off-white ml-1">Descrição</label>
                        <textarea
                            name="description"
                            value={form.description}
                            onChange={handleChange}
                            rows={5}
                            placeholder="conta-nos sobre o seu histórico e estética..."
                            className="w-full bg-hover-bg px-6 py-5 rounded-3xl border-2 border-transparent focus:border-periwinkle focus:outline-none transition-all placeholder:text-slate-lighter font-bold text-off-white shadow-inner text-lg"
                        />
                    </div>
                </div>
            </section>

            {/* Step 3: Publish */}
            <div className="flex items-center justify-between pt-8">
                <button
                    type="button"
                    disabled={submitting}
                    onClick={() => handleSubmit("draft")}
                    className="px-8 py-5 rounded-full font-bold text-slate-light hover:bg-hover-bg transition-colors disabled:opacity-50"
                >
                    {submitting ? "A guardar..." : "Guardar rascunho"}
                </button>
                <button
                    type="button"
                    disabled={submitting}
                    onClick={() => handleSubmit("active")}
                    className="clay-btn px-12 py-5 text-xl flex items-center gap-3 disabled:opacity-50"
                >
                    {submitting ? (
                        <Loader2 className="w-6 h-6 animate-spin" />
                    ) : (
                        <>
                            Publica a peça
                            <ArrowRight className="w-6 h-6" />
                        </>
                    )}
                </button>
            </div>
        </>
    );
}
