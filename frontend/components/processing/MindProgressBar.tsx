'use client'

import { motion } from 'framer-motion'
import type { MindKey, MindStatus } from '@/lib/types'
import { MIND_MAP } from '@/lib/minds'
import { cn } from '@/lib/utils'

interface MindProgressBarProps {
  mindKey: MindKey
  status: MindStatus
}

const STATUS_LABELS: Record<MindStatus, string> = {
  waiting: 'Waiting...',
  analyzing: 'Analyzing...',
  done: 'Done',
  error: 'Error',
}

export function MindProgressBar({ mindKey, status }: MindProgressBarProps) {
  const mind = MIND_MAP[mindKey]
  const isDone = status === 'done'
  const isAnalyzing = status === 'analyzing'
  const isError = status === 'error'

  return (
    <div className="flex items-center gap-3">
      <div
        className="flex items-center gap-1.5 w-20 shrink-0"
        style={{ color: mind.accent }}
      >
        <span className="text-base">{mind.icon}</span>
        <span className="text-xs font-mono font-bold">{mind.label}</span>
      </div>

      <div className="flex-1 h-1 rounded-full bg-border overflow-hidden">
        {isDone && (
          <motion.div
            className="h-full rounded-full"
            style={{ backgroundColor: mind.accent }}
            initial={{ width: 0 }}
            animate={{ width: '100%' }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
          />
        )}
        {isAnalyzing && (
          <motion.div
            className="h-full rounded-full"
            style={{ backgroundColor: mind.accent }}
            animate={{ width: ['20%', '80%', '40%', '90%'] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          />
        )}
        {isError && (
          <div className="h-full w-full rounded-full bg-conflict/40" />
        )}
      </div>

      <span
        className={cn(
          'text-xs font-mono w-20 text-right',
          isDone ? 'text-success' : isError ? 'text-conflict' : 'text-muted',
        )}
      >
        {STATUS_LABELS[status]}
      </span>
    </div>
  )
}
