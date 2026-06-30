'use client'

import { useState, useEffect, useMemo } from 'react'
import Link from 'next/link'
import { useRouter, usePathname } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Plus, Search, PanelLeftClose, PanelLeft,
  MessageSquare, Settings, ChevronRight,
} from 'lucide-react'

const G = {
  blue:     '#4182EB',
  red:      '#E24231',
  yellow:   '#F6BB14',
  green:    '#169F53',
  text:     '#1A1A1A',
  text2:    '#5F6368',
  bg:       '#FFFFFF',
  surface:  '#F7F7F5',
  surface2: '#EFEFEC',
  border:   '#E6E6E1',
}

interface HistoryRecord {
  id: string
  topic: string
  service: 'quick-scan' | 'full-prism'
  confidence: number
  created_at: string
}

function groupByDate(records: HistoryRecord[]) {
  const now = new Date()
  const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime()
  const dayMs = 86_400_000
  const groups: Record<string, HistoryRecord[]> = {
    Today: [], Yesterday: [], 'Previous 7 days': [], Older: [],
  }
  for (const r of records) {
    const t = r.created_at ? new Date(r.created_at).getTime() : 0
    if (t >= startOfToday) groups.Today.push(r)
    else if (t >= startOfToday - dayMs) groups.Yesterday.push(r)
    else if (t >= startOfToday - 7 * dayMs) groups['Previous 7 days'].push(r)
    else groups.Older.push(r)
  }
  return Object.entries(groups).filter(([, v]) => v.length > 0)
}

