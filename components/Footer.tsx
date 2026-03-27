import Link from 'next/link'
import { BookOpen } from 'lucide-react'
export function Footer() {
  return (
    <footer style={{ backgroundColor: 'var(--bg-surface)', borderTop: '1px solid var(--border)', padding: '3rem 1.5rem', marginTop: '6rem' }}>
      <div style={{ maxWidth: '1280px', margin: '0 auto', textAlign: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
          <BookOpen size={18} color="var(--accent)" />
          <span style={{ fontFamily: 'var(--font-outfit)', fontWeight: 700, color: 'var(--text-primary)' }}>Prompt Vault</span>
        </div>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginBottom: '1rem' }}>Enterprise-grade AI prompts for Microsoft 365 Copilot.</p>
        <div style={{ display: 'flex', gap: '2rem', justifyContent: 'center' }}>
          <Link href="/prompts" style={{ color: 'var(--text-muted)', textDecoration: 'none', fontSize: '0.875rem' }}>Browse</Link>
          <Link href="/about" style={{ color: 'var(--text-muted)', textDecoration: 'none', fontSize: '0.875rem' }}>About</Link>
        </div>
      </div>
    </footer>
  )
}
