'use client'

import { MIND_MAP } from '@/lib/minds'
import type { MindKey } from '@/lib/types'
import { cn } from '@/lib/utils'

interface MindBadgeProps {
  mindKey: MindKey
  size?: 'sm' | 'md' | 'lg'
  showLabel?: boolean
  className?: string
}

export function MindBadge({ mindKey, size = 'md', showLabel = true, className }: MindBadgeProps) {
  const mind = MIND_MAP[mindKey]
  if (!mind) return null

  const sizeClasses = {
    sm: 'text-xs px-1.5 py-0.5 gap-1',
    md: 'text-xs px-2 py-1 gap-1.5',
    lg: 'text-sm px-3 py-1.5 gap-2',
  }

  return (
    <span
      className={cn(
        'inline-flex items-center rounded font-mono font-bold tracking-wider border',
        sizeClasses[size],
        className,
      )}
      style={{
        color: mind.accent,
        backgroundColor: mind.bg,
        borderColor: `${mind.accent}33`,
      }}
    >
      <span>{mind.icon}</span>
      {showLabel && <span>{mind.label}</span>}
    </span>
  )
}
