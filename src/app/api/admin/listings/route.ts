import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import pool from "@/lib/db";

export async function PUT(request: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session || (session.user as any).role !== "admin") {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { listingId, action } = await request.json();

        if (!listingId || !action) {
            return NextResponse.json(
                { error: "Missing listingId or action" },
                { status: 400 }
            );
        }

        switch (action) {
            case "archive": {
                await pool.query(
                    "UPDATE listings SET status = 'archived', updated_at = NOW() WHERE id = ?",
                    [listingId]
                );
                break;
            }
            case "activate": {
                await pool.query(
                    "UPDATE listings SET status = 'active', updated_at = NOW() WHERE id = ?",
                    [listingId]
                );
                break;
            }
            case "markSold": {
                await pool.query(
                    "UPDATE listings SET status = 'sold', updated_at = NOW() WHERE id = ?",
                    [listingId]
                );
                break;
            }
            case "delete": {
                await pool.query("DELETE FROM listings WHERE id = ?", [listingId]);
                break;
            }
            default:
                return NextResponse.json({ error: "Unknown action" }, { status: 400 });
        }

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Admin listings API error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
