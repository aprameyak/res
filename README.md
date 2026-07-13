# res.me

Your resume workspace. Write, score, tailor, and export in one app.

## Stack

- Frontend: Next.js 15 (`apps/web`)
- API: FastAPI (`apps/api`)
- Scoring: [interviewstreet/hiring-agent](https://github.com/interviewstreet/hiring-agent)
- Export: LaTeX PDF pipeline (`packages/latex`)

## Local development

```bash
git clone https://github.com/aprameyak/res.git
cd res
cp .env.example .env

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
```

Set `NEXT_PUBLIC_API_URL` and `GEMINI_API_KEY`.

**API (Railway / Render)**

Deploy `apps/api` with PostgreSQL, Redis, and a Celery worker.

## License

MIT
