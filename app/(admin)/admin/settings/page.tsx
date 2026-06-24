"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { ImageUpload } from "@/components/admin/ImageUpload"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Settings, Shield, Link2, FileText, CheckCircle, AlertCircle } from "lucide-react"

export default function SettingsPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [fetching, setFetching] = useState(true)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Settings State variables matching database keys
  const [siteTitle, setSiteTitle] = useState("")
  const [siteDescEn, setSiteDescEn] = useState("")
  const [siteDescUz, setSiteDescUz] = useState("")
  const [aboutEn, setAboutEn] = useState("")
  const [aboutUz, setAboutUz] = useState("")
  const [profilePhoto, setProfilePhoto] = useState("")
  const [resumePdf, setResumePdf] = useState("")
  const [github, setGithub] = useState("")
  const [linkedin, setLinkedin] = useState("")
  const [telegram, setTelegram] = useState("")
  const [twitter, setTwitter] = useState("")
  const [contactEmail, setContactEmail] = useState("")
  const [skillsBackend, setSkillsBackend] = useState("")
  const [skillsFrontend, setSkillsFrontend] = useState("")
  const [skillsDevops, setSkillsDevops] = useState("")
  const [experienceReversed, setExperienceReversed] = useState(false)
  const [educationReversed, setEducationReversed] = useState(false)

  // Admin credentials state
  const [adminName, setAdminName] = useState("")
  const [adminEmail, setAdminEmail] = useState("")
  const [currentPassword, setCurrentPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [profileLoading, setProfileLoading] = useState(false)
  const [profileSuccess, setProfileSuccess] = useState(false)
  const [profileError, setProfileError] = useState<string | null>(null)

  useEffect(() => {
    async function loadSettings() {
      try {
        const res = await fetch("/api/settings")
        if (!res.ok) {
          throw new Error("Failed to load settings data.")
        }
        const json = await res.json()
        if (json.success && json.data) {
          const s = json.data
          setSiteTitle(s.site_title || "")
          setSiteDescEn(s.site_description_en || "")
          setSiteDescUz(s.site_description_uz || "")
          setAboutEn(s.about_content_en || "")
          setAboutUz(s.about_content_uz || "")
          setProfilePhoto(s.profile_photo || "")
          setResumePdf(s.resume_pdf || "")
          setGithub(s.social_github || "")
          setLinkedin(s.social_linkedin || "")
          setTelegram(s.social_telegram || "")
          setTwitter(s.social_twitter || "")
          setContactEmail(s.contact_email || "")
          setSkillsBackend(s.skills_backend || "FastAPI, Django, Go, PostgreSQL, Prisma, SQLAlchemy, REST APIs")
          setSkillsFrontend(s.skills_frontend || "Next.js, React, TypeScript, Tailwind CSS, HTML5/CSS3, shadcn/ui")
          setSkillsDevops(s.skills_devops || "Docker, Vercel, Supabase, Git & GitHub, Railway, CI/CD Pipelines")
          setExperienceReversed(s.experience_reversed === "true")
          setEducationReversed(s.education_reversed === "true")
        }
      } catch (err: any) {
        setError(err.message || "An error occurred while fetching settings.")
      }
    }

    async function loadProfile() {
      try {
        const res = await fetch("/api/profile")
        if (!res.ok) {
          throw new Error("Failed to load profile data.")
        }
        const json = await res.json()
        if (json.success && json.data) {
          setAdminName(json.data.name || "")
          setAdminEmail(json.data.email || "")
        }
      } catch (err: any) {
        console.error("Failed to load profile details", err)
      }
    }

    async function init() {
      setFetching(true)
      await Promise.all([loadSettings(), loadProfile()])
      setFetching(false)
    }

    init()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setSuccess(false)

    const payload = {
      site_title: siteTitle,
      site_description_en: siteDescEn,
      site_description_uz: siteDescUz,
      about_content_en: aboutEn,
      about_content_uz: aboutUz,
      profile_photo: profilePhoto,
      resume_pdf: resumePdf,
      social_github: github,
      social_linkedin: linkedin,
      social_telegram: telegram,
      social_twitter: twitter,
      contact_email: contactEmail,
      skills_backend: skillsBackend,
      skills_frontend: skillsFrontend,
      skills_devops: skillsDevops,
      experience_reversed: experienceReversed.toString(),
      education_reversed: educationReversed.toString(),
    }

    try {
      const res = await fetch("/api/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })
      const json = await res.json()
      if (json.success) {
        setSuccess(true)
        window.scrollTo({ top: 0, behavior: "smooth" })
      } else {
        setError(json.error || "Failed to update settings.")
      }
    } catch (err) {
      setError("An error occurred while saving settings.")
    } finally {
      setLoading(false)
    }
  }

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setProfileLoading(true)
    setProfileError(null)
    setProfileSuccess(false)

    if (newPassword && newPassword !== confirmPassword) {
      setProfileError("New passwords do not match.")
      setProfileLoading(false)
      return
    }

    try {
      const res = await fetch("/api/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: adminName,
          email: adminEmail,
          currentPassword,
          newPassword: newPassword || undefined,
        }),
      })
      const json = await res.json()
      if (json.success) {
        setProfileSuccess(true)
        setCurrentPassword("")
        setNewPassword("")
        setConfirmPassword("")
      } else {
        setProfileError(json.error || "Failed to update profile credentials.")
      }
    } catch (err: any) {
      setProfileError(err.message || "An error occurred while saving profile credentials.")
    } finally {
      setProfileLoading(false)
    }
  }

  if (fetching) {
    return (
      <div className="space-y-8 animate-pulse">
        <div className="h-8 bg-neutral-200 dark:bg-neutral-800 w-48 rounded" />
        <div className="h-96 bg-neutral-200 dark:bg-neutral-800 rounded" />
      </div>
    )
  }

  return (
    <div className="space-y-8 max-w-4xl">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Configuration Settings</h2>
        <p className="text-neutral-500 dark:text-neutral-400 text-sm">
          Customize metadata, personal biography, and dynamic social media handles.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {success && (
          <div className="flex items-center gap-2.5 p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-sm">
            <CheckCircle className="h-5 w-5 shrink-0" />
            <p>Settings saved and updated successfully!</p>
          </div>
        )}

        {error && (
          <div className="flex items-center gap-2.5 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400 text-sm">
            <AlertCircle className="h-5 w-5 shrink-0" />
            <p>{error}</p>
          </div>
        )}

        <div className="grid gap-8">
          {/* Card 1: General & Meta settings */}
          <Card className="border-neutral-200/50 dark:border-white/[0.07] bg-white dark:bg-neutral-900/80 shadow-sm">
            <CardHeader className="pt-6 pb-4 px-6 md:px-8">
              <CardTitle className="text-lg font-bold flex items-center gap-2">
                <Settings className="h-5 w-5 text-brand" /> General & SEO configuration
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 pb-6 px-6 md:px-8 pt-0">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="siteTitle">Site Title</Label>
                  <Input
                    id="siteTitle"
                    value={siteTitle}
                    onChange={(e) => setSiteTitle(e.target.value)}
                    placeholder="E.g. Abdurasul Nematxonov | Portfolio"
                    className="bg-white/5 dark:bg-white/[0.04] border-neutral-200/60 dark:border-white/[0.08] focus-visible:ring-brand"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="contactEmail">Contact Email</Label>
                  <Input
                    id="contactEmail"
                    type="email"
                    value={contactEmail}
                    onChange={(e) => setContactEmail(e.target.value)}
                    placeholder="E.g. admin@domain.com"
                    className="bg-white/5 dark:bg-white/[0.04] border-neutral-200/60 dark:border-white/[0.08] focus-visible:ring-brand"
                  />
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="siteDescEn">Meta Description (English)</Label>
                  <Textarea
                    id="siteDescEn"
                    rows={2}
                    value={siteDescEn}
                    onChange={(e) => setSiteDescEn(e.target.value)}
                    placeholder="Enter short English description..."
                    className="bg-white/5 dark:bg-white/[0.04] border-neutral-200/60 dark:border-white/[0.08] focus-visible:ring-brand resize-none"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="siteDescUz">Meta Description (Uzbek)</Label>
                  <Textarea
                    id="siteDescUz"
                    rows={2}
                    value={siteDescUz}
                    onChange={(e) => setSiteDescUz(e.target.value)}
                    placeholder="O'zbekcha qisqa tavsif kiriting..."
                    className="bg-white/5 dark:bg-white/[0.04] border-neutral-200/60 dark:border-white/[0.08] focus-visible:ring-brand resize-none"
                  />
                </div>
              </div>

              <div className="grid gap-6 md:grid-cols-2 pt-2 border-t border-neutral-100/80 dark:border-white/[0.05]">
                <div className="space-y-2">
                  <Label>Profile Photo</Label>
                  <ImageUpload value={profilePhoto} onChange={setProfilePhoto} folder="settings" aspectRatio={1} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="resumePdf">Resume PDF Link / URL</Label>
                  <Input
                    id="resumePdf"
                    value={resumePdf}
                    onChange={(e) => setResumePdf(e.target.value)}
                    placeholder="E.g. https://supabase.co/storage/v1/object/public/..."
                    className="bg-background dark:bg-neutral-950 border-neutral-200 dark:border-neutral-800 focus-visible:ring-brand"
                  />
                  <p className="text-[10px] text-neutral-450">Paste direct Supabase upload link or public document path.</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Card 2: Biography details */}
          <Card className="border-neutral-200/50 dark:border-white/[0.07] bg-white dark:bg-neutral-900/80 shadow-sm">
            <CardHeader className="pt-6 pb-4 px-6 md:px-8">
              <CardTitle className="text-lg font-bold flex items-center gap-2">
                <FileText className="h-5 w-5 text-brand" /> Biography (HTML/Rich-Text)
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 pb-6 px-6 md:px-8 pt-0">
              <div className="space-y-2">
                <Label htmlFor="aboutEn">About Biography (English)</Label>
                <Textarea
                  id="aboutEn"
                  rows={6}
                  value={aboutEn}
                  onChange={(e) => setAboutEn(e.target.value)}
                  placeholder="<h2>Who I Am</h2><p>...</p>"
                  className="bg-white/5 dark:bg-white/[0.04] border-neutral-200/60 dark:border-white/[0.08] focus-visible:ring-brand font-mono text-xs"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="aboutUz">About Biography (Uzbek)</Label>
                <Textarea
                  id="aboutUz"
                  rows={6}
                  value={aboutUz}
                  onChange={(e) => setAboutUz(e.target.value)}
                  placeholder="<h2>Men haqimda</h2><p>...</p>"
                  className="bg-white/5 dark:bg-white/[0.04] border-neutral-200/60 dark:border-white/[0.08] focus-visible:ring-brand font-mono text-xs"
                />
              </div>
            </CardContent>
          </Card>

          {/* Card 3: Social handle links */}
          <Card className="border-neutral-200/50 dark:border-white/[0.07] bg-white dark:bg-neutral-900/80 shadow-sm">
            <CardHeader className="pt-6 pb-4 px-6 md:px-8">
              <CardTitle className="text-lg font-bold flex items-center gap-2">
                <Link2 className="h-5 w-5 text-brand" /> Social media handles
              </CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4 md:grid-cols-2 pb-6 px-6 md:px-8 pt-0">
              <div className="space-y-2">
                <Label htmlFor="github">GitHub Profile URL</Label>
                <Input
                  id="github"
                  value={github}
                  onChange={(e) => setGithub(e.target.value)}
                  placeholder="https://github.com/username"
                  className="bg-white/5 dark:bg-white/[0.04] border-neutral-200/60 dark:border-white/[0.08] focus-visible:ring-brand"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="linkedin">LinkedIn Profile URL</Label>
                <Input
                  id="linkedin"
                  value={linkedin}
                  onChange={(e) => setLinkedin(e.target.value)}
                  placeholder="https://linkedin.com/in/username"
                  className="bg-white/5 dark:bg-white/[0.04] border-neutral-200/60 dark:border-white/[0.08] focus-visible:ring-brand"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="telegram">Telegram Profile/Chat URL</Label>
                <Input
                  id="telegram"
                  value={telegram}
                  onChange={(e) => setTelegram(e.target.value)}
                  placeholder="https://t.me/username"
                  className="bg-white/5 dark:bg-white/[0.04] border-neutral-200/60 dark:border-white/[0.08] focus-visible:ring-brand"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="twitter">Twitter Profile URL</Label>
                <Input
                  id="twitter"
                  value={twitter}
                  onChange={(e) => setTwitter(e.target.value)}
                  placeholder="https://twitter.com/username"
                  className="bg-white/5 dark:bg-white/[0.04] border-neutral-200/60 dark:border-white/[0.08] focus-visible:ring-brand"
                />
              </div>
            </CardContent>
          </Card>

          {/* Card 4: Skills Breakdown */}
          <Card className="border-neutral-200/50 dark:border-white/[0.07] bg-white dark:bg-neutral-900/80 shadow-sm">
            <CardHeader className="pt-6 pb-4 px-6 md:px-8">
              <CardTitle className="text-lg font-bold flex items-center gap-2">
                <FileText className="h-5 w-5 text-brand" /> Skills Breakdown (Comma separated)
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6 pb-6 px-6 md:px-8 pt-0">
              <div className="space-y-2">
                <Label htmlFor="skillsBackend">Backend Development</Label>
                <Textarea
                  id="skillsBackend"
                  rows={2}
                  value={skillsBackend}
                  onChange={(e) => setSkillsBackend(e.target.value)}
                  placeholder="FastAPI, Django, Go, PostgreSQL..."
                  className="bg-white/5 dark:bg-white/[0.04] border-neutral-200/60 dark:border-white/[0.08] focus-visible:ring-brand font-mono text-xs"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="skillsFrontend">Frontend & Styling</Label>
                <Textarea
                  id="skillsFrontend"
                  rows={2}
                  value={skillsFrontend}
                  onChange={(e) => setSkillsFrontend(e.target.value)}
                  placeholder="Next.js, React, TypeScript, Tailwind CSS..."
                  className="bg-white/5 dark:bg-white/[0.04] border-neutral-200/60 dark:border-white/[0.08] focus-visible:ring-brand font-mono text-xs"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="skillsDevops">DevOps & Cloud</Label>
                <Textarea
                  id="skillsDevops"
                  rows={2}
                  value={skillsDevops}
                  onChange={(e) => setSkillsDevops(e.target.value)}
                  placeholder="Docker, Vercel, Supabase, Git & GitHub..."
                  className="bg-white/5 dark:bg-white/[0.04] border-neutral-200/60 dark:border-white/[0.08] focus-visible:ring-brand font-mono text-xs"
                />
              </div>
            </CardContent>
          </Card>

          {/* Card 5: Timeline Config */}
          <Card className="border-neutral-200/50 dark:border-white/[0.07] bg-white dark:bg-neutral-900/80 shadow-sm">
            <CardHeader className="pt-6 pb-4 px-6 md:px-8">
              <CardTitle className="text-lg font-bold flex items-center gap-2">
                <Settings className="h-5 w-5 text-brand" /> Timeline Configuration
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6 pb-6 px-6 md:px-8 pt-0">
              <div className="flex items-center justify-between rounded-lg border border-neutral-200/60 dark:border-white/[0.08] bg-white/5 dark:bg-white/[0.04] p-4">
                <div className="space-y-0.5">
                  <Label className="text-base font-semibold">Reverse Experience Order</Label>
                  <p className="text-xs text-neutral-500 dark:text-neutral-400">
                    Display newest experience first instead of oldest.
                  </p>
                </div>
                <Switch checked={experienceReversed} onCheckedChange={setExperienceReversed} />
              </div>
              <div className="flex items-center justify-between rounded-lg border border-neutral-200/60 dark:border-white/[0.08] bg-white/5 dark:bg-white/[0.04] p-4">
                <div className="space-y-0.5">
                  <Label className="text-base font-semibold">Reverse Education Order</Label>
                  <p className="text-xs text-neutral-500 dark:text-neutral-400">
                    Display newest education first instead of oldest.
                  </p>
                </div>
                <Switch checked={educationReversed} onCheckedChange={setEducationReversed} />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="flex items-center gap-4">
          <Button
            type="submit"
            disabled={loading}
            className="bg-brand hover:bg-brand-hover text-white font-medium px-8 py-2.5 rounded-lg flex items-center justify-center gap-2"
          >
            {loading ? (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              "Save Settings"
            )}
          </Button>
          <Button
            type="button"
            variant="outline"
            disabled={loading}
            onClick={() => router.push("/admin")}
            className="border-neutral-200/60 dark:border-white/[0.08] text-neutral-700 dark:text-neutral-300"
          >
            Cancel
          </Button>
        </div>
      </form>

      {/* Profile/Credentials Security Form */}
      <div className="pt-8 border-t border-neutral-200/60 dark:border-white/[0.07]">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Account Credentials & Security</h2>
          <p className="text-neutral-500 dark:text-neutral-400 text-sm">
            Update your login email, administrator name, and admin password.
          </p>
        </div>

        <form onSubmit={handleProfileSubmit} className="space-y-8 mt-6">
          {profileSuccess && (
            <div className="flex items-center gap-2.5 p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-sm">
              <CheckCircle className="h-5 w-5 shrink-0" />
              <div>
                <p className="font-semibold">Credentials updated successfully!</p>
                <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">Please remember to use your new email and password the next time you log in.</p>
              </div>
            </div>
          )}

          {profileError && (
            <div className="flex items-center gap-2.5 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400 text-sm">
              <AlertCircle className="h-5 w-5 shrink-0" />
              <p>{profileError}</p>
            </div>
          )}

          <Card className="border-neutral-200/50 dark:border-white/[0.07] bg-white dark:bg-neutral-900/80 shadow-sm">
            <CardHeader className="pt-6 pb-4 px-6 md:px-8">
              <CardTitle className="text-lg font-bold flex items-center gap-2">
                <Shield className="h-5 w-5 text-brand" /> Admin profile details & password
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 pb-6 px-6 md:px-8 pt-0">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="adminName">Administrator Name</Label>
                  <Input
                    id="adminName"
                    value={adminName}
                    onChange={(e) => setAdminName(e.target.value)}
                    placeholder="E.g. Abdurasul Nematxonov"
                    required
                    className="bg-white/5 dark:bg-white/[0.04] border-neutral-200/60 dark:border-white/[0.08] focus-visible:ring-brand"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="adminEmail">Login Email Address</Label>
                  <Input
                    id="adminEmail"
                    type="email"
                    value={adminEmail}
                    onChange={(e) => setAdminEmail(e.target.value)}
                    placeholder="E.g. abdurasulnematxonov@gmail.com"
                    required
                    className="bg-white/5 dark:bg-white/[0.04] border-neutral-200/60 dark:border-white/[0.08] focus-visible:ring-brand"
                  />
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2 pt-4 border-t border-neutral-100/80 dark:border-white/[0.05]">
                <div className="space-y-2">
                  <Label htmlFor="newPassword">New Password (Optional)</Label>
                  <Input
                    id="newPassword"
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Minimum 8 characters"
                    className="bg-white/5 dark:bg-white/[0.04] border-neutral-200/60 dark:border-white/[0.08] focus-visible:ring-brand"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirm New Password</Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Repeat new password"
                    className="bg-white/5 dark:bg-white/[0.04] border-neutral-200/60 dark:border-white/[0.08] focus-visible:ring-brand"
                  />
                </div>
              </div>

              <div className="space-y-2 pt-4 border-t border-neutral-100/80 dark:border-white/[0.05] max-w-md">
                <Label htmlFor="currentPassword" className="text-brand font-medium">Current Password (Required to authorize changes)</Label>
                <Input
                  id="currentPassword"
                  type="password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  placeholder="Enter current password"
                  required
                  className="bg-background dark:bg-neutral-950 border-brand/35 focus-visible:ring-brand"
                />
              </div>
            </CardContent>
          </Card>

          <div className="flex items-center gap-4">
            <Button
              type="submit"
              disabled={profileLoading}
              className="bg-brand hover:bg-brand-hover text-white font-medium px-8 py-2.5 rounded-lg flex items-center justify-center gap-2"
            >
              {profileLoading ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                "Update Credentials"
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
