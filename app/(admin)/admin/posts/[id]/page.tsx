"use client"

import { useEffect, useState } from "react"
import { useRouter, useParams } from "next/navigation"
import { PostForm } from "@/components/admin/PostForm"

export default function EditPostPage() {
  const router = useRouter()
  const params = useParams()
  const id = params.id as string

  const [post, setPost] = useState<any>(null)
  const [fetching, setFetching] = useState(true)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchPost() {
      try {
        const res = await fetch(`/api/posts/${id}`)
        const json = await res.json()
        if (json.success) {
          setPost(json.data)
        } else {
          setError(json.error || "Failed to load post data")
        }
      } catch (err) {
        setError("Error loading post data.")
      } finally {
        setFetching(false)
      }
    }
    if (id) fetchPost()
  }, [id])

  const handleSubmit = async (data: any) => {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch(`/api/posts/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })
      const json = await res.json()
      if (json.success) {
        router.push("/admin/posts")
        router.refresh()
      } else {
        setError(json.error || "Failed to update post")
      }
    } catch (err) {
      setError("An unexpected error occurred.")
    } finally {
      setLoading(false)
    }
  }

  if (fetching) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center">
        <div className="flex flex-col items-center gap-2">
          <div className="w-8 h-8 border-4 border-brand border-t-transparent rounded-full animate-spin" />
          <p className="text-sm text-neutral-500">Loading article data...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Edit Post</h2>
          <p className="text-sm text-neutral-500 dark:text-neutral-400">
            Modify the content, tags, or settings of this article.
          </p>
        </div>
      </div>

      {error && (
        <div className="p-4 rounded-lg bg-red-950/50 border border-red-900/50 text-red-400 text-sm">
          {error}
        </div>
      )}

      {post && <PostForm initialData={post} onSubmit={handleSubmit} loading={loading} />}
    </div>
  )
}
