import type { UserPreset } from "@/types"
import type { PresetDB } from "./db"

export function createCloudflareDB(binding: D1Binding): PresetDB {
  function rowToPreset(row: Record<string, unknown>): UserPreset {
    return {
      id: row.id as number,
      nickname: row.nickname as string,
      width: row.width as number,
      height: row.height as number,
      created_at: row.created_at as string,
    }
  }

  return {
    async getAll() {
      const result = await binding.prepare("SELECT * FROM presets ORDER BY created_at DESC").all()
      return (result.results as Record<string, unknown>[]).map(rowToPreset)
    },

    async getById(id: number) {
      const row = await binding.prepare("SELECT * FROM presets WHERE id = ?").bind(id).first()
      return row ? rowToPreset(row as Record<string, unknown>) : null
    },

    async create(nickname: string, width: number, height: number) {
      const result = await binding.prepare(
        "INSERT INTO presets (nickname, width, height) VALUES (?, ?, ?)"
      ).bind(nickname, width, height).run()
      return (await this.getById(result.meta.last_row_id as number))!
    },

    async update(id: number, nickname: string, width: number, height: number) {
      const result = await binding.prepare(
        "UPDATE presets SET nickname = ?, width = ?, height = ? WHERE id = ?"
      ).bind(nickname, width, height, id).run()
      if (result.meta.changes === 0) return null
      return this.getById(id)
    },

    async delete(id: number) {
      await binding.prepare("DELETE FROM presets WHERE id = ?").bind(id).run()
    },
  }
}
