# Recruiter-Readable Redesign — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Strip the resume site to a recruiter-first single-page CV with light/dark theming, a single accent colour, full copy rewrite, and no decorative animation layers.

**Architecture:** Refactor in place. `src/App.jsx` becomes one ~400-line file; all CSS moves into `src/index.css` with `:root[data-theme="..."]` token blocks; `src/Scene3D.jsx` is deleted; `index.html` gets a pre-paint theme script and updated meta. No new dependencies.

**Tech Stack:** Vite 6, React 18, framer-motion (used only for one shared `FadeUp` helper), CSS custom properties for theming.

**Source spec:** `docs/superpowers/specs/2026-05-09-recruiter-readable-redesign-design.md` — all copy text in this plan refers to the spec by section. The spec is authoritative for verbatim wording.

**Verification approach:** No test framework exists in this project (`package.json` has only `dev`, `build`, `preview` scripts). Each task ends with `npm run build` succeeding plus a manual smoke check listed in the task. Setting up a test framework is out of scope per YAGNI.

---

## File Structure

| File | Role | Action |
|---|---|---|
| `index.html` | Document head, pre-paint theme, meta | Modify |
| `src/main.jsx` | React mount point | Unchanged |
| `src/index.css` | Token system, reset, base, utilities | Replace contents |
| `src/App.jsx` | All components (Nav, Hero, sections, Footer) and `useTheme` hook | Rewrite |
| `src/Scene3D.jsx` | Animated SVG gem | Delete |
| `package.json` | Dependencies | Unchanged |

---

## Task 1: CSS foundation + theming infrastructure

**Files:**
- Modify: `index.html`
- Replace: `src/index.css`

This task lands the design tokens and pre-paint theme script. The site will look broken until Task 2 because `App.jsx` still references its inline styles, but the build must pass and the new CSS must validate.

- [ ] **Step 1: Update `index.html` head**

Replace the `<head>` contents (lines 3–40) with the following. Body section (lines 41–45) stays as-is.

```html
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover" />
  <meta name="description" content="Project coordinator and Monash dual-degree candidate (Business Analytics & Cybersecurity). Cross-functional delivery across six industries — supply chain, retail, research, SaaS, AI start-ups." />
  <meta name="author" content="Minul Lokuliyana" />
  <meta name="theme-color" content="#ffffff" media="(prefers-color-scheme: light)" />
  <meta name="theme-color" content="#0b1020" media="(prefers-color-scheme: dark)" />
  <meta name="apple-mobile-web-app-capable" content="yes" />

  <!-- Open Graph -->
  <meta property="og:type" content="website" />
  <meta property="og:title" content="Minul Lokuliyana — Project & Programme Coordinator" />
  <meta property="og:description" content="Project coordinator and Monash dual-degree candidate (Business Analytics & Cybersecurity). Cross-functional delivery across six industries." />
  <meta property="og:image" content="/og-image.png" />

  <!-- Twitter Card -->
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="Minul Lokuliyana — Project & Programme Coordinator" />
  <meta name="twitter:description" content="Project coordinator and Monash dual-degree candidate (Business Analytics & Cybersecurity). Cross-functional delivery across six industries." />

  <!-- Fonts: preconnect + preload + non-blocking stylesheet -->
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link rel="preload" as="style" href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" />
  <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" media="print" onload="this.media='all'" />
  <noscript><link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" /></noscript>

  <link rel="dns-prefetch" href="https://linkedin.com" />
  <link rel="dns-prefetch" href="https://github.com" />

  <!-- Pre-paint theme: must run before body to avoid flash -->
  <script>
    (function () {
      try {
        var t = localStorage.getItem('theme');
        if (t !== 'light' && t !== 'dark') {
          t = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
        }
        document.documentElement.setAttribute('data-theme', t);
      } catch (e) {}
    })();
  </script>

  <title>Minul Lokuliyana — Business Analytics &amp; Cybersecurity · Monash</title>
</head>
```

Notes:
- Removed the inline `body { background: #020617 }` style (would override light mode).
- Dropped the 300-weight Inter (unused after redesign — only 400/500/600/700 used).
- `theme-color` now uses two tags with `media` queries; the runtime can also set it dynamically in Task 2 for the override case.

- [ ] **Step 2: Replace `src/index.css`**

Overwrite the entire file with the following. This is the full token system, reset, base typography, and utility classes.

