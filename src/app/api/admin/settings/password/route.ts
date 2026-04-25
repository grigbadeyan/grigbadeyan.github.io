import { NextResponse } from 'next/server'
import { getDb } from '@/lib/db'
import { getAuthUser, verifyPassword, hashPassword } from '@/lib/auth'

export async function POST(req: Request) {
  const user = await getAuthUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const { current, newPassword } = await req.json()
  const db = getDb()
  const row = db.prepare('SELECT password_hash FROM users WHERE id = ?').get(user.userId) as { password_hash: string } | undefined
  if (!row) return NextResponse.json({ error: 'User not found' }, { status: 404 })
  if (!(await verifyPassword(current, row.password_hash))) {
    return NextResponse.json({ error: 'Current password is incorrect' }, { status: 400 })
  }
  const hash = await hashPassword(newPassword)
  db.prepare('UPDATE users SET password_hash = ? WHERE id = ?').run(hash, user.userId)
  return NextResponse.json({ success: true })
}
