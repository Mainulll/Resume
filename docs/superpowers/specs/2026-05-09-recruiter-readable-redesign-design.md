# Recruiter-Readable Redesign — Design Spec

**Date:** 2026-05-09
**Author:** Minul Lokuliyana + Claude
**Status:** Draft — pending user review
**Supersedes:** `2026-04-12-resume-site-redesign-design.md`

## Overview

Strip the resume site back to a recruiter-first, content-first single-page CV. Removes the decorative animation system (loading screen, dot grid, cursor glow, mesh orbs, animated gem, spotlight cards, magazine layout). Adds a proper light/dark theme that follows OS preference with a remembered override toggle. Rewrites copy throughout to align with Minul's actual positioning: project & programme coordination, communication and stakeholder connection, with technical fluency as a force multiplier — not as the lead identity.

## Goals

1. **Mobile-friendly without compromise.** Single-column from the start; nothing hides on a phone.
2. **Optimised for human readability.** Body text at 16px / 1.65 line-height, ~70-character line length, AA-contrast in both themes.
3. **Recruiter-optimised.** A hiring manager scanning for 10 seconds gets: name, role identity, what value Minul brings, current credential, and a clear "Download Resume" path. Section structure mirrors the order recruiters care about (Experience → Skills → Projects → Education → Leadership).
4. **Dark mode toggle.** Follows `prefers-color-scheme`, persists override to `localStorage`, no flash on first paint.
5. **Simple and easy.** Less code, fewer files, no decorative layers competing with the content.

## Non-Goals

- No animation system rebuild beyond a single shared scroll-fade-up.
- No 3D / WebGL.
- No copy that fabricates experience or quantifies things that aren't already quantified.
- No backwards-compatibility with the previous spec's design language. Old spec is superseded.

## Architecture Approach

**Approach A — refactor in place.** `src/App.jsx` is rewritten as a single component file with the existing data object preserved (and updated copy). All CSS moves out of the inline `<style>` template literal into `src/index.css`, where it uses CSS variables on `[data-theme]` for light/dark theming. `src/Scene3D.jsx` is deleted. No new dependencies. Diff is large in App.jsx but the file shrinks ~70% (target ~400 lines vs current 1413).

## Visual Identity

### Tokens (CSS variables on `:root[data-theme="..."]`)

| Token            | Light                  | Dark                   | Notes                                    |
|------------------|------------------------|------------------------|------------------------------------------|
| `--bg`           | `#ffffff`              | `#0b1020`              | Page background                          |
| `--surface`      | `#f6f7f9`              | `#11172a`              | Card background                          |
| `--surface-2`    | `#eef0f4`              | `#172038`              | Code/tag background                      |
| `--border`       | `#e5e7eb`              | `#1f2a44`              | Card / divider                           |
| `--text`         | `#0f172a`              | `#e6edf7`              | Primary text                             |
| `--text-muted`   | `#475569`              | `#9aa6bd`              | Meta / supporting text (≥4.5:1 both)     |
| `--accent`       | `#0a66ff`              | `#7aa8ff`              | Links, focus ring, primary CTA           |
| `--accent-soft`  | `#e8efff`              | `#1a274a`              | CTA hover bg, accent chip bg             |
| `--accent-text`  | `#ffffff`              | `#0b1020`              | Text on solid `--accent` button          |
| `--focus`        | `#0a66ff` @ 35% alpha  | `#7aa8ff` @ 45% alpha  | Focus ring outline                       |

Single accent (deep blue light / soft blue dark). All previous gradients (cyan→indigo, violet→pink, emerald→teal) removed.

### Typography

- Family: Inter (already loaded). Fallback stack stays.
- Body: `1rem` (16px), `line-height: 1.65`, `letter-spacing: 0`.
- Modular scale (1.25 ratio): `1rem → 1.25 → 1.563 → 1.953 → 2.441`.
  - h1 (hero name): `clamp(2.25rem, 5vw, 2.75rem)`, `letter-spacing: -0.02em`.
  - h2 (section titles): `clamp(1.5rem, 3vw, 1.75rem)`, `letter-spacing: -0.015em`.
  - h3 (role title, project name, pillar): `1.125rem`.
