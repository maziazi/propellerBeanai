'use client'

import { useState, useEffect, useCallback } from 'react'

export type AuthUser = { id: string; method: 'email' | 'wallet' }

/** Reads the session from /api/auth/me and exposes a logout action. */
export function useAuth() {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let active = true
    fetch('/api/auth/me', { cache: 'no-store' })
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => { if (active) setUser(d?.user ?? null) })
      .catch(() => { if (active) setUser(null) })
      .finally(() => { if (active) setLoading(false) })
    return () => { active = false }
  }, [])

  const logout = useCallback(async () => {
    try { await fetch('/api/auth/logout', { method: 'POST' }) } catch { /* ignore */ }
    setUser(null)
    window.location.href = '/'
  }, [])

  return { user, loading, logout }
}

/** Human-readable label for a user (email as-is, wallet shortened). */
export function authLabel(user: AuthUser): string {
  if (user.method === 'wallet' && user.id.startsWith('0x')) {
    return `${user.id.slice(0, 6)}…${user.id.slice(-4)}`
  }
  return user.id
}

/** Single-character avatar initial. */
export function authInitial(user: AuthUser): string {
  if (user.method === 'wallet') return '◈'
  return (user.id[0] || 'U').toUpperCase()
}
