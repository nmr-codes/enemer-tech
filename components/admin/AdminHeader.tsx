"use client"

import { useState, useEffect } from "react"
import { usePathname } from "next/navigation"
import { Menu, Bell, LogOut, ExternalLink, ChevronDown, User } from "lucide-react"
import { useSession, signOut } from "next-auth/react"
import { ThemeToggle } from "@/components/shared/ThemeToggle"

const routeLabels: Record<string, string> = {
  "/admin": "Dashboard",
  "/admin/posts": "Posts",
  "/admin/posts/new": "New Post",
  "/admin/projects": "Projects",
  "/admin/projects/new": "New Project",
  "/admin/messages": "Messages",
  "/admin/visitors": "Visitors",
  "/admin/settings": "Settings",
}

function getPageTitle(pathname: string): string {
  if (routeLabels[pathname]) return routeLabels[pathname]
  if (pathname.startsWith("/admin/posts/") && pathname.includes("/edit")) return "Edit Post"
  if (pathname.startsWith("/admin/projects/") && pathname.includes("/edit")) return "Edit Project"
  if (pathname.startsWith("/admin/posts/")) return "Post Detail"
  if (pathname.startsWith("/admin/projects/")) return "Project Detail"
  return "Admin"
}

interface AdminHeaderProps {
  onMenuClick: () => void
}

export function AdminHeader({ onMenuClick }: AdminHeaderProps) {
  const { data: session } = useSession()
  const pathname = usePathname()
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  const pageTitle = getPageTitle(pathname)

  const userInitials = session?.user?.name
    ? session.user.name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)
    : "AN"

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 8)
    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  // Close dropdown on outside click
  useEffect(() => {
    if (!dropdownOpen) return
    const close = () => setDropdownOpen(false)
    document.addEventListener("mousedown", close)
    return () => document.removeEventListener("mousedown", close)
  }, [dropdownOpen])

  return (
    <header
      className={`h-16 px-5 flex items-center justify-between sticky top-0 z-30 transition-all duration-200 ${
        scrolled
          ? "border-b border-neutral-200 dark:border-white/[0.06] bg-white/80 dark:bg-neutral-950/80 backdrop-blur-xl shadow-sm"
          : "border-b border-neutral-200 dark:border-white/[0.04] bg-white dark:bg-neutral-950"
      }`}
    >
      {/* Left: menu + page title */}
      <div className="flex items-center gap-3">
        <button
          id="admin-menu-toggle"
          onClick={onMenuClick}
          className="lg:hidden p-2 rounded-lg hover:bg-neutral-100 dark:hover:bg-white/5 text-neutral-500 dark:text-neutral-400 transition-colors"
          aria-label="Open menu"
        >
          <Menu className="h-5 w-5" />
        </button>

        <div>
          <h1 className="text-base font-bold text-neutral-900 dark:text-white tracking-tight">
            {pageTitle}
          </h1>
          <p className="text-[10px] text-neutral-400 hidden sm:block">
            {new Date().toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })}
          </p>
        </div>
      </div>

      {/* Right: actions */}
      <div className="flex items-center gap-2">
        <ThemeToggle />

        {/* Notification bell (decorative for now) */}
        <button
          className="relative p-2 rounded-lg hover:bg-neutral-100 dark:hover:bg-white/5 text-neutral-500 dark:text-neutral-400 transition-colors"
          aria-label="Notifications"
        >
          <Bell className="h-4.5 w-4.5 h-[18px] w-[18px]" />
        </button>

        <div className="h-5 w-px bg-neutral-200 dark:bg-white/10 mx-1" />

        {/* User avatar + dropdown */}
        <div className="relative">
          <button
            id="admin-user-menu"
            onClick={(e) => { e.stopPropagation(); setDropdownOpen(!dropdownOpen) }}
            className="flex items-center gap-2.5 px-2.5 py-1.5 rounded-xl hover:bg-neutral-100 dark:hover:bg-white/5 transition-colors group"
          >
            <div
              className="w-8 h-8 rounded-xl flex items-center justify-center text-white text-xs font-bold shrink-0"
              style={{
                background: "radial-gradient(circle at 35% 35%, #60a5fa, #005fe8 50%, #003fa0)",
                boxShadow: "0 0 12px rgba(0,95,232,0.3)",
              }}
            >
              {userInitials}
            </div>
            <span className="text-sm font-medium text-neutral-700 dark:text-neutral-300 hidden md:inline-block max-w-[120px] truncate">
              {session?.user?.name || "Admin"}
            </span>
            <ChevronDown className={`h-3.5 w-3.5 text-neutral-400 transition-transform hidden md:block ${dropdownOpen ? "rotate-180" : ""}`} />
          </button>

          {/* Dropdown */}
          {dropdownOpen && (
            <div
              className="absolute right-0 top-full mt-2 w-52 rounded-xl overflow-hidden shadow-xl z-50"
              style={{
                background: "rgba(10,15,30,0.95)",
                border: "1px solid rgba(255,255,255,0.08)",
                backdropFilter: "blur(20px)",
              }}
              onMouseDown={(e) => e.stopPropagation()}
            >
              {/* User info */}
              <div className="px-4 py-3 border-b border-white/8">
                <p className="text-sm font-semibold text-white truncate">
                  {session?.user?.name || "Abdurasul"}
                </p>
                <p className="text-[11px] text-neutral-500 truncate mt-0.5">
                  {session?.user?.email || ""}
                </p>
              </div>

              {/* Actions */}
              <div className="p-1.5">
                <a
                  href="/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2.5 w-full px-3 py-2 rounded-lg text-sm text-neutral-400 hover:text-white hover:bg-white/5 transition-colors"
                >
                  <ExternalLink className="h-3.5 w-3.5" />
                  View Public Site
                </a>
                <button
                  onClick={() => signOut({ callbackUrl: "/admin/login" })}
                  className="flex items-center gap-2.5 w-full px-3 py-2 rounded-lg text-sm text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-colors mt-0.5"
                >
                  <LogOut className="h-3.5 w-3.5" />
                  Sign Out
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}
