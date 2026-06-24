"use client"

import { useEffect, useState } from "react"
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


// ── 3D Orb Component ──────────────────────────────────────────
function HeroOrb() {
  return (
    <div
      className="relative w-52 h-52 mx-auto"
      style={{ perspective: "600px", perspectiveOrigin: "center center" }}
    >
      {/* Outer glow halo */}
      <div className="absolute inset-0 rounded-full bg-brand/20 blur-2xl animate-pulse" />

      {/* Core sphere */}
      <div
        className="absolute inset-6 rounded-full animate-float"
        style={{
          background: "radial-gradient(circle at 35% 35%, #60a5fa, #005fe8 50%, #003fa0)",
          boxShadow: "0 0 40px rgba(0,95,232,0.4), inset 0 -10px 30px rgba(0,0,0,0.3), inset 10px 10px 30px rgba(255,255,255,0.15)",
        }}
      >
        {/* Specular highlight */}
        <div
          className="absolute top-3 left-4 w-8 h-5 rounded-full opacity-60"
          style={{ background: "radial-gradient(circle, rgba(255,255,255,0.9), transparent)" }}
        />
        {/* Initials */}
        <div className="absolute inset-0 flex items-center justify-center text-white font-extrabold text-3xl tracking-tight select-none">
          AN
        </div>
      </div>

      {/* Orbit ring 1 */}
      <div
        className="absolute inset-0 rounded-full border border-brand/30 animate-orbit"
        style={{ transformStyle: "preserve-3d" }}
      >
        <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-brand/70 shadow-[0_0_6px_2px_rgba(0,95,232,0.5)]" />
      </div>

      {/* Orbit ring 2 */}
      <div
        className="absolute inset-2 rounded-full border border-sky-400/20 animate-orbit2"
        style={{ transformStyle: "preserve-3d" }}
      >
        <div className="absolute bottom-0 right-1/4 w-1.5 h-1.5 rounded-full bg-sky-400/70 shadow-[0_0_4px_2px_rgba(56,189,248,0.4)]" />
      </div>

      {/* Floating code snippets */}
      <div className="absolute -left-12 top-8 text-[10px] font-mono text-brand/50 dark:text-brand/40 animate-float-slow select-none whitespace-nowrap">
        async fn main() &#123;
      </div>
      <div className="absolute -right-14 bottom-10 text-[10px] font-mono text-sky-500/50 animate-float select-none whitespace-nowrap" style={{ animationDelay: "1.5s" }}>
        &lt;App /&gt;
      </div>
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
                        <div className="text-neutral-400 dark:text-neutral-600 flex flex-col items-center gap-1.5">
                          <Terminal className="h-8 w-8" />
                          <span className="text-[10px] uppercase font-bold tracking-widest">Project Demo</span>
                        </div>
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

          {/* Animated avatar card */}
          <TiltCard maxTilt={6} className="aspect-[4/3] rounded-2xl bg-gradient-to-tr from-brand/10 via-sky-400/5 to-brand-hover/10 border border-neutral-200 dark:border-neutral-800 flex items-center justify-center relative overflow-hidden">
            {/* Grid pattern */}
            <div
              className="absolute inset-0 opacity-[0.03] dark:opacity-[0.06]"
              style={{
                backgroundImage: "linear-gradient(rgba(0,95,232,1) 1px, transparent 1px), linear-gradient(90deg, rgba(0,95,232,1) 1px, transparent 1px)",
                backgroundSize: "28px 28px",
              }}
            />
            {/* 3D sphere avatar */}
            <div
              className="w-24 h-24 rounded-full flex items-center justify-center text-white text-3xl font-extrabold shadow-2xl animate-float"
              style={{
                background: "radial-gradient(circle at 35% 35%, #60a5fa, #005fe8 55%, #002f99)",
                boxShadow: "0 8px 32px rgba(0,95,232,0.4), inset 0 -8px 20px rgba(0,0,0,0.3), inset 8px 8px 20px rgba(255,255,255,0.15)",
              }}
            >
              AN
            </div>
            {/* Decorative code labels */}
            <div className="absolute top-5 left-5 text-[10px] text-neutral-400 font-mono opacity-70">console.log("hello");</div>
            <div className="absolute bottom-5 right-5 text-[10px] text-brand/60 font-mono">&lt;enemer-tech /&gt;</div>
            <div className="absolute top-5 right-5 text-[9px] text-neutral-400 font-mono opacity-50">v2.0.0</div>
          </TiltCard>
        </section>
      </ScrollReveal>

      {/* ── 6. Contact CTA ────────────────────────────────────── */}
      <ScrollReveal direction="up">
        <section className="text-center p-10 md:p-14 rounded-2xl relative overflow-hidden text-white space-y-6 shadow-2xl">
          {/* Animated gradient background */}
          <div
            className="absolute inset-0 animate-gradient"
            style={{
              background: "linear-gradient(135deg, #003fa0, #005fe8, #0080ff, #005fe8, #003fa0)",
              backgroundSize: "400% 400%",
            }}
          />
          {/* Noise overlay */}
          <div className="absolute inset-0 opacity-10 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMDAiIGhlaWdodD0iMzAwIj48ZmlsdGVyIGlkPSJub2lzZSI+PGZlVHVyYnVsZW5jZSB0eXBlPSJmcmFjdGFsTm9pc2UiIGJhc2VGcmVxdWVuY3k9IjAuNjUiIG51bU9jdGF2ZXM9IjMiIHN0aXRjaFRpbGVzPSJzdGl0Y2giLz48L2ZpbHRlcj48cmVjdCB3aWR0aD0iMzAwIiBoZWlnaHQ9IjMwMCIgZmlsdGVyPSJ1cmwoI25vaXNlKSIgb3BhY2l0eT0iMSIvPjwvc3ZnPg==')]" />

          {/* Pulse rings behind button */}
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 w-24 h-24">
            <div className="absolute inset-0 rounded-full bg-white/10 animate-pulse-ring" />
            <div className="absolute inset-0 rounded-full bg-white/10 animate-pulse-ring" style={{ animationDelay: "0.5s" }} />
          </div>

          <div className="max-w-xl mx-auto space-y-3 relative z-10">
            <h2 className="text-3xl font-extrabold tracking-tight">{t("home.contactCTA")}</h2>
            <p className="text-sm opacity-90 leading-relaxed">{t("home.contactSub")}</p>
          </div>
          <div className="relative z-10 pt-2">
            <MagneticButton>
              <Link href="/contact">
                <Button
                  size="lg"
                  className="bg-white hover:bg-neutral-50 text-brand font-semibold shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-200"
                >
                  {t("home.getInTouch")}
                </Button>
              </Link>
            </MagneticButton>
          </div>
        </section>
      </ScrollReveal>

    </div>
  )
}
