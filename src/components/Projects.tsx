import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { ExternalLink } from 'lucide-react'
import { GithubIcon } from './BrandIcons'

// ─── Types ────────────────────────────────────────────────────────────────────
interface Project {
  title: string
  description: string
  tags: string[]
  github: string
  demo?: string
  ongoing?: boolean
}

// ─── Data ─────────────────────────────────────────────────────────────────────
const PROJECTS: Project[] = [
  {
    title: 'Personal Knowledge Assistant',
    description:
      'RAG system over class notes for filtered, subject-specific retrieval and Q&A. Ingests course materials, chunks and embeds them with Sentence Transformers, and retrieves via FAISS for fast, context-aware answers.',
    tags: ['Python', 'LangChain', 'FAISS', 'Sentence Transformers', 'Streamlit'],
    github: 'https://github.com/rai-vishnu965/notes-rag',
    ongoing: true,
  },
  {
    title: 'Smart Hotel Monitoring System',
    description:
      'Automated vision-based surveillance system for hygiene and pest detection in hospitality settings. Uses YOLO for real-time protocol-breach detection, sends SMTP email alerts with visual evidence for immediate intervention.',
    tags: ['Python', 'FastAPI', 'YOLO', 'OpenCV'],
    github: 'https://github.com/vinith-0430/Smart-hotel-monitoring-system',
  },
  {
    title: 'SecureVault',
    description:
      'Privacy-focused encrypted data storage platform. Uses AES-256 encryption and HMAC-based blind indexing to allow secure database querying while keeping sensitive data encrypted at rest, plus a full audit logging system.',
    tags: ['Python', 'Streamlit', 'SQLite', 'Cryptography'],
    github: 'https://github.com/virajj12/securevault',
  },
]

// ─── Card component ───────────────────────────────────────────────────────────
function ProjectCard({ title, description, tags, github, demo, ongoing }: Project) {
  const cardRef = useRef<HTMLAnchorElement>(null)

  return (
    <a
      href={github}
      target="_blank"
      rel="noopener noreferrer"
      ref={cardRef}
      className="project-card gsap-fade-up"
      style={{
        background: 'var(--surface)',
        border: '1px solid var(--border)',
        borderRadius: '14px',
        padding: '1.75rem',
        display: 'flex',
        flexDirection: 'column',
        gap: '1rem',
        position: 'relative',
        overflow: 'hidden',
        transition: 'border-color 0.25s, box-shadow 0.25s, transform 0.25s',
        height: '100%',
        cursor: 'pointer',
      }}
      onMouseEnter={e => {
        const el = e.currentTarget
        el.style.borderColor = 'rgba(255,176,0,0.45)'
        el.style.boxShadow = '0 0 28px rgba(255,176,0,0.1)'
        el.style.transform = 'translateY(-4px)'
      }}
      onMouseLeave={e => {
        const el = e.currentTarget
        el.style.borderColor = 'var(--border)'
        el.style.boxShadow = 'none'
        el.style.transform = 'none'
      }}
    >
      {/* Top accent line */}
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0, height: '2px',
        background: 'linear-gradient(90deg, var(--accent) 0%, transparent 60%)',
        opacity: 0.6,
      }} />

      {/* Header row */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '0.75rem' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.45rem' }}>
          <h3 style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '1rem',
            fontWeight: 700,
            color: 'var(--text)',
            letterSpacing: '-0.02em',
          }}>
            {title}
          </h3>
          {ongoing && (
            <span className="badge-ongoing">
              <span className="badge-ongoing-dot" />
              In Progress
            </span>
          )}
        </div>

        {/* Links */}
        <div style={{ display: 'flex', gap: '0.5rem', flexShrink: 0, paddingTop: '2px' }}>
          {github && (
            <span
               aria-label={`${title} on GitHub`}
               style={{ color: 'var(--muted)', transition: 'color 0.2s' }}
               className="project-icon-link">
              <GithubIcon size={17} />
            </span>
          )}
          {demo && (
            <span
               aria-label={`${title} live demo`}
               style={{ color: 'var(--muted)', transition: 'color 0.2s' }}
               className="project-icon-link">
              <ExternalLink size={17} />
            </span>
          )}
        </div>
      </div>

      {/* Description */}
      <p style={{ fontSize: '0.86rem', color: 'var(--muted-2)', lineHeight: 1.7, flex: 1 }}>
        {description}
      </p>

      {/* Tags */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
        {tags.map(t => <span key={t} className="tag">{t}</span>)}
      </div>
    </a>
  )
}

// ─── Section ──────────────────────────────────────────────────────────────────
export default function Projects() {
  const sectionRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const isReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    const ctx = gsap.context(() => {
      // 1. Heading trigger (one-time reveal)
      gsap.to('.projects-heading', {
        opacity: 1,
        y: 0,
        duration: 0.7,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: '.projects-heading',
          start: 'top 88%',
          once: true,
        }
      })

      // 2. Project cards scrub
      gsap.utils.toArray<HTMLElement>('.project-card').forEach((card, i) => {
        const offset = i * 4
        const startVal = `top ${95 - offset}%`
        const endVal = `top ${70 - offset}%`

        gsap.fromTo(card,
          {
            opacity: 0,
            y: isReduced ? 0 : 50,
            scale: isReduced ? 1 : 0.95,
          },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            scrollTrigger: {
              trigger: card,
              start: startVal,
              end: endVal,
              scrub: isReduced ? false : 0.5,
              once: isReduced,
            }
          }
        )
      })
    }, sectionRef)
    return () => ctx.revert()
  }, [])

  return (
    <section id="projects" className="section" ref={sectionRef}
      style={{ borderTop: '1px solid var(--border)' }}>
      <div className="section-inner">
        {/* Heading */}
        <div className="projects-heading gsap-fade-up" style={{ marginBottom: '3rem', textAlign: 'center' }}>
          <p className="section-label">// my work</p>
          <h2 className="section-title">
            Projects<span className="accent">;</span>
          </h2>
        </div>

        {/* 3-column grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '1.25rem',
          alignItems: 'start',
        }}
          className="projects-grid"
        >
          {PROJECTS.map(p => (
            <ProjectCard key={p.title} {...p} />
          ))}
        </div>
      </div>

      <style>{`
        @media (max-width: 900px) {
          .projects-grid { grid-template-columns: repeat(2, 1fr) !important; }
        }
        @media (max-width: 560px) {
          .projects-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </section>
  )
}
