"use client"

import { useEffect, useState } from "react"
import { useLanguage } from "@/context/LanguageContext"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent } from "@/components/ui/card"
import { Send, Mail, MapPin, CheckCircle, AlertCircle } from "lucide-react"
import { Github, Linkedin, Twitter } from "@/components/shared/SocialIcons"

export default function ContactPage() {
  const { t } = useLanguage()

  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [subject, setSubject] = useState("")
  const [message, setMessage] = useState("")
  
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)

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
              github: json.data.social_github || "https://github.com",
              linkedin: json.data.social_linkedin || "https://linkedin.com",
              telegram: json.data.social_telegram || "https://t.me",
              twitter: json.data.social_twitter || "https://twitter.com",
            })
          }
        }
      } catch (err) {
        console.error("Failed to load contact social links:", err)
      }
    }
    loadSocialLinks()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setSuccess(false)

    try {
      const res = await fetch("/api/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          email,
          subject,
          body: message,
        }),
      })

      const json = await res.json()
      if (json.success) {
        setSuccess(true)
        setName("")
        setEmail("")
        setSubject("")
        setMessage("")
      } else {
        setError(json.error || t("contact.error"))
      }
    } catch (err) {
      setError(t("contact.error"))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-12 max-w-4xl mx-auto">
      <div className="text-center space-y-2">
        <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight">
          {t("contact.title")}
        </h1>
        <p className="text-sm text-neutral-500 dark:text-neutral-400">
          {t("contact.subtitle")}
        </p>
      </div>

      <div className="grid gap-8 md:grid-cols-5 items-start">
        <div className="md:col-span-2 space-y-6">
          <div className="p-6 rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900/30 space-y-6 shadow-sm">
            <h3 className="font-bold text-sm uppercase tracking-widest text-neutral-400">
              Get in Touch
            </h3>

            <div className="space-y-4 text-sm text-neutral-700 dark:text-neutral-300">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-brand/10 flex items-center justify-center text-brand shrink-0">
                  <Mail className="h-4 w-4" />
                </div>
                <div>
                  <span className="text-[10px] font-bold text-neutral-400 uppercase block">Email</span>
                  <a href="mailto:admin@abdurasul.dev" className="font-semibold hover:underline">
                    admin@abdurasul.dev
                  </a>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-brand/10 flex items-center justify-center text-brand shrink-0">
                  <MapPin className="h-4 w-4" />
                </div>
                <div>
                  <span className="text-[10px] font-bold text-neutral-400 uppercase block">Location</span>
                  <span className="font-semibold text-neutral-800 dark:text-neutral-200">
                    Tashkent, Uzbekistan
                  </span>
                </div>
              </div>
            </div>

            <div className="h-[1px] bg-neutral-200 dark:bg-neutral-800 my-4" />

            <div className="space-y-3">
              <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest block">
                Social Networks
              </span>
              <div className="flex items-center gap-3">
                <a href={socialLinks.github} target="_blank" rel="noopener noreferrer" className="p-2 rounded-lg bg-neutral-100 hover:bg-neutral-200 dark:bg-neutral-900 dark:hover:bg-neutral-800 text-neutral-500 hover:text-neutral-900 dark:hover:text-white transition-colors" aria-label="GitHub">
                  <Github className="h-4 w-4" />
                </a>
                <a href={socialLinks.linkedin} target="_blank" rel="noopener noreferrer" className="p-2 rounded-lg bg-neutral-100 hover:bg-neutral-200 dark:bg-neutral-900 dark:hover:bg-neutral-800 text-neutral-500 hover:text-brand transition-colors" aria-label="LinkedIn">
                  <Linkedin className="h-4 w-4" />
                </a>
                <a href={socialLinks.telegram} target="_blank" rel="noopener noreferrer" className="p-2 rounded-lg bg-neutral-100 hover:bg-neutral-200 dark:bg-neutral-900 dark:hover:bg-neutral-800 text-neutral-500 hover:text-sky-500 transition-colors" aria-label="Telegram">
                  <Send className="h-4 w-4" />
                </a>
                <a href={socialLinks.twitter} target="_blank" rel="noopener noreferrer" className="p-2 rounded-lg bg-neutral-100 hover:bg-neutral-200 dark:bg-neutral-900 dark:hover:bg-neutral-800 text-neutral-500 hover:text-neutral-900 dark:hover:text-white transition-colors" aria-label="Twitter">
                  <Twitter className="h-4 w-4" />
                </a>
              </div>
            </div>
          </div>
        </div>

        <div className="md:col-span-3">
          <Card className="border-neutral-200 dark:border-neutral-800 bg-background dark:bg-neutral-900 shadow-md">
            <CardContent className="p-6">
              <form onSubmit={handleSubmit} className="space-y-4">
                {success && (
                  <div className="flex items-center gap-2.5 p-4 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-sm">
                    <CheckCircle className="h-5 w-5 shrink-0" />
                    <p>{t("contact.success")}</p>
                  </div>
                )}

                {error && (
                  <div className="flex items-center gap-2.5 p-4 rounded-lg bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400 text-sm">
                    <AlertCircle className="h-5 w-5 shrink-0" />
                    <p>{error}</p>
                  </div>
                )}

                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-1.5">
                    <Label htmlFor="name">{t("contact.name")}</Label>
                    <Input
                      id="name"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Jane Doe"
                      disabled={loading}
                      className="bg-background dark:bg-neutral-950 border-neutral-200 dark:border-neutral-800 focus-visible:ring-brand text-neutral-800 dark:text-neutral-200"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="email">{t("contact.email")}</Label>
                    <Input
                      id="email"
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="jane@domain.com"
                      disabled={loading}
                      className="bg-background dark:bg-neutral-950 border-neutral-200 dark:border-neutral-800 focus-visible:ring-brand text-neutral-800 dark:text-neutral-200"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="subject">{t("contact.subject")}</Label>
                  <Input
                    id="subject"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    placeholder="Project proposal / Collaboration"
                    disabled={loading}
                    className="bg-background dark:bg-neutral-950 border-neutral-200 dark:border-neutral-800 focus-visible:ring-brand text-neutral-800 dark:text-neutral-200"
                  />
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="message">{t("contact.message")}</Label>
                  <Textarea
                    id="message"
                    required
                    rows={5}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Write details of your message..."
                    disabled={loading}
                    className="bg-background dark:bg-neutral-950 border-neutral-200 dark:border-neutral-800 focus-visible:ring-brand resize-none text-neutral-800 dark:text-neutral-200"
                  />
                </div>

                <Button
                  type="submit"
                  disabled={loading}
                  className="bg-brand hover:bg-brand-hover text-white font-semibold py-2 rounded-lg w-full transition-all"
                >
                  {loading ? t("contact.sending") : t("contact.submit")}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