- All other text inherits `1rem`. Meta text (period, location, eyebrow): `0.875rem`, `--text-muted`.
- Max line length: container `max-width: 720px`.

### What's Removed Entirely

| Element                  | Removed because                                                            |
|--------------------------|----------------------------------------------------------------------------|
| Loading screen           | 1.2–2.4s delay before content. Recruiters bounce.                          |
| Dot grid canvas          | Decorative; competes with content; mobile disables it anyway.              |
| Cursor glow              | Desktop-only flourish, no informational value.                             |
| Gradient mesh orbs       | Adds visual noise, makes contrast unpredictable in light mode.             |
| Animated SVG gem         | Brand mark replaced with a tiny static SVG diamond in the nav.             |
| Spotlight hover effect   | Decorative, mouse-only, doesn't translate to mobile or keyboard.           |
| Animated stat counters   | Numbers already appear inside Experience bullets (e.g. $50M, 100K+).       |
| Magazine asymmetric grid | Hurts mobile, hurts scannability, hurts maintainability.                   |
| Floating pill nav + FAB  | Two distinct nav UIs for one job. Replaced with one sticky top bar.        |
| Open-to fixed banner     | Inlined into hero as a chip; one less floating layer.                      |
| `backdrop-filter` glass  | Not needed without the layered backgrounds; cheaper rendering.             |
| Section subtitles        | Decorative filler ("Six industries. One consistent thread…"). Drops three.  |
| Footer "quote" line      | "Always bringing the perspective" — vague; replaced with a single CTA line.|

### What Stays

- Inter font, AU English copy.
- Section IDs and anchor scroll (`#experience`, `#skills`, …).
- `framer-motion` (used only for one shared scroll-reveal helper).
- Resume PDF link, mailto, tel, LinkedIn, GitHub, website URL.
- `prefers-reduced-motion` support (now collapses fade-up to instant).
- Resume content data structure (`data` object); copy inside it changes.

## Theming

### Behaviour

- On first paint, `data-theme` is set on `<html>` by an inline script in `index.html` (before React hydrates). Order:
  1. If `localStorage.theme === 'dark' || 'light'` → use it.
  2. Else use `matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'`.
- React `useTheme()` hook mirrors that logic and exposes `[theme, toggle]`.
- A persistent `localStorage.theme-override = '1'` is set the first time the user clicks the toggle. From then on, OS theme changes are ignored. (Until override is cleared.)
- Toggle button lives top-right in the nav. `aria-pressed` reflects current state. `aria-label` reads "Switch to light theme" / "Switch to dark theme".
- `<meta name="theme-color">` is updated on theme change so the mobile chrome bar matches.

### No-flash inline script (`index.html` `<head>`)

```html
<script>
  (function () {
    try {
      var t = localStorage.getItem('theme');
      if (t !== 'light' && t !== 'dark') {
        t = matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
      }
      document.documentElement.setAttribute('data-theme', t);
    } catch (e) {}
  })();
</script>
```

The existing `body { background: #020617 }` instant-paint style is removed (it would override light mode).

## Layout

### Page structure (top to bottom)

1. **Sticky top nav** — 56px, full width, blurred-on-scroll background.
   - Left: tiny static SVG diamond (24×24) + name in caps.
   - Centre (desktop ≥640px): section anchor links — `Experience · Skills · Projects · Education · Leadership`.
   - Right: theme toggle button + `Resume` link button.
   - Under 640px: section links collapse into a `Menu` disclosure that expands as a vertical list below the nav.

