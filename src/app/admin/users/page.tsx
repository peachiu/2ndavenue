import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import pool from "@/lib/db";
import { Search, Shield, ShieldOff, BadgeCheck, Trash2 } from "lucide-react";
import AdminUserActions from "./AdminUserActions";

export const dynamic = "force-dynamic";

export default async function AdminUsersPage() {
    const session = await getServerSession(authOptions);
    if (!session) redirect("/login");
    if ((session.user as any).role !== "admin") redirect("/");

    const [rows] = await pool.query(
        `SELECT id, name, email, image, role, is_verified, location,
                DATE_FORMAT(created_at, '%Y-%m-%dT%H:%i:%s') AS created_at
         FROM users
         ORDER BY created_at DESC`
    );
    const users = rows as any[];

    const totalCount = users.length;
    const adminCount = users.filter((u) => u.role === "admin").length;
    const proCount = users.filter((u) => u.role === "professional").length;

    return (
        <div>
            {/* Header */}
            <div className="mb-8">
                <h1 className="text-4xl md:text-5xl font-black tracking-tighter mb-2">
                    Utilizadores
                </h1>
                <div className="flex items-center gap-4 text-sm font-bold text-slate-light">
                    <span>{totalCount} total</span>
                    <span className="w-1 h-1 rounded-full bg-slate-700" />
                    <span className="text-periwinkle">{adminCount} admin</span>
                    <span className="w-1 h-1 rounded-full bg-slate-700" />
                    <span className="text-amber-400">{proCount} pro</span>
                </div>
            </div>

            {/* Filters / Search — client component */}
            <AdminUserActions userId={0} currentRole="" isVerified={false} />

            {/* Users Table */}
            <div className="clay-card overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="border-b border-slate-700">
                                <th className="text-left p-4 font-bold text-slate-light uppercase text-[10px] tracking-widest">
                                    Utilizador
                                </th>
                                <th className="text-left p-4 font-bold text-slate-light uppercase text-[10px] tracking-widest">
                                    Email
                                </th>
                                <th className="text-left p-4 font-bold text-slate-light uppercase text-[10px] tracking-widest">
                                    Role
                                </th>
                                <th className="text-left p-4 font-bold text-slate-light uppercase text-[10px] tracking-widest">
                                    Verificado
                                </th>
                                <th className="text-left p-4 font-bold text-slate-light uppercase text-[10px] tracking-widest">
                                    Desde
                                </th>
                                <th className="text-right p-4 font-bold text-slate-light uppercase text-[10px] tracking-widest">
                                    Ações
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.map((u: any) => (
                                <tr
                                    key={u.id}
                                    className="border-b border-slate-700/50 hover:bg-hover-bg transition-colors last:border-none"
                                >
                                    <td className="p-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-9 h-9 rounded-full bg-periwinkle/20 flex items-center justify-center overflow-hidden flex-shrink-0">
                                                {u.image ? (
                                                    <img
                                                        src={u.image}
                                                        alt={u.name || ""}
                                                        className="w-full h-full object-cover"
                                                    />
                                                ) : (
                                                    <span className="text-xs font-black text-periwinkle">
                                                        {u.name?.[0]?.toUpperCase() || "?"}
                                                    </span>
                                                )}
                                            </div>
                                            <span className="font-bold text-off-white">
                                                {u.name || "Sem nome"}
                                            </span>
                                        </div>
                                    </td>
                                    <td className="p-4 text-slate-light font-medium">
                                        {u.email}
                                    </td>
                                    <td className="p-4">
                                        <span
                                            className={`text-[10px] font-black uppercase px-2 py-1 rounded-full ${
                                                u.role === "admin"
                                                    ? "bg-periwinkle/15 text-periwinkle"
                                                    : u.role === "professional"
                                                      ? "bg-amber-100/10 text-amber-400"
                                                      : "bg-slate-100/10 text-slate-light"
                                            }`}
                                        >
                                            {u.role === "admin"
                                                ? "Admin"
                                                : u.role === "professional"
                                                  ? "Pro"
                                                  : "Comunidade"}
                                        </span>
                                    </td>
                                    <td className="p-4">
                                        {u.is_verified ? (
                                            <span className="flex items-center gap-1 text-emerald-400 font-bold text-xs">
                                                <BadgeCheck className="w-4 h-4" />
                                                Verificado
                                            </span>
                                        ) : (
                                            <span className="text-slate-light font-bold text-xs">
                                                Não
                                            </span>
                                        )}
                                    </td>
                                    <td className="p-4 text-slate-light font-medium text-xs">
                                        {new Date(u.created_at).toLocaleDateString(
                                            "pt-PT",
                                            {
                                                day: "numeric",
                                                month: "short",
                                                year: "numeric",
                                            }
                                        )}
                                    </td>
                                    <td className="p-4 text-right">
                                        <AdminUserActions
                                            userId={u.id}
                                            currentRole={u.role}
                                            isVerified={u.is_verified}
                                        />
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
