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

# npm ci breaks on EC2 when lockfile was built on a different npm (optional @emnapi tree).
# .npmrc sets optional=false; npm install refreshes deps without failing on lock skew.
npm install --no-audit --no-fund

export NODE_ENV=production
npm run build

if command -v systemctl >/dev/null 2>&1; then
  sudo systemctl restart afarm-frontend
else
  echo "systemctl not found — run: PORT=3100 npm run start"
fi

echo "AFARM frontend deploy done at $(date -u +"%Y-%m-%dT%H:%M:%SZ")"