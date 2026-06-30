'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { ConfidenceScore } from '@/components/shared/ConfidenceScore'
import { MonoText } from '@/components/shared/MonoText'
import { Clock, ArrowRight } from 'lucide-react'
import { cn } from '@/lib/utils'

type Filter = 'all' | 'quick' | 'full'

interface HistoryRecord {
  id: string
  topic: string
  service: 'quick-scan' | 'full-prism'
  confidence: number
  created_at: string
}

export default function HistoryPage() {
  const [filter, setFilter] = useState<Filter>('all')
  const [records, setRecords] = useState<HistoryRecord[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const base = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8000'
    fetch(`${base}/api/history`, { cache: 'no-store' })
      .then(r => r.ok ? r.json() : [])
      .then(data => { setRecords(data); setLoading(false) })
      .catch(() => setLoading(false))
  }, [])

  const toType = (service: string): 'quick' | 'full' =>
    service === 'full-prism' ? 'full' : 'quick'

  const filtered = records.filter(r =>
    filter === 'all' || toType(r.service) === filter
  )

  const countFor = (f: Filter) =>
    f === 'all' ? records.length : records.filter(r => toType(r.service) === f).length

  return (
    <div className="flex flex-col bg-cream min-h-full">
      <main className="flex-1 px-8 md:px-16 py-10">
        <div className="max-w-2xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35 }}
          >
            <div className="border-t border-border pt-4 mb-6">
              <span className="font-mono text-xs text-muted uppercase tracking-widest">Archive</span>
            </div>

            <div className="mb-8">
              <h1 className="font-serif text-3xl md:text-4xl font-bold text-navy mb-2">Analysis History</h1>
              <p className="text-sm text-slate font-mono">
                {loading ? 'Loading...' : `${records.length} analyses on record`}
              </p>
            </div>

            <div className="flex gap-4 mb-8 border-b border-border pb-px">
              {(['all', 'quick', 'full'] as Filter[]).map((f) => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className={cn(
                    'pb-3 text-xs font-mono transition-colors capitalize border-b-2 -mb-px',
                    filter === f
                      ? 'text-navy border-navy'
                      : 'text-slate border-transparent hover:text-navy',
                  )}
                >
                  {f === 'all' ? 'All' : f === 'quick' ? 'Quick Scan' : 'Full Analysis'}
                  <span className="ml-1.5 text-muted">({countFor(f)})</span>
                </button>
              ))}
            </div>

            {loading ? (
              <div className="space-y-2">
                {[1, 2, 3].map(i => (
                  <div key={i} className="h-16 rounded-xl border border-border bg-white animate-pulse" />
                ))}
              </div>
            ) : (
              <div className="space-y-2">
                {filtered.map((record, i) => {
                  const type = toType(record.service)
                  const date = record.created_at ? new Date(record.created_at) : null
                  const dateStr = date
                    ? date.toLocaleDateString('id', { month: 'short', day: 'numeric' })
                    : '—'
                  const timeStr = date
                    ? date.toLocaleTimeString('id', { hour: '2-digit', minute: '2-digit', hour12: false })
                    : ''

                  return (
                    <motion.div
                      key={record.id}
                      initial={{ opacity: 0, x: -8 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.05, duration: 0.3 }}
                    >
                      <Link
                        href={`/results/${record.id}`}
                        className="flex items-center justify-between px-4 py-3 rounded-xl border border-border bg-white hover:bg-cream hover:border-muted transition-all group"
                      >
                        <div className="flex-1 min-w-0 mr-4">
                          <p className="text-sm text-navy font-medium truncate mb-1">
                            {record.topic || '(no topic)'}
                          </p>
                          <div className="flex items-center gap-3">
                            <span
                              className={cn(
                                'text-xs font-mono px-1.5 py-0.5 rounded border',
                                type === 'full'
                                  ? 'text-blue bg-blue-soft border-blue/20'
                                  : 'text-slate bg-cream border-border',
                              )}
                            >
                              {type === 'quick' ? 'Quick' : 'Full'}
                            </span>
                            <div className="flex items-center gap-1 text-xs font-mono text-muted">
                              <Clock size={10} />
                              <span>{dateStr} {timeStr}</span>
                            </div>
                            <MonoText className="text-xs text-muted truncate hidden sm:block">
                              {record.id}
                            </MonoText>
                          </div>
                        </div>
                        <div className="flex items-center gap-3 shrink-0">
                          <ConfidenceScore value={record.confidence} size="sm" showBar={false} />
                          <ArrowRight
                            size={14}
                            className="text-muted group-hover:text-slate transition-colors group-hover:translate-x-0.5"
                          />
                        </div>
                      </Link>
                    </motion.div>
                  )
                })}

                {filtered.length === 0 && (
                  <div className="text-center py-16">
                    <p className="text-slate font-mono text-sm">No analyses found.</p>
                  </div>
                )}
              </div>
            )}
          </motion.div>
        </div>
      </main>
    </div>
  )
}