2. **Hero** — ~70vh minimum, `padding: 6rem 1.5rem`, max-width 720, centre-aligned.
   - Eyebrow: `Melbourne, Australia` (no separate banner).
   - h1: name.
   - Role pill: `Business Analytics & Cybersecurity · Monash University`.
   - Open-to chip: `● Open to graduate roles — project & programme management, analytics, strategy · Nov 2026`.
   - Pitch paragraph: see Copy section.
   - CTA row: `Download Resume` (primary, solid `--accent`) + `Contact` (secondary, outlined). Contact opens an inline split — `Mobile` / `Email` — same UX as today, simplified styling.
   - Inline link row: `LinkedIn · GitHub · Email` as plain text links.

3. **Experience** (`#experience`) — section title, then a vertical list of 5 role cards. Each card:
   - h3 role title.
   - Sub-line: company · period · location, all in `--text-muted`.
   - Bullet list, no decorative bullet glyph beyond a clean `•`.
   - Newest first.

4. **Skills** (`#skills`) — 2×2 grid of pillar cards. Each card has a title (h3) and a tag list. Order: Programme & Project Management → Data & Engineering → AI & Automation → Cloud, Tooling & Certifications. Single column under 640px.

5. **Projects** (`#projects`) — 3 cards stacked vertically. Each card: project name (h3), role badge (small text), one-paragraph description, tech line (`--text-muted`), link.

6. **Education** (`#education`) — single card: degree (h3), institution, dates, majors, coursework (italic), highlight bullets.

7. **Leadership** (`#leadership`) — 4 small cards stacked. Title, org, period, one-line description.

8. **Footer / Contact** (`#contact`) — name, "Let's talk.", email + mobile + LinkedIn + GitHub + website as a wrapped row of links. No glass card, no quote.

### Spacing

| Breakpoint     | Section padding (top/bot) | Gutter | Card padding |
|----------------|---------------------------|--------|--------------|
| ≥1024px        | 6rem                      | 1.5rem | 1.5rem 1.75rem |
| 640–1023px     | 4.5rem                    | 1.25rem| 1.25rem 1.5rem |
| <640px         | 3rem                      | 1rem   | 1.25rem      |

Container `max-width: 720px`, centred.

### Responsive

- Single-column from the smallest breakpoint up. Skills 2×2 collapses to 1 column under 640px.
- Top nav links collapse into a disclosure under 640px.
- No `backdrop-filter` anywhere.
- Touch targets ≥44×44px.
- Safe-area insets honoured on the bottom of the page (footer padding) and top (sticky nav).

## Animation

One shared helper:

```jsx
function FadeUp({ children, delay = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.35, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  )
}
```

Used to wrap each section's title block and each card. `staggerChildren` is not used — card delays are passed by index (`i * 0.06`).

CSS hover transitions: 150ms `ease` on `color` / `background` / `border-color` / `transform`. Buttons get `transform: translateY(-1px)` on hover, no scale.

`prefers-reduced-motion` disables `FadeUp` (renders content at final state immediately) and disables the hover transform.

## Component Architecture

`src/App.jsx` (~400 lines) contains:

- `data` object (rewritten copy — see below).
- `useTheme()` hook (inline, ~20 lines).
- `FadeUp` component.
- `Nav` component (sticky top bar + theme toggle + mobile disclosure).
- `Hero` component.
- `Experience`, `Skills`, `Projects`, `Education`, `Leadership`, `Footer` — each ~30–50 lines, defined in this file.
- `App` default export wires them together.

`src/index.css` (~250 lines) holds:

- Reset (`*, *::before, *::after`) and base.
- `:root` light tokens, `:root[data-theme="dark"]` dark tokens.
- `.container`, typography, link, button, card, tag, list, focus-ring utilities.
- One `@media (max-width: 640px)` block and one `@media (prefers-reduced-motion: reduce)` block.

`src/Scene3D.jsx` — **deleted**.

`index.html` — meta updates + inline pre-paint theme script + `theme-color` meta hooked to `[data-theme]`.

`package.json` — no changes (`framer-motion`, `react`, `react-dom` only).

## Accessibility

