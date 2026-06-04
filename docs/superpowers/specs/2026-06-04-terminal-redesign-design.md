# Terminal Redesign + Blog System — Design Spec

**Date:** 2026-06-04
**Status:** Approved for implementation
**Project:** resume-app (Vite + React portfolio)

---

## 1. Goal

Redesign the personal portfolio at `minul.vercel.app` from the current warm-cream / Fraunces aesthetic to a **modern, designer-feel terminal aesthetic** (Linear / Vercel / Stripe vocabulary, terminal personality), and add a **file-based blog system** authored in markdown.

## 2. Non-goals

- **Not** editing `data.experience` in `src/App.jsx`. User will supply revised resume data himself.
- **Not** building a CMS, web-based editor, comments, reactions, or newsletter signup for the blog.
- **Not** server-rendering the site (stays a Vite SPA on Vercel).
- **Not** shipping a light "paper terminal" variant in v1 — out of scope, possible later.
- **Not** removing or rebuilding the existing theme toggle — preserve and re-skin it.

## 3. Design system

### 3.1 Palette (default: dark)

Replace the warm cream / terracotta tokens with an electric/modern palette:

| Token | Dark (default) | Light |
|---|---|---|
| `--bg` | `#060611` | `#fafafa` |
| `--surface` | `rgba(15, 16, 28, 0.72)` | `#ffffff` |
| `--surface-2` | `rgba(15, 16, 28, 0.5)` | `#f4f4f5` |
| `--border` | `rgba(255,255,255,0.07)` | `#e4e4e7` |
| `--border-strong` | `rgba(255,255,255,0.12)` | `#d4d4d8` |
| `--text` | `#f5f6fb` | `#0a0a0a` |
| `--text-muted` | `#8b8da5` | `#52525b` |
| `--accent` | `#7dd3fc` (sky-300) | `#0284c7` (sky-600) |
| `--accent-strong` | `#38bdf8` (sky-400) | `#0369a1` (sky-700) |
| `--accent-violet` | `#c4b5fd` (violet-300) | `#7c3aed` |
| `--accent-green` | `#34d399` (emerald-400) | `#059669` |

Default theme on first load: **dark**. Theme toggle preserved; user preference saved to `localStorage` as today. Light palette is a derivative — same structure, different values.

### 3.2 Typography

Two type families, both via Google Fonts (preconnect + `display=swap`):

