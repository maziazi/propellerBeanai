'use client'

import { motion } from 'framer-motion'
import { useParams, notFound } from 'next/navigation'
import { Lightbulb, ShieldCheck, GitBranch, Search, Zap, ArrowRight, Check } from 'lucide-react'
import Link from 'next/link'
import { MarketingShell, PageHero, CTA, Footer, BLUE, GREEN, YELLOW, RED, F } from '@/components/marketing/Shell'

type Step = { n: string; title: string; desc: string }
type Solution = {
  chip: string; accentColor: string; title: string; accent: string; sub: string
  Icon: React.ElementType
  who: string; pains: string[]; steps: Step[]; example: { q: string; verdict: string; confidence: string }
}

const SOLUTIONS: Record<string, Solution> = {
  'validate-an-idea': {
    chip: 'SOLUTION', accentColor: YELLOW, Icon: Lightbulb, title: 'Validate an idea', accent: 'before you commit.',
    sub: 'Pressure-test a new idea across six lenses before you spend time or money — facts, risks, emotions, and upside, all in one pass.',
    who: 'Founders, PMs, and builders weighing whether an idea is worth pursuing.',
    pains: ['Falling for your own optimism', 'No real market data behind the gut call', 'Risks only surface after you commit'],
    steps: [
      { n: '01', title: 'Describe the idea', desc: 'State what you want to validate. BeanAI sharpens it with clarifying questions.' },
      { n: '02', title: 'Six minds weigh in', desc: 'FACT pulls real market data, RISK hunts for flaws, GAIN maps the upside.' },
      { n: '03', title: 'Get a go / no-go', desc: 'A confidence-scored verdict with the assumptions you still need to test.' },
    ],
    example: { q: 'Should I build a behavioral-analytics SaaS?', verdict: 'Proceed — validate willingness-to-pay first', confidence: '68%' },
  },
  'stress-test-a-plan': {
    chip: 'SOLUTION', accentColor: GREEN, Icon: ShieldCheck, title: 'Stress-test a plan', accent: 'find blind spots early.',
    sub: 'Hand BeanAI your plan and let the Black Hat tear it apart on purpose. Surface the failure modes while they are still cheap to fix.',
    who: 'Teams about to commit to a roadmap, launch, or strategy.',
    pains: ['Group-think hides obvious risks', 'No one plays devil’s advocate', 'Failure modes found too late'],
    steps: [
      { n: '01', title: 'Share the plan', desc: 'Paste your plan or roadmap. BeanAI maps the critical assumptions.' },
      { n: '02', title: 'Adversarial review', desc: 'RISK and FEEL probe for blind spots; minds debate each weakness.' },
      { n: '03', title: 'Hardened plan', desc: 'A prioritized list of risks, each with a mitigation and a confidence score.' },
    ],
    example: { q: 'Is our 4-week launch plan realistic?', verdict: 'High risk — timeline slips without scope cut', confidence: '61%' },
  },
  'make-a-hard-decision': {
    chip: 'SOLUTION', accentColor: BLUE, Icon: GitBranch, title: 'Make a hard decision', accent: 'when options feel equal.',
    sub: 'When two paths look the same on paper, BeanAI runs both through the full panel and a debate round so the real trade-offs surface.',
    who: 'Anyone stuck between two genuinely close options.',
    pains: ['Endless pro/con lists that go nowhere', 'Emotion quietly driving the call', 'No record of why you chose'],
    steps: [
      { n: '01', title: 'Frame the choice', desc: 'Lay out the options. BeanAI defines the criteria that actually matter.' },
      { n: '02', title: 'Panel + debate', desc: 'Each mind scores both paths, then argues in a second round to break ties.' },
      { n: '03', title: 'Decisive verdict', desc: 'One recommendation, the deciding factor, and a SHA-256 receipt of the call.' },
    ],
    example: { q: 'Hire a senior or two juniors?', verdict: 'Senior — faster to leverage at this stage', confidence: '72%' },
  },
  'research-with-perspective': {
    chip: 'SOLUTION', accentColor: RED, Icon: Search, title: 'Research with perspective', accent: 'search plus six lenses.',
    sub: 'Not just search results — BeanAI gathers real sources and interprets them through six distinct viewpoints in a single shot.',
    who: 'Analysts and operators who need interpreted research, not raw links.',
    pains: ['Ten tabs, no synthesis', 'Single-angle summaries miss nuance', 'No way to trust the sources'],
    steps: [
      { n: '01', title: 'Ask the question', desc: 'Pose your research question. FACT retrieves verifiable, cited sources.' },
      { n: '02', title: 'Six interpretations', desc: 'Each mind reads the evidence through its lens — risk, upside, emotion, synthesis.' },
      { n: '03', title: 'Sourced briefing', desc: 'A structured briefing with every claim traced back to a verified source.' },
    ],
    example: { q: 'What’s the real TAM for AI sales agents?', verdict: '$197B at 18.7% CAGR — 3 verified sources', confidence: '79%' },
  },
  'automate-reasoning': {
    chip: 'SOLUTION', accentColor: '#7C6FF0', Icon: Zap, title: 'Automate reasoning', accent: 'for agents & pipelines.',
    sub: 'Wire BeanAI into your agents, scripts, or CI as a reasoning layer. Structured verdicts on demand, fully autonomous, billed per call.',
    who: 'Engineers building agentic systems and automated pipelines.',
    pains: ['LLMs that just agree with the prompt', 'No structured, trustable output', 'No audit trail for automated calls'],
    steps: [
      { n: '01', title: 'Call the API', desc: 'Invoke BeanAI via CLI, REST, or the CROO Agent Protocol with one request.' },
      { n: '02', title: 'Panel runs headless', desc: 'Six minds analyze and debate with no human in the loop.' },
      { n: '03', title: 'Structured verdict', desc: 'Clean JSON plus a SHA-256 receipt you can log and verify later.' },
    ],
    example: { q: 'agent.invoke("approve refund?")', verdict: '{ "decision": "approve", "confidence": 0.81 }', confidence: '81%' },
  },
}

