'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Heart, ArrowRight } from 'lucide-react'
import { useFavorites } from '@/hooks/useFavorites'
import { PromptCard } from '@/components/PromptCard'
import { AgentCard } from '@/components/AgentCard'
import { Prompt, Agent } from '@/lib/types'
import promptsData from '@/data/prompts.json'
import agentsData from '@/data/agents.json'

const allPrompts = promptsData as Prompt[]
const allAgents = agentsData as Agent[]

export default function FavoritesPage() {
  const { favorites } = useFavorites()
  const [activeTab, setActiveTab] = useState<'prompts' | 'agents'>('prompts')
  const [mounted, setMounted] = useState(false)

  useEffect(() => { setMounted(true) }, [])

  const favoritedPrompts = allPrompts.filter(p => favorites.has(p.id))
  const favoritedAgents = allAgents.filter(a => favorites.has(a.id))
  const totalCount = favoritedPrompts.length + favoritedAgents.length

  const tabStyle = (tab: 'prompts' | 'agents') => ({
    padding: '8px 20px',
    borderRadius: '8px',
    border: `1px solid ${activeTab === tab ? 'var(--accent)' : 'var(--border)'}`,
    backgroundColor: activeTab === tab ? 'var(--accent-dim)' : 'transparent',
    color: activeTab === tab ? 'var(--accent)' : 'var(--text-secondary)',
    fontSize: '0.875rem',
    fontWeight: 600 as const,
    cursor: 'pointer' as const,
    transition: 'all 0.15s',
    display: 'inline-flex',
    alignItems: 'center',
    gap: '0.4rem',
  })

  return (
    <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '2rem 1.5rem' }}>
      {/* Header */}
      <div style={{ marginBottom: '2rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
          <Heart size={24} fill="#ef4444" color="#ef4444" />
          <h1 style={{ fontFamily: 'var(--font-outfit)', fontSize: 'clamp(1.5rem, 3vw, 2rem)', fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.02em', margin: 0 }}>
            My Favorites
          </h1>
        </div>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>
          {mounted ? `${totalCount} saved item${totalCount !== 1 ? 's' : ''}` : 'Your saved prompts and agents'}
        </p>
      </div>

      {/* Empty state */}
      {mounted && totalCount === 0 && (
        <div style={{ textAlign: 'center', padding: '5rem 2rem' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '64px', height: '64px', borderRadius: '50%', backgroundColor: 'var(--bg-elevated)', marginBottom: '1.25rem' }}>
            <Heart size={28} color="var(--text-muted)" />
          </div>
          <h2 style={{ fontFamily: 'var(--font-outfit)', fontSize: '1.25rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.5rem' }}>
            No favorites yet
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '1.5rem', maxWidth: '360px', margin: '0 auto 1.5rem' }}>
            Click the heart icon on any prompt or agent card to save it here.
          </p>
          <Link href="/prompts" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', backgroundColor: 'var(--accent)', color: 'white', borderRadius: '10px', padding: '10px 20px', textDecoration: 'none', fontSize: '0.9rem', fontWeight: 600 }}>
            Browse Prompts <ArrowRight size={15} />
          </Link>
        </div>
      )}

      {/* Tabs + Content */}
      {mounted && totalCount > 0 && (
        <>
          <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem' }}>
            <button style={tabStyle('prompts')} onClick={() => setActiveTab('prompts')}>
              Prompts
              <span style={{ backgroundColor: activeTab === 'prompts' ? 'var(--accent)' : 'var(--bg-elevated)', color: activeTab === 'prompts' ? 'white' : 'var(--text-muted)', borderRadius: '100px', padding: '1px 7px', fontSize: '0.72rem', fontWeight: 700 }}>
                {favoritedPrompts.length}
              </span>
            </button>
            <button style={tabStyle('agents')} onClick={() => setActiveTab('agents')}>
              Agents
              <span style={{ backgroundColor: activeTab === 'agents' ? 'var(--accent)' : 'var(--bg-elevated)', color: activeTab === 'agents' ? 'white' : 'var(--text-muted)', borderRadius: '100px', padding: '1px 7px', fontSize: '0.72rem', fontWeight: 700 }}>
                {favoritedAgents.length}
              </span>
            </button>
          </div>

          {activeTab === 'prompts' && (
            favoritedPrompts.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                No favorite prompts yet.{' '}
                <Link href="/prompts" style={{ color: 'var(--accent)', textDecoration: 'none', fontWeight: 600 }}>Browse prompts</Link>
              </div>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1rem' }}>
                {favoritedPrompts.map((p, i) => <PromptCard key={p.id} prompt={p} index={i} />)}
              </div>
            )
          )}

          {activeTab === 'agents' && (
            favoritedAgents.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                No favorite agents yet.{' '}
                <Link href="/agents" style={{ color: 'var(--accent)', textDecoration: 'none', fontWeight: 600 }}>Browse agents</Link>
              </div>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1rem' }}>
                {favoritedAgents.map((a, i) => <AgentCard key={a.id} agent={a} index={i} />)}
              </div>
            )
          )}
        </>
      )}
    </div>
  )
}
