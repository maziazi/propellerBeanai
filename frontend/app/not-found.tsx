import Link from 'next/link'
import { BrandMark } from '@/components/brand/Propeller'

const F = "'TWK Lausanne Pan', var(--font-inter), Inter, -apple-system, sans-serif"
const BLUE = '#4182EB'

export default function NotFound() {
  return (
    <div style={{ position: 'relative', minHeight: '100vh', backgroundColor: '#FFF', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '80px 24px', overflow: 'hidden' }}>
      <div aria-hidden style={{ position: 'absolute', inset: 0, backgroundImage: 'linear-gradient(rgba(0,0,0,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,0.05) 1px, transparent 1px)', backgroundSize: '46px 46px', maskImage: 'radial-gradient(ellipse 55% 50% at 50% 45%, #000 20%, transparent 78%)', WebkitMaskImage: 'radial-gradient(ellipse 55% 50% at 50% 45%, #000 20%, transparent 78%)' }} />
      <div style={{ position: 'relative', zIndex: 2, textAlign: 'center', maxWidth: 420 }}>
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 20 }}>
          <BrandMark size={72} style={{ opacity: 0.9 }} />
        </div>
        <p style={{ fontFamily: 'monospace', fontSize: 12, color: '#9AA0A6', letterSpacing: '0.08em', marginBottom: 8 }}>ERROR 404</p>
        <h1 style={{ fontFamily: F, fontSize: 28, fontWeight: 900, color: '#000', letterSpacing: '-0.02em', marginBottom: 10 }}>
          The panel can&apos;t find this page.
        </h1>
        <p style={{ fontFamily: F, fontSize: 15, color: '#5F6368', lineHeight: 1.6, marginBottom: 28 }}>
          The page you&apos;re looking for doesn&apos;t exist or was moved. Let&apos;s get you back on track.
        </p>
        <div style={{ display: 'flex', gap: 10, justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link href="/" style={{ backgroundColor: BLUE, color: '#FFF', border: '0.5px solid rgba(0,0,0,0.75)', borderRadius: 90, padding: '11px 24px', fontSize: 14, fontWeight: 600, textDecoration: 'none', fontFamily: F }}>
            Back to home
          </Link>
          <Link href="/app" style={{ color: '#000', border: '0.5px solid rgba(0,0,0,0.35)', borderRadius: 90, padding: '11px 24px', fontSize: 14, fontWeight: 500, textDecoration: 'none', fontFamily: F }}>
            Start an analysis
          </Link>
        </div>
      </div>
    </div>
  )
}
