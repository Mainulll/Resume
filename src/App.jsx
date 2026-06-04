import { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion'
import BootSequence from './components/BootSequence.jsx'

/* ── Resume Data ──────────────────────────────────────────────────── */
const data = {
  name: 'Minul Lokuliyana',
  resumePdf: '/MinulLokuliyana_Resume.pdf',
  location: 'Melbourne, Australia',
  role: 'Customer Success @ Aphex · Final-year student at Monash',
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
        'Coordinate national inventory across AU/NZ for Bosch, Siemens, Neff, and Gaggenau in SAP. Stock transfers, allocations, project reservations, and 3PL coordination, working closely with procurement, sales, and external partners to keep everything on track.',
        'Built the Customer Level Forecasting tool and a Python pipeline that replaced the legacy PSI Tool import process. Cut data processing from hours to minutes and gave the team back time for actual analysis.',
        'Partner with procurement and sales to ship Power BI dashboards, Excel/VBA automation, and Python reporting. Manual reporting is down by about a quarter, and people now look at the dashboards instead of asking for spreadsheets.',
        'Run cost-benefit analyses and scenario plans behind procurement decisions. Led inventory audits and master-data validation across three distribution centres for senior stakeholders.',
      ],
    },
    {
      role: 'Procurement and Supply Chain Project Coordinator',
      company: 'Cummins Asia Pacific',
      period: 'Jan 2025 – Jan 2026',
      location: 'Melbourne, VIC',
      bullets: [
        'Coordinated two concurrent development programmes for regional markets. I owned on-time delivery across cross-functional engineering teams and was the connective tissue between technical, commercial, and operational sides.',
        'Led end-to-end RFQs with 30+ suppliers, covering capability benchmarking, risk assessment, and commercial negotiation. The cost-reduction initiatives I landed contributed six-figure annual savings.',
        'Built Python automation and agentic AI workflows across three functions. Designed Power BI dashboards that lifted programme visibility for APAC procurement across more than ten markets and fifty categories.',
      ],
    },
    {
      role: 'Research Assistant',
      company: 'Monash University VARS Lab',
      period: 'Jun 2024 – Dec 2024',
      location: 'Melbourne, VIC',
      bullets: [
        'Designed Python and R data pipelines that processed 100K+ records through hypothesis-driven analysis. Improved throughput 3× and contributed to one peer-reviewed publication.',
      ],
    },
    {
      role: 'Product Demonstrator and Content Creator',
      company: 'Dyson',
      period: 'Aug 2022 – Sep 2024',
      location: 'Melbourne, VIC',
      bullets: [
        'Ranked #1 nationally in sales for two consecutive years. Broke the single-day floorcare sales record.',
        'Selected as exclusive content creator for branded product launches. The role rewards turning technical product detail into customer language at speed, which is most of what I still do today.',
      ],
    },
    {
      role: 'Technical Support Analyst',
      company: 'YoureOnTime',
      period: 'Feb 2023 – May 2024',
      location: 'Melbourne, VIC',
      bullets: [
        'Owned client onboarding, data migration, and campaign coordination for a cloud SaaS platform across 200+ SME clients. The insights I delivered drove 15%+ engagement uplift.',
      ],
    },
  ],
  pillars: [
    {
      title: 'Project & Programme Management',
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
      title: 'Cloud, Tools & Certifications',
      items: ['Azure', 'AWS', 'GCP', 'Docker', 'Kubernetes', 'Kali Linux', 'Burp Suite', 'Salesforce', 'Jira', 'Confluence', 'ServiceNow', 'CPP', 'Lean Six Sigma Yellow Belt'],
    },
  ],
  projects: [
    {
      name: 'Previa',
      subtitle: 'AI Financial Intelligence Platform',
      role: 'Co-Founder',
      description: 'I co-founded and shipped this. An AI platform that reconciles receipts for small businesses at 90%+ accuracy. I owned product, engineering, and go-to-market end to end.',
      tech: 'React · TypeScript · Supabase · Python · LLMs',
      link: 'https://github.com/demigod97/Previa-2.0',
      linkLabel: 'View on GitHub',
    },
    {
      name: 'GymBro',
      subtitle: 'AI-Powered Fitness App',
      role: 'Solo Developer',
      description: "Solo build. Offline-first mobile fitness app on React Native and Expo. Most of the implementation came from agentic AI under my direction. The workflow itself is the project.",
      tech: 'React Native · Expo · TypeScript · SQLite · Zustand · Firebase',
      link: 'https://github.com/Mainulll/Gymbro-App',
      linkLabel: 'View on GitHub',
    },
    {
      name: 'Borealis Creative Group',
      subtitle: 'Digital Strategy',
      role: 'Project Lead',
      description: 'I led concurrent digital programmes for franchise clients. Web build, SEO, paid media. Lifted organic traffic by 40% across the portfolio.',
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
      'Innovation for Impact Award (2024). University-wide AI design award judged on commercial viability, technical rigour, and societal impact.',
      'Global Immersion (Fiji) and Innovation Guarantee (Microsoft). Led two cross-cultural consulting engagements: UN SDG-aligned project delivery and AI-driven stakeholder experience prototypes.',
    ],
  },
  leadership: [
    {
      title: 'Programme Coordinator',
      org: 'Preflight STEM Initiative',
      period: '2024 – Present',
      description: "Founder, purely self-funded. Preflight partners with local institutions in Sri Lanka to get school and educational supplies to children who don't otherwise have access. I run the volunteer team and own programme delivery end to end.",
    },
    {
      title: 'Officer',
      org: 'Australian Air League',
      period: '2014 – Present',
      description: 'Eleven-plus years of youth leadership in aviation and civic education within a defence-aligned organisation. Mentored cadets and coordinated squadron operations.',
    },
    {
      title: 'Basketball Coach',
      org: 'Basketball Victoria / Waverley Raiders',
      period: '2017 – 2025',
      description: 'Coached junior teams for eight years through state-level competitions.',
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
      transition={{ duration: 0.45, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </Component>
  )
}

/* ── Brand mark ───────────────────────────────────────────────────── */
function BrandMark() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M12 2 L22 12 L12 22 L2 12 Z" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" />
      <path d="M12 7 L17 12 L12 17 L7 12 Z" fill="currentColor" opacity="0.9" />
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

/* ── Section header (numbered eyebrow + title) ────────────────────── */
function SectionHeader({ num, children }) {
  return (
    <header className="section-header">
      <p className="section-num">{num}</p>
      <h2>{children}</h2>
    </header>
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

/* ── Hero ─────────────────────────────────────────────────────────── */
function Hero() {
  const reduce = useReducedMotion()
  const baseDelay = reduce ? 0 : 1.35 // start after boot overlay clears

  return (
    <section id="top" className="container hero">
      <motion.div
        className="hero-eyebrow mono"
        initial={{ opacity: 0, y: 4 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: baseDelay, ease: [0.22, 1, 0.36, 1] }}
      >
        <span className="hero-pulse" aria-hidden="true" />
        {data.location} · v2026.1
      </motion.div>

      <motion.div
        className="term-window hero-term"
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: baseDelay + 0.1, ease: [0.22, 1, 0.36, 1] }}
      >
        <div className="term-titlebar">
          <div className="term-dots"><span /><span /><span /></div>
          <div className="term-title mono">minul@portfolio — zsh — 86×24</div>
          <div className="term-tab mono">~ /</div>
        </div>
        <div className="term-body mono">
          <HeroLine delay={baseDelay + 0.30} prompt>whoami</HeroLine>
          <HeroLine delay={baseDelay + 0.55} kind="name">{data.name}</HeroLine>

          <HeroLine delay={baseDelay + 0.85} prompt>cat ~/role.txt</HeroLine>
          <HeroLine delay={baseDelay + 1.10} kind="role">
            Customer Success <span className="hero-at">@</span> Aphex
            <span className="hero-sep">·</span>
            Final-year student at Monash
          </HeroLine>

          <HeroLine delay={baseDelay + 1.45} prompt>cat ~/about.md</HeroLine>
          <HeroLine delay={baseDelay + 1.70} kind="bio">
            I work in <em>customer success</em> at <em>Aphex</em>, helping major contractors plan and deliver better. I keep cross-functional teams aligned and ship high-value work on time. Strong on communication, organisation, and stakeholder management — with a soft spot for the unglamorous process improvements that quietly compound. Finishing <em>Business Analytics &amp; Cybersecurity</em> at Monash.
          </HeroLine>

          <HeroLine delay={baseDelay + 2.20} prompt>ls ~/links/</HeroLine>
          <HeroLine delay={baseDelay + 2.45} kind="links">
            <a href={data.contact.linkedin} target="_blank" rel="noopener noreferrer">linkedin</a>
            <a href={data.contact.github} target="_blank" rel="noopener noreferrer">github</a>
            <a href={`mailto:${data.contact.email}`}>email</a>
            <a href={data.resumePdf} download="Minul_Lokuliyana_Resume.pdf">resume.pdf</a>
          </HeroLine>

          <HeroLine delay={baseDelay + 2.85} prompt cursor />
        </div>
      </motion.div>

      <motion.div
        className="hero-cta-row"
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, delay: baseDelay + 3.0, ease: [0.22, 1, 0.36, 1] }}
      >
        <a href={data.resumePdf} download="Minul_Lokuliyana_Resume.pdf" className="btn btn-primary">
          Download resume
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
            <path d="M7 1v8M4 6l3 3 3-3M2 12h10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </a>
        <a href={`mailto:${data.contact.email}`} className="btn btn-secondary">Get in touch</a>
      </motion.div>
    </section>
  )
}

