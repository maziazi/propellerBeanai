'use client'

import dynamic from 'next/dynamic'
import type { GraphNode, GraphEdge } from '@/lib/types'

const KnowledgeGraph = dynamic(
  () => import('./KnowledgeGraph').then((m) => m.KnowledgeGraph),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-full flex items-center justify-center bg-canvas">
        <div className="text-center space-y-3">
          <div className="w-8 h-8 border-2 border-border border-t-secondary rounded-full animate-spin mx-auto" />
          <p className="text-xs font-mono text-secondary">Loading knowledge graph...</p>
        </div>
      </div>
    ),
  },
)

interface GraphCanvasProps {
  nodes: GraphNode[]
  edges: GraphEdge[]
}

export function GraphCanvas({ nodes, edges }: GraphCanvasProps) {
  return <KnowledgeGraph nodes={nodes} edges={edges} />
}
