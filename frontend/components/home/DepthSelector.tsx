'use client'

import { cn } from '@/lib/utils'
import { useBeanAIStore } from '@/lib/store'
import { Zap, BarChart3 } from 'lucide-react'

const OPTIONS = [
  {
    key: 'quick' as const,
    label: 'Quick Scan',
    price: '$0.10',
    time: '~30s',
    icon: Zap,
    description: 'Core insights from all 6 minds. Best for initial exploration.',
    features: ['6 mind perspectives', 'Top 3 sources each', 'Merge synthesis'],
  },
  {
    key: 'full' as const,
    label: 'Full Analysis',
    price: '$0.45',
    time: '~2–3m',
    icon: BarChart3,
    description: 'Deep multi-round discussion, emergent insights, knowledge graph.',
    features: ['Everything in Quick', 'Mind-to-mind discussion', 'Emergent insights', 'Knowledge graph'],
  },
]

export function DepthSelector() {
  const { analysisType, setAnalysisType } = useBeanAIStore()

  return (
    <div className="grid grid-cols-2 gap-3 w-full">
      {OPTIONS.map((opt) => {
        const Icon = opt.icon
        const selected = analysisType === opt.key
        return (
          <button
            key={opt.key}
            onClick={() => setAnalysisType(opt.key)}
            className={cn(
              'text-left p-4 rounded border transition-all duration-150',
              selected
                ? 'border-primary bg-surface text-primary'
                : 'border-border bg-canvas text-secondary hover:border-secondary',
            )}
          >
            <div className="flex items-start justify-between mb-2">
              <div className="flex items-center gap-2">
                <Icon
                  size={13}
                  className={selected ? 'text-primary' : 'text-muted'}
                />
                <span className={cn('text-xs font-mono font-bold', selected ? 'text-primary' : 'text-secondary')}>
                  {opt.label}
                </span>
              </div>
              <span
                className={cn(
                  'text-xs font-mono font-bold',
                  selected ? 'text-primary' : 'text-muted',
                )}
              >
                {opt.price}
              </span>
            </div>
            <p className="text-xs text-secondary leading-relaxed mb-2">{opt.description}</p>
            <ul className="space-y-0.5">
              {opt.features.map((f) => (
                <li key={f} className="text-xs text-secondary flex items-center gap-1.5">
                  <span className={selected ? 'text-primary' : 'text-muted'}>▸</span>
                  {f}
                </li>
              ))}
            </ul>
          </button>
        )
      })}
    </div>
  )
}
