import { NextResponse } from 'next/server';
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import pool from '@/lib/db';

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const search = searchParams.get("search")?.trim();
        const categoryId = searchParams.get("category_id");
        const sort = searchParams.get("sort") || "created_at";
        const order = searchParams.get("order") || "DESC";

        let sql = `SELECT l.*,
                          (SELECT li.url FROM listing_images li WHERE li.listing_id = l.id ORDER BY li.sort_order LIMIT 1) AS image_url
                   FROM listings l WHERE 1=1`;
        const params: any[] = [];

        // Search filter (title + description via FULLTEXT or LIKE)
        if (search) {
            // Try FULLTEXT first, fallback to LIKE
            sql += ` AND (MATCH(l.title, l.description) AGAINST(? IN BOOLEAN MODE)
                         OR l.title LIKE ? OR l.description LIKE ?)`;
            const searchTerm = `%${search}%`;
            params.push(`+${search}*`, searchTerm, searchTerm);
        }

        // Category filter
        if (categoryId) {
            sql += ` AND l.category_id = ?`;
            params.push(Number(categoryId));
        }

        // Validate sort column
        const allowedSorts = ["created_at", "price", "title", "views"];
        const safeSort = allowedSorts.includes(sort) ? sort : "created_at";
        const safeOrder = order === "ASC" ? "ASC" : "DESC";
        sql += ` ORDER BY l.${safeSort} ${safeOrder}`;

        const [rows] = await pool.query(sql, params);
        return NextResponse.json(rows);
    } catch (error) {
        console.error('Database error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session) {
            return NextResponse.json({ error: "Não autenticado" }, { status: 401 });
        }

        const userId = (session.user as any).id;
        const body = await request.json();

        const { title, description, price, currency, category_id, condition_rating, image_urls } = body;

        if (!title || !price || !category_id) {
            return NextResponse.json(
                { error: "Faltam campos obrigatórios (title, price, category_id)" },
                { status: 400 }
            );
        }

        // Insert the listing
        const [result] = await pool.query(
            `INSERT INTO listings (user_id, title, description, price, currency, category_id, condition_rating, status, created_at, updated_at)
             VALUES (?, ?, ?, ?, ?, ?, ?, 'active', NOW(), NOW())`,
            [
                userId,
                title,
                description || null,
                Number(price),
                currency || "EUR",
                Number(category_id),
                condition_rating || "Good",
            ]
        );

        const insertId = (result as any).insertId;

        // Insert images into listing_images if provided
        if (image_urls && Array.isArray(image_urls) && image_urls.length > 0) {
            const imageValues = image_urls.map((url: string, index: number) => [
                insertId,
                url,
                index === 0 ? 1 : 0, // first image is primary
                index,
            ]);
            await pool.query(
                "INSERT INTO listing_images (listing_id, url, is_primary, sort_order) VALUES ?",
                [imageValues]
            );
        }

        return NextResponse.json(
            { success: true, id: insertId, message: "Anúncio criado com sucesso!" },
            { status: 201 }
        );
    } catch (error) {
        console.error("Create listing error:", error);
        return NextResponse.json({ error: "Erro ao criar anúncio" }, { status: 500 });
    }
}
