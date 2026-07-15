#!/bin/bash
# ============================================================
# SecondAvenue — Debian EC2 Setup Script
# ============================================================
# MUST be run with bash, not sh!
#
# Usage:
#   Direct SSL (DNS aponta para esta EC2):
#     bash setup.sh --domain secondavenue.pt --email teu@email.com
#
#   Cloudflare Tunnel (recomendado):
#     bash setup.sh --tunnel --domain secondavenue.pt
#
# Options:
#   --domain     Your domain (e.g., secondavenue.pt)
#   --email      Email for Let's Encrypt (required without --tunnel)
#   --tunnel     Use Cloudflare Tunnel instead of direct SSL
#   --db-pass    MariaDB root password (auto-generated if omitted)
#   --help       Show this help
# ============================================================

set -euo pipefail

# ─── Parse args ────────────────────────────────────────────
DOMAIN=""
EMAIL=""
DB_ROOT_PASS=""
SKIP_SSL=false

USE_TUNNEL=false

while [ $# -gt 0 ]; do
    case "$1" in
        --domain) DOMAIN="$2"; shift 2 ;;
        --email)  EMAIL="$2"; shift 2 ;;
        --db-pass) DB_ROOT_PASS="$2"; shift 2 ;;
        --tunnel) USE_TUNNEL=true; shift ;;
        --skip-ssl) SKIP_SSL=true; shift ;;
        --help)
            sed -n '/^# Usage:/,/^$/p' "$0" | sed 's/^# //'
            exit 0
            ;;
        *) echo "Unknown option: $1"; exit 1 ;;
    esac
done

if [ "$USE_TUNNEL" = false ] && [ -n "$DOMAIN" ] && [ -z "$EMAIL" ] && [ "$SKIP_SSL" = false ]; then
    echo "❌ --email is required when using --domain (for Let's Encrypt)"
    echo "   Use --tunnel or --skip-ssl to skip SSL setup"
    exit 1
fi

APP_DIR="/var/www/2ndavenue"
APP_USER="www-data"
DB_NAME="secondavenue"
DB_USER="secondavenue"
DB_ROOT_PASS="${DB_ROOT_PASS:-$(openssl rand -hex 16)}"
NEXTAUTH_SECRET="$(openssl rand -hex 32)"

# ─── Colors ────────────────────────────────────────────────
RED='\033[0;31m'; GREEN='\033[0;32m'; YELLOW='\033[1;33m'
CYAN='\033[0;36m'; NC='\033[0m'
info()  { echo -e "${CYAN}[setup]${NC} $1"; }
ok()    { echo -e "${GREEN}[  ok]${NC} $1"; }
warn()  { echo -e "${YELLOW}[warn]${NC} $1"; }
fail()  { echo -e "${RED}[fail]${NC} $1"; exit 1; }

# ─── Root check ────────────────────────────────────────────
if [ "$(id -u)" -ne 0 ]; then
    fail "This script must be run as root (sudo)."
fi

# ═══════════════════════════════════════════════════════════
# STEP 1 — System packages
# ═══════════════════════════════════════════════════════════
info "Updating system packages..."
apt-get update -qq
apt-get upgrade -y -qq

info "Installing essentials..."
apt-get install -y -qq \
    curl git nginx certbot python3-certbot-nginx \
    mariadb-server mariadb-client \
    build-essential

ok "System packages installed."

# ═══════════════════════════════════════════════════════════
# STEP 2 — Node.js 20.x
# ═══════════════════════════════════════════════════════════
if ! command -v node &>/dev/null; then
    info "Installing Node.js 20.x..."
    curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
    apt-get install -y -qq nodejs
    ok "Node.js $(node -v) installed."
else
    ok "Node.js $(node -v) already installed."
fi

# ═══════════════════════════════════════════════════════════
# STEP 3 — MariaDB setup
# ═══════════════════════════════════════════════════════════
info "Securing MariaDB..."
service mariadb start

