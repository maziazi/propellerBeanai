import type { NextResponse } from 'next/server'
import { SESSION_COOKIE } from './jwt'

export function setSessionCookie(res: NextResponse, token: string) {
  res.cookies.set(SESSION_COOKIE, token, {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: 60 * 60 * 24 * 30, // 30 days
  })
}

export function clearSessionCookie(res: NextResponse) {
  res.cookies.set(SESSION_COOKIE, '', { httpOnly: true, path: '/', maxAge: 0 })
}
