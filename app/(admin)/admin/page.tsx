"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useSession } from "next-auth/react"
import {
  FileText,
  FolderGit2,
  Mail,
  Users,
  Plus,
  ArrowRight,
  TrendingUp,
  MessageSquare,
  Sparkles,
  Clock,
  Eye,
  Activity,
  Layers,
} from "lucide-react"
import { StatsCard } from "@/components/admin/StatsCard"

interface DashboardData {
  stats: {
    totalPosts: number
    publishedPosts: number
    draftPosts: number
    totalProjects: number
    unreadMessages: number
    totalViews: number
    uniqueVisitors: number
  }
  recentMessages: Array<{
    id: string
    name: string
    email: string
    subject: string
    createdAt: string
    status: string
  }>
  topPosts: Array<{
    id: string
    title: string
    slug: string
    views: number
    status: string
  }>
}

function getGreeting() {
  const hour = new Date().getHours()
  if (hour < 12) return "Good morning"
  if (hour < 17) return "Good afternoon"
  return "Good evening"
}

function QuickActionCard({
  href,
  icon: Icon,
  label,
  sub,
  color,
}: {
  href: string
  icon: React.ElementType
  label: string
  sub: string
  color: string
}) {
  return (
    <Link href={href}>
      <div
        className="group relative rounded-2xl p-5 border border-neutral-200 dark:border-white/[0.06] bg-white dark:bg-neutral-900 hover:-translate-y-1 transition-all duration-300 cursor-pointer overflow-hidden"
        style={{ boxShadow: "0 1px 3px rgba(0,0,0,0.04)" }}
        onMouseEnter={(e) => {
          ;(e.currentTarget as HTMLDivElement).style.boxShadow = "0 8px 24px rgba(0,0,0,0.08)"
        }}
        onMouseLeave={(e) => {
          ;(e.currentTarget as HTMLDivElement).style.boxShadow = "0 1px 3px rgba(0,0,0,0.04)"
        }}
      >
        <div
          className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
          style={{ background: `radial-gradient(ellipse at 0% 0%, ${color}10, transparent 70%)` }}
        />
        <div className="relative z-10 flex items-center gap-4">
          <div
            className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform duration-300"
            style={{ background: `${color}15` }}
          >
            <Icon className="h-5 w-5" style={{ color }} />
          </div>
          <div>
            <p className="font-semibold text-sm text-neutral-900 dark:text-white">{label}</p>
            <p className="text-xs text-neutral-400 mt-0.5">{sub}</p>
          </div>
          <ArrowRight className="h-4 w-4 text-neutral-300 dark:text-neutral-700 ml-auto group-hover:translate-x-1 group-hover:text-blue-400 transition-all" />
        </div>
      </div>
    </Link>
  )
}

