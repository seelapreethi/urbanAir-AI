# UrbanAir AI — UI/UX Design System

> Design direction: **Linear's precision + Vercel's restraint + Arc's playful chrome.**
> Dense operational data, presented calm. Nothing screams — the data does the talking, the UI gets out of the way.

---

## 0. Design Philosophy

UrbanAir AI is a control room, not a brochure. City officials will have this open for hours. The design has to:

1. **Survive density** — dozens of live metrics, maps, and charts on one screen without feeling like a cockpit.
2. **Earn trust** — every number needs to feel measured, not decorative. No gratuitous gradients on data.
3. **Move with purpose** — motion signals state change (new data, alert, transition), never just "look, animation."
4. **Work at 2am and at noon** — dark mode is the primary mode (ops rooms, night monitoring), light mode is the accessible secondary.

**Signature element:** the **AQI Pulse Ring** — a single glanceable radial indicator (used on the Command Center hero, nav badge, and citizen advisory) that breathes subtly when AQI is live-updating and snaps to a hard stop when it crosses a hazard threshold. It's the one recurring motif that makes the product recognizable in a screenshot.

---

## 1. Color System

Named tokens, not raw Tailwind defaults. Everything else in the app derives from these.

### Core palette

| Token | Hex | Usage |
|---|---|---|
| `--canvas` | `#0B0D10` (dark) / `#FAFAF9` (light) | App background |
| `--surface` | `#14171B` (dark) / `#FFFFFF` (light) | Cards, panels, sidebar |
| `--surface-raised` | `#1B1F24` (dark) / `#FFFFFF` + shadow (light) | Modals, popovers, dropdowns |
| `--border` | `#23272E` (dark) / `#E7E5E2` (light) | Hairlines, dividers |
| `--ink-primary` | `#EDEDEC` (dark) / `#17181A` (light) | Headlines, primary text |
| `--ink-secondary` | `#9A9FA8` (dark) / `#6B6F76` (light) | Body, labels |
| `--ink-tertiary` | `#5C6169` (dark) / `#9B9EA4` (light) | Placeholder, disabled |
| `--accent` | `#5B8CFF` | Primary brand action (electric cobalt — cool, technical, never "AI-purple") |
| `--accent-soft` | `#5B8CFF14` | Accent tints (backgrounds, hover states) |

### AQI Severity Scale (data-critical — used everywhere: rings, badges, map choropleths, charts)

| Level | Range | Hex | Name |
|---|---|---|---|
| Good | 0–50 | `#3DD68C` | Signal Green |
| Moderate | 51–100 | `#E8C547` | Amber Watch |
| Unhealthy (Sensitive) | 101–150 | `#F2994A` | Ember Orange |
| Unhealthy | 151–200 | `#EF5C5C` | Alert Red |
| Very Unhealthy | 201–300 | `#B24FE0` | Violet Warning |
| Hazardous | 301+ | `#7A2E43` | Hazard Maroon |

**Rule:** these six colors are *reserved* for AQI severity only. Never reuse Alert Red for a generic error toast — use a separate `--danger: #FF6B6B` so a user can never mistake a UI error for a pollution spike.

### Semantic UI colors

| Token | Hex | Usage |
|---|---|---|
| `--success` | `#3DD68C` | Confirmations (shared with Good AQI intentionally — both mean "fine") |
| `--warning` | `#E8C547` | Non-AQI warnings |
| `--danger` | `#FF6B6B` | Errors, destructive actions |
| `--info` | `#5B8CFF` | Same as accent — informational = brand |

Dark mode is default; light mode swaps canvas/surface/ink but **keeps accent and AQI scale identical** — severity color meaning must never shift between themes.

---

## 2. Typography

