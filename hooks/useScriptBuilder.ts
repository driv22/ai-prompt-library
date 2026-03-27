'use client'
import { useState, useCallback } from 'react'
import { Prompt } from '@/lib/types'

// Update this to your deployed Cloudflare Worker URL after setup
export const WORKER_URL = 'https://prompt-vault-script.dlrivero2.workers.dev'

type GenerateStatus = 'idle' | 'generating' | 'done' | 'error'

export function useScriptBuilder() {
  const [selectedPrompts, setSelectedPrompts] = useState<Prompt[]>([])
  const [script, setScript] = useState<string>('')
  const [status, setStatus] = useState<GenerateStatus>('idle')
  const [error, setError] = useState<string>('')

  const addPrompt = useCallback((prompt: Prompt) => {
    setSelectedPrompts(prev => {
      if (prev.find(p => p.id === prompt.id)) return prev
      if (prev.length >= 10) return prev
      return [...prev, prompt]
    })
  }, [])

  const removePrompt = useCallback((id: string) => {
    setSelectedPrompts(prev => prev.filter(p => p.id !== id))
  }, [])

  const reorderPrompts = useCallback((from: number, to: number) => {
    setSelectedPrompts(prev => {
      const next = [...prev]
      const [moved] = next.splice(from, 1)
      next.splice(to, 0, moved)
      return next
    })
  }, [])

  const clearAll = useCallback(() => {
    setSelectedPrompts([])
    setScript('')
    setStatus('idle')
    setError('')
  }, [])

  const generate = useCallback(async (opts: {
    company: string
    industry: string
    audience: string
    duration: string
  }) => {
    if (selectedPrompts.length === 0) return
    setStatus('generating')
    setError('')
    setScript('')

    try {
      const res = await fetch(WORKER_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompts: selectedPrompts.map(p => ({
            title: p.title,
            category: p.category,
            prompt: p.prompt,
          })),
          ...opts,
        }),
      })

      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Generation failed')
      setScript(data.script)
      setStatus('done')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong. Please try again.')
      setStatus('error')
    }
  }, [selectedPrompts])

  return {
    selectedPrompts,
    addPrompt,
    removePrompt,
    reorderPrompts,
    clearAll,
    generate,
    script,
    status,
    error,
  }
}
