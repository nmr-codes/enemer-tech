"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { DataTable, Column } from "@/components/admin/DataTable"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useDebounce } from "@/hooks/useDebounce"
import { Edit2, Trash2, Plus, Star, StarOff, Hammer, CheckCircle } from "lucide-react"

interface Project {
  id: string
  title: string
  slug: string
  status: "IN_PROGRESS" | "COMPLETED" | "ARCHIVED"
  featured: boolean
  order: number
  techStack: string[]
}

export default function AdminProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")
  const debouncedSearch = useDebounce(search, 500)

  const fetchProjects = async () => {
    setLoading(true)
    try {
      const query = new URLSearchParams({ admin: "true" })
      const res = await fetch(`/api/projects?${query}`)
      const json = await res.json()
      if (json.success) {
        setProjects(json.data)
      }
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchProjects()
  }, [])

  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this project?")) return
    try {
      const res = await fetch(`/api/projects/${id}`, { method: "DELETE" })
      const json = await res.json()
      if (json.success) {
        setProjects(projects.filter((p) => p.id !== id))
      } else {
        alert(json.error || "Failed to delete project")
      }
    } catch (err) {
      alert("Error occurred while deleting project")
    }
  }

  const handleToggleFeatured = async (project: Project) => {
    const nextFeatured = !project.featured
    try {
      const res = await fetch(`/api/projects/${project.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...project,
          featured: nextFeatured,
        }),
      })
      const json = await res.json()
      if (json.success) {
        setProjects(
          projects.map((p) => (p.id === project.id ? { ...p, featured: nextFeatured } : p))
        )
      }
    } catch (err) {
      console.error(err)
    }
  }

  const filteredProjects = projects.filter((project) =>
    project.title.toLowerCase().includes(debouncedSearch.toLowerCase())
  )

  const columns: Column<Project>[] = [
    {
      header: "Title",
      accessor: (project) => (
        <div>
          <div className="font-semibold text-neutral-900 dark:text-neutral-100">{project.title}</div>
          <div className="text-[11px] text-neutral-400">/projects/{project.slug}</div>
        </div>
      ),
    },
    {
      header: "Status",
      accessor: (project) => {
        if (project.status === "IN_PROGRESS") {
          return (
            <Badge className="bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-400 border-none flex items-center gap-1 w-max">
              <Hammer className="h-3 w-3" /> In Progress
            </Badge>
          )
        }
        if (project.status === "COMPLETED") {
          return (
            <Badge className="bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400 border-none flex items-center gap-1 w-max">
              <CheckCircle className="h-3 w-3" /> Completed
            </Badge>
          )
        }
        return <Badge className="bg-neutral-100 text-neutral-600 dark:bg-neutral-850 dark:text-neutral-400 border-none">Archived</Badge>
      },
    },
    {
      header: "Featured",
      accessor: (project) => (
        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={() => handleToggleFeatured(project)}
          className={`h-8 w-8 ${project.featured ? "text-amber-500 hover:text-amber-600" : "text-neutral-400"}`}
        >
          {project.featured ? <Star className="h-4 w-4 fill-current" /> : <StarOff className="h-4 w-4" />}
        </Button>
      ),
    },
    {
      header: "Tech Stack",
      accessor: (project) => (
        <div className="flex flex-wrap gap-1 max-w-[200px]">
          {project.techStack.slice(0, 3).map((tech, i) => (
            <Badge key={tech + i} variant="outline" className="text-[10px] py-0 px-1.5 border-neutral-200 dark:border-neutral-800 text-neutral-600 dark:text-neutral-450">
              {tech}
            </Badge>
          ))}
          {project.techStack.length > 3 && (
            <span className="text-[10px] text-neutral-400">+{project.techStack.length - 3}</span>
          )}
        </div>
      ),
    },
    {
      header: "Order",
      accessor: (project) => <span className="font-semibold text-xs">{project.order}</span>,
    },
    {
      header: "Actions",
      accessor: (project) => (
        <div className="flex items-center gap-2">
          <Link href={`/admin/projects/${project.id}`}>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-neutral-500 hover:text-brand"
            >
              <Edit2 className="h-4 w-4" />
            </Button>
          </Link>

          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={() => handleDelete(project.id)}
            className="h-8 w-8 text-neutral-500 hover:text-red-500"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      ),
      className: "text-right justify-end",
    },
  ]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Portfolio Projects</h2>
          <p className="text-sm text-neutral-500 dark:text-neutral-400">
            Publish and manage case studies and code bases.
          </p>
        </div>
        <Link href="/admin/projects/new">
          <Button className="bg-brand hover:bg-brand-hover text-white flex items-center gap-2">
            <Plus className="h-4 w-4" /> Create Project
          </Button>
        </Link>
      </div>

      <DataTable
        columns={columns}
        data={filteredProjects}
        loading={loading}
        searchValue={search}
        onSearchChange={setSearch}
        searchPlaceholder="Search projects by title..."
        currentPage={1}
        totalCount={filteredProjects.length}
        pageSize={filteredProjects.length + 1}
        onPageChange={() => {}}
      />
    </div>
  )
}
