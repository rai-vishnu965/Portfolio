import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { Mail, ArrowUpRight } from 'lucide-react'
import { GithubIcon, LinkedinIcon } from './BrandIcons'

const LINKS = [
  {
    icon: GithubIcon,
    label: 'GitHub',
    sub: 'github.com/rai-vishnu965',
    href: 'https://github.com/rai-vishnu965',
  },
  {
    icon: LinkedinIcon,
    label: 'LinkedIn',
    sub: 'linkedin.com/in/rai-vishnu965',
    href: 'https://linkedin.com/in/rai-vishnu965',
  },
  {
    icon: Mail,
    label: 'Email',
    sub: 'vishnusmaran965@gmail.com',
    href: 'mailto:vishnusmaran965@gmail.com',
  },
]

export default function Contact() {
  const sectionRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.utils.toArray<HTMLElement>('.contact-link').forEach((el, i) => {
        gsap.from(el, {
          opacity: 0,
          y: 22,
          duration: 0.55,
          ease: 'power3.out',
          delay: i * 0.1,
          scrollTrigger: { trigger: el, start: 'top 90%', once: true },
        })
      })
    }, sectionRef)
    return () => ctx.revert()
  }, [])

  return (
    <>
      <section id="contact" className="section" ref={sectionRef}>
        <div className="section-inner">
          <div style={{ textAlign: 'center', maxWidth: '580px', margin: '0 auto' }}>
            <p className="section-label">// reach out</p>
            <h2 className="section-title" style={{ marginBottom: '1rem' }}>
              Contact<span className="accent">;</span>
            </h2>
            <p style={{ fontSize: '0.9rem', color: 'var(--muted-2)', lineHeight: 1.7, marginBottom: '2.5rem' }}>
              Open to internships, project collaborations, and interesting conversations.
              Feel free to reach out through any channel below.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', textAlign: 'left' }}>
              {LINKS.map(({ icon: Icon, label, sub, href }) => (
                <a
                  key={label}
                  href={href}
                  target={href.startsWith('mailto') ? undefined : '_blank'}
                  rel={href.startsWith('mailto') ? undefined : 'noopener noreferrer'}
                  className="contact-link"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '1rem',
                    padding: '1rem 1.25rem',
                    background: 'var(--surface)',
                    border: '1px solid var(--border)',
                    borderRadius: 'var(--radius)',
                    textDecoration: 'none',
                    transition: 'border-color 0.2s, box-shadow 0.2s, transform 0.15s',
                  }}
                  onMouseEnter={e => {
                    const el = e.currentTarget
                    el.style.borderColor = 'rgba(255,176,0,0.4)'
                    el.style.transform = 'translateY(-2px)'
                    el.style.boxShadow = '0 4px 20px rgba(255,176,0,0.07)'
                  }}
                  onMouseLeave={e => {
                    const el = e.currentTarget
                    el.style.borderColor = 'var(--border)'
                    el.style.transform = 'translateY(0)'
                    el.style.boxShadow = 'none'
                  }}
                >
                  <div style={{
                    width: 40, height: 40, flexShrink: 0,
                    borderRadius: 10,
                    background: 'var(--accent-dim)',
                    border: '1px solid rgba(255,176,0,0.25)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    color: 'var(--accent)',
                  }}>
                    <Icon size={17} />
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.82rem', fontWeight: 600, color: 'var(--text)' }}>
                      {label}
                    </div>
                    <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem', color: 'var(--muted)', marginTop: '0.1rem' }}>
                      {sub}
                    </div>
                  </div>
                  <ArrowUpRight size={14} style={{ color: 'var(--muted)', flexShrink: 0 }} />
                </a>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer style={{
        borderTop: '1px solid var(--border)',
        padding: '1.5rem 1.5rem',
        textAlign: 'center',
      }}>
        <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.68rem', color: 'var(--muted)' }}>
          <span style={{ color: 'var(--accent)' }}>{'</'}</span>
          built by Vishnusmaran B Rai
          <span style={{ color: 'var(--accent)' }}>{'>'}</span>
          {' · '}
          {new Date().getFullYear()}
        </p>
      </footer>
    </>
  )
}
