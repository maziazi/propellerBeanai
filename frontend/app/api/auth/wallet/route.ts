import { NextResponse } from 'next/server'
import { verifyMessage, isAddress } from 'viem'
import { verify, signSession } from '@/lib/auth/jwt'
import { setSessionCookie } from '@/lib/auth/cookie'

export const runtime = 'nodejs'

export async function POST(req: Request) {
  let body: { address?: string; signature?: string; token?: string }
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 })
  }

  const { address, signature, token } = body
  if (!address || !isAddress(address) || !signature || !token) {
    return NextResponse.json({ error: 'Missing or invalid fields' }, { status: 400 })
  }

  const noncePayload = await verify<{ message?: string; t?: string }>(token)
  if (!noncePayload || noncePayload.t !== 'nonce' || !noncePayload.message) {
    return NextResponse.json({ error: 'Nonce expired — try again' }, { status: 400 })
  }

  const valid = await verifyMessage({
    address: address as `0x${string}`,
    message: noncePayload.message,
    signature: signature as `0x${string}`,
  })
  if (!valid) {
    return NextResponse.json({ error: 'Signature verification failed' }, { status: 401 })
  }

  const session = await signSession({ sub: address.toLowerCase(), method: 'wallet' })
  const res = NextResponse.json({ ok: true, address: address.toLowerCase() })
  setSessionCookie(res, session)
  return res
}
