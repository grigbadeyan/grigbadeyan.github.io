import { NextResponse } from 'next/server'
import { getDb } from '@/lib/db'
import { getAuthUser } from '@/lib/auth'

async function auth() {
  return await getAuthUser()
}

export async function GET() {
  const db = getDb()
  return NextResponse.json(db.prepare('SELECT * FROM gallery WHERE is_active = 1 ORDER BY sort_order ASC').all())
}

export async function POST(req: Request) {
  if (!await auth()) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const db = getDb()
  const body = await req.json()
  const result = db.prepare(`
    INSERT INTO gallery (image_path, alt_hy, alt_ru, alt_en, category, sort_order)
    VALUES (?, ?, ?, ?, ?, ?)
  `).run(body.image_path, body.alt_hy || '', body.alt_ru || '', body.alt_en || '', body.category || 'general', body.sort_order || 0)
  return NextResponse.json({ success: true, id: result.lastInsertRowid })
}

export async function DELETE(req: Request) {
  if (!await auth()) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const db = getDb()
  const { id } = await req.json()
  db.prepare('DELETE FROM gallery WHERE id = ?').run(id)
  return NextResponse.json({ success: true })
}
