import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { verify, SESSION_COOKIE, type Session } from '@/lib/auth/jwt'

export const runtime = 'nodejs'

export async function GET() {
  const token = (await cookies()).get(SESSION_COOKIE)?.value
  if (!token) return NextResponse.json({ user: null }, { status: 401 })

  const s = await verify<Session & { t?: string }>(token)
  if (!s || s.t !== 'session') return NextResponse.json({ user: null }, { status: 401 })

  return NextResponse.json({ user: { id: s.sub, method: s.method } })
}
