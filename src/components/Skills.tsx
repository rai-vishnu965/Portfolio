import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

interface SkillGroup {
  category: string
  items: string[]
}

const SKILLS: SkillGroup[] = [
  {
    category: 'Languages',
    items: ['Java', 'C', 'SQL', 'Python'],
  },
  {
    category: 'Web Development',
    items: ['HTML5', 'CSS3', 'JavaScript', 'FastAPI', 'Streamlit'],
  },
  {
    category: 'Tools & Frameworks',
    items: ['OpenCV', 'YOLO', 'SQLite', 'Git'],
  },
  {
    category: 'Certifications',
    items: [
      'Infosys Springboard – Associate in IT Foundation Skills (Java)',
      'DSA',
      'DBMS',
      'NoSQL',
    ],
  },
]

export default function Skills() {
  const sectionRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const isReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    const ctx = gsap.context(() => {
      // 1. Heading reveal (one-time)
      gsap.fromTo('.skills-heading',
        { opacity: 0, y: isReduced ? 0 : 20 },
        {
          opacity: 1,
          y: 0,
          duration: 0.7,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: '.skills-heading',
            start: 'top 88%',
            once: true,
          }
        }
      )

      // 2. Skill group titles and pills staggered scrub
      gsap.utils.toArray<HTMLElement>('.skill-group').forEach((group, i) => {
        // Group title entrance (one-time reveal)
        gsap.fromTo(group.querySelector('.skill-category-header'),
          { opacity: 0, x: isReduced ? 0 : -20 },
          {
            opacity: 1,
            x: 0,
            duration: 0.6,
            scrollTrigger: {
              trigger: group,
              start: 'top 92%',
              once: true,
            }
          }
        )

        // Staggered pills scrub
        const pills = group.querySelectorAll('.tag')
        gsap.fromTo(pills,
          {
            opacity: 0,
            y: isReduced ? 0 : 15,
            scale: isReduced ? 1 : 0.85,
          },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            stagger: isReduced ? 0 : 0.05,
            scrollTrigger: {
              trigger: group,
              start: 'top 90%',
              end: 'top 70%',
              scrub: isReduced ? false : 0.5,
              once: isReduced,
            }
          }
        )
      })
    }, sectionRef)

    // Force a ScrollTrigger refresh after the DOM has settled to adapt to layout changes
    const timer = setTimeout(() => {
      ScrollTrigger.refresh()
    }, 50)

    return () => {
      ctx.revert()
      clearTimeout(timer)
    }
  }, [])

  return (
    <section id="skills" className="section" ref={sectionRef} style={{ paddingBottom: '3.5rem' }}>
      <div className="section-inner">
        {/* Heading */}
        <div className="skills-heading" style={{ marginBottom: '3rem', textAlign: 'center' }}>
          <p className="section-label">// what I use</p>
          <h2 className="section-title">Skills<span className="accent">;</span></h2>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '2.25rem', maxWidth: '860px', margin: '0 auto' }}>
          {SKILLS.map(({ category, items }) => (
            <div key={category} className="skill-group">
              {/* Category header with rule */}
              <div className="skill-category-header" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.8rem' }}>
                <span style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.7rem',
                  color: 'var(--accent)',
                  letterSpacing: '0.12em',
                  textTransform: 'uppercase',
                  flexShrink: 0,
                }}>
                  {category}
                </span>
                <div className="rule" />
              </div>

              {/* Pills */}
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                {items.map(item => (
                  <span key={item} className="tag">{item}</span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
