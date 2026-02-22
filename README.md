# Minul Lokuliyana — Interactive Portfolio & Resume

A single-page interactive portfolio built for recruiting at tier-1 consulting, strategy, and analytics firms. Designed from the ground up with a focus on motion design, performance, and professional presentation.

**Live:** [minul.vercel.app](https://minul.vercel.app) 

---

## Tech Stack

| Layer | Technology | Version |
|---|---|---|
| Framework | React | 18.3 |
| Build Tool | Vite | 6.4 |
| Animation | Framer Motion | 11.11 |
| Styling | CSS-in-JS (inline `<style>` block) | — |
| Language | JavaScript (ESM) | ES2022+ |
| Deployment | Vercel | — |

**Zero UI library dependencies.** Every component — navbar, cards, buttons, loading screen — is hand-built.

---

## Architecture

The entire application lives in a single file: `src/App.jsx`. This is an intentional architectural choice — the portfolio is a presentation artefact, not a product. A flat structure eliminates abstraction overhead and makes every design decision immediately readable.

```
resume-app/
├── public/
│   └── resume.pdf          # Drop your PDF here for the download button
├── src/
│   ├── App.jsx             # Entire application (components + data + styles)
│   └── main.jsx            # React entry point
├── index.html              # HTML shell with AU-locale meta tags + OG cards
└── vite.config.js          # Build config with manual chunks for optimal caching
```

---

## Key Features & Implementation Notes

### Interactive Dot Grid Background

A custom HTML5 Canvas animation. On each animation frame:

1. **Pass 1 (batched):** All dots outside the mouse influence radius are drawn in a single `beginPath` / `fill` call — O(n) with no per-dot state.
2. **Pass 2 (individual):** Only dots within the 150 px influence radius are re-drawn with displacement and brightness, bounded by a tight bounding-box to limit iterations.

Distance comparisons in Pass 1 use `dist²` (no `sqrt`) for performance. The loop runs at 60 fps via `requestAnimationFrame`, pauses automatically when the tab is hidden (`visibilitychange`), and renders a single static frame for users who prefer reduced motion.

```js
// dist² avoids sqrt — only compute sqrt for influenced dots
if (isTouch || dx * dx + dy * dy >= INF2) { /* batch draw */ }
```

### Shared-Element Name Transition (Loading Screen → Hero)

Uses framer-motion's `layoutId` to create a true shared-element transition:

- During loading, `motion.p.loading-name` holds `layoutId="ml-name"`. It sits outside the blurring `motion.div` so framer-motion can lift it out independently when the screen exits.
- After loading, a `motion.h1.hero-name` with the same `layoutId` mounts in the hero. Framer-motion spring-animates the element from its loading-screen bounding rect to its hero position.
- The gem + tagline dissolve with blur/scale (`filter: blur(16px)`). The name travels independently.

```jsx
// Loading screen — name is a sibling of the blurring container
<motion.p className="loading-name" layoutId="ml-name" ...>
  {data.name}
</motion.p>

// Hero — same layoutId, triggers the shared-element flight
{loaded
  ? <motion.h1 className="hero-name" layoutId="ml-name" initial={false}
      transition={{ type: 'spring', stiffness: 72, damping: 18, mass: 1.1 }}>
      {data.name}
    </motion.h1>
  : <h1 className="hero-name" style={{ opacity: 0 }}>{data.name}</h1>
}
```

### Animated Contact Split Button

The "Contact Me" CTA expands into two options (Mobile / Email) with a spring transition using `AnimatePresence mode="wait"`:

- The button exits with scale + fade.
- Two options enter from opposite x directions with a 60 ms stagger.
- A `pointerdown` listener on `document` collapses the split when clicking outside.

### SVG Diamond Gem Logo

A hand-coded four-facet SVG diamond with `indigo → violet` gradients. Uses React's `useId()` hook to scope gradient IDs per instance, preventing SVG ID collisions when the logo renders in both the loading screen and footer simultaneously.

### Glass Pill Navbar

- **Desktop:** A full-width fixed track (`left: 0; right: 0; pointer-events: none`) centres the glass pill via `justify-content: center`. This is pixel-perfect on Windows regardless of `scrollbar-gutter: stable` — unlike `left: 50% / translateX(-50%)` which drifts by half the scrollbar width.
- **Mobile:** A circular FAB (bottom-right) with an `AnimatePresence` dropdown.
- Active section is tracked with `IntersectionObserver` (`rootMargin: '-35% 0px -60% 0px'`).

### Scroll-Driven Hero Parallax

Uses framer-motion's `useScroll` + `useTransform` to scale and fade the hero as the user scrolls, creating a depth effect without any scroll event listeners.

```js
const { scrollYProgress } = useScroll({ target: containerRef, offset: ['start start', 'end end'] })
const heroScale   = useTransform(scrollYProgress, [0, 0.12], [1, 0.94])
const heroOpacity = useTransform(scrollYProgress, [0, 0.1],  [1, 0])
```

### Performance Architecture

| Concern | Solution |
|---|---|
| Bundle splitting | Vite `manualChunks` separates `vendor-react` and `vendor-motion` — framer-motion and React stay cached across deploys |
| Layout shift | `scrollbar-gutter: stable` on `html` reserves scrollbar space upfront |
| Reduced motion | Canvas renders one static frame; spring animations are skipped |
| Tab visibility | `requestAnimationFrame` loop is cancelled on `visibilitychange` |
| Touch devices | Dot-grid mouse pass is skipped; static dots only |
| Build target | `esnext` — no unnecessary transpilation overhead |

**Production build output:**
```
index.html          1.92 kB │ gzip:  0.73 kB
app chunk          54.89 kB │ gzip: 13.46 kB
vendor-motion     130.67 kB │ gzip: 43.65 kB
vendor-react      134.66 kB │ gzip: 43.22 kB
```

---

## Design System

### Colour Palette

All colours are raw `rgba()` values — no design token library.

| Role | Value |
|---|---|
| Background | `#06060f` |
| Surface | `rgba(12, 11, 36, 0.72)` with `backdrop-filter: blur` |
| Primary accent | `rgba(99, 102, 241, …)` — indigo-500 |
| Secondary accent | `rgba(129, 140, 248, …)` — indigo-400 |
| Text primary | `rgba(228, 228, 245, 0.88)` |
| Text muted | `rgba(170, 174, 228, 0.5)` |
| Dot grid | `rgba(165, 168, 255, 0.13)` |

### Typography

System font stack with no external font dependency:

```css
font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', system-ui, sans-serif;
```

Hero name uses `clamp()` for fluid sizing. Letter-spacing and font-weight are tuned per element rather than using a type scale library.

### Motion Principles

- **Spring physics** for all interactive feedback (`stiffness: 380, damping: 20` for buttons; `stiffness: 72, damping: 18` for the name transition).
- **Ease curve** `[0.22, 1, 0.36, 1]` (custom cubic-bezier) for entrance animations — fast deceleration, professional feel.
- **`AnimatePresence mode="wait"`** for mutually exclusive states (contact split, loading screen exit).
- **`useInView` with `once: true`** for section entrance animations — triggers once, no re-animation on scroll-back.

---

## Content Structure

All content lives in the `data` object at the top of `App.jsx`. To adapt this portfolio:

```js
const data = {
  name:       'Your Name',
  resumePdf:  '/resume.pdf',       // drop file in /public/
  title:      'Degree · University',
  tagline:    'Pillar · Pillar · Pillar',
  location:   'City, State',
  contact: {
    email:    '...',
    mobile:   '...',
    linkedin: '...',
    github:   '...',
  },
  summary:    '...',
  message:    '...',               // hero paragraph
  industries: [...],              // industry tags under hero message
  experience: [...],              // array of role objects
  education:  {...},
  certifications: [...],
  openTo:     '...',              // top banner text
  sectionSubtext: {...},          // subtitle copy under each section heading
  skillPillars: [...],            // three-column skills layout
}
```

---

## Local Development

```bash
git clone https://github.com/Mainulll/Resume.git
cd Resume
npm install
npm run dev
```

Open `http://localhost:5173`.

To test the resume download, place a `resume.pdf` in the `public/` folder.

```bash
npm run build      # production build → dist/
npm run preview    # preview the production build locally
```

---

## Deployment

Deployed on [Vercel](https://vercel.com) with zero configuration. Every push to `main` triggers an automatic redeploy.

To deploy your own fork:
1. Import the repository in the Vercel dashboard
2. Vercel auto-detects Vite — no settings needed
3. Deploy

To add a custom domain: **Vercel → Settings → Domains**.

---

## Browser Support

Targets all modern browsers (`build.target: 'esnext'`). Graceful degradation:

- `backdrop-filter` is disabled on mobile viewports `< 480px` (performance)
- Canvas dot grid falls back to static dots on touch / no-hover devices
- `scrollbar-gutter: stable` is progressive enhancement (ignored by older browsers with no visual regression)

---

## Built With

- [React](https://react.dev) — UI rendering
- [Vite](https://vitejs.dev) — build tooling
- [Framer Motion](https://www.framer.com/motion/) — animation engine
- [Vercel](https://vercel.com) — hosting and CI/CD

---

*Portfolio of [Minul Lokuliyana](https://linkedin.com/in/minull) — Business Analytics & Cybersecurity candidate at Monash University.*
