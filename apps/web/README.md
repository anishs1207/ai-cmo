# Ripple — Organic Growth Autopilot

AI marketing operator for organic social. It reads your website, builds a marketing knowledge base, writes platform-native posts, publishes them to Reddit, tracks every visitor it sends to your site, and learns from each campaign's real performance.

## How it works

1. **Onboarding** — paste your website URL (and/or a description + what to promote). The site is scraped and Gemini 2.5 Flash extracts a structured Business KB: overview, audience segments, USP, pricing, brand voice/tone/personality/identity, testimonials, competitors, objections, target subreddits, content themes.
2. **Knowledge Base** (`/kb`) — review and edit everything the agent believes. All content generation is grounded in this.
3. **Reddit** — configured once by the admin via `REDDIT_SHARED_USER_ID` in server `.env` and a Composio connection (not a user-facing OAuth flow).
4. **Campaigns** (`/campaigns/new`) — pick channels, objective and posts-per-channel. Gemini writes distinct angles per platform (Reddit community-native post with target subreddit). Posts append the plain business website URL (no redirect hop).
5. **Publish** — publish now or schedule. Publishing runs through Composio tools (`REDDIT_CREATE_REDDIT_POST`). Scheduled posts are flushed lazily on dashboard loads.
6. **Dashboard** (`/dashboard`) — post views when Reddit exposes them, per-channel breakdown, post performance. Views refresh via Composio on page load.
7. **Feedback loop** — "Analyze performance" on a campaign feeds real view data back to Gemini, which produces learnings. Those learnings are automatically injected into the next campaign's generation prompt, so the agent improves with every run.

## Roadmap

**Integration rule:** Composio is **Reddit only** — one app-owned account, configured internally via `REDDIT_SHARED_USER_ID` (no user-facing OAuth). Do **not** use Composio for Instagram or Facebook. Wire those through direct APIs (Meta Graph API / Marketing API) or another first-party integration.

### Organic posting — @anish

Add **Instagram** and **Facebook** for normal organic posting and scheduling:

- Add both to `ORGANIC_PLATFORMS` in `lib/composio.ts` (or move platform config to a dedicated module)
- Build direct Meta OAuth + token storage (Facebook Page + Instagram Business account) — **not** Composio
- Replace the existing Composio stubs in `lib/publish.ts` (`FACEBOOK_CREATE_POST`, `INSTAGRAM_POST_IG_USER_MEDIA`, etc.) with direct Graph API calls
- Restore Connections UI and campaign channel pickers; add Instagram image URL field back

Instagram publishing requires a Business/Creator account and a **publicly reachable image URL**. Facebook requires a Page.

### Paid marketing — @anish

Build paid ad flows for **Instagram** and **Facebook** via the **Meta Marketing API** (direct integration, not Composio):

- **Instagram Ads** — Meta OAuth, upload or select creative, fill campaign form (objective, audience, budget, schedule), publish through Marketing API
- **Facebook Ads** — same Meta account connection; run Page/video ad campaigns with full API-required fields

This is a separate flow from organic posting (creative upload, ad set config, campaign scheduling).

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
| `NEON_AUTH_BASE_URL` | Auth URL from Neon Console (Auth tab) |
| `NEON_AUTH_COOKIE_SECRET` | 32+ char secret for session cookies (`openssl rand -base64 32`) |
| `GEMINI_API_KEY` | Google AI Studio key (uses `gemini-2.5-flash`) |
| `COMPOSIO_API_KEY` | app.composio.dev — **Reddit only** (shared app account) |
| `REDDIT_SHARED_USER_ID` | stable id, e.g. `ripple-shared-reddit`. Reddit is connected once in Composio internally — not exposed to end users |
| `APP_URL` | public URL of this app — tracked links are built from it |

**Auth setup:** In the [Neon Console](https://console.neon.tech), open your project → **Auth** → enable Managed Better Auth → copy the Auth URL into `NEON_AUTH_BASE_URL`. Google sign-in works out of the box for development.

Tracked-link clicks only register when `APP_URL` is reachable by the people clicking (use a tunnel like `cloudflared`/`ngrok` in dev).

## Dev notes

- Postgres via Prisma + Neon (`DATABASE_URL`). `node scripts/seed-demo.mjs` seeds a demo business for UI work.
- Stack: Next.js 16 App Router, Tailwind v4 (design tokens in `app/globals.css`), `@composio/core` (Reddit only), `@google/genai`, Prisma 6.
- Domain logic lives in `lib/`: `kb.ts` (extraction), `campaign.ts` (generation + analysis), `publish.ts` (channel adapters), `composio.ts` (Reddit), `scrape.ts`. Meta (IG/FB) should get its own direct API module when built.
