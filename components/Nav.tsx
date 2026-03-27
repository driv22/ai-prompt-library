'use client'
import Link from 'next/link'
import { useTheme } from './ThemeProvider'
import { Sun, Moon, BookOpen } from 'lucide-react'
export function Nav() {
  const { theme, toggleTheme } = useTheme()
  return (
    <nav style={{ backgroundColor: 'var(--bg-surface)', borderBottom: '1px solid var(--border)', position: 'sticky', top: 0, zIndex: 50 }}>
      <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '64px' }}>
        <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', textDecoration: 'none' }}>
          <BookOpen size={20} color="var(--accent)" />
          <span style={{ fontFamily: 'var(--font-outfit)', fontWeight: 700, fontSize: '1.05rem', color: 'var(--text-primary)' }}>PromptVault</span>
        </Link>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
          <Link href="/prompts" style={{ color: 'var(--text-secondary)', textDecoration: 'none', fontSize: '0.9rem', fontWeight: 500 }}>Browse</Link>
          <Link href="/about" style={{ color: 'var(--text-secondary)', textDecoration: 'none', fontSize: '0.9rem', fontWeight: 500 }}>About</Link>
          <button onClick={toggleTheme} aria-label="Toggle theme" style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border)', borderRadius: '8px', padding: '6px 8px', cursor: 'pointer', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center' }}>
            {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
          </button>
        </div>
      </div>
    </nav>
  )
}
