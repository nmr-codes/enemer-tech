"use client"

import React, { useRef, useState, useCallback } from "react"

interface TiltCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode
  maxTilt?: number
  perspective?: number
  scale?: number
  speed?: number
}

export function TiltCard({
  children,
  maxTilt = 8,
  perspective = 1000,
  scale = 1.025,
  speed = 500,
  className = "",
  style,
  ...props
}: TiltCardProps) {
  const cardRef = useRef<HTMLDivElement>(null)
  const [tiltStyle, setTiltStyle] = useState<React.CSSProperties>({
    transform: `perspective(${perspective}px) rotateX(0deg) rotateY(0deg) scale3d(1,1,1)`,
    transition: `transform 0.5s cubic-bezier(0.25, 1, 0.5, 1)`,
  })
  const [glareStyle, setGlareStyle] = useState<React.CSSProperties>({ opacity: 0 })
  const [shineStyle, setShineStyle] = useState<React.CSSProperties>({ opacity: 0 })

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const card = cardRef.current
    if (!card) return

    const rect = card.getBoundingClientRect()
    const mouseX = (e.clientX - rect.left - rect.width / 2) / rect.width
    const mouseY = (e.clientY - rect.top - rect.height / 2) / rect.height

    const rotateX = -mouseY * maxTilt
    const rotateY = mouseX * maxTilt

    const glareX = e.clientX - rect.left
    const glareY = e.clientY - rect.top

    // Shine position as percentage of card
    const shinePctX = ((e.clientX - rect.left) / rect.width) * 100
    const shinePctY = ((e.clientY - rect.top) / rect.height) * 100

    setTiltStyle({
      transform: `perspective(${perspective}px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(${scale},${scale},${scale})`,
      transition: "transform 100ms cubic-bezier(0.25, 1, 0.5, 1)",
    })

    setGlareStyle({
      opacity: 0.15,
      left: `${glareX}px`,
      top: `${glareY}px`,
      transition: "opacity 150ms ease",
    })

    setShineStyle({
      opacity: 1,
      background: `radial-gradient(circle at ${shinePctX}% ${shinePctY}%, rgba(255,255,255,0.07) 0%, transparent 65%)`,
      transition: "opacity 150ms ease",
    })
  }, [maxTilt, perspective, scale])

  const handleMouseLeave = useCallback(() => {
    setTiltStyle({
      transform: `perspective(${perspective}px) rotateX(0deg) rotateY(0deg) scale3d(1,1,1)`,
      transition: `transform ${speed}ms cubic-bezier(0.25, 1, 0.5, 1)`,
    })
    setGlareStyle({ opacity: 0, transition: "opacity 300ms ease" })
    setShineStyle({ opacity: 0, transition: "opacity 300ms ease" })
  }, [perspective, speed])

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ ...style, ...tiltStyle }}
      className={`relative overflow-hidden will-change-transform ${className}`}
      {...props}
    >
      {/* Glare spot — follows cursor */}
      <div
        className="pointer-events-none absolute w-[350px] h-[350px] rounded-full -translate-x-1/2 -translate-y-1/2 z-20 mix-blend-overlay"
        style={{
          background: "radial-gradient(circle at center, rgba(255,255,255,0.45) 0%, rgba(255,255,255,0) 60%)",
          ...glareStyle,
        }}
      />
      {/* Full-card shine overlay */}
      <div
        className="pointer-events-none absolute inset-0 z-20"
        style={shineStyle}
      />
      <div className="relative z-10 h-full w-full">{children}</div>
    </div>
  )
}
