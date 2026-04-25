import { NextResponse } from 'next/server'
import { getDb } from '@/lib/db'
import { verifyPassword, createToken, COOKIE_NAME } from '@/lib/auth'
import { cookies } from 'next/headers'

export async function POST(req: Request) {
  const { username, password } = await req.json()
  if (!username || !password) {
    return NextResponse.json({ error: 'Missing credentials' }, { status: 400 })
  }

  const db = getDb()
  const user = db.prepare('SELECT * FROM users WHERE username = ?').get(username) as {
    id: number; username: string; password_hash: string
  } | undefined

  if (!user || !(await verifyPassword(password, user.password_hash))) {
    return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 })
  }

  const token = createToken(user.id, user.username)
  const cookieStore = cookies()
  cookieStore.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 7, // 7 days
    path: '/',
  })

  return NextResponse.json({ success: true, username: user.username })
}
