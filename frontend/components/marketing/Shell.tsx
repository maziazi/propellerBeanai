'use client'

import { motion } from 'framer-motion'
import { ArrowRight, Play } from 'lucide-react'
import Link from 'next/link'
import { Header } from '@/components/layout/Header'

export const BLUE = '#4182EB'
export const GREEN = '#169F53'
export const YELLOW = '#F6BA18'
export const RED = '#E24231'
export const F = "'TWK Lausanne Pan', var(--font-inter), Inter, -apple-system, sans-serif"

// ── Chip label ────────────────────────────────────────────────────────────────
export function Chip({ label, color = 'rgba(0,0,0,0.25)', text = '#000' }: { label: string; color?: string; text?: string }) {
  return (
    <div style={{ display: 'inline-flex', alignItems: 'center', border: `0.5px solid ${color}`, borderRadius: 90, padding: '5px 14px', fontSize: 12, fontWeight: 500, color: text, fontFamily: F, letterSpacing: '0.04em', marginBottom: 16 }}>
      {label}
    </div>
  )
}

// ── Page hero ─────────────────────────────────────────────────────────────────
export function PageHero({ chip, chipColor, chipText, title, accent, accentColor = BLUE, sub }: {
  chip: string; chipColor?: string; chipText?: string; title: string; accent?: string; accentColor?: string; sub: string
}) {
  return (
    <section style={{ position: 'relative', backgroundColor: '#FFF', padding: '120px 24px 64px', overflow: 'hidden' }}>
      <div aria-hidden style={{ position: 'absolute', inset: 0, backgroundImage: 'linear-gradient(rgba(0,0,0,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,0.05) 1px, transparent 1px)', backgroundSize: '46px 46px', maskImage: 'radial-gradient(ellipse 70% 80% at 50% 30%, #000 10%, transparent 72%)', WebkitMaskImage: 'radial-gradient(ellipse 70% 80% at 50% 30%, #000 10%, transparent 72%)' }} />
      <div style={{ position: 'relative', zIndex: 2, maxWidth: 760, margin: '0 auto', textAlign: 'center' }}>
        <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
          <Chip label={chip} color={chipColor} text={chipText} />
        </motion.div>
        <motion.h1
          style={{ fontSize: 'clamp(2.4rem, 5vw, 4rem)', fontWeight: 900, color: '#000', letterSpacing: '-0.03em', lineHeight: 1.05, marginBottom: 18, fontFamily: F }}
          initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1, duration: 0.5 }}
        >
          {title}{accent && <> <span style={{ color: accentColor }}>{accent}</span></>}
        </motion.h1>
        <motion.p
          style={{ fontSize: 17, color: '#5F6368', maxWidth: 520, lineHeight: 1.65, margin: '0 auto', fontFamily: F }}
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.25, duration: 0.45 }}
        >
          {sub}
        </motion.p>
      </div>
    </section>
  )
}

// ── Closing CTA ───────────────────────────────────────────────────────────────
export function CTA({ title = 'Your next decision starts here.', sub = "Don't think alone. Bring a panel." }: { title?: string; sub?: string }) {
  return (
    <section style={{ backgroundColor: '#000', padding: '100px 24px' }}>
      <div style={{ maxWidth: 600, margin: '0 auto', textAlign: 'center' }}>
        <motion.h2
          style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: 900, color: '#FFF', letterSpacing: '-0.03em', marginBottom: 14, fontFamily: F }}
          initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
        >
          {title}
        </motion.h2>
        <p style={{ fontFamily: F, fontSize: 16, color: 'rgba(255,255,255,0.55)', marginBottom: 36, lineHeight: 1.6 }}>{sub}</p>
        <div style={{ display: 'flex', gap: 10, justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link href="/app" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, backgroundColor: BLUE, color: '#FFF', border: '0.5px solid rgba(255,255,255,0.25)', borderRadius: 90, padding: '13px 28px', fontSize: 14, fontWeight: 600, textDecoration: 'none', fontFamily: F }}>
            Start analyzing free <ArrowRight size={14} />
          </Link>
          <Link href="/" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, color: 'rgba(255,255,255,0.8)', border: '0.5px solid rgba(255,255,255,0.28)', borderRadius: 90, padding: '13px 28px', fontSize: 14, fontWeight: 500, textDecoration: 'none', fontFamily: F }}>
            <Play size={13} /> Back to home
          </Link>
        </div>
      </div>
    </section>
  )
}

// ── Footer ────────────────────────────────────────────────────────────────────
export function Footer() {
  return (
    <footer style={{ backgroundColor: '#000', padding: '28px 24px' }}>
      <div style={{ maxWidth: 960, margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 14 }}>
        <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: 6, textDecoration: 'none' }}>
          <span style={{ display: 'flex', gap: 3 }}>
            {[BLUE, RED, YELLOW, GREEN].map((c, i) => <span key={i} style={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: c, display: 'block' }} />)}
          </span>
          <span style={{ fontFamily: F, fontWeight: 700, fontSize: 15, color: '#FFF' }}>
            Bean<span style={{ color: BLUE }}>AI</span>
          </span>
        </Link>
        <p style={{ fontFamily: 'monospace', fontSize: 11, color: 'rgba(255,255,255,0.5)', margin: 0 }}>© 2026 Propeller · CROO Agent Hackathon</p>
        <div style={{ display: 'flex', gap: 20 }}>
          {[['Privacy', '#'], ['Terms', '#'], ['Docs', '#']].map(([l, h]) => (
            <a key={l} href={h} style={{ fontFamily: F, fontSize: 12, color: 'rgba(255,255,255,0.7)', textDecoration: 'none' }}>{l}</a>
          ))}
        </div>
      </div>
    </footer>
  )
}

// ── Page shell (Header + content + Footer) ────────────────────────────────────
export function MarketingShell({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ backgroundColor: '#FFF', color: '#000' }}>
      <Header />
      {children}
    </div>
  )
}
