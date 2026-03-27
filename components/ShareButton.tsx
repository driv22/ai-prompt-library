'use client'
import { useState } from 'react'
import { Share2 } from 'lucide-react'

export function ShareButton() {
  const [toast, setToast] = useState(false)

  const handleShare = async () => {
    try { await navigator.clipboard.writeText(window.location.href) } catch { /* ignore */ }
    setToast(true)
    setTimeout(() => setToast(false), 2000)
  }

  return (
    <div style={{ position: 'relative', display: 'inline-flex' }}>
      <button onClick={handleShare}
        style={{ display: 'inline-flex', alignItems: 'center', gap: '0.45rem', backgroundColor: 'transparent', color: 'var(--text-secondary)', border: '1px solid var(--border)', borderRadius: '8px', padding: '7px 14px', fontSize: '0.8rem', fontWeight: 600, cursor: 'pointer', transition: 'all 0.15s' }}
        onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--border-focus)'; e.currentTarget.style.color = 'var(--text-primary)' }}
        onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.color = 'var(--text-secondary)' }}>
        <Share2 size={14} /> Share
      </button>
      {toast && (
        <div style={{ position: 'absolute', bottom: 'calc(100% + 8px)', left: '50%', transform: 'translateX(-50%)', backgroundColor: 'var(--bg-elevated)', border: '1px solid var(--border)', borderRadius: '8px', padding: '5px 12px', fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-primary)', whiteSpace: 'nowrap', zIndex: 10, boxShadow: '0 4px 12px rgba(0,0,0,0.15)' }}>
          Link copied!
        </div>
      )}
    </div>
  )
}
