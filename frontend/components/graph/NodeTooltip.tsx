'use client'

import type { GraphNode } from '@/lib/types'
import { MIND_MAP } from '@/lib/minds'
import { cn } from '@/lib/utils'

interface NodeTooltipProps {
  node: GraphNode
  visible: boolean
  x: number
  y: number
}

const TYPE_LABELS: Record<string, string> = {
  initial: 'Initial Question',
  conflict: 'Conflict Point',
  emergent: 'Emergent Insight',
  source: 'Evidence Source',
}

export function NodeTooltip({ node, visible, x, y }: NodeTooltipProps) {
  const mind = node.mindKey ? MIND_MAP[node.mindKey] : null

  if (!visible) return null

  return (
    <div
      className="absolute z-50 pointer-events-none"
      style={{ left: x + 12, top: y - 8 }}
    >
      <div className="bg-surface border border-border rounded-lg px-3 py-2 shadow-xl min-w-[160px] max-w-[240px]">
        <p className="text-xs font-mono text-primary font-bold mb-1">{node.label}</p>
        <div className="flex items-center gap-2">
          <span className="text-xs font-mono text-secondary">{TYPE_LABELS[node.type]}</span>
          {mind && (
            <span
              className="text-xs font-mono font-bold"
              style={{ color: mind.accent }}
            >
              {mind.label}
            </span>
          )}
        </div>
      </div>
    </div>
  )
}
