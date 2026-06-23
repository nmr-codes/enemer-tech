"use client"

import { useEffect, useState } from "react"
import { generateSlug } from "@/lib/utils"

interface HeadingItem {
  id: string
  text: string
  level: number
}

interface TableOfContentsProps {
  content: string | null
}

export function TableOfContents({ content }: TableOfContentsProps) {
  const [headings, setHeadings] = useState<HeadingItem[]>([])

  useEffect(() => {
    if (!content) return

    const headingRegex = /<h(2|3)[^>]*>([\s\S]*?)<\/h\1>/gi
    const foundHeadings: HeadingItem[] = []
    let match

    while ((match = headingRegex.exec(content)) !== null) {
      const level = parseInt(match[1])
      const rawText = match[2]
      const text = rawText.replace(/<[^>]*>/g, "").trim()
      const id = generateSlug(text)

      foundHeadings.push({ id, text, level })
    }

    setHeadings(foundHeadings)
  }, [content])

  if (headings.length === 0) return null

  return (
    <div className="space-y-4">
      <h4 className="text-xs font-bold text-neutral-400 dark:text-neutral-500 uppercase tracking-widest">
        On this page
      </h4>
      <ul className="space-y-2 text-sm border-l border-neutral-100 dark:border-neutral-900 pl-4">
        {headings.map((item, i) => (
          <li
            key={item.id + i}
            style={{ paddingLeft: item.level === 3 ? "0.75rem" : "0" }}
          >
            <a
              href={`#${item.id}`}
              className="text-neutral-500 hover:text-brand dark:text-neutral-400 dark:hover:text-brand transition-colors block leading-relaxed line-clamp-2"
            >
              {item.text}
            </a>
          </li>
        ))}
      </ul>
    </div>
  )
}
