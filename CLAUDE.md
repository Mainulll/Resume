# Project: resume-app (Vite + React)

## Tech
- Vite 6 + React 18
- framer-motion for UI animation
- Custom CSS tokens (electric / terminal palette, Geist + JetBrains Mono)
- No 3D scene (legacy reference removed)

## Commands
- Install: npm install
- Dev: npm run dev
- Build: npm run build
- Preview: npm run preview

## Repo layout (expected)
- index.html (loads /src/main.jsx)
- src/main.jsx (React root)
- src/App.jsx (main app — Nav, Hero, sections, Footer)
- src/components/BootSequence.jsx (boot-overlay loading animation)
- src/index.css (global styles + tokens)

## Code style rules
- Keep components functional (hooks), minimal and readable.
- Avoid breaking visual polish: prefer small, incremental edits.
- Preserve performance: animations must remain smooth; avoid layout shifts.
- Prefer AU English spelling in copy.

## Definition of done
- `npm run build` succeeds.
- No console errors on `npm run dev`.
- Animations remain smooth; no layout shifts.