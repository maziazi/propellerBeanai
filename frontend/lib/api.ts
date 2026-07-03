const BASE = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8000'
const PROXY = '/proxy'

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
  const res = await fetch(`${PROXY}${path}`, {
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
  const res = await fetch(`${PROXY}${path}`, { cache: 'no-store' })
  if (!res.ok) {
    const err = await res.json().catch(() => ({ detail: res.statusText }))
    throw new Error(err.detail ?? `HTTP ${res.status}`)
  }
  return res.json()
}

export function clarify(topic: string) {
  return post<ClarifyResponse>('/api/clarify', { topic })
}

// Owner-scoped: hits the Next.js route handler (not the transparent /proxy),
// which injects the signed-in user's id from the session server-side.
export async function postAnalyze(topic: string, service: 'quick-scan' | 'full-prism', context?: string) {
  const res = await fetch('/api/analyze', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ topic, service, context }),
  })
  if (!res.ok) {
    const err = await res.json().catch(() => ({ detail: res.statusText }))
    throw new Error(err.detail ?? `HTTP ${res.status}`)
  }
  return res.json() as Promise<AnalyzeResponse>
}

export function getStatus(jobId: string) {
  return get<StatusResponse>(`/api/status/${jobId}`)
}

// Owner-scoped: the Next.js handler enforces ownership before returning.
export async function getReport(jobId: string) {
  const res = await fetch(`/api/report/${jobId}`, { cache: 'no-store' })
  if (!res.ok) {
    const err = await res.json().catch(() => ({ detail: res.statusText }))
    throw new Error(err.detail ?? `HTTP ${res.status}`)
  }
  return res.json() as Promise<Record<string, unknown>>
}

// Full URL — used directly in <img src> or fetch outside the proxy
export function graphUrl(jobId: string) {
  return `${BASE}/api/graph/${jobId}`
}

export function postDiscuss(jobId: string) {
  return post<{ job_id: string; parent_job_id: string; estimated_seconds: number }>(
    `/api/discuss/${jobId}`,
    {},
  )
}
