"use client";

import { useEffect, useState } from "react";
import { SessionProvider, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { CurrencyProvider } from "@/context/CurrencyContext";
import { CartProvider } from "@/context/CartContext";
import CartSidePanel from "@/components/CartSidePanel";
import Toast from "@/components/Toast";

function OnboardingGuard({ children }: { children: React.ReactNode }) {
    const { data: session, status } = useSession();
    const router = useRouter();
    const [checked, setChecked] = useState(false);

    useEffect(() => {
        if (status === "loading" || checked) return;
        if (!session?.user) {
            setChecked(true);
            return;
        }

        // Skip if already on the setup page
        if (window.location.pathname.startsWith("/setup")) {
            setChecked(true);
            return;
        }

        fetch("/api/setup")
            .then((r) => r.json())
            .then((data) => {
                if (!data.onboarded) {
                    router.push("/setup");
                }
                setChecked(true);
            })
            .catch(() => setChecked(true));
    }, [session, status, router, checked]);

    return <>{children}</>;
}

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
                    <OnboardingGuard>
                        {children}
                    </OnboardingGuard>
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
