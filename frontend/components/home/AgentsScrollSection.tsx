'use client'

import { useRef, useState, useEffect } from 'react'
import type { ReactElement } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { MINDS } from '@/lib/minds'

// SVG illustrations for each mind
function AgentIllustration({ mindKey, accent }: { mindKey: string; accent: string }) {
  const illustrations: Record<string, ReactElement> = {
    fact: (
      <svg width="320" height="320" viewBox="0 0 320 320" fill="none">
        {/* Database/chart illustration */}
        <rect x="40" y="200" width="40" height="80" rx="4" fill={accent} opacity="0.2"/>
        <rect x="100" y="160" width="40" height="120" rx="4" fill={accent} opacity="0.4"/>
        <rect x="160" y="120" width="40" height="160" rx="4" fill={accent} opacity="0.6"/>
        <rect x="220" y="80" width="40" height="200" rx="4" fill={accent} opacity="0.8"/>
        <line x1="30" y1="290" x2="270" y2="290" stroke={accent} strokeWidth="2"/>
        <line x1="30" y1="290" x2="30" y2="60" stroke={accent} strokeWidth="2"/>
        {/* trend line */}
        <polyline points="60,240 120,200 180,150 240,100" stroke={accent} strokeWidth="2.5" fill="none" strokeDasharray="6 3"/>
        {/* data points */}
        {([[60,240],[120,200],[180,150],[240,100]] as [number,number][]).map(([x,y],i) => (
          <circle key={i} cx={x} cy={y} r="5" fill={accent}/>
        ))}
        {/* label */}
        <rect x="80" y="30" width="160" height="30" rx="6" fill={accent} opacity="0.1"/>
        <text x="160" y="50" textAnchor="middle" fontSize="12" fontFamily="monospace" fill={accent} fontWeight="bold">VERIFIED DATA</text>
      </svg>
    ),
    feel: (
      <svg width="320" height="320" viewBox="0 0 320 320" fill="none">
        {/* Heart + wave illustration */}
        <path d="M160 240 C80 180 40 140 40 100 C40 70 65 50 95 50 C120 50 145 65 160 85 C175 65 200 50 225 50 C255 50 280 70 280 100 C280 140 240 180 160 240Z" fill={accent} opacity="0.15" stroke={accent} strokeWidth="2"/>
        {/* pulse wave */}
        <polyline points="30,200 70,200 90,160 110,240 130,180 150,220 170,170 190,210 210,190 250,190 290,190" stroke={accent} strokeWidth="2.5" fill="none"/>
        <circle cx="160" cy="195" r="4" fill={accent}/>
      </svg>
    ),
    risk: (
      <svg width="320" height="320" viewBox="0 0 320 320" fill="none">
        {/* Warning + radar */}
        <circle cx="160" cy="160" r="110" stroke={accent} strokeWidth="1.5" opacity="0.2" fill="none"/>
        <circle cx="160" cy="160" r="80" stroke={accent} strokeWidth="1.5" opacity="0.3" fill="none"/>
        <circle cx="160" cy="160" r="50" stroke={accent} strokeWidth="1.5" opacity="0.4" fill="none"/>
        {/* crosshair */}
        <line x1="160" y1="50" x2="160" y2="270" stroke={accent} strokeWidth="1" opacity="0.3"/>
        <line x1="50" y1="160" x2="270" y2="160" stroke={accent} strokeWidth="1" opacity="0.3"/>
        {/* target dot */}
        <circle cx="220" cy="100" r="10" fill={accent} opacity="0.8"/>
        <circle cx="220" cy="100" r="20" fill="none" stroke={accent} strokeWidth="2" opacity="0.4"/>
        {/* warning triangle */}
        <polygon points="160,70 200,140 120,140" fill="none" stroke={accent} strokeWidth="2" opacity="0.6"/>
        <text x="160" y="133" textAnchor="middle" fontSize="18" fill={accent} fontWeight="bold">!</text>
      </svg>
    ),
    gain: (
      <svg width="320" height="320" viewBox="0 0 320 320" fill="none">
        {/* Growth arrow + coins */}
        <path d="M50 250 Q120 180 200 100 L260 100" stroke={accent} strokeWidth="3" fill="none"/>
        <polygon points="260,90 280,100 260,110" fill={accent}/>
        {/* circles representing growth */}
        <circle cx="80" cy="240" r="15" fill={accent} opacity="0.2"/>
        <circle cx="140" cy="185" r="22" fill={accent} opacity="0.35"/>
        <circle cx="200" cy="125" r="30" fill={accent} opacity="0.5"/>
        <circle cx="250" cy="80" r="15" fill={accent} opacity="0.7"/>
        {/* sparkles */}
        <text x="90" y="155" fontSize="20" fill={accent} opacity="0.6">✦</text>
        <text x="180" y="220" fontSize="14" fill={accent} opacity="0.4">✦</text>
      </svg>
    ),
    wild: (
      <svg width="320" height="320" viewBox="0 0 320 320" fill="none">
        {/* Lightbulb with spark lines */}
        <circle cx="160" cy="140" r="60" fill={accent} opacity="0.12" stroke={accent} strokeWidth="2"/>
        <circle cx="160" cy="140" r="40" fill={accent} opacity="0.2"/>
        <circle cx="160" cy="140" r="20" fill={accent} opacity="0.5"/>
        {/* spark rays */}
        {Array.from({length:8},(_,i)=>{
          const angle = (i * Math.PI * 2) / 8
          const x1 = 160 + Math.cos(angle)*70
          const y1 = 140 + Math.sin(angle)*70
          const x2 = 160 + Math.cos(angle)*90
          const y2 = 140 + Math.sin(angle)*90
          return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke={accent} strokeWidth="2.5" strokeLinecap="round"/>
        })}
        {/* base */}
        <rect x="145" y="195" width="30" height="8" rx="2" fill={accent} opacity="0.4"/>
        <rect x="148" y="207" width="24" height="8" rx="2" fill={accent} opacity="0.3"/>
        {/* question marks */}
        <text x="60" y="100" fontSize="24" fill={accent} opacity="0.3" fontWeight="bold">?</text>
        <text x="230" y="80" fontSize="18" fill={accent} opacity="0.25" fontWeight="bold">?</text>
        <text x="240" y="200" fontSize="20" fill={accent} opacity="0.2" fontWeight="bold">?</text>
      </svg>
    ),
    merge: (
      <svg width="320" height="320" viewBox="0 0 320 320" fill="none">
        {/* Venn diagram / synthesis */}
        <circle cx="130" cy="150" r="70" fill={accent} opacity="0.12" stroke={accent} strokeWidth="1.5"/>
        <circle cx="190" cy="150" r="70" fill={accent} opacity="0.12" stroke={accent} strokeWidth="1.5"/>
        <path d="M160 95 A70 70 0 0 1 160 205 A70 70 0 0 1 160 95Z" fill={accent} opacity="0.25"/>
        {/* center star */}
        <circle cx="160" cy="150" r="12" fill={accent}/>
        {/* connecting lines from top */}
        {([[60,50],[160,30],[260,50]] as [number,number][]).map(([x,y],i)=>(
          <g key={i}>
            <circle cx={x} cy={y} r="6" fill={accent} opacity="0.5"/>
            <line x1={x} y1={y+6} x2="160" y2="138" stroke={accent} strokeWidth="1.5" opacity="0.3" strokeDasharray="4 3"/>
          </g>
        ))}
        {/* verdict badge */}
        <rect x="115" y="230" width="90" height="28" rx="14" fill={accent} opacity="0.15" stroke={accent} strokeWidth="1.5"/>
        <text x="160" y="249" textAnchor="middle" fontSize="11" fontFamily="monospace" fill={accent} fontWeight="bold">DECISION READY</text>
      </svg>
    ),
  }

  return (
    <div className="flex items-center justify-center w-full h-full">
      <motion.div
        key={mindKey}
        initial={{ opacity: 0, scale: 0.92 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 1.05 }}
        transition={{ duration: 0.45, ease: 'easeOut' }}
        className="p-8 rounded-3xl"
        style={{ backgroundColor: `${accent}0D` }}
      >
        {illustrations[mindKey] ?? illustrations.fact}
      </motion.div>
    </div>
  )
}

