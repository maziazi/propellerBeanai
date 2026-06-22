import Link from 'next/link'
import { Header } from '@/components/layout/Header'
import { BackButton } from '@/components/layout/BackButton'
import { GraphLegend } from '@/components/graph/GraphLegend'
import { GraphCanvas } from '@/components/graph/GraphCanvas'
import { MOCK_GRAPH_NODES, MOCK_GRAPH_EDGES, MOCK_HISTORY, DEMO_QUESTION } from '@/lib/mock-data'
import { MessageSquare, Network } from 'lucide-react'

interface GraphPageProps {
  params: Promise<{ id: string }>
}

export default async function GraphPage({ params }: GraphPageProps) {
  const { id } = await params
  const record = MOCK_HISTORY.find((h) => h.id === id)
  const question = record?.question ?? DEMO_QUESTION

  return (
    <div className="min-h-screen flex flex-col bg-cream">
      <Header />

      <div className="px-4 py-6 pt-24">
        <div className="max-w-6xl mx-auto space-y-4">
          <BackButton href={`/results/${id}`} label="Back to results" />
          <h2 className="text-lg font-bold text-navy">&ldquo;{question}&rdquo;</h2>

          {/* Tabs */}
          <div className="flex gap-1 border-b border-border pb-px">
            <Link href={`/results/${id}`} className="px-3 py-2 text-xs font-mono text-slate hover:text-navy transition-colors">
              Results
            </Link>
            <Link href={`/results/${id}/discussion`} className="px-3 py-2 text-xs font-mono text-slate hover:text-navy transition-colors flex items-center gap-1.5">
              <MessageSquare size={11} />
              Discussion
            </Link>
            <Link href={`/results/${id}/graph`} className="px-3 py-2 text-xs font-mono text-navy border-b-2 border-navy -mb-px flex items-center gap-1.5">
              <Network size={11} />
              Graph
            </Link>
          </div>
        </div>
      </div>

      {/* Full-height graph canvas */}
      <div className="flex-1 flex flex-col border-t border-border" style={{ minHeight: '600px' }}>
        <div className="flex-1 relative">
          <GraphCanvas nodes={MOCK_GRAPH_NODES} edges={MOCK_GRAPH_EDGES} />
        </div>
        <GraphLegend />
      </div>
    </div>
  )
}
