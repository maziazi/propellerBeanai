import { NextResponse } from 'next/server'
import { signState } from '@/lib/auth/jwt'

export const runtime = 'nodejs'

// Kicks off Google OAuth: redirect the user to Google's consent screen.
export async function GET(req: Request) {
  const origin = new URL(req.url).origin
  const clientId = process.env.GOOGLE_CLIENT_ID
  if (!clientId) {
    return NextResponse.redirect(new URL('/login?error=google_unconfigured', origin))
  }

  const state = await signState()
  const params = new URLSearchParams({
    client_id: clientId,
    redirect_uri: `${origin}/api/auth/google/callback`,
    response_type: 'code',
    scope: 'openid email profile',
    state,
    prompt: 'select_account',
  })

  const res = NextResponse.redirect(`https://accounts.google.com/o/oauth2/v2/auth?${params}`)
  // Bind the state to the browser so the callback can verify it.
  res.cookies.set('beanai_oauth_state', state, {
    httpOnly: true, sameSite: 'lax', secure: process.env.NODE_ENV === 'production', path: '/', maxAge: 600,
  })
  return res
}
