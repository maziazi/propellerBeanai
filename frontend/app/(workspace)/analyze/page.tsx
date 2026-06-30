'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { LiveStatusFeed, type StatusEntry } from '@/components/processing/LiveStatusFeed'
import { useBeanAIStore } from '@/lib/store'
import { MINDS, MIND_MAP } from '@/lib/minds'
import type { MindKey, MindStatus } from '@/lib/types'
import { generateId } from '@/lib/utils'
import { postAnalyze, getStatus } from '@/lib/api'

const GREEN = '#169F53'
const F = "'TWK Lausanne Pan', var(--font-inter), Inter, -apple-system, sans-serif"

const MERGE_MIND = MINDS.find(m => m.key === 'merge')!
const OTHER_MINDS = MINDS.filter(m => m.key !== 'merge')

const MIND_LABELS: Record<MindKey, string> = {
  fact: 'FACT', feel: 'FEEL', risk: 'RISK', gain: 'GAIN', wild: 'WILD', merge: 'MERGE',
}

const THINK: Record<string, string[]> = {
  fact:  ['Querying Tavily...', 'Verifying claims...', 'Cross-checking sources...', '3 sources found', 'Extracting stats...'],
  feel:  ['Reading emotional tone...', 'Gut signal: conflicted', 'Intuition pattern: cautious', 'Emotional weight: high'],
  risk:  ['Scanning blind spots...', 'Assumption flagged', 'Worst-case analysis...', "Devil's advocate: on"],
  gain:  ['Upside analysis...', 'Opportunity window open', 'Moat: behavioral data', 'TAM identified'],
  wild:  ['Contrarian path found...', 'Alternative scenario...', 'Wild card emerging', 'Unexpected angle: active'],
  merge: ['Reading all minds...', 'Conflict: RISK vs GAIN', 'Resolving debate...', 'Confidence score: calculating'],
}

// ── Single mind card ──────────────────────────────────────────────────────────
function MindCard({ mindKey, status, index }: { mindKey: MindKey; status: MindStatus; index: number }) {
  const mind = MIND_MAP[mindKey]
  const [fragIdx, setFragIdx] = useState(0)
  const isWaiting   = status === 'waiting'
  const isAnalyzing = status === 'analyzing'
  const isDone      = status === 'done'
  const isError     = status === 'error'

  useEffect(() => {
    if (!isAnalyzing) return
    const iv = setInterval(() => {
      setFragIdx(p => (p + 1) % THINK[mindKey].length)
    }, 2000)
    return () => clearInterval(iv)
  }, [isAnalyzing, mindKey])

  const fragment = THINK[mindKey][fragIdx]

  const borderLeft = (isAnalyzing || isDone) ? `3px solid ${mind.accent}` : '3px solid rgba(0,0,0,0.08)'
  const borderOuter = isDone
    ? `0.5px solid ${mind.accent}40`
    : isAnalyzing
    ? `0.5px solid ${mind.accent}30`
    : '0.5px solid rgba(0,0,0,0.08)'

  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.08, duration: 0.35 }}
      style={{
        borderRadius: 12,
        border: borderOuter,
        borderLeft,
        backgroundColor: isDone ? mind.bg : '#FFFFFF',
        padding: '16px 18px',
        transition: 'background-color 0.4s ease, border 0.3s ease',
        boxShadow: isAnalyzing ? `0 0 0 1px ${mind.accent}20, 0 4px 16px ${mind.accent}12` : 'none',
        minHeight: 112,
        display: 'flex',
        flexDirection: 'column',
        gap: 8,
      }}
    >
      {/* Top row: label + status dot */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <span style={{
          fontFamily: 'monospace',
          fontSize: 10,
          fontWeight: 700,
          padding: '2px 8px',
          borderRadius: 90,
          backgroundColor: (isAnalyzing || isDone) ? mind.accent : 'rgba(0,0,0,0.06)',
          color: (isAnalyzing || isDone) ? (mind.label === 'GAIN' ? '#000' : '#fff') : '#9AA0A6',
          transition: 'all 0.3s ease',
        }}>
          {mind.label}
        </span>

        {isDone && (
          <motion.span
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            style={{ fontSize: 13, color: GREEN }}
          >
            ✓
          </motion.span>
        )}
        {isAnalyzing && (
          <motion.div
            style={{ width: 7, height: 7, borderRadius: '50%', backgroundColor: mind.accent }}
            animate={{ opacity: [1, 0.25, 1] }}
            transition={{ duration: 0.9, repeat: Infinity }}
          />
        )}
        {isWaiting && (
          <div style={{ width: 7, height: 7, borderRadius: '50%', backgroundColor: 'rgba(0,0,0,0.10)' }} />
        )}
        {isError && <span style={{ fontSize: 11, color: '#E24231' }}>✕</span>}
      </div>

      {/* Description / thinking fragment */}
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', minHeight: 32 }}>
        {isWaiting && (
          <p style={{ fontFamily: 'monospace', fontSize: 11, color: 'rgba(0,0,0,0.25)', margin: 0 }}>
            Standing by...
          </p>
        )}
        {isAnalyzing && (
          <AnimatePresence mode="wait">
            <motion.p
              key={fragment}
              style={{ fontFamily: 'monospace', fontSize: 11, color: mind.accent, margin: 0 }}
              initial={{ opacity: 0, y: 3 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -3 }}
              transition={{ duration: 0.2 }}
            >
              {fragment}
            </motion.p>
          </AnimatePresence>
        )}
        {isDone && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            style={{ fontFamily: F, fontSize: 11, color: '#5F6368', margin: 0 }}
          >
            {mind.description}
          </motion.p>
        )}
        {isError && (
          <p style={{ fontFamily: 'monospace', fontSize: 11, color: '#E24231', margin: 0 }}>Error</p>
        )}
      </div>

      {/* Progress bar */}
      {(isAnalyzing || isDone) && (
        <div style={{ height: 2, backgroundColor: 'rgba(0,0,0,0.06)', borderRadius: 1, overflow: 'hidden' }}>
          {isDone ? (
            <motion.div
              style={{ height: '100%', backgroundColor: mind.accent, borderRadius: 1 }}
              initial={{ width: 0 }}
              animate={{ width: '100%' }}
              transition={{ duration: 0.5 }}
            />
          ) : (
            <motion.div
              style={{ height: '100%', backgroundColor: mind.accent, borderRadius: 1 }}
              animate={{ width: ['15%', '70%', '30%', '88%', '50%'] }}
              transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
            />
          )}
        </div>
      )}
    </motion.div>
  )
}

