"use client";

import { SessionProvider } from "next-auth/react";
import { TranslationProvider } from "@/context/TranslationContext";
import { CurrencyProvider } from "@/context/CurrencyContext";

export function Providers({ children }: { children: React.ReactNode }) {
    return (
        <SessionProvider>
            <TranslationProvider>
                <CurrencyProvider>
                    {children}
                </CurrencyProvider>
            </TranslationProvider>
        </SessionProvider>
    );
}
