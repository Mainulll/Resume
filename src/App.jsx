import { useState, useEffect, useRef, Suspense, lazy } from 'react'
import { motion, useInView, useScroll, useTransform, useMotionValue, useSpring } from 'framer-motion'

// Improvement 1: lazy-load the heavy Three.js bundle into its own chunk
const Scene3D = lazy(() => import('./Scene3D'))

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
  summary: `Versatile early-career professional with experience across engineering, technology, and education. Strong client-facing and back-end capabilities, combining data-driven thinking with exceptional people skills. A people-focused team player who thrives in dynamic environments, with a genuine passion for technology, AI, cloud, and data analytics.`,
  message: `Final year Business Analytics & Cybersecurity student at Monash. Bridging technical depth with business outcomes through automation, data visualisation, and cross-functional collaboration. Seeking to break into Consulting.`,
  experience: [
    {
      role: 'Supply Chain Planner',
      company: 'BSH Home Appliances Australia',
      period: 'Jan 2026 – Present',
      location: 'Clayton, VIC (Hybrid)',
      highlights: [
        'Build Power BI dashboards and data visualisations to surface trends and improvement opportunities',
        'Create large Excel workbooks with VBA macros to automate reporting and workflow processes',
        'Automate reports and daily processes in Excel and SAP to improve functional efficiency',
        'Track key-account stock, escalate risks early, and optimise national flow',
        'Partner with Sales, Customer Service, and internal teams for smarter allocation',
        'Support cost and business cases with commercially focused analysis and recommendations',
      ],
    },
    {
      role: 'Procurement & Supply Chain Project Coordinator',
      company: 'Cummins Asia Pacific',
      period: 'Jan 2025 – Jan 2026',
      location: 'Melbourne, VIC (Hybrid)',
      highlights: [
        'Build Python scripts and tools to streamline workflows between engineering, supply chain, and commercial teams',
        'Design Power BI dashboards and Excel workbooks with VBA macros to improve data quality and operational efficiency',
        'Lead RFQ processes, supplier engagement, and capability analysis across APAC',
        'Drive cost-saving and supply-continuity initiatives through data-driven analysis',
      ],
    },
    {
      role: 'Research Assistant',
      company: 'Monash University VARS Lab',
      period: 'Jun 2024 – Dec 2024',
      location: 'Melbourne, VIC (Hybrid)',
      highlights: [
        'Designed Python-based data pipelines to clean and segment large behavioural datasets',
        'Produced structured reports and visualisations for evidence-based decisions',
        'Documented processes and analysis methods for team reuse',
      ],
    },
    {
      role: 'Technical Support Analyst',
      company: "You'reOnTime",
      period: 'Feb 2023 – May 2024',
      location: 'Remote',
      highlights: [
        'Supported cloud-based booking platform, coordinating product setup and digital campaigns',
        'Analysed customer usage and campaign performance data to identify trends',
        'Data migration, application testing, and SEO optimisation',
      ],
    },
    {
      role: 'Project Manager',
      company: 'Borealis Creative Group',
      period: 'Dec 2021 – Dec 2022',
      location: 'Freelance',
      highlights: [
        'Led design and deployment of multiple custom websites across franchises',
        'Managed software ecosystems to create and deploy digital assets',
        'Initiated B2B relationships and deployed advertising campaigns',
      ],
    },
  ],
  projects: [
    {
      name: 'Previa',
      subtitle: 'AI Financial Intelligence Platform',
      period: '2025 – Present',
      description: 'Co-built a full-stack, AI-driven financial intelligence MVP automating receipt reconciliation, bank statement processing, and transaction matching.',
      tech: 'React 18, TypeScript, Vite, Chakra UI, Supabase, Python, LLMs (Mistral, Gemini, GPT-4o), n8n, AG-Grid',
      link: 'https://github.com/demigod97/Previa-2.0',
      linkLabel: 'View on GitHub',
    },
    {
      name: 'Borealis Creative Group',
      subtitle: 'Digital Marketing & Web Projects',
      period: 'Dec 2021 – Dec 2022',
      description: 'Managed digital projects, custom websites, and content campaigns with SEO and analytics.',
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
      'Innovation for Impact Award (2024) – responsible AI and sustainability solutions',
      'Global Immersion Guarantee (Fiji) – waste-management solutions aligned with UN SDGs',
      'Monash Innovation Guarantee (Microsoft) – responsible AI–infused student experience',
    ],
  },
  certifications: [
    'Certified Procurement Professional (CPP) — Cummins',
    'IQTM Yellow Belt (Lean Six Sigma) — Cummins',
    'Six Sigma Foundations — Skillsoft',
  ],
  openTo: 'Open to Consulting, Business Analytics & Supply Chain roles',
  sectionSubtext: {
    experience: 'Each role reflects a commitment to automation, perspective, and transformation.',
    projects: 'Building solutions that bridge technical depth with business impact.',
    skills: 'An honest breakdown of capabilities and focus areas.',
  },
  skillPillars: [
    {
      title: 'Automation',
      subtitle: 'Streamline & scale',
      items: ['Python', 'Power BI', 'VBA Macros', 'Data Pipelines', 'n8n', 'REST APIs'],
    },
    {
      title: 'Perspective',
      subtitle: 'Technical meets human',
      items: ['Stakeholder Management', 'Cross-functional Liaison', 'Technical Communication', 'Analytics-driven Decisions'],
    },
    {
      title: 'Transformation',
      subtitle: 'Process & people',
      items: ['Process Optimisation', 'Cost-saving Initiatives', 'New Reporting Frameworks', 'Responsible AI'],
    },
  ],
}

