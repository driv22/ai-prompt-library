'use client'
import Link from 'next/link'
import { Zap } from 'lucide-react'
import { motion } from 'framer-motion'
import { Prompt } from '@/lib/types'
import { categoryColorMap, toolColorMap } from '@/lib/constants'

const cardVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: (i: number) => ({
    opacity: 1, y: 0,
    transition: { delay: Math.min(i, 11) * 0.04, duration: 0.3, ease: 'easeOut' as const }
  })
}

function HighlightedPreview({ text }: { text: string }) {
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

export function PromptCard({ prompt, index }: { prompt: Prompt; index: number }) {
  const categoryColor = categoryColorMap[prompt.category] || '#6366f1'
  const toolColor = toolColorMap[prompt.tool] || '#94a3b8'
  const preview = prompt.prompt.slice(0, 160) + (prompt.prompt.length > 160 ? '...' : '')
  return (
    <motion.div variants={cardVariants} initial="hidden" animate="visible" custom={index} style={{ height: '100%' }}>
      <Link href={`/prompts/${prompt.id}`} style={{ textDecoration: 'none', display: 'block', height: '100%' }}>
        <div className="card-surface" style={{ borderRadius: '12px', padding: '1.25rem', height: '100%', boxSizing: 'border-box' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem', gap: '0.5rem' }}>
            <span style={{ backgroundColor: `${categoryColor}20`, color: categoryColor, border: `1px solid ${categoryColor}40`, borderRadius: '6px', padding: '2px 8px', fontSize: '0.7rem', fontWeight: 600, lineHeight: 1.5, flexShrink: 1, minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {prompt.category}
            </span>
            {prompt.hasDemoData && (
              <span className="demo-badge-pulse" style={{ display: 'inline-flex', alignItems: 'center', gap: '3px', backgroundColor: 'var(--demo-badge)', color: 'white', borderRadius: '6px', padding: '2px 8px', fontSize: '0.7rem', fontWeight: 700, whiteSpace: 'nowrap', flexShrink: 0 }}>
                <Zap size={10} /> Demo Data
              </span>
            )}
          </div>
          <h3 style={{ fontFamily: 'var(--font-outfit)', fontWeight: 600, fontSize: '0.95rem', color: 'var(--text-primary)', marginBottom: '0.5rem', lineHeight: 1.35 }}>
            {prompt.title}
          </h3>
          <div className="prompt-body" style={{ fontSize: '0.775rem', marginBottom: '1rem', display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
            <HighlightedPreview text={preview} />
          </div>
          <span style={{ backgroundColor: `${toolColor}20`, color: toolColor, border: `1px solid ${toolColor}40`, borderRadius: '6px', padding: '2px 8px', fontSize: '0.7rem', fontWeight: 500 }}>
            {prompt.tool}
          </span>
        </div>
      </Link>
    </motion.div>
  )
}
