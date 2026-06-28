'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Menu, X } from 'lucide-react'

const G = {
  blue:   '#4285F4',
  red:    '#EA4335',
  yellow: '#FBBC04',
  green:  '#34A853',
}

const NAV_LINKS = [
  { href: '#how-it-works', label: 'How it works', dot: G.blue },
  { href: '#minds',        label: '6 Minds',      dot: G.red },
  { href: '#pricing',      label: 'Pricing',       dot: G.yellow },
  { href: '#croo',         label: 'CROO',          dot: G.green },
]

export function Header() {
  const [open, setOpen] = useState(false)
  const pathname = usePathname()
  const isHome = pathname === '/'

  const resolve = (hash: string) => isHome ? hash : `/${hash}`

  return (
    <header
      className="fixed top-0 left-0 right-0 z-50 bg-white"
      style={{ borderBottom: '1px solid #DADCE0' }}
    >
      <div className="max-w-6xl mx-auto px-5 h-14 flex items-center justify-between">

        {/* Logo */}
        <Link href="/" className="flex items-center gap-0.5 select-none shrink-0">
          {/* Four-color Google-style dots */}
          <span className="flex gap-[3px] mr-2">
            {[G.blue, G.red, G.yellow, G.green].map((c, i) => (
              <span key={i} className="w-2 h-2 rounded-full" style={{ backgroundColor: c }} />
            ))}
          </span>
          <span className="font-sans font-bold text-lg" style={{ color: '#202124', letterSpacing: '-0.01em' }}>
            Prism<span style={{ color: G.blue }}>AI</span>
          </span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-1">
          {NAV_LINKS.map(({ href, label, dot }) => (
            <a
              key={label}
              href={resolve(href)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm transition-colors"
              style={{ color: '#5F6368' }}
              onMouseEnter={e => {
                e.currentTarget.style.backgroundColor = '#F1F3F4'
                e.currentTarget.style.color = '#202124'
              }}
              onMouseLeave={e => {
                e.currentTarget.style.backgroundColor = 'transparent'
                e.currentTarget.style.color = '#5F6368'
              }}
            >
              <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ backgroundColor: dot }} />
              {label}
            </a>
          ))}
          <Link href="/history" className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm transition-colors"
            style={{ color: '#5F6368' }}
            onMouseEnter={e => { e.currentTarget.style.backgroundColor = '#F1F3F4'; e.currentTarget.style.color = '#202124' }}
            onMouseLeave={e => { e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.color = '#5F6368' }}
          >
            History
          </Link>
        </nav>

        {/* CTA + mobile toggle */}
        <div className="flex items-center gap-2">
          <Link
            href="/app"
            className="hidden md:inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium text-white transition-all hover:opacity-90 active:scale-95"
            style={{ backgroundColor: G.blue }}
          >
            Get started
          </Link>
          <button
            className="md:hidden p-1.5 rounded-full"
            style={{ color: '#5F6368' }}
            onClick={() => setOpen(v => !v)}
            aria-label="Toggle menu"
          >
            {open ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile drawer */}
      {open && (
        <div className="md:hidden bg-white border-t" style={{ borderColor: '#DADCE0' }}>
          <div className="px-4 py-3 space-y-1">
            {NAV_LINKS.map(({ href, label, dot }) => (
              <a
                key={label}
                href={resolve(href)}
                onClick={() => setOpen(false)}
                className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm"
                style={{ color: '#202124' }}
              >
                <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: dot }} />
                {label}
              </a>
            ))}
            <Link
              href="/history"
              onClick={() => setOpen(false)}
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm"
              style={{ color: '#202124' }}
            >
              History
            </Link>
            <div className="pt-2 pb-1">
              <Link
                href="/app"
                onClick={() => setOpen(false)}
                className="block text-center py-2.5 rounded-full text-sm font-medium text-white"
                style={{ backgroundColor: G.blue }}
              >
                Get started
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  )
}
