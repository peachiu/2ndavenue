import { NextResponse } from 'next/server';
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import pool from '@/lib/db';

// GET - Buscar mensagens de uma conversa
export async function GET(request: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session) {
            return NextResponse.json({ error: "Não autenticado" }, { status: 401 });
        }

        const userId = (session.user as any).id;
        const { searchParams } = new URL(request.url);
        const conversationId = searchParams.get("conversation_id");

        if (!conversationId) {
            return NextResponse.json({ error: "conversation_id é obrigatório" }, { status: 400 });
        }

        // Verificar se o user é participante da conversa
        const [participant] = await pool.query(
            "SELECT 1 FROM conversation_participants WHERE conversation_id = ? AND user_id = ?",
            [conversationId, userId]
        );

        if ((participant as any[]).length === 0) {
            return NextResponse.json({ error: "Não tens acesso a esta conversa" }, { status: 403 });
        }

        // Marcar mensagens como lidas (as que o outro user enviou)
        await pool.query(
            "UPDATE messages SET is_read = 1 WHERE conversation_id = ? AND sender_id != ? AND is_read = 0",
            [conversationId, userId]
        );

        // Buscar mensagens
        const [rows] = await pool.query(
            `SELECT m.id, m.sender_id, m.content, m.is_read, m.created_at,
                    u.name AS sender_name, u.image AS sender_image
             FROM messages m
             LEFT JOIN users u ON u.id = m.sender_id
             WHERE m.conversation_id = ?
             ORDER BY m.created_at ASC`,
            [conversationId]
        );

        // Buscar info da conversa
        const [convRows] = await pool.query(
            `SELECT c.id, c.listing_id, c.title,
                    l.title AS listing_title, l.price, l.currency,
                    (SELECT li.url FROM listing_images li WHERE li.listing_id = l.id ORDER BY li.sort_order LIMIT 1) AS listing_image
             FROM conversations c
             LEFT JOIN listings l ON l.id = c.listing_id
             WHERE c.id = ?`,
            [conversationId]
        );

        // Buscar outros participantes
        const [otherRows] = await pool.query(
            `SELECT u.id, u.name, u.image
             FROM conversation_participants cp
             JOIN users u ON u.id = cp.user_id
             WHERE cp.conversation_id = ? AND cp.user_id != ?`,
            [conversationId, userId]
        );

        return NextResponse.json({
            conversation: (convRows as any[])[0] || null,
            other_user: (otherRows as any[])[0] || null,
            messages: rows,
        });
    } catch (error) {
        console.error('Error fetching messages:', error);
        return NextResponse.json({ error: 'Erro ao carregar mensagens' }, { status: 500 });
    }
}

// POST - Enviar mensagem numa conversa existente
export async function POST(request: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session) {
            return NextResponse.json({ error: "Não autenticado" }, { status: 401 });
        }

        const userId = (session.user as any).id;
        const body = await request.json();
        const { conversation_id, content } = body;

        if (!conversation_id || !content?.trim()) {
            return NextResponse.json(
                { error: "Faltam campos obrigatórios (conversation_id, content)" },
                { status: 400 }
            );
        }

        // Verificar se o user é participante
        const [participant] = await pool.query(
            "SELECT 1 FROM conversation_participants WHERE conversation_id = ? AND user_id = ?",
            [conversation_id, userId]
        );

        if ((participant as any[]).length === 0) {
            return NextResponse.json({ error: "Não tens acesso a esta conversa" }, { status: 403 });
        }

        // Buscar o receiver (o outro participante) e listing_id
        const [convInfo] = await pool.query(
            `SELECT c.listing_id,
                    (SELECT cp.user_id FROM conversation_participants cp WHERE cp.conversation_id = c.id AND cp.user_id != ? LIMIT 1) AS receiver_id
             FROM conversations c WHERE c.id = ?`,
            [userId, conversation_id]
        );

        const conv = (convInfo as any[])[0];
        if (!conv) {
            return NextResponse.json({ error: "Conversa não encontrada" }, { status: 404 });
        }

        // Inserir mensagem
        const [result] = await pool.query(
            "INSERT INTO messages (sender_id, receiver_id, listing_id, conversation_id, content) VALUES (?, ?, ?, ?, ?)",
            [userId, conv.receiver_id, conv.listing_id, conversation_id, content]
        );

        // Buscar a mensagem criada com dados do sender
        const [msgRows] = await pool.query(
            `SELECT m.id, m.sender_id, m.content, m.is_read, m.created_at,
                    u.name AS sender_name, u.image AS sender_image
             FROM messages m
             LEFT JOIN users u ON u.id = m.sender_id
             WHERE m.id = ?`,
            [(result as any).insertId]
        );

        return NextResponse.json({
            success: true,
            message: (msgRows as any[])[0],
        }, { status: 201 });

    } catch (error) {
        console.error('Error sending message:', error);
        return NextResponse.json({ error: 'Erro ao enviar mensagem' }, { status: 500 });
    }
}
