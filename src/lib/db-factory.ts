import type { PresetDB } from "./db"

let _dbPromise: Promise<PresetDB> | null = null

export async function getDB(): Promise<PresetDB> {
  if (_dbPromise) return _dbPromise

  _dbPromise = (async () => {
    try {
      const { getRequestContext } = await import("@cloudflare/next-on-pages")
      const ctx = getRequestContext()
      if (ctx?.env?.DB) {
        const { createCloudflareDB } = await import("./db-cloudflare")
        return createCloudflareDB(ctx.env.DB)
      }
    } catch {
      // Not on Cloudflare — fall back to local
    }

    const { localDB } = await import("./db-local")
    return localDB
  })()

  return _dbPromise
}
