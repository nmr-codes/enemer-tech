"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { ProjectForm } from "@/components/admin/ProjectForm"

export default function NewProjectPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (data: any) => {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch("/api/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })
      const json = await res.json()
      if (json.success) {
        router.push("/admin/projects")
        router.refresh()
      } else {
        setError(json.error || "Failed to create project")
      }
    } catch (err) {
      setError("An unexpected error occurred.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Create New Project</h2>
          <p className="text-sm text-neutral-500 dark:text-neutral-400">
            Showcase a new coding project or case study.
          </p>
        </div>
      </div>

      {error && (
        <div className="p-4 rounded-lg bg-red-950/50 border border-red-900/50 text-red-400 text-sm">
          {error}
        </div>
      )}

      <ProjectForm onSubmit={handleSubmit} loading={loading} />
    </div>
  )
}
