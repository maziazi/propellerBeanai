import { NextResponse } from 'next/server'
import { getSessionUser, BACKEND } from '@/lib/auth/session'

export const runtime = 'nodejs'

// Interactive discussion turn — owner injected server-side.
export async function POST(req: Request, ctx: { params: Promise<{ id: string }> }) {
  const { id } = await ctx.params
  const user = await getSessionUser()
  if (!user) return NextResponse.json({ detail: 'Sign in required' }, { status: 401 })

  let body: unknown
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ detail: 'Invalid request' }, { status: 400 })
  }

  try {
    const r = await fetch(
      `${BACKEND}/api/discuss/chat/${encodeURIComponent(id)}?owner=${encodeURIComponent(user.id)}`,
      { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) },
    )
    const data = await r.json().catch(() => ({ detail: 'Backend returned a non-JSON response' }))
    return NextResponse.json(data, { status: r.status })
  } catch {
    return NextResponse.json({ detail: `Cannot reach backend at ${BACKEND}.` }, { status: 502 })
  }
}
