import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import pool from "@/lib/db";

// GET /api/follows?user_id=X — check relationship with user X
// GET /api/follows?type=followers — list my followers
// GET /api/follows?type=following — list who I follow
export async function GET(request: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.id) {
            return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
        }

        const { searchParams } = new URL(request.url);
        const userId = searchParams.get("user_id");
        const type = searchParams.get("type");
        const userIdNum = session.user.id;

        // Check relationship with a specific user
        if (userId) {
            const [following] = await pool.query(
                "SELECT id FROM follows WHERE follower_id = ? AND following_id = ? LIMIT 1",
                [userIdNum, userId]
            );
            const [followedBy] = await pool.query(
                "SELECT id FROM follows WHERE follower_id = ? AND following_id = ? LIMIT 1",
                [userId, userIdNum]
            );

            const isFollowing = (following as any[]).length > 0;
            const isFollowedBy = (followedBy as any[]).length > 0;

            return NextResponse.json({
                isFollowing,
                isFollowedBy,
                isFriend: isFollowing && isFollowedBy,
            });
        }

        // List followers
        if (type === "followers") {
            const [rows] = await pool.query(
                `SELECT u.id, u.name, u.image, f.created_at
                 FROM follows f
                 JOIN users u ON f.follower_id = u.id
                 WHERE f.following_id = ?
                 ORDER BY f.created_at DESC`,
                [userIdNum]
            );
            return NextResponse.json(rows);
        }

        // List following
        if (type === "following") {
            const [rows] = await pool.query(
                `SELECT u.id, u.name, u.image, f.created_at
                 FROM follows f
                 JOIN users u ON f.following_id = u.id
                 WHERE f.follower_id = ?
                 ORDER BY f.created_at DESC`,
                [userIdNum]
            );
            return NextResponse.json(rows);
        }

        return NextResponse.json([]);
    } catch (error) {
        console.error("Follows API error:", error);
        return NextResponse.json({ error: "Erro interno" }, { status: 500 });
    }
}

// POST /api/follows — toggle follow
export async function POST(request: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.id) {
            return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
        }

        const { user_id } = await request.json();
        if (!user_id) {
            return NextResponse.json({ error: "user_id é obrigatório" }, { status: 400 });
        }

        if (Number(user_id) === Number(session.user.id)) {
            return NextResponse.json({ error: "Não podes seguir-te a ti próprio" }, { status: 400 });
        }

        // Check if already following
        const [existing] = await pool.query(
            "SELECT id FROM follows WHERE follower_id = ? AND following_id = ? LIMIT 1",
            [session.user.id, user_id]
        );

        if ((existing as any[]).length > 0) {
            // Unfollow
            await pool.query(
                "DELETE FROM follows WHERE follower_id = ? AND following_id = ?",
                [session.user.id, user_id]
            );
            return NextResponse.json({ following: false });
        }

        // Follow
        await pool.query(
            "INSERT INTO follows (follower_id, following_id) VALUES (?, ?)",
            [session.user.id, user_id]
        );
        return NextResponse.json({ following: true });
    } catch (error) {
        console.error("Follows API error:", error);
        return NextResponse.json({ error: "Erro interno" }, { status: 500 });
    }
}
