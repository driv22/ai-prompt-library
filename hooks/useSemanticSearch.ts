'use client'
import { useState, useCallback, useRef } from 'react'

type EmbeddingEntry = { id: string; vec: number[] }
type Status = 'idle' | 'loading-model' | 'searching' | 'done' | 'error'

function cosineSim(a: number[], b: number[]): number {
  let dot = 0, na = 0, nb = 0
  for (let i = 0; i < a.length; i++) {
    dot += a[i] * b[i]
    na += a[i] * a[i]
    nb += b[i] * b[i]
  }
  return dot / (Math.sqrt(na) * Math.sqrt(nb) + 1e-10)
}

// Shared model reference — only one download regardless of how many hooks are mounted
// eslint-disable-next-line @typescript-eslint/no-explicit-any
let sharedPipeline: any = null

interface HasId { id: string }

export function useSemanticSearch<T extends HasId>(items: T[], embeddingsUrl: string) {
  const [status, setStatus] = useState<Status>('idle')
  const [results, setResults] = useState<T[] | null>(null)
  const embeddingsRef = useRef<EmbeddingEntry[] | null>(null)

  const search = useCallback(async (query: string) => {
    if (!query.trim()) { setResults(null); setStatus('idle'); return }

    try {
      setStatus('loading-model')

      if (!embeddingsRef.current) {
        const res = await fetch(embeddingsUrl)
        embeddingsRef.current = await res.json()
      }

      if (!sharedPipeline) {
        const { pipeline } = await import('@xenova/transformers')
        sharedPipeline = await pipeline('feature-extraction', 'Xenova/all-MiniLM-L6-v2')
      }

      setStatus('searching')

      const out = await sharedPipeline(query, { pooling: 'mean', normalize: true })
      const queryVec = Array.from(out.data) as number[]

      const itemMap = new Map(items.map(p => [p.id, p]))

      const ranked = (embeddingsRef.current ?? [])
        .map(e => ({ id: e.id, score: cosineSim(queryVec, e.vec) }))
        .sort((a, b) => b.score - a.score)
        .slice(0, 24)
        .map(s => itemMap.get(s.id))
        .filter((p): p is T => !!p)

      setResults(ranked)
      setStatus('done')
    } catch {
      setStatus('error')
    }
  }, [items, embeddingsUrl])

  const clear = useCallback(() => {
    setResults(null)
    setStatus('idle')
  }, [])

  return { search, results, status, clear }
}
