import Link from 'next/link'
import { Header } from '@/components/layout/Header'
import { BackButton } from '@/components/layout/BackButton'
import { ReportHeader } from '@/components/results/ReportHeader'
import { MindPanelList } from '@/components/results/MindPanelList'
import { UpgradeCTA } from '@/components/results/UpgradeCTA'
import { MOCK_MIND_RESULTS, MOCK_HISTORY } from '@/lib/mock-data'
import { MessageSquare, Network } from 'lucide-react'

interface ResultsPageProps {
  params: Promise<{ id: string }>
}

export default async function ResultsPage({ params }: ResultsPageProps) {
  const { id } = await params

  const record = MOCK_HISTORY.find((h) => h.id === id) ?? {
    id,
    question: 'Should I pivot to B2B SaaS?',
    type: 'quick' as const,
    confidence: 74,
    createdAt: Date.now() - 3600000,
  }

  return (
    <div className="min-h-screen flex flex-col bg-cream">
      <Header />

      <main className="flex-1 px-8 md:px-16 lg:px-24 py-10 pt-24">
        <div className="max-w-3xl mx-auto space-y-8">
          <BackButton href="/" label="New analysis" />

          <ReportHeader
            question={record.question}
            reportId={record.id}
            confidence={record.confidence}
            type={record.type}
            createdAt={record.createdAt}
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

            {record.type === 'full' ? (
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

          <MindPanelList results={MOCK_MIND_RESULTS} />

          {record.type === 'quick' && <UpgradeCTA />}
        </div>
      </main>
    </div>
  )
}
