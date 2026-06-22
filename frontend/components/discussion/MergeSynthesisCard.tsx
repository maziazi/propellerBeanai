'use client'

import { motion } from 'framer-motion'
import type { MergeSynthesis } from '@/lib/types'
import { ConfidenceScore } from '@/components/shared/ConfidenceScore'
import { CheckCircle } from 'lucide-react'

interface MergeSynthesisCardProps {
  synthesis: MergeSynthesis
}

const VERDICT_STYLES: Record<string, { label: string; color: string; bg: string }> = {
  GO:    { label: 'GO',    color: '#16A34A', bg: '#F0FDF4' },
  WAIT:  { label: 'WAIT',  color: '#D97706', bg: '#FFFBEB' },
  NO:    { label: 'NO',    color: '#DC2626', bg: '#FEF2F2' },
  MIXED: { label: 'MIXED', color: '#64748B', bg: '#F1F5F9' },
}

export function MergeSynthesisCard({ synthesis }: MergeSynthesisCardProps) {
  const verdict = VERDICT_STYLES[synthesis.verdict]

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="sticky top-20 rounded-2xl border-2 border-blue bg-blue-soft p-5 space-y-4"
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-mono text-blue font-bold mb-1">MERGE SYNTHESIS</p>
          <div
            className="inline-flex items-center px-3 py-1 rounded-lg font-mono font-bold text-lg border"
            style={{ color: verdict.color, backgroundColor: verdict.bg, borderColor: `${verdict.color}33` }}
          >
            {verdict.label}
          </div>
        </div>
        <ConfidenceScore value={synthesis.confidence} size="md" showBar />
      </div>

      <p className="text-sm text-slate leading-relaxed">{synthesis.content}</p>

      <div>
        <p className="text-xs font-mono text-muted mb-2">Recommended actions</p>
        <ul className="space-y-2">
          {synthesis.actions.map((action, i) => (
            <li key={i} className="flex items-start gap-2 text-xs text-slate">
              <CheckCircle size={12} style={{ color: '#16A34A' }} className="shrink-0 mt-0.5" />
              <span>{action}</span>
            </li>
          ))}
        </ul>
      </div>
    </motion.div>
  )
}