```css
/* ── Tokens ────────────────────────────────────────────────────────── */
:root,
:root[data-theme='light'] {
  --bg: #ffffff;
  --surface: #f6f7f9;
  --surface-2: #eef0f4;
  --border: #e5e7eb;
  --text: #0f172a;
  --text-muted: #475569;
  --accent: #0a66ff;
  --accent-soft: #e8efff;
  --accent-text: #ffffff;
  --focus: rgba(10, 102, 255, 0.45);
  --shadow: 0 1px 2px rgba(15, 23, 42, 0.04), 0 4px 12px rgba(15, 23, 42, 0.04);
}

:root[data-theme='dark'] {
  --bg: #0b1020;
  --surface: #11172a;
  --surface-2: #172038;
  --border: #1f2a44;
  --text: #e6edf7;
  --text-muted: #9aa6bd;
  --accent: #7aa8ff;
  --accent-soft: #1a274a;
  --accent-text: #0b1020;
  --focus: rgba(122, 168, 255, 0.55);
  --shadow: 0 1px 2px rgba(0, 0, 0, 0.4), 0 8px 20px rgba(0, 0, 0, 0.35);
}

/* ── Reset ─────────────────────────────────────────────────────────── */
*, *::before, *::after { box-sizing: border-box; }
* { margin: 0; padding: 0; }
html { scroll-behavior: smooth; -webkit-text-size-adjust: 100%; scroll-padding-top: 72px; }
body {
  background: var(--bg);
  color: var(--text);
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Helvetica Neue', sans-serif;
  font-size: 1rem;
  line-height: 1.65;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-rendering: optimizeLegibility;
  -webkit-tap-highlight-color: transparent;
  overflow-x: hidden;
  transition: background-color 0.2s ease, color 0.2s ease;
}
img, svg { display: block; max-width: 100%; }
ul { list-style: none; }
a { color: var(--accent); text-decoration: none; }
a:hover { text-decoration: underline; text-underline-offset: 3px; }
button { font: inherit; color: inherit; background: transparent; border: 0; cursor: pointer; }

/* ── Selection / focus ─────────────────────────────────────────────── */
::selection { background: var(--accent-soft); color: var(--text); }
:focus-visible { outline: 2px solid var(--focus); outline-offset: 2px; border-radius: 4px; }

/* ── Skip to content ───────────────────────────────────────────────── */
.skip-link {
  position: fixed; top: -40px; left: 12px; padding: 0.5rem 0.9rem;
  background: var(--accent); color: var(--accent-text); border-radius: 6px;
  font-size: 0.875rem; font-weight: 600; z-index: 1000;
  transition: top 0.15s ease;
}
.skip-link:focus { top: 12px; text-decoration: none; }

/* ── Layout container ──────────────────────────────────────────────── */
.container { max-width: 720px; margin: 0 auto; padding: 0 1.5rem; }

/* ── Typography ────────────────────────────────────────────────────── */
h1 { font-size: clamp(2.25rem, 5vw, 2.75rem); line-height: 1.15; letter-spacing: -0.02em; font-weight: 700; }
h2 { font-size: clamp(1.5rem, 3vw, 1.75rem); line-height: 1.25; letter-spacing: -0.015em; font-weight: 700; }
h3 { font-size: 1.125rem; line-height: 1.4; font-weight: 600; }
.eyebrow { font-size: 0.8125rem; font-weight: 600; letter-spacing: 0.08em; text-transform: uppercase; color: var(--text-muted); }
.muted { color: var(--text-muted); }
.meta { font-size: 0.875rem; color: var(--text-muted); }

/* ── Buttons ───────────────────────────────────────────────────────── */
.btn {
  display: inline-flex; align-items: center; gap: 0.5rem;
  padding: 0.625rem 1.125rem; min-height: 44px;
  border-radius: 8px; font-size: 0.9375rem; font-weight: 600;
  border: 1px solid transparent;
  transition: background-color 0.15s ease, border-color 0.15s ease, color 0.15s ease, transform 0.15s ease;
  cursor: pointer; text-decoration: none;
}
.btn:hover { transform: translateY(-1px); text-decoration: none; }
.btn:active { transform: translateY(0); }
.btn-primary { background: var(--accent); color: var(--accent-text); border-color: var(--accent); }
.btn-primary:hover { filter: brightness(1.08); }
.btn-secondary { background: transparent; color: var(--text); border-color: var(--border); }
.btn-secondary:hover { background: var(--surface); border-color: var(--text-muted); }
.btn-ghost { background: transparent; color: var(--text); padding: 0.5rem 0.875rem; min-height: 36px; font-size: 0.875rem; }
.btn-ghost:hover { background: var(--surface); }

/* ── Card ──────────────────────────────────────────────────────────── */
.card {
  background: var(--surface); border: 1px solid var(--border); border-radius: 12px;
  padding: 1.5rem 1.75rem; box-shadow: var(--shadow);
}

/* ── Tag / chip ────────────────────────────────────────────────────── */
.tag {
  display: inline-block;
  background: var(--surface-2); color: var(--text);
  font-size: 0.8125rem; font-weight: 500;
  padding: 0.25rem 0.625rem; border-radius: 100px;
  border: 1px solid var(--border);
}
.chip {
  display: inline-flex; align-items: center; gap: 0.5rem;
  background: var(--accent-soft); color: var(--accent);
  font-size: 0.8125rem; font-weight: 600;
  padding: 0.375rem 0.875rem; border-radius: 100px;
  border: 1px solid color-mix(in oklab, var(--accent) 20%, transparent);
}
.chip-dot { width: 6px; height: 6px; border-radius: 50%; background: currentColor; }

/* ── Section ───────────────────────────────────────────────────────── */
.section { padding: 6rem 0; }
.section + .section { padding-top: 0; }
.section-title { margin-bottom: 2rem; }

/* ── Bullet list ───────────────────────────────────────────────────── */
.bullets { list-style: none; padding: 0; }
.bullets li { position: relative; padding-left: 1.25rem; margin-bottom: 0.5rem; line-height: 1.65; }
.bullets li::before { content: '•'; position: absolute; left: 0; top: 0; color: var(--accent); }

/* ── Sticky nav ────────────────────────────────────────────────────── */
.nav {
  position: sticky; top: 0; z-index: 100;
  background: color-mix(in oklab, var(--bg) 85%, transparent);
  border-bottom: 1px solid var(--border);
  backdrop-filter: saturate(180%) blur(8px);
  -webkit-backdrop-filter: saturate(180%) blur(8px);
}
.nav-inner { max-width: 960px; margin: 0 auto; padding: 0.75rem 1.5rem; display: flex; align-items: center; gap: 1rem; min-height: 56px; }
.nav-brand { display: flex; align-items: center; gap: 0.5rem; font-weight: 600; font-size: 0.9375rem; letter-spacing: -0.01em; color: var(--text); }
.nav-brand:hover { text-decoration: none; }
.nav-links { display: flex; gap: 0.25rem; margin-left: auto; }
.nav-link { padding: 0.375rem 0.75rem; border-radius: 6px; font-size: 0.875rem; font-weight: 500; color: var(--text-muted); }
.nav-link:hover { color: var(--text); background: var(--surface); text-decoration: none; }
.nav-link[aria-current='page'] { color: var(--accent); background: var(--accent-soft); }
.nav-actions { display: flex; gap: 0.375rem; align-items: center; margin-left: auto; }
.nav-actions .nav-link + .nav-actions { margin-left: 0; }
.nav-toggle { display: inline-flex; align-items: center; justify-content: center; width: 36px; height: 36px; border-radius: 8px; color: var(--text-muted); }
.nav-toggle:hover { color: var(--text); background: var(--surface); }
.nav-disclosure-btn { display: none; }

@media (max-width: 760px) {
  .nav-links { display: none; }
  .nav-actions { margin-left: auto; }
  .nav-disclosure-btn { display: inline-flex; }
  .nav-disclosure-panel {
    border-top: 1px solid var(--border);
    background: var(--bg);
    padding: 0.5rem 1rem 1rem;
    display: flex; flex-direction: column; gap: 0.25rem;
  }
  .nav-disclosure-panel .nav-link { padding: 0.625rem 0.875rem; font-size: 0.9375rem; }
}

/* ── Hero ──────────────────────────────────────────────────────────── */
.hero { padding: 5rem 0 4rem; }
.hero-eyebrow { margin-bottom: 0.75rem; }
.hero h1 { margin-bottom: 1rem; }
.hero-rolepill { display: inline-block; background: var(--surface); border: 1px solid var(--border); padding: 0.375rem 0.875rem; border-radius: 100px; font-size: 0.875rem; color: var(--text-muted); margin-bottom: 1rem; }
.hero-chip { margin-bottom: 1.75rem; }
.hero-pitch { font-size: 1.0625rem; line-height: 1.7; color: var(--text); margin-bottom: 2rem; max-width: 64ch; }
.hero-cta-row { display: flex; flex-wrap: wrap; gap: 0.625rem; margin-bottom: 1.5rem; }
.hero-links { display: flex; flex-wrap: wrap; gap: 1.25rem; font-size: 0.9375rem; }
.hero-links a { color: var(--text-muted); }
.hero-links a:hover { color: var(--accent); }

/* ── Experience timeline (light, no big animations) ────────────────── */
.experience-list { display: flex; flex-direction: column; gap: 1.25rem; }
.exp-card { display: flex; flex-direction: column; gap: 0.5rem; }
.exp-head h3 { margin-bottom: 0.125rem; }
.exp-meta { font-size: 0.875rem; color: var(--text-muted); }

/* ── Skills grid ───────────────────────────────────────────────────── */
.pillars-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 1rem; }
.pillar-card h3 { margin-bottom: 0.875rem; }
.pillar-tags { display: flex; flex-wrap: wrap; gap: 0.375rem; }
@media (max-width: 640px) { .pillars-grid { grid-template-columns: 1fr; } }

/* ── Projects ──────────────────────────────────────────────────────── */
.project-list { display: flex; flex-direction: column; gap: 1rem; }
.project-card { display: flex; flex-direction: column; gap: 0.5rem; }
.project-role { font-size: 0.75rem; font-weight: 700; letter-spacing: 0.08em; text-transform: uppercase; color: var(--accent); }
.project-tech { font-size: 0.875rem; color: var(--text-muted); }

/* ── Education ─────────────────────────────────────────────────────── */
.edu-card h3 { margin-bottom: 0.25rem; }
.edu-coursework { font-style: italic; color: var(--text-muted); margin: 0.5rem 0 1rem; }

/* ── Leadership ────────────────────────────────────────────────────── */
.leadership-list { display: flex; flex-direction: column; gap: 0.75rem; }
.leadership-card h3 { font-size: 1rem; margin-bottom: 0.125rem; }

/* ── Footer ────────────────────────────────────────────────────────── */
.footer { padding: 4rem 0 5rem; border-top: 1px solid var(--border); margin-top: 3rem; text-align: center; }
.footer-tagline { font-size: 1.125rem; font-weight: 600; margin: 0.5rem 0 1rem; color: var(--text); }
.footer-links { display: flex; flex-wrap: wrap; gap: 1.25rem; justify-content: center; font-size: 0.9375rem; }
.footer-links a { color: var(--text-muted); }
.footer-links a:hover { color: var(--accent); }

/* ── Responsive padding ────────────────────────────────────────────── */
@media (max-width: 1023px) {
  .section { padding: 4.5rem 0; }
}
@media (max-width: 640px) {
  .container { padding: 0 1rem; }
  .section { padding: 3rem 0; }
  .hero { padding: 3rem 0 2.5rem; }
  .hero-pitch { font-size: 1rem; }
  .card { padding: 1.25rem; }
}

/* ── Reduced motion ────────────────────────────────────────────────── */
@media (prefers-reduced-motion: reduce) {
  html { scroll-behavior: auto; }
  *, *::before, *::after {
    animation-duration: 0ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0ms !important;
  }
}
```

