import { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

/* ── Resume Data ──────────────────────────────────────────────────── */
const data = {
  name: 'Minul Lokuliyana',
  resumePdf: '/MinulLokuliyana_Resume.pdf',
  location: 'Melbourne, Australia',
  role: 'Business Analytics & Cybersecurity · Monash University',
  openTo: 'Open to graduate roles — project & programme management, analytics, strategy · Nov 2026',
  pitch: "I run cross-functional projects — the kind that need someone who can sit with engineers, suppliers, and senior stakeholders and get them aligned, then build the tooling when waiting isn't faster. Six industries, 11+ years of leadership, currently coordinating procurement and inventory at BSH while finishing dual degrees in Business Analytics and Cybersecurity at Monash.",
  contact: {
    email: 'minullokuliyana@hotmail.com',
    mobile: '+61 402 528 040',
    linkedin: 'https://linkedin.com/in/minull',
    github: 'https://github.com/Mainulll',
    website: 'https://minul.vercel.app',
  },
  experience: [
    {
      role: 'Supply Chain Planner',
      company: 'BSH Home Appliances Australia',
      period: 'Jan 2026 – Present',
      location: 'Melbourne, VIC',
      bullets: [
        'Own $50M+ of national inventory across AU/NZ for Bosch, Siemens, Neff, and Gaggenau in SAP — stock transfers, allocations, project reservations, 3PL coordination — driving backorder rates down.',
        'Built the Customer Level Forecasting tool and a Python pipeline replacing the legacy PSI Tool import, consolidating retailer forecasts across national accounts and cutting data processing from hours to minutes.',
        'Partner with procurement and sales to ship Power BI dashboards, Excel/VBA automation, and Python reporting across 500+ SKUs — manual reporting down ~25%.',
        'Run cost-benefit analyses and scenario plans behind procurement recommendations; led inventory audits and master-data validation across 3 DCs for senior stakeholders.',
      ],
    },
    {
      role: 'Procurement and Supply Chain Project Coordinator',
      company: 'Cummins Asia Pacific',
      period: 'Jan 2025 – Jan 2026',
      location: 'Melbourne, VIC',
      bullets: [
        'Coordinated two concurrent development programmes for regional markets, owning on-time delivery across cross-functional engineering teams and multiple workstreams.',
        'Led end-to-end RFQs with 30+ suppliers — capability benchmarking, risk assessment, commercial negotiation — landing cost-reduction initiatives that contributed six-figure annual savings.',
        'Built Python automation and agentic AI workflows across 3 functions; designed Power BI dashboards lifting programme visibility for APAC procurement across 10+ markets and 50+ categories.',
      ],
    },
    {
      role: 'Research Assistant',
      company: 'Monash University VARS Lab',
      period: 'Jun 2024 – Dec 2024',
      location: 'Melbourne, VIC',
      bullets: [
        'Designed Python and R data pipelines processing 100K+ records through hypothesis-driven analysis, improving throughput 3× and contributing to one peer-reviewed publication.',
      ],
    },
    {
      role: 'Product Demonstrator and Content Creator',
      company: 'Dyson',
      period: 'Aug 2022 – Sep 2024',
      location: 'Melbourne, VIC',
      bullets: [
        'Ranked #1 nationally in sales for two consecutive years; broke the single-day floorcare sales record.',
        'Selected as exclusive content creator for branded launches — the role rewards turning technical product detail into customer language at speed.',
      ],
    },
    {
      role: 'Technical Support Analyst',
      company: 'YoureOnTime',
      period: 'Feb 2023 – May 2024',
      location: 'Melbourne, VIC',
      bullets: [
        'Owned client onboarding, data migration, and campaign coordination for a cloud SaaS platform across 200+ SME clients; insights drove 15%+ engagement uplift.',
      ],
    },
  ],
  pillars: [
    {
      title: 'Programme & Project Management',
      items: ['Programme delivery', 'Stakeholder engagement', 'Risk assessment', 'Cost-benefit analysis', 'Scenario planning', 'Cross-functional coordination', 'Lean Six Sigma', 'Agile', 'Procurement strategy'],
    },
    {
      title: 'Data & Engineering',
      items: ['Python', 'R', 'SQL', 'Excel / VBA', 'Power Query', 'Power Pivot', 'Power BI', 'Tableau', 'SAP ERP', 'Git', 'React', 'React Native', 'TypeScript', 'HTML / CSS', 'Supabase'],
    },
    {
      title: 'AI & Automation',
      items: ['Prompt engineering', 'Agentic AI workflows', 'LLM integration', 'GPT-4o', 'Mistral', 'Gemini', 'Process automation', 'Data pipelines'],
    },
    {
      title: 'Cloud, Tooling & Certifications',
      items: ['Azure', 'AWS', 'GCP', 'Docker', 'Kubernetes', 'Kali Linux', 'Burp Suite', 'Salesforce', 'Jira', 'Confluence', 'ServiceNow', 'CPP', 'Lean Six Sigma Yellow Belt'],
    },
  ],
  projects: [
    {
      name: 'Previa',
      subtitle: 'AI Financial Intelligence Platform',
      role: 'Co-Founder',
      description: 'Co-founded and shipped an AI platform that reconciles receipts for small businesses at 90%+ accuracy. Owned product, engineering, and go-to-market end-to-end.',
      tech: 'React · TypeScript · Supabase · Python · LLMs',
      link: 'https://github.com/demigod97/Previa-2.0',
      linkLabel: 'View on GitHub',
    },
    {
      name: 'GymBro',
      subtitle: 'AI-Powered Fitness App',
      role: 'Solo Developer',
      description: 'Solo build of an offline-first mobile fitness app on React Native + Expo. Most of the implementation came from agentic AI under my direction — the workflow itself is the project.',
      tech: 'React Native · Expo · TypeScript · SQLite · Zustand · Firebase',
      link: 'https://github.com/Mainulll/Gymbro-App',
      linkLabel: 'View on GitHub',
    },
    {
      name: 'Borealis Creative Group',
      subtitle: 'Digital Strategy',
      role: 'Project Lead',
      description: 'Led concurrent digital programmes for franchise clients — web build, SEO, paid media. Lifted organic traffic 40% across the portfolio.',
      tech: 'Figma · Web design · SEO · Analytics',
      link: 'https://docs.google.com/document/d/1s_JRAy8o3LNFfrVgoeCC3s_PzByHTtMg6zqxtgM6BxU/edit?tab=t.0',
      linkLabel: 'View Demos',
    },
  ],
  education: {
    degree: 'Bachelor of Information Technology and Bachelor of Commerce (Double Degree)',
    institution: 'Monash University',
    period: 'Jul 2022 – Nov 2026 (expected)',
    majors: 'Business Analytics · Cybersecurity',
    coursework: 'Coursework: machine learning, econometrics, statistical modelling, data visualisation, database systems, risk management.',
    highlights: [
      'Innovation for Impact Award (2024) — university-wide AI design award, judged on commercial viability, technical rigour, and societal impact.',
      'Global Immersion (Fiji) + Innovation Guarantee (Microsoft) — led two cross-cultural consulting engagements: UN SDG-aligned project delivery and AI-driven stakeholder experience prototypes.',
    ],
  },
  leadership: [
    {
      title: 'Programme Coordinator',
      org: 'Preflight STEM Initiative',
      period: '2024–Present',
      description: 'Founder. Self-funded STEM outreach for underrepresented students in Sri Lanka — I run the volunteer team, the curriculum, and the programme delivery.',
    },
    {
      title: 'Officer',
      org: 'Australian Air League',
      period: '2014–Present',
      description: '11+ years of youth leadership in aviation and civic education within a defence-aligned organisation. Mentored cadets and coordinated squadron operations.',
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
}

const NAV_LINKS = [
  { label: 'Experience', href: '#experience' },
  { label: 'Skills', href: '#skills' },
  { label: 'Projects', href: '#projects' },
  { label: 'Education', href: '#education' },
  { label: 'Leadership', href: '#leadership' },
]

/* ── Theme hook ───────────────────────────────────────────────────── */
function useTheme() {
  const [theme, setTheme] = useState(() => {
    if (typeof document === 'undefined') return 'light'
    return document.documentElement.getAttribute('data-theme') === 'dark' ? 'dark' : 'light'
  })

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
    localStorage.setItem('theme', theme)
  }, [theme])

  useEffect(() => {
    const mq = window.matchMedia('(prefers-color-scheme: dark)')
    const onChange = (e) => {
      if (!localStorage.getItem('theme-override')) {
        setTheme(e.matches ? 'dark' : 'light')
      }
    }
    mq.addEventListener('change', onChange)
    return () => mq.removeEventListener('change', onChange)
  }, [])

  const toggle = () => {
    localStorage.setItem('theme-override', '1')
    setTheme((t) => (t === 'dark' ? 'light' : 'dark'))
  }

  return [theme, toggle]
}

/* ── FadeUp helper ────────────────────────────────────────────────── */
function FadeUp({ children, delay = 0, as: Tag = 'div' }) {
  const Component = motion[Tag] || motion.div
  return (
    <Component
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.35, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </Component>
  )
}

/* ── Brand mark ───────────────────────────────────────────────────── */
function BrandMark() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M12 2 L22 12 L12 22 L2 12 Z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
      <path d="M12 2 L12 22 M2 12 L22 12" stroke="currentColor" strokeWidth="0.8" strokeLinejoin="round" opacity="0.4" />
    </svg>
  )
}

