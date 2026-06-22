import type { Source } from '@/lib/types'
import { cn } from '@/lib/utils'

interface SourceBadgeProps {
  source: Source
  className?: string
}

export function SourceBadge({ source, className }: SourceBadgeProps) {
  return (
    <a
      href={source.url}
      target="_blank"
      rel="noopener noreferrer"
      className={cn(
        'inline-flex items-center gap-1 text-xs font-mono px-2 py-0.5 rounded border transition-colors',
        'text-slate border-border hover:text-navy hover:border-muted bg-white',
        className,
      )}
    >
      <span>{source.title}</span>
      <span className="text-muted">↗</span>
      {source.verified && (
        <span style={{ color: '#16A34A' }}>✓</span>
      )}
    </a>
  )
}
