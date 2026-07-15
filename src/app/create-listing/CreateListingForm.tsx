"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { Camera, ArrowRight, X, Loader2, ImageIcon, GripVertical } from "lucide-react";

interface Category {
    id: number;
    name_pt: string;
    slug: string;
}

interface SelectedImage {
    file: File;
    preview: string;
}

export default function CreateListingForm({ categories }: { categories: Category[] }) {
    const router = useRouter();
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [submitting, setSubmitting] = useState(false);
    const [uploadingImages, setUploadingImages] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [selectedImages, setSelectedImages] = useState<SelectedImage[]>([]);
    const [dragIndex, setDragIndex] = useState<number | null>(null);
    const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);
    const [form, setForm] = useState({
        title: "",
        price: "",
        currency: "EUR",
        category_id: "",
        condition_rating: "Good",
        size: "",
        description: "",
    });

    function handleChange(
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
    ) {
        setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    }

    function handleImageSelect(e: React.ChangeEvent<HTMLInputElement>) {
        const files = Array.from(e.target.files || []);
        const remaining = 8 - selectedImages.length;

        if (files.length > remaining) {
            setError(`Máximo de 8 fotos. Podes adicionar mais ${remaining}.`);
            return;
        }

        const newImages: SelectedImage[] = [];
        for (const file of files) {
            if (!file.type.startsWith("image/")) continue;
            newImages.push({
                file,
                preview: URL.createObjectURL(file),
            });
        }

        setSelectedImages((prev) => [...prev, ...newImages].slice(0, 8));
        setError(null);

        // Reset file input so the same file can be selected again
        if (fileInputRef.current) fileInputRef.current.value = "";
    }

    function removeImage(index: number) {
        setSelectedImages((prev) => {
            const img = prev[index];
            if (img) URL.revokeObjectURL(img.preview);
            return prev.filter((_, i) => i !== index);
        });
    }

    function handleDragStart(index: number) {
        setDragIndex(index);
    }

    function handleDragOver(e: React.DragEvent, index: number) {
        e.preventDefault();
        setDragOverIndex(index);
    }

    function handleDragLeave() {
        setDragOverIndex(null);
    }

    function handleDrop(index: number) {
        if (dragIndex === null || dragIndex === index) {
            setDragIndex(null);
            setDragOverIndex(null);
            return;
        }

        setSelectedImages((prev) => {
            const updated = [...prev];
            const [moved] = updated.splice(dragIndex, 1);
            updated.splice(index, 0, moved);
            return updated;
        });

        setDragIndex(null);
        setDragOverIndex(null);
    }

    function handleDragEnd() {
        setDragIndex(null);
        setDragOverIndex(null);
    }

    async function uploadImages(): Promise<string[]> {
        if (selectedImages.length === 0) return [];

        setUploadingImages(true);
        try {
            const formData = new FormData();
            for (const img of selectedImages) {
                formData.append("images", img.file);
            }

            const res = await fetch("/api/upload", {
                method: "POST",
                body: formData,
            });

            const data = await res.json();
            if (!res.ok) throw new Error(data.error || "Erro ao enviar imagens");

            return data.urls;
        } finally {
            setUploadingImages(false);
        }
    }

    async function handleSubmit(status: "active" | "draft") {
        if (!form.title.trim()) {
            setError("O título é obrigatório");
            window.scrollTo({ top: 0, behavior: "smooth" });
            return;
        }
        if (!form.price || Number(form.price) <= 0) {
            setError("O preço deve ser maior que zero");
            window.scrollTo({ top: 0, behavior: "smooth" });
            return;
        }
        if (!form.category_id) {
            setError("Seleciona uma categoria");
            window.scrollTo({ top: 0, behavior: "smooth" });
            return;
        }

        setError(null);
        setSubmitting(true);

        try {
            // Upload images first
            const imageUrls = await uploadImages();

            // Then create the listing
            const res = await fetch("/api/listings", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    ...form,
                    price: Number(form.price),
                    category_id: Number(form.category_id),
                    status,
                    image_urls: imageUrls,
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
            window.scrollTo({ top: 0, behavior: "smooth" });
        } finally {
            setSubmitting(false);
        }
    }

    return (
        <>
            {error && (
                <div className="p-4 mb-8 bg-red-900/20 border border-red-500/30 rounded-3xl">
                    <p className="text-sm font-bold text-red-400">{error}</p>
                </div>
            )}

            {/* Step 1: Photos */}
            <section className="space-y-6">
                <div className="flex items-end justify-between">
                    <h2 className="text-2xl font-black tracking-tight">1. Vibe check (fotos)</h2>
                    <span className="text-sm font-bold text-slate-lighter">
                        {selectedImages.length}/8 fotos
                    </span>
                </div>

                {/* Hidden file input */}
                <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    multiple
                    className="hidden"
                    onChange={handleImageSelect}
                />

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {/* Upload button — only show if < 8 images */}
                    {selectedImages.length < 8 && (
                        <button
                            type="button"
                            onClick={() => fileInputRef.current?.click()}
                            className="aspect-square bg-card-bg border-2 border-dashed border-slate-700 rounded-3xl flex flex-col items-center justify-center gap-3 text-slate-lighter hover:text-periwinkle hover:border-periwinkle/50 transition-all group"
                        >
                            <div className="h-12 w-12 rounded-full bg-hover-bg flex items-center justify-center group-hover:bg-periwinkle/10 transition-colors">
                                <Camera className="w-6 h-6" />
                            </div>
                            <span className="text-sm font-bold">Envia</span>
                        </button>
                    )}

                    {/* Image previews — draggable to reorder */}
                    {selectedImages.map((img, i) => {
                        const isDragging = dragIndex === i;
                        const isOver = dragOverIndex === i && dragIndex !== i;

                        return (
                            <div
                                key={i}
                                draggable="true"
                                onDragStart={() => handleDragStart(i)}
                                onDragOver={(e) => handleDragOver(e, i)}
                                onDragLeave={handleDragLeave}
                                onDrop={() => handleDrop(i)}
                                onDragEnd={handleDragEnd}
                                className={`aspect-square bg-hover-bg rounded-3xl overflow-hidden relative group border transition-all duration-200 ${
                                    isDragging
                                        ? 'opacity-50 scale-95 border-periwinkle shadow-lg shadow-periwinkle/20'
                                        : isOver
                                        ? 'border-periwinkle border-2 scale-105 shadow-lg shadow-periwinkle/20'
                                        : 'border-slate-700'
                                }`}
                            >
                                {/* Drag handle */}
                                <div className="absolute top-2 left-2 z-10 p-1 bg-card-bg/80 rounded-full text-slate-lighter cursor-grab active:cursor-grabbing backdrop-blur-sm border border-slate-700">
                                    <GripVertical className="w-3.5 h-3.5" />
                                </div>

                                <img
                                    src={img.preview}
                                    alt={`Foto ${i + 1}`}
                                    className="w-full h-full object-cover pointer-events-none select-none"
                                    draggable={false}
                                />

                                {/* Delete button — always visible */}
                                <button
                                    type="button"
                                    onClick={() => removeImage(i)}
                                    className="absolute -top-2 -right-2 p-1.5 bg-card-bg rounded-full shadow-md text-slate-lighter hover:text-rose-400 transition-colors border border-slate-700 z-10"
                                >
                                    <X className="w-4 h-4" />
                                </button>

                                {/* Order badge */}
                                <span className="absolute bottom-2 right-2 bg-card-bg/80 backdrop-blur-sm text-slate-lighter text-xs font-bold px-2 py-0.5 rounded-full border border-slate-700">
                                    {i + 1}
                                </span>

                                {/* Cover badge */}
                                {i === 0 && (
                                    <span className="absolute bottom-2 left-2 bg-periwinkle text-white text-xs font-bold px-2 py-0.5 rounded-full shadow-md">
                                        Capa
                                    </span>
                                )}
                            </div>
                        );
                    })}

                    {/* Empty slots (placeholder boxes) */}
                    {Array.from({ length: Math.max(0, 4 - selectedImages.length) }).map((_, i) => (
                        <div
                            key={`empty-${i}`}
                            className="aspect-square bg-hover-bg/50 rounded-3xl border border-slate-800 flex items-center justify-center"
                        >
                            <ImageIcon className="w-6 h-6 text-slate-800" />
                        </div>
                    ))}
                </div>
            </section>

            {/* Step 2: Details */}
            <section className="space-y-6">
                <h2 className="text-2xl font-black tracking-tight">2. Os detalhes</h2>
                <div className="bg-card-bg border border-slate-700 rounded-3xl p-6 md:p-10 space-y-8">
                    <div className="space-y-2">
                        <label className="text font-bold text-off-white ml-1">Título</label>
                        <input
                            type="text"
                            name="title"
                            value={form.title}
                            onChange={handleChange}
                            placeholder="e.g. vintage 90s knit sweater"
                            className="w-full bg-hover-bg px-6 py-5 rounded-2xl border-2 border-transparent focus:border-periwinkle focus:outline-none transition-all placeholder:text-slate-lighter font-bold text-off-white shadow-inner text-lg"
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
                                    className="w-full bg-hover-bg pl-12 pr-6 py-5 rounded-2xl border-2 border-transparent focus:border-periwinkle focus:outline-none transition-all placeholder:text-slate-lighter font-bold text-off-white shadow-inner text-lg"
                                />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <label className="text font-bold text-off-white ml-1">Categoria</label>
                            <select
                                name="category_id"
                                value={form.category_id}
                                onChange={handleChange}
                                className="w-full bg-hover-bg px-6 py-5 rounded-2xl border-2 border-transparent focus:border-periwinkle focus:outline-none transition-all font-bold text-off-white shadow-inner text-lg appearance-none"
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
                                className="w-full bg-hover-bg px-6 py-5 rounded-2xl border-2 border-transparent focus:border-periwinkle focus:outline-none transition-all font-bold text-off-white shadow-inner text-lg appearance-none"
                            >
                                <option value="New">Novo</option>
                                <option value="Like New">Praticamente novo</option>
                                <option value="Good">Bom</option>
                                <option value="Fair">Ok</option>
                                <option value="Poor">Tem uso</option>
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
                                className="w-full bg-hover-bg px-6 py-5 rounded-2xl border-2 border-transparent focus:border-periwinkle focus:outline-none transition-all placeholder:text-slate-lighter font-bold text-off-white shadow-inner text-lg"
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
                            className="w-full bg-hover-bg px-6 py-5 rounded-2xl border-2 border-transparent focus:border-periwinkle focus:outline-none transition-all placeholder:text-slate-lighter font-bold text-off-white shadow-inner text-lg resize-none"
                        />
                    </div>
                </div>
            </section>

            {/* Step 3: Publish */}
            <div className="flex items-center justify-between pt-8">
                <button
                    type="button"
                    disabled={submitting || uploadingImages}
                    onClick={() => handleSubmit("draft")}
                    className="px-8 py-5 rounded-full font-bold text-slate-light hover:bg-hover-bg transition-colors disabled:opacity-50"
                >
                    {submitting ? "A guardar..." : "Guardar rascunho"}
                </button>
                <button
                    type="button"
                    disabled={submitting || uploadingImages}
                    onClick={() => handleSubmit("active")}
                    className="bg-periwinkle text-white px-12 py-5 rounded-full font-bold flex items-center gap-3 hover:scale-105 active:scale-95 transition-all disabled:opacity-50 shadow-lg shadow-periwinkle/20"
                >
                    {(submitting || uploadingImages) ? (
                        <>
                            <Loader2 className="w-6 h-6 animate-spin" />
                            {uploadingImages ? "A enviar fotos..." : "A publicar..."}
                        </>
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
