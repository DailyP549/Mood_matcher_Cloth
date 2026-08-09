# OutfitWise

AI-powered personal wardrobe assistant.

## Structure
```
├── frontend/   # Next.js app (UI only) — proxies /api to the backend
└── backend/    # Express REST API — weather, storage, AI reasoning
```

## Run
Two processes:

Backend API (port 4000):
```bash
npm run server
```

Frontend (Next.js, port 3000):
```bash
npm run dev:frontend   # development
# or production:
npm run build:frontend
npm run start:frontend
```

Open http://localhost:3000

## Features
- Digital wardrobe with photo upload + auto color detection
- AI stylist with occasion / mood / weather / style filters
- Live weather via OpenWeatherMap (key in `.env`)
- AI reasoning via Groq LLM (key in `.env`)
- Supabase Postgres persistence (run `supabase-schema.sql`, fallback to `backend/data.json`)
- Outfit gallery, favorites, weekly planner, utilization score

## API
- `GET/PUT /api/items`, `GET/PUT /api/favorites`, `GET/PUT /api/plans`
- `GET /api/weather`, `POST /api/reason`, `GET /api/health`