export function WorkspaceSidebar() {
  const router = useRouter()
  const pathname = usePathname()
  const [history, setHistory] = useState<HistoryRecord[]>([])
  const [loading, setLoading] = useState(true)
  const [collapsed, setCollapsed] = useState(false)
  const [query, setQuery] = useState('')
  const [mobileOpen, setMobileOpen] = useState(false)

  // Refetch history whenever we land on a new route (e.g. after an analysis completes)
  useEffect(() => {
    const base = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8000'
    fetch(`${base}/api/history`, { cache: 'no-store' })
      .then(r => r.ok ? r.json() : [])
      .then(data => { setHistory(Array.isArray(data) ? data : []); setLoading(false) })
      .catch(() => setLoading(false))
  }, [pathname])

  // Close the mobile drawer on navigation
  useEffect(() => { setMobileOpen(false) }, [pathname])

  const filtered = useMemo(() => {
    if (!query.trim()) return history
    const q = query.toLowerCase()
    return history.filter(r => (r.topic || '').toLowerCase().includes(q))
  }, [history, query])

  const grouped = useMemo(() => groupByDate(filtered), [filtered])

  const activeId = pathname.startsWith('/results/')
    ? pathname.split('/')[2]
    : null

  return (
    <>
      {/* Floating mobile open button */}
      <button
        onClick={() => setMobileOpen(true)}
        className="md:hidden fixed top-3 left-3 z-30 flex items-center justify-center w-9 h-9 rounded-lg"
        style={{ backgroundColor: G.bg, border: `1px solid ${G.border}`, color: G.text2 }}
      >
        <PanelLeft size={18} />
      </button>

      {/* Mobile overlay */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            className="fixed inset-0 z-40 bg-black/30 md:hidden"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={() => setMobileOpen(false)}
          />
        )}
      </AnimatePresence>

      <aside
        className={[
          'z-50 flex flex-col shrink-0 transition-all duration-200',
          'fixed inset-y-0 left-0 md:static md:translate-x-0',
          mobileOpen ? 'translate-x-0' : '-translate-x-full',
        ].join(' ')}
        style={{
          width: collapsed ? 64 : 268,
          backgroundColor: G.surface,
          borderRight: `1px solid ${G.border}`,
        }}
      >
        {/* Header: logo + collapse */}
        <div className="flex items-center justify-between h-14 px-3 shrink-0">
          {!collapsed && (
            <Link href="/" className="flex items-center gap-2 min-w-0">
              <span className="flex gap-[3px]">
                {[G.blue, G.red, G.yellow, G.green].map((c, i) => (
                  <span key={i} className="w-2 h-2 rounded-full" style={{ backgroundColor: c }} />
                ))}
              </span>
              <span className="font-bold text-[15px] truncate">
                Bean<span style={{ color: G.blue }}>AI</span>
              </span>
            </Link>
          )}
          <button
            onClick={() => setCollapsed(c => !c)}
            className="hidden md:flex items-center justify-center w-8 h-8 rounded-lg transition-colors hover:bg-black/5"
            style={{ color: G.text2 }}
            title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            {collapsed ? <PanelLeft size={17} /> : <PanelLeftClose size={17} />}
          </button>
        </div>

        {/* New analysis */}
        <div className="px-3 pb-2 shrink-0">
          <button
            onClick={() => { setQuery(''); router.push('/app') }}
            className={[
              'flex items-center rounded-xl font-semibold text-sm transition-all w-full',
              collapsed ? 'justify-center h-10' : 'gap-2 px-3 h-10',
            ].join(' ')}
            style={{ backgroundColor: G.blue, color: '#fff' }}
            title="New analysis"
          >
            <Plus size={17} />
            {!collapsed && 'New analysis'}
          </button>
        </div>

        {/* Search */}
        {!collapsed && (
          <div className="px-3 pb-2 shrink-0">
            <div
              className="flex items-center gap-2 px-2.5 h-9 rounded-lg"
              style={{ backgroundColor: G.bg, border: `1px solid ${G.border}` }}
            >
              <Search size={14} style={{ color: G.text2 }} />
              <input
                value={query}
                onChange={e => setQuery(e.target.value)}
                placeholder="Search analyses"
                className="flex-1 bg-transparent text-sm outline-none placeholder:text-[#9AA0A6]"
              />
            </div>
          </div>
        )}

        {/* History list */}
        <div className="flex-1 overflow-y-auto px-2 pt-1 pb-3">
          {collapsed ? (
            <div className="flex flex-col items-center gap-1 pt-1">
              {filtered.slice(0, 8).map(r => (
                <Link
                  key={r.id}
                  href={`/results/${r.id}`}
                  className="flex items-center justify-center w-10 h-10 rounded-lg transition-colors hover:bg-black/5"
                  title={r.topic}
                  style={{ color: r.id === activeId ? G.blue : G.text2 }}
                >
                  <MessageSquare size={16} />
                </Link>
              ))}
            </div>
          ) : loading ? (
            <div className="space-y-1.5 px-1 pt-2">
              {[1, 2, 3, 4].map(i => (
                <div key={i} className="h-8 rounded-lg animate-pulse" style={{ backgroundColor: G.surface2 }} />
              ))}
            </div>
          ) : grouped.length === 0 ? (
            <p className="text-xs px-2 pt-4" style={{ color: '#9AA0A6' }}>
              {query ? 'No matches.' : 'No analyses yet.'}
            </p>
          ) : (
            grouped.map(([label, items]) => (
              <div key={label} className="mb-3">
                <p
                  className="text-[10px] font-semibold uppercase tracking-wider px-2 mb-1"
                  style={{ color: '#9AA0A6' }}
                >
                  {label}
                </p>
                <div className="space-y-0.5">
                  {items.map(r => {
                    const isFull = r.service === 'full-prism'
                    const isActive = r.id === activeId
                    return (
                      <Link
                        key={r.id}
                        href={`/results/${r.id}`}
                        className="group flex items-center gap-2 px-2 py-2 rounded-lg transition-colors hover:bg-black/5"
                        style={isActive ? { backgroundColor: G.surface2 } : undefined}
                      >
                        <span
                          className="w-1.5 h-1.5 rounded-full shrink-0"
                          style={{ backgroundColor: isFull ? G.blue : G.text2 }}
                        />
                        <span className="flex-1 text-[13px] truncate" style={{ color: G.text }}>
                          {r.topic || '(untitled)'}
                        </span>
                        <ChevronRight
                          size={13}
                          className="opacity-0 group-hover:opacity-100 transition-opacity shrink-0"
                          style={{ color: '#9AA0A6' }}
                        />
                      </Link>
                    )
                  })}
                </div>
              </div>
            ))
          )}
        </div>

        {/* Account footer */}
        <div className="shrink-0 p-2" style={{ borderTop: `1px solid ${G.border}` }}>
          <button
            className={[
              'flex items-center rounded-xl transition-colors hover:bg-black/5 w-full',
              collapsed ? 'justify-center h-11' : 'gap-2.5 px-2 py-2',
            ].join(' ')}
            title="Account"
          >
            <span
              className="w-7 h-7 rounded-full flex items-center justify-center text-[11px] font-bold text-white shrink-0"
              style={{ backgroundColor: G.text }}
            >
              U
            </span>
            {!collapsed && (
              <span className="flex-1 min-w-0 text-left">
                <span className="block text-[13px] font-medium truncate">Your workspace</span>
                <span className="block text-[11px] truncate" style={{ color: G.text2 }}>All features unlocked</span>
              </span>
            )}
            {!collapsed && <Settings size={15} style={{ color: G.text2 }} />}
          </button>
        </div>
      </aside>
    </>
  )
}
