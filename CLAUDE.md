# Project: resume-app (Vite + React)

## Tech
- Vite 6 + React 18
- framer-motion for UI animation
- @react-three/fiber + @react-three/drei + three for the 3D background scene

## Commands
- Install: npm install
- Dev: npm run dev
- Build: npm run build
- Preview: npm run preview

## Repo layout (expected)
- index.html (loads /src/main.jsx)
- src/main.jsx (React root)
- src/App.jsx (main app)
- src/Scene3D.jsx (3D background components)
- src/index.css (global styles)

## Code style rules
- Keep components functional (hooks), minimal and readable.
- Avoid breaking visual polish: prefer small, incremental edits.
- Preserve performance: 3D scene must remain lightweight and aria-hidden.
- Prefer AU English spelling in copy.

## Definition of done
- `npm run build` succeeds.
- No console errors on `npm run dev`.
- Animations remain smooth; no layout shifts.