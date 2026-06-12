# minul.vercel.app

Terminal-styled portfolio and writing space. Single-page resume at `/`, markdown blog under `/writing`, RSS at `/feed.xml`.

**Live:** [minul.vercel.app](https://minul.vercel.app)

---

## Stack

| Layer | Technology |
|---|---|
| Framework | React 18 |
| Build | Vite 6 |
| Animation | Framer Motion |
| Routing | react-router-dom |
| Markdown | react-markdown + remark-gfm + rehype-highlight |
| Styling | Hand-rolled CSS tokens (Geist + JetBrains Mono) |
| Hosting | Vercel |

No UI library. Every component is hand-built: the boot overlay, terminal windows, nav, section cards, theme toggle, custom cursor.

---

## Repo layout

```
resume-app/
├── index.html                  # Shell: fonts, meta, OG tags
├── vite.config.js              # Manual chunks + build-time RSS plugin
├── vercel.json                 # SPA rewrites, cache + security headers
├── scripts/new-post.mjs        # Authoring CLI (npm run new-post "Title")
└── src/
    ├── main.jsx                # Router; blog routes are lazy-loaded
    ├── App.jsx                 # Homepage: data object + all sections
    ├── index.css               # Global tokens + styles (dark and light)
    ├── lib/
    │   ├── posts.js            # Markdown loader + tiny frontmatter parser
    │   └── boot.js             # Once-per-session gate for the boot animation
    ├── components/             # BootSequence, PostPage, WritingIndex, NotFound, CustomCursor
    └── content/posts/          # YYYY-MM-DD-slug.md
```

---

## Performance

The homepage ships no markdown machinery. Blog routes (react-markdown, remark-gfm, rehype-highlight and its grammars) are code-split behind `React.lazy` and load on first visit to `/writing`. That took homepage JavaScript from roughly 203 kB to 102 kB gzipped.

Production build:

```
dist/index.html                  3.16 kB │ gzip:   1.07 kB
dist/assets/index.css           23.37 kB │ gzip:   5.32 kB
dist/assets/index.js            28.33 kB │ gzip:  10.03 kB
dist/assets/vendor-motion.js   115.29 kB │ gzip:  38.28 kB
dist/assets/vendor-router.js   163.38 kB │ gzip:  53.45 kB   (includes React, hoisted by Rollup)
dist/assets/vendor-markdown.js 334.94 kB │ gzip: 101.59 kB   (lazy, /writing only)
dist/assets/PostPage.js          1.66 kB │ gzip:   0.75 kB   (lazy)
dist/assets/WritingIndex.js      1.58 kB │ gzip:   0.59 kB   (lazy)
dist/assets/NotFound.js          1.50 kB │ gzip:   0.55 kB   (lazy)
```

Other choices:

- The boot animation plays once per browser session (`sessionStorage` gate). Repeat loads skip it and run a compressed hero cascade instead.
- `/assets/*` is cached immutable for a year; hashed filenames bust on deploy.
- Fonts load non-blocking (`media="print"` swap) and only the weights in use are requested.
- Reduced motion is respected everywhere: the boot overlay is skipped and entrance delays collapse to zero.
- A `theme-color` meta tag stays in sync with the active theme so the browser chrome matches.

---

## Theming

Dark and light themes via CSS custom properties on `:root[data-theme]`. Body copy uses `--text-body` and `--text-body-strong` tokens rather than hardcoded hexes, so both themes stay legible. The choice persists in `localStorage` and falls back to `prefers-color-scheme`.

---

## Writing

```bash
npm run new-post "Post title"   # creates src/content/posts/<today>-<slug>.md (draft: true)
```

Set `draft: false`, push, and Vercel rebuilds. Drafts render in dev but are excluded from production and the feed. `/feed.xml` is regenerated on every build by a small Vite plugin.

---

## Local development

```bash
git clone https://github.com/Mainulll/Resume.git
cd Resume
npm install
npm run dev        # http://localhost:5173
npm run build      # production build → dist/
npm run preview    # serve the production build locally
```

---

## Deployment

Vercel, zero config. Every push to `main` redeploys. `vercel.json` handles SPA rewrites (excluding `/feed.xml` and static assets) plus cache and security headers.

---

*Built by [Minul Lokuliyana](https://linkedin.com/in/minull). Customer Success at Aphex, final-year Business Analytics and Cybersecurity student at Monash.*
