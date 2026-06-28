"use client"

import { useState } from "react"
import { toggleUserRole, revokeUserSessions, deleteUser } from "@/app/actions/user"
import { ShieldCheck, LogOut, MoreHorizontal, Loader2 } from "lucide-react"

interface UserTableActionsProps {
  userId: string
}

export function UserTableActions({ userId }: UserTableActionsProps) {
  const [isToggling, setIsToggling] = useState(false)
  const [isRevoking, setIsRevoking] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)

  const handleToggleRole = async () => {
    try {
      setIsToggling(true)
      await toggleUserRole(userId)
    } catch (err) {
      alert("Failed to toggle role. You must be an ADMIN.")
    } finally {
      setIsToggling(false)
    }
  }

  const handleRevoke = async () => {
    if (!confirm("Are you sure you want to log this user out of all active sessions?")) return
    try {
      setIsRevoking(true)
      await revokeUserSessions(userId)
    } catch (err) {
      alert("Failed to revoke sessions. You must be an ADMIN.")
    } finally {
      setIsRevoking(false)
    }
  }

  const handleDelete = async () => {
    if (!confirm("WARNING: This will permanently delete this user and all associated authentication data. Continue?")) return
    try {
      setIsDeleting(true)
      await deleteUser(userId)
    } catch (err) {
      alert("Failed to delete user. You must be an ADMIN.")
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
      <button 
        onClick={handleToggleRole}
        disabled={isToggling}
        className="p-2 rounded-lg bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 hover:text-brand hover:bg-brand/10 transition-colors disabled:opacity-50" 
        title="Manage Role"
      >
        {isToggling ? <Loader2 className="w-4 h-4 animate-spin" /> : <ShieldCheck className="w-4 h-4" />}
      </button>
      <button 
        onClick={handleRevoke}
        disabled={isRevoking}
        className="p-2 rounded-lg bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 hover:text-orange-500 hover:bg-orange-500/10 transition-colors disabled:opacity-50" 
        title="Revoke Sessions"
      >
        {isRevoking ? <Loader2 className="w-4 h-4 animate-spin" /> : <LogOut className="w-4 h-4" />}
      </button>
      <button 
        onClick={handleDelete}
        disabled={isDeleting}
        className="p-2 rounded-lg bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 hover:text-red-500 hover:bg-red-500/10 transition-colors disabled:opacity-50" 
        title="Delete User"
      >
        {isDeleting ? <Loader2 className="w-4 h-4 animate-spin" /> : <MoreHorizontal className="w-4 h-4" />}
      </button>
    </div>
  )
}
