'use client'

import { motion } from 'framer-motion'
import { ArrowRight, Check, X, MessageSquare, Network } from 'lucide-react'
import Link from 'next/link'
import { Header } from '@/components/layout/Header'
import { HeroInputCard } from '@/components/home/HeroInputCard'
import { TechStackRow } from '@/components/home/TechStackRow'
import { AgentsScrollSection } from '@/components/home/AgentsScrollSection'

export default function HomePage() {
  return (
    <div className="bg-cream">
      <Header />

      {/* ── HERO ── Solid orange + Apple Music depth blobs */}
      <section
        id="hero"
        className="relative overflow-hidden"
        style={{ backgroundColor: '#FF9013', minHeight: '100vh' }}
      >
        {/* Depth blobs on top of orange — Apple Music style */}
        <div className="absolute inset-0 pointer-events-none" aria-hidden>
          {/* Warm highlight top-center */}
          <div style={{
            position: 'absolute', top: '-20%', left: '50%', transform: 'translateX(-50%)',
            width: '120%', height: '80%',
            background: 'radial-gradient(ellipse at 50% 30%, #FFD580 0%, #FFAE42 35%, transparent 70%)',
            filter: 'blur(60px)',
            opacity: 0.6,
          }} />
          {/* Deep burn bottom-left */}
          <div style={{
            position: 'absolute', bottom: '0%', left: '-5%',
            width: '60%', height: '60%',
            background: 'radial-gradient(ellipse, #D45F00 0%, transparent 70%)',
            filter: 'blur(80px)',
            opacity: 0.55,
          }} />
          {/* Deep burn bottom-right */}
          <div style={{
            position: 'absolute', bottom: '0%', right: '-5%',
            width: '55%', height: '55%',
            background: 'radial-gradient(ellipse, #C44F00 0%, transparent 70%)',
            filter: 'blur(80px)',
            opacity: 0.45,
          }} />
          {/* Blue accent top-right */}
          <div style={{
            position: 'absolute', top: '-5%', right: '-5%',
            width: '40%', height: '50%',
            background: 'radial-gradient(ellipse, #0046FF 0%, transparent 65%)',
            filter: 'blur(90px)',
            opacity: 0.18,
          }} />
        </div>

        {/* Content */}
        <div className="relative max-w-4xl mx-auto px-6 pt-36 pb-40 flex flex-col items-center text-center">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 font-mono text-xs border rounded-full px-4 py-1.5 mb-8"
            style={{ color: '#FAFAF7', borderColor: 'rgba(250,250,247,0.4)', backgroundColor: 'rgba(0,0,0,0.12)' }}
          >
            <span className="w-1.5 h-1.5 rounded-full animate-pulse bg-white" />
            6 Thinking Perspectives · AI-Powered
          </motion.div>

          {/* Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.6 }}
            className="font-serif font-bold leading-none tracking-tight mb-6"
            style={{ fontSize: 'clamp(3rem, 7vw, 5.5rem)', color: '#FAFAF7' }}
          >
            Think deeper.<br />
            <span style={{ color: '#0F172A' }}>Decide smarter.</span>
          </motion.h1>

          {/* Sub */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.25, duration: 0.5 }}
            className="text-lg max-w-xl leading-relaxed mb-10"
            style={{ color: 'rgba(250,250,247,0.88)' }}
          >
            Six AI minds analyze your decision from every angle — facts, emotion, risk, opportunity, creativity, and synthesis.
          </motion.p>

          {/* Input card */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35, duration: 0.5 }}
            className="w-full max-w-2xl mb-10"
          >
            <HeroInputCard />
          </motion.div>

          {/* Tech stack logos */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.4 }}
          >
            <TechStackRow />
          </motion.div>
        </div>

        {/* Wave — orange right up to the curve, white starts from curve */}
        <div
          className="absolute bottom-0 left-0 right-0 overflow-hidden leading-none"
          style={{ height: '100px' }}
        >
          <svg
            viewBox="0 0 1440 100"
            preserveAspectRatio="none"
            style={{ display: 'block', width: '100%', height: '100%' }}
          >
            <path
              d="M0,100 L0,60 C240,0 480,0 720,50 C960,100 1200,20 1440,55 L1440,100 Z"
              fill="#FFFFFF"
            />
          </svg>
        </div>
      </section>

      {/* ── HOW IT WORKS ── clean white, no orange bleed */}
      <section id="how-it-works" className="py-24 px-6 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="mb-12">
            <span className="font-mono text-xs text-muted">── 01 ──</span>
            <h2 className="font-serif text-4xl font-bold text-navy mt-2 mb-3">How BeanAI Works</h2>
            <p className="text-slate text-lg max-w-lg">Three steps to a decision you&apos;re confident about.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { num: '01', title: 'Write your question', desc: 'Describe your decision, challenge, or scenario. No templates — just plain language.', color: '#FF9013' },
              { num: '02', title: 'Six minds analyze', desc: 'Each of the 6 AI agents runs in parallel, examining your question through its unique lens.', color: '#0046FF' },
              { num: '03', title: 'Get synthesis + act', desc: 'MERGE delivers a structured recommendation with confidence score and action plan.', color: '#16A34A' },
            ].map((step) => (
              <div key={step.num} className="bg-cream rounded-2xl p-8 border border-border">
                <div
                  className="font-serif font-bold text-6xl leading-none mb-6 select-none"
                  style={{ color: `${step.color}22` }}
                >
                  {step.num}
                </div>
                <div className="font-mono text-xs font-bold mb-2" style={{ color: step.color }}>{step.num}</div>
                <h3 className="font-serif text-xl font-bold text-navy mb-2">{step.title}</h3>
                <p className="text-slate text-sm leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── AGENTS SCROLL SECTION ── replaces Six Minds */}
      <AgentsScrollSection />

      {/* ── PRICING ── */}
      <section id="pricing" className="py-24 px-6 bg-cream-2">
        <div className="max-w-6xl mx-auto">
          <div className="mb-12">
            <span className="font-mono text-xs text-muted">── 02 ──</span>
            <h2 className="font-serif text-4xl font-bold text-navy mt-2 mb-3">Choose Your Depth</h2>
            <p className="text-slate text-lg max-w-lg">Pay per analysis. No subscription, no commitment.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl">
            {/* Quick Scan */}
            <div className="bg-white rounded-2xl p-8 border border-border">
              <div className="inline-flex items-center gap-1.5 bg-orange-soft text-orange text-xs font-mono font-bold px-3 py-1 rounded-full mb-5">
                Quick Scan
              </div>
              <div className="font-serif text-3xl font-bold text-navy mb-1">$0.10</div>
              <div className="text-sm text-muted mb-6">per analysis</div>
              <ul className="space-y-3 mb-8">
                {['6 minds analyze in parallel','Knowledge Graph included','Source verification','6 structured perspectives','Confidence score'].map(f => (
                  <li key={f} className="flex items-start gap-2.5 text-sm text-slate">
                    <Check size={14} className="text-green-600 shrink-0 mt-0.5" />
                    {f}
                  </li>
                ))}
                {['Cross-mind debate','Emergent insights'].map(f => (
                  <li key={f} className="flex items-start gap-2.5 text-sm text-muted">
                    <X size={14} className="text-muted shrink-0 mt-0.5" />
                    {f}
                  </li>
                ))}
              </ul>
              <Link href="/analyze" className="block w-full text-center border border-navy text-navy font-medium text-sm py-3 rounded-xl hover:bg-navy hover:text-cream transition-all">
                Start Quick Scan →
              </Link>
            </div>
            {/* Full Analysis */}
            <div className="bg-blue-soft rounded-2xl p-8 border-2" style={{ borderColor: '#0046FF' }}>
              <div className="inline-flex items-center gap-1.5 text-xs font-mono font-bold px-3 py-1 rounded-full mb-5 text-white" style={{ backgroundColor: '#0046FF' }}>
                Full Analysis
              </div>
              <div className="font-serif text-3xl font-bold text-navy mb-1">$0.45</div>
              <div className="text-sm text-muted mb-6">per analysis</div>
              <ul className="space-y-3 mb-8">
                {['Everything in Quick Scan','3-round AI cross-debate','Emergent insights','Action plan','Priority ranking'].map(f => (
                  <li key={f} className="flex items-start gap-2.5 text-sm text-slate">
                    <Check size={14} className="shrink-0 mt-0.5" style={{ color: '#0046FF' }} />
                    {f}
                  </li>
                ))}
              </ul>
              <Link href="/analyze" className="block w-full text-center text-white font-medium text-sm py-3 rounded-xl transition-all hover:opacity-90 active:scale-95" style={{ backgroundColor: '#0046FF' }}>
                Start Full Analysis →
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── WHY 6 HATS ── dark navy */}
      <section id="why" className="py-24 px-6 bg-navy">
        <div className="max-w-6xl mx-auto">
          <div className="mb-12">
            <span className="font-mono text-xs" style={{ color: '#FF9013' }}>── 03 ──</span>
            <h2 className="font-serif text-4xl font-bold text-cream mt-2 mb-3">Why Six Thinking Hats?</h2>
            <p className="text-slate-400 text-lg max-w-lg">The most powerful brainstorming framework ever invented — now supercharged with AI.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
            {[
              { value: '35 years', label: 'Proven in Fortune 500 companies worldwide' },
              { value: '6×', label: 'More perspectives than solo or group brainstorming' },
              { value: '~28s', label: 'Average BeanAI analysis time per question' },
            ].map(s => (
              <div key={s.value} className="border border-slate-700 rounded-2xl p-8">
                <div className="font-serif font-bold text-5xl mb-2" style={{ color: '#FF9013' }}>{s.value}</div>
                <p className="text-slate-400 text-sm leading-relaxed">{s.label}</p>
              </div>
            ))}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { title: 'Eliminates groupthink', desc: 'Each mind is isolated from the others. No consensus bias. RISK will challenge GAIN even if everyone agrees.' },
              { title: 'Forces parallel thinking', desc: 'All six perspectives run simultaneously. No sequential reasoning that anchors on the first answer.' },
              { title: 'Surfaces hidden blind spots', desc: 'RISK finds what you hope isn\'t true. WILD finds what you haven\'t imagined. Neither pulls punches.' },
            ].map(b => (
              <div key={b.title} className="border border-slate-700 rounded-2xl p-6">
                <h3 className="font-serif font-bold text-lg text-cream mb-2">{b.title}</h3>
                <p className="text-slate-400 text-sm leading-relaxed">{b.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FEATURES ── */}
      <section id="features" className="py-24 px-6 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="mb-12">
            <span className="font-mono text-xs text-muted">── 04 ──</span>
            <h2 className="font-serif text-4xl font-bold text-navy mt-2 mb-3">Everything you need to think better.</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                icon: <div className="grid grid-cols-3 gap-1">{['fact','feel','risk','gain','wild','merge'].map(k => <div key={k} className="w-5 h-5 rounded" style={{backgroundColor: k==='fact'?'#64748B':k==='feel'?'#DC2626':k==='risk'?'#374151':k==='gain'?'#D97706':k==='wild'?'#16A34A':'#0046FF', opacity:0.7}} />)}</div>,
                title: '6 Mind Reports',
                desc: 'Each agent delivers a structured report from its unique perspective. Sources cited. No opinion without evidence.',
                color: '#0046FF',
              },
              {
                icon: <MessageSquare size={24} style={{ color: '#FF9013' }} />,
                title: 'AI Cross-Debate',
                desc: 'The minds argue with each other across 3 rounds. RISK challenges GAIN. WILD surprises FACT. Emergent insights appear that no single mind could produce.',
                color: '#FF9013',
              },
              {
                icon: <Network size={24} style={{ color: '#16A34A' }} />,
                title: 'Knowledge Graph',
                desc: 'Every concept and connection mapped visually. See where minds agree, conflict, and converge — included in Quick Scan.',
                color: '#16A34A',
              },
            ].map(f => (
              <div key={f.title} className="bg-cream rounded-2xl p-8 border border-border">
                <div className="w-12 h-12 rounded-xl bg-white border border-border flex items-center justify-center mb-5">
                  {f.icon}
                </div>
                <h3 className="font-serif text-xl font-bold text-navy mb-2">{f.title}</h3>
                <p className="text-slate text-sm leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CROO ── */}
      <section id="croo" className="py-24 px-6 bg-cream-2">
        <div className="max-w-6xl mx-auto">
          <div className="mb-12">
            <span className="font-mono text-xs text-muted">── 05 ──</span>
            <h2 className="font-serif text-4xl font-bold text-navy mt-2 mb-3">Built for the CROO Network</h2>
            <p className="text-slate text-lg max-w-xl">BeanAI is a native agent on CROO — the multi-agent marketplace where AI agents work together on complex tasks.</p>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              {[
                { title: 'Order via CROO SDK', desc: 'Any app or agent on the CROO network can trigger a BeanAI analysis via one API call. No integration code needed.' },
                { title: 'Compose with other agents', desc: 'Chain BeanAI with data-gathering agents, writing agents, or execution agents in automated multi-agent workflows.' },
                { title: 'Pay per analysis', desc: 'No subscription. Billed per analysis in CROO credits. Start from $0.10 per decision.' },
              ].map(item => (
                <div key={item.title} className="flex gap-4">
                  <div className="w-8 h-8 rounded-lg bg-blue-soft border flex items-center justify-center shrink-0 mt-0.5" style={{ borderColor: '#0046FF33' }}>
                    <Check size={14} style={{ color: '#0046FF' }} />
                  </div>
                  <div>
                    <h4 className="font-medium text-navy text-sm mb-1">{item.title}</h4>
                    <p className="text-slate text-sm leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
            {/* Agent card mockup */}
            <div className="bg-white rounded-2xl border border-border p-6 shadow-sm max-w-sm">
              <div className="flex items-center gap-3 mb-4 pb-4 border-b border-border">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center font-mono font-bold text-white text-sm" style={{ backgroundColor: '#0046FF' }}>BA</div>
                <div>
                  <div className="font-medium text-navy text-sm">BeanAI</div>
                  <div className="text-xs text-muted font-mono">agent.croo.network/beanai</div>
                </div>
                <div className="ml-auto flex items-center gap-1.5 text-xs font-mono text-green-600 bg-green-50 border border-green-200 px-2 py-0.5 rounded-full">
                  <div className="w-1.5 h-1.5 rounded-full bg-green-500" /> Live
                </div>
              </div>
              <div className="space-y-2 text-xs font-mono text-muted">
                <div className="flex justify-between"><span>Input</span><span className="text-slate">decision_topic: string</span></div>
                <div className="flex justify-between"><span>Model</span><span className="text-slate">quick | full</span></div>
                <div className="flex justify-between"><span>Output</span><span className="text-slate">MindReport[]</span></div>
                <div className="flex justify-between"><span>Cost</span><span className="text-slate">$0.10 – $0.45</span></div>
              </div>
              <div className="mt-4 pt-4 border-t border-border">
                <div className="bg-cream rounded-lg p-3 text-xs font-mono text-slate">
                  <span className="text-muted">POST</span> /analyze<br/>
                  <span style={{ color: '#0046FF' }}>{'{'} topic: &quot;...&quot;, model: &quot;quick&quot; {'}'}</span>
                </div>
              </div>
            </div>
          </div>
          <div className="mt-10">
            <span className="inline-flex items-center gap-2 text-xs font-mono text-muted border border-border rounded-full px-4 py-2 bg-white">
              Listed on CROO Network · agent.croo.network
            </span>
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="py-12 px-6 border-t border-border bg-cream">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-1 mb-1">
              <span className="font-serif font-bold text-lg text-navy">Bean</span>
              <span className="font-mono font-bold text-lg" style={{ color: '#0046FF' }}>AI</span>
            </div>
            <p className="text-xs font-mono text-muted">© 2026 Propeller · Six Minds Analysis</p>
          </div>
          <TechStackRow />
          <div className="flex items-center gap-5 text-xs font-mono text-muted">
            <a href="#" className="hover:text-slate transition-colors">Privacy</a>
            <a href="#" className="hover:text-slate transition-colors">Terms</a>
            <a href="#" className="hover:text-slate transition-colors">Docs</a>
          </div>
        </div>
      </footer>
    </div>
  )
}
