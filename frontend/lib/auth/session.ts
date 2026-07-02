import { cookies } from 'next/headers'
import { verify, SESSION_COOKIE, type Session } from './jwt'

export type SessionUser = { id: string; method: 'email' | 'wallet' }

/** Reads and verifies the session cookie server-side (for route handlers). */
export async function getSessionUser(): Promise<SessionUser | null> {
  const token = (await cookies()).get(SESSION_COOKIE)?.value
  if (!token) return null
  const s = await verify<Session & { t?: string }>(token)
  if (!s || s.t !== 'session') return null
  return { id: s.sub, method: s.method }
}

/** FastAPI backend base URL (server-side calls go direct, not through /proxy). */
export const BACKEND = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'
