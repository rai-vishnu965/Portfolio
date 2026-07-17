import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

// ─── Math Helpers ────────────────────────────────────────────────────────────
function lerp(start: number, end: number, amt: number) {
  return (1 - amt) * start + amt * end
}

function interpolatePoints(progress: number) {
  // Set A: Caret shape pointing right (>) with collapsed vertices for morphing
  const setA = [60, 50, 140, 100, 60, 150, 60, 150, 60, 150, 60, 150]
  // Set B: Balanced diamond shape
  const setB = [100, 30, 170, 100, 100, 170, 30, 100, 100, 170, 30, 100]
  // Set C: Regular hexagon
  const setC = [100, 20, 170, 60, 170, 140, 100, 180, 30, 140, 30, 60]
  
  const current: number[] = []
  if (progress <= 0.5) {
    const t = progress / 0.5
    for (let i = 0; i < setA.length; i++) {
      current.push(lerp(setA[i], setB[i], t))
    }
  } else {
    const t = (progress - 0.5) / 0.5
    for (let i = 0; i < setA.length; i++) {
      current.push(lerp(setB[i], setC[i], t))
    }
  }
  
  const pairs: string[] = []
  for (let i = 0; i < current.length; i += 2) {
    pairs.push(`${current[i]},${current[i+1]}`)
  }
  return pairs.join(' ')
}

// ─── Component ────────────────────────────────────────────────────────────────
export default function ScrollSignature() {
  const polyRef = useRef<SVGPolygonElement>(null)
  const groupRef = useRef<SVGGElement>(null)

  useEffect(() => {
    const isReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const poly = polyRef.current
    const group = groupRef.current
    if (!poly) return

    if (isReduced) {
      // Set to stable diamond shape for users with reduced motion settings
      poly.setAttribute('points', interpolatePoints(0.5))
      return
    }

    // Set initial caret points
    poly.setAttribute('points', interpolatePoints(0))

    // Scrubbed trigger tied to document scroll
    const trigger = ScrollTrigger.create({
      trigger: document.body,
      start: 'top top',
      end: 'bottom bottom',
      scrub: 1,
      onUpdate: (self) => {
        const progress = self.progress
        
        // 1. Morph the polygon points
        poly.setAttribute('points', interpolatePoints(progress))
        
        // 2. Rotate the inner group based on scroll progress
        if (group) {
          gsap.set(group, {
            rotation: progress * 360,
            transformOrigin: '100px 100px',
          })
        }
      }
    })

    return () => {
      trigger.kill()
    }
  }, [])

  return (
    <div
      className="scroll-sig-container"
      style={{
        position: 'fixed',
        right: '4%',
        top: '50%',
        transform: 'translateY(-50%)',
        width: '180px',
        height: '180px',
        pointerEvents: 'none',
        zIndex: 1,
        opacity: 0.08,
        willChange: 'transform',
      }}
    >
      <svg
        viewBox="0 0 200 200"
        width="100%"
        height="100%"
        style={{ overflow: 'visible' }}
        aria-hidden="true"
      >
        <g ref={groupRef}>
          {/* Inner morphing shape */}
          <polygon
            ref={polyRef}
            stroke="var(--accent)"
            strokeWidth="1.5"
            fill="none"
          />
          {/* Concentric dashed boundary */}
          <circle
            cx="100"
            cy="100"
            r="80"
            stroke="var(--accent)"
            strokeWidth="0.75"
            strokeDasharray="4 4"
            fill="none"
          />
          {/* Target crosshairs */}
          <line x1="100" y1="10" x2="100" y2="20" stroke="var(--accent)" strokeWidth="0.75" />
          <line x1="100" y1="180" x2="100" y2="190" stroke="var(--accent)" strokeWidth="0.75" />
          <line x1="10" y1="100" x2="20" y2="100" stroke="var(--accent)" strokeWidth="0.75" />
          <line x1="180" y1="100" x2="190" y2="100" stroke="var(--accent)" strokeWidth="0.75" />
        </g>
      </svg>

      <style>{`
        @media (max-width: 768px) {
          .scroll-sig-container {
            width: 120px !important;
            height: 120px !important;
            right: 2% !important;
            opacity: 0.04 !important;
          }
        }
      `}</style>
    </div>
  )
}
