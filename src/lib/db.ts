import type { UserPreset } from "@/types"

export interface PresetDB {
  getAll(): Promise<UserPreset[]>
  getById(id: number): Promise<UserPreset | null>
  create(nickname: string, width: number, height: number): Promise<UserPreset>
  update(id: number, nickname: string, width: number, height: number): Promise<UserPreset | null>
  delete(id: number): Promise<void>
}
