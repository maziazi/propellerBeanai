'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowRight, Zap } from 'lucide-react'
import { postDiscuss, getStatus } from '@/lib/api'

interface UpgradeCTAProps {
  reportId: string
}

export function UpgradeCTA({ reportId }: UpgradeCTAProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleUpgrade = async () => {
    setLoading(true)
    setError(null)
    try {
      const { job_id, parent_job_id } = await postDiscuss(reportId)

      // Poll until discussion done
      let done = false
      while (!done) {
        await new Promise(r => setTimeout(r, 2500))
        const st = await getStatus(job_id)
        if (st.status === 'done') done = true
        else if (st.status === 'failed') throw new Error(st.error ?? 'Discussion failed')
      }

      router.push(`/results/${parent_job_id}/discussion`)
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err))
      setLoading(false)
    }
  }

  return (
    <div className="rounded-2xl border border-dashed border-blue bg-blue-soft p-5">
      <div className="flex items-start gap-3">
        <div className="w-8 h-8 rounded-lg border border-blue/20 bg-white flex items-center justify-center shrink-0">
          <Zap size={14} className="text-blue" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-serif text-lg font-bold text-navy mb-1">
            Unlock Full Analysis
          </p>
          <p className="text-xs text-slate leading-relaxed mb-3">
            Get mind-to-mind discussion rounds, emergent insights discovered between minds, and an interactive knowledge graph for $0.45.
          </p>
          <ul className="space-y-1 mb-4">
            {[
              'Multi-round mind discussion',
              'Emergent insight detection',
              'Knowledge graph visualization',
              'Deeper competitor & risk analysis',
            ].map((feat) => (
              <li key={feat} className="flex items-center gap-2 text-xs text-slate font-mono">
                <span className="text-blue">▸</span>
                {feat}
              </li>
            ))}
          </ul>
          {error && <p className="text-xs text-red-500 mb-2">{error}</p>}
          <button
            onClick={handleUpgrade}
            disabled={loading}
            className="inline-flex items-center gap-2 bg-blue text-white hover:bg-blue/90 disabled:opacity-60 text-xs font-medium px-4 py-2 rounded-lg transition-colors active:scale-95"
          >
            {loading ? 'Running discussion...' : 'Run Full Analysis — $0.45'}
            <ArrowRight size={12} />
          </button>
        </div>
      </div>
    </div>
  )
}
