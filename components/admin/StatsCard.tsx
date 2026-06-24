"use client"

import { useEffect, useRef, useState } from "react"
import { LucideIcon } from "lucide-react"
import { cn } from "@/lib/utils"

interface StatsCardProps {
  title: string
  value: string | number
  description?: string
  icon: LucideIcon
  className?: string
  trend?: { value: number; label: string } // e.g. { value: 12, label: "vs last month" }
  iconColor?: string
  iconBg?: string
}

function useCountUp(target: number, duration = 900) {
  const [count, setCount] = useState(0)
  const raf = useRef<number>(0)
  const start = useRef<number | null>(null)

  useEffect(() => {
    if (typeof target !== "number") return
    start.current = null
    const step = (timestamp: number) => {
      if (!start.current) start.current = timestamp
      const elapsed = timestamp - start.current
      const progress = Math.min(elapsed / duration, 1)
      // ease out quart
      const ease = 1 - Math.pow(1 - progress, 4)
      setCount(Math.round(ease * target))
      if (progress < 1) raf.current = requestAnimationFrame(step)
    }
    raf.current = requestAnimationFrame(step)
    return () => cancelAnimationFrame(raf.current)
  }, [target, duration])

  return count
}

export function StatsCard({
  title,
  value,
  description,
  icon: Icon,
  className,
  trend,
  iconColor = "#005fe8",
  iconBg = "rgba(0,95,232,0.12)",
}: StatsCardProps) {
  const numericValue = typeof value === "number" ? value : parseFloat(String(value))
  const animated = useCountUp(isNaN(numericValue) ? 0 : numericValue)
  const displayValue = isNaN(numericValue) ? value : animated

  const isPositiveTrend = trend && trend.value >= 0

  return (
    <div
      className={cn(
        "group relative rounded-2xl p-5 overflow-hidden transition-all duration-300 cursor-default",
        "hover:-translate-y-1",
        "bg-white dark:bg-neutral-900",
        "border border-neutral-200 dark:border-white/[0.06]",
        className
      )}
      style={{
        boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
      }}
      onMouseEnter={(e) => {
        ;(e.currentTarget as HTMLDivElement).style.boxShadow =
          "0 8px 32px rgba(0,0,0,0.08), 0 2px 8px rgba(0,0,0,0.04)"
      }}
      onMouseLeave={(e) => {
        ;(e.currentTarget as HTMLDivElement).style.boxShadow = "0 1px 3px rgba(0,0,0,0.04)"
      }}
    >
      {/* Subtle gradient overlay on hover */}
      <div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none rounded-2xl"
        style={{
          background: `radial-gradient(ellipse at 80% 0%, ${iconColor}08, transparent 60%)`,
        }}
      />

      <div className="relative z-10">
        {/* Icon + title row */}
        <div className="flex items-start justify-between mb-4">
          <p className="text-sm font-medium text-neutral-500 dark:text-neutral-400 leading-tight">
            {title}
          </p>
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition-transform duration-300 group-hover:scale-110"
            style={{ background: iconBg }}
          >
            <Icon className="h-5 w-5" style={{ color: iconColor }} />
          </div>
        </div>

        {/* Value */}
        <div className="space-y-1">
          <p className="text-3xl font-extrabold tracking-tight text-neutral-900 dark:text-white">
            {displayValue}
          </p>

          {/* Description + trend row */}
          <div className="flex items-center justify-between gap-2 flex-wrap">
            {description && (
              <p className="text-xs text-neutral-400 dark:text-neutral-500 leading-relaxed">
                {description}
              </p>
            )}
            {trend && (
              <span
                className={cn(
                  "text-[10px] font-bold px-2 py-0.5 rounded-full",
                  isPositiveTrend
                    ? "text-emerald-600 bg-emerald-50 dark:text-emerald-400 dark:bg-emerald-500/10"
                    : "text-red-500 bg-red-50 dark:text-red-400 dark:bg-red-500/10"
                )}
              >
                {isPositiveTrend ? "↑" : "↓"} {Math.abs(trend.value)}%
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
