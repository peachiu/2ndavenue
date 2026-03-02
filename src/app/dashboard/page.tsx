import { Plus, Package, DollarSign, Users, ArrowUp } from "lucide-react";
import Link from "next/link";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";

const STATS = [
    { label: 'revenue', value: '$8,420', icon: DollarSign, color: 'bg-emerald-100/50 text-emerald-600' },
    { label: 'active listings', value: '12', icon: Package, color: 'bg-periwinkle/10 text-periwinkle' },
    { label: 'followers', value: '1,208', icon: Users, color: 'bg-amber-100/50 text-amber-600' },
];

export default async function DashboardPage() {
    const session = await getServerSession(authOptions);

    if (!session) {
        redirect("/login");
    }

    const { user } = session;

    return (
        <main className="min-h-screen pb-20 pt-8 bg-off-white">
            <div className="max-w-7xl mx-auto px-4 md:px-8">
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
                    <div className="flex items-center gap-6 text-center md:text-left flex-col md:flex-row">
                        <div className="w-24 h-24 rounded-full bg-periwinkle/10 border-4 border-white shadow-xl overflow-hidden flex-shrink-0">
                            {user?.image ? (
                                <img src={user.image} alt={user.name || ""} className="w-full h-full object-cover" />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center bg-periwinkle/5 text-periwinkle text-3xl font-black lowercase">
                                    {user?.name?.[0] || 'a'}
                                </div>
                            )}
                        </div>
                        <div>
                            <h1 className="text-5xl md:text-6xl font-black lowercase tracking-tighter mb-2">
                                hello, <span className="text-periwinkle">{user?.name?.split(' ')[0] || 'stranger'}</span>
                            </h1>
                            <p className="text-slate-500 font-medium lowercase">manage your kingdom and creations.</p>
                        </div>
                    </div>
                    <Link href="/create-listing">
                        <button className="clay-btn px-8 py-4 flex items-center gap-2 text-lg">
                            <Plus className="w-6 h-6" />
                            new listing
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
                                <p className="text-4xl font-black text-slate-900 tracking-tighter">{stat.value}</p>
                                <p className="font-bold text-slate-500 lowercase flex items-center gap-1">
                                    {stat.label}
                                    <span className="text-emerald-500 text-xs flex items-center bg-emerald-50 px-2 py-0.5 rounded-full">
                                        <ArrowUp className="w-3 h-3" /> 12%
                                    </span>
                                </p>
                            </div>
                            {/* Background blob */}
                            <div className="absolute top-0 right-0 w-32 h-32 bg-periwinkle/5 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700" />
                        </div>
                    ))}
                </div>

                {/* Bento Activity Sections */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                    <div className="lg:col-span-8 clay-card p-10 h-[500px]">
                        <h2 className="text-2xl font-black lowercase mb-6 tracking-tight flex items-center gap-3">
                            active listings <span className="text-xs bg-periwinkle/10 text-periwinkle px-3 py-1 rounded-full">12</span>
                        </h2>
                        <div className="space-y-4 overflow-y-auto h-[380px] pr-4 custom-scrollbar">
                            {[1, 2, 3, 4, 5].map((i) => (
                                <div key={i} className="flex items-center justify-between p-4 bg-off-white/50 rounded-3xl border-2 border-transparent hover:border-slate-100 transition-all cursor-pointer group">
                                    <div className="flex items-center gap-4">
                                        <div className="h-16 w-16 bg-slate-200 rounded-2xl shadow-inner" />
                                        <div>
                                            <p className="font-bold text-slate-800 lowercase">Premium Silk Shirt {i}</p>
                                            <p className="text-sm font-medium text-slate-500">$45.00 • 3 offers</p>
                                        </div>
                                    </div>
                                    <button className="p-3 bg-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-sm">
                                        <Plus className="w-5 h-5 rotate-45 text-slate-400" />
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="lg:col-span-4 clay-card p-10 h-[500px] flex flex-col">
                        <h2 className="text-2xl font-black lowercase mb-6 tracking-tight">recent activity</h2>
                        <div className="flex-1 space-y-8">
                            {[
                                { text: 'sold "vintage levi\'s"', time: '2m ago', type: 'sale' },
                                { text: 'new offer on "vase"', time: '1h ago', type: 'offer' },
                                { text: 'followed by @artdeco', time: '3h ago', type: 'follow' },
                                { text: 'listing "tote" expired', time: '1d ago', type: 'system' }
                            ].map((act, i) => (
                                <div key={i} className="flex gap-4 items-start">
                                    <div className="w-1.5 h-1.5 rounded-full bg-periwinkle mt-2" />
                                    <div>
                                        <p className="font-bold text-sm text-slate-800 lowercase leading-tight">{act.text}</p>
                                        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">{act.time}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <button className="w-full py-4 text-sm font-bold text-slate-500 lowercase hover:text-periwinkle transition-colors">
                            view history ↘
                        </button>
                    </div>
                </div>
            </div>
        </main>
    );
}
