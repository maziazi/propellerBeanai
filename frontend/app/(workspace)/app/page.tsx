'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { HeroInputCard } from '@/components/home/HeroInputCard'

const G = {
  blue:       '#4182EB',
  red:        '#E24231',
  yellow:     '#F6BB14',
  green:      '#169F53',
  blueSoft:   '#EEF4FF',
  redSoft:    '#FEE9E7',
  greenSoft:  '#EDFAF3',
  text:       '#1A1A1A',
  text2:      '#5F6368',
  surface:    '#F7F7F5',
  border:     '#E6E6E1',
}

const MINDS_QUICK = [
  { label: 'FACT',  color: G.blue,    bg: G.blueSoft,   desc: 'Data & evidence' },
  { label: 'FEEL',  color: G.red,     bg: G.redSoft,    desc: 'Emotion & gut' },
  { label: 'RISK',  color: '#3C4043', bg: '#F1F3F4',    desc: 'Risks & traps' },
  { label: 'GAIN',  color: '#F29900', bg: '#FEF9E7',    desc: 'Opportunity' },
  { label: 'WILD',  color: G.green,   bg: G.greenSoft,  desc: 'Creative paths' },
  { label: 'MERGE', color: '#1A73E8', bg: G.blueSoft,   desc: 'Final synthesis' },
]

const EXAMPLES = [
  'Should I pivot my SaaS to B2B?',
  'Should I open a coffee shop in my city?',
  'Should I hire a co-founder or stay solo?',
  'Is this the right time to raise a seed round?',
]

function greeting() {
  const h = new Date().getHours()
  if (h < 5)  return 'Burning the midnight oil'
  if (h < 12) return 'Good morning'
  if (h < 17) return 'Good afternoon'
  return 'Good evening'
}

export default function AppDashboard() {
  return (
    <div className="min-h-full flex flex-col items-center justify-center px-5 py-12">
      <motion.div
        className="w-full max-w-2xl"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        {/* Greeting */}
        <div className="text-center mb-7">
          <div className="flex justify-center mb-4">
            <span className="flex gap-1.5">
              {[G.blue, G.red, G.yellow, G.green].map((c, i) => (
                <motion.span
                  key={i}
                  className="w-2.5 h-2.5 rounded-full"
                  style={{ backgroundColor: c }}
                  animate={{ y: [0, -5, 0] }}
                  transition={{ duration: 1.4, repeat: Infinity, delay: i * 0.12 }}
                />
              ))}
            </span>
          </div>
          <h1
            className="font-bold"
            style={{ fontSize: 'clamp(1.6rem, 3vw, 2.2rem)', letterSpacing: '-0.02em', color: G.text }}
          >
            {greeting()}.
          </h1>
          <p className="text-sm mt-2" style={{ color: G.text2 }}>
            What do you want to decide today? Six minds will weigh in.
          </p>
        </div>

        {/* Composer */}
        <HeroInputCard />

        {/* Example prompts */}
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          {EXAMPLES.map(q => (
            <button
              key={q}
              className="text-xs px-3 py-1.5 rounded-full transition-all"
              style={{ backgroundColor: G.surface, color: G.text2, border: `1px solid ${G.border}` }}
              onMouseEnter={e => {
                ;(e.currentTarget as HTMLElement).style.borderColor = G.blue
                ;(e.currentTarget as HTMLElement).style.color = G.blue
              }}
              onMouseLeave={e => {
                ;(e.currentTarget as HTMLElement).style.borderColor = G.border
                ;(e.currentTarget as HTMLElement).style.color = G.text2
              }}
            >
              {q}
            </button>
          ))}
        </div>

        {/* Six minds strip */}
        <div className="mt-10">
          <p className="text-[10px] font-mono uppercase tracking-widest mb-3 text-center" style={{ color: '#9AA0A6' }}>
            Six minds run in parallel
          </p>
          <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
            {MINDS_QUICK.map(m => (
              <div
                key={m.label}
                className="flex flex-col items-center gap-1.5 p-2.5 rounded-xl"
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

        {/* Subtle footer link back to marketing site */}
        <div className="mt-10 text-center">
          <Link href="/" className="text-[11px]" style={{ color: '#9AA0A6' }}>
            ← Back to beanai.com
          </Link>
        </div>
      </motion.div>
    </div>
  )
}
