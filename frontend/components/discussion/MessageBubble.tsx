'use client'

import { motion } from 'framer-motion'
import type { DiscussionMessage } from '@/lib/types'
import { MIND_MAP } from '@/lib/minds'
import { cn } from '@/lib/utils'

interface MessageBubbleProps {
  message: DiscussionMessage
  index: number
}

function formatTime(ts: number) {
  return new Date(ts).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false })
}

function UserBubble({ message, index }: MessageBubbleProps) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 12 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.04, duration: 0.25 }}
      className="flex items-end gap-2 justify-end"
    >
      <div className="flex flex-col items-end gap-1 max-w-[72%]">
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-mono text-muted">{formatTime(message.timestamp)}</span>
          <span className="text-xs font-mono font-bold text-blue">YOU</span>
        </div>
        <div className="bg-blue-soft border border-blue/20 rounded-2xl rounded-br-sm px-4 py-2.5">
          <p className="text-sm text-navy leading-relaxed">{message.content}</p>
        </div>
      </div>
      <div className="shrink-0 w-8 h-8 rounded-full bg-blue-soft border border-blue/30 flex items-center justify-center mb-0.5">
        <span className="text-[9px] font-mono font-bold text-blue">YOU</span>
      </div>
    </motion.div>
  )
}

function MindBubble({ message, index }: MessageBubbleProps) {
  const mind = MIND_MAP[message.from as string]
  const toMind = message.to !== 'all' ? MIND_MAP[message.to as string] : null

  return (
    <motion.div
      initial={{ opacity: 0, x: -12 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.04, duration: 0.25 }}
      className="flex items-end gap-2"
    >
      {/* Avatar */}
      <div className="shrink-0 mb-0.5">
        <div
          className="w-8 h-8 rounded-full border flex items-center justify-center text-[10px] font-mono font-bold"
          style={{ backgroundColor: mind.bg, borderColor: `${mind.accent}55`, color: mind.accent }}
        >
          {mind.label.slice(0, 2)}
        </div>
      </div>

      {/* Bubble */}
      <div className="flex flex-col gap-1 max-w-[72%]">
        {/* Header */}
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-xs font-mono font-bold" style={{ color: mind.accent }}>
            {mind.label}
          </span>
          {toMind && (
            <span className="text-[10px] font-mono text-muted">
              → <span style={{ color: toMind.accent }}>{toMind.label}</span>
            </span>
          )}
          {message.type === 'wildcard' && (
            <span className="text-[10px] font-mono border px-1.5 py-0.5 rounded-full" style={{ color: '#16A34A', borderColor: '#16A34A33' }}>
              wildcard
            </span>
          )}
          <span className="text-[10px] font-mono text-muted ml-auto">{formatTime(message.timestamp)}</span>
        </div>

        {/* Content */}
        <div
          className={cn(
            'rounded-2xl rounded-bl-sm px-4 py-2.5 border',
            message.type === 'wildcard' && 'border-dashed',
          )}
          style={{ backgroundColor: mind.bg, borderColor: `${mind.accent}33` }}
        >
          <p className="text-sm text-slate leading-relaxed">{message.content}</p>
        </div>
      </div>
    </motion.div>
  )
}

export function MessageBubble({ message, index }: MessageBubbleProps) {
  if (message.from === 'user') return <UserBubble message={message} index={index} />
  return <MindBubble message={message} index={index} />
}
