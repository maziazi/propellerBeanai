'use client'

import { motion } from 'framer-motion'
import { ArrowRight, Play, Zap, MessageSquare, Network, Sparkles, Users, Globe, ShieldAlert, MessagesSquare, BadgeCheck, Frown, Meh, AlertCircle, EyeOff, Search } from 'lucide-react'
import Link from 'next/link'
import { Header } from '@/components/layout/Header'

const BLUE   = '#4182EB'
const GREEN  = '#169F53'
const YELLOW = '#F6BB14'
const RED    = '#E24231'
const F = "'TWK Lausanne Pan', var(--font-inter), Inter, -apple-system, sans-serif"
const DEMO_ID = 'a4e2831f-56b0-45da-adac-824f60e44f1e'

// ── App Preview mockup ────────────────────────────────────────────────────────
function AppPreview() {
  const CARDS = [
    { label: 'FACT',  color: BLUE,      bg: '#E8F0FE', width: '65%', text: 'Market size $197B at 18.7% CAGR. 3 verified sources.' },
    { label: 'FEEL',  color: RED,       bg: '#FCE8E6', width: '80%', text: 'Strong excitement — mixed with underlying fear of failure.' },
    { label: 'RISK',  color: '#3C4043', bg: '#F1F3F4', width: '55%', text: 'Runway risk critical. 18 months minimum before revenue.' },
    { label: 'GAIN',  color: '#F29900', bg: '#FEF9E7', width: '70%', text: 'Behavioral dataset is a defensible moat competitors lack.' },
    { label: 'WILD',  color: GREEN,     bg: '#E6F4EA', width: '60%', text: 'What if you added team billing this week? $5.6K MRR.' },
    { label: 'MERGE', color: BLUE,      bg: '#E8F0FE', width: '85%', text: 'WAIT → GO after 30-day sprint. Confidence: 74%' },
  ]
  return (
    <div style={{ border: '0.5px solid rgba(0,0,0,0.85)', borderRadius: 12, overflow: 'hidden', backgroundColor: '#FFF', boxShadow: '0 8px 32px rgba(0,0,0,0.08)' }}>
      {/* Browser bar */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '10px 16px', backgroundColor: '#F5F5F5', borderBottom: '0.5px solid rgba(0,0,0,0.10)' }}>
        {[RED, YELLOW, GREEN].map((c, i) => <div key={i} style={{ width: 10, height: 10, borderRadius: '50%', backgroundColor: c }} />)}
        <div style={{ marginLeft: 12, flex: 1, fontFamily: 'monospace', fontSize: 11, color: '#9AA0A6', backgroundColor: '#E8E8E8', borderRadius: 90, padding: '2px 12px', textAlign: 'center' }}>
          beanai.app/results/...
        </div>
      </div>
      {/* Topic row */}
      <div style={{ padding: '12px 16px', borderBottom: '0.5px solid rgba(0,0,0,0.08)', display: 'flex', alignItems: 'center', gap: 8 }}>
        <div style={{ display: 'flex', gap: 3 }}>
          {[BLUE, RED, YELLOW, GREEN].map((c, i) => <span key={i} style={{ width: 7, height: 7, borderRadius: '50%', backgroundColor: c, display: 'block' }} />)}
        </div>
        <span style={{ fontFamily: F, fontSize: 12, fontWeight: 600, color: '#000' }}>Should I pivot my SaaS from B2C to B2B?</span>
        <span style={{ marginLeft: 'auto', fontFamily: 'monospace', fontSize: 10, padding: '2px 8px', borderRadius: 90, backgroundColor: '#E6F4EA', color: GREEN }}>74%</span>
      </div>
      {/* Mind cards */}
      <div style={{ padding: 12, display: 'flex', flexDirection: 'column', gap: 6 }}>
        {CARDS.map((c, i) => (
          <motion.div key={c.label} style={{ display: 'flex', alignItems: 'center', gap: 10, borderRadius: 8, padding: '8px 10px', backgroundColor: c.bg }}
            initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 + i * 0.07 }}>
            <span style={{ fontFamily: 'monospace', fontSize: 9, fontWeight: 700, padding: '2px 6px', borderRadius: 90, backgroundColor: c.color, color: c.label === 'GAIN' ? '#202124' : '#fff', flexShrink: 0 }}>{c.label}</span>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ height: 4, borderRadius: 2, backgroundColor: c.color, width: c.width, opacity: 0.25, marginBottom: 3 }} />
              <p style={{ fontFamily: F, fontSize: 10, color: '#5F6368', margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{c.text}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  )
}

