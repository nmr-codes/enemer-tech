"use client"

import { useState, useEffect } from "react"
import { usePathname } from "next/navigation"
import { AdminSidebar } from "@/components/admin/AdminSidebar"
import { AdminHeader } from "@/components/admin/AdminHeader"
import { X } from "lucide-react"

interface AdminLayoutProps {
  children: React.ReactNode
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [unreadMessages, setUnreadMessages] = useState(0)
  const pathname = usePathname()

  // Fetch unread message count for sidebar badge
  useEffect(() => {
    if (pathname === "/admin/login") return
    fetch("/api/messages?countOnly=true")
      .then((r) => r.json())
      .then((json) => {
        if (json.success) setUnreadMessages(json.unreadCount ?? 0)
      })
      .catch(() => {})
  }, [pathname])

  if (pathname === "/admin/login") {
    return <div className="min-h-screen bg-[#030712]">{children}</div>
  }

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-[#060b18] text-neutral-900 dark:text-neutral-100 flex">
      {/* Desktop Sidebar */}
      <div className="hidden lg:block shrink-0 h-screen sticky top-0 shadow-xl">
        <AdminSidebar unreadMessages={unreadMessages} />
      </div>

      {/* Mobile Sidebar Overlay */}
      <div
        className={`fixed inset-0 z-50 lg:hidden transition-all duration-300 ${
          sidebarOpen ? "visible" : "invisible"
        }`}
      >
        {/* Backdrop */}
        <div
          className={`absolute inset-0 bg-black/70 backdrop-blur-sm transition-opacity duration-300 ${
            sidebarOpen ? "opacity-100" : "opacity-0"
          }`}
          onClick={() => setSidebarOpen(false)}
        />

        {/* Drawer */}
        <div
          className={`relative flex flex-col w-64 max-w-xs h-full shadow-2xl transition-transform duration-300 ease-out ${
            sidebarOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          {/* Close button */}
          <button
            onClick={() => setSidebarOpen(false)}
            className="absolute top-4 right-4 z-10 p-1.5 rounded-lg bg-white/10 text-neutral-300 hover:text-white hover:bg-white/20 transition-colors"
            aria-label="Close menu"
          >
            <X className="h-4 w-4" />
          </button>
          <AdminSidebar onClose={() => setSidebarOpen(false)} unreadMessages={unreadMessages} />
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 min-h-screen">
        <AdminHeader onMenuClick={() => setSidebarOpen(true)} />
        <main className="flex-1 p-5 md:p-8 overflow-y-auto max-w-7xl w-full mx-auto">
          {children}
        </main>
      </div>
    </div>
  )
}
