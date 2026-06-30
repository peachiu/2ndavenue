import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import pool from "@/lib/db";
import {
    Users,
    Package,
    DollarSign,
    ShoppingBag,
    TrendingUp,
    MessageCircle,
} from "lucide-react";

interface PlatformStats {
    totalUsers: number;
    totalListings: number;
    activeListings: number;
    totalOrders: number;
    totalRevenue: number;
    totalMessages: number;
    newUsersToday: number;
    newListingsToday: number;
}

async function getStats(): Promise<PlatformStats> {
    const queries = await Promise.all([
        pool.query("SELECT COUNT(*) AS count FROM users"),
        pool.query("SELECT COUNT(*) AS count FROM listings"),
        pool.query("SELECT COUNT(*) AS count FROM listings WHERE status = 'active'"),
        pool.query("SELECT COUNT(*) AS count FROM orders"),
        pool.query("SELECT COALESCE(SUM(total), 0) AS total FROM orders WHERE status NOT IN ('cancelled', 'refunded')"),
        pool.query("SELECT COUNT(*) AS count FROM messages"),
        pool.query("SELECT COUNT(*) AS count FROM users WHERE DATE(created_at) = CURDATE()"),
        pool.query("SELECT COUNT(*) AS count FROM listings WHERE DATE(created_at) = CURDATE()"),
    ]);

    return {
        totalUsers: Number((queries[0][0] as any[])[0]?.count || 0),
        totalListings: Number((queries[1][0] as any[])[0]?.count || 0),
        activeListings: Number((queries[2][0] as any[])[0]?.count || 0),
        totalOrders: Number((queries[3][0] as any[])[0]?.count || 0),
        totalRevenue: Number((queries[4][0] as any[])[0]?.total || 0),
        totalMessages: Number((queries[5][0] as any[])[0]?.count || 0),
        newUsersToday: Number((queries[6][0] as any[])[0]?.count || 0),
        newListingsToday: Number((queries[7][0] as any[])[0]?.count || 0),
    };
}

