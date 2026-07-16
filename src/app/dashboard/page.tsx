import { Plus, Package, DollarSign, Eye, ArrowUp } from "lucide-react";
import Link from "next/link";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import pool from "@/lib/db";

function timeAgo(date: Date): string {
    const seconds = Math.floor((Date.now() - new Date(date).getTime()) / 1000);
    if (seconds < 60) return "há " + seconds + "s";
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return "há " + minutes + "min";
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return "há " + hours + "h";
    const days = Math.floor(hours / 24);
    if (days < 30) return "há " + days + "d";
    return "há " + Math.floor(days / 30) + "m";
}

export default async function DashboardPage() {
    const session = await getServerSession(authOptions);

    if (!session) {
        redirect("/login");
    }

    const userId = (session.user as any).id;

    // Fetch user's listings stats
    const [statsRows] = await pool.query(
        `SELECT
            COUNT(*) AS total_listings,
            COALESCE(SUM(views), 0) AS total_views
         FROM listings WHERE user_id = ?`,
        [userId]
    );
    const stats = (statsRows as any[])[0];
    const totalListings = Number(stats?.total_listings || 0);
    const totalViews = Number(stats?.total_views || 0);

    // Fetch actual revenue from completed orders (user as seller)
    const [revenueRows] = await pool.query(
        `SELECT COALESCE(SUM(oi.price * oi.quantity), 0) AS total_revenue
         FROM order_items oi
         JOIN listings l ON l.id = oi.listing_id
         JOIN orders o ON o.id = oi.order_id
         WHERE l.user_id = ? AND o.status NOT IN ('cancelled', 'refunded')`,
        [userId]
    );
    const totalValue = Number((revenueRows as any[])[0]?.total_revenue || 0);

    // Fetch user's listings
    const [listingsRows] = await pool.query(
        `SELECT l.id, l.title, l.price, l.currency, l.views,
                (SELECT li.url FROM listing_images li WHERE li.listing_id = l.id ORDER BY li.sort_order LIMIT 1) AS image_url,
                DATE_FORMAT(l.created_at, '%Y-%m-%dT%H:%i:%s') AS created_at
         FROM listings l WHERE l.user_id = ? ORDER BY l.created_at DESC LIMIT 20`,
        [userId]
    );
    const listings = listingsRows as any[];

    // Fetch recent activity (listings created + messages received)
    const [activityRows] = await pool.query(
        `(SELECT 'listing' AS type, title AS text, created_at FROM listings WHERE user_id = ?)
         UNION ALL
         (SELECT 'message' AS type, content AS text, created_at FROM messages WHERE receiver_id = ?)
         ORDER BY created_at DESC LIMIT 10`,
        [userId, userId]
    );
    const activities = activityRows as any[];

    const STATS = [
        {
            label: 'Receita',
            value: totalValue.toLocaleString('pt-PT', { style: 'currency', currency: 'EUR' }),
            icon: DollarSign,
            color: 'bg-emerald-100/50 text-emerald-600',
        },
        {
            label: 'Peças ativas',
            value: String(totalListings),
            icon: Package,
            color: 'bg-periwinkle/10 text-periwinkle',
        },
        {
            label: 'Visualizações',
            value: totalViews.toLocaleString('pt-PT'),
            icon: Eye,
            color: 'bg-amber-100/50 text-amber-600',
        },
    ];

    return (
        <main className="min-h-screen pb-20 pt-8 bg-charcoal">
            <div className="max-w-7xl mx-auto px-4 md:px-8">
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
                    <div className="flex items-center gap-6 text-center md:text-left flex-col md:flex-row">
                        <div className="w-24 h-24 rounded-full bg-periwinkle/10 border-4 border-slate-700 shadow-xl overflow-hidden flex-shrink-0">
                            {session.user?.image ? (
                                <img src={session.user.image} alt={session.user.name || ""} className="w-full h-full object-cover" />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center bg-periwinkle/5 text-periwinkle text-3xl font-black">
                                    {session.user?.name?.[0] || 'a'}
                                </div>
                            )}
                        </div>
                        <div>
                            <h1 className="text-5xl md:text-6xl font-black tracking-tighter mb-2">
                                olá, <span className="text-periwinkle">{session.user?.name?.split(' ')[0] || 'estranho'}</span>
                            </h1>
                            <p className="text-slate-light font-medium">Gere o teu império e criações.</p>
                        </div>
                    </div>
                    <Link href="/create-listing">
                        <button className="clay-btn px-8 py-4 flex items-center gap-2 text-lg">
                            <Plus className="w-6 h-6" />
                            nova peça
                        </button>
                    </Link>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                    {STATS.map((stat) => (
                        <div key={stat.label} className="clay-card p-8 group overflow-hidden relative">
                            <div className="relative z-10 space-y-2">
                                <div className={`h-12 w-12 rounded-full flex items-center justify-center ${stat.color} mb-4`}>
                                    <stat.icon className="w-6 h-6" />
                                </div>
                                <p className="text-4xl font-black text-off-white tracking-tighter">{stat.value}</p>
                                <p className="font-bold text-slate-light flex items-center gap-1">
                                    {stat.label}
                                </p>
                            </div>
                            <div className="absolute top-0 right-0 w-32 h-32 bg-periwinkle/5 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700" />
                        </div>
                    ))}
                </div>

                {/* Bento Activity Sections */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                    <div className="lg:col-span-8 clay-card p-10 h-[500px]">
                        <h2 className="text-2xl font-black mb-6 tracking-tight flex items-center gap-3">
                            Peças ativas <span className="text-xs bg-periwinkle/10 text-periwinkle px-3 py-1 rounded-full">{totalListings}</span>
                        </h2>
                        <div className="space-y-4 overflow-y-auto h-[380px] pr-4 custom-scrollbar">
                            {listings.length === 0 ? (
                                <div className="flex flex-col items-center justify-center h-full text-slate-light">
                                    <Package className="w-12 h-12 mb-4 opacity-30" />
                                    <p className="font-bold">Ainda não tens peças ativas</p>
                                    <Link href="/create-listing" className="text-periwinkle font-bold text-sm mt-2 hover:underline">
                                        Publica a tua primeira peça →
                                    </Link>
                                </div>
                            ) : (
                                listings.map((listing: any) => (
                                    <Link
                                        key={listing.id}
                                        href={`/product/${listing.id}`}
                                        className="flex items-center justify-between p-4 bg-card-bg rounded-3xl border-2 border-transparent hover:border-slate-700 transition-all cursor-pointer group"
                                    >
                                        <div className="flex items-center gap-4">
                                            <div className="h-16 w-16 bg-hover-bg rounded-2xl shadow-inner overflow-hidden flex-shrink-0">
                                                {listing.image_url ? (
                                                    <img src={listing.image_url} alt={listing.title} className="w-full h-full object-cover" />
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center text-slate-lighter">
                                                        <Package className="w-6 h-6" />
                                                    </div>
                                                )}
                                            </div>
                                            <div>
                                                <p className="font-bold text-off-white">{listing.title}</p>
                                                <p className="text-sm font-medium text-slate-light">
                                                    {Number(listing.price).toLocaleString('pt-PT', { style: 'currency', currency: listing.currency || 'EUR' })} • {listing.views || 0} visualizações
                                                </p>
                                            </div>
                                        </div>
                                        <div className="p-3 bg-card-bg rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-sm">
                                            <Plus className="w-5 h-5 rotate-45 text-slate-lighter" />
                                        </div>
                                    </Link>
                                ))
                            )}
                        </div>
                    </div>

                    <div className="lg:col-span-4 clay-card p-10 h-[500px] flex flex-col">
                        <h2 className="text-2xl font-black mb-6 tracking-tight">Atividade recente</h2>
                        <div className="flex-1 space-y-8 overflow-y-auto custom-scrollbar">
                            {activities.length === 0 ? (
                                <div className="flex flex-col items-center justify-center h-full text-slate-light">
                                    <p className="font-bold text-sm">Nenhuma atividade ainda</p>
                                </div>
                            ) : (
                                activities.map((act: any, i: number) => (
                                    <div key={i} className="flex gap-4 items-start">
                                        <div className="w-1.5 h-1.5 rounded-full bg-periwinkle mt-2 flex-shrink-0" />
                                        <div className="min-w-0">
                                            <p className="font-bold text-sm text-off-white leading-tight truncate">
                                                {act.type === 'listing' ? `Publicaste "${act.text}"` : `Mensagem: "${act.text}"`}
                                            </p>
                                            <p className="text-xs font-bold text-slate-lighter uppercase tracking-widest mt-1">
                                                {timeAgo(new Date(act.created_at))}
                                            </p>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}
