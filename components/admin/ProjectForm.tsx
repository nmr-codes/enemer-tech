"use client"

import React, { useState } from "react"
import { useRouter } from "next/navigation"
import { ImageUpload } from "@/components/admin/ImageUpload"
import { MultiImageUpload } from "@/components/admin/MultiImageUpload"
import { PostEditor } from "@/components/admin/PostEditor"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { generateSlug } from "@/lib/utils"

export const TECH_STACK_OPTIONS = [
  "Python", "TypeScript", "JavaScript", "Go", "Rust",
  "FastAPI", "Django", "Next.js", "React", "Astro",
  "PostgreSQL", "MongoDB", "Redis", "SQLite",
  "Docker", "Kubernetes", "AWS", "Vercel", "Railway",
  "Telegram Bot", "Aiogram", "Celery",
  "scikit-learn", "PyTorch", "TensorFlow",
  "Prisma", "SQLAlchemy", "Pydantic",
]

interface ProjectFormProps {
  initialData?: {
    id?: string
    title: string
    titleUz: string | null
    slug: string
    description: string
    descriptionUz: string | null
    content: string | null
    coverImage: string | null
    images: string[]
    techStack: string[]
    githubUrl: string | null
    liveUrl: string | null
    status: "IN_PROGRESS" | "COMPLETED" | "ARCHIVED"
    featured: boolean
    order: number
    startDate: string | null
    endDate: string | null
  } | null
  onSubmit: (data: any) => Promise<void>
  loading: boolean
}