- [ ] **Step 3: Verify build still passes**

Run: `npm run build`
Expected: build completes with no errors. Site will look broken in the browser (App.jsx still has its own inline styles using class names that no longer match anything in index.css), but that's expected and is fixed in Task 2.

- [ ] **Step 4: Commit**

```bash
git add index.html src/index.css
git commit -m "$(cat <<'EOF'
feat(theme): introduce CSS token system and pre-paint theme script

Replaces index.css with a light/dark token system on
:root[data-theme]. Adds an inline pre-paint script in index.html
that sets data-theme from localStorage or prefers-color-scheme
before React mounts. Removes the dark-only instant-paint body
style. Updates meta description and OG tags to lead with the
project-coordinator positioning.

Co-Authored-By: Claude Opus 4.7 <noreply@anthropic.com>
EOF
)"
```

---

## Task 2: Rewrite App.jsx skeleton with theme + Nav, delete Scene3D

**Files:**
- Replace: `src/App.jsx`
- Delete: `src/Scene3D.jsx`

This task lands the new component architecture and theme toggle. Hero/sections will be present as empty placeholders to be filled in subsequent tasks.

- [ ] **Step 1: Delete `src/Scene3D.jsx`**

```bash
git rm src/Scene3D.jsx
```

- [ ] **Step 2: Replace `src/App.jsx` with skeleton**

Overwrite the entire file with the following. This includes the full `data` object (with rewritten copy from the spec), the `useTheme` hook, `FadeUp`, `Nav`, and placeholder section components. Sections will be expanded in subsequent tasks.

