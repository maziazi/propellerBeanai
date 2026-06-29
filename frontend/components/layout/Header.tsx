'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import {
  ChevronDown, Monitor, Terminal, Zap,
  FileCheck, MessageSquare, Network, Menu, X,
  Lightbulb, ShieldCheck, Search, GitBranch,
} from 'lucide-react'

// ── Constants ─────────────────────────────────────────────────────────────────

type MenuKey = 'products' | 'solutions' | 'features' | null

const BLUE = '#4182EB'
const F = "'TWK Lausanne Pan', var(--font-inter), Inter, -apple-system, sans-serif"
const PANEL_W = 720 // all three dropdown cards share this fixed width

// ── Data ──────────────────────────────────────────────────────────────────────

const PRODUCTS = [
  { name: 'Website', subtitle: 'Full experience, no setup',  Icon: Monitor,  href: '/app' },
  { name: 'CLI',     subtitle: 'For developers in terminal', Icon: Terminal, href: '#' },
  { name: 'CROO',   subtitle: 'For AI agents via A2A',      Icon: Zap,      href: '#croo' },
]

const SOL_RIGHT = [
  { name: 'Automate Reasoning',      sub: 'For AI agents & pipelines',    Icon: Zap },
]
const SOL_CENTER = [
  { name: 'Make a Hard Decision',    sub: 'When two options feel equal',   Icon: GitBranch },
  { name: 'Research with Perspective', sub: 'Search + six lenses, one shot', Icon: Search },
]
const SOL_LEFT  = [
  { name: 'Validate an Idea',        sub: 'Before you spend time or money', Icon: Lightbulb },
  { name: 'Stress-Test a Plan',      sub: 'Find blind spots early',         Icon: ShieldCheck },
]

const MINDS_A = [
  { name: 'White Hat',  sub: 'Facts & data',        color: '#9AA0A6' },
  { name: 'Red Hat',    sub: 'Emotion & intuition', color: '#EA4335' },
  { name: 'Black Hat',  sub: 'Risks & caution',     color: '#3C4043' },
]
const MINDS_B = [
  { name: 'Yellow Hat', sub: 'Gains & opportunity',   color: '#FBBC04' },
  { name: 'Green Hat',  sub: 'Creative alternatives', color: '#34A853' },
  { name: 'Blue Hat',   sub: 'Synthesis & verdict',   color: BLUE },
]
const ENGINES = [
  { name: 'Debate Engine',   sub: 'Minds argue before agreeing', Icon: MessageSquare },
  { name: 'Knowledge Graph', sub: 'Interactive concept map',     Icon: Network },
]

// ── Shared primitives ─────────────────────────────────────────────────────────

function IconBox({ color, Icon }: { color?: string; Icon?: React.ElementType }) {
  return (
    <div
      className="icon-box"
      style={{
        width: 30, height: 30, borderRadius: 7, flexShrink: 0,
        backgroundColor: color ? `${color}18` : '#F1F3F4',
        border: `1px solid ${color ? `${color}35` : '#DADCE0'}`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        transition: 'background-color 0.15s ease, border-color 0.15s ease',
      }}
    >
      {Icon
        ? <Icon size={13} color={color || '#5F6368'} />
        : <div style={{ width: 10, height: 10, borderRadius: 3, backgroundColor: color || '#9AA0A6' }} />
      }
    </div>
  )
}

// [icon] [name / subtitle]
function CardItem({ name, sub, Icon, color, href }: {
  name: string; sub?: string; Icon?: React.ElementType; color?: string; href?: string
}) {
  const inner = (
    <div
      className="card-item"
      style={{
        display: 'flex', alignItems: 'center', gap: 9,
        borderRadius: 9, padding: '7px 9px', cursor: 'pointer',
        border: '0.5px solid transparent',
        transition: 'background-color 0.15s ease, border-color 0.15s ease',
        flex: 1,
      }}
    >
      <IconBox color={color} Icon={Icon} />
      <div style={{ minWidth: 0 }}>
        <p className="card-name" style={{ fontFamily: F, fontSize: 12, fontWeight: 600, color: '#202124', lineHeight: 1.3, transition: 'color 0.15s ease', whiteSpace: 'nowrap' }}>{name}</p>
        {sub && <p className="card-sub" style={{ fontFamily: F, fontSize: 11, color: '#5F6368', marginTop: 1, lineHeight: 1.3, transition: 'color 0.15s ease' }}>{sub}</p>}
      </div>
    </div>
  )
  return href
    ? <Link href={href} style={{ textDecoration: 'none', display: 'flex', flex: 1 }}>{inner}</Link>
    : inner
}

function VDivider() {
  return (
    <div style={{
      width: 1.5, backgroundColor: '#E8EAED', borderRadius: 1,
      alignSelf: 'stretch', margin: '6px 6px', flexShrink: 0,
    }} />
  )
}

// ── Dropdown panels (all share PANEL_W) ───────────────────────────────────────

function ProductsPanel() {
  return (
    <div style={{ display: 'flex', width: PANEL_W, padding: '10px 8px', gap: 2 }}>
      {PRODUCTS.map(p => (
        <CardItem key={p.name} name={p.name} sub={p.subtitle} Icon={p.Icon} href={p.href} />
      ))}
    </div>
  )
}

