'use client'

import { useEffect, useMemo, useRef, useState, useCallback } from 'react'
import {
  forceSimulation, forceLink, forceManyBody, forceCenter, forceCollide,
  type Simulation, type SimulationNodeDatum,
} from 'd3-force'

// ── Types ─────────────────────────────────────────────────────────────────────
export type Entity = { id: string; label: string; type?: string; hat?: string }
export type Relation = { from: string; to: string; type?: string; label?: string }

interface SimNode extends SimulationNodeDatum {
  id: string; label: string; type: string; hat: string; deg: number
}
interface SimLink { source: SimNode; target: SimNode; type: string; label: string }

// ── Palette ───────────────────────────────────────────────────────────────────
const HAT_COLOR: Record<string, string> = {
  white: '#9AA0A6', red: '#E24231', black: '#3C4043',
  yellow: '#F6BB14', green: '#169F53', blue: '#4182EB',
}
const TYPE_COLOR: Record<string, string> = {
  fact: '#4182EB', risk: '#3C4043', opportunity: '#F6BB14',
  emotion: '#E24231', alternative: '#169F53', insight: '#7C6FF0',
}
const EDGE_COLOR: Record<string, string> = {
  supports: '#169F53', conflicts: '#E24231', builds_on: '#B8BCC2', questions: '#4182EB',
}
function nodeColor(n: SimNode): string {
  return HAT_COLOR[n.hat] || TYPE_COLOR[n.type] || '#9AA0A6'
}

