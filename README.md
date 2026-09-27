# Search Quality Pilot Audit — Live Demo Tool

Live companion for “Bypassing the Ad Machine.” Type any query → compares a vanilla
search against the same query + “ reddit”, scored with the paper’s binary rubric.
100% live Google data (via Serper). No mocks, ever.

Free signup, no credit card: https://serper.dev/signup (2,500 free queries;
each audit costs 2).

## Stack

Next.js 14 (App Router, TS) · Tailwind CSS · Recharts · Serper (Google SERP API) · Vercel · npm

## Setup

```bash
cd protoype
npm install
# put your key from https://serper.dev/signup into .env.local:
# SERPER_API_KEY=...
npm run dev   # http://localhost:3000
```

The key is read only in `app/api/audit/route.ts` (server-side). It never ships to the browser.

## How it works

- `POST /api/audit` with `{ "query": "..." }` fires two parallel Google
  searches (`query` and `query + " reddit"`), takes top 5 organic results each
  (sponsored-looking entries filtered), classifies via `lib/classify.ts`, returns
  `{ vanilla: { results, authenticityRate }, evasion: {...} }`.
- Each search is retried once on transient failure before an honest error is returned.
- Scoring: user discussion/forums = 1, everything else = 0.
  `authenticityRate = round(sum / 5 * 100)`.
- Unclassifiable → `Guide/how-to articles (unclassified)`, score 0, ⚠ needs review flag.
- Rate limit: 1 request / IP / 10 s (in-memory) → HTTP 429.
- Failures return `{ error }` and the UI shows it honestly — never fake data.

## Deploy (Vercel Hobby, free)

1. Push this folder to GitHub.
2. Import repo in Vercel, add `SERPER_API_KEY` in Environment Variables.
3. Deploy — auto-builds on push (`npm run build`).

## Files

- `app/page.tsx` — UI (search, columns, chart, disclaimer)
- `app/api/audit/route.ts` — backend + retry + rate limit
- `lib/serper.ts` — Serper client wrapper + ad filter
- `lib/classify.ts` — rubric + domain/keyword heuristics
- `lib/types.ts` — shared types
- `components/` — SearchForm, ResultCard, ComparisonChart, ExampleQueries, MethodologyNote
