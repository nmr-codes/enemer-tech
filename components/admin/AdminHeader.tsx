"use client"

import { Menu, User } from "lucide-react"
import { useSession } from "next-auth/react"
import { ThemeToggle } from "@/components/shared/ThemeToggle"

interface AdminHeaderProps {
  onMenuClick: () => void
}

export function AdminHeader({ onMenuClick }: AdminHeaderProps) {
  const { data: session } = useSession()

  return (
    <header className="h-16 border-b border-neutral-200 dark:border-neutral-800 bg-background dark:bg-neutral-900 px-6 flex items-center justify-between sticky top-0 z-30">
      <div className="flex items-center gap-4">
        <button
          onClick={onMenuClick}
          className="lg:hidden p-2 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-600 dark:text-neutral-400"
          aria-label="Open menu"
        >
          <Menu className="h-5 w-5" />
        </button>
        <h1 className="text-lg font-semibold text-neutral-800 dark:text-white">
          Admin Dashboard
        </h1>
      </div>

      <div className="flex items-center gap-4">
        <ThemeToggle />

        <div className="h-6 w-[1px] bg-neutral-200 dark:bg-neutral-800" />

        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-brand/10 border border-brand/20 flex items-center justify-center text-brand">
            <User className="h-4 w-4" />
          </div>
          <span className="text-sm font-medium text-neutral-700 dark:text-neutral-300 hidden md:inline-block">
            {session?.user?.name || "Admin"}
          </span>
        </div>
      </div>
    </header>
  )
}
