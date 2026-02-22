import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence, useInView, useScroll, useTransform, useMotionValue, useSpring } from 'framer-motion'

const data = {
  name: 'Minul Lokuliyana',
  title: 'Supply Chain @ BSH Group | Final Year Business Analytics & Cybersecurity @ Monash',
  tagline: 'Automation · Perspective · Transformation',
  location: 'Melbourne, VIC',
  contact: {
    email: 'minullokuliyana@hotmail.com',
    mobile: '+61 402 528 040',
    linkedin: 'https://linkedin.com/in/minull',
    github: 'https://github.com/minull',
  },
  summary: `Analytically driven early-career professional with cross-industry experience spanning home appliances, manufacturing (metal fabrication & electrical sub-assemblies), SaaS, and academic research. Adept at synthesising complex data into structured recommendations, managing stakeholders across all seniority levels, and delivering measurable impact through a rare combination of technical rigour and exceptional interpersonal skills. Targeting graduate consulting, strategy, and analyst roles.`,
  message: `Final year Business Analytics & Cybersecurity student at Monash. Across five industries — I translate operational complexity into clear business impact through structured analysis, automation, and the kind of cross-functional collaboration that actually gets things done.`,
  industries: [
    'Home Appliances',
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
    degree: 'Bachelor of IT & Bachelor of Commerce',
    institution: 'Monash University',
    period: 'Jul 2022 – Nov 2026',
    majors: 'Computer Systems, Networks & Security · Business Analytics',
    highlights: [
      'Innovation for Impact Award (2024) — recognised for developing responsible AI and sustainability solutions aligned with industry and societal impact criteria',
      'Global Immersion Guarantee (Fiji) — led cross-cultural team to design waste-management solutions aligned with UN Sustainable Development Goals',
      'Monash Innovation Guarantee (Microsoft) — collaborated with Microsoft to prototype AI-infused student experience solutions using structured innovation methodology',
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

/* ── CSS 3D Ice Cube ─────────────────────────────────────────────────────
   Translated from Ana Tudor's (thebabydino) Pug pen:
     - let n = 4
     - div(class='🧊' style=`--n: ${n}`)  →  cube-scene div
     - while n-- / .face(style=`--j: ${n}`)  →  faces array
   Gold stripe animation: background-position sweep, color-mix for face shading.
   --int is pre-calculated in JS (Math.floor(j/2)) to avoid CSS round() compat.
──────────────────────────────────────────────────────────────────────── */
function IceCube({ size = 88 }) {
  const half = size / 2
  const faces = [3, 2, 1, 0]
  return (
    <div
      className="cube-scene"
      style={{ '--size': `${size}px`, '--half': `${half}px`, '--n': 4, width: size, height: size }}
    >
      <div className="ice-cube">
        {faces.map(j => (
          <div key={j} className="face" style={{ '--j': j, '--int': Math.floor(j / 2) }} />
        ))}
        <div className="face-top" />
        <div className="face-bottom" />
      </div>
    </div>
  )
}

/* ── Loading Screen ──────────────────────────────────────────────────── */
function LoadingScreen() {
  return (
    <motion.div
      className="loading-screen"
      exit={{ opacity: 0, scale: 1.06, filter: 'blur(12px)' }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
    >
      <motion.div
        className="loading-inner"
        initial={{ opacity: 0, scale: 0.88, y: 12 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      >
        <IceCube size={96} />
        <motion.div
          className="loading-ml"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.5 }}
        >
          ML
        </motion.div>
        <motion.p
          className="loading-name"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.65, duration: 0.6 }}
        >
          Minul Lokuliyana
        </motion.p>
      </motion.div>
    </motion.div>
  )
}

/* ── Typewriter ──────────────────────────────────────────────────────── */
function Typewriter({ text, speed = 70, delay = 500 }) {
  const [display, setDisplay] = useState('')
  const [done, setDone] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => {
      let i = 0
      const type = () => {
        if (i < text.length) {
          setDisplay(text.slice(0, i + 1))
          i++
          setTimeout(type, speed)
        } else {
          setDone(true)
        }
      }
      type()
    }, delay)
    return () => clearTimeout(timer)
  }, [text, speed, delay])

  return (
    <span>
      {display}
      {!done && (
        <motion.span
          animate={{ opacity: [1, 0] }}
          transition={{ duration: 0.5, repeat: Infinity, repeatType: 'reverse' }}
          className="cursor-blink"
        >
          |
        </motion.span>
      )}
    </span>
  )
}