| Role | Typeface | Notes |
|---|---|---|
| Display / Headlines | **Geist** (Vercel's typeface) | Used at large sizes only (H1–H2). Technical, geometric, not overused. |
| Body / UI | **Inter** | All body copy, labels, nav, buttons — the workhorse. |
| Data / Numerals | **Geist Mono** | AQI numbers, coordinates, timestamps, chart axis labels. Tabular figures so numbers don't jitter when they update live. |

### Type scale (rem, 1rem = 16px)

| Token | Size | Weight | Line-height | Usage |
|---|---|---|---|---|
| `display-lg` | 3.5rem | 600 | 1.05 | Landing hero only |
| `display-sm` | 2.25rem | 600 | 1.1 | Page titles (Command Center, etc.) |
| `h1` | 1.75rem | 600 | 1.2 | Section headers |
| `h2` | 1.25rem | 600 | 1.3 | Card titles |
| `h3` | 1rem | 600 | 1.4 | Subsection labels |
| `body` | 0.9375rem | 400 | 1.55 | Paragraphs, descriptions |
| `body-sm` | 0.8125rem | 400 | 1.5 | Secondary text, table cells |
| `caption` | 0.75rem | 500 | 1.4 | Labels, eyebrows, timestamps (uppercase, +0.04em tracking) |
| `data-xl` | 3rem | 600 | 1 | Hero AQI number (Geist Mono) |
| `data-lg` | 1.5rem | 600 | 1.1 | Card metric numbers (Geist Mono) |

---

## 3. Spacing, Radius, Elevation

**Spacing scale** (4px base unit — strict adherence, no arbitrary values):
`4, 8, 12, 16, 20, 24, 32, 40, 48, 64, 80, 96` px → Tailwind `1, 2, 3, 4, 5, 6, 8, 10, 12, 16, 20, 24`

| Context | Spacing |
|---|---|
| Card internal padding | 20px (mobile) / 24px (desktop) |
| Gap between cards in a grid | 16px |
| Section vertical rhythm | 32–48px |
| Sidebar item padding | 8px 12px |
| Page margin (desktop) | 32px |
| Page margin (mobile) | 16px |

**Radius:**
- `rounded-md` (8px) — buttons, inputs, small chips
- `rounded-lg` (12px) — cards, panels
- `rounded-xl` (16px) — modals, the Pulse Ring container
- `rounded-full` — avatars, badges, the Pulse Ring itself

**Elevation** (dark-mode-first, so shadows are subtle — layering is mostly done via `--surface` vs `--surface-raised` + a 1px border, not drop shadow):
- `shadow-sm`: `0 1px 2px rgba(0,0,0,0.24)` — resting cards
- `shadow-md`: `0 8px 24px rgba(0,0,0,0.32)` — dropdowns, popovers
- `shadow-lg`: `0 16px 48px rgba(0,0,0,0.4)` — modals

---

## 4. Layout Architecture

### 4.1 App Shell (desktop ≥1280px)

```
┌──────────────────────────────────────────────────────────────────────────┐
│ TOPBAR  (64px height)                                                     │
│ [☰] UrbanAir AI    [City: Vijayawada ▾]   [🔍 Search/Cmd+K]  [🔔] [🌙] [👤]│
├───────────┬────────────────────────────────────────────────────────────--┤
│ SIDEBAR   │  PAGE CONTENT AREA                                            │
│ (72/240px)│  ┌──────────────────────────────────────────────────────┐    │
│           │  │ Page header: Title · Breadcrumb · Actions              │   │
│ ⬡ Command │  ├──────────────────────────────────────────────────────┤    │
│   Center  │  │                                                        │   │
│ ⬡ Source  │  │        [ scrollable content / widget grid ]           │   │
│   Map     │  │                                                        │   │
│ ⬡ Forecast│  │                                                        │   │
│ ⬡ Enforce │  │                                                        │   │
│   -ment   │  │                                                        │   │
│ ⬡ Cities  │  │                                                        │   │
│ ⬡ Advisory│  │                                                        │   │
│ ⬡ Simulator  │                                                        │   │
│ ⬡ Reports │  │                                                        │   │
│ ---       │  └──────────────────────────────────────────────────────┘    │
│ ⬡ Chat AI │  (Chat Assistant docks as a right-side slide-over, not a page)│
│ ⬡ Settings│                                                              │
└───────────┴──────────────────────────────────────────────────────────────┘
```

- **Sidebar** collapses to 72px icon-rail on toggle (Linear-style), full 240px with labels by default. State persisted.
- **Topbar** city switcher is the global context — every page reacts to it. Command+K opens a global command palette (search wards, jump to module, ask AI).
- **Chat Assistant** is *not* a nav destination — it's a persistent slide-over panel (like Intercom/Linear's AI), summonable from any page via a floating action button (bottom-right) or `Cmd+J`. Keeps RAG assistant contextual to whatever page you're on.

