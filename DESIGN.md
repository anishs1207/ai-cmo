---
name: Ripple
description: Organic growth autopilot — calm craft confident olive system
colors:
  olive-bg: "#e8ecd0"
  app-canvas: "#f9faf3"
  ink: "#3e4229"
  muted: "#656b37"
  border: "#cfd3a8"
  card: "#f5f6e2"
  sidebar: "#1a1717"
  sidebar-fg: "#eef0d8"
  primary: "#3e4229"
  primary-fg: "#ffffff"
  soft-olive: "#d6de9d"
  green: "#3d7a4a"
  red: "#b54a4a"
  amber: "#8a6a1f"
typography:
  display:
    fontFamily: "Geist, system-ui, sans-serif"
    fontSize: "clamp(2.75rem, 8vw, 5.5rem)"
    fontWeight: 500
    lineHeight: 1.05
    letterSpacing: "-0.03em"
  title:
    fontFamily: "Geist, system-ui, sans-serif"
    fontSize: "1.75rem"
    fontWeight: 600
    lineHeight: 1.2
    letterSpacing: "-0.02em"
  body:
    fontFamily: "Geist, system-ui, sans-serif"
    fontSize: "0.9375rem"
    fontWeight: 400
    lineHeight: 1.5
    letterSpacing: "0"
rounded:
  sm: "8px"
  md: "12px"
  lg: "16px"
spacing:
  sm: "8px"
  md: "16px"
  lg: "24px"
  xl: "48px"
components:
  button-primary:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.primary-fg}"
    rounded: "{rounded.md}"
    padding: "12px 20px"
  button-primary-active:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.primary-fg}"
    rounded: "{rounded.md}"
    padding: "12px 20px"
  button-secondary:
    backgroundColor: "transparent"
    textColor: "{colors.ink}"
    rounded: "{rounded.md}"
    padding: "12px 20px"
  sidebar:
    backgroundColor: "{colors.sidebar}"
    textColor: "{colors.sidebar-fg}"
    rounded: "0"
---

# Design System — Ripple

## Overview

Ripple’s visual system is inspired by [openhuman](https://github.com/icyzh/openhuman): olive marketing canvas, soft app canvas, near-black structural sidebar, ink-olive type. Personality is **calm · craft · confident**. Marketing commits to color; product stays restrained with the same tokens. Motion follows Emil Kowalski (ease-out, ≤250ms UI, press scale) and Apple fluid feedback (instant press, reduced-motion crossfades).

## Colors

| Role | Hex | Use |
|------|-----|-----|
| Marketing bg | `#e8ecd0` | Landing, auth wash |
| App canvas | `#f9faf3` | Dashboard content area |
| Card | `#f5f6e2` | Surfaces on canvas |
| Ink / primary | `#3e4229` | Text, primary buttons |
| Muted | `#656b37` | Secondary text |
| Border | `#cfd3a8` | Hairlines |
| Sidebar | `#1a1717` | App chrome |
| Soft olive | `#d6de9d` | Dark-mode accents / sidebar highlights |

Semantic: green `#3d7a4a`, red `#b54a4a`, amber `#8a6a1f` — always paired with text labels.

## Typography

Single family: **Geist**. Landing uses fluid display (`clamp` up to ~5.5rem), negative tracking. Product uses fixed rem scale (title 1.75rem → body 0.9375rem → caption 0.75rem). `text-wrap: balance` on headings.

## Elevation

Prefer borders over heavy shadows. Soft shadow only on floating toasts and primary CTAs: `0 8px 24px rgba(62, 66, 41, 0.12)`. Sidebar is opaque near-black (material weight), not stacked glass.

## Components

- **Primary button**: ink fill, white text, `scale(0.97)` on `:active`, 160ms ease-out
- **Secondary**: border `#cfd3a8`, transparent fill
- **Sidebar**: dark, active item soft olive tint, no page-load stagger
- **Chips**: tinted olive/semantic soft backgrounds
- **Inputs**: border `#cfd3a8`, focus ring muted olive
- **Cards**: use sparingly — only for interactive clusters (campaign rows, post editors)

## Do's and Don'ts

**Do**
- Lead landing with the brand name as a hero-level signal
- Keep product motion to state/feedback only
- Use olive as atmosphere, ink for action
- Gate hover transforms behind `@media (hover: hover)`

**Don't**
- Purple gradients, cream/sand AI defaults, or Apple system-blue chrome
- `transition: all`, `scale(0)` entrances, or `ease-in` on UI
- Identical icon-card grids or uppercase eyebrows on every section
- Animate keyboard-driven navigation
