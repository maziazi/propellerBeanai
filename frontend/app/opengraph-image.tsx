import { ImageResponse } from 'next/og'
import { readFile } from 'node:fs/promises'
import { join } from 'node:path'

export const runtime = 'nodejs'
export const alt = 'BeanAI — Not one AI. A panel that argues first.'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default async function OpengraphImage() {
  const logo = await readFile(join(process.cwd(), 'public/logos/PropellerBeanAI.png'))
  const logoSrc = `data:image/png;base64,${logo.toString('base64')}`

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%', height: '100%', display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'center', backgroundColor: '#FFFFFF',
          backgroundImage:
            'linear-gradient(rgba(0,0,0,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,0.06) 1px, transparent 1px)',
          backgroundSize: '48px 48px',
        }}
      >
        <img src={logoSrc} width={140} height={140} alt="" style={{ marginBottom: 32 }} />
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 22 }}>
          {['#4182EB', '#E24231', '#F6BA18', '#169F53'].map((c) => (
            <div key={c} style={{ width: 16, height: 16, borderRadius: 999, backgroundColor: c }} />
          ))}
          <div style={{ display: 'flex', fontSize: 40, fontWeight: 800, color: '#111' }}>
            <span>Bean</span>
            <span style={{ color: '#4182EB' }}>AI</span>
          </div>
        </div>
        <div style={{ fontSize: 58, fontWeight: 900, color: '#000', letterSpacing: '-2px', textAlign: 'center', lineHeight: 1.05, maxWidth: 900 }}>
          Not one AI. A panel that argues first.
        </div>
        <div style={{ fontSize: 26, color: '#5F6368', marginTop: 20 }}>
          Six minds · one verdict · on-chain via CROO
        </div>
      </div>
    ),
    { ...size },
  )
}
