"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { DataTable, Column } from "@/components/admin/DataTable"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useDebounce } from "@/hooks/useDebounce"
import { Edit2, Trash2, Plus, Eye, CheckCircle2, XCircle } from "lucide-react"

interface Post {
  id: string
  title: string
  slug: string
  status: "DRAFT" | "PUBLISHED" | "ARCHIVED"
  views: number
  publishedAt: string | null
}

export default function AdminPostsPage() {
  const [posts, setPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState(true)
  const [totalCount, setTotalCount] = useState(0)
  const [currentPage, setCurrentPage] = useState(1)
  const [search, setSearch] = useState("")
  const debouncedSearch = useDebounce(search, 500)
  const pageSize = 10

  const fetchPosts = async () => {
    setLoading(true)
    try {
      const query = new URLSearchParams({
        admin: "true",
        page: currentPage.toString(),
        limit: pageSize.toString(),
        search: debouncedSearch,
      })
      const res = await fetch(`/api/posts?${query}`)
      const json = await res.json()
      if (json.success) {
        setPosts(json.data)
        setTotalCount(json.meta.total)
      }
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchPosts()
  }, [currentPage, debouncedSearch])

  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this post?")) return
    try {
      const res = await fetch(`/api/posts/${id}`, { method: "DELETE" })
      const json = await res.json()
      if (json.success) {
        setPosts(posts.filter((p) => p.id !== id))
        setTotalCount(totalCount - 1)
      } else {
        alert(json.error || "Failed to delete post")
      }
    } catch (err) {
      alert("Error occurred while deleting post")
    }
  }

  const handleToggleStatus = async (post: Post) => {
    const nextStatus = post.status === "PUBLISHED" ? "DRAFT" : "PUBLISHED"
    try {
      // 1. Fetch full details first to prevent data loss
      const detailRes = await fetch(`/api/posts/${post.id}`)
      const detailJson = await detailRes.json()
      if (!detailJson.success) {
        alert("Failed to fetch post details.")
        return
      }

      const fullPost = detailJson.data

      // 2. Perform PUT with updated status
      const res = await fetch(`/api/posts/${post.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...fullPost,
          status: nextStatus,
          tagIds: fullPost.tags ? fullPost.tags.map((t: any) => t.id) : [],
        }),
      })

      const json = await res.json()
      if (json.success) {
        setPosts(posts.map((p) => (p.id === post.id ? { ...p, status: nextStatus } : p)))
      } else {
        alert(json.error || "Failed to toggle status")
      }
    } catch (err) {
      console.error("Error toggling post status:", err)
    }
  }

  const columns: Column<Post>[] = [
    {
      header: "Title",
      accessor: (post) => (
        <div className="font-semibold text-neutral-900 dark:text-neutral-100 max-w-sm truncate">
          {post.title}
        </div>
      ),
    },
    {
      header: "Status",
      accessor: (post) => {
        const colors = {
          DRAFT: "bg-neutral-100 text-neutral-600 dark:bg-neutral-800 dark:text-neutral-400",
          PUBLISHED: "bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400",
          ARCHIVED: "bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-400",
        }
        return <Badge className={`${colors[post.status]} border-none`}>{post.status}</Badge>
      },
    },
    {
      header: "Views",
      accessor: (post) => (
        <div className="flex items-center gap-1.5 text-neutral-500 dark:text-neutral-400">
          <Eye className="h-4 w-4" /> {post.views}
        </div>
      ),
    },
    {
      header: "Published At",
      accessor: (post) => (
        <span className="text-neutral-500 dark:text-neutral-400 text-xs">
          {post.publishedAt ? new Date(post.publishedAt).toLocaleDateString() : "Draft"}
        </span>
      ),
    },
    {
      header: "Actions",
      accessor: (post) => (
        <div className="flex items-center gap-2">
          {/* Quick Publish Toggle */}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => handleToggleStatus(post)}
            className="h-8 w-8 hover:text-brand"
            title={post.status === "PUBLISHED" ? "Revert to Draft" : "Publish"}
          >
            {post.status === "PUBLISHED" ? (
              <XCircle className="h-4 w-4" />
            ) : (
              <CheckCircle2 className="h-4 w-4" />
            )}
          </Button>

          {/* Edit Button */}
          <Link href={`/admin/posts/${post.id}`}>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-neutral-500 hover:text-brand"
            >
              <Edit2 className="h-4 w-4" />
            </Button>
          </Link>

          {/* Delete Button */}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => handleDelete(post.id)}
            className="h-8 w-8 text-neutral-500 hover:text-red-500"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      ),
      className: "text-right justify-end",
    },
  ]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Blog Posts</h2>
          <p className="text-sm text-neutral-500 dark:text-neutral-400">
            Write, publish, and manage your articles.
          </p>
        </div>
        <Link href="/admin/posts/new">
          <Button className="bg-brand hover:bg-brand-hover text-white flex items-center gap-2">
            <Plus className="h-4 w-4" /> Create Post
          </Button>
        </Link>
      </div>

      <DataTable
        columns={columns}
        data={posts}
        loading={loading}
        searchValue={search}
        onSearchChange={setSearch}
        searchPlaceholder="Search posts by title..."
        currentPage={currentPage}
        totalCount={totalCount}
        pageSize={pageSize}
        onPageChange={setCurrentPage}
      />
    </div>
  )
}