const ease = [0.22, 1, 0.36, 1]
const fadeUp = { initial: { opacity: 0, y: 28 }, animate: { opacity: 1, y: 0 } }
const stagger = { animate: { transition: { staggerChildren: 0.07, delayChildren: 0.05 } } }

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

function SectionLabel({ children }) {
  return (
    <div className="section-label-wrap">
      <span className="section-label">{children}</span>
    </div>
  )
}

function App() {
  const containerRef = useRef(null)
  const { scrollYProgress } = useScroll({ target: containerRef, offset: ['start start', 'end end'] })
  const heroScale = useTransform(scrollYProgress, [0, 0.12], [1, 0.94])
  const heroOpacity = useTransform(scrollYProgress, [0, 0.1], [1, 0])
  const parallaxY = useTransform(scrollYProgress, [0, 0.25], [0, 60])

  return (
    <div ref={containerRef} className="app">

      {/* Improvement 3: scroll progress bar using existing scrollYProgress */}
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

      {/* ── Hero ─────────────────────────────────────────────────────────── */}
      <motion.header style={{ scale: heroScale, opacity: heroOpacity }} className="hero">
        <Suspense fallback={null}>
          <Scene3D />
        </Suspense>

        {/* Atmospheric orbs */}
        <div className="hero-orb orb-1" />
        <div className="hero-orb orb-2" />
        <div className="hero-orb orb-3" />

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

          <motion.nav
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 3.2 }}
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
            transition={{ delay: 3.5 }}
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

      {/* ── Experience ───────────────────────────────────────────────────── */}
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

      {/* ── Pillars ──────────────────────────────────────────────────────── */}
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

      {/* ── Projects ─────────────────────────────────────────────────────── */}
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

      {/* ── Education ────────────────────────────────────────────────────── */}
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

      {/* ── Certifications ───────────────────────────────────────────────── */}
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

      {/* ── Footer ───────────────────────────────────────────────────────── */}
      {/* Improvement 2: all external links get target="_blank" rel="noopener noreferrer" */}
      <footer className="footer">
        <div className="footer-glass">
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
        /* ── Base ─────────────────────────────────────────────────────── */
        .app {
          position: relative;
          min-height: 100vh;
          /* Deep space background with indigo nebula glows — inspired by Harness dark + Beside radial gradients */
          background:
            radial-gradient(ellipse 100% 60% at 50% -8%, rgba(99,102,241,0.28) 0%, transparent 62%),
            radial-gradient(ellipse 60% 45% at 88% 72%, rgba(139,92,246,0.18) 0%, transparent 55%),
            radial-gradient(ellipse 50% 35% at 12% 58%, rgba(79,70,229,0.12) 0%, transparent 50%),
            radial-gradient(ellipse 40% 30% at 55% 90%, rgba(109,40,217,0.1) 0%, transparent 50%),
            #06060f;
          color: #e4e4f0;
        }

        /* ── Scroll progress (Improvement 3) ─────────────────────────── */
        .scroll-progress {
          position: fixed;
          top: 0; left: 0; right: 0;
          height: 2px;
          background: linear-gradient(90deg, #6366f1 0%, #a78bfa 50%, #c4b5fd 100%);
          transform-origin: 0%;
          z-index: 300;
        }

        /* ── Cursor glow ──────────────────────────────────────────────── */
        .cursor-glow {
          position: fixed;
          width: 520px; height: 520px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(99,102,241,0.055) 0%, transparent 65%);
          pointer-events: none;
          z-index: 0;
        }
        @media (hover: none) { .cursor-glow { display: none; } }

        /* ── Banner ───────────────────────────────────────────────────── */
        .open-banner {
          position: fixed;
          top: 0; left: 0; right: 0;
          padding: 0.6rem 1.5rem;
          background: rgba(10,8,30,0.7);
          backdrop-filter: blur(16px) saturate(160%);
          -webkit-backdrop-filter: blur(16px) saturate(160%);
          border-bottom: 1px solid rgba(99,102,241,0.2);
          text-align: center;
          font-size: 0.82rem;
          color: rgba(165,168,255,0.82);
          text-decoration: none;
          z-index: 200;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.65rem;
          letter-spacing: 0.015em;
          transition: background 0.2s;
        }
        .open-banner:hover { background: rgba(20,15,50,0.8); color: rgba(185,188,255,0.95); }
        .banner-dot {
          width: 6px; height: 6px;
          border-radius: 50%;
          background: #818cf8;
          box-shadow: 0 0 10px rgba(129,140,248,0.9), 0 0 20px rgba(129,140,248,0.4);
          flex-shrink: 0;
          animation: dot-pulse 2.4s ease-in-out infinite;
        }
        @keyframes dot-pulse {
          0%, 100% { opacity: 1; box-shadow: 0 0 10px rgba(129,140,248,0.9), 0 0 20px rgba(129,140,248,0.4); }
          50% { opacity: 0.5; box-shadow: 0 0 6px rgba(129,140,248,0.5); }
        }

        /* ── Hero ─────────────────────────────────────────────────────── */
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
        /* 3D canvas */
        .scene-3d {
          position: absolute;
          inset: 0;
          z-index: 0;
          pointer-events: none;
          overflow: hidden;
        }
        .scene-3d canvas { width: 100% !important; height: 100% !important; }
        @media (max-width: 768px), (prefers-reduced-motion: reduce) { .scene-3d { display: none; } }

        /* Atmospheric background orbs */
        .hero-orb {
          position: absolute;
          border-radius: 50%;
          pointer-events: none;
          filter: blur(90px);
        }
        .orb-1 {
          width: 700px; height: 700px;
          background: radial-gradient(circle, rgba(99,102,241,0.16) 0%, transparent 65%);
          top: -250px; right: -150px;
        }
        .orb-2 {
          width: 450px; height: 450px;
          background: radial-gradient(circle, rgba(139,92,246,0.13) 0%, transparent 65%);
          bottom: -120px; left: -80px;
        }
        .orb-3 {
          width: 300px; height: 300px;
          background: radial-gradient(circle, rgba(167,139,250,0.1) 0%, transparent 65%);
          top: 40%; right: 25%;
        }

        .hero-content {
          position: relative;
          z-index: 1;
          max-width: 660px;
        }
        .hero-eyebrow {
          font-size: 0.75rem;
          font-weight: 600;
          letter-spacing: 0.15em;
          text-transform: uppercase;
          color: rgba(129,140,248,0.55);
          margin-bottom: 1rem;
        }
        .hero-name {
          font-size: clamp(2.8rem, 7.5vw, 5.2rem);
          font-weight: 700;
          letter-spacing: -0.04em;
          line-height: 1.04;
          color: #f0f0ff;
          margin-bottom: 1.25rem;
        }
        .cursor-blink {
          color: #818cf8;
          margin-left: 3px;
          font-weight: 300;
        }
        .hero-role-pill {
          display: inline-block;
          background: rgba(99,102,241,0.1);
          border: 1px solid rgba(99,102,241,0.22);
          backdrop-filter: blur(8px);
          -webkit-backdrop-filter: blur(8px);
          border-radius: 100px;
          padding: 0.45rem 1rem;
          font-size: 0.78rem;
          color: rgba(165,168,255,0.85);
          margin-bottom: 1.25rem;
          letter-spacing: 0.01em;
          line-height: 1.5;
        }
        .hero-summary {
          font-size: 1rem;
          line-height: 1.72;
          color: rgba(200,200,230,0.6);
          margin-bottom: 2rem;
          max-width: 560px;
        }
        .hero-nav {
          display: flex;
          gap: 0.6rem;
          flex-wrap: wrap;
          margin-bottom: 2.75rem;
        }

        /* Glass button — inspired by Apple liquid glass + Sonder's subtle glass cards */
        .glass-btn {
          display: inline-flex;
          align-items: center;
          padding: 0.55rem 1.25rem;
          background: rgba(255,255,255,0.055);
          backdrop-filter: blur(20px) saturate(160%);
          -webkit-backdrop-filter: blur(20px) saturate(160%);
          border: 1px solid rgba(255,255,255,0.11);
          border-radius: 100px;
          color: rgba(210,210,250,0.8);
          font-size: 0.87rem;
          font-weight: 500;
          text-decoration: none;
          transition: background 0.2s, border-color 0.2s, color 0.2s, box-shadow 0.2s;
          box-shadow: 0 1px 0 rgba(255,255,255,0.07) inset, 0 4px 12px rgba(0,0,0,0.25);
        }
        .glass-btn:hover {
          background: rgba(99,102,241,0.16);
          border-color: rgba(129,140,248,0.35);
          color: #b8bbff;
          box-shadow: 0 1px 0 rgba(255,255,255,0.1) inset, 0 8px 24px rgba(99,102,241,0.2);
        }

        .scroll-hint {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          font-size: 0.72rem;
          font-weight: 500;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: rgba(129,140,248,0.3);
        }
        .scroll-line {
          width: 1px;
          height: 32px;
          background: linear-gradient(to bottom, transparent, rgba(129,140,248,0.55), transparent);
          transform-origin: center;
        }

        /* ── Glass card (shared base) ─────────────────────────────────── */
        /* Inspired by Apple Vision Pro frosted glass + Sonder's backdrop-filter cards */
        .glass-card {
          background: rgba(255,255,255,0.032);
          backdrop-filter: blur(28px) saturate(160%);
          -webkit-backdrop-filter: blur(28px) saturate(160%);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 22px;
          box-shadow:
            0 1px 0 rgba(255,255,255,0.08) inset,
            0 -1px 0 rgba(0,0,0,0.2) inset,
            0 24px 56px rgba(0,0,0,0.38),
            0 0 0 0.5px rgba(255,255,255,0.04);
          transition: border-color 0.25s ease, box-shadow 0.25s ease, transform 0.25s ease;
        }
        .glass-card:hover {
          border-color: rgba(129,140,248,0.2);
          box-shadow:
            0 1px 0 rgba(255,255,255,0.1) inset,
            0 -1px 0 rgba(0,0,0,0.2) inset,
            0 32px 72px rgba(0,0,0,0.45),
            0 0 0 0.5px rgba(99,102,241,0.12),
            0 0 40px rgba(99,102,241,0.06);
        }

        /* ── Sections ─────────────────────────────────────────────────── */
        .section {
          max-width: 960px;
          margin: 0 auto;
          padding: 6rem 2rem;
        }
        .pillars-section { padding: 5rem 2rem; }

        .section-label-wrap {
          display: flex;
          justify-content: center;
          margin-bottom: 1rem;
        }
        .section-label {
          display: inline-block;
          font-size: 0.7rem;
          font-weight: 700;
          letter-spacing: 0.16em;
          text-transform: uppercase;
          color: rgba(129,140,248,0.8);
          background: rgba(99,102,241,0.1);
          border: 1px solid rgba(99,102,241,0.2);
          border-radius: 100px;
          padding: 0.3rem 0.85rem;
        }
        .section-title {
          font-size: clamp(1.65rem, 3.2vw, 2.25rem);
          font-weight: 700;
          letter-spacing: -0.03em;
          line-height: 1.18;
          color: #f0f0ff;
          text-align: center;
          margin-bottom: 0.55rem;
        }
        .section-sub {
          font-size: 0.92rem;
          color: rgba(175,175,210,0.5);
          text-align: center;
          max-width: 480px;
          margin: 0 auto 2.75rem;
          line-height: 1.65;
        }

        /* ── Timeline ─────────────────────────────────────────────────── */
        .timeline {
          position: relative;
          padding-left: 2rem;
        }
        .timeline::before {
          content: '';
          position: absolute;
          left: 0;
          top: 12px;
          bottom: 12px;
          width: 1px;
          background: linear-gradient(
            to bottom,
            rgba(99,102,241,0.6) 0%,
            rgba(99,102,241,0.3) 40%,
            rgba(99,102,241,0.05) 100%
          );
        }
        .timeline-item { position: relative; margin-bottom: 1.25rem; }
        .timeline-dot {
          position: absolute;
          left: -2rem;
          top: 1.65rem;
          width: 8px; height: 8px;
          border-radius: 50%;
          background: #6366f1;
          box-shadow: 0 0 0 3px rgba(99,102,241,0.15), 0 0 14px rgba(99,102,241,0.6);
          transform: translateX(-3.5px);
        }
        .exp-card { padding: 1.75rem 2rem; }
        .exp-top {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          gap: 1rem;
          flex-wrap: wrap;
          margin-bottom: 1rem;
        }
        .exp-role {
          font-size: 1.02rem;
          font-weight: 600;
          color: #e8e8f8;
          margin-bottom: 0.2rem;
        }
        .exp-company {
          font-size: 0.88rem;
          color: #818cf8;
          font-weight: 500;
        }
        .exp-meta {
          display: flex;
          flex-direction: column;
          align-items: flex-end;
          gap: 0.2rem;
          flex-shrink: 0;
        }
        .exp-period {
          font-size: 0.78rem;
          color: rgba(175,175,215,0.45);
        }
        .exp-location {
          font-size: 0.75rem;
          color: rgba(175,175,215,0.32);
        }

        /* Shared bullet list */
        .bullet-list {
          list-style: none;
          padding: 0;
          margin: 0;
          color: rgba(195,195,228,0.65);
          font-size: 0.88rem;
          line-height: 1.82;
        }
        .bullet-list li {
          position: relative;
          padding-left: 1.1rem;
          margin-bottom: 0.28rem;
        }
        .bullet-list li::before {
          content: '';
          position: absolute;
          left: 0;
          top: 0.7em;
          width: 3.5px; height: 3.5px;
          border-radius: 50%;
          background: rgba(99,102,241,0.65);
        }

        /* ── Pillars ──────────────────────────────────────────────────── */
        .pillars-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(265px, 1fr));
          gap: 1.2rem;
        }
        .pillar-card {
          padding: 2.1rem 1.85rem;
          position: relative;
          overflow: hidden;
        }
        /* Specular highlight — Apple glass edge catch */
        .pillar-card::before {
          content: '';
          position: absolute;
          top: 0; left: 0; right: 0;
          height: 1px;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.12), transparent);
        }
        .pillar-num {
          font-size: 0.68rem;
          font-weight: 700;
          letter-spacing: 0.12em;
          color: rgba(99,102,241,0.45);
          margin-bottom: 0.9rem;
        }
        .pillar-title {
          font-size: 1.25rem;
          font-weight: 700;
          color: #eeeeff;
          margin-bottom: 0.28rem;
          letter-spacing: -0.02em;
        }
        .pillar-sub {
          font-size: 0.82rem;
          color: rgba(175,175,215,0.45);
          margin-bottom: 1.3rem;
        }
        .tag-row { display: flex; flex-wrap: wrap; gap: 0.4rem; }
        .tag {
          background: rgba(99,102,241,0.1);
          border: 1px solid rgba(99,102,241,0.16);
          color: rgba(165,168,255,0.8);
          padding: 0.28rem 0.72rem;
          border-radius: 100px;
          font-size: 0.74rem;
          font-weight: 500;
          transition: background 0.18s, border-color 0.18s;
        }
        .tag:hover {
          background: rgba(99,102,241,0.18);
          border-color: rgba(99,102,241,0.3);
        }

        /* ── Projects ─────────────────────────────────────────────────── */
        .projects-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(340px, 1fr));
          gap: 1.2rem;
        }
        .project-card {
          padding: 2rem;
          position: relative;
          overflow: hidden;
        }
        .project-card::before {
          content: '';
          position: absolute;
          top: 0; left: 0; right: 0;
          height: 1px;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.11), transparent);
        }
        .project-period {
          font-size: 0.72rem;
          color: rgba(129,140,248,0.45);
          letter-spacing: 0.06em;
          margin-bottom: 0.55rem;
        }
        .project-name {
          font-size: 1.3rem;
          font-weight: 700;
          color: #eeeeff;
          letter-spacing: -0.025em;
          margin-bottom: 0.25rem;
        }
        .project-subtitle {
          font-size: 0.88rem;
          color: #818cf8;
          margin-bottom: 0.85rem;
        }
        .project-desc {
          font-size: 0.88rem;
          color: rgba(190,190,225,0.6);
          line-height: 1.68;
          margin-bottom: 0.75rem;
        }
        .project-tech {
          font-size: 0.75rem;
          color: rgba(155,155,200,0.38);
          line-height: 1.55;
          margin-bottom: 1.1rem;
        }
        .project-link {
          font-size: 0.85rem;
          font-weight: 600;
          color: rgba(129,140,248,0.8);
          text-decoration: none;
          display: inline-block;
          transition: color 0.18s;
        }
        .project-link:hover { color: #b8bbff; }

        /* ── Education ────────────────────────────────────────────────── */
        .edu-card { padding: 2.1rem 2rem; }
        .edu-degree {
          font-size: 1.12rem;
          font-weight: 700;
          color: #eeeeff;
          letter-spacing: -0.02em;
          margin-bottom: 0.35rem;
        }
        .edu-institution {
          font-size: 0.92rem;
          font-weight: 500;
          color: #818cf8;
          margin-bottom: 0.25rem;
        }
        .edu-majors {
          font-size: 0.86rem;
          color: rgba(175,175,215,0.5);
          margin-bottom: 0.2rem;
        }
        .edu-period {
          font-size: 0.8rem;
          color: rgba(175,175,215,0.35);
          margin-bottom: 1.1rem;
        }

        /* ── Certifications ───────────────────────────────────────────── */
        .certs-row {
          display: flex;
          flex-wrap: wrap;
          gap: 0.75rem;
          justify-content: center;
        }
        .cert-pill {
          background: rgba(255,255,255,0.036);
          border: 1px solid rgba(255,255,255,0.08);
          backdrop-filter: blur(14px);
          -webkit-backdrop-filter: blur(14px);
          color: rgba(195,195,235,0.7);
          padding: 0.6rem 1.3rem;
          border-radius: 100px;
          font-size: 0.86rem;
          font-weight: 500;
          transition: border-color 0.2s, background 0.2s, color 0.2s;
        }
        .cert-pill:hover {
          background: rgba(99,102,241,0.1);
          border-color: rgba(99,102,241,0.28);
          color: rgba(185,188,255,0.9);
        }

        /* ── Footer ───────────────────────────────────────────────────── */
        .footer {
          padding: 2rem 2rem 5rem;
          margin-top: 1rem;
        }
        .footer-glass {
          max-width: 560px;
          margin: 0 auto;
          background: rgba(255,255,255,0.028);
          backdrop-filter: blur(24px);
          -webkit-backdrop-filter: blur(24px);
          border: 1px solid rgba(255,255,255,0.07);
          border-radius: 26px;
          padding: 2.5rem 2rem;
          text-align: center;
          box-shadow:
            0 1px 0 rgba(255,255,255,0.07) inset,
            0 24px 56px rgba(0,0,0,0.35);
        }
        .footer-quote {
          font-size: 1.08rem;
          font-weight: 600;
          color: rgba(165,168,255,0.75);
          margin-bottom: 1.3rem;
          letter-spacing: -0.01em;
        }
        .footer-nav {
          display: flex;
          gap: 2rem;
          justify-content: center;
          margin-bottom: 0.7rem;
          flex-wrap: wrap;
        }
        .footer-nav a {
          color: rgba(155,158,255,0.55);
          text-decoration: none;
          font-size: 0.88rem;
          transition: color 0.2s;
        }
        .footer-nav a:hover { color: rgba(185,188,255,0.9); }
        .footer-contact {
          font-size: 0.78rem;
          color: rgba(155,158,255,0.3);
        }

        /* ── Responsive ───────────────────────────────────────────────── */
        @media (max-width: 768px) {
          .hero {
            min-height: 100svh;
            padding: 1.5rem 1.25rem;
            padding-top: 4.5rem;
            justify-content: center;
          }
          .hero-content { text-align: center; }
          .hero-name { font-size: clamp(2.4rem, 10vw, 3.2rem); }
          .hero-role-pill { font-size: 0.73rem; }
          .hero-summary { font-size: 0.93rem; text-align: center; }
          .hero-nav { justify-content: center; }
          .scroll-hint { justify-content: center; }
          .section { padding: 4rem 1.25rem; }
          .pillars-section { padding: 4rem 1.25rem; }
          .pillars-grid { grid-template-columns: 1fr; }
          .projects-grid { grid-template-columns: 1fr; }
          .timeline { padding-left: 1.5rem; }
          .timeline-dot { left: -1.5rem; }
          .exp-card { padding: 1.25rem 1.25rem; }
          .exp-top { flex-direction: column; gap: 0.4rem; }
          .exp-meta { align-items: flex-start; }
          .section-title { font-size: 1.5rem; }
          .footer-glass { padding: 2rem 1.25rem; }
          .footer-nav { gap: 1.25rem; }
        }
        @media (max-width: 480px) {
          .hero { padding: 1rem 0.9rem; padding-top: 4rem; }
          .hero-nav { gap: 0.45rem; }
          .glass-btn { padding: 0.48rem 0.95rem; font-size: 0.8rem; }
          .section { padding: 3rem 1rem; }
          .pillars-section { padding: 3rem 1rem; }
        }
      `}</style>
    </div>
  )
}

export default App
