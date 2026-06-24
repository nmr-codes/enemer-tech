"use client"

import { useState, useEffect } from "react"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { signOut } from "next-auth/react"
import { useSession } from "next-auth/react"
import {
  LayoutDashboard,
  FileText,
  FolderGit2,
  Mail,
  Users,
  Settings,
  LogOut,
  ExternalLink,
  ChevronRight,
  ShieldCheck,
  Briefcase,
  GraduationCap
} from "lucide-react"
import { cn } from "@/lib/utils"

const navGroups = [
  {
    label: "Content",
    items: [
      { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
      { name: "Posts", href: "/admin/posts", icon: FileText },
      { name: "Projects", href: "/admin/projects", icon: FolderGit2 },
      { name: "Experience", href: "/admin/experience", icon: Briefcase },
      { name: "Education", href: "/admin/education", icon: GraduationCap },
    ],
  },
  {
    label: "Data",
    items: [
      { name: "Messages", href: "/admin/messages", icon: Mail },
      { name: "Visitors", href: "/admin/visitors", icon: Users },
    ],
  },
  {
    label: "Config",
    items: [
      { name: "Settings", href: "/admin/settings", icon: Settings },
    ],
  },
]

interface AdminSidebarProps {
  className?: string
  onClose?: () => void
  unreadMessages?: number
}

export function AdminSidebar({ className, onClose, unreadMessages = 0 }: AdminSidebarProps) {
  const pathname = usePathname()
  const { data: session } = useSession()

  const userInitials = session?.user?.name
    ? session.user.name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)
    : "AN"

  const [profilePhoto, setProfilePhoto] = useState<string | null>(null)

  useEffect(() => {
    fetch("/api/settings")
      .then((res) => res.json())
      .then((json) => {
        if (json.success && json.data?.profile_photo) {
          setProfilePhoto(json.data.profile_photo)
        }
      })
      .catch(() => {})
  }, [])

  const handleLogout = () => {
    signOut({ callbackUrl: "/admin/login" })
  }

  return (
    <div
      className={cn(
        "flex flex-col h-full w-64 overflow-hidden border-r border-neutral-200 dark:border-white/[0.06] bg-white dark:bg-[#060b18] text-neutral-900 dark:text-white",
        className
      )}
    >
      {/* ── Header ──────────────────────────── */}
      <div className="flex items-center gap-3 px-5 h-16 shrink-0 border-b border-neutral-200 dark:border-white/[0.06]">
        <div
          className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
          style={{
            background: "linear-gradient(135deg, #005fe8, #0080ff)",
            boxShadow: "0 4px 14px rgba(0,95,232,0.4)",
          }}
        >
          <ShieldCheck className="h-4 w-4 text-white" />
        </div>
        <div className="leading-tight">
          <span className="font-bold text-sm tracking-tight text-neutral-900 dark:text-white">Admin Panel</span>
          <div className="text-[10px] text-neutral-500 dark:text-neutral-400">Secured CMS</div>
        </div>
      </div>

      {/* ── User Avatar ─────────────────────── */}
      <div className="flex items-center gap-3 mx-3 mt-4 mb-2 px-3 py-3 rounded-xl border border-neutral-200 dark:border-white/[0.06] bg-neutral-50 dark:bg-white/[0.04]">
        <div
          className="w-9 h-9 rounded-xl flex items-center justify-center text-white text-sm font-bold shrink-0 overflow-hidden"
          style={{
            background: "radial-gradient(circle at 35% 35%, #60a5fa, #005fe8 50%, #003fa0)",
            boxShadow: "0 0 16px rgba(0,95,232,0.3)",
          }}
        >
          {profilePhoto ? (
            <img src={profilePhoto} alt="Admin Profile" className="w-full h-full object-cover" />
          ) : (
            userInitials
          )}
        </div>
        <div className="min-w-0">
          <p className="text-sm font-semibold text-neutral-900 dark:text-white truncate">
            {session?.user?.name || "Abdurasul"}
          </p>
          <p className="text-[10px] text-emerald-400 flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block" />
            Administrator
          </p>
        </div>
      </div>

      {/* ── Navigation ──────────────────────── */}
      <nav className="flex-1 px-3 py-3 space-y-5 overflow-y-auto">
        {navGroups.map((group) => (
          <div key={group.label} className="space-y-0.5">
            <p className="text-[10px] font-bold uppercase tracking-widest text-neutral-600 px-4 pb-1.5">
              {group.label}
            </p>
            {group.items.map((item) => {
              const isActive =
                item.href === "/admin"
                  ? pathname === "/admin"
                  : pathname.startsWith(item.href)
              const isMessages = item.name === "Messages"

              return (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={onClose}
                  className={cn(
                    "flex items-center justify-between px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 group",
                    isActive
                      ? "text-brand bg-brand-light/50 dark:bg-brand/10 border border-brand/20 dark:border-brand/30 shadow-[inset_0_0_20px_rgba(0,95,232,0.03)] dark:shadow-[inset_0_0_20px_rgba(0,95,232,0.05)]"
                      : "text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-white/5"
                  )}

                >
                  <div className="flex items-center gap-3">
                    <item.icon
                      className={cn(
                        "h-4 w-4 shrink-0 transition-colors",
                        isActive ? "text-blue-400" : "text-neutral-600 group-hover:text-neutral-400"
                      )}
                    />
                    {item.name}
                  </div>
                  <div className="flex items-center gap-1.5">
                    {isMessages && unreadMessages > 0 && (
                      <span className="text-[10px] font-bold bg-red-500 text-white px-1.5 py-0.5 rounded-full min-w-[18px] text-center">
                        {unreadMessages > 99 ? "99+" : unreadMessages}
                      </span>
                    )}
                    {isActive && (
                      <ChevronRight className="h-3 w-3 text-blue-400" />
                    )}
                  </div>
                </Link>
              )
            })}
          </div>
        ))}
      </nav>

      {/* ── Footer ──────────────────────────── */}
      <div className="p-3 space-y-1 shrink-0 border-t border-neutral-200 dark:border-white/[0.06]">
        <Link
          href="/"
          target="_blank"
          onClick={onClose}
          className="flex items-center gap-3 w-full px-4 py-2.5 rounded-xl text-sm font-medium text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-white/5 transition-all"
        >
          <ExternalLink className="h-4 w-4 shrink-0" />
          View Public Site
        </Link>
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 w-full px-4 py-2.5 rounded-xl text-sm font-medium text-red-500/70 hover:text-red-400 hover:bg-red-500/10 transition-all"
        >
          <LogOut className="h-4 w-4 shrink-0" />
          Sign Out
        </button>
        <div className="px-4 pt-2 text-[10px] text-neutral-700 text-center">
          v2.0.0 · Secured Portal
        </div>
      </div>
    </div>
  )
}
