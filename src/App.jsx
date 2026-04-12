import { useState, useEffect, useRef, useId } from 'react'
import { motion, AnimatePresence, useInView, useScroll, useTransform, useMotionValue, useSpring } from 'framer-motion'
import { LoadingGem, NavGem } from './Scene3D'

/* ── Resume Data ──────────────────────────────────────────────────────── */
const data = {
  name: 'Minul Lokuliyana',
  resumePdf: '/MinulLokuliyana_Resume.pdf',
  title: 'Business Analytics & Cybersecurity · Monash University',
  tagline: 'Analytics · Security · Impact',
  location: 'Melbourne, VIC',
  contact: {
    email: 'minullokuliyana@hotmail.com',
    mobile: '+61 402 528 040',
    linkedin: 'https://linkedin.com/in/minull',
    github: 'https://github.com/Mainulll',
    website: 'https://minul.vercel.app',
  },
  narrative: `Across six industries, I've turned complex operational challenges into structured insights, automation solutions, and stakeholder-aligned recommendations that deliver measurable impact.`,
  openTo: 'Open to New Challenges',
  stats: [
    { value: 50, prefix: '$', suffix: 'M+', label: 'Inventory managed', color: '#38bdf8' },
    { value: 6, suffix: '', label: 'Industries', color: '#34d399' },
    { value: 11, suffix: '+', label: 'Years leadership', color: '#a78bfa' },
    { value: 100, suffix: 'K+', label: 'Records processed', color: '#f472b6' },
  ],
  experience: [
    {
      role: 'Supply Chain Planner',
      company: 'BSH Home Appliances Australia',
      period: 'Jan 2026 – Present',
      location: 'Melbourne, VIC',
      highlights: [
        'Manage $50M+ national inventory across AU/NZ for Bosch, Siemens, Neff, and Gaggenau in SAP, owning stock transfers, allocations, project reservations, and 3PL coordination to reduce backorder rates.',
        'Built the Customer Level Forecasting tool and a Python replacement pipeline for the PSI Tool import process, consolidating retailer forecasts across national accounts and reducing data processing time from hours to minutes.',
        'Developed Power BI dashboards, Excel/VBA automation, and Python reporting tools with procurement and sales teams, surfacing KPIs across 500+ SKUs and reducing manual reporting by ~25%.',
        'Delivered cost-benefit analyses and scenario planning to support procurement recommendations; led inventory audits and master-data validation across 3 DCs for senior stakeholders.',
      ],
    },
    {
      role: 'Procurement and Supply Chain Project Coordinator',
      company: 'Cummins Asia Pacific',
      period: 'Jan 2025 – Jan 2026',
      location: 'Melbourne, VIC',
      highlights: [
        'Managed two concurrent development programmes for regional markets, coordinating cross-functional engineering teams and owning on-time delivery across multiple workstreams.',
        'Led end-to-end RFQ processes: supplier engagement, capability benchmarking, risk assessment, and commercial negotiation with 30+ suppliers; delivered cost-reduction initiatives contributing to six-figure annual savings.',
        'Developed Python automation and agentic AI workflows across 3 functions; designed Power BI dashboards improving programme visibility for APAC procurement across 10+ markets and 50+ categories.',
      ],
    },
    {
      role: 'Research Assistant',
      company: 'Monash University VARS Lab',
      period: 'Jun 2024 – Dec 2024',
      location: 'Melbourne, VIC',
      highlights: [
        'Designed Python and R data pipelines processing 100K+ records through hypothesis-driven analysis, improving throughput by 3x and contributing to one peer-reviewed publication.',
      ],
    },
    {
      role: 'Product Demonstrator and Content Creator',
      company: 'Dyson',
      period: 'Aug 2022 – Sep 2024',
      location: 'Melbourne, VIC',
      highlights: [
        'Ranked #1 nationally in sales across all retail staff for two consecutive years; broke single-day floorcare sales record; selected as exclusive content creator for branded product launches.',
      ],
    },
    {
      role: 'Technical Support Analyst',
      company: 'YoureOnTime',
      period: 'Feb 2023 – May 2024',
      location: 'Melbourne, VIC',
      highlights: [
        'Managed client onboarding, data migration, and campaign coordination for a cloud SaaS platform (200+ SME clients); delivered insights driving 15%+ uplift in engagement.',
      ],
    },
  ],
  projects: [
    {
      name: 'Previa',
      subtitle: 'AI Financial Intelligence Platform',
      role: 'Co-Founder',
      description: 'Co-founded full-stack AI platform (React, TypeScript, Supabase) automating receipt reconciliation for SMEs with 90%+ accuracy; managed end-to-end product delivery.',
      tech: 'React, TypeScript, Supabase, Python, LLMs',
      link: 'https://github.com/demigod97/Previa-2.0',
      linkLabel: 'View on GitHub',
    },
    {
      name: 'GymBro',
      subtitle: 'AI-Powered Fitness App',
      role: 'Solo Developer',
      description: 'Built production-grade mobile app (React Native, Expo, TypeScript) with offline-first architecture and agentic AI-driven development workflow.',
      tech: 'React Native, Expo, TypeScript, SQLite, Zustand, Firebase',
      link: 'https://github.com/Mainulll/Gymbro-App',
      linkLabel: 'View on GitHub',
    },
    {
      name: 'Borealis Creative Group',
      subtitle: 'Digital Strategy',
      role: 'Project Lead',
      description: 'Managed concurrent digital projects for franchise clients including web development, SEO, and paid advertising, improving organic traffic by 40%.',
      tech: 'Figma, Web Design, SEO, Analytics',
      link: 'https://docs.google.com/document/d/1s_JRAy8o3LNFfrVgoeCC3s_PzByHTtMg6zqxtgM6BxU/edit?tab=t.0',
      linkLabel: 'View Demos',
    },
  ],
  education: {
    degree: 'Bachelor of Information Technology and Bachelor of Commerce (Double Degree)',
    institution: 'Monash University',
    period: 'Jul 2022 – Nov 2026 (Expected)',
    majors: 'Business Analytics · Cybersecurity',
    coursework: 'Machine learning, econometrics, statistical modelling, data visualisation, database systems, risk management',
    highlights: [
      'Innovation for Impact Award (2024) — Competitive university-wide award for responsible AI solution design, evaluated on commercial viability, technical rigour, and societal impact.',
      'Global Immersion (Fiji) and Innovation Guarantee (Microsoft) — Led cross-cultural consulting engagements: UN SDG-aligned project delivery and AI-driven stakeholder experience prototypes.',
    ],
  },
  leadership: [
    {
      title: 'Programme Coordinator',
      org: 'Preflight STEM Initiative',
      period: '2024–Present',
      description: 'Founded and personally fund STEM outreach for underrepresented students in Sri Lanka; manage volunteer teams, curriculum, and programme delivery.',
    },
    {
      title: 'Officer',
      org: 'Australian Air League',
      period: '2014–Present',
      description: '11+ years of youth leadership in aviation and civic education within a defence-aligned organisation; mentored cadets and coordinated squadron operations.',
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
  skillPillars: [
    {
      title: 'Project Management',
      items: ['Programme Delivery', 'Stakeholder Engagement', 'Risk Assessment', 'Cost-Benefit Analysis', 'Scenario Planning', 'Cross-Functional Coordination', 'Lean Six Sigma', 'Agile', 'Procurement Strategy'],
    },
    {
      title: 'Technical',
      items: ['Python', 'R', 'SQL', 'Excel / VBA', 'Power Query', 'Power Pivot', 'Power BI', 'Tableau', 'SAP ERP', 'Git', 'React', 'React Native', 'TypeScript', 'HTML / CSS', 'Supabase'],
    },
    {
      title: 'AI & Automation',
      items: ['Prompt Engineering', 'Agentic AI Workflows', 'LLM Integration', 'GPT-4o', 'Mistral', 'Gemini', 'Process Automation', 'Data Pipelines'],
    },
    {
      title: 'Cloud, Tools & Certs',
      items: ['Azure', 'AWS', 'GCP', 'Docker', 'Kubernetes', 'Kali Linux', 'Burp Suite', 'Salesforce', 'Jira', 'Confluence', 'ServiceNow', 'CPP', 'Lean Six Sigma Yellow Belt'],
    },
  ],
}

/* ── Animation Variants ───────────────────────────────────────────────── */
const ease = [0.22, 1, 0.36, 1]

const blurUp = {
  initial: { opacity: 0, y: 24 },
  animate: { opacity: 1, y: 0 },
}

const fadeUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
}

const stagger = {
  animate: { transition: { staggerChildren: 0.07, delayChildren: 0.05 } },
}

const slideLeft = {
  initial: { opacity: 0, x: -20 },
  animate: { opacity: 1, x: 0 },
}

/* ── Nav Links ────────────────────────────────────────────────────────── */
const NAV_LINKS = [
  { label: 'Experience', href: '#experience' },
  { label: 'Skills', href: '#skills' },
  { label: 'Projects', href: '#projects' },
  { label: 'Education', href: '#education' },
  { label: 'Leadership', href: '#leadership' },
  { label: 'Contact', href: '#contact' },
]

/* ── Dot Grid Background ─────────────────────────────────────────────── */
function DotGrid() {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')

    const SPACING = 26
    const BASE_R = 0.85
    const INFLUENCE = 150
    const INF2 = INFLUENCE * INFLUENCE
    const MAX_PUSH = 14
    const LERP = 0.07
    const isTouch = !window.matchMedia('(hover: hover)').matches

    let W, H, cols, rows, raf
    const mouse = { x: -9999, y: -9999 }
    const smooth = { x: -9999, y: -9999 }

    const resize = () => {
      W = canvas.width = window.innerWidth
      H = canvas.height = window.innerHeight
      cols = Math.ceil(W / SPACING) + 2
      rows = Math.ceil(H / SPACING) + 2
    }

    const draw = () => {
      smooth.x += (mouse.x - smooth.x) * LERP
      smooth.y += (mouse.y - smooth.y) * LERP
      ctx.clearRect(0, 0, W, H)

      ctx.beginPath()
      ctx.fillStyle = 'rgba(56, 189, 248, 0.08)'
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
              const dist = Math.sqrt(dist2)
              const ratio = 1 - dist / INFLUENCE
              const force = ratio * ratio * MAX_PUSH
              const angle = Math.atan2(dy, dx)
              const px = bx + Math.cos(angle) * force
              const py = by + Math.sin(angle) * force
              const alpha = (0.08 + ratio * 0.45).toFixed(2)
              const r = BASE_R + ratio * 0.5
              ctx.beginPath()
              ctx.arc(px, py, r, 0, Math.PI * 2)
              ctx.fillStyle = `rgba(56, 189, 248, ${alpha})`
              ctx.fill()
            }
          }
        }
      }

      raf = requestAnimationFrame(draw)
    }

    const onMove = (e) => { mouse.x = e.clientX; mouse.y = e.clientY }
    const onVisible = () => {
      if (document.hidden) { cancelAnimationFrame(raf); raf = null }
      else if (!raf) draw()
    }

    const noMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    resize()
    if (noMotion) {
      ctx.beginPath()
      ctx.fillStyle = 'rgba(56, 189, 248, 0.08)'
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

/* ── Cursor Glow ──────────────────────────────────────────────────────── */
function CursorGlow() {
  const x = useMotionValue(-300)
  const y = useMotionValue(-300)
  const xS = useSpring(x, { damping: 28, stiffness: 180 })
  const yS = useSpring(y, { damping: 28, stiffness: 180 })
  useEffect(() => {
    const move = (e) => { x.set(e.clientX); y.set(e.clientY) }
    globalThis.addEventListener('mousemove', move)
    return () => globalThis.removeEventListener('mousemove', move)
  }, [x, y])
  return <motion.div className="cursor-glow" style={{ left: xS, top: yS, x: '-50%', y: '-50%' }} />
}

/* ── Animated Counter ─────────────────────────────────────────────────── */
function AnimatedCounter({ value, prefix = '', suffix = '', color }) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-80px' })
  const spring = useSpring(0, { stiffness: 60, damping: 18 })
  const [display, setDisplay] = useState(0)

  useEffect(() => {
    if (isInView) spring.set(value)
  }, [isInView, value, spring])

  useEffect(() => {
    const unsub = spring.on('change', (v) => setDisplay(Math.round(v)))
    return unsub
  }, [spring])

  return (
    <div ref={ref} className="stat-card">
      <div className="stat-value" style={{ backgroundImage: `linear-gradient(135deg, ${color}, ${color}88)` }}>
        {prefix}{display}{suffix}
      </div>
      <div className="stat-label">{/* label set by parent */}</div>
    </div>
  )
}

