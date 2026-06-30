import { NextResponse } from 'next/server'
import { signMagic } from '@/lib/auth/jwt'
import { sendMagicLink } from '@/lib/auth/mailer'

export const runtime = 'nodejs'

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export async function POST(req: Request) {
  let email = ''
  try {
    email = String((await req.json()).email || '').trim().toLowerCase()
  } catch {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 })
  }
  if (!EMAIL_RE.test(email)) {
    return NextResponse.json({ error: 'Enter a valid email address' }, { status: 400 })
  }

  const token = await signMagic(email)
  const origin = new URL(req.url).origin
  const link = `${origin}/api/auth/verify?token=${encodeURIComponent(token)}`

  const { sent } = await sendMagicLink(email, link)

  // In dev (no SMTP), return the link so the UI can show it for testing.
  return NextResponse.json({ ok: true, sent, devLink: sent ? undefined : link })
}
