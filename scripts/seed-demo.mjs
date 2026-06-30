#!/usr/bin/env node
/**
 * ============================================================
 *  SecondAvenue — Seed Demo (Utilizadores + Anúncios + Fotos)
 * ============================================================
 *  Cria 5 utilizadores falsos com 8 anúncios e fotos reais
 *  (Unsplash) para apresentação do site.
 *
 *  Uso:  node scripts/seed-demo.mjs
 * ============================================================
 */
import mysql from "mysql2/promise";
import bcrypt from "bcryptjs";
import fs from "fs";
import https from "https";
import path from "path";
import { fileURLToPath } from "url";
import { config } from "dotenv";

config({ path: ".env.local" });

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// ── Config ─────────────────────────────────────────────────
const DB = {
    host: process.env.DB_HOST || "localhost",
    port: Number(process.env.DB_PORT) || 3307,
    user: process.env.DB_USER || "root",
    password: process.env.DB_PASSWORD || "",
    database: process.env.DB_NAME || "secondavenue",
};

const IMG_DIR = path.resolve(__dirname, "../public/images/products");

// ── Dados ──────────────────────────────────────────────────
const USERS = [
    { name: "Maria Silva", email: "mariasilva@demo.com", password: "demo123", role: "community", location: "Lisboa" },
    { name: "João Santos", email: "joaosantos@demo.com", password: "demo123", role: "community", location: "Porto" },
    { name: "Ana Costa", email: "anacosta@demo.com", password: "demo123", role: "community", location: "Coimbra" },
    { name: "Pedro Oliveira", email: "pedrooliveira@demo.com", password: "demo123", role: "professional", location: "Braga" },
    { name: "Sofia Martins", email: "sofiamartins@demo.com", password: "demo123", role: "community", location: "Faro" },
];

const PRODUCTS = [
    {
        title: "Mala Coach Clássica",
        description: "Mala Coach original em couro castanho, modelo clássico atemporal. Perfecta para o dia-a-dia com muito estilo e elegância. Com etiqueta de autenticidade e número de série.",
        price: 85.00,
        currency: "EUR",
        category_slug: "acessorios",
        condition_rating: "Good",
        userIdIndex: 0,
        imageUrl: "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=800&h=800&fit=crop",
        imageFilename: "mala-coach.jpg",
    },
    {
        title: "iPhone 14 Pro — 128GB Deep Purple",
        description: "iPhone 14 Pro impecável, comprado em 2023. Bateria com 89% de capacidade máxima. Inclui caixa original, carregador e capa de silicone. Apenas 8 meses de uso.",
        price: 650.00,
        currency: "EUR",
        category_slug: "tecnologia",
        condition_rating: "Like New",
        userIdIndex: 1,
        imageUrl: "https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=800&h=800&fit=crop",
        imageFilename: "iphone-14.jpg",
    },
    {
        title: "MacBook Air M1 — 8GB/256GB Space Grey",
        description: "MacBook Air com chip M1 em perfeito estado. Bateria com 92% de saúde. Teclado e trackpad impecáveis. Ideal para trabalho, estudo e criatividade. Vem com carregador original.",
        price: 800.00,
        currency: "EUR",
        category_slug: "tecnologia",
        condition_rating: "Like New",
        userIdIndex: 3,
        imageUrl: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=800&h=800&fit=crop",
        imageFilename: "macbook-air.jpg",
    },
    {
        title: "Mesa de Madeira Maciça 180cm",
        description: "Mesa de jantar em madeira maciça de carvalho, 180x90cm. Com pés em ferro forjado. Acompanha 6 cadeiras. Peça única, cheia de carácter e história. Leve desconto no tampo (imperfeição estética).",
        price: 120.00,
        currency: "EUR",
        category_slug: "casa",
        condition_rating: "Good",
        userIdIndex: 2,
        imageUrl: "https://images.unsplash.com/photo-1530018607912-eff2daa1bac4?w=800&h=800&fit=crop",
        imageFilename: "mesa-madeira.jpg",
    },
    {
        title: "Vestido Floral Mid-Century",
        description: "Vestido midi com padrão floral inspirado nos anos 50. Mangas bufantes, cintura marcada e saia evasé. Tecido leve 100% algodão. Tamanho M, perfecto para um look vintage e romântico.",
        price: 35.00,
        currency: "EUR",
        category_slug: "roupa",
        condition_rating: "New",
        userIdIndex: 4,
        imageUrl: "https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=800&h=800&fit=crop",
        imageFilename: "vestido-floral.jpg",
    },
    {
        title: "Chapéu de Sol de Praia 2m",
        description: "Chapéu de sol grande para praia/jardim, diâmetro de 2 metros. Estrutura em alumínio leve, tecido UV50+. Inclui saco de transporte. Usado apenas 2 vezes.",
        price: 25.00,
        currency: "EUR",
        category_slug: "casa",
        condition_rating: "Good",
        userIdIndex: 0,
        imageUrl: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&h=800&fit=crop",
        imageFilename: "chapeu-sol.jpg",
    },
    {
        title: "Camisola Oversized Cream",
        description: "Camisola oversized em tricot creme, super macia e quentinha. Perfecta para um look confortável e aesthetic. Tamanho único (veste S-L). Em perfeito estado, usada poucas vezes.",
        price: 28.00,
        currency: "EUR",
        category_slug: "roupa",
        condition_rating: "Like New",
        userIdIndex: 4,
        imageUrl: "https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=800&h=800&fit=crop",
        imageFilename: "camisola-cream.jpg",
    },
    {
        title: "Cadeira Vintage de Madeira",
        description: "Cadeira de madeira maciça estilo retro anos 60. Assento em palhinha natural. Estrutura robusta e muito confortável. Peça única para dar um toque vintage à tua sala ou cozinha.",
        price: 65.00,
        currency: "EUR",
        category_slug: "casa",
        condition_rating: "Fair",
        userIdIndex: 2,
        imageUrl: "https://images.unsplash.com/photo-1506439773649-6e0eb8cfb237?w=800&h=800&fit=crop",
        imageFilename: "cadeira-vintage.jpg",
    },
];

