import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import "./globals.css";

import Footer from "@/components/Footer";
import TopNavbar from "@/components/TopNavbar";
import MobileDock from "@/components/MobileDock";
import { Providers } from "@/components/Providers";

const outfit = Outfit({
    subsets: ["latin"],
    variable: "--font-outfit",
    weight: ["400", "500", "700", "900"],
});

export const metadata: Metadata = {
    title: "SecondAvenue - A tua avenida favorita.",
    description: "a marketplace for the aesthetically inclined.",
    icons: {
        icon: [
            {
                url: `data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><rect width="64" height="64" rx="14" fill="%235170ff"/><text x="32" y="46" font-family="Inter,sans-serif" font-size="52" font-weight="900" fill="%23e5e5e5" text-anchor="middle">s</text></svg>`,
                type: "image/svg+xml",
            },
        ],
    },
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <body
                className={`${outfit.variable} font-sans bg-charcoal text-off-white antialiased selection:bg-periwinkle selection:text-charcoal select-none`}
            >
                <Providers>
                    <div className="flex flex-col min-h-screen">
                        <TopNavbar />
                        <main className="flex-grow pt-20">
                            {children}
                        </main>
                        <MobileDock />
                        <Footer />
                    </div>
                </Providers>
            </body>
        </html>
    );
}
