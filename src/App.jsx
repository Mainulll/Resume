import { useState, useEffect, useRef, useId } from 'react'
import { motion, AnimatePresence, useInView, useScroll, useTransform, useMotionValue, useSpring } from 'framer-motion'
import { Analytics } from '@vercel/analytics/react'

const data = {
  name: 'Minul Lokuliyana',
  // Note: place your PDF at /public/resume.pdf for the download button
  resumePdf: '/resume.pdf',
  title: 'Business Analytics & Cybersecurity · Monash University',
  tagline: 'Automation · Perspective · Transformation',
  location: 'Melbourne, VIC',
  contact: {
    email: 'minullokuliyana@hotmail.com',
    mobile: '+61 402 528 040',
    linkedin: 'https://linkedin.com/in/minull',
    github: 'https://github.com/Mainulll',
  },
  summary: `Analytically driven early-career professional with cross-industry experience spanning consumer technology, manufacturing, SaaS, and academic research. Adept at synthesising complex data into structured recommendations, engaging stakeholders at all seniority levels, and delivering measurable impact through a combination of technical rigour and strong interpersonal skills. Targeting graduate roles in consulting, strategy, and analytics.`,
  message: `Across five industries, I've transformed complex operational challenges into structured insights, automation solutions, and stakeholder-aligned recommendations that deliver measurable commercial impact.`,
  industries: [
    'Consumer Technology',
    'Power & Manufacturing',
    'Academic Research',
    'SaaS & Software',
    'Digital Strategy',
  ],
  experience: [
    {
      role: 'Supply Chain Planner',
      company: 'BSH Home Appliances Australia',
      period: 'Jan 2026 – Present',
      location: 'Clayton, VIC (Hybrid)',
      highlights: [
        'Developed Power BI reporting frameworks surfacing supply chain KPIs across procurement and sales, enabling faster, data-driven decision-making',
        'Engineered Excel/VBA automation tools to eliminate manual reporting workflows, improving data accuracy and reducing operational cycle time',
        'Manage national inventory allocation across key accounts in SAP, proactively identifying and escalating supply risks to minimise commercial disruption',
        'Collaborate daily with Sales, Customer Service, and Operations stakeholders to align inventory strategy with commercial priorities — recognised for clear, persuasive communication across functions',
        'Structure cost-benefit analyses and business cases to support procurement decisions and resource allocation recommendations',
      ],
    },
    {
      role: 'Procurement & Supply Chain Project Coordinator',
      company: 'Cummins Asia Pacific',
      period: 'Jan 2025 – Jan 2026',
      location: 'Melbourne, VIC (Hybrid)',
      highlights: [
        'Developed Python automation tools to eliminate manual workflow inefficiencies across engineering, supply chain, and commercial functions in a complex metal fabrication and electrical sub-assembly manufacturing environment',
        'Designed Power BI dashboards and Excel/VBA reporting infrastructure to improve data quality and operational visibility for APAC procurement operations',
        'Led end-to-end RFQ processes across APAC, managing supplier engagement, capability evaluation, and commercial negotiation — praised by senior leadership for professionalism and stakeholder management',
        'Identified and delivered cost-reduction and supply-continuity initiatives through structured data analysis and supplier performance benchmarking',
      ],
    },
    {
      role: 'Research Assistant',
      company: 'Monash University VARS Lab',
      period: 'Jun 2024 – Dec 2024',
      location: 'Melbourne, VIC (Hybrid)',
      highlights: [
        'Designed Python data pipelines to process and segment large-scale behavioural datasets, enabling rigorous quantitative analysis for academic research',
        'Synthesised findings into structured analytical reports and visualisations to support evidence-based research outcomes',
        'Developed reusable analytical frameworks and process documentation to improve team efficiency and knowledge transfer',
      ],
    },
    {
      role: 'Technical Support Analyst',
      company: "You'reOnTime",
      period: 'Feb 2023 – May 2024',
      location: 'Remote',
      highlights: [
        'Managed client onboarding and digital campaign coordination for a cloud-based SaaS platform, consistently receiving commendations for responsiveness and client empathy',
        'Analysed customer usage patterns and campaign performance data to identify trends and surface actionable insights for product and marketing strategy',
        'Delivered data migration, QA testing, and SEO optimisation to improve platform stability, data integrity, and organic search performance',
      ],
    },
    {
      role: 'Project Manager',
      company: 'Borealis Creative Group',
      period: 'Dec 2021 – Dec 2022',
      location: 'Freelance',
      highlights: [
        'Led end-to-end design and deployment of custom websites for franchise clients across diverse industries, managing competing stakeholder requirements and delivering to scope and timeline',
        'Managed digital software ecosystems for concurrent client engagements, demonstrating strong organisation and attention to detail under pressure',
        'Initiated and cultivated B2B client relationships through strong interpersonal and commercial communication, securing new engagements and driving client revenue growth',
      ],
    },
  ],
  projects: [
    {
      name: 'Previa',
      subtitle: 'AI Financial Intelligence Platform',
      period: '2025 – Present',
      description: 'Co-founded and built Previa, a full-stack AI-driven financial intelligence platform automating receipt reconciliation, bank statement processing, and transaction matching — reducing manual accounting overhead and unlocking real-time cash flow visibility for SME finance teams.',
      tech: 'React 18, TypeScript, Vite, Chakra UI, Supabase, Python, LLMs (Mistral, Gemini, GPT-4o), n8n, AG-Grid',
      link: 'https://github.com/demigod97/Previa-2.0',
      linkLabel: 'View on GitHub',
    },
    {
      name: 'Borealis Creative Group',
      subtitle: 'Digital Strategy & Web Projects',
      period: 'Dec 2021 – Dec 2022',
      description: 'Directed digital strategy, custom web development, and content campaigns across multiple franchise clients — delivering measurable improvements in organic reach, client engagement, and brand consistency.',
      tech: 'Figma, Web design, SEO, Analytics',
      link: 'https://docs.google.com/document/d/1s_JRAy8o3LNFfrVgoeCC3s_PzByHTtMg6zqxtgM6BxU/edit?tab=t.0',
      linkLabel: 'View Figma Demos',
    },
  ],
  education: {
    degree: 'Bachelor of Information Technology / Bachelor of Commerce (Dual Degree)',
    institution: 'Monash University',
    period: 'Jul 2022 – Nov 2026 (Expected)',
    majors: 'Business Analytics · Cybersecurity & Network Security',
    highlights: [
      'Innovation for Impact Award (2024) — Competitive university-wide award for designing a responsible AI solution with measurable commercial and sustainability outcomes; evaluated on real-world applicability, technical rigour, and societal impact',
      'Global Immersion Guarantee — Fiji — Selected for an international consulting-style engagement; led a cross-cultural team through structured problem-solving to develop implementable waste-management solutions aligned with UN SDG frameworks',
      'Monash Innovation Guarantee × Microsoft — One of a select cohort chosen to partner directly with Microsoft; applied structured innovation and design-thinking methodology to prototype AI-driven student experience solutions at scale',
    ],
  },
  certifications: [
    'Certified Procurement Professional (CPP) — Cummins',
    'IQTM Yellow Belt (Lean Six Sigma) — Cummins',
    'Six Sigma Foundations — Skillsoft',
  ],
  openTo: 'Open to Graduate Consulting, Strategy and Analyst Roles',
  sectionSubtext: {
    experience: 'Five industries. One consistent thread: turning complexity into clarity.',
    projects: 'Building solutions that bridge technical depth with business outcomes.',
    skills: 'The capabilities that underpin structured problem-solving and delivery.',
  },
  skillPillars: [
    {
      title: 'Automation',
      subtitle: 'Data-driven efficiency',
      items: ['Python', 'Power BI', 'Excel / VBA', 'SQL', 'Data Pipelines', 'SAP'],
    },
    {
      title: 'Perspective',
      subtitle: 'People & communication',
      items: ['Senior Stakeholder Management', 'Cross-industry Adaptability', 'Executive Communication', 'Client Engagement'],
    },
    {
      title: 'Transformation',
      subtitle: 'Impact at scale',
      items: ['Process Optimisation', 'Business Case Development', 'Strategic Analysis', 'Responsible AI'],
    },
  ],
}

