import { NextResponse } from "next/server";
import pool from "@/lib/db";

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const parentId = searchParams.get("parent_id");

        let query;
        let params: any[] = [];

        if (parentId === "null" || parentId === "") {
            query = "SELECT * FROM categories WHERE parent_id IS NULL ORDER BY sort_order";
        } else if (parentId) {
            query = "SELECT * FROM categories WHERE parent_id = ? ORDER BY sort_order";
            params = [Number(parentId)];
        } else {
            // Return all categories, ordered hierarchically
            query = "SELECT * FROM categories ORDER BY COALESCE(parent_id, id), sort_order";
        }

        const [rows] = await pool.query(query, params);
        return NextResponse.json(rows);
    } catch (error) {
        console.error("Categories API error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
