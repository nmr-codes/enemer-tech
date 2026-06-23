import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { generateSlug } from "@/lib/utils"
import { tagSchema } from "@/lib/validations"

export async function GET() {
  try {
    const tags = await prisma.tag.findMany({
      orderBy: { name: "asc" },
    })
    return Response.json({ success: true, data: tags })
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
    const result = tagSchema.safeParse(body)

    if (!result.success) {
      return Response.json(
        { success: false, error: "Validation failed", details: result.error.format() },
        { status: 400 }
      )
    }

    const { name, nameUz, slug, color } = result.data
    const finalSlug = slug ? generateSlug(slug) : generateSlug(name)

    const existingTag = await prisma.tag.findFirst({
      where: {
        OR: [{ name }, { slug: finalSlug }],
      },
    })

    if (existingTag) {
      return Response.json({ success: false, error: "Tag already exists" }, { status: 400 })
    }

    const tag = await prisma.tag.create({
      data: {
        name,
        nameUz,
        slug: finalSlug,
        color: color || "#005fe8", // Default to brand blue hex
      },
    })

    return Response.json({ success: true, data: tag }, { status: 201 })
  } catch (err: any) {
    return Response.json({ success: false, error: err.message }, { status: 500 })
  }
}
