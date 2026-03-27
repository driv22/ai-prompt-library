import { notFound } from 'next/navigation'
import Link from 'next/link'
import { Download, ArrowLeft, Zap, Tag, FileText } from 'lucide-react'
import { CopyButton } from '@/components/CopyButton'
import { ShareButton } from '@/components/ShareButton'
import { RecentlyViewedTracker } from '@/components/RecentlyViewedTracker'
import { PromptCard } from '@/components/PromptCard'
import { categoryColorMap, toolColorMap } from '@/lib/constants'
import { Prompt } from '@/lib/types'
import promptsData from '@/data/prompts.json'

const prompts = promptsData as Prompt[]

export function generateStaticParams() {
  return (promptsData as Prompt[]).map(p => ({ id: p.id }))
}

function HighlightedText({ text }: { text: string }) {
  const parts = text.split(/(\[[A-Z][A-Z0-9_\s]*\]|\{\{[A-Z][A-Z0-9_\s]*\}\})/g)
  return (
    <>
      {parts.map((part, i) =>
        (/^\[/.test(part) || /^\{\{/.test(part))
          ? <mark key={i} className="placeholder-highlight">{part}</mark>
          : <span key={i}>{part}</span>
      )}
    </>
  )
}

export default function PromptDetailPage({ params }: { params: { id: string } }) {
  const prompt = prompts.find(p => p.id === params.id)
  if (!prompt) return notFound()

  const categoryColor = categoryColorMap[prompt.category] || '#6366f1'
  const toolColor = toolColorMap[prompt.tool] || '#94a3b8'
  const related = prompts.filter(p => p.category === prompt.category && p.id !== prompt.id).slice(0, 3)

  return (
    <div style={{ maxWidth: '860px', margin: '0 auto', padding: '2rem 1.5rem' }}>
      <RecentlyViewedTracker id={prompt.id} type="prompt" title={prompt.title} categorySlug={prompt.categorySlug} />
      <div style={{ marginBottom: '2rem' }}>
        <Link href="/prompts" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-muted)', textDecoration: 'none', fontSize: '0.875rem', marginBottom: '0.75rem' }}>
          <ArrowLeft size={14} /> Back to Library
        </Link>
        <nav aria-label="Breadcrumb" style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
          <Link href="/prompts" style={{ color: 'var(--text-muted)', textDecoration: 'none' }}>Library</Link>
          {' → '}
          <Link href={`/categories/${prompt.categorySlug}`} style={{ color: 'var(--text-muted)', textDecoration: 'none' }}>{prompt.category}</Link>
          {' → '}
          <span style={{ color: 'var(--text-secondary)' }}>{prompt.title}</span>
        </nav>
      </div>

      <h1 style={{ fontFamily: 'var(--font-outfit)', fontSize: 'clamp(1.65rem, 4vw, 2.5rem)', fontWeight: 800, lineHeight: 1.2, letterSpacing: '-0.02em', marginBottom: '1.25rem' }}>
        {prompt.title}
      </h1>

      <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '1.5rem', alignItems: 'center' }}>
        <span style={{ backgroundColor: `${categoryColor}20`, color: categoryColor, border: `1px solid ${categoryColor}40`, borderRadius: '6px', padding: '4px 12px', fontSize: '0.8rem', fontWeight: 600 }}>{prompt.category}</span>
        <span style={{ backgroundColor: `${toolColor}20`, color: toolColor, border: `1px solid ${toolColor}40`, borderRadius: '6px', padding: '4px 12px', fontSize: '0.8rem', fontWeight: 600 }}>{prompt.tool}</span>
        {prompt.tags.map(tag => (
          <span key={tag} style={{ backgroundColor: 'var(--bg-elevated)', color: 'var(--text-muted)', borderRadius: '6px', padding: '4px 10px', fontSize: '0.75rem', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
            <Tag size={10} />{tag}
          </span>
        ))}
      </div>

      {prompt.hasDemoData && (
        <div style={{ backgroundColor: 'var(--demo-dim)', border: '1px solid rgba(217,119,6,0.3)', borderRadius: '12px', padding: '1.25rem', marginBottom: '1.5rem', display: 'flex', gap: '0.75rem' }}>
          <Zap size={20} style={{ color: 'var(--demo-badge)', flexShrink: 0, marginTop: '2px' }} />
          <div>
            <div style={{ fontWeight: 700, color: 'var(--demo-badge)', marginBottom: '0.25rem' }}>📊 Enterprise Demo Data Available</div>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', margin: 0, lineHeight: 1.5 }}>
              Download the data files below and upload to Copilot Chat before running this prompt.
            </p>
          </div>
        </div>
      )}

      <div style={{ marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem', flexWrap: 'wrap', gap: '0.5rem' }}>
          <h2 style={{ fontFamily: 'var(--font-outfit)', fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Prompt</h2>
          <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
            <ShareButton />
            <CopyButton text={prompt.prompt} />
          </div>
        </div>
        <div style={{ backgroundColor: 'var(--bg-surface)', border: '1px solid var(--border)', borderRadius: '12px', padding: '1.5rem' }}>
          <pre className="prompt-body" style={{ margin: 0 }}>
            <HighlightedText text={prompt.prompt} />
          </pre>
        </div>
      </div>

      {prompt.hasDemoData && prompt.demoDataFiles.length > 0 && (
        <div style={{ marginBottom: '2.5rem' }}>
          <h2 style={{ fontFamily: 'var(--font-outfit)', fontSize: '1.1rem', fontWeight: 700, marginBottom: '1rem' }}>Demo Data Files</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '1rem' }}>
            {prompt.demoDataFiles.map(file => (
              <div key={file.filename} className="card-surface" style={{ borderRadius: '10px', padding: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem', flexWrap: 'wrap' }}>
                    <FileText size={14} style={{ color: 'var(--text-muted)', flexShrink: 0 }} />
                    <span style={{ fontWeight: 600, fontSize: '0.9rem' }}>{file.label}</span>
                    <span style={{ backgroundColor: file.filename.endsWith('.csv') ? 'rgba(34,197,94,0.15)' : 'rgba(99,102,241,0.15)', color: file.filename.endsWith('.csv') ? '#22c55e' : 'var(--accent)', borderRadius: '4px', padding: '1px 6px', fontSize: '0.68rem', fontWeight: 700, textTransform: 'uppercase' }}>{file.filename.split('.').pop()}</span>
                  </div>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem', margin: '0 0 0.25rem' }}>{file.description}</p>
                  <code style={{ color: 'var(--text-muted)', fontSize: '0.72rem', fontFamily: 'var(--font-jetbrains)' }}>{file.filename}</code>
                </div>
                <a href={`/demo-data/${file.filename}`} download style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', backgroundColor: 'var(--bg-elevated)', color: 'var(--text-primary)', border: '1px solid var(--border)', borderRadius: '8px', padding: '8px 14px', fontSize: '0.8rem', fontWeight: 600, textDecoration: 'none', whiteSpace: 'nowrap' }}>
                  <Download size={14} /> Download
                </a>
              </div>
            ))}
          </div>
        </div>
      )}

      {related.length > 0 && (
        <div style={{ marginBottom: '2rem' }}>
          <h2 style={{ fontFamily: 'var(--font-outfit)', fontSize: '1.1rem', fontWeight: 700, marginBottom: '1rem' }}>More from {prompt.category}</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '1rem' }}>
            {related.map((p, i) => <PromptCard key={p.id} prompt={p} index={i} />)}
          </div>
        </div>
      )}

      <Link href="/prompts" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-muted)', textDecoration: 'none', fontSize: '0.875rem' }}>
        <ArrowLeft size={14} /> Back to Library
      </Link>
    </div>
  )
}
