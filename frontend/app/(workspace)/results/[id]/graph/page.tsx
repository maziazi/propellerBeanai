'use client'

import { useEffect, useState, use } from 'react'
import Link from 'next/link'
import { BackButton } from '@/components/layout/BackButton'
import { MessageSquare, Network } from 'lucide-react'
import { ObsidianGraph, type Entity, type Relation } from '@/components/graph/ObsidianGraph'

interface GraphPageProps {
  params: Promise<{ id: string }>
}

export default function GraphPage({ params }: GraphPageProps) {
  const { id } = use(params)
  const [topic, setTopic] = useState('')
  const [graph, setGraph] = useState<{ entities: Entity[]; relations: Relation[] } | null>(null)
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    fetch(`/api/report/${id}`, { cache: 'no-store' })
      .then(r => (r.ok ? r.json() : null))
      .then((data) => {
        if (data) {
          setTopic(data.topic ?? '')
          const gd = data?.graph?.graph_data
          if (gd?.entities) setGraph({ entities: gd.entities, relations: gd.relations ?? [] })
        }
        setLoaded(true)
      })
      .catch(() => setLoaded(true))
  }, [id])

  return (
    <div className="flex flex-col bg-white min-h-full">
      <div className="px-4 py-6">
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
            <span className="px-3 py-2 text-xs font-mono text-navy border-b-2 border-navy -mb-px flex items-center gap-1.5">
              <Network size={11} />
              Graph
            </span>
          </div>
        </div>
      </div>

      <div className="flex-1 px-4 pb-8">
        <div className="max-w-6xl mx-auto" style={{ height: '640px' }}>
          {!loaded ? (
            <div className="flex items-center justify-center h-full text-slate font-mono text-xs">Loading graph…</div>
          ) : graph ? (
            <ObsidianGraph entities={graph.entities} relations={graph.relations} />
          ) : (
            <div className="flex items-center justify-center h-full text-slate font-mono text-xs">
              No knowledge graph was generated for this analysis.
            </div>
          )}
          <p className="text-[11px] text-muted font-mono mt-2 text-center">
            Drag nodes · scroll to zoom · hover to highlight connections
          </p>
        </div>
      </div>
    </div>
  )
}
