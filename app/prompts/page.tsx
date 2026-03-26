'use client'
import { useState, useEffect, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { Search, X } from 'lucide-react'
import { useFilters } from '@/hooks/useFilters'
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

function LibraryContent() {
  const searchParams = useSearchParams()
  const [mounted, setMounted] = useState(false)
  const [page, setPage] = useState(1)
  const { query, setQuery, category, setCategory, tool, setTool, hasDemoData, setHasDemoData, filtered, clearAll } = useFilters(prompts)

  useEffect(() => {
    setMounted(true)
    const q = searchParams.get('q')
    if (q) setQuery(q)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => { setPage(1) }, [query, category, tool, hasDemoData])

  const displayed = filtered.slice(0, page * PAGE_SIZE)

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
        <div style={{ position: 'relative', marginBottom: '1rem' }}>
          <Search size={17} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)', pointerEvents: 'none' }} />
          <input type="text" placeholder={`Search ${promptCount.toLocaleString()} prompts...`} value={query} onChange={e => setQuery(e.target.value)} aria-label="Search prompts"
            style={{ width: '100%', padding: '0.75rem 1rem 0.75rem 2.75rem', borderRadius: '10px', border: '1px solid var(--border)', backgroundColor: 'var(--bg-surface)', color: 'var(--text-primary)', fontSize: '0.95rem', outline: 'none', boxSizing: 'border-box' }}
            onFocus={e => (e.currentTarget.style.borderColor = 'var(--border-focus)')}
            onBlur={e => (e.currentTarget.style.borderColor = 'var(--border)')} />
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '0.5rem' }}>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>
            {query ? `${filtered.length} prompts match "${query}"` : `Showing ${displayed.length} of ${filtered.length} prompts`}
          </p>
          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
            {category && <button onClick={() => setCategory(null)} style={{ display: 'flex', alignItems: 'center', gap: '4px', padding: '3px 10px', borderRadius: '100px', backgroundColor: 'var(--accent-dim)', color: 'var(--accent)', border: '1px solid rgba(99,102,241,0.3)', fontSize: '0.75rem', cursor: 'pointer' }}>{category} <X size={11} /></button>}
            {tool && <button onClick={() => setTool(null)} style={{ display: 'flex', alignItems: 'center', gap: '4px', padding: '3px 10px', borderRadius: '100px', backgroundColor: 'var(--accent-dim)', color: 'var(--accent)', border: '1px solid rgba(99,102,241,0.3)', fontSize: '0.75rem', cursor: 'pointer' }}>{tool} <X size={11} /></button>}
            {hasDemoData && <button onClick={() => setHasDemoData(false)} style={{ display: 'flex', alignItems: 'center', gap: '4px', padding: '3px 10px', borderRadius: '100px', backgroundColor: 'var(--demo-dim)', color: 'var(--demo-badge)', border: '1px solid rgba(217,119,6,0.3)', fontSize: '0.75rem', cursor: 'pointer' }}>Demo Data <X size={11} /></button>}
            {(category || tool || hasDemoData) && <button onClick={clearAll} style={{ padding: '3px 10px', borderRadius: '100px', backgroundColor: 'transparent', color: 'var(--text-muted)', border: '1px solid var(--border)', fontSize: '0.75rem', cursor: 'pointer' }}>Clear all</button>}
          </div>
        </div>
        {filtered.length === 0 ? <EmptyState onClear={clearAll} /> : (
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
