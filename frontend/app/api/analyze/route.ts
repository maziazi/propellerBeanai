import { NextResponse } from 'next/server'
import { getSessionUser, BACKEND } from '@/lib/auth/session'

export const runtime = 'nodejs'

// Starts an analysis, stamping it with the signed-in user's id as owner.
export async function POST(req: Request) {
  const user = await getSessionUser()
  if (!user) return NextResponse.json({ detail: 'Sign in required' }, { status: 401 })

  let body: Record<string, unknown>
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ detail: 'Invalid request' }, { status: 400 })
  }

  const r = await fetch(`${BACKEND}/api/analyze`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    // owner comes from the verified session, overriding anything the client sent
    body: JSON.stringify({ ...body, owner: user.id }),
  })
  const data = await r.json().catch(() => ({ detail: 'Backend error' }))
  return NextResponse.json(data, { status: r.status })
}