function SolutionsPanel() {
  return (
    <div style={{ display: 'flex', width: PANEL_W, padding: '10px 8px', alignItems: 'stretch', gap: 0 }}>
      
       {/* Right — two stacked */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 2, flex: 1 }}>
        {SOL_LEFT.map(s => <CardItem key={s.name} name={s.name} sub={s.sub} Icon={s.Icon} />)}
      </div>

      <VDivider />

      {/* Centre — two stacked */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 2, flex: 1 }}>
        {SOL_CENTER.map(s => <CardItem key={s.name} name={s.name} sub={s.sub} Icon={s.Icon} />)}
      </div>

      <VDivider />

      {/* Left — single item centred */}
        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', flex: 1 }}>
          {SOL_RIGHT.map(s => <CardItem key={s.name} name={s.name} sub={s.sub} Icon={s.Icon} />)}
        </div>
    </div>
  )
}

function FeaturesPanel() {
  return (
    <div style={{ display: 'flex', width: PANEL_W, padding: '10px 8px', alignItems: 'stretch' }}>
      {/* Decision Receipt — flex: 1 (equal share) */}
      <div style={{ display: 'flex', alignItems: 'center', flex: 1, minWidth: 0 }}>
        <CardItem name="Decision Receipt" sub="SHA-256 verifiable output" Icon={FileCheck} />
      </div>

      <VDivider />

      {/* Engines — flex: 1 (equal share) */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 2, justifyContent: 'center', flex: 1, minWidth: 0 }}>
        {ENGINES.map(e => <CardItem key={e.name} name={e.name} sub={e.sub} Icon={e.Icon} />)}
      </div>

      <VDivider />

      {/* 6 Minds — flex: 2 (two sub-columns, double share) */}
      <div style={{ display: 'flex', gap: 2, flex: 2, minWidth: 0 }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 2, flex: 1, minWidth: 0 }}>
          {MINDS_A.map(m => <CardItem key={m.name} name={m.name} sub={m.sub} color={m.color} />)}
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 2, flex: 1, minWidth: 0 }}>
          {MINDS_B.map(m => <CardItem key={m.name} name={m.name} sub={m.sub} color={m.color} />)}
        </div>
      </div>
    </div>
  )
}

// ── Main ──────────────────────────────────────────────────────────────────────

