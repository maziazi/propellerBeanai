import { MINDS } from '@/lib/minds'

const NODE_TYPES = [
  { type: 'initial', label: 'Initial node', color: '#94A3B8' },
  { type: 'conflict', label: 'Conflict', color: '#DC2626' },
  { type: 'emergent', label: 'Emergent insight', color: '#16A34A' },
  { type: 'source', label: 'Source/Evidence', color: '#64748B' },
]

const EDGE_TYPES = [
  { type: 'solid', label: 'Direct connection' },
  { type: 'dashed', label: 'Inferred link' },
]

export function GraphLegend() {
  return (
    <div className="flex flex-wrap gap-6 px-4 py-3 border-t border-border bg-white text-xs font-mono">
      <div className="flex items-center gap-3">
        <span className="text-muted">Minds:</span>
        {MINDS.map((mind) => (
          <div key={mind.key} className="flex items-center gap-1">
            <div className="w-2 h-2 rounded-sm" style={{ backgroundColor: mind.accent }} />
            <span style={{ color: mind.accent }}>{mind.label}</span>
          </div>
        ))}
      </div>

      <div className="flex items-center gap-3">
        <span className="text-muted">Nodes:</span>
        {NODE_TYPES.map((nt) => (
          <div key={nt.type} className="flex items-center gap-1">
            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: nt.color }} />
            <span className="text-slate">{nt.label}</span>
          </div>
        ))}
      </div>

      <div className="flex items-center gap-3">
        <span className="text-muted">Edges:</span>
        {EDGE_TYPES.map((et) => (
          <div key={et.type} className="flex items-center gap-1.5">
            <div
              className="w-6 h-px"
              style={{
                backgroundColor: '#94A3B8',
                borderTop: et.type === 'dashed' ? '1px dashed #94A3B8' : undefined,
              }}
            />
            <span className="text-slate">{et.label}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
