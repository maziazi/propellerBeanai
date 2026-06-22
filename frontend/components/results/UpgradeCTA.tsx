import { ArrowRight, Zap } from 'lucide-react'
import Link from 'next/link'

export function UpgradeCTA() {
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
          <Link
            href="#"
            className="inline-flex items-center gap-2 bg-blue text-white hover:bg-blue/90 text-xs font-medium px-4 py-2 rounded-lg transition-colors active:scale-95"
          >
            Run Full Analysis — $0.45
            <ArrowRight size={12} />
          </Link>
        </div>
      </div>
    </div>
  )
}