- Real landmarks: `<header>` (nav), `<main>`, `<section>` per content section, `<footer>`.
- Skip-to-content link as the first focusable element (visually hidden until focused).
- Every interactive element has a visible focus ring (`outline: 2px solid var(--focus); outline-offset: 2px`).
- Active nav link: `aria-current="page"` (no decorative pill required).
- Theme toggle: real `<button>`, `aria-pressed={theme==='dark'}`, `aria-label` describes what the toggle does, not the current state.
- Headings form a single h1 (hero name) followed by h2 per section, h3 per card.
- Body text contrast in light: `#0f172a on #ffffff` = 16.6:1. In dark: `#e6edf7 on #0b1020` = 14.2:1. Muted text light: `#475569 on #ffffff` = 7.1:1. Muted dark: `#9aa6bd on #0b1020` = 5.6:1. All ≥ AA.
- Touch targets ≥44×44px.
- Tag chips remain selectable text (not background images).

## Performance

- No 3D, no canvas, no `backdrop-filter`, no animated background.
- Single fade-up animation (transform + opacity, GPU-composited).
- `prefers-reduced-motion` short-circuits motion immediately.
- No font subsetting changes (Inter is already preloaded).
- Build size estimate: drops from current bundle by removing `Scene3D.jsx` and reducing inline CSS-in-JS string size. `framer-motion` stays.
- LCP target: hero name <1s on 4G. With the loading screen gone and no font-blocking, this is the realistic outcome.

## Copy — Full Rewrite

### Meta / SEO

| Field                | New value                                                                                              |
|----------------------|--------------------------------------------------------------------------------------------------------|
| `<title>`            | `Minul Lokuliyana — Business Analytics & Cybersecurity · Monash`                                       |
| `<meta description>` | `Project coordinator and Monash dual-degree candidate (Business Analytics & Cybersecurity). Cross-functional delivery across six industries — supply chain, retail, research, SaaS, AI start-ups.` |
| `og:title`           | `Minul Lokuliyana — Project & Programme Coordinator`                                                   |
| `og:description`     | Same as meta description.                                                                              |
| `theme-color`        | Driven by `[data-theme]`: `#ffffff` light, `#0b1020` dark.                                             |

### Hero

- **Eyebrow:** `Melbourne, Australia`
- **Name:** `Minul Lokuliyana`
- **Role pill:** `Business Analytics & Cybersecurity · Monash University`
- **Open-to chip:** `● Open to graduate roles — project & programme management, analytics, strategy · Nov 2026`
- **Pitch paragraph:**
  > "I run cross-functional projects — the kind that need someone who can sit with engineers, suppliers, and senior stakeholders and get them aligned, then build the tooling when waiting isn't faster. Six industries, 11+ years of leadership, currently coordinating procurement and inventory at BSH while finishing dual degrees in Business Analytics and Cybersecurity at Monash."
- **CTAs:** `Download Resume` (primary) · `Contact` (secondary; expands to `Mobile · Email`).
- **Inline links:** `LinkedIn · GitHub · Email`

### Open-to: removed standalone banner

The fixed top banner is gone. The "open to" message lives in the hero chip above.

### Section titles & subtitles

| Section     | Title                  | Subtitle      |
|-------------|------------------------|---------------|
| Experience  | `Experience`           | *(removed)*   |
| Skills      | `Skills`               | *(removed)*   |
| Projects    | `Projects`             | *(removed)*   |
| Education   | `Education`            | *(removed)*   |
| Leadership  | `Leadership & Impact`  | *(removed)*   |

All three previous decorative subtitles (*"Six industries. One consistent thread…"* / *"The toolkit that underpins…"* / *"Building solutions that bridge…"*) are deleted. Section title alone carries the weight.

### Experience bullets — full rewrite

Tightened for active voice and split run-on sentences. Numbers and tools preserved. No fabrication.

