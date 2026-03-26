'use client'
import { useState, useCallback, useRef } from 'react'
import { Prompt } from '@/lib/types'

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

export function useSemanticSearch(prompts: Prompt[]) {
  const [status, setStatus] = useState<Status>('idle')
  const [results, setResults] = useState<Prompt[] | null>(null)
  const embeddingsRef = useRef<EmbeddingEntry[] | null>(null)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const pipelineRef = useRef<any>(null)

  const search = useCallback(async (query: string) => {
    if (!query.trim()) { setResults(null); setStatus('idle'); return }

    try {
      setStatus('loading-model')

      // Load pre-computed prompt embeddings once
      if (!embeddingsRef.current) {
        const res = await fetch('/ai-prompt-library/embeddings.json')
        embeddingsRef.current = await res.json()
      }

      // Load the model once — cached by browser after first use
      if (!pipelineRef.current) {
        const { pipeline } = await import('@xenova/transformers')
        pipelineRef.current = await pipeline('feature-extraction', 'Xenova/all-MiniLM-L6-v2')
      }

      setStatus('searching')

      const out = await pipelineRef.current(query, { pooling: 'mean', normalize: true })
      const queryVec = Array.from(out.data) as number[]

      const promptMap = new Map(prompts.map(p => [p.id, p]))

      const ranked = (embeddingsRef.current ?? [])
        .map(e => ({ id: e.id, score: cosineSim(queryVec, e.vec) }))
        .sort((a, b) => b.score - a.score)
        .slice(0, 24)
        .map(s => promptMap.get(s.id))
        .filter((p): p is Prompt => !!p)

      setResults(ranked)
      setStatus('done')
    } catch {
      setStatus('error')
    }
  }, [prompts])

  const clear = useCallback(() => {
    setResults(null)
    setStatus('idle')
  }, [])

  return { search, results, status, clear }
}