function HeroLine({ children, delay, prompt = false, cursor = false, kind }) {
  const reduce = useReducedMotion()
  const className = `term-line${kind ? ` term-${kind}` : ''}${prompt ? ' term-cmd' : ' term-out'}`
  return (
    <motion.div
      className={className}
      initial={reduce ? false : { opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.25, delay, ease: 'easeOut' }}
    >
      {prompt && <span className="term-prompt">$</span>}
      <span className="term-content">{children}</span>
      {cursor && <span className="term-cursor" />}
    </motion.div>
  )
}

/* ── Sections ─────────────────────────────────────────────────────── */
function Experience() {
  return (
    <section id="experience" className="container section">
      <FadeUp><SectionHeader num="01">Experience</SectionHeader></FadeUp>
      <div className="experience-list">
        {data.experience.map((exp, i) => (
          <FadeUp key={exp.company} delay={i * 0.05}>
            <article className="card exp-card">
              <header className="exp-head">
                <h3>{exp.role}</h3>
                <p className="exp-meta">
                  {exp.company} · {exp.period} · {exp.location}
                </p>
              </header>
              <ul className="bullets">
                {exp.bullets.map((b) => <li key={b}>{b}</li>)}
              </ul>
            </article>
          </FadeUp>
        ))}
      </div>
    </section>
  )
}

