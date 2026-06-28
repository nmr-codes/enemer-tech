"use server"

import { prisma } from "@/lib/prisma"
import { auth } from "@/lib/auth"
import { revalidatePath } from "next/cache"

export async function updateProfile(data: {
  name: string
  username: string
  bio: string
  image: string
}) {
  const session = await auth()
  if (!session?.user?.id) {
    throw new Error("Unauthorized")
  }

  // Check if username is already taken by someone else
  if (data.username) {
    const existing = await prisma.user.findUnique({
      where: { username: data.username }
    })
    if (existing && existing.id !== session.user.id) {
      throw new Error("Username is already taken")
    }
  }

  await prisma.user.update({
    where: { id: session.user.id },
    data: {
      name: data.name,
      username: data.username,
      bio: data.bio,
      image: data.image
    }
  })

  revalidatePath("/profile")
  revalidatePath("/profile/settings")
  return { success: true }
}