```jsx
import { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

/* ── Resume Data ──────────────────────────────────────────────────── */
const data = {
  name: 'Minul Lokuliyana',
  resumePdf: '/MinulLokuliyana_Resume.pdf',
  location: 'Melbourne, Australia',
  role: 'Business Analytics & Cybersecurity · Monash University',
  openTo: 'Open to graduate roles — project & programme management, analytics, strategy · Nov 2026',
  pitch: "I run cross-functional projects — the kind that need someone who can sit with engineers, suppliers, and senior stakeholders and get them aligned, then build the tooling when waiting isn't faster. Six industries, 11+ years of leadership, currently coordinating procurement and inventory at BSH while finishing dual degrees in Business Analytics and Cybersecurity at Monash.",
  contact: {
    email: 'minullokuliyana@hotmail.com',
    mobile: '+61 402 528 040',
    linkedin: 'https://linkedin.com/in/minull',
    github: 'https://github.com/Mainulll',
    website: 'https://minul.vercel.app',
  },
  experience: [
    {
      role: 'Supply Chain Planner',
      company: 'BSH Home Appliances Australia',
      period: 'Jan 2026 – Present',
      location: 'Melbourne, VIC',
      bullets: [
        'Own $50M+ of national inventory across AU/NZ for Bosch, Siemens, Neff, and Gaggenau in SAP — stock transfers, allocations, project reservations, 3PL coordination — driving backorder rates down.',
        'Built the Customer Level Forecasting tool and a Python pipeline replacing the legacy PSI Tool import, consolidating retailer forecasts across national accounts and cutting data processing from hours to minutes.',
        'Partner with procurement and sales to ship Power BI dashboards, Excel/VBA automation, and Python reporting across 500+ SKUs — manual reporting down ~25%.',
        'Run cost-benefit analyses and scenario plans behind procurement recommendations; led inventory audits and master-data validation across 3 DCs for senior stakeholders.',
      ],
    },
    {
      role: 'Procurement and Supply Chain Project Coordinator',
      company: 'Cummins Asia Pacific',
      period: 'Jan 2025 – Jan 2026',
      location: 'Melbourne, VIC',
      bullets: [
        'Coordinated two concurrent development programmes for regional markets, owning on-time delivery across cross-functional engineering teams and multiple workstreams.',
        'Led end-to-end RFQs with 30+ suppliers — capability benchmarking, risk assessment, commercial negotiation — landing cost-reduction initiatives that contributed six-figure annual savings.',
        'Built Python automation and agentic AI workflows across 3 functions; designed Power BI dashboards lifting programme visibility for APAC procurement across 10+ markets and 50+ categories.',
      ],
    },
    {
      role: 'Research Assistant',
      company: 'Monash University VARS Lab',
      period: 'Jun 2024 – Dec 2024',
      location: 'Melbourne, VIC',
      bullets: [
        'Designed Python and R data pipelines processing 100K+ records through hypothesis-driven analysis, improving throughput 3× and contributing to one peer-reviewed publication.',
      ],
    },
    {
      role: 'Product Demonstrator and Content Creator',
      company: 'Dyson',
      period: 'Aug 2022 – Sep 2024',
      location: 'Melbourne, VIC',
      bullets: [
        'Ranked #1 nationally in sales for two consecutive years; broke the single-day floorcare sales record.',
        'Selected as exclusive content creator for branded launches — the role rewards turning technical product detail into customer language at speed.',
      ],
    },
    {
      role: 'Technical Support Analyst',
      company: 'YoureOnTime',
      period: 'Feb 2023 – May 2024',
      location: 'Melbourne, VIC',
      bullets: [
        'Owned client onboarding, data migration, and campaign coordination for a cloud SaaS platform across 200+ SME clients; insights drove 15%+ engagement uplift.',
      ],
    },
  ],
  pillars: [
    {
      title: 'Programme & Project Management',
      items: ['Programme delivery', 'Stakeholder engagement', 'Risk assessment', 'Cost-benefit analysis', 'Scenario planning', 'Cross-functional coordination', 'Lean Six Sigma', 'Agile', 'Procurement strategy'],
    },
    {
      title: 'Data & Engineering',
      items: ['Python', 'R', 'SQL', 'Excel / VBA', 'Power Query', 'Power Pivot', 'Power BI', 'Tableau', 'SAP ERP', 'Git', 'React', 'React Native', 'TypeScript', 'HTML / CSS', 'Supabase'],
    },
    {
      title: 'AI & Automation',
      items: ['Prompt engineering', 'Agentic AI workflows', 'LLM integration', 'GPT-4o', 'Mistral', 'Gemini', 'Process automation', 'Data pipelines'],
    },
    {
      title: 'Cloud, Tooling & Certifications',
      items: ['Azure', 'AWS', 'GCP', 'Docker', 'Kubernetes', 'Kali Linux', 'Burp Suite', 'Salesforce', 'Jira', 'Confluence', 'ServiceNow', 'CPP', 'Lean Six Sigma Yellow Belt'],
    },
  ],
  projects: [
    {
      name: 'Previa',
      subtitle: 'AI Financial Intelligence Platform',
      role: 'Co-Founder',
      description: 'Co-founded and shipped an AI platform that reconciles receipts for small businesses at 90%+ accuracy. Owned product, engineering, and go-to-market end-to-end.',
      tech: 'React · TypeScript · Supabase · Python · LLMs',
      link: 'https://github.com/demigod97/Previa-2.0',
      linkLabel: 'View on GitHub',
    },
    {
      name: 'GymBro',
      subtitle: 'AI-Powered Fitness App',
      role: 'Solo Developer',
      description: 'Solo build of an offline-first mobile fitness app on React Native + Expo. Most of the implementation came from agentic AI under my direction — the workflow itself is the project.',
      tech: 'React Native · Expo · TypeScript · SQLite · Zustand · Firebase',
      link: 'https://github.com/Mainulll/Gymbro-App',
      linkLabel: 'View on GitHub',
    },
    {
      name: 'Borealis Creative Group',
      subtitle: 'Digital Strategy',
      role: 'Project Lead',
      description: 'Led concurrent digital programmes for franchise clients — web build, SEO, paid media. Lifted organic traffic 40% across the portfolio.',
      tech: 'Figma · Web design · SEO · Analytics',
      link: 'https://docs.google.com/document/d/1s_JRAy8o3LNFfrVgoeCC3s_PzByHTtMg6zqxtgM6BxU/edit?tab=t.0',
      linkLabel: 'View Demos',
    },
  ],
  education: {
    degree: 'Bachelor of Information Technology and Bachelor of Commerce (Double Degree)',
    institution: 'Monash University',
    period: 'Jul 2022 – Nov 2026 (expected)',
    majors: 'Business Analytics · Cybersecurity',
    coursework: 'Coursework: machine learning, econometrics, statistical modelling, data visualisation, database systems, risk management.',
    highlights: [
      'Innovation for Impact Award (2024) — university-wide AI design award, judged on commercial viability, technical rigour, and societal impact.',
      'Global Immersion (Fiji) + Innovation Guarantee (Microsoft) — led two cross-cultural consulting engagements: UN SDG-aligned project delivery and AI-driven stakeholder experience prototypes.',
    ],
  },
  leadership: [
    {
      title: 'Programme Coordinator',
      org: 'Preflight STEM Initiative',
      period: '2024–Present',
      description: 'Founder. Self-funded STEM outreach for underrepresented students in Sri Lanka — I run the volunteer team, the curriculum, and the programme delivery.',
    },
    {
      title: 'Officer',
      org: 'Australian Air League',
      period: '2014–Present',
      description: '11+ years of youth leadership in aviation and civic education within a defence-aligned organisation. Mentored cadets and coordinated squadron operations.',
    },
    {
      title: 'Basketball Coach',
      org: 'Basketball Victoria / Waverley Raiders',
      period: '2017–2025',
      description: 'Coached junior teams for 8 years through state-level competitions.',
    },
    {
      title: 'Student Fundraiser',
      org: 'Monash University Alumni Outreach',
      period: '2024',
      description: 'Contributed to raising $300K+ for student scholarships through outbound engagement.',
    },
  ],
}

const NAV_LINKS = [
  { label: 'Experience', href: '#experience' },
  { label: 'Skills', href: '#skills' },
  { label: 'Projects', href: '#projects' },
  { label: 'Education', href: '#education' },
  { label: 'Leadership', href: '#leadership' },
]

/* ── Theme hook ───────────────────────────────────────────────────── */
function useTheme() {
  const [theme, setTheme] = useState(() => {
    if (typeof document === 'undefined') return 'light'
    return document.documentElement.getAttribute('data-theme') === 'dark' ? 'dark' : 'light'
  })

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
    localStorage.setItem('theme', theme)
  }, [theme])

  useEffect(() => {
    const mq = window.matchMedia('(prefers-color-scheme: dark)')
    const onChange = (e) => {
      if (!localStorage.getItem('theme-override')) {
        setTheme(e.matches ? 'dark' : 'light')
      }
    }
    mq.addEventListener('change', onChange)
    return () => mq.removeEventListener('change', onChange)
  }, [])

  const toggle = () => {
    localStorage.setItem('theme-override', '1')
    setTheme((t) => (t === 'dark' ? 'light' : 'dark'))
  }

  return [theme, toggle]
}

/* ── FadeUp helper ────────────────────────────────────────────────── */
function FadeUp({ children, delay = 0, as: Tag = 'div' }) {
  const Component = motion[Tag] || motion.div
  return (
    <Component
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.35, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </Component>
  )
}

/* ── Brand mark (24x24) ───────────────────────────────────────────── */
function BrandMark() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M12 2 L22 12 L12 22 L2 12 Z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
      <path d="M12 2 L12 22 M2 12 L22 12" stroke="currentColor" strokeWidth="0.8" strokeLinejoin="round" opacity="0.4" />
    </svg>
  )
}

/* ── Theme toggle icons ───────────────────────────────────────────── */
function SunIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="12" cy="12" r="4" stroke="currentColor" strokeWidth="1.6" />
      <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  )
}
function MoonIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M21 12.79A9 9 0 1 1 11.21 3a7 7 0 0 0 9.79 9.79z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
    </svg>
  )
}

/* ── Nav ──────────────────────────────────────────────────────────── */
function Nav() {
  const [theme, toggleTheme] = useTheme()
  const [active, setActive] = useState('')
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const obs = new IntersectionObserver(
      (entries) => entries.forEach((e) => { if (e.isIntersecting) setActive(e.target.id) }),
      { rootMargin: '-40% 0px -55% 0px' }
    )
    document.querySelectorAll('section[id]').forEach((s) => obs.observe(s))
    return () => obs.disconnect()
  }, [])

  const onClick = (e, href) => {
    e.preventDefault()
    document.querySelector(href)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    setOpen(false)
  }

  return (
    <header className="nav" aria-label="Site navigation">
      <div className="nav-inner">
        <a href="#top" className="nav-brand" onClick={(e) => onClick(e, '#top')}>
          <BrandMark />
          <span>Minul Lokuliyana</span>
        </a>
        <nav className="nav-links" aria-label="Sections">
          {NAV_LINKS.map((l) => (
            <a
              key={l.href}
              href={l.href}
              onClick={(e) => onClick(e, l.href)}
              className="nav-link"
              aria-current={active === l.href.slice(1) ? 'page' : undefined}
            >
              {l.label}
            </a>
          ))}
        </nav>
        <div className="nav-actions">
          <button
            type="button"
            onClick={toggleTheme}
            className="nav-toggle"
            aria-pressed={theme === 'dark'}
            aria-label={theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme'}
          >
            {theme === 'dark' ? <SunIcon /> : <MoonIcon />}
          </button>
          <a href={data.resumePdf} download="Minul_Lokuliyana_Resume.pdf" className="btn btn-primary btn-ghost" style={{ fontSize: '0.875rem' }}>
            Resume
          </a>
          <button
            type="button"
            className="nav-toggle nav-disclosure-btn"
            aria-expanded={open}
            aria-controls="nav-mobile-panel"
            aria-label={open ? 'Close menu' : 'Open menu'}
            onClick={() => setOpen((v) => !v)}
          >
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
              {open ? (
                <path d="M4 4l10 10M14 4L4 14" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
              ) : (
                <path d="M3 5h12M3 9h12M3 13h12" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
              )}
            </svg>
          </button>
        </div>
      </div>
      <AnimatePresence>
        {open && (
          <motion.div
            id="nav-mobile-panel"
            className="nav-disclosure-panel"
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.18 }}
          >
            {NAV_LINKS.map((l) => (
              <a
                key={l.href}
                href={l.href}
                onClick={(e) => onClick(e, l.href)}
                className="nav-link"
                aria-current={active === l.href.slice(1) ? 'page' : undefined}
              >
                {l.label}
              </a>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}

/* ── Section placeholders (filled in later tasks) ─────────────────── */
function Hero() {
  return (
    <section id="top" className="container hero">
      <p className="eyebrow hero-eyebrow">{data.location}</p>
      <h1>{data.name}</h1>
      <p style={{ color: 'var(--text-muted)' }}>{data.role}</p>
    </section>
  )
}
function Experience() { return <section id="experience" className="container section"><h2 className="section-title">Experience</h2></section> }
function Skills() { return <section id="skills" className="container section"><h2 className="section-title">Skills</h2></section> }
function Projects() { return <section id="projects" className="container section"><h2 className="section-title">Projects</h2></section> }
function Education() { return <section id="education" className="container section"><h2 className="section-title">Education</h2></section> }
function Leadership() { return <section id="leadership" className="container section"><h2 className="section-title">Leadership &amp; Impact</h2></section> }
function Footer() {
  return (
    <footer id="contact" className="container footer">
      <p style={{ fontSize: '0.9375rem', color: 'var(--text-muted)' }}>{data.name}</p>
      <p className="footer-tagline">Let's talk.</p>
      <nav className="footer-links" aria-label="Contact">
        <a href={`mailto:${data.contact.email}`}>Email</a>
        <a href={`tel:${data.contact.mobile}`}>Mobile</a>
        <a href={data.contact.linkedin} target="_blank" rel="noopener noreferrer">LinkedIn</a>
        <a href={data.contact.github} target="_blank" rel="noopener noreferrer">GitHub</a>
        <a href={data.contact.website} target="_blank" rel="noopener noreferrer">minul.vercel.app</a>
      </nav>
    </footer>
  )
}

/* ── App ──────────────────────────────────────────────────────────── */
export default function App() {
  return (
    <>
      <a href="#top" className="skip-link">Skip to content</a>
      <Nav />
      <main>
        <Hero />
        <Experience />
        <Skills />
        <Projects />
        <Education />
        <Leadership />
      </main>
      <Footer />
    </>
  )
}
```

