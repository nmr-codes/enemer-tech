import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { generateSlug } from "@/lib/utils"
import { projectSchema } from "@/lib/validations"

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const adminMode = searchParams.get("admin") === "true"

  if (adminMode) {
    const session = await auth()
    if (!session) {
      return Response.json({ success: false, error: "Unauthorized" }, { status: 401 })
    }
  }

  const where: any = {}
  if (!adminMode) {
    where.status = { in: ["IN_PROGRESS", "COMPLETED"] }
  }

  try {
    const projects = await prisma.project.findMany({
      where,
      orderBy: [
        { order: "asc" },
        { createdAt: "desc" },
      ],
    })

    return Response.json({ success: true, data: projects })
  } catch (err: any) {
    return Response.json({ success: false, error: err.message }, { status: 500 })
  }
}

export async function POST(req: Request) {
  const session = await auth()
  if (!session) {
    return Response.json({ success: false, error: "Unauthorized" }, { status: 401 })
  }

  try {
    const body = await req.json()
    const result = projectSchema.safeParse(body)

    if (!result.success) {
      return Response.json(
        { success: false, error: "Validation failed", details: result.error.format() },
        { status: 400 }
      )
    }

    const {
      title,
      titleUz,
      slug,
      description,
      descriptionUz,
      content,
      coverImage,
      images,
      techStack,
      githubUrl,
      liveUrl,
      status,
      featured,
      order,
      startDate,
      endDate,
    } = result.data

    const finalSlug = slug ? generateSlug(slug) : generateSlug(title)

    const existingProject = await prisma.project.findUnique({
      where: { slug: finalSlug },
    })

    if (existingProject) {
      return Response.json(
        { success: false, error: "A project with this slug or title already exists" },
        { status: 400 }
      )
    }

    const project = await prisma.project.create({
      data: {
        title,
        titleUz,
        slug: finalSlug,
        description,
        descriptionUz,
        content,
        coverImage,
        images,
        techStack,
        githubUrl: githubUrl || null,
        liveUrl: liveUrl || null,
        status,
        featured,
        order,
        startDate: startDate ? new Date(startDate) : null,
        endDate: endDate ? new Date(endDate) : null,
      },
    })

    return Response.json({ success: true, data: project }, { status: 201 })
  } catch (err: any) {
    return Response.json({ success: false, error: err.message }, { status: 500 })
  }
}
