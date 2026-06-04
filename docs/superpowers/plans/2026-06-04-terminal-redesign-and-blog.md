# Terminal Redesign + Blog System Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the existing warm-cream / Fraunces portfolio design with a modern electric/dark terminal aesthetic, then add a file-based markdown blog with custom authoring CLI, routing, and RSS.

**Architecture:** Two phases. Phase 1 is a pure visual rewrite — same data, same single-page layout, new tokens / fonts / hero with boot-sequence animation / restyled sections. Phase 2 adds `react-router-dom` and overlays a file-based markdown blog (`src/content/posts/*.md`) with a homepage section, a full index page, individual post pages, an RSS feed, and a `npm run new-post` CLI scaffolder. Each phase ships independently; Phase 1 alone is a complete redesigned site.

**Tech Stack:**
- Existing: Vite 6, React 18, framer-motion
- Phase 2 additions: `react-router-dom@^6`, `react-markdown@^9`, `remark-gfm@^4`, `rehype-highlight@^7`, `highlight.js@^11`, `gray-matter@^4`

**Spec:** `docs/superpowers/specs/2026-06-04-terminal-redesign-design.md` is the source of truth for design tokens, copy, and architecture decisions. This plan operationalises it.

---

## File Structure

### Phase 1 — visual redesign

**Modify:**
- `index.html` — replace font preloads (Geist + JetBrains Mono), update title, update theme pre-paint default to `dark`, update theme-color metas
- `src/index.css` — replace tokens, replace base typography, remove Fraunces / Inter references, add terminal-card / mono-chip / boot utilities
- `src/App.jsx` — strip warm-cream visual primitives; rewrite Nav, Hero, SectionHeader, Experience, Skills, Projects, Education, Leadership, Footer; remove `data.openTo`, update `data.role`
- `vite.config.js` — no change in Phase 1 (validated against existing manualChunks)

**Create:**
- `src/components/BootSequence.jsx` — full-overlay boot animation, dismounts on completion

### Phase 2 — blog

**Modify:**
- `src/main.jsx` — wrap `<App />` in `<BrowserRouter>` + `<Routes>`
- `src/App.jsx` — add `<Writing />` section, add `Writing` link to `NAV_LINKS`
- `src/index.css` — add post-page typography styles, markdown body styles
- `index.html` — add RSS `<link rel="alternate">`
- `package.json` — add 6 production deps + `new-post` script
- `vite.config.js` — add RSS feed plugin, add vendor chunks for router + markdown
- `CLAUDE.md` — refresh tech list, document new authoring flow

**Create:**
- `src/components/PostPage.jsx` — individual post route
- `src/components/WritingIndex.jsx` — full chronological index at `/writing`
- `src/components/NotFound.jsx` — terminal-styled 404
- `src/lib/posts.js` — glob loader + frontmatter parse + sort + reading-time
- `src/content/posts/2026-06-04-hello.md` — seed welcome post
- `scripts/new-post.mjs` — authoring CLI
- `vercel.json` — SPA rewrite

---

## Phase 1 — Visual Redesign

### Task P1.1: Swap palette tokens, fonts, and base typography

**Files:**
- Modify: `index.html` (lines 8–9, 23–28, 33–44, 46)
- Modify: `src/index.css` (lines 1–100)

This is the foundation: tokens, fonts, base styles. Subsequent tasks restyle components against this foundation. The page will look broken between this task and P1.3 since old class names still reference removed tokens — that's expected.

- [ ] **Step 1: Replace `index.html` font preloads, theme-color metas, theme pre-paint default, and title**

Edit `index.html`. Replace lines 8–9 (theme-color metas):

```html
    <meta name="theme-color" content="#060611" />
```

Replace lines 23–28 (Fraunces + Inter preloads) with Geist + JetBrains Mono:

```html
    <!-- Fonts: Geist (display & body) + JetBrains Mono (terminal) -->
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link rel="preload" as="style" href="https://fonts.googleapis.com/css2?family=Geist:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500;600&display=swap" />
    <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Geist:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500;600&display=swap" media="print" onload="this.media='all'" />
    <noscript><link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Geist:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500;600&display=swap" /></noscript>
```

Replace the pre-paint script (lines 33–44) so dark is the default when nothing is stored and nothing is preferred:

```html
    <!-- Pre-paint theme: must run before body to avoid flash -->
    <script>
      (function () {
        try {
          var t = localStorage.getItem('theme');
          if (t !== 'light' && t !== 'dark') {
            t = window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
          }
          document.documentElement.setAttribute('data-theme', t);
        } catch (e) {
          document.documentElement.setAttribute('data-theme', 'dark');
        }
      })();
    </script>
```

Update the title (line 46):

```html
    <title>Minul Lokuliyana — Customer Success @ Aphex</title>
```

Update the og/twitter metas (lines 14–15, 20–21) for the new framing:

```html
    <meta property="og:title" content="Minul Lokuliyana — Customer Success @ Aphex" />
    <meta property="og:description" content="Customer Success at Aphex, helping major contractors plan and deliver better. Final-year Business Analytics & Cybersecurity at Monash." />
```

```html
    <meta name="twitter:title" content="Minul Lokuliyana — Customer Success @ Aphex" />
    <meta name="twitter:description" content="Customer Success at Aphex, helping major contractors plan and deliver better. Final-year Business Analytics & Cybersecurity at Monash." />
```

Update the top-level meta description (line 6) similarly:

```html
    <meta name="description" content="Customer Success at Aphex. Final-year Business Analytics & Cybersecurity at Monash. Project coordinator focused on cross-functional delivery." />
```

- [ ] **Step 2: Rewrite `src/index.css` lines 1–100 — new tokens, reset, base type, links/selection**

Replace the entire token block + reset + base typography (lines 1–100) with:

```css
/* ── Tokens — Electric / Terminal ──────────────────────────────────── */
:root,
:root[data-theme='dark'] {
  --bg: #060611;
  --bg-overlay-sky: radial-gradient(ellipse 60% 50% at 15% 0%, rgba(56, 189, 248, 0.18), transparent 60%);
  --bg-overlay-violet: radial-gradient(ellipse 50% 40% at 85% 100%, rgba(167, 139, 250, 0.14), transparent 60%);
  --bg-grid: linear-gradient(rgba(255, 255, 255, 0.022) 1px, transparent 1px),
             linear-gradient(90deg, rgba(255, 255, 255, 0.022) 1px, transparent 1px);

  --surface: rgba(15, 16, 28, 0.72);
  --surface-2: rgba(15, 16, 28, 0.5);
  --border: rgba(255, 255, 255, 0.07);
  --border-strong: rgba(255, 255, 255, 0.12);

  --text: #f5f6fb;
  --text-muted: #8b8da5;
  --text-dim: #5a5d75;

  --accent: #7dd3fc;
  --accent-strong: #38bdf8;
  --accent-soft: rgba(125, 211, 252, 0.08);
  --accent-violet: #c4b5fd;
  --accent-green: #34d399;
  --accent-red: #f87171;

  --focus: rgba(56, 189, 248, 0.55);

  --shadow: 0 1px 2px rgba(0, 0, 0, 0.4), 0 12px 32px rgba(0, 0, 0, 0.35);
  --shadow-lg: 0 4px 16px rgba(0, 0, 0, 0.5), 0 30px 80px rgba(0, 0, 0, 0.45);
  --glow-sky: 0 0 80px rgba(56, 189, 248, 0.08);
}

:root[data-theme='light'] {
  --bg: #fafafa;
  --bg-overlay-sky: radial-gradient(ellipse 60% 50% at 15% 0%, rgba(56, 189, 248, 0.10), transparent 60%);
  --bg-overlay-violet: radial-gradient(ellipse 50% 40% at 85% 100%, rgba(167, 139, 250, 0.08), transparent 60%);
  --bg-grid: linear-gradient(rgba(0, 0, 0, 0.02) 1px, transparent 1px),
             linear-gradient(90deg, rgba(0, 0, 0, 0.02) 1px, transparent 1px);

  --surface: rgba(255, 255, 255, 0.85);
  --surface-2: #f4f4f5;
  --border: #e4e4e7;
  --border-strong: #d4d4d8;

  --text: #0a0a0a;
  --text-muted: #52525b;
  --text-dim: #a1a1aa;

  --accent: #0284c7;
  --accent-strong: #0369a1;
  --accent-soft: rgba(2, 132, 199, 0.08);
  --accent-violet: #7c3aed;
  --accent-green: #059669;
  --accent-red: #dc2626;

  --focus: rgba(3, 105, 161, 0.5);

  --shadow: 0 1px 2px rgba(10, 10, 10, 0.04), 0 12px 32px rgba(10, 10, 10, 0.06);
  --shadow-lg: 0 4px 16px rgba(10, 10, 10, 0.06), 0 30px 80px rgba(10, 10, 10, 0.08);
  --glow-sky: 0 0 80px rgba(2, 132, 199, 0.06);
}

/* ── Reset ─────────────────────────────────────────────────────────── */
*, *::before, *::after { box-sizing: border-box; }
* { margin: 0; padding: 0; }
html { scroll-behavior: smooth; -webkit-text-size-adjust: 100%; scroll-padding-top: 72px; }
body {
  background: var(--bg);
  background-image: var(--bg-overlay-sky), var(--bg-overlay-violet), var(--bg-grid);
  background-size: auto, auto, 36px 36px, 36px 36px;
  background-attachment: fixed;
  color: var(--text);
  font-family: 'Geist', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  font-size: 1rem;
  line-height: 1.6;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-rendering: optimizeLegibility;
  -webkit-tap-highlight-color: transparent;
  overflow-x: hidden;
  transition: background-color 0.25s ease, color 0.25s ease;
}
img, svg { display: block; max-width: 100%; }
ul { list-style: none; }
a { color: var(--accent); text-decoration: none; }
button { font: inherit; color: inherit; background: transparent; border: 0; cursor: pointer; }

/* ── Selection / focus ─────────────────────────────────────────────── */
::selection { background: var(--accent-soft); color: var(--accent-strong); }
:focus-visible { outline: 2px solid var(--focus); outline-offset: 3px; border-radius: 4px; }

/* ── Skip to content ───────────────────────────────────────────────── */
.skip-link {
  position: fixed; top: -40px; left: 12px; padding: 0.5rem 0.9rem;
  background: var(--accent-strong); color: var(--bg); border-radius: 6px;
  font-size: 0.875rem; font-weight: 600; z-index: 1000;
  transition: top 0.15s ease;
}
.skip-link:focus { top: 12px; text-decoration: none; }

/* ── Mono utility ──────────────────────────────────────────────────── */
.mono {
  font-family: 'JetBrains Mono', ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
}

/* ── Layout container ──────────────────────────────────────────────── */
.container { max-width: 780px; margin: 0 auto; padding: 0 1.5rem; }
.container-wide { max-width: 960px; margin: 0 auto; padding: 0 1.5rem; }
```

- [ ] **Step 3: Run dev server and confirm fonts + background load**

```bash
npm run dev
```

Open http://localhost:5173. Expected: page is visually broken (all components still use old class structure), but the body background should be dark `#060611` with subtle aurora glow + grid pattern. View source → Geist + JetBrains Mono should be loaded. No console errors related to CSS or font loading. Stop the dev server with Ctrl+C.

