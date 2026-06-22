'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowRight } from 'lucide-react'
import { useBeanAIStore } from '@/lib/store'
import { generateId } from '@/lib/utils'
import { cn } from '@/lib/utils'

type Model = 'quick' | 'full'

export function HeroInputCard() {
  const [value, setValue] = useState('')
  const [model, setModel] = useState<Model>('quick')
  const router = useRouter()
  const { setQuestion, setAnalysisType, startAnalysis } = useBeanAIStore()

  const handleSubmit = () => {
    if (!value.trim()) return
    const id = generateId()
    setQuestion(value.trim())
    setAnalysisType(model)
    startAnalysis(id)
    router.push('/analyze')
  }

  return (
    <div className="w-full max-w-2xl mx-auto bg-white rounded-2xl border border-border shadow-sm overflow-hidden">
      <textarea
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={(e) => { if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) handleSubmit() }}
        placeholder="Describe your decision, question, or challenge..."
        className="w-full px-5 pt-5 pb-3 text-sm text-navy placeholder:text-muted resize-none outline-none min-h-[100px] leading-relaxed bg-transparent"
        rows={3}
      />
      <div className="flex items-center justify-between gap-3 px-4 pb-4 pt-1 border-t border-border/50">
        {/* Model selector */}
        <div className="flex items-center gap-1.5 p-1 bg-cream rounded-lg">
          <button
            onClick={() => setModel('quick')}
            className={cn(
              'px-3 py-1.5 rounded-md text-xs font-medium transition-all',
              model === 'quick'
                ? 'bg-white text-navy shadow-sm border border-border'
                : 'text-slate hover:text-navy',
            )}
          >
            Quick <span className="text-muted">· $0.10</span>
          </button>
          <button
            onClick={() => setModel('full')}
            className={cn(
              'px-3 py-1.5 rounded-md text-xs font-medium transition-all',
              model === 'full'
                ? 'bg-white text-navy shadow-sm border border-border'
                : 'text-slate hover:text-navy',
            )}
          >
            Full <span className="text-muted">· $0.45</span>
          </button>
        </div>
        {/* Submit */}
        <button
          onClick={handleSubmit}
          disabled={!value.trim()}
          className={cn(
            'flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium transition-all',
            value.trim()
              ? 'bg-blue text-white hover:bg-blue/90 active:scale-95'
              : 'bg-cream text-muted cursor-not-allowed border border-border',
          )}
        >
          Analyze with 6 Minds
          <ArrowRight size={14} />
        </button>
      </div>
    </div>
  )
}
