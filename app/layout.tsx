import type { Metadata } from 'next'
import { Outfit, DM_Sans, JetBrains_Mono } from 'next/font/google'
import './globals.css'
import { Nav } from '@/components/Nav'
import { Footer } from '@/components/Footer'
import { ThemeProvider } from '@/components/ThemeProvider'

const outfit = Outfit({ subsets: ['latin'], variable: '--font-outfit', display: 'swap' })
const dmSans = DM_Sans({ subsets: ['latin'], variable: '--font-dm-sans', display: 'swap' })
const jetbrainsMono = JetBrains_Mono({ subsets: ['latin'], variable: '--font-jetbrains', display: 'swap' })

export const metadata: Metadata = {
  title: 'The AI Prompt Library — Enterprise-Grade Prompts for Microsoft 365',
  description: 'Curated AI prompts for Microsoft 365 Copilot, organized across 20 categories with enterprise demo datasets for finance, legal, operations, sales, and technology professionals.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${outfit.variable} ${dmSans.variable} ${jetbrainsMono.variable}`}>
        <ThemeProvider>
          <Nav />
          <main>{children}</main>
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  )
}
