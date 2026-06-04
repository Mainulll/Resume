# Project: resume-app (Vite + React)

## Tech
- Vite 6 + React 18
- framer-motion for UI animation
- react-router-dom for client-side routing
- react-markdown + remark-gfm + rehype-highlight for blog posts
- gray-matter for frontmatter parsing
- highlight.js for code syntax highlighting
- Custom CSS tokens (electric / terminal palette, Geist + JetBrains Mono)

## Commands
- Install: npm install
- Dev: npm run dev
- Build: npm run build
- Preview: npm run preview
- New post: npm run new-post "Title here"

## Repo layout (expected)
- index.html (loads /src/main.jsx)
- src/main.jsx (React root + router)
- src/App.jsx (homepage — Nav, Hero, sections, Footer)
- src/components/BootSequence.jsx (boot-overlay loading animation)
- src/components/PostPage.jsx (individual post route)
- src/components/WritingIndex.jsx (chronological /writing index)
- src/components/NotFound.jsx (terminal-styled 404)
- src/lib/posts.js (markdown loader)
- src/content/posts/ (markdown blog posts, YYYY-MM-DD-slug.md)
- scripts/new-post.mjs (authoring CLI)
- vercel.json (SPA rewrites + headers)
- src/index.css (global styles + tokens)

## Code style rules
- Keep components functional (hooks), minimal and readable.
- Avoid breaking visual polish: prefer small, incremental edits.
- Preserve performance: animations must remain smooth; avoid layout shifts.
- Prefer AU English spelling in copy.

## Authoring posts
- `npm run new-post "Title"` creates `src/content/posts/<today>-<slug>.md` with `draft: true` frontmatter
- Edit the file, set `draft: false` when ready, commit + push, Vercel rebuilds
- `/feed.xml` is regenerated on every build

## Definition of done
- `npm run build` succeeds.
- No console errors on `npm run dev`.
- Animations remain smooth; no layout shifts.