const ease = [0.22, 1, 0.36, 1]
const fadeUp = { initial: { opacity: 0, y: 28 }, animate: { opacity: 1, y: 0 } }
const stagger = { animate: { transition: { staggerChildren: 0.07, delayChildren: 0.05 } } }

const NAV_LINKS = [
  { label: 'Experience', href: '#experience' },
  { label: 'Skills', href: '#skills' },
  { label: 'Projects', href: '#projects' },
  { label: 'Education', href: '#education' },
  { label: 'Contact', href: '#contact' },
]

/* ── Dot Grid Background ─────────────────────────────────────────────────
   Canvas-based interactive dot grid. Mouse proximity displaces dots
   outward and brightens them. On touch devices renders static dots only.
   Uses dist² comparison (no sqrt) for the base-dot pass — fast.
─────────────────────────────────────────────────────────────────────── */
function DotGrid() {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')

    const SPACING   = 26      // px between dot centres
    const BASE_R    = 0.85    // base dot radius (px)
    const INFLUENCE = 150     // mouse influence radius (px)
    const INF2      = INFLUENCE * INFLUENCE
    const MAX_PUSH  = 14      // max displacement (px)
    const LERP      = 0.07    // mouse smoothing (0 = no follow, 1 = instant)
    const isTouch   = !window.matchMedia('(hover: hover)').matches

    let W, H, cols, rows, raf
    const mouse  = { x: -9999, y: -9999 }
    const smooth = { x: -9999, y: -9999 }

    const resize = () => {
      W = canvas.width  = window.innerWidth
      H = canvas.height = window.innerHeight
      cols = Math.ceil(W / SPACING) + 2
      rows = Math.ceil(H / SPACING) + 2
    }

    const draw = () => {
      smooth.x += (mouse.x - smooth.x) * LERP
      smooth.y += (mouse.y - smooth.y) * LERP
      ctx.clearRect(0, 0, W, H)

      /* Pass 1 — base dots outside influence zone (single path → single fill) */
      ctx.beginPath()
      ctx.fillStyle = 'rgba(165, 168, 255, 0.13)'
      for (let i = 0; i < cols; i++) {
        for (let j = 0; j < rows; j++) {
          const bx = i * SPACING
          const by = j * SPACING
          const dx = bx - smooth.x
          const dy = by - smooth.y
          if (isTouch || dx * dx + dy * dy >= INF2) {
            ctx.moveTo(bx + BASE_R, by)
            ctx.arc(bx, by, BASE_R, 0, Math.PI * 2)
          }
        }
      }
      ctx.fill()

      /* Pass 2 — influenced dots (displaced + brightened), bounding-box bounded */
      if (!isTouch) {
        const minI = Math.max(0, Math.floor((smooth.x - INFLUENCE) / SPACING))
        const maxI = Math.min(cols - 1, Math.ceil((smooth.x + INFLUENCE) / SPACING))
        const minJ = Math.max(0, Math.floor((smooth.y - INFLUENCE) / SPACING))
        const maxJ = Math.min(rows - 1, Math.ceil((smooth.y + INFLUENCE) / SPACING))

        for (let i = minI; i <= maxI; i++) {
          for (let j = minJ; j <= maxJ; j++) {
            const bx = i * SPACING
            const by = j * SPACING
            const dx = bx - smooth.x
            const dy = by - smooth.y
            const dist2 = dx * dx + dy * dy
            if (dist2 < INF2) {
              const dist  = Math.sqrt(dist2)
              const ratio = 1 - dist / INFLUENCE
              const force = ratio * ratio * MAX_PUSH
              const angle = Math.atan2(dy, dx)
              const px    = bx + Math.cos(angle) * force
              const py    = by + Math.sin(angle) * force
              const alpha = (0.13 + ratio * 0.52).toFixed(2)
              const r     = BASE_R + ratio * 0.5
              ctx.beginPath()
              ctx.arc(px, py, r, 0, Math.PI * 2)
              ctx.fillStyle = `rgba(165, 168, 255, ${alpha})`
              ctx.fill()
            }
          }
        }
      }

      raf = requestAnimationFrame(draw)
    }

    const onMove = e => { mouse.x = e.clientX; mouse.y = e.clientY }

    // Pause rAF when tab is hidden — saves CPU/battery
    const onVisible = () => {
      if (document.hidden) { cancelAnimationFrame(raf); raf = null }
      else if (!raf) draw()
    }

    const noMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    resize()
    if (noMotion) {
      // Static single frame — no animation loop
      ctx.beginPath()
      ctx.fillStyle = 'rgba(165, 168, 255, 0.13)'
      for (let i = 0; i < cols; i++) {
        for (let j = 0; j < rows; j++) {
          ctx.moveTo(i * SPACING + BASE_R, j * SPACING)
          ctx.arc(i * SPACING, j * SPACING, BASE_R, 0, Math.PI * 2)
        }
      }
      ctx.fill()
    } else {
      draw()
    }

    window.addEventListener('resize', resize, { passive: true })
    if (!isTouch) window.addEventListener('mousemove', onMove, { passive: true })
    document.addEventListener('visibilitychange', onVisible)

    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', resize)
      if (!isTouch) window.removeEventListener('mousemove', onMove)
      document.removeEventListener('visibilitychange', onVisible)
    }
  }, [])

  return <canvas ref={canvasRef} className="dot-grid" aria-hidden="true" />
}

/* ── Logo Mark ───────────────────────────────────────────────────────────
   SVG diamond gem — four-facet design in indigo/violet palette.
   useId() scopes gradient IDs per instance (avoids SVG ID collisions).
─────────────────────────────────────────────────────────────────────── */
function LogoMark({ size = 60, float = false, className = '' }) {
  const uid = useId().replace(/:/g, '_')
  const noMotion = typeof window !== 'undefined' && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
  const shouldFloat = float && !noMotion

  return (
    <motion.svg
      className={`logo-mark${className ? ` ${className}` : ''}`}
      width={size}
      height={Math.round(size * 1.17)}
      viewBox="0 0 48 56"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      animate={shouldFloat ? { y: [0, -5, 0] } : undefined}
      transition={shouldFloat ? { duration: 3.8, repeat: Infinity, ease: 'easeInOut' } : undefined}
    >
      <defs>
        <linearGradient id={`${uid}a`} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#c4b5fd" />
          <stop offset="100%" stopColor="#818cf8" />
        </linearGradient>
        <linearGradient id={`${uid}b`} x1="100%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#a5b4fc" />
          <stop offset="100%" stopColor="#6366f1" />
        </linearGradient>
        <linearGradient id={`${uid}c`} x1="0%" y1="0%" x2="30%" y2="100%">
          <stop offset="0%" stopColor="#6366f1" />
          <stop offset="100%" stopColor="#3730a3" />
        </linearGradient>
        <linearGradient id={`${uid}d`} x1="100%" y1="0%" x2="70%" y2="100%">
          <stop offset="0%" stopColor="#7c3aed" />
          <stop offset="100%" stopColor="#1e1b4b" />
        </linearGradient>
      </defs>
      <polygon points="24,2 4,22 24,27"  fill={`url(#${uid}a)`} />
      <polygon points="24,2 24,27 44,22" fill={`url(#${uid}b)`} opacity="0.88" />
      <polygon points="4,22 24,27 24,54"  fill={`url(#${uid}c)`} opacity="0.94" />
      <polygon points="24,27 44,22 24,54" fill={`url(#${uid}d)`} />
      <polygon points="24,2 44,22 24,54 4,22" fill="none" stroke="rgba(165,180,252,0.28)" strokeWidth="0.6" strokeLinejoin="round" />
      <line x1="4" y1="22" x2="44" y2="22" stroke="rgba(165,180,252,0.16)" strokeWidth="0.5" />
      <line x1="24" y1="2" x2="24" y2="54" stroke="rgba(165,180,252,0.07)" strokeWidth="0.5" />
      <line x1="4" y1="22" x2="24" y2="27" stroke="rgba(255,255,255,0.06)" strokeWidth="0.5" />
      <line x1="44" y1="22" x2="24" y2="27" stroke="rgba(255,255,255,0.06)" strokeWidth="0.5" />
      <polygon points="24,2 4,22 14,12" fill="rgba(255,255,255,0.14)" />
    </motion.svg>
  )
}

