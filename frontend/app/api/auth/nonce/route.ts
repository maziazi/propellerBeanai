import { NextResponse } from 'next/server'
import { signNonce } from '@/lib/auth/jwt'

export const runtime = 'nodejs'

// Returns the exact message the wallet must sign, plus a stateless signed token
// that carries that message (so we can verify it later without a database).
export async function GET() {
  const nonce = crypto.randomUUID()
  const message = `Sign in to BeanAI\n\nThis request will not trigger a transaction or cost gas.\n\nNonce: ${nonce}`
  const token = await signNonce(message)
  return NextResponse.json({ message, token })
}
