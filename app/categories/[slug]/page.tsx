import { notFound } from 'next/navigation'
import { Building2, Briefcase, PenLine, Code2, BarChart3, Rocket, TrendingUp, GraduationCap, Scale, Megaphone, Wallet, Presentation, BookOpen, Trophy, Plane, Video, Target, Bot, Search } from 'lucide-react'
import { PromptCard } from '@/components/PromptCard'
import { categories, categoryColorMap } from '@/lib/constants'
import { Prompt } from '@/lib/types'
import promptsData from '@/data/prompts.json'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const iconMap: Record<string, React.ComponentType<any>> = {
  Building2, Briefcase, PenLine, Code2, BarChart3, Rocket, TrendingUp,
  GraduationCap, Scale, Megaphone, Wallet, Presentation, BookOpen,
  Trophy, Plane, Video, Target, Bot, Search,
}

export function generateStaticParams() {
  return categories.map(c => ({ slug: c.slug }))
}

export default function CategoryPage({ params }: { params: { slug: string } }) {
  const cat = categories.find(c => c.slug === params.slug)
  if (!cat) return notFound()
  const catPrompts = (promptsData as Prompt[]).filter(p => p.categorySlug === params.slug)
  const color = categoryColorMap[cat.name] || '#6366f1'
  const Icon = iconMap[cat.icon] || BookOpen

  return (
    <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '2rem 1.5rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', marginBottom: '3rem', padding: '2rem', backgroundColor: 'var(--bg-surface)', borderRadius: '16px', border: '1px solid var(--border)', flexWrap: 'wrap' }}>
        <div style={{ backgroundColor: `${color}20`, borderRadius: '12px', padding: '1rem', flexShrink: 0 }}>
          <Icon size={36} style={{ color }} />
        </div>
        <div>
          <h1 style={{ fontFamily: 'var(--font-outfit)', fontSize: '2rem', fontWeight: 800, marginBottom: '0.25rem' }}>{cat.name}</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>{catPrompts.length} prompts in this category</p>
        </div>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1rem' }}>
        {catPrompts.map((p, i) => <PromptCard key={p.id} prompt={p} index={i} />)}
      </div>
    </div>
  )
}
