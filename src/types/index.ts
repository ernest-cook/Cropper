export interface UserPreset {
  id: number
  nickname: string
  width: number
  height: number
  created_at: string
}

export interface BuiltinPreset {
  label: string
  width: number
  height: number
}

export type CropMode = "preset" | "custom"

export interface ImageState {
  src: string | null
  loading: boolean
  error: string | null
}
