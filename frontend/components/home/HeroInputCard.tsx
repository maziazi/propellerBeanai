'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowRight, Loader2 } from 'lucide-react'
import { useBeanAIStore } from '@/lib/store'
import { generateId } from '@/lib/utils'
import { cn } from '@/lib/utils'
import { clarify } from '@/lib/api'
import type { ClarifyResponse } from '@/lib/api'

type Model = 'quick' | 'full'

type ClarifyQuestion = ClarifyResponse['questions'][number]

export function HeroInputCard() {
  const [value, setValue] = useState('')
  const [model, setModel] = useState<Model>('quick')
  const router = useRouter()
  const { setQuestion, setAnalysisType, startAnalysis } = useBeanAIStore()

  // Clarification state
  const [clarifying, setClarifying] = useState(false)
  const [clarifyError, setClarifyError] = useState<string | null>(null)
  const [questions, setQuestions] = useState<ClarifyQuestion[]>([])
  const [answers, setAnswers] = useState<Record<number, string>>({})
  const [otherInputs, setOtherInputs] = useState<Record<number, string>>({})
  const [step, setStep] = useState<'input' | 'clarify'>('input')

  const handleSubmit = async () => {
    if (!value.trim()) return
    setClarifyError(null)
    setClarifying(true)

    try {
      const result = await clarify(value.trim())

      if (result.is_vague && result.questions.length > 0) {
        setQuestions(result.questions)
        setAnswers({})
        setOtherInputs({})
        setStep('clarify')
        setClarifying(false)
        return
      }

      // Topic is clear — go straight to analysis
      launchAnalysis(value.trim())
    } catch {
      setClarifyError('Gagal memverifikasi topik. Melanjutkan langsung...')
      launchAnalysis(value.trim())
    } finally {
      setClarifying(false)
    }
  }

  const launchAnalysis = (topic: string) => {
    const id = generateId()
    setQuestion(topic)
    setAnalysisType(model)
    startAnalysis(id)
    router.push('/analyze')
  }

  const handleClarifySubmit = () => {
    // Build context string from answers
    const contextParts: string[] = []
    for (let i = 0; i < questions.length; i++) {
      const q = questions[i]
      const ans = answers[i]
      if (!ans) continue
      if (ans === 'other') {
        const custom = otherInputs[i]?.trim()
        if (custom) contextParts.push(`${q.question}: ${custom}`)
      } else {
        contextParts.push(`${q.question}: ${ans}`)
      }
    }
    const context = contextParts.join('; ')
    const finalTopic = context ? `${value.trim()} — ${context}` : value.trim()
    launchAnalysis(finalTopic)
  }

  const allAnswered = questions.every((_, i) => {
    const ans = answers[i]
    if (!ans) return false
    if (ans === 'other') return !!otherInputs[i]?.trim()
    return true
  })

  if (step === 'clarify') {
    return (
      <div className="w-full max-w-2xl mx-auto bg-white rounded-2xl border border-border shadow-sm overflow-hidden">
        <div className="px-5 pt-5 pb-4 border-b border-border/50">
          <p className="text-xs font-mono text-muted uppercase tracking-widest mb-1">Clarification needed</p>
          <p className="text-sm text-slate leading-snug truncate">&ldquo;{value}&rdquo;</p>
        </div>

        <div className="px-5 py-4 space-y-5 max-h-80 overflow-y-auto">
          {questions.map((q, qi) => (
            <div key={qi} className="space-y-2">
              <p className="text-sm text-navy font-medium">{q.question}</p>
              <div className="flex flex-wrap gap-2">
                {q.options.map((opt) => {
                  const isSelected = answers[qi] === opt.value
                  return (
                    <button
                      key={opt.value}
                      onClick={() => {
                        setAnswers(prev => ({ ...prev, [qi]: opt.value }))
                        if (opt.value !== 'other') {
                          setOtherInputs(prev => { const n = { ...prev }; delete n[qi]; return n })
                        }
                      }}
                      className={cn(
                        'px-3 py-1.5 rounded-lg text-xs font-mono transition-all border',
                        isSelected
                          ? 'bg-blue text-white border-blue'
                          : 'bg-cream text-slate border-border hover:border-blue/40',
                      )}
                    >
                      {opt.label}
                    </button>
                  )
                })}
              </div>
              {answers[qi] === 'other' && (
                <input
                  type="text"
                  placeholder="Ketik jawaban Anda..."
                  value={otherInputs[qi] ?? ''}
                  onChange={e => setOtherInputs(prev => ({ ...prev, [qi]: e.target.value }))}
                  className="w-full px-3 py-2 rounded-lg border border-border text-sm text-navy outline-none focus:border-blue/60 bg-cream"
                />
              )}
            </div>
          ))}
        </div>

        <div className="flex items-center justify-between gap-3 px-4 pb-4 pt-3 border-t border-border/50">
          <button
            onClick={() => setStep('input')}
            className="text-xs font-mono text-muted hover:text-slate transition-colors"
          >
            ← Back
          </button>
          <button
            onClick={handleClarifySubmit}
            disabled={!allAnswered}
            className={cn(
              'flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium transition-all',
              allAnswered
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
      {clarifyError && (
        <p className="px-5 pb-2 text-xs text-red-500">{clarifyError}</p>
      )}
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
          disabled={!value.trim() || clarifying}
          className={cn(
            'flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium transition-all',
            value.trim() && !clarifying
              ? 'bg-blue text-white hover:bg-blue/90 active:scale-95'
              : 'bg-cream text-muted cursor-not-allowed border border-border',
          )}
        >
          {clarifying ? (
            <>
              <Loader2 size={14} className="animate-spin" />
              Checking...
            </>
          ) : (
            <>
              Analyze with 6 Minds
              <ArrowRight size={14} />
            </>
          )}
        </button>
      </div>
    </div>
  )
}