export default function AdminDashboard() {
  const { data: session } = useSession()
  const [data, setData] = useState<DashboardData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const firstName = session?.user?.name?.split(" ")[0] || "Admin"

  useEffect(() => {
    async function fetchDashboard() {
      try {
        const res = await fetch("/api/analytics")
        if (!res.ok) throw new Error("Failed to load dashboard data.")
        const json = await res.json()
        if (json.success) {
          setData(json.data)
        } else {
          setError(json.error || "Failed to load dashboard data.")
        }
      } catch {
        setError(
          "Could not connect to the database. Make sure DATABASE_URL is correct and run: npx prisma db push"
        )
      } finally {
        setLoading(false)
      }
    }
    fetchDashboard()
  }, [])

  if (loading) {
    return (
      <div className="space-y-8 animate-pulse">
        <div className="h-24 bg-neutral-100 dark:bg-neutral-800/50 rounded-2xl" />
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-32 bg-neutral-100 dark:bg-neutral-800/50 rounded-2xl" />
          ))}
        </div>
        <div className="grid gap-5 md:grid-cols-3">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-16 bg-neutral-100 dark:bg-neutral-800/50 rounded-2xl" />
          ))}
        </div>
        <div className="grid gap-5 md:grid-cols-2">
          <div className="h-80 bg-neutral-100 dark:bg-neutral-800/50 rounded-2xl" />
          <div className="h-80 bg-neutral-100 dark:bg-neutral-800/50 rounded-2xl" />
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="space-y-6">
        <h2 className="text-2xl font-bold tracking-tight">Dashboard</h2>
        <div className="p-6 rounded-2xl bg-amber-500/8 border border-amber-500/20 text-amber-600 dark:text-amber-400 max-w-2xl">
          <div className="flex items-start gap-3">
            <Activity className="h-5 w-5 shrink-0 mt-0.5" />
            <div>
              <h3 className="text-base font-semibold mb-1">Database Setup Required</h3>
              <p className="text-sm leading-relaxed mb-4 opacity-80">{error}</p>
              <Link
                href="/admin/settings"
                className="inline-flex items-center gap-1.5 text-sm font-semibold border border-amber-500/30 px-4 py-2 rounded-xl hover:bg-amber-500/10 transition-colors"
              >
                Go to Settings <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    )
  }

  const stats = data?.stats || {
    totalPosts: 0, publishedPosts: 0, draftPosts: 0,
    totalProjects: 0, unreadMessages: 0, totalViews: 0, uniqueVisitors: 0,
  }

  return (
    <div className="space-y-8">

      {/* ── Welcome Banner ────────────────────────────────────── */}
      <div
        className="relative rounded-2xl p-6 md:p-8 overflow-hidden bg-white dark:bg-[#0a1628] border border-neutral-200 dark:border-white/[0.08] shadow-sm dark:shadow-[0_4px_32px_rgba(0,95,232,0.08)]"
      >
        {/* Glows */}
        <div className="absolute top-0 right-0 w-64 h-64 rounded-full bg-blue-600/15 blur-[60px] pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 w-40 h-40 rounded-full bg-sky-400/10 blur-[50px] pointer-events-none" />
        {/* Grid */}
        <div
          className="absolute inset-0 opacity-[0.03] dark:opacity-[0.05]"
          style={{
            backgroundImage:
              "linear-gradient(currentColor 1px, transparent 1px), linear-gradient(90deg, currentColor 1px, transparent 1px)",
            backgroundSize: "32px 32px",
          }}
        />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2 mb-1">
              <Sparkles className="h-4 w-4 text-yellow-400" />
              <span className="text-[11px] font-semibold text-neutral-400 uppercase tracking-widest">
                {getGreeting()}
              </span>
            </div>
            <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight text-neutral-900 dark:text-white">
              Welcome back, {firstName} 👋
            </h2>
            <p className="text-sm text-neutral-500 dark:text-neutral-400">
              Here's what's happening on your website today.
            </p>
          </div>
          <div className="flex gap-2.5">
            <Link href="/admin/posts/new">
              <button
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-white transition-all hover:scale-[1.02] active:scale-[0.99]"
                style={{
                  background: "linear-gradient(135deg, #005fe8, #0080ff)",
                  boxShadow: "0 4px 16px rgba(0,95,232,0.35)",
                }}
              >
                <Plus className="h-4 w-4" /> New Post
              </button>
            </Link>
            <Link href="/admin/projects/new">
              <button className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-neutral-700 dark:text-neutral-300 bg-neutral-100 dark:bg-white/8 border border-neutral-200 dark:border-white/10 hover:bg-neutral-200 dark:hover:bg-white/12 transition-all hover:scale-[1.02]">
                <Plus className="h-4 w-4" /> New Project
              </button>
            </Link>
          </div>
        </div>
      </div>

      {/* ── KPI Stats ─────────────────────────────────────────── */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
        <StatsCard
          title="Total Posts"
          value={stats.totalPosts}
          description={`${stats.publishedPosts} published · ${stats.draftPosts} drafts`}
          icon={FileText}
          iconColor="#005fe8"
          iconBg="rgba(0,95,232,0.1)"
        />
        <StatsCard
          title="Total Projects"
          value={stats.totalProjects}
          description="Portfolio case studies"
          icon={FolderGit2}
          iconColor="#8b5cf6"
          iconBg="rgba(139,92,246,0.1)"
        />
        <StatsCard
          title="Unread Messages"
          value={stats.unreadMessages}
          description="Awaiting your response"
          icon={Mail}
          iconColor={stats.unreadMessages > 0 ? "#f59e0b" : "#6b7280"}
          iconBg={stats.unreadMessages > 0 ? "rgba(245,158,11,0.12)" : "rgba(107,114,128,0.1)"}
        />
        <StatsCard
          title="Page Views"
          value={stats.totalViews}
          description="All-time page loads"
          icon={Eye}
          iconColor="#10b981"
          iconBg="rgba(16,185,129,0.1)"
        />
        <StatsCard
          title="Unique Visitors"
          value={stats.uniqueVisitors}
          description="Distinct individuals"
          icon={Users}
          iconColor="#ec4899"
          iconBg="rgba(236,72,153,0.1)"
        />
      </div>

      {/* ── Quick Actions ──────────────────────────────────────── */}
      <div>
        <h3 className="text-xs font-bold uppercase tracking-widest text-neutral-400 mb-3">
          Quick Actions
        </h3>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          <QuickActionCard
            href="/admin/posts/new"
            icon={FileText}
            label="Write a new post"
            sub="Create & publish blog content"
            color="#005fe8"
          />
          <QuickActionCard
            href="/admin/projects/new"
            icon={Layers}
            label="Add a project"
            sub="Showcase your work"
            color="#8b5cf6"
          />
          <QuickActionCard
            href="/admin/messages"
            icon={MessageSquare}
            label="Check messages"
            sub={stats.unreadMessages > 0 ? `${stats.unreadMessages} unread message${stats.unreadMessages > 1 ? "s" : ""}` : "No unread messages"}
            color="#f59e0b"
          />
        </div>
      </div>

      {/* ── Tables ────────────────────────────────────────────── */}
      <div className="grid gap-5 md:grid-cols-2">
        {/* Recent Messages */}
        <div className="rounded-2xl border border-neutral-200 dark:border-white/[0.06] bg-white dark:bg-neutral-900 overflow-hidden">
          <div
            className="flex items-center justify-between px-5 py-4"
            style={{ borderBottom: "1px solid rgba(0,0,0,0.05)" }}
          >
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-blue-500/10 flex items-center justify-center">
                <MessageSquare className="h-3.5 w-3.5 text-blue-500" />
              </div>
              <span className="font-semibold text-sm text-neutral-900 dark:text-white">Recent Messages</span>
            </div>
            <Link
              href="/admin/messages"
              className="text-xs font-semibold text-blue-500 hover:text-blue-400 flex items-center gap-1 transition-colors"
            >
              View all <ArrowRight className="h-3 w-3" />
            </Link>
          </div>
          <div className="p-3">
            {data?.recentMessages && data.recentMessages.length > 0 ? (
              <div className="space-y-1.5">
                {data.recentMessages.map((msg) => (
                  <Link
                    href="/admin/messages"
                    key={msg.id}
                    className="flex items-center justify-between p-3 rounded-xl hover:bg-neutral-50 dark:hover:bg-white/[0.04] transition-colors group"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white text-xs font-bold shrink-0">
                        {msg.name.charAt(0).toUpperCase()}
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-sm text-neutral-900 dark:text-white truncate">
                            {msg.name}
                          </span>
                          {msg.status === "UNREAD" && (
                            <span className="text-[9px] font-bold bg-red-500 text-white px-1.5 py-0.5 rounded-full shrink-0">
                              NEW
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-neutral-400 truncate">
                          {msg.subject || "(No subject)"}
                        </p>
                      </div>
                    </div>
                    <span className="text-[10px] text-neutral-400 shrink-0 ml-2">
                      {new Date(msg.createdAt).toLocaleDateString()}
                    </span>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="py-10 text-center">
                <MessageSquare className="h-8 w-8 text-neutral-300 dark:text-neutral-700 mx-auto mb-2" />
                <p className="text-sm text-neutral-400">No messages yet</p>
              </div>
            )}
          </div>
        </div>

        {/* Most Viewed Posts */}
        <div className="rounded-2xl border border-neutral-200 dark:border-white/[0.06] bg-white dark:bg-neutral-900 overflow-hidden">
          <div
            className="flex items-center justify-between px-5 py-4"
            style={{ borderBottom: "1px solid rgba(0,0,0,0.05)" }}
          >
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-emerald-500/10 flex items-center justify-center">
                <TrendingUp className="h-3.5 w-3.5 text-emerald-500" />
              </div>
              <span className="font-semibold text-sm text-neutral-900 dark:text-white">Top Posts</span>
            </div>
            <Link
              href="/admin/posts"
              className="text-xs font-semibold text-blue-500 hover:text-blue-400 flex items-center gap-1 transition-colors"
            >
              View all <ArrowRight className="h-3 w-3" />
            </Link>
          </div>
          <div className="p-3">
            {data?.topPosts && data.topPosts.length > 0 ? (
              <div className="space-y-1.5">
                {data.topPosts.map((post, i) => (
                  <div
                    key={post.id}
                    className="flex items-center justify-between p-3 rounded-xl hover:bg-neutral-50 dark:hover:bg-white/[0.04] transition-colors"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <span className="w-6 h-6 rounded-lg bg-neutral-100 dark:bg-neutral-800 text-xs font-bold text-neutral-500 dark:text-neutral-400 flex items-center justify-center shrink-0">
                        {i + 1}
                      </span>
                      <div className="min-w-0">
                        <p className="font-medium text-sm text-neutral-900 dark:text-white truncate">
                          {post.title}
                        </p>
                        <span className="text-[10px] text-neutral-400">/blog/{post.slug}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-1 ml-2 shrink-0">
                      <Eye className="h-3 w-3 text-neutral-400" />
                      <span className="text-sm font-bold text-neutral-900 dark:text-white">
                        {post.views.toLocaleString()}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-10 text-center">
                <TrendingUp className="h-8 w-8 text-neutral-300 dark:text-neutral-700 mx-auto mb-2" />
                <p className="text-sm text-neutral-400">No published posts yet</p>
              </div>
            )}
          </div>
        </div>
      </div>

    </div>
  )
}
