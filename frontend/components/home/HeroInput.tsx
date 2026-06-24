'use client'

import { useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowRight } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useBeanAIStore } from '@/lib/store'
import { generateId } from '@/lib/utils'

const MAX_CHARS = 500

export function HeroInput() {
  const [value, setValue] = useState('')
  const [focused, setFocused] = useState(false)
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const router = useRouter()
  const { setQuestion, setAnalysisType, startAnalysis } = useBeanAIStore()

  const handleSubmit = () => {
    if (!value.trim()) return
    const id = generateId()
    setQuestion(value.trim())
    setAnalysisType('quick') // HeroInput is quick-scan only; use HeroInputCard for full
    startAnalysis(id)
    router.push('/analyze')
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
      handleSubmit()
    }
  }

  const remaining = MAX_CHARS - value.length
  const isOverLimit = remaining < 0

  return (
    <div
      className={cn(
        'relative w-full rounded border bg-surface transition-all duration-200',
        focused
          ? 'border-[#3D5A80] shadow-[0_0_0_1px_#3D5A8022]'
          : 'border-border hover:border-secondary',
        isOverLimit && 'border-conflict',
      )}
    >
      <textarea
        ref={textareaRef}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        onKeyDown={handleKeyDown}
        placeholder="Describe the decision, question, or topic you want to analyze with 6 minds..."
        className="w-full resize-none bg-transparent px-4 pt-4 pb-14 text-sm text-primary placeholder:text-muted outline-none min-h-[140px] leading-relaxed"
        rows={4}
      />
      <div className="absolute bottom-3 left-4 right-3 flex items-center justify-between">
        <span
          className={cn(
            'text-xs font-mono',
            remaining < 50 ? 'text-warning' : 'text-muted',
            isOverLimit && 'text-conflict',
          )}
        >
          {remaining < 100 ? `${remaining} left` : ''}
        </span>
        <div className="flex items-center gap-3">
          <span className="text-xs text-muted font-mono hidden sm:block">
            ⌘+Enter
          </span>
          <button
            onClick={handleSubmit}
            disabled={!value.trim() || isOverLimit}
            className={cn(
              'inline-flex items-center gap-2 px-4 py-2 rounded text-xs font-mono font-bold transition-all duration-150 border',
              value.trim() && !isOverLimit
                ? 'border-primary text-primary hover:bg-primary hover:text-canvas active:scale-95'
                : 'border-border text-muted cursor-not-allowed',
            )}
          >
            Analyze
            <ArrowRight size={13} />
          </button>
        </div>
      </div>
    </div>
  )
}
