"use client"

import { useState } from "react"
import { generateUsersCSV } from "@/app/actions/user"
import { Download, Link as LinkIcon, Check } from "lucide-react"

export function UserHeaderActions() {
  const [isExporting, setIsExporting] = useState(false)
  const [copied, setCopied] = useState(false)

  const handleExportCSV = async () => {
    try {
      setIsExporting(true)
      const csvData = await generateUsersCSV()
      const blob = new Blob([csvData], { type: 'text/csv;charset=utf-8;' })
      const url = URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.setAttribute('download', `enemer-users-${new Date().toISOString().split('T')[0]}.csv`)
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    } catch (err) {
      alert("Failed to export CSV. You might not be an admin.")
    } finally {
      setIsExporting(false)
    }
  }

  const handleInvite = () => {
    const inviteUrl = `${window.location.origin}/auth/login`
    navigator.clipboard.writeText(inviteUrl)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="flex items-center gap-2">
      <button 
        onClick={handleExportCSV}
        disabled={isExporting}
        className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg text-sm font-medium hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors shadow-sm disabled:opacity-50"
      >
        <Download className="w-4 h-4" />
        {isExporting ? "Exporting..." : "Export CSV"}
      </button>
      <button 
        onClick={handleInvite}
        className="flex items-center gap-2 px-4 py-2 bg-brand text-white rounded-lg text-sm font-medium hover:bg-brand/90 transition-colors shadow-[0_4px_14px_rgba(0,95,232,0.3)]"
      >
        {copied ? <Check className="w-4 h-4" /> : <LinkIcon className="w-4 h-4" />}
        {copied ? "Copied Link!" : "Invite User"}
      </button>
    </div>
  )
}
