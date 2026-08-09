# Ripple: plain site URL + Reddit views (lean cutover)

Date: 2026-08-09  
Status: approved

## Goal

Stop putting Ripple `/r/...` redirect URLs in organic Reddit posts. Use the business website URL so links look trustworthy. Measure success with Reddit **post views** instead of click tracking.

## Decisions

- Link in post: plain `business.websiteUrl` only (no UTMs, no Ripple hop).
- Metric: views only. If Reddit returns null/`view_count` missing → UI shows **—** (unavailable). No score/comments fallback.
- Keep TrackedLink / Click / `/r` code unused for now (no teardown).

## Behavior

### Publish

- Append `Link: <websiteUrl>` when a website URL exists.
- Do not create `TrackedLink` rows for new posts.

### Views storage

- `Post.viewCount Int?`
- `Post.viewsUpdatedAt DateTime?`

### Refresh

- On campaign page load (and optional refresh action): for each published Reddit post with `externalId`, fetch submission stats via Composio.
- Persist `view_count` when present; leave null when unavailable.

### UI / analyze

- Campaign + dashboard: show views instead of clicks.
- Analyze: use view counts; note when unavailable; drop click-based language.

## Out of scope

- Deleting click infrastructure
- Score / comments / UTMs
- Background cron (lazy refresh on page load is enough)
