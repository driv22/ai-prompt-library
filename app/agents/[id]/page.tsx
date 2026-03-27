import Link from 'next/link'
import { notFound } from 'next/navigation'
import { Bot, Users, Globe, Shield, ChevronRight, MessageSquare, Wrench, AlertTriangle } from 'lucide-react'
import { CopyButton } from '@/components/CopyButton'
import { Agent } from '@/lib/types'
import agentsData from '@/data/agents.json'

const agents = agentsData as Agent[]

export function generateStaticParams() {
  return agents.map(a => ({ id: a.id }))
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

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: '2rem' }}>
      <h2 style={{ fontFamily: 'var(--font-outfit)', fontSize: '1rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.75rem', paddingBottom: '0.5rem', borderBottom: '1px solid var(--border)' }}>
        {title}
      </h2>
      {children}
    </div>
  )
}

export default function AgentDetailPage({ params }: { params: { id: string } }) {
  const agent = agents.find(a => a.id === params.id)
  if (!agent) notFound()

  const color = agentCategoryColorMap[agent.category] || '#6366f1'
  const related = agents.filter(a => a.category === agent.category && a.id !== agent.id).slice(0, 3)

  return (
    <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '2rem 1.5rem' }}>
      {/* Breadcrumb */}
      <nav style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '2rem' }}>
        <Link href="/" style={{ color: 'var(--text-muted)', textDecoration: 'none' }}>Home</Link>
        <ChevronRight size={13} />
        <Link href="/agents" style={{ color: 'var(--text-muted)', textDecoration: 'none' }}>Agents</Link>
        <ChevronRight size={13} />
        <span style={{ color: 'var(--text-primary)' }}>{agent.title}</span>
      </nav>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 280px', gap: '2.5rem', alignItems: 'flex-start' }}>
        {/* Main */}
        <div>
          {/* Title block */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
            <span style={{ backgroundColor: `${color}20`, color, border: `1px solid ${color}40`, borderRadius: '6px', padding: '2px 10px', fontSize: '0.75rem', fontWeight: 600 }}>{agent.category}</span>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '3px', backgroundColor: 'rgba(99,102,241,0.12)', color: '#818cf8', borderRadius: '6px', padding: '2px 8px', fontSize: '0.75rem', fontWeight: 700 }}>
              <Bot size={11} /> Agent
            </span>
          </div>
          <h1 style={{ fontFamily: 'var(--font-outfit)', fontSize: 'clamp(1.5rem, 3vw, 2.25rem)', fontWeight: 800, letterSpacing: '-0.02em', color: 'var(--text-primary)', marginBottom: '1rem', lineHeight: 1.2 }}>
            {agent.title}
          </h1>
          <p style={{ fontSize: '1rem', color: 'var(--text-secondary)', lineHeight: 1.7, marginBottom: '2rem' }}>
            {agent.description}
          </p>

          {/* Instructions */}
          {agent.instructions && (
            <Section title="Agent Instructions">
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.75rem' }}>
                Paste this entire block into the <strong>Instructions</strong> field in Microsoft Copilot Studio.
              </p>
              <div style={{ position: 'relative' }}>
                <pre style={{ fontFamily: 'var(--font-jetbrains)', fontSize: '0.75rem', lineHeight: 1.65, backgroundColor: 'var(--bg-elevated)', border: '1px solid var(--border)', borderRadius: '10px', padding: '1.25rem 1rem', overflowX: 'auto', whiteSpace: 'pre-wrap', wordBreak: 'break-word', color: 'var(--text-primary)', margin: 0, maxHeight: '520px', overflowY: 'auto' }}>
                  {agent.instructions}
                </pre>
                <div style={{ position: 'absolute', top: '0.75rem', right: '0.75rem' }}>
                  <CopyButton text={agent.instructions} label="Instructions" />
                </div>
              </div>
            </Section>
          )}

          {/* Knowledge Sources */}
          {agent.knowledgeSourcesDetail && (
            <Section title="Knowledge Sources">
              <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: 1.65 }}>{agent.knowledgeSourcesDetail}</p>
            </Section>
          )}

          {/* Conversation Starters */}
          {agent.conversationStarters.length > 0 && (
            <Section title="Conversation Starters">
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                {agent.conversationStarters.map((s, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem', backgroundColor: 'var(--bg-surface)', border: '1px solid var(--border)', borderRadius: '8px', padding: '0.6rem 0.85rem' }}>
                    <MessageSquare size={14} style={{ color: 'var(--accent)', marginTop: '2px', flexShrink: 0 }} />
                    <span style={{ fontFamily: 'var(--font-jetbrains)', fontSize: '0.8rem', color: 'var(--text-primary)', lineHeight: 1.5 }}>{s}</span>
                  </div>
                ))}
              </div>
            </Section>
          )}

          {/* Deployment Notes */}
          {agent.deploymentNotes && (
            <Section title="Deployment Notes">
              <div style={{ backgroundColor: 'rgba(245,158,11,0.08)', border: '1px solid rgba(245,158,11,0.25)', borderRadius: '10px', padding: '1rem 1.1rem' }}>
                <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.5rem' }}>
                  <AlertTriangle size={15} color="#f59e0b" style={{ flexShrink: 0, marginTop: '2px' }} />
                  <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.65, whiteSpace: 'pre-line' }}>{agent.deploymentNotes}</div>
                </div>
              </div>
            </Section>
          )}
        </div>

        {/* Sidebar */}
        <aside style={{ position: 'sticky', top: '80px' }}>
          <div style={{ backgroundColor: 'var(--bg-surface)', border: '1px solid var(--border)', borderRadius: '12px', padding: '1.25rem', marginBottom: '1.5rem' }}>
            <h3 style={{ fontFamily: 'var(--font-outfit)', fontSize: '0.85rem', fontWeight: 700, marginBottom: '1rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Details</h3>
            {[
              { icon: <Users size={14} />, label: 'Audience', value: agent.audience },
              { icon: <Globe size={14} />, label: 'Language', value: agent.language },
              { icon: <Wrench size={14} />, label: 'Version', value: agent.version },
              { icon: <Shield size={14} />, label: 'RAI Reviewed', value: agent.raiReviewed ? 'Yes' : 'No' },
              { icon: <Shield size={14} />, label: 'Tested', value: agent.tested ? 'Yes' : 'In progress' },
            ].filter(r => r.value).map(row => (
              <div key={row.label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '0.5rem', marginBottom: '0.65rem', fontSize: '0.8rem' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: 'var(--text-muted)' }}>{row.icon} {row.label}</span>
                <span style={{ color: 'var(--text-primary)', fontWeight: 500, textAlign: 'right', maxWidth: '130px' }}>{row.value}</span>
              </div>
            ))}
            {agent.lastUpdated && (
              <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '0.75rem', paddingTop: '0.75rem', borderTop: '1px solid var(--border)' }}>
                Updated {agent.lastUpdated}
              </div>
            )}
          </div>

          {/* Related */}
          {related.length > 0 && (
            <div>
              <h3 style={{ fontFamily: 'var(--font-outfit)', fontSize: '0.85rem', fontWeight: 700, marginBottom: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>More in {agent.category}</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                {related.map(r => (
                  <Link key={r.id} href={`/agents/${r.id}`} style={{ textDecoration: 'none' }}>
                    <div className="card-surface" style={{ borderRadius: '8px', padding: '0.75rem', fontSize: '0.8rem', color: 'var(--text-primary)', fontWeight: 500, lineHeight: 1.35 }}>
                      {r.title}
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </aside>
      </div>
    </div>
  )
}
