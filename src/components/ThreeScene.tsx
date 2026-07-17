/**
 * ThreeScene.tsx
 * ─────────────────────────────────────────────────────────────────────────────
 * WebGL scene: rotating wireframe icosahedron + particle field.
 * Terminal / code-native aesthetic using the amber accent color.
 *
 * Performance safeguards:
 *  • prefers-reduced-motion → renders static fallback, no WebGL
 *  • WebGL unavailable     → CSS fallback
 *  • Mobile (< 768px)      → halved particle count, RAF-throttled
 *  • ResizeObserver keeps canvas in sync with container
 * ─────────────────────────────────────────────────────────────────────────────
 */

import { useEffect, useRef, memo, useState } from 'react'
import * as THREE from 'three'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

// ── Helpers ───────────────────────────────────────────────────────────────────

let webGLAvailableCache: boolean | null = null;
function isWebGLAvailable(): boolean {
  if (webGLAvailableCache !== null) return webGLAvailableCache;
  try {
    const canvas = document.createElement('canvas')
    webGLAvailableCache = !!(
      window.WebGLRenderingContext &&
      (canvas.getContext('webgl') || canvas.getContext('experimental-webgl'))
    )
    return webGLAvailableCache
  } catch {
    webGLAvailableCache = false
    return false
  }
}

let reducedMotionCache: boolean | null = null;
function prefersReducedMotion(): boolean {
  if (reducedMotionCache !== null) return reducedMotionCache;
  reducedMotionCache = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  return reducedMotionCache
}

// ── Fallback (CSS) ────────────────────────────────────────────────────────────

function StaticFallback() {
  return (
    <div style={{
      width: '100%',
      height: '100%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      position: 'relative',
      overflow: 'hidden',
    }}>
      {/* Dot-grid pattern */}
      <div style={{
        position: 'absolute',
        inset: 0,
        backgroundImage: 'radial-gradient(circle, rgba(255,176,0,0.18) 1px, transparent 1px)',
        backgroundSize: '36px 36px',
        maskImage: 'radial-gradient(ellipse 70% 70% at 50% 50%, black 20%, transparent 100%)',
      }} />
      {/* Central hexagon outline */}
      <svg width="240" height="240" viewBox="0 0 240 240" fill="none" aria-hidden="true">
        <polygon
          points="120,10 210,55 210,185 120,230 30,185 30,55"
          stroke="rgba(255,176,0,0.4)"
          strokeWidth="1"
          fill="none"
        />
        <polygon
          points="120,40 185,72 185,168 120,200 55,168 55,72"
          stroke="rgba(255,176,0,0.2)"
          strokeWidth="1"
          fill="none"
        />
        <polygon
          points="120,70 160,90 160,150 120,170 80,150 80,90"
          stroke="rgba(255,176,0,0.1)"
          strokeWidth="1"
          fill="none"
        />
      </svg>
    </div>
  )
}

// ── Main component ────────────────────────────────────────────────────────────

