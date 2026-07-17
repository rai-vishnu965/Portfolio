# ┌────────────────────────────────────────────────────────┐
# │  VISHNUSMARAN B RAI  //  PORTFOLIO SYSTEM v1.2.0        │
# └────────────────────────────────────────────────────────┘

Personal portfolio website designed with a terminal-inspired amber/phosphor aesthetic. Built with React 19, TypeScript, and Vite, featuring WebGL 3D scenes, custom physics-based cursor interactions, and GSAP scroll triggers.

---

```bash
$ cat profile.json
{
  "name": "Vishnusmaran B Rai",
  "role": "Full-Stack Developer",
  "theme": "Amber / Phosphor Terminal",
  "stack": ["React 19", "TypeScript", "Three.js", "GSAP"],
  "features": ["3D Icosahedron Hero", "Scroll-Snapping Sections", "Squishy Physics Cursor"]
}
```

---

## ⚡ Key Interactions & Mechanics

### 1. Interactive WebGL Hero Scene
* **Three.js Wireframe Icosahedron**: Subtly rotates to follow cursor coordinates on desktop, with a smooth physics interpolation damping.
* **Touch/Gyroscope Tilt**: Tilts based on device orientation on mobile devices with orientation sensors, falling back to slow auto-rotation on desktop and non-supported mobile viewports.
* **Hover Affordance**: Auto-rotation speeds up and the wireframe glow intensifies when directly hovered.

### 2. Custom Dual-Ring Physics Cursor
* **0-Lag Main Pointer**: A centered `10px` solid black dot locked directly to raw pointer coordinates.
* **Squishy Follower**: A `36px` yellow follower circle with organic stretch physics (scales and rotates dynamically in the direction of mouse movement based on velocity).
* **Bubble Snapping Morphs**: Morphs and expands to enclose hovered buttons/cards with an elastic `easeOutBack` curve (`cubic-bezier(0.175, 0.885, 0.32, 1.275)`).
* **Button Wobble on Exit**: Applies a custom springy `.button-bounce` CSS scale animation to HTML buttons/cards upon cursor exit, making elements feel physical and elastic.

### 3. GSAP Section Scrolling
* ScrollTrigger animations manage entrance reveals across all sections.
* Layout elements and decorative SVGs snap into place smoothly with custom coordinate offsets and scroll triggers.

---

## 📁 Repository Structure

```
├── public/
│   ├── favicon.svg
│   └── resume.pdf               # Downloadable PDF Resume
├── src/
│   ├── components/
│   │   ├── About.tsx            # Profile bio, stats, and terminal highlights
│   │   ├── BrandIcons.tsx       # Inline SVG vector logos for tech stack
│   │   ├── Contact.tsx          # Social channels & email links
│   │   ├── CustomCursor.tsx     # Custom cursor system (spring physics, snapping, exit wobble)
│   │   ├── Hero.tsx             # Typist subtitle, action triggers, ThreeScene
│   │   ├── Nav.tsx              # Sticky navbar, scrollspy, mobile drawer
│   │   ├── Projects.tsx         # Showcase cards with ScrollTrigger staggers
│   │   ├── Resume.tsx           # Download section trigger
│   │   ├── Skills.tsx           # Terminal style tagged pills
│   │   └── ThreeScene.tsx       # Three.js icosahedron and WebGL fallback render
│   ├── App.tsx                  # Root layout structure, scroll-snap wrapper
│   ├── index.css                # Typography, global variables, custom bounce keyframes
│   └── main.tsx                 # App mount entry point
├── package.json
└── vite.config.ts
```

---

## 🛠️ Installation & Setup

```bash
# Clone the repository
$ git clone https://github.com/your-username/portfolio-vishnu.git
$ cd portfolio-vishnu

# Install npm dependencies
$ npm install

# Launch local development server (Vite)
$ npm run dev

# Compile production bundle
$ npm run build
```

---

## 📦 Core Dependencies

| Package | Purpose |
|---|---|
| `react` + `react-dom` | SPA UI Framework |
| `typescript` | Type safety |
| `three` + `@types/three` | WebGL 3D Canvas rendering |
| `gsap` | ScrollTrigger layout animations |
| `lucide-react` | Navigation and card vector icons |

---

## 🚀 Deployment to Vercel

The application is structured for instant Vercel deployments:
1. Import repo into [vercel.com/new](https://vercel.com/new)
2. Framework Preset: **Vite**
3. Output Directory: `dist`
4. The static routing fallback is preconfigured in `vercel.json` for seamless SPA redirects.
