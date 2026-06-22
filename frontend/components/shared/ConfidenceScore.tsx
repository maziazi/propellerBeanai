'use client'

import { cn } from '@/lib/utils'

interface ConfidenceScoreProps {
  value: number
  size?: 'sm' | 'md' | 'lg'
  showBar?: boolean
  className?: string
}

function getColor(value: number): string {
  if (value >= 75) return '#16A34A'
  if (value >= 50) return '#D97706'
  return '#DC2626'
}

export function ConfidenceScore({ value, size = 'md', showBar = true, className }: ConfidenceScoreProps) {
  const color = getColor(value)
  const clamped = Math.min(100, Math.max(0, value))

  const textSizes = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-2xl',
  }

  return (
    <div className={cn('flex flex-col gap-1', className)}>
      <div className="flex items-center gap-2">
        <span
          className={cn('font-mono font-bold', textSizes[size])}
          style={{ color }}
        >
          {clamped}%
        </span>
        <span className="text-muted text-xs font-mono">confidence</span>
      </div>
      {showBar && (
        <div className="h-1 rounded-full bg-border overflow-hidden" style={{ width: size === 'lg' ? '160px' : '100px' }}>
          <div
            className="h-full rounded-full transition-all duration-700 ease-out"
            style={{ width: `${clamped}%`, backgroundColor: color }}
          />
        </div>
      )}
    </div>
  )
}
