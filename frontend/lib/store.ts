import { create } from 'zustand'
import type { MindKey, MindStatus, MindResult, DiscussionMessage, EmergentInsight, MergeSynthesis, GraphNode, GraphEdge, AnalysisRecord } from './types'

interface BeanAIStore {
  currentQuestion: string
  analysisId: string | null
  analysisType: 'quick' | 'full'
  analysisStatus: 'idle' | 'processing' | 'done' | 'error'
  mindProgress: Record<MindKey, MindStatus>
  mindResults: Record<MindKey, MindResult | null>
  messages: DiscussionMessage[]
  emergentInsights: EmergentInsight[]
  mergeSynthesis: MergeSynthesis | null
  graphNodes: GraphNode[]
  graphEdges: GraphEdge[]
  history: AnalysisRecord[]
  setQuestion: (q: string) => void
  setAnalysisType: (t: 'quick' | 'full') => void
  startAnalysis: (id: string) => void
  updateMindProgress: (mind: MindKey, status: MindStatus) => void
  setMindResult: (mind: MindKey, result: MindResult) => void
  setAnalysisDone: () => void
  reset: () => void
}

const defaultProgress: Record<MindKey, MindStatus> = {
  fact: 'waiting', feel: 'waiting', risk: 'waiting',
  gain: 'waiting', wild: 'waiting', merge: 'waiting',
}

const defaultResults: Record<MindKey, MindResult | null> = {
  fact: null, feel: null, risk: null, gain: null, wild: null, merge: null,
}

export const useBeanAIStore = create<BeanAIStore>((set) => ({
  currentQuestion: '',
  analysisId: null,
  analysisType: 'quick',
  analysisStatus: 'idle',
  mindProgress: defaultProgress,
  mindResults: defaultResults,
  messages: [],
  emergentInsights: [],
  mergeSynthesis: null,
  graphNodes: [],
  graphEdges: [],
  history: [],
  setQuestion: (q) => set({ currentQuestion: q }),
  setAnalysisType: (t) => set({ analysisType: t }),
  startAnalysis: (id) => set({ analysisId: id, analysisStatus: 'processing', mindProgress: { ...defaultProgress } }),
  updateMindProgress: (mind, status) =>
    set((s) => ({ mindProgress: { ...s.mindProgress, [mind]: status } })),
  setMindResult: (mind, result) =>
    set((s) => ({ mindResults: { ...s.mindResults, [mind]: result } })),
  setAnalysisDone: () => set({ analysisStatus: 'done' }),
  reset: () => set({ currentQuestion: '', analysisId: null, analysisStatus: 'idle', mindProgress: { ...defaultProgress }, mindResults: { ...defaultResults } }),
}))
