import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { COOKIE_NAME } from '@/lib/auth'

export async function POST() {
  const cookieStore = cookies()
  cookieStore.delete(COOKIE_NAME)
  return NextResponse.json({ success: true })
}
