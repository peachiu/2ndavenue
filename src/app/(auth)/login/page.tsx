"use client";

import Link from "next/link";
import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [keepLoggedIn, setKeepLoggedIn] = useState(false);
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setIsLoading(true);

        try {
            const res = await signIn("credentials", {
                email,
                password,
                remember: keepLoggedIn, // Passing the checkbox state
                redirect: false,
            });

            if (res?.error) {
                setError("invalid email or password. please try again.");
            } else {
                router.push("/");
                router.refresh();
            }
        } catch (err) {
            setError("something went wrong. please try again later.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="space-y-8">
            <div className="text-center lg:text-left">
                <h1 className="text-5xl font-black lowercase tracking-tighter mb-2">welcome back</h1>
                <p className="text-slate-500 font-medium">we missed you and your taste.</p>
            </div>

            <form onSubmit={handleSubmit} className="clay-card p-10 space-y-6">
                <div className="space-y-4">
                    <div className="space-y-1">
                        <label className="text-sm font-bold text-slate-700 ml-1 lowercase">email</label>
                        <input
                            type="email"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="you@example.com"
                            className="w-full bg-off-white px-5 py-4 rounded-3xl border-2 border-transparent focus:border-periwinkle focus:outline-none transition-all placeholder:text-slate-400 font-medium text-slate-700 shadow-inner"
                        />
                    </div>
                    <div className="space-y-1">
                        <label className="text-sm font-bold text-slate-700 ml-1 lowercase">password</label>
                        <input
                            type="password"
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="••••••••"
                            className="w-full bg-off-white px-5 py-4 rounded-3xl border-2 border-transparent focus:border-periwinkle focus:outline-none transition-all placeholder:text-slate-400 font-medium text-slate-700 shadow-inner"
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
                            <div className="w-5 h-5 border-2 border-slate-200 rounded-lg bg-white peer-checked:bg-periwinkle peer-checked:border-periwinkle transition-all shadow-sm group-hover:border-periwinkle/30" />
                            <svg className="absolute w-3 h-3 text-white opacity-0 peer-checked:opacity-100 transition-opacity pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="4">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                            </svg>
                        </div>
                        <span className="text-xs font-bold text-slate-500 lowercase group-hover:text-periwinkle transition-colors">keep me logged in</span>
                    </label>
                    <Link href="#" className="text-xs font-bold text-periwinkle hover:underline lowercase italic">forgot password?</Link>
                </div>

                <button
                    type="submit"
                    disabled={isLoading}
                    className="clay-btn w-full py-5 text-xl disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {isLoading ? "signing in..." : "sign in"}
                </button>

                <div className="relative py-2">
                    <div className="absolute inset-0 flex items-center gap-4">
                        <span className="w-full border-t border-slate-200" />
                        <span className="text-xs lowercase font-bold text-slate-400 whitespace-nowrap">or continue with</span>
                        <span className="w-full border-t border-slate-200" />
                    </div>
                </div>

                <button
                    type="button"
                    onClick={() => signIn("google")}
                    className="w-full py-4 rounded-full border-2 border-slate-100 font-bold text-slate-600 hover:bg-slate-50 transition-colors flex items-center justify-center gap-3 bg-white"
                >
                    <svg width="20" height="20" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                        <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                        <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05" />
                        <path d="M12 5.38c1.62 0 3.06.56 4.21 1.66l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                    </svg>
                    <span className="font-medium text-sm">continue with google</span>
                </button>
            </form>

            <p className="text-center text-slate-500 font-medium lowercase">
                don&apos;t have an account? <Link href="/register" className="text-periwinkle font-bold hover:underline">sign up</Link>
            </p>
        </div>
    );
}
