'use client'

import { motion, useScroll, useTransform } from 'framer-motion'
import { ArrowRight, Play, Check, X, Zap, Shield, BarChart3, MessageSquare, Network, Sparkles } from 'lucide-react'
import Link from 'next/link'
import { useRef } from 'react'
import { Header } from '@/components/layout/Header'

const G = {
  blue:        '#4285F4',
  red:         '#EA4335',
  yellow:      '#FBBC04',
  green:       '#34A853',
  blueSoft:    '#E8F0FE',
  redSoft:     '#FCE8E6',
  yellowSoft:  '#FEF9E7',
  greenSoft:   '#E6F4EA',
  text:        '#202124',
  text2:       '#5F6368',
  bg:          '#F8F9FA',
  border:      '#DADCE0',
}

const DEMO_ID = 'a4e2831f-56b0-45da-adac-824f60e44f1e'

// ── App preview mockup ────────────────────────────────────────────────────
function AppPreview() {
  const MIND_CARDS = [
    { label: 'FACT',  color: G.blue,   bg: G.blueSoft,  width: '65%',  text: 'Market size $197B at 18.7% CAGR. 3 verified sources.' },
    { label: 'FEEL',  color: G.red,    bg: G.redSoft,   width: '80%',  text: 'Strong excitement — mixed with underlying fear of failure.' },
    { label: 'RISK',  color: '#3C4043',bg: '#F1F3F4',   width: '55%',  text: 'Runway risk critical. 18 months minimum before revenue.' },
    { label: 'GAIN',  color: '#F29900',bg: '#FEF9E7',   width: '70%',  text: 'Behavioral dataset is a defensible moat competitors lack.' },
    { label: 'WILD',  color: G.green,  bg: G.greenSoft, width: '60%',  text: 'What if you added team billing this week? $5.6K MRR.' },
    { label: 'MERGE', color: '#1A73E8',bg: G.blueSoft,  width: '85%',  text: 'WAIT → GO after 30-day sprint. Confidence: 74%' },
  ]

  return (
    <div
      className="relative rounded-2xl overflow-hidden shadow-2xl border"
      style={{ backgroundColor: '#FFFFFF', borderColor: G.border }}
    >
      {/* Fake browser chrome */}
      <div className="flex items-center gap-1.5 px-4 py-3 border-b" style={{ backgroundColor: G.bg, borderColor: G.border }}>
        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: G.red }} />
        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: G.yellow }} />
        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: G.green }} />
        <div
          className="ml-3 flex-1 text-xs font-mono rounded-full px-3 py-1 text-center"
          style={{ backgroundColor: G.border, color: G.text2 }}
        >
          prismai.app/results/...
        </div>
      </div>

      {/* Topic bar */}
      <div className="px-5 py-4 border-b" style={{ borderColor: G.border }}>
        <div className="flex items-center gap-3">
          <div className="flex gap-1">
            {[G.blue, G.red, G.yellow, G.green].map((c, i) => (
              <span key={i} className="w-2 h-2 rounded-full" style={{ backgroundColor: c }} />
            ))}
          </div>
          <span className="text-xs font-semibold" style={{ color: G.text }}>
            Should I pivot my SaaS to B2B?
          </span>
          <span className="ml-auto text-[10px] font-mono px-2 py-0.5 rounded-full" style={{ backgroundColor: G.greenSoft, color: G.green }}>
            Confidence 74%
          </span>
        </div>
      </div>

      {/* Mind cards */}
      <div className="p-4 space-y-2">
        {MIND_CARDS.map((m, i) => (
          <motion.div
            key={m.label}
            className="flex items-center gap-3 rounded-xl px-3 py-2.5"
            style={{ backgroundColor: m.bg }}
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 + i * 0.08, duration: 0.35 }}
          >
            <span
              className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full shrink-0"
              style={{ backgroundColor: m.color, color: m.label === 'GAIN' ? '#202124' : '#fff' }}
            >
              {m.label}
            </span>
            <div className="flex-1 min-w-0">
              <div
                className="h-1.5 rounded-full mb-1"
                style={{ backgroundColor: m.color, width: m.width, opacity: 0.25 }}
              />
              <p className="text-[10px] leading-tight truncate" style={{ color: G.text2 }}>
                {m.text}
              </p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Bottom bar */}
      <div className="px-4 pb-4 flex items-center gap-2">
        <div className="flex-1 h-7 rounded-lg" style={{ backgroundColor: G.bg, border: `1px solid ${G.border}` }} />
        <div className="h-7 w-16 rounded-lg" style={{ backgroundColor: G.blue, opacity: 0.85 }} />
      </div>
    </div>
  )
}

