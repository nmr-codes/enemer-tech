"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { ImageUpload } from "@/components/admin/ImageUpload"
import { PostEditor } from "@/components/admin/PostEditor"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger } from "@/components/ui/dialog"
import { generateSlug } from "@/lib/utils"
import { Plus } from "lucide-react"

interface Tag {
  id: string
  name: string
  nameUz: string | null
  slug: string
  color: string | null
}

interface PostFormProps {
  initialData?: {
    id?: string
    title: string
    titleUz: string | null
    slug: string
    excerpt: string | null
    excerptUz: string | null
    content: string
    contentUz: string | null
    coverImage: string | null
    status: "DRAFT" | "PUBLISHED" | "ARCHIVED"
    featured: boolean
    publishedAt: string | null
    tags?: { id: string }[]
  } | null
  onSubmit: (data: any) => Promise<void>
  loading: boolean
}

export function PostForm({ initialData, onSubmit, loading }: PostFormProps) {
  const router = useRouter()
  
  const [title, setTitle] = useState(initialData?.title || "")
  const [titleUz, setTitleUz] = useState(initialData?.titleUz || "")
  const [slug, setSlug] = useState(initialData?.slug || "")
  const [excerpt, setExcerpt] = useState(initialData?.excerpt || "")
  const [excerptUz, setExcerptUz] = useState(initialData?.excerptUz || "")
  const [content, setContent] = useState(initialData?.content || "")
  const [contentUz, setContentUz] = useState(initialData?.contentUz || "")
  const [coverImage, setCoverImage] = useState(initialData?.coverImage || "")
  const [status, setStatus] = useState<"DRAFT" | "PUBLISHED" | "ARCHIVED">(initialData?.status || "DRAFT")
  const [featured, setFeatured] = useState(initialData?.featured || false)
  const [publishedAt, setPublishedAt] = useState(() => {
    if (!initialData?.publishedAt) return ""
    const date = new Date(initialData.publishedAt)
    return date.toISOString().slice(0, 16)
  })
  
  const [tagIds, setTagIds] = useState<string[]>(() => {
    if (initialData?.tags) {
      return initialData.tags.map((t) => t.id)
    }
    return []
  })

  const [tags, setTags] = useState<Tag[]>([])
  const [tagsLoading, setTagsLoading] = useState(true)

  const [newTagName, setNewTagName] = useState("")
  const [newTagNameUz, setNewTagNameUz] = useState("")
  const [newTagColor, setNewTagColor] = useState("#005fe8")
  const [tagCreating, setTagCreating] = useState(false)
  const [dialogOpen, setDialogOpen] = useState(false)

  useEffect(() => {
    async function fetchTags() {
      try {
        const res = await fetch("/api/tags")
        const json = await res.json()
        if (json.success) {
          setTags(json.data)
        }
      } catch (err) {
        console.error(err)
      } finally {
        setTagsLoading(false)
      }
    }
    fetchTags()
  }, [])

  const handleTitleChange = (val: string) => {
    setTitle(val)
    if (!initialData) {
      setSlug(generateSlug(val))
    }
  }

  const toggleTag = (id: string) => {
    setTagIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    )
  }

  const handleCreateTag = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newTagName) return
    setTagCreating(true)

    try {
      const res = await fetch("/api/tags", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: newTagName,
          nameUz: newTagNameUz || null,
          slug: generateSlug(newTagName),
          color: newTagColor,
        }),
      })

      const json = await res.json()
      if (json.success) {
        setTags((prev) => [...prev, json.data])
        setTagIds((prev) => [...prev, json.data.id])
        setNewTagName("")
        setNewTagNameUz("")
        setNewTagColor("#005fe8")
        setDialogOpen(false)
      } else {
        alert(json.error || "Failed to create tag")
      }
    } catch (err) {
      alert("Error occurred while creating tag")
    } finally {
      setTagCreating(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const payload = {
      title,
      titleUz: titleUz || null,
      slug: slug || generateSlug(title),
      excerpt: excerpt || null,
      excerptUz: excerptUz || null,
      content,
      contentUz: contentUz || null,
      coverImage: coverImage || null,
      status,
      featured,
      publishedAt: publishedAt ? new Date(publishedAt).toISOString() : null,
      tagIds,
    }
    await onSubmit(payload)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <div className="space-y-2">
            <Label className="text-sm font-medium">Cover Image</Label>
            <ImageUpload value={coverImage} onChange={setCoverImage} folder="posts" />
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="title">Title (English)</Label>
              <Input
                id="title"
                required
                value={title}
                onChange={(e) => handleTitleChange(e.target.value)}
                placeholder="Enter English title"
                className="bg-background dark:bg-neutral-900 border-neutral-200 dark:border-neutral-800"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="titleUz">Title (Uzbek)</Label>
              <Input
                id="titleUz"
                value={titleUz}
                onChange={(e) => setTitleUz(e.target.value)}
                placeholder="Sarlavhani kiriting"
                className="bg-background dark:bg-neutral-900 border-neutral-200 dark:border-neutral-800"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="slug">Slug / URL path</Label>
            <Input
              id="slug"
              required
              value={slug}
              onChange={(e) => setSlug(generateSlug(e.target.value))}
              placeholder="post-url-slug"
              className="bg-background dark:bg-neutral-900 border-neutral-200 dark:border-neutral-800"
            />
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="excerpt">Excerpt (English)</Label>
              <Textarea
                id="excerpt"
                rows={3}
                value={excerpt}
                onChange={(e) => setExcerpt(e.target.value)}
                placeholder="Enter a brief English summary..."
                className="bg-background dark:bg-neutral-900 border-neutral-200 dark:border-neutral-800 resize-none"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="excerptUz">Excerpt (Uzbek)</Label>
              <Textarea
                id="excerptUz"
                rows={3}
                value={excerptUz}
                onChange={(e) => setExcerptUz(e.target.value)}
                placeholder="Qisqacha o'zbekcha tavsif kiriting..."
                className="bg-background dark:bg-neutral-900 border-neutral-200 dark:border-neutral-800 resize-none"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Content (English)</Label>
            <PostEditor content={content} onChange={setContent} />
          </div>

          <div className="space-y-2">
            <Label>Content (Uzbek)</Label>
            <PostEditor content={contentUz} onChange={setContentUz} />
          </div>
        </div>

        <div className="space-y-6">
          <div className="p-6 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-background dark:bg-neutral-900 space-y-6 shadow-sm">
            <h3 className="font-semibold text-lg border-b border-neutral-100 dark:border-neutral-800 pb-2">Publish Settings</h3>
            
            <div className="space-y-2">
              <Label htmlFor="status">Post Status</Label>
              <Select value={status} onValueChange={(val: any) => setStatus(val)}>
                <SelectTrigger className="bg-background dark:bg-neutral-900 border-neutral-200 dark:border-neutral-800">
                  <SelectValue placeholder="Select Status" />
                </SelectTrigger>
                <SelectContent className="bg-background dark:bg-neutral-900 border-neutral-250 dark:border-neutral-850">
                  <SelectItem value="DRAFT">Draft</SelectItem>
                  <SelectItem value="PUBLISHED">Published</SelectItem>
                  <SelectItem value="ARCHIVED">Archived</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="publishedAt">Publish Date/Time</Label>
              <Input
                id="publishedAt"
                type="datetime-local"
                value={publishedAt}
                onChange={(e) => setPublishedAt(e.target.value)}
                className="bg-background dark:bg-neutral-900 border-neutral-200 dark:border-neutral-800 text-neutral-700 dark:text-neutral-300"
              />
              <p className="text-xs text-neutral-400">Defaults to now if left empty during publication.</p>
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-neutral-100 dark:border-neutral-800">
              <div className="space-y-0.5">
                <Label htmlFor="featured" className="text-sm font-medium">Featured Post</Label>
                <p className="text-xs text-neutral-400">Show in landing sections</p>
              </div>
              <Switch id="featured" checked={featured} onCheckedChange={setFeatured} />
            </div>
          </div>

          <div className="p-6 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-background dark:bg-neutral-900 space-y-4 shadow-sm">
            <div className="flex items-center justify-between border-b border-neutral-100 dark:border-neutral-800 pb-2">
              <h3 className="font-semibold text-lg">Tags</h3>
              
              <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                <DialogTrigger render={<Button variant="ghost" size="icon" className="h-8 w-8 hover:text-brand" />}>
                  <Plus className="h-4 w-4" />
                </DialogTrigger>
                <DialogContent className="bg-background dark:bg-neutral-900 border-neutral-200 dark:border-neutral-800 text-neutral-900 dark:text-neutral-100">
                  <DialogHeader>
                    <DialogTitle>Create New Tag</DialogTitle>
                  </DialogHeader>
                  <form onSubmit={handleCreateTag} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="newTagName">Tag Name (English)</Label>
                      <Input
                        id="newTagName"
                        required
                        value={newTagName}
                        onChange={(e) => setNewTagName(e.target.value)}
                        placeholder="e.g. NextJS"
                        className="bg-background dark:bg-neutral-900 border-neutral-200 dark:border-neutral-800"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="newTagNameUz">Tag Name (Uzbek)</Label>
                      <Input
                        id="newTagNameUz"
                        value={newTagNameUz}
                        onChange={(e) => setNewTagNameUz(e.target.value)}
                        placeholder="e.g. NextJS"
                        className="bg-background dark:bg-neutral-900 border-neutral-200 dark:border-neutral-800"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="newTagColor">Hex Color Badge</Label>
                      <div className="flex gap-2">
                        <Input
                          id="newTagColor"
                          type="color"
                          value={newTagColor}
                          onChange={(e) => setNewTagColor(e.target.value)}
                          className="h-10 w-16 p-1 border-neutral-200 dark:border-neutral-800 bg-transparent"
                        />
                        <Input
                          type="text"
                          value={newTagColor}
                          onChange={(e) => setNewTagColor(e.target.value)}
                          placeholder="#005fe8"
                          pattern="^#([A-Fa-f0-9]{6})$"
                          className="flex-1 bg-background dark:bg-neutral-900 border-neutral-200 dark:border-neutral-800"
                        />
                      </div>
                    </div>
                    <DialogFooter>
                      <Button type="submit" disabled={tagCreating} className="bg-brand hover:bg-brand-hover text-white w-full">
                        {tagCreating ? "Creating..." : "Save Tag"}
                      </Button>
                    </DialogFooter>
                  </form>
                </DialogContent>
              </Dialog>
            </div>

            {tagsLoading ? (
              <p className="text-sm text-neutral-400 animate-pulse">Loading tags...</p>
            ) : tags.length === 0 ? (
              <p className="text-sm text-neutral-400">No tags created yet.</p>
            ) : (
              <div className="flex flex-wrap gap-2 max-h-60 overflow-y-auto">
                {tags.map((tag) => {
                  const selected = tagIds.includes(tag.id)
                  return (
                    <button
                      key={tag.id}
                      type="button"
                      onClick={() => toggleTag(tag.id)}
                      style={{
                        backgroundColor: selected ? tag.color || "#005fe8" : "transparent",
                        borderColor: tag.color || "#005fe8",
                        color: selected ? "#fff" : tag.color || "#005fe8",
                      }}
                      className="px-3 py-1 rounded-full text-xs font-semibold border transition-all hover:opacity-90"
                    >
                      {tag.name}
                    </button>
                  )
                })}
              </div>
            )}
          </div>

          <div className="flex flex-col gap-3">
            <Button
              type="submit"
              disabled={loading}
              className="bg-brand hover:bg-brand-hover text-white font-medium py-2.5 w-full rounded-lg"
            >
              {loading ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Saving post...
                </div>
              ) : (
                "Save Article"
              )}
            </Button>
            <Button
              type="button"
              variant="outline"
              disabled={loading}
              onClick={() => router.push("/admin/posts")}
              className="border-neutral-200 dark:border-neutral-800 w-full"
            >
              Cancel
            </Button>
          </div>
        </div>
      </div>
    </form>
  )
}
