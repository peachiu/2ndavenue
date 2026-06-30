"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Mail, Lock, LogIn, UserPlus } from "lucide-react";

export default function LoginPage() {
    const { data: session, status } = useSession();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [keepLoggedIn, setKeepLoggedIn] = useState(false);
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();

    // Redirect if already authenticated (after OAuth redirect back)
    useEffect(() => {
        if (status === "authenticated" && session?.user?.name) {
            sessionStorage.setItem("toast", `sessão iniciada como ${session.user.name}`);
            router.push("/");
            router.refresh();
        }
    }, [status, session, router]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setIsLoading(true);

        try {
            const res = await signIn("credentials", {
                email,
                password,
                remember: keepLoggedIn,
                redirect: false,
            });

            if (res?.error) {
                setError("algo correu mal");
            } else {
                router.push("/");
                router.refresh();
            }
        } catch (err) {
            setError("algo correu mal");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="space-y-8">
            <div className="text-center lg:text-left">
                <h1 className="text-5xl font-black tracking-tighter mb-2">Bem-vindo de volta</h1>
                <p className="text-slate-light font-medium">sentimos a tua falta e o teu bom gosto.</p>
            </div>

            <form onSubmit={handleSubmit} className="clay-card p-10 space-y-6">
                <div className="space-y-4">
                    <div className="space-y-1">
                        <label className="text-sm font-bold text-off-white ml-1 flex items-center gap-1.5">
                            <Mail className="w-3.5 h-3.5 text-periwinkle" />
                            Email
                        </label>
                        <input
                            type="email"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="oteu@email.com"
                            className="w-full bg-hover-bg px-5 py-4 rounded-3xl border-2 border-transparent focus:border-periwinkle focus:outline-none transition-all placeholder:text-slate-lighter font-medium text-off-white shadow-inner"
                        />
                    </div>
                    <div className="space-y-1">
                        <label className="text-sm font-bold text-off-white ml-1 flex items-center gap-1.5">
                            <Lock className="w-3.5 h-3.5 text-periwinkle" />
                            Palavra-passe
                        </label>
                        <input
                            type="password"
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="••••••••"
                            className="w-full bg-hover-bg px-5 py-4 rounded-3xl border-2 border-transparent focus:border-periwinkle focus:outline-none transition-all placeholder:text-slate-lighter font-medium text-off-white shadow-inner"
                        />
                    </div>
                </div>

                {error && (
                    <p className="text-red-500 text-xs font-bold lowercase italic ml-1">{error}</p>
                )}

                <div className="flex items-center justify-between px-1">
                    <label className="flex items-center gap-2 cursor-pointer group">
                        <div className="relative flex items-center justify-center">
                            <input
                                type="checkbox"
                                checked={keepLoggedIn}
                                onChange={(e) => setKeepLoggedIn(e.target.checked)}
                                className="peer sr-only"
                            />
                            <div className="w-5 h-5 border-2 border-slate-700 rounded-lg bg-hover-bg peer-checked:bg-periwinkle peer-checked:border-periwinkle transition-all shadow-sm group-hover:border-periwinkle/30" />
                            <svg className="absolute w-3 h-3 text-charcoal opacity-0 peer-checked:opacity-100 transition-opacity pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="4">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                            </svg>
                        </div>
                        <span className="text-xs font-bold text-slate-light group-hover:text-periwinkle transition-colors">Lembra-me</span>
                    </label>
                    <Link href="#" className="text-xs font-bold text-periwinkle hover:underline italic">Esqueceste a password?</Link>
                </div>

                <button
                    type="submit"
                    disabled={isLoading}
                    className="clay-btn w-full py-5 text-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                    {isLoading ? "A entrar..." : <><LogIn className="w-5 h-5" /> Entra</>}
                </button>

                <div className="relative py-2">
                    <div className="absolute inset-0 flex items-center gap-4">
                        <span className="w-full border-t border-slate-700" />
                        <span className="text-xs font-bold text-slate-lighter whitespace-nowrap">Ou continua com</span>
                        <span className="w-full border-t border-slate-700" />
                    </div>
                </div>

                <button
                    type="button"
                    onClick={() => signIn("google", { callbackUrl: "/" })}
                    className="w-full py-4 rounded-full border-2 border-slate-700 font-bold text-off-white hover:bg-hover-bg transition-colors flex items-center justify-center gap-3 bg-card-bg"
                >
                    <svg width="20" height="20" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                        <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                        <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05" />
                        <path d="M12 5.38c1.62 0 3.06.56 4.21 1.66l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                    </svg>
                    <span className="font-medium text-sm">Entra com a Conta Google</span>
                </button>
            </form>

            <p className="text-center text-slate-light font-medium">
                Não tens conta? <Link href="/register" className="text-periwinkle font-bold hover:underline inline-flex items-center gap-1"><UserPlus className="w-4 h-4" /> Cria uma</Link>
            </p>
        </div>
    );
}
