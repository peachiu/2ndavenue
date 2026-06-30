"use client";

import Link from "next/link";

export default function AuthLayout({
    children,
}: {
    children: React.ReactNode;
}) {

    return (
        <div className="min-h-screen grid lg:grid-cols-2">
            <div className="hidden lg:flex bg-periwinkle flex-col justify-center p-12 relative overflow-hidden">
                <div className="absolute top-12 left-12 h-16 w-16 bg-charcoal rounded-full flex items-center justify-center shadow-inner">
                    <span className="text-periwinkle font-black text-4xl leading-[0] -translate-y-1">s</span>
                </div>

                <div className="relative z-10 text-charcoal">
                    <h2 className="text-7xl font-black tracking-tighter mb-6">
                        A avenida que tem tudo para ti. <br /> <span className="opacity-50">pronto?</span> <br /> vamos começar.
                    </h2>
                    <p className="text-xl font-medium max-w-md opacity-80">
                        Cria uma conta e começa a vender as tuas peças ou descobre o teu próximo must-have.
                    </p>
                </div>

                <div className="absolute bottom-[-100px] right-[-100px] w-[500px] h-[500px] bg-charcoal/20 rounded-full blur-3xl opacity-50"></div>
                <div className="absolute top-[-50px] left-[200px] w-[300px] h-[300px] bg-charcoal/10 rounded-full blur-2xl opacity-50"></div>
            </div>

            <div className="flex flex-col justify-center items-center p-6 md:p-12 bg-charcoal">
                <div className="w-full max-w-md">
                    {children}
                </div>

                <div className="mt-12 text-center lg:hidden">
                    <Link href="/" className="flex items-center gap-3 justify-center">
                        <div className="h-10 w-10 bg-periwinkle rounded-full flex items-center justify-center shadow-inner">
                            <span className="text-charcoal font-black text-2xl leading-[0] -translate-y-1">s</span>
                        </div>
                        <span className="text-xl font-black tracking-tight text-off-white lowercase">
                            SecondAvenue
                        </span>
                    </Link>
                </div>
            </div>
        </div>
    );
}
