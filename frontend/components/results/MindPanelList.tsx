'use client'

import { motion } from 'framer-motion'
import { MINDS } from '@/lib/minds'
import type { MindResult } from '@/lib/types'
import { MindPanel } from './MindPanel'

interface MindPanelListProps {
  results: Record<string, MindResult | null>
}

export function MindPanelList({ results }: MindPanelListProps) {
  return (
    <div className="space-y-3">
      {MINDS.map((mind, i) => {
        const result = results[mind.key]
        if (!result) return null
        return (
          <motion.div
            key={mind.key}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08, duration: 0.35 }}
          >
            <MindPanel result={result} />
          </motion.div>
        )
      })}
    </div>
  )
}
