import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import Link from "next/link";
import pool from "@/lib/db";
import CreateListingForm from "./CreateListingForm";

async function getCategories(): Promise<{ id: number; name_pt: string; slug: string }[]> {
    try {
        const [rows] = await pool.query(
            "SELECT id, name_pt, slug FROM categories WHERE parent_id IS NULL ORDER BY sort_order"
        );
        return rows as any[];
    } catch {
        return [];
    }
}

export default async function CreateListingPage() {
    const session = await getServerSession(authOptions);

    if (!session) {
        redirect("/login");
    }

    const categories = await getCategories();

    return (
        <main className="min-h-screen pb-20 pt-8 bg-charcoal">
            <div className="max-w-4xl mx-auto px-4 md:px-8">
                <div className="mb-12">
                    <Link href="/dashboard" className="text-sm font-black text-slate-lighter hover:text-periwinkle flex items-center gap-1 mb-4">
                        ← Voltar ao estúdio
                    </Link>
                    <h1 className="text-5xl md:text-6xl font-black tracking-tighter">
                        Lista uma peça
                    </h1>
                </div>

                <div className="space-y-12 pb-20">
                    <CreateListingForm categories={categories} />
                </div>
            </div>
        </main>
    );
}
