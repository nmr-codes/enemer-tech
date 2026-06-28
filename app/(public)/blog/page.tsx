"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useLanguage } from "@/context/LanguageContext"
import { useDebounce } from "@/hooks/useDebounce"
import { usePagination, DOTS } from "@/hooks/usePagination"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Search, Calendar, Clock, Eye, ChevronLeft, ChevronRight, ArrowRight } from "lucide-react"
import { TiltCard } from "@/components/shared/TiltCard"
import { PostDefaultCover } from "@/components/shared/PostDefaultCover"

interface Tag {
  id: string
  name: string
  nameUz: string | null
  slug: string
  color: string | null
}

interface Post {
  id: string
  title: string
  titleUz: string | null
  slug: string
  excerpt: string | null
  excerptUz: string | null
  coverImage: string | null
  readingTime: number | null
  publishedAt: string | null
  views: number
  tags: Tag[]
}

export default function BlogListingPage() {
  const { t, locale } = useLanguage()
  const [posts, setPosts] = useState<Post[]>([])
  const [tags, setTags] = useState<Tag[]>([])
  const [loading, setLoading] = useState(true)
  
  const [search, setSearch] = useState("")
  const debouncedSearch = useDebounce(search, 500)
  const [selectedTag, setSelectedTag] = useState("all")
  const [sortBy, setSortBy] = useState("latest")
  const [currentPage, setCurrentPage] = useState(1)
  const [totalCount, setTotalCount] = useState(0)
  const pageSize = 6

  useEffect(() => {
    async function loadTags() {
      try {
        const res = await fetch("/api/tags")
        const json = await res.json()
        if (json.success) setTags(json.data)
      } catch (err) {
        console.error(err)
      }
    }
    loadTags()
  }, [])

  useEffect(() => {
    async function loadPosts() {
      setLoading(true)
      try {
        const query = new URLSearchParams({
          page: currentPage.toString(),
          limit: pageSize.toString(),
          search: debouncedSearch,
        })
        if (selectedTag !== "all") {
          query.append("tag", selectedTag)
        }
        const res = await fetch(`/api/posts?${query}`)
        const json = await res.json()
        if (json.success) {
          const loadedPosts = json.data
          if (sortBy === "views") {
            loadedPosts.sort((a: Post, b: Post) => b.views - a.views)
          }
          setPosts(loadedPosts)
          setTotalCount(json.meta.total)
        }
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    loadPosts()
  }, [currentPage, debouncedSearch, selectedTag, sortBy])

  useEffect(() => {
    setCurrentPage(1)
  }, [debouncedSearch, selectedTag, sortBy])

  const totalPages = Math.ceil(totalCount / pageSize)
  const paginationRange = usePagination({
    currentPage,
    totalCount,
    pageSize,
  })

  return (
    <div className="space-y-12">
      <div className="space-y-2 text-center max-w-xl mx-auto">
        <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight">
          {t("blog.title")}
        </h1>
        <p className="text-sm text-neutral-500 dark:text-neutral-400">
          {t("blog.subtitle")}
        </p>
      </div>

      <div className="flex flex-col md:flex-row gap-4 justify-between items-start md:items-center">
        <div className="relative w-full md:max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400" />
          <Input
            placeholder={t("blog.search")}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 bg-background dark:bg-neutral-900 border-neutral-200 dark:border-neutral-800 focus-visible:ring-brand"
          />
        </div>

        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          <Select value={selectedTag} onValueChange={(val) => setSelectedTag(val || "all")}>
            <SelectTrigger className="w-[140px] bg-background dark:bg-neutral-900 border-neutral-200 dark:border-neutral-800">
              <SelectValue placeholder="All Tags" />
            </SelectTrigger>
            <SelectContent className="bg-background dark:bg-neutral-900 border-neutral-200 dark:border-neutral-800">
              <SelectItem value="all">All Tags</SelectItem>
              {tags.map((tag) => (
                <SelectItem key={tag.id} value={tag.slug}>
                  {locale === "uz" && tag.nameUz ? tag.nameUz : tag.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={sortBy} onValueChange={(val) => setSortBy(val || "latest")}>
            <SelectTrigger className="w-[140px] bg-background dark:bg-neutral-900 border-neutral-200 dark:border-neutral-800">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent className="bg-background dark:bg-neutral-900 border-neutral-200 dark:border-neutral-800">
              <SelectItem value="latest">Latest</SelectItem>
              <SelectItem value="views">Most Viewed</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {loading ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="animate-pulse flex flex-col space-y-4">
              <div className="aspect-video bg-neutral-200 dark:bg-neutral-800 rounded-xl" />
              <div className="h-6 bg-neutral-200 dark:bg-neutral-800 w-3/4 rounded" />
              <div className="h-4 bg-neutral-200 dark:bg-neutral-800 w-full rounded" />
              <div className="h-4 bg-neutral-200 dark:bg-neutral-800 w-1/2 rounded" />
            </div>
          ))}
        </div>
      ) : posts.length === 0 ? (
        <p className="text-center text-neutral-500 dark:text-neutral-400 py-12 w-full col-span-full">
          {t("blog.noPosts")}
        </p>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {posts.map((post) => {
            const titleText = locale === "uz" && post.titleUz ? post.titleUz : post.title
            const excerptText = locale === "uz" && post.excerptUz ? post.excerptUz : post.excerpt

            return (
              <TiltCard
                key={post.id}
                className="flex flex-col border border-neutral-200 dark:border-neutral-800 rounded-xl overflow-hidden bg-background dark:bg-neutral-900 shadow-sm group"
              >
                <div className="relative aspect-video bg-neutral-100 dark:bg-neutral-950 flex items-center justify-center border-b border-neutral-200 dark:border-neutral-800 overflow-hidden">
                  {post.coverImage ? (
                    <img src={post.coverImage} alt={titleText} className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-300" />
                  ) : (
                    <PostDefaultCover title={post.title} size="card" />
                  )}
                </div>

                <div className="p-5 flex-1 flex flex-col justify-between space-y-4 bg-background dark:bg-neutral-900">
                  <div className="space-y-2">
                    <div className="flex items-center gap-3 text-[10px] text-neutral-400">
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {post.publishedAt ? new Date(post.publishedAt).toLocaleDateString() : ""}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" /> {post.readingTime || 3} {t("blog.readTime")}
                      </span>
                      <span className="flex items-center gap-1">
                        <Eye className="h-3 w-3" /> {post.views}
                      </span>
                    </div>
                    <h2 className="font-bold text-lg text-neutral-900 dark:text-white hover:text-brand line-clamp-2 transition-colors">
                      <Link href={`/blog/${post.slug}`}>{titleText}</Link>
                    </h2>
                    <p className="text-xs text-neutral-600 dark:text-neutral-400 line-clamp-3 leading-relaxed">
                      {excerptText || "No description provided."}
                    </p>
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t border-neutral-100 dark:border-neutral-900 mt-2">
                    {post.tags && post.tags.length > 0 ? (
                      <div className="flex flex-wrap gap-1.5">
                        {post.tags.map((tag) => (
                          <Badge
                            key={tag.id}
                            variant="outline"
                            style={{ borderColor: tag.color || "#005fe8", color: tag.color || "#005fe8" }}
                            className="text-[9px] py-0 px-2 font-normal rounded-full"
                          >
                            {locale === "uz" && tag.nameUz ? tag.nameUz : tag.name}
                          </Badge>
                        ))}
                      </div>
                    ) : (
                      <div />
                    )}
                    <Link
                      href={`/blog/${post.slug}`}
                      className="text-xs font-semibold text-brand hover:text-brand-hover flex items-center gap-1 transition-colors shrink-0"
                    >
                      {t("blog.readArticle")} <ArrowRight className="h-3.5 w-3.5" />
                    </Link>
                  </div>
                </div>
              </TiltCard>
            )
          })}
        </div>
      )}

      {!loading && totalCount > pageSize && (
        <div className="flex justify-center items-center gap-1 pt-6">
          <Button
            variant="outline"
            size="icon"
            disabled={currentPage === 1}
            onClick={() => setCurrentPage(currentPage - 1)}
            className="h-9 w-9 p-0"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>

          {paginationRange?.map((pageNumber, i) => {
            if (pageNumber === DOTS) {
              return (
                <span key={i} className="px-2 text-neutral-400">
                  &#8230;
                </span>
              )
            }

            return (
              <Button
                key={i}
                variant={pageNumber === currentPage ? "default" : "outline"}
                onClick={() => setCurrentPage(pageNumber as number)}
                className={`h-9 w-9 p-0 text-xs font-semibold ${
                  pageNumber === currentPage ? "bg-brand hover:bg-brand-hover text-white border-brand" : ""
                }`}
              >
                {pageNumber}
              </Button>
            )
          })}

          <Button
            variant="outline"
            size="icon"
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage(currentPage + 1)}
            className="h-9 w-9 p-0"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      )}
    </div>
  )
}
