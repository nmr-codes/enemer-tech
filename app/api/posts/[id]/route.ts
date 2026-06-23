import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { calculateReadingTime, generateSlug } from "@/lib/utils"
import { postSchema } from "@/lib/validations"

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  const session = await auth()
  if (!session) {
    return Response.json({ success: false, error: "Unauthorized" }, { status: 401 })
  }

  try {
    const post = await prisma.post.findUnique({
      where: { id: params.id },
      include: {
        tags: {
          include: {
            tag: true,
          },
        },
      },
    })

    if (!post) {
      return Response.json({ success: false, error: "Post not found" }, { status: 404 })
    }

    const formattedPost = {
      ...post,
      tags: post.tags.map((pt) => pt.tag),
    }

    return Response.json({ success: true, data: formattedPost })
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
    const result = postSchema.safeParse(body)

    if (!result.success) {
      return Response.json(
        { success: false, error: "Validation failed", details: result.error.format() },
        { status: 400 }
      )
    }

    const currentPost = await prisma.post.findUnique({
      where: { id: params.id },
    })

    if (!currentPost) {
      return Response.json({ success: false, error: "Post not found" }, { status: 404 })
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

    const finalSlug = slug ? generateSlug(slug) : generateSlug(title)

    // Check slug uniqueness if it was modified
    if (finalSlug !== currentPost.slug) {
      const existingSlug = await prisma.post.findUnique({
        where: { slug: finalSlug },
      })
      if (existingSlug) {
        return Response.json(
          { success: false, error: "A post with this slug or title already exists" },
          { status: 400 }
        )
      }
    }

    const readingTime = calculateReadingTime(content)
    let finalPublishedAt = currentPost.publishedAt
    if (status === "PUBLISHED" && !currentPost.publishedAt) {
      finalPublishedAt = publishedAt ? new Date(publishedAt) : new Date()
    } else if (status === "DRAFT") {
      finalPublishedAt = null
    } else if (publishedAt) {
      finalPublishedAt = new Date(publishedAt)
    }

    // Sync tags relationship cleanly in a single transaction
    const updatedPost = await prisma.$transaction(async (tx) => {
      // Remove all current tag joins for this post
      await tx.postTag.deleteMany({
        where: { postId: params.id },
      })

      // Update post and attach new tag joins
      return await tx.post.update({
        where: { id: params.id },
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
    })

    const formattedPost = {
      ...updatedPost,
      tags: updatedPost.tags.map((pt) => pt.tag),
    }

    return Response.json({ success: true, data: formattedPost })
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
    const post = await prisma.post.findUnique({
      where: { id: params.id },
    })

    if (!post) {
      return Response.json({ success: false, error: "Post not found" }, { status: 404 })
    }

    await prisma.post.delete({
      where: { id: params.id },
    })

    return Response.json({ success: true, data: { id: params.id } })
  } catch (err: any) {
    return Response.json({ success: false, error: err.message }, { status: 500 })
  }
}
