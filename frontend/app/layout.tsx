import type { Metadata } from 'next'
import { Inter, JetBrains_Mono, Playfair_Display } from 'next/font/google'
import { Providers } from '@/components/layout/Providers'
import './globals.css'

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' })
const jetbrainsMono = JetBrains_Mono({ subsets: ['latin'], variable: '--font-mono-jetbrains' })
const playfair = Playfair_Display({ subsets: ['latin'], variable: '--font-playfair' })

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'),
  title: 'BeanAI — 6 Minds Analysis',
  description: 'Six AI minds. One decision. No blind spots. A callable, on-chain reasoning agent on CROO.',
  openGraph: {
    title: 'BeanAI — Not one AI. A panel that argues first.',
    description: 'Six AI minds analyze your decision, then debate before reaching a verdict.',
    siteName: 'BeanAI',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'BeanAI — Not one AI. A panel that argues first.',
    description: 'Six AI minds analyze your decision, then debate before reaching a verdict.',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${jetbrainsMono.variable} ${playfair.variable}`}>
      <body className="bg-cream text-navy font-sans antialiased">
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  )
}
