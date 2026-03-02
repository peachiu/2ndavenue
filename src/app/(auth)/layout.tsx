"use client";

import Link from "next/link";
import { useTranslation } from "@/context/TranslationContext";

export default function AuthLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const { t } = useTranslation();

    return (
        <div className="min-h-screen grid lg:grid-cols-2">
            <div className="hidden lg:flex bg-periwinkle flex-col justify-center p-12 relative overflow-hidden">
                <div className="absolute top-12 left-12 h-16 w-16 bg-off-white rounded-full flex items-center justify-center shadow-inner text-periwinkle font-black text-4xl leading-none pb-[4px]">
                    s
                </div>

                <div className="relative z-10 text-white">
                    <h2 className="text-7xl font-black lowercase tracking-tighter mb-6">
                        {t("auth.join").split(".")[0]} <br /> <span className="opacity-50">aesthetic</span> <br /> chaos.
                    </h2>
                    <p className="text-xl font-medium max-w-md opacity-80">
                        {t("auth.join_sub")}
                    </p>
                </div>

                <div className="absolute bottom-[-100px] right-[-100px] w-[500px] h-[500px] bg-white/20 rounded-full blur-3xl opacity-50"></div>
                <div className="absolute top-[-50px] left-[200px] w-[300px] h-[300px] bg-white/10 rounded-full blur-2xl opacity-50"></div>
            </div>

            <div className="flex flex-col justify-center items-center p-6 md:p-12 bg-off-white">
                <div className="w-full max-w-md">
                    {children}
                </div>

                <div className="mt-12 text-center lg:hidden">
                    <Link href="/" className="flex items-center gap-3 justify-center">
                        <div className="h-10 w-10 bg-periwinkle rounded-full flex items-center justify-center shadow-inner text-off-white font-black text-2xl leading-none pb-1">s</div>
                        <span className="text-xl font-black tracking-tight text-slate-800 lowercase">
                            secondavenue
                        </span>
                    </Link>
                </div>
            </div>
        </div>
    );
}
