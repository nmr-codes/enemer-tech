"use client"

import { useRef, useState, useCallback } from "react"
import { cn } from "@/lib/utils"

interface MagneticButtonProps {
  children: React.ReactNode
  className?: string
  strength?: number   // how strongly the button follows the cursor (0-1)
  as?: "button" | "div" | "span"
}

export function MagneticButton({
  children,
  className,
  strength = 0.35,
  as: Tag = "div",
}: MagneticButtonProps) {
  const ref = useRef<HTMLDivElement>(null)
  const [offset, setOffset] = useState({ x: 0, y: 0 })

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const el = ref.current
    if (!el) return
    const rect = el.getBoundingClientRect()
    const cx = rect.left + rect.width / 2
    const cy = rect.top + rect.height / 2
    const dx = (e.clientX - cx) * strength
    const dy = (e.clientY - cy) * strength
    setOffset({ x: dx, y: dy })
  }, [strength])

  const handleMouseLeave = useCallback(() => {
    setOffset({ x: 0, y: 0 })
  }, [])

  return (
    <div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={cn("inline-block cursor-pointer", className)}
      style={{
        transform: `translate(${offset.x}px, ${offset.y}px)`,
        transition: offset.x === 0 && offset.y === 0
          ? "transform 0.5s cubic-bezier(0.25, 1, 0.5, 1)"
          : "transform 0.12s linear",
        willChange: "transform",
      }}
    >
      {children}
    </div>
  )
}
