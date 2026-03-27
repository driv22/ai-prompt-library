'use client'
import { useState } from 'react'
import { Clapperboard, X, GripVertical, Trash2, ChevronUp, ChevronDown, Loader2, Copy, Check, Download, AlertCircle, Sparkles } from 'lucide-react'
import { useScriptBuilderContext } from './ScriptBuilderContext'

const AUDIENCES = ['Business Decision Makers', 'IT Leaders', 'Finance Team', 'HR & People Team', 'Sales Leaders', 'Operations Team', 'C-Suite / Executive']
const INDUSTRIES = ['Financial Services', 'Healthcare', 'Manufacturing', 'Retail & E-Commerce', 'Technology', 'Professional Services', 'Government & Public Sector', 'Energy & Utilities', 'Education', 'General Business']
const DURATIONS = ['5 minutes', '10 minutes', '15 minutes', '20 minutes', '30 minutes']

export function ScriptBuilderTray() {
  const ctx = useScriptBuilderContext()
  const [open, setOpen] = useState(false)
  const [showForm, setShowForm] = useState(false)
  const [copied, setCopied] = useState(false)
  const [company, setCompany] = useState('')
  const [industry, setIndustry] = useState('General Business')
  const [audience, setAudience] = useState('Business Decision Makers')
  const [duration, setDuration] = useState('10 minutes')

  if (!ctx) return null
  const { selectedPrompts, removePrompt, reorderPrompts, clearAll, generate, script, status, error } = ctx

  const count = selectedPrompts.length
  const isGenerating = status === 'generating'
  const isDone = status === 'done'

  if (count === 0 && !isDone) return null

  const handleGenerate = () => {
    generate({ company, industry, audience, duration })
    setShowForm(false)
  }

  const handleCopy = async () => {
    await navigator.clipboard.writeText(script)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleDownload = () => {
    const blob = new Blob([script], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `demo-script-${company || 'enterprise'}-${Date.now()}.txt`
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <>
      {/* Floating tray button */}
      <button
        onClick={() => setOpen(o => !o)}
        style={{
          position: 'fixed', bottom: '1.5rem', right: '1.5rem', zIndex: 200,
          backgroundColor: 'var(--accent)', color: 'white', border: 'none',
          borderRadius: '14px', padding: '0.75rem 1.25rem',
          display: 'flex', alignItems: 'center', gap: '0.5rem',
          fontFamily: 'var(--font-outfit)', fontWeight: 700, fontSize: '0.9rem',
          cursor: 'pointer', boxShadow: '0 8px 32px rgba(99,102,241,0.4)',
          transition: 'transform 0.15s, box-shadow 0.15s',
        }}
        onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 12px 40px rgba(99,102,241,0.5)' }}
        onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 8px 32px rgba(99,102,241,0.4)' }}
      >
        <Clapperboard size={18} />
        {isDone ? 'View Script' : `Script Builder`}
        {count > 0 && !isDone && (
          <span style={{ backgroundColor: 'white', color: 'var(--accent)', borderRadius: '100px', fontSize: '0.72rem', fontWeight: 800, padding: '1px 7px', marginLeft: '2px' }}>
            {count}
          </span>
        )}
      </button>

      {/* Slide-up panel */}
      {open && (
        <div style={{
          position: 'fixed', bottom: '5rem', right: '1.5rem', zIndex: 199,
          width: '420px', maxWidth: 'calc(100vw - 3rem)',
          backgroundColor: 'var(--bg-surface)', border: '1px solid var(--border)',
          borderRadius: '16px', boxShadow: '0 24px 64px rgba(0,0,0,0.4)',
          overflow: 'hidden', display: 'flex', flexDirection: 'column',
          maxHeight: '80vh',
        }}>
          {/* Header */}
          <div style={{ padding: '1rem 1.25rem', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexShrink: 0 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Clapperboard size={18} style={{ color: 'var(--accent)' }} />
              <span style={{ fontFamily: 'var(--font-outfit)', fontWeight: 700, fontSize: '0.95rem', color: 'var(--text-primary)' }}>
                {isDone ? 'Your Demo Script' : 'Script Builder'}
              </span>
              {count > 0 && !isDone && (
                <span style={{ backgroundColor: 'var(--accent-dim)', color: 'var(--accent)', borderRadius: '100px', fontSize: '0.7rem', fontWeight: 700, padding: '1px 8px' }}>
                  {count}/10 prompts
                </span>
              )}
            </div>
            <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
              {!isDone && count > 0 && (
                <button onClick={clearAll} style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', fontSize: '0.75rem', padding: '4px 8px', borderRadius: '6px' }}>
                  Clear all
                </button>
              )}
              {isDone && (
                <button onClick={clearAll} style={{ background: 'transparent', border: '1px solid var(--border)', cursor: 'pointer', color: 'var(--text-muted)', fontSize: '0.75rem', padding: '4px 10px', borderRadius: '6px' }}>
                  Start over
                </button>
              )}
              <button onClick={() => setOpen(false)} style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', display: 'flex', padding: '4px' }}>
                <X size={16} />
              </button>
            </div>
          </div>

          {/* Body */}
          <div style={{ overflowY: 'auto', flex: 1 }}>

            {/* Generated script view */}
            {isDone && (
              <div style={{ padding: '1rem 1.25rem' }}>
                <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.75rem' }}>
                  <button onClick={handleCopy}
                    style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', padding: '7px 14px', borderRadius: '8px', border: 'none', backgroundColor: copied ? 'var(--success-dim)' : 'var(--accent)', color: copied ? 'var(--success)' : 'white', fontSize: '0.82rem', fontWeight: 600, cursor: 'pointer', flex: 1, justifyContent: 'center' }}>
                    {copied ? <><Check size={14} /> Copied!</> : <><Copy size={14} /> Copy Script</>}
                  </button>
                  <button onClick={handleDownload}
                    style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', padding: '7px 14px', borderRadius: '8px', border: '1px solid var(--border)', backgroundColor: 'transparent', color: 'var(--text-secondary)', fontSize: '0.82rem', fontWeight: 600, cursor: 'pointer' }}>
                    <Download size={14} /> .txt
                  </button>
                </div>
                <pre style={{
                  fontFamily: 'var(--font-dm-sans)', fontSize: '0.8rem', lineHeight: 1.7,
                  color: 'var(--text-primary)', whiteSpace: 'pre-wrap', wordBreak: 'break-word',
                  backgroundColor: 'var(--bg-elevated)', border: '1px solid var(--border)',
                  borderRadius: '10px', padding: '1rem', margin: 0,
                  maxHeight: '400px', overflowY: 'auto',
                }}>
                  {script}
                </pre>
              </div>
            )}

            {/* Generating state */}
            {isGenerating && (
              <div style={{ padding: '3rem 1.25rem', textAlign: 'center' }}>
                <Loader2 size={32} style={{ color: 'var(--accent)', animation: 'spin 1s linear infinite', marginBottom: '1rem' }} />
                <p style={{ fontFamily: 'var(--font-outfit)', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '0.4rem' }}>Writing your script…</p>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.82rem' }}>Claude is crafting a tailored enterprise demo. Usually takes 15–30 seconds.</p>
              </div>
            )}

            {/* Error state */}
            {status === 'error' && (
              <div style={{ padding: '1rem 1.25rem' }}>
                <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'flex-start', backgroundColor: '#ef444420', border: '1px solid #ef444440', borderRadius: '10px', padding: '0.75rem 1rem', marginBottom: '1rem' }}>
                  <AlertCircle size={16} style={{ color: '#ef4444', flexShrink: 0, marginTop: '2px' }} />
                  <p style={{ color: '#ef4444', fontSize: '0.82rem', margin: 0 }}>{error}</p>
                </div>
                <button onClick={() => setShowForm(true)}
                  style={{ width: '100%', padding: '0.7rem', borderRadius: '10px', border: 'none', backgroundColor: 'var(--accent)', color: 'white', fontWeight: 600, cursor: 'pointer', fontSize: '0.88rem' }}>
                  Try Again
                </button>
              </div>
            )}

            {/* Prompt list + form (when not generating/done) */}
            {!isGenerating && !isDone && status !== 'error' && (
              <>
                {/* Selected prompts */}
                {count > 0 && !showForm && (
                  <div style={{ padding: '0.75rem 1.25rem' }}>
                    <p style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--text-muted)', letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: '0.5rem' }}>
                      Selected Prompts — drag to reorder
                    </p>
                    {selectedPrompts.map((p, i) => (
                      <div key={p.id} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem 0.6rem', borderRadius: '8px', backgroundColor: 'var(--bg-elevated)', border: '1px solid var(--border)', marginBottom: '0.4rem' }}>
                        <GripVertical size={14} style={{ color: 'var(--text-muted)', flexShrink: 0, cursor: 'grab' }} />
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <p style={{ fontWeight: 600, fontSize: '0.8rem', color: 'var(--text-primary)', margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{p.title}</p>
                          <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)', margin: 0 }}>{p.category}</p>
                        </div>
                        <div style={{ display: 'flex', gap: '2px', flexShrink: 0 }}>
                          {i > 0 && (
                            <button onClick={() => reorderPrompts(i, i - 1)} style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', padding: '3px', display: 'flex' }}>
                              <ChevronUp size={14} />
                            </button>
                          )}
                          {i < count - 1 && (
                            <button onClick={() => reorderPrompts(i, i + 1)} style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', padding: '3px', display: 'flex' }}>
                              <ChevronDown size={14} />
                            </button>
                          )}
                          <button onClick={() => removePrompt(p.id)} style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: '#ef4444', padding: '3px', display: 'flex' }}>
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </div>
                    ))}
                    <button onClick={() => setShowForm(true)}
                      style={{ width: '100%', marginTop: '0.75rem', padding: '0.7rem', borderRadius: '10px', border: 'none', backgroundColor: 'var(--accent)', color: 'white', fontFamily: 'var(--font-outfit)', fontWeight: 700, cursor: 'pointer', fontSize: '0.9rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
                      <Sparkles size={16} /> Generate Demo Script
                    </button>
                    <p style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textAlign: 'center', marginTop: '0.5rem' }}>
                      Add up to {10 - count} more prompts to strengthen the script
                    </p>
                  </div>
                )}

                {/* Script options form */}
                {showForm && (
                  <div style={{ padding: '0.75rem 1.25rem' }}>
                    <button onClick={() => setShowForm(false)} style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', fontSize: '0.8rem', marginBottom: '0.75rem', padding: '0', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                      ← Back to prompts
                    </button>
                    <p style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--text-muted)', letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: '0.75rem' }}>
                      Customize Your Script
                    </p>

                    {[
                      { label: 'Company Name', node: (
                        <input type="text" placeholder='e.g. "Contoso Financial"' value={company} onChange={e => setCompany(e.target.value)}
                          style={{ width: '100%', padding: '0.6rem 0.75rem', borderRadius: '8px', border: '1px solid var(--border)', backgroundColor: 'var(--bg-elevated)', color: 'var(--text-primary)', fontSize: '0.85rem', outline: 'none', boxSizing: 'border-box' }}
                          onFocus={e => (e.currentTarget.style.borderColor = 'var(--border-focus)')}
                          onBlur={e => (e.currentTarget.style.borderColor = 'var(--border)')} />
                      )},
                      { label: 'Industry', node: (
                        <select value={industry} onChange={e => setIndustry(e.target.value)}
                          style={{ width: '100%', padding: '0.6rem 0.75rem', borderRadius: '8px', border: '1px solid var(--border)', backgroundColor: 'var(--bg-elevated)', color: 'var(--text-primary)', fontSize: '0.85rem', outline: 'none', cursor: 'pointer' }}>
                          {INDUSTRIES.map(i => <option key={i} value={i}>{i}</option>)}
                        </select>
                      )},
                      { label: 'Audience', node: (
                        <select value={audience} onChange={e => setAudience(e.target.value)}
                          style={{ width: '100%', padding: '0.6rem 0.75rem', borderRadius: '8px', border: '1px solid var(--border)', backgroundColor: 'var(--bg-elevated)', color: 'var(--text-primary)', fontSize: '0.85rem', outline: 'none', cursor: 'pointer' }}>
                          {AUDIENCES.map(a => <option key={a} value={a}>{a}</option>)}
                        </select>
                      )},
                      { label: 'Demo Duration', node: (
                        <select value={duration} onChange={e => setDuration(e.target.value)}
                          style={{ width: '100%', padding: '0.6rem 0.75rem', borderRadius: '8px', border: '1px solid var(--border)', backgroundColor: 'var(--bg-elevated)', color: 'var(--text-primary)', fontSize: '0.85rem', outline: 'none', cursor: 'pointer' }}>
                          {DURATIONS.map(d => <option key={d} value={d}>{d}</option>)}
                        </select>
                      )},
                    ].map(({ label, node }) => (
                      <div key={label} style={{ marginBottom: '0.75rem' }}>
                        <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '0.3rem' }}>{label}</label>
                        {node}
                      </div>
                    ))}

                    <button onClick={handleGenerate}
                      style={{ width: '100%', padding: '0.75rem', borderRadius: '10px', border: 'none', backgroundColor: 'var(--accent)', color: 'white', fontFamily: 'var(--font-outfit)', fontWeight: 700, cursor: 'pointer', fontSize: '0.9rem', marginTop: '0.25rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
                      <Sparkles size={16} /> Generate Script with Claude AI
                    </button>
                    <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textAlign: 'center', marginTop: '0.5rem' }}>
                      {count} prompt{count !== 1 ? 's' : ''} · Powered by Claude Opus
                    </p>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      )}
    </>
  )
}
