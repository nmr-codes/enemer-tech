"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import {
  FileText,
  FolderGit2,
  Mail,
  Users,
  Plus,
  ArrowRight,
  TrendingUp,
  MessageSquare,
} from "lucide-react"
import { StatsCard } from "@/components/admin/StatsCard"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

interface DashboardData {
  stats: {
    totalPosts: number
    publishedPosts: number
    draftPosts: number
    totalProjects: number
    unreadMessages: number
    totalViews: number
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

export default function AdminDashboard() {
  const [data, setData] = useState<DashboardData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchDashboard() {
      try {
        const res = await fetch("/api/analytics")
        if (!res.ok) {
          throw new Error("Failed to load dashboard data.")
        }
        const json = await res.json()
        if (json.success) {
          setData(json.data)
        } else {
          setError(json.error || "Failed to load dashboard data.")
        }
      } catch (err) {
        setError(
          "Could not connect to the database. Make sure you set the correct DATABASE_URL inside your .env file, run database migrations (npx prisma db push), and seed the database."
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
        <div className="flex items-center justify-between">
          <div className="h-8 bg-neutral-200 dark:bg-neutral-800 w-48 rounded" />
          <div className="h-10 bg-neutral-200 dark:bg-neutral-800 w-36 rounded" />
        </div>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-32 bg-neutral-200 dark:bg-neutral-800 rounded" />
          ))}
        </div>
        <div className="grid gap-6 md:grid-cols-2">
          <div className="h-96 bg-neutral-200 dark:bg-neutral-800 rounded" />
          <div className="h-96 bg-neutral-200 dark:bg-neutral-800 rounded" />
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="space-y-6">
        <h2 className="text-3xl font-bold tracking-tight">Overview</h2>
        <div className="p-6 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-600 dark:text-amber-400 max-w-2xl">
          <h3 className="text-lg font-semibold mb-2">Database Connection Setup Required</h3>
          <p className="text-sm leading-relaxed mb-4">{error}</p>
          <div className="flex gap-4">
            <Link href="/admin/settings">
              <Button variant="outline" className="border-amber-500/30 text-amber-600 dark:text-amber-400 hover:bg-amber-500/20">
                Go to Settings
              </Button>
            </Link>
          </div>
        </div>
      </div>
    )
  }

  const stats = data?.stats || {
    totalPosts: 0,
    publishedPosts: 0,
    draftPosts: 0,
    totalProjects: 0,
    unreadMessages: 0,
    totalViews: 0,
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Overview</h2>
          <p className="text-neutral-500 dark:text-neutral-400">
            Welcome back! Here is what's happening on your website.
          </p>
        </div>
        <div className="flex gap-3">
          <Link href="/admin/posts/new">
            <Button className="bg-brand hover:bg-brand-hover text-white flex items-center gap-2">
              <Plus className="h-4 w-4" /> New Post
            </Button>
          </Link>
          <Link href="/admin/projects/new">
            <Button variant="outline" className="border-neutral-200 dark:border-neutral-800 flex items-center gap-2">
              <Plus className="h-4 w-4" /> New Project
            </Button>
          </Link>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title="Total Posts"
          value={stats.totalPosts}
          description={`${stats.publishedPosts} published · ${stats.draftPosts} drafts`}
          icon={FileText}
        />
        <StatsCard
          title="Total Projects"
          value={stats.totalProjects}
          description="Case studies in portfolio"
          icon={FolderGit2}
        />
        <StatsCard
          title="Unread Messages"
          value={stats.unreadMessages}
          description="Awaiting response"
          icon={Mail}
          className={stats.unreadMessages > 0 ? "border-amber-500/50 bg-amber-500/5 dark:bg-amber-500/5" : ""}
        />
        <StatsCard
          title="Total Page Views"
          value={stats.totalViews}
          description="In the last 30 days"
          icon={Users}
        />
      </div>

      {/* Tables Row */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Recent Messages */}
        <Card className="border-neutral-200 dark:border-neutral-800 bg-background dark:bg-neutral-900">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg font-semibold flex items-center gap-2">
              <MessageSquare className="h-5 w-5 text-brand" /> Recent Messages
            </CardTitle>
            <Link href="/admin/messages">
              <Button variant="ghost" size="sm" className="text-xs hover:text-brand">
                View all <ArrowRight className="h-3 w-3 ml-1" />
              </Button>
            </Link>
          </CardHeader>
          <CardContent>
            {data?.recentMessages && data.recentMessages.length > 0 ? (
              <div className="space-y-4">
                {data.recentMessages.map((msg) => (
                  <div
                    key={msg.id}
                    className="flex items-start justify-between p-3 rounded-lg bg-neutral-50 dark:bg-neutral-900 border border-neutral-100 dark:border-neutral-800"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-sm">{msg.name}</span>
                        {msg.status === "UNREAD" && (
                          <Badge variant="destructive" className="text-[10px] px-1.5 py-0 bg-red-600 hover:bg-red-500">NEW</Badge>
                        )}
                      </div>
                      <p className="text-xs text-neutral-500 dark:text-neutral-400 line-clamp-1">
                        {msg.subject || "(No Subject)"}
                      </p>
                    </div>
                    <span className="text-[10px] text-neutral-400">
                      {new Date(msg.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-neutral-500 dark:text-neutral-400 text-center py-6">
                No messages received yet.
              </p>
            )}
          </CardContent>
        </Card>

        {/* Top Posts */}
        <Card className="border-neutral-200 dark:border-neutral-800 bg-background dark:bg-neutral-900">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg font-semibold flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-brand" /> Most Viewed Posts
            </CardTitle>
            <Link href="/admin/posts">
              <Button variant="ghost" size="sm" className="text-xs hover:text-brand">
                View all <ArrowRight className="h-3 w-3 ml-1" />
              </Button>
            </Link>
          </CardHeader>
          <CardContent>
            {data?.topPosts && data.topPosts.length > 0 ? (
              <div className="space-y-4">
                {data.topPosts.map((post) => (
                  <div
                    key={post.id}
                    className="flex items-center justify-between p-3 rounded-lg bg-neutral-50 dark:bg-neutral-900 border border-neutral-100 dark:border-neutral-800"
                  >
                    <div className="space-y-1 max-w-[70%]">
                      <p className="font-semibold text-sm truncate">{post.title}</p>
                      <span className="text-[10px] text-neutral-400 block">/blog/{post.slug}</span>
                    </div>
                    <div className="text-right">
                      <span className="text-sm font-bold text-brand">{post.views}</span>
                      <span className="text-[10px] text-neutral-400 block">views</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-neutral-500 dark:text-neutral-400 text-center py-6">
                No published blog posts yet.
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
