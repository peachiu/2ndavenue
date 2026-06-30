import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import pool from "@/lib/db";

// GET /api/favorites?listing_id=X — check if user favorited a listing
// GET /api/favorites — list all user's favorites
export async function GET(request: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.id) {
            return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
        }

        const { searchParams } = new URL(request.url);
        const listingId = searchParams.get("listing_id");

        if (listingId) {
            const [rows] = await pool.query(
                "SELECT id FROM favorites WHERE user_id = ? AND listing_id = ? LIMIT 1",
                [session.user.id, listingId]
            );
            const isFavorited = (rows as any[]).length > 0;
            return NextResponse.json({ favorited: isFavorited });
        }

        // List all favorites with product details
        const [favorites] = await pool.query(
            `SELECT f.id, f.created_at,
                    l.id AS listing_id, l.title, l.price, l.currency,
                    l.condition_rating,
                    (SELECT li.url FROM listing_images li WHERE li.listing_id = l.id ORDER BY li.sort_order LIMIT 1) AS image_url
             FROM favorites f
             JOIN listings l ON f.listing_id = l.id
             WHERE f.user_id = ?
             ORDER BY f.created_at DESC`,
            [session.user.id]
        );

        return NextResponse.json(favorites);
    } catch (error) {
        console.error("Favorites API error:", error);
        return NextResponse.json({ error: "Erro interno" }, { status: 500 });
    }
}

// POST /api/favorites — toggle favorite
export async function POST(request: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.id) {
            return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
        }

        const { listing_id } = await request.json();
        if (!listing_id) {
            return NextResponse.json({ error: "listing_id é obrigatório" }, { status: 400 });
        }

        // Check if already favorited
        const [existing] = await pool.query(
            "SELECT id FROM favorites WHERE user_id = ? AND listing_id = ? LIMIT 1",
            [session.user.id, listing_id]
        );

        if ((existing as any[]).length > 0) {
            // Remove favorite
            await pool.query(
                "DELETE FROM favorites WHERE user_id = ? AND listing_id = ?",
                [session.user.id, listing_id]
            );
            return NextResponse.json({ favorited: false });
        }

        // Add favorite
        await pool.query(
            "INSERT INTO favorites (user_id, listing_id) VALUES (?, ?)",
            [session.user.id, listing_id]
        );
        return NextResponse.json({ favorited: true });
    } catch (error) {
        console.error("Favorites API error:", error);
        return NextResponse.json({ error: "Erro interno" }, { status: 500 });
    }
}
