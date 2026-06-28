"use server"

import { prisma } from "@/lib/prisma"
import { auth } from "@/lib/auth"
import { revalidatePath } from "next/cache"

async function checkAdmin() {
  const session = await auth()
  if (!session?.user || (session.user as any).role !== "ADMIN") {
    throw new Error("Unauthorized")
  }
}

export async function toggleUserRole(userId: string) {
  await checkAdmin()
  const user = await prisma.user.findUnique({ where: { id: userId } })
  if (!user) throw new Error("User not found")
  
  const newRole = user.role === "ADMIN" ? "USER" : "ADMIN"
  await prisma.user.update({
    where: { id: userId },
    data: { role: newRole }
  })
  
  revalidatePath("/admin/users")
  return { success: true, role: newRole }
}

export async function revokeUserSessions(userId: string) {
  await checkAdmin()
  await prisma.session.deleteMany({
    where: { userId }
  })
  
  revalidatePath("/admin/users")
  return { success: true }
}

export async function deleteUser(userId: string) {
  await checkAdmin()
  await prisma.user.delete({
    where: { id: userId }
  })
  
  revalidatePath("/admin/users")
  return { success: true }
}

export async function generateUsersCSV() {
  await checkAdmin()
  const users = await prisma.user.findMany({
    include: { accounts: true },
    orderBy: { createdAt: "desc" }
  })

  const header = "ID,Name,Email,Role,Joined,Auth Methods\n"
  const rows = users.map(u => {
    const methods = u.accounts.length > 0 ? u.accounts.map(a => a.provider).join(";") : "credentials"
    return `${u.id},"${u.name || ""}","${u.email}",${u.role},${u.createdAt.toISOString()},"${methods}"`
  }).join("\n")

  return header + rows
}
