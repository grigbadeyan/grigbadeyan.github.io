import { NextResponse } from 'next/server'
import { getDb } from '@/lib/db'
import { getAuthUser } from '@/lib/auth'

export async function GET() {
  const db = getDb()
  const rows = db.prepare('SELECT key, value FROM site_settings').all() as { key: string; value: string }[]
  const settings: Record<string, string> = {}
  rows.forEach(r => { settings[r.key] = r.value })
  return NextResponse.json(settings)
}

export async function POST(req: Request) {
  const user = await getAuthUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const db = getDb()
  const body = await req.json()
  const stmt = db.prepare('INSERT OR REPLACE INTO site_settings (key, value, updated_at) VALUES (?, ?, CURRENT_TIMESTAMP)')
  const insertMany = db.transaction((data: Record<string, string>) => {
    for (const [key, value] of Object.entries(data)) {
      stmt.run(key, value)
    }
  })
  insertMany(body)
  return NextResponse.json({ success: true })
}
