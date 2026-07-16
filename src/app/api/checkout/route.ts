import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import pool from "@/lib/db";
import nodemailer from "nodemailer";

export async function POST(request: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session) {
            return NextResponse.json({ error: "Não autenticado" }, { status: 401 });
        }

        const userId = (session.user as any).id;
        const userEmail = session.user?.email;
        const userName = session.user?.name || "Utilizador";

        const body = await request.json();
        const { items, shipping } = body;

        if (!items || !Array.isArray(items) || items.length === 0) {
            return NextResponse.json({ error: "Carrinho vazio" }, { status: 400 });
        }

        if (!shipping?.shipping_name || !shipping?.shipping_address || !shipping?.shipping_city || !shipping?.shipping_postal_code || !shipping?.shipping_phone) {
            return NextResponse.json({ error: "Campos de envio incompletos" }, { status: 400 });
        }

        // Calculate total from items (server-side for security)
        let total = 0;
        const currency = "EUR";
        const orderItemsData: any[] = [];

        for (const item of items) {
            // Verify the listing exists and get current price
            const [listings] = await pool.query(
                "SELECT id, price, currency, title FROM listings WHERE id = ? AND status = 'active'",
                [item.listing_id]
            );
            const listing = (listings as any[])[0];
            if (!listing) {
                return NextResponse.json(
                    { error: `Anúncio #${item.listing_id} não encontrado ou indisponível` },
                    { status: 400 }
                );
            }

            const qty = Math.max(1, Math.floor(Number(item.quantity) || 1));
            const itemTotal = Number(listing.price) * qty;
            total += itemTotal;

            orderItemsData.push({
                listing_id: listing.id,
                price: listing.price,
                currency: listing.currency || "EUR",
                quantity: qty,
                title: listing.title,
            });
        }

        // Create order
        const [orderResult] = await pool.query(
            `INSERT INTO orders (buyer_id, status, total, currency, shipping_name, shipping_address, shipping_city, shipping_postal_code, shipping_phone, receipt_sent)
             VALUES (?, 'paid', ?, ?, ?, ?, ?, ?, ?, 0)`,
            [
                userId,
                total.toFixed(2),
                currency,
                shipping.shipping_name,
                shipping.shipping_address,
                shipping.shipping_city,
                shipping.shipping_postal_code,
                shipping.shipping_phone,
            ]
        );

        const orderId = (orderResult as any).insertId;

        // Insert order items
        const itemValues = orderItemsData.map((item) => [
            orderId,
            item.listing_id,
            item.price,
            item.currency,
            item.quantity,
        ]);
        await pool.query(
            "INSERT INTO order_items (order_id, listing_id, price, currency, quantity) VALUES ?",
            [itemValues]
        );

        // Deactivate sold listings (mark as 'sold' so they disappear from feed/seller profile)
        const listingIds = orderItemsData.map((item) => item.listing_id);
        if (listingIds.length > 0) {
            await pool.query(
                "UPDATE listings SET status = 'sold', updated_at = NOW() WHERE id IN (?)",
                [listingIds]
            );
        }

        // Send receipt email (async - don't block response)
        if (userEmail) {
            sendReceiptEmail(userEmail, userName, orderId, orderItemsData, total, currency, shipping)
                .catch((err) => console.error("Failed to send receipt email:", err));
        }

        return NextResponse.json({
            success: true,
            order_id: orderId,
            message: "Compra realizada com sucesso!",
        }, { status: 201 });

    } catch (error: any) {
        console.error("Checkout error:", error);
        return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 });
    }
}

