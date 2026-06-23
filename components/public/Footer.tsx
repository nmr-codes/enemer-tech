"use client"

import { useEffect, useState } from "react"
import { Send } from "lucide-react"
import { Github, Linkedin, Twitter } from "@/components/shared/SocialIcons"

export function Footer() {
  const currentYear = new Date().getFullYear()
  const [socialLinks, setSocialLinks] = useState({
    github: "https://github.com",
    linkedin: "https://linkedin.com",
    telegram: "https://t.me",
    twitter: "https://twitter.com",
  })

  useEffect(() => {
    async function loadSocialLinks() {
      try {
        const res = await fetch("/api/settings")
        if (res.ok) {
          const json = await res.json()
          if (json.success && json.data) {
            setSocialLinks({
              github:   json.data.social_github   || "https://github.com",
              linkedin: json.data.social_linkedin || "https://linkedin.com",
              telegram: json.data.social_telegram || "https://t.me",
              twitter:  json.data.social_twitter  || "https://twitter.com",
            })
          }
        }
      } catch (err) {
        console.error("Failed to load footer social links:", err)
      }
    }
    loadSocialLinks()
  }, [])

  const socials = [
    {
      href: socialLinks.github,
      label: "GitHub",
      icon: <Github className="h-4 w-4" />,
      hover: "hover:text-neutral-900 dark:hover:text-white hover:scale-110 hover:-translate-y-0.5",
    },
    {
      href: socialLinks.linkedin,
      label: "LinkedIn",
      icon: <Linkedin className="h-4 w-4" />,
      hover: "hover:text-brand hover:scale-110 hover:-translate-y-0.5",
    },
    {
      href: socialLinks.telegram,
      label: "Telegram",
      icon: <Send className="h-4 w-4" />,
      hover: "hover:text-sky-500 hover:scale-110 hover:-translate-y-0.5",
    },
    {
      href: socialLinks.twitter,
      label: "Twitter",
      icon: <Twitter className="h-4 w-4" />,
      hover: "hover:text-neutral-900 dark:hover:text-white hover:scale-110 hover:-translate-y-0.5",
    },
  ]

  return (
    <footer className="mt-20 relative">
      {/* Gradient border top */}
      <div className="h-px w-full bg-gradient-to-r from-transparent via-brand/30 to-transparent" />

      <div className="bg-background dark:bg-neutral-950 py-8">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex flex-col items-center md:items-start gap-1">
            <p className="text-sm font-semibold text-neutral-700 dark:text-neutral-300">
              Abdurasul Nematxonov
            </p>
            <p className="text-xs text-neutral-400">
              © {currentYear} · All rights reserved.
            </p>
          </div>

          <div className="flex items-center gap-2">
            {socials.map(({ href, label, icon, hover }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={label}
                className={`p-2 rounded-lg text-neutral-400 transition-all duration-200 ${hover}`}
              >
                {icon}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}
