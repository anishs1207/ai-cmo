# Ripple UI Redesign — Approach B

## Goal
Premium olive visual system (openhuman-inspired) across landing + product. Keep data/forms; redesign chrome and hierarchy.

## Routing
- `/` — public marketing landing
- `/dashboard` — former `/` dashboard (auth)
- Proxy: allow `/` public; protect `/dashboard`, campaigns, kb, onboarding

## Tokens
See DESIGN.md / globals.css — olive-bg, app-canvas, ink, dark sidebar.

## Surfaces
1. Landing: brand hero, one headline, CTA, how-it-works, track loop
2. Auth/onboarding: olive wash
3. Shell: dark sidebar + light canvas
4. Dashboard/campaigns/KB: restyled with same tokens

## Motion
Emil ease-out, press 0.97, toasts ≤250ms enter; reduced-motion = opacity only.
