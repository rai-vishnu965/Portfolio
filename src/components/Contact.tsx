import { useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
import { Mail, ArrowUpRight, Send, CheckCircle2, AlertCircle } from 'lucide-react'
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
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  })
  const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle')
  const [statusLogs, setStatusLogs] = useState<string[]>([])

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.utils.toArray<HTMLElement>('.contact-reveal').forEach((el, i) => {
        gsap.from(el, {
          opacity: 0,
          y: 22,
          duration: 0.55,
          ease: 'power3.out',
          delay: i * 0.08,
          scrollTrigger: { trigger: el, start: 'top 90%', once: true },
        })
      })
    }, sectionRef)
    return () => ctx.revert()
  }, [])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.name || !formData.email || !formData.message) return

    setStatus('sending')
    setStatusLogs([
      'Connecting to mail relay server...',
      'Encrypting connection channel (TLS)...'
    ])

    try {
      // Small delays for realistic console log effects
      await new Promise(resolve => setTimeout(resolve, 600))
      setStatusLogs(prev => [...prev, 'Authenticating App credentials...'])
      await new Promise(resolve => setTimeout(resolve, 500))
      setStatusLogs(prev => [...prev, 'Transmitting secure mail payload...'])

      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      const data = await res.json()
      if (res.ok) {
        setStatus('success')
        setStatusLogs(prev => [...prev, 'SUCCESS: Message delivered to inbox.'])
        setFormData({ name: '', email: '', subject: '', message: '' })
      } else {
        throw new Error(data.error || 'Failed to deliver message.')
      }
    } catch (err: any) {
      setStatus('error')
      setStatusLogs(prev => [...prev, `ERROR: ${err.message || 'Relay failed.'}`])
    }
  }

  return (
    <>
      <section id="contact" className="section" ref={sectionRef}>
        <div className="section-inner" style={{ maxWidth: '780px' }}>
          <div className="contact-reveal" style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
            <p className="section-label">// reach out</p>
            <h2 className="section-title" style={{ marginBottom: '1rem' }}>
              Contact<span className="accent">;</span>
            </h2>
            <p style={{ fontSize: '0.9rem', color: 'var(--muted-2)', lineHeight: 1.7 }}>
              Open to internships, project collaborations, and interesting conversations.
              Send an email directly through the server terminal below.
            </p>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: '1.2fr 0.8fr',
            gap: '2.5rem',
            alignItems: 'start',
          }} className="contact-grid">
            
            {/* Left: Terminal-Style Contact Form */}
            <form onSubmit={handleSubmit} className="contact-reveal" style={{
              background: 'var(--surface)',
              border: '1px solid var(--border)',
              borderRadius: 'var(--radius)',
              padding: '1.5rem',
              display: 'flex',
              flexDirection: 'column',
              gap: '1.1rem',
              position: 'relative'
            }}>
              {/* Terminal Title Bar */}
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                borderBottom: '1px solid var(--border)',
                paddingBottom: '0.8rem',
                marginBottom: '0.4rem',
                fontFamily: 'var(--font-mono)',
                fontSize: '0.72rem',
                color: 'var(--muted)'
              }}>
                <span>relayer@vishnu-portfolio:~$ sendmail</span>
                <div style={{ display: 'flex', gap: '0.35rem' }}>
                  <div style={{ width: 7, height: 7, borderRadius: '50%', background: '#ff5f56' }} />
                  <div style={{ width: 7, height: 7, borderRadius: '50%', background: '#ffbd2e' }} />
                  <div style={{ width: 7, height: 7, borderRadius: '50%', background: '#27c93f' }} />
                </div>
              </div>

              {/* Name & Email Grid */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '1rem'
              }} className="form-row">
                <div>
                  <label htmlFor="name" className="form-label">NAME *</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Enter name"
                    className="form-input"
                    disabled={status === 'sending'}
                  />
                </div>
                <div>
                  <label htmlFor="email" className="form-label">EMAIL *</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Enter email"
                    className="form-input"
                    disabled={status === 'sending'}
                  />
                </div>
              </div>

              {/* Subject */}
              <div>
                <label htmlFor="subject" className="form-label">SUBJECT</label>
                <input
                  type="text"
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  placeholder="Inquiry / Collaboration / Greeting"
                  className="form-input"
                  disabled={status === 'sending'}
                />
              </div>

              {/* Message */}
              <div>
                <label htmlFor="message" className="form-label">MESSAGE *</label>
                <textarea
                  id="message"
                  name="message"
                  required
                  rows={5}
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="Write your message here..."
                  className="form-input form-textarea"
                  disabled={status === 'sending'}
                />
              </div>

              {/* Status & Terminal Logs Console */}
              {status !== 'idle' && (
                <div style={{
                  background: '#040405',
                  border: '1px solid var(--border)',
                  borderRadius: 'var(--radius-sm)',
                  padding: '0.8rem',
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.72rem',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.3rem'
                }}>
                  {statusLogs.map((log, i) => (
                    <div key={i} style={{
                      color: log.startsWith('SUCCESS') 
                        ? '#27c93f' 
                        : log.startsWith('ERROR') 
                          ? '#ff5f56' 
                          : 'var(--muted-2)'
                    }}>
                      &gt; {log}
                    </div>
                  ))}
                  {status === 'sending' && (
                    <div className="terminal-cursor" style={{ color: 'var(--accent)' }}>&gt; _</div>
                  )}
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={status === 'sending'}
                className="submit-btn"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.6rem',
                  padding: '0.8rem 1.2rem',
                  background: status === 'success' 
                    ? 'rgba(39, 201, 63, 0.15)' 
                    : status === 'error' 
                      ? 'rgba(255, 95, 86, 0.15)' 
                      : 'var(--surface-2)',
                  border: `1px solid ${
                    status === 'success' 
                      ? '#27c93f' 
                      : status === 'error' 
                        ? '#ff5f56' 
                        : 'var(--border)'
                  }`,
                  borderRadius: 'var(--radius)',
                  color: status === 'success' 
                    ? '#27c93f' 
                    : status === 'error' 
                      ? '#ff5f56' 
                      : 'var(--text)',
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.8rem',
                  fontWeight: 600,
                  cursor: status === 'sending' ? 'not-allowed' : 'pointer',
                  transition: 'all 0.25s ease'
                }}
              >
                {status === 'sending' && <span>Sending...</span>}
                {status === 'success' && (
                  <>
                    <CheckCircle2 size={15} />
                    <span>Delivered!</span>
                  </>
                )}
                {status === 'error' && (
                  <>
                    <AlertCircle size={15} />
                    <span>Failed - Retry</span>
                  </>
                )}
                {status === 'idle' && (
                  <>
                    <Send size={14} />
                    <span>Submit Mail Packet</span>
                  </>
                )}
              </button>
            </form>

            {/* Right: Direct Channels */}
            <div className="contact-reveal" style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <p style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '0.72rem',
                color: 'var(--muted)',
                marginBottom: '0.2rem',
                letterSpacing: '1px'
              }}>DIRECT CHANNELS</p>
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
                    padding: '0.9rem 1.1rem',
                    background: 'var(--surface)',
                    border: '1px solid var(--border)',
                    borderRadius: 'var(--radius)',
                    textDecoration: 'none',
                    transition: 'border-color 0.2s, box-shadow 0.2s, transform 0.15s',
                  }}
                  onMouseEnter={e => {
                    const el = e.currentTarget
                    el.style.borderColor = 'rgba(255,176,0,0.35)'
                    el.style.transform = 'translateY(-2px)'
                    el.style.boxShadow = '0 4px 15px rgba(255,176,0,0.05)'
                  }}
                  onMouseLeave={e => {
                    const el = e.currentTarget
                    el.style.borderColor = 'var(--border)'
                    el.style.transform = 'translateY(0)'
                    el.style.boxShadow = 'none'
                  }}
                >
                  <div style={{
                    width: 36, height: 36, flexShrink: 0,
                    borderRadius: 8,
                    background: 'var(--accent-dim)',
                    border: '1px solid rgba(255,176,0,0.25)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    color: 'var(--accent)',
                  }}>
                    <Icon size={15} />
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.78rem', fontWeight: 600, color: 'var(--text)' }}>
                      {label}
                    </div>
                    <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.68rem', color: 'var(--muted)', marginTop: '0.1rem' }}>
                      {sub}
                    </div>
                  </div>
                  <ArrowUpRight size={13} style={{ color: 'var(--muted)', flexShrink: 0 }} />
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

      <style>{`
        .form-label {
          display: block;
          font-family: var(--font-mono);
          font-size: 0.68rem;
          font-weight: 600;
          color: var(--muted-2);
          margin-bottom: 0.4rem;
          letter-spacing: 0.5px;
        }

        .form-input {
          width: 100%;
          padding: 0.75rem 0.9rem;
          background: var(--surface-2);
          border: 1px solid var(--border);
          border-radius: var(--radius-sm);
          color: var(--text);
          font-family: var(--font-mono);
          font-size: 0.8rem;
          transition: border-color 0.2s, box-shadow 0.2s;
        }

        .form-input:focus {
          outline: none;
          border-color: var(--accent);
          box-shadow: 0 0 8px var(--accent-glow);
        }

        .form-input::placeholder {
          color: var(--muted);
          font-size: 0.75rem;
        }

        .form-textarea {
          resize: vertical;
          min-height: 110px;
        }

        .submit-btn:hover:not(:disabled) {
          border-color: var(--accent) !important;
          background: var(--accent-dim) !important;
          color: var(--accent) !important;
        }

        @keyframes blink {
          50% { opacity: 0; }
        }

        .terminal-cursor {
          animation: blink 1s step-end infinite;
        }

        @media (max-width: 768px) {
          .contact-grid {
            grid-template-columns: 1fr !important;
            gap: 2rem !important;
          }
          .form-row {
            grid-template-columns: 1fr !important;
            gap: 1.1rem !important;
          }
        }
      `}</style>
    </>
  )
}
