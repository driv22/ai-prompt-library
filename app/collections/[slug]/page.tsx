import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, TrendingUp, BarChart3, Briefcase, Sparkles, Video, PenLine } from 'lucide-react'
import { PromptCard } from '@/components/PromptCard'
import { Prompt } from '@/lib/types'
import collectionsData from '@/data/collections.json'
import promptsData from '@/data/prompts.json'

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
const prompts = promptsData as Prompt[]

export function generateStaticParams() {
  return collections.map(col => ({ slug: col.slug }))
}

export default function CollectionDetailPage({ params }: { params: { slug: string } }) {
  const collection = collections.find(c => c.slug === params.slug)
  if (!collection) return notFound()

  const Icon = iconMap[collection.icon] || Sparkles
  const collectionPrompts = collection.promptIds
    .map(id => prompts.find(p => p.id === id))
    .filter((p): p is Prompt => p !== undefined)

  return (
    <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '2rem 1.5rem' }}>
      {/* Breadcrumb */}
      <div style={{ marginBottom: '2rem' }}>
        <Link href="/collections" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-muted)', textDecoration: 'none', fontSize: '0.875rem', marginBottom: '0.75rem' }}>
          <ArrowLeft size={14} /> Back to Collections
        </Link>
      </div>

      {/* Collection header */}
      <div style={{ borderBottom: '1px solid var(--border)', paddingBottom: '2rem', marginBottom: '2rem' }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1.25rem', flexWrap: 'wrap' }}>
          <div style={{ backgroundColor: `${collection.color}20`, borderRadius: '14px', padding: '14px', flexShrink: 0, borderTop: `3px solid ${collection.color}` }}>
            <Icon size={28} style={{ color: collection.color }} />
          </div>
          <div style={{ flex: 1, minWidth: '200px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem', flexWrap: 'wrap' }}>
              <h1 style={{ fontFamily: 'var(--font-outfit)', fontSize: 'clamp(1.5rem, 3vw, 2.25rem)', fontWeight: 800, letterSpacing: '-0.02em', color: 'var(--text-primary)', margin: 0 }}>
                {collection.title}
              </h1>
              <span style={{ backgroundColor: `${collection.color}20`, color: collection.color, border: `1px solid ${collection.color}40`, borderRadius: '100px', padding: '2px 12px', fontSize: '0.75rem', fontWeight: 600, whiteSpace: 'nowrap' }}>
                {collectionPrompts.length} prompts
              </span>
            </div>
            <p style={{ color: 'var(--text-secondary)', fontSize: '1rem', lineHeight: 1.6, margin: 0, maxWidth: '600px' }}>
              {collection.description}
            </p>
          </div>
        </div>
      </div>

      {/* Prompts grid */}
      {collectionPrompts.length > 0 ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1rem', marginBottom: '3rem' }}>
          {collectionPrompts.map((p, i) => <PromptCard key={p.id} prompt={p} index={i} />)}
        </div>
      ) : (
        <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
          No prompts found for this collection.
        </div>
      )}

      {/* Footer link */}
      <div style={{ textAlign: 'center', paddingTop: '1rem', borderTop: '1px solid var(--border)' }}>
        <Link href="/prompts" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', color: 'var(--accent)', textDecoration: 'none', fontWeight: 600, fontSize: '0.9rem' }}>
          Browse All Prompts
        </Link>
      </div>
    </div>
  )
}
