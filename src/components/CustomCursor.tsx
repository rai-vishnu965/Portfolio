import { useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'

export default function CustomCursor() {
  const followerRef = useRef<HTMLDivElement>(null)
  const dotRef = useRef<HTMLDivElement>(null)
  const [isEnabled, setIsEnabled] = useState(false)
  const [isReduced, setIsReduced] = useState(false)
  
  const [hoveredStyle, setHoveredStyle] = useState<{
    width: string
    height: string
    borderRadius: string
  } | null>(null)

  const hoveredElementRef = useRef<HTMLElement | null>(null)
  const lastSnappedTimeRef = useRef<number>(0)
  
  // Spring physics references for rubber-ball wobble
  const bounceDisplacementRef = useRef<number>(0)
  const bounceVelocityRef = useRef<number>(0)

  useEffect(() => {
    // Detect fine-pointer hover capabilities (desktop)
    const hasFinePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    if (!hasFinePointer) {
      return
    }

    setIsEnabled(true)
    setIsReduced(prefersReduced)
  }, [])

  useEffect(() => {
    if (!isEnabled) return

    const cursor = followerRef.current
    const dot = dotRef.current
    if (!cursor || !dot) return

    // Position initial cursor coordinates out of the viewport
    cursor.style.transform = 'translate3d(-100px, -100px, 0) translate(-50%, -50%)'
    dot.style.transform = 'translate3d(-100px, -100px, 0) translate(-50%, -50%)'

    let mouseX = -100
    let mouseY = -100
    let followerX = -100
    let followerY = -100
    let isFirstMove = true

    const triggerExitBounce = () => {
      // 1. Trigger the cursor follower's physics wobble
      if (!isReduced) {
        bounceDisplacementRef.current = -0.45 // Compress by 45% initially
        bounceVelocityRef.current = 0.15     // Outward impulse
      }

      // 2. Trigger the HTML button/element's rubber ball bounce animation
      const exitedEl = hoveredElementRef.current
      if (exitedEl) {
        exitedEl.classList.remove('button-bounce')
        void exitedEl.offsetWidth // Force reflow to restart animation on rapid hover exits
        exitedEl.classList.add('button-bounce')
        
        setTimeout(() => {
          exitedEl.classList.remove('button-bounce')
        }, 600)
      }
    }

    const onMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX
      mouseY = e.clientY

      if (isFirstMove) {
        followerX = mouseX
        followerY = mouseY
        isFirstMove = false
      }

      const activeEl = hoveredElementRef.current
      if (activeEl) {
        const rect = activeEl.getBoundingClientRect()
        const margin = 10 // small tolerance
        if (
          e.clientX < rect.left - margin ||
          e.clientX > rect.right + margin ||
          e.clientY < rect.top - margin ||
          e.clientY > rect.bottom + margin
        ) {
          triggerExitBounce()
          hoveredElementRef.current = null
          setHoveredStyle(null)
          lastSnappedTimeRef.current = Date.now()
        }
      }
    }

    const onScroll = () => {
      const activeEl = hoveredElementRef.current
      if (activeEl) {
        const rect = activeEl.getBoundingClientRect()
        const margin = 10
        if (
          mouseX < rect.left - margin ||
          mouseX > rect.right + margin ||
          mouseY < rect.top - margin ||
          mouseY > rect.bottom + margin
        ) {
          triggerExitBounce()
          hoveredElementRef.current = null
          setHoveredStyle(null)
          lastSnappedTimeRef.current = Date.now()
        }
      }
    }

    // Animation physics loop via requestAnimationFrame for smooth lag and organic stretching
    let rAFId: number

    const tick = () => {
      const activeEl = hoveredElementRef.current
      let targetX = mouseX
      let targetY = mouseY

      if (activeEl) {
        const rect = activeEl.getBoundingClientRect()
        targetX = rect.left + rect.width / 2
        targetY = rect.top + rect.height / 2
      }

      // Lag/physics easing calculations
      const ease = activeEl ? 0.25 : 0.15 // faster snap when hovering buttons
      followerX += (targetX - followerX) * ease
      followerY += (targetY - followerY) * ease

      // Spring physics simulation: Force = -k*x - c*v
      let bounceDisplacement = bounceDisplacementRef.current
      let bounceVelocity = bounceVelocityRef.current

      const k = 0.16 // stiffness
      const c = 0.10 // damping
      const force = -k * bounceDisplacement - c * bounceVelocity
      bounceVelocity += force
      bounceDisplacement += bounceVelocity

      bounceDisplacementRef.current = bounceDisplacement
      bounceVelocityRef.current = bounceVelocity

      // Suppress rotation during transition back to circle (420ms buffer)
      const isTransitioning = Date.now() - lastSnappedTimeRef.current < 420

      if (activeEl) {
        // Snapped state: Disable stretch/rotation/wobble
        cursor.style.transform = `translate3d(${followerX}px, ${followerY}px, 0) translate(-50%, -50%)`
      } else {
        // Free movement & Transitioning: Combine speed stretch with spring wobble
        const dx = targetX - followerX
        const dy = targetY - followerY
        const dist = Math.sqrt(dx * dx + dy * dy)

        const stretch = isReduced ? 0 : Math.min(dist * 0.005, 0.4)
        const scaleX = (1 + stretch) * (1 + bounceDisplacement)
        const scaleY = (1 - stretch) * (1 - bounceDisplacement)

        if (isTransitioning) {
          // Keep upright while shrinking and bouncing
          cursor.style.transform = `translate3d(${followerX}px, ${followerY}px, 0) translate(-50%, -50%) scale(${scaleX}, ${scaleY})`
        } else {
          const angle = Math.atan2(dy, dx)
          cursor.style.transform = `translate3d(${followerX}px, ${followerY}px, 0) translate(-50%, -50%) rotate(${angle}rad) scale(${scaleX}, ${scaleY})`
        }
      }

      // Inner dot tracks raw mouse coordinates instantly with 0 lag
      dot.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0) translate(-50%, -50%)`

      rAFId = requestAnimationFrame(tick)
    }

    rAFId = requestAnimationFrame(tick)

    // ── Event Delegation for Hover Morphs ────────────────────────────────────
    const onMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement
      const interactiveEl = target.closest('a, button, [role="button"], .project-card') as HTMLElement | null

      if (interactiveEl && interactiveEl !== hoveredElementRef.current) {
        // Trigger bounce on the old element before snapping to the new one
        triggerExitBounce()

        hoveredElementRef.current = interactiveEl

        const rect = interactiveEl.getBoundingClientRect()
        const computedStyle = window.getComputedStyle(interactiveEl)

        const padding = 16 // Padding to expand slightly outside the button
        const targetWidth = rect.width + padding
        const targetHeight = rect.height + padding

        // Scale the border radius proportionally to fit the padded box
        const borderRadiusVal = computedStyle.borderRadius
        let targetRadius = '8px'
        if (borderRadiusVal && borderRadiusVal.includes('px')) {
          const rad = parseInt(borderRadiusVal)
          targetRadius = (rad + padding / 2) + 'px'
        } else if (borderRadiusVal) {
          targetRadius = borderRadiusVal
        }

        setHoveredStyle({
          width: `${targetWidth}px`,
          height: `${targetHeight}px`,
          borderRadius: targetRadius,
        })
      } else if (!interactiveEl && hoveredElementRef.current) {
        // Immediate release when entering any non-interactive element
        triggerExitBounce()
        hoveredElementRef.current = null
        setHoveredStyle(null)
        lastSnappedTimeRef.current = Date.now()
      }
    }

    // Bind listeners
    document.addEventListener('mousemove', onMouseMove, { passive: true })
    window.addEventListener('scroll', onScroll, { passive: true })
    document.addEventListener('mouseover', onMouseOver, { passive: true })

    // Window boundaries visibility toggling
    const onMouseLeaveWindow = () => {
      gsap.to([cursor, dot], { opacity: 0, duration: 0.15 })
    }
    const onMouseEnterWindow = () => {
      gsap.to([cursor, dot], { opacity: 1, duration: 0.15 })
    }

    document.addEventListener('mouseleave', onMouseLeaveWindow)
    document.addEventListener('mouseenter', onMouseEnterWindow)

    return () => {
      cancelAnimationFrame(rAFId)
      document.removeEventListener('mousemove', onMouseMove)
      window.removeEventListener('scroll', onScroll)
      document.removeEventListener('mouseover', onMouseOver)
      document.removeEventListener('mouseleave', onMouseLeaveWindow)
      document.removeEventListener('mouseenter', onMouseEnterWindow)
    }
  }, [isEnabled, isReduced])

  if (!isEnabled) return null

  return (
    <>
      {/* Stretched/lagged yellow follower circle */}
      <div
        ref={followerRef}
        className="cursor-invert"
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: hoveredStyle ? hoveredStyle.width : '36px',
          height: hoveredStyle ? hoveredStyle.height : '36px',
          borderRadius: hoveredStyle ? hoveredStyle.borderRadius : '50%',
          backgroundColor: 'var(--accent)', // Site accent (amber)
          pointerEvents: 'none',
          zIndex: 99999,
          mixBlendMode: 'difference',
          willChange: 'transform, width, height, border-radius',
          transformOrigin: 'center center',
          transition: isReduced
            ? 'none'
            : 'width 0.38s cubic-bezier(0.175, 0.885, 0.32, 1.275), height 0.38s cubic-bezier(0.175, 0.885, 0.32, 1.275), border-radius 0.38s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
        }}
      />

      {/* 0-lag inner black pointer dot */}
      <div
        ref={dotRef}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '10px',
          height: '10px',
          borderRadius: '50%',
          backgroundColor: '#000000', // Solid black
          border: '1px solid rgba(255, 255, 255, 0.2)', // subtle border for visibility outside follower
          pointerEvents: 'none',
          zIndex: 100000, // render above the yellow follower
          willChange: 'transform, opacity',
          opacity: hoveredStyle ? 0 : 1, // hide dot during button snap
          transition: 'opacity 0.15s ease',
        }}
      />
    </>
  )
}
