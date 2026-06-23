"use client"

import { useEffect, useState } from "react"
import { DataTable, Column } from "@/components/admin/DataTable"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Check, MessageSquareReply, AlertTriangle, Trash2, Eye } from "lucide-react"

interface Message {
  id: string
  name: string
  email: string
  subject: string | null
  body: string
  status: "UNREAD" | "READ" | "REPLIED" | "SPAM"
  createdAt: string
}

export default function AdminMessagesPage() {
  const [messages, setMessages] = useState<Message[]>([])
  const [loading, setLoading] = useState(true)
  const [expandedId, setExpandedId] = useState<string | null>(null)

  const fetchMessages = async () => {
    setLoading(true)
    try {
      const res = await fetch("/api/messages")
      const json = await res.json()
      if (json.success) {
        setMessages(json.data)
      }
    } catch (err) {
      console.error("Failed to load contact inquiries:", err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchMessages()
  }, [])

  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this message?")) return
    try {
      const res = await fetch(`/api/messages/${id}`, { method: "DELETE" })
      const json = await res.json()
      if (json.success) {
        setMessages(messages.filter((m) => m.id !== id))
        if (expandedId === id) setExpandedId(null)
      }
    } catch (err) {
      console.error(err)
    }
  }

  const handleUpdateStatus = async (id: string, status: "UNREAD" | "READ" | "REPLIED" | "SPAM") => {
    try {
      const res = await fetch(`/api/messages/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      })
      const json = await res.json()
      if (json.success) {
        setMessages(messages.map((m) => (m.id === id ? { ...m, status } : m)))
      }
    } catch (err) {
      console.error(err)
    }
  }

  const handleToggleExpand = (msg: Message) => {
    if (expandedId === msg.id) {
      setExpandedId(null)
    } else {
      setExpandedId(msg.id)
      if (msg.status === "UNREAD") {
        handleUpdateStatus(msg.id, "READ")
      }
    }
  }

  const columns: Column<Message>[] = [
    {
      header: "Sender",
      accessor: (msg) => (
        <div>
          <div className="font-semibold text-neutral-900 dark:text-neutral-100">{msg.name}</div>
          <div className="text-[11px] text-neutral-450">{msg.email}</div>
        </div>
      ),
    },
    {
      header: "Subject",
      accessor: (msg) => (
        <div className="max-w-xs truncate text-neutral-700 dark:text-neutral-300 font-medium">
          {msg.subject || "(No Subject)"}
        </div>
      ),
    },
    {
      header: "Status",
      accessor: (msg) => {
        const styles = {
          UNREAD: "bg-red-105 text-red-700 dark:bg-red-950 dark:text-red-400",
          READ: "bg-neutral-100 text-neutral-600 dark:bg-neutral-800 dark:text-neutral-400",
          REPLIED: "bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400",
          SPAM: "bg-amber-100 text-amber-705 dark:bg-amber-950 dark:text-amber-400",
        }
        return <Badge className={`${styles[msg.status]} border-none text-[10px] font-semibold`}>{msg.status}</Badge>
      },
    },
    {
      header: "Date",
      accessor: (msg) => (
        <span className="text-neutral-500 dark:text-neutral-400 text-xs">
          {new Date(msg.createdAt).toLocaleDateString()}
        </span>
      ),
    },
    {
      header: "Actions",
      accessor: (msg) => (
        <div className="flex items-center gap-2">
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={() => handleUpdateStatus(msg.id, msg.status === "UNREAD" ? "READ" : "UNREAD")}
            className={`h-8 w-8 ${msg.status !== "UNREAD" ? "text-neutral-400" : "text-brand"}`}
            title={msg.status === "UNREAD" ? "Mark as Read" : "Mark as Unread"}
          >
            <Check className="h-4 w-4" />
          </Button>

          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={() => handleUpdateStatus(msg.id, "REPLIED")}
            className={`h-8 w-8 ${msg.status === "REPLIED" ? "text-emerald-500" : "text-neutral-450"}`}
            title="Mark as Replied"
          >
            <MessageSquareReply className="h-4 w-4" />
          </Button>

          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={() => handleUpdateStatus(msg.id, "SPAM")}
            className={`h-8 w-8 ${msg.status === "SPAM" ? "text-amber-500" : "text-neutral-450"}`}
            title="Mark as Spam"
          >
            <AlertTriangle className="h-4 w-4" />
          </Button>

          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={() => handleDelete(msg.id)}
            className="h-8 w-8 text-neutral-450 hover:text-red-500"
            title="Delete Message"
          >
            <Trash2 className="h-4 w-4" />
          </Button>

          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={() => handleToggleExpand(msg)}
            className={`h-8 w-8 ${expandedId === msg.id ? "text-brand bg-neutral-100 dark:bg-neutral-800" : "text-neutral-455"}`}
            title="View Details"
          >
            <Eye className="h-4 w-4" />
          </Button>
        </div>
      ),
      className: "text-right justify-end",
    },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Inquiries & Messages</h2>
        <p className="text-sm text-neutral-500 dark:text-neutral-400">
          Review and manage contact submissions from public visitors.
        </p>
      </div>

      <div className="space-y-4">
        <DataTable
          columns={columns}
          data={messages}
          loading={loading}
          currentPage={1}
          totalCount={messages.length}
          pageSize={messages.length + 1}
          onPageChange={() => {}}
        />

        {expandedId && (
          (() => {
            const activeMsg = messages.find((m) => m.id === expandedId)
            if (!activeMsg) return null

            return (
              <Card className="border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900/50 p-6 animate-in fade-in duration-200">
                <div className="space-y-4">
                  <div className="flex flex-col md:flex-row justify-between border-b border-neutral-200 dark:border-neutral-800 pb-3 gap-2">
                    <div>
                      <h4 className="font-bold text-base text-neutral-850 dark:text-white">
                        {activeMsg.subject || "(No Subject)"}
                      </h4>
                      <p className="text-xs text-neutral-500 mt-1">
                        From: <span className="font-semibold text-neutral-700 dark:text-neutral-300">{activeMsg.name}</span> (&lt;{activeMsg.email}&gt;)
                      </p>
                    </div>
                    <div className="text-left md:text-right">
                      <span className="text-xs text-neutral-400 block">
                        Received: {new Date(activeMsg.createdAt).toLocaleString()}
                      </span>
                      <a href={`mailto:${activeMsg.email}`} className="text-xs font-semibold text-brand hover:underline mt-1 block">
                        Reply via mail client
                      </a>
                    </div>
                  </div>
                  <div className="text-sm leading-relaxed text-neutral-700 dark:text-neutral-300 whitespace-pre-wrap bg-background dark:bg-neutral-950 p-4 rounded-lg border border-neutral-100 dark:border-neutral-850">
                    {activeMsg.body}
                  </div>
                </div>
              </Card>
            )
          })()
        )}
      </div>
    </div>
  )
}
