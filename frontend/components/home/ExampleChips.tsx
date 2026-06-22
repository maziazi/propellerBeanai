'use client'

import { cn } from '@/lib/utils'

const EXAMPLES = [
  'Open a restaurant in Bali',
  'Should I quit my job?',
  'Pivot to B2B SaaS',
  'Launch new product',
]

interface ExampleChipsProps {
  onSelect?: (text: string) => void
  className?: string
}

export function ExampleChips({ onSelect, className }: ExampleChipsProps) {
  return (
    <div className={cn('flex flex-wrap gap-2', className)}>
      {EXAMPLES.map((example) => (
        <button
          key={example}
          onClick={() => onSelect?.(example)}
          className="bg-surface border border-border text-secondary text-xs rounded px-3 py-1.5 hover:border-secondary hover:text-primary transition-colors font-mono"
        >
          {example}
        </button>
      ))}
    </div>
  )
}
