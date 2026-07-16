"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState, useRef } from "react";
import { useSession } from "next-auth/react";
import { ArrowLeft, Send, Loader2, User, Check, CheckCheck } from "lucide-react";
import Link from "next/link";

interface Message {
    id: number;
    sender_id: number;
    content: string;
    is_read: number;
    created_at: string;
    sender_name: string;
    sender_image: string | null;
}

interface OtherUser {
    id: number;
    name: string;
    image: string | null;
}

interface Conversation {
    id: number;
    listing_id: number | null;
    title: string | null;
    listing_title: string | null;
    listing_image: string | null;
    price: number | null;
    currency: string | null;
}

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

function formatTime(date: Date): string {
    const hours = date.getHours().toString().padStart(2, "0");
    const minutes = date.getMinutes().toString().padStart(2, "0");
    return `${hours}:${minutes}`;
}

function formatDate(date: Date): string {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (days === 0) return "Hoje";
    if (days === 1) return "Ontem";
    if (days < 7) return `Há ${days} dias`;

    return date.toLocaleDateString("pt-PT", { day: "numeric", month: "short" });
}

export default function ConversationPage() {
    const params = useParams();
    const router = useRouter();
    const { data: session } = useSession();
    const [messages, setMessages] = useState<Message[]>([]);
    const [otherUser, setOtherUser] = useState<OtherUser | null>(null);
    const [conversation, setConversation] = useState<Conversation | null>(null);
    const [loading, setLoading] = useState(true);
    const [sending, setSending] = useState(false);
    const [input, setInput] = useState("");
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLTextAreaElement>(null);
    const messagesContainerRef = useRef<HTMLDivElement>(null);
    const initialScrollDone = useRef(false);
    const [isAtBottom, setIsAtBottom] = useState(true);

    const conversationId = params?.id as string;

    // Fetch messages
    const fetchMessages = async () => {
        if (!conversationId) return;
        try {
            const res = await fetch(`/api/messages?conversation_id=${conversationId}`);
            if (!res.ok) {
                if (res.status === 401) router.push("/login");
                if (res.status === 403) router.push("/messages");
                return;
            }
            const data = await res.json();
            setMessages(data.messages || []);
            setOtherUser(data.other_user);
            setConversation(data.conversation);
        } catch (err) {
            console.error("Failed to load messages:", err);
        } finally {
            setLoading(false);
        }
    };

    // Scroll to bottom of messages container only (not the page)
    const scrollToBottom = (smooth = true) => {
        requestAnimationFrame(() => {
            const el = messagesContainerRef.current;
            if (!el) return;
            if (smooth) {
                el.scroll({ top: el.scrollHeight, behavior: "smooth" });
            } else {
                el.scrollTop = el.scrollHeight;
            }
        });
    };

    // Detect if user is at bottom of chat
    const checkIsAtBottom = () => {
        const el = messagesContainerRef.current;
        if (!el) return;
        const threshold = 100;
        const atBottom = el.scrollHeight - el.scrollTop - el.clientHeight < threshold;
        setIsAtBottom(atBottom);
    };

    useEffect(() => {
        fetchMessages();
    }, [conversationId]);

    // Scroll to bottom after initial load (only once)
    useEffect(() => {
        if (!loading && !initialScrollDone.current) {
            initialScrollDone.current = true;
            setTimeout(() => scrollToBottom(false), 150);
        }
    }, [loading]);

    // Poll for new messages every 5s — BUT ONLY if user is at bottom or hasn't scrolled yet
    useEffect(() => {
        if (!conversationId || !isAtBottom) return;
        const interval = setInterval(fetchMessages, 5000);
        return () => clearInterval(interval);
    }, [conversationId, isAtBottom]);

    // Send message
    const sendMessage = async () => {
        if (!input.trim() || sending) return;
        setSending(true);
        try {
            const res = await fetch("/api/messages", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    conversation_id: Number(conversationId),
                    content: input.trim(),
                }),
            });
            if (!res.ok) throw new Error("Failed to send");
            const data = await res.json();
            if (data.message) {
                setMessages(prev => [...prev, data.message]);
            }
            setInput("");
            if (inputRef.current) {
                inputRef.current.style.height = "auto";
            }
            // Scroll to bottom after sending
            setTimeout(() => scrollToBottom(true), 50);
        } catch (err) {
            console.error("Failed to send message:", err);
        } finally {
            setSending(false);
        }
    };

    // Handle Enter to send (Shift+Enter for new line)
    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    };

    // Auto-resize textarea
    const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setInput(e.target.value);
        const el = e.target;
        el.style.height = "auto";
        el.style.height = Math.min(el.scrollHeight, 150) + "px";
    };

    // Group messages by date
    const groupedMessages: { date: string; messages: Message[] }[] = [];
    let currentDate = "";
    for (const msg of messages) {
        const dateKey = new Date(msg.created_at).toLocaleDateString("pt-PT");
        if (dateKey !== currentDate) {
            currentDate = dateKey;
            groupedMessages.push({ date: dateKey, messages: [msg] });
        } else {
            groupedMessages[groupedMessages.length - 1].messages.push(msg);
        }
    }

    if (loading) {
        return (
            <main className="min-h-screen bg-charcoal flex items-center justify-center">
                <Loader2 className="w-8 h-8 text-periwinkle animate-spin" />
            </main>
        );
    }

    return (
        <div className="h-[calc(100vh-64px)] md:h-[calc(100vh-80px)] flex flex-col overflow-hidden">
            {/* Header */}
            <div className="max-w-4xl mx-auto w-full px-4 py-4">
                <div className="flex items-center gap-4">
                    <Link
                        href="/messages"
                        className="p-2 text-slate-lighter hover:text-periwinkle hover:bg-hover-bg rounded-2xl transition-all"
                    >
                        <ArrowLeft className="w-5 h-5" />
                    </Link>
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                        <div className="w-10 h-10 rounded-full bg-periwinkle/20 flex items-center justify-center overflow-hidden flex-shrink-0 border-2 border-slate-700">
                            {otherUser?.image ? (
                                <img
                                    src={otherUser.image}
                                    alt={otherUser.name}
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                <User className="w-5 h-5 text-periwinkle" />
                            )}
                        </div>
                        <div className="min-w-0">
                            <p className="font-bold text-off-white truncate">
                                {otherUser?.name || "Utilizador"}
                            </p>
                            {conversation?.listing_title && (
                                <p className="text-xs text-slate-light truncate">
                                    sobre: {conversation.listing_title}
                                </p>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Messages Area */}
            <div
                ref={messagesContainerRef}
                onScroll={checkIsAtBottom}
                className="flex-1 max-w-4xl mx-auto w-full px-4 overflow-y-auto overflow-x-hidden"
            >
                <div className="space-y-6">
                    {groupedMessages.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-20 text-slate-light">
                            <p className="font-bold text-lg">Nenhuma mensagem ainda</p>
                            <p className="text-sm mt-1">Envia a primeira mensagem!</p>
                        </div>
                    ) : (
                        groupedMessages.map((group) => (
                            <div key={group.date}>
                                <div className="flex justify-center mb-4">
                                    <span className="text-[10px] font-bold text-slate-lighter uppercase tracking-widest bg-card-bg px-3 py-1 rounded-full">
                                        {formatDate(new Date(group.messages[0].created_at))}
                                    </span>
                                </div>
                                <div className="space-y-2">
                                    {group.messages.map((msg) => {
                                        const isMine = Number(msg.sender_id) === Number((session?.user as any)?.id);
                                        return (
                                            <div
                                                key={msg.id}
                                                className={`flex ${isMine ? "justify-end" : "justify-start"}`}
                                            >
                                                <div
                                                    className={`max-w-[80%] md:max-w-[60%] px-4 py-3 rounded-2xl ${
                                                        isMine
                                                            ? "bg-periwinkle text-white rounded-br-md"
                                                            : "bg-card-bg text-off-white rounded-bl-md border border-slate-700/50"
                                                    }`}
                                                >
                                                    <p className="text-sm leading-relaxed whitespace-pre-wrap break-words">
                                                        {msg.content}
                                                    </p>
                                                    <div
                                                        className={`flex items-center gap-1 mt-1 ${
                                                            isMine ? "justify-end" : "justify-start"
                                                        }`}
                                                    >
                                                        <span className="text-[10px] opacity-60">
                                                            {formatTime(new Date(msg.created_at))}
                                                        </span>
                                                        {isMine && (
                                                            msg.is_read ? (
                                                                <CheckCheck className="w-3 h-3 text-emerald-300" />
                                                            ) : (
                                                                <Check className="w-3 h-3 opacity-60" />
                                                            )
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        ))
                    )}
                    <div ref={messagesEndRef} />
                </div>
            </div>

            {/* Input Area */}
            <div className="bg-card-bg/90 backdrop-blur-xl border-t border-slate-700/50">
                <div className="max-w-4xl mx-auto px-4 py-2 md:py-3 flex items-end gap-3">
                    <div className="flex-1 relative">
                        <textarea
                            ref={inputRef}
                            value={input}
                            onChange={handleInputChange}
                            onKeyDown={handleKeyDown}
                            placeholder="Escreve uma mensagem..."
                            rows={1}
                            className="w-full bg-charcoal border border-slate-700 rounded-2xl px-4 py-3 pr-12 text-sm text-off-white placeholder-slate-lighter/50 focus:outline-none focus:border-periwinkle resize-none transition-colors max-h-[150px]"
                            disabled={sending}
                        />
                    </div>
                    <button
                        onClick={sendMessage}
                        disabled={!input.trim() || sending}
                        className="p-3 bg-periwinkle text-white rounded-2xl hover:bg-periwinkle/90 transition-all disabled:opacity-30 disabled:cursor-not-allowed flex-shrink-0 active:scale-95"
                    >
                        {sending ? (
                            <Loader2 className="w-5 h-5 animate-spin" />
                        ) : (
                            <Send className="w-5 h-5" />
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
}
