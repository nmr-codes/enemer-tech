import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { calculateReadingTime, generateSlug } from "@/lib/utils"
import { postSchema } from "@/lib/validations"

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const page = parseInt(searchParams.get("page") || "1")
  const limit = parseInt(searchParams.get("limit") || "10")
  const search = searchParams.get("search") || ""
  const tag = searchParams.get("tag") || ""
  const adminMode = searchParams.get("admin") === "true"

  const skip = (page - 1) * limit

  // If admin mode is requested, verify session authority
  if (adminMode) {
    const session = await auth()
    if (!session) {
      return Response.json({ success: false, error: "Unauthorized" }, { status: 401 })
    }
  }

  const where: any = {}

  if (!adminMode) {
    where.status = "PUBLISHED"
  } else {
    const statusFilter = searchParams.get("status")
    if (statusFilter && ["DRAFT", "PUBLISHED", "ARCHIVED"].includes(statusFilter)) {
      where.status = statusFilter
    }
  }

  if (search) {
    where.OR = [
      { title: { contains: search, mode: "insensitive" } },
      { titleUz: { contains: search, mode: "insensitive" } },
      { excerpt: { contains: search, mode: "insensitive" } },
      { excerptUz: { contains: search, mode: "insensitive" } },
    ]
  }

  if (tag) {
    where.tags = {
      some: {
        tag: {
          slug: tag,
        },
      },
    }
  }

  try {
    const [posts, total] = await Promise.all([
      prisma.post.findMany({
        where,
        include: {
          tags: {
            include: {
              tag: true,
            },
          },
        },
        orderBy: [
          { publishedAt: "desc" },
          { createdAt: "desc" },
        ],
        skip,
        take: limit,
      }),
      prisma.post.count({ where }),
    ])

    const formattedPosts = posts.map((post) => ({
      ...post,
      tags: post.tags.map((pt) => pt.tag),
    }))

    return Response.json({
      success: true,
      data: formattedPosts,
      meta: {
        total,
        page,
        limit,
      },
    })
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
    const result = postSchema.safeParse(body)
    
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
      excerpt,
      excerptUz,
      content,
      contentUz,
      coverImage,
      status,
      featured,
      publishedAt,
      tagIds,
    } = result.data

    // Check slug uniqueness
    const finalSlug = slug ? generateSlug(slug) : generateSlug(title)
    const existingPost = await prisma.post.findUnique({
      where: { slug: finalSlug },
    })

    if (existingPost) {
      return Response.json(
        { success: false, error: "A post with this slug or title already exists" },
        { status: 400 }
      )
    }

    const readingTime = calculateReadingTime(content)
    const finalPublishedAt = status === "PUBLISHED" ? (publishedAt ? new Date(publishedAt) : new Date()) : null

    const post = await prisma.post.create({
      data: {
        title,
        titleUz,
        slug: finalSlug,
        excerpt,
        excerptUz,
        content,
        contentUz,
        coverImage,
        status,
        featured,
        readingTime,
        publishedAt: finalPublishedAt,
        tags: {
          create: tagIds.map((tagId: string) => ({
            tag: {
              connect: { id: tagId },
            },
          })),
        },
      },
      include: {
        tags: {
          include: {
            tag: true,
          },
        },
      },
    })

    const formattedPost = {
      ...post,
      tags: post.tags.map((pt) => pt.tag),
    }

    return Response.json({ success: true, data: formattedPost }, { status: 201 })
  } catch (err: any) {
    return Response.json({ success: false, error: err.message }, { status: 500 })
  }
}
