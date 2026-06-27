"use client"

import { useState, useEffect, useCallback } from "react"

interface Props {
  crop: { x: number; y: number; width: number; height: number } | null
  imageSrc: string | null
  fileName: string
  targetWidth: number
  targetHeight: number
}

export default function CropPreview({ crop, imageSrc, fileName, targetWidth, targetHeight }: Props) {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)

  const generatePreview = useCallback(() => {
    if (!crop || !imageSrc || crop.width <= 0 || crop.height <= 0) {
      setPreviewUrl(null)
      return
    }

    const img = new Image()
    img.crossOrigin = "anonymous"
    img.onload = () => {
      const pixelX = (crop.x / 100) * img.naturalWidth
      const pixelY = (crop.y / 100) * img.naturalHeight
      const pixelW = (crop.width / 100) * img.naturalWidth
      const pixelH = (crop.height / 100) * img.naturalHeight

      const sourceCanvas = document.createElement("canvas")
      sourceCanvas.width = Math.round(pixelW)
      sourceCanvas.height = Math.round(pixelH)

      const sourceCtx = sourceCanvas.getContext("2d")
      if (!sourceCtx) return

      sourceCtx.drawImage(
        img,
        pixelX, pixelY, pixelW, pixelH,
        0, 0, sourceCanvas.width, sourceCanvas.height
      )

      const destCanvas = document.createElement("canvas")
      destCanvas.width = targetWidth
      destCanvas.height = targetHeight

      const destCtx = destCanvas.getContext("2d")
      if (!destCtx) return

      destCtx.drawImage(sourceCanvas, 0, 0, targetWidth, targetHeight)

      destCanvas.toBlob((blob) => {
        if (blob) {
          const url = URL.createObjectURL(blob)
          setPreviewUrl((prev) => {
            if (prev) URL.revokeObjectURL(prev)
            return url
          })
        }
      })
    }
    img.src = imageSrc
  }, [crop, imageSrc, targetWidth, targetHeight])

  useEffect(() => {
    const t = setTimeout(generatePreview, 100)
    return () => clearTimeout(t)
  }, [generatePreview])

  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl)
    }
  }, [])

  if (!previewUrl) {
    return (
      <div className="flex items-center justify-center w-full h-full min-h-[80px] rounded-lg bg-zinc-100 dark:bg-zinc-800">
        <p className="text-xs text-zinc-400 dark:text-zinc-500">Preview</p>
      </div>
    )
  }

  return (
    <div className="space-y-1">
      <p className="text-xs text-zinc-500 dark:text-zinc-400">{fileName}</p>
      <img
        src={previewUrl}
        alt="Crop preview"
        className="max-w-full max-h-48 rounded-lg border border-zinc-200 dark:border-zinc-700 object-contain"
      />
    </div>
  )
}
