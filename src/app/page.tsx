"use client"

import { useState, useCallback } from "react"
import type { PercentCrop } from "react-image-crop"
import LocalFileInput from "@/components/LocalFileInput"
import UrlInput from "@/components/UrlInput"
import ResolutionSelector from "@/components/ResolutionSelector"
import Cropper from "@/components/Cropper"
import CropPreview from "@/components/CropPreview"
import DownloadButton from "@/components/DownloadButton"

function getFileName(imageSrc: string | null, presetLabel: string): string {
  if (!imageSrc) return "cropped.png"
  const safeLabel = presetLabel.replace(/[^a-zA-Z0-9]/g, "-").replace(/-+/g, "-").replace(/^-|-$/g, "")
  return `cropped-${safeLabel}.png`
}

export default function Home() {
  const [imageSrc, setImageSrc] = useState<string | null>(null)
  const [selectedPreset, setSelectedPreset] = useState("16:9 (1920×1080)")
  const [customWidth, setCustomWidth] = useState(1920)
  const [customHeight, setCustomHeight] = useState(1080)
  const [cropMode, setCropMode] = useState<"preset" | "custom">("preset")
  const [aspect, setAspect] = useState<number | undefined>(16 / 9)
  const [crop, setCrop] = useState<PercentCrop | undefined>(undefined)
  const [completedCrop, setCompletedCrop] = useState<PercentCrop | null>(null)
  const [targetWidth, setTargetWidth] = useState(1920)
  const [targetHeight, setTargetHeight] = useState(1080)

  const [inputMode, setInputMode] = useState<"url" | "local">("url")

  const handleImageLoad = useCallback((url: string) => {
    setImageSrc(url)
    setCrop(undefined)
    setCompletedCrop(null)
  }, [])

  const handleClear = useCallback(() => {
    setImageSrc(null)
    setCrop(undefined)
    setCompletedCrop(null)
  }, [])

  const handleSelectPreset = useCallback((label: string, width: number, height: number) => {
    setSelectedPreset(label)
    setCropMode("preset")
    setTargetWidth(width)
    setTargetHeight(height)
    const newAspect = width / height
    setAspect(newAspect)
    setCrop(undefined)
  }, [])

  const handleSelectCustom = useCallback((width: number, height: number) => {
    setCustomWidth(width)
    setCustomHeight(height)
    setSelectedPreset("custom")
    setCropMode("custom")
    setTargetWidth(width)
    setTargetHeight(height)
    const newAspect = width / height
    setAspect(newAspect)
    setCrop(undefined)
  }, [])

  const onCropChange = useCallback((percentCrop: PercentCrop) => {
    setCrop(percentCrop)
  }, [])

  const onCropComplete = useCallback((percentCrop: PercentCrop) => {
    setCompletedCrop(percentCrop)
  }, [])

  const displayLabel =
    cropMode === "custom"
      ? `custom-${targetWidth}x${targetHeight}`
      : selectedPreset
  const fileName = getFileName(imageSrc, displayLabel)

  return (
    <div className="flex flex-col flex-1 bg-zinc-50 dark:bg-black font-sans">
      <main className="flex-1 w-full max-w-6xl mx-auto px-4 py-6 space-y-6">
        <div className="text-center">
          <h1 className="text-2xl font-semibold text-zinc-900 dark:text-zinc-100">
            Image Cropper
          </h1>
          <p className="text-sm text-zinc-500 dark:text-zinc-400">
            Load an image, choose a resolution, and drag the box to crop.
          </p>
        </div>

        <div className="flex justify-center gap-1 mb-4">
          <button
            onClick={() => setInputMode("url")}
            className={`rounded-t-lg px-4 py-1.5 text-sm font-medium transition-colors ${
              inputMode === "url"
                ? "bg-blue-600 text-white"
                : "bg-zinc-200 text-zinc-600 hover:bg-zinc-300 dark:bg-zinc-700 dark:text-zinc-300"
            }`}
          >
            URL
          </button>
          <button
            onClick={() => setInputMode("local")}
            className={`rounded-t-lg px-4 py-1.5 text-sm font-medium transition-colors ${
              inputMode === "local"
                ? "bg-blue-600 text-white"
                : "bg-zinc-200 text-zinc-600 hover:bg-zinc-300 dark:bg-zinc-700 dark:text-zinc-300"
            }`}
          >
            Local File
          </button>
        </div>

        {inputMode === "url" ? (
          <UrlInput onLoad={handleImageLoad} />
        ) : (
          <LocalFileInput onLoad={handleImageLoad} />
        )}

        {imageSrc && (
          <div className="text-center">
            <button
              onClick={handleClear}
              className="text-xs text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 underline"
            >
              Clear image
            </button>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-[260px_1fr] gap-6">
          <aside className="space-y-6">
            <ResolutionSelector
              selectedPreset={selectedPreset}
              customWidth={customWidth}
              customHeight={customHeight}
              onSelectPreset={handleSelectPreset}
              onSelectCustom={handleSelectCustom}
            />

            {imageSrc && (
              <div className="rounded-lg border border-zinc-200 dark:border-zinc-700 p-4 space-y-3">
                <CropPreview
                  crop={completedCrop}
                  imageSrc={imageSrc}
                  fileName={fileName}
                  targetWidth={targetWidth}
                  targetHeight={targetHeight}
                />
                <DownloadButton
                  imageSrc={imageSrc}
                  crop={completedCrop}
                  fileName={fileName}
                  targetWidth={targetWidth}
                  targetHeight={targetHeight}
                />
              </div>
            )}
          </aside>

          <section>
            <Cropper
              imageSrc={imageSrc}
              crop={crop}
              aspect={aspect}
              onChange={onCropChange}
              onComplete={onCropComplete}
            />
          </section>
        </div>
      </main>
    </div>
  )
}
