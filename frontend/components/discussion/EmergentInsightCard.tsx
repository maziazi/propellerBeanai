'use client'

import { motion } from 'framer-motion'
import type { EmergentInsight } from '@/lib/types'
import { MindBadge } from '@/components/shared/MindBadge'

interface EmergentInsightCardProps {
  insight: EmergentInsight
  index: number
}

export function EmergentInsightCard({ insight, index }: EmergentInsightCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.97 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: index * 0.1, duration: 0.4 }}
      className="emergent-glow rounded-xl border border-wild-accent/20 bg-wild-bg p-4"
      style={{ borderColor: '#16A34A33', backgroundColor: '#F0FDF4' }}
    >
      <div className="flex items-start gap-3">
        <div className="w-2 h-2 rounded-full mt-1.5 shrink-0" style={{ backgroundColor: '#16A34A' }} />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5 mb-2 flex-wrap">
            <span className="text-xs font-mono font-bold" style={{ color: '#16A34A' }}>EMERGENT</span>
            <span className="text-xs text-muted font-mono">—</span>
            {insight.involvedMinds.map((mk) => (
              <MindBadge key={mk} mindKey={mk} size="sm" />
            ))}
          </div>
          <p className="text-sm text-slate leading-relaxed">{insight.content}</p>
        </div>
      </div>
    </motion.div>
  )
}
