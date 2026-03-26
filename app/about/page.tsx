import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import promptsData from '@/data/prompts.json'
import { categories } from '@/lib/constants'
import { Prompt } from '@/lib/types'

const prompts = promptsData as Prompt[]
const promptCount = prompts.length
const categoryCount = categories.length

export default function AboutPage() {
  return (
    <div style={{ maxWidth: '760px', margin: '0 auto', padding: '3rem 1.5rem' }}>
      <h1 style={{ fontFamily: 'var(--font-outfit)', fontSize: '2.5rem', fontWeight: 800, letterSpacing: '-0.02em', marginBottom: '0.75rem' }}>About This Library</h1>
      <p style={{ color: 'var(--text-secondary)', fontSize: '1.05rem', lineHeight: 1.7, marginBottom: '3rem' }}>
        A curated collection of {promptCount.toLocaleString()} enterprise-grade AI prompts for Microsoft 365 Copilot and other AI tools — built for finance, legal, operations, sales, and technology professionals across {categoryCount} categories.
      </p>
      <section style={{ marginBottom: '2.5rem' }}>
        <h2 style={{ fontFamily: 'var(--font-outfit)', fontSize: '1.4rem', fontWeight: 700, marginBottom: '1rem' }}>How to Use the Prompts</h2>
        <ol style={{ color: 'var(--text-secondary)', lineHeight: 2.1, paddingLeft: '1.5rem' }}>
          <li>Browse or search for a prompt that fits your need</li>
          <li>Click &quot;Copy Prompt&quot; to copy the full text to your clipboard</li>
          <li>Customize the <mark className="placeholder-highlight">[PLACEHOLDER]</mark> fields with your specific details</li>
          <li>Paste into Copilot Chat, Teams, Word, Excel, or any AI tool</li>
        </ol>
      </section>
      <section style={{ marginBottom: '2.5rem' }}>
        <h2 style={{ fontFamily: 'var(--font-outfit)', fontSize: '1.4rem', fontWeight: 700, marginBottom: '1rem' }}>How Demo Data Works</h2>
        <p style={{ color: 'var(--text-secondary)', lineHeight: 1.75 }}>
          Select prompts include enterprise-grade demo datasets — real CSV and TXT files with realistic data. Download a file, upload it to Copilot Chat, then run the prompt to get structured, actionable output immediately.
        </p>
      </section>
      <Link href="/prompts" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', backgroundColor: 'var(--accent)', color: 'white', borderRadius: '10px', padding: '0.75rem 1.5rem', textDecoration: 'none', fontWeight: 600, fontSize: '0.9rem' }}>
        Browse All Prompts <ArrowRight size={16} />
      </Link>
    </div>
  )
}
