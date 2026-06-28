"use client"

import { useState } from "react"
import { addComment, deleteComment } from "@/app/actions/comments"
import { formatDistanceToNow } from "date-fns"
import { MessageSquare, Reply, Trash2, User as UserIcon, Loader2 } from "lucide-react"

// Types to match the Prisma include
type CommentUser = {
  id: string
  name: string | null
  image: string | null
}

export type CommentType = {
  id: string
  content: string
  postId: string
  userId: string
  parentId: string | null
  createdAt: Date
  user: CommentUser
}

interface BlogCommentsProps {
  postId: string
  comments: CommentType[]
  currentUserId?: string
  isAdmin?: boolean
}

export function BlogComments({ postId, comments, currentUserId, isAdmin }: BlogCommentsProps) {
  const [replyingTo, setReplyingTo] = useState<string | null>(null)
  
  // Organize comments into threads
  const topLevelComments = comments.filter(c => !c.parentId)
  const replies = comments.filter(c => c.parentId)

  const getReplies = (parentId: string) => {
    return replies.filter(c => c.parentId === parentId).sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime())
  }

  return (
    <div className="mt-16 pt-10 border-t border-neutral-200 dark:border-neutral-800 animate-[fadeIn_0.5s_ease-out]">
      <div className="flex items-center gap-3 mb-8">
        <MessageSquare className="w-6 h-6 text-brand" />
        <h3 className="text-2xl font-bold text-neutral-900 dark:text-white">Discussion</h3>
        <span className="bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 px-3 py-1 rounded-full text-sm font-semibold">
          {comments.length}
        </span>
      </div>

      {currentUserId ? (
        <CommentForm postId={postId} />
      ) : (
        <div className="bg-neutral-50 dark:bg-neutral-900/50 border border-neutral-200 dark:border-neutral-800 rounded-2xl p-6 text-center mb-10">
          <p className="text-neutral-600 dark:text-neutral-400 mb-4">You must be logged in to join the conversation.</p>
          <a href="/auth/login" className="inline-flex px-6 py-2.5 bg-brand hover:bg-brand/90 text-white font-medium rounded-xl transition-colors shadow-sm">
            Log In or Sign Up
          </a>
        </div>
      )}

      <div className="space-y-8">
        {topLevelComments.length > 0 ? (
          topLevelComments.map(comment => (
            <CommentThread 
              key={comment.id} 
              comment={comment} 
              replies={getReplies(comment.id)} 
              postId={postId}
              currentUserId={currentUserId}
              isAdmin={isAdmin}
              replyingTo={replyingTo}
              setReplyingTo={setReplyingTo}
            />
          ))
        ) : (
          <p className="text-neutral-500 dark:text-neutral-400 text-center py-8 italic">No comments yet. Be the first to share your thoughts!</p>
        )}
      </div>
    </div>
  )
}