export function Header() {
  const [menu, setMenu] = useState<MenuKey>(null)
  const [mobile, setMobile] = useState(false)
  const ref = useRef<HTMLElement>(null)

  useEffect(() => {
    const fn = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setMenu(null)
    }
    document.addEventListener('mousedown', fn)
    return () => document.removeEventListener('mousedown', fn)
  }, [])

  useEffect(() => {
    const fn = (e: KeyboardEvent) => {
      if (e.key === 'Escape') { setMenu(null); setMobile(false) }
    }
    document.addEventListener('keydown', fn)
    return () => document.removeEventListener('keydown', fn)
  }, [])

  const toggle = (key: MenuKey) => setMenu(prev => prev === key ? null : key)

  const NAV_ITEMS: { key: MenuKey; label: string }[] = [
    { key: 'products',  label: 'Products' },
    { key: 'solutions', label: 'Solutions' },
    { key: 'features',  label: 'Features' },
  ]

  return (
    <>
      <style>{`
        .card-item:hover { background-color: ${BLUE}; border: 0.5px solid rgba(0,0,0,0.80); }
        .card-item:hover .card-name { color: #FFFFFF !important; }
        .card-item:hover .card-sub  { color: rgba(255,255,255,0.78) !important; }
        .card-item:hover .icon-box  {
          background-color: rgba(255,255,255,0.18) !important;
          border-color: rgba(255,255,255,0.28) !important;
        }
      `}</style>

      {/* Page backdrop when dropdown open */}
      {menu && (
        <div
          onClick={() => setMenu(null)}
          style={{
            position: 'fixed', inset: 0, top: 56, zIndex: 40,
            backdropFilter: 'blur(6px)', WebkitBackdropFilter: 'blur(6px)',
            backgroundColor: 'rgba(0,0,0,0.04)',
          }}
        />
      )}

      <header
        ref={ref}
        style={{
          position: 'fixed', top: 0, left: 0, right: 0, zIndex: 50,
          backgroundColor: 'rgba(255,255,255,0.50)',
          backdropFilter: 'blur(5px)', WebkitBackdropFilter: 'blur(5px)',
          borderBottom: '1px solid rgba(0,0,0,0.08)',
        }}
      >
        {/* ── Main bar ── */}
        <div style={{
          maxWidth: 960, margin: '0 auto', padding: '0 24px',
          height: 56, display: 'flex', alignItems: 'center',
        }}>

          {/* Left: logo + nav */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 28 }}>
            <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: 6, textDecoration: 'none', flexShrink: 0 }}>
              <span style={{ display: 'flex', gap: 3 }}>
                {[BLUE, '#EA4335', '#FBBC04', '#34A853'].map((c, i) => (
                  <span key={i} style={{ width: 7, height: 7, borderRadius: '50%', backgroundColor: c, display: 'block' }} />
                ))}
              </span>
              <span style={{ fontFamily: F, fontWeight: 700, fontSize: 15, color: '#202124', letterSpacing: '-0.01em' }}>
                Bean<span style={{ color: BLUE }}>AI</span>
              </span>
            </Link>

            <nav className="hidden md:flex" style={{ alignItems: 'center', gap: 24 }}>
              {NAV_ITEMS.map(({ key, label }) => (
                <button
                  key={key}
                  onClick={() => toggle(key)}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 3,
                    fontFamily: F, fontSize: 12, fontWeight: 500,
                    color: menu === key ? BLUE : '#202124',
                    background: 'none', border: 'none', cursor: 'pointer', padding: 0,
                  }}
                >
                  {label}
                  <ChevronDown size={10} style={{
                    color: menu === key ? BLUE : '#5F6368',
                    transform: menu === key ? 'rotate(180deg)' : 'rotate(0deg)',
                    transition: 'transform 0.18s ease',
                  }} />
                </button>
              ))}
              <Link
                href="#pricing"
                style={{ fontFamily: F, fontSize: 12, fontWeight: 500, color: '#202124', textDecoration: 'none' }}
              >
                Pricing
              </Link>
            </nav>
          </div>

          {/* Right: Login · Get Started */}
          <div className="hidden md:flex" style={{ alignItems: 'center', gap: 16, marginLeft: 'auto' }}>
            <Link
              href="/login"
              style={{ fontFamily: F, fontSize: 12, fontWeight: 500, color: '#202124', textDecoration: 'none' }}
            >
              Login
            </Link>
            <Link
              href="/app"
              style={{
                fontFamily: F, fontSize: 12, fontWeight: 600,
                color: '#FFFFFF', backgroundColor: BLUE,
                border: '0.5px solid rgba(0,0,0,0.75)',
                borderRadius: 90, padding: '7px 18px',
                textDecoration: 'none', display: 'inline-flex', alignItems: 'center',
                whiteSpace: 'nowrap',
              }}
            >
              Get Started
            </Link>
          </div>

          {/* Mobile hamburger */}
          <button
            className="md:hidden"
            onClick={() => setMobile(v => !v)}
            style={{ marginLeft: 'auto', background: 'none', border: 'none', cursor: 'pointer', color: '#202124', padding: 4 }}
            aria-label="Toggle menu"
          >
            {mobile ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        {/* ── Dropdown card — fixed width, centred ── */}
        {menu && (
          <div style={{
            position: 'absolute', top: '100%', left: '50%',
            transform: 'translateX(-50%)',
            backgroundColor: '#FFFFFF',
            border: '0.5px solid rgba(0,0,0,0.85)',
            borderRadius: 14,
            boxShadow: '0 8px 24px rgba(0,0,0,0.10)',
            marginTop: 8,
            overflow: 'hidden',
          }}>
            {menu === 'products'  && <ProductsPanel />}
            {menu === 'solutions' && <SolutionsPanel />}
            {menu === 'features'  && <FeaturesPanel />}
          </div>
        )}

        {/* ── Mobile drawer ── */}
        {mobile && (
          <div style={{
            position: 'absolute', top: '100%', left: 0, right: 0,
            backgroundColor: '#FFFFFF',
            border: '0.5px solid rgba(0,0,0,0.85)',
            borderTop: 'none',
            borderRadius: '0 0 14px 14px',
            padding: '12px 20px 20px',
            boxShadow: '0 8px 24px rgba(0,0,0,0.08)',
          }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              {['Products', 'Solutions', 'Features', 'Pricing'].map(item => (
                <a
                  key={item}
                  href={`#${item.toLowerCase()}`}
                  onClick={() => setMobile(false)}
                  style={{
                    fontFamily: F, fontSize: 14, fontWeight: 500, color: '#202124',
                    padding: '10px 12px', borderRadius: 8, textDecoration: 'none', display: 'block',
                  }}
                >
                  {item}
                </a>
              ))}
              <div style={{ borderTop: '1px solid #DADCE0', marginTop: 8, paddingTop: 8, display: 'flex', flexDirection: 'column', gap: 6 }}>
                <Link
                  href="/login"
                  onClick={() => setMobile(false)}
                  style={{ fontFamily: F, fontSize: 14, fontWeight: 500, color: '#202124', padding: '10px 12px', textDecoration: 'none', display: 'block' }}
                >
                  Login
                </Link>
                <Link
                  href="/app"
                  onClick={() => setMobile(false)}
                  style={{
                    fontFamily: F, fontSize: 14, fontWeight: 600, color: '#FFFFFF',
                    backgroundColor: BLUE, borderRadius: 90,
                    border: '0.5px solid rgba(0,0,0,0.75)',
                    padding: '10px 20px', textDecoration: 'none',
                    display: 'block', textAlign: 'center',
                  }}
                >
                  Get Started
                </Link>
              </div>
            </div>
          </div>
        )}
      </header>
    </>
  )
}
