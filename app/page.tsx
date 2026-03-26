'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Search, ArrowRight, Copy, Database, Building2, Briefcase, PenLine, Code2, BarChart3, Rocket, TrendingUp, GraduationCap, Scale, Megaphone, Wallet, Presentation, BookOpen, Trophy, Plane, Video, Target, Bot } from 'lucide-react'
import { motion } from 'framer-motion'
import { categories, categoryColorMap } from '@/lib/constants'
import { PromptCard } from '@/components/PromptCard'
import { Prompt } from '@/lib/types'
import promptsData from '@/data/prompts.json'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const iconMap: Record<string, React.ComponentType<any>> = {
  Building2, Briefcase, PenLine, Code2, BarChart3, Rocket, TrendingUp,
  GraduationCap, Scale, Megaphone, Wallet, Presentation, BookOpen,
  Trophy, Plane, Video, Target, Bot, Search,
}

const prompts = promptsData as Prompt[]
const featured = prompts.filter(p => p.featured).slice(0, 6)

export default function HomePage() {
  const [q, setQ] = useState('')
  const router = useRouter()
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (q.trim()) router.push(`/prompts?q=${encodeURIComponent(q)}`)
  }

  return (
    <div>
      {/* Hero */}
      <section className="hero-bg" style={{ padding: '6rem 1.5rem 5rem', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'relative', zIndex: 1, maxWidth: '760px', margin: '0 auto' }}>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <span style={{ display: 'inline-block', backgroundColor: 'var(--accent-dim)', color: 'var(--accent-hover)', border: '1px solid rgba(99,102,241,0.3)', borderRadius: '100px', padding: '4px 16px', fontSize: '0.75rem', fontWeight: 600, marginBottom: '1.5rem', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
              Enterprise-Grade · Microsoft 365 Copilot
            </span>
          </motion.div>
          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.1 }}
            style={{ fontFamily: 'var(--font-outfit)', fontSize: 'clamp(2.25rem, 5.5vw, 3.75rem)', fontWeight: 800, lineHeight: 1.1, letterSpacing: '-0.02em', marginBottom: '1.25rem', color: 'var(--text-primary)' }}>
            The AI Prompt Library
          </motion.h1>
          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.2 }}
            style={{ fontSize: '1.15rem', color: 'var(--text-secondary)', marginBottom: '2.5rem', lineHeight: 1.65 }}>
            250 enterprise-grade AI prompts, ready to deploy
          </motion.p>
          <motion.form initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.3 }}
            onSubmit={handleSearch} style={{ display: 'flex', gap: '0.75rem', maxWidth: '560px', margin: '0 auto' }}>
            <div style={{ position: 'relative', flex: 1 }}>
              <Search size={17} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)', pointerEvents: 'none' }} />
              <input type="text" placeholder="Search prompts..." value={q} onChange={e => setQ(e.target.value)} aria-label="Search prompts"
                style={{ width: '100%', padding: '0.875rem 1rem 0.875rem 2.75rem', borderRadius: '10px', border: '1px solid rgba(99,102,241,0.3)', backgroundColor: 'rgba(10,10,15,0.7)', color: 'var(--text-primary)', fontSize: '0.95rem', outline: 'none', backdropFilter: 'blur(8px)', boxSizing: 'border-box' }}
                onFocus={e => (e.currentTarget.style.borderColor = 'var(--border-focus)')}
                onBlur={e => (e.currentTarget.style.borderColor = 'rgba(99,102,241,0.3)')} />
            </div>
            <button type="submit" style={{ backgroundColor: 'var(--accent)', color: 'white', border: 'none', borderRadius: '10px', padding: '0 1.5rem', fontSize: '0.9rem', fontWeight: 600, cursor: 'pointer', whiteSpace: 'nowrap' }}>
              Search
            </button>
          </motion.form>
        </div>
      </section>

      {/* Stats */}
      <section style={{ borderBottom: '1px solid var(--border)', borderTop: '1px solid var(--border)', backgroundColor: 'var(--bg-surface)' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '1.5rem', display: 'flex', justifyContent: 'center', gap: '4rem', flexWrap: 'wrap' }}>
          {[['250', 'Prompts'], ['20', 'Categories'], ['13', 'Demo Datasets']].map(([num, label]) => (
            <div key={label} style={{ textAlign: 'center' }}>
              <div style={{ fontFamily: 'var(--font-outfit)', fontSize: '2rem', fontWeight: 800, color: 'var(--accent)', lineHeight: 1 }}>{num}</div>
              <div style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginTop: '0.25rem' }}>{label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Categories */}
      <section style={{ maxWidth: '1280px', margin: '0 auto', padding: '4rem 1.5rem' }}>
        <h2 style={{ fontFamily: 'var(--font-outfit)', fontSize: '1.75rem', fontWeight: 700, marginBottom: '0.5rem' }}>Browse by Category</h2>
        <p style={{ color: 'var(--text-muted)', marginBottom: '2rem', fontSize: '0.95rem' }}>20 categories covering every professional use case</p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(210px, 1fr))', gap: '1rem' }}>
          {categories.map(cat => {
            const Icon = iconMap[cat.icon] || BookOpen
            const color = categoryColorMap[cat.name] || '#6366f1'
            return (
              <Link key={cat.slug} href={`/categories/${cat.slug}`} style={{ textDecoration: 'none' }}>
                <div className="card-surface" style={{ borderRadius: '12px', padding: '1.25rem', cursor: 'pointer' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
                    <div style={{ backgroundColor: `${color}20`, borderRadius: '8px', padding: '8px' }}>
                      <Icon size={20} style={{ color }} />
                    </div>
                    <span style={{ backgroundColor: 'var(--bg-elevated)', color: 'var(--text-muted)', borderRadius: '6px', padding: '2px 8px', fontSize: '0.75rem', fontWeight: 600 }}>{cat.count}</span>
                  </div>
                  <h3 style={{ fontFamily: 'var(--font-outfit)', fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-primary)', lineHeight: 1.35 }}>{cat.name}</h3>
                </div>
              </Link>
            )
          })}
        </div>
      </section>

      {/* Featured */}
      {featured.length > 0 && (
        <section style={{ backgroundColor: 'var(--bg-surface)', borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)' }}>
          <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '4rem 1.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
              <div>
                <h2 style={{ fontFamily: 'var(--font-outfit)', fontSize: '1.75rem', fontWeight: 700, marginBottom: '0.25rem' }}>Featured Prompts</h2>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Hand-picked with enterprise demo data included</p>
              </div>
              <Link href="/prompts" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--accent)', textDecoration: 'none', fontWeight: 600, fontSize: '0.9rem' }}>
                View all 250 <ArrowRight size={16} />
              </Link>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1rem' }}>
              {featured.map((p, i) => <PromptCard key={p.id} prompt={p} index={i} />)}
            </div>
          </div>
        </section>
      )}

      {/* How to Use */}
      <section style={{ maxWidth: '1280px', margin: '0 auto', padding: '4rem 1.5rem' }}>
        <h2 style={{ fontFamily: 'var(--font-outfit)', fontSize: '1.75rem', fontWeight: 700, textAlign: 'center', marginBottom: '3rem' }}>How It Works</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '2rem' }}>
          {[
            { step: '01', icon: <Search size={24} />, title: 'Browse', desc: 'Search 250 curated prompts across 20 enterprise categories. Filter by tool or demo data availability.' },
            { step: '02', icon: <Copy size={24} />, title: 'Copy', desc: 'One-click copy. Customize the [PLACEHOLDER] fields for your specific context, team, or data.' },
            { step: '03', icon: <Database size={24} />, title: 'Upload & Run', desc: 'For prompts with demo data, upload the CSV/TXT file to Copilot Chat and run immediately.' },
          ].map(item => (
            <div key={item.step} style={{ textAlign: 'center' }}>
              <div style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '52px', height: '52px', borderRadius: '12px', backgroundColor: 'var(--accent-dim)', color: 'var(--accent)', marginBottom: '1rem' }}>
                {item.icon}
              </div>
              <div style={{ fontSize: '0.7rem', fontWeight: 700, color: 'var(--accent)', letterSpacing: '0.1em', marginBottom: '0.5rem' }}>STEP {item.step}</div>
              <h3 style={{ fontFamily: 'var(--font-outfit)', fontSize: '1.05rem', fontWeight: 700, marginBottom: '0.5rem' }}>{item.title}</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', lineHeight: 1.65 }}>{item.desc}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
