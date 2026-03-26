import { useState, useMemo } from 'react'
import Fuse from 'fuse.js'
import { Prompt } from '@/lib/types'

export function useFilters(prompts: Prompt[]) {
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState<string | null>(null)
  const [tool, setTool] = useState<string | null>(null)
  const [hasDemoData, setHasDemoData] = useState(false)

  const fuse = useMemo(() => new Fuse(prompts, {
    keys: [
      { name: 'title', weight: 2 },
      { name: 'prompt', weight: 1 },
      { name: 'description', weight: 1.2 },
      { name: 'tags', weight: 1.5 },
      { name: 'category', weight: 1 },
      { name: 'tool', weight: 1 },
    ],
    threshold: 0.35,
  }), [prompts])

  const filtered = useMemo(() => {
    let results = query ? fuse.search(query).map(r => r.item) : [...prompts]
    if (category) results = results.filter(p => p.category === category)
    if (tool) results = results.filter(p => p.tool === tool)
    if (hasDemoData) results = results.filter(p => p.hasDemoData)
    return results
  }, [query, category, tool, hasDemoData, fuse, prompts])

  const clearAll = () => { setQuery(''); setCategory(null); setTool(null); setHasDemoData(false) }
  return { query, setQuery, category, setCategory, tool, setTool, hasDemoData, setHasDemoData, filtered, clearAll }
}
