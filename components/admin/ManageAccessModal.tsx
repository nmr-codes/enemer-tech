"use client"

import { useState } from "react"
import { updateUserAccess } from "@/app/actions/user"
import { X, Shield, Check, Loader2 } from "lucide-react"

export const AVAILABLE_PERMISSIONS = [
  { id: "manage_posts", label: "Manage Blog Posts" },
  { id: "manage_projects", label: "Manage Projects" },
  { id: "manage_users", label: "Manage Users & Roles" },
  { id: "view_analytics", label: "View Analytics" },
  { id: "manage_settings", label: "Manage Settings" },
]

interface ManageAccessModalProps {
  user: {
    id: string
    name: string | null
    email: string
    role: string
    permissions: string[]
  }
  onClose: () => void
}

export function ManageAccessModal({ user, onClose }: ManageAccessModalProps) {
  const [role, setRole] = useState(user.role)
  const [permissions, setPermissions] = useState<string[]>(user.permissions || [])
  const [isSaving, setIsSaving] = useState(false)

  const togglePermission = (id: string) => {
    setPermissions(prev => 
      prev.includes(id) ? prev.filter(p => p !== id) : [...prev, id]
    )
  }

  const handleSave = async () => {
    try {
      setIsSaving(true)
      await updateUserAccess(user.id, role, permissions)
      onClose()
    } catch (err: any) {
      alert(err.message || "Failed to update access")
    } finally {
      setIsSaving(false)
    }
  }

  const showPermissions = role === "ADMIN" || role === "GHOST"

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-[fadeIn_0.2s_ease-out]">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      
      <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-white/[0.06] rounded-2xl shadow-2xl w-full max-w-md relative z-10 overflow-hidden flex flex-col">
        {/* Header */}
        <div className="p-6 border-b border-neutral-100 dark:border-white/[0.05] flex items-center justify-between">
          <div>
            <h3 className="text-xl font-bold text-neutral-900 dark:text-white flex items-center gap-2">
              <Shield className="w-5 h-5 text-brand" />
              Manage Access
            </h3>
            <p className="text-sm text-neutral-500 mt-1 truncate max-w-[280px]">{user.name || user.email}</p>
          </div>
          <button onClick={onClose} className="p-2 text-neutral-400 hover:text-neutral-900 dark:hover:text-white transition-colors bg-neutral-100 dark:bg-neutral-800 rounded-lg">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-6 overflow-y-auto max-h-[60vh]">
          {/* Role Selection */}
          <div>
            <label className="block text-sm font-semibold text-neutral-900 dark:text-white mb-3">User Role</label>
            <div className="grid grid-cols-2 gap-3">
              {["USER", "GHOST", "ADMIN", "OWNER"].map((r) => (
                <button
                  key={r}
                  onClick={() => setRole(r)}
                  className={`flex flex-col items-start p-3 rounded-xl border-2 transition-all text-left ${
                    role === r 
                      ? "border-brand bg-brand/5 dark:bg-brand/10" 
                      : "border-neutral-100 dark:border-neutral-800 hover:border-neutral-200 dark:hover:border-neutral-700"
                  }`}
                >
                  <span className={`text-sm font-bold ${role === r ? "text-brand" : "text-neutral-700 dark:text-neutral-300"}`}>
                    {r}
                  </span>
                  <span className="text-[10px] text-neutral-500 mt-0.5">
                    {r === "OWNER" && "Full system access"}
                    {r === "ADMIN" && "Custom permissions"}
                    {r === "GHOST" && "Read-only access"}
                    {r === "USER" && "Standard member"}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Permissions Checklist */}
          <div className={`transition-all duration-300 overflow-hidden ${showPermissions ? "opacity-100 max-h-96" : "opacity-0 max-h-0"}`}>
            <label className="block text-sm font-semibold text-neutral-900 dark:text-white mb-3">Custom Permissions</label>
            <div className="space-y-2 bg-neutral-50 dark:bg-neutral-950 p-4 rounded-xl border border-neutral-100 dark:border-white/[0.05]">
              {AVAILABLE_PERMISSIONS.map(p => {
                const isActive = permissions.includes(p.id)
                return (
                  <button
                    key={p.id}
                    onClick={() => togglePermission(p.id)}
                    className="w-full flex items-center justify-between p-2 rounded-lg hover:bg-white dark:hover:bg-neutral-900 transition-colors group"
                  >
                    <span className={`text-sm font-medium ${isActive ? "text-neutral-900 dark:text-white" : "text-neutral-600 dark:text-neutral-400"}`}>
                      {p.label}
                    </span>
                    <div className={`w-5 h-5 rounded flex items-center justify-center transition-colors ${
                      isActive ? "bg-brand text-white" : "bg-neutral-200 dark:bg-neutral-800 text-transparent"
                    }`}>
                      <Check className="w-3.5 h-3.5" />
                    </div>
                  </button>
                )
              })}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-neutral-100 dark:border-white/[0.05] bg-neutral-50 dark:bg-neutral-900/50 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-5 py-2.5 text-sm font-bold text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="flex items-center gap-2 px-6 py-2.5 bg-brand hover:bg-brand/90 text-white text-sm font-bold rounded-xl transition-all shadow-[0_4px_14px_rgba(0,95,232,0.3)] disabled:opacity-50"
          >
            {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : "Save Access"}
          </button>
        </div>
      </div>
    </div>
  )
}
