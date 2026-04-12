# Resume Site Redesign — Design Spec

**Date:** 2026-04-12
**Author:** Minul Lokuliyana + Claude
**Status:** Approved

## Overview

Full visual redesign of minul.vercel.app — the personal resume/portfolio site. Shifts from the current indigo/violet glassmorphism aesthetic to a gradient mesh / modern SaaS style (Vercel/Linear-inspired). Updates all resume content to match the latest PDF, adds a new Leadership section, restructures skills into 4 categories, and significantly upgrades the animation system. Re-introduces a 3D crystal gem (react-three-fiber) as a persistent brand mark.

## Visual Identity

### Colour Palette

| Role      | Value                                         | Usage                                    |
|-----------|-----------------------------------------------|------------------------------------------|
| Base      | `#020617` (slate-950)                         | Page background                          |
| Surface   | `#0f172a` (slate-900)                         | Card backgrounds, navbar                 |
| Primary   | `#38bdf8 → #818cf8` (cyan→indigo gradient)    | Headings, primary CTA, interactive       |
| Accent    | `#a78bfa → #c084fc` (violet gradient)         | Secondary accents, Experience section    |
| Success   | `#34d399 → #2dd4bf` (emerald→teal gradient)   | "Open to" dot, positive indicators       |
| Warm      | `#fbbf24` (amber)                             | Education section accent                 |
| Rose      | `#f472b6` (pink)                              | Leadership section accent                |
| Text      | `#f1f5f9` (slate-50)                          | Headings                                 |
| Text muted| `rgba(203,213,225,0.5)` (slate-300 @ 50%)     | Body text                                |

### Background Atmosphere

- Three gradient mesh orbs (cyan, violet, emerald) positioned absolutely behind content
- Orbs drift on a slow 20s CSS animation loop AND shift vertically tied to `scrollYProgress`
- Each section pair has its own colour temperature — orbs shift hue subtly as you scroll
- Interactive dot grid remains, recoloured to `rgba(56,189,248,0.1)` (cyan tint)
- Cursor glow recoloured to subtle cyan radial gradient

## 3D Crystal Gem

### Dependencies

Re-add to package.json:
- `@react-three/fiber`
- `@react-three/drei`
- `three`

### Loading Screen Gem (Large)

- Diamond/gem geometry (~88px visual size) using a custom buffer geometry or `DodecahedronGeometry` faceted to resemble a cut gemstone — same visual identity as the current SVG LogoMark (four-facet diamond) but rendered as a 3D solid
- `MeshTransmissionMaterial` with glass properties: high transmission (0.97), low roughness, iridescence, chromatic aberration
- Lighting: key white directional + cyan fill + violet rim + point lights for interior glow
- **Rotation:** slow continuous Y-axis rotation as baseline + mouse-reactive rotation (cursor position mapped to X/Y rotation offsets, lerped smoothly — same technique as current `CursorInteractiveShape`)
- Bloom glow via `drop-shadow` on the Canvas container (not a post-processing pass — keeps it lightweight)
- Appears during loading screen, centred, with name below

### Navbar Gem (Mini)

- Same gem geometry at ~24x28px, rendered in a separate small `<Canvas>`
- Auto-rotation only (slow Y-axis), no mouse interaction (too small to be meaningful)
- Reduced material complexity: fewer samples, no iridescence, simpler lighting
- Sits at the left edge of the navbar pill
- Only renders when navbar is visible (scroll > 80px)

### Transition

- Loading screen exit: gem scales up slightly (1.05) + blurs (20px) + fades out over 500ms
- Name uses `layoutId` spring transition from loading screen position to hero position (preserved from current site)

## Page Layout — Magazine / Asymmetric

### Structure (top to bottom)

1. **Open-to Banner** — fixed top, full width
   - Pulsing dot (emerald) + "Open to New Challenges"
   - Links to mailto

2. **Hero** — full viewport height, centred
   - Location eyebrow (Melbourne, VIC)
   - Name (large, transitions from loading screen)
   - Title pill (Business Analytics & Cybersecurity · Monash University)
   - Narrative statement: "Across six industries, I've turned complex operational challenges into structured insights, automation solutions, and stakeholder-aligned recommendations that deliver measurable impact."
   - Primary CTAs: Download Resume / Contact Me (split animation preserved)
   - Secondary links: LinkedIn, GitHub, Email
   - Scroll hint

