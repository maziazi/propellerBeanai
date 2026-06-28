import Link from 'next/link'
import { Header } from '@/components/layout/Header'
import { BackButton } from '@/components/layout/BackButton'
import { MessageSquare, Network } from 'lucide-react'

interface GraphPageProps {
  params: Promise<{ id: string }>
}

async function fetchTopic(id: string): Promise<string> {
  const base = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8000'
  try {
    const res = await fetch(`${base}/api/report/${id}`, { cache: 'no-store' })
    if (!res.ok) return ''
    const data = await res.json()
    return data.topic ?? ''
  } catch {
    return ''
  }
}

export default async function GraphPage({ params }: GraphPageProps) {
  const { id } = await params
  const topic = await fetchTopic(id)
  const base = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8000'
  const graphSrc = `${base}/api/graph/${id}`

  return (
    <div className="min-h-screen flex flex-col bg-cream">
      <Header />

      <div className="px-4 py-6 pt-24">
        <div className="max-w-6xl mx-auto space-y-4">
          <BackButton href={`/results/${id}`} label="Back to results" />
          {topic && <h2 className="text-lg font-bold text-navy">&ldquo;{topic}&rdquo;</h2>}

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

      <div className="flex-1 flex flex-col border-t border-border" style={{ minHeight: '600px' }}>
        <iframe
          src={graphSrc}
          className="flex-1 w-full border-none"
          style={{ minHeight: '600px' }}
          title="Knowledge Graph"
        />
      </div>
    </div>
  )
}
