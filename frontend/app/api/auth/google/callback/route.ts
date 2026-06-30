import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { decodeJwt } from 'jose'
import { verify, signSession } from '@/lib/auth/jwt'
import { setSessionCookie } from '@/lib/auth/cookie'

export const runtime = 'nodejs'

export async function GET(req: Request) {
  const url = new URL(req.url)
  const origin = url.origin
  const code = url.searchParams.get('code')
  const state = url.searchParams.get('state')

  const fail = () => NextResponse.redirect(new URL('/login?error=google_failed', origin))

  // Verify CSRF state: signed token + matches the cookie we set.
  const cookieState = (await cookies()).get('beanai_oauth_state')?.value
  const statePayload = state ? await verify<{ t?: string }>(state) : null
  if (!code || !state || state !== cookieState || statePayload?.t !== 'state') return fail()

  const clientId = process.env.GOOGLE_CLIENT_ID
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET
  if (!clientId || !clientSecret) return fail()

  try {
    const tokenRes = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        code,
        client_id: clientId,
        client_secret: clientSecret,
        redirect_uri: `${origin}/api/auth/google/callback`,
        grant_type: 'authorization_code',
      }),
    })
    if (!tokenRes.ok) return fail()
    const { id_token } = (await tokenRes.json()) as { id_token?: string }
    if (!id_token) return fail()

    // id_token came straight from Google's token endpoint over TLS — decode the email.
    const claims = decodeJwt(id_token) as { email?: string; email_verified?: boolean }
    if (!claims.email) return fail()

    const session = await signSession({ sub: claims.email.toLowerCase(), method: 'email' })
    const res = NextResponse.redirect(new URL('/app', origin))
    setSessionCookie(res, session)
    res.cookies.set('beanai_oauth_state', '', { path: '/', maxAge: 0 })
    return res
  } catch {
    return fail()
  }
}
