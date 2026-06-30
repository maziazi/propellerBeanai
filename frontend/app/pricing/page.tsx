'use client'

import { motion } from 'framer-motion'
import { Check, ArrowRight } from 'lucide-react'
import Link from 'next/link'
import { MarketingShell, PageHero, CTA, Footer, BLUE, GREEN, F } from '@/components/marketing/Shell'

type Tier = {
  name: string; price: string; unit: string; blurb: string; cta: string; href: string
  accent: string; featured?: boolean; features: string[]
}

const TIERS: Tier[] = [
  {
    name: 'Free', price: '$0', unit: '/ forever', blurb: 'For trying BeanAI and one-off decisions.', cta: 'Get started', href: '/app', accent: '#3C4043',
    features: ['5 analyses / month', 'All six minds', 'Debate round', 'Shareable results', 'Decision receipt'],
  },
  {
    name: 'Pro', price: '$19', unit: '/ month', blurb: 'For people who decide for a living.', cta: 'Start Pro', href: '/login', accent: BLUE, featured: true,
    features: ['Unlimited analyses', 'Deep research mode', 'Knowledge graph export', 'Full decision history', 'Priority models', 'Email + wallet login'],
  },
  {
    name: 'Agent', price: 'USDC', unit: '/ per call', blurb: 'For AI agents on the CROO network.', cta: 'View on CROO', href: '/products/croo', accent: GREEN,
    features: ['Callable via CAP', 'Pay-per-analysis in USDC', 'On-chain settlement', 'Structured JSON output', 'Fully autonomous A2A', 'SHA-256 receipts'],
  },
]

export default function PricingPage() {
  return (
    <MarketingShell>
      <PageHero chip="PRICING" title="Simple pricing." accent="No surprises." accentColor={GREEN} sub="Start free. Go unlimited when you need it. Agents pay only for what they call." />

      <section style={{ padding: '24px 24px 80px' }}>
        <div className="grid grid-cols-1 md:grid-cols-3" style={{ gap: 14, maxWidth: 920, margin: '0 auto', alignItems: 'start' }}>
          {TIERS.map((t, i) => (
            <motion.div key={t.name}
              style={{ border: t.featured ? `1.5px solid ${t.accent}` : '0.5px solid rgba(0,0,0,0.85)', borderRadius: 14, overflow: 'hidden', backgroundColor: '#FFF', boxShadow: t.featured ? `0 18px 48px ${t.accent}22` : '0 6px 20px rgba(0,0,0,0.04)' }}
              initial={{ opacity: 0, y: 14 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08 }}>
              <div style={{ padding: '24px 24px 18px', borderBottom: '0.5px solid rgba(0,0,0,0.08)' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
                  <h3 style={{ fontFamily: F, fontSize: 16, fontWeight: 800, color: '#000' }}>{t.name}</h3>
                  {t.featured && <span style={{ fontFamily: 'monospace', fontSize: 9, fontWeight: 700, color: '#FFF', backgroundColor: t.accent, borderRadius: 90, padding: '3px 9px' }}>POPULAR</span>}
                </div>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: 6, marginBottom: 6 }}>
                  <span style={{ fontFamily: F, fontSize: 34, fontWeight: 900, color: '#000', letterSpacing: '-0.03em' }}>{t.price}</span>
                  <span style={{ fontFamily: F, fontSize: 13, color: '#9AA0A6' }}>{t.unit}</span>
                </div>
                <p style={{ fontFamily: F, fontSize: 13, color: '#5F6368', lineHeight: 1.5 }}>{t.blurb}</p>
              </div>
              <div style={{ padding: '20px 24px' }}>
                {t.features.map((f, j) => (
                  <div key={j} style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: j < t.features.length - 1 ? 12 : 18 }}>
                    <Check size={15} style={{ color: t.accent, flexShrink: 0 }} />
                    <span style={{ fontFamily: F, fontSize: 13.5, color: '#202124' }}>{f}</span>
                  </div>
                ))}
                <Link href={t.href} style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
                  backgroundColor: t.featured ? t.accent : 'transparent', color: t.featured ? '#FFF' : '#000',
                  border: t.featured ? '0.5px solid rgba(0,0,0,0.75)' : '0.5px solid rgba(0,0,0,0.35)',
                  borderRadius: 90, padding: '11px 20px', fontSize: 14, fontWeight: 600, textDecoration: 'none', fontFamily: F,
                }}>
                  {t.cta} <ArrowRight size={14} />
                </Link>
              </div>
            </motion.div>
          ))}
        </div>

        <p style={{ fontFamily: F, fontSize: 13, color: '#9AA0A6', textAlign: 'center', marginTop: 28 }}>
          All plans include the full six-minds panel and verifiable receipts. Cancel anytime.
        </p>
      </section>

      <CTA />
      <Footer />
    </MarketingShell>
  )
}
