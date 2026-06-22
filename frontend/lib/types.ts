export type MindKey = 'fact' | 'feel' | 'risk' | 'gain' | 'wild' | 'merge'

export interface MindConfig {
  key: MindKey
  label: string
  icon: string
  accent: string
  bg: string
  description: string
}

export interface Source {
  title: string
  url: string
  verified: boolean
}

export interface MindResult {
  mindKey: MindKey
  content: string
  sources: Source[]
  isExpanded: boolean
}

export type MindStatus = 'waiting' | 'analyzing' | 'done' | 'error'

export interface DiscussionMessage {
  id: string
  from: MindKey | 'user'
  to: MindKey | 'all'
  content: string
  type: 'statement' | 'response' | 'wildcard' | 'user_question'
  round: number
  timestamp: number
}

export interface EmergentInsight {
  id: string
  content: string
  involvedMinds: MindKey[]
}

export interface MergeSynthesis {
  content: string
  confidence: number
  verdict: 'GO' | 'WAIT' | 'NO' | 'MIXED'
  actions: string[]
}

export interface GraphNode {
  id: string
  label: string
  type: 'initial' | 'conflict' | 'emergent' | 'source'
  mindKey?: MindKey
  position: { x: number; y: number }
}

export interface GraphEdge {
  id: string
  source: string
  target: string
  type: 'solid' | 'dashed'
  mindKey?: MindKey
}

export interface AnalysisRecord {
  id: string
  question: string
  type: 'quick' | 'full'
  confidence: number
  createdAt: number
}
