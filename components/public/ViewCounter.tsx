"use client"

import { useEffect } from "react"

interface ViewCounterProps {
  slug: string
}

export function ViewCounter({ slug }: ViewCounterProps) {
  useEffect(() => {
    if (!slug) return
    
    // Increment post views
    fetch(`/api/views/${slug}`, {
      method: "POST",
    }).catch((err) => {
      console.warn("Failed to increment views:", err)
    })
  }, [slug])

  return null
}
