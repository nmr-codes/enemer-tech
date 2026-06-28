import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import { ProfileClient } from "./ProfileClient"
import { prisma } from "@/lib/prisma"

export const metadata = {
  title: "Profile | Abdurasul Nematxonov",
}

export default async function ProfilePage() {
  const session = await auth()
  
  if (!session?.user) {
    redirect("/auth/login")
  }

  // Fetch full user details from DB
  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    include: { accounts: true }
  })

  if (!user) {
    redirect("/auth/login")
  }

  // Pass necessary fields to client to avoid sending sensitive Prisma internals
  const safeUser = {
    name: user.name,
    email: user.email,
    image: user.image,
    role: user.role,
    createdAt: user.createdAt,
    accounts: user.accounts.map(acc => acc.provider)
  }

  return (
    <div className="min-h-[70vh] flex items-center justify-center p-4 animate-[fadeIn_0.3s_ease-out]">
      <ProfileClient user={safeUser} />
    </div>
  )
}
