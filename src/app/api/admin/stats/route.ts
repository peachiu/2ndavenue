import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import pool from "@/lib/db";

export async function GET() {
    try {
        const session = await getServerSession(authOptions);
        if (!session || (session.user as any).role !== "admin") {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const queries = await Promise.all([
            pool.query("SELECT COUNT(*) AS count FROM users"),
            pool.query("SELECT COUNT(*) AS count FROM listings"),
            pool.query("SELECT COUNT(*) AS count FROM listings WHERE status = 'active'"),
            pool.query("SELECT COUNT(*) AS count FROM orders"),
            pool.query(
                "SELECT COALESCE(SUM(total), 0) AS total FROM orders WHERE status NOT IN ('cancelled', 'refunded')"
            ),
            pool.query("SELECT COUNT(*) AS count FROM messages"),
            pool.query("SELECT COUNT(*) AS count FROM users WHERE DATE(created_at) = CURDATE()"),
            pool.query(
                "SELECT COUNT(*) AS count FROM listings WHERE DATE(created_at) = CURDATE()"
            ),
        ]);

        return NextResponse.json({
            totalUsers: Number((queries[0][0] as any[])[0]?.count || 0),
            totalListings: Number((queries[1][0] as any[])[0]?.count || 0),
            activeListings: Number((queries[2][0] as any[])[0]?.count || 0),
            totalOrders: Number((queries[3][0] as any[])[0]?.count || 0),
            totalRevenue: Number((queries[4][0] as any[])[0]?.total || 0),
            totalMessages: Number((queries[5][0] as any[])[0]?.count || 0),
            newUsersToday: Number((queries[6][0] as any[])[0]?.count || 0),
            newListingsToday: Number((queries[7][0] as any[])[0]?.count || 0),
        });
    } catch (error) {
        console.error("Admin stats error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
