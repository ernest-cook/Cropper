import { NextRequest, NextResponse } from "next/server"
import { getDB } from "@/lib/db-factory"

export const runtime = "edge"

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: idStr } = await params
    const id = parseInt(idStr, 10)
    if (isNaN(id)) {
      return NextResponse.json({ error: "Invalid preset ID" }, { status: 400 })
    }

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

    const db = await getDB()
    const updated = await db.update(id, nickname.trim(), width, height)
    if (!updated) {
      return NextResponse.json({ error: "Preset not found" }, { status: 404 })
    }
    return NextResponse.json(updated)
  } catch (e) {
    return NextResponse.json({ error: "Failed to update preset" }, { status: 500 })
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: idStr } = await params
    const id = parseInt(idStr, 10)
    if (isNaN(id)) {
      return NextResponse.json({ error: "Invalid preset ID" }, { status: 400 })
    }

    const db = await getDB()
    await db.delete(id)
    return NextResponse.json({ success: true })
  } catch (e) {
    return NextResponse.json({ error: "Failed to delete preset" }, { status: 500 })
  }
}
