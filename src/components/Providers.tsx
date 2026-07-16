"use client";

import { useEffect, useState } from "react";
import { SessionProvider } from "next-auth/react";
import { CurrencyProvider } from "@/context/CurrencyContext";
import { CartProvider } from "@/context/CartContext";
import CartSidePanel from "@/components/CartSidePanel";
import Toast from "@/components/Toast";

export function Providers({ children }: { children: React.ReactNode }) {
    const [toastMsg, setToastMsg] = useState<string | null>(null);

    // Check for pending toast after redirect (e.g. after Google OAuth)
    useEffect(() => {
        const pending = sessionStorage.getItem("toast");
        if (pending) {
            sessionStorage.removeItem("toast");
            setToastMsg(pending);
        }
    }, []);

    return (
        <SessionProvider>
            <CurrencyProvider>
                <CartProvider>
                    {children}
                    <CartSidePanel />
                </CartProvider>
                <Toast
                    message={toastMsg || ""}
                    visible={!!toastMsg}
                    onClose={() => setToastMsg(null)}
                />
            </CurrencyProvider>
        </SessionProvider>
    );
}
