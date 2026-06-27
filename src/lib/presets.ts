import type { BuiltinPreset } from "@/types"

export const BUILTIN_PRESETS: BuiltinPreset[] = [
  { label: "16:9 (1920×1080)", width: 1920, height: 1080 },
  { label: "4:3 (1024×768)", width: 1024, height: 768 },
  { label: "3:2 (1500×1000)", width: 1500, height: 1000 },
  { label: "1:1 (1080×1080)", width: 1080, height: 1080 },
  { label: "2:3 (1000×1500)", width: 1000, height: 1500 },
  { label: "9:16 (1080×1920)", width: 1080, height: 1920 },
  { label: "21:9 (2560×1080)", width: 2560, height: 1080 },
]
