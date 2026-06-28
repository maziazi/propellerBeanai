import type { MindResult, MindKey, Source, MergeSynthesis, DiscussionMessage, EmergentInsight } from './types'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AnyReport = Record<string, any>

function verifiedSources(report: AnyReport): Source[] {
  const verified: Source[] = []
  const raw = report.verified_sources as Array<{ title?: string; url: string }> | undefined
  if (raw) {
    for (const s of raw) {
      verified.push({ title: s.title ?? s.url, url: s.url, verified: true })
    }
  }
  return verified
}

function sourcesFromFacts(facts: Array<{ source?: string; url?: string }> = []): Source[] {
  return facts
    .filter((f) => f.url)
    .map((f) => ({ title: f.source ?? f.url!, url: f.url!, verified: false }))
}

export function reportToMindResults(report: AnyReport): MindResult[] {
  const topSources = verifiedSources(report)

  const results: MindResult[] = []

  // white_hat → fact
  if (report.white_hat) {
    const w = report.white_hat
    const lines: string[] = []
    if (Array.isArray(w.facts)) {
      for (const f of w.facts) {
        lines.push(`- **${f.claim ?? f}**${f.source ? ` — ${f.source}` : ''}`)
      }
    }
    if (Array.isArray(w.data_gaps) && w.data_gaps.length) {
      lines.push('\n**Data gaps:**\n' + w.data_gaps.map((d: string) => `- ${d}`).join('\n'))
    }
    results.push({
      mindKey: 'fact',
      content: lines.join('\n'),
      sources: topSources.length ? topSources : sourcesFromFacts(w.facts ?? []),
      isExpanded: false,
    })
  }

  // red_hat → feel
  if (report.red_hat) {
    const r = report.red_hat
    const lines: string[] = []
    if (r.gut_feeling) lines.push(`**Gut feeling:** ${r.gut_feeling}`)
    if (Array.isArray(r.intuitions)) lines.push('\n**Intuitions:**\n' + r.intuitions.map((i: string) => `- ${i}`).join('\n'))
    if (Array.isArray(r.emotional_concerns)) lines.push('\n**Emotional concerns:**\n' + r.emotional_concerns.map((c: string) => `- ${c}`).join('\n'))
    results.push({ mindKey: 'feel', content: lines.join('\n'), sources: [], isExpanded: false })
  }

  // black_hat → risk
  if (report.black_hat) {
    const b = report.black_hat
    const lines: string[] = []
    if (Array.isArray(b.risks)) {
      lines.push('**Risks:**\n' + b.risks.map((r: { risk?: string; severity?: string; probability?: string }) =>
        `- ${r.risk ?? r}${r.severity ? ` *(severity: ${r.severity})*` : ''}${r.probability ? ` *(prob: ${r.probability})*` : ''}`
      ).join('\n'))
    }
    if (Array.isArray(b.hidden_assumptions) && b.hidden_assumptions.length) {
      lines.push('\n**Hidden assumptions:**\n' + b.hidden_assumptions.map((s: string) => `- ${s}`).join('\n'))
    }
    if (Array.isArray(b.failure_scenarios) && b.failure_scenarios.length) {
      lines.push('\n**Failure scenarios:**\n' + b.failure_scenarios.map((s: string) => `- ${s}`).join('\n'))
    }
    results.push({ mindKey: 'risk', content: lines.join('\n'), sources: [], isExpanded: false })
  }

  // yellow_hat → gain
  if (report.yellow_hat) {
    const y = report.yellow_hat
    const lines: string[] = []
    if (Array.isArray(y.opportunities)) {
      lines.push('**Opportunities:**\n' + y.opportunities.map((o: { opportunity?: string; evidence?: string }) => `- ${o.opportunity ?? o}${o.evidence ? ` — ${o.evidence}` : ''}`).join('\n'))
    }
    if (Array.isArray(y.best_scenarios)) {
      lines.push('\n**Best scenarios:**\n' + y.best_scenarios.map((s: string) => `- ${s}`).join('\n'))
    }
    results.push({ mindKey: 'gain', content: lines.join('\n'), sources: [], isExpanded: false })
  }

  // green_hat → wild
  if (report.green_hat) {
    const g = report.green_hat
    const lines: string[] = []
    if (Array.isArray(g.alternatives) && g.alternatives.length) {
      lines.push('**Alternatives:**\n' + g.alternatives.map((a: string) => `- ${a}`).join('\n'))
    }
    if (Array.isArray(g.what_if) && g.what_if.length) {
      lines.push('\n**What if...:**\n' + g.what_if.map((w: string) => `- ${w}`).join('\n'))
    }
    if (Array.isArray(g.experiments) && g.experiments.length) {
      lines.push('\n**Experiments:**\n' + g.experiments.map((e: string) => `- ${e}`).join('\n'))
    }
    results.push({ mindKey: 'wild', content: lines.join('\n'), sources: [], isExpanded: false })
  }

  // final_blue_hat OR initial_blue_hat → merge
  const blue = report.final_blue_hat ?? report.initial_blue_hat
  if (blue) {
    const lines: string[] = []
    if (blue.summary) lines.push(blue.summary)
    if (Array.isArray(blue.next_steps) && blue.next_steps.length) {
      lines.push('\n**Next steps:**\n' + blue.next_steps.map((a: string) => `- ${a}`).join('\n'))
    }
    if (blue.overall_assessment) lines.push(`\n**Assessment:** ${blue.overall_assessment}`)
    if (blue.recommended_action) lines.push(`**Recommendation:** ${blue.recommended_action}`)
    if (blue.confidence_score !== undefined) lines.push(`\n*Confidence: ${blue.confidence_score}%*`)
    results.push({ mindKey: 'merge', content: lines.join('\n'), sources: [], isExpanded: false })
  }

  return results
}

