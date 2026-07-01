import { MonoText } from '@/components/shared/MonoText'
import { ConfidenceScore } from '@/components/shared/ConfidenceScore'
import { Clock, Hash } from 'lucide-react'

export type Verdict = 'GO' | 'WAIT' | 'NO' | 'MIXED'

interface ReportHeaderProps {
  question: string
  reportId: string
  confidence: number
  type: 'quick' | 'full'
  createdAt: number
  verdict: Verdict | null
}

const VERDICT_CONFIG: Record<Verdict, { bg: string; color: string; border: string; label: string }> = {
  GO:    { bg: '#EDFAF3', color: '#169F53', border: 'rgba(22,159,83,0.30)',  label: 'GO'    },
  WAIT:  { bg: '#F5F5F5', color: '#5F6368', border: 'rgba(95,99,104,0.30)', label: 'WAIT'  },
  NO:    { bg: '#FEE9E7', color: '#E24231', border: 'rgba(226,66,49,0.30)', label: 'NO'    },
  MIXED: { bg: '#FFF9E6', color: '#8A5800', border: 'rgba(246,187,20,0.45)', label: 'MIXED' },
}

export function ReportHeader({ question, reportId, confidence, type, createdAt, verdict }: ReportHeaderProps) {
  const date = new Date(createdAt)
  const dateStr = date.toLocaleDateString('en', { month: 'short', day: 'numeric', year: 'numeric' })
  const timeStr = date.toLocaleTimeString('en', { hour: '2-digit', minute: '2-digit', hour12: false })
  const vc = verdict ? VERDICT_CONFIG[verdict] : null

  return (
    <div className="space-y-5">
      <div>
        {/* Type label + verdict badge side by side */}
        <div className="flex items-center justify-between gap-3 mb-3">
          <span className="font-mono text-xs text-muted uppercase tracking-widest">
            {type === 'quick' ? 'Quick Scan' : 'Full Analysis'}
          </span>

          {vc && (
            <span style={{
              fontFamily: 'monospace',
              fontSize: 11,
              fontWeight: 700,
              letterSpacing: '0.10em',
              padding: '4px 14px',
              borderRadius: 90,
              backgroundColor: vc.bg,
              color: vc.color,
              border: `0.5px solid ${vc.border}`,
            }}>
              {vc.label}
            </span>
          )}
        </div>

        <h1 className="font-sans text-2xl md:text-3xl font-black text-navy leading-tight tracking-tight">
          {question}
        </h1>
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
