"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { signOut } from "next-auth/react"
import {
  LayoutDashboard,
  FileText,
  FolderGit2,
  Mail,
  Users,
  Settings,
  LogOut,
  ExternalLink,
} from "lucide-react"
import { cn } from "@/lib/utils"

const navigation = [
  { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { name: "Posts", href: "/admin/posts", icon: FileText },
  { name: "Projects", href: "/admin/projects", icon: FolderGit2 },
  { name: "Messages", href: "/admin/messages", icon: Mail },
  { name: "Visitors", href: "/admin/visitors", icon: Users },
  { name: "Settings", href: "/admin/settings", icon: Settings },
]

interface AdminSidebarProps {
  className?: string
  onClose?: () => void
}

export function AdminSidebar({ className, onClose }: AdminSidebarProps) {
  const pathname = usePathname()

  const handleLogout = () => {
    signOut({ callbackUrl: "/admin/login" })
  }

  return (
    <div className={cn("flex flex-col h-full bg-neutral-950 border-r border-neutral-800 text-white w-64", className)}>
      <div className="flex items-center gap-2 px-6 h-16 border-b border-neutral-800">
        <LayoutDashboard className="h-6 w-6 text-brand" />
        <span className="font-bold text-lg tracking-tight">Admin Panel</span>
      </div>

      <nav className="flex-1 space-y-1 px-4 py-6 overflow-y-auto">
        {navigation.map((item) => {
          // Check if active (avoid matching settings on /admin/settings-some-other-thing etc.)
          const isActive = item.href === "/admin" 
            ? pathname === "/admin" 
            : pathname.startsWith(item.href)

          return (
            <Link
              key={item.name}
              href={item.href}
              onClick={onClose}
              className={cn(
                "flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors",
                isActive
                  ? "bg-brand/10 text-brand border-l-2 border-brand rounded-l-none"
                  : "text-neutral-400 hover:bg-neutral-900 hover:text-white"
              )}
            >
              <item.icon className="h-5 w-5 shrink-0" />
              {item.name}
            </Link>
          )
        })}

        <div className="h-[1px] bg-neutral-800 my-4" />

        <Link
          href="/"
          target="_blank"
          className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-neutral-400 hover:bg-neutral-900 hover:text-white transition-colors"
        >
          <ExternalLink className="h-5 w-5 shrink-0" />
          View Public Site
        </Link>
      </nav>

      <div className="p-4 border-t border-neutral-800">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 w-full px-4 py-3 rounded-lg text-sm font-medium text-red-400 hover:bg-red-950/20 transition-colors"
        >
          <LogOut className="h-5 w-5 shrink-0" />
          Sign Out
        </button>
      </div>
    </div>
  )
}
