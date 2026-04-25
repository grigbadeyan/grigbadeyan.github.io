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
  return NextResponse.json(db.prepare('SELECT * FROM pages ORDER BY slug').all())
}

export async function POST(req: Request) {
  if (!await auth()) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const db = getDb()
  const body = await req.json()
  const result = db.prepare(`
    INSERT INTO pages (slug, title_hy, title_ru, title_en, content_hy, content_ru, content_en,
      meta_title_hy, meta_title_ru, meta_title_en, meta_description_hy, meta_description_ru, meta_description_en)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `).run(
    body.slug, body.title_hy, body.title_ru, body.title_en,
    body.content_hy || '', body.content_ru || '', body.content_en || '',
    body.meta_title_hy || '', body.meta_title_ru || '', body.meta_title_en || '',
    body.meta_description_hy || '', body.meta_description_ru || '', body.meta_description_en || ''
  )
  return NextResponse.json({ success: true, id: result.lastInsertRowid })
}

export async function PUT(req: Request) {
  if (!await auth()) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const db = getDb()
  const body = await req.json()
  db.prepare(`
    UPDATE pages SET
      slug=?, title_hy=?, title_ru=?, title_en=?,
      content_hy=?, content_ru=?, content_en=?,
      meta_title_hy=?, meta_title_ru=?, meta_title_en=?,
      meta_description_hy=?, meta_description_ru=?, meta_description_en=?,
      updated_at=CURRENT_TIMESTAMP
    WHERE id=?
  `).run(
    body.slug, body.title_hy, body.title_ru, body.title_en,
    body.content_hy || '', body.content_ru || '', body.content_en || '',
    body.meta_title_hy || '', body.meta_title_ru || '', body.meta_title_en || '',
    body.meta_description_hy || '', body.meta_description_ru || '', body.meta_description_en || '',
    body.id
  )
  return NextResponse.json({ success: true })
}

export async function DELETE(req: Request) {
  if (!await auth()) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const db = getDb()
  const { id } = await req.json()
  db.prepare('DELETE FROM pages WHERE id = ?').run(id)
  return NextResponse.json({ success: true })
}
