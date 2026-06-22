import type { MindConfig } from './types'

export const MINDS: MindConfig[] = [
  { key: 'fact',  label: 'FACT',  icon: '⬜', accent: '#64748B', bg: '#F1F5F9', description: 'Data, stats, verified sources' },
  { key: 'feel',  label: 'FEEL',  icon: '🔴', accent: '#DC2626', bg: '#FEF2F2', description: 'Intuition, emotion, gut feeling' },
  { key: 'risk',  label: 'RISK',  icon: '⬛', accent: '#374151', bg: '#F9FAFB', description: 'Risks, assumptions, blind spots' },
  { key: 'gain',  label: 'GAIN',  icon: '🟡', accent: '#D97706', bg: '#FFFBEB', description: 'Opportunities, upside, potential' },
  { key: 'wild',  label: 'WILD',  icon: '🟢', accent: '#16A34A', bg: '#F0FDF4', description: 'Creative, contrarian, unexpected' },
  { key: 'merge', label: 'MERGE', icon: '🔵', accent: '#2563EB', bg: '#EEF4FF', description: 'Synthesis, confidence, decision' },
]

export const MIND_MAP = Object.fromEntries(MINDS.map(m => [m.key, m])) as Record<string, MindConfig>
