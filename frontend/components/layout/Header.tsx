'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

export function Header() {
  const [scrolled, setScrolled] = useState(false)
  const pathname = usePathname()
  const isHome = pathname === '/'

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handler)
    return () => window.removeEventListener('scroll', handler)
  }, [])

  const navHref = (hash: string) => isHome ? hash : `/${hash}`

  return (
    <header
      className="fixed top-0 left-0 right-0 z-50 backdrop-blur-md"
      style={{ backgroundColor: 'transparent', border: 'none' }}
    >
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-1">
          <span className="font-serif font-bold text-xl text-navy">Bean</span>
          <span className="font-mono font-bold text-xl text-blue">AI</span>
        </Link>
        <nav className="hidden md:flex items-center gap-8">
          <a href={navHref('#how-it-works')} className="text-sm text-slate hover:text-navy transition-colors">How it works</a>
          <a href={navHref('#minds')} className="text-sm text-slate hover:text-navy transition-colors">6 Minds</a>
          <a href={navHref('#pricing')} className="text-sm text-slate hover:text-navy transition-colors">Pricing</a>
          <a href={navHref('#features')} className="text-sm text-slate hover:text-navy transition-colors">Features</a>
          <a href={navHref('#croo')} className="text-sm text-slate hover:text-navy transition-colors">CROO</a>
        </nav>
        <Link href="/analyze" className="bg-blue text-white text-sm font-medium px-4 py-2 rounded-lg hover:bg-blue/90 transition-colors">
          Try Free →
        </Link>
      </div>
    </header>
  )
}