- **Display & body:** [Geist](https://fonts.google.com/specimen/Geist) — weights 400, 500, 600. Tight letter-spacing (`-0.025em` to `-0.035em`) on display sizes.
- **Mono:** [JetBrains Mono](https://fonts.google.com/specimen/JetBrains+Mono) — weights 400, 500, 600. Used for prompts, badges, section numbers, code, dates, metadata.

Fraunces is **removed**. The `.display` class in `index.css` is repurposed for Geist display sizes.

### 3.3 Background

Stage background uses:
- Solid `var(--bg)` base
- Two soft radial gradients (sky at top-left ~18% opacity, violet at bottom-right ~14% opacity)
- Subtle 36px grid via two `linear-gradient(... 1px, transparent 1px)` layers at ~2% opacity

No particles, no scanlines, no animated background.

### 3.4 Motion

| Element | Behaviour |
|---|---|
| Boot sequence | 1.0–1.2s total, lines fade-in at staggered delays (see §5) |
| Hero typing | Lines reveal in sequence; cursor blinks (`1.05s steps(2) infinite`) |
| Section content | Existing `FadeUp` scroll-into-view stays |
| Card hover | `transform: translateY(-2px)`, border colour shifts to `rgba(125,211,252,0.3)`, 200ms |
| Link hover | Colour shifts from sky → violet, underline dash → solid |
| Pulse dot | 2s cubic ease-out, box-shadow ripple |
| Reduced motion | All animations collapse to instant reveal. Use `useReducedMotion` (already imported from framer-motion) and CSS `@media (prefers-reduced-motion: reduce)` |

## 4. Hero

### 4.1 Structure

```
[ eyebrow: live-pulse dot · "Melbourne · Australia · v2026.1" ]
[ terminal window ]
  titlebar: traffic-light dots · "minul@portfolio — zsh — 86×24" · "~ /" tab pill
  body:
    $ whoami
    → Minul Lokuliyana            (Geist 600, 2.85rem, sky→muted gradient text)
    $ cat ~/role.txt
    → Customer Success @ Aphex · Final-year student at Monash
    $ cat ~/about.md
    → [pitch — see §4.2]
    $ ls ~/links/
    → linkedin · github · email · resume.pdf  (each with dashed-underline accent)
    $ ▮ (blinking cursor)
[ CTA row outside the window ]
  - Download resume (primary, sky-blue solid)
  - Get in touch (secondary, transparent border)
```

The terminal window has a soft sky glow (`0 0 120px rgba(56,189,248,0.08)`) and 12px `backdrop-filter: blur`.

### 4.2 Pitch copy (locked)

```
I work in customer success at Aphex, helping major contractors plan and
deliver better. I keep cross-functional teams aligned and ship high-value
work on time. Strong on communication, organisation, and stakeholder
management — with a soft spot for the unglamorous process improvements
that quietly compound. Finishing Business Analytics & Cybersecurity at
Monash.
```

Inline mono-styled emphasis (`<em>`) on: `customer success`, `Aphex`, `Business Analytics & Cybersecurity`.

### 4.3 Existing data references

The hero pulls from `data.name`, `data.location`, `data.contact.{linkedin,github,email}`, `data.resumePdf`. The current `data.openTo` field is **removed entirely** from both the data object and the rendered output. The `data.role` field is **replaced** with the new role-line content (`Customer Success @ Aphex · Final-year student at Monash`).

## 5. Loading animation (boot sequence)

Runs once per session (no replay on theme toggle or navigation). Lives in a new `<BootSequence />` component, mounted as the first child of `<App />` and `position: fixed` over the page until complete.

### 5.1 Sequence

```
$ ./portfolio.sh --theme=electric         [ delay 0.10s ]
[ OK ] mounting /minul/portfolio          [ delay 0.30s ]
[ OK ] loading config.json                [ delay 0.50s ]
[ OK ] initialising theme → electric      [ delay 0.70s ]
[ OK ] hydrating sections (5 found)       [ delay 0.90s ]
[ OK ] ready in 0.8s                      [ delay 1.10s ]
$ open hero ▮                             [ delay 1.35s ]
```

Each line: `opacity: 0 → 1` over 0.25s. After the final line, the boot overlay fades out (0.3s) and the hero typing animation begins.

### 5.2 Reduced motion

`useReducedMotion()` returns true → skip the overlay entirely, render the hero immediately with all lines visible (no typing cascade).

### 5.3 First-visit only (optional polish, not required for v1)

Use `sessionStorage.getItem('booted')` to skip on subsequent in-tab navigations. **In v1, runs on every full page load** — sessionStorage gate is a future enhancement.

## 6. Section treatments

### 6.1 Section headers

Replace the current `SectionHeader` component output:

```
# 01 / experience  ─────────────────────────────
^   ^     ^
|   |     └─ Geist 600, 1.5rem, -0.02em
|   └─ JetBrains Mono 500, 0.78rem, var(--text-muted), letter-spacing 0.15em
└─ JetBrains Mono 600, var(--accent-strong)
   then a flex-fill line: linear-gradient(90deg, var(--border-strong), transparent)
```

Numbering: `01` through `06`. Order: Experience, Skills, Projects, Education, Leadership, Writing.

### 6.2 Cards

Shared base:
- Background: `var(--surface)` with `backdrop-filter: blur(6px)`
- Border: `var(--border)` → `rgba(125,211,252,0.3)` on hover
- Radius: 12px
- Hover: `translateY(-2px)`, 200ms ease

#### Experience card
- Top row: mono badges for period (`2025 — 2026`), location, employment type
- Title: `<role> @ <company>` — role in Geist 600, `@ <company>` in muted Geist 400
- Bullets: terminal-style `›` marker (sky accent), Geist body

#### Skills card
- Header reads as a code declaration: `const data_and_engineering =` (mono, mixed-colour syntax-highlighting feel)
- Items: mono chips in a CSS grid (`auto-fill, minmax(110px, 1fr)`), subtle sky tint, hover lifts

#### Project card
- Top row: mono badge for role (e.g. `co-founder`) and a status tag (`shipped`)
- Title: `<name> — <subtitle>` (subtitle in muted Geist)
- Description: Geist body
- Tech: mono row with `·` separators in accent colour
- Link: terminal-style arrow `→`

#### Education / Leadership
- Same card shell. Mono date badges, Geist body, terminal `›` bullets where lists appear.

## 7. Navigation

Existing nav structure preserved. Visual updates:
- Brand mark: replace the rotated-square SVG with a mono `~$ minul` glyph (Geist Mono 500)
- Nav links: mono labels, sky-accent underline on `aria-current="page"`
- Theme toggle: existing Sun/Moon icons, restyled to sky accent
- Mobile disclosure: existing pattern, restyled

Add a new link **Writing** between Leadership and the resume button — **added in Phase 2 only** (Phase 1 ships without it to avoid linking to an empty section). `NAV_LINKS` in Phase 2 becomes:

```js
const NAV_LINKS = [
  { label: 'Experience', href: '#experience' },
  { label: 'Skills', href: '#skills' },
  { label: 'Projects', href: '#projects' },
  { label: 'Education', href: '#education' },
  { label: 'Leadership', href: '#leadership' },
  { label: 'Writing', href: '#writing' },
]
```

On the homepage `Writing` scrolls to the `#writing` section. On a post page it links back to `/#writing`.

## 8. Blog system

### 8.1 File layout

```
src/
  content/
    posts/
      2026-05-14-multiplayer-planning.md
      2026-04-02-shipping-ai-features.md
      2026-02-18-boring-process-improvements.md
```

### 8.2 Frontmatter schema

```yaml
---
title: How we replaced spreadsheets with multiplayer planning
date: 2026-05-14
excerpt: Construction has been running on weekly Excel updates for two decades. Here's what changes when planning becomes daily.
tags: [customer-success, construction-tech]
draft: false
---
```

Required: `title`, `date`, `excerpt`. Optional: `tags` (string array), `draft` (boolean, defaults `false`). Posts with `draft: true` are excluded from the index in production builds.

### 8.3 Build pipeline

Discover posts at build time using Vite glob imports:

```js
const modules = import.meta.glob('/src/content/posts/*.md', {
  query: '?raw',
  import: 'default',
  eager: true,
})
```

Parse frontmatter with `gray-matter`. Render markdown with `react-markdown` + `remark-gfm` (tables, strikethrough, autolinks) + `rehype-highlight` (syntax highlighting via highlight.js). Slug derived from filename: `2026-05-14-foo-bar.md` → slug `foo-bar`, displayed date `2026.05.14`.

Reading-time estimate: word count ÷ 220 wpm, rounded up. Computed at build by the loader, exposed as `readingMinutes`.

### 8.4 Routing

Add `react-router-dom@^6` (chosen over wouter for ecosystem familiarity — bundle cost ~12kb gz, acceptable). Update `src/main.jsx`:

```jsx
<BrowserRouter>
  <Routes>
    <Route path="/" element={<App />} />
    <Route path="/writing" element={<WritingIndex />} />
    <Route path="/writing/:slug" element={<PostPage />} />
    <Route path="*" element={<NotFound />} />
  </Routes>
</BrowserRouter>
```

`<WritingIndex />` renders a full chronological list of all non-draft posts (no 3-item cap, no card hover lift — denser table-like list). The homepage `#writing` section (§8.5) shows the latest 3 and links here when there are more than 3 posts.

`<NotFound />` renders a small terminal-styled 404 (`$ cat /404 → file not found`).

Vercel rewrite config (`vercel.json`) added so deep links route through `index.html`:

```json
{ "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }] }
```

### 8.5 Homepage `#writing` section

Renders the latest 3 non-draft posts as a list (not cards — denser). Each row: mono date column (110px), Geist title, mono reading-time on the right. Hover lifts and shifts border to sky. Bottom link: `$ ls ~/writing/ →` linking to a full index at `/writing` if more than 3 posts exist (when post count ≤ 3, the link is omitted).

When `posts.length === 0`, render an empty-state line: `$ ls ~/writing/ → (empty) — first post coming soon` in muted text. Section header still renders.

### 8.6 Individual post page

Layout (max-width 680px, centred):

```
[ nav — same as homepage, brand-mark links to / ]
[ breadcrumb: ~ / writing / <slug>  (mono, sky-accent links) ]
[ h1 title — Geist 600, 1.85rem, -0.025em ]
[ meta row: date · reading-time · tags (mono badges) ]
[ markdown body — Geist for prose, JetBrains Mono for code ]
[ code blocks: highlight.js "github-dark-dimmed" theme, custom-toned to sky accent ]
[ inline code: var(--surface) bg, sky border, accent text ]
[ footer: $ cd .. → back to writing ]
```

### 8.7 RSS feed

Generate `dist/feed.xml` at build via a small Vite plugin (`vite-plugin-rss-generator` is overkill — write a 30-line custom plugin in `vite.config.js`). Linked from `<head>` as `<link rel="alternate" type="application/rss+xml" href="/feed.xml" />`.

### 8.8 Authoring workflow

Add `scripts/new-post.mjs` and `npm run new-post` to `package.json`:

```bash
$ npm run new-post "How we replaced spreadsheets with multiplayer planning"
✔ Created src/content/posts/2026-06-04-how-we-replaced-spreadsheets-with-multiplayer-planning.md
```

The script:
1. Slugifies the title (lowercase, hyphenate, strip punctuation)
2. Builds filename: `<YYYY-MM-DD>-<slug>.md` using today's local date
3. Writes the file with prefilled frontmatter (title, today's date, empty excerpt, empty tags, `draft: true`)
4. Logs the path and exits (does **not** open an editor — keeps the script cross-platform; user opens the file themselves)

If the file already exists, the script errors and exits non-zero — no overwrite.

## 9. File changes

### Modify
- `src/App.jsx` — strip warm-cream code, build new hero, new section components, new card treatments, remove `data.openTo`, replace `data.role`, add `data.posts` (loaded from glob, Phase 2 only) and `Writing` section (Phase 2 only)
- `src/main.jsx` — wrap `<App />` in `<BrowserRouter>` + `<Routes>` (Phase 2)
- `src/index.css` — replace palette tokens, swap font imports, restyle base elements, add terminal-card utilities, add boot-sequence styles
- `index.html` — preload Geist + JetBrains Mono, add RSS `<link>` (Phase 2), update theme pre-paint script for new dark default
- `package.json` — add `new-post` script (Phase 2), new dependencies
- `vite.config.js` — add RSS feed plugin (Phase 2); keep existing manualChunks but add `vendor-router` and `vendor-markdown` chunks when those deps land
- `CLAUDE.md` — update tech list (remove three.js/r3f references that are stale; add routing + markdown stack in Phase 2)
- `.gitignore` — no change (already covers `.claude/`, `.superpowers/`, `dist/`, `node_modules/`)

### Add
- `src/components/BootSequence.jsx` (Phase 1)
- `src/components/PostPage.jsx` (Phase 2)
- `src/components/WritingIndex.jsx` (Phase 2)
- `src/components/NotFound.jsx` (Phase 2)
- `src/lib/posts.js` — glob loader, frontmatter parsing, sort, reading-time (Phase 2)
- `src/content/posts/` — directory, scaffolded with one welcome post (Phase 2 — see §11)
- `scripts/new-post.mjs` (Phase 2)
- `vercel.json` — SPA rewrite rule (Phase 2)

### Remove
- Any Fraunces / Newsreader font references
- The current warm-cream / terracotta palette CSS
- The current `NameReveal`, `BrandMark` SVG (replaced with mono glyph)
- `data.openTo` field and its rendered chip

## 10. Dependencies

Production:
- `react-router-dom@^6`
- `react-markdown@^9`
- `remark-gfm@^4`
- `rehype-highlight@^7`
- `highlight.js@^11` (peer of rehype-highlight)
- `gray-matter@^4`

Dev:
- None new — `@vitejs/plugin-react` and `vite` already present.

Estimated bundle impact: **~70–90 kB gzipped** added across react-router (~12), react-markdown + remark/rehype (~40), highlight.js core + 3 languages (~20). Acceptable for a portfolio.

## 11. Welcome post (seed content)

To ship Phase 2 with a non-empty Writing section, scaffold one short welcome post at `src/content/posts/2026-06-04-hello.md` with placeholder body the user can rewrite or delete. Mark `draft: false` so it appears immediately. Not user-blocking — user can delete the file and run `new-post` for the real first entry.

## 12. Accessibility

- Skip-link preserved (re-skinned)
- All animations gated by `prefers-reduced-motion`
- Focus-visible outlines: 2px sky, 3px offset
- Terminal window has `role="img"` with `aria-label` describing the content for screen readers (the terminal frame is decorative; the content inside is real text in the DOM)
- Boot sequence overlay: `aria-hidden="true"` (it's decorative animation, the underlying hero is the real content)
- Mobile breakpoints: existing breakpoints preserved (single-column on `< 720px`, multi-column on `≥ 900px`)

## 13. Implementation phases

The work decomposes cleanly into two shippable phases. Each is a valid endpoint.

### Phase 1 — Visual redesign (no routing, no blog)
- New palette + tokens
- New typography
- New hero with boot sequence
- New section treatments and cards
- Strip `data.openTo`, update `data.role`
- Updated nav (incl. Writing link, but it scrolls to a placeholder section with empty-state text since blog isn't built yet — OR omit the link until Phase 2)

**Phase 1 alone gives a complete, beautiful redesigned site.** Suitable to ship if Phase 2 slips.

### Phase 2 — Blog system
- Add `react-router-dom` + wrap app in router
- Add markdown pipeline + post loader
- Build `#writing` section with real post list
- Build `/writing/:slug` post page
- Add RSS feed plugin
- Add `npm run new-post` authoring script
- Add `vercel.json` SPA rewrite
- Seed welcome post

## 14. Risks

| Risk | Mitigation |
|---|---|
| `highlight.js` bundle bloat | Import only `core` + 3–4 languages (`js`, `ts`, `bash`, `python`); not the full bundle |
| Vite glob `eager: true` bundles all posts into main chunk | Acceptable for a personal site with < 50 posts. Revisit if post count grows |
| Boot animation feels gratuitous on slow connections | Skipped under reduced-motion. Total duration capped at 1.35s. Real hero content is in the DOM behind the overlay, so SEO/no-JS sees it normally |
| Vercel SPA rewrite + RSS feed conflict | RSS feed lives at `/feed.xml` which is a real file under `dist/`. Vercel serves static files before applying rewrites, so no conflict |
| New-post script differs in behaviour on Windows vs macOS | Use Node's `fs/promises` and `path.join` — no shell-specific commands. Date format uses `toISOString().slice(0, 10)` so it's deterministic |
| Theme toggle changes mid-boot | Boot sequence reads theme once on mount; if user toggles during boot, the new theme applies after the overlay fades. Acceptable — boot is < 1.5s |

## 15. Out of scope (explicit, for future)

- Light "paper terminal" theme variant
- Per-post Open Graph image generation
- Comments, reactions, view counts
- Newsletter signup
- Tag index pages (`/writing/tag/customer-success`)
- Search across posts
- MDX (JSX-in-markdown) — pure markdown is sufficient for v1
- Pre-rendering / SSG (stays SPA)

---

**Sign-off:** approved 2026-06-04 via brainstorm session. Visual mockups archived in `.superpowers/brainstorm/467-1780573859/content/`.
