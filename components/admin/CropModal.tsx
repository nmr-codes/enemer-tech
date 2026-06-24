"use client"

import React, { useRef, useEffect } from "react"
import Cropper from "react-easy-crop"
import { useCrop } from "@/hooks/useCrop"
import { Button } from "@/components/ui/button"
import { Loader2, X, ZoomIn, ZoomOut } from "lucide-react"

interface CropModalProps {
  imageSrc: string
  aspectRatio?: number
  onConfirm: (croppedBlob: Blob) => void
  onCancel: () => void
}

export function CropModal({ imageSrc, aspectRatio = 16 / 9, onConfirm, onCancel }: CropModalProps) {
  const {
    crop,
    setCrop,
    zoom,
    setZoom,
    onCropComplete,
    generateCroppedImage,
    isCropping,
    resetCrop,
  } = useCrop()

  const handleConfirm = async () => {
    const croppedBlob = await generateCroppedImage(imageSrc)
    if (croppedBlob) {
      onConfirm(croppedBlob)
    }
    resetCrop()
  }

  const handleCancel = () => {
    resetCrop()
    onCancel()
  }

  // Prevent background scrolling
  useEffect(() => {
    document.body.style.overflow = "hidden"
    return () => {
      document.body.style.overflow = "auto"
    }
  }, [])

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-white/[0.08] w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-200 dark:border-white/[0.08]">
          <h3 className="font-bold text-lg text-neutral-900 dark:text-white">Crop Image</h3>
          <button
            onClick={handleCancel}
            className="p-2 -mr-2 rounded-lg text-neutral-500 hover:text-neutral-900 dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-white/5 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Cropper Area */}
        <div className="relative w-full h-[400px] sm:h-[500px] bg-neutral-100 dark:bg-black/50">
          <Cropper
            image={imageSrc}
            crop={crop}
            zoom={zoom}
            aspect={aspectRatio}
            onCropChange={setCrop}
            onCropComplete={onCropComplete}
            onZoomChange={setZoom}
            classes={{
              containerClassName: "w-full h-full",
            }}
          />
        </div>

        {/* Controls & Footer */}
        <div className="px-6 py-5 space-y-5 bg-white dark:bg-neutral-900">
          {/* Zoom Slider */}
          <div className="flex items-center gap-4 max-w-md mx-auto">
            <ZoomOut className="h-5 w-5 text-neutral-500 shrink-0" />
            <input
              type="range"
              value={zoom}
              min={1}
              max={3}
              step={0.1}
              aria-label="Zoom"
              onChange={(e) => setZoom(Number(e.target.value))}
              className="w-full h-1.5 bg-neutral-200 dark:bg-neutral-800 rounded-full appearance-none cursor-pointer accent-brand"
            />
            <ZoomIn className="h-5 w-5 text-neutral-500 shrink-0" />
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-3 pt-2">
            <Button type="button" variant="outline" onClick={handleCancel} disabled={isCropping}>
              Cancel
            </Button>
            <Button
              type="button"
              onClick={handleConfirm}
              disabled={isCropping}
              className="bg-brand hover:bg-brand-hover text-white"
            >
              {isCropping ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Cropping...
                </>
              ) : (
                "Crop & Upload"
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
