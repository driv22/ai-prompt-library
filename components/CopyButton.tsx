'use client'
import { useState } from 'react'
import { Copy, Check } from 'lucide-react'
export function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false)
  const [toast, setToast] = useState(false)
  const handleCopy = async () => {
    try { await navigator.clipboard.writeText(text) } catch {
      const el = document.createElement('textarea')
      el.value = text; document.body.appendChild(el); el.select()
      document.execCommand('copy'); document.body.removeChild(el)
    }
    setCopied(true); setToast(true)
    setTimeout(() => setCopied(false), 2000)
    setTimeout(() => setToast(false), 2500)
  }
  return (
    <>
      <button onClick={handleCopy} aria-label="Copy prompt" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.75rem 1.5rem', borderRadius: '10px', border: 'none', cursor: 'pointer', fontSize: '0.9rem', fontWeight: 600, minHeight: '44px', transition: 'all 0.2s', backgroundColor: copied ? 'var(--success-dim)' : 'var(--accent)', color: copied ? 'var(--success)' : 'white' }}>
        {copied ? <Check size={16} /> : <Copy size={16} />}
        {copied ? '✓ Copied!' : 'Copy Prompt'}
      </button>
      {toast && (
        <div style={{ position: 'fixed', bottom: '1.5rem', right: '1.5rem', backgroundColor: 'var(--bg-elevated)', border: '1px solid var(--success)', color: 'var(--success)', padding: '0.75rem 1.25rem', borderRadius: '10px', fontSize: '0.875rem', fontWeight: 500, zIndex: 9999, display: 'flex', alignItems: 'center', gap: '0.5rem', boxShadow: '0 8px 32px rgba(0,0,0,0.3)' }}>
          <Check size={14} /> Prompt copied to clipboard
        </div>
      )}
    </>
  )
}