- [ ] **Step 3: Verify build and dev**

Run: `npm run build`
Expected: build succeeds, no warnings about missing `Scene3D` import.

Run: `npm run dev`
Open `http://localhost:5173`. Expected:
- Page renders with sticky nav at top, brand mark + name on left, section links centred, theme toggle + Resume button on right.
- Hero shows location eyebrow, name as h1, role as muted text.
- Section placeholders (Experience, Skills, Projects, Education, Leadership) render with just titles.
- Footer renders with name, "Let's talk." tagline, and contact links.
- Theme toggle flips between light and dark cleanly. No flash on first paint.
- Resize window <760px: section links collapse, hamburger button appears.
- DevTools console: no errors, no warnings.

- [ ] **Step 4: Commit**

```bash
git add src/App.jsx src/Scene3D.jsx
git commit -m "$(cat <<'EOF'
feat(app): rewrite App.jsx skeleton with theme toggle and nav

Drops the inline <style> CSS-in-JS approach, the loading screen,
the dot grid, the cursor glow, the mesh orbs, the spotlight cards,
and the magazine layout. Adds a sticky top nav with a working
theme toggle (system-pref default, persisted override) and a
mobile disclosure pattern. Section components are stubbed and
will be filled in subsequent commits.

Deletes src/Scene3D.jsx — brand mark is now a tiny inline SVG
diamond in the nav.

Co-Authored-By: Claude Opus 4.7 <noreply@anthropic.com>
EOF
)"
```

