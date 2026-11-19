#!/usr/bin/env bash
# Run on EC2 after git pull (also called from GitHub Actions). Requires .env.production on server.
set -euo pipefail

APP_DIR="${AFARM_FRONTEND_DIR:-/srv/afarm/afarm-frontend}"
cd "$APP_DIR"

git fetch origin main
git reset --hard origin/main

if [[ ! -f .env.production ]]; then
  echo "Missing .env.production — copy from .env.production.example once on the server." >&2
  exit 1
fi

# Install before NODE_ENV=production (Next build needs devDependencies e.g. eslint-config-next).
# --omit=optional avoids wasm32/@emnapi lock mismatches between npm versions on EC2 vs lockfile.
if ! npm ci --omit=optional --no-audit --no-fund; then
  echo "npm ci failed; syncing with npm install …" >&2
  npm install --omit=optional --no-audit --no-fund
fi

export NODE_ENV=production
npm run build

if command -v systemctl >/dev/null 2>&1; then
  sudo systemctl restart afarm-frontend
else
  echo "systemctl not found — run: PORT=3100 npm run start"
fi

echo "AFARM frontend deploy done at $(date -u +"%Y-%m-%dT%H:%M:%SZ")"