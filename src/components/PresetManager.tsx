"use client"

import { useState } from "react"
import type { UserPreset } from "@/types"

interface Props {
  presets: UserPreset[]
  onClose: () => void
  onPresetsChanged: () => void
}

export default function PresetManager({ presets, onClose, onPresetsChanged }: Props) {
  const [editId, setEditId] = useState<number | null>(null)
  const [showAdd, setShowAdd] = useState(false)
  const [nickname, setNickname] = useState("")
  const [width, setWidth] = useState(1920)
  const [height, setHeight] = useState(1080)
  const [error, setError] = useState<string | null>(null)
  const [deleteConfirm, setDeleteConfirm] = useState<number | null>(null)
  const [saving, setSaving] = useState(false)

  function resetForm() {
    setNickname("")
    setWidth(1920)
    setHeight(1080)
    setError(null)
    setEditId(null)
    setShowAdd(false)
  }

  function startEdit(preset: UserPreset) {
    setNickname(preset.nickname)
    setWidth(preset.width)
    setHeight(preset.height)
    setEditId(preset.id)
    setShowAdd(false)
    setError(null)
  }

  async function handleSave() {
    setError(null)

    if (!nickname.trim()) {
      setError("Nickname is required")
      return
    }
    if (width <= 0 || !Number.isInteger(width)) {
      setError("Width must be a positive integer")
      return
    }
    if (height <= 0 || !Number.isInteger(height)) {
      setError("Height must be a positive integer")
      return
    }
    if (width > 10000 || height > 10000) {
      setError("Dimensions must not exceed 10000px")
      return
    }

    setSaving(true)

    try {
      if (editId !== null) {
        const res = await fetch(`/api/presets/${editId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ nickname: nickname.trim(), width, height }),
        })
        if (!res.ok) {
          const data = await res.json()
          setError(data.error || "Failed to update preset")
          setSaving(false)
          return
        }
      } else {
        const res = await fetch("/api/presets", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ nickname: nickname.trim(), width, height }),
        })
        if (!res.ok) {
          const data = await res.json()
          setError(data.error || "Failed to create preset")
          setSaving(false)
          return
        }
      }

      resetForm()
      setSaving(false)
      onPresetsChanged()
    } catch {
      setError("Network error. Please try again.")
      setSaving(false)
    }
  }

  async function handleDelete(id: number) {
    try {
      await fetch(`/api/presets/${id}`, { method: "DELETE" })
      setDeleteConfirm(null)
      if (editId === id) resetForm()
      onPresetsChanged()
    } catch {
      setError("Failed to delete preset")
    }
  }

  const hasForm = showAdd || editId !== null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="w-full max-w-md rounded-xl bg-white dark:bg-zinc-900 p-6 shadow-xl max-h-[80vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
            Custom Presets
          </h2>
          <button
            onClick={onClose}
            className="text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300"
          >
            ✕
          </button>
        </div>

        {error && (
          <p className="text-sm text-red-600 dark:text-red-400 mb-3">{error}</p>
        )}

        {!hasForm && (
          <button
            onClick={() => setShowAdd(true)}
            className="mb-4 w-full rounded-lg border border-dashed border-zinc-300 dark:border-zinc-600 px-3 py-2 text-sm text-zinc-600 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors"
          >
            + Add Preset
          </button>
        )}

        {hasForm && (
          <div className="mb-4 space-y-3 rounded-lg bg-zinc-50 dark:bg-zinc-800 p-3">
            <p className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
              {editId !== null ? "Edit Preset" : "New Preset"}
            </p>
            <input
              type="text"
              placeholder="Nickname"
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
              className="w-full rounded-lg border border-zinc-300 dark:border-zinc-600 bg-white dark:bg-zinc-700 px-3 py-2 text-sm text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <div className="flex gap-2">
              <div className="flex-1">
                <label className="block text-xs text-zinc-500 dark:text-zinc-400 mb-1">
                  Width (px)
                </label>
                <input
                  type="number"
                  value={width}
                  onChange={(e) => setWidth(parseInt(e.target.value) || 0)}
                  min={1}
                  className="w-full rounded-lg border border-zinc-300 dark:border-zinc-600 bg-white dark:bg-zinc-700 px-3 py-2 text-sm text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <span className="pt-6 text-zinc-400">×</span>
              <div className="flex-1">
                <label className="block text-xs text-zinc-500 dark:text-zinc-400 mb-1">
                  Height (px)
                </label>
                <input
                  type="number"
                  value={height}
                  onChange={(e) => setHeight(parseInt(e.target.value) || 0)}
                  min={1}
                  className="w-full rounded-lg border border-zinc-300 dark:border-zinc-600 bg-white dark:bg-zinc-700 px-3 py-2 text-sm text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <button
                onClick={handleSave}
                disabled={saving}
                className="flex-1 rounded-lg bg-blue-600 px-3 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50 transition-colors"
              >
                {saving ? "Saving..." : "Save"}
              </button>
              <button
                onClick={resetForm}
                className="rounded-lg border border-zinc-300 dark:border-zinc-600 px-3 py-2 text-sm text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-700 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {presets.length === 0 && !hasForm && (
          <p className="text-sm text-zinc-400 dark:text-zinc-500 text-center py-8">
            No custom presets yet
          </p>
        )}

        <div className="space-y-1">
          {presets.map((p) => (
            <div key={p.id}>
              <div className="flex items-center justify-between rounded-lg px-3 py-2 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors">
                <div>
                  <p className="text-sm font-medium text-zinc-800 dark:text-zinc-200">
                    {p.nickname}
                  </p>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400">
                    {p.width} × {p.height}
                  </p>
                </div>
                <div className="flex gap-1">
                  <button
                    onClick={() => startEdit(p)}
                    className="rounded px-2 py-1 text-xs text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300 hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => setDeleteConfirm(p.id)}
                    className="rounded px-2 py-1 text-xs text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                  >
                    Delete
                  </button>
                </div>
              </div>

              {deleteConfirm === p.id && (
                <div className="mx-3 mb-2 rounded-lg bg-red-50 dark:bg-red-900/20 p-2">
                  <p className="text-xs text-red-700 dark:text-red-300 mb-2">
                    Delete &ldquo;{p.nickname}&rdquo;?
                  </p>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleDelete(p.id)}
                      className="rounded bg-red-600 px-2 py-1 text-xs font-medium text-white hover:bg-red-700"
                    >
                      Delete
                    </button>
                    <button
                      onClick={() => setDeleteConfirm(null)}
                      className="rounded border border-zinc-300 dark:border-zinc-600 px-2 py-1 text-xs text-zinc-600 dark:text-zinc-400"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