3. **Section Pair 1: Experience (2/3 width) + Stats Sidebar (1/3 width)**
   - Experience: timeline with 5 roles in glass cards
   - Stats sidebar: 4 animated counters stacked vertically
     - `$50M+` — Inventory managed
     - `6` — Industries
     - `11+` — Years leadership
     - `100K+` — Records processed
   - Mobile: stats become horizontal scrollable row above Experience

4. **Skills — Full Width**
   - 4-column grid (collapses to 2x2 on tablet, 1-column on mobile)
   - Categories: Project Management, Technical, AI & Automation, Cloud/Tools/Certs
   - Each category is a glass card with skill tags inside

5. **Section Pair 2: Projects (1/2 width) + Education & Leadership stacked (1/2 width)**
   - Projects: 3 cards (carousel on mobile, stacked on desktop since they're in a narrower column)
   - Education: glass card with degree, coursework, awards
   - Leadership: glass card with 4 items (Preflight, Air League, Basketball, Alumni)
   - Mobile: single column — Projects, then Education, then Leadership

6. **Footer**
   - 3D gem (small, auto-rotating) + name
   - Quote: "Always bringing the perspective."
   - Download Resume CTA
   - Links: LinkedIn, GitHub, Email, minul.vercel.app
   - Contact info

### Responsive Breakpoints

- `>768px`: full magazine layout with asymmetric pairs
- `480–768px`: single column, stats as horizontal row, skills 2x2
- `<480px`: single column, skills 1-column, backdrop-filter disabled, simplified animations
- `<360px`: further font size reductions

## Animation System

### Loading Screen Sequence

| Time    | Element          | Animation                                                          |
|---------|------------------|--------------------------------------------------------------------|
| 0.0s    | 3D Gem           | Fades in (opacity 0→1) with bloom glow expanding                   |
| 0.6s    | Name             | Typewriter reveal — each letter fades + slides in from right, spring physics (not cursor-blink style) |
| 1.2s    | Tagline          | Fades up (y: 8→0, opacity 0→1), 550ms ease                        |
| 2.2s    | Screen dissolve  | Gem scales 1→1.05 + blur 0→20px + opacity 1→0 (500ms). Screen fades out. Name morphs to hero via layoutId spring. |

### Hero Entrance Cascade

All elements use **blur-unblur** as part of entrance (starts `filter: blur(4-8px)`, resolves to `blur(0)`).

| Delay   | Element          | Animation                                              |
|---------|------------------|--------------------------------------------------------|
| T+0ms   | Name             | layoutId spring from loading screen                    |
| T+200ms | Location eyebrow | Slides down from above + blur 8px→0                    |
| T+400ms | Title pill        | Scale 0.8→1 + opacity + spring bounce                  |
| T+600ms | Narrative        | Fade up (y: 16→0) + blur 4px→0                        |
| T+850ms | CTAs             | Staggered spring pop (scale 0.9→1, 60ms apart)         |
| T+1100ms| Social links     | Opacity only, 400ms ease                               |

Spring physics: stiffness ~300, damping ~25 throughout.

### Scroll Reveals

- **Section labels:** slide in from left (x: -20→0) + opacity
- **Titles:** fade up + blur-unblur
- **Subtitles:** follow 100ms after title
- **Content cards:** cascade with 70ms stagger, fade up (y: 24→0)
- **Parallax:** section labels at 0.9x scroll speed, content at 1x
- **Background mesh:** orbs shift position tied to scrollYProgress

### Card Interactions

- **Hover lift:** y: -6px, spring transition 220ms
- **Spotlight effect:** mouse-tracking radial gradient inside card (CSS custom properties `--mouse-x`, `--mouse-y` updated via mousemove listener on card, not React state). Radial gradient: `rgba(56,189,248,0.06)` fading to transparent.
- **Gradient border on hover:** pseudo-element behind card with rotating gradient (cyan→violet→emerald), animated via CSS `@keyframes`. Visible on hover only.
- **Shadow bloom:** box-shadow expands on hover

### Stat Counters

- Spring-based counting using `useSpring` from framer-motion
- Numbers overshoot target slightly then settle (spring with low damping)
- Gradient text fill matching section colour
- "+" suffix appears after number lands
- Triggered once on viewport entry (`useInView` with `once: true`)

### Timeline

- Timeline line draws itself downward as user scrolls (clip-path or scaleY tied to scroll)
- Each dot pulses once when its card enters viewport — ring expands outward (sonar ping), single cycle
- Cards stagger in with 70ms delay between each

### Micro-interactions

- **Scroll progress bar:** animated gradient (cyan→violet→emerald) that shifts hue as scroll deepens. 2px height with soft glow.
- **Navbar active link:** animated underline slides between items (not instant jump). Uses `layoutId` on the indicator element.
- **Skill tags:** staggered pop-in (scale 0→1 with spring) on scroll reveal. Hover: subtle glow + scale 1.03.
- **CTA buttons:** hover lift (y: -3px) + gradient border glow intensifies. Click: scale(0.96) bounce. Download button gets a shimmer sweep on first appearance.

### Performance

- All animations use transform + opacity only (GPU composited)
- `will-change` hints on animated elements, removed after completion
- Spotlight effect uses CSS custom properties (no React re-renders)
- Stat counters: `once: true` — animate once then static
- `prefers-reduced-motion`: all motion disabled, content visible immediately
- Dot grid pauses rAF when tab hidden
- Mobile (<768px): spotlight disabled, blur-unblur simplified to opacity-only
- Navbar gem only renders when navbar visible

## Content Changes

### Banner

- Old: "Open to Graduate Consulting, Strategy and Analyst Roles"
- New: "Open to New Challenges"

### Tagline

- Old: "Automation · Perspective · Transformation"
- New: "Analytics · Security · Impact"

### Summary / Narrative

Kept: "Across six industries, I've turned complex operational challenges into structured insights, automation solutions, and stakeholder-aligned recommendations that deliver measurable impact."

### Experience (5 roles)

**BSH Home Appliances Australia — Supply Chain Planner (Jan 2026 – Present)**
- Manage $50M+ national inventory across AU/NZ for Bosch, Siemens, Neff, and Gaggenau in SAP, owning stock transfers, allocations, project reservations, and 3PL coordination to reduce backorder rates.
- Built the Customer Level Forecasting tool and a Python replacement pipeline for the PSI Tool import process, consolidating retailer forecasts across national accounts and reducing data processing time from hours to minutes.
- Developed Power BI dashboards, Excel/VBA automation, and Python reporting tools with procurement and sales teams, surfacing KPIs across 500+ SKUs and reducing manual reporting by ~25%.
- Delivered cost-benefit analyses and scenario planning to support procurement recommendations; led inventory audits and master-data validation across 3 DCs for senior stakeholders.

**Cummins Asia Pacific — Procurement and Supply Chain Project Coordinator (Jan 2025 – Jan 2026)**
- Managed two concurrent development programmes for regional markets, coordinating cross-functional engineering teams and owning on-time delivery across multiple workstreams.
- Led end-to-end RFQ processes: supplier engagement, capability benchmarking, risk assessment, and commercial negotiation with 30+ suppliers; delivered cost-reduction initiatives contributing to six-figure annual savings.
- Developed Python automation and agentic AI workflows across 3 functions; designed Power BI dashboards improving programme visibility for APAC procurement across 10+ markets and 50+ categories.

**Monash University VARS Lab — Research Assistant (Jun 2024 – Dec 2024)**
- Designed Python and R data pipelines processing 100K+ records through hypothesis-driven analysis, improving throughput by 3x and contributing to one peer-reviewed publication.

**Dyson — Product Demonstrator and Content Creator (Aug 2022 – Sep 2024)**
- Ranked #1 nationally in sales across all retail staff for two consecutive years; broke single-day floorcare sales record; selected as exclusive content creator for branded product launches.

**YoureOnTime — Technical Support Analyst (Feb 2023 – May 2024)**
- Managed client onboarding, data migration, and campaign coordination for a cloud SaaS platform (200+ SME clients); delivered insights driving 15%+ uplift in engagement.

### Skills (4 categories)

**Project Management:** Programme delivery, stakeholder engagement, risk assessment, cost-benefit analysis, scenario planning, cross-functional coordination, Lean Six Sigma, Agile, commercial management, procurement strategy.

**Technical:** Python, R, SQL, Excel, VBA, Power Query, Power Pivot, Power BI, Tableau, SAP ERP, Git, React, React Native, TypeScript, HTML, CSS, Supabase.

**AI and Automation:** Prompt engineering, agentic AI workflows, LLM integration (GPT-4o, Mistral, Gemini), process automation, data pipelines.

**Cloud, Tools, and Certs:** Azure, AWS, GCP, Docker, Kubernetes, Kali Linux, Burp Suite, Salesforce, Jira, Confluence, ServiceNow, SolidWorks, Windchill. CPP, Lean Six Sigma Yellow Belt.

### Projects

**Previa — AI Financial Intelligence Platform (Co-Founder)**
- Co-founded full-stack AI platform (React, TypeScript, Supabase) automating receipt reconciliation for SMEs with 90%+ accuracy; managed end-to-end product delivery.
- Tech: React, TypeScript, Supabase, Python, LLMs
- Link: https://github.com/demigod97/Previa-2.0

**GymBro — AI-Powered Fitness App (Solo Developer)**
- Built production-grade mobile app (React Native, Expo, TypeScript) with offline-first architecture and agentic AI-driven development workflow.
- Tech: React Native, Expo, TypeScript, SQLite, Zustand, Firebase
- Link: https://github.com/Mainulll/Gymbro-App

**Borealis Creative Group — Digital Strategy (Project Lead)**
- Managed concurrent digital projects for franchise clients including web development, SEO, and paid advertising, improving organic traffic by 40%.
- Tech: Figma, Web design, SEO, Analytics
- Link: https://docs.google.com/document/d/1s_JRAy8o3LNFfrVgoeCC3s_PzByHTtMg6zqxtgM6BxU/edit?tab=t.0

### Education

**Bachelor of Information Technology and Bachelor of Commerce (Double Degree)**
Monash University — Jul 2022 – Nov 2026 (Expected)
Majors: Business Analytics; Cybersecurity.
Coursework: machine learning, econometrics, statistical modelling, data visualisation, database systems, risk management.

Highlights:
- Innovation for Impact Award (2024) — Competitive university-wide award for responsible AI solution design, evaluated on commercial viability, technical rigour, and societal impact.
- Global Immersion (Fiji) and Innovation Guarantee (Microsoft) — Led cross-cultural consulting engagements: UN SDG-aligned project delivery and AI-driven stakeholder experience prototypes.

### Leadership & Extracurriculars (NEW)

- Programme Coordinator, Preflight STEM Initiative (2024–Present) — Founded and personally fund STEM outreach for underrepresented students in Sri Lanka; manage volunteer teams, curriculum, and programme delivery.
- Officer, Australian Air League (2014–Present) — 11+ years of youth leadership in aviation and civic education within a defence-aligned organisation; mentored cadets and coordinated squadron operations.
- Basketball Coach, Basketball Victoria / Waverley Raiders (2017–2025) — Coached junior teams for 8 years through state-level competitions.
- Student Fundraiser, Monash University Alumni Outreach (2024) — Contributed to raising $300K+ for student scholarships through outbound engagement.

### Meta / SEO Updates

- `<title>`: "Minul Lokuliyana · Analytics & Impact"
- `<meta description>`: Updated to reflect new positioning
- OG tags updated
- Add minul.vercel.app to contact data

### Removed

- Industry tags from hero
- Standalone Certifications section (merged into Skills)
- `data.message` separate from summary (consolidated into single narrative)
- 3D background scene (Scene3D.jsx shapes) — replaced by gradient mesh. 3D only used for gem.

## What's Preserved

- Loading screen → hero name `layoutId` transition
- Interactive dot grid (recoloured)
- Cursor glow (recoloured)
- Scroll progress bar (upgraded gradient)
- Navbar desktop pill + mobile FAB pattern
- Glass card design system (recoloured + spotlight added)
- Contact Me split animation (Mobile / Email)
- Framer Motion animation framework
- Responsive breakpoints (768, 480, 360)
- `prefers-reduced-motion` support
- Tab visibility rAF pausing
- LogoMark SVG retained as fallback for SSR/no-WebGL scenarios
