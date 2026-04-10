# BlushMap 💄

> AI-powered skin analysis and personalised makeup & skincare recommendations with affiliate shopping links.

## What it does

1. **Capture** — Upload a selfie, take one live, or use the advanced RGB face scan (screen flashes red/green/blue to reveal hidden pigmentation and texture differences)
2. **Analyse** — Claude Vision AI analyses skin tone, undertone, type, face shape, and zone-by-zone conditions
3. **Recommend** — Get ranked product picks with a face zone map, routine order, and affiliate buy links

## Tech stack

- **Frontend** — React + Vite + Tailwind CSS + shadcn/ui
- **Backend** — Express.js + Node.js
- **AI** — Anthropic Claude (claude-sonnet-4-5) for vision analysis and recommendations
- **Database** — SQLite (dev) / PostgreSQL (production) via Drizzle ORM
- **Image processing** — sharp (auto-rotate, resize, compress)

## Quick start

```bash
npm install
npm run dev
```

Open [http://localhost:5000](http://localhost:5000)

## Environment variables

```env
ANTHROPIC_API_KEY=your_anthropic_key
DATABASE_URL=postgresql://...   # production only
```

## Database

See [`database/README.md`](database/README.md) for full schema documentation.

## Monetisation

Every product recommendation includes an Amazon UK affiliate link. Replace `blushmap-21` with your [Amazon Associates](https://affiliate-program.amazon.co.uk) tag in `server/routes.ts`.

## Deployment

```bash
npm run build
NODE_ENV=production node dist/index.cjs
```

Recommended hosts: [Railway](https://railway.app) · [Render](https://render.com) · [Fly.io](https://fly.io)
