import type { MindConfig } from './types'

export const MINDS: MindConfig[] = [
  { key: 'fact',  label: 'FACT',  icon: '⬜', accent: '#4285F4', bg: '#E8F0FE', description: 'Data, stats, verified sources' },
  { key: 'feel',  label: 'FEEL',  icon: '🔴', accent: '#EA4335', bg: '#FCE8E6', description: 'Intuition, emotion, gut feeling' },
  { key: 'risk',  label: 'RISK',  icon: '⬛', accent: '#3C4043', bg: '#F1F3F4', description: 'Risks, assumptions, blind spots' },
  { key: 'gain',  label: 'GAIN',  icon: '🟡', accent: '#F29900', bg: '#FEF9E7', description: 'Opportunities, upside, potential' },
  { key: 'wild',  label: 'WILD',  icon: '🟢', accent: '#34A853', bg: '#E6F4EA', description: 'Creative, contrarian, unexpected' },
  { key: 'merge', label: 'MERGE', icon: '🔵', accent: '#1A73E8', bg: '#E8F0FE', description: 'Synthesis, confidence, decision' },
]

export const MIND_MAP = Object.fromEntries(MINDS.map(m => [m.key, m])) as Record<string, MindConfig>