export function ProjectForm({ initialData, onSubmit, loading }: ProjectFormProps) {
  const router = useRouter()

  const [title, setTitle] = useState(initialData?.title || "")
  const [titleUz, setTitleUz] = useState(initialData?.titleUz || "")
  const [slug, setSlug] = useState(initialData?.slug || "")
  const [description, setDescription] = useState(initialData?.description || "")
  const [descriptionUz, setDescriptionUz] = useState(initialData?.descriptionUz || "")
  const [content, setContent] = useState(initialData?.content || "")
  const [coverImage, setCoverImage] = useState(initialData?.coverImage || "")
  const [images, setImages] = useState<string[]>(initialData?.images || [])
  const [techStack, setTechStack] = useState<string[]>(initialData?.techStack || [])
  const [githubUrl, setGithubUrl] = useState(initialData?.githubUrl || "")
  const [liveUrl, setLiveUrl] = useState(initialData?.liveUrl || "")
  const [status, setStatus] = useState<"IN_PROGRESS" | "COMPLETED" | "ARCHIVED">(initialData?.status || "COMPLETED")
  const [featured, setFeatured] = useState(initialData?.featured || false)
  const [order, setOrder] = useState(initialData?.order || 0)
  
  const [startDate, setStartDate] = useState(() => {
    if (!initialData?.startDate) return ""
    return new Date(initialData.startDate).toISOString().slice(0, 10)
  })
  
  const [endDate, setEndDate] = useState(() => {
    if (!initialData?.endDate) return ""
    return new Date(initialData.endDate).toISOString().slice(0, 10)
  })

  const toggleTech = (tech: string) => {
    setTechStack((prev) =>
      prev.includes(tech) ? prev.filter((t) => t !== tech) : [...prev, tech]
    )
  }

  const handleTitleChange = (val: string) => {
    setTitle(val)
    if (!initialData) {
      setSlug(generateSlug(val))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const payload = {
      title,
      titleUz: titleUz || null,
      slug: slug || generateSlug(title),
      description,
      descriptionUz: descriptionUz || null,
      content: content || null,
      coverImage: coverImage || null,
      images,
      techStack,
      githubUrl: githubUrl || null,
      liveUrl: liveUrl || null,
      status,
      featured,
      order: Number(order),
      startDate: startDate ? new Date(startDate).toISOString() : null,
      endDate: endDate ? new Date(endDate).toISOString() : null,
    }
    await onSubmit(payload)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <div className="space-y-2">
            <Label className="text-sm font-medium">Cover Image</Label>
            <ImageUpload value={coverImage} onChange={setCoverImage} folder="projects" />
          </div>

          <div className="space-y-2">
            <Label className="text-sm font-medium">Project Screenshots (max 6)</Label>
            <MultiImageUpload value={images} onChange={setImages} maxFiles={6} />
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="title">Project Title (English)</Label>
              <Input
                id="title"
                required
                value={title}
                onChange={(e) => handleTitleChange(e.target.value)}
                placeholder="e.g. Chatbot platform"
                className="bg-background dark:bg-neutral-900 border-neutral-200 dark:border-neutral-800"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="titleUz">Project Title (Uzbek)</Label>
              <Input
                id="titleUz"
                value={titleUz}
                onChange={(e) => setTitleUz(e.target.value)}
                placeholder="e.g. Chatbot platformasi"
                className="bg-background dark:bg-neutral-900 border-neutral-200 dark:border-neutral-800"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="slug">Slug</Label>
            <Input
              id="slug"
              required
              value={slug}
              onChange={(e) => setSlug(generateSlug(e.target.value))}
              placeholder="project-slug"
              className="bg-background dark:bg-neutral-900 border-neutral-200 dark:border-neutral-800"
            />
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="description">Short Description (English)</Label>
              <Textarea
                id="description"
                required
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="English summary..."
                className="bg-background dark:bg-neutral-900 border-neutral-200 dark:border-neutral-800 resize-none"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="descriptionUz">Short Description (Uzbek)</Label>
              <Textarea
                id="descriptionUz"
                rows={3}
                value={descriptionUz}
                onChange={(e) => setDescriptionUz(e.target.value)}
                placeholder="O'zbekcha tavsif..."
                className="bg-background dark:bg-neutral-900 border-neutral-200 dark:border-neutral-800 resize-none"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Detailed Case Study (Rich Text, Optional)</Label>
            <PostEditor content={content} onChange={setContent} />
          </div>
        </div>

        <div className="space-y-6">
          <div className="p-6 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-background dark:bg-neutral-900 space-y-6 shadow-sm">
            <h3 className="font-semibold text-lg border-b border-neutral-100 dark:border-neutral-800 pb-2">Project Settings</h3>

            <div className="space-y-2">
              <Label htmlFor="status">Project Status</Label>
              <Select value={status} onValueChange={(val: any) => setStatus(val)}>
                <SelectTrigger className="bg-background dark:bg-neutral-900 border-neutral-200 dark:border-neutral-800">
                  <SelectValue placeholder="Select Status" />
                </SelectTrigger>
                <SelectContent className="bg-background dark:bg-neutral-900 border-neutral-200 dark:border-neutral-800">
                  <SelectItem value="IN_PROGRESS">🔨 In Progress</SelectItem>
                  <SelectItem value="COMPLETED">✓ Completed</SelectItem>
                  <SelectItem value="ARCHIVED">Archived</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-4 grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="startDate">Start Date</Label>
                <Input
                  id="startDate"
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="bg-background dark:bg-neutral-900 border-neutral-200 dark:border-neutral-800 text-neutral-700 dark:text-neutral-355"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="endDate">End Date</Label>
                <Input
                  id="endDate"
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="bg-background dark:bg-neutral-900 border-neutral-200 dark:border-neutral-800 text-neutral-700 dark:text-neutral-355"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="order">Display Order</Label>
              <Input
                id="order"
                type="number"
                value={order}
                onChange={(e) => setOrder(Number(e.target.value))}
                placeholder="0"
                className="bg-background dark:bg-neutral-900 border-neutral-200 dark:border-neutral-800"
              />
              <p className="text-xs text-neutral-400">Lower numbers appear first on lists.</p>
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-neutral-100 dark:border-neutral-800">
              <div className="space-y-0.5">
                <Label htmlFor="featured" className="text-sm font-medium">Featured Project</Label>
                <p className="text-xs text-neutral-400">Show on landing page</p>
              </div>
              <Switch id="featured" checked={featured} onCheckedChange={setFeatured} />
            </div>
          </div>

          <div className="p-6 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-background dark:bg-neutral-900 space-y-4 shadow-sm">
            <h3 className="font-semibold text-lg border-b border-neutral-100 dark:border-neutral-800 pb-2">Links</h3>

            <div className="space-y-2">
              <Label htmlFor="githubUrl">GitHub Repository URL</Label>
              <Input
                id="githubUrl"
                type="url"
                value={githubUrl}
                onChange={(e) => setGithubUrl(e.target.value)}
                placeholder="https://github.com/..."
                className="bg-background dark:bg-neutral-900 border-neutral-200 dark:border-neutral-800"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="liveUrl">Live Demo URL</Label>
              <Input
                id="liveUrl"
                type="url"
                value={liveUrl}
                onChange={(e) => setLiveUrl(e.target.value)}
                placeholder="https://..."
                className="bg-background dark:bg-neutral-900 border-neutral-200 dark:border-neutral-800"
              />
            </div>
          </div>

          <div className="p-6 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-background dark:bg-neutral-900 space-y-4 shadow-sm">
            <h3 className="font-semibold text-lg border-b border-neutral-100 dark:border-neutral-800 pb-2">Tech Stack</h3>
            <div className="grid grid-cols-2 gap-2 max-h-60 overflow-y-auto pt-1">
              {TECH_STACK_OPTIONS.map((tech) => {
                const selected = techStack.includes(tech)
                return (
                  <button
                    key={tech}
                    type="button"
                    onClick={() => toggleTech(tech)}
                    className={`px-2 py-1.5 text-xs font-semibold text-left border rounded-lg transition-all ${
                      selected
                        ? "bg-brand/10 border-brand text-brand"
                        : "border-neutral-200 dark:border-neutral-800 text-neutral-500 hover:bg-neutral-50 dark:hover:bg-neutral-950"
                    }`}
                  >
                    {tech}
                  </button>
                )
              })}
            </div>
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
                  Saving project...
                </div>
              ) : (
                "Save Project"
              )}
            </Button>
            <Button
              type="button"
              variant="outline"
              disabled={loading}
              onClick={() => router.push("/admin/projects")}
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
