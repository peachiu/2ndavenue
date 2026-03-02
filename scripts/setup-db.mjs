import mysql from 'mysql2/promise';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function setupDatabase() {
    const connection = await mysql.createConnection({
        host: process.env.DB_HOST || 'localhost',
        user: process.env.DB_USER || 'root',
        password: process.env.DB_PASSWORD || '',
    });

    console.log('Connecting to MySQL...');

    try {
        const dbName = process.env.DB_NAME || 'secondavenue';
        await connection.query(`CREATE DATABASE IF NOT EXISTS \`${dbName}\``);
        await connection.query(`USE \`${dbName}\``);
        console.log(`Using database: ${dbName}`);

        const sqlPath = path.join(__dirname, '../database.sql');
        const sql = await fs.readFile(sqlPath, 'utf8');

        // Split SQL by statements (semicolons followed by newlines)
        const statements = sql
            .split(/;\s*$/m)
            .map(s => s.trim())
            .filter(s => s.length > 0);

        console.log('Executing database.sql statements...');
        for (const statement of statements) {
            await connection.query(statement);
        }

        const seedPath = path.join(__dirname, '../seed.sql');
        const seedSql = await fs.readFile(seedPath, 'utf8');
        const seedStatements = seedSql
            .split(/;\s*$/m)
            .map(s => s.trim())
            .filter(s => s.length > 0);

        console.log('Executing seed.sql statements...');
        for (const statement of seedStatements) {
            await connection.query(statement);
        }

        console.log('Database and seed setup completed successfully.');
    } catch (error) {
        console.error('Error during database setup:', error);
    } finally {
        await connection.end();
    }
}

setupDatabase();
