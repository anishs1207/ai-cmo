# Ripple — Organic Growth Autopilot

AI marketing operator for organic social. It reads your website, builds a marketing knowledge base, writes platform-native posts, publishes them to Instagram / Facebook / Reddit, tracks every visitor it sends to your site, and learns from each campaign's real performance.

## How it works

1. **Onboarding** — paste your website URL (and/or a description + what to promote). The site is scraped and Gemini 2.5 Flash extracts a structured Business KB: overview, audience segments, USP, pricing, brand voice/tone/personality/identity, testimonials, competitors, objections, target subreddits, content themes.
2. **Knowledge Base** (`/kb`) — review and edit everything the agent believes. All content generation is grounded in this.
3. **Connections** (`/connections`) — connect Facebook Page and Instagram Business account via Composio OAuth (per user). Reddit posts go through one app-owned account (`REDDIT_SHARED_USER_ID`), connected once by you.
4. **Campaigns** (`/campaigns/new`) — pick channels, objective and posts-per-channel. Gemini writes distinct angles per platform (IG caption + hashtags, FB story-post, Reddit community-native post with target subreddit). Every post carries a tracked short link (`/r/<code>`).
5. **Publish** — publish now or schedule. Publishing runs through Composio tools (`FACEBOOK_CREATE_POST`, `INSTAGRAM_POST_IG_USER_MEDIA` + `_PUBLISH`, `REDDIT_CREATE_REDDIT_POST`). Scheduled posts are flushed lazily on dashboard loads.
6. **Dashboard** (`/`) — visitors over time chart, per-channel breakdown, post performance. Tracked links log each click and 302-redirect to your site with UTM parameters.
7. **Feedback loop** — "Analyze performance" on a campaign feeds real click data back to Gemini, which produces learnings. Those learnings are automatically injected into the next campaign's generation prompt, so the agent improves with every run.

## Setup

```bash
# from repo root
npm install
cd apps/web
cp .env.example .env    # fill in the keys below
npx prisma generate && npx prisma db push
npm run dev             # http://localhost:3001
```

`.env`:

| Var | What |
| --- | --- |
| `DATABASE_URL` | Neon Postgres connection string |
| `GEMINI_API_KEY` | Google AI Studio key (uses `gemini-2.5-flash`) |
| `COMPOSIO_API_KEY` | app.composio.dev → Settings → API keys |
| `REDDIT_SHARED_USER_ID` | any stable id, e.g. `ripple-shared-reddit`. Connect the app's Reddit account once from `/connections` |
| `APP_URL` | public URL of this app — tracked links are built from it |

Instagram publishing requires a Business/Creator account and a **publicly reachable image URL**. Facebook requires a Page. Tracked-link clicks only register when `APP_URL` is reachable by the people clicking (use a tunnel like `cloudflared`/`ngrok` in dev).

## Dev notes

- Postgres via Prisma + Neon (`DATABASE_URL`). `node scripts/seed-demo.mjs` seeds a demo business for UI work.
- Stack: Next.js 16 App Router, Tailwind v4 (design tokens in `app/globals.css`), `@composio/core`, `@google/genai`, Prisma 6.
- Domain logic lives in `lib/`: `kb.ts` (extraction), `campaign.ts` (generation + analysis), `publish.ts` (channel adapters), `composio.ts`, `scrape.ts`.
