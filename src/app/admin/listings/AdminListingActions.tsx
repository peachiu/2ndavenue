"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Eye, Archive, RotateCcw, Trash2, Loader2 } from "lucide-react";
import Link from "next/link";

interface Props {
    listingId: number;
    currentStatus: string;
}

const ACTIONS: Record<
    string,
    { label: string; icon: any; action: string; color: string }
> = {
    active: {
        label: "Arquivar",
        icon: Archive,
        action: "archive",
        color: "hover:bg-red-900/30 hover:text-red-400",
    },
    archived: {
        label: "Reativar",
        icon: RotateCcw,
        action: "activate",
        color: "hover:bg-emerald-900/30 hover:text-emerald-400",
    },
    draft: {
        label: "Publicar",
        icon: RotateCcw,
        action: "activate",
        color: "hover:bg-emerald-900/30 hover:text-emerald-400",
    },
};

export default function AdminListingActions({ listingId, currentStatus }: Props) {
    const router = useRouter();
    const [loading, setLoading] = useState<string | null>(null);

    async function action(type: string) {
        setLoading(type);
        try {
            const res = await fetch("/api/admin/listings", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ listingId, action: type }),
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

    const availableAction = ACTIONS[currentStatus];

    return (
        <div className="flex items-center justify-end gap-2">
            {/* View listing */}
            <Link
                href={`/product/${listingId}`}
                className="p-2 rounded-xl text-slate-light hover:bg-periwinkle/10 hover:text-periwinkle transition-all"
                title="Ver anúncio"
            >
                <Eye className="w-4 h-4" />
            </Link>

            {/* Status action */}
            {availableAction && (
                <button
                    onClick={() => action(availableAction.action)}
                    disabled={loading !== null}
                    className={`p-2 rounded-xl text-slate-light transition-all disabled:opacity-50 ${availableAction.color}`}
                    title={availableAction.label}
                >
                    {loading === availableAction.action ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                        <availableAction.icon className="w-4 h-4" />
                    )}
                </button>
            )}

            {/* Mark as sold */}
            {currentStatus === "active" && (
                <button
                    onClick={() => action("markSold")}
                    disabled={loading !== null}
                    className="p-2 rounded-xl text-slate-light hover:bg-blue-900/30 hover:text-blue-400 transition-all disabled:opacity-50"
                    title="Marcar como vendido"
                >
                    {loading === "markSold" ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                        <span className="text-[10px] font-black uppercase">$</span>
                    )}
                </button>
            )}

            {/* Delete */}
            <button
                onClick={() => {
                    if (confirm("Apagar este anúncio definitivamente?")) {
                        action("delete");
                    }
                }}
                disabled={loading !== null}
                className="p-2 rounded-xl text-slate-light hover:bg-red-900/30 hover:text-red-400 transition-all disabled:opacity-50"
                title="Apagar anúncio"
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
