const BASE = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8000'

export interface ClarifyResponse {
  is_vague: boolean
  questions: Array<{
    question: string
    options: Array<{ label: string; value: string; require_input?: boolean }>
  }>
  refined_hint: string
}

export interface AnalyzeResponse {
  job_id: string
  status: string
  estimated_seconds: number
}

export interface StatusResponse {
  status: 'processing' | 'done' | 'failed'
  job_id: string
  error?: string
}

async function post<T>(path: string, body: unknown): Promise<T> {
  const res = await fetch(`${BASE}${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })
  if (!res.ok) {
    const err = await res.json().catch(() => ({ detail: res.statusText }))
    throw new Error(err.detail ?? `HTTP ${res.status}`)
  }
  return res.json()
}

async function get<T>(path: string): Promise<T> {
  const res = await fetch(`${BASE}${path}`, { cache: 'no-store' })
  if (!res.ok) {
    const err = await res.json().catch(() => ({ detail: res.statusText }))
    throw new Error(err.detail ?? `HTTP ${res.status}`)
  }
  return res.json()
}

export function clarify(topic: string) {
  return post<ClarifyResponse>('/api/clarify', { topic })
}

export function postAnalyze(topic: string, service: 'quick-scan' | 'full-prism', context?: string) {
  return post<AnalyzeResponse>('/api/analyze', { topic, service, context })
}

export function getStatus(jobId: string) {
  return get<StatusResponse>(`/api/status/${jobId}`)
}

export function getReport(jobId: string) {
  return get<Record<string, unknown>>(`/api/report/${jobId}`)
}

export function graphUrl(jobId: string) {
  return `${BASE}/api/graph/${jobId}`
}

export function postDiscuss(jobId: string) {
  return post<{ job_id: string; parent_job_id: string; estimated_seconds: number }>(
    `/api/discuss/${jobId}`,
    {},
  )
}
