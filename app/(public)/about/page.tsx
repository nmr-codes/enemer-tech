"use client"

import { useEffect, useState } from "react"
import { useLanguage } from "@/context/LanguageContext"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Download, Briefcase, GraduationCap, Code } from "lucide-react"
import { ScrollReveal } from "@/components/shared/ScrollReveal"
import { TiltCard } from "@/components/shared/TiltCard"

interface TimelineItem {
  year: string
  title: string
  titleUz?: string
  organization: string
  organizationUz?: string
  description: string
  descriptionUz?: string
}

export default function AboutPage() {
  const { t, locale } = useLanguage()
  const [aboutContent, setAboutContent] = useState("")
  const [resumeUrl, setResumeUrl] = useState("")
  const [photoUrl, setPhotoUrl] = useState("")

  useEffect(() => {
    async function loadAboutSettings() {
      try {
        const res = await fetch("/api/settings")
        if (res.ok) {
          const json = await res.json()
          if (json.success) {
            const settings = json.data
            setResumeUrl(settings.resume_pdf || "")
            setPhotoUrl(settings.profile_photo || "")
            
            const content = locale === "uz" ? settings.about_content_uz : settings.about_content_en
            setAboutContent(content || "")
          }
        }
      } catch (err) {
        console.error("Failed to load about configurations:", err)
      }
    }
    loadAboutSettings()
  }, [locale])

  const experience: TimelineItem[] = [
    {
      year: "2024 - Present",
      title: "Senior Software Engineer",
      titleUz: "Katta dasturiy ta'minot muhandisi",
      organization: "Tech Solutions Co.",
      organizationUz: "Tech Solutions Co.",
      description: "Designed high-throughput FastAPI microservices and led next.js frontend migrations.",
      descriptionUz: "Yuqori samarali FastAPI mikroxizmatlarini loyihalash va Next.js interfeyslarini boshqarish."
    },
    {
      year: "2022 - 2024",
      title: "Fullstack Developer",
      titleUz: "Fullstack dasturchi",
      organization: "Software Innovation Lab",
      organizationUz: "Software Innovation Lab",
      description: "Built scalable web interfaces using React, styled with Tailwind CSS and integrated PostgreSQL schemas.",
      descriptionUz: "React yordamida veb interfeyslar yaratish va PostgreSQL ma'lumotlar bazasi integratsiyasi."
    }
  ]

  const education: TimelineItem[] = [
    {
      year: "2018 - 2022",
      title: "B.S. in Computer Science",
      titleUz: "Kompyuter muhandisligi bakalavri",
      organization: "Tashkent University of Information Technologies",
      organizationUz: "Toshkent Axborot Texnologiyalari Universiteti",
      description: "Focused on database structures, software architectures, and algorithmic thinking.",
      descriptionUz: "Ma'lumotlar bazasi, dasturiy ta'minot arxitekturasi va algoritmlar."
    }
  ]

  const skillsBreakdown = [
    { category: locale === "en" ? "Backend Development" : "Backend Dasturlash", list: ["FastAPI", "Django", "Go", "PostgreSQL", "Prisma", "SQLAlchemy", "REST APIs"] },
    { category: locale === "en" ? "Frontend & Styling" : "Frontend va Dizayn", list: ["Next.js", "React", "TypeScript", "Tailwind CSS", "HTML5/CSS3", "shadcn/ui"] },
    { category: locale === "en" ? "DevOps & Cloud" : "DevOps va Bulut", list: ["Docker", "Vercel", "Supabase", "Git & GitHub", "Railway", "CI/CD Pipelines"] }
  ]

  const defaultBio = locale === "uz" 
    ? "<h2>Xush kelibsiz!</h2><p>Men Abdurasulman, O'zbekistonlik dasturiy ta'minot muhandisi. Men zamonaviy, tez va xavfsiz backend API-larni loyihalash hamda responsive Next.js interfeyslarini yaratish ustida ishlayman. Kod yozish bilan birga o'z fikrlarimni blogda baham ko'rishni va jamoat loyihalarida qatnashishni yaxshi ko'raman.</p>"
    : "<h2>Welcome!</h2><p>I am Abdurasul, a software engineer based in Uzbekistan. I specialize in designing modern, fast, and secure backend APIs and building responsive Next.js client-side applications. Along with coding, I enjoy sharing technical articles on my blog and contributing to open-source tools.</p>"

  return (
    <div className="space-y-16 max-w-4xl mx-auto">
      <div className="text-center space-y-2">
        <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight">
          {locale === "en" ? "About Me" : "Men haqimda"}
        </h1>
        <p className="text-sm text-neutral-500 dark:text-neutral-400">
          {locale === "en" ? "My journey, experience, and tech credentials." : "Mening tajribam va kasbiy ko'nikmalarim."}
        </p>
      </div>

      <div className="grid gap-8 md:grid-cols-3 items-start">
        <div className="md:col-span-1 flex flex-col items-center gap-4">
          <div className="aspect-square w-48 rounded-2xl overflow-hidden border border-neutral-200 dark:border-neutral-800 bg-neutral-100 dark:bg-neutral-900 shadow-md">
            {photoUrl ? (
              <img src={photoUrl} alt="Abdurasul Nematxonov" className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full bg-gradient-to-tr from-brand/10 to-brand-hover/10 flex items-center justify-center text-brand text-3xl font-extrabold">
                AN
              </div>
            )}
          </div>
          {resumeUrl && (
            <a href={resumeUrl} target="_blank" rel="noopener noreferrer" className="w-full max-w-[192px]">
              <Button className="w-full bg-brand hover:bg-brand-hover text-white flex items-center justify-center gap-2">
                <Download className="h-4 w-4" /> {locale === "en" ? "Download Resume" : "Rezyumeni yuklash"}
              </Button>
            </a>
          )}
        </div>

        <div className="md:col-span-2 space-y-4">
          <div
            className="prose dark:prose-invert text-neutral-700 dark:text-neutral-300 max-w-none leading-relaxed"
            dangerouslySetInnerHTML={{ __html: aboutContent || defaultBio }}
          />
        </div>
      </div>

      <div className="space-y-6 pt-6 border-t border-neutral-100 dark:border-neutral-900">
        <h2 className="text-2xl font-bold tracking-tight">{locale === "en" ? "Skills Breakdown" : "Texnik ko'nikmalar"}</h2>
        <div className="grid gap-6 md:grid-cols-3">
          {skillsBreakdown.map((block, i) => (
            <ScrollReveal key={block.category} direction="up" delay={i * 80}>
              <TiltCard maxTilt={3} className="p-5 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900/40 h-full">
                <h3 className="font-bold text-sm text-neutral-900 dark:text-white mb-3 flex items-center gap-2">
                  <Code className="h-4 w-4 text-brand" /> {block.category}
                </h3>
                <div className="flex flex-wrap gap-1.5">
                  {block.list.map((tech) => (
                    <span key={tech} className="skill-pill px-2.5 py-1 rounded-md bg-background dark:bg-neutral-950 text-neutral-700 dark:text-neutral-300 border border-neutral-100 dark:border-neutral-900 text-xs font-semibold cursor-default">
                      {tech}
                    </span>
                  ))}
                </div>
              </TiltCard>
            </ScrollReveal>
          ))}
        </div>
      </div>

      <div className="grid gap-8 md:grid-cols-2 pt-6 border-t border-neutral-100 dark:border-neutral-900">
        <div className="space-y-6">
          <h2 className="text-2xl font-bold tracking-tight flex items-center gap-2">
            <Briefcase className="h-6 w-6 text-brand" /> {locale === "en" ? "Experience" : "Ish tajribasi"}
          </h2>
          <div className="relative border-l border-neutral-200 dark:border-neutral-800 pl-4 ml-2 space-y-8">
            {experience.map((item, i) => {
              const titleText = locale === "uz" && item.titleUz ? item.titleUz : item.title
              const orgText = locale === "uz" && item.organizationUz ? item.organizationUz : item.organization
              const descText = locale === "uz" && item.descriptionUz ? item.descriptionUz : item.description
              return (
                <div key={item.title + i} className="relative">
                  <div className="absolute -left-[21px] top-1.5 w-3.5 h-3.5 rounded-full bg-brand border border-white dark:border-neutral-950" />
                  <span className="text-[10px] font-bold text-brand tracking-wider uppercase block mb-1">
                    {item.year}
                  </span>
                  <h3 className="font-bold text-sm text-neutral-900 dark:text-white">{titleText}</h3>
                  <h4 className="text-xs text-neutral-500 dark:text-neutral-400 font-medium mb-2">{orgText}</h4>
                  <p className="text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed">{descText}</p>
                </div>
              )
            })}
          </div>
        </div>

        <div className="space-y-6">
          <h2 className="text-2xl font-bold tracking-tight flex items-center gap-2">
            <GraduationCap className="h-6 w-6 text-brand" /> {locale === "en" ? "Education" : "Ta'lim"}
          </h2>
          <div className="relative border-l border-neutral-200 dark:border-neutral-800 pl-4 ml-2 space-y-8">
            {education.map((item, i) => {
              const titleText = locale === "uz" && item.titleUz ? item.titleUz : item.title
              const orgText = locale === "uz" && item.organizationUz ? item.organizationUz : item.organization
              const descText = locale === "uz" && item.descriptionUz ? item.descriptionUz : item.description
              return (
                <div key={item.title + i} className="relative">
                  <div className="absolute -left-[21px] top-1.5 w-3.5 h-3.5 rounded-full bg-brand border border-white dark:border-neutral-950" />
                  <span className="text-[10px] font-bold text-brand tracking-wider uppercase block mb-1">
                    {item.year}
                  </span>
                  <h3 className="font-bold text-sm text-neutral-900 dark:text-white">{titleText}</h3>
                  <h4 className="text-xs text-neutral-500 dark:text-neutral-400 font-medium mb-2">{orgText}</h4>
                  <p className="text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed">{descText}</p>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}