/* ── Navbar ──────────────────────────────────────────────────────────── */
function Navbar() {
  const [active, setActive] = useState('')
  const [mobileOpen, setMobileOpen] = useState(false)
  const [visible, setVisible] = useState(false)
  const menuRef = useRef(null)
  const fabRef  = useRef(null)

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 80)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    const obs = new IntersectionObserver(
      entries => entries.forEach(e => { if (e.isIntersecting) setActive(e.target.id) }),
      { rootMargin: '-35% 0px -60% 0px' }
    )
    document.querySelectorAll('section[id]').forEach(s => obs.observe(s))
    return () => obs.disconnect()
  }, [])

  useEffect(() => {
    if (!mobileOpen) return
    const handler = e => {
      if (menuRef.current?.contains(e.target) || fabRef.current?.contains(e.target)) return
      setMobileOpen(false)
    }
    document.addEventListener('pointerdown', handler)
    return () => document.removeEventListener('pointerdown', handler)
  }, [mobileOpen])

  const scrollTo = (e, href) => {
    e.preventDefault()
    document.querySelector(href)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    setMobileOpen(false)
  }

  return (
    <AnimatePresence>
      {visible && (
        <>
          <motion.nav
            className="site-nav"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.32, ease }}
            aria-label="Page navigation"
          >
            <div className="site-nav-pill">
              {NAV_LINKS.map(l => (
                <a key={l.label} href={l.href} onClick={e => scrollTo(e, l.href)}
                  className={`nav-link${active === l.href.slice(1) ? ' nav-active' : ''}`}>
                  {l.label}
                </a>
              ))}
            </div>
          </motion.nav>

          <motion.button ref={fabRef} className="nav-fab"
            aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
            onClick={() => setMobileOpen(v => !v)}
            initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }} whileTap={{ scale: 0.9 }}
            transition={{ duration: 0.25, ease }}
          >
            <svg width="17" height="17" viewBox="0 0 17 17" fill="none" aria-hidden="true">
              {mobileOpen ? (
                <>
                  <line x1="3" y1="3" x2="14" y2="14" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
                  <line x1="14" y1="3" x2="3" y2="14" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
                </>
              ) : (
                <>
                  <line x1="3" y1="4.5" x2="14" y2="4.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
                  <line x1="3" y1="8.5" x2="14" y2="8.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
                  <line x1="3" y1="12.5" x2="14" y2="12.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
                </>
              )}
            </svg>
          </motion.button>

          <AnimatePresence>
            {mobileOpen && (
              <motion.div ref={menuRef} className="nav-mobile-menu"
                initial={{ opacity: 0, y: 10, scale: 0.96 }} animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.96 }} transition={{ duration: 0.2, ease }}
              >
                {NAV_LINKS.map(l => (
                  <a key={l.label} href={l.href} onClick={e => scrollTo(e, l.href)}
                    className={`nav-mobile-link${active === l.href.slice(1) ? ' nav-active' : ''}`}>
                    <span>{l.label}</span>
                    <span className="nav-arrow">›</span>
                  </a>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </>
      )}
    </AnimatePresence>
  )
}

/* ── Loading Screen ──────────────────────────────────────────────────── */
function LoadingScreen() {
  return (
    <motion.div className="loading-screen"
      exit={{ opacity: 0, transition: { duration: 0.55, ease } }}
    >
      {/* Gem — blurs / scales on exit, name is intentionally outside */}
      <motion.div className="loading-inner"
        initial={{ opacity: 0, scale: 0.88, y: 12 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 1.08, filter: 'blur(16px)', transition: { duration: 0.45, ease } }}
        transition={{ duration: 0.7, ease }}
      >
        <div className="loading-gem-wrap">
          <LogoMark size={88} float />
        </div>
      </motion.div>

      {/* Name — sits between gem and tagline; layoutId transitions it to hero on exit */}
      <motion.p className="loading-name"
        layoutId="ml-name"
        initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.55, duration: 0.65, ease }}
      >
        {data.name}
      </motion.p>

      {/* Tagline — fades + blurs separately */}
      <motion.p className="loading-sub"
        initial={{ opacity: 0 }} animate={{ opacity: 1 }}
        exit={{ opacity: 0, y: -6, filter: 'blur(6px)', transition: { duration: 0.3 } }}
        transition={{ delay: 0.85, duration: 0.55 }}
      >
        {data.tagline}
      </motion.p>
    </motion.div>
  )
}


/* ── Cursor Glow ─────────────────────────────────────────────────────── */
function CursorGlow() {
  const x = useMotionValue(-300); const y = useMotionValue(-300)
  const xS = useSpring(x, { damping: 28, stiffness: 180 })
  const yS = useSpring(y, { damping: 28, stiffness: 180 })
  useEffect(() => {
    const move = e => { x.set(e.clientX); y.set(e.clientY) }
    globalThis.addEventListener('mousemove', move)
    return () => globalThis.removeEventListener('mousemove', move)
  }, [x, y])
  return <motion.div className="cursor-glow" style={{ left: xS, top: yS, x: '-50%', y: '-50%' }} />
}

/* ── Section ─────────────────────────────────────────────────────────── */
function Section({ children, className = '', id }) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-60px' })
  return (
    <motion.section ref={ref} id={id}
      initial={{ opacity: 0, y: 24 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, ease }}
      className={className}
    >
      {children}
    </motion.section>
  )
}

/* ── Section Label ───────────────────────────────────────────────────── */
function SectionLabel({ children }) {
  return (
    <div className="section-label-wrap">
      <span className="section-label">{children}</span>
    </div>
  )
}

/* ── Icons ───────────────────────────────────────────────────────────── */
function IconDownload() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
      <path d="M7 1v8M4 6l3 3 3-3M2 11h10" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}
function IconPhone() {
  return (
    <svg width="13" height="13" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path d="M2 1.5h3.5l1.5 3.5-2 1.2a9 9 0 004.3 4.3l1.2-2L14 10v3.5a1.5 1.5 0 01-1.5 1.5A13.5 13.5 0 01.5 3 1.5 1.5 0 012 1.5z" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round" />
    </svg>
  )
}
function IconMail() {
  return (
    <svg width="13" height="13" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <rect x="1" y="3" width="14" height="10" rx="2" stroke="currentColor" strokeWidth="1.3" />
      <path d="M1 5.5l7 4.5 7-4.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
    </svg>
  )
}

