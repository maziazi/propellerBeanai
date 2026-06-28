import Link from 'next/link'
import { Header } from '@/components/layout/Header'
import { BackButton } from '@/components/layout/BackButton'
import { ReportHeader } from '@/components/results/ReportHeader'
import { MindPanelList } from '@/components/results/MindPanelList'
import { UpgradeCTA } from '@/components/results/UpgradeCTA'
import { MessageSquare, Network } from 'lucide-react'
import { reportToMindResults, reportConfidence } from '@/lib/transform'

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

export default async function ResultsPage({ params }: ResultsPageProps) {
  const { id } = await params
  const report = await fetchReport(id)

  const question = report?.topic ?? 'Analysis result'
  const type = report?.service === 'full-prism' ? 'full' : 'quick'
  const confidence = report ? reportConfidence(report) : 70
  const mindResultsList = report ? reportToMindResults(report) : []
  const mindResults = Object.fromEntries(mindResultsList.map(r => [r.mindKey, r])) as Record<string, import('@/lib/types').MindResult | null>

  return (
    <div className="min-h-screen flex flex-col bg-cream">
      <Header />

      <main className="flex-1 px-8 md:px-16 lg:px-24 py-10 pt-24">
        <div className="max-w-3xl mx-auto space-y-8">
          <BackButton href="/" label="New analysis" />

          <ReportHeader
            question={question}
            reportId={id}
            confidence={confidence}
            type={type}
            createdAt={Date.now()}
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

            {type === 'full' ? (
              <Link
                href={`/results/${id}/discussion`}
                className="pb-3 text-xs font-mono text-slate hover:text-navy transition-colors flex items-center gap-1.5 border-b-2 border-transparent -mb-px"
              >
                <MessageSquare size={11} />
                Discussion
              </Link>
            ) : (
              <button
                className="pb-3 text-xs font-mono text-muted cursor-not-allowed flex items-center gap-1.5 border-b-2 border-transparent -mb-px"
                disabled
                title="Upgrade to Full Analysis to unlock Discussion"
              >
                <MessageSquare size={11} />
                Discussion
                <span className="text-[10px] bg-cream border border-border px-1 rounded">Full only</span>
              </button>
            )}
          </div>

          {report === null ? (
            <div className="text-center py-20 text-slate font-mono text-sm">
              Report not found or still processing.{' '}
              <Link href="/" className="text-blue underline">Start new analysis</Link>
            </div>
          ) : (
            <MindPanelList results={mindResults} />
          )}

          {type === 'quick' && report !== null && <UpgradeCTA reportId={id} />}
        </div>
      </main>
    </div>
  )
}
