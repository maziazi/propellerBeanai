'use client'

import { useState, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { motion } from 'framer-motion'
import { Mail, Wallet, ArrowRight, Check, Loader2 } from 'lucide-react'
import Link from 'next/link'
import { BLUE, GREEN, RED, F } from '@/components/marketing/Shell'

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

type EthProvider = {
  request: (args: { method: string; params?: unknown[] }) => Promise<unknown>
}
function getEthereum(): EthProvider | undefined {
  return (typeof window !== 'undefined' ? (window as unknown as { ethereum?: EthProvider }).ethereum : undefined)
}

function GoogleIcon({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" aria-hidden>
      <path fill="#4285F4" d="M45.12 24.5c0-1.56-.14-3.06-.4-4.5H24v8.51h11.84c-.51 2.75-2.06 5.08-4.39 6.64v5.52h7.11c4.16-3.83 6.56-9.47 6.56-16.17z" />
      <path fill="#34A853" d="M24 46c5.94 0 10.92-1.97 14.56-5.33l-7.11-5.52c-1.97 1.32-4.49 2.1-7.45 2.1-5.73 0-10.58-3.87-12.31-9.07H4.34v5.7C7.96 41.07 15.4 46 24 46z" />
      <path fill="#FBBC05" d="M11.69 28.18C11.25 26.86 11 25.45 11 24s.25-2.86.69-4.18v-5.7H4.34A21.99 21.99 0 0 0 2 24c0 3.55.85 6.91 2.34 9.88l7.35-5.7z" />
      <path fill="#EA4335" d="M24 10.75c3.23 0 6.13 1.11 8.41 3.29l6.31-6.31C34.91 4.18 29.93 2 24 2 15.4 2 7.96 6.93 4.34 14.12l7.35 5.7c1.73-5.2 6.58-9.07 12.31-9.07z" />
    </svg>
  )
}

function LoginCard() {
  const router = useRouter()
  const params = useSearchParams()

  const [email, setEmail] = useState('')
  const [emailState, setEmailState] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle')
  const [emailMsg, setEmailMsg] = useState(
    params.get('error') === 'expired' ? 'That link expired. Request a new one below.' : '',
  )
  const [devLink, setDevLink] = useState<string | null>(null)

  const [walletState, setWalletState] = useState<'idle' | 'busy' | 'error'>('idle')
  const [walletMsg, setWalletMsg] = useState('')

  const err = params.get('error')
  const oauthMsg =
    err === 'google_unconfigured' ? 'Google sign-in isn’t configured yet.'
    : err === 'google_failed' ? 'Google sign-in failed. Please try again.'
    : ''

  async function sendEmail(e: React.FormEvent) {
    e.preventDefault()
    if (!EMAIL_RE.test(email)) { setEmailState('error'); setEmailMsg('Enter a valid email address'); return }
    setEmailState('sending'); setEmailMsg(''); setDevLink(null)
    try {
      const r = await fetch('/api/auth/email', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email }) })
      const data = await r.json()
      if (!r.ok) throw new Error(data.error || 'Something went wrong')
      setEmailState('sent')
      if (data.devLink) setDevLink(data.devLink as string)
    } catch (err) {
      setEmailState('error'); setEmailMsg(err instanceof Error ? err.message : 'Failed to send')
    }
  }

  async function connectWallet() {
    const eth = getEthereum()
    if (!eth) { setWalletState('error'); setWalletMsg('MetaMask not detected. Install it to continue.'); return }
    setWalletState('busy'); setWalletMsg('')
    try {
      const accounts = (await eth.request({ method: 'eth_requestAccounts' })) as string[]
      const address = accounts?.[0]
      if (!address) throw new Error('No account selected')

      const nonceRes = await fetch('/api/auth/nonce')
      const { message, token } = await nonceRes.json()

      const signature = (await eth.request({ method: 'personal_sign', params: [message, address] })) as string

      const verifyRes = await fetch('/api/auth/wallet', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ address, signature, token }),
      })
      const data = await verifyRes.json()
      if (!verifyRes.ok) throw new Error(data.error || 'Verification failed')
      router.push('/app')
    } catch (err) {
      const m = err instanceof Error ? err.message : 'Connection failed'
      setWalletState('error')
      setWalletMsg(/user rejected|denied/i.test(m) ? 'Signature request rejected' : m)
    }
  }

  return (
    <div style={{ width: '100%', maxWidth: 400, backgroundColor: '#FFF', border: '0.5px solid rgba(0,0,0,0.85)', borderRadius: 16, boxShadow: '0 18px 50px rgba(0,0,0,0.10)', overflow: 'hidden' }}>
      <div style={{ padding: '28px 28px 0', textAlign: 'center' }}>
        <Link href="/" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, textDecoration: 'none', marginBottom: 14 }}>
          <span style={{ display: 'flex', gap: 3 }}>
            {[BLUE, RED, '#F6BA18', GREEN].map((c, i) => <span key={i} style={{ width: 7, height: 7, borderRadius: '50%', backgroundColor: c, display: 'block' }} />)}
          </span>
          <span style={{ fontFamily: F, fontWeight: 700, fontSize: 16, color: '#202124' }}>Bean<span style={{ color: BLUE }}>AI</span></span>
        </Link>
        <h1 style={{ fontFamily: F, fontSize: 22, fontWeight: 800, color: '#000', letterSpacing: '-0.02em', marginBottom: 4 }}>Welcome back</h1>
        <p style={{ fontFamily: F, fontSize: 13.5, color: '#5F6368' }}>Sign in with email or your wallet.</p>
      </div>

      <div style={{ padding: 28 }}>
        {emailState === 'sent' ? (
          <div style={{ textAlign: 'center', padding: '12px 0 4px' }}>
            <div style={{ width: 44, height: 44, borderRadius: '50%', backgroundColor: GREEN + '18', border: `0.5px solid ${GREEN}40`, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 14px', color: GREEN }}>
              <Check size={22} />
            </div>
            <p style={{ fontFamily: F, fontSize: 15, fontWeight: 700, color: '#000', marginBottom: 4 }}>Check your inbox</p>
            <p style={{ fontFamily: F, fontSize: 13, color: '#5F6368', lineHeight: 1.5 }}>We emailed a sign-in link to <strong>{email}</strong>. It expires in 15 minutes.</p>
            {devLink && (
              <div style={{ marginTop: 16, padding: 12, borderRadius: 10, backgroundColor: '#FFF8E6', border: '0.5px solid #F6BA1840' }}>
                <p style={{ fontFamily: 'monospace', fontSize: 10, color: '#8A5800', marginBottom: 6 }}>DEV — SMTP not configured</p>
                <a href={devLink} style={{ fontFamily: F, fontSize: 13, fontWeight: 600, color: BLUE, textDecoration: 'none' }}>Open sign-in link →</a>
              </div>
            )}
            <button onClick={() => { setEmailState('idle'); setDevLink(null) }} style={{ marginTop: 16, background: 'none', border: 'none', cursor: 'pointer', fontFamily: F, fontSize: 13, color: '#5F6368' }}>
              Use a different email
            </button>
          </div>
        ) : (
          <form onSubmit={sendEmail}>
            <label style={{ fontFamily: F, fontSize: 12, fontWeight: 600, color: '#202124', display: 'block', marginBottom: 6 }}>Email</label>
            <div style={{ position: 'relative', marginBottom: 10 }}>
              <Mail size={15} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: '#9AA0A6' }} />
              <input
                type="email" value={email} onChange={e => { setEmail(e.target.value); setEmailState('idle'); setEmailMsg('') }}
                placeholder="you@company.com" autoComplete="email"
                style={{ width: '100%', fontFamily: F, fontSize: 14, color: '#202124', padding: '11px 12px 11px 36px', borderRadius: 10, border: `0.5px solid ${emailState === 'error' ? RED : 'rgba(0,0,0,0.25)'}`, outline: 'none', background: '#FFF' }}
              />
            </div>
            <button type="submit" disabled={emailState === 'sending'}
              style={{ width: '100%', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 7, backgroundColor: BLUE, color: '#FFF', border: '0.5px solid rgba(0,0,0,0.75)', borderRadius: 90, padding: '11px 20px', fontSize: 14, fontWeight: 600, fontFamily: F, cursor: emailState === 'sending' ? 'default' : 'pointer', opacity: emailState === 'sending' ? 0.7 : 1 }}>
              {emailState === 'sending' ? <><Loader2 size={15} className="spin" /> Sending…</> : <>Email me a link <ArrowRight size={14} /></>}
            </button>
          </form>
        )}

        {emailMsg && emailState !== 'sent' && (
          <p style={{ fontFamily: F, fontSize: 12, color: RED, marginTop: 10, textAlign: 'center' }}>{emailMsg}</p>
        )}

        {/* Divider */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, margin: '20px 0' }}>
          <div style={{ flex: 1, height: 1, backgroundColor: '#E8EAED' }} />
          <span style={{ fontFamily: F, fontSize: 11, color: '#9AA0A6' }}>OR</span>
          <div style={{ flex: 1, height: 1, backgroundColor: '#E8EAED' }} />
        </div>

        {/* Google (left) · MetaMask (right) */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
          <a href="/api/auth/google"
            style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 8, backgroundColor: '#FFF', color: '#202124', border: '0.5px solid rgba(0,0,0,0.35)', borderRadius: 90, padding: '11px 16px', fontSize: 14, fontWeight: 600, fontFamily: F, textDecoration: 'none' }}>
            <GoogleIcon size={16} /> Google
          </a>
          <button onClick={connectWallet} disabled={walletState === 'busy'}
            style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 8, backgroundColor: '#FFF', color: '#202124', border: '0.5px solid rgba(0,0,0,0.35)', borderRadius: 90, padding: '11px 16px', fontSize: 14, fontWeight: 600, fontFamily: F, cursor: walletState === 'busy' ? 'default' : 'pointer' }}>
            {walletState === 'busy' ? <Loader2 size={15} className="spin" /> : <><Wallet size={15} color="#F6851B" /> MetaMask</>}
          </button>
        </div>
        {(walletMsg || oauthMsg) && <p style={{ fontFamily: F, fontSize: 12, color: RED, marginTop: 10, textAlign: 'center' }}>{walletMsg || oauthMsg}</p>}

        <p style={{ fontFamily: F, fontSize: 11.5, color: '#9AA0A6', textAlign: 'center', marginTop: 18, lineHeight: 1.5 }}>
          By continuing you agree to our <a href="#" style={{ color: '#5F6368' }}>Terms</a> & <a href="#" style={{ color: '#5F6368' }}>Privacy</a>.
        </p>
      </div>
    </div>
  )
}

export default function LoginPage() {
  return (
    <div style={{ position: 'relative', minHeight: '100vh', backgroundColor: '#FFF', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '80px 24px', overflow: 'hidden' }}>
      <div aria-hidden style={{ position: 'absolute', inset: 0, backgroundImage: 'linear-gradient(rgba(0,0,0,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,0.05) 1px, transparent 1px)', backgroundSize: '46px 46px', maskImage: 'radial-gradient(ellipse 60% 55% at 50% 50%, #000 20%, transparent 78%)', WebkitMaskImage: 'radial-gradient(ellipse 60% 55% at 50% 50%, #000 20%, transparent 78%)' }} />
      <style>{`.spin{animation:spin 0.8s linear infinite}@keyframes spin{to{transform:rotate(360deg)}}`}</style>
      <motion.div style={{ position: 'relative', zIndex: 2, width: '100%', display: 'flex', justifyContent: 'center' }}
        initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
        <Suspense fallback={null}>
          <LoginCard />
        </Suspense>
      </motion.div>
    </div>
  )
}
