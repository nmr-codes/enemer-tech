"use client"

import { useState, useRef } from "react"
import { UploadCloud, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { CropModal } from "./CropModal"

interface ImageUploadProps {
  value: string
  onChange: (url: string) => void
  folder?: string
  aspectRatio?: number
}

export function ImageUpload({ value, onChange, folder = "portfolio", aspectRatio = 16 / 9 }: ImageUploadProps) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  
  // Crop states
  const [selectedImageStr, setSelectedImageStr] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Create a temporary object URL to feed to the cropper
    const objectUrl = URL.createObjectURL(file)
    setSelectedImageStr(objectUrl)
    
    // Reset file input so same file can be selected again if canceled
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  const handleUploadCropped = async (croppedBlob: Blob) => {
    setSelectedImageStr(null) // close modal
    setError(null)
    setLoading(true)

    // Append standard generic filename (Supabase will likely give it a unique UUID or we can construct one)
    const file = new File([croppedBlob], "cropped-image.jpg", { type: "image/jpeg" })

    const formData = new FormData()
    formData.append("file", file)
    formData.append("folder", folder)

    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      })
      const json = await res.json()
      if (json.success) {
        onChange(json.url)
      } else {
        setError(json.error || "Failed to upload image")
      }
    } catch (err) {
      setError("An error occurred during upload.")
    } finally {
      setLoading(false)
    }
  }

  const handleRemove = async () => {
    if (!value) return
    setLoading(true)
    try {
      const res = await fetch("/api/upload", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: value }),
      })
      const json = await res.json()
      if (json.success || !res.ok) {
        onChange("")
      }
    } catch (err) {
      console.error(err)
      onChange("")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-4 w-full">
      {/* Crop Modal */}
      {selectedImageStr && (
        <CropModal
          imageSrc={selectedImageStr}
          aspectRatio={aspectRatio}
          onConfirm={handleUploadCropped}
          onCancel={() => {
            URL.revokeObjectURL(selectedImageStr)
            setSelectedImageStr(null)
          }}
        />
      )}
      {value ? (
        <div className="relative aspect-video max-w-sm rounded-lg overflow-hidden border border-neutral-200 dark:border-neutral-800 bg-neutral-100 dark:bg-neutral-900 group">
          <img src={value} alt="Uploaded preview" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-neutral-950/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
            <Button
              type="button"
              variant="destructive"
              size="icon"
              onClick={handleRemove}
              disabled={loading}
              className="h-9 w-9"
            >
              <X className="h-5 w-5" />
            </Button>
          </div>
        </div>
      ) : (
        <label className="flex flex-col items-center justify-center border-2 border-dashed border-neutral-300 dark:border-neutral-800 rounded-lg p-6 cursor-pointer hover:border-brand dark:hover:border-brand hover:bg-neutral-50 dark:hover:bg-neutral-950 transition-colors">
          <div className="flex flex-col items-center justify-center space-y-2 text-center">
            <UploadCloud className="h-10 w-10 text-neutral-400" />
            <div className="text-sm font-medium">
              {loading ? "Uploading..." : "Click to upload image"}
            </div>
            <p className="text-xs text-neutral-400">PNG, JPG, WEBP, GIF up to 5MB</p>
          </div>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleFileSelect}
            disabled={loading}
          />
        </label>
      )}
      {error && <p className="text-xs text-red-500 font-medium">{error}</p>}
    </div>
  )
}