/* ── Cursor Glow ─────────────────────────────────────────────────────── */
function CursorGlow() {
  const x = useMotionValue(-300)
  const y = useMotionValue(-300)
  const xSpring = useSpring(x, { damping: 28, stiffness: 180 })
  const ySpring = useSpring(y, { damping: 28, stiffness: 180 })

  useEffect(() => {
    const move = (e) => { x.set(e.clientX); y.set(e.clientY) }
    globalThis.addEventListener('mousemove', move)
    return () => globalThis.removeEventListener('mousemove', move)
  }, [x, y])

  return (
    <motion.div
      className="cursor-glow"
      style={{ left: xSpring, top: ySpring, x: '-50%', y: '-50%' }}
    />
  )
}

/* ── Section ─────────────────────────────────────────────────────────── */
function Section({ children, className = '' }) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-60px' })
  return (
    <motion.section
      ref={ref}
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

/* ── App ─────────────────────────────────────────────────────────────── */
function App() {
  const [loaded, setLoaded] = useState(false)
  const containerRef = useRef(null)
  const { scrollYProgress } = useScroll({ target: containerRef, offset: ['start start', 'end end'] })
  const heroScale = useTransform(scrollYProgress, [0, 0.12], [1, 0.94])
  const heroOpacity = useTransform(scrollYProgress, [0, 0.1], [1, 0])
  const parallaxY = useTransform(scrollYProgress, [0, 0.25], [0, 60])

  useEffect(() => {
    const t = setTimeout(() => setLoaded(true), 2400)
    return () => clearTimeout(t)
  }, [])

  return (
    <>
      <AnimatePresence>
        {!loaded && <LoadingScreen key="loader" />}
      </AnimatePresence>

      <div ref={containerRef} className="app">

        <motion.div className="scroll-progress" style={{ scaleX: scrollYProgress }} />
        <CursorGlow />

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

        {/* ── Hero ──────────────────────────────────────────────────────── */}
        <motion.header style={{ scale: heroScale, opacity: heroOpacity }} className="hero">
          <div className="hero-orb orb-1" />
          <div className="hero-orb orb-2" />
          <div className="hero-orb orb-3" />
          <div className="hero-orb orb-4" />

          <motion.div style={{ y: parallaxY }} className="hero-content">
            <motion.p
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.6 }}
              className="hero-eyebrow"
            >
              {data.location}
            </motion.p>

            <h1 className="hero-name">
              <Typewriter text={data.name} speed={65} delay={600} />
            </h1>

            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 2.7, duration: 0.6 }}
              className="hero-role-pill"
            >
              {data.title}
            </motion.div>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 3.0 }}
              className="hero-summary"
            >
              {data.message}
            </motion.p>

            {/* Industry breadth tags */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 3.15 }}
              className="hero-industries"
            >
              {data.industries.map((ind) => (
                <span key={ind} className="industry-tag">{ind}</span>
              ))}
            </motion.div>

            <motion.nav
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 3.3 }}
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
              transition={{ delay: 3.55 }}
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

        {/* ── Experience ────────────────────────────────────────────────── */}
        <Section className="section">
          <SectionLabel>Career</SectionLabel>
          <motion.h2 variants={fadeUp} initial="initial" whileInView="animate" viewport={{ once: true }} className="section-title">
            Experience
          </motion.h2>
          <motion.p variants={fadeUp} initial="initial" whileInView="animate" viewport={{ once: true }} className="section-sub">
            {data.sectionSubtext.experience}
          </motion.p>

          <div className="timeline">
            {data.experience.map((exp, i) => (
              <motion.div
                key={exp.company}
                variants={fadeUp}
                initial="initial"
                whileInView="animate"
                viewport={{ once: true }}
                transition={{ delay: i * 0.07, duration: 0.6, ease }}
                className="timeline-item"
              >
                <div className="timeline-dot" />
                <motion.div
                  className="glass-card exp-card"
                  whileHover={{ y: -3, borderColor: 'rgba(129,140,248,0.28)' }}
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
                    {exp.highlights.map((h) => (
                      <li key={h}>{h}</li>
                    ))}
                  </ul>
                </motion.div>
              </motion.div>
            ))}
          </div>
        </Section>

        {/* ── Pillars ───────────────────────────────────────────────────── */}
        <Section className="section pillars-section">
          <SectionLabel>Skills</SectionLabel>
          <motion.h2 variants={fadeUp} initial="initial" whileInView="animate" viewport={{ once: true }} className="section-title">
            Automation · Perspective · Transformation
          </motion.h2>
          <motion.p variants={fadeUp} initial="initial" whileInView="animate" viewport={{ once: true }} className="section-sub">
            {data.sectionSubtext.skills}
          </motion.p>
          <motion.div variants={stagger} initial="initial" whileInView="animate" viewport={{ once: true }} className="pillars-grid">
            {data.skillPillars.map((pillar, i) => (
              <motion.div
                key={pillar.title}
                variants={fadeUp}
                className="glass-card pillar-card"
                whileHover={{ scale: 1.025, y: -5 }}
                transition={{ type: 'spring', stiffness: 280, damping: 22 }}
              >
                <div className="pillar-num">0{i + 1}</div>
                <h4 className="pillar-title">{pillar.title}</h4>
                <p className="pillar-sub">{pillar.subtitle}</p>
                <div className="tag-row">
                  {pillar.items.map((item) => (
                    <span key={item} className="tag">{item}</span>
                  ))}
                </div>
              </motion.div>
            ))}
          </motion.div>
        </Section>

        {/* ── Projects ──────────────────────────────────────────────────── */}
        <Section className="section">
          <SectionLabel>Work</SectionLabel>
          <motion.h2 variants={fadeUp} initial="initial" whileInView="animate" viewport={{ once: true }} className="section-title">
            Projects
          </motion.h2>
          <motion.p variants={fadeUp} initial="initial" whileInView="animate" viewport={{ once: true }} className="section-sub">
            {data.sectionSubtext.projects}
          </motion.p>
          <motion.div variants={stagger} initial="initial" whileInView="animate" viewport={{ once: true }} className="projects-grid">
            {data.projects.map((proj) => (
              <motion.div
                key={proj.name}
                variants={fadeUp}
                className="glass-card project-card"
                whileHover={{ y: -6 }}
                transition={{ duration: 0.25 }}
              >
                <div className="project-period">{proj.period}</div>
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
                    {proj.linkLabel || 'View project'} →
                  </motion.a>
                )}
              </motion.div>
            ))}
          </motion.div>
        </Section>

        {/* ── Education ─────────────────────────────────────────────────── */}
        <Section className="section">
          <SectionLabel>Study</SectionLabel>
          <motion.h2 variants={fadeUp} initial="initial" whileInView="animate" viewport={{ once: true }} className="section-title">
            Education
          </motion.h2>
          <motion.div
            variants={fadeUp}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            className="glass-card edu-card"
          >
            <h4 className="edu-degree">{data.education.degree}</h4>
            <p className="edu-institution">{data.education.institution}</p>
            <p className="edu-majors">{data.education.majors}</p>
            <p className="edu-period">{data.education.period}</p>
            <ul className="bullet-list">
              {data.education.highlights.map((h) => (
                <li key={h}>{h}</li>
              ))}
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
            {data.certifications.map((cert) => (
              <motion.span
                key={cert}
                variants={fadeUp}
                className="cert-pill"
                whileHover={{ scale: 1.03, borderColor: 'rgba(129,140,248,0.35)' }}
              >
                {cert}
              </motion.span>
            ))}
          </motion.div>
        </Section>

        {/* ── Footer ────────────────────────────────────────────────────── */}
        <footer className="footer">
          <div className="footer-glass">
            <div className="footer-logo">
              <IceCube size={28} />
              <span className="footer-logo-text">ML</span>
            </div>
            <p className="footer-quote">Always bringing the perspective.</p>
            <nav className="footer-nav">
              <a href={data.contact.linkedin} target="_blank" rel="noopener noreferrer">LinkedIn</a>
              <a href={data.contact.github} target="_blank" rel="noopener noreferrer">GitHub</a>
              <a href={`mailto:${data.contact.email}`}>Email</a>
            </nav>
            <p className="footer-contact">{data.contact.mobile} · {data.contact.email}</p>
          </div>
        </footer>

        <style>{`
          /* ── Base ──────────────────────────────────────────────────── */
          .app {
            position: relative;
            min-height: 100vh;
            background:
              radial-gradient(ellipse 100% 60% at 50% -8%, rgba(99,102,241,0.26) 0%, transparent 62%),
              radial-gradient(ellipse 60% 45% at 88% 72%, rgba(139,92,246,0.16) 0%, transparent 55%),
              radial-gradient(ellipse 50% 35% at 12% 58%, rgba(79,70,229,0.11) 0%, transparent 50%),
              radial-gradient(ellipse 40% 30% at 55% 90%, rgba(109,40,217,0.09) 0%, transparent 50%),
              #06060f;
            color: #e4e4f0;
          }

          /* ── CSS 3D Ice Cube ───────────────────────────────────────── */
          /* Ana Tudor (thebabydino) gold stripe technique.
             Each face: color-mix alternates gold/dark-gold via --int (0 or 1).
             Background-position animates from var(--size) 0 → 0 0,
             creating a sliding stripe/shimmer across each face. */
          .cube-scene {
            position: relative;
            perspective: calc(var(--size) * 4);
            display: flex;
            align-items: center;
            justify-content: center;
          }
          /* Warm amber glow beneath the cube */
          .cube-scene::after {
            content: '';
            position: absolute;
            inset: -20px;
            border-radius: 50%;
            background: radial-gradient(circle, rgba(212,175,55,0.14) 0%, transparent 70%);
            filter: blur(16px);
            animation: cube-glow 3.5s ease-in-out infinite alternate;
            pointer-events: none;
          }
          @keyframes cube-glow {
            from { opacity: 0.5; transform: scale(0.9); }
            to   { opacity: 1;   transform: scale(1.1); }
          }
          .ice-cube {
            width: var(--size);
            height: var(--size);
            transform-style: preserve-3d;
            animation: cube-rotate 7s linear infinite;
            position: relative;
            will-change: transform;
          }
          /* 4 side faces — gold stripe pattern, alternating shades per pair */
          .face {
            position: absolute;
            width: var(--size);
            height: var(--size);
            transform: rotateY(calc(var(--j) / var(--n) * 1turn)) translateZ(var(--half));
            backface-visibility: hidden;
            /* Alternating gold/dark-gold via --int (0=gold, 1=dark gold) */
            color: color-mix(in srgb, #403700 calc(var(--int) * 100%), #d4af37);
            /* Stripe pattern from original pen */
            background:
              linear-gradient(90deg, transparent 33.3%, currentcolor 0)
                var(--size) 0 / 100% 25% repeat-x,
              linear-gradient(90deg, transparent 33.3%, currentcolor 0 66.67%, transparent 0)
                var(--size) 0 repeat-x,
              linear-gradient(transparent 37.5%, currentcolor 0 62.5%, transparent 0);
            background-position: var(--size) 0, var(--size) 0, 0 0;
            filter: drop-shadow(1px 0 currentcolor);
            animation: face-stripe 2s ease-in-out infinite;
          }
          @keyframes face-stripe {
            to { background-position: 0 0, 0 0, 0 0; }
          }
          /* Top face — warm gold tint */
          .face-top {
            position: absolute;
            width: var(--size);
            height: var(--size);
            transform: rotateX(90deg) translateZ(var(--half));
            background: linear-gradient(135deg, rgba(212,175,55,0.2) 0%, rgba(212,175,55,0.08) 100%);
            border: 0.5px solid rgba(212,175,55,0.28);
            box-shadow: inset 0 0 20px rgba(212,175,55,0.08);
          }
          /* Bottom face — subtle */
          .face-bottom {
            position: absolute;
            width: var(--size);
            height: var(--size);
            transform: rotateX(-90deg) translateZ(var(--half));
            background: linear-gradient(135deg, rgba(64,55,0,0.18) 0%, rgba(64,55,0,0.06) 100%);
            border: 0.5px solid rgba(212,175,55,0.12);
          }
          @keyframes cube-rotate {
            from { transform: rotateX(-22deg) rotateY(0deg); }
            to   { transform: rotateX(-22deg) rotateY(360deg); }
          }

          /* ── Loading Screen ────────────────────────────────────────── */
          .loading-screen {
            position: fixed;
            inset: 0;
            z-index: 9999;
            display: flex;
            align-items: center;
            justify-content: center;
            background: #06060f;
          }
          .loading-inner {
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 1.4rem;
          }
          /* "ML" below the cube — gold gradient to match faces */
          .loading-ml {
            font-size: 1.5rem;
            font-weight: 700;
            letter-spacing: -0.05em;
            background: linear-gradient(135deg, #f5d97e 0%, #d4af37 50%, #c49a2a 100%);
            background-clip: text;
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            margin-top: -0.6rem;
          }
          .loading-name {
            font-size: 0.78rem;
            font-weight: 500;
            letter-spacing: 0.14em;
            text-transform: uppercase;
            color: rgba(175,175,215,0.34);
            margin-top: -0.4rem;
          }

          /* ── Scroll progress ───────────────────────────────────────── */
          .scroll-progress {
            position: fixed;
            top: 0; left: 0; right: 0;
            height: 1.5px;
            background: linear-gradient(90deg, #6366f1 0%, #a78bfa 50%, #c4b5fd 100%);
            transform-origin: 0%;
            z-index: 300;
          }

          /* ── Cursor glow ───────────────────────────────────────────── */
          .cursor-glow {
            position: fixed;
            width: 520px; height: 520px;
            border-radius: 50%;
            background: radial-gradient(circle, rgba(99,102,241,0.04) 0%, transparent 65%);
            pointer-events: none;
            z-index: 0;
          }
          @media (hover: none) { .cursor-glow { display: none; } }

          /* ── Open-to banner ────────────────────────────────────────── */
          .open-banner {
            position: fixed;
            top: 0; left: 0; right: 0;
            padding: 0.55rem 1.5rem;
            background: rgba(8,8,20,0.7);
            backdrop-filter: blur(16px);
            -webkit-backdrop-filter: blur(16px);
            border-bottom: 0.5px solid rgba(255,255,255,0.06);
            text-align: center;
            font-size: 0.81rem;
            color: rgba(165,168,255,0.72);
            text-decoration: none;
            z-index: 200;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 0.65rem;
            letter-spacing: 0.015em;
            transition: background 0.2s, color 0.2s;
          }
          .open-banner:hover { background: rgba(18,12,45,0.82); color: rgba(185,188,255,0.9); }
          .banner-dot {
            width: 5px; height: 5px;
            border-radius: 50%;
            background: #818cf8;
            box-shadow: 0 0 7px rgba(129,140,248,0.8), 0 0 16px rgba(129,140,248,0.3);
            flex-shrink: 0;
            animation: dot-pulse 2.4s ease-in-out infinite;
          }
          @keyframes dot-pulse {
            0%, 100% { opacity: 1; }
            50% { opacity: 0.4; }
          }

          /* ── Hero ──────────────────────────────────────────────────── */
          .hero {
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: flex-start;
            position: relative;
            padding: 2rem 2rem 2rem clamp(2rem, 8vw, 8rem);
            padding-top: 5.5rem;
            overflow: hidden;
          }
          .hero-orb {
            position: absolute;
            border-radius: 50%;
            pointer-events: none;
            filter: blur(80px);
            will-change: transform;
          }
          .orb-1 {
            width: 700px; height: 700px;
            background: radial-gradient(circle, rgba(99,102,241,0.13) 0%, transparent 65%);
            top: -260px; right: -160px;
            animation: orb-drift 14s ease-in-out infinite alternate;
          }
          .orb-2 {
            width: 480px; height: 480px;
            background: radial-gradient(circle, rgba(139,92,246,0.1) 0%, transparent 65%);
            bottom: -130px; left: -90px;
            animation: orb-drift 18s ease-in-out infinite alternate-reverse;
          }
          .orb-3 {
            width: 300px; height: 300px;
            background: radial-gradient(circle, rgba(167,139,250,0.08) 0%, transparent 65%);
            top: 38%; right: 22%;
            animation: orb-drift 11s ease-in-out infinite alternate;
          }
          .orb-4 {
            width: 180px; height: 180px;
            background: radial-gradient(circle, rgba(196,181,253,0.06) 0%, transparent 65%);
            top: 15%; left: 30%;
            filter: blur(60px);
            animation: orb-drift 16s ease-in-out infinite alternate-reverse;
          }
          @keyframes orb-drift {
            from { transform: translate(0, 0) scale(1); }
            to   { transform: translate(20px, -16px) scale(1.06); }
          }
          .hero-content {
            position: relative;
            z-index: 1;
            max-width: 680px;
          }
          .hero-eyebrow {
            font-size: 0.73rem;
            font-weight: 600;
            letter-spacing: 0.16em;
            text-transform: uppercase;
            color: rgba(129,140,248,0.48);
            margin-bottom: 1rem;
          }
          .hero-name {
            font-size: clamp(2.8rem, 7.5vw, 5.2rem);
            font-weight: 700;
            letter-spacing: -0.05em;
            line-height: 1.04;
            color: #f0f0ff;
            margin-bottom: 1.2rem;
          }
          .cursor-blink { color: #818cf8; margin-left: 3px; font-weight: 300; }
          .hero-role-pill {
            display: inline-block;
            background: rgba(99,102,241,0.08);
            border: 0.5px solid rgba(99,102,241,0.2);
            border-radius: 100px;
            padding: 0.44rem 1rem;
            font-size: 0.77rem;
            color: rgba(165,168,255,0.8);
            margin-bottom: 1.2rem;
            letter-spacing: 0.01em;
            line-height: 1.5;
          }
          .hero-summary {
            font-size: 0.98rem;
            line-height: 1.74;
            color: rgba(200,200,230,0.54);
            margin-bottom: 1.1rem;
            max-width: 580px;
          }
          /* Industry breadth tags — subtle row below summary */
          .hero-industries {
            display: flex;
            flex-wrap: wrap;
            gap: 0.38rem;
            margin-bottom: 1.8rem;
          }
          .industry-tag {
            font-size: 0.7rem;
            font-weight: 600;
            letter-spacing: 0.06em;
            color: rgba(212,175,55,0.6);
            background: rgba(212,175,55,0.07);
            border: 0.5px solid rgba(212,175,55,0.16);
            border-radius: 100px;
            padding: 0.22rem 0.65rem;
          }
          .hero-nav {
            display: flex;
            gap: 0.6rem;
            flex-wrap: wrap;
            margin-bottom: 2.6rem;
          }

          /* macOS-style glass button */
          .glass-btn {
            display: inline-flex;
            align-items: center;
            padding: 0.52rem 1.2rem;
            background: rgba(255,255,255,0.05);
            backdrop-filter: blur(20px);
            -webkit-backdrop-filter: blur(20px);
            border: 0.5px solid rgba(255,255,255,0.11);
            border-radius: 100px;
            color: rgba(210,210,250,0.76);
            font-size: 0.86rem;
            font-weight: 500;
            text-decoration: none;
            transition: background 0.2s, border-color 0.2s, color 0.2s, box-shadow 0.2s;
            box-shadow: 0 1px 0 rgba(255,255,255,0.07) inset, 0 4px 12px rgba(0,0,0,0.24);
          }
          .glass-btn:hover {
            background: rgba(99,102,241,0.13);
            border-color: rgba(129,140,248,0.3);
            color: #b8bbff;
            box-shadow: 0 1px 0 rgba(255,255,255,0.09) inset, 0 6px 20px rgba(99,102,241,0.16);
          }
          .scroll-hint {
            display: flex;
            align-items: center;
            gap: 0.75rem;
            font-size: 0.7rem;
            font-weight: 500;
            letter-spacing: 0.1em;
            text-transform: uppercase;
            color: rgba(129,140,248,0.26);
          }
          .scroll-line {
            width: 1px; height: 28px;
            background: linear-gradient(to bottom, transparent, rgba(129,140,248,0.45), transparent);
            transform-origin: center;
          }

          /* ── Glass card — lightweight macOS style ──────────────────── */
          /* Reduced blur (24px vs 40px) and simplified shadows for performance */
          .glass-card {
            background: rgba(255,255,255,0.048);
            backdrop-filter: blur(24px) saturate(150%);
            -webkit-backdrop-filter: blur(24px) saturate(150%);
            border: 0.5px solid rgba(255,255,255,0.1);
            border-radius: 20px;
            box-shadow:
              0 1px 0 rgba(255,255,255,0.08) inset,
              0 8px 24px rgba(0,0,0,0.18),
              0 28px 56px rgba(0,0,0,0.28);
            transition: border-color 0.25s ease, box-shadow 0.25s ease, transform 0.25s ease;
          }
          .glass-card:hover {
            border-color: rgba(129,140,248,0.17);
            box-shadow:
              0 1px 0 rgba(255,255,255,0.09) inset,
              0 10px 28px rgba(0,0,0,0.2),
              0 36px 64px rgba(0,0,0,0.32),
              0 0 36px rgba(99,102,241,0.05);
          }

          /* ── Sections ──────────────────────────────────────────────── */
          .section { max-width: 960px; margin: 0 auto; padding: 6rem 2rem; }
          .pillars-section { padding: 5rem 2rem; }
          .section-label-wrap { display: flex; justify-content: center; margin-bottom: 1rem; }
          .section-label {
            display: inline-block;
            font-size: 0.67rem; font-weight: 700; letter-spacing: 0.18em;
            text-transform: uppercase;
            color: rgba(129,140,248,0.72);
            background: rgba(99,102,241,0.08);
            border: 0.5px solid rgba(99,102,241,0.18);
            border-radius: 100px;
            padding: 0.26rem 0.82rem;
          }
          .section-title {
            font-size: clamp(1.6rem, 3.2vw, 2.2rem); font-weight: 700;
            letter-spacing: -0.035em; line-height: 1.18; color: #f0f0ff;
            text-align: center; margin-bottom: 0.5rem;
          }
          .section-sub {
            font-size: 0.91rem; color: rgba(175,175,210,0.44);
            text-align: center; max-width: 480px;
            margin: 0 auto 2.6rem; line-height: 1.65;
          }

          /* ── Timeline ──────────────────────────────────────────────── */
          .timeline { position: relative; padding-left: 2rem; }
          .timeline::before {
            content: ''; position: absolute;
            left: 0; top: 12px; bottom: 12px; width: 0.5px;
            background: linear-gradient(to bottom, rgba(99,102,241,0.5) 0%, rgba(99,102,241,0.22) 40%, rgba(99,102,241,0.04) 100%);
          }
          .timeline-item { position: relative; margin-bottom: 1.2rem; }
          .timeline-dot {
            position: absolute; left: -2rem; top: 1.65rem;
            width: 7px; height: 7px; border-radius: 50%;
            background: #6366f1;
            box-shadow: 0 0 0 3px rgba(99,102,241,0.13), 0 0 10px rgba(99,102,241,0.5);
            transform: translateX(-3px);
          }
          .exp-card { padding: 1.7rem 2rem; }
          .exp-top {
            display: flex; justify-content: space-between;
            align-items: flex-start; gap: 1rem; flex-wrap: wrap; margin-bottom: 1rem;
          }
          .exp-role { font-size: 1.01rem; font-weight: 600; color: #e8e8f8; margin-bottom: 0.2rem; }
          .exp-company { font-size: 0.86rem; color: #818cf8; font-weight: 500; }
          .exp-meta { display: flex; flex-direction: column; align-items: flex-end; gap: 0.2rem; flex-shrink: 0; }
          .exp-period { font-size: 0.76rem; color: rgba(175,175,215,0.4); }
          .exp-location { font-size: 0.73rem; color: rgba(175,175,215,0.28); }

          /* ── Bullet list ───────────────────────────────────────────── */
          .bullet-list {
            list-style: none; padding: 0; margin: 0;
            color: rgba(195,195,228,0.6); font-size: 0.87rem; line-height: 1.82;
          }
          .bullet-list li { position: relative; padding-left: 1.1rem; margin-bottom: 0.28rem; }
          .bullet-list li::before {
            content: ''; position: absolute; left: 0; top: 0.7em;
            width: 3px; height: 3px; border-radius: 50%; background: rgba(99,102,241,0.55);
          }

          /* ── Pillars ───────────────────────────────────────────────── */
          .pillars-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(265px, 1fr)); gap: 1.1rem; }
          .pillar-card { padding: 2rem 1.8rem; position: relative; overflow: hidden; }
          .pillar-card::before {
            content: ''; position: absolute; top: 0; left: 0; right: 0; height: 1px;
            background: linear-gradient(90deg, transparent, rgba(255,255,255,0.09), transparent);
          }
          .pillar-num { font-size: 0.66rem; font-weight: 700; letter-spacing: 0.13em; color: rgba(99,102,241,0.38); margin-bottom: 0.9rem; }
          .pillar-title { font-size: 1.2rem; font-weight: 700; color: #eeeeff; margin-bottom: 0.26rem; letter-spacing: -0.025em; }
          .pillar-sub { font-size: 0.81rem; color: rgba(175,175,215,0.4); margin-bottom: 1.25rem; }
          .tag-row { display: flex; flex-wrap: wrap; gap: 0.36rem; }
          /* Tags — no backdrop-filter (lightweight) */
          .tag {
            background: rgba(99,102,241,0.09);
            border: 0.5px solid rgba(99,102,241,0.15);
            color: rgba(165,168,255,0.76);
            padding: 0.24rem 0.68rem; border-radius: 100px;
            font-size: 0.72rem; font-weight: 500;
            transition: background 0.18s, border-color 0.18s;
          }
          .tag:hover { background: rgba(99,102,241,0.16); border-color: rgba(99,102,241,0.26); }

          /* ── Projects ──────────────────────────────────────────────── */
          .projects-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(340px, 1fr)); gap: 1.1rem; }
          .project-card { padding: 1.9rem; position: relative; overflow: hidden; }
          .project-card::before {
            content: ''; position: absolute; top: 0; left: 0; right: 0; height: 1px;
            background: linear-gradient(90deg, transparent, rgba(255,255,255,0.08), transparent);
          }
          .project-period { font-size: 0.7rem; color: rgba(129,140,248,0.4); letter-spacing: 0.06em; margin-bottom: 0.5rem; }
          .project-name { font-size: 1.26rem; font-weight: 700; color: #eeeeff; letter-spacing: -0.025em; margin-bottom: 0.24rem; }
          .project-subtitle { font-size: 0.86rem; color: #818cf8; margin-bottom: 0.82rem; }
          .project-desc { font-size: 0.86rem; color: rgba(190,190,225,0.56); line-height: 1.68; margin-bottom: 0.72rem; }
          .project-tech { font-size: 0.73rem; color: rgba(155,155,200,0.33); line-height: 1.55; margin-bottom: 1.1rem; }
          .project-link { font-size: 0.83rem; font-weight: 600; color: rgba(129,140,248,0.72); text-decoration: none; display: inline-block; transition: color 0.18s; }
          .project-link:hover { color: #b8bbff; }

          /* ── Education ─────────────────────────────────────────────── */
          .edu-card { padding: 2rem; }
          .edu-degree { font-size: 1.08rem; font-weight: 700; color: #eeeeff; letter-spacing: -0.02em; margin-bottom: 0.32rem; }
          .edu-institution { font-size: 0.9rem; font-weight: 500; color: #818cf8; margin-bottom: 0.24rem; }
          .edu-majors { font-size: 0.84rem; color: rgba(175,175,215,0.44); margin-bottom: 0.2rem; }
          .edu-period { font-size: 0.78rem; color: rgba(175,175,215,0.3); margin-bottom: 1.1rem; }

          /* ── Certifications ────────────────────────────────────────── */
          .certs-row { display: flex; flex-wrap: wrap; gap: 0.72rem; justify-content: center; }
          /* Cert pills — no backdrop-filter (lightweight) */
          .cert-pill {
            background: rgba(255,255,255,0.04);
            border: 0.5px solid rgba(255,255,255,0.09);
            color: rgba(195,195,235,0.66);
            padding: 0.56rem 1.25rem; border-radius: 100px;
            font-size: 0.85rem; font-weight: 500;
            transition: border-color 0.2s, background 0.2s, color 0.2s;
          }
          .cert-pill:hover { background: rgba(99,102,241,0.1); border-color: rgba(99,102,241,0.24); color: rgba(185,188,255,0.86); }

          /* ── Footer ────────────────────────────────────────────────── */
          .footer { padding: 2rem 2rem 5rem; margin-top: 1rem; }
          .footer-glass {
            max-width: 500px; margin: 0 auto;
            background: rgba(255,255,255,0.032);
            backdrop-filter: blur(24px);
            -webkit-backdrop-filter: blur(24px);
            border: 0.5px solid rgba(255,255,255,0.08);
            border-radius: 22px; padding: 2.4rem 2rem; text-align: center;
            box-shadow: 0 1px 0 rgba(255,255,255,0.06) inset, 0 24px 52px rgba(0,0,0,0.32);
          }
          .footer-logo { display: flex; align-items: center; justify-content: center; gap: 0.55rem; margin-bottom: 1rem; }
          .footer-logo-text {
            font-size: 1.05rem; font-weight: 700; letter-spacing: -0.04em;
            background: linear-gradient(135deg, #f5d97e 0%, #d4af37 100%);
            background-clip: text; -webkit-background-clip: text; -webkit-text-fill-color: transparent;
          }
          /* Slower, no-glow cube in footer */
          .footer-logo .ice-cube { animation-duration: 14s; }
          .footer-logo .cube-scene::after { display: none; }
          .footer-quote { font-size: 1.04rem; font-weight: 600; color: rgba(165,168,255,0.68); margin-bottom: 1.25rem; letter-spacing: -0.01em; }
          .footer-nav { display: flex; gap: 2rem; justify-content: center; margin-bottom: 0.65rem; flex-wrap: wrap; }
          .footer-nav a { color: rgba(155,158,255,0.48); text-decoration: none; font-size: 0.86rem; transition: color 0.2s; }
          .footer-nav a:hover { color: rgba(185,188,255,0.86); }
          .footer-contact { font-size: 0.76rem; color: rgba(155,158,255,0.26); }

          /* ── Reduced motion — disable all decorative animations ────── */
          @media (prefers-reduced-motion: reduce) {
            .ice-cube, .face, .face-top, .face-bottom,
            .hero-orb, .banner-dot, .cube-scene::after { animation: none !important; }
            .scroll-line { animation: none !important; }
            .loading-inner { animation: none !important; }
          }

          /* ── Responsive ────────────────────────────────────────────── */
          @media (max-width: 768px) {
            .hero { min-height: 100svh; padding: 1.5rem 1.25rem; padding-top: 4.5rem; justify-content: center; }
            .hero-content { text-align: center; }
            .hero-name { font-size: clamp(2.4rem, 10vw, 3.2rem); }
            .hero-role-pill { font-size: 0.72rem; }
            .hero-summary { font-size: 0.92rem; text-align: center; }
            .hero-industries { justify-content: center; }
            .hero-nav { justify-content: center; }
            .scroll-hint { justify-content: center; }
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
          @media (max-width: 480px) {
            .hero { padding: 1rem 0.9rem; padding-top: 4rem; }
            .hero-nav { gap: 0.42rem; }
            .glass-btn { padding: 0.46rem 0.9rem; font-size: 0.79rem; }
            .section { padding: 3rem 1rem; }
            .pillars-section { padding: 3rem 1rem; }
            /* Disable backdrop-filter on mobile for performance */
            .glass-card { backdrop-filter: none; -webkit-backdrop-filter: none; background: rgba(20,20,35,0.82); }
            .glass-btn { backdrop-filter: none; -webkit-backdrop-filter: none; }
            .footer-glass { backdrop-filter: none; -webkit-backdrop-filter: none; background: rgba(20,20,35,0.82); }
          }
        `}</style>
      </div>
    </>
  )
}

export default App
