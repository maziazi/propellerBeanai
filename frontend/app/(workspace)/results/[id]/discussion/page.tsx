'use client'

import { useState, useEffect, use } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { MessageSquare, Network, Zap, Users } from 'lucide-react'
import { BackButton } from '@/components/layout/BackButton'
import { DiscussionTimeline } from '@/components/discussion/DiscussionTimeline'
import { EmergentInsightCard } from '@/components/discussion/EmergentInsightCard'
import { MergeSynthesisCard } from '@/components/discussion/MergeSynthesisCard'
import { ChatInput } from '@/components/discussion/ChatInput'
import { MINDS } from '@/lib/minds'
import {
  MOCK_EMERGENT_INSIGHTS,
  MOCK_MERGE_SYNTHESIS,
  DEMO_QUESTION,
} from '@/lib/mock-data'
import type { DiscussionMessage } from '@/lib/types'
import { cn } from '@/lib/utils'
import { reportToDiscussionMessages, reportToEmergentInsights, reportToMergeSynthesis } from '@/lib/transform'

const COST_PER_MESSAGE = 0.05
const BASE_COST = 0.45

const USER_PARTICIPANT = {
  key: 'user',
  label: 'YOU',
  accent: '#2563EB',
  bg: '#EEF4FF',
  icon: '👤',
  description: 'Your perspective',
}

interface DiscussionPageProps {
  params: Promise<{ id: string }>
  searchParams: Promise<Record<string, string>>
}

