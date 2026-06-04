import { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion'
import BootSequence from './components/BootSequence.jsx'
import CustomCursor from './components/CustomCursor.jsx'
import { Link } from 'react-router-dom'
import { latestPosts, allPosts } from './lib/posts.js'

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
      title: 'Project & Delivery',
      items: ['Programme delivery', 'Stakeholder engagement', 'Risk assessment', 'Cross-functional coordination', 'Procurement strategy'],
    },
    {
      title: 'Data & Engineering',
      items: ['Python', 'SQL', 'Power BI', 'Tableau', 'SAP ERP', 'React · TypeScript', 'Excel · VBA'],
    },
    {
      title: 'AI & Automation',
      items: ['LLM integration', 'Agentic workflows', 'Prompt engineering', 'Process automation', 'Data pipelines'],
    },
    {
      title: 'Cloud & Certifications',
      items: ['AWS · Azure · GCP', 'Docker', 'Salesforce', 'CPP', 'Lean Six Sigma YB'],
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
  { label: 'Writing', href: '#writing' },
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
  return <span className="brand-mark mono" aria-hidden="true">~$ minul</span>
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

/* ── Section header (hash-prefixed terminal title) ────────────────── */
function SectionHeader({ num, children }) {
  return (
    <header className="section-header">
      <span className="section-hash mono">#</span>
      <span className="section-num mono">{num} /</span>
      <h2 className="section-title">{children}</h2>
      <span className="section-fill-line" aria-hidden="true" />
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

          <HeroLine delay={baseDelay + 0.85} prompt>cat ~/about.md</HeroLine>
          <HeroLine delay={baseDelay + 1.10} kind="bio">
            I work in <em>customer success</em> at <em>Aphex</em>, helping major contractors plan and deliver better. I keep cross-functional teams aligned and ship high-value work on time. Strong on communication, organisation, and stakeholder management — with a soft spot for the unglamorous process improvements that quietly compound. Finishing <em>Business Analytics &amp; Cybersecurity</em> at Monash.
          </HeroLine>

          <HeroLine delay={baseDelay + 1.60} prompt>ls ~/links/</HeroLine>
          <HeroLine delay={baseDelay + 1.85} kind="links">
            <a href={data.contact.linkedin} target="_blank" rel="noopener noreferrer">linkedin</a>
            <a href={data.contact.github} target="_blank" rel="noopener noreferrer">github</a>
            <a href={`mailto:${data.contact.email}`}>email</a>
            <a href={data.resumePdf} download="Minul_Lokuliyana_Resume.pdf">resume.pdf</a>
          </HeroLine>

          <HeroLine delay={baseDelay + 2.25} prompt cursor />
        </div>
      </motion.div>

      <motion.div
        className="hero-cta-row"
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, delay: baseDelay + 2.4, ease: [0.22, 1, 0.36, 1] }}
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
      <FadeUp><SectionHeader num="01">experience</SectionHeader></FadeUp>
      <div className="experience-list">
        {data.experience.map((exp, i) => (
          <FadeUp key={`${exp.company}-${exp.period}`} delay={i * 0.05}>
            <article className="term-card exp-card">
              <div className="exp-meta">
                <span className="exp-badge">{exp.period}</span>
                <span className="exp-meta-item">{exp.location}</span>
              </div>
              <h3 className="exp-role">
                {exp.role} <span className="exp-at">@ {exp.company}</span>
              </h3>
              <ul className="exp-bullets">
                {exp.bullets.map((b, j) => <li key={j}>{b}</li>)}
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
      <FadeUp><SectionHeader num="02">skills</SectionHeader></FadeUp>
      <div className="pillars-grid">
        {data.pillars.map((pillar, i) => (
          <FadeUp key={pillar.title} delay={i * 0.05}>
            <article className="term-card pillar-card">
              <div className="pillar-decl mono">
                <span className="pillar-keyword">const</span>{' '}
                <span className="pillar-name">{toIdent(pillar.title)}</span>{' '}
                <span className="pillar-eq">=</span>
              </div>
              <div className="pillar-tags">
                {pillar.items.map((item) => (
                  <span key={item} className="pillar-chip">{item}</span>
                ))}
              </div>
            </article>
          </FadeUp>
        ))}
      </div>
    </section>
  )
}

function toIdent(s) {
  return s
    .toLowerCase()
    .replace(/&/g, 'and')
    .replace(/[^a-z0-9]+/g, '_')
    .replace(/^_+|_+$/g, '')
}

function Projects() {
  return (
    <section id="projects" className="container section">
      <FadeUp><SectionHeader num="03">projects</SectionHeader></FadeUp>
      <div className="project-list">
        {data.projects.map((p, i) => (
          <FadeUp key={p.name} delay={i * 0.05}>
            <article className="term-card project-card">
              <div className="exp-meta">
                <span className="exp-badge">{p.role}</span>
              </div>
              <h3 className="project-title">
                {p.name} <span className="project-subtitle">— {p.subtitle}</span>
              </h3>
              <p className="project-desc">{p.description}</p>
              <p className="project-tech mono">{p.tech.split('·').map((t, j, arr) => (
                <span key={j}>
                  {t.trim()}
                  {j < arr.length - 1 && <span className="project-tech-dot"> · </span>}
                </span>
              ))}</p>
              {p.link && (
                <a href={p.link} target="_blank" rel="noopener noreferrer" className="project-link mono">
                  {p.linkLabel || 'view project'} <span aria-hidden="true">→</span>
                </a>
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
      <FadeUp><SectionHeader num="04">education</SectionHeader></FadeUp>
      <FadeUp delay={0.05}>
        <article className="term-card edu-card">
          <div className="exp-meta">
            <span className="exp-badge">{data.education.period}</span>
            <span className="exp-meta-item">{data.education.institution}</span>
          </div>
          <h3 className="exp-role">{data.education.degree}</h3>
          <p className="edu-majors">Majors: <span className="edu-majors-value">{data.education.majors}</span></p>
          <p className="edu-coursework">{data.education.coursework}</p>
          <ul className="exp-bullets">
            {data.education.highlights.map((h, i) => <li key={i}>{h}</li>)}
          </ul>
        </article>
      </FadeUp>
    </section>
  )
}

function Leadership() {
  return (
    <section id="leadership" className="container section">
      <FadeUp><SectionHeader num="05">leadership &amp; impact</SectionHeader></FadeUp>
      <div className="leadership-list">
        {data.leadership.map((item, i) => (
          <FadeUp key={`${item.org}-${item.title}`} delay={i * 0.04}>
            <article className="term-card leadership-card">
              <div className="exp-meta">
                <span className="exp-badge">{item.period}</span>
                <span className="exp-meta-item">{item.org}</span>
              </div>
              <h3 className="exp-role">{item.title}</h3>
              <p className="leadership-desc">{item.description}</p>
            </article>
          </FadeUp>
        ))}
      </div>
    </section>
  )
}

/* ── Writing (homepage section) ───────────────────────────────────── */
function Writing() {
  const posts = latestPosts(3)
  const hasMore = allPosts.length > 3

  return (
    <section id="writing" className="container section">
      <FadeUp><SectionHeader num="06">writing</SectionHeader></FadeUp>
      {posts.length === 0 ? (
        <FadeUp delay={0.05}>
          <p className="post-empty mono">
            <span className="post-empty-prompt">$</span> ls ~/writing/ <span className="post-empty-arrow">→</span> (empty) — first post coming soon
          </p>
        </FadeUp>
      ) : (
        <>
          <div className="post-list">
            {posts.map((p, i) => (
              <FadeUp key={p.slug} delay={i * 0.05}>
                <Link to={`/writing/${p.slug}`} className="post-row">
                  <span className="post-date mono">{p.displayDate}</span>
                  <span className="post-title">{p.title}<span className="post-arrow" aria-hidden="true"> →</span></span>
                  <span className="post-meta mono">~{p.readingMinutes} min</span>
                </Link>
              </FadeUp>
            ))}
          </div>
          {hasMore && (
            <FadeUp delay={0.2}>
              <Link to="/writing" className="post-index-link mono">
                <span className="post-index-prompt">$</span> ls ~/writing/ <span className="post-index-arrow">→</span> see all posts
              </Link>
            </FadeUp>
          )}
        </>
      )}
    </section>
  )
}

function Footer() {
  return (
    <footer id="contact" className="container footer">
      <div className="footer-block">
        <p className="footer-prompt mono"><span className="footer-p">$</span> echo "let's talk."</p>
        <p className="footer-tagline">Let's talk.</p>
      </div>
      <nav className="footer-links mono" aria-label="Contact">
        <a href={`mailto:${data.contact.email}`}>email</a>
        <a href={`tel:${data.contact.mobile}`}>mobile</a>
        <a href={data.contact.linkedin} target="_blank" rel="noopener noreferrer">linkedin</a>
        <a href={data.contact.github} target="_blank" rel="noopener noreferrer">github</a>
        <a href={data.contact.website} target="_blank" rel="noopener noreferrer">minul.vercel.app</a>
      </nav>
      <p className="footer-mark mono">© {new Date().getFullYear()} {data.name}</p>
    </footer>
  )
}

/* ── App ──────────────────────────────────────────────────────────── */
export default function App() {
  return (
    <>
      <BootSequence />
      <CustomCursor />
      <a href="#top" className="skip-link">Skip to content</a>
      <Nav />
      <main>
        <Hero />
        <Experience />
        <Skills />
        <Projects />
        <Education />
        <Leadership />
        <Writing />
      </main>
      <Footer />
    </>
  )
}
