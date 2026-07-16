import { NextResponse } from 'next/server';
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import pool from '@/lib/db';

// GET - Listar conversas do utilizador atual
export async function GET() {
    try {
        const session = await getServerSession(authOptions);
        if (!session) {
            return NextResponse.json({ error: "Não autenticado" }, { status: 401 });
        }

        const userId = (session.user as any).id;

        const [rows] = await pool.query(
            `SELECT
                c.id AS conversation_id,
                COALESCE(c.title, l.title) AS subject,
                c.listing_id,
                cp2.user_id AS other_user_id,
                u.name AS other_user_name,
                u.image AS other_user_image,
                (SELECT m2.content FROM messages m2 WHERE m2.conversation_id = c.id ORDER BY m2.created_at DESC LIMIT 1) AS last_message,
                (SELECT m3.created_at FROM messages m3 WHERE m3.conversation_id = c.id ORDER BY m3.created_at DESC LIMIT 1) AS last_message_at,
                (SELECT m4.sender_id FROM messages m4 WHERE m4.conversation_id = c.id ORDER BY m4.created_at DESC LIMIT 1) AS last_sender_id,
                (SELECT COUNT(*) FROM messages m5 WHERE m5.conversation_id = c.id AND m5.sender_id != ? AND m5.is_read = 0) AS unread_count
             FROM conversations c
             LEFT JOIN listings l ON l.id = c.listing_id
             JOIN conversation_participants cp1 ON cp1.conversation_id = c.id AND cp1.user_id = ?
             JOIN conversation_participants cp2 ON cp2.conversation_id = c.id AND cp2.user_id != ?
             LEFT JOIN users u ON u.id = cp2.user_id
             ORDER BY last_message_at DESC`,
            [userId, userId, userId]
        );

        return NextResponse.json(rows);
    } catch (error) {
        console.error('Error fetching conversations:', error);
        return NextResponse.json({ error: 'Erro ao carregar conversas' }, { status: 500 });
    }
}

// POST - Criar nova conversa (com primeira mensagem)
export async function POST(request: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session) {
            return NextResponse.json({ error: "Não autenticado" }, { status: 401 });
        }

        const userId = (session.user as any).id;
        const body = await request.json();
        const { listing_id, receiver_id, content } = body;

        if (!listing_id || !receiver_id || !content?.trim()) {
            return NextResponse.json(
                { error: "Faltam campos obrigatórios (listing_id, receiver_id, content)" },
                { status: 400 }
            );
        }

        if (Number(receiver_id) === Number(userId)) {
            return NextResponse.json(
                { error: "Não podes enviar mensagem a ti próprio" },
                { status: 400 }
            );
        }

        // Verificar se já existe conversa entre estes users sobre este anúncio
        const [existing] = await pool.query(
            `SELECT c.id FROM conversations c
             JOIN conversation_participants cp1 ON cp1.conversation_id = c.id AND cp1.user_id = ?
             JOIN conversation_participants cp2 ON cp2.conversation_id = c.id AND cp2.user_id = ?
             WHERE c.listing_id = ?`,
            [userId, receiver_id, listing_id]
        );

        const existingRows = existing as any[];
        let conversationId: number;

        if (existingRows.length > 0) {
            conversationId = existingRows[0].id;
        } else {
            // Buscar título do anúncio
            const [listingRows] = await pool.query(
                "SELECT title FROM listings WHERE id = ?",
                [listing_id]
            );
            const listingTitle = (listingRows as any[])[0]?.title || "Conversa sobre anúncio";

            // Criar conversa
            const [convResult] = await pool.query(
                "INSERT INTO conversations (listing_id, title) VALUES (?, ?)",
                [listing_id, listingTitle]
            );
            conversationId = (convResult as any).insertId;

            // Adicionar participantes
            await pool.query(
                "INSERT INTO conversation_participants (conversation_id, user_id) VALUES ?",
                [[[conversationId, userId], [conversationId, receiver_id]]]
            );
        }

        // Inserir primeira mensagem
        const [msgResult] = await pool.query(
            "INSERT INTO messages (sender_id, receiver_id, listing_id, conversation_id, content) VALUES (?, ?, ?, ?, ?)",
            [userId, receiver_id, listing_id, conversationId, content]
        );

        return NextResponse.json({
            success: true,
            conversation_id: conversationId,
            message_id: (msgResult as any).insertId,
        }, { status: 201 });

    } catch (error) {
        console.error('Error creating conversation:', error);
        return NextResponse.json({ error: 'Erro ao criar conversa' }, { status: 500 });
    }
}
