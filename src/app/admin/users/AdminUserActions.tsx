"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
    Shield,
    ShieldOff,
    BadgeCheck,
    Trash2,
    Search,
    Loader2,
} from "lucide-react";

interface Props {
    userId?: number;
    currentRole?: string;
    isVerified?: boolean;
}

export default function AdminUserActions({ userId, currentRole, isVerified }: Props) {
    const router = useRouter();
    const [searchQuery, setSearchQuery] = useState("");
    const [loading, setLoading] = useState<string | null>(null);

    // If no userId provided, render search bar
    if (!userId) {
        return (
            <div className="relative mb-6">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-light" />
                <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Procurar utilizador por nome ou email..."
                    className="w-full bg-hover-bg pl-12 pr-6 py-4 rounded-2xl border-2 border-transparent focus:border-periwinkle focus:outline-none transition-all placeholder:text-slate-lighter font-bold text-off-white shadow-inner"
                />
            </div>
        );
    }

    async function action(type: string) {
        setLoading(type);
        try {
            const res = await fetch("/api/admin/users", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ userId, action: type }),
            });
            if (!res.ok) throw new Error("Failed");
            router.refresh();
        } catch (err) {
            console.error(err);
            alert("Erro ao executar ação.");
        } finally {
            setLoading(null);
        }
    }

    const isAdmin = currentRole === "admin";

    return (
        <div className="flex items-center justify-end gap-2">
            {/* Toggle Admin */}
            {!isAdmin && (
                <button
                    onClick={() => action("toggleAdmin")}
                    disabled={loading !== null}
                    className="p-2 rounded-xl text-slate-light hover:bg-periwinkle/10 hover:text-periwinkle transition-all disabled:opacity-50"
                    title="Promover a admin"
                >
                    {loading === "toggleAdmin" ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                        <Shield className="w-4 h-4" />
                    )}
                </button>
            )}
            {isAdmin && (
                <button
                    onClick={() => action("removeAdmin")}
                    disabled={loading !== null}
                    className="p-2 rounded-xl text-slate-light hover:bg-red-900/30 hover:text-red-400 transition-all disabled:opacity-50"
                    title="Remover admin"
                >
                    {loading === "removeAdmin" ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                        <ShieldOff className="w-4 h-4" />
                    )}
                </button>
            )}

            {/* Toggle Verified */}
            <button
                onClick={() => action("toggleVerified")}
                disabled={loading !== null}
                className={`p-2 rounded-xl transition-all disabled:opacity-50 ${
                    isVerified
                        ? "text-emerald-400 hover:bg-red-900/30 hover:text-red-400"
                        : "text-slate-light hover:bg-emerald-900/30 hover:text-emerald-400"
                }`}
                title={isVerified ? "Remover verificação" : "Verificar"}
            >
                {loading === "toggleVerified" ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                    <BadgeCheck className="w-4 h-4" />
                )}
            </button>

            {/* Promote to Pro */}
            {currentRole === "community" && (
                <button
                    onClick={() => action("promotePro")}
                    disabled={loading !== null}
                    className="p-2 rounded-xl text-slate-light hover:bg-amber-100/10 hover:text-amber-400 transition-all disabled:opacity-50"
                    title="Promover a profissional"
                >
                    {loading === "promotePro" ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                        <span className="text-[10px] font-black uppercase">Pro</span>
                    )}
                </button>
            )}

            {/* Delete User */}
            <button
                onClick={() => {
                    if (confirm("Tens a certeza? Esta ação é irreversível.")) {
                        action("delete");
                    }
                }}
                disabled={loading !== null || isAdmin}
                className={`p-2 rounded-xl transition-all disabled:opacity-50 ${
                    isAdmin
                        ? "text-slate-700 cursor-not-allowed"
                        : "text-slate-light hover:bg-red-900/30 hover:text-red-400"
                }`}
                title={isAdmin ? "Não podes apagar admins" : "Apagar utilizador"}
            >
                {loading === "delete" ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                    <Trash2 className="w-4 h-4" />
                )}
            </button>
        </div>
    );
}
