'use client'

import { motion } from 'framer-motion'
import { useParams, notFound } from 'next/navigation'
import { FileCheck, MessageSquare, Network, Check, ArrowRight } from 'lucide-react'
import Link from 'next/link'
import { MarketingShell, PageHero, CTA, Footer, BLUE, GREEN, YELLOW, RED, F } from '@/components/marketing/Shell'

type Feature = {
  chip: string; accent: string; Icon?: React.ElementType; tag?: string
  title: string; accentWord: string; sub: string
  why: string; does: string[]; example: { label: string; text: string }
}

const FEATURES: Record<string, Feature> = {
  'decision-receipt': {
    chip: 'FEATURE · PROOF', accent: GREEN, Icon: FileCheck, title: 'Decision Receipt.', accentWord: 'Prove it.',
    sub: 'Every analysis emits a SHA-256 fingerprint. The same topic always produces the same hash — so anyone can verify the output was never altered.',
    why: 'Most AI output is unverifiable — you have to take it on faith. A receipt turns a decision into something you can prove, audit, and re-check later.',
    does: ['Deterministic SHA-256 hash of the full analysis', 'Same topic always yields the same hash', 'One-click public verification of any result'],
    example: { label: 'RECEIPT', text: 'SHA-256 a3f8c2d1…9e01bf43 · Verdict: Proceed' },
  },
  'debate-engine': {
    chip: 'FEATURE · ENGINE', accent: YELLOW, Icon: MessageSquare, title: 'Debate Engine.', accentWord: 'They argue first.',
    sub: 'A second round where every mind reads the others and pushes back. Conflicts surface, blind spots disappear, and the verdict gets sharper.',
    why: 'A single answer hides its own weak points. Forcing the minds to disagree is what makes hidden risks and emergent insight come out.',
    does: ['Round 2: each mind responds to the others', 'Conflicts surface automatically', 'The verdict sharpens through disagreement'],
    example: { label: 'ROUND 2', text: 'RISK → GAIN: "Your adoption rate is too optimistic."' },
  },
  'knowledge-graph': {
    chip: 'FEATURE · VISUAL', accent: BLUE, Icon: Network, title: 'Knowledge Graph.', accentWord: 'See the reasoning.',
    sub: 'An interactive map of every concept the minds surfaced and how they connect — so you can explore the chain of reasoning visually.',
    why: 'A wall of text hides structure. A graph lets you see which ideas connect, which minds drove them, and where the reasoning concentrates.',
    does: ['Every concept rendered as a node', 'Relationships drawn between the minds', 'Click any node to follow the reasoning'],
    example: { label: 'GRAPH', text: '42 nodes · 78 edges across 6 minds' },
  },
  'white-hat': {
    chip: 'FEATURE · MIND', accent: '#9AA0A6', tag: 'FACT', title: 'White Hat.', accentWord: 'Facts & data.',
    sub: 'Gathers verifiable, cited information in real time and flags what is still unknown — the evidence layer the other minds build on.',
    why: 'Decisions break when they rest on stale or made-up facts. White Hat keeps the panel grounded in sources you can check.',
    does: ['Retrieves real-time data from the web', 'Cites every claim to a source', 'Flags what is unknown or unverified'],
    example: { label: 'FACT', text: 'Market size $197B at 18.7% CAGR · 3 sources' },
  },
  'red-hat': {
    chip: 'FEATURE · MIND', accent: RED, tag: 'FEEL', title: 'Red Hat.', accentWord: 'Emotion & intuition.',
    sub: 'Names the feelings around a decision — excitement, fear, doubt — and separates gut instinct from the evidence.',
    why: 'Emotion quietly drives most calls. Naming it lets you weigh it on purpose instead of being steered by it.',
    does: ['Surfaces the emotional drivers', 'Separates gut from evidence', 'Flags when feeling is steering the call'],
    example: { label: 'FEEL', text: 'Strong excitement mixed with fear of failure' },
  },
  'black-hat': {
    chip: 'FEATURE · MIND', accent: '#3C4043', tag: 'RISK', title: 'Black Hat.', accentWord: 'Risks & caution.',
    sub: "The devil's advocate by design — required to find what's wrong, challenge optimistic assumptions, and expose failure modes early.",
    why: 'No one on a team wants to be the pessimist. Black Hat makes that role mandatory so risks surface while they are still cheap to fix.',
    does: ['Hunts for failure modes', 'Challenges optimistic assumptions', "Required to find what's wrong"],
    example: { label: 'RISK', text: 'Runway risk critical — 18 months before revenue' },
  },
  'yellow-hat': {
    chip: 'FEATURE · MIND', accent: '#F29900', tag: 'GAIN', title: 'Yellow Hat.', accentWord: 'Gains & opportunity.',
    sub: 'Maps the upside — best-case outcomes, quantified gains, and the defensible advantages a decision could unlock.',
    why: 'Risk-only thinking kills good ideas. Yellow Hat makes sure the upside gets weighed as rigorously as the downside.',
    does: ['Identifies the best-case outcomes', 'Quantifies the potential gains', 'Finds defensible advantages'],
    example: { label: 'GAIN', text: 'Behavioral dataset is a defensible moat' },
  },
  'green-hat': {
    chip: 'FEATURE · MIND', accent: GREEN, tag: 'WILD', title: 'Green Hat.', accentWord: 'Creative alternatives.',
    sub: 'Generates options no one asked for — unconventional paths, reframes of the problem, and bold "what if?" moves.',
    why: 'The best option is often one you never listed. Green Hat widens the choice set before you commit.',
    does: ['Proposes unconventional paths', 'Reframes the problem', 'Asks the bold "what if?"'],
    example: { label: 'WILD', text: 'What if you added team billing this week? $5.6K MRR' },
  },
  'blue-hat': {
    chip: 'FEATURE · MIND', accent: BLUE, tag: 'MERGE', title: 'Blue Hat.', accentWord: 'Synthesis & verdict.',
    sub: 'Weighs every mind, resolves the conflicts from the debate, and issues one confidence-scored verdict you can act on.',
    why: 'Six perspectives are useless without a decision. Blue Hat is the one that turns the panel into an answer.',
    does: ['Synthesizes all six perspectives', 'Resolves conflicts from the debate', 'Issues a confidence-scored verdict'],
    example: { label: 'MERGE', text: 'WAIT → GO after 30-day sprint · 74%' },
  },
}