// ── Helpers ────────────────────────────────────────────────
function downloadImage(url, dest) {
    return new Promise((resolve, reject) => {
        const file = fs.createWriteStream(dest);
        https
            .get(url, (response) => {
                // Unsplash sometimes redirects
                if (response.statusCode === 301 || response.statusCode === 302) {
                    file.close();
                    fs.unlinkSync(dest);
                    downloadImage(response.headers.location, dest).then(resolve).catch(reject);
                    return;
                }
                if (response.statusCode !== 200) {
                    file.close();
                    fs.unlinkSync(dest);
                    reject(new Error(`HTTP ${response.statusCode} for ${url}`));
                    return;
                }
                response.pipe(file);
                file.on("finish", () => {
                    file.close();
                    resolve();
                });
            })
            .on("error", (err) => {
                file.close();
                if (fs.existsSync(dest)) fs.unlinkSync(dest);
                reject(err);
            });
    });
}

function printBanner() {
    console.log("");
    console.log("═══════════════════════════════════════════════");
    console.log("   🛒  SecondAvenue — Seed Demo");
    console.log("═══════════════════════════════════════════════");
    console.log("");
}

async function getCategoryId(pool, slug) {
    const [rows] = await pool.query("SELECT id FROM categories WHERE slug = ? LIMIT 1", [slug]);
    if (rows.length === 0) {
        // Try to find parent category by partial match
        const [fallback] = await pool.query(
            "SELECT id FROM categories WHERE slug LIKE ? LIMIT 1",
            [`${slug}%`]
        );
        return fallback.length > 0 ? fallback[0].id : null;
    }
    return rows[0].id;
}

// ── Main ──────────────────────────────────────────────────
async function main() {
    printBanner();

    const conn = await mysql.createConnection(DB);
    console.log("  📦  Ligado à base de dados\n");

    try {
        // ── 1. Criar utilizadores ────────────────────────
        console.log("  👥  A criar utilizadores...");
        const userIds = [];
        for (const u of USERS) {
            const hashedPw = await bcrypt.hash(u.password, 10);
            const [result] = await conn.query(
                `INSERT INTO users (name, email, password, role, location, is_verified, created_at, updated_at)
                 VALUES (?, ?, ?, ?, ?, 1, NOW(), NOW())
                 ON DUPLICATE KEY UPDATE name = VALUES(name), role = VALUES(role), location = VALUES(location)`,
                [u.name, u.email, hashedPw, u.role, u.location]
            );
            const id = result.insertId || (await conn.query("SELECT id FROM users WHERE email = ?", [u.email]))[0][0].id;
            userIds.push(id);
            console.log(`     ✓ ${u.name} (${u.email})`);
        }

        // ── 2. Descarregar imagens ──────────────────────
        console.log("\n  🖼️  A descarregar imagens Unsplash...");
        if (!fs.existsSync(IMG_DIR)) {
            fs.mkdirSync(IMG_DIR, { recursive: true });
        }

        const imageFiles = [];
        for (const p of PRODUCTS) {
            const dest = path.join(IMG_DIR, p.imageFilename);
            if (fs.existsSync(dest)) {
                console.log(`     ✓ ${p.imageFilename} (já existe)`);
            } else {
                try {
                    await downloadImage(p.imageUrl, dest);
                    console.log(`     ✓ ${p.imageFilename}`);
                } catch (err) {
                    console.log(`     ✗ ${p.imageFilename} — erro: ${err.message}`);
                }
            }
            imageFiles.push(p.imageFilename);
        }

        // ── 3. Criar anúncios ────────────────────────────
        console.log("\n  📋  A criar anúncios...");
        for (const p of PRODUCTS) {
            const userId = userIds[p.userIdIndex];
            const catId = await getCategoryId(conn, p.category_slug);

            const [result] = await conn.query(
                `INSERT INTO listings (user_id, title, description, price, currency, category_id, condition_rating, status, views, created_at, updated_at)
                 VALUES (?, ?, ?, ?, ?, ?, ?, 'active', FLOOR(RAND() * 300 + 10), NOW(), NOW())`,
                [
                    userId,
                    p.title,
                    p.description,
                    p.price,
                    p.currency,
                    catId,
                    p.condition_rating,
                ]
            );
            const listingId = result.insertId;

            // Insert image reference
            await conn.query(
                `INSERT INTO listing_images (listing_id, url, sort_order) VALUES (?, ?, 1)`,
                [listingId, `/images/products/${p.imageFilename}`]
            );

            console.log(`     ✓ ${p.title} — €${p.price}`);
        }

        console.log("\n═══════════════════════════════════════════════");
        console.log("  ✅  Seed concluído com sucesso!");
        console.log(`     ${USERS.length} utilizadores · ${PRODUCTS.length} anúncios`);
        console.log("");
        console.log("  🔑  Password para todos: demo123");
        console.log("");
    } catch (error) {
        console.error("  ❌  Erro:", error.message);
        process.exit(1);
    } finally {
        await conn.end();
    }
}

main();
