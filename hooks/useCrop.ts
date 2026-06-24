import { useState, useCallback } from "react"
import { getCroppedImg } from "@/lib/cropImage"

export function useCrop() {
  const [crop, setCrop] = useState({ x: 0, y: 0 })
  const [zoom, setZoom] = useState(1)
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<{
    width: number
    height: number
    x: number
    y: number
  } | null>(null)
  const [isCropping, setIsCropping] = useState(false)

  const onCropComplete = useCallback((_croppedArea: any, croppedAreaPixels: any) => {
    setCroppedAreaPixels(croppedAreaPixels)
  }, [])

  const generateCroppedImage = useCallback(
    async (imageSrc: string): Promise<Blob | null> => {
      if (!croppedAreaPixels) return null

      setIsCropping(true)
      try {
        const croppedImageBlob = await getCroppedImg(imageSrc, croppedAreaPixels)
        return croppedImageBlob
      } catch (e) {
        console.error("Error creating cropped image", e)
        return null
      } finally {
        setIsCropping(false)
      }
    },
    [croppedAreaPixels]
  )

  const resetCrop = useCallback(() => {
    setCrop({ x: 0, y: 0 })
    setZoom(1)
    setCroppedAreaPixels(null)
  }, [])

  return {
    crop,
    setCrop,
    zoom,
    setZoom,
    onCropComplete,
    generateCroppedImage,
    isCropping,
    resetCrop,
  }
}
