"use client"

import { useState } from "react"
import { useLanguage } from "@/context/LanguageContext"
import { Badge } from "@/components/ui/badge"
import { Calendar, Hammer, CheckCircle, ArrowLeft, ExternalLink, X, ZoomIn } from "lucide-react"
import { Github } from "@/components/shared/SocialIcons"
import Link from "next/link"

interface Project {
  id: string
  title: string
  titleUz: string | null
  slug: string
  description: string
  descriptionUz: string | null
  content: string | null
  coverImage: string | null
  images: string[]
  techStack: string[]
  githubUrl: string | null
  liveUrl: string | null
  status: "IN_PROGRESS" | "COMPLETED" | "ARCHIVED"
  startDate: Date | null
  endDate: Date | null
}

export function ProjectDetailsClient({ project }: { project: Project }) {
  const { t, locale } = useLanguage()
  const [activeImage, setActiveImage] = useState<string | null>(null)

  const titleText = locale === "uz" && project.titleUz ? project.titleUz : project.title
  const descText = locale === "uz" && project.descriptionUz ? project.descriptionUz : project.description

  const startDateText = project.startDate 
    ? new Date(project.startDate).toLocaleDateString(locale === "uz" ? "uz-UZ" : "en-US", { month: "short", year: "numeric" }) 
    : ""
  const endDateText = project.endDate 
    ? new Date(project.endDate).toLocaleDateString(locale === "uz" ? "uz-UZ" : "en-US", { month: "short", year: "numeric" }) 
    : t("projects.present")

  return (
    <article className="space-y-8 max-w-4xl mx-auto relative px-4">
      {/* Lightbox Modal */}
      {activeImage && (
        <div 
          className="fixed inset-0 bg-black/90 backdrop-blur-md z-50 flex items-center justify-center p-4 transition-all duration-300 cursor-zoom-out"
          onClick={() => setActiveImage(null)}
        >
          <button 
            className="absolute top-4 right-4 p-2.5 rounded-full bg-neutral-900/80 hover:bg-neutral-800 text-white transition-colors"
            onClick={(e) => {
              e.stopPropagation()
              setActiveImage(null)
            }}
          >
            <X className="h-5 w-5" />
          </button>
          
          <img 
            src={activeImage} 
            alt="Expanded screenshot view" 
            className="max-h-[85vh] max-w-full object-contain rounded-xl shadow-2xl animate-[scaleIn_0.2s_ease]"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}

      <div>
        <Link 
          href="/projects" 
          className="text-sm font-semibold text-neutral-500 hover:text-brand flex items-center gap-1.5 w-max transition-colors"
        >
          <ArrowLeft className="h-4 w-4" /> {t("projects.back")}
        </Link>
      </div>

      <div className="space-y-4">
        <div className="flex flex-wrap items-center gap-3">
          {project.status === "IN_PROGRESS" ? (
            <Badge className="bg-amber-500 text-white text-xs font-semibold border-none shadow flex items-center gap-1">
              <Hammer className="h-3 w-3" /> {t("projects.status.IN_PROGRESS")}
            </Badge>
          ) : (
            <Badge className="bg-emerald-600 text-white text-xs font-semibold border-none shadow flex items-center gap-1">
              <CheckCircle className="h-3 w-3" /> {t("projects.status.COMPLETED")}
            </Badge>
          )}

          {project.startDate && (
            <span className="flex items-center gap-1.5 text-xs text-neutral-500 dark:text-neutral-450">
              <Calendar className="h-3.5 w-3.5" />
              {startDateText} - {project.status === "IN_PROGRESS" ? t("projects.present") : endDateText}
            </span>
          )}
        </div>

        <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-neutral-900 dark:text-white leading-tight">
          {titleText}
        </h1>

        <div className="flex flex-wrap gap-2 pt-2">
          {project.techStack.map((tech) => (
            <Badge key={tech} variant="outline" className="px-3 py-0.5 border-neutral-200 dark:border-neutral-800 text-neutral-650 dark:text-neutral-400 rounded-full font-medium">
              {tech}
            </Badge>
          ))}
        </div>
      </div>

      {project.coverImage && (
        <div className="aspect-[16/9] md:aspect-[21/9] w-full rounded-2xl overflow-hidden border border-neutral-200 dark:border-neutral-800 bg-neutral-100 dark:bg-neutral-900 shadow-sm relative group cursor-zoom-in"
             onClick={() => setActiveImage(project.coverImage)}
        >
          <img src={project.coverImage} alt={titleText} className="w-full h-full object-cover group-hover:scale-[1.01] transition-transform duration-300" />
          <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity duration-300">
            <span className="bg-neutral-900/70 backdrop-blur-sm text-white px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1">
              <ZoomIn className="h-3.5 w-3.5" /> Click to Expand
            </span>
          </div>
        </div>
      )}

      <div className="grid gap-8 md:grid-cols-3 items-start">
        {/* Info card (Left/First sidebar) */}
        <div className="md:col-span-1 space-y-6">
          <div className="p-6 rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900/30 space-y-6">
            <h3 className="font-bold text-xs uppercase tracking-widest text-neutral-400">{t("projects.info")}</h3>
            
            <div className="space-y-4">
              <div>
                <span className="text-xs font-bold text-neutral-400 block mb-1">{t("projects.repo")}</span>
                {project.githubUrl ? (
                  <a
                    href={project.githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm font-semibold text-neutral-700 dark:text-neutral-300 hover:text-brand flex items-center gap-1.5 transition-colors"
                  >
                    <Github className="h-4 w-4" /> {t("projects.links.github")}
                  </a>
                ) : (
                  <span className="text-sm text-neutral-500 italic">{t("projects.private")}</span>
                )}
              </div>

              <div>
                <span className="text-xs font-bold text-neutral-400 block mb-1">{t("projects.prodUrl")}</span>
                {project.liveUrl ? (
                  <a
                    href={project.liveUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm font-semibold text-brand hover:text-brand-hover flex items-center gap-1.5 transition-colors"
                  >
                    <ExternalLink className="h-4 w-4" /> {t("projects.links.live")}
                  </a>
                ) : (
                  <span className="text-sm text-neutral-500 italic">{t("projects.noDemo")}</span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Content body (Right/Main column) */}
        <div className="md:col-span-2 space-y-8">
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-neutral-800 dark:text-white">{t("projects.overview")}</h3>
            <p className="text-sm text-neutral-600 dark:text-neutral-300 leading-relaxed whitespace-pre-line">
              {descText}
            </p>
          </div>

          {/* Screenshots section */}
          {project.images && project.images.length > 0 && (
            <div className="space-y-4">
              <h3 className="text-lg font-bold text-neutral-800 dark:text-white">{t("projects.screenshots")}</h3>
              <div className="grid gap-4 grid-cols-1 sm:grid-cols-2">
                {project.images.map((imgUrl, i) => (
                  <div 
                    key={imgUrl + i} 
                    className="aspect-video rounded-xl border border-neutral-200 dark:border-neutral-800 overflow-hidden bg-neutral-100 dark:bg-neutral-900 group cursor-zoom-in relative"
                    onClick={() => setActiveImage(imgUrl)}
                  >
                    <img 
                      src={imgUrl} 
                      alt={`Screenshot ${i + 1}`} 
                      className="w-full h-full object-cover group-hover:scale-[1.01] transition-transform duration-300" 
                    />
                    <div className="absolute inset-0 bg-black/25 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity duration-300">
                      <span className="bg-neutral-900/70 backdrop-blur-sm text-white px-2 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1 scale-90 group-hover:scale-100 transition-transform duration-300">
                        <ZoomIn className="h-3 w-3" /> Expand
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Case study (prose) */}
          {project.content && (
            <div className="space-y-4 border-t border-neutral-100 dark:border-neutral-900 pt-6">
              <h3 className="text-lg font-bold text-neutral-800 dark:text-white">{t("projects.caseStudy")}</h3>
              <div
                className="prose dark:prose-invert max-w-none text-neutral-700 dark:text-neutral-300 leading-relaxed editor-content-area"
                dangerouslySetInnerHTML={{ __html: project.content }}
              />
            </div>
          )}
        </div>
      </div>
    </article>
  )
}
