"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useLanguage } from "@/context/LanguageContext"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ExternalLink, Hammer, CheckCircle, Terminal } from "lucide-react"
import { Github } from "@/components/shared/SocialIcons"
import { TiltCard } from "@/components/shared/TiltCard"

interface Project {
  id: string
  title: string
  titleUz: string | null
  slug: string
  description: string
  descriptionUz: string | null
  coverImage: string | null
  techStack: string[]
  githubUrl: string | null
  liveUrl: string | null
  status: "IN_PROGRESS" | "COMPLETED" | "ARCHIVED"
}

export default function ProjectsListingPage() {
  const { t, locale } = useLanguage()
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedStatus, setSelectedStatus] = useState<string>("all")
  const [selectedTech, setSelectedTech] = useState<string>("all")

  useEffect(() => {
    async function loadProjects() {
      setLoading(true)
      try {
        const res = await fetch("/api/projects")
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
    loadProjects()
  }, [])

  const uniqueTech = Array.from(
    new Set(projects.flatMap((p) => p.techStack))
  ).sort()

  const filteredProjects = projects.filter((p) => {
    const statusMatch = selectedStatus === "all" || p.status === selectedStatus
    const techMatch = selectedTech === "all" || p.techStack.includes(selectedTech)
    return statusMatch && techMatch
  })

  return (
    <div className="space-y-12">
      <div className="space-y-2 text-center max-w-xl mx-auto">
        <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight">
          {t("projects.title")}
        </h1>
        <p className="text-sm text-neutral-500 dark:text-neutral-400">
          {t("projects.subtitle")}
        </p>
      </div>

      <div className="flex flex-col md:flex-row gap-6 justify-between items-start md:items-center border-b border-neutral-100 dark:border-neutral-900 pb-6">
        <div className="flex items-center gap-2">
          <Button
            variant={selectedStatus === "all" ? "default" : "outline"}
            onClick={() => setSelectedStatus("all")}
            size="sm"
            className={selectedStatus === "all" ? "bg-brand hover:bg-brand-hover text-white" : ""}
          >
            All Statuses
          </Button>
          <Button
            variant={selectedStatus === "COMPLETED" ? "default" : "outline"}
            onClick={() => setSelectedStatus("COMPLETED")}
            size="sm"
            className={selectedStatus === "COMPLETED" ? "bg-brand hover:bg-brand-hover text-white" : ""}
          >
            Completed
          </Button>
          <Button
            variant={selectedStatus === "IN_PROGRESS" ? "default" : "outline"}
            onClick={() => setSelectedStatus("IN_PROGRESS")}
            size="sm"
            className={selectedStatus === "IN_PROGRESS" ? "bg-brand hover:bg-brand-hover text-white" : ""}
          >
            In Progress
          </Button>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-xs font-semibold text-neutral-400 dark:text-neutral-500">Tech Filter:</span>
          <select
            value={selectedTech}
            onChange={(e) => setSelectedTech(e.target.value)}
            className="text-xs font-medium bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg py-1 px-3 outline-none text-neutral-700 dark:text-neutral-300 hover:border-brand/30 transition-colors"
          >
            <option value="all">All Technologies</option>
            {uniqueTech.map((tech) => (
              <option key={tech} value={tech}>
                {tech}
              </option>
            ))}
          </select>
        </div>
      </div>

      {loading ? (
        <div className="grid gap-6 md:grid-cols-2">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="animate-pulse flex flex-col space-y-4 border border-neutral-200 dark:border-neutral-800 p-6 rounded-2xl">
              <div className="aspect-video bg-neutral-200 dark:bg-neutral-800 rounded-xl" />
              <div className="h-6 bg-neutral-200 dark:bg-neutral-800 w-3/4 rounded" />
              <div className="h-4 bg-neutral-200 dark:bg-neutral-800 w-full rounded" />
            </div>
          ))}
        </div>
      ) : filteredProjects.length === 0 ? (
        <p className="text-center text-neutral-500 dark:text-neutral-400 py-12 w-full col-span-full">
          {t("projects.noProjects")}
        </p>
      ) : (
        <div className="grid gap-8 md:grid-cols-2">
          {filteredProjects.map((project) => {
            const titleText = locale === "uz" && project.titleUz ? project.titleUz : project.title
            const descText = locale === "uz" && project.descriptionUz ? project.descriptionUz : project.description

            return (
              <TiltCard
                key={project.id}
                className="flex flex-col border border-neutral-200 dark:border-neutral-800 rounded-2xl overflow-hidden bg-background dark:bg-neutral-900 shadow-sm group"
              >
                <div className="relative aspect-[16/9] bg-neutral-100 dark:bg-neutral-950 flex items-center justify-center border-b border-neutral-200 dark:border-neutral-800 overflow-hidden">
                  {project.coverImage ? (
                    <img src={project.coverImage} alt={titleText} className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-300" />
                  ) : (
                    <div className="text-neutral-400 dark:text-neutral-600 flex flex-col items-center gap-2">
                      <Terminal className="h-10 w-10 text-neutral-400" />
                      <span className="text-[10px] uppercase font-bold tracking-widest">Project Showcase</span>
                    </div>
                  )}

                  <div className="absolute top-4 left-4">
                    {project.status === "IN_PROGRESS" ? (
                      <Badge className="bg-amber-500 text-white text-xs font-semibold border-none shadow flex items-center gap-1">
                        <Hammer className="h-3 w-3" /> {t("projects.status.IN_PROGRESS")}
                      </Badge>
                    ) : (
                      <Badge className="bg-emerald-600 text-white text-xs font-semibold border-none shadow flex items-center gap-1">
                        <CheckCircle className="h-3 w-3" /> {t("projects.status.COMPLETED")}
                      </Badge>
                    )}
                  </div>
                </div>

                <div className="p-6 flex-1 flex flex-col justify-between space-y-6 bg-background dark:bg-neutral-900">
                  <div className="space-y-3">
                    <h2 className="text-2xl font-bold text-neutral-900 dark:text-white hover:text-brand transition-colors">
                      <Link href={`/projects/${project.slug}`}>{titleText}</Link>
                    </h2>
                    <p className="text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed line-clamp-3">
                      {descText}
                    </p>
                  </div>

                  <div className="flex flex-wrap gap-1.5">
                    {project.techStack.map((tech) => (
                      <Badge key={tech} variant="secondary" className="text-[10px] bg-neutral-100 dark:bg-neutral-950 text-neutral-600 dark:text-neutral-400 border border-neutral-100 dark:border-neutral-900 font-normal">
                        {tech}
                      </Badge>
                    ))}
                  </div>

                  <div className="flex items-center gap-4 pt-4 border-t border-neutral-100 dark:border-neutral-900">
                    {project.githubUrl && (
                      <a
                         href={project.githubUrl}
                         target="_blank"
                         rel="noopener noreferrer"
                         className="flex items-center gap-1.5 text-sm font-semibold text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white transition-colors"
                      >
                        <Github className="h-4 w-4" /> {t("projects.links.github")}
                      </a>
                    )}
                    {project.liveUrl && (
                      <a
                        href={project.liveUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1.5 text-sm font-semibold text-brand hover:text-brand-hover transition-colors ml-auto"
                      >
                        <ExternalLink className="h-4 w-4" /> {t("projects.links.live")}
                      </a>
                    )}
                  </div>
                </div>
              </TiltCard>
            )
          })}
        </div>
      )}
    </div>
  )
}