/* ── Theme toggle icons ───────────────────────────────────────────── */
function SunIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="12" cy="12" r="4" stroke="currentColor" strokeWidth="1.6" />
      <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  )
}
function MoonIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M21 12.79A9 9 0 1 1 11.21 3a7 7 0 0 0 9.79 9.79z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
    </svg>
  )
}

/* ── Nav ──────────────────────────────────────────────────────────── */
function Nav() {
  const [theme, toggleTheme] = useTheme()
  const [active, setActive] = useState('')
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const obs = new IntersectionObserver(
      (entries) => entries.forEach((e) => { if (e.isIntersecting) setActive(e.target.id) }),
      { rootMargin: '-40% 0px -55% 0px' }
    )
    document.querySelectorAll('section[id]').forEach((s) => obs.observe(s))
    return () => obs.disconnect()
  }, [])

  const onClick = (e, href) => {
    e.preventDefault()
    document.querySelector(href)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    setOpen(false)
  }

  return (
    <header className="nav" aria-label="Site navigation">
      <div className="nav-inner">
        <a href="#top" className="nav-brand" onClick={(e) => onClick(e, '#top')}>
          <BrandMark />
          <span>Minul Lokuliyana</span>
        </a>
        <nav className="nav-links" aria-label="Sections">
          {NAV_LINKS.map((l) => (
            <a
              key={l.href}
              href={l.href}
              onClick={(e) => onClick(e, l.href)}
              className="nav-link"
              aria-current={active === l.href.slice(1) ? 'page' : undefined}
            >
              {l.label}
            </a>
          ))}
        </nav>
        <div className="nav-actions">
          <button
            type="button"
            onClick={toggleTheme}
            className="nav-toggle"
            aria-pressed={theme === 'dark'}
            aria-label={theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme'}
          >
            {theme === 'dark' ? <SunIcon /> : <MoonIcon />}
          </button>
          <a href={data.resumePdf} download="Minul_Lokuliyana_Resume.pdf" className="btn btn-ghost">
            Resume
          </a>
          <button
            type="button"
            className="nav-toggle nav-disclosure-btn"
            aria-expanded={open}
            aria-controls="nav-mobile-panel"
            aria-label={open ? 'Close menu' : 'Open menu'}
            onClick={() => setOpen((v) => !v)}
          >
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
              {open ? (
                <path d="M4 4l10 10M14 4L4 14" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
              ) : (
                <path d="M3 5h12M3 9h12M3 13h12" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
              )}
            </svg>
          </button>
        </div>
      </div>
      <AnimatePresence>
        {open && (
          <motion.div
            id="nav-mobile-panel"
            className="nav-disclosure-panel"
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.18 }}
          >
            {NAV_LINKS.map((l) => (
              <a
                key={l.href}
                href={l.href}
                onClick={(e) => onClick(e, l.href)}
                className="nav-link"
                aria-current={active === l.href.slice(1) ? 'page' : undefined}
              >
                {l.label}
              </a>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}

/* ── Section placeholders (filled in later tasks) ─────────────────── */
function Hero() {
  return (
    <section id="top" className="container hero">
      <p className="eyebrow hero-eyebrow">{data.location}</p>
      <h1>{data.name}</h1>
      <p className="muted">{data.role}</p>
    </section>
  )
}
function Experience() { return <section id="experience" className="container section"><h2 className="section-title">Experience</h2></section> }
function Skills() { return <section id="skills" className="container section"><h2 className="section-title">Skills</h2></section> }
function Projects() { return <section id="projects" className="container section"><h2 className="section-title">Projects</h2></section> }
function Education() { return <section id="education" className="container section"><h2 className="section-title">Education</h2></section> }
function Leadership() { return <section id="leadership" className="container section"><h2 className="section-title">Leadership &amp; Impact</h2></section> }
function Footer() {
  return (
    <footer id="contact" className="container footer">
      <p className="muted" style={{ fontSize: '0.9375rem' }}>{data.name}</p>
      <p className="footer-tagline">Let's talk.</p>
      <nav className="footer-links" aria-label="Contact">
        <a href={`mailto:${data.contact.email}`}>Email</a>
        <a href={`tel:${data.contact.mobile}`}>Mobile</a>
        <a href={data.contact.linkedin} target="_blank" rel="noopener noreferrer">LinkedIn</a>
        <a href={data.contact.github} target="_blank" rel="noopener noreferrer">GitHub</a>
        <a href={data.contact.website} target="_blank" rel="noopener noreferrer">minul.vercel.app</a>
      </nav>
    </footer>
  )
}

/* ── App ──────────────────────────────────────────────────────────── */
export default function App() {
  return (
    <>
      <a href="#top" className="skip-link">Skip to content</a>
      <Nav />
      <main>
        <Hero />
        <Experience />
        <Skills />
        <Projects />
        <Education />
        <Leadership />
      </main>
      <Footer />
    </>
  )
}
