# PolarisGCS Landing Page — Context

## Overview

- Marketing/landing page for **PolarisGCS**, the ground-control-station product built in the sibling `DRONES` workspace (see root `CLAUDE.md` for the actual product architecture).
- Not a lead-gen form or pricing page — it's a single-page **cinematic scroll experience**: the user scrolls through a simulated drone takeoff (video-like frame sequence + animated 3D-ish drone overlay) while a CLI-styled terminal panel auto-advances through product feature "chapters."
- Standalone git repo (`github.com/PolarisGCS/Landing-Page`), nested inside the DRONES project directory but independently versioned and deployed.
- Live target: GitHub Pages, served from the `gh-pages` branch at base path `/Landing-Page/`.

## Structure & Key Files

- `src/main.jsx` → `src/App.jsx` → `src/components/CinematicExperience.jsx` (the entire page is one component tree).
- Two **independent** animation systems living side by side in `CinematicExperience.jsx`:
  1. **Scroll-driven scene** — background + drone. Not tied to the CLI content at all.
     - `Background.jsx`: canvas that scrubs through 480 preloaded JPEGs (`public/frames/f0001.jpg`…`f0480.jpg`) keyed to scroll position — no `<video>` element, just `drawImage` per frame for zero seek/decode latency.
     - `Drone.tsx` + `hooks/useDroneFlight.ts`: GSAP/ScrollTrigger-driven liftoff animation (lift, shake, shadow, rotor wash, dust, spinning propellers with real 3D tilt). Only TS files in the component tree.
     - `Hud.jsx` / `StatLine.jsx`: derived flight telemetry (mode/altitude/battery) computed from scroll progress in `CinematicExperience.jsx` (`telemetryFor()`), pushed via refs (no React state, for perf).
  2. **Self-paced CLI terminal carousel** — `Terminal.jsx`. Auto-advances every 6.5s (`AUTO_MS`) through the `bands` array, independent of scroll; has manual prev/next/pause controls and pauses on hover.
- `src/data/content.js` is the **single source of truth for all copy** — `brand`, `nav`, `platforms`, `bands` (10 chapters), `pipelines`, `metrics`. Editing page copy means editing this file only.
- Each `band.graphic` name resolves to a component in `src/components/cli/` (BootSequence, FleetGrid, Sparkline, RouteMap, Pipeline, AccessMatrix, LogFeed, DeployTargets, BarChart) via the `Graphic` switch in `Terminal.jsx`.

## Tech Stack

- React 19, Vite 8, Tailwind 4 (via `@tailwindcss/vite`).
- GSAP 3 + ScrollTrigger for the scroll-driven drone/camera animation.
- Framer Motion is a dependency but its actual usage wasn't traced through every file — don't assume it's dead code without checking.
- Mixed JS/TS: only `Drone.tsx` and `useDroneFlight.ts` are TypeScript; everything else is JSX. `tsconfig.json` exists for the TS subset.
- ESLint 10, flat config (`eslint.config.js`).
- Google Fonts loaded directly in `index.html`: Space Grotesk, Space Mono, Inter (with preconnect).

## Content & Product Mapping

`content.js`'s header comment states the copy is condensed from real PolarisGCS sources ("the Cloud-GCS SRS, the alignment plan, and the Android gateway playbook"). Each of the 10 `bands` maps to an actual feature described in the DRONES workspace root `CLAUDE.md`:

| Band channel | Real product feature |
|---|---|
| `gcs.session` | General product framing (web/desktop/mobile GCS) |
| `gcs.fleet` | Tier-1 wifi + tier-2 RF, rich/critical budgeting per radio group |
| `gcs.telemetry` | Live telemetry <200ms, Redis fan-out |
| `gcs.mission` | Waypoints → geofence → upload → AUTO (mission upload/ack flow) |
| `gcs.sim` | ArduPilot SITL parity with real hardware |
| `gcs.access` | RBAC roles: operator/planner/observer/admin |
| `gcs.failsafe` | Anomaly alerts, link-loss failsafe, auto RTL |
| `gcs.deploy` | Three deploy targets: web dashboard, desktop gateway, Android gateway |
| `gcs.scale` | 1000+ concurrent drones, 30-day telemetry history |
| `gcs.command` | Connect → plan → fly workflow summary |

**Implication for future edits:** if the real PolarisGCS product's numbers or workflow change (e.g. drones/gateway limit, RBAC roles, deploy targets), `content.js` should be updated to match — it is marketing copy describing the real system, not independent fiction.

## Build & Deploy

```
npm run dev       # vite dev server
npm run build     # vite build
npm run lint      # eslint .
npm run preview   # vite preview
npm run deploy    # vite build --base=/Landing-Page/ && gh-pages -d dist
```

- `deploy` publishes `dist/` to the `gh-pages` branch of this same repo via the `gh-pages` npm package.
- The `--base=/Landing-Page/` flag is required because GitHub Pages serves this repo from a subpath, not the domain root — don't drop it when changing the deploy script.
- Remote: `origin` → `https://github.com/PolarisGCS/Landing-Page.git`.

## Current State

- On `main`, clean working tree, up to date with `origin/main`.
- Branches: `main`, `gh-pages` (deploy target), `landing-page-redesign` (already merged into `main` via PR #1 — historical, not active work).
- History shows the current cinematic scroll design replaced an earlier, simpler Vite template page (`63f2422 refreshed the template` → `c2d0ba5 Redesign landing page with cinematic drone scroll experience` → asset/background cleanup → merge).

## Open Questions / Gaps

- No automated tests and no CI config found — changes aren't verified beyond manual `npm run dev`/lint.
- No analytics or conversion tracking snippet found anywhere in the source — there is no traffic/conversion data to report on because none is being collected.
- Framer Motion is a listed dependency; its actual call sites weren't exhaustively verified in this pass — check before assuming it's unused or before removing it.
- No design file (Figma, etc.) referenced anywhere in the repo — the frame sequence (`public/frames/`) and `drone_body.png` appear to be the only design assets, with no traceable source.
