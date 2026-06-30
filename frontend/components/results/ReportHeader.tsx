import { MonoText } from '@/components/shared/MonoText'
import { ConfidenceScore } from '@/components/shared/ConfidenceScore'
import { Clock, Hash } from 'lucide-react'

interface ReportHeaderProps {
  question: string
  reportId: string
  confidence: number
  type: 'quick' | 'full'
  createdAt: number
}

export function ReportHeader({ question, reportId, confidence, type, createdAt }: ReportHeaderProps) {
  const date = new Date(createdAt)
  const dateStr = date.toLocaleDateString('en', { month: 'short', day: 'numeric', year: 'numeric' })
  const timeStr = date.toLocaleTimeString('en', { hour: '2-digit', minute: '2-digit', hour12: false })

  return (
    <div className="space-y-5">
      <div>
        <div className="flex items-center gap-2 mb-3">
          <span className="font-mono text-xs text-muted uppercase tracking-widest">
            {type === 'quick' ? 'Quick Scan' : 'Full Analysis'}
          </span>
        </div>
        <h1 className="font-sans text-2xl md:text-3xl font-black text-navy leading-tight tracking-tight">{question}</h1>
      </div>

      <div className="flex flex-wrap items-center gap-1 pt-4 border-t border-border">
        <ConfidenceScore value={confidence} size="md" showBar />
        <span className="text-muted font-mono text-xs mx-2">·</span>
        <div className="flex items-center gap-1.5 font-mono text-xs text-muted">
          <Clock size={11} />
          <span>{dateStr} at {timeStr}</span>
        </div>
        <span className="text-muted font-mono text-xs mx-2">·</span>
        <div className="flex items-center gap-1.5 font-mono text-xs text-muted">
          <Hash size={11} />
          <MonoText className="text-xs text-muted">{reportId}</MonoText>
        </div>
      </div>
    </div>
  )
}
