import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import { prisma } from "@/lib/prisma"
import { ProfileSettingsClient } from "./ProfileSettingsClient"

export const metadata = {
  title: "Profile Settings | Abdurasul Nematxonov",
}

export default async function ProfileSettingsPage() {
  const session = await auth()
  
  if (!session?.user) {
    redirect("/auth/login")
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id }
  })

  if (!user) {
    redirect("/auth/login")
  }

  const safeUser = {
    name: user.name || "",
    username: user.username || "",
    email: user.email,
    bio: user.bio || "",
    image: user.image || ""
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 animate-[fadeIn_0.3s_ease-out]">
      <h1 className="text-3xl font-extrabold tracking-tight text-neutral-900 dark:text-white mb-2">Profile Settings</h1>
      <p className="text-neutral-500 dark:text-neutral-400 mb-8">Customize your public presence, avatars, and bio.</p>
      
      <ProfileSettingsClient user={safeUser} />
    </div>
  )
}
