// ── 3D Cybernetic Coder Character Component ───────────────────
function HeroOrb() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const mouseRef = useRef({ x: 0, y: 0, tx: 0, ty: 0 })

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    let animationFrameId: number
    const width = (canvas.width = 280)
    const height = (canvas.height = 280)

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect()
      const cx = rect.left + rect.width / 2
      const cy = rect.top + rect.height / 2
      // Clamp inputs to prevent extreme turning
      mouseRef.current.tx = Math.max(-1.4, Math.min(1.4, (e.clientX - cx) / (rect.width / 2)))
      mouseRef.current.ty = Math.max(-1.0, Math.min(1.0, (e.clientY - cy) / (rect.height / 2)))
    }
    window.addEventListener("mousemove", handleMouseMove)

    const FOCAL_LENGTH = 360
    const CAMERA_DIST = 260

    // ── Helper 3D rotation math ─────────────────────────────────
    const rotX = (p: { x: number; y: number; z: number }, a: number) => {
      const c = Math.cos(a), s = Math.sin(a)
      return { x: p.x, y: p.y * c - p.z * s, z: p.y * s + p.z * c }
    }
    const rotY = (p: { x: number; y: number; z: number }, a: number) => {
      const c = Math.cos(a), s = Math.sin(a)
      return { x: p.x * c - p.z * s, y: p.y, z: p.x * s + p.z * c }
    }

    // ── Orbiting tech tags ──
    const codeTags = [
      { text: "FastAPI", angle: 0, speed: 0.012, radius: 100, yOffset: -30, color: "#005fe8" },
      { text: "Next.js", angle: Math.PI * 0.65, speed: 0.009, radius: 110, yOffset: 10, color: "#6366f1" },
      { text: "Docker", angle: Math.PI * 1.35, speed: 0.014, radius: 95, yOffset: -50, color: "#06b6d4" },
    ]

    let time = 0

    const draw = () => {
      ctx.clearRect(0, 0, width, height)

      // Interpolate mouse movements
      const mouse = mouseRef.current
      mouse.x += (mouse.tx - mouse.x) * 0.08
      mouse.y += (mouse.ty - mouse.y) * 0.08

      const isDark = document.documentElement.classList.contains("dark")

      // Breathing and typing speeds
      time += 0.025
      const breathY = Math.sin(time) * 4.0
      const handL_Y = Math.sin(time * 7) * 4.5
      const handR_Y = Math.cos(time * 7) * 4.5

      // Head turn rotation angles
      const headRotX = mouse.y * 0.28
      const headRotY = mouse.x * 0.38

      // Define 3D parts to sort and draw (Painter's Algorithm)
      // Parts are defined relative to the character origin
      const parts = [
        {
          name: "chest",
          pos: { x: 0, y: 70, z: 0 },
          weight: 0.15, // stable base
          size: 40,
          draw: (sx: number, sy: number, sz: number) => {
            const rad = 42 * sz
            const grad = ctx.createRadialGradient(sx - rad * 0.3, sy - rad * 0.3, 2, sx, sy, rad)
            grad.addColorStop(0, isDark ? "#1e293b" : "#475569")
            grad.addColorStop(1, isDark ? "#020617" : "#0f172a")

            // Base chest
            ctx.beginPath()
            ctx.arc(sx, sy, rad, 0, Math.PI * 2)
            ctx.fillStyle = grad
            ctx.fill()

            // Glowing central power core
            ctx.beginPath()
            ctx.arc(sx, sy, 8 * sz, 0, Math.PI * 2)
            ctx.fillStyle = "#22d3ee"
            ctx.shadowColor = "#22d3ee"
            ctx.shadowBlur = 12 * sz
            ctx.fill()
            ctx.shadowBlur = 0 // Reset
          },
        },
        {
          name: "shoulderL",
          pos: { x: -48, y: 70, z: -10 },
          weight: 0.15,
          size: 16,
          draw: (sx: number, sy: number, sz: number) => {
            const rad = 14 * sz
            ctx.beginPath()
            ctx.arc(sx, sy, rad, 0, Math.PI * 2)
            ctx.fillStyle = isDark ? "#1e293b" : "#64748b"
            ctx.fill()
          },
        },
        {
          name: "shoulderR",
          pos: { x: 48, y: 70, z: -10 },
          weight: 0.15,
          size: 16,
          draw: (sx: number, sy: number, sz: number) => {
            const rad = 14 * sz
            ctx.beginPath()
            ctx.arc(sx, sy, rad, 0, Math.PI * 2)
            ctx.fillStyle = isDark ? "#1e293b" : "#64748b"
            ctx.fill()
          },
        },
        {
          name: "neck",
          pos: { x: 0, y: 35, z: 0 },
          weight: 0.3,
          size: 20,
          draw: (sx: number, sy: number, sz: number) => {
            const w = 18 * sz
            const h = 25 * sz
            ctx.fillStyle = isDark ? "#334155" : "#94a3b8"
            ctx.fillRect(sx - w / 2, sy - h / 2, w, h)
          },
        },
        {
          name: "helmet",
          pos: { x: 0, y: -10, z: 0 },
          weight: 1.0, // full head movement
          size: 55,
          draw: (sx: number, sy: number, sz: number) => {
            const rad = 50 * sz
            const grad = ctx.createRadialGradient(sx - rad * 0.3, sy - rad * 0.3, 5, sx, sy, rad)
            grad.addColorStop(0, isDark ? "#334155" : "#64748b")
            grad.addColorStop(0.7, isDark ? "#0f172a" : "#1e293b")
            grad.addColorStop(1, isDark ? "#020617" : "#0f172a")

            // Outer helmet sphere
            ctx.beginPath()
            ctx.arc(sx, sy, rad, 0, Math.PI * 2)
            ctx.fillStyle = grad
            ctx.fill()

            // Side ears / decals
            ctx.fillStyle = "#005fe8"
            ctx.fillRect(sx - rad - 3, sy - 8 * sz, 5, 16 * sz)
            ctx.fillRect(sx + rad - 2, sy - 8 * sz, 5, 16 * sz)
          },
        },
        {
          name: "visor",
          pos: { x: 0, y: -10, z: 42 },
          weight: 1.0,
          size: 40,
          draw: (sx: number, sy: number, sz: number) => {
            const rx = 35 * sz
            const ry = 19 * sz
            
            // Dark reflective screen
            ctx.beginPath()
            ctx.ellipse(sx, sy, rx, ry, 0, 0, Math.PI * 2)
            ctx.fillStyle = isDark ? "#050b14" : "#0d1b2e"
            ctx.fill()
            
            ctx.strokeStyle = "rgba(34, 211, 238, 0.45)"
            ctx.lineWidth = 1.5
            ctx.stroke()

            // Glowing cyan eyes tracking cursor
            const eyeXOffset = mouse.x * 6 * sz
            const eyeYOffset = mouse.y * 4 * sz

            ctx.fillStyle = "#22d3ee"
            ctx.shadowColor = "#22d3ee"
            ctx.shadowBlur = 8 * sz

            // Left Eye
            ctx.beginPath()
            ctx.arc(sx - 13 * sz + eyeXOffset, sy + eyeYOffset, 3.5 * sz, 0, Math.PI * 2)
            ctx.fill()

            // Right Eye
            ctx.beginPath()
            ctx.arc(sx + 13 * sz + eyeXOffset, sy + eyeYOffset, 3.5 * sz, 0, Math.PI * 2)
            ctx.fill()

            ctx.shadowBlur = 0 // Reset
          },
        },
        {
          name: "antenna",
          pos: { x: 0, y: -65, z: 0 },
          weight: 1.0,
          size: 15,
          draw: (sx: number, sy: number, sz: number) => {
            // Mast
            ctx.strokeStyle = isDark ? "#475569" : "#94a3b8"
            ctx.lineWidth = 2 * sz
            ctx.beginPath()
            ctx.moveTo(sx, sy)
            ctx.lineTo(sx, sy - 15 * sz)
            ctx.stroke()

            // Glowing tip
            ctx.beginPath()
            ctx.arc(sx, sy - 17 * sz, 3 * sz, 0, Math.PI * 2)
            ctx.fillStyle = (Math.floor(time * 4) % 2 === 0) ? "#ef4444" : "#1e293b"
            ctx.fill()
          },
        },
        {
          name: "handL",
          pos: { x: -35, y: 55, z: 50 + handL_Y },
          weight: 0.22,
          size: 12,
          draw: (sx: number, sy: number, sz: number) => {
            ctx.beginPath()
            ctx.arc(sx, sy, 9 * sz, 0, Math.PI * 2)
            ctx.fillStyle = isDark ? "#64748b" : "#cbd5e1"
            ctx.fill()
          },
        },
        {
          name: "handR",
          pos: { x: 35, y: 55, z: 50 + handR_Y },
          weight: 0.22,
          size: 12,
          draw: (sx: number, sy: number, sz: number) => {
            ctx.beginPath()
            ctx.arc(sx, sy, 9 * sz, 0, Math.PI * 2)
            ctx.fillStyle = isDark ? "#64748b" : "#cbd5e1"
            ctx.fill()
          },
        },
        {
          name: "screen",
          pos: { x: 0, y: 25, z: 75 },
          weight: 0.35, // moves slightly with head to simulate user parallax focus
          size: 65,
          draw: (sx: number, sy: number, sz: number) => {
            const sw = 100 * sz
            const sh = 55 * sz

            // Translucent cyan screen panel
            ctx.fillStyle = "rgba(6, 182, 212, 0.08)"
            ctx.fillRect(sx - sw / 2, sy - sh / 2, sw, sh)

            ctx.strokeStyle = "rgba(34, 211, 238, 0.55)"
            ctx.lineWidth = 1.2
            ctx.strokeRect(sx - sw / 2, sy - sh / 2, sw, sh)

            // Neon cyan code line streams
            ctx.fillStyle = "rgba(34, 211, 238, 0.75)"
            
            // Draw horizontal code line slots
            const barW1 = (60 + Math.sin(time * 3) * 10) * sz
            ctx.fillRect(sx - sw / 2 + 6 * sz, sy - sh / 2 + 8 * sz, barW1, 3 * sz)

            const barW2 = (45 + Math.cos(time * 2) * 8) * sz
            ctx.fillRect(sx - sw / 2 + 6 * sz, sy - sh / 2 + 16 * sz, barW2, 3 * sz)

            ctx.fillStyle = "rgba(99, 102, 241, 0.75)"
            const barW3 = (75 + Math.sin(time * 1.5) * 12) * sz
            ctx.fillRect(sx - sw / 2 + 6 * sz, sy - sh / 2 + 24 * sz, barW3, 3 * sz)

            // Small code cursor
            if (Math.floor(time * 3) % 2 === 0) {
              ctx.fillStyle = "#22d3ee"
              ctx.fillRect(sx - sw / 2 + barW3 + 9 * sz, sy - sh / 2 + 24 * sz, 3 * sz, 3 * sz)
            }
          },
        },
      ]

      // Rotate and project all parts
      const projectedParts: { z: number; drawCall: () => void }[] = []

      for (const part of parts) {
        let pt = { ...part.pos }
        
        // Apply skeletal head turn vs body turn weights
        pt = rotY(rotX(pt, headRotX * part.weight), headRotY * part.weight)

        // Lower character vertically inside container
        pt.y += 30

        const scale = FOCAL_LENGTH / (CAMERA_DIST + pt.z)
        const sx = pt.x * scale + width / 2
        const sy = pt.y * scale + height / 2 + breathY

        projectedPoints.push({ x: sx, y: sy, z: pt.z, valid: scale > 0.1 })

        projectedParts.push({
          z: pt.z,
          drawCall: () => {
            if (scale > 0.1) {
              part.draw(sx, sy, scale)
            }
          },
        })
      }

      // Sort parts based on rotated Z (back-to-front / Painter's algorithm)
      // Large positive Z is closer to screen, negative Z is further back
      // So sorting ascending draws the furthest elements first
      projectedParts.sort((a, b) => a.z - b.z)

      // Draw all parts
      for (const p of projectedParts) {
        p.drawCall()
      }

      // ── Draw Orbiting 3D Tech Tags ──
      for (const tag of codeTags) {
        tag.angle += tag.speed
        
        const tx = Math.cos(tag.angle) * tag.radius
        const tz = Math.sin(tag.angle) * tag.radius
        const ty = tag.yOffset + 30

        // unified rotation matching head camera focus slightly
        let tagPt = { x: tx, y: ty, z: tz }
        tagPt = rotY(rotX(tagPt, headRotX * 0.25), headRotY * 0.25)

        const scale = FOCAL_LENGTH / (CAMERA_DIST + tagPt.z)
        const sx = tagPt.x * scale + width / 2
        const sy = tagPt.y * scale + height / 2 + breathY

        const alpha = Math.min(1.0, Math.max(0.12, (tagPt.z + 110) / 210))

        ctx.font = "bold 9.5px monospace"
        ctx.textAlign = "center"
        ctx.textBaseline = "middle"
        ctx.fillStyle = tag.color
        ctx.globalAlpha = alpha
        ctx.fillText(tag.text, sx, sy)
      }
      ctx.globalAlpha = 1.0

      animationFrameId = requestAnimationFrame(draw)
    }

    draw()

    return () => {
      window.removeEventListener("mousemove", handleMouseMove)
      cancelAnimationFrame(animationFrameId)
    }
  }, [])

  return (
    <div className="relative w-72 h-72 mx-auto flex items-center justify-center">
      {/* soft backglow behind avatar */}
      <div className="absolute w-52 h-52 rounded-full bg-brand/12 blur-3xl pointer-events-none animate-pulse" />
      
      {/* 3D Canvas rendering character */}
      <canvas
        ref={canvasRef}
        className="relative z-10 w-full h-full select-none"
        aria-label="Interactive 3D coder character bust typing on a glowing holographic screen"
      />
    </div>
  )
}