**BSH Home Appliances Australia — Supply Chain Planner (Jan 2026 – Present), Melbourne, VIC**
- Own $50M+ of national inventory across AU/NZ for Bosch, Siemens, Neff, and Gaggenau in SAP — stock transfers, allocations, project reservations, 3PL coordination — driving backorder rates down.
- Built the Customer Level Forecasting tool and a Python pipeline replacing the legacy PSI Tool import, consolidating retailer forecasts across national accounts and cutting data processing from hours to minutes.
- Partner with procurement and sales to ship Power BI dashboards, Excel/VBA automation, and Python reporting across 500+ SKUs — manual reporting down ~25%.
- Run cost-benefit analyses and scenario plans behind procurement recommendations; led inventory audits and master-data validation across 3 DCs for senior stakeholders.

**Cummins Asia Pacific — Procurement and Supply Chain Project Coordinator (Jan 2025 – Jan 2026), Melbourne, VIC**
- Coordinated two concurrent development programmes for regional markets, owning on-time delivery across cross-functional engineering teams and multiple workstreams.
- Led end-to-end RFQs with 30+ suppliers — capability benchmarking, risk assessment, commercial negotiation — landing cost-reduction initiatives that contributed six-figure annual savings.
- Built Python automation and agentic AI workflows across 3 functions; designed Power BI dashboards lifting programme visibility for APAC procurement across 10+ markets and 50+ categories.

**Monash University VARS Lab — Research Assistant (Jun 2024 – Dec 2024), Melbourne, VIC**
- Designed Python and R data pipelines processing 100K+ records through hypothesis-driven analysis, improving throughput 3× and contributing to one peer-reviewed publication.

**Dyson — Product Demonstrator and Content Creator (Aug 2022 – Sep 2024), Melbourne, VIC**
- Ranked #1 nationally in sales for two consecutive years; broke the single-day floorcare sales record.
- Selected as exclusive content creator for branded launches — the role rewards turning technical product detail into customer language at speed.

**YoureOnTime — Technical Support Analyst (Feb 2023 – May 2024), Melbourne, VIC**
- Owned client onboarding, data migration, and campaign coordination for a cloud SaaS platform across 200+ SME clients; insights drove 15%+ engagement uplift.

### Skills

Pillar names changed; items preserved (with light wording fixes).

**Programme & Project Management** — Programme delivery · Stakeholder engagement · Risk assessment · Cost-benefit analysis · Scenario planning · Cross-functional coordination · Lean Six Sigma · Agile · Procurement strategy

**Data & Engineering** — Python · R · SQL · Excel / VBA · Power Query · Power Pivot · Power BI · Tableau · SAP ERP · Git · React · React Native · TypeScript · HTML / CSS · Supabase

**AI & Automation** — Prompt engineering · Agentic AI workflows · LLM integration · GPT-4o · Mistral · Gemini · Process automation · Data pipelines

**Cloud, Tooling & Certifications** — Azure · AWS · GCP · Docker · Kubernetes · Kali Linux · Burp Suite · Salesforce · Jira · Confluence · ServiceNow · CPP · Lean Six Sigma Yellow Belt

### Projects

**Previa — AI Financial Intelligence Platform · Co-Founder**
- "Co-founded and shipped an AI platform that reconciles receipts for small businesses at 90%+ accuracy. Owned product, engineering, and go-to-market end-to-end."
- Tech: React, TypeScript, Supabase, Python, LLMs.
- Link: View on GitHub → https://github.com/demigod97/Previa-2.0

**GymBro — AI-Powered Fitness App · Solo Developer**
- "Solo build of an offline-first mobile fitness app on React Native + Expo. Most of the implementation came from agentic AI under my direction — the workflow itself is the project."
- Tech: React Native, Expo, TypeScript, SQLite, Zustand, Firebase.
- Link: View on GitHub → https://github.com/Mainulll/Gymbro-App

**Borealis Creative Group — Digital Strategy · Project Lead**
- "Led concurrent digital programmes for franchise clients — web build, SEO, paid media. Lifted organic traffic 40% across the portfolio."
- Tech: Figma, web design, SEO, analytics.
- Link: View Demos → existing Google Doc URL.

