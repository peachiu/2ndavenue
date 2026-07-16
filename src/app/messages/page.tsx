import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import pool from "@/lib/db";
import { MessageCircle, ArrowLeft, User } from "lucide-react";
import Link from "next/link";

function timeAgo(date: Date): string {
    const seconds = Math.floor((Date.now() - new Date(date).getTime()) / 1000);
    if (seconds < 60) return "há " + seconds + "s";
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return "há " + minutes + "min";
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return "há " + hours + "h";
    const days = Math.floor(hours / 24);
    if (days < 30) return "há " + days + "d";
    return "há " + Math.floor(days / 30) + "m";
}

export default async function MessagesPage() {
    const session = await getServerSession(authOptions);
    if (!session) redirect("/login");

    const userId = (session.user as any).id;

    // Fetch conversations for this user
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
    const conversations = rows as any[];

    return (
        <main className="min-h-screen pb-20 pt-6 md:pt-8 bg-charcoal">
            <div className="max-w-4xl mx-auto px-4 md:px-8">
                <div className="mb-6 md:mb-8 flex items-center gap-3 md:gap-4">
                    <Link href="/" className="p-2 text-slate-lighter hover:text-periwinkle hover:bg-hover-bg rounded-2xl transition-all">
                        <ArrowLeft className="w-4 md:w-5 h-4 md:h-5" />
                    </Link>
                    <div>
                        <h1 className="text-2xl md:text-4xl font-black tracking-tighter mb-0.5 md:mb-1 flex items-center gap-2 md:gap-3">
                            <MessageCircle className="w-6 md:w-8 h-6 md:h-8 text-periwinkle" />
                            Mensagens
                        </h1>
                        <p className="text-xs md:text-sm text-slate-light font-medium">As tuas conversas.</p>
                    </div>
                </div>

                <div className="clay-card overflow-hidden">
                    {conversations.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-12 md:py-20 text-slate-light">
                            <MessageCircle className="w-12 md:w-16 h-12 md:h-16 mb-3 md:mb-4 opacity-30" />
                            <p className="font-bold text-base md:text-lg">Nenhuma mensagem ainda</p>
                            <p className="text-xs md:text-sm mt-0.5 md:mt-1">Quando alguém te enviar uma mensagem, aparece aqui.</p>
                        </div>
                    ) : (
                        <div className="divide-y divide-slate-700/50">
                            {conversations.map((conv: any) => (
                                <Link
                                    key={conv.conversation_id}
                                    href={`/messages/${conv.conversation_id}`}
                                    className="flex items-center gap-3 md:gap-4 p-3 md:p-5 hover:bg-hover-bg transition-colors group"
                                >
                                    <div className="w-10 md:w-12 h-10 md:h-12 rounded-full bg-periwinkle/20 flex items-center justify-center overflow-hidden flex-shrink-0 border-2 border-slate-700">
                                        {conv.other_user_image ? (
                                            <img src={conv.other_user_image} alt={conv.other_user_name} className="w-full h-full object-cover" />
                                        ) : (
                                            <User className="w-5 md:w-6 h-5 md:h-6 text-periwinkle" />
                                        )}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center justify-between gap-2">
                                            <p className="font-bold text-off-white truncate text-sm md:text-base">
                                                {conv.other_user_name || "Utilizador"}
                                            </p>
                                            {conv.last_message_at && (
                                                <span className="text-[8px] md:text-[10px] font-bold text-slate-lighter uppercase whitespace-nowrap">
                                                    {timeAgo(new Date(conv.last_message_at))}
                                                </span>
                                            )}
                                        </div>
                                        <p className="text-xs md:text-sm text-slate-light truncate mt-0.5">
                                            {conv.last_sender_id === Number(userId) ? "Tu: " : ""}
                                            {conv.last_message || "Sem mensagens ainda"}
                                        </p>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </main>
    );
}
