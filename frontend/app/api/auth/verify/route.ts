import { NextResponse } from 'next/server'
import { verify, signSession } from '@/lib/auth/jwt'
import { setSessionCookie } from '@/lib/auth/cookie'

export const runtime = 'nodejs'

export async function GET(req: Request) {
  const url = new URL(req.url)
  const token = url.searchParams.get('token') || ''
  const payload = await verify<{ email?: string; t?: string }>(token)

  if (!payload || payload.t !== 'magic' || !payload.email) {
    return NextResponse.redirect(new URL('/login?error=expired', url.origin))
  }

  const session = await signSession({ sub: payload.email, method: 'email' })
  const res = NextResponse.redirect(new URL('/app', url.origin))
  setSessionCookie(res, session)
  return res
}
