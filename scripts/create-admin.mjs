#!/usr/bin/env node
/**
 * ============================================================
 *  Second Avenue — Criar Superuser (Admin)
 * ============================================================
 *  Uso:  node scripts/create-admin.mjs
 *
 *  Cria o primeiro utilizador com role='admin' na base de dados.
 *  Se já existir um admin com este email, apenas actualiza os dados.
 * ============================================================
 */
import mysql from 'mysql2/promise';
import bcrypt from 'bcryptjs';
import { config } from 'dotenv';
import { createInterface } from 'readline';
import { stdin as input, stdout as output } from 'process';

config({ path: '.env.local' });

// ── Helpers ───────────────────────────────────────────────
function ask(query) {
    const rl = createInterface({ input, output });
    return new Promise((resolve) => {
        rl.question(`  ${query}`, (answer) => {
            rl.close();
            resolve(answer.trim());
        });
    });
}

function printBanner() {
    console.log('');
    console.log('═══════════════════════════════════════════════');
    console.log('   🛒  Second Avenue — Criar Superuser');
    console.log('═══════════════════════════════════════════════');
    console.log('');
}

function printSuccess(email) {
    console.log('');
    console.log('  ✅  Superuser criado com sucesso!');
    console.log(`  Email: ${email}`);
    console.log('');
    console.log('  Podes agora fazer login e aceder a /admin.');
    console.log('');
}

// ── Main ──────────────────────────────────────────────────
async function main() {
    printBanner();

    // 1. Perguntar dados ao utilizador
    const email = await ask('Email do admin:  ');
    if (!email || !email.includes('@')) {
        console.error('  ✘ Email inválido.');
        process.exit(1);
    }

    const name = await ask('Nome completo:   ');
    if (!name) {
        console.error('  ✘ Nome é obrigatório.');
        process.exit(1);
    }

    const password = await ask('Palavra-passe:   ');
    if (!password || password.length < 6) {
        console.error('  ✘ A password deve ter pelo menos 6 caracteres.');
        process.exit(1);
    }

    // 2. Ligar à base de dados
    const pool = mysql.createPool({
        host: process.env.DB_HOST || 'localhost',
        port: Number(process.env.DB_PORT) || 3307,
        user: process.env.DB_USER || 'root',
        password: process.env.DB_PASSWORD || '',
        database: process.env.DB_NAME || 'secondavenue',
        waitForConnections: true,
        connectionLimit: 1,
        queueLimit: 0,
    });

    try {
        // 3. Primeiro, garantir que o tipo 'admin' existe no ENUM
        await pool.query(`
            ALTER TABLE users
            MODIFY COLUMN role
            ENUM('community', 'professional', 'admin')
            NOT NULL DEFAULT 'community'
        `);
        console.log('  ✔ Role "admin" activado na tabela users.');

        // 4. Criar ou actualizar o admin
        const hashedPassword = await bcrypt.hash(password, 12);

        const [existing] = await pool.query(
            'SELECT id FROM users WHERE email = ?',
            [email]
        );

        if (existing.length > 0) {
            await pool.query(
                `UPDATE users
                 SET name = ?, password = ?, role = 'admin',
                     is_verified = TRUE, updated_at = NOW()
                 WHERE email = ?`,
                [name, hashedPassword, email]
            );
            console.log('  ✔ Admin actualizado (já existia).');
        } else {
            await pool.query(
                `INSERT INTO users (name, email, password, role, is_verified, created_at)
                 VALUES (?, ?, ?, 'admin', TRUE, NOW())`,
                [name, email, hashedPassword]
            );
            console.log('  ✔ Admin inserido.');
        }

        printSuccess(email);
    } catch (err) {
        console.error(`\n  ✘ Erro: ${err.message}`);
        process.exit(1);
    } finally {
        await pool.end();
    }
}

main();
