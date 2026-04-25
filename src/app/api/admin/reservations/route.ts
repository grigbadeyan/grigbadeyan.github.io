import { NextResponse } from 'next/server'
import { getDb } from '@/lib/db'
import { getAuthUser } from '@/lib/auth'

export async function PUT(req: Request) {
  const user = await getAuthUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const db = getDb()
  const { id, status } = await req.json()
  db.prepare('UPDATE reservations SET status = ? WHERE id = ?').run(status, id)
  return NextResponse.json({ success: true })
}
