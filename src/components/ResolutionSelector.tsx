"use client"

import { useState, useEffect, useCallback } from "react"
import type { UserPreset } from "@/types"
import { BUILTIN_PRESETS } from "@/lib/presets"
import PresetManager from "./PresetManager"

interface Props {
  selectedPreset: string
  customWidth: number
  customHeight: number
  onSelectPreset: (label: string, width: number, height: number) => void
  onSelectCustom: (width: number, height: number) => void
}

export default function ResolutionSelector({
  selectedPreset,
  customWidth,
  customHeight,
  onSelectPreset,
  onSelectCustom,
}: Props) {
  const [userPresets, setUserPresets] = useState<UserPreset[]>([])
  const [managerOpen, setManagerOpen] = useState(false)

  const fetchPresets = useCallback(async () => {
    try {
      const res = await fetch("/api/presets")
      if (res.ok) {
        const data = await res.json()
        setUserPresets(data)
      }
    } catch {
      // API not available yet (SSR/static export)
    }
  }, [])

  useEffect(() => {
    fetchPresets()
  }, [fetchPresets])

  function handleChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const val = e.target.value
    if (val === "custom") {
      onSelectCustom(customWidth || 1920, customHeight || 1080)
      return
    }

    // Check built-in presets
    for (const p of BUILTIN_PRESETS) {
      if (p.label === val) {
        onSelectPreset(p.label, p.width, p.height)
        return
      }
    }

    // Check user presets
    for (const p of userPresets) {
      if (p.nickname === val) {
        onSelectPreset(p.nickname, p.width, p.height)
        return
      }
    }
  }

  const hasUserPresets = userPresets.length > 0
  const isCustom = selectedPreset === "custom"
  const isUserPreset = userPresets.some((p) => p.nickname === selectedPreset)

  return (
    <div className="space-y-3">
      <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
        Crop Resolution
      </label>

      <select
        value={
          isCustom
            ? "custom"
            : isUserPreset
            ? selectedPreset
            : BUILTIN_PRESETS.some((p) => p.label === selectedPreset)
            ? selectedPreset
            : ""
        }
        onChange={handleChange}
        className="w-full rounded-lg border border-zinc-300 dark:border-zinc-600 bg-white dark:bg-zinc-800 px-3 py-2 text-sm text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        <option value="" disabled>
          Select a resolution...
        </option>
        {BUILTIN_PRESETS.map((p) => (
          <option key={p.label} value={p.label}>
            {p.label}
          </option>
        ))}
        {hasUserPresets && (
          <>
            <option disabled>──────────</option>
            {userPresets.map((p) => (
              <option key={p.id} value={p.nickname}>
                {p.nickname} ({p.width}×{p.height})
              </option>
            ))}
          </>
        )}
        <option disabled>──────────</option>
        <option value="custom">Custom...</option>
      </select>

      {isCustom && (
        <div className="flex gap-2">
          <div className="flex-1">
            <label className="block text-xs text-zinc-500 dark:text-zinc-400 mb-1">
              Width (px)
            </label>
            <input
              type="number"
              value={customWidth}
              onChange={(e) =>
                onSelectCustom(Math.max(1, parseInt(e.target.value) || 0), customHeight)
              }
              min={1}
              max={10000}
              className="w-full rounded-lg border border-zinc-300 dark:border-zinc-600 bg-white dark:bg-zinc-800 px-3 py-2 text-sm text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="flex items-end justify-center pb-1">
            <span className="text-zinc-400 dark:text-zinc-500">×</span>
          </div>
          <div className="flex-1">
            <label className="block text-xs text-zinc-500 dark:text-zinc-400 mb-1">
              Height (px)
            </label>
            <input
              type="number"
              value={customHeight}
              onChange={(e) =>
                onSelectCustom(customWidth, Math.max(1, parseInt(e.target.value) || 0))
              }
              min={1}
              max={10000}
              className="w-full rounded-lg border border-zinc-300 dark:border-zinc-600 bg-white dark:bg-zinc-800 px-3 py-2 text-sm text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
      )}

      <button
        onClick={() => setManagerOpen(true)}
        className="text-xs text-blue-600 dark:text-blue-400 hover:underline"
      >
        Manage custom presets
      </button>

      {managerOpen && (
        <PresetManager
          presets={userPresets}
          onClose={() => setManagerOpen(false)}
          onPresetsChanged={fetchPresets}
        />
      )}
    </div>
  )
}