/* ── App ─────────────────────────────────────────────────────────────── */
function App() {
  const [loaded, setLoaded] = useState(false)
  const [contactExpanded, setContactExpanded] = useState(false)
  const containerRef   = useRef(null)
  const contactWrapRef = useRef(null)
  const { scrollYProgress } = useScroll({ target: containerRef, offset: ['start start', 'end end'] })
  const heroScale   = useTransform(scrollYProgress, [0, 0.12], [1, 0.94])
  const heroOpacity = useTransform(scrollYProgress, [0, 0.1], [1, 0])
  const parallaxY   = useTransform(scrollYProgress, [0, 0.25], [0, 60])

  useEffect(() => {
    const t = setTimeout(() => setLoaded(true), 2400)
    return () => clearTimeout(t)
  }, [])

  // Collapse contact split when clicking outside
  useEffect(() => {
    if (!contactExpanded) return
    const handler = e => {
      if (!contactWrapRef.current?.contains(e.target)) setContactExpanded(false)
    }
    document.addEventListener('pointerdown', handler)
    return () => document.removeEventListener('pointerdown', handler)
  }, [contactExpanded])

  return (
    <>
      <AnimatePresence>
        {!loaded && <LoadingScreen key="loader" />}
      </AnimatePresence>

      <div ref={containerRef} className="app">

        <DotGrid />
        <motion.div className="scroll-progress" style={{ scaleX: scrollYProgress }} />
        <CursorGlow />
        <Navbar />

        {/* Open-to banner */}
        <motion.a href={`mailto:${data.contact.email}`} className="open-banner"
          initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
        >
          <span className="banner-dot" />
          {data.openTo}
        </motion.a>

        {/* ── Hero ──────────────────────────────────────────────────────── */}
        <motion.header style={{ scale: heroScale, opacity: heroOpacity }} className="hero">
          <div className="hero-orb orb-1" />
          <div className="hero-orb orb-2" />
          <div className="hero-orb orb-3" />

          <motion.div style={{ y: parallaxY }} className="hero-content">

            <motion.p initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.6 }} className="hero-eyebrow">
              {data.location}
            </motion.p>

            {/* Name: invisible placeholder during loading; motion.h1 with layoutId after — framer-motion
                transitions it from its loading-screen position to here */}
            {loaded
              ? <motion.h1 className="hero-name" layoutId="ml-name" initial={false}
                  transition={{ type: 'spring', stiffness: 72, damping: 18, mass: 1.1 }}>{data.name}</motion.h1>
              : <h1 className="hero-name" style={{ opacity: 0 }} aria-hidden="true">{data.name}</h1>
            }

            <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 2.7, duration: 0.6 }} className="hero-role-pill">
              {data.title}
            </motion.div>

            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              transition={{ delay: 3.0 }} className="hero-summary">
              {data.message}
            </motion.p>

            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              transition={{ delay: 3.15 }} className="hero-industries">
              {data.industries.map(ind => (
                <span key={ind} className="industry-tag">{ind}</span>
              ))}
            </motion.div>

            {/* Primary CTAs */}
            <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 3.25, duration: 0.5 }} className="hero-cta-row">
              <motion.a
                layout
                href={data.resumePdf}
                download="Minul_Lokuliyana_Resume.pdf"
                className="cta-primary"
                whileHover={{ scale: 1.04, y: -2 }}
                whileTap={{ scale: 0.97 }}
                transition={{ type: 'spring', stiffness: 380, damping: 20 }}
              >
                <IconDownload />
                Download Resume
              </motion.a>

              {/* Contact Me — splits into Mobile + Email on click */}
              <div ref={contactWrapRef} className="contact-wrap">
                <AnimatePresence mode="wait">
                  {!contactExpanded ? (
                    <motion.button
                      key="contact-closed"
                      className="cta-secondary"
                      onClick={() => setContactExpanded(true)}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0, scale: 0.88, transition: { duration: 0.14 } }}
                      whileHover={{ scale: 1.04, y: -2 }}
                      whileTap={{ scale: 0.96 }}
                      transition={{ type: 'spring', stiffness: 380, damping: 20 }}
                    >
                      Contact Me
                    </motion.button>
                  ) : (
                    <motion.div
                      key="contact-open"
                      className="contact-split"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0, transition: { duration: 0.12 } }}
                    >
                      <motion.a
                        href={`tel:${data.contact.mobile}`}
                        className="contact-option"
                        initial={{ opacity: 0, x: -12, scale: 0.88 }}
                        animate={{ opacity: 1, x: 0, scale: 1 }}
                        transition={{ type: 'spring', stiffness: 400, damping: 24 }}
                        whileHover={{ scale: 1.06, y: -2 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <IconPhone /> Mobile
                      </motion.a>
                      <motion.a
                        href={`mailto:${data.contact.email}`}
                        className="contact-option"
                        initial={{ opacity: 0, x: 12, scale: 0.88 }}
                        animate={{ opacity: 1, x: 0, scale: 1 }}
                        transition={{ type: 'spring', stiffness: 400, damping: 24, delay: 0.06 }}
                        whileHover={{ scale: 1.06, y: -2 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <IconMail /> Email
                      </motion.a>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>

            {/* Secondary links */}
            <motion.nav initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              transition={{ delay: 3.4 }} className="hero-nav">
              {[
                { label: 'LinkedIn', href: data.contact.linkedin, external: true },
                { label: 'GitHub',   href: data.contact.github,   external: true },
                { label: 'Email',    href: `mailto:${data.contact.email}`, external: false },
              ].map(item => (
                <motion.a key={item.label} href={item.href}
                  target={item.external ? '_blank' : undefined}
                  rel={item.external ? 'noopener noreferrer' : undefined}
                  className="glass-btn"
                  whileHover={{ scale: 1.05, y: -2 }} whileTap={{ scale: 0.97 }}
                  transition={{ type: 'spring', stiffness: 380, damping: 20 }}
                >
                  {item.label}
                </motion.a>
              ))}
            </motion.nav>

            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              transition={{ delay: 3.6 }} className="scroll-hint">
              <motion.div className="scroll-line"
                animate={{ scaleY: [0.4, 1, 0.4] }}
                transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }} />
              Scroll to explore
            </motion.div>

          </motion.div>
        </motion.header>

        {/* ── Experience ────────────────────────────────────────────────── */}
        <Section className="section" id="experience">
          <SectionLabel>Career</SectionLabel>
          <motion.h2 variants={fadeUp} initial="initial" whileInView="animate" viewport={{ once: true }} className="section-title">
            Experience
          </motion.h2>
          <motion.p variants={fadeUp} initial="initial" whileInView="animate" viewport={{ once: true }} className="section-sub">
            {data.sectionSubtext.experience}
          </motion.p>
          <div className="timeline">
            {data.experience.map((exp, i) => (
              <motion.div key={exp.company} variants={fadeUp} initial="initial" whileInView="animate"
                viewport={{ once: true }} transition={{ delay: i * 0.07, duration: 0.6, ease }}
                className="timeline-item">
                <div className="timeline-dot" />
                <motion.div className="glass-card exp-card"
                  whileHover={{ y: -3, borderColor: 'rgba(129,140,248,0.28)' }}
                  transition={{ duration: 0.22 }}>
                  <div className="exp-top">
                    <div>
                      <div className="exp-role">{exp.role}</div>
                      <div className="exp-company">{exp.company}</div>
                    </div>
                    <div className="exp-meta">
                      <span className="exp-period">{exp.period}</span>
                      <span className="exp-location">{exp.location}</span>
                    </div>
                  </div>
                  <ul className="bullet-list">
                    {exp.highlights.map(h => <li key={h}>{h}</li>)}
                  </ul>
                </motion.div>
              </motion.div>
            ))}
          </div>
        </Section>

        {/* ── Skills ────────────────────────────────────────────────────── */}
        <Section className="section pillars-section" id="skills">
          <SectionLabel>Skills</SectionLabel>
          <motion.h2 variants={fadeUp} initial="initial" whileInView="animate" viewport={{ once: true }} className="section-title">
            Automation · Perspective · Transformation
          </motion.h2>
          <motion.p variants={fadeUp} initial="initial" whileInView="animate" viewport={{ once: true }} className="section-sub">
            {data.sectionSubtext.skills}
          </motion.p>
          <motion.div variants={stagger} initial="initial" whileInView="animate" viewport={{ once: true }} className="pillars-grid">
            {data.skillPillars.map((pillar, i) => (
              <motion.div key={pillar.title} variants={fadeUp}
                className="glass-card pillar-card"
                whileHover={{ scale: 1.025, y: -5 }}
                transition={{ type: 'spring', stiffness: 280, damping: 22 }}>
                <div className="pillar-num">0{i + 1}</div>
                <h4 className="pillar-title">{pillar.title}</h4>
                <p className="pillar-sub">{pillar.subtitle}</p>
                <div className="tag-row">
                  {pillar.items.map(item => <span key={item} className="tag">{item}</span>)}
                </div>
              </motion.div>
            ))}
          </motion.div>
        </Section>

        {/* ── Projects ──────────────────────────────────────────────────── */}
        <Section className="section" id="projects">
          <SectionLabel>Work</SectionLabel>
          <motion.h2 variants={fadeUp} initial="initial" whileInView="animate" viewport={{ once: true }} className="section-title">
            Projects
          </motion.h2>
          <motion.p variants={fadeUp} initial="initial" whileInView="animate" viewport={{ once: true }} className="section-sub">
            {data.sectionSubtext.projects}
          </motion.p>
          <motion.div variants={stagger} initial="initial" whileInView="animate" viewport={{ once: true }} className="projects-grid">
            {data.projects.map(proj => (
              <motion.div key={proj.name} variants={fadeUp}
                className="glass-card project-card"
                whileHover={{ y: -6 }} transition={{ duration: 0.25 }}>
                <div className="project-period">{proj.period}</div>
                <h4 className="project-name">{proj.name}</h4>
                <p className="project-subtitle">{proj.subtitle}</p>
                <p className="project-desc">{proj.description}</p>
                <p className="project-tech">{proj.tech}</p>
                {proj.link && (
                  <motion.a href={proj.link} className="project-link"
                    target="_blank" rel="noopener noreferrer" whileHover={{ x: 4 }}>
                    {proj.linkLabel || 'View project'} →
                  </motion.a>
                )}
              </motion.div>
            ))}
          </motion.div>
        </Section>

        {/* ── Education ─────────────────────────────────────────────────── */}
        <Section className="section" id="education">
          <SectionLabel>Study</SectionLabel>
          <motion.h2 variants={fadeUp} initial="initial" whileInView="animate" viewport={{ once: true }} className="section-title">
            Education
          </motion.h2>
          <motion.div variants={fadeUp} initial="initial" whileInView="animate" viewport={{ once: true }}
            className="glass-card edu-card">
            <h4 className="edu-degree">{data.education.degree}</h4>
            <p className="edu-institution">{data.education.institution}</p>
            <p className="edu-majors">{data.education.majors}</p>
            <p className="edu-period">{data.education.period}</p>
            <ul className="bullet-list">
              {data.education.highlights.map(h => <li key={h}>{h}</li>)}
            </ul>
          </motion.div>
        </Section>

        {/* ── Certifications ────────────────────────────────────────────── */}
        <Section className="section">
          <SectionLabel>Credentials</SectionLabel>
          <motion.h2 variants={fadeUp} initial="initial" whileInView="animate" viewport={{ once: true }} className="section-title">
            Certifications
          </motion.h2>
          <motion.div variants={stagger} initial="initial" whileInView="animate" viewport={{ once: true }} className="certs-row">
            {data.certifications.map(cert => (
              <motion.span key={cert} variants={fadeUp} className="cert-pill"
                whileHover={{ scale: 1.03, borderColor: 'rgba(129,140,248,0.35)' }}>
                {cert}
              </motion.span>
            ))}
          </motion.div>
        </Section>

        {/* ── Footer / Contact ──────────────────────────────────────────── */}
        <footer className="footer" id="contact">
          <div className="footer-glass">
            <div className="footer-logo">
              <LogoMark size={26} />
              <span className="footer-logo-name">Minul Lokuliyana</span>
            </div>
            <p className="footer-quote">Always bringing the perspective.</p>
            <div className="footer-cta-row">
              <a href={data.resumePdf} download="Minul_Lokuliyana_Resume.pdf" className="footer-download">
                <IconDownload /> Download Resume
              </a>
            </div>
            <nav className="footer-nav">
              <a href={data.contact.linkedin} target="_blank" rel="noopener noreferrer">LinkedIn</a>
              <a href={data.contact.github}   target="_blank" rel="noopener noreferrer">GitHub</a>
              <a href={`mailto:${data.contact.email}`}>Email</a>
            </nav>
            <p className="footer-contact">{data.contact.mobile} · {data.contact.email}</p>
          </div>
        </footer>

        <style>{`
          /* ── Global ──────────────────────────────────────────────── */
          html { scroll-padding-top: 56px; scrollbar-gutter: stable; }

          /* ── Base ────────────────────────────────────────────────── */
          .app {
            position: relative; min-height: 100vh;
            background:
              radial-gradient(ellipse 100% 60% at 50% -8%, rgba(99,102,241,0.22) 0%, transparent 62%),
              radial-gradient(ellipse 60% 45% at 88% 72%, rgba(139,92,246,0.13) 0%, transparent 55%),
              radial-gradient(ellipse 50% 35% at 12% 58%, rgba(79,70,229,0.09) 0%, transparent 50%),
              #06060f;
            color: #e4e4f0;
          }

          /* ── Dot Grid ────────────────────────────────────────────── */
          .dot-grid {
            position: fixed; inset: 0;
            width: 100%; height: 100%;
            pointer-events: none; z-index: 0;
          }

          /* ── Logo Mark ───────────────────────────────────────────── */
          .logo-mark { display: block; }

          /* ── Loading Screen ──────────────────────────────────────── */
          .loading-screen {
            position: fixed; inset: 0; z-index: 9999;
            display: flex; flex-direction: column; align-items: center; justify-content: center;
            gap: 0.55rem;
            background: #06060f;
          }
          .loading-inner { display: flex; flex-direction: column; align-items: center; margin-bottom: 0.1rem; }
          .loading-gem-wrap {
            position: relative; display: inline-flex; align-items: center; justify-content: center;
            filter: drop-shadow(0 4px 20px rgba(99,102,241,0.42)) drop-shadow(0 0 44px rgba(129,140,248,0.2));
          }
          .loading-name { font-size: 1.12rem; font-weight: 600; letter-spacing: -0.02em; color: rgba(228,228,245,0.88); }
          .loading-sub { font-size: 0.71rem; font-weight: 500; letter-spacing: 0.13em; text-transform: uppercase; color: rgba(129,140,248,0.44); }

          /* ── Navbar — desktop pill ───────────────────────────────── */
          /* Full-width track; justify-content centres the pill regardless of scrollbar gutter */
          .site-nav {
            position: fixed; top: 48px; left: 0; right: 0;
            display: flex; justify-content: center;
            pointer-events: none; z-index: 150;
          }
          .site-nav-pill {
            display: flex; gap: 0.1rem; padding: 0.3rem;
            pointer-events: auto; white-space: nowrap;
            background: rgba(6,6,18,0.8);
            backdrop-filter: blur(20px) saturate(160%); -webkit-backdrop-filter: blur(20px) saturate(160%);
            border: 0.5px solid rgba(255,255,255,0.08); border-radius: 100px;
            box-shadow: 0 1px 0 rgba(255,255,255,0.06) inset, 0 8px 24px rgba(0,0,0,0.3);
          }
          .nav-link { padding: 0.38rem 0.88rem; border-radius: 100px; font-size: 0.77rem; font-weight: 500; color: rgba(170,174,228,0.5); text-decoration: none; transition: color 0.18s, background 0.18s; }
          .nav-link:hover { color: rgba(200,202,255,0.86); background: rgba(255,255,255,0.05); }
          .nav-link.nav-active { background: rgba(99,102,241,0.15); color: rgba(165,168,255,0.92); }
          @media (max-width: 639px) { .site-nav { display: none; } }

          /* ── Navbar — mobile FAB ─────────────────────────────────── */
          .nav-fab {
            position: fixed; bottom: 24px; right: 20px;
            width: 46px; height: 46px; border-radius: 50%;
            background: rgba(10,10,22,0.9);
            backdrop-filter: blur(16px); -webkit-backdrop-filter: blur(16px);
            border: 0.5px solid rgba(99,102,241,0.26);
            color: rgba(165,168,255,0.84); display: flex; align-items: center; justify-content: center;
            cursor: pointer; z-index: 150;
            box-shadow: 0 4px 16px rgba(0,0,0,0.4), 0 0 0 1px rgba(99,102,241,0.08);
            transition: background 0.2s, border-color 0.2s;
          }
          .nav-fab:hover { background: rgba(20,18,50,0.95); border-color: rgba(99,102,241,0.4); }
          @media (min-width: 640px) { .nav-fab { display: none; } }

          /* ── Navbar — mobile dropdown ────────────────────────────── */
          .nav-mobile-menu {
            position: fixed; bottom: 80px; right: 16px; width: 192px;
            background: rgba(8,8,20,0.94);
            backdrop-filter: blur(24px); -webkit-backdrop-filter: blur(24px);
            border: 0.5px solid rgba(255,255,255,0.09); border-radius: 16px;
            padding: 0.45rem; z-index: 149;
            box-shadow: 0 1px 0 rgba(255,255,255,0.07) inset, 0 16px 40px rgba(0,0,0,0.46);
          }
          .nav-mobile-link { display: flex; align-items: center; justify-content: space-between; padding: 0.68rem 0.85rem; border-radius: 10px; font-size: 0.87rem; font-weight: 500; color: rgba(178,180,228,0.72); text-decoration: none; transition: background 0.15s, color 0.15s; }
          .nav-mobile-link:hover, .nav-mobile-link.nav-active { background: rgba(99,102,241,0.12); color: rgba(165,168,255,0.96); }
          .nav-arrow { opacity: 0.28; font-size: 0.9rem; }
          @media (min-width: 640px) { .nav-fab, .nav-mobile-menu { display: none !important; } }

          /* ── Scroll progress ─────────────────────────────────────── */
          .scroll-progress { position: fixed; top: 0; left: 0; right: 0; height: 1.5px; background: linear-gradient(90deg, #6366f1 0%, #a78bfa 50%, #c4b5fd 100%); transform-origin: 0%; z-index: 300; }

          /* ── Cursor glow ─────────────────────────────────────────── */
          .cursor-glow { position: fixed; width: 520px; height: 520px; border-radius: 50%; background: radial-gradient(circle, rgba(99,102,241,0.03) 0%, transparent 65%); pointer-events: none; z-index: 0; }
          @media (hover: none) { .cursor-glow { display: none; } }

          /* ── Open-to banner ──────────────────────────────────────── */
          .open-banner {
            position: fixed; top: 0; left: 0; right: 0; padding: 0.55rem 1.5rem;
            background: rgba(8,8,20,0.72);
            backdrop-filter: blur(16px); -webkit-backdrop-filter: blur(16px);
            border-bottom: 0.5px solid rgba(255,255,255,0.06);
            text-align: center; font-size: 0.81rem; color: rgba(165,168,255,0.72);
            text-decoration: none; z-index: 200;
            display: flex; align-items: center; justify-content: center;
            gap: 0.65rem; letter-spacing: 0.015em;
            transition: background 0.2s, color 0.2s;
          }
          .open-banner:hover { background: rgba(18,12,45,0.82); color: rgba(185,188,255,0.9); }
          .banner-dot { width: 5px; height: 5px; border-radius: 50%; background: #818cf8; box-shadow: 0 0 7px rgba(129,140,248,0.8), 0 0 16px rgba(129,140,248,0.3); flex-shrink: 0; animation: dot-pulse 2.4s ease-in-out infinite; }
          @keyframes dot-pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.4; } }

          /* ── Hero ────────────────────────────────────────────────── */
          .hero {
            min-height: 100vh;
            display: flex; align-items: center; justify-content: center;
            position: relative; padding: 2rem; padding-top: 5.5rem;
            overflow: hidden; text-align: center;
          }
          .hero-orb { position: absolute; border-radius: 50%; pointer-events: none; filter: blur(90px); will-change: transform; }
          .orb-1 { width: 700px; height: 700px; background: radial-gradient(circle, rgba(99,102,241,0.11) 0%, transparent 65%); top: -260px; right: -160px; animation: orb-drift 14s ease-in-out infinite alternate; }
          .orb-2 { width: 480px; height: 480px; background: radial-gradient(circle, rgba(139,92,246,0.09) 0%, transparent 65%); bottom: -130px; left: -90px; animation: orb-drift 18s ease-in-out infinite alternate-reverse; }
          .orb-3 { width: 300px; height: 300px; background: radial-gradient(circle, rgba(167,139,250,0.07) 0%, transparent 65%); top: 38%; right: 22%; animation: orb-drift 11s ease-in-out infinite alternate; }
          @keyframes orb-drift { from { transform: translate(0,0) scale(1); } to { transform: translate(20px,-16px) scale(1.06); } }

          .hero-content { position: relative; z-index: 1; max-width: 680px; width: 100%; margin: 0 auto; }
          .hero-eyebrow { font-size: 0.73rem; font-weight: 600; letter-spacing: 0.16em; text-transform: uppercase; color: rgba(129,140,248,0.48); margin-bottom: 1rem; }
          .hero-name { font-size: clamp(2.8rem, 7.5vw, 5.2rem); font-weight: 700; letter-spacing: -0.05em; line-height: 1.04; color: #f0f0ff; margin-bottom: 1.2rem; }
          .cursor-blink { color: #818cf8; margin-left: 3px; font-weight: 300; }
          .hero-role-pill { display: inline-block; background: rgba(99,102,241,0.08); border: 0.5px solid rgba(99,102,241,0.2); border-radius: 100px; padding: 0.44rem 1rem; font-size: 0.77rem; color: rgba(165,168,255,0.8); margin-bottom: 1.2rem; letter-spacing: 0.01em; line-height: 1.5; }
          .hero-summary { font-size: 0.98rem; line-height: 1.74; color: rgba(200,200,230,0.54); margin: 0 auto 1.1rem; max-width: 560px; }
          .hero-industries { display: flex; flex-wrap: wrap; gap: 0.38rem; margin-bottom: 1.8rem; justify-content: center; }
          .industry-tag { font-size: 0.7rem; font-weight: 600; letter-spacing: 0.06em; color: rgba(165,168,255,0.62); background: rgba(99,102,241,0.08); border: 0.5px solid rgba(99,102,241,0.16); border-radius: 100px; padding: 0.22rem 0.65rem; }

          /* ── Hero CTAs ───────────────────────────────────────────── */
          .hero-cta-row { display: flex; gap: 0.7rem; justify-content: center; flex-wrap: wrap; margin-bottom: 1rem; }

          /* Primary CTA — filled indigo */
          .cta-primary {
            display: inline-flex; align-items: center; gap: 0.5rem;
            padding: 0.62rem 1.4rem;
            background: rgba(99,102,241,0.2);
            backdrop-filter: blur(12px); -webkit-backdrop-filter: blur(12px);
            border: 0.5px solid rgba(99,102,241,0.45);
            border-radius: 100px; color: rgba(185,188,255,0.95);
            font-size: 0.88rem; font-weight: 600; text-decoration: none; min-height: 44px;
            box-shadow: 0 0 0 1px rgba(99,102,241,0.1), 0 4px 20px rgba(99,102,241,0.18);
            transition: background 0.2s, border-color 0.2s, box-shadow 0.2s, transform 0.15s;
          }
          .cta-primary:hover { background: rgba(99,102,241,0.3); border-color: rgba(99,102,241,0.6); box-shadow: 0 0 0 1px rgba(99,102,241,0.15), 0 6px 28px rgba(99,102,241,0.28); }

          /* Secondary CTA — outline glass */
          .cta-secondary {
            display: inline-flex; align-items: center; gap: 0.5rem;
            padding: 0.62rem 1.4rem;
            background: rgba(255,255,255,0.04);
            backdrop-filter: blur(12px); -webkit-backdrop-filter: blur(12px);
            border: 0.5px solid rgba(255,255,255,0.12);
            border-radius: 100px; color: rgba(200,202,250,0.7);
            font-size: 0.88rem; font-weight: 500; text-decoration: none; min-height: 44px;
            transition: background 0.2s, border-color 0.2s, color 0.2s;
          }
          .cta-secondary:hover { background: rgba(99,102,241,0.1); border-color: rgba(99,102,241,0.28); color: rgba(185,188,255,0.9); }

          /* Contact split */
          .contact-wrap { display: inline-flex; }
          .contact-split { display: flex; gap: 0.5rem; align-items: center; }
          .contact-option {
            display: inline-flex; align-items: center; gap: 0.42rem;
            padding: 0.58rem 1.1rem;
            background: rgba(255,255,255,0.04);
            backdrop-filter: blur(12px); -webkit-backdrop-filter: blur(12px);
            border: 0.5px solid rgba(255,255,255,0.12); border-radius: 100px;
            color: rgba(200,202,250,0.7); font-size: 0.84rem; font-weight: 500;
            text-decoration: none; min-height: 44px; white-space: nowrap;
            transition: background 0.2s, border-color 0.2s, color 0.2s;
          }
          .contact-option:hover { background: rgba(99,102,241,0.1); border-color: rgba(99,102,241,0.28); color: rgba(185,188,255,0.9); }

          .hero-nav { display: flex; gap: 0.6rem; flex-wrap: wrap; margin-bottom: 2.6rem; justify-content: center; }

          /* macOS-style glass button */
          .glass-btn {
            display: inline-flex; align-items: center; padding: 0.52rem 1.2rem;
            background: rgba(255,255,255,0.04);
            backdrop-filter: blur(20px); -webkit-backdrop-filter: blur(20px);
            border: 0.5px solid rgba(255,255,255,0.1); border-radius: 100px;
            color: rgba(200,200,245,0.62); font-size: 0.84rem; font-weight: 500;
            text-decoration: none; min-height: 40px;
            transition: background 0.2s, border-color 0.2s, color 0.2s;
            box-shadow: 0 1px 0 rgba(255,255,255,0.06) inset;
          }
          .glass-btn:hover { background: rgba(99,102,241,0.1); border-color: rgba(129,140,248,0.25); color: #b8bbff; }

          .scroll-hint { display: flex; align-items: center; gap: 0.75rem; font-size: 0.7rem; font-weight: 500; letter-spacing: 0.1em; text-transform: uppercase; color: rgba(129,140,248,0.26); justify-content: center; }
          .scroll-line { width: 1px; height: 28px; background: linear-gradient(to bottom, transparent, rgba(129,140,248,0.45), transparent); transform-origin: center; }

          /* ── Glass card ──────────────────────────────────────────── */
          .glass-card {
            background: rgba(255,255,255,0.045);
            backdrop-filter: blur(24px) saturate(150%); -webkit-backdrop-filter: blur(24px) saturate(150%);
            border: 0.5px solid rgba(255,255,255,0.1); border-radius: 20px;
            box-shadow: 0 1px 0 rgba(255,255,255,0.07) inset, 0 8px 24px rgba(0,0,0,0.18), 0 28px 56px rgba(0,0,0,0.26);
            transition: border-color 0.25s ease, box-shadow 0.25s ease, transform 0.25s ease;
          }
          .glass-card:hover { border-color: rgba(129,140,248,0.17); box-shadow: 0 1px 0 rgba(255,255,255,0.08) inset, 0 10px 28px rgba(0,0,0,0.2), 0 36px 64px rgba(0,0,0,0.3), 0 0 36px rgba(99,102,241,0.05); }

          /* ── Sections ────────────────────────────────────────────── */
          .section { max-width: 960px; margin: 0 auto; padding: 6rem 2rem; scroll-margin-top: 56px; }
          .pillars-section { padding: 5rem 2rem; }
          .section-label-wrap { display: flex; justify-content: center; margin-bottom: 1rem; }
          .section-label { display: inline-block; font-size: 0.67rem; font-weight: 700; letter-spacing: 0.18em; text-transform: uppercase; color: rgba(129,140,248,0.72); background: rgba(99,102,241,0.08); border: 0.5px solid rgba(99,102,241,0.18); border-radius: 100px; padding: 0.26rem 0.82rem; }
          .section-title { font-size: clamp(1.6rem, 3.2vw, 2.2rem); font-weight: 700; letter-spacing: -0.035em; line-height: 1.18; color: #f0f0ff; text-align: center; margin-bottom: 0.5rem; }
          .section-sub { font-size: 0.91rem; color: rgba(175,175,210,0.44); text-align: center; max-width: 480px; margin: 0 auto 2.6rem; line-height: 1.65; }

          /* ── Timeline ────────────────────────────────────────────── */
          .timeline { position: relative; padding-left: 2rem; }
          .timeline::before { content: ''; position: absolute; left: 0; top: 12px; bottom: 12px; width: 0.5px; background: linear-gradient(to bottom, rgba(99,102,241,0.5) 0%, rgba(99,102,241,0.22) 40%, rgba(99,102,241,0.04) 100%); }
          .timeline-item { position: relative; margin-bottom: 1.2rem; }
          .timeline-dot { position: absolute; left: -2rem; top: 1.65rem; width: 7px; height: 7px; border-radius: 50%; background: #6366f1; box-shadow: 0 0 0 3px rgba(99,102,241,0.13), 0 0 10px rgba(99,102,241,0.5); transform: translateX(-3px); }
          .exp-card { padding: 1.7rem 2rem; }
          .exp-top { display: flex; justify-content: space-between; align-items: flex-start; gap: 1rem; flex-wrap: wrap; margin-bottom: 1rem; }
          .exp-role { font-size: 1.01rem; font-weight: 600; color: #e8e8f8; margin-bottom: 0.2rem; }
          .exp-company { font-size: 0.86rem; color: #818cf8; font-weight: 500; }
          .exp-meta { display: flex; flex-direction: column; align-items: flex-end; gap: 0.2rem; flex-shrink: 0; }
          .exp-period { font-size: 0.76rem; color: rgba(175,175,215,0.4); }
          .exp-location { font-size: 0.73rem; color: rgba(175,175,215,0.28); }

          /* ── Bullet list ─────────────────────────────────────────── */
          .bullet-list { list-style: none; padding: 0; margin: 0; color: rgba(195,195,228,0.6); font-size: 0.87rem; line-height: 1.82; }
          .bullet-list li { position: relative; padding-left: 1.1rem; margin-bottom: 0.28rem; }
          .bullet-list li::before { content: ''; position: absolute; left: 0; top: 0.7em; width: 3px; height: 3px; border-radius: 50%; background: rgba(99,102,241,0.55); }

          /* ── Pillars ─────────────────────────────────────────────── */
          .pillars-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(265px, 1fr)); gap: 1.1rem; }
          .pillar-card { padding: 2rem 1.8rem; position: relative; overflow: hidden; }
          .pillar-card::before { content: ''; position: absolute; top: 0; left: 0; right: 0; height: 1px; background: linear-gradient(90deg, transparent, rgba(255,255,255,0.09), transparent); }
          .pillar-num { font-size: 0.66rem; font-weight: 700; letter-spacing: 0.13em; color: rgba(99,102,241,0.38); margin-bottom: 0.9rem; }
          .pillar-title { font-size: 1.2rem; font-weight: 700; color: #eeeeff; margin-bottom: 0.26rem; letter-spacing: -0.025em; }
          .pillar-sub { font-size: 0.81rem; color: rgba(175,175,215,0.4); margin-bottom: 1.25rem; }
          .tag-row { display: flex; flex-wrap: wrap; gap: 0.36rem; }
          .tag { background: rgba(99,102,241,0.09); border: 0.5px solid rgba(99,102,241,0.15); color: rgba(165,168,255,0.76); padding: 0.24rem 0.68rem; border-radius: 100px; font-size: 0.72rem; font-weight: 500; transition: background 0.18s, border-color 0.18s; }
          .tag:hover { background: rgba(99,102,241,0.16); border-color: rgba(99,102,241,0.26); }

          /* ── Projects ────────────────────────────────────────────── */
          .projects-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(320px, 1fr)); gap: 1.1rem; }
          .project-card { padding: 1.9rem; position: relative; overflow: hidden; }
          .project-card::before { content: ''; position: absolute; top: 0; left: 0; right: 0; height: 1px; background: linear-gradient(90deg, transparent, rgba(255,255,255,0.08), transparent); }
          .project-period { font-size: 0.7rem; color: rgba(129,140,248,0.4); letter-spacing: 0.06em; margin-bottom: 0.5rem; }
          .project-name { font-size: 1.26rem; font-weight: 700; color: #eeeeff; letter-spacing: -0.025em; margin-bottom: 0.24rem; }
          .project-subtitle { font-size: 0.86rem; color: #818cf8; margin-bottom: 0.82rem; }
          .project-desc { font-size: 0.86rem; color: rgba(190,190,225,0.56); line-height: 1.68; margin-bottom: 0.72rem; }
          .project-tech { font-size: 0.73rem; color: rgba(155,155,200,0.33); line-height: 1.55; margin-bottom: 1.1rem; }
          .project-link { font-size: 0.83rem; font-weight: 600; color: rgba(129,140,248,0.72); text-decoration: none; display: inline-block; transition: color 0.18s; }
          .project-link:hover { color: #b8bbff; }

          /* ── Education ───────────────────────────────────────────── */
          .edu-card { padding: 2rem; }
          .edu-degree { font-size: 1.08rem; font-weight: 700; color: #eeeeff; letter-spacing: -0.02em; margin-bottom: 0.32rem; }
          .edu-institution { font-size: 0.9rem; font-weight: 500; color: #818cf8; margin-bottom: 0.24rem; }
          .edu-majors { font-size: 0.84rem; color: rgba(175,175,215,0.44); margin-bottom: 0.2rem; }
          .edu-period { font-size: 0.78rem; color: rgba(175,175,215,0.3); margin-bottom: 1.1rem; }

          /* ── Certifications ──────────────────────────────────────── */
          .certs-row { display: flex; flex-wrap: wrap; gap: 0.72rem; justify-content: center; }
          .cert-pill { background: rgba(255,255,255,0.04); border: 0.5px solid rgba(255,255,255,0.09); color: rgba(195,195,235,0.66); padding: 0.56rem 1.25rem; border-radius: 100px; font-size: 0.85rem; font-weight: 500; transition: border-color 0.2s, background 0.2s, color 0.2s; }
          .cert-pill:hover { background: rgba(99,102,241,0.1); border-color: rgba(99,102,241,0.24); color: rgba(185,188,255,0.86); }

          /* ── Footer ──────────────────���───────────────────────────── */
          .footer { padding: 2rem 2rem 5rem; margin-top: 1rem; }
          .footer-glass { max-width: 500px; margin: 0 auto; background: rgba(255,255,255,0.03); backdrop-filter: blur(24px); -webkit-backdrop-filter: blur(24px); border: 0.5px solid rgba(255,255,255,0.08); border-radius: 22px; padding: 2.4rem 2rem; text-align: center; box-shadow: 0 1px 0 rgba(255,255,255,0.06) inset, 0 24px 52px rgba(0,0,0,0.32); }
          .footer-logo { display: flex; align-items: center; justify-content: center; gap: 0.55rem; margin-bottom: 1rem; }
          .footer-logo-name { font-size: 0.94rem; font-weight: 600; letter-spacing: -0.02em; color: rgba(185,188,255,0.72); }
          .footer-quote { font-size: 1.04rem; font-weight: 600; color: rgba(165,168,255,0.68); margin-bottom: 1.25rem; letter-spacing: -0.01em; }
          .footer-cta-row { margin-bottom: 1.4rem; }
          .footer-download { display: inline-flex; align-items: center; gap: 0.45rem; padding: 0.52rem 1.2rem; background: rgba(99,102,241,0.14); border: 0.5px solid rgba(99,102,241,0.32); border-radius: 100px; color: rgba(175,178,255,0.86); font-size: 0.82rem; font-weight: 600; text-decoration: none; transition: background 0.2s, border-color 0.2s; }
          .footer-download:hover { background: rgba(99,102,241,0.24); border-color: rgba(99,102,241,0.5); }
          .footer-nav { display: flex; gap: 2rem; justify-content: center; margin-bottom: 0.65rem; flex-wrap: wrap; }
          .footer-nav a { color: rgba(155,158,255,0.48); text-decoration: none; font-size: 0.86rem; transition: color 0.2s; }
          .footer-nav a:hover { color: rgba(185,188,255,0.86); }
          .footer-contact { font-size: 0.76rem; color: rgba(155,158,255,0.26); }

          /* ── Reduced motion ──────────────────────────────────────── */
          @media (prefers-reduced-motion: reduce) {
            .hero-orb, .banner-dot { animation: none !important; }
            .scroll-line { animation: none !important; }
          }

          /* ── Responsive 768px ────────────────────────────────────── */
          @media (max-width: 768px) {
            .hero { min-height: 100svh; padding: 1.5rem 1.25rem; padding-top: 5rem; }
            .hero-name { font-size: clamp(2.2rem, 9vw, 3.2rem); }
            .hero-role-pill { font-size: 0.72rem; }
            .hero-summary { font-size: 0.91rem; }
            .section { padding: 4rem 1.25rem; }
            .pillars-section { padding: 4rem 1.25rem; }
            .pillars-grid { grid-template-columns: 1fr; }
            .projects-grid { grid-template-columns: 1fr; }
            .timeline { padding-left: 1.5rem; }
            .timeline-dot { left: -1.5rem; }
            .exp-card { padding: 1.25rem; }
            .exp-top { flex-direction: column; gap: 0.4rem; }
            .exp-meta { align-items: flex-start; }
            .section-title { font-size: 1.5rem; }
            .footer-glass { padding: 1.8rem 1.25rem; }
            .footer-nav { gap: 1.25rem; }
          }

          /* ── Responsive 480px ────────────────────────────────────── */
          @media (max-width: 480px) {
            .hero { padding: 1rem 1rem; padding-top: 4.5rem; }
            .hero-cta-row { gap: 0.5rem; }
            .cta-primary, .cta-secondary { font-size: 0.82rem; padding: 0.56rem 1.1rem; }
            .glass-btn { padding: 0.46rem 0.9rem; font-size: 0.79rem; }
            .section { padding: 3rem 1rem; }
            .pillars-section { padding: 3rem 1rem; }
            .open-banner { font-size: 0.74rem; padding: 0.48rem 1rem; }
            .certs-row { gap: 0.5rem; }
            .cert-pill { font-size: 0.78rem; padding: 0.48rem 0.9rem; }
            .glass-card { backdrop-filter: none; -webkit-backdrop-filter: none; background: rgba(16,16,32,0.88); }
            .glass-btn { backdrop-filter: none; -webkit-backdrop-filter: none; }
            .footer-glass { backdrop-filter: none; -webkit-backdrop-filter: none; background: rgba(16,16,32,0.88); }
            .footer { padding-bottom: 80px; }
          }

          /* ── Responsive 360px ────────────────────────────────────── */
          @media (max-width: 360px) {
            .hero-name { font-size: 2rem; }
            .section { padding: 2.5rem 0.75rem; }
            .hero-role-pill { font-size: 0.68rem; }
          }
        `}</style>
      </div>
      <Analytics />
    </>
  )
}

export default App
