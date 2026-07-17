import { useEffect } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Nav from './components/Nav'
import Hero from './components/Hero'
import Projects from './components/Projects'
import About from './components/About'
import Skills from './components/Skills'
import Resume from './components/Resume'
import Contact from './components/Contact'
import ScrollSignature from './components/ScrollSignature'
import CustomCursor from './components/CustomCursor'

gsap.registerPlugin(ScrollTrigger)

export default function App() {
  useEffect(() => {
    // Refresh ScrollTrigger after fonts/images load
    window.addEventListener('load', () => ScrollTrigger.refresh())
    
    // Refresh after DOM layout settles to calculate correct section trigger points
    const timer = setTimeout(() => {
      ScrollTrigger.refresh()
    }, 150)

    return () => {
      ScrollTrigger.killAll()
      clearTimeout(timer)
    }
  }, [])

  return (
    <div style={{ background: 'var(--bg)', minHeight: '100vh' }}>
      <ScrollSignature />
      <Nav />
      <main>
        <Hero />
        <Projects />
        <About />
        <Skills />
        <Resume />
        <Contact />
      </main>
      <CustomCursor />
    </div>
  )
}
