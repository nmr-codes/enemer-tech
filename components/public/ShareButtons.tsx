"use client"

import { useState } from "react"
import { Send, Link as LinkIcon, Check } from "lucide-react"
import { Twitter } from "@/components/shared/SocialIcons"

interface ShareButtonsProps {
  title: string
  slug: string
}

export function ShareButtons({ title, slug }: { title: string; slug: string }) {
  const [copied, setCopied] = useState(false)

  const shareUrl = typeof window !== "undefined"
    ? `${window.location.origin}/blog/${slug}`
    : `https://abdurasul.dev/blog/${slug}`

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error("Failed to copy link:", err)
    }
  }

  return (
    <div className="space-y-3">
      <h4 className="text-xs font-bold text-neutral-400 dark:text-neutral-500 uppercase tracking-widest">
        Share Article
      </h4>
      <div className="flex items-center gap-2">
        <a
          href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(shareUrl)}`}
          target="_blank"
          rel="noopener noreferrer"
          className="p-2 rounded-lg bg-neutral-100 hover:bg-neutral-200 dark:bg-neutral-900 dark:hover:bg-neutral-800 text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white transition-colors"
          title="Share on Twitter"
        >
          <Twitter className="h-4 w-4" />
        </a>

        <a
          href={`https://t.me/share/url?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(title)}`}
          target="_blank"
          rel="noopener noreferrer"
          className="p-2 rounded-lg bg-neutral-100 hover:bg-neutral-200 dark:bg-neutral-900 dark:hover:bg-neutral-800 text-neutral-400 hover:text-sky-500 transition-colors"
          title="Share on Telegram"
        >
          <Send className="h-4 w-4" />
        </a>

        <button
          onClick={handleCopy}
          className="p-2 rounded-lg bg-neutral-100 hover:bg-neutral-200 dark:bg-neutral-900 dark:hover:bg-neutral-800 text-neutral-600 dark:text-neutral-400 hover:text-brand transition-colors"
          title="Copy Article URL"
        >
          {copied ? (
            <Check className="h-4 w-4 text-emerald-500 animate-in fade-in zoom-in-50" />
          ) : (
            <LinkIcon className="h-4 w-4" />
          )}
        </button>
      </div>
    </div>
  )
}
