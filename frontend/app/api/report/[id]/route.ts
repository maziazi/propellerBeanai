import { NextResponse } from 'next/server'
import { getSessionUser, BACKEND } from '@/lib/auth/session'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

// Fetch a report, enforcing ownership server-side (backend 404s if not owner).
export async function GET(_req: Request, ctx: { params: Promise<{ id: string }> }) {
  const { id } = await ctx.params
  const user = await getSessionUser()
  const ownerQ = user ? `?owner=${encodeURIComponent(user.id)}` : ''

  const r = await fetch(`${BACKEND}/api/report/${encodeURIComponent(id)}${ownerQ}`, { cache: 'no-store' })
  const data = await r.json().catch(() => ({ detail: 'Backend error' }))
  return NextResponse.json(data, { status: r.status })
}
