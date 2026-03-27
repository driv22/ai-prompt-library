'use client'
import { useState } from 'react'
import { Search, Bot } from 'lucide-react'
import { AgentCard } from '@/components/AgentCard'
import { Agent } from '@/lib/types'
import agentsData from '@/data/agents.json'

const agents = agentsData as Agent[]
const agentCount = agents.length
const allCategories = Array.from(new Set(agents.map(a => a.category))).sort()

const PAGE_SIZE = 24

export default function AgentsPage() {
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState<string | null>(null)
  const [page, setPage] = useState(1)

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
          {/* Search */}
          <div style={{ position: 'relative', maxWidth: '480px' }}>
            <Search size={16} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)', pointerEvents: 'none' }} />
            <input type="text" placeholder="Search agents…" value={query} onChange={e => { setQuery(e.target.value); setPage(1) }}
              style={{ width: '100%', padding: '0.7rem 1rem 0.7rem 2.5rem', borderRadius: '10px', border: '1px solid var(--border)', backgroundColor: 'var(--bg-base)', color: 'var(--text-primary)', fontSize: '0.9rem', outline: 'none', boxSizing: 'border-box' }}
              onFocus={e => (e.currentTarget.style.borderColor = 'var(--border-focus)')}
              onBlur={e => (e.currentTarget.style.borderColor = 'var(--border)')} />
          </div>
        </div>
      </section>

      {/* Body */}
      <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '2rem 1.5rem', display: 'flex', gap: '2rem', alignItems: 'flex-start' }}>
        {/* Sidebar */}
        <aside style={{ width: '200px', flexShrink: 0, position: 'sticky', top: '80px', maxHeight: 'calc(100vh - 96px)', overflowY: 'auto' }}>
          <p style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--text-muted)', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '0.5rem' }}>Category</p>
          <button onClick={() => { setCategory(null); setPage(1) }}
            style={{ display: 'flex', justifyContent: 'space-between', width: '100%', padding: '5px 8px', borderRadius: '6px', border: 'none', backgroundColor: !category ? 'var(--accent-dim)' : 'transparent', color: !category ? 'var(--accent)' : 'var(--text-secondary)', cursor: 'pointer', fontSize: '0.82rem', textAlign: 'left', marginBottom: '1px' }}>
            <span>All Agents</span>
            <span style={{ color: 'var(--text-muted)', fontSize: '0.72rem' }}>{agentCount}</span>
          </button>
          {allCategories.map(cat => (
            <button key={cat} onClick={() => { setCategory(category === cat ? null : cat); setPage(1) }}
              style={{ display: 'flex', justifyContent: 'space-between', width: '100%', padding: '5px 8px', borderRadius: '6px', border: 'none', backgroundColor: category === cat ? 'var(--accent-dim)' : 'transparent', color: category === cat ? 'var(--accent)' : 'var(--text-secondary)', cursor: 'pointer', fontSize: '0.82rem', textAlign: 'left', transition: 'all 0.15s', marginBottom: '1px' }}>
              <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', flex: 1 }}>{cat}</span>
              <span style={{ color: 'var(--text-muted)', fontSize: '0.72rem', flexShrink: 0, marginLeft: '4px' }}>{categoryCounts[cat]}</span>
            </button>
          ))}
        </aside>

        {/* Grid */}
        <div style={{ flex: 1, minWidth: 0 }}>
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
        </div>
      </div>
    </div>
  )
}
