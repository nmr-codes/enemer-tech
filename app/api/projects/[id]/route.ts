import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { generateSlug } from "@/lib/utils"
import { projectSchema } from "@/lib/validations"

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  const session = await auth()
  if (!session) {
    return Response.json({ success: false, error: "Unauthorized" }, { status: 401 })
  }

  try {
    const project = await prisma.project.findUnique({
      where: { id: params.id },
    })

    if (!project) {
      return Response.json({ success: false, error: "Project not found" }, { status: 404 })
    }

    return Response.json({ success: true, data: project })
  } catch (err: any) {
    return Response.json({ success: false, error: err.message }, { status: 500 })
  }
}

export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
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

    const currentProject = await prisma.project.findUnique({
      where: { id: params.id },
    })

    if (!currentProject) {
      return Response.json({ success: false, error: "Project not found" }, { status: 404 })
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

    if (finalSlug !== currentProject.slug) {
      const existingSlug = await prisma.project.findUnique({
        where: { slug: finalSlug },
      })
      if (existingSlug) {
        return Response.json(
          { success: false, error: "A project with this slug or title already exists" },
          { status: 400 }
        )
      }
    }

    const updatedProject = await prisma.project.update({
      where: { id: params.id },
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

    return Response.json({ success: true, data: updatedProject })
  } catch (err: any) {
    return Response.json({ success: false, error: err.message }, { status: 500 })
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  const session = await auth()
  if (!session) {
    return Response.json({ success: false, error: "Unauthorized" }, { status: 401 })
  }

  try {
    const project = await prisma.project.findUnique({
      where: { id: params.id },
    })

    if (!project) {
      return Response.json({ success: false, error: "Project not found" }, { status: 404 })
    }

    await prisma.project.delete({
      where: { id: params.id },
    })

    return Response.json({ success: true, data: { id: params.id } })
  } catch (err: any) {
    return Response.json({ success: false, error: err.message }, { status: 500 })
  }
}