// ── 6 Minds cards ────────────────────────────────────────────────────────
const MINDS_DATA = [
  {
    key: 'fact', label: 'FACT', hat: 'White Hat',
    color: G.blue, bg: G.blueSoft,
    icon: <BarChart3 size={20} />,
    desc: 'Scans databases, pulls market reports, and cross-references statistics. Every claim comes with a citation.',
  },
  {
    key: 'feel', label: 'FEEL', hat: 'Red Hat',
    color: G.red, bg: G.redSoft,
    icon: <Sparkles size={20} />,
    desc: 'Reads the emotional undercurrent — excitement, fear, resistance. The raw signal of how this decision feels.',
  },
  {
    key: 'risk', label: 'RISK', hat: 'Black Hat',
    color: '#3C4043', bg: '#F1F3F4',
    icon: <Shield size={20} />,
    desc: 'Finds every crack before you fall into it. Sales cycles, runway math, hidden assumptions. No sugar-coating.',
  },
  {
    key: 'gain', label: 'GAIN', hat: 'Yellow Hat',
    color: '#F29900', bg: '#FEF9E7',
    icon: <Zap size={20} />,
    desc: 'Looks for the upside that\'s easy to miss. Channel partnerships, pricing leverage, data moats, grant opportunities.',
  },
  {
    key: 'wild', label: 'WILD', hat: 'Green Hat',
    color: G.green, bg: G.greenSoft,
    icon: <Sparkles size={20} />,
    desc: 'Challenges the premise. Proposes the unexpected path. Ideas that feel wrong at first but can\'t be unthought.',
  },
  {
    key: 'merge', label: 'MERGE', hat: 'Blue Hat',
    color: '#1A73E8', bg: G.blueSoft,
    icon: <Network size={20} />,
    desc: 'Listens to everything and makes the call. Weighs all perspectives into one clear recommendation with a confidence score.',
  },
]

