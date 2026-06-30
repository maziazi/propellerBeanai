'use client'

import { motion } from 'framer-motion'
import { useParams, notFound } from 'next/navigation'
import {
  Terminal, Zap, Globe, Share2, Network, FileCheck,
  Code, Cpu, Coins, GitBranch, ArrowRight,
} from 'lucide-react'
import Link from 'next/link'
import { MarketingShell, PageHero, CTA, Footer, BLUE, GREEN, YELLOW, RED, F } from '@/components/marketing/Shell'

type Feature = { Icon: React.ElementType; title: string; desc: string }
type Product = {
  chip: string; accentColor: string; title: string; accent: string; sub: string
  features: Feature[]; specs: { k: string; v: string }[]
  preview: React.ReactNode
}

// ── Preview blocks ──────────────────────────────────────────────────────────────
function BrowserPreview() {
  return (
    <div style={{ border: '0.5px solid rgba(0,0,0,0.85)', borderRadius: 12, overflow: 'hidden', backgroundColor: '#FFF', boxShadow: '0 12px 40px rgba(0,0,0,0.10)' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '10px 16px', backgroundColor: '#F5F5F5', borderBottom: '0.5px solid rgba(0,0,0,0.10)' }}>
        {[RED, YELLOW, GREEN].map((c, i) => <div key={i} style={{ width: 10, height: 10, borderRadius: '50%', backgroundColor: c }} />)}
        <div style={{ marginLeft: 12, flex: 1, fontFamily: 'monospace', fontSize: 11, color: '#9AA0A6', backgroundColor: '#E8E8E8', borderRadius: 90, padding: '3px 12px', textAlign: 'center' }}>beanai.app/app</div>
      </div>
      <div style={{ padding: 20, display: 'flex', flexDirection: 'column', gap: 8 }}>
        {[['FACT', BLUE], ['FEEL', RED], ['RISK', '#3C4043'], ['MERGE', BLUE]].map(([l, c], i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 12px', borderRadius: 8, backgroundColor: '#F8F9FA' }}>
            <span style={{ fontFamily: 'monospace', fontSize: 9, fontWeight: 700, padding: '2px 7px', borderRadius: 90, backgroundColor: c as string, color: '#FFF' }}>{l}</span>
            <div style={{ flex: 1, height: 6, borderRadius: 3, backgroundColor: c as string, opacity: 0.18, width: `${60 + i * 8}%` }} />
          </div>
        ))}
      </div>
    </div>
  )
}