---

## Task 3: Hero section — full content

**Files:**
- Modify: `src/App.jsx`

- [ ] **Step 1: Replace the `Hero` component**

Find the `Hero` placeholder in `src/App.jsx` (defined inside the "Section placeholders" block) and replace it with this full version:

```jsx
function Hero() {
  const [contactOpen, setContactOpen] = useState(false)
  const wrapRef = useRef(null)

  useEffect(() => {
    if (!contactOpen) return
    const onDown = (e) => { if (!wrapRef.current?.contains(e.target)) setContactOpen(false) }
    document.addEventListener('pointerdown', onDown)
    return () => document.removeEventListener('pointerdown', onDown)
  }, [contactOpen])

  return (
    <section id="top" className="container hero">
      <FadeUp>
        <p className="eyebrow hero-eyebrow">{data.location}</p>
        <h1>{data.name}</h1>
        <p className="hero-rolepill">{data.role}</p>
        <p className="chip hero-chip"><span className="chip-dot" aria-hidden="true" />{data.openTo}</p>
        <p className="hero-pitch">{data.pitch}</p>
        <div className="hero-cta-row" ref={wrapRef}>
          <a href={data.resumePdf} download="Minul_Lokuliyana_Resume.pdf" className="btn btn-primary">
            Download Resume
          </a>
          {!contactOpen ? (
            <button type="button" className="btn btn-secondary" onClick={() => setContactOpen(true)}>
              Contact
            </button>
          ) : (
            <>
              <a href={`tel:${data.contact.mobile}`} className="btn btn-secondary">Mobile</a>
              <a href={`mailto:${data.contact.email}`} className="btn btn-secondary">Email</a>
            </>
          )}
        </div>
        <nav className="hero-links" aria-label="Profiles">
          <a href={data.contact.linkedin} target="_blank" rel="noopener noreferrer">LinkedIn</a>
          <a href={data.contact.github} target="_blank" rel="noopener noreferrer">GitHub</a>
          <a href={`mailto:${data.contact.email}`}>Email</a>
        </nav>
      </FadeUp>
    </section>
  )
}
```

