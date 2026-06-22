'use client'

import { useRouter } from 'next/navigation'
import { ArrowLeft } from 'lucide-react'
import { cn } from '@/lib/utils'

interface BackButtonProps {
  href?: string
  label?: string
  className?: string
}

export function BackButton({ href, label = 'Back', className }: BackButtonProps) {
  const router = useRouter()

  const handleClick = () => {
    if (href) {
      router.push(href)
    } else {
      router.back()
    }
  }

  return (
    <button
      onClick={handleClick}
      className={cn(
        'inline-flex items-center gap-2 text-xs font-mono text-slate hover:text-navy transition-colors group',
        className,
      )}
    >
      <ArrowLeft size={14} className="group-hover:-translate-x-0.5 transition-transform" />
      <span>{label}</span>
    </button>
  )
}