const AGENT_DETAILS = [
  {
    key: 'fact',
    hatName: 'White Hat',
    headline: 'The Evidence Collector',
    body: 'FACT scans verified databases, pulls market reports, and cross-references statistics. No opinions — only what can be sourced and confirmed. Every claim comes with a citation.',
    example: '"B2B SaaS market hit $197B in 2023 at 18.7% CAGR. Your 2,400 MAUs map to 40–80 SMB prospects at industry conversion rates." — FACT',
  },
  {
    key: 'feel',
    hatName: 'Red Hat',
    headline: 'The Emotion Reader',
    body: 'FEEL reads between the lines. It picks up the psychological undercurrent — the excitement, the fear, the resistance. No justification needed. Just the raw signal of how this decision feels.',
    example: '"The energy here is real. But there\'s fear under the confidence — fear of the slower B2B rhythm. That emotion is data." — FEEL',
  },
  {
    key: 'risk',
    hatName: 'Black Hat',
    headline: 'The Devil\'s Advocate',
    body: 'RISK finds every crack before you fall into it. Sales cycle length, talent gaps, runway math, hidden assumptions. Not pessimism — precision. The risks you\'d rather hear from AI than from investors.',
    example: '"Seed-stage B2B pivots fail 34% of the time — and runway is the primary killer. You need 18 months minimum before first enterprise revenue." — RISK',
  },
  {
    key: 'gain',
    hatName: 'Yellow Hat',
    headline: 'The Opportunity Mapper',
    body: 'GAIN looks for the upside that\'s easy to miss when you\'re focused on risk. Channel partnerships, pricing leverage, data moats, grant opportunities. The optimist with spreadsheets.',
    example: '"Your 2,400 MAUs are a behavioral dataset that enterprise competitors can\'t replicate. That\'s a defensible moat, not just a user base." — GAIN',
  },
  {
    key: 'wild',
    hatName: 'Green Hat',
    headline: 'The Contrarian Innovator',
    body: 'WILD challenges the premise. It asks what everyone else missed, proposes the unexpected path, and generates the ideas that feel wrong at first but can\'t be unthought.',
    example: '"Don\'t pivot. Add team billing to your existing product this week. 3% of 2,400 MAUs at $79/mo = $5,688 MRR overnight — zero feature changes." — WILD',
  },
  {
    key: 'merge',
    hatName: 'Blue Hat',
    headline: 'The Synthesizer',
    body: 'MERGE listens to everything and makes the call. It weighs FACT against RISK, balances FEEL with GAIN, and distills everything into one clear recommendation with a confidence score.',
    example: '"WAIT → GO. 30-day validation sprint first. Bridge strategy (not hard pivot) resolves the runway concern. Confidence: 74%." — MERGE',
  },
]

