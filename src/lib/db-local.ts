import Database from "better-sqlite3"
import path from "path"
import type { UserPreset } from "@/types"
import type { PresetDB } from "./db"

let dbInstance: Database.Database | null = null

function getDB(): Database.Database {
  if (dbInstance) return dbInstance

  const dbPath = path.join(process.cwd(), "data", "presets.db")
  dbInstance = new Database(dbPath)
  dbInstance.pragma("journal_mode = WAL")
  dbInstance.exec(`
    CREATE TABLE IF NOT EXISTS presets (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      nickname TEXT NOT NULL,
      width INTEGER NOT NULL,
      height INTEGER NOT NULL,
      created_at TEXT DEFAULT (datetime('now'))
    )
  `)
  return dbInstance
}

function rowToPreset(row: { id: number; nickname: string; width: number; height: number; created_at: string }): UserPreset {
  return {
    id: row.id,
    nickname: row.nickname,
    width: row.width,
    height: row.height,
    created_at: row.created_at,
  }
}

export const localDB: PresetDB = {
  async getAll() {
    const db = getDB()
    const rows = db.prepare("SELECT * FROM presets ORDER BY created_at DESC").all() as {
      id: number; nickname: string; width: number; height: number; created_at: string
    }[]
    return rows.map(rowToPreset)
  },

  async getById(id: number) {
    const db = getDB()
    const row = db.prepare("SELECT * FROM presets WHERE id = ?").get(id) as {
      id: number; nickname: string; width: number; height: number; created_at: string
    } | undefined
    return row ? rowToPreset(row) : null
  },

  async create(nickname: string, width: number, height: number) {
    const db = getDB()
    const result = db.prepare(
      "INSERT INTO presets (nickname, width, height) VALUES (?, ?, ?)"
    ).run(nickname, width, height)
    return (await this.getById(result.lastInsertRowid as number))!
  },

  async update(id: number, nickname: string, width: number, height: number) {
    const db = getDB()
    const result = db.prepare(
      "UPDATE presets SET nickname = ?, width = ?, height = ? WHERE id = ?"
    ).run(nickname, width, height, id)
    if (result.changes === 0) return null
    return this.getById(id)
  },

  async delete(id: number) {
    const db = getDB()
    db.prepare("DELETE FROM presets WHERE id = ?").run(id)
  },
}