// ── Chip label ────────────────────────────────────────────────────────────────
function Chip({ label, color = 'rgba(0,0,0,0.25)', text = '#000' }: { label: string; color?: string; text?: string }) {
  return (
    <div style={{ display: 'inline-flex', alignItems: 'center', border: `0.5px solid ${color}`, borderRadius: 90, padding: '5px 14px', fontSize: 12, fontWeight: 500, color: text, fontFamily: F, letterSpacing: '0.04em', marginBottom: 16 }}>
      {label}
    </div>
  )
}

// ── Page ──────────────────────────────────────────────────────────────────────
export default function LandingPage() {
  return (
    <div style={{ backgroundColor: '#FFF', color: '#000' }}>
      <Header />

      {/* ══════════════════════════════════════════
          1. HERO
      ══════════════════════════════════════════ */}
      <section style={{ position: 'relative', minHeight: '100vh', backgroundColor: '#FFF', paddingTop: 56, display: 'flex', alignItems: 'center', overflow: 'hidden' }}>

        {/* Grid of squares — densest at centre, dissolving toward every edge */}
        <div aria-hidden style={{ position: 'absolute', inset: 0, backgroundImage: 'linear-gradient(rgba(0,0,0,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,0.06) 1px, transparent 1px)', backgroundSize: '46px 46px', maskImage: 'radial-gradient(ellipse 62% 58% at 50% 46%, #000 25%, transparent 78%)', WebkitMaskImage: 'radial-gradient(ellipse 62% 58% at 50% 46%, #000 25%, transparent 78%)' }} />
        {/* A few brand-tinted filled squares for life, also fading out */}
        <div aria-hidden style={{ position: 'absolute', inset: 0, pointerEvents: 'none', maskImage: 'radial-gradient(ellipse 55% 52% at 50% 46%, #000 10%, transparent 72%)', WebkitMaskImage: 'radial-gradient(ellipse 55% 52% at 50% 46%, #000 10%, transparent 72%)' }}>
          {[
            { c: BLUE,   t: '16%', l: '20%' }, { c: RED,    t: '26%', l: '74%' },
            { c: YELLOW, t: '62%', l: '14%' }, { c: GREEN,  t: '70%', l: '80%' },
            { c: BLUE,   t: '40%', l: '88%' }, { c: GREEN,  t: '22%', l: '40%' },
            { c: RED,    t: '74%', l: '46%' }, { c: YELLOW, t: '38%', l: '8%'  },
          ].map((s, i) => (
            <span key={i} style={{ position: 'absolute', top: s.t, left: s.l, width: 44, height: 44, borderRadius: 6, backgroundColor: s.c, opacity: 0.07 }} />
          ))}
        </div>

        <div style={{ position: 'relative', zIndex: 2, maxWidth: 960, margin: '0 auto', padding: '72px 24px', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', width: '100%' }}>

          <motion.h1
            style={{ fontSize: 'clamp(2.8rem, 5.5vw, 4.8rem)', fontWeight: 900, color: '#000', letterSpacing: '-0.03em', lineHeight: 1.05, marginBottom: 20, fontFamily: F, maxWidth: 700 }}
            initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1, duration: 0.5 }}
          >
            Not one AI.<br />A panel that argues first.
          </motion.h1>

          <motion.p
            style={{ fontSize: 17, color: '#5F6368', maxWidth: 500, lineHeight: 1.65, marginBottom: 36, fontFamily: F }}
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.25, duration: 0.45 }}
          >
            Six minds analyze your decision; facts, risks, emotions, opportunities, and then debate each other before reaching a verdict.
          </motion.p>

          <motion.div
            style={{ display: 'flex', gap: 10, marginBottom: 32, flexWrap: 'wrap', justifyContent: 'center' }}
            initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35, duration: 0.4 }}
          >
            <Link href="/app" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, backgroundColor: BLUE, color: '#FFF', border: '0.5px solid rgba(0,0,0,0.75)', borderRadius: 90, padding: '12px 26px', fontSize: 14, fontWeight: 600, textDecoration: 'none', fontFamily: F }}>
              Get started
            </Link>
            <Link href="/login" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, backgroundColor: 'transparent', color: '#000', border: '0.5px solid rgba(0,0,0,0.35)', borderRadius: 90, padding: '12px 26px', fontSize: 14, fontWeight: 500, textDecoration: 'none', fontFamily: F }}>
              Login
            </Link>
          </motion.div>

          <motion.div
            style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap', justifyContent: 'center' }}
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}
          >
            <span style={{ fontSize: 12, color: '#9AA0A6', fontFamily: F }}>Powered by</span>
            {['Gemini', 'Groq', 'Tavily', 'CROO'].map(n => (
              <span key={n} style={{ border: '0.5px solid rgba(0,0,0,0.22)', borderRadius: 90, padding: '3px 12px', fontSize: 11, fontWeight: 500, color: '#000', fontFamily: F }}>{n}</span>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          2. WITHOUT vs WITH
      ══════════════════════════════════════════ */}
      <section style={{ backgroundColor: '#FFF', padding: '80px 24px' }}>
        <div style={{ maxWidth: 960, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 48 }}>
            <Chip label="WHY BEANAI" />
            <h2 style={{ fontSize: 'clamp(1.8rem, 3vw, 2.6rem)', fontWeight: 800, color: '#000', letterSpacing: '-0.025em', fontFamily: F, lineHeight: 1.2 }}>
              ChatGPT will agree with you.{' '}
              <span style={{ color: RED }}>That's the problem.</span>
            </h2>
          </div>

          {/* Overlapping comparison cards */}
          <div className="relative flex flex-col items-center md:flex-row md:items-start md:justify-center">

            {/* ── Without BeanAI — muted card, sits behind ── */}
            <motion.div
              className="relative z-[1] w-full max-w-[420px] md:mt-16 md:w-[360px]"
              style={{ backgroundColor: '#FFF', border: '0.5px solid rgba(0,0,0,0.12)', borderRadius: 16, boxShadow: '0 6px 24px rgba(0,0,0,0.05)' }}
              initial={{ opacity: 0, x: -16 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.45 }}
            >
              <div style={{ padding: '24px 26px 10px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 9, marginBottom: 6 }}>
                  <span style={{ width: 10, height: 10, borderRadius: '50%', backgroundColor: RED, display: 'block' }} />
                  <h3 style={{ fontFamily: F, fontSize: 18, fontWeight: 700, color: '#3C4043', margin: 0, letterSpacing: '-0.01em' }}>Without BeanAI</h3>
                </div>
                {[
                  { Icon: Frown,       text: 'One AI, one perspective that always agrees.' },
                  { Icon: AlertCircle, text: 'Data left unchecked — could be outdated or wrong.' },
                  { Icon: Meh,         text: 'Risks ignored because the AI is too optimistic.' },
                  { Icon: EyeOff,      text: 'Decisions with no trail, impossible to prove.' },
                  { Icon: Search,      text: 'You browse manually to validate everything.' },
                ].map(({ Icon, text }, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 13, padding: '13px 0', borderTop: i > 0 ? '0.5px solid rgba(0,0,0,0.07)' : 'none' }}>
                    <div style={{ width: 30, height: 30, borderRadius: 8, backgroundColor: '#F1F3F4', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#9AA0A6', flexShrink: 0 }}>
                      <Icon size={15} />
                    </div>
                    <p style={{ fontFamily: F, fontSize: 13.5, color: '#5F6368', margin: 0, lineHeight: 1.4 }}>{text}</p>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* ── With BeanAI — elevated card, overlaps on top ── */}
            <motion.div
              className="relative z-[2] mt-[-20px] w-full max-w-[500px] md:mt-0 md:ml-[-48px] md:w-[560px]"
              style={{ backgroundColor: '#FFF', border: '0.5px solid rgba(0,0,0,0.08)', borderRadius: 20, overflow: 'hidden', boxShadow: '0 28px 64px rgba(65,130,235,0.20)' }}
              initial={{ opacity: 0, x: 16 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.45, delay: 0.12 }}
            >
              {/* Gradient header band */}
              <div style={{ position: 'relative', height: 132, background: 'linear-gradient(120deg, #3B74E0 0%, #4182EB 45%, #79A8FF 100%)', overflow: 'hidden' }}>
                {/* pixel grid texture */}
                <div style={{ position: 'absolute', inset: 0, opacity: 0.14, backgroundImage: 'linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)', backgroundSize: '20px 20px' }} />
                {/* soft glow */}
                <div style={{ position: 'absolute', top: -60, right: -40, width: 200, height: 200, borderRadius: '50%', background: 'radial-gradient(circle, rgba(255,255,255,0.35), transparent 70%)' }} />
                {/* brand label */}
                <div style={{ position: 'absolute', top: 16, left: 22, display: 'flex', alignItems: 'center', gap: 7 }}>
                  <span style={{ display: 'flex', gap: 3 }}>
                    {[BLUE, RED, YELLOW, GREEN].map((c, i) => <span key={i} style={{ width: 7, height: 7, borderRadius: '50%', backgroundColor: '#FFF', opacity: 0.9, display: 'block' }} />)}
                  </span>
                  <span style={{ fontFamily: 'monospace', fontSize: 11, color: 'rgba(255,255,255,0.85)', letterSpacing: '0.04em' }}>BeanAI · 6 minds engine</span>
                </div>
                {/* mind pills */}
                <div style={{ position: 'absolute', bottom: 16, left: 22, right: 22, display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                  {['FACT', 'FEEL', 'RISK', 'GAIN', 'WILD', 'MERGE'].map(m => (
                    <span key={m} style={{ fontFamily: 'monospace', fontSize: 10, fontWeight: 700, color: '#FFF', backgroundColor: 'rgba(255,255,255,0.18)', border: '0.5px solid rgba(255,255,255,0.35)', borderRadius: 90, padding: '3px 9px', backdropFilter: 'blur(4px)' }}>{m}</span>
                  ))}
                </div>
              </div>

              {/* Body */}
              <div style={{ padding: '22px 28px 26px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 9, marginBottom: 4 }}>
                  <Sparkles size={20} style={{ color: BLUE }} />
                  <h3 style={{ fontFamily: F, fontSize: 21, fontWeight: 800, color: '#000', margin: 0, letterSpacing: '-0.02em' }}>With BeanAI</h3>
                </div>
                {[
                  { Icon: Users,         lead: '6 minds in parallel',       rest: 'analyze every angle of the decision at once.' },
                  { Icon: Globe,         lead: 'Real-time data',           rest: 'pulled straight from the internet as it analyzes.' },
                  { Icon: ShieldAlert,   lead: "Devil's advocate by design", rest: '— the Black Hat must hunt for your weak spots.' },
                  { Icon: MessagesSquare, lead: 'Debate Round 2',           rest: '— minds respond to each other; conflict surfaces on its own.' },
                  { Icon: BadgeCheck,    lead: 'SHA-256 receipt',          rest: 'gives every decision verifiable proof.' },
                ].map(({ Icon, lead, rest }, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '14px 0', borderTop: i > 0 ? '0.5px solid rgba(0,0,0,0.07)' : 'none' }}>
                    <div style={{ width: 38, height: 38, borderRadius: 10, backgroundColor: BLUE, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#FFF', flexShrink: 0, boxShadow: '0 5px 14px rgba(65,130,235,0.32)' }}>
                      <Icon size={18} />
                    </div>
                    <p style={{ fontFamily: F, fontSize: 14.5, color: '#202124', margin: 0, lineHeight: 1.45 }}>
                      <strong style={{ fontWeight: 700 }}>{lead}</strong> {rest}
                    </p>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          3. HOW IT WORKS
      ══════════════════════════════════════════ */}
      <section style={{ backgroundColor: '#FFF', padding: '80px 24px' }}>
        <div style={{ maxWidth: 960, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 48 }}>
            <Chip label="HOW IT WORKS" />
            <h2 style={{ fontSize: 'clamp(1.8rem, 3vw, 2.6rem)', fontWeight: 800, color: '#000', letterSpacing: '-0.025em', fontFamily: F }}>
              Three steps to a confident decision.
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3" style={{ gap: 12 }}>
            {[
              { num: '01', title: 'Type your question', desc: 'Describe your decision. BeanAI asks clarifying questions to sharpen the topic before analysis starts.', accent: YELLOW, numColor: '#7A4F00' },
              { num: '02', title: 'Six minds analyze', desc: 'FACT, FEEL, RISK, GAIN, WILD, MERGE run in parallel — then debate each other in a second round.', accent: BLUE, numColor: '#FFF' },
              { num: '03', title: 'Get your verdict', desc: 'Structured report with confidence score, verified sources, knowledge graph, and a SHA-256 receipt.', accent: GREEN, numColor: '#FFF' },
            ].map((s, i) => (
              <motion.div key={s.num} style={{ border: '0.5px solid rgba(0,0,0,0.85)', borderRadius: 12, overflow: 'hidden' }}
                initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}>
                <div style={{ backgroundColor: s.accent, padding: '16px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontFamily: F, fontSize: 11, fontWeight: 700, color: s.numColor, letterSpacing: '0.08em' }}>{s.num}</span>
                  <span style={{ fontFamily: F, fontSize: 40, fontWeight: 900, lineHeight: 1, color: s.accent === YELLOW ? 'rgba(0,0,0,0.08)' : 'rgba(255,255,255,0.12)' }}>{s.num}</span>
                </div>
                <div style={{ padding: '20px 24px', backgroundColor: '#FFF' }}>
                  <h3 style={{ fontFamily: F, fontSize: 15, fontWeight: 700, color: '#000', marginBottom: 8, lineHeight: 1.3 }}>{s.title}</h3>
                  <p style={{ fontFamily: F, fontSize: 13, color: '#5F6368', lineHeight: 1.6 }}>{s.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          4. IN ACTION
      ══════════════════════════════════════════ */}
      <section style={{ backgroundColor: '#FFF', padding: '80px 24px' }}>
        <div style={{ maxWidth: 680, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 40 }}>
            <Chip label="LIVE DEMO" color={BLUE} text={BLUE} />
            <h2 style={{ fontSize: 'clamp(1.8rem, 3vw, 2.6rem)', fontWeight: 800, color: '#000', letterSpacing: '-0.025em', marginBottom: 10, fontFamily: F }}>
              See a real analysis.
            </h2>
            <p style={{ fontFamily: F, fontSize: 14, color: '#5F6368' }}>
              Topic: <em>"Should I pivot my SaaS from B2C to B2B?"</em>
            </p>
          </div>
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }}>
            <AppPreview />
          </motion.div>
          <p style={{ fontFamily: 'monospace', fontSize: 12, color: '#9AA0A6', textAlign: 'center', marginTop: 14 }}>
            38 seconds. No consultant required.
          </p>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          5. THE DEBATE
      ══════════════════════════════════════════ */}
      <section style={{ background: 'linear-gradient(180deg, #FEF8E6 0%, #FFFFFF 100%)', padding: '80px 24px' }}>
        <div style={{ maxWidth: 680, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 48 }}>
            <Chip label="ROUND 2" color="#F6BA18" text="#8A5800" />
            <h2 style={{ fontSize: 'clamp(1.8rem, 3vw, 2.6rem)', fontWeight: 800, color: '#000', letterSpacing: '-0.025em', marginBottom: 12, fontFamily: F }}>
              They argue before they agree.
            </h2>
            <p style={{ fontFamily: F, fontSize: 15, color: '#5F6368', maxWidth: 460, margin: '0 auto', lineHeight: 1.6 }}>
              Most AI gives you one answer. BeanAI runs a second round where every mind reads the others — and pushes back.
            </p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {/* RISK → GAIN, left */}
            <motion.div style={{ maxWidth: '82%', alignSelf: 'flex-start' }}
              initial={{ opacity: 0, x: -12 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 6 }}>
                <span style={{ fontFamily: 'monospace', fontSize: 10, fontWeight: 700, padding: '2px 8px', borderRadius: 90, backgroundColor: RED, color: '#FFF' }}>RISK</span>
                <span style={{ fontFamily: 'monospace', fontSize: 10, color: '#9AA0A6' }}>→ GAIN · 00:04</span>
              </div>
              <div style={{ border: `0.5px solid ${RED}`, borderRadius: '0 12px 12px 12px', padding: '14px 18px', backgroundColor: '#FFF5F5' }}>
                <p style={{ fontFamily: F, fontSize: 13, color: '#000', lineHeight: 1.6, margin: 0 }}>
                  &quot;Your adoption rate is too optimistic. Historical data for similar products shows 60% churn in the first month.&quot;
                </p>
              </div>
            </motion.div>

            {/* GAIN → RISK, right */}
            <motion.div style={{ maxWidth: '82%', alignSelf: 'flex-end' }}
              initial={{ opacity: 0, x: 12 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 6, marginBottom: 6 }}>
                <span style={{ fontFamily: 'monospace', fontSize: 10, color: '#9AA0A6' }}>GAIN → RISK · 00:06</span>
                <span style={{ fontFamily: 'monospace', fontSize: 10, fontWeight: 700, padding: '2px 8px', borderRadius: 90, backgroundColor: '#F6BA18', color: '#7A4F00' }}>GAIN</span>
              </div>
              <div style={{ border: '0.5px solid #F6BA18', borderRadius: '12px 0 12px 12px', padding: '14px 18px', backgroundColor: '#FFFAED' }}>
                <p style={{ fontFamily: F, fontSize: 13, color: '#000', lineHeight: 1.6, margin: 0 }}>
                  &quot;The segment you looked at is B2C. This is B2B — retention rates differ significantly. Your data isn&apos;t apples-to-apples.&quot;
                </p>
              </div>
            </motion.div>

            {/* MERGE, center */}
            <motion.div style={{ alignSelf: 'center', width: '92%' }}
              initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.2 }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, marginBottom: 6 }}>
                <span style={{ fontFamily: 'monospace', fontSize: 10, fontWeight: 700, padding: '2px 8px', borderRadius: 90, backgroundColor: BLUE, color: '#FFF' }}>MERGE</span>
                <span style={{ fontFamily: 'monospace', fontSize: 10, color: '#9AA0A6' }}>· 00:09</span>
              </div>
              <div style={{ border: `0.5px solid ${BLUE}`, borderRadius: 12, padding: '16px 20px', backgroundColor: '#EEF4FF' }}>
                <p style={{ fontFamily: F, fontSize: 13, color: '#000', lineHeight: 1.6, margin: 0 }}>
                  &quot;Valid conflict. Verdict: proceed with the pivot to B2B, but validate this segment&apos;s churn rate before fully committing. Confidence: 74%&quot;
                </p>
              </div>
            </motion.div>
          </div>

          <p style={{ fontFamily: F, fontSize: 13, color: '#9AA0A6', textAlign: 'center', marginTop: 32 }}>
            Conflicts surface. Blind spots disappear. Verdict gets sharper.
          </p>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          6. DECISION RECEIPT
      ══════════════════════════════════════════ */}
      <section style={{ backgroundColor: '#FFF', padding: '80px 24px' }}>
        <div style={{ maxWidth: 960, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 48 }}>
            <Chip label="PROOF OF DECISION" color={GREEN} text={GREEN} />
            <h2 style={{ fontSize: 'clamp(1.8rem, 3vw, 2.6rem)', fontWeight: 800, color: '#000', letterSpacing: '-0.025em', marginBottom: 12, fontFamily: F }}>
              Prove it, don't trust it.
            </h2>
            <p style={{ fontFamily: F, fontSize: 15, color: '#5F6368', maxWidth: 460, margin: '0 auto', lineHeight: 1.6 }}>
              Every analysis generates a SHA-256 fingerprint. The same topic always produces the same hash — anyone can verify the output was never changed.
            </p>
          </div>

          <motion.div style={{ maxWidth: 480, margin: '0 auto' }}
            initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <div style={{ backgroundColor: '#000', border: `0.5px solid ${GREEN}`, borderRadius: 12, overflow: 'hidden' }}>
              {/* Terminal top bar */}
              <div style={{ padding: '10px 16px', borderBottom: `0.5px solid rgba(22,159,83,0.25)`, display: 'flex', alignItems: 'center', gap: 6 }}>
                {[RED, YELLOW, GREEN].map((c, i) => <div key={i} style={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: c }} />)}
                <span style={{ fontFamily: 'monospace', fontSize: 11, color: 'rgba(255,255,255,0.35)', marginLeft: 10 }}>beanai-receipt.txt</span>
              </div>
              {/* Receipt rows */}
              <div style={{ padding: '20px 24px', fontFamily: 'monospace', fontSize: 12, lineHeight: 2 }}>
                <p style={{ color: '#FFF', fontWeight: 700, fontSize: 13, marginBottom: 4 }}>BeanAI Decision Receipt</p>
                {[
                  { k: 'Topic',   v: '"Pivot SaaS to B2B?"' },
                  { k: 'Time',    v: '2026-06-29 · 14:32 UTC' },
                  { k: 'Minds',   v: 'FACT FEEL RISK GAIN WILD MERGE' },
                  { k: 'Rounds',  v: '2 (parallel + debate)' },
                  { k: 'SHA-256', v: 'a3f8c2d1...9e01bf43', dim: true },
                  { k: 'Verdict', v: 'Proceed — validate churn first' },
                ].map(row => (
                  <div key={row.k} style={{ display: 'flex', gap: 16 }}>
                    <span style={{ color: GREEN, minWidth: 72, flexShrink: 0 }}>{row.k}</span>
                    <span style={{ color: row.dim ? 'rgba(255,255,255,0.45)' : '#FFF' }}>{row.v}</span>
                  </div>
                ))}
              </div>
              <div style={{ padding: '0 24px 20px' }}>
                <button style={{ border: `0.5px solid ${GREEN}`, borderRadius: 90, padding: '8px 20px', backgroundColor: 'transparent', color: GREEN, fontFamily: F, fontSize: 13, fontWeight: 500, cursor: 'pointer' }}>
                  Verify this receipt →
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          7. CROO SECTION
      ══════════════════════════════════════════ */}
      <section style={{ background: 'linear-gradient(180deg, #E8F6EE 0%, #FFFFFF 100%)', padding: '80px 24px' }}>
        <div style={{ maxWidth: 960, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 48 }}>
            <Chip label="FOR AI AGENTS" color={GREEN} text={GREEN} />
            <h2 style={{ fontSize: 'clamp(1.8rem, 3vw, 2.6rem)', fontWeight: 800, color: '#000', letterSpacing: '-0.025em', marginBottom: 12, fontFamily: F }}>
              BeanAI is not just for humans.
            </h2>
            <p style={{ fontFamily: F, fontSize: 15, color: '#5F6368', maxWidth: 500, margin: '0 auto', lineHeight: 1.6 }}>
              Any AI agent on the CROO network can hire BeanAI as a reasoning layer — pay per analysis in USDC, settle on-chain automatically.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3" style={{ gap: 12, marginBottom: 36 }}>
            {[
              { Icon: Network,        accent: BLUE,   title: 'Callable via CAP',         desc: 'CROO Agent Protocol — any agent can hire BeanAI with a single API call.' },
              { Icon: MessageSquare,  accent: YELLOW, title: 'Structured JSON output',    desc: 'Every verdict delivered as clean JSON — plug directly into your agent pipeline.' },
              { Icon: Zap,            accent: GREEN,  title: 'Fully autonomous A2A',      desc: 'No human in the loop. BeanAI receives, analyzes, and delivers automatically.' },
            ].map((item, i) => (
              <motion.div key={i} style={{ border: '0.5px solid rgba(0,0,0,0.85)', borderRadius: 12, padding: '24px', backgroundColor: '#FFF' }}
                initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}>
                <div style={{ width: 36, height: 36, borderRadius: 8, backgroundColor: item.accent + '18', border: `0.5px solid ${item.accent}35`, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 16, color: item.accent }}>
                  <item.Icon size={17} />
                </div>
                <h3 style={{ fontFamily: F, fontSize: 14, fontWeight: 700, color: '#000', marginBottom: 6 }}>{item.title}</h3>
                <p style={{ fontFamily: F, fontSize: 13, color: '#5F6368', lineHeight: 1.55 }}>{item.desc}</p>
              </motion.div>
            ))}
          </div>

          <div style={{ textAlign: 'center' }}>
            <Link href="#croo" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, backgroundColor: BLUE, color: '#FFF', border: '0.5px solid rgba(0,0,0,0.75)', borderRadius: 90, padding: '12px 26px', fontSize: 14, fontWeight: 600, textDecoration: 'none', fontFamily: F }}>
              View BeanAI on CROO Agent Store <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          8. CTA CLOSING
      ══════════════════════════════════════════ */}
      <section style={{ backgroundColor: '#000', padding: '100px 24px' }}>
        <div style={{ maxWidth: 600, margin: '0 auto', textAlign: 'center' }}>
          <motion.h2
            style={{ fontSize: 'clamp(2rem, 4vw, 3.2rem)', fontWeight: 900, color: '#FFF', letterSpacing: '-0.03em', marginBottom: 14, fontFamily: F }}
            initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
          >
            Your next decision starts here.
          </motion.h2>
          <p style={{ fontFamily: F, fontSize: 16, color: 'rgba(255,255,255,0.55)', marginBottom: 36, lineHeight: 1.6 }}>
            Don't think alone. Bring a panel.
          </p>
          <div style={{ display: 'flex', gap: 10, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link href="/app" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, backgroundColor: BLUE, color: '#FFF', border: '0.5px solid rgba(255,255,255,0.25)', borderRadius: 90, padding: '13px 28px', fontSize: 14, fontWeight: 600, textDecoration: 'none', fontFamily: F }}>
              Start analyzing free <ArrowRight size={14} />
            </Link>
            <Link href={`/results/${DEMO_ID}`} style={{ display: 'inline-flex', alignItems: 'center', gap: 6, color: 'rgba(255,255,255,0.8)', border: '0.5px solid rgba(255,255,255,0.28)', borderRadius: 90, padding: '13px 28px', fontSize: 14, fontWeight: 500, textDecoration: 'none', fontFamily: F }}>
              <Play size={13} /> View demo
            </Link>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          9. FOOTER
      ══════════════════════════════════════════ */}
      <footer style={{ backgroundColor: '#000', padding: '28px 24px' }}>
        <div style={{ maxWidth: 960, margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 14 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <span style={{ display: 'flex', gap: 3 }}>
              {[BLUE, RED, YELLOW, GREEN].map((c, i) => <span key={i} style={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: c, display: 'block' }} />)}
            </span>
            <span style={{ fontFamily: F, fontWeight: 700, fontSize: 15, color: '#FFF' }}>
              Bean<span style={{ color: BLUE }}>AI</span>
            </span>
          </div>
          <p style={{ fontFamily: 'monospace', fontSize: 11, color: 'rgba(255,255,255,0.5)', margin: 0 }}>© 2026 Propeller · CROO Agent Hackathon</p>
          <div style={{ display: 'flex', gap: 20 }}>
            {['Privacy', 'Terms', 'Docs'].map(l => (
              <a key={l} href="#" style={{ fontFamily: F, fontSize: 12, color: 'rgba(255,255,255,0.7)', textDecoration: 'none' }}>{l}</a>
            ))}
          </div>
        </div>
      </footer>
    </div>
  )
}
