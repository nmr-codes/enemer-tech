"use client"

import { useEffect, useState, useRef } from "react"
import Link from "next/link"
import { useLanguage } from "@/context/LanguageContext"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Send, ArrowRight, Eye, Clock, Terminal, Cpu, Layers, Compass,
} from "lucide-react"
import { Github, Linkedin, Twitter } from "@/components/shared/SocialIcons"
import { TiltCard } from "@/components/shared/TiltCard"
import { ScrollReveal } from "@/components/shared/ScrollReveal"
import { MagneticButton } from "@/components/shared/MagneticButton"
import { CodingCharacter } from "@/components/shared/CodingCharacter"
import { PostDefaultCover } from "@/components/shared/PostDefaultCover"
import { ContactCTA3D } from "@/components/shared/ContactCTA3D"

interface Project {
  id: string; title: string; titleUz: string | null; slug: string
  description: string; descriptionUz: string | null; coverImage: string | null
  techStack: string[]; status: string
}

interface Post {
  id: string; title: string; titleUz: string | null; slug: string
  excerpt: string | null; excerptUz: string | null; readingTime: number | null
  publishedAt: string | null; views: number
}


// ── 3D Cyberpunk Head Bust Component ──────────────────────────
function HeroOrb() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const mouseRef = useRef({ x: 0, y: 0, tx: 0, ty: 0 })

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    let animationFrameId: number
    const width = (canvas.width = 280)
    const height = (canvas.height = 280)

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect()
      const cx = rect.left + rect.width / 2
      const cy = rect.top + rect.height / 2
      // Clamp between limits to prevent neck snapping
      mouseRef.current.tx = Math.max(-1.5, Math.min(1.5, (e.clientX - cx) / (rect.width / 2)))
      mouseRef.current.ty = Math.max(-1.1, Math.min(1.1, (e.clientY - cy) / (rect.height / 2)))
    }
    window.addEventListener("mousemove", handleMouseMove)

    // ── 3D Character Geometry Model ──────────────────────────────
    const scaleFactor = 62
    const baseVertices = [
      { x: 0, y: -1.2, z: 0 },       // 0: Skull top
      { x: 0.5, y: -0.85, z: 0.5 },   // 1: Forehead right
      { x: -0.5, y: -0.85, z: 0.5 },  // 2: Forehead left
      { x: 0, y: -0.7, z: 0.75 },     // 3: Forehead center
      { x: 0, y: -0.3, z: 0.95 },     // 4: Nose bridge
      { x: 0, y: 0.05, z: 1.1 },      // 5: Nose tip
      { x: 0.5, y: 0.05, z: 0.8 },    // 6: Cheek right
      { x: -0.5, y: 0.05, z: 0.8 },   // 7: Cheek left
      { x: 0, y: 0.75, z: 0.9 },      // 8: Chin
      { x: 0.48, y: 0.48, z: 0.45 },  // 9: Jaw right
      { x: -0.48, y: 0.48, z: 0.45 }, // 10: Jaw left
      { x: 0, y: -0.8, z: -0.75 },    // 11: Skull back-top
      { x: 0.55, y: -0.2, z: -0.65 }, // 12: Skull back-right
      { x: -0.55, y: -0.2, z: -0.65 },// 13: Skull back-left
      { x: 0.22, y: 0.9, z: 0.1 },    // 14: Neck right
      { x: -0.22, y: 0.9, z: 0.1 },   // 15: Neck left
      { x: 1.1, y: 1.55, z: 0.1 },    // 16: Shoulder right
      { x: -1.1, y: 1.55, z: 0.1 },   // 17: Shoulder left
      { x: 0.8, y: 1.6, z: -0.55 },   // 18: Shoulder back-right
      { x: -0.8, y: 1.6, z: -0.55 },  // 19: Shoulder back-left
    ]

    const edges = [
      // Skull & Forehead
      [0, 1], [0, 2], [0, 11], [0, 3],
      [1, 3], [2, 3], [1, 12], [2, 13], [11, 12], [11, 13],
      
      // Face front / nose
      [3, 4], [4, 5], [4, 6], [4, 7],
      [5, 6], [5, 7], [5, 8],
      
      // Cheeks & Jaw
      [6, 8], [7, 8], [6, 9], [7, 10],
      [8, 9], [8, 10], [9, 12], [10, 13],
      
      // Neck
      [9, 14], [10, 15], [8, 14], [8, 15],
      [14, 15], [12, 18], [13, 19],
      
      // Shoulders
      [14, 16], [15, 17],
      [16, 17], [16, 18], [17, 19], [18, 19],
    ]

    const FOCAL_LENGTH = 380
    const CAMERA_DIST = 260

    // ── Helper 3D rotation math ─────────────────────────────────
    const rotX = (p: { x: number; y: number; z: number }, a: number) => {
      const c = Math.cos(a), s = Math.sin(a)
      return { x: p.x, y: p.y * c - p.z * s, z: p.y * s + p.z * c }
    }
    const rotY = (p: { x: number; y: number; z: number }, a: number) => {
      const c = Math.cos(a), s = Math.sin(a)
      return { x: p.x * c - p.z * s, y: p.y, z: p.x * s + p.z * c }
    }
    const rotZ = (p: { x: number; y: number; z: number }, a: number) => {
      const c = Math.cos(a), s = Math.sin(a)
      return { x: p.x * c - p.y * s, y: p.x * s + p.y * c, z: p.z }
    }

    // ── 3D Tech Orbiting Tags ───────────────────────────────────
    const codeTags = [
      { text: "FastAPI", angle: 0, speed: 0.012, radius: 95, yOffset: -12, color: "#005fe8" },
      { text: "Next.js", angle: Math.PI * 0.65, speed: 0.009, radius: 105, yOffset: 12, color: "#6366f1" },
      { text: "Docker", angle: Math.PI * 1.35, speed: 0.014, radius: 90, yOffset: -38, color: "#06b6d4" },
    ]

    let time = 0

    const draw = () => {
      ctx.clearRect(0, 0, width, height)

      // Smooth mouse interpolation
      const mouse = mouseRef.current
      mouse.x += (mouse.tx - mouse.x) * 0.08
      mouse.y += (mouse.ty - mouse.y) * 0.08

      const isDark = document.documentElement.classList.contains("dark")

      // Breathing / floating oscillations
      time += 0.022
      const breathY = Math.sin(time) * 4.5
      const breathRoll = Math.sin(time * 0.5) * 0.025

      // Head rotations: pitch (X) and yaw (Y) track the cursor
      const headRotX = mouse.y * 0.35
      const headRotY = mouse.x * 0.45

      const projectedPoints: { x: number; y: number; z: number; valid: boolean }[] = []

      // Project all vertices
      for (let i = 0; i < baseVertices.length; i++) {
        const v = baseVertices[i]
        // Scale to pixel dimensions
        let pt = { x: v.x * scaleFactor, y: v.y * scaleFactor, z: v.z * scaleFactor }

        // Head vs Neck/Shoulder skeletal bending
        // Keep shoulders more stable while head turns
        const skeletalWeight = i < 14 ? 1.0 : 0.22
        
        // Apply local rotations
        pt = rotZ(rotY(rotX(pt, headRotX * skeletalWeight), headRotY * skeletalWeight), breathRoll * skeletalWeight)

        // Translate down slightly to center the character chest
        pt.y += 28

        // Perspective projection
        const scale = FOCAL_LENGTH / (CAMERA_DIST + pt.z)
        const sx = pt.x * scale + width / 2
        const sy = pt.y * scale + height / 2 + breathY

        projectedPoints.push({
          x: sx,
          y: sy,
          z: pt.z,
          valid: scale > 0.1 && CAMERA_DIST + pt.z > 10,
        })
      }

      // ── Draw Cyber Visor Shield ──
      // Visor coordinates map across Forehead Right (1), Forehead Left (2), Cheek Left (7), Cheek Right (6)
      const p1 = projectedPoints[1]
      const p2 = projectedPoints[2]
      const p3 = projectedPoints[7]
      const p4 = projectedPoints[6]

      if (p1?.valid && p2?.valid && p3?.valid && p4?.valid) {
        ctx.beginPath()
        ctx.moveTo(p1.x, p1.y)
        ctx.lineTo(p2.x, p2.y)
        ctx.lineTo(p3.x, p3.y)
        ctx.lineTo(p4.x, p4.y)
        ctx.closePath()

        const visorGrad = ctx.createLinearGradient(p2.x, p2.y, p1.x, p1.y)
        visorGrad.addColorStop(0, "rgba(6, 182, 212, 0.28)")
        visorGrad.addColorStop(0.5, "rgba(99, 102, 241, 0.22)")
        visorGrad.addColorStop(1, "rgba(0, 95, 232, 0.28)")
        
        ctx.fillStyle = visorGrad
        ctx.fill()
        
        ctx.strokeStyle = "rgba(6, 182, 212, 0.5)"
        ctx.lineWidth = 1
        ctx.stroke()

        // Glow laser eyes inside the visor that track the cursor
        const eyeOffsetMax = 8
        const ex = mouse.x * eyeOffsetMax
        const ey = mouse.y * (eyeOffsetMax * 0.6)

        // Draw left eye node
        const lx = (p2.x + p3.x) / 2 + ex
        const ly = (p2.y + p3.y) / 2 + ey
        ctx.beginPath()
        ctx.arc(lx, ly, 2.5, 0, Math.PI * 2)
        ctx.fillStyle = "#22d3ee"
        ctx.shadowColor = "#22d3ee"
        ctx.shadowBlur = 8
        ctx.fill()
        ctx.shadowBlur = 0 // Reset shadow

        // Draw right eye node
        const rx = (p1.x + p4.x) / 2 + ex
        const ry = (p1.y + p4.y) / 2 + ey
        ctx.beginPath()
        ctx.arc(rx, ry, 2.5, 0, Math.PI * 2)
        ctx.fillStyle = "#22d3ee"
        ctx.shadowColor = "#22d3ee"
        ctx.shadowBlur = 8
        ctx.fill()
        ctx.shadowBlur = 0 // Reset shadow
      }

      // ── Draw Wireframe Edges ──
      ctx.lineWidth = 0.95
      ctx.strokeStyle = isDark ? "rgba(0, 95, 232, 0.38)" : "rgba(0, 95, 232, 0.2)"
      
      for (const edge of edges) {
        const pt1 = projectedPoints[edge[0]]
        const pt2 = projectedPoints[edge[1]]
        
        if (pt1?.valid && pt2?.valid) {
          ctx.beginPath()
          ctx.moveTo(pt1.x, pt1.y)
          ctx.lineTo(pt2.x, pt2.y)
          ctx.stroke()
        }
      }

      // ── Draw Glowing Vertex Nodes ──
      for (let i = 0; i < projectedPoints.length; i++) {
        const pt = projectedPoints[i]
        if (pt?.valid) {
          ctx.beginPath()
          ctx.arc(pt.x, pt.y, 2, 0, Math.PI * 2)
          
          // Color nodes: shoulders are dimmer, face/head is glowing neon cyan/blue
          if (i >= 14) {
            ctx.fillStyle = isDark ? "rgba(99, 102, 241, 0.4)" : "rgba(99, 102, 241, 0.2)"
          } else {
            ctx.fillStyle = isDark ? "#3b82f6" : "#2563eb"
          }
          ctx.fill()
        }
      }

      // ── Draw Orbiting 3D Tech Tags ──
      for (const tag of codeTags) {
        tag.angle += tag.speed
        
        // Compute 3D coordinates relative to center
        const tx = Math.cos(tag.angle) * tag.radius
        const tz = Math.sin(tag.angle) * tag.radius
        const ty = tag.yOffset + 28 // Center relative to head

        // Rotate tags with the global head rotation to give unified perspective
        let tagPt = { x: tx, y: ty, z: tz }
        tagPt = rotY(rotX(tagPt, headRotX * 0.3), headRotY * 0.3)

        // Projection
        const scale = FOCAL_LENGTH / (CAMERA_DIST + tagPt.z)
        const sx = tagPt.x * scale + width / 2
        const sy = tagPt.y * scale + height / 2 + breathY

        // Depth opacity: fade tags when behind the character head
        const alpha = Math.min(1.0, Math.max(0.15, (tagPt.z + 120) / 220))

        ctx.font = "bold 9.5px monospace"
        ctx.textAlign = "center"
        ctx.textBaseline = "middle"
        ctx.fillStyle = tag.color
        ctx.globalAlpha = alpha
        ctx.fillText(tag.text, sx, sy)
      }
      ctx.globalAlpha = 1.0

      animationFrameId = requestAnimationFrame(draw)
    }

    draw()

    return () => {
      window.removeEventListener("mousemove", handleMouseMove)
      cancelAnimationFrame(animationFrameId)
    }
  }, [])

  return (
    <div className="relative w-72 h-72 mx-auto flex items-center justify-center">
      {/* Soft blue backglow behind canvas */}
      <div className="absolute w-52 h-52 rounded-full bg-brand/12 blur-3xl pointer-events-none animate-pulse" />
      
      {/* 3D Canvas element */}
      <canvas
        ref={canvasRef}
        className="relative z-10 w-full h-full cursor-grab active:cursor-grabbing select-none"
        aria-label="Interactive 3D coding character bust tracking mouse movements"
      />
    </div>
  )
}

