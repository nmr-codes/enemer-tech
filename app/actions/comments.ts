"use server"

import { prisma } from "@/lib/prisma"
import { auth } from "@/lib/auth"
import { revalidatePath } from "next/cache"

export async function addComment(data: {
  postId: string
  content: string
  parentId?: string
}) {
  const session = await auth()
  if (!session?.user?.id) {
    throw new Error("You must be logged in to comment")
  }

  if (!data.content || data.content.trim() === "") {
    throw new Error("Comment cannot be empty")
  }

  await prisma.comment.create({
    data: {
      content: data.content,
      postId: data.postId,
      userId: session.user.id,
      parentId: data.parentId || null
    }
  })

  // Revalidate the blog post page to show the new comment
  const post = await prisma.post.findUnique({ where: { id: data.postId } })
  if (post) {
    revalidatePath(`/blog/${post.slug}`)
  }
  
  return { success: true }
}

export async function deleteComment(commentId: string) {
  const session = await auth()
  if (!session?.user?.id) {
    throw new Error("Unauthorized")
  }

  const comment = await prisma.comment.findUnique({
    where: { id: commentId },
    include: { post: true }
  })

  if (!comment) {
    throw new Error("Comment not found")
  }

  // Only the author or an ADMIN can delete a comment
  if (comment.userId !== session.user.id && (session.user as any).role !== "ADMIN") {
    throw new Error("You do not have permission to delete this comment")
  }

  await prisma.comment.delete({
    where: { id: commentId }
  })

  revalidatePath(`/blog/${comment.post.slug}`)
  return { success: true }
}
