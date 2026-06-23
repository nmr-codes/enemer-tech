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

export function CanvasBackground3D() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const mouseRef = useRef({ x: 0, y: 0, tx: 0, ty: 0 })

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
    }
    window.addEventListener("mousemove", handleMouseMove)

    // ── Config ──────────────────────────────────────────────────
    const PARTICLE_COUNT = prefersReduced ? 30 : 85
    const MAX_DISTANCE   = 140
    const FOCAL_LENGTH   = 420
    const CAMERA_DIST    = 280
    const BASE_SPEED     = prefersReduced ? 0 : 0.0012

    // ── Generate particles ───────────────────────────────────────
    const points: Particle[] = []
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const theta  = Math.random() * Math.PI * 2
      const phi    = Math.acos(Math.random() * 2 - 1)
      const radius = 70 + Math.random() * 170

      const x = radius * Math.sin(phi) * Math.cos(theta)
      const y = radius * Math.sin(phi) * Math.sin(theta)
      const z = radius * Math.cos(phi)

      const hue = 210 + Math.floor(Math.random() * 40)
      const lightness = 55 + Math.floor(Math.random() * 20)

      points.push({
        x, y, z, ox: x, oy: y, oz: z,
        color: `hsl(${hue}, 85%, ${lightness}%)`,
        size: 1 + Math.random() * 1.5,
        pulse: Math.random() * Math.PI * 2,
        pulseSpeed: 0.02 + Math.random() * 0.03,
      })
    }

    // ── Comets ──────────────────────────────────────────────────
    const comets: Comet[] = []
    const spawnComet = () => {
      if (prefersReduced) return
      const fromLeft = Math.random() > 0.5
      comets.push({
        x: fromLeft ? -20 : width + 20,
        y: Math.random() * height * 0.6,
        vx: fromLeft ? 6 + Math.random() * 5 : -(6 + Math.random() * 5),
        vy: 2 + Math.random() * 3,
        life: 0,
        maxLife: 60 + Math.floor(Math.random() * 40),
        color: `hsl(${220 + Math.floor(Math.random() * 30)}, 100%, 75%)`,
      })
    }
    let cometTimer = 0
    const COMET_INTERVAL = 280 // frames between comets

    // ── Angles ──────────────────────────────────────────────────
    let angleX = 0
    let angleY = 0

    const draw = () => {
      ctx.clearRect(0, 0, width, height)

      const mouse = mouseRef.current
      mouse.x += (mouse.tx - mouse.x) * 0.06
      mouse.y += (mouse.ty - mouse.y) * 0.06

      const isDark = document.documentElement.classList.contains("dark")

      angleX += BASE_SPEED + mouse.y * 0.0008
      angleY += BASE_SPEED + mouse.x * 0.0008

      const cosX = Math.cos(angleX), sinX = Math.sin(angleX)
      const cosY = Math.cos(angleY), sinY = Math.sin(angleY)

      // ── Project particles ──────────────────────────────────────
      const projected: { x: number; y: number; z: number; color: string; alpha: number; r: number }[] = []

      for (const p of points) {
        // Rotate Y
        const x1 = p.ox * cosY - p.oz * sinY
        const z1 = p.ox * sinY + p.oz * cosY
        // Rotate X
        const y2 = p.oy * cosX - z1 * sinX
        const z2 = p.oy * sinX + z1 * cosX

        // Mouse parallax nudge
        const px = x1 + mouse.x * 18
        const pz = z2 + mouse.y * 18

        // Perspective
        const scale = FOCAL_LENGTH / (CAMERA_DIST + pz)
        const screenX = px * scale + width / 2
        const screenY = y2 * scale + height / 2

        // Pulsing size
        p.pulse += p.pulseSpeed
        const pulseFactor = 1 + 0.3 * Math.sin(p.pulse)
        const r = Math.max(0.5, p.size * scale * pulseFactor)

        const alpha = (isDark ? 0.45 : 0.3) * Math.min(1, scale * 1.2)

        projected.push({ x: screenX, y: screenY, z: pz, color: p.color, alpha, r })

        // Draw particle
        ctx.beginPath()
        ctx.arc(screenX, screenY, r, 0, Math.PI * 2)
        ctx.fillStyle = p.color
        ctx.globalAlpha = alpha
        ctx.fill()
      }

      // ── Draw connecting lines ──────────────────────────────────
      ctx.globalAlpha = 1
      for (let i = 0; i < projected.length; i++) {
        const p1 = projected[i]
        for (let j = i + 1; j < projected.length; j++) {
          const p2 = projected[j]
          const dx = p1.x - p2.x, dy = p1.y - p2.y
          const dist = Math.sqrt(dx * dx + dy * dy)
          if (dist < MAX_DISTANCE) {
            const proximity = 1 - dist / MAX_DISTANCE
            const lineAlpha = proximity * (isDark ? 0.12 : 0.07)
            ctx.beginPath()
            ctx.moveTo(p1.x, p1.y)
            ctx.lineTo(p2.x, p2.y)
            ctx.strokeStyle = isDark
              ? `rgba(30, 120, 255, ${lineAlpha})`
              : `rgba(0, 95, 232, ${lineAlpha})`
            ctx.lineWidth = proximity * 0.8
            ctx.stroke()
          }
        }
      }

      // ── Draw comets ───────────────────────────────────────────
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

        const tailLength = 60 + Math.abs(c.vx) * 4
        const grad = ctx.createLinearGradient(
          c.x - c.vx * tailLength / Math.abs(c.vx), c.y - c.vy * tailLength / Math.abs(c.vx),
          c.x, c.y
        )
        grad.addColorStop(0, `rgba(255,255,255,0)`)
        grad.addColorStop(1, c.color.replace(")", `, ${alpha * 0.9})`).replace("hsl", "hsla"))

        ctx.beginPath()
        ctx.moveTo(c.x - c.vx * (tailLength / Math.abs(c.vx)), c.y - c.vy * (tailLength / Math.abs(c.vx)))
        ctx.lineTo(c.x, c.y)
        ctx.strokeStyle = grad
        ctx.lineWidth = 1.5
        ctx.globalAlpha = 1
        ctx.stroke()

        // Head glow
        ctx.beginPath()
        ctx.arc(c.x, c.y, 2.5, 0, Math.PI * 2)
        ctx.fillStyle = c.color
        ctx.globalAlpha = alpha * 0.9
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
