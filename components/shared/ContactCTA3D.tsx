"use client"

import { useEffect, useRef } from "react"

export function ContactCTA3D({
  title,
  subtitle,
  locale = "en",
  children,
}: {
  title: string
  subtitle: string
  locale?: string
  children?: React.ReactNode
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  /* ── Starfield Canvas ─────────────────────────── */
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    let animId: number
    const stars: { x: number; y: number; r: number; o: number; speed: number }[] = []

    const resize = () => {
      canvas.width = canvas.offsetWidth
      canvas.height = canvas.offsetHeight
    }
    resize()
    window.addEventListener("resize", resize)

    for (let i = 0; i < 120; i++) {
      stars.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        r: Math.random() * 1.4 + 0.3,
        o: Math.random() * 0.7 + 0.2,
        speed: Math.random() * 0.3 + 0.05,
      })
    }

    let tick = 0
    const draw = () => {
      if (!ctx || !canvas) return
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      tick += 0.015

      stars.forEach((s) => {
        const pulse = Math.sin(tick * s.speed * 4 + s.x) * 0.3
        ctx.beginPath()
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(180,210,255,${Math.max(0, s.o + pulse)})`
        ctx.fill()
      })

      animId = requestAnimationFrame(draw)
    }
    draw()

    return () => {
      cancelAnimationFrame(animId)
      window.removeEventListener("resize", resize)
    }
  }, [])

  return (
    <section className="relative rounded-3xl overflow-hidden text-white" style={{ minHeight: 320 }}>
      {/* ── Deep space background ── */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse at 60% 40%, #0a1f5c 0%, #050c2e 50%, #020818 100%)",
        }}
      />

      {/* ── Starfield canvas ── */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full pointer-events-none"
      />

      {/* ── Nebula glow blobs ── */}
      <div
        className="absolute top-0 left-1/4 w-72 h-72 rounded-full blur-[90px] opacity-25 pointer-events-none"
        style={{ background: "radial-gradient(#2563eb, transparent 70%)" }}
      />
      <div
        className="absolute bottom-0 right-1/4 w-56 h-56 rounded-full blur-[70px] opacity-20 pointer-events-none"
        style={{ background: "radial-gradient(#7c3aed, transparent 70%)" }}
      />

      {/* ── 3D Scene SVG ── */}
      <div className="absolute right-6 bottom-0 md:right-16 pointer-events-none select-none" style={{ width: 220, height: 260 }}>
        <svg viewBox="0 0 220 260" fill="none" xmlns="http://www.w3.org/2000/svg">
          <defs>
            {/* Planet gradient */}
            <radialGradient id="planetGrad" cx="38%" cy="35%" r="60%">
              <stop offset="0%" stopColor="#3b82f6" />
              <stop offset="60%" stopColor="#1d4ed8" />
              <stop offset="100%" stopColor="#1e3a8a" />
            </radialGradient>
            {/* Planet surface shadow */}
            <radialGradient id="planetShadow" cx="65%" cy="65%" r="55%">
              <stop offset="0%" stopColor="#0f172a" stopOpacity="0.6" />
              <stop offset="100%" stopColor="#0f172a" stopOpacity="0" />
            </radialGradient>
            {/* Rocket body gradient */}
            <linearGradient id="rocketBody" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#e2e8f0" />
              <stop offset="100%" stopColor="#94a3b8" />
            </linearGradient>
            {/* Rocket window */}
            <radialGradient id="rocketWin" cx="35%" cy="35%" r="65%">
              <stop offset="0%" stopColor="#7dd3fc" />
              <stop offset="100%" stopColor="#0369a1" />
            </radialGradient>
            {/* Flame gradient */}
            <linearGradient id="flame" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#fbbf24" />
              <stop offset="50%" stopColor="#f97316" />
              <stop offset="100%" stopColor="#ef4444" stopOpacity="0" />
            </linearGradient>
            {/* Ring gradient */}
            <linearGradient id="ringGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#60a5fa" stopOpacity="0.5" />
              <stop offset="100%" stopColor="#1d4ed8" stopOpacity="0.2" />
            </linearGradient>
          </defs>

          {/* Orbit ring behind planet */}
          <ellipse cx="110" cy="190" rx="88" ry="22" stroke="url(#ringGrad)" strokeWidth="2" fill="none" opacity="0.6" />

          {/* Planet */}
          <circle cx="110" cy="195" r="54" fill="url(#planetGrad)" />
          {/* Planet surface lines */}
          <ellipse cx="110" cy="195" rx="54" ry="16" stroke="#3b82f6" strokeWidth="1" fill="none" opacity="0.3" />
          <ellipse cx="110" cy="185" rx="42" ry="10" stroke="#60a5fa" strokeWidth="0.8" fill="none" opacity="0.2" />
          <ellipse cx="110" cy="205" rx="46" ry="11" stroke="#60a5fa" strokeWidth="0.8" fill="none" opacity="0.2" />
          {/* Planet shadow overlay */}
          <circle cx="110" cy="195" r="54" fill="url(#planetShadow)" />
          {/* Planet highlight */}
          <ellipse cx="88" cy="175" rx="16" ry="10" fill="white" opacity="0.07" />

          {/* Orbit ring front (in front of planet) */}
          <path d="M 22 190 Q 66 215 110 216 Q 154 215 198 190" stroke="url(#ringGrad)" strokeWidth="2.5" fill="none" opacity="0.7" />

          {/* ── Rocket ── */}
          <g style={{ animation: "rocketFloat 3s ease-in-out infinite" }}>
            {/* Flame */}
            <ellipse cx="110" cy="132" rx="7" ry="14" fill="url(#flame)" opacity="0.9">
              <animate attributeName="ry" values="14;10;16;12;14" dur="0.4s" repeatCount="indefinite" />
              <animate attributeName="opacity" values="0.9;0.6;1;0.7;0.9" dur="0.4s" repeatCount="indefinite" />
            </ellipse>

            {/* Rocket body */}
            <rect x="100" y="80" width="20" height="44" rx="6" fill="url(#rocketBody)" />
            {/* Rocket nose cone */}
            <path d="M100 80 Q110 55 120 80Z" fill="#cbd5e1" />
            {/* Rocket fins */}
            <path d="M100 116 L88 128 L100 124Z" fill="#94a3b8" />
            <path d="M120 116 L132 128 L120 124Z" fill="#94a3b8" />
            {/* Rocket window */}
            <circle cx="110" cy="97" r="7" fill="url(#rocketWin)" />
            <circle cx="110" cy="97" r="7" stroke="#bfdbfe" strokeWidth="1" fill="none" opacity="0.5" />
            {/* Window shine */}
            <circle cx="107" cy="94" r="2" fill="white" opacity="0.5" />
            {/* Rocket stripe */}
            <rect x="100" y="108" width="20" height="3" rx="1.5" fill="#ef4444" opacity="0.8" />
          </g>

          {/* Small stars near rocket */}
          <circle cx="60" cy="60" r="1.5" fill="white" opacity="0.8">
            <animate attributeName="opacity" values="0.8;0.2;0.8" dur="2.1s" repeatCount="indefinite" />
          </circle>
          <circle cx="165" cy="45" r="1" fill="white" opacity="0.6">
            <animate attributeName="opacity" values="0.6;0.1;0.6" dur="1.7s" repeatCount="indefinite" />
          </circle>
          <circle cx="40" cy="140" r="1.2" fill="white" opacity="0.5">
            <animate attributeName="opacity" values="0.5;0.9;0.5" dur="2.5s" repeatCount="indefinite" />
          </circle>
          <circle cx="185" cy="110" r="1" fill="#7dd3fc" opacity="0.7">
            <animate attributeName="opacity" values="0.7;0.2;0.7" dur="1.9s" repeatCount="indefinite" />
          </circle>
        </svg>

        <style>{`
          @keyframes rocketFloat {
            0%, 100% { transform: translateY(0px); }
            50% { transform: translateY(-12px); }
          }
          [style*="rocketFloat"] {
            animation: rocketFloat 3s ease-in-out infinite;
          }
        `}</style>
      </div>

      {/* ── Text Content ── */}
      <div className="relative z-10 flex flex-col justify-center min-h-[320px] p-10 md:p-14 md:pr-56 space-y-6">
        {/* Badge */}
        <div className="inline-flex w-fit items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-xs font-semibold text-blue-200 tracking-wider uppercase">
          <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse inline-block" />
          {locale === "uz" ? "Ishga tayyor" : "Available for work"}
        </div>

        <div className="space-y-3 max-w-lg">
          <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight leading-tight">
            {title}
          </h2>
          <p className="text-sm text-blue-100/80 leading-relaxed">
            {subtitle}
          </p>
        </div>

        {/* Stats row */}
        <div className="flex flex-wrap gap-6 pt-1">
          {[
            { value: "3+", label: locale === "uz" ? "Yillik tajriba" : "Years exp." },
            { value: "20+", label: locale === "uz" ? "Loyihalar" : "Projects" },
            { value: "100%", label: locale === "uz" ? "Sadoqatli" : "Dedicated" },
          ].map((stat) => (
            <div key={stat.label} className="text-center">
              <div className="text-2xl font-extrabold text-white">{stat.value}</div>
              <div className="text-[10px] text-blue-300/70 uppercase tracking-widest font-semibold">{stat.label}</div>
            </div>
          ))}
        </div>

        <div>{children}</div>
      </div>
    </section>
  )
}
