'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDown } from 'lucide-react'
import type { MindResult } from '@/lib/types'
import { MIND_MAP } from '@/lib/minds'
import { SourceBadge } from './SourceBadge'
import { cn } from '@/lib/utils'

interface MindPanelProps {
  result: MindResult
}

function renderContent(content: string) {
  const lines = content.split('\n')
  return lines.map((line, i) => {
    if (line.startsWith('**') && line.endsWith('**')) {
      return (
        <p key={i} className="font-bold text-navy mt-3 mb-1">
          {line.slice(2, -2)}
        </p>
      )
    }
    if (line.match(/^\*\*/)) {
      const parts = line.split(/\*\*(.*?)\*\*/g)
      return (
        <p key={i} className="text-sm text-slate leading-relaxed">
          {parts.map((part, j) =>
            j % 2 === 1 ? <strong key={j} className="text-navy font-semibold">{part}</strong> : part
          )}
        </p>
      )
    }
    if (line.startsWith('- ') || line.startsWith('• ')) {
      return (
        <li key={i} className="text-sm text-slate leading-relaxed ml-3 list-none flex gap-2">
          <span className="text-muted shrink-0">—</span>
          <span dangerouslySetInnerHTML={{
            __html: line.slice(2).replace(/\*\*(.*?)\*\*/g, '<strong class="text-navy">$1</strong>')
          }} />
        </li>
      )
    }
    if (line.match(/^\d+\.\s/)) {
      return (
        <p key={i} className="text-sm text-slate leading-relaxed ml-3">
          <span dangerouslySetInnerHTML={{
            __html: line.replace(/\*\*(.*?)\*\*/g, '<strong class="text-navy">$1</strong>')
          }} />
        </p>
      )
    }
    if (!line.trim()) return <div key={i} className="h-2" />
    return (
      <p key={i} className="text-sm text-slate leading-relaxed">
        <span dangerouslySetInnerHTML={{
          __html: line.replace(/\*\*(.*?)\*\*/g, '<strong class="text-navy">$1</strong>')
        }} />
      </p>
    )
  })
}

export function MindPanel({ result }: MindPanelProps) {
  const [isOpen, setIsOpen] = useState(result.isExpanded)
  const mind = MIND_MAP[result.mindKey]

  return (
    <div
      className="rounded-xl overflow-hidden"
      style={{
        backgroundColor: mind.bg,
        border: `0.5px solid rgba(0,0,0,0.10)`,
        borderLeft: `3px solid ${mind.accent}`,
      }}
    >
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between px-4 py-3 hover:bg-black/5 transition-colors"
      >
        <div className="flex items-center gap-3">
          <span className="text-base">{mind.icon}</span>
          <div className="text-left">
            <div className="flex items-center gap-2">
              <span
                className="text-sm font-mono font-bold"
                style={{ color: mind.accent }}
              >
                {mind.label}
              </span>
              <span className="text-xs text-muted">—</span>
              <span className="text-xs text-slate">{mind.description}</span>
            </div>
          </div>
        </div>
        <ChevronDown
          size={14}
          className={cn('text-muted transition-transform duration-200', isOpen && 'rotate-180')}
        />
      </button>

      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: 'easeInOut' }}
            className="overflow-hidden"
          >
            <div className="px-4 pb-4 pt-1 space-y-1 border-t border-border/50">
              <div className="py-2 space-y-1">
                {renderContent(result.content)}
              </div>
              {result.sources.length > 0 && (
                <div className="pt-3 border-t border-border/50">
                  <p className="text-xs text-muted font-mono mb-2 uppercase tracking-widest">Sources</p>
                  <div className="flex flex-wrap gap-2">
                    {result.sources.map((source, i) => (
                      <SourceBadge key={i} source={source} />
                    ))}
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
