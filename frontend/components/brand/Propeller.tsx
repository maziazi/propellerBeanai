'use client'

import Image from 'next/image'

const LOGO = '/logos/PropellerBeanAI.png'

/** The Propeller · BeanAI emblem (square 1130×1130 source). */
export function BrandMark({ size = 40, className, style }: { size?: number; className?: string; style?: React.CSSProperties }) {
  return (
    <Image
      src={LOGO}
      alt="Propeller · BeanAI"
      width={size}
      height={size}
      priority={false}
      className={className}
      style={{ objectFit: 'contain', ...style }}
    />
  )
}

/** Spinning propeller — used as the "thinking" mascot in loading states. */
export function PropellerSpinner({ size = 44 }: { size?: number }) {
  return (
    <>
      <style>{`@keyframes prop-spin{to{transform:rotate(360deg)}} .prop-spin{animation:prop-spin 1.6s linear infinite}`}</style>
      <span className="prop-spin" style={{ display: 'inline-flex', width: size, height: size }}>
        <BrandMark size={size} />
      </span>
    </>
  )
}

/**
 * Branded placeholder / empty-state: the Propeller logo with a caption below.
 * Use for empty lists, missing partner logos, and 404s.
 */
export function BrandPlaceholder({
  size = 56, title, subtitle, muted = false,
}: { size?: number; title: string; subtitle?: string; muted?: boolean }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: 4 }}>
      <BrandMark size={size} style={{ opacity: muted ? 0.5 : 0.9, filter: muted ? 'grayscale(0.4)' : 'none' }} />
      <p style={{ fontFamily: "var(--font-inter), Inter, sans-serif", fontSize: 13.5, fontWeight: 600, color: '#3C4043', margin: '6px 0 0' }}>{title}</p>
      {subtitle && <p style={{ fontFamily: "var(--font-inter), Inter, sans-serif", fontSize: 12, color: '#9AA0A6', margin: 0, maxWidth: 240, lineHeight: 1.4 }}>{subtitle}</p>}
    </div>
  )
}
