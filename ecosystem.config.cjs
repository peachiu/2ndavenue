// ============================================================
// PM2 Ecosystem File — SecondAvenue
// ============================================================
// Start:   pm2 start ecosystem.config.cjs
// Reload:  pm2 reload ecosystem.config.cjs
// Stop:    pm2 stop 2ndavenue
// Logs:    pm2 logs 2ndavenue
// ============================================================

const path = require("path");

module.exports = {
    apps: [
        {
            name: "2ndavenue",
            script: path.join(__dirname, "node_modules/next/dist/bin/next"),
            args: "start",
            cwd: __dirname,
            env: {
                NODE_ENV: "production",
                NODE_OPTIONS: "--openssl-legacy-provider",
                PORT: 3000,
            },
            log_date_format: "YYYY-MM-DD HH:mm Z",
            out_file: path.join(__dirname, "logs/pm2-out.log"),
            error_file: path.join(__dirname, "logs/pm2-err.log"),
            max_restarts: 10,
            restart_delay: 4000,
            // Graceful shutdown
            kill_timeout: 5000,
            // Auto-restart if memory exceeds 500MB
            max_memory_restart: "500M",
        },
    ],
};
