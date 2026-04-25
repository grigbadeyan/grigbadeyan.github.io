import { NextResponse } from 'next/server'
import { getDb } from '@/lib/db'
import { getAuthUser } from '@/lib/auth'

export async function POST(req: Request) {
  const body = await req.json()
  const { name, phone, email, room_id, message } = body

  if (!name || !phone) {
    return NextResponse.json({ error: 'Name and phone are required' }, { status: 400 })
  }

  const db = getDb()
  const result = db.prepare(`
    INSERT INTO reservations (name, phone, email, room_id, message)
    VALUES (?, ?, ?, ?, ?)
  `).run(name, phone, email || null, room_id || null, message || null)

  return NextResponse.json({ success: true, id: result.lastInsertRowid })
}

export async function GET() {
  const user = await getAuthUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const db = getDb()
  const reservations = db.prepare(`
    SELECT r.*, rm.name_en as room_name
    FROM reservations r
    LEFT JOIN rooms rm ON r.room_id = rm.id
    ORDER BY r.created_at DESC
  `).all()

  return NextResponse.json(reservations)
}
