import { NextResponse } from 'next/server'
import { getSessionUser, BACKEND } from '@/lib/auth/session'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

// Per-user history: owner is taken from the verified session, never the client.
export async function GET() {
  const user = await getSessionUser()
  if (!user) return NextResponse.json([], { status: 200 })

  const url = `${BACKEND}/api/history?owner=${encodeURIComponent(user.id)}`
  const r = await fetch(url, { cache: 'no-store' })
  const data = await r.json().catch(() => [])
  return NextResponse.json(data, { status: r.status })
}
