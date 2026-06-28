"use client"

import { useState } from "react"
import { updateProfile } from "@/app/actions/profile"
import { Loader2, CheckCircle2, User as UserIcon } from "lucide-react"

interface ProfileSettingsClientProps {
  user: {
    name: string
    username: string
    email: string
    bio: string
    image: string
  }
}

const DEFAULT_AVATARS = [
  { name: "Minimal Boy", url: "/avatars/avatar_boy_1782658412370.png" },
  { name: "Minimal Girl", url: "/avatars/avatar_girl_1782658444319.png" },
  { name: "Creative Abstract", url: "/avatars/avatar_creative_1782658459414.png" },
]

export function ProfileSettingsClient({ user }: ProfileSettingsClientProps) {
  const [formData, setFormData] = useState({
    name: user.name,
    username: user.username,
    bio: user.bio,
    image: user.image
  })
  const [isSaving, setIsSaving] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }))
    setError(null)
    setSuccess(false)
  }

  const handleAvatarSelect = (url: string) => {
    setFormData(prev => ({ ...prev, image: url }))
    setError(null)
    setSuccess(false)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSaving(true)
    setError(null)
    setSuccess(false)
    try {
      await updateProfile(formData)
      setSuccess(true)
    } catch (err: any) {
      setError(err.message || "Failed to update profile")
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-white/[0.06] rounded-3xl p-6 md:p-8 shadow-sm">
      <form onSubmit={handleSubmit} className="space-y-8">
        
        {/* Avatar Selection */}
        <div>
          <label className="block text-sm font-semibold text-neutral-900 dark:text-white mb-4">Profile Picture</label>
          <div className="flex flex-wrap gap-4 items-center">
            {/* Current Avatar Preview */}
            <div className="w-20 h-20 rounded-full border-4 border-white dark:border-neutral-800 shadow-md overflow-hidden bg-neutral-100 dark:bg-neutral-800 shrink-0 relative mr-4">
              {formData.image ? (
                <img src={formData.image} alt="Avatar" className="w-full h-full object-cover" />
              ) : (
                <UserIcon className="w-10 h-10 text-neutral-400 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
              )}
            </div>
            
            {/* Default Avatars */}
            {DEFAULT_AVATARS.map(avatar => (
              <button
                key={avatar.url}
                type="button"
                onClick={() => handleAvatarSelect(avatar.url)}
                className={`w-16 h-16 rounded-full overflow-hidden border-2 transition-all hover:scale-105 ${
                  formData.image === avatar.url 
                    ? "border-brand ring-4 ring-brand/20 shadow-lg scale-105" 
                    : "border-transparent opacity-70 hover:opacity-100"
                }`}
                title={avatar.name}
              >
                <img src={avatar.url} alt={avatar.name} className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
          <div className="mt-4">
            <label className="block text-xs font-medium text-neutral-500 mb-1">Or paste a custom image URL</label>
            <input
              type="url"
              name="image"
              value={formData.image}
              onChange={handleChange}
              placeholder="https://..."
              className="w-full max-w-md px-3 py-2 bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded-lg text-sm text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand/50"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Nickname */}
          <div>
            <label className="block text-sm font-semibold text-neutral-900 dark:text-white mb-2">Display Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Your full name or nickname"
              className="w-full px-4 py-3 bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded-xl text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand/50 transition-all"
            />
          </div>

          {/* Username */}
          <div>
            <label className="block text-sm font-semibold text-neutral-900 dark:text-white mb-2">Unique Username</label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400 font-medium">@</span>
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                placeholder="creative_genius"
                className="w-full pl-9 pr-4 py-3 bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded-xl text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand/50 transition-all lowercase"
              />
            </div>
            <p className="text-xs text-neutral-500 mt-1">This will be your unique identifier on the platform.</p>
          </div>
        </div>

        {/* Bio */}
        <div>
          <label className="block text-sm font-semibold text-neutral-900 dark:text-white mb-2">Short Bio</label>
          <textarea
            name="bio"
            value={formData.bio}
            onChange={handleChange}
            placeholder="Tell us a little bit about yourself..."
            rows={4}
            className="w-full px-4 py-3 bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded-xl text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand/50 transition-all resize-none"
          />
        </div>

        {/* Status Messages */}
        {error && (
          <div className="p-4 bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 text-red-600 dark:text-red-400 text-sm font-medium rounded-xl">
            {error}
          </div>
        )}
        {success && (
          <div className="p-4 bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-sm font-medium rounded-xl flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5" />
            Profile updated successfully!
          </div>
        )}

        {/* Submit */}
        <div className="flex justify-end pt-4 border-t border-neutral-100 dark:border-white/[0.05]">
          <button
            type="submit"
            disabled={isSaving}
            className="flex items-center gap-2 px-8 py-3 bg-brand hover:bg-brand/90 text-white font-bold rounded-xl transition-all shadow-[0_4px_14px_rgba(0,95,232,0.3)] hover:shadow-[0_6px_20px_rgba(0,95,232,0.4)] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSaving ? <Loader2 className="w-5 h-5 animate-spin" /> : "Save Changes"}
          </button>
        </div>

      </form>
    </div>
  )
}