function TerminalPreview() {
  const lines: [string, string][] = [
    ['$ ', 'npm install -g beanai'],
    ['$ ', 'beanai ask "Should I pivot to B2B?"'],
    ['', '⠋ 6 minds analyzing...'],
    ['', '✓ FACT   market verified · 3 sources'],
    ['', '✓ RISK   churn risk flagged'],
    ['', '✓ MERGE  Proceed — 74% confidence'],
    ['$ ', 'beanai ask "..." --json | jq .verdict'],
  ]
  return (
    <div style={{ backgroundColor: '#000', border: `0.5px solid ${GREEN}`, borderRadius: 12, overflow: 'hidden', boxShadow: '0 12px 40px rgba(0,0,0,0.18)' }}>
      <div style={{ padding: '10px 16px', borderBottom: '0.5px solid rgba(22,159,83,0.25)', display: 'flex', alignItems: 'center', gap: 6 }}>
        {[RED, YELLOW, GREEN].map((c, i) => <div key={i} style={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: c }} />)}
        <span style={{ fontFamily: 'monospace', fontSize: 11, color: 'rgba(255,255,255,0.35)', marginLeft: 10 }}>zsh — beanai</span>
      </div>
      <div style={{ padding: '18px 20px', fontFamily: 'monospace', fontSize: 12.5, lineHeight: 2 }}>
        {lines.map(([p, t], i) => (
          <div key={i} style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            <span style={{ color: GREEN }}>{p}</span>
            <span style={{ color: t.startsWith('✓') ? '#8FE3AD' : '#FFF' }}>{t}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

function CrooPreview() {
  return (
    <div style={{ backgroundColor: '#0B1220', border: `0.5px solid ${BLUE}`, borderRadius: 12, overflow: 'hidden', boxShadow: '0 12px 40px rgba(65,130,235,0.20)' }}>
      <div style={{ padding: '10px 16px', borderBottom: 'rgba(65,130,235,0.25) 0.5px solid', display: 'flex', alignItems: 'center', gap: 6 }}>
        {[RED, YELLOW, GREEN].map((c, i) => <div key={i} style={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: c }} />)}
        <span style={{ fontFamily: 'monospace', fontSize: 11, color: 'rgba(255,255,255,0.4)', marginLeft: 10 }}>POST /cap/agents/beanai/invoke</span>
      </div>
      <div style={{ padding: '18px 20px', fontFamily: 'monospace', fontSize: 12, lineHeight: 1.9, color: '#C9D4E5' }}>
        <div><span style={{ color: '#6FA8FF' }}>{'{'}</span></div>
        <div style={{ paddingLeft: 16 }}><span style={{ color: '#8FE3AD' }}>{'"topic"'}</span>: <span style={{ color: '#FFD479' }}>{'"Pivot SaaS to B2B?"'}</span>,</div>
        <div style={{ paddingLeft: 16 }}><span style={{ color: '#8FE3AD' }}>{'"pay"'}</span>: <span style={{ color: '#FFD479' }}>{'"0.50 USDC"'}</span>,</div>
        <div style={{ paddingLeft: 16 }}><span style={{ color: '#8FE3AD' }}>{'"settle"'}</span>: <span style={{ color: '#FFD479' }}>{'"on-chain"'}</span></div>
        <div><span style={{ color: '#6FA8FF' }}>{'}'}</span></div>
        <div style={{ marginTop: 10, color: GREEN }}>→ 200 OK · verdict + SHA-256 receipt</div>
      </div>
    </div>
  )
}

// ── Product data ────────────────────────────────────────────────────────────────
const PRODUCTS: Record<string, Product> = {
  web: {
    chip: 'PRODUCT · WEBSITE', accentColor: BLUE, title: 'BeanAI on the web.', accent: 'No setup.',
    sub: 'The full six-minds experience in your browser. Type a decision, watch the panel debate, and get a verifiable verdict — nothing to install.',
    features: [
      { Icon: Globe, title: 'Zero install', desc: 'Open the app and start analyzing instantly. Works on any device with a browser.' },
      { Icon: Network, title: 'Interactive graph', desc: 'Explore the knowledge graph of every concept the minds surfaced, visually.' },
      { Icon: Share2, title: 'Shareable results', desc: 'Every analysis has a permalink — send the full report and receipt to your team.' },
      { Icon: FileCheck, title: 'Saved history', desc: 'Revisit past decisions, compare verdicts, and track how your thinking evolved.' },
    ],
    specs: [{ k: 'Access', v: 'Browser' }, { k: 'Setup', v: 'None' }, { k: 'Output', v: 'Report + graph' }, { k: 'Sharing', v: 'Permalink' }],
    preview: <BrowserPreview />,
  },
  cli: {
    chip: 'PRODUCT · CLI', accentColor: GREEN, title: 'BeanAI in your terminal.', accent: 'Scriptable.',
    sub: 'For developers who live in the shell. Pipe decisions through six minds, get clean JSON, and wire BeanAI into any script or CI pipeline.',
    features: [
      { Icon: Terminal, title: 'One command', desc: 'beanai ask "..." runs the full panel and streams the debate right in your terminal.' },
      { Icon: Code, title: 'JSON output', desc: 'Add --json to pipe structured verdicts into jq, scripts, or your own tooling.' },
      { Icon: GitBranch, title: 'CI-friendly', desc: 'Gate releases or PRs on a BeanAI verdict — exit codes you can branch on.' },
      { Icon: Cpu, title: 'Local config', desc: 'Set default depth, models, and output format once in ~/.beanairc.' },
    ],
    specs: [{ k: 'Install', v: 'npm i -g beanai' }, { k: 'Output', v: 'TTY / JSON' }, { k: 'CI', v: 'Exit codes' }, { k: 'Config', v: '~/.beanairc' }],
    preview: <TerminalPreview />,
  },
  croo: {
    chip: 'PRODUCT · CROO', accentColor: '#7C6FF0', title: 'BeanAI for AI agents.', accent: 'Autonomous.',
    sub: 'Any agent on the CROO network can hire BeanAI as a reasoning layer — pay per analysis in USDC, settle on-chain, no human in the loop.',
    features: [
      { Icon: Zap, title: 'Callable via CAP', desc: 'The CROO Agent Protocol lets any agent invoke BeanAI with a single API call.' },
      { Icon: Code, title: 'Structured JSON', desc: 'Verdicts return as clean JSON — drop them straight into your agent pipeline.' },
      { Icon: Coins, title: 'Pay-per-analysis', desc: 'Micro-payments in USDC, metered per call and settled automatically on-chain.' },
      { Icon: Network, title: 'Fully A2A', desc: 'Agent-to-agent: BeanAI receives, analyzes, and delivers with no human involved.' },
    ],
    specs: [{ k: 'Protocol', v: 'CAP / A2A' }, { k: 'Payment', v: 'USDC' }, { k: 'Settle', v: 'On-chain' }, { k: 'Output', v: 'JSON + receipt' }],
    preview: <CrooPreview />,
  },
}

export default function ProductPage() {
  const { slug } = useParams<{ slug: string }>()
  const p = PRODUCTS[slug]
  if (!p) return notFound()

  return (
    <MarketingShell>
      <PageHero chip={p.chip} chipColor={p.accentColor} chipText={p.accentColor} title={p.title} accent={p.accent} accentColor={p.accentColor} sub={p.sub} />

      {/* CTA row */}
      <div style={{ display: 'flex', gap: 10, justifyContent: 'center', flexWrap: 'wrap', padding: '0 24px 8px' }}>
        <Link href="/app" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, backgroundColor: BLUE, color: '#FFF', border: '0.5px solid rgba(0,0,0,0.75)', borderRadius: 90, padding: '12px 26px', fontSize: 14, fontWeight: 600, textDecoration: 'none', fontFamily: F }}>
          Get started <ArrowRight size={14} />
        </Link>
        <Link href="/products/web" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, color: '#000', border: '0.5px solid rgba(0,0,0,0.35)', borderRadius: 90, padding: '12px 26px', fontSize: 14, fontWeight: 500, textDecoration: 'none', fontFamily: F }}>
          Compare products
        </Link>
      </div>

      {/* Preview */}
      <section style={{ padding: '48px 24px' }}>
        <motion.div style={{ maxWidth: 680, margin: '0 auto' }} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }}>
          {p.preview}
        </motion.div>
      </section>

      {/* Features */}
      <section style={{ padding: '24px 24px 80px' }}>
        <div className="grid grid-cols-1 md:grid-cols-2" style={{ gap: 12, maxWidth: 880, margin: '0 auto' }}>
          {p.features.map((f, i) => (
            <motion.div key={f.title} style={{ border: '0.5px solid rgba(0,0,0,0.85)', borderRadius: 12, padding: '22px 24px', backgroundColor: '#FFF' }}
              initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.06 }}>
              <div style={{ width: 38, height: 38, borderRadius: 9, backgroundColor: p.accentColor + '18', border: `0.5px solid ${p.accentColor}35`, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 14, color: p.accentColor }}>
                <f.Icon size={18} />
              </div>
              <h3 style={{ fontFamily: F, fontSize: 15, fontWeight: 700, color: '#000', marginBottom: 6 }}>{f.title}</h3>
              <p style={{ fontFamily: F, fontSize: 13.5, color: '#5F6368', lineHeight: 1.55 }}>{f.desc}</p>
            </motion.div>
          ))}
        </div>

        {/* Specs strip */}
        <div className="grid grid-cols-2 md:grid-cols-4" style={{ gap: 0, maxWidth: 880, margin: '32px auto 0', border: '0.5px solid rgba(0,0,0,0.12)', borderRadius: 12, overflow: 'hidden' }}>
          {p.specs.map((s, i) => (
            <div key={s.k} style={{ padding: '18px 20px', borderLeft: i % 4 === 0 ? 'none' : '0.5px solid rgba(0,0,0,0.08)', borderTop: i >= 2 ? '0.5px solid rgba(0,0,0,0.08)' : 'none' }} className="md:border-t-0">
              <p style={{ fontFamily: 'monospace', fontSize: 10, color: '#9AA0A6', letterSpacing: '0.06em', marginBottom: 4 }}>{s.k.toUpperCase()}</p>
              <p style={{ fontFamily: F, fontSize: 14, fontWeight: 700, color: '#000' }}>{s.v}</p>
            </div>
          ))}
        </div>
      </section>

      <CTA />
      <Footer />
    </MarketingShell>
  )
}