// ── Page ──────────────────────────────────────────────────────────────────────
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
      const promises = OTHER_MINDS.map(async (mind, i) => {
        await new Promise(r => setTimeout(r, i * 1200))
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

  const doneCount = Object.values(mindProgress).filter(s => s === 'done').length
  const totalMinds = MINDS.length

  return (
    <div style={{ backgroundColor: '#FFFFFF' }}>
      <main style={{ maxWidth: 900, margin: '0 auto', padding: '40px 24px 48px' }}>
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
        >
          {/* ── Topic header ── */}
          <div style={{ borderBottom: '0.5px solid rgba(0,0,0,0.08)', paddingBottom: 20, marginBottom: 32 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
              <span style={{ fontFamily: 'monospace', fontSize: 11, color: '#9AA0A6', letterSpacing: '0.06em' }}>
                {analysisType === 'quick' ? 'QUICK SCAN' : 'FULL ANALYSIS'}
              </span>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <span style={{ fontFamily: 'monospace', fontSize: 11, color: '#9AA0A6' }}>
                  {doneCount}/{totalMinds} minds done
                </span>
                <span style={{
                  fontFamily: 'monospace', fontSize: 11,
                  padding: '2px 10px', borderRadius: 90,
                  backgroundColor: countdown <= 10 ? '#FEE9E7' : '#F5F5F5',
                  color: countdown <= 10 ? '#E24231' : '#5F6368',
                }}>
                  ~{countdown}s
                </span>
              </div>
            </div>
            <h1 style={{ fontFamily: F, fontSize: 20, fontWeight: 900, color: '#000', letterSpacing: '-0.02em', lineHeight: 1.3, margin: 0 }}>
              "{currentQuestion}"
            </h1>
          </div>

          {/* ── 6 Mind cards grid ── */}
          <div className="grid grid-cols-2 md:grid-cols-3" style={{ gap: 10, marginBottom: 24 }}>
            {MINDS.map((mind, i) => (
              <MindCard
                key={mind.key}
                mindKey={mind.key}
                status={mindProgress[mind.key]}
                index={i}
              />
            ))}
          </div>

          {/* ── Overall progress bar ── */}
          <div style={{ marginBottom: 24 }}>
            <div style={{ height: 2, backgroundColor: 'rgba(0,0,0,0.06)', borderRadius: 1, overflow: 'hidden' }}>
              <motion.div
                style={{ height: '100%', backgroundColor: GREEN, borderRadius: 1 }}
                animate={{ width: `${(doneCount / totalMinds) * 100}%` }}
                transition={{ duration: 0.5, ease: 'easeOut' }}
              />
            </div>
          </div>

          {/* ── Terminal log ── */}
          <div>
            <p style={{ fontFamily: 'monospace', fontSize: 10, color: '#9AA0A6', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 8 }}>
              Live activity
            </p>
            <LiveStatusFeed entries={entries} />
          </div>
        </motion.div>
      </main>
    </div>
  )
}