### 4.2 Responsive breakpoints

| Breakpoint | Width | Sidebar | Grid |
|---|---|---|---|
| `mobile` | <640px | Hidden → bottom tab bar (5 icons max) + hamburger for rest | 1 col |
| `tablet` | 640–1024px | Collapsed icon-rail, overlay on tap | 2 col |
| `desktop` | 1024–1440px | Full sidebar, collapsible | 3 col |
| `wide` | ≥1440px | Full sidebar | 4 col, max-width 1600px content, centered |

### 4.3 Mobile shell

```
┌───────────────────────┐
│ ☰  UrbanAir AI    🔔 👤│  ← topbar, 56px
├───────────────────────┤
│                       │
│   [ stacked cards ]   │
│                       │
│                       │
├───────────────────────┤
│ ⬡    🗺️    📈   ⚠️  💬 │  ← bottom tab bar, 64px
│Home  Map  Trend Alert Chat│
└───────────────────────┘
```

---

## 5. Page Hierarchy & Site Map

```
/                          Landing Page (public, marketing)
/login                     Auth
/dashboard                 → AI Command Center (default post-login route)
/dashboard/source-map      Geospatial Source Attribution
/dashboard/forecast        Hyperlocal AQI Forecast
/dashboard/enforcement     Enforcement Intelligence
/dashboard/cities          Multi-City Comparison
/dashboard/advisory        Citizen Health Advisory (also public-facing, simplified)
/dashboard/simulator       Scenario Simulator
/dashboard/reports         Report Generator
   /reports/[id]           Generated report viewer / PDF preview
/settings                  Account, city config, language, notification prefs
```

**Global overlay (not routes):** AI Chat Assistant slide-over, Command Palette (Cmd+K), Notification drawer.

---

## 6. User Flows

### 6.1 Primary flow — City Administrator morning check

```
Login → Command Center (default)
  → sees AQI Pulse Ring + Top Risks banner
  → clicks a hotspot ward on mini-map
      → deep-links to Source Attribution (ward pre-filtered)
      → reviews confidence-scored source breakdown
  → opens Scenario Simulator
      → tests "reduce traffic 30%" → sees predicted AQI delta
  → generates Daily Report → exports PDF
  → done (habitual loop, <5 min)
```

### 6.2 Secondary flow — Citizen quick check (mobile-first, public advisory page)

```
Land on /dashboard/advisory (no login required)
  → auto-detect or select ward
  → see today's AQI + plain-language health advice
  → optional: switch language
  → optional: enable push alert for their ward
```

### 6.3 Investigative flow — Enforcement officer

```
Enforcement Intelligence page
  → ranked hotspot list (table + map split view)
  → click hotspot → side panel: evidence timeline, confidence score, satellite snapshot
  → "Generate Inspection Brief" action → PDF handoff
```

**Flow principle:** every module is reachable in ≤2 clicks from Command Center. The Command Center is the hub; all other modules are spokes that can deep-link back to a filtered view of any other spoke (ward-level context always carries across pages via URL query params, e.g. `?ward=12`).

---

## 7. Navigation & Sidebar Detail

- **Active state:** left accent bar (2px, `--accent`) + `--accent-soft` background tint + icon fills solid (outline → filled icon swap, Linear-style).
- **Icons:** Lucide, 20px, stroke-width 1.75.
- **Grouping:** a subtle `---` divider separates "Monitoring & Intelligence" modules from "Tools" (Simulator, Reports) and "AI" (Chat).
- **Badge:** unread alerts show a small `--danger` dot on the Command Center nav item, not a number (reduces visual noise).
- **Sidebar footer:** collapsed city name + AQI Pulse Ring mini (12px) — the current city's live status is visible even while navigating elsewhere.

