import { SignJWT, jwtVerify } from 'jose'

const SECRET = new TextEncoder().encode(
  process.env.AUTH_SECRET || 'dev-insecure-secret-change-me-0000000000000000',
)

export const SESSION_COOKIE = 'beanai_session'

export type Session = { sub: string; method: 'email' | 'wallet' }

async function sign(payload: Record<string, unknown>, expires: string) {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime(expires)
    .sign(SECRET)
}

export async function verify<T = Record<string, unknown>>(token: string): Promise<T | null> {
  try {
    const { payload } = await jwtVerify(token, SECRET)
    return payload as T
  } catch {
    return null
  }
}

// Long-lived session token (stored in an httpOnly cookie)
export function signSession(s: Session) {
  return sign({ ...s, t: 'session' }, '30d')
}

// Short-lived magic-link token (emailed to the user)
export function signMagic(email: string, next?: string) {
  return sign({ email, next, t: 'magic' }, '15m')
}

// Only allow internal relative paths as post-login redirect targets (no open redirect).
export function safeNext(next?: string | null): string {
  if (next && next.startsWith('/') && !next.startsWith('//')) return next
  return '/app'
}

// Short-lived wallet nonce token (carries the exact message to sign)
export function signNonce(message: string) {
  return sign({ message, t: 'nonce' }, '10m')
}

// Short-lived CSRF state token for the OAuth round-trip
export function signState() {
  return sign({ t: 'state' }, '10m')
}
