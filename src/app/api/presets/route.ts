import { NextRequest, NextResponse } from "next/server"
import { getDB } from "@/lib/db-factory"

export const runtime = "edge"

export async function GET() {
  try {
    const db = await getDB()
    const presets = await db.getAll()
    return NextResponse.json(presets)
  } catch (e) {
    return NextResponse.json({ error: "Failed to fetch presets" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { nickname, width, height } = body

    if (!nickname || typeof nickname !== "string" || nickname.trim().length === 0) {
      return NextResponse.json({ error: "Nickname is required" }, { status: 400 })
    }
    if (!width || typeof width !== "number" || width <= 0 || !Number.isInteger(width)) {
      return NextResponse.json({ error: "Width must be a positive integer" }, { status: 400 })
    }
    if (!height || typeof height !== "number" || height <= 0 || !Number.isInteger(height)) {
      return NextResponse.json({ error: "Height must be a positive integer" }, { status: 400 })
    }
    if (width > 10000 || height > 10000) {
      return NextResponse.json({ error: "Dimensions must not exceed 10000px" }, { status: 400 })
    }

    const db = await getDB()
    const preset = await db.create(nickname.trim(), width, height)
    return NextResponse.json(preset, { status: 201 })
  } catch (e) {
    return NextResponse.json({ error: "Failed to create preset" }, { status: 500 })
  }
}
