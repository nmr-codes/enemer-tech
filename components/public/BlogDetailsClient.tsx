"use client"

import { useState, useEffect, useRef } from "react"
import { useLanguage } from "@/context/LanguageContext"
import { Badge } from "@/components/ui/badge"
import { Calendar, Clock, Eye, ArrowLeft, ChevronDown, Type, Languages, ZoomIn, X } from "lucide-react"
import { ShareButtons } from "@/components/public/ShareButtons"
import { TableOfContents } from "@/components/public/TableOfContents"
import Link from "next/link"

interface Tag {
  id: string
  name: string
  nameUz: string | null
  slug: string
  color: string | null
}

interface PostTag {
  tag: Tag
}

interface Post {
  id: string
  title: string
  titleUz: string | null
  slug: string
  excerpt: string | null
  excerptUz: string | null
  content: string
  contentUz: string | null
  coverImage: string | null
  readingTime: number | null
  publishedAt: Date | null
  views: number
  tags: PostTag[]
}

interface BlogDetailsClientProps {
  post: Post
  settings: Record<string, string>
}

type FontSize = "sm" | "base" | "lg" | "xl"

export function BlogDetailsClient({ post, settings }: BlogDetailsClientProps) {
  const { t, locale } = useLanguage()
  
  // Read local storage settings for user preferences
  const [readLocale, setReadLocale] = useState<"en" | "uz">("en")
  const [fontSize, setFontSize] = useState<FontSize>("base")
  const [scrollProgress, setScrollProgress] = useState(0)
  const [activeImage, setActiveImage] = useState<string | null>(null)
  const [langDropdownOpen, setLangDropdownOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  // Initialize reading preference to user locale, fallback to post language if translation is missing
  useEffect(() => {
    if (locale === "uz" && post.contentUz) {
      setReadLocale("uz")
    } else {
      setReadLocale("en")
    }
  }, [locale, post])

  // Click outside listener for language dropdown
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setLangDropdownOpen(false)
      }
    }
    document.addEventListener("mousedown", handleOutsideClick)
    return () => document.removeEventListener("mousedown", handleOutsideClick)
  }, [])

  // Calculate scroll progress percentage of reading content
  useEffect(() => {
    const handleScroll = () => {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight
      const progress = totalHeight > 0 ? (window.scrollY / totalHeight) * 100 : 0
      setScrollProgress(progress)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const currentTitle = readLocale === "uz" && post.titleUz ? post.titleUz : post.title
  const currentContent = readLocale === "uz" && post.contentUz ? post.contentUz : post.content
  const currentExcerpt = readLocale === "uz" && post.excerptUz ? post.excerptUz : post.excerpt

  // Dynamic code blocks utilities (Copy buttons)
  useEffect(() => {
    const preBlocks = document.querySelectorAll(".editor-content-area pre")
    preBlocks.forEach((pre) => {
      if (pre.querySelector(".copy-code-btn")) return

      pre.classList.add("relative", "group")

      const btn = document.createElement("button")
      btn.className = "copy-code-btn absolute top-3 right-3 p-1.5 rounded-md bg-neutral-900/80 hover:bg-neutral-800 text-neutral-300 hover:text-white transition-opacity duration-200 border border-neutral-700/30 flex items-center gap-1.5 text-xs font-sans select-none pointer-events-auto md:opacity-0 group-hover:opacity-100 focus:opacity-100"
      btn.innerHTML = `<svg class="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg> Copy`

      btn.addEventListener("click", async () => {
        const code = pre.querySelector("code")
        const text = code ? code.innerText : pre.textContent || ""
        try {
          await navigator.clipboard.writeText(text)
          btn.innerHTML = `<svg class="h-3.5 w-3.5 text-emerald-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg> Copied!`
          btn.classList.add("bg-emerald-950/20", "border-emerald-500/30")
          setTimeout(() => {
            btn.innerHTML = `<svg class="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg> Copy`
            btn.classList.remove("bg-emerald-950/20", "border-emerald-500/30")
          }, 2000)
        } catch (err) {
          console.error("Failed to copy code block:", err)
        }
      })

      pre.appendChild(btn)
    })
  }, [currentContent])

  // Attach Lightbox event listeners to body images
  useEffect(() => {
    const images = document.querySelectorAll(".editor-content-area img")
    const handlers: (() => void)[] = []

    images.forEach((img) => {
      img.classList.add("cursor-zoom-in")
      const handler = () => {
        const src = img.getAttribute("src")
        if (src) setActiveImage(src)
      }
      img.addEventListener("click", handler)
      handlers.push(handler)
    })

    return () => {
      images.forEach((img, i) => {
        if (handlers[i]) img.removeEventListener("click", handlers[i])
      })
    }
  }, [currentContent])

  const publishedDateText = post.publishedAt
    ? new Date(post.publishedAt).toLocaleDateString(readLocale === "uz" ? "uz-UZ" : "en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
      })
    : ""

  // Typography font size mappings
  const fontSizeClasses = {
    sm: "text-sm sm:text-base leading-relaxed",
    base: "text-base sm:text-lg leading-relaxed",
    lg: "text-lg sm:text-xl leading-relaxed",
    xl: "text-xl sm:text-2xl leading-relaxed",
  }

  const tags = post.tags.map((pt) => pt.tag)
  const defaultAvatar = "https://res.cloudinary.com/dbm1t4hlc/image/upload/v1700000000/avatar_placeholder.png"
  const authorAvatar = settings.profile_photo || defaultAvatar
  const authorBio = readLocale === "uz" ? settings.about_content_uz : settings.about_content_en

  return (
    <div className="relative min-h-screen">
      {/* Scroll Progress Bar */}
      <div 
        className="fixed top-0 left-0 right-0 z-50 h-[3px] bg-brand origin-left transition-transform duration-100"
        style={{ transform: `scaleX(${scrollProgress / 100})` }}
      />

      {/* Lightbox Modal */}
      {activeImage && (
        <div 
          className="fixed inset-0 bg-black/95 backdrop-blur-md z-50 flex items-center justify-center p-4 transition-all duration-300 cursor-zoom-out"
          onClick={() => setActiveImage(null)}
        >
          <button 
            className="absolute top-4 right-4 p-2.5 rounded-full bg-neutral-900/80 hover:bg-neutral-800 text-white transition-colors"
            onClick={(e) => {
              e.stopPropagation()
              setActiveImage(null)
            }}
          >
            <X className="h-5 w-5" />
          </button>
          
          <img 
            src={activeImage} 
            alt="Expanded blog image view" 
            className="max-h-[85vh] max-w-full object-contain rounded-xl shadow-2xl animate-[scaleIn_0.2s_ease]"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}

      {/* Floating TOC on Large Screen (Medium style) */}
      <aside className="xl:block hidden fixed top-40 left-[calc(50%+23rem)] w-60 border-l border-neutral-100 dark:border-neutral-900 pl-6 space-y-8 py-2">
        <TableOfContents content={currentContent} />
        <div className="border-t border-neutral-100 dark:border-neutral-900 pt-6">
          <ShareButtons title={currentTitle} slug={post.slug} />
        </div>
      </aside>

      {/* Main Single Column Reading Area (Medium style) */}
      <article className="max-w-2xl mx-auto space-y-8 px-4 py-8">
        <div>
          <Link 
            href="/blog" 
            className="text-sm font-semibold text-neutral-500 hover:text-brand flex items-center gap-1.5 w-max transition-colors"
          >
            <ArrowLeft className="h-4 w-4" /> {t("nav.blog")}
          </Link>
        </div>

        {/* Blog Post Header Info */}
        <div className="space-y-6">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-neutral-900 dark:text-white leading-tight">
            {currentTitle}
          </h1>

          {/* Medium-style Author bar */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-y border-neutral-100 dark:border-neutral-900/80 py-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full overflow-hidden border border-neutral-200 dark:border-neutral-800 bg-neutral-100 dark:bg-neutral-950 shrink-0">
                <img src={authorAvatar} alt="Abdurasul Nematxonov" className="h-full w-full object-cover" />
              </div>
              <div>
                <span className="font-bold text-sm text-neutral-900 dark:text-white block hover:text-brand transition-colors">
                  Abdurasul Nematxonov
                </span>
                <div className="flex flex-wrap items-center gap-2 text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
                  <span>{publishedDateText}</span>
                  <span>•</span>
                  <span className="flex items-center gap-0.5"><Clock className="h-3.5 w-3.5 inline" /> {post.readingTime || 3} min read</span>
                  <span>•</span>
                  <span className="flex items-center gap-0.5"><Eye className="h-3.5 w-3.5 inline" /> {post.views}</span>
                </div>
              </div>
            </div>

            {/* Reading preferences toolbar */}
            <div className="flex items-center justify-between md:justify-start gap-3 w-full md:w-auto">
              {/* Language Switcher Dropdown */}
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setLangDropdownOpen(!langDropdownOpen)}
                  className="flex items-center gap-1 text-xs font-semibold px-2.5 py-1.5 rounded-lg border border-neutral-200 dark:border-neutral-850 hover:bg-neutral-50 dark:hover:bg-neutral-900 transition-colors"
                  title="Switch Reading Language"
                >
                  <Languages className="h-3.5 w-3.5 text-neutral-500" />
                  <span>{readLocale.toUpperCase()}</span>
                  <ChevronDown className="h-3 w-3 text-neutral-400" />
                </button>

                {langDropdownOpen && (
                  <div className="absolute right-0 mt-1.5 w-40 rounded-xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-lg py-1.5 z-20 animate-in fade-in slide-in-from-top-1 duration-150">
                    <button
                      onClick={() => {
                        setReadLocale("en")
                        setLangDropdownOpen(false)
                      }}
                      className={`w-full px-3 py-1.5 text-left text-xs font-semibold flex items-center justify-between hover:bg-neutral-50 dark:hover:bg-neutral-850 transition-colors ${readLocale === "en" ? "text-brand" : "text-neutral-700 dark:text-neutral-300"}`}
                    >
                      <span>English (EN)</span>
                      {readLocale === "en" && <span className="h-1.5 w-1.5 rounded-full bg-brand" />}
                    </button>
                    
                    <button
                      onClick={() => {
                        if (post.contentUz) {
                          setReadLocale("uz")
                        }
                        setLangDropdownOpen(false)
                      }}
                      disabled={!post.contentUz}
                      className={`w-full px-3 py-1.5 text-left text-xs font-semibold flex items-center justify-between hover:bg-neutral-50 dark:hover:bg-neutral-850 transition-colors ${!post.contentUz ? "opacity-40 cursor-not-allowed" : readLocale === "uz" ? "text-brand" : "text-neutral-700 dark:text-neutral-300"}`}
                      title={!post.contentUz ? "Uzbek translation not available" : ""}
                    >
                      <span>O'zbekcha (UZ)</span>
                      {readLocale === "uz" ? (
                        <span className="h-1.5 w-1.5 rounded-full bg-brand" />
                      ) : !post.contentUz ? (
                        <span className="text-[9px] font-normal text-neutral-450 dark:text-neutral-500">N/A</span>
                      ) : null}
                    </button>
                  </div>
                )}
              </div>

              {/* Font Size Selector */}
              <div className="flex items-center gap-1 bg-neutral-100/50 dark:bg-neutral-900/50 rounded-lg p-0.5 border border-neutral-200/50 dark:border-neutral-800/50">
                <button
                  onClick={() => setFontSize("sm")}
                  className={`p-1.5 rounded-md text-xs font-bold transition-all ${fontSize === "sm" ? "bg-white dark:bg-neutral-800 text-brand shadow-sm scale-95" : "text-neutral-500 hover:text-neutral-750 dark:hover:text-white"}`}
                  title="Small text size"
                >
                  <Type className="h-3 w-3" />
                </button>
                <button
                  onClick={() => setFontSize("base")}
                  className={`p-1.5 rounded-md text-xs font-bold transition-all ${fontSize === "base" ? "bg-white dark:bg-neutral-800 text-brand shadow-sm scale-95" : "text-neutral-500 hover:text-neutral-750 dark:hover:text-white"}`}
                  title="Medium/Base text size"
                >
                  <Type className="h-3.5 w-3.5" />
                </button>
                <button
                  onClick={() => setFontSize("lg")}
                  className={`p-1.5 rounded-md text-xs font-bold transition-all ${fontSize === "lg" ? "bg-white dark:bg-neutral-800 text-brand shadow-sm scale-95" : "text-neutral-500 hover:text-neutral-750 dark:hover:text-white"}`}
                  title="Large text size"
                >
                  <Type className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Cover Image */}
        {post.coverImage && (
          <div 
            className="aspect-[16/9] w-full rounded-2xl overflow-hidden border border-neutral-200 dark:border-neutral-800 bg-neutral-100 dark:bg-neutral-900 shadow-sm relative group cursor-zoom-in"
            onClick={() => setActiveImage(post.coverImage)}
          >
            <img src={post.coverImage} alt={currentTitle} className="w-full h-full object-cover group-hover:scale-[1.01] transition-transform duration-300" />
            <div className="absolute inset-0 bg-black/35 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity duration-300">
              <span className="bg-neutral-900/80 backdrop-blur-sm text-white px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5">
                <ZoomIn className="h-4 w-4" /> Click to Expand
              </span>
            </div>
          </div>
        )}

        {/* Collapsible Mobile/Tablet Table of Contents */}
        {currentContent && /<h(2|3)[^>]*>([\s\S]*?)<\/h\1>/gi.test(currentContent) && (
          <div className="xl:hidden border border-neutral-200 dark:border-neutral-850 rounded-2xl p-5 bg-neutral-50/50 dark:bg-neutral-900/10">
            <TableOfContents content={currentContent} />
          </div>
        )}

        {/* Main Content Area */}
        <div className={`prose dark:prose-invert max-w-none text-neutral-800 dark:text-neutral-200 editor-content-area ${fontSizeClasses[fontSize]}`}>
          <div dangerouslySetInnerHTML={{ __html: currentContent }} />
        </div>

        {/* Related Tags */}
        {tags.length > 0 && (
          <div className="flex flex-wrap gap-2 pt-6 border-t border-neutral-100 dark:border-neutral-900/80">
            {tags.map((tag) => (
              <Badge
                key={tag.id}
                variant="outline"
                style={{ borderColor: tag.color || "#005fe8", color: tag.color || "#005fe8" }}
                className="px-3 py-1 rounded-full text-xs font-semibold"
              >
                {locale === "uz" && tag.nameUz ? tag.nameUz : tag.name}
              </Badge>
            ))}
          </div>
        )}

        {/* Bottom Bar for sharing on smaller screens */}
        <div className="xl:hidden border-t border-neutral-100 dark:border-neutral-900 pt-6">
          <ShareButtons title={currentTitle} slug={post.slug} />
        </div>

        {/* Author Bio Card Footer */}
        <div className="mt-12 p-6 rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900/30 flex flex-col sm:flex-row items-center sm:items-start gap-4">
          <div className="h-16 w-16 rounded-full overflow-hidden border border-neutral-200 dark:border-neutral-800 bg-neutral-100 dark:bg-neutral-950 shrink-0">
            <img src={authorAvatar} alt="Abdurasul Nematxonov" className="h-full w-full object-cover" />
          </div>
          <div className="space-y-2 text-center sm:text-left">
            <h4 className="font-bold text-base text-neutral-900 dark:text-white">
              {readLocale === "uz" ? "Muallif: Abdurasul Nematxonov" : "Written by Abdurasul Nematxonov"}
            </h4>
            {authorBio ? (
              <div 
                className="text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed max-w-md"
                dangerouslySetInnerHTML={{ __html: authorBio }}
              />
            ) : (
              <p className="text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed max-w-md">
                {readLocale === "uz" 
                  ? "Dasturiy ta'minot muhandisi va startap asoschisi. Veb-texnologiyalar, toza kod va tizim arxitekturasi bo'yicha yozadi."
                  : "Software engineer and startup builder. Writing about web systems, clean code, and software architecture."}
              </p>
            )}
          </div>
        </div>
      </article>
    </div>
  )
}
