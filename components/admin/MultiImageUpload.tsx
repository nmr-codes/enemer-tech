"use client"

import { useState, useRef } from "react"
import { UploadCloud, X, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { CropModal } from "./CropModal"

interface MultiImageUploadProps {
  value: string[]
  onChange: (urls: string[]) => void
  maxFiles?: number
  aspectRatio?: number
}

export function MultiImageUpload({ value = [], onChange, maxFiles = 6, aspectRatio = 16 / 9 }: MultiImageUploadProps) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fileInputRef = useRef<HTMLInputElement>(null)
  
  // Cropping queue states
  const [cropQueue, setCropQueue] = useState<File[]>([])
  const [croppedFiles, setCroppedFiles] = useState<File[]>([])
  const [currentCropUrl, setCurrentCropUrl] = useState<string | null>(null)

  // Start the cropping queue
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files || files.length === 0) return

    if (value.length + files.length > maxFiles) {
      setError(`You can only upload up to ${maxFiles} images.`)
      return
    }

    setError(null)
    const filesArray = Array.from(files)
    setCropQueue(filesArray)
    setCurrentCropUrl(URL.createObjectURL(filesArray[0]))

    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  // Next item in crop queue or upload if done
  const handleNextCrop = async (croppedBlob?: Blob) => {
    // If a crop was confirmed, add it to the list
    let updatedCropped = [...croppedFiles]
    if (croppedBlob) {
      const newFile = new File([croppedBlob], `cropped-${Date.now()}.jpg`, { type: "image/jpeg" })
      updatedCropped.push(newFile)
      setCroppedFiles(updatedCropped)
    }

    if (currentCropUrl) {
      URL.revokeObjectURL(currentCropUrl)
      setCurrentCropUrl(null)
    }

    // Process next item
    const remainingQueue = cropQueue.slice(1)
    setCropQueue(remainingQueue)

    if (remainingQueue.length > 0) {
      setCurrentCropUrl(URL.createObjectURL(remainingQueue[0]))
    } else {
      // Queue is empty, start upload logic if we have cropped files
      if (updatedCropped.length > 0) {
        uploadFiles(updatedCropped)
      }
      setCroppedFiles([]) // Reset state
    }
  }

  const uploadFiles = async (filesToUpload: File[]) => {
    setLoading(true)

    const uploadPromises = filesToUpload.map(async (file) => {
      const formData = new FormData()
      formData.append("file", file)
      formData.append("folder", "projects")

      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      })
      const json = await res.json()
      if (json.success) {
        return json.url
      } else {
        throw new Error(json.error || "Failed to upload file")
      }
    })

    try {
      const urls = await Promise.all(uploadPromises)
      onChange([...value, ...urls])
    } catch (err: any) {
      setError(err.message || "An error occurred during upload.")
    } finally {
      setLoading(false)
    }
  }

  const handleRemove = async (urlToRemove: string) => {
    try {
      const updatedList = value.filter((url) => url !== urlToRemove)
      onChange(updatedList)

      await fetch("/api/upload", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: urlToRemove }),
      })
    } catch (err) {
      console.error("Failed to delete image from storage:", err)
    }
  }

  return (
    <div className="space-y-4 w-full">
      {/* Sequential Cropping Modal */}
      {currentCropUrl && (
        <CropModal
          imageSrc={currentCropUrl}
          aspectRatio={aspectRatio}
          onConfirm={(blob) => handleNextCrop(blob)}
          onCancel={() => {
            // Cancel everything if the user cancels one crop
            if (currentCropUrl) URL.revokeObjectURL(currentCropUrl)
            setCurrentCropUrl(null)
            setCropQueue([])
            setCroppedFiles([])
          }}
        />
      )}
      {value.length < maxFiles && (
        <label className="flex flex-col items-center justify-center border-2 border-dashed border-neutral-300 dark:border-neutral-800 rounded-lg p-6 cursor-pointer hover:border-brand dark:hover:border-brand hover:bg-neutral-50 dark:hover:bg-neutral-950 transition-colors">
          <div className="flex flex-col items-center justify-center space-y-2 text-center">
            {loading ? (
              <Loader2 className="h-10 w-10 text-brand animate-spin" />
            ) : (
              <UploadCloud className="h-10 w-10 text-neutral-400" />
            )}
            <div className="text-sm font-medium">
              {loading ? "Uploading images..." : "Click to upload gallery images"}
            </div>
            <p className="text-xs text-neutral-400">
              Upload up to {maxFiles - value.length} more images (Max 5MB each)
            </p>
          </div>
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept="image/*"
            className="hidden"
            onChange={handleFileSelect}
            disabled={loading}
          />
        </label>
      )}

      {error && <p className="text-xs text-red-500 font-semibold">{error}</p>}

      {value.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {value.map((url, i) => (
            <div
              key={url + i}
              className="relative aspect-square rounded-lg overflow-hidden border border-neutral-200 dark:border-neutral-800 bg-neutral-100 dark:bg-neutral-900 group"
            >
              <img src={url} alt={`Gallery item ${i + 1}`} className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-neutral-950/45 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <Button
                  type="button"
                  variant="destructive"
                  size="icon"
                  onClick={() => handleRemove(url)}
                  className="h-8 w-8"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
