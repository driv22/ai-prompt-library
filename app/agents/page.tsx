'use client'
import { useState, useEffect } from 'react'
import { Search, Bot, Sparkles, Loader2, X, SlidersHorizontal } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { AgentCard } from '@/components/AgentCard'
import { SkeletonCard } from '@/components/SkeletonCard'
import { useSemanticSearch } from '@/hooks/useSemanticSearch'
import { Agent } from '@/lib/types'
import agentsData from '@/data/agents.json'

const agents = agentsData as Agent[]
const agentCount = agents.length
const allCategories = Array.from(new Set(agents.map(a => a.category))).sort()

const PAGE_SIZE = 24

const statusLabel: Record<string, string> = {
  'loading-model': 'Loading AI…',
  'searching': 'Finding matches…',
}

export default function AgentsPage() {
  const [mode, setMode] = useState<'keyword' | 'smart'>('keyword')
  const [query, setQuery] = useState('')
  const [smartQ, setSmartQ] = useState('')
  const [category, setCategory] = useState<string | null>(null)
  const [page, setPage] = useState(1)
  const [isMobile, setIsMobile] = useState(false)
  const [drawerOpen, setDrawerOpen] = useState(false)

  const { search: semanticSearch, results: smartResults, status: smartStatus, clear: clearSmart } = useSemanticSearch(agents, '/ai-prompt-library/agent-embeddings.json')

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768)
    check()
    window.addEventListener('resize', check)
    return () => window.removeEventListener('resize', check)
  }, [])

  const isSmartSearching = smartStatus === 'loading-model' || smartStatus === 'searching'
  const showSmartResults = mode === 'smart' && (smartResults !== null || isSmartSearching)

  const filtered = agents.filter(a => {
    const matchesCategory = !category || a.category === category
    const q = query.toLowerCase()
    const matchesQuery = !q ||
      a.title.toLowerCase().includes(q) ||
      a.description.toLowerCase().includes(q) ||
      a.audience.toLowerCase().includes(q)
    return matchesCategory && matchesQuery
  })

  const displayed = filtered.slice(0, page * PAGE_SIZE)

  const categoryCounts = Object.fromEntries(
    allCategories.map(cat => [cat, agents.filter(a => a.category === cat).length])
  )

  const handleSwitchMode = (next: 'keyword' | 'smart') => {
    setMode(next)
    clearSmart()
    setSmartQ('')
    setQuery('')
    setPage(1)
  }

  const handleSmartSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (smartQ.trim()) semanticSearch(smartQ)
  }

  const handleClearSmart = () => {
    clearSmart()
    setSmartQ('')
  }

  // Apply category filter to smart results too
  const filteredSmartResults = smartResults
    ? (category ? smartResults.filter(a => a.category === category) : smartResults)
    : null

  const SidebarContent = ({ onClose }: { onClose?: () => void }) => (
    <>
      <p style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--text-muted)', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '0.5rem' }}>Category</p>
      <button onClick={() => { setCategory(null); setPage(1); if (onClose) onClose() }}
        style={{ display: 'flex', justifyContent: 'space-between', width: '100%', padding: '5px 8px', borderRadius: '6px', border: 'none', backgroundColor: !category ? 'var(--accent-dim)' : 'transparent', color: !category ? 'var(--accent)' : 'var(--text-secondary)', cursor: 'pointer', fontSize: '0.82rem', textAlign: 'left', marginBottom: '1px' }}>
        <span>All Agents</span>
        <span style={{ color: 'var(--text-muted)', fontSize: '0.72rem' }}>{agentCount}</span>
      </button>
      {allCategories.map(cat => (
        <button key={cat} onClick={() => { setCategory(category === cat ? null : cat); setPage(1); if (onClose) onClose() }}
          style={{ display: 'flex', justifyContent: 'space-between', width: '100%', padding: '5px 8px', borderRadius: '6px', border: 'none', backgroundColor: category === cat ? 'var(--accent-dim)' : 'transparent', color: category === cat ? 'var(--accent)' : 'var(--text-secondary)', cursor: 'pointer', fontSize: '0.82rem', textAlign: 'left', transition: 'all 0.15s', marginBottom: '1px' }}>
          <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', flex: 1 }}>{cat}</span>
          <span style={{ color: 'var(--text-muted)', fontSize: '0.72rem', flexShrink: 0, marginLeft: '4px' }}>{categoryCounts[cat]}</span>
        </button>
      ))}
    </>
  )

  return (
    <div>
      {/* Header */}
      <section style={{ borderBottom: '1px solid var(--border)', backgroundColor: 'var(--bg-surface)', padding: '3rem 1.5rem 2.5rem' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem' }}>
            <div style={{ backgroundColor: 'rgba(99,102,241,0.12)', borderRadius: '10px', padding: '8px' }}>
              <Bot size={22} color="#818cf8" />
            </div>
            <h1 style={{ fontFamily: 'var(--font-outfit)', fontSize: 'clamp(1.5rem, 3vw, 2rem)', fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>
              Copilot Studio Agents
            </h1>
          </div>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', maxWidth: '600px', lineHeight: 1.6, marginBottom: '1.5rem' }}>
            {agentCount} ready-to-deploy agent configurations for Microsoft Copilot Studio. Each agent includes conversation starters, full instructions, and deployment guidance.
          </p>

          {/* Mode toggle */}
          <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
            <button onClick={() => handleSwitchMode('keyword')}
              style={{ padding: '5px 16px', borderRadius: '100px', border: `1px solid ${mode === 'keyword' ? 'var(--accent)' : 'rgba(99,102,241,0.25)'}`, backgroundColor: mode === 'keyword' ? 'var(--accent-dim)' : 'transparent', color: mode === 'keyword' ? 'var(--accent)' : 'var(--text-muted)', fontSize: '0.78rem', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '5px', transition: 'all 0.15s' }}>
              <Search size={12} /> Keyword Search
            </button>
            <button onClick={() => handleSwitchMode('smart')}
              style={{ padding: '5px 16px', borderRadius: '100px', border: `1px solid ${mode === 'smart' ? 'var(--accent)' : 'rgba(99,102,241,0.25)'}`, backgroundColor: mode === 'smart' ? 'var(--accent-dim)' : 'transparent', color: mode === 'smart' ? 'var(--accent)' : 'var(--text-muted)', fontSize: '0.78rem', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '5px', transition: 'all 0.15s' }}>
              <Sparkles size={12} /> Smart Search
            </button>
          </div>

          {/* Search inputs */}
          <AnimatePresence mode="wait">
            {mode === 'keyword' && (
              <motion.div key="keyword" initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }} transition={{ duration: 0.15 }}
                style={{ position: 'relative', maxWidth: '480px' }}>
                <Search size={16} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)', pointerEvents: 'none' }} />
                <input type="text" placeholder="Search agents…" value={query} onChange={e => { setQuery(e.target.value); setPage(1) }}
                  style={{ width: '100%', padding: '0.7rem 1rem 0.7rem 2.5rem', borderRadius: '10px', border: '1px solid var(--border)', backgroundColor: 'var(--bg-base)', color: 'var(--text-primary)', fontSize: '0.9rem', outline: 'none', boxSizing: 'border-box' }}
                  onFocus={e => (e.currentTarget.style.borderColor = 'var(--border-focus)')}
                  onBlur={e => (e.currentTarget.style.borderColor = 'var(--border)')} />
              </motion.div>
            )}

            {mode === 'smart' && (
              <motion.div key="smart" initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }} transition={{ duration: 0.15 }}>
                <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>
                  Describe what you need — AI finds the most relevant agents
                </p>
                <form onSubmit={handleSmartSearch} style={{ display: 'flex', gap: '0.75rem', maxWidth: '560px' }}>
                  <div style={{ position: 'relative', flex: 1 }}>
                    {isSmartSearching
                      ? <Loader2 size={16} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--accent)', animation: 'spin 1s linear infinite' }} />
                      : <Sparkles size={16} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--accent)', pointerEvents: 'none' }} />
                    }
                    <input type="text" placeholder='e.g. "I need an agent to handle IT helpdesk questions"'
                      value={smartQ} onChange={e => setSmartQ(e.target.value)}
                      style={{ width: '100%', padding: '0.7rem 1rem 0.7rem 2.5rem', borderRadius: '10px', border: '1px solid rgba(99,102,241,0.4)', backgroundColor: 'var(--bg-base)', color: 'var(--text-primary)', fontSize: '0.9rem', outline: 'none', boxSizing: 'border-box' }}
                      onFocus={e => (e.currentTarget.style.borderColor = 'var(--border-focus)')}
                      onBlur={e => (e.currentTarget.style.borderColor = 'rgba(99,102,241,0.4)')} />
                  </div>
                  <button type="submit" disabled={isSmartSearching || !smartQ.trim()}
                    style={{ backgroundColor: 'var(--accent)', color: 'white', border: 'none', borderRadius: '10px', padding: '0 1.25rem', fontSize: '0.88rem', fontWeight: 600, cursor: isSmartSearching ? 'wait' : 'pointer', whiteSpace: 'nowrap', opacity: (!smartQ.trim() || isSmartSearching) ? 0.6 : 1 }}>
                    {isSmartSearching ? (statusLabel[smartStatus] ?? 'Searching…') : 'Find Agents'}
                  </button>
                </form>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>

      {/* Body */}
      <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '2rem 1.5rem', display: 'flex', gap: '2rem', alignItems: 'flex-start' }}>

        {/* Desktop Sidebar */}
        {!isMobile && (
          <aside style={{ width: '200px', flexShrink: 0, position: 'sticky', top: '80px', maxHeight: 'calc(100vh - 96px)', overflowY: 'auto' }}>
            <SidebarContent />
          </aside>
        )}

        {/* Mobile drawer backdrop */}
        {isMobile && drawerOpen && (
          <div
            onClick={() => setDrawerOpen(false)}
            style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 100 }}
          />
        )}

        {/* Mobile drawer */}
        {isMobile && (
          <div style={{
            position: 'fixed',
            top: 0,
            left: drawerOpen ? 0 : '-100%',
            width: '280px',
            height: '100vh',
            backgroundColor: 'var(--bg-surface)',
            borderRight: '1px solid var(--border)',
            zIndex: 101,
            padding: '1.25rem',
            overflowY: 'auto',
            transition: 'left 0.25s ease',
            boxSizing: 'border-box',
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
              <span style={{ fontFamily: 'var(--font-outfit)', fontWeight: 700, fontSize: '0.95rem', color: 'var(--text-primary)' }}>Filters</span>
              <button onClick={() => setDrawerOpen(false)} style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', padding: '4px' }}>
                ✕
              </button>
            </div>
            <SidebarContent onClose={() => setDrawerOpen(false)} />
          </div>
        )}

        {/* Grid */}
        <div style={{ flex: 1, minWidth: 0 }}>

          {/* Mobile Filters button */}
          {isMobile && (
            <div style={{ marginBottom: '1rem' }}>
              <button
                onClick={() => setDrawerOpen(true)}
                style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', padding: '7px 14px', borderRadius: '8px', border: '1px solid var(--border)', backgroundColor: 'var(--bg-surface)', color: 'var(--text-secondary)', fontSize: '0.82rem', fontWeight: 600, cursor: 'pointer' }}
              >
                <SlidersHorizontal size={14} /> Filters
                {category && (
                  <span style={{ backgroundColor: 'var(--accent)', color: 'white', borderRadius: '100px', fontSize: '0.65rem', fontWeight: 700, padding: '1px 6px', marginLeft: '2px' }}>
                    1
                  </span>
                )}
              </button>
            </div>
          )}

          {/* Smart results */}
          <AnimatePresence>
            {showSmartResults && (
              <motion.div key="smart-results" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.25 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '0.75rem' }}>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>
                    {isSmartSearching ? 'Finding matches…' : `${filteredSmartResults?.length ?? 0} agents matched`}
                    {smartQ && !isSmartSearching && <span> for &ldquo;{smartQ}&rdquo;</span>}
                  </p>
                  <button onClick={handleClearSmart}
                    style={{ display: 'flex', alignItems: 'center', gap: '4px', padding: '5px 12px', borderRadius: '100px', border: '1px solid var(--border)', backgroundColor: 'transparent', color: 'var(--text-muted)', fontSize: '0.78rem', cursor: 'pointer' }}>
                    <X size={11} /> Clear
                  </button>
                </div>
                {isSmartSearching ? (
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1rem' }}>
                    {Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)}
                  </div>
                ) : filteredSmartResults && filteredSmartResults.length > 0 ? (
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1rem' }}>
                    {filteredSmartResults.map((a, i) => <AgentCard key={a.id} agent={a} index={i} />)}
                  </div>
                ) : (
                  <p style={{ color: 'var(--text-muted)', padding: '3rem 0', textAlign: 'center' }}>No agents matched. Try rephrasing your scenario.</p>
                )}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Keyword results */}
          {!showSmartResults && (
            <>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginBottom: '1.25rem' }}>
                Showing {displayed.length} of {filtered.length} agents{category ? ` in ${category}` : ''}
              </p>
              {filtered.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '4rem 0', color: 'var(--text-muted)' }}>
                  <Bot size={40} style={{ marginBottom: '1rem', opacity: 0.3 }} />
                  <p>No agents match your search.</p>
                  <button onClick={() => { setQuery(''); setCategory(null) }} style={{ marginTop: '1rem', padding: '6px 16px', borderRadius: '8px', border: '1px solid var(--border)', backgroundColor: 'transparent', color: 'var(--text-muted)', cursor: 'pointer', fontSize: '0.85rem' }}>Clear filters</button>
                </div>
              ) : (
                <>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1rem' }}>
                    {displayed.map((a, i) => <AgentCard key={a.id} agent={a} index={i} />)}
                  </div>
                  {displayed.length < filtered.length && (
                    <div style={{ textAlign: 'center', marginTop: '2rem' }}>
                      <button onClick={() => setPage(p => p + 1)}
                        style={{ backgroundColor: 'var(--bg-elevated)', color: 'var(--text-primary)', border: '1px solid var(--border)', borderRadius: '10px', padding: '0.75rem 2rem', fontSize: '0.9rem', fontWeight: 600, cursor: 'pointer' }}>
                        Load more ({filtered.length - displayed.length} remaining)
                      </button>
                    </div>
                  )}
                </>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  )
}
