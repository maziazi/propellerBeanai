'use client'

import { useState } from 'react'
import { BrandMark } from '@/components/brand/Propeller'

const LOGOS = [
  { name: 'groq' },
  { name: 'gemini' },
  { name: 'anthropic' },
  { name: 'tavily' },
  { name: 'croo' },
]

function LogoSlot({ name }: { name: string }) {
  const [failed, setFailed] = useState(false)
  return (
    <div className="flex flex-col items-center gap-1.5">
      <div
        className="w-14 h-14 rounded-xl flex items-center justify-center overflow-hidden"
        style={{ backgroundColor: 'rgba(250,250,247,0.18)', border: '1px solid rgba(250,250,247,0.22)' }}
        title={name}
      >
        {failed ? (
          <BrandMark size={30} style={{ opacity: 0.85 }} />
        ) : (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={`/logos/${name}.png`}
            alt={name}
            className="max-h-6 max-w-[46px] object-contain opacity-85"
            onError={() => setFailed(true)}
          />
        )}
      </div>
      <span className="text-[10px] font-medium capitalize" style={{ color: 'rgba(250,250,247,0.7)' }}>{name}</span>
    </div>
  )
}

export function TechStackRow() {
  return (
    <div className="flex items-start justify-center gap-4 flex-wrap">
      {LOGOS.map((logo) => (
        <LogoSlot key={logo.name} name={logo.name} />
      ))}
    </div>
  )
}
