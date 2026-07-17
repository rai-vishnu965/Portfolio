import { useState, useEffect, useRef } from 'react'
import { Menu, X } from 'lucide-react'

const LINKS = [
  { label: 'Home',     href: '#hero' },
  { label: 'Projects', href: '#projects' },
  { label: 'About',    href: '#about' },
  { label: 'Skills',   href: '#skills' },
  { label: 'Resume',   href: '#resume' },
  { label: 'Contact',  href: '#contact' },
]

export default function Nav() {
  const [scrolled, setScrolled] = useState(false)
  const [open,     setOpen]     = useState(false)
  const [active,   setActive]   = useState('#hero')

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 50)
      // Spy on sections
      const ids = LINKS.map(l => l.href.replace('#', ''))
      for (const id of [...ids].reverse()) {
        const el = document.getElementById(id)
        if (el && window.scrollY >= el.offsetTop - 100) {
          setActive(`#${id}`)
          break
        }
      }
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const nav: React.CSSProperties = {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 100,
    height: 'var(--nav-h)',
    display: 'flex',
    alignItems: 'center',
    transition: 'background 0.3s, border-color 0.3s',
    background: scrolled ? 'rgba(9,9,10,0.90)' : 'transparent',
    backdropFilter: scrolled ? 'blur(14px)' : 'none',
    borderBottom: scrolled ? '1px solid var(--border)' : '1px solid transparent',
    padding: '0 1.5rem',
  }

  const inner: React.CSSProperties = {
    maxWidth: 'var(--max-w)',
    margin: '0 auto',
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  }

  return (
    <>
      <header style={nav}>
        <div style={inner}>
          {/* Wordmark */}
          <a href="#hero" onClick={() => { setActive('#hero'); setOpen(false) }} style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '0.95rem',
            fontWeight: 700,
            letterSpacing: '-0.02em',
            color: 'var(--accent)',
          }}>
            <span style={{ color: 'var(--muted)' }}>~/</span>vbr
          </a>

          {/* Desktop links */}
          <nav aria-label="Primary" style={{ display: 'flex', gap: '0.1rem' }} className="desktop-nav">
            {LINKS.map(l => (
              <a
                key={l.href}
                href={l.href}
                onClick={() => setActive(l.href)}
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.75rem',
                  padding: '0.35rem 0.7rem',
                  borderRadius: 'var(--radius-sm)',
                  border: '1px solid',
                  borderColor: active === l.href ? 'var(--accent)' : 'transparent',
                  background: active === l.href ? 'var(--accent-dim)' : 'transparent',
                  color: active === l.href ? 'var(--accent)' : 'var(--muted-2)',
                  transition: 'all 0.2s',
                }}
                onMouseEnter={e => {
                  if (active !== l.href) {
                    (e.currentTarget as HTMLElement).style.color = 'var(--text)'
                    ;(e.currentTarget as HTMLElement).style.background = 'var(--surface-2)'
                  }
                }}
                onMouseLeave={e => {
                  if (active !== l.href) {
                    (e.currentTarget as HTMLElement).style.color = 'var(--muted-2)'
                    ;(e.currentTarget as HTMLElement).style.background = 'transparent'
                  }
                }}
              >
                {l.label}
              </a>
            ))}
          </nav>

          {/* Mobile burger */}
          <button
            aria-label="Toggle menu"
            onClick={() => setOpen(o => !o)}
            className="mobile-burger"
            style={{ color: 'var(--text)', padding: '0.35rem', display: 'none' }}
          >
            {open ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </header>

      {/* Mobile drawer */}
      <div style={{
        position: 'fixed',
        top: 'var(--nav-h)',
        left: 0,
        right: 0,
        zIndex: 99,
        background: 'rgba(9,9,10,0.97)',
        backdropFilter: 'blur(16px)',
        borderBottom: '1px solid var(--border)',
        padding: open ? '0.75rem 1.5rem 1.25rem' : '0',
        maxHeight: open ? '400px' : '0',
        overflow: 'hidden',
        transition: 'max-height 0.3s ease, padding 0.3s ease',
        display: 'flex',
        flexDirection: 'column',
        gap: '0.2rem',
      }}>
        {LINKS.map(l => (
          <a
            key={l.href}
            href={l.href}
            onClick={() => { setActive(l.href); setOpen(false) }}
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '0.85rem',
              padding: '0.6rem 0.75rem',
              borderRadius: 'var(--radius-sm)',
              color: active === l.href ? 'var(--accent)' : 'var(--muted-2)',
              background: active === l.href ? 'var(--accent-dim)' : 'transparent',
            }}
          >
            {l.label}
          </a>
        ))}
      </div>

      <style>{`
        @media (max-width: 640px) {
          .desktop-nav { display: none !important; }
          .mobile-burger { display: flex !important; }
        }
      `}</style>
    </>
  )
}
