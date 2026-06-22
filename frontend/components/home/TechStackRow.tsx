'use client'

const LOGOS = [
  { name: 'groq' },
  { name: 'gemini' },
  { name: 'anthropic' },
  { name: 'tavily' },
  { name: 'croo' },
]

export function TechStackRow() {
  return (
    <div className="flex items-center justify-center gap-3 flex-wrap">
      {LOGOS.map((logo) => (
        <div
          key={logo.name}
          className="w-14 h-8 rounded-lg flex items-center justify-center overflow-hidden"
          style={{
            backgroundColor: 'rgba(250,250,247,0.18)',
            border: '1px solid rgba(250,250,247,0.22)',
          }}
          title={logo.name}
        >
          {/* User will place logo image here */}
          <img
            src={`/logos/${logo.name}.png`}
            alt={logo.name}
            className="max-h-5 max-w-[48px] object-contain opacity-80"
            onError={(e) => {
              // fallback: show placeholder box if image missing
              ;(e.currentTarget as HTMLImageElement).style.display = 'none'
            }}
          />
        </div>
      ))}
    </div>
  )
}
