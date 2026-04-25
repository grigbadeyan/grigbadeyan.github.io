import { NextResponse } from 'next/server'
import { getDb } from '@/lib/db'
import { getAuthUser } from '@/lib/auth'

async function auth() {
  const user = await getAuthUser()
  if (!user) return null
  return user
}

export async function GET() {
  if (!await auth()) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const db = getDb()
  const rooms = db.prepare('SELECT * FROM rooms ORDER BY sort_order ASC').all()
  return NextResponse.json(rooms)
}

export async function POST(req: Request) {
  if (!await auth()) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const db = getDb()
  const body = await req.json()

  const result = db.prepare(`
    INSERT INTO rooms (slug, name_hy, name_ru, name_en, description_hy, description_ru, description_en,
      price, capacity, area, cover_image, features_hy, features_ru, features_en, sort_order, is_active)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `).run(
    body.slug, body.name_hy, body.name_ru, body.name_en,
    body.description_hy || '', body.description_ru || '', body.description_en || '',
    body.price || null, body.capacity || null, body.area || null,
    body.cover_image || null,
    JSON.stringify(body.features_hy || []),
    JSON.stringify(body.features_ru || []),
    JSON.stringify(body.features_en || []),
    body.sort_order || 0, body.is_active !== false ? 1 : 0
  )

  return NextResponse.json({ success: true, id: result.lastInsertRowid })
}

export async function PUT(req: Request) {
  if (!await auth()) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const db = getDb()
  const body = await req.json()

  db.prepare(`
    UPDATE rooms SET
      slug=?, name_hy=?, name_ru=?, name_en=?,
      description_hy=?, description_ru=?, description_en=?,
      price=?, capacity=?, area=?, cover_image=?,
      features_hy=?, features_ru=?, features_en=?,
      sort_order=?, is_active=?, updated_at=CURRENT_TIMESTAMP
    WHERE id=?
  `).run(
    body.slug, body.name_hy, body.name_ru, body.name_en,
    body.description_hy || '', body.description_ru || '', body.description_en || '',
    body.price || null, body.capacity || null, body.area || null,
    body.cover_image || null,
    JSON.stringify(body.features_hy || []),
    JSON.stringify(body.features_ru || []),
    JSON.stringify(body.features_en || []),
    body.sort_order || 0, body.is_active !== false ? 1 : 0,
    body.id
  )

  return NextResponse.json({ success: true })
}

export async function DELETE(req: Request) {
  if (!await auth()) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const db = getDb()
  const { id } = await req.json()
  db.prepare('DELETE FROM rooms WHERE id = ?').run(id)
  return NextResponse.json({ success: true })
}