// ── Page ─────────────────────────────────────────────────────────────────
export default function LandingPage() {
  const heroRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] })
  const previewY = useTransform(scrollYProgress, [0, 1], ['0%', '6%'])

  return (
    <div style={{ backgroundColor: '#FFFFFF', color: G.text }}>
      <Header />

      {/* ══════════════════════════════════════════════════
          HERO — Asana-style: headline + 2 CTAs + preview
      ══════════════════════════════════════════════════ */}
      <section
        ref={heroRef}
        className="relative overflow-hidden dot-grid"
        style={{ paddingTop: '56px', minHeight: '100vh', backgroundColor: '#FFFFFF' }}
      >
        {/* Floating shapes */}
        <div className="absolute top-20 left-6 float-a pointer-events-none w-14 h-14 rounded-full opacity-10" style={{ backgroundColor: G.blue }} />
        <div className="absolute top-40 left-16 float-b pointer-events-none w-6 h-6 rounded-lg opacity-15" style={{ backgroundColor: G.yellow }} />
        <div className="absolute top-16 right-8 float-c pointer-events-none w-10 h-10 rounded-full opacity-10" style={{ backgroundColor: G.red }} />
        <div className="absolute bottom-32 right-12 float-a pointer-events-none w-8 h-8 rounded-full opacity-12" style={{ backgroundColor: G.green }} />
        <div className="absolute bottom-48 left-10 float-b pointer-events-none w-5 h-5 rounded opacity-15" style={{ backgroundColor: G.blue }} />

        <div className="relative max-w-6xl mx-auto px-5 pt-20 pb-12">

          {/* ─ Badge ─ */}
          <motion.div
            className="flex justify-center mb-8"
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <div
              className="inline-flex items-center gap-2 text-xs font-semibold px-4 py-1.5 rounded-full"
              style={{ backgroundColor: G.yellowSoft, color: '#8A5800', border: `1px solid ${G.yellow}40` }}
            >
              <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ backgroundColor: G.yellow }} />
              CROO Agent Hackathon 2026 · Built with 6 AI minds
            </div>
          </motion.div>

          {/* ─ Headline ─ */}
          <motion.div
            className="text-center mb-6"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.55 }}
          >
            <h1
              className="font-sans font-black leading-[1.08] tracking-tight mx-auto"
              style={{ fontSize: 'clamp(2.8rem, 6.5vw, 5rem)', color: G.text, maxWidth: '820px' }}
            >
              Make better decisions
              <br />
              with{' '}
              <span className="hl-blue">six AI minds</span>
              {' '}at once.
            </h1>
          </motion.div>

          {/* ─ Sub ─ */}
          <motion.p
            className="text-center text-lg leading-relaxed mx-auto mb-10"
            style={{ color: G.text2, maxWidth: '520px' }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.25, duration: 0.45 }}
          >
            BeanAI runs six specialized AI agents in parallel — facts, emotion, risk, opportunity, creativity, and synthesis — and delivers one confident recommendation.
          </motion.p>

          {/* ─ CTA buttons ─ */}
          <motion.div
            className="flex items-center justify-center gap-3 mb-4 flex-wrap"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35, duration: 0.4 }}
          >
            <Link
              href="/app"
              className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full text-sm font-semibold text-white transition-all hover:opacity-90 active:scale-95 shadow-md"
              style={{ backgroundColor: G.blue }}
            >
              Get started — it's free
              <ArrowRight size={14} />
            </Link>
            <Link
              href={`/results/${DEMO_ID}`}
              className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full text-sm font-semibold transition-all hover:opacity-90 active:scale-95"
              style={{
                backgroundColor: '#FFFFFF',
                color: G.text,
                border: `1.5px solid ${G.border}`,
                boxShadow: '0 1px 4px rgba(0,0,0,0.08)',
              }}
            >
              <Play size={13} style={{ color: G.blue }} />
              View demo
            </Link>
          </motion.div>

          {/* ─ Social proof / logos ─ */}
          <motion.div
            className="flex items-center justify-center gap-2 flex-wrap mb-14"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.4 }}
          >
            <span className="text-xs" style={{ color: '#9AA0A6' }}>Powered by</span>
            {['Groq', 'Gemini', 'Tavily', 'CROO'].map((name, i) => (
              <span
                key={name}
                className="text-xs font-semibold px-2.5 py-1 rounded-full"
                style={{
                  backgroundColor: [G.blueSoft, G.redSoft, G.yellowSoft, G.greenSoft][i],
                  color: [G.blue, G.red, '#8A5800', G.green][i],
                }}
              >
                {name}
              </span>
            ))}
          </motion.div>

          {/* ─ App preview ─ */}
          <motion.div
            className="relative mx-auto"
            style={{ maxWidth: '820px', y: previewY }}
            initial={{ opacity: 0, y: 32 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.45, duration: 0.6, ease: 'easeOut' }}
          >
            {/* Glow behind preview */}
            <div
              className="absolute inset-0 -z-10 blur-3xl opacity-20 rounded-3xl"
              style={{ backgroundColor: G.blue, transform: 'scale(0.9) translateY(8%)' }}
            />
            <AppPreview />
          </motion.div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════
          HOW IT WORKS
      ══════════════════════════════════════════════════ */}
      <section id="how-it-works" className="py-20 px-5" style={{ backgroundColor: G.bg }}>
        <div className="max-w-6xl mx-auto">
          <div className="mb-12 text-center">
            <div
              className="inline-flex items-center gap-2 text-xs font-mono font-semibold px-3 py-1 rounded-full mb-4"
              style={{ backgroundColor: G.blueSoft, color: G.blue }}
            >
              HOW IT WORKS
            </div>
            <h2
              className="font-sans font-bold"
              style={{ fontSize: 'clamp(1.8rem, 3vw, 2.6rem)', color: G.text, letterSpacing: '-0.02em' }}
            >
              Three steps to a{' '}
              <span className="hl-blue">confident</span> decision.
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {[
              { num: '01', title: 'Write your question', desc: 'Describe your decision or challenge. BeanAI asks clarifying questions to sharpen the topic before analysis starts.', color: G.blue, bg: G.blueSoft },
              { num: '02', title: 'Six minds analyze', desc: 'All 6 AI agents run in parallel — facts, emotion, risk, opportunity, creativity, and synthesis — simultaneously.', color: G.red, bg: G.redSoft },
              { num: '03', title: 'Get your recommendation', desc: 'One structured report with a confidence score, verified sources, knowledge graph, and clear next steps.', color: G.green, bg: G.greenSoft },
            ].map((step, i) => (
              <motion.div
                key={step.num}
                className="color-block rounded-2xl overflow-hidden"
                style={{ border: `1.5px solid ${step.color}22` }}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.4 }}
              >
                <div className="px-6 py-5 flex items-center justify-between" style={{ backgroundColor: step.color }}>
                  <span className="text-xs font-mono font-bold text-white/70 uppercase tracking-widest">{step.num}</span>
                  <span className="font-black text-5xl leading-none select-none" style={{ color: 'rgba(255,255,255,0.12)' }}>{step.num}</span>
                </div>
                <div className="px-6 py-5" style={{ backgroundColor: step.bg }}>
                  <h3 className="font-bold text-base mb-2" style={{ color: G.text }}>{step.title}</h3>
                  <p className="text-sm leading-relaxed" style={{ color: G.text2 }}>{step.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════
          6 MINDS — Card grid (no scroll animation)
      ══════════════════════════════════════════════════ */}
      <section id="minds" className="py-20 px-5 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="mb-12 text-center">
            <div
              className="inline-flex items-center gap-2 text-xs font-mono font-semibold px-3 py-1 rounded-full mb-4"
              style={{ backgroundColor: G.redSoft, color: G.red }}
            >
              SIX MINDS
            </div>
            <h2
              className="font-sans font-bold mb-3"
              style={{ fontSize: 'clamp(1.8rem, 3vw, 2.6rem)', color: G.text, letterSpacing: '-0.02em' }}
            >
              One agent for{' '}
              <span className="hl-red">each angle.</span>
            </h2>
            <p className="text-base max-w-md mx-auto" style={{ color: G.text2 }}>
              Each AI is trained for one specific thinking mode. Together they cover every blind spot.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {MINDS_DATA.map((m, i) => (
              <motion.div
                key={m.key}
                className="color-block rounded-2xl p-6"
                style={{ backgroundColor: m.bg, border: `1.5px solid ${m.color}22` }}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.07, duration: 0.4 }}
              >
                {/* Header row */}
                <div className="flex items-center gap-3 mb-4">
                  <div
                    className="w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 text-white"
                    style={{ backgroundColor: m.color, color: m.label === 'GAIN' ? '#202124' : '#fff' }}
                  >
                    {m.icon}
                  </div>
                  <div>
                    <div className="font-mono font-bold text-sm" style={{ color: m.color }}>{m.label}</div>
                    <div className="text-[11px]" style={{ color: G.text2 }}>{m.hat}</div>
                  </div>
                </div>
                <p className="text-sm leading-relaxed" style={{ color: G.text2 }}>{m.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════
          STATS — Red section
      ══════════════════════════════════════════════════ */}
      <section className="py-20 px-5 relative overflow-hidden" style={{ backgroundColor: G.red }}>
        <div className="absolute -right-16 top-1/2 -translate-y-1/2 w-72 h-72 rounded-full pointer-events-none" style={{ backgroundColor: 'rgba(255,255,255,0.06)' }} />
        <div className="max-w-6xl mx-auto relative">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 text-center md:text-left">
            {[
              { value: '35 yrs', label: 'Six Thinking Hats proven in Fortune 500 companies worldwide' },
              { value: '6×',     label: 'More perspectives than solo brainstorming or group discussion' },
              { value: '~28s',   label: 'Average BeanAI analysis time per decision question' },
            ].map((s, i) => (
              <motion.div
                key={s.value}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <div className="font-black leading-none mb-3 text-white" style={{ fontSize: 'clamp(2.5rem, 5vw, 4rem)' }}>
                  {s.value}
                </div>
                <p className="text-sm leading-relaxed" style={{ color: 'rgba(255,255,255,0.72)' }}>{s.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════
          FEATURES MOSAIC
      ══════════════════════════════════════════════════ */}
      <section id="features" className="py-20 px-5 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="mb-12 text-center">
            <div
              className="inline-flex items-center gap-2 text-xs font-mono font-semibold px-3 py-1 rounded-full mb-4"
              style={{ backgroundColor: G.greenSoft, color: G.green }}
            >
              FEATURES
            </div>
            <h2
              className="font-sans font-bold"
              style={{ fontSize: 'clamp(1.8rem, 3vw, 2.6rem)', color: G.text, letterSpacing: '-0.02em' }}
            >
              Everything to{' '}
              <span className="hl-green">think better.</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { color: G.blue,    bg: G.blueSoft,   icon: <BarChart3 size={22} />,    title: '6 Mind Reports',     desc: 'Structured analysis from each perspective. Sources cited. No opinion without evidence.' },
              { color: G.red,     bg: G.redSoft,    icon: <MessageSquare size={22} />, title: 'AI Cross-Debate',    desc: 'Minds argue across rounds. Emergent insights that no single agent could produce.' },
              { color: '#F29900', bg: '#FEF9E7',    icon: <Network size={22} />,      title: 'Knowledge Graph',    desc: 'Every concept and connection mapped visually. Included in every analysis.' },
              { color: G.green,   bg: G.greenSoft,  icon: <Shield size={22} />,       title: 'Source Verification', desc: 'Every URL checked. Only accessible, real sources shown in your report.' },
            ].map((f, i) => (
              <motion.div
                key={f.title}
                className="color-block rounded-2xl p-6"
                style={{ backgroundColor: f.bg, border: `1.5px solid ${f.color}22` }}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
              >
                <div className="w-11 h-11 rounded-2xl flex items-center justify-center mb-4 bg-white" style={{ color: f.color }}>
                  {f.icon}
                </div>
                <h3 className="font-bold text-sm mb-1.5" style={{ color: G.text }}>{f.title}</h3>
                <p className="text-xs leading-relaxed" style={{ color: G.text2 }}>{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════
          PRICING
      ══════════════════════════════════════════════════ */}
      <section id="pricing" className="py-20 px-5" style={{ backgroundColor: G.bg }}>
        <div className="max-w-6xl mx-auto">
          <div className="mb-12 text-center">
            <div
              className="inline-flex items-center gap-2 text-xs font-mono font-semibold px-3 py-1 rounded-full mb-4"
              style={{ backgroundColor: G.yellowSoft, color: '#8A5800' }}
            >
              PRICING
            </div>
            <h2
              className="font-sans font-bold"
              style={{ fontSize: 'clamp(1.8rem, 3vw, 2.6rem)', color: G.text, letterSpacing: '-0.02em' }}
            >
              Pay per analysis.{' '}
              <span className="hl-yellow">No subscription.</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 max-w-2xl mx-auto">
            {/* Quick */}
            <motion.div
              className="color-block bg-white rounded-2xl overflow-hidden"
              style={{ border: `1.5px solid ${G.yellow}44` }}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <div className="px-6 py-4 flex items-center justify-between" style={{ backgroundColor: G.yellow }}>
                <span className="text-xs font-mono font-bold" style={{ color: '#7A4F00' }}>QUICK SCAN</span>
                <span className="font-black text-3xl" style={{ color: '#202124' }}>$0.10</span>
              </div>
              <div className="px-6 py-5">
                <ul className="space-y-2.5 mb-6">
                  {['6 AI minds in parallel', 'Knowledge Graph', 'Source verification', 'Confidence score'].map(f => (
                    <li key={f} className="flex items-center gap-2.5 text-sm" style={{ color: G.text2 }}>
                      <Check size={13} style={{ color: G.green, flexShrink: 0 }} />{f}
                    </li>
                  ))}
                  {['Cross-mind debate', 'Emergent insights'].map(f => (
                    <li key={f} className="flex items-center gap-2.5 text-sm" style={{ color: '#DADCE0' }}>
                      <X size={13} style={{ color: '#DADCE0', flexShrink: 0 }} />{f}
                    </li>
                  ))}
                </ul>
                <Link
                  href="/app"
                  className="block text-center py-2.5 rounded-full text-sm font-semibold transition-all hover:opacity-90"
                  style={{ backgroundColor: G.yellow, color: '#202124' }}
                >
                  Start Quick Scan
                </Link>
              </div>
            </motion.div>

            {/* Full */}
            <motion.div
              className="color-block rounded-2xl overflow-hidden"
              style={{ border: `1.5px solid ${G.green}44` }}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
            >
              <div className="px-6 py-4 flex items-center justify-between" style={{ backgroundColor: G.green }}>
                <span className="text-xs font-mono font-bold text-white/80">FULL ANALYSIS</span>
                <span className="font-black text-3xl text-white">$0.45</span>
              </div>
              <div className="px-6 py-5" style={{ backgroundColor: G.greenSoft }}>
                <ul className="space-y-2.5 mb-6">
                  {['Everything in Quick Scan', 'Multi-round AI debate', 'Emergent insights', 'Action plan', 'Final synthesis'].map(f => (
                    <li key={f} className="flex items-center gap-2.5 text-sm" style={{ color: G.text2 }}>
                      <Check size={13} style={{ color: G.green, flexShrink: 0 }} />{f}
                    </li>
                  ))}
                </ul>
                <Link
                  href="/app"
                  className="block text-center py-2.5 rounded-full text-sm font-semibold text-white transition-all hover:opacity-90"
                  style={{ backgroundColor: G.green }}
                >
                  Start Full Analysis
                </Link>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════
          CTA BLOCK — Blue, full width
      ══════════════════════════════════════════════════ */}
      <section className="py-20 px-5 relative overflow-hidden" style={{ backgroundColor: G.blue }}>
        <div className="absolute -right-20 -top-20 w-80 h-80 rounded-full pointer-events-none" style={{ backgroundColor: 'rgba(255,255,255,0.07)' }} />
        <div className="absolute -left-10 bottom-0 w-56 h-56 rounded-full pointer-events-none" style={{ backgroundColor: 'rgba(255,255,255,0.05)' }} />
        <div className="max-w-2xl mx-auto text-center relative">
          <h2
            className="font-sans font-black text-white mb-4"
            style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', letterSpacing: '-0.03em' }}
          >
            Ready to think with six minds?
          </h2>
          <p className="text-base mb-8" style={{ color: 'rgba(255,255,255,0.72)' }}>
            Start your first analysis free. No sign-up required.
          </p>
          <div className="flex items-center justify-center gap-3 flex-wrap">
            <Link
              href="/app"
              className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full text-sm font-semibold bg-white transition-all hover:opacity-90 active:scale-95"
              style={{ color: G.blue }}
            >
              Get started — free
              <ArrowRight size={14} />
            </Link>
            <Link
              href={`/results/${DEMO_ID}`}
              className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full text-sm font-semibold transition-all hover:opacity-90"
              style={{ color: 'rgba(255,255,255,0.85)', border: '1.5px solid rgba(255,255,255,0.3)' }}
            >
              <Play size={13} />
              View demo
            </Link>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════
          FOOTER
      ══════════════════════════════════════════════════ */}
      <footer className="py-10 px-5" style={{ backgroundColor: '#FFFFFF', borderTop: `1px solid ${G.border}` }}>
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2">
            <span className="flex gap-[3px]">
              {[G.blue, G.red, G.yellow, G.green].map((c, i) => (
                <span key={i} className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: c }} />
              ))}
            </span>
            <span className="font-bold text-lg" style={{ color: G.text }}>
              Bean<span style={{ color: G.blue }}>AI</span>
            </span>
          </div>
          <p className="text-xs font-mono" style={{ color: '#9AA0A6' }}>© 2026 Propeller · CROO Agent Hackathon</p>
          <div className="flex gap-5 text-xs font-mono" style={{ color: G.text2 }}>
            {['Privacy', 'Terms', 'Docs'].map(l => (
              <a key={l} href="#" className="hover:underline" style={{ color: G.text2 }}>{l}</a>
            ))}
          </div>
        </div>
      </footer>
    </div>
  )
}
