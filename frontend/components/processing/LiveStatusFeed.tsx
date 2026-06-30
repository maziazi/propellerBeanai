'use client'

import { useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import type { MindKey, MindStatus } from '@/lib/types'
import { MIND_MAP } from '@/lib/minds'

interface StatusEntry {
  id: string
  mindKey: MindKey | null
  message: string
  time: number
}

const STATUS_MESSAGES: Record<MindStatus, string[]> = {
  waiting: ['Standing by...', 'In queue...'],
  analyzing: [
    'Scanning verified sources...',
    'Cross-referencing data...',
    'Processing perspective...',
    'Running inference...',
    'Synthesizing patterns...',
    'Evaluating evidence...',
  ],
  done: ['Analysis complete.', 'Perspective finalized.', 'Done.'],
  error: ['Failed to analyze.'],
}

interface LiveStatusFeedProps {
  entries: StatusEntry[]
}

export function LiveStatusFeed({ entries }: LiveStatusFeedProps) {
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [entries])

  return (
    <div className="w-full h-40 overflow-y-auto rounded-xl p-3 space-y-1.5 font-mono text-xs" style={{ backgroundColor: '#000', border: '0.5px solid rgba(255,255,255,0.12)' }}>
      <AnimatePresence initial={false}>
        {entries.map((entry) => {
          const mind = entry.mindKey ? MIND_MAP[entry.mindKey] : null
          return (
            <motion.div
              key={entry.id}
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2 }}
              className="flex items-start gap-2"
            >
              <span className="shrink-0 pt-0.5" style={{ color: 'rgba(255,255,255,0.3)' }}>
                {new Date(entry.time).toLocaleTimeString('en', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false })}
              </span>
              {mind && (
                <span
                  className="shrink-0 w-1.5 h-1.5 rounded-full mt-1.5"
                  style={{ backgroundColor: mind.accent }}
                />
              )}
              {mind && (
                <span style={{ color: mind.accent }} className="shrink-0 font-bold">
                  [{mind.label}]
                </span>
              )}
              <span style={{ color: 'rgba(255,255,255,0.75)' }}>{entry.message}</span>
            </motion.div>
          )
        })}
      </AnimatePresence>
      <div ref={bottomRef} />
    </div>
  )
}

export type { StatusEntry }
export { STATUS_MESSAGES }
