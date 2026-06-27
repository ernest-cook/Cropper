"use client"

import ReactCropComponent, { type Crop, type PercentCrop, type PixelCrop } from "react-image-crop"
import "react-image-crop/dist/ReactCrop.css"

interface Props {
  imageSrc: string | null
  crop: Crop | undefined
  aspect: number | undefined
  onChange: (crop: PercentCrop) => void
  onComplete: (crop: PercentCrop) => void
}

export default function Cropper({ imageSrc, crop, aspect, onChange, onComplete }: Props) {
  if (!imageSrc) {
    return (
      <div className="flex h-64 items-center justify-center rounded-lg border-2 border-dashed border-zinc-300 dark:border-zinc-600 bg-zinc-50 dark:bg-zinc-800/50">
        <p className="text-sm text-zinc-400 dark:text-zinc-500">
          Enter an image URL to begin
        </p>
      </div>
    )
  }

  return (
    <div className="overflow-hidden rounded-lg border border-zinc-200 dark:border-zinc-700">
      <ReactCropComponent
        crop={crop}
        aspect={aspect}
        onChange={(_pixelCrop: PixelCrop, percentCrop: PercentCrop) => onChange(percentCrop)}
        onComplete={(_pixelCrop: PixelCrop, percentCrop: PercentCrop) => onComplete(percentCrop)}
      >
        <img
          src={imageSrc}
          crossOrigin="anonymous"
          alt="Crop target"
          className="max-h-[65vh] max-w-full"
        />
      </ReactCropComponent>
    </div>
  )
}
