'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useTheme } from './ThemeProvider'
import { Sun, Moon, BookOpen, Heart, Menu, X } from 'lucide-react'
import { useFavorites } from '@/hooks/useFavorites'

export function Nav() {
  const { theme, toggleTheme } = useTheme()
  const { favorites } = useFavorites()
  const [menuOpen, setMenuOpen] = useState(false)
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768)
    check()
    window.addEventListener('resize', check)
    return () => window.removeEventListener('resize', check)
  }, [])

  // Close menu on resize to desktop
  useEffect(() => {
    if (!isMobile) setMenuOpen(false)
  }, [isMobile])

  const favCount = favorites.size

  const navLinkStyle = {
    color: 'var(--text-secondary)',
    textDecoration: 'none',
    fontSize: '0.9rem',
    fontWeight: 500,
  } as const

  const mobileNavLinkStyle = {
    color: 'var(--text-secondary)',
    textDecoration: 'none',
    fontSize: '1rem',
    fontWeight: 500,
    display: 'block',
    padding: '0.75rem 1.5rem',
    borderBottom: '1px solid var(--border)',
    transition: 'background 0.15s',
  } as const

  return (
    <nav style={{ backgroundColor: 'var(--bg-surface)', borderBottom: '1px solid var(--border)', position: 'sticky', top: 0, zIndex: 50 }}>
      <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '64px' }}>
        {/* Logo */}
        <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', textDecoration: 'none' }}>
          <BookOpen size={20} color="var(--accent)" />
          <span style={{ fontFamily: 'var(--font-outfit)', fontWeight: 700, fontSize: '1.05rem', color: 'var(--text-primary)' }}>Prompt Vault</span>
        </Link>

        {/* Desktop nav */}
        {!isMobile && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
            <Link href="/prompts" style={navLinkStyle}>Prompts</Link>
            <Link href="/agents" style={navLinkStyle}>Agents</Link>
            <Link href="/collections" style={navLinkStyle}>Collections</Link>
            <Link href="/about" style={navLinkStyle}>About</Link>

            {/* Favorites link with count badge */}
            <Link href="/favorites" style={{ ...navLinkStyle, display: 'flex', alignItems: 'center', gap: '5px', position: 'relative' }}>
              <Heart size={16} fill={favCount > 0 ? '#ef4444' : 'none'} color={favCount > 0 ? '#ef4444' : 'var(--text-secondary)'} />
              {favCount > 0 && (
                <span style={{ backgroundColor: '#ef4444', color: 'white', borderRadius: '100px', fontSize: '0.65rem', fontWeight: 700, padding: '1px 5px', lineHeight: 1.4, minWidth: '16px', textAlign: 'center' }}>
                  {favCount}
                </span>
              )}
            </Link>

            <button onClick={toggleTheme} aria-label="Toggle theme" style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border)', borderRadius: '8px', padding: '6px 8px', cursor: 'pointer', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center' }}>
              {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
            </button>
          </div>
        )}

        {/* Mobile: theme toggle + hamburger */}
        {isMobile && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <Link href="/favorites" style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
              <Heart size={18} fill={favCount > 0 ? '#ef4444' : 'none'} color={favCount > 0 ? '#ef4444' : 'var(--text-secondary)'} />
              {favCount > 0 && (
                <span style={{ position: 'absolute', top: '-4px', right: '-6px', backgroundColor: '#ef4444', color: 'white', borderRadius: '100px', fontSize: '0.6rem', fontWeight: 700, padding: '1px 4px', lineHeight: 1.4, minWidth: '14px', textAlign: 'center' }}>
                  {favCount}
                </span>
              )}
            </Link>
            <button onClick={toggleTheme} aria-label="Toggle theme" style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border)', borderRadius: '8px', padding: '6px 8px', cursor: 'pointer', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center' }}>
              {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
            </button>
            <button
              onClick={() => setMenuOpen(o => !o)}
              aria-label={menuOpen ? 'Close menu' : 'Open menu'}
              style={{ background: 'transparent', border: '1px solid var(--border)', borderRadius: '8px', padding: '6px 8px', cursor: 'pointer', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center' }}
            >
              {menuOpen ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>
        )}
      </div>

      {/* Mobile menu dropdown */}
      {isMobile && menuOpen && (
        <div style={{ backgroundColor: 'var(--bg-surface)', borderTop: '1px solid var(--border)', boxShadow: '0 8px 24px rgba(0,0,0,0.15)' }}>
          <Link href="/prompts" style={mobileNavLinkStyle} onClick={() => setMenuOpen(false)}>Prompts</Link>
          <Link href="/agents" style={mobileNavLinkStyle} onClick={() => setMenuOpen(false)}>Agents</Link>
          <Link href="/collections" style={mobileNavLinkStyle} onClick={() => setMenuOpen(false)}>Collections</Link>
          <Link href="/favorites" style={{ ...mobileNavLinkStyle, display: 'flex', alignItems: 'center', gap: '0.5rem' }} onClick={() => setMenuOpen(false)}>
            <Heart size={15} fill={favCount > 0 ? '#ef4444' : 'none'} color={favCount > 0 ? '#ef4444' : 'var(--text-secondary)'} />
            Favorites
            {favCount > 0 && (
              <span style={{ backgroundColor: '#ef4444', color: 'white', borderRadius: '100px', fontSize: '0.65rem', fontWeight: 700, padding: '1px 6px', lineHeight: 1.4 }}>
                {favCount}
              </span>
            )}
          </Link>
          <Link href="/about" style={{ ...mobileNavLinkStyle, borderBottom: 'none' }} onClick={() => setMenuOpen(false)}>About</Link>
        </div>
      )}
    </nav>
  )
}