function Skills() {
  return (
    <section id="skills" className="container section">
      <FadeUp><SectionHeader num="02">Skills</SectionHeader></FadeUp>
      <div className="pillars-grid">
        {data.pillars.map((pillar, i) => (
          <FadeUp key={pillar.title} delay={i * 0.05}>
            <article className="card pillar-card">
              <h3>{pillar.title}</h3>
              <div className="pillar-tags">
                {pillar.items.map((item) => <span key={item} className="tag">{item}</span>)}
              </div>
            </article>
          </FadeUp>
        ))}
      </div>
    </section>
  )
}

function Projects() {
  return (
    <section id="projects" className="container section">
      <FadeUp><SectionHeader num="03">Projects</SectionHeader></FadeUp>
      <div className="project-list">
        {data.projects.map((p, i) => (
          <FadeUp key={p.name} delay={i * 0.05}>
            <article className="card project-card">
              <p className="project-role">{p.role}</p>
              <h3>
                {p.name} <span className="project-subtitle">{p.subtitle}</span>
              </h3>
              <p>{p.description}</p>
              <p className="project-tech">{p.tech}</p>
              {p.link && (
                <a href={p.link} target="_blank" rel="noopener noreferrer">{p.linkLabel || 'View project'} →</a>
              )}
            </article>
          </FadeUp>
        ))}
      </div>
    </section>
  )
}

function Education() {
  return (
    <section id="education" className="container section">
      <FadeUp><SectionHeader num="04">Education</SectionHeader></FadeUp>
      <FadeUp delay={0.05}>
        <article className="card edu-card">
          <h3>{data.education.degree}</h3>
          <p className="exp-meta">{data.education.institution} · {data.education.period}</p>
          <p style={{ marginTop: '0.25rem' }}>Majors: {data.education.majors}</p>
          <p className="edu-coursework">{data.education.coursework}</p>
          <ul className="bullets">
            {data.education.highlights.map((h) => <li key={h}>{h}</li>)}
          </ul>
        </article>
      </FadeUp>
    </section>
  )
}

function Leadership() {
  return (
    <section id="leadership" className="container section">
      <FadeUp><SectionHeader num="05">Leadership &amp; Impact</SectionHeader></FadeUp>
      <div className="leadership-list">
        {data.leadership.map((item, i) => (
          <FadeUp key={item.org} delay={i * 0.04}>
            <article className="card leadership-card">
              <h3>
                {item.title} <span className="leadership-org">· {item.org}</span>
              </h3>
              <p className="exp-meta">{item.period}</p>
              <p style={{ marginTop: '0.5rem' }}>{item.description}</p>
            </article>
          </FadeUp>
        ))}
      </div>
    </section>
  )
}

function Footer() {
  return (
    <footer id="contact" className="container footer">
      <p className="footer-mark">{data.name}</p>
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
      <BootSequence />
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
