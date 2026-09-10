"use client"

import { useState } from "react"

interface Props {
  onLoad: (url: string) => void
}

export default function LocalFileInput({ onLoad }: Props) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return

    if (!file.type.startsWith("image/")) {
      setError("Please select an image file")
      return
    }

    setError(null)
    setLoading(true)

    const url = URL.createObjectURL(file)
    const img = new Image()
    img.onload = () => {
      setLoading(false)
      onLoad(url)
    }
    img.onerror = () => {
      setLoading(false)
      setError("Failed to load image. Please try a different file.")
      URL.revokeObjectURL(url)
    }
    img.src = url
  }

  return (
    <div className="space-y-2">
      <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
        Local File
      </label>
      <div className="flex gap-2">
        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          disabled={loading}
          className="flex-1 rounded-lg border border-zinc-300 dark:border-zinc-600 bg-white dark:bg-zinc-800 px-3 py-2 text-sm text-zinc-900 dark:text-zinc-100 file:mr-3 file:rounded-md file:border-0 file:bg-blue-600 file:px-3 file:py-1 file:text-sm file:font-medium file:text-white hover:file:bg-blue-700 transition-colors"
        />
        {loading && (
          <button
            disabled
            className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white opacity-50 cursor-not-allowed"
          >
            <span className="flex items-center gap-1">
              <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
              Loading
            </span>
          </button>
        )}
      </div>
      {error && (
        <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
      )}
    </div>
  )
}