---

## 8. Component Library (ShadCN mapping)

| UrbanAir Component | Built from ShadCN primitive(s) | Notes |
|---|---|---|
| `MetricCard` | `Card` | Custom — label, `data-lg` number, trend arrow, sparkline |
| `AQIPulseRing` | Custom SVG (no ShadCN base) | Signature element — radial progress + breathing animation |
| `SeverityBadge` | `Badge` | Maps to AQI Severity Scale colors |
| `WardMap` | Custom (Leaflet) wrapped in `Card` | Choropleth using severity scale |
| `TrendChart` | Custom (Recharts) in `Card` | Line/area charts, `--accent` default series |
| `ForecastTimeline` | `Tabs` (24h/48h/72h) + custom chart | |
| `HotspotTable` | `Table` + `Badge` + `Avatar` (for ward icons) | Sortable, sticky header |
| `ScenarioControls` | `Slider`, `Switch`, `Select` inside `Card` | Live-updating result panel beside controls |
| `ChatPanel` | `Sheet` (right slide-over) + custom message bubbles | |
| `CommandPalette` | `Command` (cmdk) | Cmd+K global |
| `Sidebar` | Custom (ShadCN has no native sidebar — built on `NavigationMenu` primitives) | |
| `Topbar` | Custom flex layout + `DropdownMenu` (city switcher, user menu) | |
| `NotificationDrawer` | `Sheet` (top or right) | |
| `ReportPreview` | `Dialog` or dedicated route + `ScrollArea` | |
| `ConfidenceIndicator` | Custom (small horizontal bar, not a ShadCN default) | Used in Explainable AI everywhere predictions appear |
| `EmptyState` | Custom, illustration + `Button` | |
| `Toast` | `Sonner` (ShadCN's recommended toast) | |
| Forms (settings, alerts) | `Form` + `Input` + `Select` + `Checkbox` (react-hook-form + zod) | |

---

## 9. Key Screen Wireframes (ASCII)

### 9.1 Landing Page

```
┌──────────────────────────────────────────────────────────────┐
│  UrbanAir AI                             Features  Docs  [Login]│
├──────────────────────────────────────────────────────────────┤
│                                                                │
│      From Monitoring Pollution                                │
│      to Preventing It.                        ⬡ AQI Pulse    │
│                                                Ring (live demo,│
│      AI-powered decision support               animated,     │
│      for smarter, cleaner cities.               idle city)    │
│                                                                │
│      [ Explore the Platform → ]  [ Watch Demo ]               │
│                                                                │
├──────────────────────────────────────────────────────────────┤
│   "Instead of AQI = 250, we explain WHY, WHAT'S NEXT, WHO,    │
│    and WHAT TO DO."   ← signature explainer strip             │
├──────────────────────────────────────────────────────────────┤
│  ⬡ Command Center   ⬡ Source Attribution   ⬡ Forecast         │
│  ⬡ Enforcement      ⬡ Multi-City           ⬡ Chat Assistant   │
│   (feature grid, 3-col desktop / 1-col mobile, icon + 1-liner)│
├──────────────────────────────────────────────────────────────┤
│  Built for Municipal Corporations & Pollution Control Boards  │
│  [ Request Access ]                                           │
└──────────────────────────────────────────────────────────────┘
```

### 9.2 AI Command Center (Dashboard Home)

```
┌────────────────────────────────────────────────────────────────┐
│ Command Center                          [Export] [Refresh ⟳]   │
├──────────────────┬───────────────────────┬─────────────────────┤
│                  │                       │                     │
│   ⬡ AQI PULSE    │  TOP RISKS TODAY      │  AI INSIGHT          │
│      RING        │  ● Ward 12 — 214 🔴   │  "AQI rose 18%       │
│     147           │  ● Ward 7  — 189 🟠   │  overnight, driven   │
│   Unhealthy(S)    │  ● Ward 3  — 165 🟠   │  primarily by         │
│   ▲ +12 vs yday   │  [View all →]         │  construction dust   │
│                  │                       │  near Ward 12."       │
├──────────────────┴───────────────────────┴─────────────────────┤
│  TODAY'S SUMMARY (full-width strip)                             │
│  ── 6AM ──── 9AM ──── 12PM ──── 3PM ──── 6PM ──── 9PM ──        │
│  [ hourly AQI sparkline, current time marker ]                  │
├───────────────────────────────┬──────────────────────────────---┤
│  72H FORECAST                 │  RECOMMENDED ACTIONS              │
│  [ line chart, 3 bands ]      │  1. Restrict heavy vehicles       │
│                                │     on Ring Rd  → −14 AQI (est.) │
│                                │  2. Water-spray Ward 12 site      │
│                                │     → −9 AQI (est.)               │
│                                │  [Simulate all →]                 │
└───────────────────────────────┴──────────────────────────────---┘
```

### 9.3 Geospatial Source Attribution

```
┌────────────────────────────────────────────────────────────────┐
│ Source Attribution                 [Ward: All ▾] [Date: Today▾]│
├───────────────────────────────────┬──────────────────────────--┤
│                                    │  WARD 12 — DETAIL           │
│      [ Leaflet map, full height ] │  ┌────────────────────────┐│
│      choropleth by dominant       │  │ Traffic      62% ▓▓▓▓▓▓││
│      source, click ward to        │  │ Construction 24% ▓▓     ││
│      populate right panel         │  │ Industry     10% ▓       ││
│                                    │  │ Waste Burn    4% ▓       ││
│      [legend: 🚗 🏗️ 🏭 🔥]        │  └────────────────────────┘│
│                                    │  Confidence: ▓▓▓▓▓▓▓░░ 78%  │
│                                    │  "High traffic density +    │
│                                    │   idle-time sensors align   │
│                                    │   with NO2 spike pattern."  │
└───────────────────────────────────┴──────────────────────────--┘
```

### 9.4 Scenario Simulator

```
┌────────────────────────────────────────────────────────────────┐
│ Scenario Simulator                                              │
├───────────────────────┬──────────────────────────────────────--┤
│  CONTROLS              │  PREDICTED IMPACT                       │
│                        │                                         │
│  Traffic reduction     │   Current AQI        Predicted AQI      │
│  [────●──────] 30%     │      147      →         118             │
│                        │                                         │
│  Construction pause    │   [ before/after bar comparison ]       │
│  ( ) Off  (●) On       │                                         │
│                        │   Confidence: 71%                       │
│  Rain tomorrow         │   Reasoning: "Traffic contributes ~40%  │
│  ( ) No   (●) Yes      │   of NO2 load in this ward; a 30% cut   │
│                        │   historically yields ~20% AQI drop."   │
│  [ Reset ]  [ Apply ]  │                                         │
└───────────────────────┴──────────────────────────────────────--┘
```

### 9.5 AI Chat Assistant (slide-over, any page)

```
                                    ┌─────────────────────────┐
                                    │ AI Assistant         [×] │
                                    ├─────────────────────────┤
                                    │  🤖 Ward 12's AQI is high│
                                    │  mainly due to           │
                                    │  construction dust and   │
                                    │  traffic congestion...   │
                                    │                           │
                                    │              🧑 Why is it │
                                    │              worse than   │
                                    │              yesterday? ─┤
                                    │                           │
                                    │  🤖 [streaming response] │
                                    ├─────────────────────────┤
                                    │ Ask about forecasts,     │
                                    │ sources, or actions...   │
                                    │ [___________________] ➤ │
                                    └─────────────────────────┘
```

---

## 10. Motion & Animation

**Principle:** motion communicates *state change*, not decoration. Respect `prefers-reduced-motion` everywhere — fall back to instant/opacity-only transitions.

| Interaction | Animation | Duration/Easing |
|---|---|---|
| Page transition | Fade + 8px slide-up | 200ms `ease-out` |
| Card entrance (dashboard load) | Staggered fade-up, 40ms stagger per card | 300ms `ease-out` |
| AQI Pulse Ring (idle/live) | Subtle scale breathing (1.0 → 1.02) | 3s loop `ease-in-out` |
| AQI Pulse Ring (threshold crossed) | Hard color snap + single sharp pulse (not loop) | 400ms `spring` |
| Sidebar collapse/expand | Width transition | 200ms `ease-in-out` |
| Number counters (AQI values updating) | Roll/count-up animation | 500ms `ease-out` |
| Chart draw-in | Line path draws left→right on first render only | 600ms `ease-out` |
| Hover (cards, buttons) | Scale 1.0→1.01 + shadow lift | 150ms `ease-out` |
| Modal/Sheet open | Slide + fade | 250ms `spring(damping: 26)` |
| Toast | Slide-in from bottom-right, auto-dismiss | 4s hold |
| Map marker on hover | Scale pop + tooltip fade | 120ms |

No parallax, no scroll-jacking, no gratuitous gradient shimmer loading states — use skeleton pulses (`--surface-raised` shimmer, 1.5s loop) instead.

---

## 11. Dark Mode

- **Dark is default and primary.** Toggle lives in topbar (sun/moon icon), persisted via `next-themes` (cookie + localStorage-free approach compatible with SSR).
- Theme switch itself animates: 300ms crossfade of `--canvas`/`--surface` tokens, no jarring flash.
- AQI severity colors are **identical** across themes — only backgrounds/ink/borders swap. This is non-negotiable: color meaning must stay constant.
- Maps: dark mode uses a custom dark Leaflet tile layer (CartoDB Dark Matter or similar free tile source); light mode uses a clean light tile set. Choropleth overlay colors unchanged.
- Charts: gridlines drop to 8% opacity in dark mode, 12% in light — axis labels use `--ink-secondary` in both.

---

## 12. Accessibility

- All interactive elements: visible focus ring (`2px solid --accent`, 2px offset) — never `outline: none` without replacement.
- Color is never the only signal: severity badges always pair color with a text label ("Unhealthy") and an icon, for colorblind users.
- Minimum contrast: body text 4.5:1, large text 3:1 (validated against both themes).
- All charts/maps have a text-equivalent summary (e.g. "AQI 147, Unhealthy for Sensitive Groups, up 12 from yesterday") available to screen readers via `aria-label`, not just visual.
- Keyboard: full app navigable without mouse — sidebar, command palette (Cmd+K), chat, all forms.
- Motion: `prefers-reduced-motion: reduce` disables breathing/stagger/count-up animations, keeps only opacity fades.
- Touch targets ≥44px on mobile.
- Language switcher (for Citizen Advisory) uses native `<html lang>` updates, not just visual text swap.

---

## 13. Design Tokens Summary (for Tailwind config handoff)

```
colors:
  canvas, surface, surface-raised, border, ink-{primary,secondary,tertiary}
  accent, accent-soft, danger, warning, success, info
  aqi-{good,moderate,unhealthy-sensitive,unhealthy,very-unhealthy,hazardous}

fontFamily:
  display: Geist
  body: Inter
  mono: Geist Mono

borderRadius: { md: 8px, lg: 12px, xl: 16px, full: 9999px }

spacing: 4px base scale (1–24 Tailwind units, no arbitrary values)

shadow: { sm, md, lg } — dark-mode-calibrated
```

---

## 14. What's Intentionally NOT Generic

- No purple/blue AI gradient anywhere — accent is a single flat cobalt, AI-ness is communicated through the *reasoning UI* (confidence bars, "why" explanations), not decoration.
- No numbered "01 / 02 / 03" feature markers on the landing page — the modules aren't a sequence, so they're presented as a grid.
- No generic dashboard "gauge cluster" — the Pulse Ring is the one radial element, used sparingly and consistently, not spammed across every card.
- Loading states are boring on purpose (skeleton shimmer), never a spinning logo or "AI is thinking..." — the product is meant to feel like infrastructure, not a chatbot toy.

---

*This document is the frontend source of truth. All component builds should derive tokens, spacing, and motion values from here rather than introducing new ad-hoc values.*