/* ── Spotlight Card ───────────────────────────────────────────────────── */
function SpotlightCard({ children, className = '', ...props }) {
  const cardRef = useRef(null)

  useEffect(() => {
    const card = cardRef.current
    if (!card || !window.matchMedia('(hover: hover)').matches) return
    const onMove = (e) => {
      const rect = card.getBoundingClientRect()
      card.style.setProperty('--mouse-x', `${e.clientX - rect.left}px`)
      card.style.setProperty('--mouse-y', `${e.clientY - rect.top}px`)
    }
    card.addEventListener('mousemove', onMove, { passive: true })
    return () => card.removeEventListener('mousemove', onMove)
  }, [])

  return (
    <motion.div ref={cardRef} className={`glass-card spotlight-card ${className}`} {...props}>
      {children}
    </motion.div>
  )
}

/* ── Section ──────────────────────────────────────────────────────────── */
function Section({ children, className = '', id }) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-60px' })
  return (
    <motion.section
      ref={ref}
      id={id}
      initial={{ opacity: 0, y: 24 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, ease }}
      className={className}
    >
      {children}
    </motion.section>
  )
}

/* ── Section Label ────────────────────────────────────────────────────── */
function SectionLabel({ children }) {
  return (
    <motion.div className="section-label-wrap" variants={slideLeft}>
      <span className="section-label">{children}</span>
    </motion.div>
  )
}

