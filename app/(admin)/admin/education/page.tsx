"use client"

import { useState, useEffect } from "react"
import { Plus, Edit2, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"

interface Education {
  id: string
  year: string
  title: string
  titleUz: string | null
  organization: string
  organizationUz: string | null
  description: string
  descriptionUz: string | null
  order: number
}

export default function AdminEducationPage() {
  const [items, setItems] = useState<Education[]>([])
  const [loading, setLoading] = useState(true)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingItem, setEditingItem] = useState<Education | null>(null)
  const [formData, setFormData] = useState({
    year: "", title: "", titleUz: "", organization: "", organizationUz: "", description: "", descriptionUz: "", order: 0
  })

  const fetchItems = async () => {
    try {
      const res = await fetch("/api/education")
      const json = await res.json()
      if (json.success) setItems(json.data)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchItems()
  }, [])

  const handleOpenDialog = (item?: Education) => {
    if (item) {
      setEditingItem(item)
      setFormData({
        year: item.year, title: item.title, titleUz: item.titleUz || "",
        organization: item.organization, organizationUz: item.organizationUz || "",
        description: item.description, descriptionUz: item.descriptionUz || "",
        order: item.order
      })
    } else {
      setEditingItem(null)
      setFormData({
        year: "", title: "", titleUz: "", organization: "", organizationUz: "", description: "", descriptionUz: "", order: 0
      })
    }
    setIsDialogOpen(true)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const payload = {
      ...formData,
      order: Number(formData.order)
    }
    const url = editingItem ? `/api/education/${editingItem.id}` : "/api/education"
    const method = editingItem ? "PUT" : "POST"

    try {
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      })
      if (res.ok) {
        setIsDialogOpen(false)
        fetchItems()
      }
    } catch (err) {
      console.error(err)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this education?")) return
    try {
      const res = await fetch(`/api/education/${id}`, { method: "DELETE" })
      if (res.ok) fetchItems()
    } catch (err) {
      console.error(err)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Education Timeline</h1>
        <Button onClick={() => handleOpenDialog()} className="bg-brand text-white">
          <Plus className="h-4 w-4 mr-2" /> Add Education
        </Button>
      </div>

      {loading ? (
        <div className="animate-pulse h-32 bg-neutral-100 dark:bg-neutral-900 rounded-xl" />
      ) : (
        <div className="space-y-4">
          {items.map((item) => (
            <div key={item.id} className="p-4 rounded-xl border bg-white dark:bg-neutral-900 shadow-sm flex items-start justify-between">
              <div>
                <h3 className="font-bold">{item.title} <span className="text-sm font-normal text-neutral-500">at {item.organization}</span></h3>
                <p className="text-sm text-brand font-mono">{item.year}</p>
                <p className="text-sm mt-2 text-neutral-600 dark:text-neutral-400">{item.description}</p>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="icon" onClick={() => handleOpenDialog(item)}>
                  <Edit2 className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon" onClick={() => handleDelete(item.id)} className="text-red-500 hover:text-red-600">
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
          {items.length === 0 && <p className="text-neutral-500">No education added yet.</p>}
        </div>
      )}

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-xl">
          <DialogHeader>
            <DialogTitle>{editingItem ? "Edit Education" : "Add Education"}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Year (e.g. 2018 - 2022)</Label>
                <Input required value={formData.year} onChange={(e) => setFormData({...formData, year: e.target.value})} />
              </div>
              <div className="space-y-2">
                <Label>Order (Sorting)</Label>
                <Input type="number" required value={formData.order} onChange={(e) => setFormData({...formData, order: Number(e.target.value)})} />
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Title (EN)</Label>
                <Input required value={formData.title} onChange={(e) => setFormData({...formData, title: e.target.value})} />
              </div>
              <div className="space-y-2">
                <Label>Title (UZ)</Label>
                <Input value={formData.titleUz} onChange={(e) => setFormData({...formData, titleUz: e.target.value})} />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Organization (EN)</Label>
                <Input required value={formData.organization} onChange={(e) => setFormData({...formData, organization: e.target.value})} />
              </div>
              <div className="space-y-2">
                <Label>Organization (UZ)</Label>
                <Input value={formData.organizationUz} onChange={(e) => setFormData({...formData, organizationUz: e.target.value})} />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Description (EN)</Label>
              <Textarea required rows={3} value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} />
            </div>
            <div className="space-y-2">
              <Label>Description (UZ)</Label>
              <Textarea rows={3} value={formData.descriptionUz} onChange={(e) => setFormData({...formData, descriptionUz: e.target.value})} />
            </div>

            <DialogFooter>
              <Button type="submit" className="bg-brand hover:bg-brand-hover text-white">Save Changes</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
