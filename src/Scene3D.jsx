import { useId } from 'react'
import { motion } from 'framer-motion'

/* ── Gem Mark ──────────────────────────────────────────────────────────
   Polished 2D diamond gem — multi-facet design with cyan/violet gradient
   palette. Animated glow, subtle float, and slow shimmer effect.
   useId() scopes gradient IDs per instance (avoids SVG ID collisions).
─────────────────────────────────────────────────────────────────────── */

export function LoadingGem() {
  const uid = useId().replace(/:/g, '_')
  const noMotion = typeof window !== 'undefined' && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches

  return (
    <div className="loading-gem-canvas">
      <motion.svg
        width={100}
        height={117}
        viewBox="0 0 100 117"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        animate={noMotion ? undefined : { y: [0, -6, 0] }}
        transition={noMotion ? undefined : { duration: 3.5, repeat: Infinity, ease: 'easeInOut' }}
      >
        <defs>
          {/* Top-left facet — cyan to indigo */}
          <linearGradient id={`${uid}_tl`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#67e8f9" />
            <stop offset="100%" stopColor="#818cf8" />
          </linearGradient>
          {/* Top-right facet — indigo to violet */}
          <linearGradient id={`${uid}_tr`} x1="100%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#a5b4fc" />
            <stop offset="100%" stopColor="#8b5cf6" />
          </linearGradient>
          {/* Bottom-left facet — deep indigo */}
          <linearGradient id={`${uid}_bl`} x1="0%" y1="0%" x2="40%" y2="100%">
            <stop offset="0%" stopColor="#6366f1" />
            <stop offset="100%" stopColor="#1e1b4b" />
          </linearGradient>
          {/* Bottom-right facet — violet to dark */}
          <linearGradient id={`${uid}_br`} x1="100%" y1="0%" x2="60%" y2="100%">
            <stop offset="0%" stopColor="#7c3aed" />
            <stop offset="100%" stopColor="#0f172a" />
          </linearGradient>
          {/* Shimmer sweep */}
          <linearGradient id={`${uid}_shimmer`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="rgba(255,255,255,0)" />
            <stop offset="45%" stopColor="rgba(255,255,255,0)" />
            <stop offset="50%" stopColor="rgba(255,255,255,0.15)" />
            <stop offset="55%" stopColor="rgba(255,255,255,0)" />
            <stop offset="100%" stopColor="rgba(255,255,255,0)" />
            {!noMotion && (
              <animateTransform
                attributeName="gradientTransform"
                type="translate"
                from="-1 -1"
                to="1 1"
                dur="3.5s"
                repeatCount="indefinite"
              />
            )}
          </linearGradient>
          {/* Glow filter */}
          <filter id={`${uid}_glow`} x="-40%" y="-40%" width="180%" height="180%">
            <feGaussianBlur stdDeviation="6" result="blur" />
            <feFlood floodColor="#38bdf8" floodOpacity="0.3" />
            <feComposite in2="blur" operator="in" />
            <feMerge>
              <feMergeNode />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        <g filter={`url(#${uid}_glow)`}>
          {/* Crown — top left */}
          <polygon points="50,4 8,42 50,52" fill={`url(#${uid}_tl)`} />
          {/* Crown — top right */}
          <polygon points="50,4 50,52 92,42" fill={`url(#${uid}_tr)`} opacity="0.9" />
          {/* Pavilion — bottom left */}
          <polygon points="8,42 50,52 50,113" fill={`url(#${uid}_bl)`} opacity="0.95" />
          {/* Pavilion — bottom right */}
          <polygon points="50,52 92,42 50,113" fill={`url(#${uid}_br)`} />

          {/* Inner facet lines */}
          <line x1="8" y1="42" x2="92" y2="42" stroke="rgba(165,180,252,0.15)" strokeWidth="0.5" />
          <line x1="50" y1="4" x2="50" y2="113" stroke="rgba(165,180,252,0.07)" strokeWidth="0.5" />
          <line x1="8" y1="42" x2="50" y2="52" stroke="rgba(255,255,255,0.08)" strokeWidth="0.5" />
          <line x1="92" y1="42" x2="50" y2="52" stroke="rgba(255,255,255,0.08)" strokeWidth="0.5" />

          {/* Highlight facet — top-left sparkle */}
          <polygon points="50,4 8,42 29,23" fill="rgba(255,255,255,0.14)" />

          {/* Outer stroke */}
          <polygon
            points="50,4 92,42 50,113 8,42"
            fill="none"
            stroke="rgba(165,180,252,0.22)"
            strokeWidth="0.6"
            strokeLinejoin="round"
          />

          {/* Shimmer overlay */}
          <polygon
            points="50,4 92,42 50,113 8,42"
            fill={`url(#${uid}_shimmer)`}
            opacity="0.6"
          />
        </g>
      </motion.svg>
    </div>
  )
}

export function NavGem() {
  const uid = useId().replace(/:/g, '_')

  return (
    <div className="nav-gem-canvas">
      <svg
        width={22}
        height={26}
        viewBox="0 0 100 117"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id={`${uid}_ntl`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#67e8f9" />
            <stop offset="100%" stopColor="#818cf8" />
          </linearGradient>
          <linearGradient id={`${uid}_ntr`} x1="100%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#a5b4fc" />
            <stop offset="100%" stopColor="#8b5cf6" />
          </linearGradient>
          <linearGradient id={`${uid}_nbl`} x1="0%" y1="0%" x2="40%" y2="100%">
            <stop offset="0%" stopColor="#6366f1" />
            <stop offset="100%" stopColor="#1e1b4b" />
          </linearGradient>
          <linearGradient id={`${uid}_nbr`} x1="100%" y1="0%" x2="60%" y2="100%">
            <stop offset="0%" stopColor="#7c3aed" />
            <stop offset="100%" stopColor="#0f172a" />
          </linearGradient>
        </defs>
        <polygon points="50,4 8,42 50,52" fill={`url(#${uid}_ntl)`} />
        <polygon points="50,4 50,52 92,42" fill={`url(#${uid}_ntr)`} opacity="0.9" />
        <polygon points="8,42 50,52 50,113" fill={`url(#${uid}_nbl)`} opacity="0.95" />
        <polygon points="50,52 92,42 50,113" fill={`url(#${uid}_nbr)`} />
        <polygon points="50,4 8,42 29,23" fill="rgba(255,255,255,0.14)" />
        <polygon
          points="50,4 92,42 50,113 8,42"
          fill="none"
          stroke="rgba(165,180,252,0.22)"
          strokeWidth="0.8"
          strokeLinejoin="round"
        />
      </svg>
    </div>
  )
}
