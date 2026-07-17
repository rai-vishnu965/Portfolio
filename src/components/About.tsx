import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { GraduationCap, Trophy, Users, Cpu } from 'lucide-react'

const HIGHLIGHTS = [
  {
    icon: GraduationCap,
    title: 'Education',
    points: ['B.E. Computer Science Engineering — Alva\'s Institute of Engineering and Technology'],
  },
  {
    icon: Cpu,
    title: 'Technical Focus',
    points: ['Full-stack development, computer vision systems, applied cryptography, and data pipelines.'],
  },
  {
    icon: Users,
    title: 'Leadership',
    points: [
      'Treasurer, CSE Department (2025–26): managed departmental budgets and audited event expenses.',
      'Treasurer, Xypheria- National Level Hackathon: Managed the budget, sponsorship, expenses, and allocated funds efficiently across different event tracks.',
      'Organizing Committee Member, TEDx AIET.'
    ],
  },
  {
    icon: Trophy,
    title: 'Competitions',
    body: 'Active hackathon competitor — building under pressure and shipping fast.',
  },
]

export default function About() {
  const sectionRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.utils.toArray<HTMLElement>('.about-item').forEach((el, i) => {
        gsap.from(el, {
          opacity: 0,
          y: 28,
          duration: 0.6,
          ease: 'power3.out',
          delay: i * 0.08,
          scrollTrigger: { trigger: el, start: 'top 88%', once: true },
        })
      })
    }, sectionRef)
    return () => ctx.revert()
  }, [])

  return (
    <section id="about" className="section" ref={sectionRef}
      style={{ background: 'var(--surface)', borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)' }}>
      <div className="section-inner">
        {/* Heading */}
        <div className="about-item" style={{ marginBottom: '3rem', textAlign: 'center' }}>
          <p className="section-label">// who I am</p>
          <h2 className="section-title">About<span className="accent">;</span></h2>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '3rem',
          alignItems: 'start',
        }} className="about-grid">
          {/* Left: bio paragraph */}
          <div className="about-item" style={{ display: 'flex', flexDirection: 'column', gap: '1.1rem' }}>
            <p style={{ fontSize: '0.95rem', color: 'var(--muted-2)', lineHeight: 1.8 }}>
              I'm a Computer Science Engineering student at Alva's Institute of Engineering and
              Technology, building things across the full stack — from backend APIs and database
              encryption layers to computer vision pipelines and AI-powered retrieval systems.
            </p>
            <p style={{ fontSize: '0.95rem', color: 'var(--muted-2)', lineHeight: 1.8 }}>
              I believe good engineering is equal parts rigour and curiosity. Whether it's
              implementing AES-256 blind indexing or fine-tuning YOLO detection thresholds,
              I care about the details that make systems actually reliable.
            </p>
            <p style={{ fontSize: '0.95rem', color: 'var(--muted-2)', lineHeight: 1.8 }}>
              Outside code, I manage budgets as departmental Treasurer, help organise TEDx AIET,
              and compete at hackathons whenever I can.
            </p>

            {/* Stat pills */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.6rem', paddingTop: '0.5rem' }}>
              {[
                ['Status', 'CSE Student'],
                ['Institute', 'Alva\'s IET'],
                ['Location', 'India 🇮🇳'],
                ['Open to', 'Internships'],
              ].map(([k, v]) => (
                <div key={k} style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.6rem',
                  padding: '0.5rem 0.9rem',
                  background: 'var(--surface-2)',
                  border: '1px solid var(--border)',
                  borderRadius: 'var(--radius)',
                  fontSize: '0.75rem',
                  fontFamily: 'var(--font-mono)',
                }}>
                  <span style={{ color: 'var(--accent)' }}>{k}</span>
                  <span style={{ color: 'var(--border)' }}>|</span>
                  <span style={{ color: 'var(--muted-2)' }}>{v}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Right: highlight cards */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
            {HIGHLIGHTS.map(({ icon: Icon, title, body, points }) => (
              <div key={title} className="about-item" style={{
                display: 'flex',
                gap: '1rem',
                padding: '1rem 1.1rem',
                background: 'var(--surface-2)',
                border: '1px solid var(--border)',
                borderRadius: 'var(--radius)',
                alignItems: 'flex-start',
                transition: 'border-color 0.2s',
              }}
                onMouseEnter={e => (e.currentTarget.style.borderColor = 'rgba(255,176,0,0.3)')}
                onMouseLeave={e => (e.currentTarget.style.borderColor = 'var(--border)')}
              >
                <div style={{
                  width: 36, height: 36, flexShrink: 0,
                  borderRadius: 8,
                  background: 'var(--accent-dim)',
                  border: '1px solid rgba(255,176,0,0.25)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: 'var(--accent)',
                }}>
                  <Icon size={16} />
                </div>
                <div style={{ flex: 1 }}>
                  <p style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: '0.78rem',
                    fontWeight: 600,
                    color: 'var(--text)',
                    marginBottom: '0.4rem',
                  }}>{title}</p>

                  {body && (
                    <p style={{ fontSize: '0.82rem', color: 'var(--muted-2)', lineHeight: 1.6 }}>{body}</p>
                  )}

                  {points && (
                    <ul style={{
                      listStyle: 'none',
                      padding: 0,
                      margin: 0,
                      fontSize: '0.82rem',
                      color: 'var(--muted-2)',
                      lineHeight: 1.6,
                    }}>
                      {points.map((pt, idx) => (
                        <li key={idx} style={{
                          position: 'relative',
                          paddingLeft: '0.9rem',
                          marginBottom: idx === points.length - 1 ? 0 : '0.25rem'
                        }}>
                          <span style={{
                            position: 'absolute',
                            left: 0,
                            color: 'var(--accent)',
                            fontSize: '0.75rem',
                            fontFamily: 'var(--font-mono)'
                          }}>›</span>
                          {pt}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .about-grid { grid-template-columns: 1fr !important; gap: 2rem !important; }
        }
      `}</style>
    </section>
  )
}
