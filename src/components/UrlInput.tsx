"use client"

import { useState } from "react"

interface Props {
  onLoad: (url: string) => void
}

export default function UrlInput({ onLoad }: Props) {
  const [url, setUrl] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  function handleLoad() {
    const trimmed = url.trim()
    if (!trimmed) {
      setError("Please enter an image URL")
      return
    }

    try {
      new URL(trimmed)
    } catch {
      setError("Please enter a valid URL")
      return
    }

    setError(null)
    setLoading(true)

    const img = new Image()
    img.crossOrigin = "anonymous"
    img.onload = () => {
      setLoading(false)
      onLoad(trimmed)
    }
    img.onerror = () => {
      setLoading(false)
      setError("Failed to load image. Check the URL and try again.")
    }
    img.src = trimmed
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Enter") handleLoad()
  }

  return (
    <div className="space-y-2">
      <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
        Image URL
      </label>
      <div className="flex gap-2">
        <input
          type="text"
          value={url}
          onChange={(e) => { setUrl(e.target.value); setError(null) }}
          onKeyDown={handleKeyDown}
          placeholder="https://example.com/image.jpg"
          className="flex-1 rounded-lg border border-zinc-300 dark:border-zinc-600 bg-white dark:bg-zinc-800 px-3 py-2 text-sm text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          onClick={handleLoad}
          disabled={loading}
          className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50 transition-colors"
        >
          {loading ? (
            <span className="flex items-center gap-1">
              <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
              Loading
            </span>
          ) : (
            "Load"
          )}
        </button>
      </div>
      {error && (
        <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
      )}
    </div>
  )
}
