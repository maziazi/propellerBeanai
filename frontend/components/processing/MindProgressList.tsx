'use client'

import { MINDS } from '@/lib/minds'
import type { MindKey, MindStatus } from '@/lib/types'
import { MindProgressBar } from './MindProgressBar'
import { motion } from 'framer-motion'

interface MindProgressListProps {
  progress: Record<MindKey, MindStatus>
}

export function MindProgressList({ progress }: MindProgressListProps) {
  return (
    <div className="w-full space-y-4">
      {MINDS.map((mind, i) => (
        <motion.div
          key={mind.key}
          initial={{ opacity: 0, x: -8 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: i * 0.05, duration: 0.3 }}
        >
          <MindProgressBar
            mindKey={mind.key}
            status={progress[mind.key]}
          />
        </motion.div>
      ))}
    </div>
  )
}
