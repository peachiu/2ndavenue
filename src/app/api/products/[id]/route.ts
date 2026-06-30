import { NextResponse } from "next/server";
import pool from "@/lib/db";

export async function GET(
    _request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params;
    try {

        const [rows] = await pool.query(
            `SELECT 
                l.id, l.title, l.description, l.price, l.currency,
                l.condition_rating, l.status, l.created_at,
                l.stock, l.views,
                c.name_pt AS category_name,
                c.slug AS category_slug,
                u.id AS seller_id,
                u.name AS seller_name,
                u.image AS seller_image
             FROM listings l
             LEFT JOIN categories c ON l.category_id = c.id
             LEFT JOIN users u ON l.user_id = u.id
             WHERE l.id = ?
             LIMIT 1`,
            [id]
        );

        const product = (rows as any[])[0];

        if (!product) {
            return NextResponse.json(
                { error: "Produto não encontrado" },
                { status: 404 }
            );
        }

        // Fetch images
        const [images] = await pool.query(
            "SELECT url FROM listing_images WHERE listing_id = ? ORDER BY sort_order",
            [id]
        );

        // Fetch tags (if tags table exists) — or return empty array
        let tags: string[] = [];

        return NextResponse.json({
            ...product,
            images: (images as any[]).map((img) => img.url),
            tags,
        });
    } catch (error) {
        console.error("Product API error:", error);
        return NextResponse.json(
            { error: "Internal Server Error" },
            { status: 500 }
        );
    }
}