- [ ] **Step 4: Commit**

```bash
git add index.html src/index.css
git commit -m "feat(theme): swap palette and fonts to electric + terminal"
```

---

### Task P1.2: Build `BootSequence` component and mount it

**Files:**
- Create: `src/components/BootSequence.jsx`
- Modify: `src/App.jsx` (top of file — add import; `App` component — render before main content)
- Modify: `src/index.css` (append boot-sequence styles)

- [ ] **Step 1: Create `src/components/BootSequence.jsx` with full content**

```jsx
import { useEffect, useState } from 'react'
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion'

const LINES = [
  { kind: 'cmd', text: './portfolio.sh --theme=electric' },
  { kind: 'ok', text: 'mounting /minul/portfolio' },
  { kind: 'ok', text: 'loading config.json' },
  { kind: 'ok', text: 'initialising theme → electric' },
  { kind: 'ok', text: 'hydrating sections (5 found)' },
  { kind: 'ok', text: 'ready in 0.8s' },
  { kind: 'done', text: 'open hero' },
]

export default function BootSequence() {
  const reduce = useReducedMotion()
  const [visible, setVisible] = useState(true)

  useEffect(() => {
    if (reduce) {
      setVisible(false)
      return
    }
    const total = 1350 // ms — matches last animation-delay + buffer
    const t = setTimeout(() => setVisible(false), total)
    return () => clearTimeout(t)
  }, [reduce])

  if (reduce) return null

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className="boot-overlay"
          aria-hidden="true"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
        >
          <div className="boot-window">
            <div className="boot-titlebar">
              <div className="boot-dots"><span /><span /><span /></div>
              <div className="boot-title mono">portfolio.sh — booting…</div>
              <div style={{ width: 47 }} />
            </div>
            <div className="boot-body mono">
              {LINES.map((l, i) => (
                <div
                  key={i}
                  className={`boot-line boot-${l.kind}`}
                  style={{ animationDelay: `${0.1 + i * 0.2}s` }}
                >
                  {l.kind === 'cmd' && <span className="boot-prompt">$</span>}
                  {l.kind === 'ok' && <span className="boot-ok">[ OK ]</span>}
                  {l.kind === 'done' && <span className="boot-prompt">$</span>}
                  <span className="boot-text">{l.text}</span>
                  {l.kind === 'done' && <span className="boot-cursor" />}
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
```

- [ ] **Step 2: Append boot-sequence styles to `src/index.css`**

Append at the end of `src/index.css`:

```css
/* ── Boot sequence overlay ─────────────────────────────────────────── */
.boot-overlay {
  position: fixed; inset: 0;
  background: var(--bg);
  background-image: var(--bg-overlay-sky), var(--bg-overlay-violet);
  z-index: 10000;
  display: flex; align-items: center; justify-content: center;
  padding: 1.5rem;
}
.boot-window {
  width: 100%; max-width: 580px;
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: 12px;
  box-shadow: var(--shadow-lg), var(--glow-sky);
  overflow: hidden;
  backdrop-filter: blur(10px);
}
.boot-titlebar {
  display: flex; align-items: center;
  padding: 0.55rem 0.9rem;
  background: linear-gradient(180deg, rgba(255, 255, 255, 0.04), rgba(255, 255, 255, 0.01));
  border-bottom: 1px solid var(--border);
}
.boot-dots { display: flex; gap: 6px; }
.boot-dots span { width: 11px; height: 11px; border-radius: 50%; display: inline-block; }
.boot-dots span:nth-child(1) { background: #ff5f57; }
.boot-dots span:nth-child(2) { background: #febc2e; }
.boot-dots span:nth-child(3) { background: #28c840; }
.boot-title { flex: 1; text-align: center; font-size: 0.72rem; color: var(--text-muted); letter-spacing: 0.04em; }
.boot-body {
  padding: 1.25rem 1.5rem 1.5rem;
  font-size: 0.84rem;
  line-height: 1.7;
  color: #c3c5dc;
}
.boot-line {
  display: flex; gap: 0.6rem;
  opacity: 0;
  animation: boot-line-in 0.25s ease forwards;
}
.boot-line .boot-prompt { color: var(--accent-strong); user-select: none; font-weight: 500; }
.boot-line .boot-ok { color: var(--accent-green); font-weight: 500; }
.boot-line .boot-text { color: #c3c5dc; }
.boot-line.boot-done { margin-top: 0.4rem; }
.boot-line.boot-done .boot-text { color: var(--accent-strong); font-weight: 500; }
.boot-cursor {
  display: inline-block;
  width: 8px; height: 1.05em;
  background: var(--accent-strong);
  vertical-align: -2px;
  margin-left: 3px;
  animation: boot-blink 1.05s steps(2) infinite;
}
@keyframes boot-line-in { to { opacity: 1; } }
@keyframes boot-blink { 0%, 50% { opacity: 1; } 50.01%, 100% { opacity: 0; } }

@media (prefers-reduced-motion: reduce) {
  .boot-overlay { display: none !important; }
}
```

- [ ] **Step 3: Import and render `BootSequence` in `src/App.jsx`**

At the top of `src/App.jsx`, after the existing imports, add:

```jsx
import BootSequence from './components/BootSequence.jsx'
```

In the `App` component (currently lines 568–584), wrap the existing return so `BootSequence` renders first:

```jsx
export default function App() {
  return (
    <>
      <BootSequence />
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

- [ ] **Step 4: Run dev server and verify the boot animation**

```bash
npm run dev
```

Open http://localhost:5173. Expected: ~1.2s boot overlay with cascading lines + final `$ open hero` with cursor, then overlay fades out and reveals the (still-old-looking) page underneath. Hard-refresh the page a few times to confirm it runs each load.

Open DevTools → Rendering → toggle "Emulate CSS prefers-reduced-motion: reduce". Refresh. Expected: no overlay, page shows immediately.

Stop the dev server.

- [ ] **Step 5: Commit**

```bash
git add src/components/BootSequence.jsx src/App.jsx src/index.css
git commit -m "feat(boot): add terminal-styled loading animation overlay"
```

---

### Task P1.3: Rebuild Hero with terminal window, typing cascade, updated copy

**Files:**
- Modify: `src/App.jsx` — rewrite `Hero` component (lines 378–438), update `data.role`, remove `data.openTo`, remove `NameReveal` and `BrandMark` helpers if Nav no longer needs them (BrandMark is used by Nav — keep for now, rebuild in P1.4)
- Modify: `src/index.css` — append hero terminal styles

- [ ] **Step 1: Update `data` object in `src/App.jsx` (lines 5–17)**

Replace `data.role` (line 9) and remove `data.openTo` (line 10) entirely. Replace lines 8–10 with:

```jsx
  location: 'Melbourne, Australia',
  role: 'Customer Success @ Aphex · Final-year student at Monash',
```

The `openTo` field no longer exists.

- [ ] **Step 2: Replace the `Hero` component**

Replace the entire `Hero` function (currently lines 378–438) with:

```jsx
/* ── Hero ─────────────────────────────────────────────────────────── */
function Hero() {
  const reduce = useReducedMotion()
  const baseDelay = reduce ? 0 : 1.35 // start after boot overlay clears

  return (
    <section id="top" className="container hero">
      <motion.div
        className="hero-eyebrow mono"
        initial={{ opacity: 0, y: 4 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: baseDelay, ease: [0.22, 1, 0.36, 1] }}
      >
        <span className="hero-pulse" aria-hidden="true" />
        {data.location} · v2026.1
      </motion.div>

      <motion.div
        className="term-window hero-term"
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: baseDelay + 0.1, ease: [0.22, 1, 0.36, 1] }}
      >
        <div className="term-titlebar">
          <div className="term-dots"><span /><span /><span /></div>
          <div className="term-title mono">minul@portfolio — zsh — 86×24</div>
          <div className="term-tab mono">~ /</div>
        </div>
        <div className="term-body mono">
          <HeroLine delay={baseDelay + 0.30} prompt>whoami</HeroLine>
          <HeroLine delay={baseDelay + 0.55} kind="name">{data.name}</HeroLine>

          <HeroLine delay={baseDelay + 0.85} prompt>cat ~/role.txt</HeroLine>
          <HeroLine delay={baseDelay + 1.10} kind="role">
            Customer Success <span className="hero-at">@</span> Aphex
            <span className="hero-sep">·</span>
            Final-year student at Monash
          </HeroLine>

          <HeroLine delay={baseDelay + 1.45} prompt>cat ~/about.md</HeroLine>
          <HeroLine delay={baseDelay + 1.70} kind="bio">
            I work in <em>customer success</em> at <em>Aphex</em>, helping major contractors plan and deliver better. I keep cross-functional teams aligned and ship high-value work on time. Strong on communication, organisation, and stakeholder management — with a soft spot for the unglamorous process improvements that quietly compound. Finishing <em>Business Analytics &amp; Cybersecurity</em> at Monash.
          </HeroLine>

          <HeroLine delay={baseDelay + 2.20} prompt>ls ~/links/</HeroLine>
          <HeroLine delay={baseDelay + 2.45} kind="links">
            <a href={data.contact.linkedin} target="_blank" rel="noopener noreferrer">linkedin</a>
            <a href={data.contact.github} target="_blank" rel="noopener noreferrer">github</a>
            <a href={`mailto:${data.contact.email}`}>email</a>
            <a href={data.resumePdf} download="Minul_Lokuliyana_Resume.pdf">resume.pdf</a>
          </HeroLine>

          <HeroLine delay={baseDelay + 2.85} prompt cursor />
        </div>
      </motion.div>

      <motion.div
        className="hero-cta-row"
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, delay: baseDelay + 3.0, ease: [0.22, 1, 0.36, 1] }}
      >
        <a href={data.resumePdf} download="Minul_Lokuliyana_Resume.pdf" className="btn btn-primary">
          Download resume
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
            <path d="M7 1v8M4 6l3 3 3-3M2 12h10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </a>
        <a href={`mailto:${data.contact.email}`} className="btn btn-secondary">Get in touch</a>
      </motion.div>
    </section>
  )
}

function HeroLine({ children, delay, prompt = false, cursor = false, kind }) {
  const reduce = useReducedMotion()
  const className = `term-line${kind ? ` term-${kind}` : ''}${prompt ? ' term-cmd' : ' term-out'}`
  return (
    <motion.div
      className={className}
      initial={reduce ? false : { opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.25, delay, ease: 'easeOut' }}
    >
      {prompt && <span className="term-prompt">$</span>}
      <span className="term-content">{children}</span>
      {cursor && <span className="term-cursor" />}
    </motion.div>
  )
}
```

- [ ] **Step 3: Remove the `NameReveal` helper from `src/App.jsx`**

Delete the entire `NameReveal` function (currently lines 212–238) including its surrounding comment block. It is no longer referenced.

- [ ] **Step 4: Append hero + terminal-window styles to `src/index.css`**

Append at the end of `src/index.css`:

```css
/* ── Hero ──────────────────────────────────────────────────────────── */
.hero { padding: 5rem 0 4rem; position: relative; }

