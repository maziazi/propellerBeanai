'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { Header } from '@/components/layout/Header'
import { MindProgressList } from '@/components/processing/MindProgressList'
import { LiveStatusFeed, type StatusEntry } from '@/components/processing/LiveStatusFeed'
import { useBeanAIStore } from '@/lib/store'
import { MINDS } from '@/lib/minds'
import type { MindKey } from '@/lib/types'
import { generateId } from '@/lib/utils'

const MERGE_MIND = MINDS.find(m => m.key === 'merge')!
const OTHER_MINDS = MINDS.filter(m => m.key !== 'merge')

const ANALYSIS_MESSAGES: Record<MindKey, string[]> = {
  fact: [
    'Scanning verified databases...',
    'Cross-referencing Gartner & Statista...',
    'Validating market figures...',
    'FACT analysis complete.',
  ],
  feel: [
    'Reading emotional signal...',
    'Processing intuition layer...',
    'Evaluating gut response...',
    'FEEL analysis complete.',
  ],
  risk: [
    'Mapping risk surface...',
    'Identifying blind spots...',
    'Stress-testing assumptions...',
    'RISK analysis complete.',
  ],
  gain: [
    'Scanning opportunity space...',
    'Calculating upside potential...',
    'Mapping partner channels...',
    'GAIN analysis complete.',
  ],
  wild: [
    'Running contrarian scenarios...',
    'Exploring unexpected angles...',
    'Generating creative alternatives...',
    'WILD analysis complete.',
  ],
  merge: [
    'Synthesizing all perspectives...',
    'Detecting convergence patterns...',
    'Calculating confidence score...',
    'MERGE synthesis complete.',
  ],
}

export default function AnalyzePage() {
  const router = useRouter()
  const { currentQuestion, analysisId, analysisType, mindProgress, updateMindProgress, setAnalysisDone } = useBeanAIStore()
  const [entries, setEntries] = useState<StatusEntry[]>([])
  const [countdown, setCountdown] = useState(analysisType === 'quick' ? 28 : 150)
  const isRunning = useRef(false)

  // Reset countdown if analysisType changes (e.g. store updated after mount)
  useEffect(() => {
    setCountdown(analysisType === 'quick' ? 28 : 150)
  }, [analysisType])

  // Redirect to home if navigated here without a question
  useEffect(() => {
    if (!currentQuestion) router.replace('/')
  }, [currentQuestion, router])

  const addEntry = useCallback((mindKey: MindKey | null, message: string) => {
    setEntries((prev) => [
      ...prev,
      { id: generateId(), mindKey, message, time: Date.now() },
    ])
  }, [])

  useEffect(() => {
    if (!currentQuestion) return
    if (isRunning.current) return
    isRunning.current = true

    addEntry(null, `Starting ${analysisType === 'quick' ? 'Quick Scan' : 'Full Analysis'}...`)

    const runMind = async (mind: typeof MINDS[0], delay: number) => {
      await new Promise((r) => setTimeout(r, delay))
      updateMindProgress(mind.key, 'analyzing')
      addEntry(mind.key, ANALYSIS_MESSAGES[mind.key][0])

      const msgs = ANALYSIS_MESSAGES[mind.key].slice(1, -1)
      for (const msg of msgs) {
        await new Promise((r) => setTimeout(r, 1200 + Math.random() * 800))
        addEntry(mind.key, msg)
      }

      await new Promise((r) => setTimeout(r, 1000 + Math.random() * 500))
      updateMindProgress(mind.key, 'done')
      addEntry(mind.key, ANALYSIS_MESSAGES[mind.key][ANALYSIS_MESSAGES[mind.key].length - 1])
    }

    const runAll = async () => {
      const promises = OTHER_MINDS.map((mind, i) => runMind(mind, i * 800))
      await Promise.all(promises)

      // Merge always runs last
      await runMind(MERGE_MIND, 500)

      addEntry(null, 'All minds done. Preparing report...')
      setAnalysisDone()

      await new Promise((r) => setTimeout(r, 1200))
      router.push(`/results/${analysisId ?? 'demo-001'}`)
    }

    runAll()
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => Math.max(0, prev - 1))
    }, 1000)
    return () => clearInterval(timer)
  }, [])

  if (!currentQuestion) return null

  return (
    <div className="min-h-screen flex flex-col bg-cream">
      <Header />

      <main className="flex-1 flex flex-col items-center px-8 md:px-16 py-12 pt-28">
        <motion.div
          className="w-full max-w-xl space-y-8"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          {/* Section label */}
          <div className="border-t border-border pt-4">
            <span className="font-mono text-xs text-muted uppercase tracking-widest">Analysis in progress</span>
          </div>

          {/* Header */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <p className="text-xs font-mono text-slate uppercase tracking-wider">
                {analysisType === 'quick' ? 'Quick Scan' : 'Full Analysis'}
              </p>
              <span className="text-xs font-mono text-muted">
                ~{countdown}s remaining
              </span>
            </div>
            <p className="font-serif text-xl text-navy font-bold leading-tight truncate">
              &ldquo;{currentQuestion}&rdquo;
            </p>
          </div>

          {/* Progress */}
          <div className="bg-white border border-border rounded-2xl p-5">
            <p className="text-xs font-mono text-muted uppercase tracking-widest mb-4">Mind progress</p>
            <MindProgressList progress={mindProgress} />
          </div>

          {/* Live feed */}
          <div>
            <p className="text-xs font-mono text-muted uppercase tracking-widest mb-3">Live activity</p>
            <LiveStatusFeed entries={entries} />
          </div>

          {/* Skeleton preview */}
          <div className="space-y-3 opacity-40">
            <p className="text-xs font-mono text-muted">Report preview loading...</p>
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="h-12 rounded-xl border border-border bg-white animate-pulse" />
            ))}
          </div>
        </motion.div>
      </main>
    </div>
  )
}