### Education

**Bachelor of Information Technology and Bachelor of Commerce (Double Degree)**
Monash University · Jul 2022 – Nov 2026 (expected)
Majors: Business Analytics · Cybersecurity
Coursework: machine learning, econometrics, statistical modelling, data visualisation, database systems, risk management.

Highlights:
- Innovation for Impact Award (2024) — university-wide AI design award, judged on commercial viability, technical rigour, and societal impact.
- Global Immersion (Fiji) + Innovation Guarantee (Microsoft) — led two cross-cultural consulting engagements: UN SDG-aligned project delivery and AI-driven stakeholder experience prototypes.

### Leadership & Impact

- **Programme Coordinator, Preflight STEM Initiative** (2024–Present) — Founder. Self-funded STEM outreach for underrepresented students in Sri Lanka — I run the volunteer team, the curriculum, and the programme delivery.
- **Officer, Australian Air League** (2014–Present) — 11+ years of youth leadership in aviation and civic education within a defence-aligned organisation. Mentored cadets and coordinated squadron operations.
- **Basketball Coach, Basketball Victoria / Waverley Raiders** (2017–2025) — Coached junior teams for 8 years through state-level competitions.
- **Student Fundraiser, Monash University Alumni Outreach** (2024) — Contributed to raising $300K+ for student scholarships through outbound engagement.

### Footer

- Name: `Minul Lokuliyana`
- One line: `Let's talk.`
- Contact row (wrapped): `Email · Mobile · LinkedIn · GitHub · minul.vercel.app`
- No quote, no glass card, no download CTA (already in nav and hero).

## Files Touched

| File                                | Change                                                                                |
|-------------------------------------|---------------------------------------------------------------------------------------|
| `index.html`                        | Update `<title>`, `<meta description>`, OG tags. Remove instant-paint dark style. Add inline pre-paint theme script. Update `<meta name="theme-color">` reference. |
| `src/index.css`                     | Replace contents with full token system + base + utilities. ~250 lines.               |
| `src/App.jsx`                       | Rewrite. ~400 lines. Single-file component breakdown as above. Updated `data` object. |
| `src/Scene3D.jsx`                   | Delete.                                                                               |
| `package.json`                      | No change.                                                                            |
| `docs/superpowers/specs/2026-04-12-resume-site-redesign-design.md` | Mark `**Status: Superseded by 2026-05-09-recruiter-readable-redesign-design.md**` at the top; otherwise leave for history. |

## Validation / Definition of Done

- `npm run build` succeeds with zero warnings.
- `npm run dev` shows zero console errors and zero hydration warnings.
- Lighthouse on the production build: Performance ≥95, Accessibility ≥98, Best Practices ≥95, SEO ≥95 on desktop. Mobile Performance ≥90.
- All interactive elements reachable by `Tab`; visible focus on every one.
- Light mode and dark mode both pass AA contrast on body and meta text (verified with browser devtools contrast checker).
- No theme flash on first paint in either mode.
- 320px-wide viewport renders without horizontal scroll.
- `prefers-reduced-motion: reduce` shows all content at final state immediately.
- All copy on the page matches this spec verbatim.

## Open Questions for User Review

1. The hero pitch quotes "currently coordinating procurement and inventory at BSH". Your title there is "Supply Chain Planner". Is "coordinating" comfortable wording, or do you want to use "planning" / "managing" / something else? (Recruiters care about action verbs, not titles, so this is voice-only.)
2. The open-to chip says `Nov 2026`. Confirm that's when you graduate and become available — change to a different month/year if it's wrong.
3. The Dyson bullet adds a sentence framing the role around "turning technical product detail into customer language at speed". Comfortable with that framing or want it shortened/removed?
4. Skill pillar order leads with **Programme & Project Management**. Confirm that's where you want the lead, not (e.g.) Data & Engineering.
