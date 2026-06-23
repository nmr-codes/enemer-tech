"use client"

import { useEffect, useRef, useState } from "react"
import { cn } from "@/lib/utils"

interface ScrollRevealProps {
  children: React.ReactNode
  className?: string
  delay?: number           // delay in ms before animation starts
  direction?: "up" | "down" | "left" | "right" | "none"
  distance?: number        // px to travel during reveal
  duration?: number        // ms for transition
  once?: boolean           // only animate once
}

export function ScrollReveal({
  children,
  className,
  delay = 0,
  direction = "up",
  distance = 32,
  duration = 600,
  once = true,
}: ScrollRevealProps) {
  const ref = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(false)

  const getInitialTransform = () => {
    switch (direction) {
      case "up":    return `translateY(${distance}px)`
      case "down":  return `translateY(-${distance}px)`
      case "left":  return `translateX(${distance}px)`
      case "right": return `translateX(-${distance}px)`
      case "none":  return "none"
    }
  }

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true)
          if (once) observer.unobserve(el)
        } else if (!once) {
          setVisible(false)
        }
      },
      { threshold: 0.12 }
    )

    observer.observe(el)
    return () => observer.disconnect()
  }, [once])

  return (
    <div
      ref={ref}
      className={cn("will-change-transform", className)}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "none" : getInitialTransform(),
        transition: `opacity ${duration}ms cubic-bezier(0.16, 1, 0.3, 1) ${delay}ms, transform ${duration}ms cubic-bezier(0.16, 1, 0.3, 1) ${delay}ms`,
      }}
    >
      {children}
    </div>
  )
}