export default function HomePage() {
  const { t, locale } = useLanguage()
  const [projects, setProjects] = useState<Project[]>([])
  const [posts, setPosts] = useState<Post[]>([])
  const [socialLinks, setSocialLinks] = useState({
    github: "https://github.com", linkedin: "https://linkedin.com",
    telegram: "https://t.me",    twitter: "https://twitter.com",
  })

  useEffect(() => {
    async function loadLandingData() {
      try {
        const [projRes, postRes, settingsRes] = await Promise.all([
          fetch("/api/projects"),
          fetch("/api/posts?limit=3"),
          fetch("/api/settings"),
        ])
        const projJson     = await projRes.json()
        const postJson     = await postRes.json()
        const settingsJson = settingsRes.ok ? await settingsRes.json() : null

        if (projJson.success && projJson.data) {
          const featured = projJson.data.filter((p: any) => p.featured).slice(0, 3)
          setProjects(featured.length > 0 ? featured : projJson.data.slice(0, 3))
        }

        if (postJson.success && postJson.data) {
          setPosts(postJson.data.slice(0, 3))
        }

        if (settingsJson?.success && settingsJson.data) {
          setSocialLinks({
            github:   settingsJson.data.social_github   || "https://github.com",
            linkedin: settingsJson.data.social_linkedin || "https://linkedin.com",
            telegram: settingsJson.data.social_telegram || "https://t.me",
            twitter:  settingsJson.data.social_twitter  || "https://twitter.com",
          })
        }
      } catch (err) {
        console.error("Failed to load landing data:", err)
      }
    }
    loadLandingData()
  }, [])

  const skills = {
    languages:  ["TypeScript", "JavaScript", "Python", "Go", "SQL", "HTML/CSS"],
    frameworks: ["Next.js", "React", "FastAPI", "Django", "Astro", "Tailwind CSS"],
    tools:      ["PostgreSQL", "Docker", "Git", "Redis", "Supabase", "Cloudinary", "Vercel"],
  }

  return (
    <div className="space-y-28">

      {/* ── 1. Hero ──────────────────────────────────────────── */}
      <section className="relative py-12 md:py-20 flex flex-col items-center justify-center text-center space-y-10">
        {/* Background ambient glows */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full bg-brand/8 blur-[120px] pointer-events-none" />
        <div className="absolute top-1/4 right-1/4 w-[200px] h-[200px] rounded-full bg-sky-400/5 blur-[80px] pointer-events-none" />

        {/* 3D Orb */}
        <ScrollReveal direction="none" duration={700}>
          <HeroOrb />
        </ScrollReveal>

        <ScrollReveal direction="up" delay={100} duration={700}>
          <div className="space-y-4">
            <Badge
              className="bg-brand/10 text-brand dark:bg-brand/20 dark:text-brand border-none font-semibold px-3 py-1 text-xs animate-badge-pulse"
            >
              {locale === "en" ? "👋 Available for Freelance / Fulltime" : "👋 Loyihalar uchun ochiqman"}
            </Badge>
            <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight bg-gradient-to-r from-neutral-900 via-brand to-brand-hover dark:from-white dark:via-brand-hover dark:to-brand bg-clip-text text-transparent pb-1 animate-gradient">
              {t("hero.title")}
            </h1>
            <p className="text-lg sm:text-xl text-neutral-600 dark:text-neutral-400 max-w-2xl mx-auto leading-relaxed">
              {t("hero.subtitle")}
            </p>
          </div>
        </ScrollReveal>

        {/* Actions */}
        <ScrollReveal direction="up" delay={200} duration={700}>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <MagneticButton>
              <Link href="/projects">
                <Button size="lg" className="bg-brand hover:bg-brand-hover text-white font-medium shadow-lg shadow-brand/25 hover:shadow-brand/40 transition-shadow">
                  {t("hero.viewProjects")} <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </MagneticButton>
            <MagneticButton>
              <Link href="/blog">
                <Button size="lg" variant="outline" className="border-neutral-200 dark:border-neutral-800 hover:bg-neutral-50 dark:hover:bg-neutral-900">
                  {t("hero.readBlog")}
                </Button>
              </Link>
            </MagneticButton>
          </div>
        </ScrollReveal>

        {/* Social icons */}
        <ScrollReveal direction="up" delay={300} duration={700}>
          <div className="flex items-center gap-3 pt-2">
            {[
              { href: socialLinks.github,   icon: <Github className="h-5 w-5" />,   hover: "hover:text-neutral-950 dark:hover:text-white" },
              { href: socialLinks.linkedin, icon: <Linkedin className="h-5 w-5" />, hover: "hover:text-brand" },
              { href: socialLinks.telegram, icon: <Send className="h-5 w-5" />,     hover: "hover:text-sky-500" },
              { href: socialLinks.twitter,  icon: <Twitter className="h-5 w-5" />,  hover: "hover:text-neutral-950 dark:hover:text-white" },
            ].map(({ href, icon, hover }, i) => (
              <a
                key={i}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className={`p-2.5 rounded-full border border-neutral-200 dark:border-neutral-800 text-neutral-500 hover:bg-neutral-50 dark:hover:bg-neutral-900 hover:scale-110 hover:-translate-y-0.5 transition-all duration-200 ${hover}`}
              >
                {icon}
              </a>
            ))}
          </div>
        </ScrollReveal>
      </section>

      {/* ── 2. Featured Projects ──────────────────────────────── */}
      <section className="space-y-6">
        <ScrollReveal direction="up">
          <div className="flex items-end justify-between">
            <div className="space-y-1">
              <h2 className="text-2xl md:text-3xl font-bold tracking-tight">{t("home.featuredProjects")}</h2>
              <p className="text-sm text-neutral-500 dark:text-neutral-400">
                {locale === "en" ? "A hand-picked selection of things I've built." : "Mening tanlangan eng yaxshi ishlarim."}
              </p>
            </div>
            <Link href="/projects" className="text-sm font-semibold text-brand flex items-center gap-1 hover:underline">
              {t("home.viewAllProjects")} <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </ScrollReveal>

        {projects.length === 0 ? (
          <div className="text-center py-12 border border-dashed border-neutral-200 dark:border-neutral-800 rounded-xl bg-neutral-50/50 dark:bg-neutral-900/20 col-span-full">
            <Terminal className="h-8 w-8 mx-auto text-neutral-400 mb-2" />
            <p className="text-sm text-neutral-500 dark:text-neutral-400">
              {locale === "en" ? "No featured projects yet." : "Hozircha tanlangan loyihalar yo'q."}
            </p>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {projects.map((project, i) => {
              const titleText = locale === "uz" && project.titleUz ? project.titleUz : project.title
              const descText  = locale === "uz" && project.descriptionUz ? project.descriptionUz : project.description
              return (
                <ScrollReveal key={project.id} direction="up" delay={i * 80} duration={600}>
                  <TiltCard className="flex flex-col border border-neutral-200 dark:border-neutral-800 rounded-xl overflow-hidden bg-background dark:bg-neutral-900 shadow-sm h-full group">
                    <div className="relative aspect-video bg-neutral-100 dark:bg-neutral-950 flex items-center justify-center border-b border-neutral-200 dark:border-neutral-800 overflow-hidden">
                      {project.coverImage ? (
                        <img src={project.coverImage} alt={titleText} className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-500" />
                      ) : (
                        <PostDefaultCover title={project.title} size="card" />
                      )}
                      {project.status === "IN_PROGRESS" && (
                        <span className="absolute top-3 left-3 bg-amber-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 animate-pulse">
                          <span className="w-1.5 h-1.5 rounded-full bg-white inline-block" />
                          {locale === "en" ? "In Progress" : "Jarayonda"}
                        </span>
                      )}
                    </div>
                    <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                      <div className="space-y-2">
                        <h3 className="font-bold text-lg text-neutral-900 dark:text-white hover:text-brand transition-colors">
                          <Link href={`/projects/${project.slug}`}>{titleText}</Link>
                        </h3>
                        <p className="text-sm text-neutral-600 dark:text-neutral-400 line-clamp-2 leading-relaxed">{descText}</p>
                      </div>
                      <div className="flex flex-wrap gap-1.5 pt-2">
                        {project.techStack.map((tech) => (
                          <Badge key={tech} variant="outline" className="text-[10px] px-2 py-0 border-neutral-200 dark:border-neutral-800 text-neutral-500 dark:text-neutral-400 bg-neutral-50 dark:bg-neutral-950 font-normal">
                            {tech}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </TiltCard>
                </ScrollReveal>
              )
            })}
          </div>
        )}
      </section>

      {/* ── 3. Skills ─────────────────────────────────────────── */}
      <ScrollReveal direction="up">
        <section className="p-8 md:p-12 rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50/80 dark:bg-neutral-900/50 backdrop-blur-sm relative overflow-hidden space-y-8">
          <div className="absolute top-0 right-0 w-64 h-64 bg-brand/5 blur-[60px] pointer-events-none rounded-full" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-sky-400/5 blur-[50px] pointer-events-none rounded-full" />

          <div className="space-y-2 text-center max-w-xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-bold tracking-tight">{t("home.skills")}</h2>
            <p className="text-sm text-neutral-500 dark:text-neutral-400">
              {locale === "en"
                ? "My technical toolbox for writing software, APIs, and frontends."
                : "Dasturlar, API va interfeyslarni yaratishda foydalanadigan texnologiyalarim."}
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {[
              { icon: <Terminal className="h-5 w-5 text-brand" />, label: locale === "en" ? "Languages" : "Dasturlash tillari", items: skills.languages },
              { icon: <Cpu className="h-5 w-5 text-brand" />,      label: locale === "en" ? "Frameworks" : "Freymvorklar",       items: skills.frameworks },
              { icon: <Layers className="h-5 w-5 text-cyan-500" />,label: locale === "en" ? "Databases & Tools" : "MB va vositalar", items: skills.tools },
            ].map(({ icon, label, items }, i) => (
              <TiltCard key={label} maxTilt={4} className="space-y-4 p-5 rounded-xl bg-background dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800">
                <div className="flex items-center gap-2 font-bold text-neutral-900 dark:text-white">
                  {icon}
                  <span>{label}</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {items.map((skill) => (
                    <span key={skill} className="skill-pill px-2.5 py-1 rounded-md bg-neutral-100 dark:bg-neutral-900 text-neutral-700 dark:text-neutral-300 text-xs font-semibold cursor-default">
                      {skill}
                    </span>
                  ))}
                </div>
              </TiltCard>
            ))}
          </div>
        </section>
      </ScrollReveal>

      {/* ── 4. Recent Posts ───────────────────────────────────── */}
      <section className="space-y-6">
        <ScrollReveal direction="up">
          <div className="flex items-end justify-between">
            <div className="space-y-1">
              <h2 className="text-2xl md:text-3xl font-bold tracking-tight">{t("home.recentPosts")}</h2>
              <p className="text-sm text-neutral-500 dark:text-neutral-400">
                {locale === "en" ? "My thoughts on technology and coding." : "Dasturlash va texnologiya sohasidagi fikrlarim."}
              </p>
            </div>
            <Link href="/blog" className="text-sm font-semibold text-brand flex items-center gap-1 hover:underline">
              {t("home.readAllPosts")} <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </ScrollReveal>

        {posts.length === 0 ? (
          <div className="text-center py-12 border border-dashed border-neutral-200 dark:border-neutral-800 rounded-xl bg-neutral-50/50 dark:bg-neutral-900/20 col-span-full">
            <Clock className="h-8 w-8 mx-auto text-neutral-400 mb-2" />
            <p className="text-sm text-neutral-500 dark:text-neutral-400">
              {locale === "en" ? "No recent posts yet." : "Hozircha yangi maqolalar yo'q."}
            </p>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {posts.map((post, i) => {
              const titleText  = locale === "uz" && post.titleUz ? post.titleUz : post.title
              const excerptText = locale === "uz" && post.excerptUz ? post.excerptUz : post.excerpt
              return (
                <ScrollReveal key={post.id} direction="up" delay={i * 80} duration={600}>
                  <TiltCard className="p-6 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-background dark:bg-neutral-900 shadow-sm flex flex-col justify-between space-y-4 h-full group">
                    <div className="space-y-2">
                      <div className="flex items-center gap-4 text-[11px] text-neutral-400">
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3" /> {post.readingTime || 3} {t("blog.readTime")}
                        </span>
                        <span className="flex items-center gap-1">
                          <Eye className="h-3 w-3" /> {post.views}
                        </span>
                      </div>
                      <h3 className="font-bold text-base text-neutral-900 dark:text-white group-hover:text-brand line-clamp-2 transition-colors">
                        <Link href={`/blog/${post.slug}`}>{titleText}</Link>
                      </h3>
                      <p className="text-xs text-neutral-500 dark:text-neutral-400 line-clamp-3 leading-relaxed">
                        {excerptText || "No description provided."}
                      </p>
                    </div>
                    <div className="pt-2 text-right">
                      <span className="text-[10px] text-neutral-400 font-semibold uppercase">
                        {post.publishedAt ? new Date(post.publishedAt).toLocaleDateString() : ""}
                      </span>
                    </div>
                  </TiltCard>
                </ScrollReveal>
              )
            })}
          </div>
        )}
      </section>

      {/* ── 5. About Snippet ──────────────────────────────────── */}
      <ScrollReveal direction="up">
        <section className="grid gap-8 md:grid-cols-2 items-center py-6">
          <div className="space-y-4">
            <h2 className="text-2xl md:text-3xl font-bold tracking-tight">{t("home.aboutSnippetTitle")}</h2>
            <p className="text-sm leading-relaxed text-neutral-600 dark:text-neutral-400">
              {locale === "en"
                ? "I'm a backend-focused fullstack engineer from Uzbekistan. I love architecting robust, clean APIs with FastAPI, building modern frontends with Next.js, and working on containerized workflows. I dedicate my free time to writing guides and mentoring new developers."
                : "Men O'zbekistonlik backendga yo'naltirilgan fullstack muhandisman. FastAPI yordamida mustahkam toza API arxitekturasini loyihalashni, Next.js yordamida zamonaviy interfeyslar yaratishni va konteynerlashtirilgan jarayonlar ustida ishlashni yoqtiraman."}
            </p>
            <div className="pt-2">
              <MagneticButton>
                <Link href="/about">
                  <Button variant="outline" className="border-neutral-200 dark:border-neutral-800 text-sm flex items-center gap-2 hover:border-brand/40 hover:text-brand transition-colors">
                    <Compass className="h-4 w-4" /> {t("home.readMoreAbout")}
                  </Button>
                </Link>
              </MagneticButton>
            </div>
          </div>

          {/* 3D Coding Character */}
          <TiltCard maxTilt={6} className="aspect-[4/3] rounded-2xl bg-gradient-to-br from-[#050d1e] via-[#061428] to-[#0a1f3d] border border-blue-900/30 dark:border-blue-900/40 relative overflow-hidden shadow-2xl">
            {/* Subtle grid */}
            <div
              className="absolute inset-0 opacity-[0.04]"
              style={{
                backgroundImage: "linear-gradient(rgba(0,95,232,1) 1px, transparent 1px), linear-gradient(90deg, rgba(0,95,232,1) 1px, transparent 1px)",
                backgroundSize: "28px 28px",
              }}
            />
            <CodingCharacter />
          </TiltCard>
        </section>
      </ScrollReveal>

      {/* ── 6. Contact CTA ────────────────────────────────────── */}
      <ScrollReveal direction="up">
        <ContactCTA3D
          title={t("home.contactCTA")}
          subtitle={t("home.contactSub")}
          locale={locale}
        >
          <MagneticButton>
            <Link href="/contact">
              <Button
                size="lg"
                className="bg-white hover:bg-blue-50 text-brand font-semibold shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-200 px-8"
              >
                {t("home.getInTouch")}
              </Button>
            </Link>
          </MagneticButton>
        </ContactCTA3D>
      </ScrollReveal>

    </div>
  )
}
