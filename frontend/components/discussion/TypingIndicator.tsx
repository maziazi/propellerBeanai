'use client'

import { motion } from 'framer-motion'
import type { DiscussionMessage } from '@/lib/types'
import { MIND_MAP } from '@/lib/minds'

/** "[HAT] → [HAT] is typing…" bubble with animated dots. */
export function TypingIndicator({ message }: { message: DiscussionMessage }) {
  const mind = MIND_MAP[message.from as string]
  const toMind = message.to !== 'all' ? MIND_MAP[message.to as string] : null
  if (!mind) return null

  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      className="flex items-end gap-2"
    >
      <div className="shrink-0 mb-0.5">
        <div
          className="w-8 h-8 rounded-full border flex items-center justify-center text-[10px] font-mono font-bold"
          style={{ backgroundColor: mind.bg, borderColor: `${mind.accent}55`, color: mind.accent }}
        >
          {mind.label.slice(0, 2)}
        </div>
      </div>

      <div className="flex flex-col gap-1 max-w-[72%]">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-xs font-mono font-bold" style={{ color: mind.accent }}>{mind.label}</span>
          {toMind && (
            <span className="text-[10px] font-mono text-muted">
              → <span style={{ color: toMind.accent }}>{toMind.label}</span>
            </span>
          )}
          <span className="text-[10px] font-mono text-muted italic">is typing…</span>
        </div>

        <div
          className="rounded-2xl rounded-bl-sm px-4 py-3 border inline-flex items-center gap-1.5 w-fit"
          style={{ backgroundColor: mind.bg, borderColor: `${mind.accent}33` }}
        >
          {[0, 1, 2].map((i) => (
            <motion.span
              key={i}
              className="block w-1.5 h-1.5 rounded-full"
              style={{ backgroundColor: mind.accent }}
              animate={{ opacity: [0.3, 1, 0.3], y: [0, -2, 0] }}
              transition={{ duration: 0.9, repeat: Infinity, delay: i * 0.15, ease: 'easeInOut' }}
            />
          ))}
        </div>
      </div>
    </motion.div>
  )
}