function CommentThread({ 
  comment, 
  replies, 
  postId, 
  currentUserId, 
  isAdmin,
  replyingTo,
  setReplyingTo
}: { 
  comment: CommentType
  replies: CommentType[]
  postId: string
  currentUserId?: string
  isAdmin?: boolean
  replyingTo: string | null
  setReplyingTo: (id: string | null) => void
}) {
  return (
    <div className="flex gap-4">
      {/* Avatar */}
      <div className="w-10 h-10 rounded-full bg-neutral-100 dark:bg-neutral-800 shrink-0 overflow-hidden ring-2 ring-white dark:ring-neutral-950 shadow-sm z-10 relative">
        {comment.user.image ? (
          <img src={comment.user.image} alt={comment.user.name || "User"} className="w-full h-full object-cover" />
        ) : (
          <UserIcon className="w-5 h-5 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-neutral-400" />
        )}
      </div>

      <div className="flex-1 space-y-4">
        {/* Main Comment */}
        <CommentCard 
          comment={comment} 
          currentUserId={currentUserId} 
          isAdmin={isAdmin} 
          onReply={() => setReplyingTo(replyingTo === comment.id ? null : comment.id)}
        />

        {/* Reply Form */}
        {replyingTo === comment.id && currentUserId && (
          <div className="mt-4 animate-[slideDown_0.2s_ease]">
            <CommentForm postId={postId} parentId={comment.id} onSuccess={() => setReplyingTo(null)} autoFocus />
          </div>
        )}

        {/* Nested Replies */}
        {replies.length > 0 && (
          <div className="space-y-4 pt-2">
            {replies.map(reply => (
              <div key={reply.id} className="flex gap-3 relative before:absolute before:-left-[39px] before:top-5 before:w-6 before:h-[1px] before:bg-neutral-200 dark:before:bg-neutral-800">
                <div className="w-8 h-8 rounded-full bg-neutral-100 dark:bg-neutral-800 shrink-0 overflow-hidden shadow-sm relative">
                  {reply.user.image ? (
                    <img src={reply.user.image} alt={reply.user.name || "User"} className="w-full h-full object-cover" />
                  ) : (
                    <UserIcon className="w-4 h-4 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-neutral-400" />
                  )}
                </div>
                <div className="flex-1">
                  <CommentCard comment={reply} currentUserId={currentUserId} isAdmin={isAdmin} isReply />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

function CommentCard({ 
  comment, 
  currentUserId, 
  isAdmin, 
  onReply,
  isReply = false
}: { 
  comment: CommentType
  currentUserId?: string
  isAdmin?: boolean
  onReply?: () => void
  isReply?: boolean
}) {
  const [isDeleting, setIsDeleting] = useState(false)
  const canDelete = currentUserId === comment.userId || isAdmin

  const handleDelete = async () => {
    if (!confirm("Delete this comment?")) return
    try {
      setIsDeleting(true)
      await deleteComment(comment.id)
    } catch (err) {
      alert("Failed to delete comment")
      setIsDeleting(false)
    }
  }

  return (
    <div className={`p-4 rounded-2xl ${isReply ? 'bg-neutral-50 dark:bg-neutral-900/40 border border-neutral-100 dark:border-neutral-800/60' : 'bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800'} shadow-sm relative group`}>
      <div className="flex justify-between items-start mb-2">
        <div className="flex items-center gap-2">
          <span className="font-bold text-sm text-neutral-900 dark:text-white">
            {comment.user.name || "Anonymous User"}
          </span>
          <span className="text-xs text-neutral-400 dark:text-neutral-500">•</span>
          <span className="text-xs font-medium text-neutral-500 dark:text-neutral-400">
            {formatDistanceToNow(new Date(comment.createdAt))} ago
          </span>
        </div>
        
        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          {onReply && currentUserId && (
            <button onClick={onReply} className="p-1.5 text-neutral-400 hover:text-brand hover:bg-brand/10 rounded-md transition-colors" title="Reply">
              <Reply className="w-3.5 h-3.5" />
            </button>
          )}
          {canDelete && (
            <button onClick={handleDelete} disabled={isDeleting} className="p-1.5 text-neutral-400 hover:text-red-500 hover:bg-red-500/10 rounded-md transition-colors disabled:opacity-50" title="Delete">
              {isDeleting ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Trash2 className="w-3.5 h-3.5" />}
            </button>
          )}
        </div>
      </div>
      
      <p className="text-sm text-neutral-700 dark:text-neutral-300 leading-relaxed whitespace-pre-wrap">
        {comment.content}
      </p>
    </div>
  )
}

function CommentForm({ postId, parentId, onSuccess, autoFocus }: { postId: string, parentId?: string, onSuccess?: () => void, autoFocus?: boolean }) {
  const [content, setContent] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!content.trim()) return
    
    setIsSubmitting(true)
    setError(null)
    try {
      await addComment({ postId, content, parentId })
      setContent("")
      if (onSuccess) onSuccess()
    } catch (err: any) {
      setError(err.message || "Failed to post comment")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="mb-8 relative">
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder={parentId ? "Write a reply..." : "Share your thoughts on this post..."}
        rows={parentId ? 2 : 3}
        autoFocus={autoFocus}
        className="w-full px-4 py-3 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand/50 transition-all resize-none text-sm placeholder:text-neutral-400"
      />
      
      <div className="flex justify-between items-center mt-2">
        {error ? (
          <span className="text-xs text-red-500 font-medium">{error}</span>
        ) : <span />}
        
        <div className="flex gap-2">
          {parentId && onSuccess && (
            <button type="button" onClick={onSuccess} className="px-4 py-2 text-xs font-semibold text-neutral-500 hover:text-neutral-900 dark:hover:text-white transition-colors">
              Cancel
            </button>
          )}
          <button
            type="submit"
            disabled={isSubmitting || !content.trim()}
            className="px-5 py-2 bg-brand hover:bg-brand/90 text-white text-sm font-bold rounded-lg transition-all disabled:opacity-50 shadow-sm"
          >
            {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin mx-auto" /> : (parentId ? "Reply" : "Post Comment")}
          </button>
        </div>
      </div>
    </form>
  )
}
