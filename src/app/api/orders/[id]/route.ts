import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import pool from "@/lib/db";

export async function GET(
    _request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const session = await getServerSession(authOptions);
        if (!session) {
            return NextResponse.json({ error: "Não autenticado" }, { status: 401 });
        }

        const userId = (session.user as any).id;
        const { id } = await params;

        // Fetch order
        const [orders] = await pool.query(
            "SELECT * FROM orders WHERE id = ? AND buyer_id = ?",
            [Number(id), userId]
        );
        const order = (orders as any[])[0];

        if (!order) {
            return NextResponse.json({ error: "Encomenda não encontrada" }, { status: 404 });
        }

        // Fetch order items with listing details
        const [items] = await pool.query(
            `SELECT oi.listing_id, oi.price, oi.quantity, oi.currency,
                    l.title,
                    (SELECT li.url FROM listing_images li WHERE li.listing_id = l.id ORDER BY li.sort_order LIMIT 1) AS image_url
             FROM order_items oi
             JOIN listings l ON l.id = oi.listing_id
             WHERE oi.order_id = ?`,
            [Number(id)]
        );

        return NextResponse.json({
            ...order,
            items,
        });

    } catch (error: any) {
        console.error("Order fetch error:", error);
        return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 });
    }
}
