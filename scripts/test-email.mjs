const nodemailer = require('nodemailer');
const dotenv = require('dotenv');
dotenv.config({ path: '/var/www/2ndavenue/.env.production' });

const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT) || 587,
    secure: process.env.SMTP_SECURE === 'true',
    auth: {
        user: process.env.SMTP_USER || '',
        pass: process.env.SMTP_PASS || '',
    },
});

const receiptHtml = `<!DOCTYPE html>
<html><head><meta charset="utf-8"></head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background: #f5f5f5; margin: 0; padding: 0;">
<div style="max-width: 600px; margin: 0 auto; background: #ffffff; padding: 40px 30px;">
<div style="text-align: center; margin-bottom: 30px;">
<div style="background: #5170ff; width: 50px; height: 50px; border-radius: 16px; display: inline-flex; align-items: center; justify-content: center; margin-bottom: 10px;">
<span style="color: white; font-size: 30px; font-weight: 900;">s</span>
</div>
<h1 style="color: #1a1a2e; font-size: 24px; margin: 0;">Recibo de Compra</h1>
<p style="color: #666; font-size: 14px;">SecondAvenue</p>
</div>
<div style="background: #f8f9ff; border-radius: 12px; padding: 20px; margin-bottom: 20px;">
<p style="color: #1a1a2e; font-size: 14px; margin: 0;"><strong>Olá Dinis,</strong></p>
<p style="color: #666; font-size: 14px; margin: 8px 0 0 0;">Obrigado pela tua compra! Abaixo encontras os detalhes do teu pedido.</p>
</div>
<div style="margin-bottom: 20px;">
<h2 style="color: #1a1a2e; font-size: 16px; margin: 0 0 10px 0;">📋 Detalhes do Pedido</h2>
<p style="color: #666; font-size: 14px; margin: 4px 0;"><strong>Pedido #:</strong> TEST-001</p>
<p style="color: #666; font-size: 14px; margin: 4px 0;"><strong>Data:</strong> ${new Date().toLocaleDateString('pt-PT')}</p>
<p style="color: #666; font-size: 14px; margin: 4px 0;"><strong>Estado:</strong> <span style="color: #22c55e;">Pago</span></p>
</div>
<table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
<thead><tr style="background: #f0f0f0;">
<th style="padding: 10px; text-align: left; font-size: 12px; color: #666;">Item</th>
<th style="padding: 10px; text-align: center; font-size: 12px; color: #666;">Qty</th>
<th style="padding: 10px; text-align: right; font-size: 12px; color: #666;">Preço</th>
<th style="padding: 10px; text-align: right; font-size: 12px; color: #666;">Subtotal</th>
</tr></thead>
<tbody>
<tr><td style="padding: 10px; border-bottom: 1px solid #eee;">T-shirt SecondAvenue</td>
<td style="padding: 10px; border-bottom: 1px solid #eee; text-align: center;">1</td>
<td style="padding: 10px; border-bottom: 1px solid #eee; text-align: right;">€29.99</td>
<td style="padding: 10px; border-bottom: 1px solid #eee; text-align: right;">€29.99</td></tr>
<tr><td style="padding: 10px; border-bottom: 1px solid #eee;">Boné SecondAvenue</td>
<td style="padding: 10px; border-bottom: 1px solid #eee; text-align: center;">2</td>
<td style="padding: 10px; border-bottom: 1px solid #eee; text-align: right;">€14.99</td>
<td style="padding: 10px; border-bottom: 1px solid #eee; text-align: right;">€29.98</td></tr>
</tbody>
<tfoot><tr>
<td colspan="3" style="padding: 10px; text-align: right; font-weight: bold; border-top: 2px solid #1a1a2e;">Total</td>
<td style="padding: 10px; text-align: right; font-weight: bold; border-top: 2px solid #1a1a2e;">€59.97</td>
</tr></tfoot>
</table>
<div style="background: #fef3c7; border: 1px solid #fde68a; border-radius: 12px; padding: 20px; margin-bottom: 20px;">
<p style="color: #92400e; font-size: 13px; margin: 0; line-height: 1.6;">
<strong>⚠️ Aviso importante</strong><br>
Este site foi desenvolvido como projeto para a PAP (Prova de Aptidão Profissional).
O processo de pagamento não é real. Não foram cobrados valores reais.
Este recibo é uma simulação para fins demonstrativos.
</p></div>
<div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee;">
<p style="color: #999; font-size: 12px; margin: 0;">
SecondAvenue © 2026 — Projeto PAP<br>
Este é um email automático, por favor não respondas.
</p></div></div></body></html>`;

transporter.sendMail({
    from: process.env.SMTP_FROM || 'SecondAvenue <info@secondavenue.pt>',
    to: 'awesomedinis@gmail.com',
    subject: '🧾 [TESTE] Recibo de compra #TEST-001 - SecondAvenue',
    html: receiptHtml,
}).then(info => {
    console.log('✅ Email sent!');
    console.log('Message ID:', info.messageId);
    console.log('Response:', info.response);
}).catch(err => {
    console.error('❌ Failed:', err.message);
    if (err.response) console.error('Server response:', err.response);
});
