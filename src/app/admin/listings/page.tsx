import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import pool from "@/lib/db";
import { Eye } from "lucide-react";
import AdminListingActions from "./AdminListingActions";

export const dynamic = "force-dynamic";

export default async function AdminListingsPage() {
    const session = await getServerSession(authOptions);
    if (!session) redirect("/login");
    if ((session.user as any).role !== "admin") redirect("/");

    const [rows] = await pool.query(
        `SELECT 
            l.id, l.title, l.price, l.currency, l.status, l.views, l.stock,
            l.condition_rating,
            DATE_FORMAT(l.created_at, '%Y-%m-%dT%H:%i:%s') AS created_at,
            u.name AS seller_name,
            u.id AS seller_id,
            c.name_pt AS category_name
         FROM listings l
         LEFT JOIN users u ON l.user_id = u.id
         LEFT JOIN categories c ON l.category_id = c.id
         ORDER BY l.created_at DESC`
    );
    const listings = rows as any[];

    const activeCount = listings.filter((l) => l.status === "active").length;
    const draftCount = listings.filter((l) => l.status === "draft").length;
    const soldCount = listings.filter((l) => l.status === "sold").length;
    const archivedCount = listings.filter((l) => l.status === "archived").length;

    const STATUS_COLORS: Record<string, string> = {
        active: "bg-emerald-100/10 text-emerald-400",
        draft: "bg-slate-100/10 text-slate-light",
        sold: "bg-blue-100/10 text-blue-400",
        archived: "bg-red-100/10 text-red-400",
    };

    const STATUS_LABELS: Record<string, string> = {
        active: "Ativo",
        draft: "Rascunho",
        sold: "Vendido",
        archived: "Arquivado",
    };

    return (
        <div>
            {/* Header */}
            <div className="mb-8">
                <h1 className="text-4xl md:text-5xl font-black tracking-tighter mb-2">
                    Anúncios
                </h1>
                <div className="flex items-center gap-4 text-sm font-bold text-slate-light flex-wrap">
                    <span>{listings.length} total</span>
                    <span className="w-1 h-1 rounded-full bg-slate-700" />
                    <span className="text-emerald-400">{activeCount} ativos</span>
                    <span className="w-1 h-1 rounded-full bg-slate-700" />
                    <span className="text-slate-light">{draftCount} rascunhos</span>
                    <span className="w-1 h-1 rounded-full bg-slate-700" />
                    <span className="text-blue-400">{soldCount} vendidos</span>
                    <span className="w-1 h-1 rounded-full bg-slate-700" />
                    <span className="text-red-400">{archivedCount} arquivados</span>
                </div>
            </div>

            {/* Listings Table */}
            <div className="clay-card overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="border-b border-slate-700">
                                <th className="text-left p-4 font-bold text-slate-light uppercase text-[10px] tracking-widest">
                                    Anúncio
                                </th>
                                <th className="text-left p-4 font-bold text-slate-light uppercase text-[10px] tracking-widest">
                                    Vendedor
                                </th>
                                <th className="text-left p-4 font-bold text-slate-light uppercase text-[10px] tracking-widest">
                                    Preço
                                </th>
                                <th className="text-left p-4 font-bold text-slate-light uppercase text-[10px] tracking-widest">
                                    Categoria
                                </th>
                                <th className="text-left p-4 font-bold text-slate-light uppercase text-[10px] tracking-widest">
                                    Estado
                                </th>
                                <th className="text-left p-4 font-bold text-slate-light uppercase text-[10px] tracking-widest">
                                    Status
                                </th>
                                <th className="text-right p-4 font-bold text-slate-light uppercase text-[10px] tracking-widest">
                                    Ações
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {listings.length === 0 ? (
                                <tr>
                                    <td
                                        colSpan={7}
                                        className="p-12 text-center text-slate-light font-bold"
                                    >
                                        Nenhum anúncio encontrado.
                                    </td>
                                </tr>
                            ) : (
                                listings.map((l: any) => (
                                    <tr
                                        key={l.id}
                                        className="border-b border-slate-700/50 hover:bg-hover-bg transition-colors last:border-none"
                                    >
                                        <td className="p-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-xl bg-hover-bg flex items-center justify-center flex-shrink-0 border border-slate-700">
                                                    <span className="text-xs font-black text-periwinkle">
                                                        {l.title?.[0]?.toUpperCase() || "?"}
                                                    </span>
                                                </div>
                                                <div className="min-w-0">
                                                    <p className="font-bold text-off-white truncate max-w-[200px]">
                                                        {l.title}
                                                    </p>
                                                    <p className="text-[10px] font-bold text-slate-light flex items-center gap-1">
                                                        <Eye className="w-3 h-3" />
                                                        {l.views || 0} · stock: {l.stock || 1}
                                                    </p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="p-4 text-slate-light font-medium">
                                            {l.seller_name || "Desconhecido"}
                                        </td>
                                        <td className="p-4 font-bold text-off-white">
                                            {Number(l.price).toLocaleString("pt-PT", {
                                                style: "currency",
                                                currency: l.currency || "EUR",
                                            })}
                                        </td>
                                        <td className="p-4 text-slate-light font-medium text-xs">
                                            {l.category_name || "—"}
                                        </td>
                                        <td className="p-4">
                                            <span className="text-[10px] font-black uppercase text-slate-light">
                                                {l.condition_rating || "—"}
                                            </span>
                                        </td>
                                        <td className="p-4">
                                            <span
                                                className={`text-[10px] font-black uppercase px-2 py-1 rounded-full ${
                                                    STATUS_COLORS[l.status] ||
                                                    "bg-slate-100/10 text-slate-light"
                                                }`}
                                            >
                                                {STATUS_LABELS[l.status] || l.status}
                                            </span>
                                        </td>
                                        <td className="p-4 text-right">
                                            <AdminListingActions
                                                listingId={l.id}
                                                currentStatus={l.status}
                                            />
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
