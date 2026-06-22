import { cn } from '@/lib/utils'
import type { ReactNode } from 'react'

interface MonoTextProps {
  children: ReactNode
  className?: string
  as?: 'span' | 'p' | 'div' | 'code'
}

export function MonoText({ children, className, as: Tag = 'span' }: MonoTextProps) {
  return (
    <Tag className={cn('font-mono', className)}>
      {children}
    </Tag>
  )
}
