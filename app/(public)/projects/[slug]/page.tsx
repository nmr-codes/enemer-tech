import { notFound } from "next/navigation"
import { prisma } from "@/lib/prisma"
import { ProjectDetailsClient } from "@/components/public/ProjectDetailsClient"

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

  return <ProjectDetailsClient project={project} />
}

