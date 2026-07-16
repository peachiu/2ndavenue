import type { Metadata } from "next";
import { Manrope } from "next/font/google";
import "./globals.css";

import Footer from "@/components/Footer";
import TopNavbar from "@/components/TopNavbar";
import MobileDock from "@/components/MobileDock";
import CookieConsent from "@/components/CookieConsent";
import { Providers } from "@/components/Providers";

const manrope = Manrope({
    subsets: ["latin"],
    variable: "--font-manrope",
    weight: ["400", "500", "700", "800"],
});

export const metadata: Metadata = {
    title: "SecondAvenue - A tua avenida favorita.",
    description: "a marketplace for the aesthetically inclined.",
    icons: {
        icon: [
            {
                url: "/logo.png",
                type: "image/png",
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
                className={`${manrope.variable} font-sans bg-charcoal text-off-white antialiased selection:bg-periwinkle selection:text-charcoal select-none`}
            >
                <Providers>
                    <div className="flex flex-col min-h-screen">
                        <TopNavbar />
                        <main className="flex-grow pt-20">
                            {children}
                        </main>
                        <MobileDock />
                        <CookieConsent />
                        <Footer />
                    </div>
                </Providers>
            </body>
        </html>
    );
}
