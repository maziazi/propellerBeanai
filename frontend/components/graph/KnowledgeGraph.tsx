'use client'

import { useState } from 'react'
import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  type Node,
  type Edge,
  BackgroundVariant,
  Handle,
  Position,
} from '@xyflow/react'
import '@xyflow/react/dist/style.css'
import type { GraphNode, GraphEdge } from '@/lib/types'
import { MIND_MAP } from '@/lib/minds'

interface KnowledgeGraphProps {
  nodes: GraphNode[]
  edges: GraphEdge[]
}

const NODE_TYPE_COLORS: Record<string, string> = {
  initial: '#F0F0F0',
  conflict: '#EF4444',
  emergent: '#10B981',
  source: '#6B6B6B',
}

function CustomNode({ data }: { data: Record<string, unknown> }) {
  const label = data.label as string
  const type = data.type as string
  const accent = (data.accent as string) || NODE_TYPE_COLORS[type] || '#6B6B6B'
  const bg = (data.bg as string) || '#141414'
  const isEmergent = type === 'emergent'

  return (
    <div
      className={isEmergent ? 'emergent-glow' : ''}
      style={{
        padding: '8px 12px',
        borderRadius: '8px',
        border: `1px solid ${accent}44`,
        backgroundColor: bg,
        maxWidth: 160,
        fontSize: 11,
        fontFamily: 'monospace',
        color: accent,
        fontWeight: type === 'initial' ? 'bold' : 'normal',
        textAlign: 'center',
        lineHeight: 1.3,
      }}
    >
      <Handle type="target" position={Position.Top} style={{ background: accent, width: 6, height: 6 }} />
      {label}
      <Handle type="source" position={Position.Bottom} style={{ background: accent, width: 6, height: 6 }} />
    </div>
  )
}

const nodeTypes = { custom: CustomNode }

function toReactFlowNode(node: GraphNode): Node {
  const mind = node.mindKey ? MIND_MAP[node.mindKey] : null
  return {
    id: node.id,
    type: 'custom',
    position: node.position,
    data: {
      label: node.label,
      type: node.type,
      mindKey: node.mindKey,
      accent: mind?.accent || NODE_TYPE_COLORS[node.type],
      bg: mind?.bg || '#141414',
    },
  }
}

function toReactFlowEdge(edge: GraphEdge): Edge {
  const mind = edge.mindKey ? MIND_MAP[edge.mindKey] : null
  const color = mind?.accent || '#3A3A3A'
  return {
    id: edge.id,
    source: edge.source,
    target: edge.target,
    type: 'smoothstep',
    style: {
      stroke: color,
      strokeWidth: 1.5,
      strokeDasharray: edge.type === 'dashed' ? '5 4' : undefined,
    },
    animated: edge.type === 'dashed',
  }
}

export function KnowledgeGraph({ nodes, edges }: KnowledgeGraphProps) {
  const rfNodes = nodes.map(toReactFlowNode)
  const rfEdges = edges.map(toReactFlowEdge)

  return (
    <div className="relative w-full h-full">
      <ReactFlow
        nodes={rfNodes}
        edges={rfEdges}
        nodeTypes={nodeTypes}
        fitView
        fitViewOptions={{ padding: 0.2 }}
        minZoom={0.3}
        maxZoom={2}
        style={{ backgroundColor: '#0C0C0C' }}
        proOptions={{ hideAttribution: true }}
      >
        <Background
          color="#1E1E1E"
          gap={24}
          size={1}
          variant={BackgroundVariant.Dots}
        />
        <Controls
          style={{ backgroundColor: '#141414', border: '1px solid #1E1E1E' }}
        />
        <MiniMap
          style={{ backgroundColor: '#141414', border: '1px solid #1E1E1E' }}
          nodeColor={(n) => (n.data as { accent?: string }).accent || '#3A3A3A'}
          maskColor="#0C0C0C88"
        />
      </ReactFlow>
    </div>
  )
}