export default async function AdminDashboardPage() {
    const session = await getServerSession(authOptions);
    if (!session) redirect("/login");
    if ((session.user as any).role !== "admin") redirect("/");

    const stats = await getStats();

    const STAT_CARDS = [
        {
            label: "Utilizadores",
            value: stats.totalUsers.toLocaleString(),
            sub: `+${stats.newUsersToday} hoje`,
            icon: Users,
            color: "bg-blue-100/10 text-blue-400",
        },
        {
            label: "Anúncios ativos",
            value: stats.activeListings.toLocaleString(),
            sub: `${stats.totalListings} total · +${stats.newListingsToday} hoje`,
            icon: Package,
            color: "bg-purple-100/10 text-purple-400",
        },
        {
            label: "Receita total",
            value: stats.totalRevenue.toLocaleString("pt-PT", {
                style: "currency",
                currency: "EUR",
            }),
            sub: `${stats.totalOrders} vendas concluídas`,
            icon: DollarSign,
            color: "bg-emerald-100/10 text-emerald-400",
        },
        {
            label: "Mensagens",
            value: stats.totalMessages.toLocaleString(),
            sub: "em todo o marketplace",
            icon: MessageCircle,
            color: "bg-amber-100/10 text-amber-400",
        },
    ];

    return (
        <div>
            {/* Header */}
            <div className="mb-10">
                <h1 className="text-4xl md:text-5xl font-black tracking-tighter mb-2">
                    Visão geral
                </h1>
                <p className="text-slate-light font-bold">
                    Painel de administração da SecondAvenue.
                </p>
            </div>

            {/* Stat Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                {STAT_CARDS.map((stat) => {
                    const Icon = stat.icon;
                    return (
                        <div
                            key={stat.label}
                            className="clay-card p-6 group overflow-hidden relative"
                        >
                            <div className="relative z-10 space-y-2">
                                <div
                                    className={`h-10 w-10 rounded-xl flex items-center justify-center ${stat.color} mb-3`}
                                >
                                    <Icon className="w-5 h-5" />
                                </div>
                                <p className="text-3xl font-black text-off-white tracking-tighter">
                                    {stat.value}
                                </p>
                                <p className="text-sm font-bold text-slate-light">
                                    {stat.label}
                                </p>
                                <p className="text-xs font-bold text-slate-lighter/60">
                                    {stat.sub}
                                </p>
                            </div>
                            <div className="absolute top-0 right-0 w-24 h-24 bg-periwinkle/5 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700" />
                        </div>
                    );
                })}
            </div>

            {/* Quick Actions & Recent Activity */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                {/* Recent Users */}
                <div className="lg:col-span-7 clay-card p-8">
                    <h2 className="text-xl font-black mb-6 tracking-tight flex items-center gap-3">
                        <Users className="w-5 h-5 text-periwinkle" />
                        Últimos utilizadores
                    </h2>
                    <RecentUsers />
                </div>

                {/* Quick Actions */}
                <div className="lg:col-span-5 clay-card p-8">
                    <h2 className="text-xl font-black mb-6 tracking-tight flex items-center gap-3">
                        <TrendingUp className="w-5 h-5 text-periwinkle" />
                        Ações rápidas
                    </h2>
                    <div className="space-y-3">
                        <a
                            href="/admin/users"
                            className="flex items-center gap-4 p-4 bg-hover-bg rounded-2xl hover:bg-periwinkle/10 transition-all group"
                        >
                            <Users className="w-5 h-5 text-slate-light group-hover:text-periwinkle transition-colors" />
                            <div>
                                <p className="font-bold text-sm text-off-white">
                                    Gerir utilizadores
                                </p>
                                <p className="text-xs font-bold text-slate-light">
                                    Verificar, promover, moderar
                                </p>
                            </div>
                        </a>
                        <a
                            href="/admin/listings"
                            className="flex items-center gap-4 p-4 bg-hover-bg rounded-2xl hover:bg-periwinkle/10 transition-all group"
                        >
                            <Package className="w-5 h-5 text-slate-light group-hover:text-periwinkle transition-colors" />
                            <div>
                                <p className="font-bold text-sm text-off-white">
                                    Moderar anúncios
                                </p>
                                <p className="text-xs font-bold text-slate-light">
                                    Arquivar, destacar, ver detalhes
                                </p>
                            </div>
                        </a>
                        <a
                            href="/"
                            className="flex items-center gap-4 p-4 bg-hover-bg rounded-2xl hover:bg-periwinkle/10 transition-all group"
                        >
                            <ShoppingBag className="w-5 h-5 text-slate-light group-hover:text-periwinkle transition-colors" />
                            <div>
                                <p className="font-bold text-sm text-off-white">
                                    Ver loja ao vivo
                                </p>
                                <p className="text-xs font-bold text-slate-light">
                                    Como os utilizadores veem o site
                                </p>
                            </div>
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
}

async function RecentUsers() {
    const [rows] = await pool.query(
        `SELECT id, name, email, role, is_verified, 
                DATE_FORMAT(created_at, '%Y-%m-%dT%H:%i:%s') AS created_at
         FROM users 
         ORDER BY created_at DESC 
         LIMIT 8`
    );
    const users = rows as any[];

    if (users.length === 0) {
        return (
            <div className="text-center py-8 text-slate-light">
                <p className="font-bold">Nenhum utilizador registado</p>
            </div>
        );
    }

    return (
        <div className="space-y-3">
            {users.map((u: any) => (
                <div
                    key={u.id}
                    className="flex items-center justify-between p-3 bg-hover-bg rounded-2xl hover:bg-periwinkle/5 transition-all"
                >
                    <div className="flex items-center gap-3 min-w-0">
                        <div className="w-9 h-9 rounded-full bg-periwinkle/20 flex items-center justify-center text-xs font-black text-periwinkle flex-shrink-0">
                            {u.name?.[0]?.toUpperCase() || "?"}
                        </div>
                        <div className="min-w-0">
                            <p className="font-bold text-sm text-off-white truncate">
                                {u.name}
                                {u.is_verified ? (
                                    <span className="ml-1.5 text-[10px] text-emerald-400">
                                        ✓
                                    </span>
                                ) : null}
                            </p>
                            <p className="text-xs font-bold text-slate-light truncate">
                                {u.email}
                            </p>
                        </div>
                    </div>
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
                </div>
            ))}
        </div>
    );
}
