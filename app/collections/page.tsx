'use client'
import Link from 'next/link'
import { TrendingUp, BarChart3, Briefcase, Sparkles, Video, PenLine } from 'lucide-react'
import collectionsData from '@/data/collections.json'

interface Collection {
  slug: string
  title: string
  description: string
  icon: string
  color: string
  promptIds: string[]
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const iconMap: Record<string, React.ComponentType<any>> = {
  TrendingUp, BarChart3, Briefcase, Sparkles, Video, PenLine,
}

const collections = collectionsData as Collection[]

export default function CollectionsPage() {
  return (
    <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '2rem 1.5rem' }}>
      {/* Header */}
      <div style={{ marginBottom: '2.5rem' }}>
        <h1 style={{ fontFamily: 'var(--font-outfit)', fontSize: 'clamp(1.65rem, 4vw, 2.5rem)', fontWeight: 800, letterSpacing: '-0.02em', color: 'var(--text-primary)', marginBottom: '0.5rem' }}>
          Collections
        </h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '1rem', lineHeight: 1.6 }}>
          Curated prompt packs for every workflow
        </p>
      </div>

      {/* Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.25rem' }}>
        {collections.map(col => {
          const Icon = iconMap[col.icon] || Sparkles
          return (
            <Link key={col.slug} href={`/collections/${col.slug}`} style={{ textDecoration: 'none' }}>
              <div className="card-surface" style={{ borderRadius: '14px', padding: '1.5rem', height: '100%', boxSizing: 'border-box', borderTop: `3px solid ${col.color}`, transition: 'transform 0.15s ease', cursor: 'pointer' }}
                onMouseEnter={e => (e.currentTarget as HTMLDivElement).style.transform = 'translateY(-2px)'}
                onMouseLeave={e => (e.currentTarget as HTMLDivElement).style.transform = 'translateY(0)'}
              >
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '1rem', gap: '0.75rem' }}>
                  <div style={{ backgroundColor: `${col.color}20`, borderRadius: '10px', padding: '10px', flexShrink: 0 }}>
                    <Icon size={22} style={{ color: col.color }} />
                  </div>
                  <span style={{ backgroundColor: 'var(--bg-elevated)', color: 'var(--text-muted)', borderRadius: '100px', padding: '2px 10px', fontSize: '0.72rem', fontWeight: 600, whiteSpace: 'nowrap', alignSelf: 'center' }}>
                    {col.promptIds.length} prompts
                  </span>
                </div>
                <h2 style={{ fontFamily: 'var(--font-outfit)', fontSize: '1.05rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.5rem', lineHeight: 1.3 }}>
                  {col.title}
                </h2>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', lineHeight: 1.55, margin: 0 }}>
                  {col.description}
                </p>
              </div>
            </Link>
          )
        })}
      </div>
    </div>
  )
}
