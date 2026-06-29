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

    // Fetch full user data from DB to verify the link
    const [rows] = await pool.query(
        'SELECT id, name, email, image, role, location, is_verified, created_at FROM users WHERE email = ?',
        [session.user?.email]
    );
    const dbUser = (rows as any[])[0];

    if (!dbUser) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-charcoal">
                <p className="text-slate-light font-bold lowercase italic">perfil não encontrado na base de dados.</p>
            </div>
        );
    }

    return (
        <main className="min-h-screen pb-20 pt-8 bg-charcoal">
            <div className="max-w-4xl mx-auto px-4 md:px-8">
                <div className="clay-card overflow-hidden">
                    {/* Cover / Header Area */}
                    <div className="h-48 bg-periwinkle/10 relative">
                        <div className="absolute -bottom-16 left-10">
                            <div className="w-32 h-32 rounded-full border-8 border-slate-700 bg-card-bg shadow-2xl overflow-hidden relative group">
                                {dbUser.image ? (
                                    <img src={dbUser.image} alt={dbUser.name} className="w-full h-full object-cover" />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center bg-periwinkle/5 text-periwinkle text-4xl font-black lowercase">
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
                                <h1 className="text-4xl font-black lowercase tracking-tighter mb-1">
                                    {dbUser.name}
                                </h1>
                                <p className="text-slate-light font-medium lowercase">
                                    {dbUser.role} • membro desde {new Date(dbUser.created_at).toLocaleDateString()}
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
                                            <p className="font-bold lowercase">{dbUser.email}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-4 text-slate-light">
                                        <div className="w-10 h-10 rounded-2xl bg-card-bg border border-slate-700 flex items-center justify-center shadow-sm">
                                            <MapPin className="w-5 h-5 text-periwinkle" />
                                        </div>
                                        <div>
                                            <p className="text-xs font-bold text-slate-lighter uppercase tracking-widest">localização</p>
                                            <p className="font-bold lowercase">{dbUser.location || 'não definido'}</p>
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
                                            <p className="font-bold lowercase">
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
                                            <p className="font-bold lowercase">#00{dbUser.id}</p>
                                        </div>
                                    </div>
                                </div>
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
