import type { MindConfig } from './types'

export const MINDS: MindConfig[] = [
  { key: 'fact',  label: 'FACT',  icon: '⬜', accent: '#4182EB', bg: '#EEF4FF', description: 'Data, stats, verified sources' },
  { key: 'feel',  label: 'FEEL',  icon: '🔴', accent: '#E24231', bg: '#FEE9E7', description: 'Intuition, emotion, gut feeling' },
  { key: 'risk',  label: 'RISK',  icon: '⬛', accent: '#3C4043', bg: '#F5F5F5', description: 'Risks, assumptions, blind spots' },
  { key: 'gain',  label: 'GAIN',  icon: '🟡', accent: '#F6BB14', bg: '#FFF9E6', description: 'Opportunities, upside, potential' },
  { key: 'wild',  label: 'WILD',  icon: '🟢', accent: '#169F53', bg: '#EDFAF3', description: 'Creative, contrarian, unexpected' },
  { key: 'merge', label: 'MERGE', icon: '🔵', accent: '#4182EB', bg: '#EEF4FF', description: 'Synthesis, confidence, decision' },
]

export const MIND_MAP = Object.fromEntries(MINDS.map(m => [m.key, m])) as Record<string, MindConfig>