const ThreeScene = memo(function ThreeScene() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [showTiltBtn, setShowTiltBtn] = useState(false)
  const requestPermissionRef = useRef<(() => void) | null>(null)

  // Skip WebGL on reduced-motion or unavailable
  if (prefersReducedMotion() || !isWebGLAvailable()) {
    return <StaticFallback />
  }

  useEffect(() => {
    console.log("ThreeScene mounted")
    const canvas = canvasRef.current
    if (!canvas) return

    const isMobile = window.innerWidth < 768
    const PARTICLE_COUNT = isMobile ? 280 : 600

    // Touch device detection
    const isTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0

    // ── Scene setup ─────────────────────────────────────────────────────────
    const renderer = new THREE.WebGLRenderer({
      canvas,
      alpha: true,
      antialias: !isMobile,
      powerPreference: 'low-power',
    })
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, isMobile ? 1.5 : 2))
    renderer.setClearColor(0x000000, 0)

    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(55, 1, 0.1, 100)
    camera.position.z = 5

    // ── Wireframe icosahedron ────────────────────────────────────────────────
    const icoGeo = new THREE.IcosahedronGeometry(1.6, 1) // detail=1: clean low-poly
    const icoMat = new THREE.MeshBasicMaterial({
      color: 0xffb000,
      wireframe: true,
      transparent: true,
      opacity: 0.28,
    })
    const icosahedron = new THREE.Mesh(icoGeo, icoMat)
    scene.add(icosahedron)

    // Inner solid shell (very dark, gives sense of depth)
    const innerGeo = new THREE.IcosahedronGeometry(1.55, 1)
    const innerMat = new THREE.MeshBasicMaterial({
      color: 0x1a1400,
      transparent: true,
      opacity: 0.55,
    })
    const innerMesh = new THREE.Mesh(innerGeo, innerMat)
    scene.add(innerMesh)

    // ── Particle field ───────────────────────────────────────────────────────
    const positions = new Float32Array(PARTICLE_COUNT * 3)
    const sizes     = new Float32Array(PARTICLE_COUNT)

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const r     = 2.5 + Math.random() * 2.5
      const theta = Math.random() * Math.PI * 2
      const phi   = Math.acos(2 * Math.random() - 1)
      positions[i * 3]     = r * Math.sin(phi) * Math.cos(theta)
      positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta)
      positions[i * 3 + 2] = r * Math.cos(phi)
      sizes[i] = Math.random() * 2.5 + 0.5
    }

    const ptGeo = new THREE.BufferGeometry()
    ptGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3))

    const ptMat = new THREE.PointsMaterial({
      color: 0xffb000,
      size: 0.04,
      transparent: true,
      opacity: 0.45,
      sizeAttenuation: true,
    })

    const points = new THREE.Points(ptGeo, ptMat)
    scene.add(points)

    // ── Raycasting & Mouse Interaction ───────────────────────────────────────
    const raycaster = new THREE.Raycaster()
    const tempMouse = new THREE.Vector2()
    const mouse  = { x: 0, y: 0 }
    const target = { x: 0, y: 0 }
    let isHovered = false

    const onMouseMove = (e: MouseEvent) => {
      // Normalize mouse coordinates for parallax
      mouse.x =  (e.clientX / window.innerWidth  - 0.5) * 2
      mouse.y = -(e.clientY / window.innerHeight - 0.5) * 2

      // Normalize mouse coordinates for Raycaster
      const rect = canvas.getBoundingClientRect()
      tempMouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1
      tempMouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1

      raycaster.setFromCamera(tempMouse, camera)
      const intersects = raycaster.intersectObject(icosahedron)
      isHovered = intersects.length > 0
    }

    if (!isTouch) {
      window.addEventListener('mousemove', onMouseMove, { passive: true })
    }

    // ── Drag Interaction ─────────────────────────────────────────────────────
    let isDragging = false
    let prevPointerX = 0
    let prevPointerY = 0
    let dragVelocityX = 0
    let dragVelocityY = 0

    const onPointerDown = (e: PointerEvent) => {
      isDragging = true
      prevPointerX = e.clientX
      prevPointerY = e.clientY
      canvas.setPointerCapture(e.pointerId)
      canvas.style.cursor = 'grabbing'
    }

    const onPointerMove = (e: PointerEvent) => {
      if (!isTouch && !isDragging) {
        // Perform raycast check on desktop hover
        const rect = canvas.getBoundingClientRect()
        tempMouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1
        tempMouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1
        raycaster.setFromCamera(tempMouse, camera)
        const intersects = raycaster.intersectObject(icosahedron)
        isHovered = intersects.length > 0

        mouse.x =  (e.clientX / window.innerWidth  - 0.5) * 2
        mouse.y = -(e.clientY / window.innerHeight - 0.5) * 2
      }

      if (!isDragging) return

      const dx = e.clientX - prevPointerX
      const dy = e.clientY - prevPointerY
      dragVelocityX = dx * 0.005
      dragVelocityY = dy * 0.005

      prevPointerX = e.clientX
      prevPointerY = e.clientY
    }

    const onPointerUp = (e: PointerEvent) => {
      if (isDragging) {
        isDragging = false
        canvas.releasePointerCapture(e.pointerId)
        canvas.style.cursor = 'grab'
      }
    }

    canvas.addEventListener('pointerdown', onPointerDown, { passive: true })
    canvas.addEventListener('pointermove', onPointerMove, { passive: true })
    canvas.addEventListener('pointerup', onPointerUp, { passive: true })
    canvas.addEventListener('pointercancel', onPointerUp, { passive: true })

    // ── Device Orientation (Mobile Gyroscope) ──────────────────────────────────
    const targetGyro = { x: 0, y: 0 }
    const gyro = { x: 0, y: 0 }
    const hasGyroRef = { current: false }

    const onDeviceOrientation = (e: DeviceOrientationEvent) => {
      if (e.gamma !== null && e.beta !== null) {
        targetGyro.x = Math.max(-1, Math.min(1, e.gamma / 30))
        targetGyro.y = Math.max(-1, Math.min(1, (e.beta - 45) / 30)) // tilted viewing offset
      }
    }

    const isIOS = typeof DeviceOrientationEvent !== 'undefined' && typeof (DeviceOrientationEvent as any).requestPermission === 'function'

    if (isIOS) {
      setShowTiltBtn(true)
    } else if (isTouch) {
      window.addEventListener('deviceorientation', onDeviceOrientation, { passive: true })
      hasGyroRef.current = true
    }

    const requestPermission = async () => {
      if (isIOS) {
        try {
          const permissionState = await (DeviceOrientationEvent as any).requestPermission()
          if (permissionState === 'granted') {
            window.addEventListener('deviceorientation', onDeviceOrientation, { passive: true })
            hasGyroRef.current = true
            setShowTiltBtn(false)
          }
        } catch (err) {
          console.error('Orientation permission error:', err)
        }
      }
    }
    requestPermissionRef.current = requestPermission

    // ── Resize handling ──────────────────────────────────────────────────────
    const resize = () => {
      const { offsetWidth: w, offsetHeight: h } = canvas.parentElement!
      renderer.setSize(w, h)
      camera.aspect = w / h
      camera.updateProjectionMatrix()
    }
    const ro = new ResizeObserver(resize)
    ro.observe(canvas.parentElement!)
    resize()

    // ── ScrollTrigger ────────────────────────────────────────────────────────
    const scrollTriggerInstance = prefersReducedMotion() ? null : ScrollTrigger.create({
      trigger: '#hero',
      start: 'top top',
      end: 'bottom top',
      scrub: 0.5,
    })

    // ── Animation loop ───────────────────────────────────────────────────────
    let rafId: number
    let frame = 0

    const animate = () => {
      rafId = requestAnimationFrame(animate)

      if (isMobile && frame++ % 2 !== 0) return

      // 1. Idle auto-rotation (paused when user is actively dragging)
      const speedMultiplier = isHovered ? 2.5 : 1
      if (!isDragging) {
        icosahedron.rotation.x += 0.003 * speedMultiplier
        icosahedron.rotation.y += 0.005 * speedMultiplier
        points.rotation.y      -= 0.001
      }

      // 2. Parallax scroll scrubbing
      if (scrollTriggerInstance) {
        const progress = scrollTriggerInstance.progress
        icosahedron.rotation.y += progress * 0.05
        icosahedron.rotation.x += progress * 0.03
        
        const scaleVal = 1 - progress * 0.35
        icosahedron.scale.set(scaleVal, scaleVal, scaleVal)
        points.scale.set(scaleVal, scaleVal, scaleVal)
      }

      // 3. Mouse follow parallax (desktop only)
      if (!isTouch && !isDragging) {
        target.x += (mouse.x - target.x) * 0.04
        target.y += (mouse.y - target.y) * 0.04
        icosahedron.rotation.x += target.y * 0.003
        icosahedron.rotation.y += target.x * 0.003
      }

      // 4. Gyroscope orientation parallax (mobile only)
      if (isTouch && !isDragging && hasGyroRef.current) {
        gyro.x += (targetGyro.x - gyro.x) * 0.05
        gyro.y += (targetGyro.y - gyro.y) * 0.05
        icosahedron.rotation.x += gyro.y * 0.005
        icosahedron.rotation.y += gyro.x * 0.005
      }

      // 5. Manual drag spin & inertia decay
      if (isDragging) {
        icosahedron.rotation.y += dragVelocityX
        icosahedron.rotation.x += dragVelocityY
      } else {
        icosahedron.rotation.y += dragVelocityX
        icosahedron.rotation.x += dragVelocityY
        dragVelocityX *= 0.95
        dragVelocityY *= 0.95
      }

      // 6. Hover opacity/glow affordance feedback
      if (!isTouch) {
        const targetOpacity = isHovered ? 0.62 : 0.28
        icoMat.opacity += (targetOpacity - icoMat.opacity) * 0.08
        const targetInnerOpacity = isHovered ? 0.72 : 0.55
        innerMat.opacity += (targetInnerOpacity - innerMat.opacity) * 0.08
      }

      renderer.render(scene, camera)
    }
    animate()

    // ── Cleanup ──────────────────────────────────────────────────────────────
    return () => {
      console.log("ThreeScene unmounted")
      cancelAnimationFrame(rafId)
      if (!isTouch) {
        window.removeEventListener('mousemove', onMouseMove)
      }
      canvas.removeEventListener('pointerdown', onPointerDown)
      canvas.removeEventListener('pointermove', onPointerMove)
      canvas.removeEventListener('pointerup', onPointerUp)
      canvas.removeEventListener('pointercancel', onPointerUp)
      window.removeEventListener('deviceorientation', onDeviceOrientation)
      ro.disconnect()
      if (scrollTriggerInstance) {
        scrollTriggerInstance.kill()
      }
      renderer.dispose()
      icoGeo.dispose()
      icoMat.dispose()
      innerGeo.dispose()
      innerMat.dispose()
      ptGeo.dispose()
      ptMat.dispose()
    }
  }, [])

  const handleTiltClick = () => {
    if (requestPermissionRef.current) {
      requestPermissionRef.current()
    }
  }

  return (
    <div style={{ width: '100%', height: '100%', position: 'relative' }}>
      <canvas
        ref={canvasRef}
        style={{ display: 'block', width: '100%', height: '100%', cursor: 'grab' }}
        aria-hidden="true"
      />
      {showTiltBtn && (
        <button
          onClick={handleTiltClick}
          style={{
            position: 'absolute',
            bottom: '0.75rem',
            left: '0.75rem',
            fontFamily: 'var(--font-mono)',
            fontSize: '0.6rem',
            color: 'var(--accent)',
            border: '1px solid var(--accent)',
            padding: '0.2rem 0.5rem',
            borderRadius: '4px',
            background: 'rgba(255,176,0,0.1)',
            zIndex: 10,
          }}
        >
          [ Enable Device Tilt ]
        </button>
      )}
    </div>
  )
})

export default ThreeScene
