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
    title: "secondavenue | curated chaos",
    description: "a marketplace for the aesthetically inclined.",
    icons: {
        icon: "/icon.png",
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
                className={`${outfit.variable} font-sans bg-off-white text-slate-800 antialiased selection:bg-periwinkle selection:text-white`}
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
