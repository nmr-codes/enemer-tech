"use client"

import { signOut } from "next-auth/react"
import Link from "next/link"
import { LogOut, Mail, User as UserIcon, CalendarDays, ShieldCheck, Settings } from "lucide-react"

interface ProfileClientProps {
  user: {
    name: string | null
    email: string
    image: string | null
    role: string
    createdAt: Date
    accounts: string[]
  }
}

export function ProfileClient({ user }: ProfileClientProps) {
  const getInitials = () => {
    if (user.name) return user.name.charAt(0).toUpperCase()
    return user.email.charAt(0).toUpperCase()
  }

  return (
    <div className="w-full max-w-xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-white/[0.06] rounded-3xl p-8 shadow-xl shadow-brand/5 relative overflow-hidden">
      {/* Background Decorative Blob */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-brand/5 dark:bg-brand/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3 pointer-events-none" />

      <div className="relative z-10 flex flex-col items-center text-center">
        {/* Avatar */}
        <div className="w-28 h-28 rounded-full bg-blue-50 dark:bg-blue-500/10 flex items-center justify-center shrink-0 overflow-hidden ring-4 ring-white dark:ring-neutral-950 shadow-md mb-5">
          {user.image ? (
            <img src={user.image} alt={user.name || "Profile"} className="w-full h-full object-cover" />
          ) : (
            <span className="text-4xl font-bold text-brand">{getInitials()}</span>
          )}
        </div>

        {/* User Info */}
        <h1 className="text-2xl font-bold text-neutral-900 dark:text-white flex items-center gap-2">
          {user.name || "Enemer User"}
          {user.role === "ADMIN" && (
            <ShieldCheck className="w-5 h-5 text-brand" title="Admin User" />
          )}
        </h1>
        <p className="text-neutral-500 dark:text-neutral-400 mt-1 flex items-center justify-center gap-1.5">
          <Mail className="w-4 h-4" />
          {user.email}
        </p>

        {/* Role Badge */}
        <div className="mt-6 mb-8 flex items-center justify-center gap-3 w-full border-y border-neutral-100 dark:border-white/[0.05] py-4">
          <div className="flex flex-col items-center w-1/2 border-r border-neutral-100 dark:border-white/[0.05]">
            <span className="text-xs font-semibold text-neutral-400 tracking-wider uppercase mb-1">Status</span>
            <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest ${
              user.role === "ADMIN"
                ? "bg-brand/10 text-brand border border-brand/20"
                : "bg-emerald-500/10 text-emerald-500 border border-emerald-500/20"
            }`}>
              {user.role}
            </span>
          </div>
          <div className="flex flex-col items-center w-1/2">
            <span className="text-xs font-semibold text-neutral-400 tracking-wider uppercase mb-1">Joined</span>
            <div className="flex items-center gap-1.5 text-sm font-medium text-neutral-700 dark:text-neutral-300">
              <CalendarDays className="w-4 h-4" />
              {new Date(user.createdAt).toLocaleDateString("en-US", { month: "long", year: "numeric" })}
            </div>
          </div>
        </div>

        {/* Auth Connections */}
        <div className="w-full text-left mb-8">
          <h3 className="text-sm font-semibold text-neutral-900 dark:text-white mb-3 px-1">Linked Accounts</h3>
          <div className="flex flex-wrap gap-2">
            {user.accounts.length > 0 ? (
              user.accounts.map(provider => (
                <div key={provider} className="flex items-center gap-2 px-4 py-2 rounded-xl bg-neutral-50 dark:bg-white/[0.02] border border-neutral-200 dark:border-white/[0.05] capitalize text-sm font-medium text-neutral-700 dark:text-neutral-300">
                  <UserIcon className="w-4 h-4" />
                  {provider}
                </div>
              ))
            ) : (
              <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-neutral-50 dark:bg-white/[0.02] border border-neutral-200 dark:border-white/[0.05] text-sm font-medium text-neutral-700 dark:text-neutral-300">
                <Mail className="w-4 h-4" />
                Magic Link (Email)
              </div>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="w-full flex flex-col sm:flex-row gap-3">
          <Link
            href="/profile/settings"
            className="flex-1 flex items-center justify-center gap-2 px-6 py-3.5 bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 text-neutral-900 dark:text-white font-bold rounded-xl transition-all"
          >
            <Settings className="w-5 h-5" />
            Edit Profile
          </Link>
          <button
            onClick={() => signOut({ callbackUrl: "/" })}
            className="flex-1 flex items-center justify-center gap-2 px-6 py-3.5 bg-red-500 hover:bg-red-600 text-white font-bold rounded-xl transition-all shadow-[0_4px_14px_rgba(239,68,68,0.3)] hover:shadow-[0_6px_20px_rgba(239,68,68,0.4)]"
          >
            <LogOut className="w-5 h-5" />
            Sign Out
          </button>
        </div>
      </div>
    </div>
  )
}
