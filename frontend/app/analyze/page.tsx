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
import { postAnalyze, getStatus } from '@/lib/api'

const MERGE_MIND = MINDS.find(m => m.key === 'merge')!
const OTHER_MINDS = MINDS.filter(m => m.key !== 'merge')

const MIND_LABELS: Record<MindKey, string> = {
  fact: 'FACT', feel: 'FEEL', risk: 'RISK', gain: 'GAIN', wild: 'WILD', merge: 'MERGE',
}

export default function AnalyzePage() {
  const router = useRouter()
  const { currentQuestion, analysisId, analysisType, mindProgress, updateMindProgress, setAnalysisDone, startAnalysis } = useBeanAIStore()
  const [entries, setEntries] = useState<StatusEntry[]>([])
  const [countdown, setCountdown] = useState(analysisType === 'quick' ? 35 : 160)
  const isRunning = useRef(false)
  const jobIdRef = useRef<string | null>(analysisId)

  useEffect(() => {
    setCountdown(analysisType === 'quick' ? 35 : 160)
  }, [analysisType])

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

    const service = analysisType === 'full' ? 'full-prism' : 'quick-scan'
    addEntry(null, `Starting ${analysisType === 'quick' ? 'Quick Scan' : 'Full Analysis'}...`)

    const animateMinds = async () => {
      const delays = OTHER_MINDS.map((_, i) => i * 1200)
      const promises = OTHER_MINDS.map(async (mind, i) => {
        await new Promise(r => setTimeout(r, delays[i]))
        updateMindProgress(mind.key, 'analyzing')
        addEntry(mind.key, `${MIND_LABELS[mind.key]} analysis running...`)
      })
      await Promise.all(promises)
    }

    const run = async () => {
      try {
        const { job_id } = await postAnalyze(currentQuestion, service)
        jobIdRef.current = job_id
        startAnalysis(job_id)

        addEntry(null, `Job started — id: ${job_id.slice(0, 8)}...`)
        animateMinds()

        // Poll for completion
        let done = false
        while (!done) {
          await new Promise(r => setTimeout(r, 2500))
          const st = await getStatus(job_id)

          if (st.status === 'done') {
            done = true
          } else if (st.status === 'failed') {
            addEntry(null, `Analysis failed: ${st.error ?? 'unknown error'}`)
            return
          }
        }

        // Mark all minds done
        for (const mind of [...OTHER_MINDS, MERGE_MIND]) {
          updateMindProgress(mind.key, 'done')
          addEntry(mind.key, `${MIND_LABELS[mind.key]} complete.`)
        }

        addEntry(null, 'All minds done. Preparing report...')
        setAnalysisDone()

        await new Promise(r => setTimeout(r, 800))
        router.push(`/results/${job_id}`)
      } catch (err) {
        addEntry(null, `Error: ${err instanceof Error ? err.message : String(err)}`)
      }
    }

    run()
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
          <div className="border-t border-border pt-4">
            <span className="font-mono text-xs text-muted uppercase tracking-widest">Analysis in progress</span>
          </div>

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

          <div className="bg-white border border-border rounded-2xl p-5">
            <p className="text-xs font-mono text-muted uppercase tracking-widest mb-4">Mind progress</p>
            <MindProgressList progress={mindProgress} />
          </div>

          <div>
            <p className="text-xs font-mono text-muted uppercase tracking-widest mb-3">Live activity</p>
            <LiveStatusFeed entries={entries} />
          </div>

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
