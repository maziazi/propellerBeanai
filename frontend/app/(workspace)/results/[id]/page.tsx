import Link from 'next/link'
import { BackButton } from '@/components/layout/BackButton'
import { ReportHeader, type Verdict } from '@/components/results/ReportHeader'
import { MindPanelList } from '@/components/results/MindPanelList'
import { MessageSquare, Network } from 'lucide-react'
import { reportToMindResults, reportConfidence } from '@/lib/transform'

const GREEN = '#169F53'
const F = "'TWK Lausanne Pan', var(--font-inter), Inter, -apple-system, sans-serif"

const ASSESSMENT_TO_VERDICT: Record<string, Verdict> = {
  positive:  'GO',
  negative:  'NO',
  mixed:     'MIXED',
  uncertain: 'WAIT',
}

interface ResultsPageProps {
  params: Promise<{ id: string }>
}

async function fetchReport(id: string) {
  const base = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8000'
  try {
    const res = await fetch(`${base}/api/report/${id}`, { cache: 'no-store' })
    if (!res.ok) return null
    return res.json()
  } catch {
    return null
  }
}

// ── Decision Receipt ──────────────────────────────────────────────────────────
function DecisionReceipt({
  id, topic, verdict, confidence, sha256, generatedAt,
}: {
  id: string
  topic: string
  verdict: Verdict | null
  confidence: number
  sha256: string | null
  generatedAt: string | null
}) {
  if (!sha256) return null

  const dateStr = generatedAt
    ? new Date(generatedAt).toISOString().replace('T', ' · ').slice(0, 20) + ' UTC'
    : '—'

  const verdictLabel = verdict ?? '—'

  const rows: { k: string; v: string; dim?: boolean }[] = [
    { k: 'Topic',   v: `"${topic.length > 48 ? topic.slice(0, 48) + '…' : topic}"` },
    { k: 'Time',    v: dateStr },
    { k: 'Minds',   v: 'FACT  FEEL  RISK  GAIN  WILD  MERGE' },
    { k: 'Verdict', v: verdictLabel },
    { k: 'Score',   v: `${confidence}%` },
    { k: 'SHA-256', v: sha256, dim: true },
  ]

  return (
    <div style={{ marginTop: 8 }}>
      {/* Section label */}
      <p style={{ fontFamily: 'monospace', fontSize: 10, color: '#9AA0A6', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 10 }}>
        Decision Receipt
      </p>

      {/* Terminal card */}
      <div style={{ backgroundColor: '#000', border: `0.5px solid ${GREEN}`, borderRadius: 12, overflow: 'hidden' }}>
        {/* Top bar */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '10px 16px', borderBottom: `0.5px solid rgba(22,159,83,0.20)` }}>
          <div style={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: '#E24231' }} />
          <div style={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: '#F6BB14' }} />
          <div style={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: GREEN }} />
          <span style={{ fontFamily: 'monospace', fontSize: 11, color: 'rgba(255,255,255,0.30)', marginLeft: 10 }}>
            beanai-receipt · {id.slice(0, 8)}
          </span>
        </div>

        {/* Rows */}
        <div style={{ padding: '18px 20px', fontFamily: 'monospace', fontSize: 12, lineHeight: 2.1 }}>
          <p style={{ color: '#FFF', fontWeight: 700, fontSize: 13, marginBottom: 6 }}>BeanAI Decision Receipt</p>
          {rows.map(row => (
            <div key={row.k} style={{ display: 'flex', gap: 16, alignItems: 'baseline' }}>
              <span style={{ color: GREEN, minWidth: 68, flexShrink: 0 }}>{row.k}</span>
              <span style={{
                color: row.dim ? 'rgba(255,255,255,0.40)' : '#FFF',
                wordBreak: row.k === 'SHA-256' ? 'break-all' : 'normal',
                fontSize: row.k === 'SHA-256' ? 11 : 12,
              }}>
                {row.v}
              </span>
            </div>
          ))}
        </div>

        {/* Footer note */}
        <div style={{ padding: '0 20px 16px' }}>
          <p style={{ fontFamily: 'monospace', fontSize: 10, color: 'rgba(255,255,255,0.20)', lineHeight: 1.5 }}>
            SHA-256 of full report output. Same topic → same hash. Tamper-evident.
          </p>
        </div>
      </div>
    </div>
  )
}

// ── Page ──────────────────────────────────────────────────────────────────────
export default async function ResultsPage({ params }: ResultsPageProps) {
  const { id } = await params
  const report = await fetchReport(id)

  const question   = report?.topic ?? 'Analysis result'
  const type       = report?.service === 'full-prism' ? 'full' : 'quick'
  const confidence = report ? reportConfidence(report) : 70

  const blue    = report?.final_blue_hat ?? report?.initial_blue_hat ?? null
  const verdict = blue?.overall_assessment
    ? (ASSESSMENT_TO_VERDICT[blue.overall_assessment] ?? null)
    : null

  const proof       = report?.proof ?? null
  const sha256      = proof?.sha256 ?? null
  const generatedAt = proof?.generated_at ?? null

  const mindResultsList = report ? reportToMindResults(report) : []
  const mindResults = Object.fromEntries(
    mindResultsList.map(r => [r.mindKey, r])
  ) as Record<string, import('@/lib/types').MindResult | null>

  return (
    <div className="px-6 md:px-12 lg:px-16 py-10">
      <div className="max-w-3xl mx-auto space-y-8">
        <BackButton href="/app" label="New analysis" />

        <ReportHeader
          question={question}
          reportId={id}
          confidence={confidence}
          type={type}
          createdAt={Date.now()}
          verdict={verdict}
        />

        {/* Navigation tabs */}
        <div className="flex gap-6 border-b border-border pb-px">
          <Link
            href={`/results/${id}`}
            className="pb-3 text-xs font-mono text-navy border-b-2 border-navy -mb-px"
          >
            Results
          </Link>
          <Link
            href={`/results/${id}/graph`}
            className="pb-3 text-xs font-mono text-slate hover:text-navy transition-colors flex items-center gap-1.5 border-b-2 border-transparent -mb-px"
          >
            <Network size={11} />
            Graph
          </Link>
          <Link
            href={`/results/${id}/discussion`}
            className="pb-3 text-xs font-mono text-slate hover:text-navy transition-colors flex items-center gap-1.5 border-b-2 border-transparent -mb-px"
          >
            <MessageSquare size={11} />
            Discussion
          </Link>
        </div>

        {report === null ? (
          <div className="text-center py-20 text-slate font-mono text-sm">
            Report not found or still processing.{' '}
            <Link href="/app" className="text-blue underline">Start new analysis</Link>
          </div>
        ) : (
          <>
            <MindPanelList results={mindResults} />

            <DecisionReceipt
              id={id}
              topic={question}
              verdict={verdict}
              confidence={confidence}
              sha256={sha256}
              generatedAt={generatedAt}
            />
          </>
        )}
      </div>
    </div>
  )
}
