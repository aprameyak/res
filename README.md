# res.me

Your resume workspace. Write, score, tailor, and export — one document, one app.

## Stack

- **Frontend** — Next.js 15 (`apps/web`)
- **API** — FastAPI (`apps/api`)
- **Scoring** — [interviewstreet/hiring-agent](https://github.com/interviewstreet/hiring-agent)
- **Export** — LaTeX PDF pipeline (`packages/latex`)

## Local development

```bash
git clone https://github.com/aprameyak/res.git
cd res
cp .env.example .env
# Set GEMINI_API_KEY in .env

# Frontend only (editor, tailor, export)
npm install
cd apps/web && npm run dev
```

Open http://localhost:3000

## Full stack (Docker)

```bash
docker compose build
docker compose up -d
docker compose exec api alembic upgrade head
docker compose exec api python scripts/seed.py
```

Demo login: `demo@res.me` / `demo12345`

## Deploy

**Frontend (Vercel)**

```bash
cd apps/web
vercel --prod
# Set NEXT_PUBLIC_API_URL to your API URL
# Set GEMINI_API_KEY for editor suggestions + tailor
```

**API (Railway / Render)**

Deploy `apps/api` with PostgreSQL, Redis, and a Celery worker. Set env vars from `.env.example`.

## License

MIT