export function reportToMergeSynthesis(report: AnyReport): MergeSynthesis | null {
  const blue = report.final_blue_hat ?? report.initial_blue_hat
  if (!blue) return null
  const assessmentToVerdict: Record<string, MergeSynthesis['verdict']> = {
    positive: 'GO', negative: 'NO', mixed: 'MIXED', uncertain: 'WAIT',
  }
  return {
    content: blue.summary ?? '',
    confidence: blue.confidence_score ?? 70,
    verdict: assessmentToVerdict[blue.overall_assessment] ?? 'MIXED',
    actions: blue.next_steps ?? [],
  }
}

// Backend DiscussionOutput: flat fields per hat (white_hat_response, red_hat_response, etc.)
export function reportToDiscussionMessages(report: AnyReport): DiscussionMessage[] {
  const disc = report.discussion
  if (!disc) return []

  const HAT_FIELDS: Array<{ field: string; mindKey: MindKey }> = [
    { field: 'white_hat_response', mindKey: 'fact' },
    { field: 'red_hat_response',   mindKey: 'feel' },
    { field: 'black_hat_response', mindKey: 'risk' },
    { field: 'yellow_hat_response',mindKey: 'gain' },
    { field: 'green_hat_response', mindKey: 'wild' },
  ]

  const messages: DiscussionMessage[] = []
  for (const { field, mindKey } of HAT_FIELDS) {
    const content = disc[field] as string | undefined
    if (!content) continue
    messages.push({
      id: `disc-${mindKey}`,
      from: mindKey,
      to: 'all',
      content,
      type: 'statement',
      round: 2,
      timestamp: Date.now(),
    })
  }
  return messages
}

// Backend emergent_insights: plain string array, not {insight, minds} objects
export function reportToEmergentInsights(report: AnyReport): EmergentInsight[] {
  const disc = report.discussion
  if (!disc?.emergent_insights) return []
  return (disc.emergent_insights as string[]).map((text, i) => ({
    id: `ei-${i}`,
    content: text,
    involvedMinds: [],
  }))
}

export function reportConfidence(report: AnyReport): number {
  const blue = report.final_blue_hat ?? report.initial_blue_hat
  return blue?.confidence_score ?? 70
}