/* ── Navbar ────────────────────────────────────────────────────────────── */
function Navbar() {
  const [active, setActive] = useState('')
  const [mobileOpen, setMobileOpen] = useState(false)
  const [visible, setVisible] = useState(false)
  const menuRef = useRef(null)
  const fabRef = useRef(null)

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 80)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    const obs = new IntersectionObserver(
      (entries) => entries.forEach((e) => { if (e.isIntersecting) setActive(e.target.id) }),
      { rootMargin: '-35% 0px -60% 0px' }
    )
    document.querySelectorAll('section[id]').forEach((s) => obs.observe(s))
    return () => obs.disconnect()
  }, [])

  useEffect(() => {
    if (!mobileOpen) return
    const handler = (e) => {
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
              <NavGem />
              {NAV_LINKS.map((l) => (
                <a
                  key={l.label}
                  href={l.href}
                  onClick={(e) => scrollTo(e, l.href)}
                  className={`nav-link${active === l.href.slice(1) ? ' nav-active' : ''}`}
                >
                  {l.label}
                </a>
              ))}
            </div>
          </motion.nav>

          <motion.button
            ref={fabRef}
            className="nav-fab"
            aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
            onClick={() => setMobileOpen((v) => !v)}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            whileTap={{ scale: 0.9 }}
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
              <motion.div
                ref={menuRef}
                className="nav-mobile-menu"
                initial={{ opacity: 0, y: 10, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.96 }}
                transition={{ duration: 0.2, ease }}
              >
                {NAV_LINKS.map((l) => (
                  <a
                    key={l.label}
                    href={l.href}
                    onClick={(e) => scrollTo(e, l.href)}
                    className={`nav-mobile-link${active === l.href.slice(1) ? ' nav-active' : ''}`}
                  >
                    <span>{l.label}</span>
                    <span className="nav-arrow">&rsaquo;</span>
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

/* ── Loading Screen ───────────────────────────────────────────────────── */
function LoadingScreen() {
  return (
    <motion.div
      className="loading-screen"
      exit={{ opacity: 0, transition: { duration: 0.6, ease } }}
    >
      <motion.div
        className="loading-inner"
        initial={{ opacity: 0, scale: 0.88 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 1.05, filter: 'blur(20px)', transition: { duration: 0.5, ease } }}
        transition={{ duration: 0.7, ease }}
      >
        <LoadingGem />
      </motion.div>

      <motion.p
        className="loading-name"
        layoutId="ml-name"
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6, duration: 0.65, ease }}
      >
        {data.name}
      </motion.p>

      <motion.p
        className="loading-sub"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0, y: -6, filter: 'blur(6px)', transition: { duration: 0.3 } }}
        transition={{ delay: 1.0, duration: 0.55 }}
      >
        {data.tagline}
      </motion.p>
    </motion.div>
  )
}

/* ── Icons ─────────────────────────────────────────────────────────────── */
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

/* ── App ───────────────────────────────────────────────────────────────── */
function App() {
  const [loaded, setLoaded] = useState(false)
  const [contactExpanded, setContactExpanded] = useState(false)
  const containerRef = useRef(null)
  const contactWrapRef = useRef(null)
  const { scrollYProgress } = useScroll({ target: containerRef, offset: ['start start', 'end end'] })
  const heroScale = useTransform(scrollYProgress, [0, 0.12], [1, 0.94])
  const heroOpacity = useTransform(scrollYProgress, [0, 0.1], [1, 0])
  const parallaxY = useTransform(scrollYProgress, [0, 0.25], [0, 60])

  useEffect(() => {
    const t = setTimeout(() => setLoaded(true), 2800)
    return () => clearTimeout(t)
  }, [])

  useEffect(() => {
    if (!contactExpanded) return
    const handler = (e) => {
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

        {/* Gradient mesh orbs */}
        <div className="mesh-orbs" aria-hidden="true">
          <div className="mesh-orb orb-cyan" />
          <div className="mesh-orb orb-violet" />
          <div className="mesh-orb orb-emerald" />
        </div>

        {/* Open-to banner */}
        <motion.a
          href={`mailto:${data.contact.email}`}
          className="open-banner"
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
        >
          <span className="banner-dot" />
          {data.openTo}
        </motion.a>

        {/* ── Hero ────────────────────────────────────────────────────── */}
        <motion.header style={{ scale: heroScale, opacity: heroOpacity }} className="hero">
          <motion.div style={{ y: parallaxY }} className="hero-content">
            <motion.p
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.6, ease }}
              className="hero-eyebrow"
            >
              {data.location}
            </motion.p>

            {loaded ? (
              <motion.h1
                className="hero-name"
                layoutId="ml-name"
                initial={false}
                transition={{ type: 'spring', stiffness: 72, damping: 18, mass: 1.1 }}
              >
                {data.name}
              </motion.h1>
            ) : (
              <h1 className="hero-name" style={{ opacity: 0 }} aria-hidden="true">{data.name}</h1>
            )}

            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.4, duration: 0.5, type: 'spring', stiffness: 300, damping: 25 }}
              className="hero-role-pill"
            >
              {data.title}
            </motion.div>

            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.6, ease }}
              className="hero-summary"
            >
              {data.narrative}
            </motion.p>

            {/* Primary CTAs */}
            <motion.div
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.85, duration: 0.5 }}
              className="hero-cta-row"
            >
              <motion.a
                href={data.resumePdf}
                download="Minul_Lokuliyana_Resume.pdf"
                className="cta-primary"
                whileHover={{ scale: 1.04, y: -3 }}
                whileTap={{ scale: 0.96 }}
                transition={{ type: 'spring', stiffness: 380, damping: 20 }}
              >
                <IconDownload />
                Download Resume
              </motion.a>

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
                      whileHover={{ scale: 1.04, y: -3 }}
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
            <motion.nav
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.1 }}
              className="hero-nav"
            >
              {[
                { label: 'LinkedIn', href: data.contact.linkedin, external: true },
                { label: 'GitHub', href: data.contact.github, external: true },
                { label: 'Email', href: `mailto:${data.contact.email}`, external: false },
              ].map((item) => (
                <motion.a
                  key={item.label}
                  href={item.href}
                  target={item.external ? '_blank' : undefined}
                  rel={item.external ? 'noopener noreferrer' : undefined}
                  className="glass-btn"
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.97 }}
                  transition={{ type: 'spring', stiffness: 380, damping: 20 }}
                >
                  {item.label}
                </motion.a>
              ))}
            </motion.nav>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.3 }}
              className="scroll-hint"
            >
              <motion.div
                className="scroll-line"
                animate={{ scaleY: [0.4, 1, 0.4] }}
                transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
              />
              Scroll to explore
            </motion.div>
          </motion.div>
        </motion.header>

        {/* ── Experience + Stats (Magazine pair 1) ─────────────────────── */}
        <Section className="section magazine-pair" id="experience">
          <div className="pair-wide">
            <SectionLabel>Career</SectionLabel>
            <motion.h2 variants={blurUp} initial="initial" whileInView="animate" viewport={{ once: true }} transition={{ duration: 0.6, ease }} className="section-title section-title-left">
              Experience
            </motion.h2>
            <motion.p variants={fadeUp} initial="initial" whileInView="animate" viewport={{ once: true }} className="section-sub section-sub-left">
              Six industries. One consistent thread: turning complexity into clarity.
            </motion.p>
            <div className="timeline">
              {data.experience.map((exp, i) => (
                <motion.div
                  key={exp.company}
                  variants={blurUp}
                  initial="initial"
                  whileInView="animate"
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.07, duration: 0.6, ease }}
                  className="timeline-item"
                >
                  <div className="timeline-dot" />
                  <SpotlightCard
                    className="exp-card"
                    whileHover={{ y: -4, borderColor: 'rgba(56,189,248,0.25)' }}
                    transition={{ duration: 0.22 }}
                  >
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
                      {exp.highlights.map((h) => <li key={h}>{h}</li>)}
                    </ul>
                  </SpotlightCard>
                </motion.div>
              ))}
            </div>
          </div>
          <div className="pair-narrow stats-sidebar">
            {data.stats.map((stat, i) => (
              <motion.div
                key={stat.label}
                variants={blurUp}
                initial="initial"
                whileInView="animate"
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.5, ease }}
                className="stat-card"
              >
                <AnimatedCounter
                  value={stat.value}
                  prefix={stat.prefix || ''}
                  suffix={stat.suffix}
                  color={stat.color}
                />
                <div className="stat-label">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </Section>

        {/* ── Skills (Full width) ──────────────────────────────────────── */}
        <Section className="section" id="skills">
          <SectionLabel>Skills</SectionLabel>
          <motion.h2 variants={blurUp} initial="initial" whileInView="animate" viewport={{ once: true }} transition={{ duration: 0.6, ease }} className="section-title">
            Capabilities
          </motion.h2>
          <motion.p variants={fadeUp} initial="initial" whileInView="animate" viewport={{ once: true }} className="section-sub">
            The toolkit that underpins structured problem-solving and delivery.
          </motion.p>
          <motion.div variants={stagger} initial="initial" whileInView="animate" viewport={{ once: true }} className="pillars-grid">
            {data.skillPillars.map((pillar, i) => (
              <SpotlightCard
                key={pillar.title}
                className="pillar-card"
                whileHover={{ scale: 1.02, y: -5 }}
                transition={{ type: 'spring', stiffness: 280, damping: 22 }}
              >
                <motion.div variants={fadeUp}>
                  <div className="pillar-num">0{i + 1}</div>
                  <h4 className="pillar-title">{pillar.title}</h4>
                  <div className="tag-row">
                    {pillar.items.map((item) => (
                      <span key={item} className="tag">{item}</span>
                    ))}
                  </div>
                </motion.div>
              </SpotlightCard>
            ))}
          </motion.div>
        </Section>

        {/* ── Projects + Education/Leadership (Magazine pair 2) ────────── */}
        <Section className="section magazine-pair" id="projects">
          <div className="pair-half">
            <SectionLabel>Work</SectionLabel>
            <motion.h2 variants={blurUp} initial="initial" whileInView="animate" viewport={{ once: true }} transition={{ duration: 0.6, ease }} className="section-title section-title-left">
              Projects
            </motion.h2>
            <motion.p variants={fadeUp} initial="initial" whileInView="animate" viewport={{ once: true }} className="section-sub section-sub-left">
              Building solutions that bridge technical depth with business outcomes.
            </motion.p>
            <div className="projects-stack">
              {data.projects.map((proj, i) => (
                <motion.div
                  key={proj.name}
                  variants={blurUp}
                  initial="initial"
                  whileInView="animate"
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.08, duration: 0.5, ease }}
                >
                  <SpotlightCard
                    className="project-card"
                    whileHover={{ y: -4 }}
                    transition={{ duration: 0.22 }}
                  >
                    <div className="project-role-badge">{proj.role}</div>
                    <h4 className="project-name">{proj.name}</h4>
                    <p className="project-subtitle">{proj.subtitle}</p>
                    <p className="project-desc">{proj.description}</p>
                    <p className="project-tech">{proj.tech}</p>
                    {proj.link && (
                      <motion.a
                        href={proj.link}
                        className="project-link"
                        target="_blank"
                        rel="noopener noreferrer"
                        whileHover={{ x: 4 }}
                      >
                        {proj.linkLabel || 'View project'} &rarr;
                      </motion.a>
                    )}
                  </SpotlightCard>
                </motion.div>
              ))}
            </div>
          </div>

          <div className="pair-half pair-stack" id="education">
            {/* Education */}
            <div>
              <SectionLabel>Study</SectionLabel>
              <motion.h2 variants={blurUp} initial="initial" whileInView="animate" viewport={{ once: true }} transition={{ duration: 0.6, ease }} className="section-title section-title-left">
                Education
              </motion.h2>
              <SpotlightCard className="edu-card" whileHover={{ y: -3 }} transition={{ duration: 0.22 }}>
                <h4 className="edu-degree">{data.education.degree}</h4>
                <p className="edu-institution">{data.education.institution}</p>
                <p className="edu-majors">{data.education.majors}</p>
                <p className="edu-period">{data.education.period}</p>
                <p className="edu-coursework">{data.education.coursework}</p>
                <ul className="bullet-list">
                  {data.education.highlights.map((h) => <li key={h}>{h}</li>)}
                </ul>
              </SpotlightCard>
            </div>

            {/* Leadership */}
            <div id="leadership">
              <SectionLabel>Leadership</SectionLabel>
              <motion.h2 variants={blurUp} initial="initial" whileInView="animate" viewport={{ once: true }} transition={{ duration: 0.6, ease }} className="section-title section-title-left">
                Leadership & Impact
              </motion.h2>
              <div className="leadership-stack">
                {data.leadership.map((item, i) => (
                  <motion.div
                    key={item.org}
                    variants={fadeUp}
                    initial="initial"
                    whileInView="animate"
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.06, duration: 0.5, ease }}
                  >
                    <SpotlightCard className="leadership-card" whileHover={{ y: -3 }} transition={{ duration: 0.22 }}>
                      <div className="leadership-top">
                        <div>
                          <div className="leadership-title">{item.title}</div>
                          <div className="leadership-org">{item.org}</div>
                        </div>
                        <span className="leadership-period">{item.period}</span>
                      </div>
                      <p className="leadership-desc">{item.description}</p>
                    </SpotlightCard>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </Section>

        {/* ── Footer / Contact ──────────────────────────────────────────── */}
        <footer className="footer" id="contact">
          <div className="footer-glass">
            <div className="footer-logo">
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
              <a href={data.contact.github} target="_blank" rel="noopener noreferrer">GitHub</a>
              <a href={`mailto:${data.contact.email}`}>Email</a>
              <a href={data.contact.website} target="_blank" rel="noopener noreferrer">minul.vercel.app</a>
            </nav>
            <p className="footer-contact">{data.contact.mobile} &middot; {data.contact.email}</p>
          </div>
        </footer>

        <style>{`
          /* ── Global ──────────────────────────────────────────────── */
          html { scroll-padding-top: 56px; scrollbar-gutter: stable; }

          /* ── Base ────────────────────────────────────────────────── */
          .app {
            position: relative; min-height: 100vh;
            background: #020617;
            color: #e2e8f0;
            contain: style;
          }

          /* ── Gradient Mesh Orbs ──────────────────────────────────── */
          .mesh-orbs { position: fixed; inset: 0; pointer-events: none; z-index: 0; overflow: hidden; contain: strict; }
          .mesh-orb { position: absolute; border-radius: 50%; filter: blur(100px); will-change: transform; transform: translateZ(0); }
          .orb-cyan { width: 700px; height: 700px; background: radial-gradient(circle, rgba(56,189,248,0.09) 0%, transparent 65%); top: -200px; right: -100px; animation: orb-drift-1 22s ease-in-out infinite alternate; }
          .orb-violet { width: 550px; height: 550px; background: radial-gradient(circle, rgba(139,92,246,0.07) 0%, transparent 65%); bottom: -150px; left: -80px; animation: orb-drift-2 26s ease-in-out infinite alternate-reverse; }
          .orb-emerald { width: 400px; height: 400px; background: radial-gradient(circle, rgba(52,211,153,0.05) 0%, transparent 65%); top: 45%; left: 15%; animation: orb-drift-3 18s ease-in-out infinite alternate; }
          @keyframes orb-drift-1 { from { transform: translate(0,0) scale(1); } to { transform: translate(30px,-25px) scale(1.08); } }
          @keyframes orb-drift-2 { from { transform: translate(0,0) scale(1); } to { transform: translate(-25px,20px) scale(1.06); } }
          @keyframes orb-drift-3 { from { transform: translate(0,0) scale(1); } to { transform: translate(20px,-15px) scale(1.05); } }

          /* ── Dot Grid ────────────────────────────────────────────── */
          .dot-grid { position: fixed; inset: 0; width: 100%; height: 100%; pointer-events: none; z-index: 0; contain: strict; }

          /* ── Loading Screen ──────────────────────────────────────── */
          .loading-screen {
            position: fixed; inset: 0; z-index: 9999;
            display: flex; flex-direction: column; align-items: center; justify-content: center;
            gap: 0.6rem; background: #020617;
            contain: layout style;
          }
          .loading-inner { display: flex; flex-direction: column; align-items: center; margin-bottom: 0.2rem; }
          .loading-gem-canvas { display: flex; align-items: center; justify-content: center; filter: drop-shadow(0 4px 20px rgba(56,189,248,0.35)) drop-shadow(0 0 44px rgba(139,92,246,0.2)); }
          .loading-name { font-size: 1.14rem; font-weight: 600; letter-spacing: -0.02em; color: rgba(241,245,249,0.88); }
          .loading-sub { font-size: 0.71rem; font-weight: 500; letter-spacing: 0.13em; text-transform: uppercase; color: rgba(56,189,248,0.4); }

          /* ── Navbar — desktop pill ───────────────────────────────── */
          .site-nav {
            position: fixed; top: 48px; left: 0; right: 0;
            display: flex; justify-content: center;
            pointer-events: none; z-index: 150;
          }
          .site-nav-pill {
            display: flex; align-items: center; gap: 0.1rem; padding: 0.3rem 0.4rem;
            pointer-events: auto; white-space: nowrap;
            background: rgba(2,6,23,0.82);
            backdrop-filter: blur(20px) saturate(160%); -webkit-backdrop-filter: blur(20px) saturate(160%);
            border: 0.5px solid rgba(255,255,255,0.08); border-radius: 100px;
            box-shadow: 0 1px 0 rgba(255,255,255,0.06) inset, 0 8px 24px rgba(0,0,0,0.4);
          }
          .nav-gem-canvas { display: flex; align-items: center; margin-right: 0.25rem; flex-shrink: 0; }
          .nav-link { padding: 0.38rem 0.78rem; border-radius: 100px; font-size: 0.75rem; font-weight: 500; color: rgba(148,163,184,0.5); text-decoration: none; transition: color 0.18s, background 0.18s; }
          .nav-link:hover { color: rgba(203,213,225,0.86); background: rgba(255,255,255,0.05); }
          .nav-link.nav-active { background: rgba(56,189,248,0.12); color: rgba(56,189,248,0.9); }
          @media (max-width: 639px) { .site-nav { display: none; } }

          /* ── Navbar — mobile FAB ─────────────────────────────────── */
          .nav-fab {
            position: fixed; bottom: 24px; right: 20px;
            width: 46px; height: 46px; border-radius: 50%;
            background: rgba(2,6,23,0.9);
            backdrop-filter: blur(16px); -webkit-backdrop-filter: blur(16px);
            border: 0.5px solid rgba(56,189,248,0.22);
            color: rgba(56,189,248,0.84); display: flex; align-items: center; justify-content: center;
            cursor: pointer; z-index: 150;
            box-shadow: 0 4px 16px rgba(0,0,0,0.5), 0 0 0 1px rgba(56,189,248,0.06);
            transition: background 0.2s, border-color 0.2s;
          }
          .nav-fab:hover { background: rgba(15,23,42,0.95); border-color: rgba(56,189,248,0.4); }
          @media (min-width: 640px) { .nav-fab { display: none; } }

          /* ── Navbar — mobile dropdown ────────────────────────────── */
          .nav-mobile-menu {
            position: fixed; bottom: 80px; right: 16px; width: 192px;
            background: rgba(2,6,23,0.95);
            backdrop-filter: blur(24px); -webkit-backdrop-filter: blur(24px);
            border: 0.5px solid rgba(255,255,255,0.09); border-radius: 16px;
            padding: 0.45rem; z-index: 149;
            box-shadow: 0 1px 0 rgba(255,255,255,0.07) inset, 0 16px 40px rgba(0,0,0,0.5);
          }
          .nav-mobile-link { display: flex; align-items: center; justify-content: space-between; padding: 0.68rem 0.85rem; border-radius: 10px; font-size: 0.87rem; font-weight: 500; color: rgba(148,163,184,0.6); text-decoration: none; transition: background 0.15s, color 0.15s; }
          .nav-mobile-link:hover, .nav-mobile-link.nav-active { background: rgba(56,189,248,0.1); color: rgba(56,189,248,0.95); }
          .nav-arrow { opacity: 0.28; font-size: 0.9rem; }
          @media (min-width: 640px) { .nav-fab, .nav-mobile-menu { display: none !important; } }

          /* ── Scroll progress ─────────────────────────────────────── */
          .scroll-progress { position: fixed; top: 0; left: 0; right: 0; height: 2px; background: linear-gradient(90deg, #38bdf8 0%, #a78bfa 50%, #34d399 100%); transform-origin: 0%; z-index: 300; box-shadow: 0 0 8px rgba(56,189,248,0.4); will-change: transform; contain: layout style; }

          /* ── Cursor glow ─────────────────────────────────────────── */
          .cursor-glow { position: fixed; width: 520px; height: 520px; border-radius: 50%; background: radial-gradient(circle, rgba(56,189,248,0.025) 0%, transparent 65%); pointer-events: none; z-index: 0; will-change: transform; contain: layout style; }
          @media (hover: none) { .cursor-glow { display: none; } }

          /* ── Open-to banner ──────────────────────────────────────── */
          .open-banner {
            position: fixed; top: 0; left: 0; right: 0; padding: 0.55rem 1.5rem;
            background: rgba(2,6,23,0.75);
            backdrop-filter: blur(16px); -webkit-backdrop-filter: blur(16px);
            border-bottom: 0.5px solid rgba(255,255,255,0.06);
            text-align: center; font-size: 0.81rem; color: rgba(148,163,184,0.65);
            text-decoration: none; z-index: 200;
            display: flex; align-items: center; justify-content: center;
            gap: 0.65rem; letter-spacing: 0.015em;
            transition: background 0.2s, color 0.2s;
            transform: translateZ(0); contain: layout style;
          }
          .open-banner:hover { background: rgba(15,23,42,0.85); color: rgba(203,213,225,0.9); }
          .banner-dot { width: 5px; height: 5px; border-radius: 50%; background: #34d399; box-shadow: 0 0 7px rgba(52,211,153,0.8), 0 0 16px rgba(52,211,153,0.3); flex-shrink: 0; animation: dot-pulse 2.4s ease-in-out infinite; }
          @keyframes dot-pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.4; } }

          /* ── Hero ────────────────────────────────────────────────── */
          .hero {
            min-height: 100vh;
            display: flex; align-items: center; justify-content: center;
            position: relative; padding: 2rem; padding-top: 5.5rem;
            overflow: hidden; text-align: center;
          }
          .hero-content { position: relative; z-index: 1; max-width: 680px; width: 100%; margin: 0 auto; }
          .hero-eyebrow { font-size: 0.73rem; font-weight: 600; letter-spacing: 0.16em; text-transform: uppercase; color: rgba(56,189,248,0.45); margin-bottom: 1rem; }
          .hero-name { font-size: clamp(2.8rem, 7.5vw, 5.2rem); font-weight: 700; letter-spacing: -0.05em; line-height: 1.04; color: #f1f5f9; margin-bottom: 1.2rem; }
          .hero-role-pill { display: inline-block; background: rgba(56,189,248,0.06); border: 0.5px solid rgba(56,189,248,0.18); border-radius: 100px; padding: 0.44rem 1rem; font-size: 0.77rem; color: rgba(56,189,248,0.75); margin-bottom: 1.2rem; letter-spacing: 0.01em; line-height: 1.5; }
          .hero-summary { font-size: 0.98rem; line-height: 1.74; color: rgba(203,213,225,0.48); margin: 0 auto 1.6rem; max-width: 560px; }

          /* ── Hero CTAs ───────────────────────────────────────────── */
          .hero-cta-row { display: flex; gap: 0.7rem; justify-content: center; flex-wrap: wrap; margin-bottom: 1rem; }
          .cta-primary {
            display: inline-flex; align-items: center; gap: 0.5rem;
            padding: 0.62rem 1.4rem;
            background: rgba(56,189,248,0.14);
            backdrop-filter: blur(12px); -webkit-backdrop-filter: blur(12px);
            border: 0.5px solid rgba(56,189,248,0.35);
            border-radius: 100px; color: rgba(186,230,253,0.92);
            font-size: 0.88rem; font-weight: 600; text-decoration: none; min-height: 44px;
            box-shadow: 0 0 0 1px rgba(56,189,248,0.08), 0 4px 20px rgba(56,189,248,0.15);
            transition: background 0.2s, border-color 0.2s, box-shadow 0.2s;
          }
          .cta-primary:hover { background: rgba(56,189,248,0.22); border-color: rgba(56,189,248,0.5); box-shadow: 0 0 0 1px rgba(56,189,248,0.12), 0 6px 28px rgba(56,189,248,0.25); }

          .cta-secondary {
            display: inline-flex; align-items: center; gap: 0.5rem;
            padding: 0.62rem 1.4rem;
            background: rgba(255,255,255,0.04);
            backdrop-filter: blur(12px); -webkit-backdrop-filter: blur(12px);
            border: 0.5px solid rgba(255,255,255,0.1);
            border-radius: 100px; color: rgba(203,213,225,0.65);
            font-size: 0.88rem; font-weight: 500; text-decoration: none; min-height: 44px;
            transition: background 0.2s, border-color 0.2s, color 0.2s;
          }
          .cta-secondary:hover { background: rgba(56,189,248,0.08); border-color: rgba(56,189,248,0.2); color: rgba(186,230,253,0.85); }

          .contact-wrap { display: inline-flex; }
          .contact-split { display: flex; gap: 0.5rem; align-items: center; }
          .contact-option {
            display: inline-flex; align-items: center; gap: 0.42rem;
            padding: 0.58rem 1.1rem;
            background: rgba(255,255,255,0.04);
            backdrop-filter: blur(12px); -webkit-backdrop-filter: blur(12px);
            border: 0.5px solid rgba(255,255,255,0.1); border-radius: 100px;
            color: rgba(203,213,225,0.65); font-size: 0.84rem; font-weight: 500;
            text-decoration: none; min-height: 44px; white-space: nowrap;
            transition: background 0.2s, border-color 0.2s, color 0.2s;
          }
          .contact-option:hover { background: rgba(56,189,248,0.08); border-color: rgba(56,189,248,0.2); color: rgba(186,230,253,0.85); }

          .hero-nav { display: flex; gap: 0.6rem; flex-wrap: wrap; margin-bottom: 2.6rem; justify-content: center; }
          .glass-btn {
            display: inline-flex; align-items: center; padding: 0.52rem 1.2rem;
            background: rgba(255,255,255,0.03);
            backdrop-filter: blur(20px); -webkit-backdrop-filter: blur(20px);
            border: 0.5px solid rgba(255,255,255,0.08); border-radius: 100px;
            color: rgba(148,163,184,0.55); font-size: 0.84rem; font-weight: 500;
            text-decoration: none; min-height: 40px;
            transition: background 0.2s, border-color 0.2s, color 0.2s;
            box-shadow: 0 1px 0 rgba(255,255,255,0.04) inset;
          }
          .glass-btn:hover { background: rgba(56,189,248,0.08); border-color: rgba(56,189,248,0.2); color: rgba(186,230,253,0.8); }

          .scroll-hint { display: flex; align-items: center; gap: 0.75rem; font-size: 0.7rem; font-weight: 500; letter-spacing: 0.1em; text-transform: uppercase; color: rgba(56,189,248,0.2); justify-content: center; }
          .scroll-line { width: 1px; height: 28px; background: linear-gradient(to bottom, transparent, rgba(56,189,248,0.4), transparent); transform-origin: center; }

          /* ── Glass card ──────────────────────────────────────────── */
          .glass-card {
            background: rgba(15,23,42,0.5);
            backdrop-filter: blur(24px) saturate(150%); -webkit-backdrop-filter: blur(24px) saturate(150%);
            border: 0.5px solid rgba(255,255,255,0.08); border-radius: 20px;
            box-shadow: 0 1px 0 rgba(255,255,255,0.05) inset, 0 8px 24px rgba(0,0,0,0.25), 0 28px 56px rgba(0,0,0,0.3);
            transition: border-color 0.25s ease, box-shadow 0.25s ease;
            transform: translateZ(0);
          }
          .glass-card:hover { border-color: rgba(56,189,248,0.14); box-shadow: 0 1px 0 rgba(255,255,255,0.06) inset, 0 10px 28px rgba(0,0,0,0.28), 0 36px 64px rgba(0,0,0,0.35), 0 0 40px rgba(56,189,248,0.04); }

          /* Spotlight effect */
          .spotlight-card { position: relative; overflow: hidden; }
          .spotlight-card::after {
            content: ''; position: absolute; inset: 0; border-radius: inherit;
            background: radial-gradient(600px circle at var(--mouse-x, -999px) var(--mouse-y, -999px), rgba(56,189,248,0.06), transparent 40%);
            pointer-events: none; opacity: 0; transition: opacity 0.3s;
          }
          .spotlight-card:hover::after { opacity: 1; }

          /* ── Magazine Layout ──────────────────────────────────────── */
          .magazine-pair { display: flex; gap: 2rem; max-width: 1100px; }
          .pair-wide { flex: 2; min-width: 0; }
          .pair-narrow { flex: 1; min-width: 0; }
          .pair-half { flex: 1; min-width: 0; }
          .pair-stack { display: flex; flex-direction: column; gap: 2.5rem; }
          @media (max-width: 768px) {
            .magazine-pair { flex-direction: column; }
            .stats-sidebar { flex-direction: row; overflow-x: auto; gap: 0.75rem; padding-bottom: 0.5rem; scrollbar-width: none; order: -1; }
            .stats-sidebar::-webkit-scrollbar { display: none; }
            .stat-card { flex: 0 0 140px; }
          }

          /* ── Sections ────────────────────────────────────────────── */
          .section { max-width: 960px; margin: 0 auto; padding: 6rem 2rem; scroll-margin-top: 56px; }
          .section-label-wrap { display: flex; margin-bottom: 1rem; }
          .section-label { display: inline-block; font-size: 0.67rem; font-weight: 700; letter-spacing: 0.18em; text-transform: uppercase; color: rgba(56,189,248,0.65); background: rgba(56,189,248,0.06); border: 0.5px solid rgba(56,189,248,0.14); border-radius: 100px; padding: 0.26rem 0.82rem; }
          .section-title { font-size: clamp(1.6rem, 3.2vw, 2.2rem); font-weight: 700; letter-spacing: -0.035em; line-height: 1.18; color: #f1f5f9; text-align: center; margin-bottom: 0.5rem; }
          .section-title-left { text-align: left; }
          .section-sub { font-size: 0.91rem; color: rgba(148,163,184,0.4); text-align: center; max-width: 480px; margin: 0 auto 2.6rem; line-height: 1.65; }
          .section-sub-left { text-align: left; margin: 0 0 2.2rem; }

          /* ── Stats Sidebar ───────────────────────────────────────── */
          .stats-sidebar { display: flex; flex-direction: column; gap: 1rem; position: sticky; top: 120px; align-self: flex-start; }
          .stat-card { background: rgba(15,23,42,0.4); border: 0.5px solid rgba(255,255,255,0.06); border-radius: 16px; padding: 1.2rem; text-align: center; }
          .stat-value { font-size: 2rem; font-weight: 800; letter-spacing: -0.03em; -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; }
          .stat-label { font-size: 0.7rem; color: rgba(148,163,184,0.4); margin-top: 0.3rem; }

          /* ── Timeline ────────────────────────────────────────────── */
          .timeline { position: relative; padding-left: 2rem; }
          .timeline::before { content: ''; position: absolute; left: 0; top: 12px; bottom: 12px; width: 0.5px; background: linear-gradient(to bottom, rgba(56,189,248,0.45) 0%, rgba(168,85,247,0.2) 50%, rgba(52,211,153,0.05) 100%); }
          .timeline-item { position: relative; margin-bottom: 1.2rem; }
          .timeline-dot { position: absolute; left: -2rem; top: 1.65rem; width: 7px; height: 7px; border-radius: 50%; background: #38bdf8; box-shadow: 0 0 0 3px rgba(56,189,248,0.12), 0 0 10px rgba(56,189,248,0.45); transform: translateX(-3px); }
          .exp-card { padding: 1.7rem 2rem; }
          .exp-top { display: flex; justify-content: space-between; align-items: flex-start; gap: 1rem; flex-wrap: wrap; margin-bottom: 1rem; }
          .exp-role { font-size: 1.01rem; font-weight: 600; color: #f1f5f9; margin-bottom: 0.2rem; }
          .exp-company { font-size: 0.86rem; color: #38bdf8; font-weight: 500; }
          .exp-meta { display: flex; flex-direction: column; align-items: flex-end; gap: 0.2rem; flex-shrink: 0; }
          .exp-period { font-size: 0.76rem; color: rgba(148,163,184,0.38); }
          .exp-location { font-size: 0.73rem; color: rgba(148,163,184,0.25); }

          /* ── Bullet list ─────────────────────────────────────────── */
          .bullet-list { list-style: none; padding: 0; margin: 0; color: rgba(203,213,225,0.52); font-size: 0.87rem; line-height: 1.82; }
          .bullet-list li { position: relative; padding-left: 1.1rem; margin-bottom: 0.28rem; }
          .bullet-list li::before { content: ''; position: absolute; left: 0; top: 0.7em; width: 3px; height: 3px; border-radius: 50%; background: rgba(56,189,248,0.45); }

          /* ── Pillars ─────────────────────────────────────────────── */
          .pillars-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 1rem; }
          .pillar-card { padding: 1.8rem 1.5rem; position: relative; overflow: hidden; }
          .pillar-card::before { content: ''; position: absolute; top: 0; left: 0; right: 0; height: 1px; background: linear-gradient(90deg, transparent, rgba(56,189,248,0.12), transparent); }
          .pillar-num { font-size: 0.66rem; font-weight: 700; letter-spacing: 0.13em; color: rgba(56,189,248,0.3); margin-bottom: 0.8rem; }
          .pillar-title { font-size: 1.05rem; font-weight: 700; color: #f1f5f9; margin-bottom: 1rem; letter-spacing: -0.02em; }
          .tag-row { display: flex; flex-wrap: wrap; gap: 0.32rem; }
          .tag { background: rgba(56,189,248,0.06); border: 0.5px solid rgba(56,189,248,0.12); color: rgba(148,163,184,0.65); padding: 0.22rem 0.62rem; border-radius: 100px; font-size: 0.68rem; font-weight: 500; transition: background 0.18s, border-color 0.18s, color 0.18s; }
          .tag:hover { background: rgba(56,189,248,0.12); border-color: rgba(56,189,248,0.22); color: rgba(186,230,253,0.8); }

          /* ── Projects ────────────────────────────────────────────── */
          .projects-stack { display: flex; flex-direction: column; gap: 1rem; }
          .project-card { padding: 1.6rem; position: relative; overflow: hidden; }
          .project-card::before { content: ''; position: absolute; top: 0; left: 0; right: 0; height: 1px; background: linear-gradient(90deg, transparent, rgba(52,211,153,0.12), transparent); }
          .project-role-badge { display: inline-block; font-size: 0.6rem; font-weight: 600; letter-spacing: 0.08em; text-transform: uppercase; color: rgba(52,211,153,0.6); background: rgba(52,211,153,0.06); border: 0.5px solid rgba(52,211,153,0.12); border-radius: 100px; padding: 0.18rem 0.6rem; margin-bottom: 0.6rem; }
          .project-name { font-size: 1.15rem; font-weight: 700; color: #f1f5f9; letter-spacing: -0.02em; margin-bottom: 0.2rem; }
          .project-subtitle { font-size: 0.82rem; color: rgba(52,211,153,0.6); margin-bottom: 0.7rem; }
          .project-desc { font-size: 0.84rem; color: rgba(203,213,225,0.48); line-height: 1.68; margin-bottom: 0.6rem; }
          .project-tech { font-size: 0.71rem; color: rgba(148,163,184,0.28); line-height: 1.55; margin-bottom: 0.9rem; }
          .project-link { font-size: 0.82rem; font-weight: 600; color: rgba(52,211,153,0.65); text-decoration: none; display: inline-block; transition: color 0.18s; }
          .project-link:hover { color: rgba(110,231,183,0.9); }

          /* ── Education ───────────────────────────────────────────── */
          .edu-card { padding: 1.8rem; }
          .edu-degree { font-size: 1.02rem; font-weight: 700; color: #f1f5f9; letter-spacing: -0.02em; margin-bottom: 0.3rem; }
          .edu-institution { font-size: 0.88rem; font-weight: 500; color: rgba(251,191,36,0.65); margin-bottom: 0.2rem; }
          .edu-majors { font-size: 0.82rem; color: rgba(148,163,184,0.45); margin-bottom: 0.18rem; }
          .edu-period { font-size: 0.76rem; color: rgba(148,163,184,0.3); margin-bottom: 0.4rem; }
          .edu-coursework { font-size: 0.76rem; color: rgba(148,163,184,0.3); font-style: italic; margin-bottom: 1rem; line-height: 1.5; }

          /* ── Leadership ──────────────────────────────────────────── */
          .leadership-stack { display: flex; flex-direction: column; gap: 0.75rem; }
          .leadership-card { padding: 1.2rem 1.4rem; }
          .leadership-top { display: flex; justify-content: space-between; align-items: flex-start; gap: 0.8rem; margin-bottom: 0.5rem; }
          .leadership-title { font-size: 0.92rem; font-weight: 600; color: #f1f5f9; }
          .leadership-org { font-size: 0.82rem; color: rgba(244,114,182,0.55); font-weight: 500; }
          .leadership-period { font-size: 0.72rem; color: rgba(148,163,184,0.3); white-space: nowrap; flex-shrink: 0; }
          .leadership-desc { font-size: 0.82rem; color: rgba(203,213,225,0.42); line-height: 1.65; }

          /* ── Footer ──────────────────────────────────────────────── */
          .footer { padding: 2rem 2rem 5rem; margin-top: 1rem; }
          .footer-glass { max-width: 500px; margin: 0 auto; background: rgba(15,23,42,0.4); backdrop-filter: blur(24px); -webkit-backdrop-filter: blur(24px); border: 0.5px solid rgba(255,255,255,0.06); border-radius: 22px; padding: 2.4rem 2rem; text-align: center; box-shadow: 0 1px 0 rgba(255,255,255,0.04) inset, 0 24px 52px rgba(0,0,0,0.35); }
          .footer-logo { display: flex; align-items: center; justify-content: center; gap: 0.55rem; margin-bottom: 1rem; }
          .footer-logo-name { font-size: 0.94rem; font-weight: 600; letter-spacing: -0.02em; color: rgba(186,230,253,0.65); }
          .footer-quote { font-size: 1.04rem; font-weight: 600; color: rgba(56,189,248,0.55); margin-bottom: 1.25rem; letter-spacing: -0.01em; }
          .footer-cta-row { margin-bottom: 1.4rem; }
          .footer-download { display: inline-flex; align-items: center; gap: 0.45rem; padding: 0.52rem 1.2rem; background: rgba(56,189,248,0.1); border: 0.5px solid rgba(56,189,248,0.25); border-radius: 100px; color: rgba(186,230,253,0.8); font-size: 0.82rem; font-weight: 600; text-decoration: none; transition: background 0.2s, border-color 0.2s; }
          .footer-download:hover { background: rgba(56,189,248,0.18); border-color: rgba(56,189,248,0.4); }
          .footer-nav { display: flex; gap: 1.8rem; justify-content: center; margin-bottom: 0.65rem; flex-wrap: wrap; }
          .footer-nav a { color: rgba(148,163,184,0.4); text-decoration: none; font-size: 0.86rem; transition: color 0.2s; }
          .footer-nav a:hover { color: rgba(186,230,253,0.8); }
          .footer-contact { font-size: 0.76rem; color: rgba(148,163,184,0.22); }

          /* ── Reduced motion ──────────────────────────────────────── */
          @media (prefers-reduced-motion: reduce) {
            .mesh-orb, .banner-dot { animation: none !important; }
            .scroll-line { animation: none !important; }
          }

          /* ── Responsive 900px (skills grid) ──────────────────────── */
          @media (max-width: 900px) {
            .pillars-grid { grid-template-columns: repeat(2, 1fr); }
          }

          /* ── Responsive 768px ────────────────────────────────────── */
          @media (max-width: 768px) {
            .hero { min-height: 100svh; padding: 1.5rem 1.25rem; padding-top: 5rem; }
            .hero-name { font-size: clamp(2.2rem, 9vw, 3.2rem); }
            .hero-role-pill { font-size: 0.72rem; }
            .hero-summary { font-size: 0.91rem; }
            .section { padding: 4rem 1.25rem; }
            .section-title-left { text-align: center; }
            .section-sub-left { text-align: center; margin: 0 auto 2rem; }
            .section-label-wrap { justify-content: center; }
            .timeline { padding-left: 1.5rem; }
            .timeline-dot { left: -1.5rem; }
            .exp-card { padding: 1.25rem; }
            .exp-top { flex-direction: column; gap: 0.4rem; }
            .exp-meta { align-items: flex-start; }
            .section-title { font-size: 1.5rem; }
            .footer-glass { padding: 1.8rem 1.25rem; }
            .footer-nav { gap: 1.25rem; }
            .leadership-top { flex-direction: column; gap: 0.2rem; }
          }

          /* ── Responsive 480px ────────────────────────────────────── */
          @media (max-width: 480px) {
            .hero { padding: 1rem 1rem; padding-top: 4.5rem; }
            .hero-cta-row { gap: 0.5rem; }
            .cta-primary, .cta-secondary { font-size: 0.82rem; padding: 0.56rem 1.1rem; }
            .glass-btn { padding: 0.46rem 0.9rem; font-size: 0.79rem; }
            .section { padding: 3rem 1rem; }
            .pillars-grid { grid-template-columns: 1fr; }
            .open-banner { font-size: 0.74rem; padding: 0.48rem 1rem; }
            .glass-card { backdrop-filter: none; -webkit-backdrop-filter: none; background: rgba(15,23,42,0.85); }
            .glass-btn { backdrop-filter: none; -webkit-backdrop-filter: none; }
            .footer-glass { backdrop-filter: none; -webkit-backdrop-filter: none; background: rgba(15,23,42,0.85); }
            .footer { padding-bottom: 80px; }
            .spotlight-card::after { display: none; }
          }

          /* ── Responsive 360px ────────────────────────────────────── */
          @media (max-width: 360px) {
            .hero-name { font-size: 2rem; }
            .section { padding: 2.5rem 0.75rem; }
            .hero-role-pill { font-size: 0.68rem; }
          }
        `}</style>
      </div>
    </>
  )
}

export default App