.hero-eyebrow {
  display: inline-flex; align-items: center; gap: 0.5rem;
  font-size: 0.72rem; letter-spacing: 0.18em; text-transform: uppercase;
  color: var(--text-muted);
  margin-bottom: 1rem;
}
.hero-pulse {
  width: 7px; height: 7px; border-radius: 50%;
  background: var(--accent-green);
  box-shadow: 0 0 0 0 rgba(52, 211, 153, 0.5);
  animation: hero-pulse 2s ease-out infinite;
}
@keyframes hero-pulse {
  0% { box-shadow: 0 0 0 0 rgba(52, 211, 153, 0.5); }
  70% { box-shadow: 0 0 0 8px rgba(52, 211, 153, 0); }
  100% { box-shadow: 0 0 0 0 rgba(52, 211, 153, 0); }
}

/* ── Terminal window (shared with post page) ──────────────────────── */
.term-window {
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: 14px;
  box-shadow: var(--shadow), var(--glow-sky);
  overflow: hidden;
  backdrop-filter: blur(12px);
}
.term-titlebar {
  display: flex; align-items: center;
  padding: 0.65rem 1rem;
  background: linear-gradient(180deg, rgba(255, 255, 255, 0.04), rgba(255, 255, 255, 0.01));
  border-bottom: 1px solid var(--border);
}
.term-dots { display: flex; gap: 7px; }
.term-dots span { width: 11px; height: 11px; border-radius: 50%; }
.term-dots span:nth-child(1) { background: #ff5f57; }
.term-dots span:nth-child(2) { background: #febc2e; }
.term-dots span:nth-child(3) { background: #28c840; }
.term-title {
  flex: 1; text-align: center;
  font-size: 0.72rem; color: var(--text-muted);
  letter-spacing: 0.04em;
}
.term-tab {
  font-size: 0.65rem; padding: 0.18rem 0.55rem;
  border-radius: 999px;
  background: var(--accent-soft);
  color: var(--accent);
  border: 1px solid var(--border-strong);
}

.term-body {
  padding: 1.75rem 1.85rem 1.85rem;
  font-size: 0.88rem;
  line-height: 1.75;
}
.term-line { display: flex; gap: 0.7rem; align-items: baseline; }
.term-cmd .term-prompt { color: var(--accent-strong); user-select: none; font-weight: 500; }
.term-cmd .term-content { color: var(--text); }
.term-out { padding-left: 1.4rem; color: var(--text-muted); }

.term-name .term-content {
  font-family: 'Geist', sans-serif;
  font-size: clamp(2rem, 5vw, 2.85rem);
  font-weight: 600;
  letter-spacing: -0.035em;
  line-height: 1.02;
  background: linear-gradient(180deg, #ffffff 0%, #b8c2e6 100%);
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
  padding: 0.35rem 0 0.55rem;
}
.term-role .term-content {
  font-family: 'Geist', sans-serif;
  font-size: 1.05rem;
  font-weight: 500;
  color: var(--text);
}
.hero-at { color: var(--accent); margin: 0 0.1rem; }
.hero-sep { color: var(--text-muted); margin: 0 0.55rem; }

.term-bio .term-content {
  font-family: 'Geist', sans-serif;
  font-size: 1rem;
  font-weight: 400;
  color: #d9dbef;
  line-height: 1.6;
  max-width: 60ch;
}
.term-bio em {
  color: var(--accent);
  font-style: normal;
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.92em;
}

.term-links .term-content { display: flex; flex-wrap: wrap; gap: 0.85rem; }
.term-links a {
  color: var(--accent);
  text-decoration: none;
  border-bottom: 1px dashed rgba(125, 211, 252, 0.4);
  padding-bottom: 1px;
  transition: color 0.2s ease, border-color 0.2s ease;
}
.term-links a:hover { color: var(--accent-violet); border-bottom-color: var(--accent-violet); }

.term-cursor {
  display: inline-block;
  width: 9px; height: 1em;
  background: var(--accent-strong);
  vertical-align: -2px;
  margin-left: 3px;
  animation: term-blink 1.05s steps(2) infinite;
}
@keyframes term-blink { 0%, 50% { opacity: 1; } 50.01%, 100% { opacity: 0; } }

/* ── Hero CTA row ──────────────────────────────────────────────────── */
.hero-cta-row {
  display: flex; flex-wrap: wrap; gap: 0.75rem;
  margin-top: 1.5rem;
}

@media (max-width: 640px) {
  .hero { padding: 3rem 0 2.5rem; }
  .term-body { padding: 1.25rem 1.25rem 1.5rem; font-size: 0.82rem; }
}
```

- [ ] **Step 5: Remove old hero styles from `src/index.css`**

Find the existing `/* ── Hero ─────────... ──── */` block (currently around lines 309–341) plus the immediately following styles tied to old hero classes (`.hero::before`, `.hero-name-char`, `.hero-rolepill`, `.hero-chip`, `.hero-pitch`, `.hero-links`). Delete that entire block — those classes are no longer used by the new Hero.

- [ ] **Step 6: Run dev server and verify hero renders**

```bash
npm run dev
```

Open http://localhost:5173. Expected: after the boot overlay fades, the hero appears with a green-pulse `Melbourne, Australia · v2026.1` eyebrow, a styled terminal window containing the `$ whoami`, name, `$ cat ~/role.txt`, role line, `$ cat ~/about.md`, bio, `$ ls ~/links/`, four dashed-underline links, and a blinking cursor on a final prompt line. The "Download resume" and "Get in touch" CTA row appears below. No console errors.

Stop the dev server.

- [ ] **Step 7: Commit**

```bash
git add src/App.jsx src/index.css
git commit -m "feat(hero): terminal-window hero with typing cascade and Aphex copy"
```

---

### Task P1.4: Restyle Nav, replace `BrandMark` with mono glyph

**Files:**
- Modify: `src/App.jsx` — replace `BrandMark`, restyle `Nav` markup (no structural change), update inline icon classes if needed
- Modify: `src/index.css` — replace nav block (currently lines 258–307) with new electric styles

- [ ] **Step 1: Replace `BrandMark` (lines 240–248) with a mono glyph**

```jsx
/* ── Brand mark ───────────────────────────────────────────────────── */
function BrandMark() {
  return <span className="brand-mark mono" aria-hidden="true">~$ minul</span>
}
```

- [ ] **Step 2: Update `src/index.css` — replace the nav block**

Find the section starting at `/* ── Sticky nav ─── */` (around line 258) and ending before `/* ── Hero ─── */` (just before line 309 — but `.hero` block has been deleted in P1.3 so re-locate it by the next existing section). Replace the entire nav block with:

```css
/* ── Sticky nav ────────────────────────────────────────────────────── */
.nav {
  position: sticky; top: 0; z-index: 100;
  background: color-mix(in oklab, var(--bg) 75%, transparent);
  border-bottom: 1px solid var(--border);
  backdrop-filter: saturate(180%) blur(12px);
  -webkit-backdrop-filter: saturate(180%) blur(12px);
}
.nav-inner {
  max-width: 960px; margin: 0 auto; padding: 0.7rem 1.5rem;
  display: flex; align-items: center; gap: 1rem; min-height: 56px;
}
.nav-brand {
  display: inline-flex; align-items: center;
  color: var(--text);
  transition: color 0.18s ease;
}
.nav-brand:hover { color: var(--accent); }
.brand-mark {
  font-size: 0.9rem;
  font-weight: 500;
  letter-spacing: 0.02em;
}
.nav-links { display: flex; gap: 0.125rem; margin-left: auto; }
.nav-link {
  font-family: 'JetBrains Mono', monospace;
  padding: 0.45rem 0.8rem; border-radius: 6px;
  font-size: 0.78rem; font-weight: 500;
  color: var(--text-muted);
  transition: color 0.18s ease, background-color 0.18s ease;
}
.nav-link:hover { color: var(--text); background: var(--surface-2); }
.nav-link[aria-current='page'] { color: var(--accent); background: var(--accent-soft); }
.nav-actions { display: flex; gap: 0.4rem; align-items: center; margin-left: auto; }
.nav-toggle {
  display: inline-flex; align-items: center; justify-content: center;
  width: 36px; height: 36px; border-radius: 8px;
  color: var(--text-muted);
  transition: color 0.18s ease, background-color 0.18s ease;
}
.nav-toggle:hover { color: var(--accent); background: var(--surface-2); }
.nav-disclosure-btn { display: none; }

@media (max-width: 760px) {
  .nav-links { display: none; }
  .nav-disclosure-btn { display: inline-flex; }
  .nav-disclosure-panel {
    border-top: 1px solid var(--border);
    background: var(--bg);
    padding: 0.5rem 1rem 1rem;
    display: flex; flex-direction: column; gap: 0.25rem;
  }
  .nav-disclosure-panel .nav-link { padding: 0.55rem 0.85rem; font-size: 0.875rem; }
}
```

- [ ] **Step 3: Restyle buttons — replace `.btn`, `.btn-primary`, `.btn-secondary`, `.btn-ghost` blocks**

The existing button styles (lines 118–180) reference `var(--accent-text)`, `color-mix`, and a warm-glow box-shadow that don't fit the new palette. Replace the entire button block with:

```css
/* ── Buttons ───────────────────────────────────────────────────────── */
.btn {
  display: inline-flex; align-items: center; gap: 0.5rem;
  padding: 0.65rem 1.15rem; min-height: 42px;
  border-radius: 8px;
  font-family: 'Geist', sans-serif;
  font-size: 0.875rem; font-weight: 500;
  letter-spacing: -0.005em;
  border: 1px solid transparent;
  transition: all 0.2s ease;
  cursor: pointer; text-decoration: none;
}
.btn:hover { transform: translateY(-1px); }
.btn:active { transform: translateY(0); transition-duration: 0.08s; }

.btn-primary {
  background: var(--accent-strong);
  color: var(--bg);
  border-color: var(--accent-strong);
  box-shadow: 0 0 0 1px var(--accent-strong), 0 8px 20px rgba(56, 189, 248, 0.25);
}
.btn-primary:hover {
  background: var(--accent);
  border-color: var(--accent);
  box-shadow: 0 0 0 1px var(--accent), 0 12px 28px rgba(56, 189, 248, 0.35);
}

.btn-secondary {
  background: transparent;
  color: var(--text);
  border-color: var(--border-strong);
}
.btn-secondary:hover {
  background: var(--surface-2);
  border-color: var(--accent);
  color: var(--accent);
}

.btn-ghost {
  background: var(--surface-2);
  color: var(--text);
  padding: 0.4rem 0.8rem; min-height: 34px;
  font-size: 0.8rem;
  border-color: var(--border);
}
.btn-ghost:hover {
  background: var(--surface);
  border-color: var(--accent);
  color: var(--accent);
}
```

- [ ] **Step 4: Run dev server and verify nav**

```bash
npm run dev
```

Expected: Sticky nav at top with `~$ minul` brand on the left, mono-styled section links in the middle, theme toggle + "Resume" ghost button on the right. Clicking a section link smooth-scrolls. Theme toggle still works (palette stays terminal-style but switches dark↔light). Mobile (< 760px) shows hamburger.

Stop the dev server.

- [ ] **Step 5: Commit**

```bash
git add src/App.jsx src/index.css
git commit -m "feat(nav): mono brand mark and electric-styled nav"
```

---

### Task P1.5: Restyle `SectionHeader` to `# 01 / section` treatment

**Files:**
- Modify: `src/App.jsx` — rewrite `SectionHeader` component (currently lines 268–275)
- Modify: `src/index.css` — replace `.section-header` and `.section-num` styles (around lines 226–245), add `.section-fill-line`

- [ ] **Step 1: Replace `SectionHeader` in `src/App.jsx`**

```jsx
/* ── Section header (hash-prefixed terminal title) ────────────────── */
function SectionHeader({ num, children }) {
  return (
    <header className="section-header">
      <span className="section-hash mono">#</span>
      <span className="section-num mono">{num} /</span>
      <h2 className="section-title">{children}</h2>
      <span className="section-fill-line" aria-hidden="true" />
    </header>
  )
}
```

- [ ] **Step 2: Replace section header CSS**

Find `.section-header`, `.section-num`, `.section-num::after`, `.section-divider` (around lines 226–245) and replace with:

```css
/* ── Section ───────────────────────────────────────────────────────── */
.section { padding: 6rem 0; position: relative; }
.section + .section { padding-top: 0; }

.section-header {
  display: flex; align-items: baseline; gap: 0.6rem;
  margin-bottom: 2rem;
}
.section-hash { color: var(--accent-strong); font-size: 1.1rem; font-weight: 600; }
.section-num {
  color: var(--text-muted);
  font-size: 0.78rem; letter-spacing: 0.15em; text-transform: uppercase;
}
.section-title {
  font-family: 'Geist', sans-serif;
  font-size: clamp(1.4rem, 3vw, 1.65rem);
  font-weight: 600;
  letter-spacing: -0.02em;
  color: var(--text);
}
.section-fill-line {
  flex: 1; height: 1px;
  background: linear-gradient(90deg, var(--border-strong), transparent);
}
```

Also remove the old `h1`/`h2`/`h3` typography rules that reference Fraunces (around lines 79–95):

```css
h1, h2, h3 { color: var(--text); }
h1 {
  font-family: 'Geist', sans-serif;
  font-size: clamp(2.25rem, 6vw, 3.5rem);
  line-height: 1.05;
  letter-spacing: -0.035em;
  font-weight: 600;
}
h2 {
  font-family: 'Geist', sans-serif;
  font-size: clamp(1.4rem, 3vw, 1.65rem);
  line-height: 1.15;
  letter-spacing: -0.02em;
  font-weight: 600;
}
h3 {
  font-family: 'Geist', sans-serif;
  font-size: 1.05rem; line-height: 1.4; font-weight: 600;
  letter-spacing: -0.015em;
}
```

Remove the `.display`, `.eyebrow`, `.muted`, `.meta`, `.serif-italic` utility selectors — they're either superseded by `.mono` or no longer used.

- [ ] **Step 3: Run dev server and verify section headers**

Run `npm run dev`. Scroll down. Expected: each section header now reads `# 01 / experience` style, with a fading line trailing off to the right. Numbers `01` through `05`.

Stop the dev server.

- [ ] **Step 4: Commit**

```bash
git add src/App.jsx src/index.css
git commit -m "feat(sections): hash-prefixed terminal section headers"
```

---

### Task P1.6: Restyle Experience cards (mono badges, terminal bullets)

**Files:**
- Modify: `src/App.jsx` — rewrite `Experience` (lines 441–464) and `ExpCard` markup
- Modify: `src/index.css` — replace `.exp-card`, `.exp-meta`, `.experience-list` styles + add `.exp-badge`, `.exp-bullet`, `.term-card`

- [ ] **Step 1: Replace `Experience` component**

```jsx
function Experience() {
  return (
    <section id="experience" className="container section">
      <FadeUp><SectionHeader num="01">experience</SectionHeader></FadeUp>
      <div className="experience-list">
        {data.experience.map((exp, i) => (
          <FadeUp key={`${exp.company}-${exp.period}`} delay={i * 0.05}>
            <article className="term-card exp-card">
              <div className="exp-meta">
                <span className="exp-badge">{exp.period}</span>
                <span className="exp-meta-item">{exp.location}</span>
              </div>
              <h3 className="exp-role">
                {exp.role} <span className="exp-at">@ {exp.company}</span>
              </h3>
              <ul className="exp-bullets">
                {exp.bullets.map((b, j) => <li key={j}>{b}</li>)}
              </ul>
            </article>
          </FadeUp>
        ))}
      </div>
    </section>
  )
}
```

- [ ] **Step 2: Replace the existing card styles**

Find the existing `/* ── Card ─── */` block (around lines 181–195) and `/* ── Experience ─── */` block (lines 342–346). Replace both with a single terminal-card system:

```css
/* ── Terminal card (shared) ────────────────────────────────────────── */
.term-card {
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: 12px;
  padding: 1.25rem 1.4rem;
  backdrop-filter: blur(6px);
  transition: border-color 0.2s ease, transform 0.2s ease, box-shadow 0.3s ease;
}
.term-card:hover {
  border-color: rgba(125, 211, 252, 0.3);
  transform: translateY(-2px);
  box-shadow: var(--shadow);
}

/* ── Experience ────────────────────────────────────────────────────── */
.experience-list { display: flex; flex-direction: column; gap: 1rem; }
.exp-meta {
  display: flex; flex-wrap: wrap; gap: 0.5rem; align-items: center;
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.72rem;
  color: var(--text-muted);
  margin-bottom: 0.55rem;
}
.exp-badge {
  padding: 0.12rem 0.5rem;
  border: 1px solid var(--border-strong);
  border-radius: 4px;
  color: var(--accent);
  background: var(--accent-soft);
}
.exp-meta-item { letter-spacing: 0.02em; }
.exp-role {
  font-family: 'Geist', sans-serif;
  font-size: 1.1rem;
  font-weight: 600;
  color: var(--text);
  margin: 0 0 0.65rem;
  letter-spacing: -0.015em;
  line-height: 1.3;
}
.exp-at { color: var(--text-muted); font-weight: 400; }
.exp-bullets { list-style: none; padding: 0; margin: 0; }
.exp-bullets li {
  position: relative;
  padding-left: 1.1rem;
  margin-bottom: 0.45rem;
  color: #cbcde2;
  font-size: 0.95rem;
  line-height: 1.55;
}
.exp-bullets li::before {
  content: '›';
  position: absolute; left: 0;
  color: var(--accent);
  font-family: 'JetBrains Mono', monospace;
  font-weight: 600;
}
.exp-bullets li:last-child { margin-bottom: 0; }

/* Remove the old .bullets list styles too — find lines 247–256 of the original css */
```

Also remove the now-unused `/* ── Bullet list ─── */` block (the old `.bullets` rules around lines 247–256).

- [ ] **Step 3: Run dev server and verify Experience**

Run `npm run dev`. Scroll to Experience. Expected: each role appears as a card with a sky-accent date badge, the location next to it, role title with muted `@ Company`, and `›` accent-coloured bullets. Hover lifts the card slightly. Cards visually distinct in dark mode.

Stop the dev server.

- [ ] **Step 4: Commit**

```bash
git add src/App.jsx src/index.css
git commit -m "feat(experience): terminal-styled cards with mono badges and › bullets"
```

---

### Task P1.7: Restyle Skills section (`const` declaration header, mono chips)

**Files:**
- Modify: `src/App.jsx` — rewrite `Skills` component (lines 466–484)
- Modify: `src/index.css` — replace `/* ── Skills grid ─── */` and `/* ── Tag / chip ─── */` blocks

- [ ] **Step 1: Replace `Skills` component**

```jsx
function Skills() {
  return (
    <section id="skills" className="container section">
      <FadeUp><SectionHeader num="02">skills</SectionHeader></FadeUp>
      <div className="pillars-grid">
        {data.pillars.map((pillar, i) => (
          <FadeUp key={pillar.title} delay={i * 0.05}>
            <article className="term-card pillar-card">
              <div className="pillar-decl mono">
                <span className="pillar-keyword">const</span>{' '}
                <span className="pillar-name">{toIdent(pillar.title)}</span>{' '}
                <span className="pillar-eq">=</span>
              </div>
              <div className="pillar-tags">
                {pillar.items.map((item) => (
                  <span key={item} className="pillar-chip">{item}</span>
                ))}
              </div>
            </article>
          </FadeUp>
        ))}
      </div>
    </section>
  )
}

function toIdent(s) {
  return s
    .toLowerCase()
    .replace(/&/g, 'and')
    .replace(/[^a-z0-9]+/g, '_')
    .replace(/^_+|_+$/g, '')
}
```

- [ ] **Step 2: Replace `.pillars-grid`, `.pillar-card`, `.pillar-tags`, `.tag`, `.chip` styles**

Replace the existing `/* ── Skills grid ─── */` block (lines 348–370) and the `/* ── Tag / chip ─── */` block (lines 197–222) with:

```css
/* ── Skills ────────────────────────────────────────────────────────── */
.pillars-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  grid-auto-rows: 1fr;
  gap: 1rem;
  align-items: stretch;
}
.pillars-grid > * { display: flex; }
.pillar-card {
  display: flex; flex-direction: column;
  width: 100%; height: 100%;
}
.pillar-decl {
  font-size: 0.78rem;
  margin-bottom: 0.85rem;
  color: var(--text-muted);
}
.pillar-keyword { color: var(--accent-violet); }
.pillar-name { color: var(--text); }
.pillar-eq { color: var(--text-muted); }
.pillar-tags {
  display: flex; flex-wrap: wrap; gap: 0.4rem;
  flex: 1 1 auto; align-content: flex-start;
}
.pillar-chip {
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.72rem;
  padding: 0.35rem 0.6rem;
  background: var(--accent-soft);
  border: 1px solid rgba(125, 211, 252, 0.18);
  border-radius: 6px;
  color: #cfd2ec;
  transition: all 0.2s ease;
}
.pillar-chip:hover {
  background: rgba(125, 211, 252, 0.16);
  border-color: rgba(125, 211, 252, 0.4);
  color: var(--text);
}
@media (max-width: 640px) {
  .pillars-grid { grid-template-columns: 1fr; grid-auto-rows: auto; }
}
```

- [ ] **Step 3: Run dev server and verify Skills**

Run `npm run dev`. Scroll to Skills. Expected: 4 cards in a 2×2 grid (single column < 640px), each headed by a mono `const data_and_engineering =` declaration with `const` in violet, name in white, `=` muted. Below: mono chips of each item with sky tint, hover-brightens.

Stop the dev server.

- [ ] **Step 4: Commit**

```bash
git add src/App.jsx src/index.css
git commit -m "feat(skills): const-declaration header with mono chip grid"
```

---

### Task P1.8: Restyle Projects, Education, Leadership

**Files:**
- Modify: `src/App.jsx` — rewrite `Projects`, `Education`, `Leadership` (lines 486–549)
- Modify: `src/index.css` — replace project / education / leadership blocks

- [ ] **Step 1: Replace `Projects` component**

```jsx
function Projects() {
  return (
    <section id="projects" className="container section">
      <FadeUp><SectionHeader num="03">projects</SectionHeader></FadeUp>
      <div className="project-list">
        {data.projects.map((p, i) => (
          <FadeUp key={p.name} delay={i * 0.05}>
            <article className="term-card project-card">
              <div className="exp-meta">
                <span className="exp-badge">{p.role}</span>
              </div>
              <h3 className="project-title">
                {p.name} <span className="project-subtitle">— {p.subtitle}</span>
              </h3>
              <p className="project-desc">{p.description}</p>
              <p className="project-tech mono">{p.tech.split('·').map((t, j, arr) => (
                <span key={j}>
                  {t.trim()}
                  {j < arr.length - 1 && <span className="project-tech-dot"> · </span>}
                </span>
              ))}</p>
              {p.link && (
                <a href={p.link} target="_blank" rel="noopener noreferrer" className="project-link mono">
                  {p.linkLabel || 'view project'} <span aria-hidden="true">→</span>
                </a>
              )}
            </article>
          </FadeUp>
        ))}
      </div>
    </section>
  )
}
```

- [ ] **Step 2: Replace `Education` component**

```jsx
function Education() {
  return (
    <section id="education" className="container section">
      <FadeUp><SectionHeader num="04">education</SectionHeader></FadeUp>
      <FadeUp delay={0.05}>
        <article className="term-card edu-card">
          <div className="exp-meta">
            <span className="exp-badge">{data.education.period}</span>
            <span className="exp-meta-item">{data.education.institution}</span>
          </div>
          <h3 className="exp-role">{data.education.degree}</h3>
          <p className="edu-majors">Majors: <span className="edu-majors-value">{data.education.majors}</span></p>
          <p className="edu-coursework">{data.education.coursework}</p>
          <ul className="exp-bullets">
            {data.education.highlights.map((h, i) => <li key={i}>{h}</li>)}
          </ul>
        </article>
      </FadeUp>
    </section>
  )
}
```

- [ ] **Step 3: Replace `Leadership` component**

```jsx
function Leadership() {
  return (
    <section id="leadership" className="container section">
      <FadeUp><SectionHeader num="05">leadership &amp; impact</SectionHeader></FadeUp>
      <div className="leadership-list">
        {data.leadership.map((item, i) => (
          <FadeUp key={`${item.org}-${item.title}`} delay={i * 0.04}>
            <article className="term-card leadership-card">
              <div className="exp-meta">
                <span className="exp-badge">{item.period}</span>
                <span className="exp-meta-item">{item.org}</span>
              </div>
              <h3 className="exp-role">{item.title}</h3>
              <p className="leadership-desc">{item.description}</p>
            </article>
          </FadeUp>
        ))}
      </div>
    </section>
  )
}
```

- [ ] **Step 4: Replace Projects / Education / Leadership CSS blocks**

Find the existing `/* ── Projects ─── */`, `/* ── Education ─── */`, `/* ── Leadership ─── */` blocks (currently lines 372–403) and replace them with:

```css
/* ── Projects ──────────────────────────────────────────────────────── */
.project-list { display: flex; flex-direction: column; gap: 1rem; }
.project-card { display: flex; flex-direction: column; gap: 0.55rem; }
.project-title {
  font-family: 'Geist', sans-serif;
  font-size: 1.15rem;
  font-weight: 600;
  letter-spacing: -0.02em;
  color: var(--text);
  margin: 0;
  line-height: 1.3;
}
.project-subtitle { color: var(--text-muted); font-weight: 400; }
.project-desc {
  color: #cbcde2;
  font-size: 0.95rem;
  line-height: 1.55;
  margin: 0;
}
.project-tech {
  font-size: 0.72rem;
  color: var(--text-muted);
  margin: 0;
}
.project-tech-dot { color: var(--accent); margin: 0 0.1rem; }
.project-link {
  display: inline-flex; align-items: center; gap: 0.4rem;
  color: var(--accent);
  font-size: 0.78rem;
  margin-top: 0.25rem;
  text-decoration: none;
  border-bottom: 1px dashed rgba(125, 211, 252, 0.4);
  padding-bottom: 1px;
  align-self: flex-start;
  transition: color 0.2s ease, border-color 0.2s ease;
}
.project-link:hover { color: var(--accent-violet); border-bottom-color: var(--accent-violet); }

/* ── Education ─────────────────────────────────────────────────────── */
.edu-card { display: flex; flex-direction: column; gap: 0.5rem; }
.edu-majors {
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.78rem;
  color: var(--text-muted);
  margin: 0;
}
.edu-majors-value { color: var(--accent); }
.edu-coursework {
  color: #cbcde2;
  font-size: 0.92rem;
  line-height: 1.5;
  margin: 0.25rem 0 0.5rem;
}

/* ── Leadership ────────────────────────────────────────────────────── */
.leadership-list { display: flex; flex-direction: column; gap: 0.75rem; }
.leadership-card { display: flex; flex-direction: column; gap: 0.4rem; }
.leadership-desc {
  color: #cbcde2;
  font-size: 0.92rem;
  line-height: 1.55;
  margin: 0;
}
```

- [ ] **Step 5: Run dev server and verify all three sections**

Run `npm run dev`. Scroll through Projects, Education, Leadership. Expected: all three rendered as `term-card` instances with mono badges, terminal-style typography, and `›` accent bullets (Education only). Projects show a dashed-underline `view on GitHub →` link with mono font. Education shows mono majors + sky-accent value.

Stop the dev server.

- [ ] **Step 6: Commit**

```bash
git add src/App.jsx src/index.css
git commit -m "feat(sections): terminal-styled projects, education, leadership"
```

---

### Task P1.9: Restyle Footer with terminal language

**Files:**
- Modify: `src/App.jsx` — rewrite `Footer` (lines 551–565)
- Modify: `src/index.css` — replace `/* ── Footer ─── */` block (lines 405–419)

- [ ] **Step 1: Replace `Footer` component**

```jsx
function Footer() {
  return (
    <footer id="contact" className="container footer">
      <div className="footer-block">
        <p className="footer-prompt mono"><span className="footer-p">$</span> echo "let's talk."</p>
        <p className="footer-tagline">Let's talk.</p>
      </div>
      <nav className="footer-links mono" aria-label="Contact">
        <a href={`mailto:${data.contact.email}`}>email</a>
        <a href={`tel:${data.contact.mobile}`}>mobile</a>
        <a href={data.contact.linkedin} target="_blank" rel="noopener noreferrer">linkedin</a>
        <a href={data.contact.github} target="_blank" rel="noopener noreferrer">github</a>
        <a href={data.contact.website} target="_blank" rel="noopener noreferrer">minul.vercel.app</a>
      </nav>
      <p className="footer-mark mono">© {new Date().getFullYear()} {data.name}</p>
    </footer>
  )
}
```

- [ ] **Step 2: Replace footer CSS**

```css
/* ── Footer ────────────────────────────────────────────────────────── */
.footer {
  padding: 5rem 0 4rem;
  border-top: 1px solid var(--border);
  margin-top: 4rem;
  text-align: center;
}
.footer-block { display: flex; flex-direction: column; align-items: center; gap: 0.6rem; margin-bottom: 1.5rem; }
.footer-prompt {
  font-size: 0.78rem;
  color: var(--text-muted);
}
.footer-prompt .footer-p { color: var(--accent-strong); }
.footer-tagline {
  font-family: 'Geist', sans-serif;
  font-size: clamp(1.5rem, 3vw, 1.9rem);
  font-weight: 600;
  letter-spacing: -0.025em;
  color: var(--text);
  margin: 0;
}
.footer-links {
  display: flex; flex-wrap: wrap; gap: 1.2rem;
  justify-content: center;
  font-size: 0.78rem;
  margin-bottom: 1.5rem;
}
.footer-links a {
  color: var(--text-muted);
  border-bottom: 1px dashed rgba(255, 255, 255, 0.15);
  padding-bottom: 1px;
  transition: color 0.2s, border-color 0.2s;
}
.footer-links a:hover { color: var(--accent); border-bottom-color: var(--accent); }
.footer-mark {
  font-size: 0.7rem;
  color: var(--text-dim);
  letter-spacing: 0.08em;
}
@media (max-width: 640px) {
  .footer { padding: 3.5rem 0 3rem; margin-top: 2.5rem; }
}
```

- [ ] **Step 3: Remove now-dead utilities**

Search `src/index.css` for any remaining references to `a.linked`, `.serif-italic`, `.section-divider`, `.bullets`, `.hero-name-char`, `.hero-rolepill`, `.hero-chip`, `.hero-pitch` (any classes from the old design that no longer have a render site). Delete those rule blocks. Also remove any `oklab` / warm-cream color-mix expressions left over.

Suggested grep before committing:

```bash
grep -n 'oklab\|Fraunces\|Inter\|--accent-soft' src/index.css
```

Inspect each result; `--accent-soft` is still valid (used by the new system), but any reference to `Fraunces`, `Inter`, or `--accent-text` is dead.

- [ ] **Step 4: Run dev server, scroll through full page, check console**

```bash
npm run dev
```

Walk the page top-to-bottom: boot animation → hero → experience → skills → projects → education → leadership → footer. Test theme toggle (dark↔light). Test mobile viewport (DevTools, < 760px). Expected: no console errors, no warnings about missing class hooks, all sections render coherently.

Stop the dev server.

- [ ] **Step 5: Commit**

```bash
git add src/App.jsx src/index.css
git commit -m "feat(footer): terminal-styled footer with mono links"
```

---

### Task P1.10: Phase 1 build verification + final tweaks

**Files:** none (commands only)

- [ ] **Step 1: Run production build**

```bash
npm run build
```

Expected: clean build, no errors, no unhandled warnings. If there are import errors (e.g., `NameReveal` deleted but still referenced), grep `src/` for the missing identifier and remove the reference.

- [ ] **Step 2: Preview the production build**

```bash
npm run preview
```

Open the preview URL printed (usually http://localhost:4173). Walk the page. Same checks as P1.9 step 4 but on the production bundle.

Stop the preview server.

- [ ] **Step 3: Update `CLAUDE.md` tech section to reflect the redesign**

Replace the `## Tech` block of `CLAUDE.md` with:

```markdown
## Tech
- Vite 6 + React 18
- framer-motion for UI animation
- Custom CSS tokens (electric / terminal palette, Geist + JetBrains Mono)
- No 3D scene (legacy reference removed)
```

Also update `## Repo layout (expected)`:

```markdown
## Repo layout (expected)
- index.html (loads /src/main.jsx)
- src/main.jsx (React root)
- src/App.jsx (main app — Nav, Hero, sections, Footer)
- src/components/BootSequence.jsx (boot-overlay loading animation)
- src/index.css (global styles + tokens)
```

- [ ] **Step 4: Commit and push**

```bash
git add CLAUDE.md
git commit -m "docs: refresh CLAUDE.md tech list for terminal redesign"
git push
```

**Phase 1 checkpoint:** the site is fully redesigned. Phase 2 can ship later if needed.

---

## Phase 2 — Blog System

### Task P2.1: Install `react-router-dom` and wrap `<App />`

**Files:**
- Modify: `package.json` (auto via npm install)
- Modify: `src/main.jsx`
- Modify: `vite.config.js` — add vendor-router chunk

- [ ] **Step 1: Install `react-router-dom`**

```bash
npm install react-router-dom@^6
```

Expected: `react-router-dom` and `@remix-run/router` (transitive) added to `package.json`. No peer warnings.

- [ ] **Step 2: Wrap `<App />` in router in `src/main.jsx`**

Replace the entire `src/main.jsx` with:

```jsx
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import App from './App.jsx'
import './index.css'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>,
)
```

Other routes will be added as components land in later tasks.

- [ ] **Step 3: Update `vite.config.js` to chunk the router**

Replace the contents of `vite.config.js`:

```js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  build: {
    target: 'esnext',
    rollupOptions: {
      output: {
        manualChunks: {
          'vendor-react': ['react', 'react-dom'],
          'vendor-motion': ['framer-motion'],
          'vendor-router': ['react-router-dom'],
        },
      },
    },
  },
})
```

- [ ] **Step 4: Run dev server and verify routing**

```bash
npm run dev
```

Visit `/`. Expected: page loads normally, no console errors. Visit `/random-thing`. Expected: 404 from Vite dev server (we haven't added a NotFound route yet — that's Task P2.7). Stop dev server.

- [ ] **Step 5: Commit**

```bash
git add package.json package-lock.json src/main.jsx vite.config.js
git commit -m "feat(router): add react-router-dom and wrap App in BrowserRouter"
```

---

### Task P2.2: Build `src/lib/posts.js` — frontmatter, sort, reading-time

**Files:**
- Create: `src/lib/posts.js`
- Modify: `package.json` (via npm install)

- [ ] **Step 1: Install `gray-matter`**

```bash
npm install gray-matter@^4
```

- [ ] **Step 2: Create `src/lib/posts.js`**

```js
import matter from 'gray-matter'

const modules = import.meta.glob('/src/content/posts/*.md', {
  query: '?raw',
  import: 'default',
  eager: true,
})

const WORDS_PER_MINUTE = 220
const FILENAME_RX = /\/(\d{4}-\d{2}-\d{2})-(.+)\.md$/

function parseEntry(path, raw) {
  const m = path.match(FILENAME_RX)
  if (!m) throw new Error(`Post filename must match YYYY-MM-DD-slug.md: ${path}`)
  const [, fileDate, slug] = m

  const { data, content } = matter(raw)
  const date = data.date ? String(data.date).slice(0, 10) : fileDate
  const words = content.trim().split(/\s+/).filter(Boolean).length
  const readingMinutes = Math.max(1, Math.ceil(words / WORDS_PER_MINUTE))

  return {
    slug,
    title: data.title ?? slug,
    date,
    displayDate: date.replace(/-/g, '.'),
    excerpt: data.excerpt ?? '',
    tags: Array.isArray(data.tags) ? data.tags : [],
    draft: Boolean(data.draft),
    readingMinutes,
    content,
  }
}

const ALL = Object.entries(modules)
  .map(([path, raw]) => parseEntry(path, raw))
  .sort((a, b) => (a.date < b.date ? 1 : -1))

const IS_PROD = import.meta.env?.PROD ?? false

export const allPosts = IS_PROD ? ALL.filter((p) => !p.draft) : ALL

export function getPost(slug) {
  return allPosts.find((p) => p.slug === slug)
}

export function latestPosts(n = 3) {
  return allPosts.slice(0, n)
}
```

- [ ] **Step 3: Verify the loader doesn't crash with zero posts**

```bash
npm run dev
```

In the browser console, run:

```js
import('/src/lib/posts.js').then(m => console.log(m.allPosts))
```

Expected: empty array `[]`, no errors. (`src/content/posts/` doesn't exist yet; the glob simply returns nothing.) Stop dev server.

- [ ] **Step 4: Commit**

```bash
git add package.json package-lock.json src/lib/posts.js
git commit -m "feat(posts): build markdown post loader with frontmatter + reading time"
```

---

### Task P2.3: Seed the welcome post

**Files:**
- Create: `src/content/posts/2026-06-04-hello.md`

- [ ] **Step 1: Create the seed post file**

```markdown
---
title: Hello, world
date: 2026-06-04
excerpt: First note on this terminal-styled portfolio — what I'm writing about, and why.
tags: [meta]
draft: false
---

This is the first post on a new home for short writing — mostly things I learn at the intersection of customer success, construction technology, and the unglamorous process improvements that keep delivery teams moving.

Posts will be short by default. I'll write when I have something specific to say, not when the calendar tells me to.

If you want to stay in the loop, the [RSS feed](/feed.xml) is wired up.
```

- [ ] **Step 2: Verify the loader picks it up**

```bash
npm run dev
```

In the browser console:

```js
import('/src/lib/posts.js').then(m => console.log(m.allPosts))
```

Expected: array of 1 post with the correct slug, title, date, readingMinutes ≥ 1. Stop dev server.

- [ ] **Step 3: Commit**

```bash
git add src/content/posts/2026-06-04-hello.md
git commit -m "feat(posts): seed welcome post"
```

---

### Task P2.4: Build the homepage `#writing` section

**Files:**
- Modify: `src/App.jsx` — add `Writing` component, add to `App` render, add to `NAV_LINKS`
- Modify: `src/index.css` — add `.post-list`, `.post-row` styles

- [ ] **Step 1: Add `Writing` component to `src/App.jsx`**

Near the top of `App.jsx`, add the import:

```jsx
import { Link } from 'react-router-dom'
import { latestPosts, allPosts } from './lib/posts.js'
```

Before the `Footer` definition, add:

```jsx
/* ── Writing (homepage section) ───────────────────────────────────── */
function Writing() {
  const posts = latestPosts(3)
  const hasMore = allPosts.length > 3

  return (
    <section id="writing" className="container section">
      <FadeUp><SectionHeader num="06">writing</SectionHeader></FadeUp>
      {posts.length === 0 ? (
        <FadeUp delay={0.05}>
          <p className="post-empty mono">
            <span className="post-empty-prompt">$</span> ls ~/writing/ <span className="post-empty-arrow">→</span> (empty) — first post coming soon
          </p>
        </FadeUp>
      ) : (
        <>
          <div className="post-list">
            {posts.map((p, i) => (
              <FadeUp key={p.slug} delay={i * 0.05}>
                <Link to={`/writing/${p.slug}`} className="post-row">
                  <span className="post-date mono">{p.displayDate}</span>
                  <span className="post-title">{p.title}<span className="post-arrow" aria-hidden="true"> →</span></span>
                  <span className="post-meta mono">~{p.readingMinutes} min</span>
                </Link>
              </FadeUp>
            ))}
          </div>
          {hasMore && (
            <FadeUp delay={0.2}>
              <Link to="/writing" className="post-index-link mono">
                <span className="post-index-prompt">$</span> ls ~/writing/ <span className="post-index-arrow">→</span> see all posts
              </Link>
            </FadeUp>
          )}
        </>
      )}
    </section>
  )
}
```

- [ ] **Step 2: Add `Writing` to the nav links and render order**

Update `NAV_LINKS`:

```jsx
const NAV_LINKS = [
  { label: 'Experience', href: '#experience' },
  { label: 'Skills', href: '#skills' },
  { label: 'Projects', href: '#projects' },
  { label: 'Education', href: '#education' },
  { label: 'Leadership', href: '#leadership' },
  { label: 'Writing', href: '#writing' },
]
```

In the `App` component, add `<Writing />` after `<Leadership />`:

```jsx
<main>
  <Hero />
  <Experience />
  <Skills />
  <Projects />
  <Education />
  <Leadership />
  <Writing />
</main>
```

- [ ] **Step 3: Append post-list styles to `src/index.css`**

```css
/* ── Writing (homepage list) ───────────────────────────────────────── */
.post-list { display: flex; flex-direction: column; gap: 0.6rem; }
.post-row {
  display: grid;
  grid-template-columns: 110px 1fr auto;
  gap: 1rem;
  align-items: center;
  padding: 0.95rem 1.15rem;
  border: 1px solid var(--border);
  background: var(--surface-2);
  border-radius: 10px;
  text-decoration: none;
  color: var(--text);
  transition: border-color 0.2s ease, transform 0.2s ease, background-color 0.2s ease;
}
.post-row:hover {
  border-color: rgba(125, 211, 252, 0.3);
  background: var(--surface);
  transform: translateY(-1px);
}
.post-date { font-size: 0.72rem; color: var(--text-muted); }
.post-title { font-family: 'Geist', sans-serif; font-size: 0.98rem; font-weight: 500; }
.post-arrow { color: var(--accent); margin-left: 0.4rem; opacity: 0.7; transition: opacity 0.2s ease; }
.post-row:hover .post-arrow { opacity: 1; }
.post-meta { font-size: 0.68rem; color: var(--text-muted); }

.post-empty {
  font-size: 0.85rem;
  color: var(--text-muted);
  padding: 1rem 1.15rem;
  border: 1px dashed var(--border-strong);
  border-radius: 10px;
}
.post-empty-prompt, .post-index-prompt { color: var(--accent-strong); margin-right: 0.4rem; }
.post-empty-arrow, .post-index-arrow { color: var(--accent); margin: 0 0.4rem; }

.post-index-link {
  display: inline-block;
  margin-top: 1rem;
  font-size: 0.78rem;
  color: var(--text-muted);
  text-decoration: none;
  transition: color 0.2s ease;
}
.post-index-link:hover { color: var(--accent); }

@media (max-width: 640px) {
  .post-row { grid-template-columns: 90px 1fr; }
  .post-row .post-meta { grid-column: 2; padding-top: 0.2rem; font-size: 0.66rem; }
}
```

- [ ] **Step 4: Run dev server, verify Writing section + nav link**

Run `npm run dev`. Expected: a new `# 06 / writing` section appears between Leadership and the Footer. With one seed post, you should see one row with `2026.06.04`, the title, and `~1 min`. The `Writing` link in the nav scrolls to it. No index-link (only 1 post). Click the post row → currently goes to `/writing/hello` → blank screen (no route registered yet — that's Task P2.6). Stop dev server.

- [ ] **Step 5: Commit**

```bash
git add src/App.jsx src/index.css
git commit -m "feat(writing): add #06 writing section with latest posts"
```

---

### Task P2.5: Build `WritingIndex` page + route

**Files:**
- Create: `src/components/WritingIndex.jsx`
- Modify: `src/main.jsx` — register `/writing` route
- Modify: `src/index.css` — minor reuse, add `.page-shell` wrapper

- [ ] **Step 1: Create `src/components/WritingIndex.jsx`**

```jsx
import { Link } from 'react-router-dom'
import { allPosts } from '../lib/posts.js'

export default function WritingIndex() {
  return (
    <main className="page-shell container">
      <p className="page-breadcrumb mono">
        <Link to="/">~</Link> / <span className="page-bc-current">writing</span>
      </p>
      <header className="section-header" style={{ marginTop: '0.5rem' }}>
        <span className="section-hash mono">#</span>
        <span className="section-num mono">all /</span>
        <h1 className="section-title">writing</h1>
        <span className="section-fill-line" aria-hidden="true" />
      </header>
      {allPosts.length === 0 ? (
        <p className="post-empty mono">
          <span className="post-empty-prompt">$</span> ls ~/writing/ <span className="post-empty-arrow">→</span> (empty)
        </p>
      ) : (
        <div className="post-list">
          {allPosts.map((p) => (
            <Link key={p.slug} to={`/writing/${p.slug}`} className="post-row">
              <span className="post-date mono">{p.displayDate}</span>
              <span className="post-title">{p.title}<span className="post-arrow" aria-hidden="true"> →</span></span>
              <span className="post-meta mono">~{p.readingMinutes} min</span>
            </Link>
          ))}
        </div>
      )}
      <p className="page-back mono" style={{ marginTop: '2rem' }}>
        <Link to="/"><span className="footer-p">$</span> cd .. <span aria-hidden="true">→</span> home</Link>
      </p>
    </main>
  )
}
```

- [ ] **Step 2: Append page-shell + breadcrumb styles to `src/index.css`**

```css
/* ── Page shell (writing index, post page) ─────────────────────────── */
.page-shell { padding: 4rem 0 5rem; }
.page-breadcrumb { font-size: 0.78rem; color: var(--text-muted); }
.page-breadcrumb a { color: var(--accent); text-decoration: none; transition: color 0.2s ease; }
.page-breadcrumb a:hover { color: var(--accent-violet); }
.page-bc-current { color: var(--text); }
.page-back { font-size: 0.78rem; }
.page-back a { color: var(--text-muted); text-decoration: none; transition: color 0.2s ease; }
.page-back a:hover { color: var(--accent); }
.page-back a .footer-p { color: var(--accent-strong); margin-right: 0.4rem; }
```

- [ ] **Step 3: Register the route in `src/main.jsx`**

Update routes:

```jsx
import WritingIndex from './components/WritingIndex.jsx'

// inside <Routes>:
<Route path="/" element={<App />} />
<Route path="/writing" element={<WritingIndex />} />
```

- [ ] **Step 4: Run dev server, visit `/writing`**

Run `npm run dev`. Visit http://localhost:5173/writing. Expected: breadcrumb `~/writing`, section header, post row for the seed post, `$ cd .. → home` link at the bottom. Clicking `~` or `cd ..` returns to `/`. No console errors. Stop dev server.

- [ ] **Step 5: Commit**

```bash
git add src/components/WritingIndex.jsx src/main.jsx src/index.css
git commit -m "feat(writing): full /writing index route"
```

---

### Task P2.6: Build `PostPage` with markdown rendering

**Files:**
- Modify: `package.json` (npm install)
- Modify: `vite.config.js` — add vendor-markdown chunk
- Create: `src/components/PostPage.jsx`
- Modify: `src/main.jsx` — register `/writing/:slug` route
- Modify: `src/index.css` — append `.post-body` markdown styles + highlight.js theme

- [ ] **Step 1: Install markdown deps**

```bash
npm install react-markdown@^9 remark-gfm@^4 rehype-highlight@^7 highlight.js@^11
```

- [ ] **Step 2: Update `vite.config.js`**

Add `vendor-markdown` to manualChunks:

```js
manualChunks: {
  'vendor-react': ['react', 'react-dom'],
  'vendor-motion': ['framer-motion'],
  'vendor-router': ['react-router-dom'],
  'vendor-markdown': ['react-markdown', 'remark-gfm', 'rehype-highlight', 'highlight.js'],
},
```

- [ ] **Step 3: Create `src/components/PostPage.jsx`**

```jsx
import { useEffect } from 'react'
import { Link, useParams, Navigate } from 'react-router-dom'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import rehypeHighlight from 'rehype-highlight'
import { getPost } from '../lib/posts.js'
import 'highlight.js/styles/github-dark-dimmed.css'

export default function PostPage() {
  const { slug } = useParams()
  const post = getPost(slug)

  useEffect(() => {
    if (post) document.title = `${post.title} — Minul Lokuliyana`
    return () => { document.title = 'Minul Lokuliyana — Customer Success @ Aphex' }
  }, [post])

  if (!post) return <Navigate to="/404" replace />

  return (
    <main className="page-shell container">
      <p className="page-breadcrumb mono">
        <Link to="/">~</Link> / <Link to="/writing">writing</Link> / <span className="page-bc-current">{post.slug}</span>
      </p>
      <article className="post-article">
        <h1 className="post-h1">{post.title}</h1>
        <p className="post-meta-row mono">
          <span>{post.displayDate}</span>
          <span className="post-meta-sep">·</span>
          <span>~{post.readingMinutes} min</span>
          {post.tags.length > 0 && (
            <>
              <span className="post-meta-sep">·</span>
              <span className="post-tags">{post.tags.map((t) => `#${t}`).join(' ')}</span>
            </>
          )}
        </p>
        <div className="post-body">
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            rehypePlugins={[rehypeHighlight]}
          >
            {post.content}
          </ReactMarkdown>
        </div>
      </article>
      <p className="page-back mono">
        <Link to="/writing"><span className="footer-p">$</span> cd .. <span aria-hidden="true">→</span> writing</Link>
      </p>
    </main>
  )
}
```

- [ ] **Step 4: Append post-body styles to `src/index.css`**

```css
/* ── Post page ─────────────────────────────────────────────────────── */
.post-article { max-width: 680px; margin: 1rem 0 2.5rem; }
.post-h1 {
  font-family: 'Geist', sans-serif;
  font-size: clamp(1.5rem, 3.5vw, 1.95rem);
  font-weight: 600;
  letter-spacing: -0.025em;
  line-height: 1.15;
  color: var(--text);
  margin: 0 0 0.6rem;
}
.post-meta-row {
  font-size: 0.72rem;
  color: var(--text-muted);
  margin: 0 0 1.5rem;
  display: flex; flex-wrap: wrap; gap: 0.5rem; align-items: center;
}
.post-meta-sep { opacity: 0.5; }
.post-tags { color: var(--accent); }

.post-body { color: #d9dbef; font-size: 1rem; line-height: 1.7; }
.post-body p { margin: 0 0 1rem; }
.post-body h2 {
  font-family: 'Geist', sans-serif;
  font-size: 1.3rem; font-weight: 600;
  letter-spacing: -0.02em; color: var(--text);
  margin: 2rem 0 0.7rem;
}
.post-body h3 {
  font-family: 'Geist', sans-serif;
  font-size: 1.05rem; font-weight: 600;
  letter-spacing: -0.015em; color: var(--text);
  margin: 1.5rem 0 0.6rem;
}
.post-body a {
  color: var(--accent);
  text-decoration: none;
  border-bottom: 1px dashed rgba(125, 211, 252, 0.4);
  transition: color 0.2s ease, border-color 0.2s ease;
}
.post-body a:hover { color: var(--accent-violet); border-bottom-color: var(--accent-violet); }
.post-body ul, .post-body ol { margin: 0 0 1rem; padding-left: 1.3rem; }
.post-body ul { list-style: none; }
.post-body ul li { position: relative; padding-left: 0.6rem; margin-bottom: 0.4rem; }
.post-body ul li::before { content: '›'; position: absolute; left: -0.6rem; color: var(--accent); font-family: 'JetBrains Mono', monospace; }
.post-body ol { list-style: decimal; color: var(--text-muted); }
.post-body ol li { color: var(--text-muted); margin-bottom: 0.4rem; }
.post-body ol li::marker { color: var(--accent); }
.post-body ol li > * { color: #d9dbef; }
.post-body blockquote {
  border-left: 2px solid var(--accent);
  padding: 0.2rem 0 0.2rem 1rem;
  margin: 0 0 1rem;
  color: var(--text-muted);
  font-style: italic;
}
.post-body code {
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.88em;
  background: var(--accent-soft);
  border: 1px solid rgba(125, 211, 252, 0.18);
  padding: 0.08rem 0.35rem;
  border-radius: 4px;
  color: var(--accent);
}
.post-body pre {
  background: rgba(13, 13, 16, 0.7);
  border: 1px solid var(--border);
  border-radius: 8px;
  padding: 1rem 1.15rem;
  overflow-x: auto;
  margin: 0 0 1rem;
}
.post-body pre code {
  background: transparent;
  border: 0; padding: 0;
  color: inherit;
  font-size: 0.86em;
  line-height: 1.6;
}
.post-body hr {
  border: 0;
  height: 1px;
  background: linear-gradient(90deg, transparent, var(--border-strong), transparent);
  margin: 2rem 0;
}
.post-body img {
  border-radius: 8px;
  border: 1px solid var(--border);
  margin: 1rem 0;
}
.post-body table {
  width: 100%;
  border-collapse: collapse;
  margin: 0 0 1rem;
  font-size: 0.9rem;
}
.post-body th, .post-body td {
  border-bottom: 1px solid var(--border);
  padding: 0.5rem 0.6rem;
  text-align: left;
}
.post-body th { color: var(--text); font-weight: 600; }
```

- [ ] **Step 5: Register the route in `src/main.jsx`**

```jsx
import PostPage from './components/PostPage.jsx'

// inside <Routes>:
<Route path="/writing/:slug" element={<PostPage />} />
```

- [ ] **Step 6: Run dev server, verify post page**

Run `npm run dev`. Visit http://localhost:5173/writing/hello. Expected: terminal breadcrumb, post title, meta row with `2026.06.04 · ~1 min · #meta`, body paragraphs styled with sky-accent links and the `[RSS feed]` link. Inline code (none in seed) would tint sky. No console errors.

Visit http://localhost:5173/writing/nope. Expected: redirects to `/404` which currently 404s on Vite (no route registered yet). That's fine — Task P2.7 adds NotFound.

Stop dev server.

- [ ] **Step 7: Commit**

```bash
git add package.json package-lock.json vite.config.js src/components/PostPage.jsx src/main.jsx src/index.css
git commit -m "feat(post): markdown post page with syntax highlighting"
```

---

### Task P2.7: Build `NotFound` and register catchall route

**Files:**
- Create: `src/components/NotFound.jsx`
- Modify: `src/main.jsx`

- [ ] **Step 1: Create `src/components/NotFound.jsx`**

```jsx
import { Link } from 'react-router-dom'

export default function NotFound() {
  return (
    <main className="page-shell container">
      <p className="page-breadcrumb mono">
        <Link to="/">~</Link> / <span className="page-bc-current">404</span>
      </p>
      <div className="term-window" style={{ maxWidth: 520, margin: '2rem 0' }}>
        <div className="term-titlebar">
          <div className="term-dots"><span /><span /><span /></div>
          <div className="term-title mono">error — file not found</div>
          <div style={{ width: 47 }} />
        </div>
        <div className="term-body mono">
          <div className="term-line term-cmd"><span className="term-prompt">$</span><span className="term-content">cat /requested-path</span></div>
          <div className="term-line term-out" style={{ color: 'var(--accent-red)' }}>cat: no such file or directory</div>
          <div className="term-line term-cmd" style={{ marginTop: '0.5rem' }}><span className="term-prompt">$</span><span className="term-content">cd .. <span className="term-cursor" /></span></div>
        </div>
      </div>
      <p className="page-back mono">
        <Link to="/"><span className="footer-p">$</span> cd .. <span aria-hidden="true">→</span> home</Link>
      </p>
    </main>
  )
}
```

- [ ] **Step 2: Register catchall route in `src/main.jsx`**

```jsx
import NotFound from './components/NotFound.jsx'

// inside <Routes> — add at the end:
<Route path="*" element={<NotFound />} />
```

- [ ] **Step 3: Run dev server, verify 404**

Run `npm run dev`. Visit http://localhost:5173/anything-not-real. Expected: 404 page renders the terminal mini-window with red error line + cursor on `cd ..`. Click the home link → returns to `/`. Stop dev server.

- [ ] **Step 4: Commit**

```bash
git add src/components/NotFound.jsx src/main.jsx
git commit -m "feat(404): terminal-styled NotFound page and catchall route"
```

---

### Task P2.8: Add RSS feed generation via custom Vite plugin

**Files:**
- Modify: `vite.config.js`
- Modify: `index.html` — add `<link rel="alternate">`

- [ ] **Step 1: Add the plugin to `vite.config.js`**

Replace `vite.config.js`:

```js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { readFileSync, readdirSync } from 'node:fs'
import { join } from 'node:path'
import matter from 'gray-matter'

const SITE_URL = 'https://minul.vercel.app'
const SITE_TITLE = 'Minul Lokuliyana — Writing'
const SITE_DESCRIPTION = 'Short notes on customer success, construction tech, and process improvement.'

function rssPlugin() {
  return {
    name: 'rss-feed',
    apply: 'build',
    generateBundle() {
      const dir = join(process.cwd(), 'src', 'content', 'posts')
      let files = []
      try { files = readdirSync(dir).filter((f) => f.endsWith('.md')) } catch { return }

      const posts = files
        .map((name) => {
          const raw = readFileSync(join(dir, name), 'utf-8')
          const { data, content } = matter(raw)
          const m = name.match(/^(\d{4}-\d{2}-\d{2})-(.+)\.md$/)
          if (!m) return null
          const [, fileDate, slug] = m
          if (data.draft) return null
          const date = data.date ? String(data.date).slice(0, 10) : fileDate
          return {
            slug,
            title: data.title ?? slug,
            date,
            excerpt: data.excerpt ?? content.slice(0, 200),
          }
        })
        .filter(Boolean)
        .sort((a, b) => (a.date < b.date ? 1 : -1))

      const items = posts.map((p) => `
    <item>
      <title>${escapeXml(p.title)}</title>
      <link>${SITE_URL}/writing/${p.slug}</link>
      <guid isPermaLink="true">${SITE_URL}/writing/${p.slug}</guid>
      <pubDate>${new Date(p.date + 'T00:00:00Z').toUTCString()}</pubDate>
      <description>${escapeXml(p.excerpt)}</description>
    </item>`).join('')

      const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
  <channel>
    <title>${escapeXml(SITE_TITLE)}</title>
    <link>${SITE_URL}/writing</link>
    <description>${escapeXml(SITE_DESCRIPTION)}</description>
    <language>en-AU</language>${items}
  </channel>
</rss>
`
      this.emitFile({ type: 'asset', fileName: 'feed.xml', source: xml })
    },
  }
}

function escapeXml(s) {
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;')
}

export default defineConfig({
  plugins: [react(), rssPlugin()],
  build: {
    target: 'esnext',
    rollupOptions: {
      output: {
        manualChunks: {
          'vendor-react': ['react', 'react-dom'],
          'vendor-motion': ['framer-motion'],
          'vendor-router': ['react-router-dom'],
          'vendor-markdown': ['react-markdown', 'remark-gfm', 'rehype-highlight', 'highlight.js'],
        },
      },
    },
  },
})
```

- [ ] **Step 2: Add RSS `<link>` to `index.html` `<head>`**

Add just before the `<title>` line:

```html
    <link rel="alternate" type="application/rss+xml" title="Minul Lokuliyana — Writing" href="/feed.xml" />
```

- [ ] **Step 3: Build and verify `feed.xml` exists**

```bash
npm run build
```

Expected: `dist/feed.xml` is produced. Inspect with `cat dist/feed.xml` (or open the file). Expected: well-formed XML with one `<item>` for the seed post, correct title, link, pubDate, description.

- [ ] **Step 4: Commit**

```bash
git add vite.config.js index.html
git commit -m "feat(rss): generate /feed.xml at build via custom Vite plugin"
```

---

### Task P2.9: Add `new-post` authoring script

**Files:**
- Create: `scripts/new-post.mjs`
- Modify: `package.json` — add the script

- [ ] **Step 1: Create `scripts/new-post.mjs`**

```js
import { mkdir, writeFile, access } from 'node:fs/promises'
import { constants } from 'node:fs'
import { join } from 'node:path'
import { argv, exit, cwd } from 'node:process'

const title = argv.slice(2).join(' ').trim()
if (!title) {
  console.error('Usage: npm run new-post "Your title here"')
  exit(1)
}

const today = new Date().toISOString().slice(0, 10)
const slug = title
  .toLowerCase()
  .replace(/&/g, ' and ')
  .replace(/[^a-z0-9]+/g, '-')
  .replace(/^-+|-+$/g, '')
  .slice(0, 80)

if (!slug) {
  console.error('Could not derive a slug from the title.')
  exit(1)
}

const filename = `${today}-${slug}.md`
const dir = join(cwd(), 'src', 'content', 'posts')
const filepath = join(dir, filename)

await mkdir(dir, { recursive: true })

try {
  await access(filepath, constants.F_OK)
  console.error(`File already exists: ${filepath}`)
  exit(1)
} catch {
  // doesn't exist — good
}

const body = `---
title: ${title}
date: ${today}
excerpt: TODO — one-sentence summary that shows up on the index and in RSS.
tags: []
draft: true
---

Write here. Set draft: false when ready to publish.
`

await writeFile(filepath, body, 'utf-8')
console.log(`✔ Created src/content/posts/${filename}`)
console.log(`  Open it in your editor and start writing.`)
```

- [ ] **Step 2: Add the npm script**

Edit `package.json` `"scripts"` block:

```json
"scripts": {
  "dev": "vite",
  "build": "vite build",
  "preview": "vite preview",
  "new-post": "node scripts/new-post.mjs"
}
```

- [ ] **Step 3: Smoke-test the script (without committing the test file)**

```bash
npm run new-post "Test post please ignore"
```

Expected: prints `✔ Created src/content/posts/2026-06-04-test-post-please-ignore.md` and the file exists with the right frontmatter.

Verify the file:

```bash
git status
```

Expected: the test file shows as untracked. Delete it before continuing:

```bash
rm "src/content/posts/2026-06-04-test-post-please-ignore.md"
```

Re-run with no title to verify the error path:

```bash
npm run new-post
```

Expected: exits non-zero with `Usage: npm run new-post "Your title here"`.

- [ ] **Step 4: Commit**

```bash
git add scripts/new-post.mjs package.json
git commit -m "feat(posts): add npm run new-post authoring script"
```

---

### Task P2.10: Add `vercel.json` SPA rewrite

**Files:**
- Create: `vercel.json`

- [ ] **Step 1: Create `vercel.json`**

```json
{
  "rewrites": [
    { "source": "/((?!feed\\.xml$|assets/.*|.*\\.(?:ico|png|jpg|jpeg|svg|gif|webp|pdf|txt|xml|json|js|css)).*)", "destination": "/index.html" }
  ]
}
```

This routes everything to `index.html` *except* the static asset extensions and `/feed.xml`, so deep links to `/writing/<slug>` and `/writing` work after deploy without breaking the RSS feed or any static file in `dist/`.

- [ ] **Step 2: Run preview build to verify config is valid**

```bash
npm run build && npm run preview
```

The preview server doesn't apply Vercel rewrites, but visit `/writing/hello` in the preview — should still render because react-router-dom catches client-side. Then verify `http://localhost:4173/feed.xml` returns the XML feed. Stop preview.

- [ ] **Step 3: Commit**

```bash
git add vercel.json
git commit -m "feat(vercel): SPA rewrite that preserves /feed.xml and static assets"
```

---

### Task P2.11: Phase 2 verification + push

**Files:** (none — verification only, then CLAUDE.md update)

- [ ] **Step 1: Production build + console scan**

```bash
npm run build
npm run preview
```

Walk through:
- `/` — boot, hero, all sections, `#06 / writing` section showing the seed post
- `/writing` — index page lists the seed post
- `/writing/hello` — post page renders the body
- `/writing/nonexistent` — 404 terminal mini-window
- `/feed.xml` — XML feed

Open DevTools console on each. No errors. No 404s on chunks. Lighthouse-style cursory check: page weight reasonable.

Stop preview.

- [ ] **Step 2: Update `CLAUDE.md` to document the blog**

Add to `## Commands`:

```markdown
- New post: npm run new-post "Title here"
```

Update `## Tech` to add the blog stack:

```markdown
## Tech
- Vite 6 + React 18
- framer-motion for UI animation
- react-router-dom for client-side routing
- react-markdown + remark-gfm + rehype-highlight for blog posts
- gray-matter for frontmatter parsing
- highlight.js for code syntax highlighting
- Custom CSS tokens (electric / terminal palette, Geist + JetBrains Mono)
```

Update `## Repo layout (expected)` to add:

```markdown
- src/components/ (BootSequence, PostPage, WritingIndex, NotFound)
- src/lib/posts.js (markdown loader)
- src/content/posts/ (markdown blog posts, YYYY-MM-DD-slug.md)
- scripts/new-post.mjs (authoring CLI)
- vercel.json (SPA rewrites)
```

Add a `## Authoring posts` section before `## Definition of done`:

```markdown
## Authoring posts
- npm run new-post "Title" creates src/content/posts/<today>-<slug>.md with draft: true frontmatter
- Edit the file, set draft: false when ready, commit + push, Vercel rebuilds
- /feed.xml is regenerated on every build
```

- [ ] **Step 3: Commit and push**

```bash
git add CLAUDE.md
git commit -m "docs: document blog system in CLAUDE.md"
git push
```

**Phase 2 checkpoint:** redesigned site + blog system live. Future posts only need `npm run new-post`, write, commit, push.

---

## Self-Review (run before handoff)

- [ ] **Spec coverage check:** every numbered section in the spec is covered.
  - §3 design system → P1.1
  - §4 hero → P1.3
  - §5 boot sequence → P1.2
  - §6 sections → P1.5–P1.8
  - §7 nav → P1.4 (Writing link added in P2.4)
  - §8.1 file layout → P2.3 (seed)
  - §8.2 frontmatter → P2.2 (parser) + P2.3 (seed example)
  - §8.3 build pipeline → P2.2
  - §8.4 routing → P2.1 + P2.5 + P2.6 + P2.7
  - §8.5 homepage section → P2.4
  - §8.6 post page → P2.6
  - §8.7 RSS → P2.8
  - §8.8 authoring → P2.9
  - §9 file changes → spread across all tasks (correctly)
  - §10 dependencies → P2.1, P2.2, P2.6
  - §11 welcome post → P2.3
  - §12 accessibility → covered by reduced-motion gates in P1.2, P1.3, and the skip-link preservation in P1.1
  - §13 phases → reflected in plan structure
  - §14 risks → mitigations baked into task choices (highlight.js loaded only for what's needed by language imports; vercel.json regex excludes feed.xml)

- [ ] **Placeholder scan:** no `TBD`, no "implement later", no "similar to Task N" — verified.

- [ ] **Type / name consistency:**
  - `BootSequence` (component name) consistent
  - `term-window`, `term-titlebar`, `term-body` class names used in BootSequence, Hero, NotFound — consistent
  - `term-line`, `term-cmd`, `term-out`, `term-cursor`, `term-prompt`, `term-content` — consistent
  - `exp-card` → renamed to `term-card.exp-card` shell — consistent across Experience, Education, Leadership, Projects
  - `post-row`, `post-list` shared between homepage section (P2.4) and `WritingIndex` (P2.5) — consistent
  - `getPost`, `latestPosts`, `allPosts` exported from `src/lib/posts.js` (P2.2) and consumed by P2.4 / P2.5 / P2.6 — consistent

Plan complete.
