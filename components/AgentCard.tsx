'use client'
import Link from 'next/link'
import { Bot, Users, MessageSquare } from 'lucide-react'
import { motion } from 'framer-motion'
import { Agent } from '@/lib/types'
import { FavoriteButton } from '@/components/FavoriteButton'

const cardVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: (i: number) => ({
    opacity: 1, y: 0,
    transition: { delay: Math.min(i, 11) * 0.04, duration: 0.3, ease: 'easeOut' as const }
  })
}

const agentCategoryColorMap: Record<string, string> = {
  'Advanced':               '#6366f1',
  'Commercial & Legal':     '#94a3b8',
  'Customer Success':       '#06b6d4',
  'ESG':                    '#22c55e',
  'Finance':                '#3b82f6',
  'HR & People':            '#a78bfa',
  'IT & Ops':               '#f97316',
  'Learning & Development': '#10b981',
  'Productivity':           '#14b8a6',
  'Project Management':     '#f59e0b',
  'Sales':                  '#ef4444',
  'Strategy & Executive':   '#8b5cf6',
  'Writing & Communication':'#ec4899',
}

// Today is 2026-03-26; "New" = within 90 days = after 2025-12-27
const NEW_CUTOFF = new Date('2025-12-27').getTime()

function isNew(lastUpdated?: string): boolean {
  if (!lastUpdated) return false
  try {
    return new Date(lastUpdated).getTime() > NEW_CUTOFF
  } catch {
    return false
  }
}

export function AgentCard({ agent, index }: { agent: Agent; index: number }) {
  const color = agentCategoryColorMap[agent.category] || '#6366f1'
  const showNew = isNew(agent.lastUpdated)

  return (
    <motion.div variants={cardVariants} initial="hidden" animate="visible" custom={index} style={{ height: '100%', position: 'relative' }}>
      <Link href={`/agents/${agent.id}`} style={{ textDecoration: 'none', display: 'block', height: '100%' }}>
        <div className="card-surface" style={{ borderRadius: '12px', padding: '1.25rem', height: '100%', boxSizing: 'border-box', display: 'flex', flexDirection: 'column' }}>
          {/* Header */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem', gap: '0.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', flexWrap: 'wrap', minWidth: 0, flex: 1 }}>
              <span style={{ backgroundColor: `${color}20`, color, border: `1px solid ${color}40`, borderRadius: '6px', padding: '2px 8px', fontSize: '0.7rem', fontWeight: 600, lineHeight: 1.5, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', flexShrink: 1 }}>
                {agent.category}
              </span>
              {showNew && (
                <span style={{ backgroundColor: '#22c55e20', color: '#22c55e', border: '1px solid #22c55e40', borderRadius: '6px', padding: '2px 8px', fontSize: '0.7rem', fontWeight: 700, whiteSpace: 'nowrap', flexShrink: 0 }}>
                  New
                </span>
              )}
            </div>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '3px', backgroundColor: 'rgba(99,102,241,0.12)', color: '#818cf8', borderRadius: '6px', padding: '2px 8px', fontSize: '0.7rem', fontWeight: 700, whiteSpace: 'nowrap', flexShrink: 0 }}>
              <Bot size={10} /> Agent
            </span>
          </div>

          {/* Title */}
          <h3 style={{ fontFamily: 'var(--font-outfit)', fontWeight: 600, fontSize: '0.95rem', color: 'var(--text-primary)', marginBottom: '0.5rem', lineHeight: 1.35 }}>
            {agent.title}
          </h3>

          {/* Description */}
          <p style={{ fontSize: '0.775rem', color: 'var(--text-secondary)', lineHeight: 1.55, display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden', marginBottom: '1rem', flex: 1 }}>
            {agent.description}
          </p>

          {/* Footer */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 'auto' }}>
            {agent.audience && (
              <span style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                <Users size={11} /> {agent.audience.split('/')[0].trim()}
              </span>
            )}
            {agent.conversationStarters.length > 0 && (
              <span style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                <MessageSquare size={11} /> {agent.conversationStarters.length} starters
              </span>
            )}
          </div>
        </div>
      </Link>
      {/* FavoriteButton outside the Link, absolutely positioned top-right */}
      <div style={{ position: 'absolute', top: '10px', right: '10px', zIndex: 2 }}>
        <FavoriteButton id={agent.id} size={15} />
      </div>
    </motion.div>
  )
}
