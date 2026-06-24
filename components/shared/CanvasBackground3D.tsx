"use client"

import { useEffect, useRef } from "react"

interface Particle {
  x: number; y: number; z: number
  ox: number; oy: number; oz: number
  color: string
  size: number
  pulse: number
  pulseSpeed: number
}

interface Comet {
  x: number; y: number
  vx: number; vy: number
  life: number; maxLife: number
  color: string
}

interface Geometry3D {
  type: "octahedron" | "tetrahedron"
  x: number; y: number; z: number // Normalized coordinates (-0.5 to 0.5)
  scale: number
  rx: number; ry: number; rz: number
  rvx: number; rvy: number; rvz: number
  color: string
}

export function CanvasBackground3D() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const mouseRef = useRef({ x: 0, y: 0, tx: 0, ty: 0, cx: 0, cy: 0, tcx: 0, tcy: 0 })
  const scrollRef = useRef({ y: 0, ty: 0 })

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Respect prefers-reduced-motion
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches

    let animationFrameId: number
    let width = (canvas.width = window.innerWidth)
    let height = (canvas.height = window.innerHeight)

    const handleResize = () => {
      if (!canvas) return
      width = canvas.width = window.innerWidth
      height = canvas.height = window.innerHeight
    }
    window.addEventListener("resize", handleResize)

    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current.tx = (e.clientX - width / 2) / (width / 2)
      mouseRef.current.ty = (e.clientY - height / 2) / (height / 2)
      mouseRef.current.tcx = e.clientX
      mouseRef.current.tcy = e.clientY
    }
    window.addEventListener("mousemove", handleMouseMove)

    const handleScroll = () => {
      scrollRef.current.ty = window.scrollY
    }
    window.addEventListener("scroll", handleScroll, { passive: true })

    // ── Config ──────────────────────────────────────────────────
    const PARTICLE_COUNT = prefersReduced ? 25 : 85
    const MAX_DISTANCE   = 145
    const FOCAL_LENGTH   = 450
    const CAMERA_DIST    = 300
    const BASE_SPEED     = prefersReduced ? 0 : 0.0008
    const DEPTH_RANGE    = 800

    // Initialize mouse absolute position to center
    mouseRef.current.cx = width / 2
    mouseRef.current.cy = height / 2
    mouseRef.current.tcx = width / 2
    mouseRef.current.tcy = height / 2

    // ── Generate particles (Box distribution) ────────────────────
    const points: Particle[] = []
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const x = (Math.random() * 2 - 1) * 380
      const y = (Math.random() * 2 - 1) * 380
      const z = (Math.random() * 2 - 1) * 400

      const hue = 210 + Math.floor(Math.random() * 35) // Deep brand blues
      const lightness = 55 + Math.floor(Math.random() * 15)

      points.push({
        x, y, z, ox: x, oy: y, oz: z,
        color: `hsl(${hue}, 85%, ${lightness}%)`,
        size: 0.8 + Math.random() * 1.5,
        pulse: Math.random() * Math.PI * 2,
        pulseSpeed: 0.015 + Math.random() * 0.02,
      })
    }

    // ── Floating 3D Geometries ───────────────────────────────────
    const geometries: Geometry3D[] = [
      {
        type: "octahedron",
        x: 0.28, y: -0.22, z: 120,
        scale: 45,
        rx: Math.random(), ry: Math.random(), rz: Math.random(),
        rvx: 0.004, rvy: 0.007, rvz: 0.003,
        color: "#005fe8",
      },
      {
        type: "tetrahedron",
        x: -0.32, y: 0.12, z: -80,
        scale: 35,
        rx: Math.random(), ry: Math.random(), rz: Math.random(),
        rvx: 0.006, rvy: 0.003, rvz: 0.005,
        color: "#06b6d4",
      },
      {
        type: "octahedron",
        x: 0.22, y: 0.35, z: 220,
        scale: 40,
        rx: Math.random(), ry: Math.random(), rz: Math.random(),
        rvx: 0.003, rvy: 0.005, rvz: 0.006,
        color: "#6366f1",
      },
    ]

    const octahedronVertices = [
      { x: 0, y: 1, z: 0 },
      { x: 1, y: 0, z: 0 },
      { x: 0, y: 0, z: 1 },
      { x: -1, y: 0, z: 0 },
      { x: 0, y: 0, z: -1 },
      { x: 0, y: -1, z: 0 },
    ]
    const octahedronEdges = [
      [0, 1], [0, 2], [0, 3], [0, 4],
      [5, 1], [5, 2], [5, 3], [5, 4],
      [1, 2], [2, 3], [3, 4], [4, 1],
    ]

    const tetrahedronVertices = [
      { x: 1, y: 1, z: 1 },
      { x: -1, y: -1, z: 1 },
      { x: -1, y: 1, z: -1 },
      { x: 1, y: -1, z: -1 },
    ]
    const tetrahedronEdges = [
      [0, 1], [0, 2], [0, 3],
      [1, 2], [1, 3],
      [2, 3],
    ]

    // ── Helper 3D rotation functions ──────────────────────────────
    const rotX = (p: { x: number; y: number; z: number }, a: number) => {
      const c = Math.cos(a), s = Math.sin(a)
      return { x: p.x, y: p.y * c - p.z * s, z: p.y * s + p.z * c }
    }
    const rotY = (p: { x: number; y: number; z: number }, a: number) => {
      const c = Math.cos(a), s = Math.sin(a)
      return { x: p.x * c - p.z * s, y: p.y, z: p.x * s + p.z * c }
    }
    const rotZ = (p: { x: number; y: number; z: number }, a: number) => {
      const c = Math.cos(a), s = Math.sin(a)
      return { x: p.x * c - p.y * s, y: p.x * s + p.y * c, z: p.z }
    }

    // ── Comets ──────────────────────────────────────────────────
    const comets: Comet[] = []
    const spawnComet = () => {
      if (prefersReduced) return
      const fromLeft = Math.random() > 0.5
      comets.push({
        x: fromLeft ? -20 : width + 20,
        y: Math.random() * height * 0.6,
        vx: fromLeft ? 5 + Math.random() * 4 : -(5 + Math.random() * 4),
        vy: 1.5 + Math.random() * 2.5,
        life: 0,
        maxLife: 70 + Math.floor(Math.random() * 50),
        color: `hsl(${215 + Math.floor(Math.random() * 30)}, 100%, 75%)`,
      })
    }
    let cometTimer = 0
    const COMET_INTERVAL = 320

    // ── Angles ──────────────────────────────────────────────────
    let angleX = 0
    let angleY = 0
    let nebulaTime = 0

    const draw = () => {
      ctx.clearRect(0, 0, width, height)

      const mouse = mouseRef.current
      mouse.x += (mouse.tx - mouse.x) * 0.05
      mouse.y += (mouse.ty - mouse.y) * 0.05
      mouse.cx += (mouse.tcx - mouse.cx) * 0.08
      mouse.cy += (mouse.tcy - mouse.cy) * 0.08

      const scroll = scrollRef.current
      scroll.y += (scroll.ty - scroll.y) * 0.06

      const isDark = document.documentElement.classList.contains("dark")

      // Global orbit rotation
      angleX += BASE_SPEED + mouse.y * 0.0005
      angleY += BASE_SPEED + mouse.x * 0.0005

      const cosX = Math.cos(angleX), sinX = Math.sin(angleX)
      const cosY = Math.cos(angleY), sinY = Math.sin(angleY)

      // ── Draw Space Nebula Ambient Glows ──────────────────────────
      nebulaTime += 0.001
      const nebulaX = width / 2 + Math.sin(nebulaTime * 1.5) * (width * 0.15) + (mouse.x * 40)
      const nebulaY = height / 2 + Math.cos(nebulaTime) * (height * 0.15) + (mouse.y * 40)
      
      const nebGrad = ctx.createRadialGradient(nebulaX, nebulaY, 50, nebulaX, nebulaY, Math.max(width * 0.45, 400))
      if (isDark) {
        nebGrad.addColorStop(0, "rgba(0, 95, 232, 0.045)")
        nebGrad.addColorStop(0.5, "rgba(99, 102, 241, 0.02)")
        nebGrad.addColorStop(1, "rgba(0, 0, 0, 0)")
      } else {
        nebGrad.addColorStop(0, "rgba(0, 95, 232, 0.02)")
        nebGrad.addColorStop(0.5, "rgba(6, 182, 212, 0.008)")
        nebGrad.addColorStop(1, "rgba(255, 255, 255, 0)")
      }
      ctx.fillStyle = nebGrad
      ctx.fillRect(0, 0, width, height)

      // ── Project & Warp Particles ─────────────────────────────────
      const projected: { x: number; y: number; z: number; color: string; alpha: number; r: number }[] = []

      for (const p of points) {
        // Local rotations
        const x1 = p.ox * cosY - p.oz * sinY
        const z1 = p.ox * sinY + p.oz * cosY

        const y2 = p.oy * cosX - z1 * sinX
        const z2 = p.oy * sinX + z1 * cosX

        // Scroll depth offset with safe modulo wrap-around
        // Moving downward scroll pulls the stars forward (stars fly past the camera)
        const scrollZOffset = scroll.y * 0.22
        let pz = z2 + mouse.y * 12 - scrollZOffset
        
        // Wrap Z coordinate into [-400, 400] depth window
        pz = ((pz + 400) % DEPTH_RANGE + DEPTH_RANGE) % DEPTH_RANGE - 400

        // Parallax horizontal shifts
        const px = x1 + mouse.x * 20
        const py = y2 + mouse.y * 20

        // Perspective projection
        const scale = FOCAL_LENGTH / (CAMERA_DIST + pz)
        let screenX = px * scale + width / 2
        let screenY = py * scale + height / 2

        // Interactive Mouse Repulsion / Distortion
        const dx = screenX - mouse.cx
        const dy = screenY - mouse.cy
        const dist = Math.sqrt(dx * dx + dy * dy)
        const repulsionRadius = 180

        if (dist < repulsionRadius && dist > 0) {
          const force = (repulsionRadius - dist) / repulsionRadius
          const pushAmount = force * 45
          screenX += (dx / dist) * pushAmount
          screenY += (dy / dist) * pushAmount
        }

        // Pulse scale
        p.pulse += p.pulseSpeed
        const pulseFactor = 1 + 0.3 * Math.sin(p.pulse)
        const r = Math.max(0.4, p.size * scale * pulseFactor)

        // Fade out particles that get too close to the camera lens to prevent harsh pop-in/pop-out
        const opacityZFade = Math.min(1, (pz + 400) / 100) * Math.min(1, (400 - pz) / 150)
        const alpha = (isDark ? 0.42 : 0.28) * Math.min(1, scale * 1.1) * opacityZFade

        projected.push({ x: screenX, y: screenY, z: pz, color: p.color, alpha, r })

        // Render point
        ctx.beginPath()
        ctx.arc(screenX, screenY, r, 0, Math.PI * 2)
        ctx.fillStyle = p.color
        ctx.globalAlpha = alpha
        ctx.fill()
      }

      // ── Draw Constellation Links ─────────────────────────────────
      ctx.globalAlpha = 1
      for (let i = 0; i < projected.length; i++) {
        const p1 = projected[i]
        // Skip connecting if particle is faded or out of view
        if (p1.alpha < 0.05 || p1.x < 0 || p1.x > width || p1.y < 0 || p1.y > height) continue

        for (let j = i + 1; j < projected.length; j++) {
          const p2 = projected[j]
          if (p2.alpha < 0.05) continue

          const dx = p1.x - p2.x
          const dy = p1.y - p2.y
          const dist = Math.sqrt(dx * dx + dy * dy)

          if (dist < MAX_DISTANCE) {
            const proximity = 1 - dist / MAX_DISTANCE
            const lineAlpha = proximity * (isDark ? 0.12 : 0.06) * Math.min(p1.alpha, p2.alpha)

            ctx.beginPath()
            ctx.moveTo(p1.x, p1.y)
            ctx.lineTo(p2.x, p2.y)
            ctx.strokeStyle = isDark
              ? `rgba(30, 120, 255, ${lineAlpha})`
              : `rgba(0, 95, 232, ${lineAlpha})`
            ctx.lineWidth = proximity * 0.75
            ctx.stroke()
          }
        }
      }

      // ── Render 3D Floating Crystals (Octahedrons / Tetrahedrons) ──
      for (const obj of geometries) {
        // Update local object rotations
        obj.rx += obj.rvx
        obj.ry += obj.rvy
        obj.rz += obj.rvz

        const vertices = obj.type === "octahedron" ? octahedronVertices : tetrahedronVertices
        const edges = obj.type === "octahedron" ? octahedronEdges : tetrahedronEdges

        // Project geometry vertices
        const objScreenPts: { x: number; y: number; valid: boolean }[] = []
        let objZAverage = 0

        // Calculate absolute position based on current width/height
        const worldX = obj.x * width
        const worldY = obj.y * height
        
        // Scroll depth effect for shapes
        let worldZ = obj.z - scroll.y * 0.22
        // Wrap Z
        worldZ = ((worldZ + 400) % DEPTH_RANGE + DEPTH_RANGE) % DEPTH_RANGE - 400

        for (const v of vertices) {
          // Local scale
          let pt = { x: v.x * obj.scale, y: v.y * obj.scale, z: v.z * obj.scale }
          // Local rotation
          pt = rotZ(rotY(rotX(pt, obj.rx), obj.ry), obj.rz)
          
          // Translate to world position
          pt.x += worldX
          pt.y += worldY
          pt.z += worldZ

          // Global camera rotations
          let camPt = rotY(rotX(pt, angleX), angleY)

          // Add mouse parallax displacement
          camPt.x += mouse.x * 25
          camPt.y += mouse.y * 25

          objZAverage += camPt.z

          const scale = FOCAL_LENGTH / (CAMERA_DIST + camPt.z)
          let sX = camPt.x * scale + width / 2
          let sY = camPt.y * scale + height / 2

          // Mouse warp on vertices
          const dx = sX - mouse.cx
          const dy = sY - mouse.cy
          const dist = Math.sqrt(dx * dx + dy * dy)
          if (dist < 150 && dist > 0) {
            const force = (150 - dist) / 150
            sX += (dx / dist) * force * 35
            sY += (dy / dist) * force * 35
          }

          objScreenPts.push({ x: sX, y: sY, valid: scale > 0.1 && camPt.z < 400 })
        }

        objZAverage /= vertices.length
        const opacityZFade = Math.min(1, (objZAverage + 400) / 150) * Math.min(1, (400 - objZAverage) / 150)
        const objAlpha = (isDark ? 0.35 : 0.22) * opacityZFade

        if (objAlpha > 0.01) {
          // Draw Edges
          ctx.lineWidth = 1.0
          ctx.strokeStyle = isDark 
            ? `rgba(99, 102, 241, ${objAlpha * 0.85})` 
            : `rgba(0, 95, 232, ${objAlpha * 0.85})`

          for (const edge of edges) {
            const p1 = objScreenPts[edge[0]]
            const p2 = objScreenPts[edge[1]]
            if (p1.valid && p2.valid) {
              ctx.beginPath()
              ctx.moveTo(p1.x, p1.y)
              ctx.lineTo(p2.x, p2.y)
              ctx.stroke()
            }
          }

          // Draw Glowing Vertex Nodes
          for (const pt of objScreenPts) {
            if (pt.valid) {
              ctx.beginPath()
              ctx.arc(pt.x, pt.y, 3, 0, Math.PI * 2)
              ctx.fillStyle = obj.color
              ctx.globalAlpha = objAlpha * 1.3
              ctx.fill()
              
              // Halo
              ctx.beginPath()
              ctx.arc(pt.x, pt.y, 7, 0, Math.PI * 2)
              ctx.fillStyle = obj.color
              ctx.globalAlpha = objAlpha * 0.3
              ctx.fill()
            }
          }
        }
      }

      // ── Draw Comets ──────────────────────────────────────────────
      cometTimer++
      if (cometTimer >= COMET_INTERVAL) {
        spawnComet()
        cometTimer = 0
      }

      for (let i = comets.length - 1; i >= 0; i--) {
        const c = comets[i]
        c.x += c.vx
        c.y += c.vy
        c.life++

        const progress = c.life / c.maxLife
        const alpha = progress < 0.2
          ? progress / 0.2
          : progress > 0.8
          ? 1 - (progress - 0.8) / 0.2
          : 1

        const tailLength = 65 + Math.abs(c.vx) * 4.5
        const grad = ctx.createLinearGradient(
          c.x - c.vx * tailLength / Math.abs(c.vx), c.y - c.vy * tailLength / Math.abs(c.vx),
          c.x, c.y
        )
        grad.addColorStop(0, "rgba(255, 255, 255, 0)")
        grad.addColorStop(1, c.color.replace(")", `, ${alpha * 0.85})`).replace("hsl", "hsla"))

        ctx.beginPath()
        ctx.moveTo(c.x - c.vx * (tailLength / Math.abs(c.vx)), c.y - c.vy * (tailLength / Math.abs(c.vx)))
        ctx.lineTo(c.x, c.y)
        ctx.strokeStyle = grad
        ctx.lineWidth = 1.3
        ctx.globalAlpha = 1
        ctx.stroke()

        // Core
        ctx.beginPath()
        ctx.arc(c.x, c.y, 2, 0, Math.PI * 2)
        ctx.fillStyle = c.color
        ctx.globalAlpha = alpha * 0.95
        ctx.fill()

        if (c.life >= c.maxLife || c.x < -100 || c.x > width + 100) {
          comets.splice(i, 1)
        }
      }

      ctx.globalAlpha = 1
      animationFrameId = requestAnimationFrame(draw)
    }

    draw()

    return () => {
      window.removeEventListener("resize", handleResize)
      window.removeEventListener("mousemove", handleMouseMove)
      window.removeEventListener("scroll", handleScroll)
      cancelAnimationFrame(animationFrameId)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none -z-10 bg-transparent"
      aria-hidden="true"
    />
  )
}
