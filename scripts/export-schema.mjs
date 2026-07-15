import mysql from 'mysql2/promise';
import fs from 'fs';

const c = await mysql.createConnection({
    host: 'localhost',
    port: 3307,
    user: 'root',
    password: '',
    database: 'secondavenue'
});

const [tables] = await c.query('SHOW TABLES');
let sql = '';

for (const t of tables) {
    const tbl = Object.values(t)[0];
    const [ddl] = await c.query(`SHOW CREATE TABLE \`${tbl}\``);
    const createStmt = ddl[0]['Create Table'];
    sql += `DROP TABLE IF EXISTS \`${tbl}\`;\n${createStmt};\n\n`;
}

fs.writeFileSync('database.sql', sql, 'utf-8');
console.log(`Exported ${tables.length} tables to database.sql`);
await c.end();
