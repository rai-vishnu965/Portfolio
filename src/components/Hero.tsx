import { useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
import { Mail } from 'lucide-react'
import { GithubIcon, LinkedinIcon } from './BrandIcons'
import ThreeScene from './ThreeScene'

import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

// ─── Typing effect ────────────────────────────────────────────────────────────
const ROLES = [
  'full-stack applications.',
  'secure data pipelines.',
  'computer vision systems.',
  'RAG-powered study tools.',
]

function useTyping(lines: string[], speed = 52) {
  const [text, setText]   = useState('')
  const [li,   setLi]     = useState(0)
  const [ci,   setCi]     = useState(0)
  const [phase, setPhase] = useState<'typing' | 'pause' | 'erasing'>('typing')

  useEffect(() => {
    const current = lines[li]
    if (phase === 'typing') {
      if (ci < current.length) {
        const t = setTimeout(() => { setText(current.slice(0, ci + 1)); setCi(c => c + 1) }, speed)
        return () => clearTimeout(t)
      }
      const t = setTimeout(() => setPhase('pause'), 1800)
      return () => clearTimeout(t)
    }
    if (phase === 'pause') {
      const t = setTimeout(() => setPhase('erasing'), 300)
      return () => clearTimeout(t)
    }
    if (phase === 'erasing') {
      if (ci > 0) {
        const t = setTimeout(() => { setText(current.slice(0, ci - 1)); setCi(c => c - 1) }, speed / 2)
        return () => clearTimeout(t)
      }
      setLi(i => (i + 1) % lines.length)
      setPhase('typing')
    }
  }, [ci, phase, li, lines, speed])

  return text
}

// ─── Hero ─────────────────────────────────────────────────────────────────────
export default function Hero() {
  const heroRef    = useRef<HTMLElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)
  const typed      = useTyping(ROLES)

  useEffect(() => {
    const isReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    const ctx = gsap.context(() => {
      // 1. Entrance animation
      gsap.from('.hero-item', {
        opacity: 0,
        y: isReduced ? 0 : 22,
        duration: 0.7,
        stagger: 0.12,
        ease: 'power3.out',
        delay: 0.2,
      })

      // 2. Parallax fade out scroll trigger
      gsap.to(contentRef.current, {
        opacity: 0,
        y: isReduced ? 0 : -80,
        scrollTrigger: {
          trigger: heroRef.current,
          start: 'top top',
          end: 'bottom 30%',
          scrub: true,
        }
      })
    }, heroRef)
    return () => ctx.revert()
  }, [])

  return (
    <section
      id="hero"
      ref={heroRef}
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        padding: '0 1.5rem',
        paddingTop: 'var(--nav-h)',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Ambient background glow */}
      <div aria-hidden style={{
        position: 'absolute', inset: 0, pointerEvents: 'none',
        background: 'radial-gradient(ellipse 60% 50% at 75% 50%, rgba(255,176,0,0.055) 0%, transparent 70%)',
      }} />

      <div style={{
        maxWidth: 'var(--max-w)',
        margin: '0 auto',
        width: '100%',
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '3rem',
        alignItems: 'center',
      }}
        className="hero-grid"
      >
        {/* ── Left: text content ─────────────────────────────────────────── */}
        <div ref={contentRef} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>

          {/* Prompt label */}
          <div className="hero-item" style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem',
            fontFamily: 'var(--font-mono)',
            fontSize: '0.72rem',
            color: 'var(--accent)',
          }}>
            <span style={{
              width: 6, height: 6, borderRadius: '50%',
              background: 'var(--accent)',
              animation: 'pulse-dot 2s ease-in-out infinite',
            }} />
            Open to internships &amp; collaborations
          </div>

          {/* Name */}
          <div className="hero-item">
            <h1 style={{
              fontFamily: 'var(--font-mono)',
              fontWeight: 700,
              fontSize: 'clamp(2.2rem, 5.5vw, 4rem)',
              letterSpacing: '-0.04em',
              lineHeight: 1.05,
              color: 'var(--text)',
            }}>
              Vishnusmaran<br />
              <span style={{ color: 'var(--accent)' }}>B Rai</span>
              <span style={{ color: 'var(--muted)' }}>.</span>
            </h1>
          </div>

          {/* Tagline with typing effect */}
          <div className="hero-item" style={{
            fontFamily: 'var(--font-mono)',
            fontSize: 'clamp(0.78rem, 2vw, 0.9rem)',
            color: 'var(--muted-2)',
            lineHeight: 1.6,
          }}>
            <span style={{ color: 'var(--muted)' }}>// </span>
            CSE student building{' '}
            <span style={{ color: 'var(--accent)' }}>{typed}</span>
            <span style={{
              display: 'inline-block',
              width: 2, height: '0.95em',
              background: 'var(--accent)',
              marginLeft: 2,
              verticalAlign: 'text-bottom',
              animation: 'blink 1s step-end infinite',
            }} />
          </div>

          {/* Static sub-tagline */}
          <p className="hero-item" style={{
            fontSize: '0.9rem',
            color: 'var(--muted-2)',
            lineHeight: 1.7,
            maxWidth: '420px',
          }}>
            Computer Science Engineering student with hands-on experience in
            full-stack development, computer vision, and RAG.
          </p>

          {/* Social icons */}
          <div className="hero-item" style={{ display: 'flex', gap: '0.6rem', flexWrap: 'wrap' }}>
            <a href="https://github.com/rai-vishnu965"
               target="_blank" rel="noopener noreferrer"
               className="icon-btn" aria-label="GitHub">
              <GithubIcon size={17} />
            </a>
            <a href="https://linkedin.com/in/rai-vishnu965"
               target="_blank" rel="noopener noreferrer"
               className="icon-btn" aria-label="LinkedIn">
              <LinkedinIcon size={17} />
            </a>
            <a href="mailto:vishnusmaran965@gmail.com"
               className="icon-btn" aria-label="Email">
              <Mail size={17} />
            </a>
          </div>

          {/* CTAs */}
          <div className="hero-item" style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
            <a href="#projects" className="btn-primary">View Projects</a>
            <a href="#contact"  className="btn-ghost">Get in Touch</a>
          </div>
        </div>

        {/* ── Right: Three.js scene ──────────────────────────────────────── */}
        <div style={{
          position: 'relative',
          height: 'min(480px, 55vw)',
          borderRadius: '16px',
          overflow: 'hidden',
          border: '1px solid var(--border)',
          background: 'var(--surface)',
        }}>
          {/* Terminal chrome bar */}
          <div style={{
            position: 'absolute', top: 0, left: 0, right: 0,
            height: '28px',
            background: 'var(--surface-2)',
            borderBottom: '1px solid var(--border)',
            display: 'flex',
            alignItems: 'center',
            padding: '0 0.75rem',
            gap: '0.4rem',
            zIndex: 2,
          }}>
            {['#ff5f57','#febc2e','#28c840'].map((c,i) => (
              <span key={i} style={{ width:10, height:10, borderRadius:'50%', background: c, opacity: 0.7 }} />
            ))}
            <span style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '0.62rem',
              color: 'var(--muted)',
              marginLeft: '0.5rem',
            }}>
              scene.ts — Three.js
            </span>
          </div>

          <div style={{
            position: 'absolute',
            top: '28px', left: 0, right: 0, bottom: 0,
          }}>
            <ThreeScene />
          </div>

          {/* Corner label */}
          <div style={{
            position: 'absolute',
            bottom: '0.75rem',
            right: '0.75rem',
            fontFamily: 'var(--font-mono)',
            fontSize: '0.6rem',
            color: 'rgba(255,176,0,0.3)',
            zIndex: 2,
          }}>
            IcosahedronGeometry · WebGL
          </div>
        </div>
      </div>

      {/* Scroll cue */}
      <div style={{
        position: 'absolute',
        bottom: '1.75rem',
        left: '50%',
        transform: 'translateX(-50%)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '0.35rem',
      }}>
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6rem', color: 'var(--muted)', letterSpacing: '0.12em' }}>
          SCROLL
        </span>
        <div style={{
          width: 18, height: 28,
          border: '1.5px solid var(--border)',
          borderRadius: 9,
          display: 'flex',
          justifyContent: 'center',
          paddingTop: 4,
        }}>
          <div style={{
            width: 2, height: 5,
            background: 'var(--accent)',
            borderRadius: 2,
            animation: 'float 1.5s ease-in-out infinite',
          }} />
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .hero-grid {
            grid-template-columns: 1fr !important;
          }
          .hero-grid > div:last-child {
            height: 260px !important;
          }
        }
      `}</style>
    </section>
  )
}