// ── Component ─────────────────────────────────────────────────────────────────
export function ObsidianGraph({ entities, relations }: { entities: Entity[]; relations: Relation[] }) {
  const wrapRef = useRef<HTMLDivElement>(null)
  const simRef = useRef<Simulation<SimNode, undefined> | null>(null)
  const [size, setSize] = useState({ w: 900, h: 620 })
  const [, force] = useState(0) // re-render trigger on each tick
  const [hover, setHover] = useState<string | null>(null)
  const [view, setView] = useState({ x: 0, y: 0, k: 1 })
  const [isPanning, setIsPanning] = useState(false)

  const dragRef = useRef<{ id: string | null; panning: boolean; sx: number; sy: number; ox: number; oy: number }>({
    id: null, panning: false, sx: 0, sy: 0, ox: 0, oy: 0,
  })

  // Build nodes + links (memoised on data)
  const { nodes, links } = useMemo(() => {
    const ids = new Set(entities.map(e => e.id))
    const nodeMap = new Map<string, SimNode>()
    entities.forEach(e => nodeMap.set(e.id, {
      id: e.id, label: e.label || e.id, type: e.type || 'concept', hat: e.hat || '', deg: 0,
    }))
    const links: SimLink[] = []
    relations.forEach(r => {
      const s = nodeMap.get(r.from), t = nodeMap.get(r.to)
      if (s && t && ids.has(r.from) && ids.has(r.to)) {
        s.deg++; t.deg++
        links.push({ source: s, target: t, type: r.type || 'builds_on', label: r.label || '' })
      }
    })
    return { nodes: Array.from(nodeMap.values()), links }
  }, [entities, relations])

  // Track container size
  useEffect(() => {
    if (!wrapRef.current) return
    const ro = new ResizeObserver(entries => {
      const r = entries[0].contentRect
      setSize({ w: Math.max(320, r.width), h: Math.max(420, r.height) })
    })
    ro.observe(wrapRef.current)
    return () => ro.disconnect()
  }, [])

  // Run the force simulation
  useEffect(() => {
    if (nodes.length === 0) return
    const sim = forceSimulation<SimNode>(nodes)
      .force('link', forceLink<SimNode, SimLink>(links).id(d => d.id).distance(90).strength(0.5))
      .force('charge', forceManyBody().strength(-320))
      .force('center', forceCenter(size.w / 2, size.h / 2))
      .force('collide', forceCollide<SimNode>().radius(d => 14 + d.deg * 2))
      .alpha(1).alphaDecay(0.028)
    sim.on('tick', () => force(v => v + 1))
    simRef.current = sim
    return () => { sim.stop() }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [nodes, links])

  // Keep the centering force in sync with size
  useEffect(() => {
    const sim = simRef.current
    if (!sim) return
    sim.force('center', forceCenter(size.w / 2, size.h / 2))
    sim.alpha(0.4).restart()
  }, [size.w, size.h])

  const radius = useCallback((n: SimNode) => 6 + Math.min(10, n.deg * 1.6), [])

  // Neighbours for hover highlight
  const neighbours = useMemo(() => {
    const m = new Map<string, Set<string>>()
    links.forEach(l => {
      if (!m.has(l.source.id)) m.set(l.source.id, new Set())
      if (!m.has(l.target.id)) m.set(l.target.id, new Set())
      m.get(l.source.id)!.add(l.target.id)
      m.get(l.target.id)!.add(l.source.id)
    })
    return m
  }, [links])

  const isDim = (id: string) => hover !== null && hover !== id && !(neighbours.get(hover)?.has(id))

  // ── Pointer interactions: pan, zoom, node drag ──
  const toSvg = (clientX: number, clientY: number) => {
    const rect = wrapRef.current!.getBoundingClientRect()
    return { x: (clientX - rect.left - view.x) / view.k, y: (clientY - rect.top - view.y) / view.k }
  }

  const onNodeDown = (e: React.PointerEvent, n: SimNode) => {
    e.stopPropagation()
    ;(e.target as Element).setPointerCapture(e.pointerId)
    dragRef.current.id = n.id
    simRef.current?.alphaTarget(0.3).restart()
  }
  const onBgDown = (e: React.PointerEvent) => {
    dragRef.current.panning = true
    dragRef.current.sx = e.clientX; dragRef.current.sy = e.clientY
    dragRef.current.ox = view.x; dragRef.current.oy = view.y
    setIsPanning(true)
  }
  const onMove = (e: React.PointerEvent) => {
    const d = dragRef.current
    if (d.id) {
      const p = toSvg(e.clientX, e.clientY)
      const node = nodes.find(n => n.id === d.id)
      if (node) { node.fx = p.x; node.fy = p.y }
    } else if (d.panning) {
      setView(v => ({ ...v, x: d.ox + (e.clientX - d.sx), y: d.oy + (e.clientY - d.sy) }))
    }
  }
  const onUp = () => {
    const d = dragRef.current
    if (d.id) {
      const node = nodes.find(n => n.id === d.id)
      if (node) { node.fx = null; node.fy = null }
      simRef.current?.alphaTarget(0)
    }
    d.id = null; d.panning = false
    setIsPanning(false)
  }
  const onWheel = (e: React.WheelEvent) => {
    e.preventDefault()
    const rect = wrapRef.current!.getBoundingClientRect()
    const mx = e.clientX - rect.left, my = e.clientY - rect.top
    const factor = e.deltaY < 0 ? 1.12 : 1 / 1.12
    setView(v => {
      const k = Math.min(3, Math.max(0.3, v.k * factor))
      // zoom toward cursor
      return { k, x: mx - (mx - v.x) * (k / v.k), y: my - (my - v.y) * (k / v.k) }
    })
  }

  const reset = () => setView({ x: 0, y: 0, k: 1 })

  if (nodes.length === 0) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: 420, color: '#9AA0A6', fontFamily: 'monospace', fontSize: 13 }}>
        No graph data for this analysis.
      </div>
    )
  }

  const legendHats = Array.from(new Set(nodes.map(n => n.hat).filter(Boolean)))

  return (
    <div ref={wrapRef} style={{ position: 'relative', width: '100%', height: '100%', minHeight: 560, backgroundColor: '#0E1116', borderRadius: 12, overflow: 'hidden', touchAction: 'none' }}>
      <svg
        width={size.w} height={size.h}
        onPointerDown={onBgDown} onPointerMove={onMove} onPointerUp={onUp} onPointerLeave={onUp}
        onWheel={onWheel}
        style={{ display: 'block', cursor: isPanning ? 'grabbing' : 'grab' }}
      >
        <defs>
          <radialGradient id="og-glow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#7C6FF0" stopOpacity="0.5" />
            <stop offset="100%" stopColor="#7C6FF0" stopOpacity="0" />
          </radialGradient>
        </defs>
        <g transform={`translate(${view.x},${view.y}) scale(${view.k})`}>
          {/* edges */}
          {links.map((l, i) => {
            const dim = isDim(l.source.id) && isDim(l.target.id)
            return (
              <line
                key={i}
                x1={l.source.x} y1={l.source.y} x2={l.target.x} y2={l.target.y}
                stroke={EDGE_COLOR[l.type] || '#4A5160'}
                strokeWidth={l.type === 'conflicts' ? 1.6 : 1}
                strokeOpacity={dim ? 0.06 : (l.type === 'conflicts' ? 0.7 : 0.35)}
                strokeDasharray={l.type === 'questions' ? '4 3' : undefined}
              />
            )
          })}
          {/* nodes */}
          {nodes.map(n => {
            const c = nodeColor(n)
            const r = radius(n)
            const dim = isDim(n.id)
            const showLabel = view.k > 0.75 || hover === n.id || (hover && neighbours.get(hover)?.has(n.id))
            return (
              <g key={n.id}
                transform={`translate(${n.x},${n.y})`}
                style={{ cursor: 'pointer', opacity: dim ? 0.25 : 1, transition: 'opacity 0.15s' }}
                onPointerDown={e => onNodeDown(e, n)}
                onPointerEnter={() => setHover(n.id)}
                onPointerLeave={() => setHover(null)}
              >
                {n.type === 'insight' && <circle r={r + 10} fill="url(#og-glow)" />}
                <circle r={r} fill={c} stroke="#0E1116" strokeWidth={1.5} />
                {hover === n.id && <circle r={r + 3} fill="none" stroke={c} strokeWidth={1.2} strokeOpacity={0.6} />}
                {showLabel && (
                  <text
                    x={0} y={r + 12} textAnchor="middle"
                    fontSize={11 / Math.max(1, view.k * 0.7)} fill="#C9D1D9"
                    style={{ pointerEvents: 'none', fontFamily: 'Inter, sans-serif', paintOrder: 'stroke', stroke: '#0E1116', strokeWidth: 3 }}
                  >
                    {n.label.length > 26 ? n.label.slice(0, 25) + '…' : n.label}
                  </text>
                )}
              </g>
            )
          })}
        </g>
      </svg>

      {/* Controls */}
      <div style={{ position: 'absolute', top: 12, right: 12, display: 'flex', gap: 6 }}>
        {[['−', () => setView(v => ({ ...v, k: Math.max(0.3, v.k / 1.2) }))], ['+', () => setView(v => ({ ...v, k: Math.min(3, v.k * 1.2) }))], ['⤢', reset]].map(([lab, fn], i) => (
          <button key={i} onClick={fn as () => void}
            style={{ width: 30, height: 30, borderRadius: 8, border: '1px solid rgba(255,255,255,0.15)', background: 'rgba(255,255,255,0.06)', color: '#C9D1D9', cursor: 'pointer', fontSize: 15, lineHeight: 1 }}>
            {lab as string}
          </button>
        ))}
      </div>

      {/* Legend */}
      <div style={{ position: 'absolute', bottom: 12, left: 12, display: 'flex', flexWrap: 'wrap', gap: 10, padding: '8px 12px', borderRadius: 8, background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)' }}>
        {legendHats.map(h => (
          <span key={h} style={{ display: 'inline-flex', alignItems: 'center', gap: 5, fontFamily: 'monospace', fontSize: 10, color: '#C9D1D9' }}>
            <span style={{ width: 9, height: 9, borderRadius: '50%', backgroundColor: HAT_COLOR[h] }} /> {h}
          </span>
        ))}
        <span style={{ fontFamily: 'monospace', fontSize: 10, color: '#6E7681' }}>· {nodes.length} nodes · {links.length} links</span>
      </div>
    </div>
  )
}