export default function DiscussionPage({ params }: DiscussionPageProps) {
  const { id } = use(params)

  // We'll load the report client-side once on mount
  const [report, setReport] = useState<Record<string, unknown> | null>(null)
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    const base = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8000'
    fetch(`${base}/api/report/${id}`, { cache: 'no-store' })
      .then(r => r.ok ? r.json() : null)
      .then(data => { setReport(data); setLoaded(true) })
      .catch(() => setLoaded(true))
  }, [id])

  const question = (report?.topic as string) ?? DEMO_QUESTION
  const initialMessages = report ? reportToDiscussionMessages(report) : []
  const emergentInsights = report ? reportToEmergentInsights(report) : MOCK_EMERGENT_INSIGHTS
  const mergeSynthesis = report ? reportToMergeSynthesis(report) : MOCK_MERGE_SYNTHESIS

  const [messages, setMessages] = useState<DiscussionMessage[]>([])
  const [userMessageCount, setUserMessageCount] = useState(0)
  const [activeMember, setActiveMember] = useState<string | null>(null)

  // Merge initial messages from report when loaded
  const allMessages = [...initialMessages, ...messages]

  const totalAdded = userMessageCount * COST_PER_MESSAGE
  const currentRound = allMessages.reduce((max, m) => Math.max(max, m.round), 1)
  const participants = [...MINDS, USER_PARTICIPANT]

  const handleSend = (msg: DiscussionMessage) => {
    setMessages((prev) => [...prev, msg])
    setUserMessageCount((c) => c + 1)
  }

  return (
    <div className="h-full flex flex-col bg-white overflow-hidden">
      {/* Top bar */}
      <div className="border-b border-border px-8 md:px-16 py-2.5 shrink-0">
        <div className="max-w-[1400px] mx-auto flex items-center justify-between gap-4 flex-wrap">
          <div className="flex items-center gap-3 min-w-0">
            <BackButton href={`/results/${id}`} label="Results" />
            <span className="text-muted font-mono text-xs shrink-0">/</span>
            <p className="text-sm text-slate font-mono truncate max-w-[200px] sm:max-w-sm">
              &ldquo;{question}&rdquo;
            </p>
          </div>
          <div className="flex items-center gap-1 shrink-0">
            <Link href={`/results/${id}`} className="px-3 py-1.5 text-xs font-mono text-slate hover:text-navy transition-colors rounded">
              Results
            </Link>
            <div className="px-3 py-1.5 text-xs font-mono text-navy bg-cream-2 border border-border rounded flex items-center gap-1.5">
              <MessageSquare size={11} />
              Discussion
            </div>
            <Link href={`/results/${id}/graph`} className="px-3 py-1.5 text-xs font-mono text-slate hover:text-navy transition-colors rounded flex items-center gap-1.5">
              <Network size={11} />
              Graph
            </Link>
          </div>
        </div>
      </div>

      {/* Main 3-col layout */}
      <div className="flex-1 flex overflow-hidden max-w-[1400px] w-full mx-auto">

        {/* LEFT — Members list */}
        <div className="w-52 shrink-0 border-r border-border flex-col hidden lg:flex bg-white">
          <div className="px-3 py-2.5 border-b border-border flex items-center gap-2">
            <Users size={11} className="text-muted" />
            <span className="text-[11px] font-mono text-slate">Members</span>
            <span className="ml-auto text-[10px] font-mono text-muted bg-cream px-1.5 py-0.5 rounded-full border border-border">
              {participants.length}
            </span>
          </div>

          <div className="flex-1 overflow-y-auto py-2">
            {participants.map((p) => {
              const isUser = p.key === 'user'
              const msgCount = allMessages.filter((m) => m.from === p.key).length
              const isActive = activeMember === p.key

              return (
                <button
                  key={p.key}
                  onClick={() => setActiveMember(isActive ? null : p.key)}
                  className={cn(
                    'w-full flex items-center gap-2.5 px-3 py-2 text-left transition-colors',
                    isActive ? 'bg-cream' : 'hover:bg-cream',
                  )}
                >
                  <div
                    className="shrink-0 w-8 h-8 rounded-full border-2 flex items-center justify-center text-[10px] font-mono font-bold"
                    style={{
                      backgroundColor: p.bg,
                      borderColor: p.accent,
                      color: p.accent,
                    }}
                  >
                    {p.label.slice(0, 2)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs font-mono font-bold" style={{ color: p.accent }}>
                        {p.label}
                      </span>
                      {isUser && <span className="text-[9px] text-muted">(you)</span>}
                    </div>
                    <p className="text-[10px] text-muted truncate">{p.description}</p>
                  </div>
                  {msgCount > 0 && (
                    <span className="text-[10px] font-mono text-muted shrink-0">{msgCount}</span>
                  )}
                </button>
              )
            })}
          </div>

          {/* Cost breakdown */}
          <div className="border-t border-border p-3 space-y-2">
            <p className="text-[10px] font-mono text-muted uppercase tracking-wider">Session cost</p>
            <div className="space-y-1.5">
              <div className="flex justify-between items-center">
                <span className="text-[11px] font-mono text-slate">Full Analysis</span>
                <span className="text-[11px] font-mono text-slate">${BASE_COST.toFixed(2)}</span>
              </div>
              {userMessageCount > 0 && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="flex justify-between items-center"
                >
                  <span className="text-[11px] font-mono text-slate">
                    Your msgs ({userMessageCount})
                  </span>
                  <span className="text-[11px] font-mono text-gain-accent">
                    +${totalAdded.toFixed(2)}
                  </span>
                </motion.div>
              )}
              <div className="flex justify-between items-center border-t border-border pt-1.5 mt-1">
                <span className="text-xs font-mono font-bold text-navy">Total</span>
                <span className="text-xs font-mono font-bold text-navy">
                  ${(BASE_COST + totalAdded).toFixed(2)}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* CENTER — Chat area */}
        <div className="flex-1 flex flex-col overflow-hidden bg-white">
          <div className="flex-1 overflow-y-auto p-4">
            {!loaded && (
              <div className="text-center py-10 text-slate font-mono text-xs">Loading discussion...</div>
            )}
            <DiscussionTimeline messages={allMessages} autoScroll />

            {emergentInsights.length > 0 && (
              <div className="mt-6 space-y-3">
                <div className="flex items-center gap-3">
                  <div className="h-px flex-1 bg-border" />
                  <span className="text-[10px] font-mono font-bold px-2 flex items-center gap-1" style={{ color: '#16A34A' }}>
                    <Zap size={10} /> EMERGENT INSIGHTS
                  </span>
                  <div className="h-px flex-1 bg-border" />
                </div>
                {emergentInsights.map((insight, i) => (
                  <EmergentInsightCard key={insight.id} insight={insight} index={i} />
                ))}
              </div>
            )}
          </div>

          <div className="shrink-0">
            <ChatInput
              onSend={handleSend}
              totalAdded={totalAdded}
              currentRound={currentRound}
            />
          </div>
        </div>

        {/* RIGHT — Merge synthesis */}
        <div className="w-64 shrink-0 border-l border-border flex-col overflow-y-auto hidden xl:flex bg-white">
          <div className="px-3 py-2.5 border-b border-border">
            <span className="text-[11px] font-mono text-blue font-bold tracking-wider uppercase">Merge Synthesis</span>
          </div>
          <div className="p-3">
            {mergeSynthesis && <MergeSynthesisCard synthesis={mergeSynthesis} />}
          </div>
        </div>

      </div>
    </div>
  )
}