export function AgentsScrollSection() {
  const [activeIndex, setActiveIndex] = useState(0)
  const itemRefs = useRef<(HTMLDivElement | null)[]>([])

  useEffect(() => {
    const observers: IntersectionObserver[] = []
    itemRefs.current.forEach((ref, index) => {
      if (!ref) return
      const observer = new IntersectionObserver(
        ([entry]) => { if (entry.isIntersecting) setActiveIndex(index) },
        { threshold: 0.55, rootMargin: '-10% 0px -10% 0px' }
      )
      observer.observe(ref)
      observers.push(observer)
    })
    return () => observers.forEach(o => o.disconnect())
  }, [])

  const activeMind = MINDS.find(m => m.key === AGENT_DETAILS[activeIndex].key)!
  const activeDetail = AGENT_DETAILS[activeIndex]

  return (
    <section id="minds" className="bg-cream">
      {/* Section header */}
      <div className="max-w-6xl mx-auto px-6 pt-24 pb-16">
        <span className="font-mono text-xs text-muted">── AGENTS ──</span>
        <h2 className="font-serif text-4xl md:text-5xl font-bold text-navy mt-3 mb-4">
          Six AI Agents.<br/>One for each angle.
        </h2>
        <p className="text-slate text-lg max-w-xl">
          Each agent is trained for one specific thinking mode. Together they cover every blind spot.
        </p>
      </div>

      {/* Sticky scroll container */}
      <div className="max-w-6xl mx-auto px-6 pb-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-0 lg:gap-16 items-start">

          {/* LEFT — scrollable text (one per agent, 100vh each) */}
          <div>
            {AGENT_DETAILS.map((agent, i) => {
              const mind = MINDS.find(m => m.key === agent.key)!
              const isActive = i === activeIndex
              return (
                <div
                  key={agent.key}
                  ref={el => { itemRefs.current[i] = el }}
                  className="min-h-screen flex items-center py-16"
                >
                  <motion.div
                    animate={{ opacity: isActive ? 1 : 0.35 }}
                    transition={{ duration: 0.4 }}
                    className="space-y-6 max-w-lg"
                  >
                    {/* Hat badge */}
                    <div className="flex items-center gap-3">
                      <div
                        className="w-10 h-10 rounded-xl flex items-center justify-center font-mono text-xs font-bold"
                        style={{ backgroundColor: mind.bg, color: mind.accent, border: `1.5px solid ${mind.accent}33` }}
                      >
                        {mind.label.slice(0,2)}
                      </div>
                      <div>
                        <span className="text-xs font-mono font-bold" style={{ color: mind.accent }}>{mind.label}</span>
                        <span className="text-xs text-muted font-mono ml-2">— {agent.hatName}</span>
                      </div>
                      <span className="ml-auto font-mono text-5xl font-bold text-border select-none leading-none">
                        0{i + 1}
                      </span>
                    </div>

                    {/* Headline */}
                    <h3 className="font-serif text-3xl md:text-4xl font-bold text-navy leading-tight">
                      {agent.headline}
                    </h3>

                    {/* Body */}
                    <p className="text-slate text-lg leading-relaxed">{agent.body}</p>

                    {/* Example quote */}
                    <blockquote
                      className="border-l-2 pl-4 text-sm italic text-slate leading-relaxed"
                      style={{ borderColor: mind.accent }}
                    >
                      {agent.example}
                    </blockquote>
                  </motion.div>
                </div>
              )
            })}
          </div>

          {/* RIGHT — sticky illustration */}
          <div className="hidden lg:block sticky top-0 h-screen">
            <div className="h-full flex items-center justify-center">
              <AnimatePresence mode="wait">
                <AgentIllustration
                  key={activeDetail.key}
                  mindKey={activeDetail.key}
                  accent={activeMind.accent}
                />
              </AnimatePresence>
            </div>
          </div>

        </div>
      </div>
    </section>
  )
}