export default function FeaturePage() {
  const { slug } = useParams<{ slug: string }>()
  const f = FEATURES[slug]
  if (!f) return notFound()
  const A = f.accent
  const lightTag = A === '#F29900'

  return (
    <MarketingShell>
      <PageHero chip={f.chip} chipColor={A} chipText={A} title={f.title} accent={f.accentWord} accentColor={A} sub={f.sub} />

      {/* Detail: visual + why · what it does */}
      <section style={{ padding: '24px 24px 0' }}>
        <div className="grid grid-cols-1 md:grid-cols-[1fr_1.3fr]" style={{ gap: 12, maxWidth: 880, margin: '0 auto', alignItems: 'stretch' }}>
          {/* Visual + why */}
          <div style={{ border: '0.5px solid rgba(0,0,0,0.85)', borderRadius: 12, padding: '24px', backgroundColor: '#FFF' }}>
            {f.Icon ? (
              <div style={{ width: 46, height: 46, borderRadius: 11, backgroundColor: A + '18', border: `0.5px solid ${A}35`, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 16, color: A }}>
                <f.Icon size={22} />
              </div>
            ) : (
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
                <span style={{ width: 34, height: 34, borderRadius: '50%', backgroundColor: A, display: 'block' }} />
                <span style={{ fontFamily: 'monospace', fontSize: 11, fontWeight: 700, padding: '3px 9px', borderRadius: 90, backgroundColor: A, color: lightTag ? '#202124' : '#FFF' }}>{f.tag}</span>
              </div>
            )}
            <p style={{ fontFamily: 'monospace', fontSize: 10, color: '#9AA0A6', letterSpacing: '0.06em', marginBottom: 6 }}>WHY IT MATTERS</p>
            <p style={{ fontFamily: F, fontSize: 14.5, color: '#202124', lineHeight: 1.6 }}>{f.why}</p>
          </div>

          {/* What it does */}
          <div style={{ border: '0.5px solid rgba(0,0,0,0.85)', borderRadius: 12, padding: '24px', backgroundColor: '#FFF' }}>
            <p style={{ fontFamily: 'monospace', fontSize: 10, color: '#9AA0A6', letterSpacing: '0.06em', marginBottom: 14 }}>WHAT IT DOES</p>
            {f.does.map((d, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 11, marginBottom: i < f.does.length - 1 ? 14 : 0 }}>
                <div style={{ width: 22, height: 22, borderRadius: '50%', backgroundColor: A + '18', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: 1, color: A }}>
                  <Check size={13} />
                </div>
                <p style={{ fontFamily: F, fontSize: 14, color: '#202124', lineHeight: 1.5, margin: 0 }}>{d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Example */}
      <section style={{ padding: '32px 24px 80px' }}>
        <motion.div style={{ maxWidth: 560, margin: '0 auto', border: `0.5px solid ${A}`, borderRadius: 14, overflow: 'hidden', boxShadow: `0 12px 36px ${A}22` }}
          initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
          <div style={{ padding: '16px 20px', display: 'flex', alignItems: 'center', gap: 12 }}>
            <span style={{ fontFamily: 'monospace', fontSize: 10, fontWeight: 700, padding: '3px 9px', borderRadius: 90, backgroundColor: A, color: lightTag ? '#202124' : '#FFF', flexShrink: 0 }}>{f.example.label}</span>
            <p style={{ fontFamily: F, fontSize: 14, color: '#202124', margin: 0 }}>{f.example.text}</p>
          </div>
        </motion.div>

        <div style={{ display: 'flex', justifyContent: 'center', marginTop: 28 }}>
          <Link href="/app" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, backgroundColor: BLUE, color: '#FFF', border: '0.5px solid rgba(0,0,0,0.75)', borderRadius: 90, padding: '12px 26px', fontSize: 14, fontWeight: 600, textDecoration: 'none', fontFamily: F }}>
            See it in action <ArrowRight size={14} />
          </Link>
        </div>
      </section>

      <CTA />
      <Footer />
    </MarketingShell>
  )
}
