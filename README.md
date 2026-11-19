# AFARM storefront (frontend)

Next.js 14 app for AFARM.

## Local setup

```bash
npm install
cp .env.local.example .env.local
npm run dev
```

Backend should run at `http://localhost:8000` (see backend repo).

## Environment

| File | Purpose |
|------|---------|
| `.env.example` | Quick reference |
| `.env.local.example` | Local dev — copy to `.env.local` |
| `.env.production.example` | Production — copy to `.env.production` before `npm run build` |
| `.env.local` / `.env.production` | **Gitignored** |

On AWS, set `API_INTERNAL_BASE` to `http://127.0.0.1:8100/api/v1` (or your backend port).

## AWS — `afarm.khulega.online`

One-time: backend repo `deploy/aws/README.md`  
Ongoing: **`git push origin main`** → GitHub Actions rebuilds and restarts.

## GitHub

Push **this folder only** as the `afarm-frontend` repository.