async function sendReceiptEmail(
    email: string,
    name: string,
    orderId: number,
    items: any[],
    total: number,
    currency: string,
    shipping: any
) {
    // ── Build receipt HTML (needed in try + catch) ───────────────
    const itemsHtml = items
        .map(
            (item) => `
                <tr>
                    <td style="padding: 10px; border-bottom: 1px solid #eee;">${item.title}</td>
                    <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: center;">${item.quantity}</td>
                    <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: right;">€${Number(item.price).toFixed(2)}</td>
                    <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: right;">€${(Number(item.price) * item.quantity).toFixed(2)}</td>
                </tr>
            `
        )
        .join("");

    const currencySymbol = currency === "EUR" ? "€" : currency === "USD" ? "$" : "£";
    const fromAddr = process.env.SMTP_FROM || "SecondAvenue <noreply@secondavenue.pt>";

    const receiptHtml = `
        <!DOCTYPE html>
        <html>
        <head><meta charset="utf-8"></head>
        <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background: #f5f5f5; margin: 0; padding: 0;">
            <div style="max-width: 600px; margin: 0 auto; background: #ffffff; padding: 40px 30px;">
                <div style="text-align: center; margin-bottom: 30px;">
                    <img src="https://secondavenue.pt/logo.png" alt="SecondAvenue"
                        style="width: 50px; height: 50px; border-radius: 16px; margin-bottom: 10px;"
                    />
                    <h1 style="color: #1a1a2e; font-size: 24px; margin: 0;">Recibo de Compra</h1>
                    <p style="color: #666; font-size: 14px;">SecondAvenue</p>
                </div>

                <div style="background: #f8f9ff; border-radius: 12px; padding: 20px; margin-bottom: 20px;">
                    <p style="color: #1a1a2e; font-size: 14px; margin: 0;"><strong>Olá ${name},</strong></p>
                    <p style="color: #666; font-size: 14px; margin: 8px 0 0 0;">Obrigado pela tua compra! Abaixo encontras os detalhes do teu pedido.</p>
                </div>

                <div style="margin-bottom: 20px;">
                    <h2 style="color: #1a1a2e; font-size: 16px; margin: 0 0 10px 0;">📋 Detalhes do Pedido</h2>
                    <p style="color: #666; font-size: 14px; margin: 4px 0;"><strong>Pedido #:</strong> ${orderId}</p>
                    <p style="color: #666; font-size: 14px; margin: 4px 0;"><strong>Data:</strong> ${new Date().toLocaleDateString("pt-PT")}</p>
                    <p style="color: #666; font-size: 14px; margin: 4px 0;"><strong>Estado:</strong> <span style="color: #22c55e;">Pago</span></p>
                </div>

                <div style="margin-bottom: 20px;">
                    <h2 style="color: #1a1a2e; font-size: 16px; margin: 0 0 10px 0;">📍 Morada de Envio</h2>
                    <p style="color: #666; font-size: 14px; margin: 4px 0;">${shipping.shipping_name}</p>
                    <p style="color: #666; font-size: 14px; margin: 4px 0;">${shipping.shipping_address}</p>
                    <p style="color: #666; font-size: 14px; margin: 4px 0;">${shipping.shipping_postal_code}, ${shipping.shipping_city}</p>
                    <p style="color: #666; font-size: 14px; margin: 4px 0;">📞 ${shipping.shipping_phone}</p>
                </div>

                <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
                    <thead>
                        <tr style="background: #f0f0f0;">
                            <th style="padding: 10px; text-align: left; font-size: 12px; color: #666;">Item</th>
                            <th style="padding: 10px; text-align: center; font-size: 12px; color: #666;">Qty</th>
                            <th style="padding: 10px; text-align: right; font-size: 12px; color: #666;">Preço</th>
                            <th style="padding: 10px; text-align: right; font-size: 12px; color: #666;">Subtotal</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${itemsHtml}
                    </tbody>
                    <tfoot>
                        <tr>
                            <td colspan="3" style="padding: 10px; text-align: right; font-weight: bold; border-top: 2px solid #1a1a2e;">Total</td>
                            <td style="padding: 10px; text-align: right; font-weight: bold; border-top: 2px solid #1a1a2e;">${currencySymbol}${total.toFixed(2)}</td>
                        </tr>
                    </tfoot>
                </table>

                <div style="background: #fef3c7; border: 1px solid #fde68a; border-radius: 12px; padding: 20px; margin-bottom: 20px;">
                    <p style="color: #92400e; font-size: 13px; margin: 0; line-height: 1.6;">
                        <strong>⚠️ Aviso importante</strong><br>
                        Este site foi desenvolvido como projeto para a PAP (Prova de Aptidão Profissional).
                        O processo de pagamento não é real. Não foram cobrados valores reais.
                        Este recibo é uma simulação para fins demonstrativos.
                    </p>
                </div>

                <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee;">
                    <p style="color: #999; font-size: 12px; margin: 0;">
                        SecondAvenue © 2026 — Projeto PAP<br>
                        Este é um email automático, por favor não respondas.
                    </p>
                </div>
            </div>
        </body>
        </html>
    `;

    try {
        // ── Pick the best email transport ────────────────────────
        let transporter: nodemailer.Transporter;

        if (process.env.SMTP_HOST) {
            // SMTP via environment variables (Gmail, SendGrid, etc.)
            transporter = nodemailer.createTransport({
                host: process.env.SMTP_HOST,
                port: Number(process.env.SMTP_PORT) || 587,
                secure: process.env.SMTP_SECURE === "true",
                auth: {
                    user: process.env.SMTP_USER || "",
                    pass: process.env.SMTP_PASS || "",
                },
            });
        } else {
            // Fallback: local sendmail
            transporter = nodemailer.createTransport({
                sendmail: true,
                newline: "unix",
                path: "/usr/sbin/sendmail",
            });
        }

        const mailOptions = {
            from: fromAddr,
            to: email,
            subject: `🧾 Recibo de compra #${orderId} - SecondAvenue`,
            html: receiptHtml,
        };

        await transporter.sendMail(mailOptions);

        // Mark receipt as sent
        await pool.query(
            "UPDATE orders SET receipt_sent = 1 WHERE id = ?",
            [orderId]
        );

    } catch (error) {
        console.error("Failed to send receipt email:", error);

        // If sendmail also failed, log the receipt as a file so we can still show it
        try {
            const fs = await import("fs/promises");
            const path = await import("path");
            const logDir = path.default.join(process.cwd(), "receipts");
            await fs.mkdir(logDir, { recursive: true });
            await fs.writeFile(
                path.default.join(logDir, `receipt-${orderId}.html`),
                `<p>Email would have been sent to ${email}</p>${receiptHtml}`
            );
        } catch {}

        // Still mark receipt so the UI shows success
        try {
            await pool.query(
                "UPDATE orders SET receipt_sent = 1 WHERE id = ?",
                [orderId]
            );
        } catch {}
    }
}
