"use client"

import { useEffect, useState } from "react"
import { useRouter, useParams } from "next/navigation"
import { ProjectForm } from "@/components/admin/ProjectForm"

export default function EditProjectPage() {
  const router = useRouter()
  const params = useParams()
  const id = params.id as string

  const [project, setProject] = useState<any>(null)
  const [fetching, setFetching] = useState(true)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchProject() {
      try {
        const res = await fetch(`/api/projects/${id}`)
        const json = await res.json()
        if (json.success) {
          setProject(json.data)
        } else {
          setError(json.error || "Failed to load project data")
        }
      } catch (err) {
        setError("Error loading project data.")
      } finally {
        setFetching(false)
      }
    }
    if (id) fetchProject()
  }, [id])

  const handleSubmit = async (data: any) => {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch(`/api/projects/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })
      const json = await res.json()
      if (json.success) {
        router.push("/admin/projects")
        router.refresh()
      } else {
        setError(json.error || "Failed to update project")
      }
    } catch (err) {
      setError("An unexpected error occurred.")
    } finally {
      setLoading(false)
    }
  }

  if (fetching) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center">
        <div className="flex flex-col items-center gap-2">
          <div className="w-8 h-8 border-4 border-brand border-t-transparent rounded-full animate-spin" />
          <p className="text-sm text-neutral-500">Loading project data...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Edit Project</h2>
          <p className="text-sm text-neutral-500 dark:text-neutral-400">
            Modify details, gallery items, links, or settings of this showcase.
          </p>
        </div>
      </div>

      {error && (
        <div className="p-4 rounded-lg bg-red-950/50 border border-red-900/50 text-red-400 text-sm">
          {error}
        </div>
      )}

      {project && <ProjectForm initialData={project} onSubmit={handleSubmit} loading={loading} />}
    </div>
  )
}
