import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { Download, FileText, Eye } from 'lucide-react'

export default function Resume() {
  const sectionRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.resume-inner', {
        opacity: 0,
        y: 30,
        duration: 0.65,
        ease: 'power3.out',
        scrollTrigger: { trigger: '.resume-inner', start: 'top 88%', once: true },
      })
    }, sectionRef)
    return () => ctx.revert()
  }, [])

  return (
    <section id="resume" className="section" ref={sectionRef}
      style={{ background: 'var(--surface)', borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)' }}>
      <div className="section-inner">
        <div className="resume-inner" style={{ textAlign: 'center', maxWidth: '520px', margin: '0 auto' }}>
          {/* Icon */}
          <div style={{
            width: 60, height: 60,
            borderRadius: 14,
            background: 'var(--accent-dim)',
            border: '1px solid rgba(255,176,0,0.3)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: 'var(--accent)',
            margin: '0 auto 1.25rem',
          }}>
            <FileText size={26} />
          </div>

          <p className="section-label">// my resume</p>
          <h2 className="section-title" style={{ marginBottom: '1rem' }}>
            Resume<span className="accent">;</span>
          </h2>

          <p style={{ fontSize: '0.9rem', color: 'var(--muted-2)', lineHeight: 1.7, marginBottom: '2rem' }}>
            A concise overview of my education, projects, and skills.
          </p>

          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '1rem',
            flexWrap: 'wrap'
          }}>
            {/* View Resume Button */}
            <a href="/resume.pdf" target="_blank" rel="noopener noreferrer"
               className="btn-primary">
              <Eye size={16} />
              View Resume
            </a>

            {/* Download Resume Button */}
            <a href="/resume.pdf" download="Vishnusmaran_Rai_Resume.pdf"
               className="btn-ghost">
              <Download size={16} />
              Download
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}
