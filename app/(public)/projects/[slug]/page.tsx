import { notFound } from "next/navigation"
import { prisma } from "@/lib/prisma"
import { Badge } from "@/components/ui/badge"
import { Calendar, Hammer, CheckCircle, ArrowLeft, ExternalLink } from "lucide-react"
import { Github } from "@/components/shared/SocialIcons"
import Link from "next/link"

interface ProjectPageProps {
  params: {
    slug: string
  }
}

export async function generateMetadata({ params }: ProjectPageProps) {
  try {
    const project = await prisma.project.findUnique({
      where: { slug: params.slug },
    })

    if (!project) return { title: "Project Not Found" }

    return {
      title: `${project.title} | Abdurasul Nematxonov`,
      description: project.description,
      openGraph: {
        title: project.title,
        description: project.description,
        images: project.coverImage ? [{ url: project.coverImage }] : [],
      },
    }
  } catch (err) {
    return { title: "Project Details" }
  }
}

export default async function ProjectPage({ params }: ProjectPageProps) {
  let project
  try {
    project = await prisma.project.findUnique({
      where: { slug: params.slug },
    })
  } catch (err) {
    console.error("Failed to load project details:", err)
  }

  if (!project) {
    notFound()
  }

  const startDateText = project.startDate 
    ? new Date(project.startDate).toLocaleDateString(undefined, { month: "short", year: "numeric" }) 
    : ""
  const endDateText = project.endDate 
    ? new Date(project.endDate).toLocaleDateString(undefined, { month: "short", year: "numeric" }) 
    : "Present"

  return (
    <article className="space-y-8 max-w-4xl mx-auto">
      <div>
        <Link href="/projects" className="text-sm font-semibold text-neutral-500 hover:text-brand flex items-center gap-1.5 w-max transition-colors">
          <ArrowLeft className="h-4 w-4" /> Back to projects
        </Link>
      </div>

      <div className="space-y-4">
        <div className="flex flex-wrap items-center gap-3">
          {project.status === "IN_PROGRESS" ? (
            <Badge className="bg-amber-500 text-white text-xs font-semibold border-none shadow flex items-center gap-1">
              <Hammer className="h-3 w-3" /> In Progress
            </Badge>
          ) : (
            <Badge className="bg-emerald-600 text-white text-xs font-semibold border-none shadow flex items-center gap-1">
              <CheckCircle className="h-3 w-3" /> Completed
            </Badge>
          )}

          {project.startDate && (
            <span className="flex items-center gap-1.5 text-xs text-neutral-500 dark:text-neutral-450">
              <Calendar className="h-3.5 w-3.5" />
              {startDateText} - {project.status === "IN_PROGRESS" ? "Present" : endDateText}
            </span>
          )}
        </div>

        <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-neutral-900 dark:text-white leading-tight">
          {project.title}
        </h1>
        {project.titleUz && (
          <h2 className="text-xl sm:text-2xl font-semibold text-neutral-500 dark:text-neutral-450">
            {project.titleUz}
          </h2>
        )}

        <div className="flex flex-wrap gap-2 pt-2">
          {project.techStack.map((tech) => (
            <Badge key={tech} variant="outline" className="px-3 py-0.5 border-neutral-200 dark:border-neutral-850 text-neutral-650 dark:text-neutral-400 rounded-full font-medium">
              {tech}
            </Badge>
          ))}
        </div>
      </div>

      {project.coverImage && (
        <div className="aspect-[21/9] w-full rounded-2xl overflow-hidden border border-neutral-200 dark:border-neutral-800 bg-neutral-100 dark:bg-neutral-900 shadow-sm">
          <img src={project.coverImage} alt={project.title} className="w-full h-full object-cover" />
        </div>
      )}

      <div className="grid gap-8 md:grid-cols-3 items-start">
        <div className="md:col-span-1 space-y-6">
          <div className="p-6 rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900/30 space-y-6">
            <h3 className="font-bold text-xs uppercase tracking-widest text-neutral-400">Project Info</h3>
            
            <div className="space-y-4">
              <div>
                <span className="text-xs font-bold text-neutral-400 block mb-1">Code Repository</span>
                {project.githubUrl ? (
                  <a
                    href={project.githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm font-semibold text-neutral-700 dark:text-neutral-300 hover:text-brand flex items-center gap-1.5 transition-colors"
                  >
                    <Github className="h-4 w-4" /> View on GitHub
                  </a>
                ) : (
                  <span className="text-sm text-neutral-500 italic">Proprietary / Private</span>
                )}
              </div>

              <div>
                <span className="text-xs font-bold text-neutral-400 block mb-1">Production URL</span>
                {project.liveUrl ? (
                  <a
                    href={project.liveUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm font-semibold text-brand hover:text-brand-hover flex items-center gap-1.5 transition-colors"
                  >
                    <ExternalLink className="h-4 w-4" /> Visit Website
                  </a>
                ) : (
                  <span className="text-sm text-neutral-500 italic">No live demo available</span>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="md:col-span-2 space-y-8">
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-neutral-800 dark:text-white">Overview</h3>
            <p className="text-sm text-neutral-600 dark:text-neutral-300 leading-relaxed">
              {project.description}
            </p>
            {project.descriptionUz && (
              <p className="text-sm text-neutral-500 dark:text-neutral-400 leading-relaxed border-t border-dashed border-neutral-200 dark:border-neutral-850 pt-4 mt-4">
                {project.descriptionUz}
              </p>
            )}
          </div>

          {project.images && project.images.length > 0 && (
            <div className="space-y-4">
              <h3 className="text-lg font-bold text-neutral-800 dark:text-white">Screenshots</h3>
              <div className="grid gap-4 grid-cols-2">
                {project.images.map((imgUrl, i) => (
                  <div key={imgUrl + i} className="aspect-video rounded-xl border border-neutral-200 dark:border-neutral-800 overflow-hidden bg-neutral-100 dark:bg-neutral-900 group">
                    <img src={imgUrl} alt={`Screenshot ${i + 1}`} className="w-full h-full object-cover group-hover:scale-[1.01] transition-transform duration-300" />
                  </div>
                ))}
              </div>
            </div>
          )}

          {project.content && (
            <div className="space-y-4 border-t border-neutral-100 dark:border-neutral-900 pt-6">
              <h3 className="text-lg font-bold text-neutral-800 dark:text-white">Case Study</h3>
              <div
                className="prose dark:prose-invert max-w-none text-neutral-700 dark:text-neutral-350 leading-relaxed editor-content-area"
                dangerouslySetInnerHTML={{ __html: project.content }}
              />
            </div>
          )}
        </div>
      </div>
    </article>
  )
}
