import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import { User, Mail, Shield, Calendar, MapPin, Camera } from "lucide-react";
import pool from "@/lib/db";

export default async function ProfilePage() {
    const session = await getServerSession(authOptions);

    if (!session) {
        redirect("/login");
    }

    // Fetch full user data from DB
    const [rows] = await pool.query(
        'SELECT id, name, email, image, role, location, is_verified, created_at FROM users WHERE email = ?',
        [session.user?.email]
    );
    const dbUser = (rows as any[])[0];

    // Fetch follow stats
    const [followersRows] = await pool.query(
        `SELECT u.id, u.name, u.image,
                (SELECT COUNT(*) FROM follows f2 WHERE f2.follower_id = u.id AND f2.following_id = ?) AS follows_back
         FROM follows f
         JOIN users u ON f.follower_id = u.id
         WHERE f.following_id = ?
         ORDER BY f.created_at DESC`,
        [dbUser?.id, dbUser?.id]
    );
    const followers = followersRows as any[];

    const [followingRows] = await pool.query(
        `SELECT u.id, u.name, u.image,
                (SELECT COUNT(*) FROM follows f2 WHERE f2.follower_id = ? AND f2.following_id = u.id) AS follows_back
         FROM follows f
         JOIN users u ON f.following_id = u.id
         WHERE f.follower_id = ?
         ORDER BY f.created_at DESC`,
        [dbUser?.id, dbUser?.id]
    );
    const following = followingRows as any[];

    // Friends = mutual follows
    const friendIds = followers
        .filter(f => (f as any).follows_back > 0)
        .map(f => (f as any).id);
    const friends = followers.filter(f => friendIds.includes((f as any).id));

    if (!dbUser) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-charcoal">
                <p className="text-slate-light font-bold lowercase italic">perfil não encontrado na base de dados.</p>
            </div>
        );
    }

    return (
        <main className="min-h-screen pb-20 pt-8 bg-charcoal select-none">
            <div className="max-w-4xl mx-auto px-4 md:px-8">
                <div className="clay-card overflow-hidden">
                    {/* Cover / Header Area */}
                    <div className="h-48 bg-periwinkle/10 relative">
                        <div className="absolute -bottom-16 left-10">
                            <div className="w-32 h-32 rounded-full border-8 border-slate-700 bg-card-bg shadow-2xl overflow-hidden relative group">
                                {dbUser.image ? (
                                    <img src={dbUser.image} alt={dbUser.name} className="w-full h-full object-cover" />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center bg-periwinkle/5 text-periwinkle text-4xl font-black">
                                        {dbUser.name?.[0] || 'u'}
                                    </div>
                                )}
                                <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer">
                                    <Camera className="w-8 h-8 text-white" />
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="pt-20 pb-10 px-10">
                        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
                            <div>
                                <h1 className="text-4xl font-black tracking-tighter mb-1">
                                    {dbUser.name}
                                </h1>
                                <p className="text-slate-light font-medium">
                                    {dbUser.role === 'professional' ? 'Profissional' : 'Comunidade'} • membro desde {new Date(dbUser.created_at).toLocaleDateString("pt-PT")}
                                </p>
                            </div>
                            <button className="clay-btn px-8 py-3 lowercase">editar perfil</button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="space-y-6">
                                <h3 className="text-lg font-black lowercase tracking-tight">detalhes pessoais</h3>
                                <div className="space-y-4">
                                    <div className="flex items-center gap-4 text-slate-light">
                                        <div className="w-10 h-10 rounded-2xl bg-card-bg border border-slate-700 flex items-center justify-center shadow-sm">
                                            <Mail className="w-5 h-5 text-periwinkle" />
                                        </div>
                                        <div>
                                            <p className="text-xs font-bold text-slate-lighter uppercase tracking-widest">email</p>
                                            <p className="font-bold">{dbUser.email}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-4 text-slate-light">
                                        <div className="w-10 h-10 rounded-2xl bg-card-bg border border-slate-700 flex items-center justify-center shadow-sm">
                                            <MapPin className="w-5 h-5 text-periwinkle" />
                                        </div>
                                        <div>
                                            <p className="text-xs font-bold text-slate-lighter uppercase tracking-widest">localização</p>
                                            <p className="font-bold">{dbUser.location || 'não definido'}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-6">
                                <h3 className="text-lg font-black lowercase tracking-tight">estado da conta</h3>
                                <div className="space-y-4">
                                    <div className="flex items-center gap-4 text-slate-light">
                                        <div className="w-10 h-10 rounded-2xl bg-card-bg border border-slate-700 flex items-center justify-center shadow-sm">
                                            <Shield className="w-5 h-5 text-emerald-500" />
                                        </div>
                                        <div>
                                            <p className="text-xs font-bold text-slate-lighter uppercase tracking-widest">verificação</p>
                                            <p className="font-bold">
                                                {dbUser.is_verified ? 'conta verificada' : 'membro da comunidade'}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-4 text-slate-light">
                                        <div className="w-10 h-10 rounded-2xl bg-card-bg border border-slate-700 flex items-center justify-center shadow-sm">
                                            <Calendar className="w-5 h-5 text-slate-lighter" />
                                        </div>
                                        <div>
                                            <p className="text-xs font-bold text-slate-lighter uppercase tracking-widest">id</p>
                                            <p className="font-bold">#00{dbUser.id}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Followers / Following / Friends */}
                        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
                            {/* Seguidores */}
                            <div className="clay-card p-6">
                                <h3 className="text-sm font-black uppercase tracking-widest text-slate-lighter mb-4">
                                    seguidores <span className="text-periwinkle">({followers.length})</span>
                                </h3>
                                {followers.length === 0 ? (
                                    <p className="text-sm text-slate-light italic lowercase">ainda sem seguidores</p>
                                ) : (
                                    <div className="space-y-3">
                                        {followers.map((f: any) => (
                                            <div key={f.id} className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-full bg-hover-bg flex items-center justify-center overflow-hidden text-xs font-bold text-slate-lighter flex-shrink-0">
                                                    {f.image ? (
                                                        <img src={f.image} alt={f.name} className="w-full h-full object-cover" draggable={false} />
                                                    ) : (
                                                        f.name?.[0] || 'u'
                                                    )}
                                                </div>
                                                <span className="text-sm font-bold text-off-white truncate">
                                                    {f.name}
                                                    {friendIds.includes(f.id) && (
                                                        <span className="text-periwinkle text-xs ml-1.5">⭐ amigo</span>
                                                    )}
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {/* A seguir */}
                            <div className="clay-card p-6">
                                <h3 className="text-sm font-black uppercase tracking-widest text-slate-lighter mb-4">
                                    a seguir <span className="text-periwinkle">({following.length})</span>
                                </h3>
                                {following.length === 0 ? (
                                    <p className="text-sm text-slate-light italic lowercase">não segues ninguém</p>
                                ) : (
                                    <div className="space-y-3">
                                        {following.map((f: any) => (
                                            <div key={f.id} className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-full bg-hover-bg flex items-center justify-center overflow-hidden text-xs font-bold text-slate-lighter flex-shrink-0">
                                                    {f.image ? (
                                                        <img src={f.image} alt={f.name} className="w-full h-full object-cover" draggable={false} />
                                                    ) : (
                                                        f.name?.[0] || 'u'
                                                    )}
                                                </div>
                                                <span className="text-sm font-bold text-off-white truncate">
                                                    {f.name}
                                                    {(f as any).follows_back > 0 && (
                                                        <span className="text-periwinkle text-xs ml-1.5">⭐ amigo</span>
                                                    )}
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {/* Amigos (mutual) */}
                            <div className="clay-card p-6 border-periwinkle/30">
                                <h3 className="text-sm font-black uppercase tracking-widest text-periwinkle mb-4">
                                    amigos ⭐ <span className="text-slate-lighter">({friends.length})</span>
                                </h3>
                                {friends.length === 0 ? (
                                    <p className="text-sm text-slate-light italic lowercase">segue pessoas para fazer amigos</p>
                                ) : (
                                    <div className="space-y-3">
                                        {friends.map((f: any) => (
                                            <div key={f.id} className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-full bg-periwinkle/20 flex items-center justify-center overflow-hidden text-xs font-bold text-periwinkle flex-shrink-0">
                                                    {f.image ? (
                                                        <img src={f.image} alt={f.name} className="w-full h-full object-cover" draggable={false} />
                                                    ) : (
                                                        f.name?.[0] || 'u'
                                                    )}
                                                </div>
                                                <span className="text-sm font-bold text-off-white truncate">{f.name}</span>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="mt-12 p-6 bg-periwinkle/5 rounded-3xl border-2 border-dashed border-periwinkle/20">
                            <p className="text-center text-sm font-medium text-slate-light lowercase italic">
                                os teus dados estão seguros e sincronizados entre a tua conta google e a nossa base de dados.
                                qualquer alteração ao teu nome ou foto de perfil no google irá atualizar automaticamente aqui.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}
