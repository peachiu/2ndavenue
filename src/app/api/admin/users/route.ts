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

        const { userId, action } = await request.json();

        if (!userId || !action) {
            return NextResponse.json(
                { error: "Missing userId or action" },
                { status: 400 }
            );
        }

        // Prevent self-modification for critical actions
        const currentUserId = (session.user as any).id;
        if (Number(userId) === Number(currentUserId) && action !== "toggleVerified") {
            return NextResponse.json(
                { error: "Não podes modificar a tua própria conta" },
                { status: 400 }
            );
        }

        switch (action) {
            case "toggleAdmin": {
                await pool.query(
                    "UPDATE users SET role = 'admin', updated_at = NOW() WHERE id = ?",
                    [userId]
                );
                break;
            }
            case "removeAdmin": {
                await pool.query(
                    "UPDATE users SET role = 'community', updated_at = NOW() WHERE id = ?",
                    [userId]
                );
                break;
            }
            case "toggleVerified": {
                // Get current is_verified value
                const [rows] = await pool.query(
                    "SELECT is_verified FROM users WHERE id = ?",
                    [userId]
                );
                const current = (rows as any[])[0]?.is_verified ? 1 : 0;
                await pool.query(
                    "UPDATE users SET is_verified = ?, updated_at = NOW() WHERE id = ?",
                    [current ? 0 : 1, userId]
                );
                break;
            }
            case "promotePro": {
                await pool.query(
                    "UPDATE users SET role = 'professional', updated_at = NOW() WHERE id = ?",
                    [userId]
                );
                break;
            }
            case "delete": {
                await pool.query("DELETE FROM users WHERE id = ? AND role != 'admin'", [
                    userId,
                ]);
                break;
            }
            default:
                return NextResponse.json({ error: "Unknown action" }, { status: 400 });
        }

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Admin users API error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