- [ ] **Step 2: Verify build and dev**

Run: `npm run build`
Expected: success.

Run: `npm run dev`
Expected:
- Hero shows: eyebrow → name → role pill → "● Open to graduate roles…" chip → pitch paragraph → Resume + Contact CTA row → LinkedIn/GitHub/Email links.
- Click "Contact" → button is replaced inline by Mobile + Email buttons. Click outside → reverts to "Contact".
- Both light and dark mode look correct; chip colour reflects accent.
- Pitch text wraps at ~64ch, doesn't run edge-to-edge.

- [ ] **Step 3: Commit**

```bash
git add src/App.jsx
git commit -m "$(cat <<'EOF'
feat(hero): wire hero content with contact split

Adds eyebrow, name, role pill, open-to chip, pitch paragraph,
and the Resume / Contact CTA pair (Contact expands inline to
Mobile + Email). Inline LinkedIn / GitHub / Email link row
underneath. Single FadeUp wrapper for the whole block.

Co-Authored-By: Claude Opus 4.7 <noreply@anthropic.com>
EOF
)"
```

---

## Task 4: Experience section

**Files:**
- Modify: `src/App.jsx`

- [ ] **Step 1: Replace the `Experience` component**

```jsx
function Experience() {
  return (
    <section id="experience" className="container section">
      <FadeUp><h2 className="section-title">Experience</h2></FadeUp>
      <div className="experience-list">
        {data.experience.map((exp, i) => (
          <FadeUp key={exp.company} delay={i * 0.05}>
            <article className="card exp-card">
              <header className="exp-head">
                <h3>{exp.role}</h3>
                <p className="exp-meta">
                  {exp.company} · {exp.period} · {exp.location}
                </p>
              </header>
              <ul className="bullets">
                {exp.bullets.map((b) => <li key={b}>{b}</li>)}
              </ul>
            </article>
          </FadeUp>
        ))}
      </div>
    </section>
  )
}
```

- [ ] **Step 2: Verify**

Run: `npm run build && npm run dev`
Expected:
- Experience section renders 5 role cards in newest-first order: BSH → Cummins → VARS Lab → Dyson → YoureOnTime.
- Each card: role title (h3), company · period · location meta line, bullet list with • markers.
- Cards stagger in with FadeUp on scroll (0, 50, 100, 150, 200ms delays).
- Bullet text matches the spec verbatim — pay particular attention to the Dyson card's second bullet about "turning technical product detail into customer language at speed".

- [ ] **Step 3: Commit**

```bash
git add src/App.jsx
git commit -m "$(cat <<'EOF'
feat(experience): render 5-role timeline with rewritten bullets

Newest first. Each role is a card with role/company/period/location
header and a tightened bullet list. Run-on sentences from the
previous spec have been split; filler clauses removed. The Dyson
bullet adds a sentence framing the role around translating
technical detail into customer language.

Co-Authored-By: Claude Opus 4.7 <noreply@anthropic.com>
EOF
)"
```

---

## Task 5: Skills, Projects, Education, Leadership sections

**Files:**
- Modify: `src/App.jsx`

These four sections are short and structurally similar enough to land together. Each ends with a build verification.

- [ ] **Step 1: Replace `Skills`**

```jsx
function Skills() {
  return (
    <section id="skills" className="container section">
      <FadeUp><h2 className="section-title">Skills</h2></FadeUp>
      <div className="pillars-grid">
        {data.pillars.map((pillar, i) => (
          <FadeUp key={pillar.title} delay={i * 0.05}>
            <article className="card pillar-card">
              <h3>{pillar.title}</h3>
              <div className="pillar-tags">
                {pillar.items.map((item) => <span key={item} className="tag">{item}</span>)}
              </div>
            </article>
          </FadeUp>
        ))}
      </div>
    </section>
  )
}
```

- [ ] **Step 2: Replace `Projects`**

```jsx
function Projects() {
  return (
    <section id="projects" className="container section">
      <FadeUp><h2 className="section-title">Projects</h2></FadeUp>
      <div className="project-list">
        {data.projects.map((p, i) => (
          <FadeUp key={p.name} delay={i * 0.05}>
            <article className="card project-card">
              <p className="project-role">{p.role}</p>
              <h3>{p.name} <span className="muted" style={{ fontWeight: 500 }}>— {p.subtitle}</span></h3>
              <p>{p.description}</p>
              <p className="project-tech">{p.tech}</p>
              {p.link && (
                <a href={p.link} target="_blank" rel="noopener noreferrer">{p.linkLabel || 'View project'} →</a>
              )}
            </article>
          </FadeUp>
        ))}
      </div>
    </section>
  )
}
```

- [ ] **Step 3: Replace `Education`**

```jsx
function Education() {
  return (
    <section id="education" className="container section">
      <FadeUp><h2 className="section-title">Education</h2></FadeUp>
      <FadeUp delay={0.05}>
        <article className="card edu-card">
          <h3>{data.education.degree}</h3>
          <p className="exp-meta">{data.education.institution} · {data.education.period}</p>
          <p style={{ marginTop: '0.25rem' }}>Majors: {data.education.majors}</p>
          <p className="edu-coursework">{data.education.coursework}</p>
          <ul className="bullets">
            {data.education.highlights.map((h) => <li key={h}>{h}</li>)}
          </ul>
        </article>
      </FadeUp>
    </section>
  )
}
```

- [ ] **Step 4: Replace `Leadership`**

```jsx
function Leadership() {
  return (
    <section id="leadership" className="container section">
      <FadeUp><h2 className="section-title">Leadership &amp; Impact</h2></FadeUp>
      <div className="leadership-list">
        {data.leadership.map((item, i) => (
          <FadeUp key={item.org} delay={i * 0.04}>
            <article className="card leadership-card">
              <h3>{item.title} · <span className="muted" style={{ fontWeight: 500 }}>{item.org}</span></h3>
              <p className="exp-meta">{item.period}</p>
              <p style={{ marginTop: '0.5rem' }}>{item.description}</p>
            </article>
          </FadeUp>
        ))}
      </div>
    </section>
  )
}
```

