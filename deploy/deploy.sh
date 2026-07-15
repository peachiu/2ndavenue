#!/bin/bash
# ============================================================
# SecondAvenue — Quick Deploy Script
# ============================================================
# Pulls latest from GitHub, installs deps, builds, restarts.
#
# Usage:
#   ./deploy/deploy.sh
#
# One-liner from SSH:
#   cd /var/www/2ndavenue && git pull && ./deploy/deploy.sh
# ============================================================

set -euo pipefail

APP_DIR="$(cd "$(dirname "$0")/.." && pwd)"
cd "$APP_DIR"

RED='\033[0;31m'; GREEN='\033[0;32m'; YELLOW='\033[1;33m'
CYAN='\033[0;36m'; NC='\033[0m'
info()  { echo -e "${CYAN}[deploy]${NC} $1"; }
ok()    { echo -e "${GREEN}[  ok]${NC} $1"; }
warn()  { echo -e "${YELLOW}[warn]${NC} $1"; }
fail()  { echo -e "${RED}[fail]${NC} $1"; exit 1; }

# ─── Check we're in the right place ───────────────────────
if [ ! -f "$APP_DIR/package.json" ]; then
    fail "Run this script from the project root: ./deploy/deploy.sh"
fi

# ─── 1. Git pull ──────────────────────────────────────────
info "Pulling latest from GitHub..."
git fetch origin
LOCAL=$(git rev-parse HEAD)
REMOTE=$(git rev-parse @{upstream})

if [ "$LOCAL" = "$REMOTE" ]; then
    ok "Already up to date."
else
    git pull
    ok "Latest code pulled."
fi

# ─── 2. Install dependencies ──────────────────────────────
info "Installing npm dependencies..."
npm install --omit=dev 2>&1 | tail -1
ok "Dependencies installed."

# ─── 3. Database migrations ───────────────────────────────
if [ -f "$APP_DIR/database.sql" ]; then
    info "Applying database schema..."
    source "$APP_DIR/.env.production" 2>/dev/null || source "$APP_DIR/.env.local" 2>/dev/null || true
    DB_HOST="${DB_HOST:-localhost}"
    DB_PORT="${DB_PORT:-3306}"
    DB_USER="${DB_USER:-secondavenue}"
    DB_PASSWORD="${DB_PASSWORD:-}"
    DB_NAME="${DB_NAME:-secondavenue}"

    mysql -h "$DB_HOST" -P "$DB_PORT" -u "$DB_USER" ${DB_PASSWORD:+-p"$DB_PASSWORD"} \
        "$DB_NAME" < "$APP_DIR/database.sql" 2>/dev/null && \
        ok "Database schema applied." || \
        warn "Could not apply schema — check credentials in .env.production"
fi

# ─── 4. Build ─────────────────────────────────────────────
info "Building Next.js..."
export NODE_OPTIONS="--openssl-legacy-provider"
npm run build 2>&1 | tail -5
ok "Build complete."

# ─── 5. Restart PM2 ───────────────────────────────────────
info "Restarting PM2..."
if command -v pm2 &>/dev/null; then
    pm2 reload 2ndavenue 2>/dev/null || pm2 start npm --name "2ndavenue" -- run start 2>/dev/null || {
        # If PM2 wasn't started yet, start fresh
        export NODE_OPTIONS="--openssl-legacy-provider"
        pm2 start npm --name "2ndavenue" \
            --log-date-format "YYYY-MM-DD HH:mm Z" \
            --output "$APP_DIR/logs/pm2-out.log" \
            --error "$APP_DIR/logs/pm2-err.log" \
            -- run start
        pm2 save
    }
    ok "PM2 restarted."
else
    warn "PM2 not found — start manually: npm start &"
fi

# ─── 6. Done ──────────────────────────────────────────────
echo ""
echo -e "${GREEN}════════════════════════════════════════${NC}"
echo -e "${GREEN}  ✅ Deploy complete!${NC}"
echo -e "${GREEN}════════════════════════════════════════${NC}"
echo ""
echo -e "  ${CYAN}Status:${NC} pm2 status"
echo -e "  ${CYAN}Logs:${NC}   pm2 logs 2ndavenue"
echo ""