# On Debian, root uses auth_socket — use sudo mysql
sudo mysql <<SQL
CREATE DATABASE IF NOT EXISTS \`$DB_NAME\` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE USER IF NOT EXISTS '$DB_USER'@'localhost' IDENTIFIED BY '$DB_ROOT_PASS';
GRANT ALL PRIVILEGES ON \`$DB_NAME\`.* TO '$DB_USER'@'localhost';
FLUSH PRIVILEGES;
SQL

ok "MariaDB ready — database '$DB_NAME', user '$DB_USER'."

# ═══════════════════════════════════════════════════════════
# STEP 4 — Clone repository
# ═══════════════════════════════════════════════════════════
if [ -d "$APP_DIR" ]; then
    warn "$APP_DIR already exists. Pulling latest..."
    cd "$APP_DIR"
    git pull
else
    info "Cloning repository..."
    mkdir -p "$(dirname "$APP_DIR")"
    git clone https://github.com/peachiu/2ndavenue.git "$APP_DIR"
    cd "$APP_DIR"
fi

ok "Repository ready."

# ═══════════════════════════════════════════════════════════
# STEP 5 — Environment file
# ═══════════════════════════════════════════════════════════
info "Creating .env.production..."

# Determine NEXTAUTH_URL
if [ "$USE_TUNNEL" = true ] && [ -n "$DOMAIN" ]; then
    NEXT_URL="https://$DOMAIN"
elif [ -n "$DOMAIN" ]; then
    NEXT_URL="https://$DOMAIN"
else
    NEXT_URL="http://localhost:3000"
fi

cat > "$APP_DIR/.env.production" <<EOF
# NextAuth
NEXTAUTH_SECRET=$NEXTAUTH_SECRET
NEXTAUTH_URL=$NEXT_URL

# Database
DB_HOST=localhost
DB_PORT=3306
DB_USER=$DB_USER
DB_PASSWORD=$DB_ROOT_PASS
DB_NAME=$DB_NAME

# Google OAuth — FILL THESE IN!
# GOOGLE_CLIENT_ID=your-client-id
# GOOGLE_CLIENT_SECRET=your-client-secret
EOF

# Symlink .env.production → .env.local for Next.js
ln -sf "$APP_DIR/.env.production" "$APP_DIR/.env.local"

ok "Environment file created at .env.proproduction"
warn "⚠️  EDIT .env.production to add your Google OAuth credentials!"
warn "   nano $APP_DIR/.env.production"

# ═══════════════════════════════════════════════════════════
# STEP 6 — Database schema
# ═══════════════════════════════════════════════════════════
info "Running database schema..."
sudo mysql "$DB_NAME" < "$APP_DIR/database.sql"
if [ -f "$APP_DIR/update_db_schema.php" ]; then
    php "$APP_DIR/update_db_schema.php" 2>/dev/null || true
fi
if [ -f "$APP_DIR/seed.sql" ]; then
    info "Importing seed data..."
    sudo mysql "$DB_NAME" < "$APP_DIR/seed.sql" 2>/dev/null || true
fi
ok "Database schema applied."

# ═══════════════════════════════════════════════════════════
# STEP 7 — Install dependencies & build
# ═══════════════════════════════════════════════════════════
info "Installing npm dependencies (including cross-env)..."
cd "$APP_DIR"
npm install 2>&1 | tail -1

info "Building Next.js..."
export NODE_OPTIONS="--openssl-legacy-provider"
npm run build 2>&1 | tail -5

ok "Build complete."

# ═══════════════════════════════════════════════════════════
# STEP 8 — PM2 process manager
# ═══════════════════════════════════════════════════════════
info "Setting up PM2..."
npm install -g pm2 2>&1 | tail -1

# Kill any existing process
pm2 delete 2ndavenue 2>/dev/null || true

# Create PM2 ecosystem file for reliable environment
cat > "$APP_DIR/ecosystem.config.cjs" <<'EOF'
module.exports = {
    apps: [{
        name: "2ndavenue",
        script: "node_modules/next/dist/bin/next",
        args: "start",
        cwd: "APP_DIR_PLACEHOLDER",
        env: {
            NODE_ENV: "production",
            NODE_OPTIONS: "--openssl-legacy-provider",
            PORT: 3000
        },
        log_date_format: "YYYY-MM-DD HH:mm Z",
        out_file: "APP_DIR_PLACEHOLDER/logs/pm2-out.log",
        error_file: "APP_DIR_PLACEHOLDER/logs/pm2-err.log",
        max_restarts: 10,
        restart_delay: 4000
    }]
};
EOF
sed -i "s|APP_DIR_PLACEHOLDER|$APP_DIR|g" "$APP_DIR/ecosystem.config.cjs"

# Start with ecosystem file
pm2 start "$APP_DIR/ecosystem.config.cjs"

pm2 save
pm2 startup systemd -u root --hp /root 2>/dev/null | tail -1

ok "PM2 running '2ndavenue' on port 3000."

# ═══════════════════════════════════════════════════════════
# STEP 9 — Upload directory
# ═══════════════════════════════════════════════════════════
mkdir -p "$APP_DIR/public/images/products"
chown -R "$APP_USER:$APP_USER" "$APP_DIR/public/images"
ok "Upload directory ready."

# ═══════════════════════════════════════════════════════════
# STEP 10 — Reverse proxy (nginx + optional Cloudflare Tunnel)
# ═══════════════════════════════════════════════════════════

# Common nginx config (proxies :3000 for both tunnel and direct modes)
cat > /etc/nginx/sites-available/2ndavenue <<NGINX
upstream 2ndavenue {
    server 127.0.0.1:3000;
    keepalive 64;
}

server {
    listen 80;
    server_name _;

    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header Referrer-Policy "strict-origin-when-cross-origin" always;

    # Gzip
    gzip on;
    gzip_types text/plain text/css application/json application/javascript image/svg+xml;
    gzip_min_length 1000;

    # Static assets — cache aggressively
    location /_next/static {
        alias $APP_DIR/.next/static;
        expires 365d;
        add_header Cache-Control "public, immutable";
    }

    location /images/ {
        alias $APP_DIR/public/images/;
        expires 30d;
        add_header Cache-Control "public, immutable";
    }

    # Everything else → Next.js
    location / {
        proxy_pass http://2ndavenue;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
        proxy_cache_bypass \$http_upgrade;
    }
}
NGINX

rm -f /etc/nginx/sites-enabled/default
ln -sf /etc/nginx/sites-available/2ndavenue /etc/nginx/sites-enabled/
nginx -t && systemctl reload nginx
ok "nginx reverse proxy ready (port 80 → Next.js :3000)."

# ── Cloudflare Tunnel ────────────────────────────────────
if [ "$USE_TUNNEL" = true ]; then
    info "Setting up Cloudflare Tunnel..."

    # Install cloudflared
    if ! command -v cloudflared &>/dev/null; then
        curl -fsSL https://github.com/cloudflare/cloudflared/releases/latest/download/cloudflared-linux-amd64.deb -o /tmp/cloudflared.deb
        dpkg -i /tmp/cloudflared.deb 2>/dev/null || apt-get install -f -y -qq
        rm /tmp/cloudflared.deb
    fi

    # Create config directory
    mkdir -p /etc/cloudflared

    # Write config — tunnel points to nginx on port 80
    cat > /etc/cloudflared/config.yml <<YML
tunnel: $DOMAIN
credentials-file: /etc/cloudflared/$DOMAIN.json
ingress:
  - hostname: $DOMAIN
    service: http://localhost:80
  - hostname: www.$DOMAIN
    service: http://localhost:80
  - service: http_status:404
YML

    echo ""
    echo -e "${YELLOW}══════════════════════════════════════════════════════════════${NC}"
    echo -e "${YELLOW}  ⚠️  CLOUDFLARE TUNNEL — AÇÃO NECESSÁRIA${NC}"
    echo -e "${YELLOW}══════════════════════════════════════════════════════════════${NC}"
    echo ""
    echo -e "  1. Autentica o cloudflared na Cloudflare:"
    echo -e "     ${CYAN}cloudflared tunnel login${NC}"
    echo ""
    echo -e "  2. Cria o túnel (substitui pelo nome que quiseres):"
    echo -e "     ${CYAN}cloudflared tunnel create secondavenue${NC}"
    echo ""
    echo -e "  3. Copia o ficheiro .json para /etc/cloudflared/:"
    echo -e "     ${CYAN}cp ~/.cloudflared/*.json /etc/cloudflared/$DOMAIN.json${NC}"
    echo ""
    echo -e "  4. No DNS da Cloudflare, cria registos CNAME:"
    echo -e "     ${CYAN}$DOMAIN  →  tunnel-name.cfargotunnel.com${NC}"
    echo -e "     ${CYAN}www.$DOMAIN  →  tunnel-name.cfargotunnel.com${NC}"
    echo ""
    echo -e "  5. Instala como serviço:"
    echo -e "     ${CYAN}cloudflared tunnel install secondavenue${NC}"
    echo ""
    echo -e "  Depois disto, o site fica disponível em:"
    echo -e "     ${CYAN}https://$DOMAIN${NC}"
    echo ""

elif [ "$SKIP_SSL" = true ]; then
    info "Skipping SSL (--skip-ssl). Site available on http://localhost:3000"
    ok "nginx serving on port 80."

elif [ -n "$DOMAIN" ]; then
    info "Configuring Let's Encrypt SSL for $DOMAIN..."

    # Temporarily switch to SSL-ready config
    cat > /etc/nginx/sites-available/2ndavenue <<NGINX
upstream 2ndavenue {
    server 127.0.0.1:3000;
    keepalive 64;
}

server {
    listen 80;
    server_name $DOMAIN www.$DOMAIN;

    location /.well-known/acme-challenge/ {
        root /var/www/html;
    }

    location / {
        return 301 https://\$host\$request_uri;
    }
}

server {
    listen 443 ssl http2;
    server_name $DOMAIN www.$DOMAIN;

    ssl_certificate     /etc/letsencrypt/live/$DOMAIN/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/$DOMAIN/privkey.pem;
    ssl_protocols       TLSv1.2 TLSv1.3;
    ssl_ciphers         HIGH:!aNULL:!MD5;

    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header Referrer-Policy "strict-origin-when-cross-origin" always;

    # Gzip
    gzip on;
    gzip_types text/plain text/css application/json application/javascript image/svg+xml;
    gzip_min_length 1000;

    # Static assets — cache aggressively
    location /_next/static {
        alias $APP_DIR/.next/static;
        expires 365d;
        add_header Cache-Control "public, immutable";
    }

    location /images/ {
        alias $APP_DIR/public/images/;
        expires 30d;
        add_header Cache-Control "public, immutable";
    }

    # Everything else → Next.js
    location / {
        proxy_pass http://2ndavenue;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
        proxy_cache_bypass \$http_upgrade;
    }
}
NGINX

    nginx -t && systemctl reload nginx

    info "Requesting Let's Encrypt SSL..."
    certbot --nginx -d "$DOMAIN" -d "www.$DOMAIN" \
        --non-interactive --agree-tos --email "$EMAIL" \
        --redirect || warn "SSL failed — DNS may not point here yet. Run 'certbot --nginx -d $DOMAIN -d www.$DOMAIN' later."

    ok "nginx + SSL configured for $DOMAIN."
fi

# ═══════════════════════════════════════════════════════════
# STEP 11 — Logs directory
# ═══════════════════════════════════════════════════════════
mkdir -p "$APP_DIR/logs"

# ═══════════════════════════════════════════════════════════
# Done
# ═══════════════════════════════════════════════════════════
echo ""
echo -e "${GREEN}════════════════════════════════════════════════${NC}"
echo -e "${GREEN}  ✅ SecondAvenue deployed!${NC}"
echo -e "${GREEN}════════════════════════════════════════════════${NC}"
echo ""
echo -e "  ${CYAN}App local:${NC}  http://localhost:3000"
echo -e "  ${CYAN}PM2:${NC}        pm2 status | pm2 logs 2ndavenue"
echo -e "  ${CYAN}nginx:${NC}      http://$(curl -s ifconfig.me 2>/dev/null || echo '<IP_PÚBLICO>')"
echo -e "  ${CYAN}DB:${NC}         mysql -u $DB_USER -p'$DB_ROOT_PASS' $DB_NAME"

if [ "$USE_TUNNEL" = true ]; then
    echo ""
    echo -e "${YELLOW}  🌐 CLOUDFLARE TUNNEL — PRÓXIMOS PASSOS:${NC}"
    echo -e "  1. ${CYAN}cloudflared tunnel login${NC}"
    echo -e "  2. ${CYAN}cloudflared tunnel create secondavenue${NC}"
    echo -e "  3. ${CYAN}cp ~/.cloudflared/*.json /etc/cloudflared/$DOMAIN.json${NC}"
    echo -e "  4. No DNS Cloudflare: CNAME $DOMAIN → tunnel-name.cfargotunnel.com"
    echo -e "  5. ${CYAN}cloudflared tunnel install secondavenue${NC}"
    echo ""
    echo -e "  🔗 Site final: ${CYAN}https://$DOMAIN${NC}"
elif [ -n "$DOMAIN" ]; then
    echo -e "  ${CYAN}Domain:${NC}     https://$DOMAIN"
fi

echo ""
echo -e "${YELLOW}  ⚠️  NEXT STEPS:${NC}"
echo -e "  1. Edit env vars:   nano $APP_DIR/.env.production"
echo -e "  2. Add Google OAuth: uncomment GOOGLE_CLIENT_* and fill in"
echo -e "  3. Restart app:      pm2 restart 2ndavenue"
echo -e "  4. Deploy updates:   cd $APP_DIR && ./deploy/deploy.sh"
echo ""
echo -e "${YELLOW}  🔐 SAVE THESE:${NC}"
echo -e "  MariaDB password:  $DB_ROOT_PASS"
echo -e "  NEXTAUTH_SECRET:   $NEXTAUTH_SECRET"
echo ""
