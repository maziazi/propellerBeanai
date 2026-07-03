import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { verify, SESSION_COOKIE } from '@/lib/auth/jwt'

// Workspace routes that require a signed-in session.
export const config = {
  matcher: ['/app/:path*', '/analyze/:path*', '/history/:path*', '/results/:path*'],
}

export async function proxy(req: NextRequest) {
  const token = req.cookies.get(SESSION_COOKIE)?.value
  const session = token ? await verify<{ t?: string }>(token) : null

  if (session && session.t === 'session') {
    return NextResponse.next()
  }

  // Not signed in → send to login, remembering where they wanted to go.
  const url = req.nextUrl.clone()
  url.pathname = '/login'
  url.search = ''
  url.searchParams.set('next', req.nextUrl.pathname)
  return NextResponse.redirect(url)
}
