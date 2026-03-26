'use client'
import { useState, useEffect, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { Search, X, Sparkles, Loader2 } from 'lucide-react'
import { useFilters } from '@/hooks/useFilters'
import { useSemanticSearch } from '@/hooks/useSemanticSearch'
import { PromptCard } from '@/components/PromptCard'
import { SkeletonCard } from '@/components/SkeletonCard'
import { EmptyState } from '@/components/EmptyState'
import { categories, toolColorMap } from '@/lib/constants'
import { Prompt } from '@/lib/types'
import promptsData from '@/data/prompts.json'

const prompts = promptsData as Prompt[]
const promptCount = prompts.length
const PAGE_SIZE = 24
const tools = Object.keys(toolColorMap)

const statusLabel: Record<string, string> = {
  'loading-model': 'Loading AI model…',
  'searching': 'Finding best matches…',
}

function LibraryContent() {
  const searchParams = useSearchParams()
  const [mounted, setMounted] = useState(false)
  const [page, setPage] = useState(1)
  const [smartMode, setSmartMode] = useState(false)
  const [smartQuery, setSmartQuery] = useState('')

  const { query, setQuery, category, setCategory, tool, setTool, hasDemoData, setHasDemoData, filtered, clearAll } = useFilters(prompts)
  const { search: semanticSearch, results: smartResults, status: smartStatus, clear: clearSmart } = useSemanticSearch(prompts)

  useEffect(() => {
    setMounted(true)
    const q = searchParams.get('q')
    if (q) setQuery(q)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => { setPage(1) }, [query, category, tool, hasDemoData])

  const displayed = filtered.slice(0, page * PAGE_SIZE)
  const isSmartSearching = smartStatus === 'loading-model' || smartStatus === 'searching'

  const handleSmartSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (smartQuery.trim()) semanticSearch(smartQuery)
  }

  const handleToggleMode = () => {
    setSmartMode(m => !m)
    clearSmart()
    setSmartQuery('')
  }

  if (!mounted) return (
    <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '2rem 1.5rem' }}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1rem' }}>
        {Array.from({ length: 12 }).map((_, i) => <SkeletonCard key={i} />)}
      </div>
    </div>
  )

  return (
    <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '2rem 1.5rem', display: 'flex', gap: '2rem', alignItems: 'flex-start' }}>
      {/* Sidebar */}
      <aside style={{ width: '220px', flexShrink: 0, position: 'sticky', top: '80px', maxHeight: 'calc(100vh - 96px)', overflowY: 'auto' }}>
        <div style={{ marginBottom: '1.5rem' }}>
          <p style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--text-muted)', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '0.5rem' }}>Category</p>
          {categories.map(cat => (
            <button key={cat.slug} onClick={() => setCategory(category === cat.name ? null : cat.name)}
              style={{ display: 'flex', justifyContent: 'space-between', width: '100%', padding: '5px 8px', borderRadius: '6px', border: 'none', backgroundColor: category === cat.name ? 'var(--accent-dim)' : 'transparent', color: category === cat.name ? 'var(--accent)' : 'var(--text-secondary)', cursor: 'pointer', fontSize: '0.82rem', textAlign: 'left', transition: 'all 0.15s', marginBottom: '1px' }}>
              <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', flex: 1 }}>{cat.name}</span>
              <span style={{ color: 'var(--text-muted)', fontSize: '0.72rem', flexShrink: 0, marginLeft: '4px' }}>{cat.count}</span>
            </button>
          ))}
        </div>
        <div style={{ marginBottom: '1.5rem' }}>
          <p style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--text-muted)', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '0.5rem' }}>Tool</p>
          {tools.map(t => (
            <button key={t} onClick={() => setTool(tool === t ? null : t)}
              style={{ display: 'block', width: '100%', padding: '5px 8px', borderRadius: '6px', border: 'none', backgroundColor: tool === t ? 'var(--accent-dim)' : 'transparent', color: tool === t ? 'var(--accent)' : 'var(--text-secondary)', cursor: 'pointer', fontSize: '0.82rem', textAlign: 'left', transition: 'all 0.15s', marginBottom: '1px' }}>
              {t}
            </button>
          ))}
        </div>
        <button onClick={() => setHasDemoData(!hasDemoData)}
          style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '7px 10px', borderRadius: '8px', border: `1px solid ${hasDemoData ? 'var(--demo-badge)' : 'var(--border)'}`, backgroundColor: hasDemoData ? 'var(--demo-dim)' : 'transparent', color: hasDemoData ? 'var(--demo-badge)' : 'var(--text-secondary)', cursor: 'pointer', fontSize: '0.82rem', fontWeight: hasDemoData ? 600 : 400, width: '100%', transition: 'all 0.2s' }}>
          ⚡ Has Demo Data
        </button>
      </aside>

      {/* Main */}
      <div style={{ flex: 1, minWidth: 0 }}>

        {/* Search mode toggle */}
        <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.75rem' }}>
          <button onClick={() => { if (smartMode) handleToggleMode() }}
            style={{ padding: '5px 14px', borderRadius: '100px', border: `1px solid ${!smartMode ? 'var(--accent)' : 'var(--border)'}`, backgroundColor: !smartMode ? 'var(--accent-dim)' : 'transparent', color: !smartMode ? 'var(--accent)' : 'var(--text-muted)', fontSize: '0.78rem', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '5px', transition: 'all 0.15s' }}>
            <Search size={12} /> Keyword
          </button>
          <button onClick={() => { if (!smartMode) handleToggleMode() }}
            style={{ padding: '5px 14px', borderRadius: '100px', border: `1px solid ${smartMode ? 'var(--accent)' : 'var(--border)'}`, backgroundColor: smartMode ? 'var(--accent-dim)' : 'transparent', color: smartMode ? 'var(--accent)' : 'var(--text-muted)', fontSize: '0.78rem', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '5px', transition: 'all 0.15s' }}>
            <Sparkles size={12} /> Smart Search
          </button>
        </div>

        {/* Smart search banner */}
        {smartMode && (
          <div style={{ backgroundColor: 'var(--accent-dim)', border: '1px solid rgba(99,102,241,0.25)', borderRadius: '10px', padding: '0.6rem 1rem', marginBottom: '0.75rem', fontSize: '0.8rem', color: 'var(--accent)', lineHeight: 1.5 }}>
            <strong>Smart Search</strong> — Describe your situation in plain English and AI will find the most relevant prompts. Example: <em>&quot;I need to prepare my team for a reorg announcement&quot;</em>
          </div>
        )}

        {/* Search input */}
        {smartMode ? (
          <form onSubmit={handleSmartSearch} style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
            <div style={{ position: 'relative', flex: 1 }}>
              {isSmartSearching
                ? <Loader2 size={17} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--accent)', animation: 'spin 1s linear infinite' }} />
                : <Sparkles size={17} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--accent)', pointerEvents: 'none' }} />
              }
              <input type="text" placeholder="Describe your scenario…" value={smartQuery}
                onChange={e => setSmartQuery(e.target.value)} aria-label="Smart search"
                style={{ width: '100%', padding: '0.75rem 1rem 0.75rem 2.75rem', borderRadius: '10px', border: '1px solid rgba(99,102,241,0.4)', backgroundColor: 'var(--bg-surface)', color: 'var(--text-primary)', fontSize: '0.95rem', outline: 'none', boxSizing: 'border-box' }}
                onFocus={e => (e.currentTarget.style.borderColor = 'var(--border-focus)')}
                onBlur={e => (e.currentTarget.style.borderColor = 'rgba(99,102,241,0.4)')} />
            </div>
            <button type="submit" disabled={isSmartSearching || !smartQuery.trim()}
              style={{ backgroundColor: 'var(--accent)', color: 'white', border: 'none', borderRadius: '10px', padding: '0 1.25rem', fontSize: '0.875rem', fontWeight: 600, cursor: isSmartSearching ? 'wait' : 'pointer', whiteSpace: 'nowrap', opacity: (!smartQuery.trim() || isSmartSearching) ? 0.6 : 1 }}>
              {isSmartSearching ? (statusLabel[smartStatus] ?? 'Searching…') : 'Find Prompts'}
            </button>
          </form>
        ) : (
          <div style={{ position: 'relative', marginBottom: '1rem' }}>
            <Search size={17} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)', pointerEvents: 'none' }} />
            <input type="text" placeholder={`Search ${promptCount.toLocaleString()} prompts...`} value={query} onChange={e => setQuery(e.target.value)} aria-label="Search prompts"
              style={{ width: '100%', padding: '0.75rem 1rem 0.75rem 2.75rem', borderRadius: '10px', border: '1px solid var(--border)', backgroundColor: 'var(--bg-surface)', color: 'var(--text-primary)', fontSize: '0.95rem', outline: 'none', boxSizing: 'border-box' }}
              onFocus={e => (e.currentTarget.style.borderColor = 'var(--border-focus)')}
              onBlur={e => (e.currentTarget.style.borderColor = 'var(--border)')} />
          </div>
        )}

        {/* Result count / filter chips */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '0.5rem' }}>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>
            {smartMode && smartResults
              ? `${smartResults.length} prompts matched your scenario`
              : smartMode && !smartResults
              ? 'Describe a scenario above and press Find Prompts'
              : query
              ? `${filtered.length} prompts match "${query}"`
              : `Showing ${displayed.length} of ${filtered.length} prompts`}
          </p>
          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
            {smartMode && smartResults && (
              <button onClick={() => { clearSmart(); setSmartQuery('') }}
                style={{ display: 'flex', alignItems: 'center', gap: '4px', padding: '3px 10px', borderRadius: '100px', backgroundColor: 'var(--accent-dim)', color: 'var(--accent)', border: '1px solid rgba(99,102,241,0.3)', fontSize: '0.75rem', cursor: 'pointer' }}>
                Clear results <X size={11} />
              </button>
            )}
            {!smartMode && category && <button onClick={() => setCategory(null)} style={{ display: 'flex', alignItems: 'center', gap: '4px', padding: '3px 10px', borderRadius: '100px', backgroundColor: 'var(--accent-dim)', color: 'var(--accent)', border: '1px solid rgba(99,102,241,0.3)', fontSize: '0.75rem', cursor: 'pointer' }}>{category} <X size={11} /></button>}
            {!smartMode && tool && <button onClick={() => setTool(null)} style={{ display: 'flex', alignItems: 'center', gap: '4px', padding: '3px 10px', borderRadius: '100px', backgroundColor: 'var(--accent-dim)', color: 'var(--accent)', border: '1px solid rgba(99,102,241,0.3)', fontSize: '0.75rem', cursor: 'pointer' }}>{tool} <X size={11} /></button>}
            {!smartMode && hasDemoData && <button onClick={() => setHasDemoData(false)} style={{ display: 'flex', alignItems: 'center', gap: '4px', padding: '3px 10px', borderRadius: '100px', backgroundColor: 'var(--demo-dim)', color: 'var(--demo-badge)', border: '1px solid rgba(217,119,6,0.3)', fontSize: '0.75rem', cursor: 'pointer' }}>Demo Data <X size={11} /></button>}
            {!smartMode && (category || tool || hasDemoData) && <button onClick={clearAll} style={{ padding: '3px 10px', borderRadius: '100px', backgroundColor: 'transparent', color: 'var(--text-muted)', border: '1px solid var(--border)', fontSize: '0.75rem', cursor: 'pointer' }}>Clear all</button>}
          </div>
        </div>

        {/* Results grid */}
        {smartMode ? (
          smartResults ? (
            smartResults.length === 0
              ? <EmptyState onClear={() => { clearSmart(); setSmartQuery('') }} />
              : <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1rem' }}>
                  {smartResults.map((p, i) => <PromptCard key={p.id} prompt={p} index={i} />)}
                </div>
          ) : isSmartSearching ? (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1rem' }}>
              {Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)}
            </div>
          ) : null
        ) : (
          filtered.length === 0 ? <EmptyState onClear={clearAll} /> : (
            <>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1rem' }}>
                {displayed.map((p, i) => <PromptCard key={p.id} prompt={p} index={i} />)}
              </div>
              {displayed.length < filtered.length && (
                <div style={{ textAlign: 'center', marginTop: '2rem' }}>
                  <button onClick={() => setPage(prev => prev + 1)}
                    style={{ backgroundColor: 'var(--bg-elevated)', color: 'var(--text-primary)', border: '1px solid var(--border)', borderRadius: '10px', padding: '0.75rem 2rem', fontSize: '0.9rem', fontWeight: 600, cursor: 'pointer' }}>
                    Load 24 more ({filtered.length - displayed.length} remaining)
                  </button>
                </div>
              )}
            </>
          )
        )}
      </div>
    </div>
  )
}

export default function PromptsPage() {
  return (
    <Suspense fallback={<div style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>Loading...</div>}>
      <LibraryContent />
    </Suspense>
  )
}