export default function SolutionPage() {
  const { slug } = useParams<{ slug: string }>()
  const s = SOLUTIONS[slug]
  if (!s) return notFound()
  const A = s.accentColor

  return (
    <MarketingShell>
      <PageHero chip={s.chip} chipColor={A} chipText={A} title={s.title} accent={s.accent} accentColor={A} sub={s.sub} />

      {/* Who / pains */}
      <section style={{ padding: '24px 24px 0' }}>
        <div className="grid grid-cols-1 md:grid-cols-[1fr_1.4fr]" style={{ gap: 12, maxWidth: 880, margin: '0 auto' }}>
          <div style={{ border: '0.5px solid rgba(0,0,0,0.85)', borderRadius: 12, padding: '24px', backgroundColor: '#FFF' }}>
            <div style={{ width: 40, height: 40, borderRadius: 10, backgroundColor: A + '18', border: `0.5px solid ${A}35`, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 14, color: A }}>
              <s.Icon size={20} />
            </div>
            <p style={{ fontFamily: 'monospace', fontSize: 10, color: '#9AA0A6', letterSpacing: '0.06em', marginBottom: 6 }}>WHO IT&apos;S FOR</p>
            <p style={{ fontFamily: F, fontSize: 14.5, color: '#202124', lineHeight: 1.5 }}>{s.who}</p>
          </div>
          <div style={{ border: '0.5px solid rgba(0,0,0,0.85)', borderRadius: 12, padding: '24px', backgroundColor: '#FFF' }}>
            <p style={{ fontFamily: 'monospace', fontSize: 10, color: '#9AA0A6', letterSpacing: '0.06em', marginBottom: 12 }}>THE PROBLEM TODAY</p>
            {s.pains.map((p, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 10, marginBottom: i < s.pains.length - 1 ? 12 : 0 }}>
                <span style={{ width: 6, height: 6, borderRadius: '50%', backgroundColor: RED, marginTop: 7, flexShrink: 0 }} />
                <p style={{ fontFamily: F, fontSize: 14, color: '#3C4043', lineHeight: 1.5, margin: 0 }}>{p}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section style={{ padding: '48px 24px 24px' }}>
        <h2 style={{ fontFamily: F, fontSize: 22, fontWeight: 800, color: '#000', textAlign: 'center', marginBottom: 28, letterSpacing: '-0.02em' }}>How BeanAI handles it</h2>
        <div className="grid grid-cols-1 md:grid-cols-3" style={{ gap: 12, maxWidth: 880, margin: '0 auto' }}>
          {s.steps.map((st, i) => (
            <motion.div key={st.n} style={{ border: '0.5px solid rgba(0,0,0,0.85)', borderRadius: 12, padding: '22px 24px', backgroundColor: '#FFF' }}
              initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08 }}>
              <span style={{ fontFamily: 'monospace', fontSize: 12, fontWeight: 700, color: A }}>{st.n}</span>
              <h3 style={{ fontFamily: F, fontSize: 15, fontWeight: 700, color: '#000', margin: '8px 0 6px' }}>{st.title}</h3>
              <p style={{ fontFamily: F, fontSize: 13.5, color: '#5F6368', lineHeight: 1.55 }}>{st.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Example verdict */}
      <section style={{ padding: '24px 24px 80px' }}>
        <motion.div style={{ maxWidth: 560, margin: '0 auto', border: `0.5px solid ${A}`, borderRadius: 14, overflow: 'hidden', boxShadow: `0 12px 36px ${A}22` }}
          initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
          <div style={{ padding: '14px 20px', backgroundColor: A + '12', borderBottom: `0.5px solid ${A}30` }}>
            <p style={{ fontFamily: 'monospace', fontSize: 10, color: '#5F6368', letterSpacing: '0.06em', margin: 0 }}>EXAMPLE</p>
            <p style={{ fontFamily: F, fontSize: 15, fontWeight: 700, color: '#000', margin: '4px 0 0' }}>{s.example.q}</p>
          </div>
          <div style={{ padding: '18px 20px', display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ width: 30, height: 30, borderRadius: '50%', backgroundColor: GREEN, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#FFF', flexShrink: 0 }}><Check size={16} /></div>
            <p style={{ fontFamily: F, fontSize: 14, color: '#202124', margin: 0, flex: 1 }}>{s.example.verdict}</p>
            <span style={{ fontFamily: 'monospace', fontSize: 12, fontWeight: 700, color: GREEN, backgroundColor: GREEN + '15', borderRadius: 90, padding: '4px 10px' }}>{s.example.confidence}</span>
          </div>
        </motion.div>

        <div style={{ display: 'flex', justifyContent: 'center', marginTop: 28 }}>
          <Link href="/app" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, backgroundColor: BLUE, color: '#FFF', border: '0.5px solid rgba(0,0,0,0.75)', borderRadius: 90, padding: '12px 26px', fontSize: 14, fontWeight: 600, textDecoration: 'none', fontFamily: F }}>
            Try this now <ArrowRight size={14} />
          </Link>
        </div>
      </section>

      <CTA />
      <Footer />
    </MarketingShell>
  )
}
