import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import pool from "@/lib/db";

export async function GET() {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
        return NextResponse.json({ onboarded: true }, { status: 200 });
    }

    try {
        const [rows] = await pool.query(
            "SELECT onboarded FROM users WHERE email = ?",
            [session.user.email]
        );
        const user = (rows as any[])[0];
        return NextResponse.json({
            onboarded: user ? Boolean(user.onboarded) : true,
        });
    } catch (error) {
        console.error("Setup check error:", error);
        return NextResponse.json({ onboarded: true }, { status: 200 });
    }
}

export async function POST(req: Request) {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
        return NextResponse.json({ message: "Não autenticado" }, { status: 401 });
    }

    try {
        const body = await req.json();
        const { name, location, phone, cookieConsent } = body;

        const updates: string[] = [];
        const values: any[] = [];

        if (name !== undefined) {
            updates.push("name = ?");
            values.push(name);
        }
        if (location !== undefined) {
            updates.push("location = ?");
            values.push(location);
        }
        if (phone !== undefined) {
            updates.push("phone = ?");
            values.push(phone);
        }

        // Mark as onboarded
        updates.push("onboarded = 1");

        values.push(session.user.email);

        await pool.query(
            `UPDATE users SET ${updates.join(", ")} WHERE email = ?`,
            values
        );

        // Save cookie consent preference if provided
        if (cookieConsent !== undefined) {
            // Store in a simple KV or just log it — for now we trust the existing cookie banner
        }

        return NextResponse.json({ message: "Setup concluído" });
    } catch (error) {
        console.error("Setup save error:", error);
        return NextResponse.json(
            { message: "Erro ao guardar setup" },
            { status: 500 }
        );
    }
}
