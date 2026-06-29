'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowRight, Clock, ChevronRight, Zap, BarChart3, MessageSquare, Network, Sparkles, History, Plus } from 'lucide-react'
import { HeroInputCard } from '@/components/home/HeroInputCard'

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

const MINDS_QUICK = [
  { label: 'FACT',  color: G.blue,    bg: G.blueSoft,   desc: 'Data & evidence' },
  { label: 'FEEL',  color: G.red,     bg: G.redSoft,    desc: 'Emotion & gut' },
  { label: 'RISK',  color: '#3C4043', bg: '#F1F3F4',    desc: 'Risks & traps' },
  { label: 'GAIN',  color: '#F29900', bg: '#FEF9E7',    desc: 'Opportunity' },
  { label: 'WILD',  color: G.green,   bg: G.greenSoft,  desc: 'Creative paths' },
  { label: 'MERGE', color: '#1A73E8', bg: G.blueSoft,   desc: 'Final synthesis' },
]

interface HistoryRecord {
  id: string
  topic: string
  service: 'quick-scan' | 'full-prism'
  confidence: number
  created_at: string
}

export default function AppDashboard() {
  const [tab, setTab] = useState<'analyze' | 'history'>('analyze')
  const [history, setHistory] = useState<HistoryRecord[]>([])
  const [historyLoading, setHistoryLoading] = useState(false)

  useEffect(() => {
    if (tab !== 'history') return
    setHistoryLoading(true)
    const base = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8000'
    fetch(`${base}/api/history`, { cache: 'no-store' })
      .then(r => r.ok ? r.json() : [])
      .then(data => { setHistory(data); setHistoryLoading(false) })
      .catch(() => setHistoryLoading(false))
  }, [tab])

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: G.bg }}>

      {/* ── Top bar ─────────────────────────────────── */}
      <header
        className="sticky top-0 z-40 flex items-center justify-between px-5 h-14"
        style={{ backgroundColor: '#FFFFFF', borderBottom: `1px solid ${G.border}` }}
      >
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 shrink-0">
          <span className="flex gap-[3px]">
            {[G.blue, G.red, G.yellow, G.green].map((c, i) => (
              <span key={i} className="w-2 h-2 rounded-full" style={{ backgroundColor: c }} />
            ))}
          </span>
          <span className="font-bold text-base" style={{ color: G.text }}>
            Bean<span style={{ color: G.blue }}>AI</span>
          </span>
          <span
            className="text-[10px] font-mono px-2 py-0.5 rounded-full"
            style={{ backgroundColor: G.blueSoft, color: G.blue }}
          >
            workspace
          </span>
        </Link>

        {/* Tab switcher */}
        <div
          className="flex items-center gap-1 p-1 rounded-full"
          style={{ backgroundColor: G.bg, border: `1px solid ${G.border}` }}
        >
          {([
            { key: 'analyze', label: 'Analyze', icon: <Sparkles size={12} /> },
            { key: 'history', label: 'History',  icon: <History size={12} /> },
          ] as const).map(t => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className="flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-semibold transition-all"
              style={tab === t.key
                ? { backgroundColor: '#FFFFFF', color: G.text, boxShadow: '0 1px 4px rgba(0,0,0,0.08)' }
                : { color: G.text2 }
              }
            >
              {t.icon}
              {t.label}
            </button>
          ))}
        </div>

        {/* Back to site */}
        <Link
          href="/"
          className="hidden md:inline-flex text-xs font-medium px-3 py-1.5 rounded-full transition-colors"
          style={{ color: G.text2, border: `1px solid ${G.border}` }}
          onMouseEnter={e => (e.currentTarget.style.borderColor = G.blue)}
          onMouseLeave={e => (e.currentTarget.style.borderColor = G.border)}
        >
          ← Back to site
        </Link>
      </header>

      {/* ── Body ────────────────────────────────────── */}
      <main className="flex-1 flex flex-col">
        <AnimatePresence mode="wait">

          {/* ─ ANALYZE tab ─ */}
          {tab === 'analyze' && (
            <motion.div
              key="analyze"
              className="flex-1 flex flex-col items-center px-5 py-12"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.25 }}
            >
              {/* Headline */}
              <div className="text-center mb-8 max-w-xl">
                <h1
                  className="font-black mb-3"
                  style={{ fontSize: 'clamp(1.8rem, 3.5vw, 2.6rem)', color: G.text, letterSpacing: '-0.03em' }}
                >
                  What do you want to{' '}
                  <span className="hl-blue">decide today?</span>
                </h1>
                <p className="text-sm" style={{ color: G.text2 }}>
                  Type your question or decision below. BeanAI will run all six minds in parallel and return a structured report.
                </p>
              </div>

              {/* Input card — full width, prominent */}
              <div className="w-full max-w-2xl mb-8">
                <HeroInputCard />
              </div>

              {/* Quick tips */}
              <div className="w-full max-w-2xl mb-10">
                <p className="text-[11px] font-mono uppercase tracking-widest mb-3" style={{ color: '#9AA0A6' }}>
                  Example questions
                </p>
                <div className="flex flex-wrap gap-2">
                  {[
                    'Should I pivot my SaaS to B2B?',
                    'Apakah saya harus buka kafe di Bandung?',
                    'Should I hire a co-founder or stay solo?',
                    'Is this the right time to raise a seed round?',
                  ].map(q => (
                    <button
                      key={q}
                      className="text-xs px-3 py-1.5 rounded-full transition-all"
                      style={{
                        backgroundColor: '#FFFFFF',
                        color: G.text2,
                        border: `1px solid ${G.border}`,
                      }}
                      onMouseEnter={e => {
                        (e.currentTarget as HTMLElement).style.borderColor = G.blue
                        ;(e.currentTarget as HTMLElement).style.color = G.blue
                      }}
                      onMouseLeave={e => {
                        (e.currentTarget as HTMLElement).style.borderColor = G.border
                        ;(e.currentTarget as HTMLElement).style.color = G.text2
                      }}
                    >
                      {q}
                    </button>
                  ))}
                </div>
              </div>

              {/* 6 minds mini preview */}
              <div className="w-full max-w-2xl">
                <p className="text-[11px] font-mono uppercase tracking-widest mb-3" style={{ color: '#9AA0A6' }}>
                  Six minds will run
                </p>
                <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                  {MINDS_QUICK.map(m => (
                    <div
                      key={m.label}
                      className="flex flex-col items-center gap-1.5 p-3 rounded-2xl"
                      style={{ backgroundColor: m.bg, border: `1px solid ${m.color}20` }}
                    >
                      <span
                        className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full"
                        style={{ backgroundColor: m.color, color: m.label === 'GAIN' ? '#202124' : '#fff' }}
                      >
                        {m.label}
                      </span>
                      <span className="text-[10px] text-center leading-tight" style={{ color: G.text2 }}>{m.desc}</span>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {/* ─ HISTORY tab ─ */}
          {tab === 'history' && (
            <motion.div
              key="history"
              className="flex-1 px-5 py-10 max-w-3xl mx-auto w-full"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.25 }}
            >
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="font-bold text-xl" style={{ color: G.text }}>Analysis History</h2>
                  <p className="text-sm mt-0.5" style={{ color: G.text2 }}>
                    {historyLoading ? 'Loading…' : `${history.length} analyses on record`}
                  </p>
                </div>
                <button
                  onClick={() => setTab('analyze')}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-semibold text-white transition-all hover:opacity-90"
                  style={{ backgroundColor: G.blue }}
                >
                  <Plus size={13} />
                  New analysis
                </button>
              </div>

              {historyLoading ? (
                <div className="space-y-3">
                  {[1,2,3].map(i => (
                    <div key={i} className="h-16 rounded-2xl animate-pulse" style={{ backgroundColor: G.border }} />
                  ))}
                </div>
              ) : history.length === 0 ? (
                <div className="text-center py-20">
                  <div className="text-4xl mb-4">🔍</div>
                  <p className="font-semibold mb-2" style={{ color: G.text }}>No analyses yet</p>
                  <p className="text-sm mb-6" style={{ color: G.text2 }}>Run your first analysis to see results here.</p>
                  <button
                    onClick={() => setTab('analyze')}
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold text-white"
                    style={{ backgroundColor: G.blue }}
                  >
                    Start analyzing
                    <ArrowRight size={13} />
                  </button>
                </div>
              ) : (
                <div className="space-y-2">
                  {history.map((rec, i) => {
                    const isQuick = rec.service !== 'full-prism'
                    const date = rec.created_at ? new Date(rec.created_at) : null
                    const dateStr = date
                      ? date.toLocaleDateString('id', { day: 'numeric', month: 'short' }) +
                        ' · ' + date.toLocaleTimeString('id', { hour: '2-digit', minute: '2-digit', hour12: false })
                      : '—'

                    return (
                      <motion.div
                        key={rec.id}
                        initial={{ opacity: 0, x: -8 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.04 }}
                      >
                        <Link
                          href={`/results/${rec.id}`}
                          className="flex items-center gap-4 px-5 py-4 rounded-2xl bg-white group transition-all"
                          style={{ border: `1.5px solid ${G.border}` }}
                          onMouseEnter={e => (e.currentTarget.style.borderColor = G.blue)}
                          onMouseLeave={e => (e.currentTarget.style.borderColor = G.border)}
                        >
                          {/* Confidence indicator */}
                          <div
                            className="w-10 h-10 rounded-xl flex items-center justify-center text-xs font-bold shrink-0"
                            style={{
                              backgroundColor: rec.confidence >= 75 ? G.greenSoft : rec.confidence >= 50 ? G.yellowSoft : G.redSoft,
                              color: rec.confidence >= 75 ? G.green : rec.confidence >= 50 ? '#8A5800' : G.red,
                            }}
                          >
                            {rec.confidence}
                          </div>

                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium truncate mb-1" style={{ color: G.text }}>
                              {rec.topic || '(untitled)'}
                            </p>
                            <div className="flex items-center gap-3">
                              <span
                                className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded-full"
                                style={isQuick
                                  ? { backgroundColor: G.bg, color: G.text2, border: `1px solid ${G.border}` }
                                  : { backgroundColor: G.blueSoft, color: G.blue }
                                }
                              >
                                {isQuick ? 'Quick' : 'Full'}
                              </span>
                              <span className="flex items-center gap-1 text-[11px] font-mono" style={{ color: '#9AA0A6' }}>
                                <Clock size={10} />
                                {dateStr}
                              </span>
                            </div>
                          </div>

                          <div className="flex items-center gap-2 shrink-0">
                            <span className="text-[11px] font-mono" style={{ color: '#9AA0A6' }}>
                              {rec.id.slice(0, 8)}…
                            </span>
                            <ChevronRight size={15} style={{ color: G.border }} className="group-hover:text-blue-500 transition-colors" />
                          </div>
                        </Link>
                      </motion.div>
                    )
                  })}
                </div>
              )}
            </motion.div>
          )}

        </AnimatePresence>
      </main>
    </div>
  )
}