- [ ] **Step 5: Verify**

Run: `npm run build && npm run dev`
Expected:
- Skills: 2×2 grid of pillar cards (single column under 640px). Pillar order: Programme & Project Management → Data & Engineering → AI & Automation → Cloud, Tooling & Certifications. Tag chips rendered as small pills inside each card.
- Projects: 3 cards stacked, each with a small ROLE label (uppercase, accent), name + subtitle, description, tech line, link.
- Education: single card with degree, institution · period, majors, italic coursework line, two highlight bullets.
- Leadership: 4 cards stacked, each with title · org, period meta, one-line description.
- All FadeUps trigger as you scroll.
- DevTools console clean.

- [ ] **Step 6: Commit**

```bash
git add src/App.jsx
git commit -m "$(cat <<'EOF'
feat(sections): render skills, projects, education, leadership

Four content sections with rewritten copy and renamed skill
pillars (Programme & Project Management leads). Project blurbs
tightened for active voice; education highlights cleaned up;
leadership descriptions match the spec verbatim.

Co-Authored-By: Claude Opus 4.7 <noreply@anthropic.com>
EOF
)"
```

---

## Task 6: Final verification + polish

**Files:**
- Possibly: `src/App.jsx`, `src/index.css` (only if issues are found)

This task does not pre-suppose changes. It runs through the spec's Definition of Done and fixes anything that fails.

- [ ] **Step 1: Production build clean**

Run: `npm run build`
Expected: zero warnings, no missing-asset errors, bundle output written to `dist/`.

- [ ] **Step 2: Dev console clean**

Run: `npm run dev` and open `http://localhost:5173`. Open DevTools.
Expected: no errors, no warnings, no React hydration messages.

- [ ] **Step 3: Theme behaviour**

Manual checks:
- Open in a private window with OS in light mode → page paints light, no flash.
- Open in a private window with OS in dark mode → page paints dark, no flash.
- Click toggle → switches; reload → stays in chosen theme.
- After clicking toggle, change OS theme → page does not change (override is sticky).
- Clear `localStorage`, reload → tracks OS again.

- [ ] **Step 4: Mobile responsive check**

In DevTools, set viewport to 320×640.
Expected: no horizontal scroll, all content readable, nav links collapsed into hamburger, hero CTAs stack, skills become single column, hit targets ≥44px.

- [ ] **Step 5: Keyboard / a11y check**

Tab through the whole page from the top.
Expected:
- First focus is the "Skip to content" link (becomes visible).
- Then nav brand → section links → theme toggle → Resume button.
- Then hero CTAs → links → into experience cards.
- Every interactive element has a visible focus ring.

Use a contrast checker (e.g. browser devtools) to verify body and meta text in both themes pass AA.

- [ ] **Step 6: Reduced motion check**

In DevTools, enable "Emulate CSS prefers-reduced-motion: reduce". Reload.
Expected: all FadeUps render at final state immediately, no transitions on hover, no smooth-scroll on anchor clicks.

- [ ] **Step 7: Mark old spec as superseded**

Edit `docs/superpowers/specs/2026-04-12-resume-site-redesign-design.md`. Change line 5 from:

```
**Status:** Approved
```

to:

```
**Status:** Superseded by `2026-05-09-recruiter-readable-redesign-design.md`
```

- [ ] **Step 8: Final commit + push**

If any fixes were needed in steps 1–6, commit them with a message describing the fix. Then mark-superseded commit:

```bash
git add docs/superpowers/specs/2026-04-12-resume-site-redesign-design.md
git commit -m "$(cat <<'EOF'
docs: mark 2026-04-12 redesign spec as superseded

Co-Authored-By: Claude Opus 4.7 <noreply@anthropic.com>
EOF
)"
```

Then push the whole branch:

```bash
git push origin main
```

---

## Self-review (executed pre-publish)

**1. Spec coverage:** All spec sections trace to a task —
- Visual identity (tokens) → Task 1
- Theming behaviour + no-flash → Task 1 (HTML script) + Task 2 (`useTheme`)
- Layout (nav, hero, sections, footer) → Tasks 2–5
- Animation (FadeUp) → Task 2
- Component architecture → Task 2 (single-file)
- Accessibility (skip link, focus rings, aria-current, aria-pressed) → Task 1 (CSS) + Task 2 (Nav) + Task 6 (verification)
- Performance (no 3D, no backdrop-filter except subtle nav) → Task 1 + Task 2 (Scene3D delete)
- Copy rewrite → Task 2 `data` object + Task 3–5 components
- Files touched → all four (`index.html`, `index.css`, `App.jsx`, `Scene3D.jsx`)
- Definition of Done → Task 6

**2. Placeholder scan:** No "TBD"/"TODO"/"appropriate" / "etc"; every code block is the actual code to land. The Step "if any fixes were needed" in Task 6 isn't a placeholder — it's a conditional that only fires if verification surfaces real issues.

**3. Type / name consistency:**
- `useTheme` returns `[theme, toggle]` in the hook definition and is destructured the same way in `Nav`. ✓
- `data.openTo`, `data.pitch`, `data.role`, `data.location`, `data.contact.*` — all used in Hero match the data shape. ✓
- `data.experience[].bullets` is the array name used in both the data object and `Experience.map`. (Note: previous spec called this `highlights`. The plan uses `bullets` consistently in the new code — this is intentional, the old name doesn't apply to the new code.) ✓
- `data.pillars` (plan) corresponds to old `data.skillPillars`. The plan uses `data.pillars` consistently. ✓
- `BrandMark`, `SunIcon`, `MoonIcon`, `FadeUp`, `Nav`, `Hero`, `Experience`, `Skills`, `Projects`, `Education`, `Leadership`, `Footer`, `App` — all defined and referenced consistently. ✓

**4. Spec-only items not yet covered:** none found.
