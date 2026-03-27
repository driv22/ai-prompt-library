'use client'
import Link from 'next/link'
import { Zap, Clapperboard, Check } from 'lucide-react'
import { motion } from 'framer-motion'
import { useState } from 'react'
import { Prompt } from '@/lib/types'
import { categoryColorMap, toolColorMap } from '@/lib/constants'
import { FavoriteButton } from '@/components/FavoriteButton'
import { useScriptBuilderContext, useIsInScript } from '@/components/ScriptBuilderContext'

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

// Today is 2026-03-26; "New" = within 90 days = after 2025-12-27
const NEW_CUTOFF = new Date('2025-12-27').getTime()

function isNew(createdAt?: string): boolean {
  if (!createdAt) return false
  try {
    return new Date(createdAt).getTime() > NEW_CUTOFF
  } catch {
    return false
  }
}

export function PromptCard({ prompt, index }: { prompt: Prompt; index: number }) {
  const categoryColor = categoryColorMap[prompt.category] || '#6366f1'
  const toolColor = toolColorMap[prompt.tool] || '#94a3b8'
  const preview = prompt.prompt.slice(0, 160) + (prompt.prompt.length > 160 ? '...' : '')
  const showNew = isNew(prompt.createdAt)
  const ctx = useScriptBuilderContext()
  const { addPrompt } = ctx ?? { addPrompt: () => {} }
  const inScript = useIsInScript(prompt.id)
  const [scriptAdded, setScriptAdded] = useState(false)

  const handleAddToScript = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    addPrompt(prompt)
    setScriptAdded(true)
    setTimeout(() => setScriptAdded(false), 1500)
  }

  return (
    <motion.div variants={cardVariants} initial="hidden" animate="visible" custom={index} style={{ height: '100%', position: 'relative' }}>
      <Link href={`/prompts/${prompt.id}`} style={{ textDecoration: 'none', display: 'block', height: '100%' }}>
        <div className="card-surface" style={{ borderRadius: '12px', padding: '1.25rem', height: '100%', boxSizing: 'border-box' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem', gap: '0.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', flexWrap: 'wrap', minWidth: 0, flex: 1 }}>
              <span style={{ backgroundColor: `${categoryColor}20`, color: categoryColor, border: `1px solid ${categoryColor}40`, borderRadius: '6px', padding: '2px 8px', fontSize: '0.7rem', fontWeight: 600, lineHeight: 1.5, flexShrink: 1, minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {prompt.category}
              </span>
              {showNew && (
                <span style={{ backgroundColor: '#22c55e20', color: '#22c55e', border: '1px solid #22c55e40', borderRadius: '6px', padding: '2px 8px', fontSize: '0.7rem', fontWeight: 700, whiteSpace: 'nowrap', flexShrink: 0 }}>
                  New
                </span>
              )}
            </div>
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
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 'auto' }}>
            <span style={{ backgroundColor: `${toolColor}20`, color: toolColor, border: `1px solid ${toolColor}40`, borderRadius: '6px', padding: '2px 8px', fontSize: '0.7rem', fontWeight: 500 }}>
              {prompt.tool}
            </span>
            <button onClick={handleAddToScript}
              title={inScript ? 'Already in script' : 'Add to Demo Script'}
              style={{ display: 'inline-flex', alignItems: 'center', gap: '3px', padding: '3px 8px', borderRadius: '6px', border: `1px solid ${inScript ? '#22c55e40' : 'rgba(99,102,241,0.3)'}`, backgroundColor: inScript ? '#22c55e15' : 'transparent', color: inScript ? '#22c55e' : 'var(--text-muted)', cursor: inScript ? 'default' : 'pointer', fontSize: '0.68rem', fontWeight: 600, transition: 'all 0.15s' }}
              onMouseEnter={e => { if (!inScript) { e.currentTarget.style.borderColor = 'var(--accent)'; e.currentTarget.style.color = 'var(--accent)' } }}
              onMouseLeave={e => { if (!inScript) { e.currentTarget.style.borderColor = 'rgba(99,102,241,0.3)'; e.currentTarget.style.color = 'var(--text-muted)' } }}>
              {scriptAdded || inScript ? <Check size={10} /> : <Clapperboard size={10} />}
              {scriptAdded ? 'Added!' : inScript ? 'In Script' : 'Add to Script'}
            </button>
          </div>
        </div>
      </Link>
      {/* FavoriteButton outside the Link, absolutely positioned top-right */}
      <div style={{ position: 'absolute', top: '10px', right: '10px', zIndex: 2 }}>
        <FavoriteButton id={prompt.id} size={15} />
      </div>
    </motion.div>
  )
}
