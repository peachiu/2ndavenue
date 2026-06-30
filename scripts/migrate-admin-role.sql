-- ============================================================
--  Migration: Adicionar role 'admin' aos utilizadores
--  Uso:  mysql -u secondavenue -p secondavenue < scripts/migrate-admin-role.sql
-- ============================================================

ALTER TABLE users
    MODIFY COLUMN role
    ENUM('community', 'professional', 'admin')
    NOT NULL DEFAULT 'community';
