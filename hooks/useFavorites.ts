'use client'
import { useState, useEffect, useCallback } from 'react'

const STORAGE_KEY = 'pv-favorites'

export function useFavorites() {
  const [favorites, setFavorites] = useState<Set<string>>(new Set())

  useEffect(() => {
    if (typeof window === 'undefined') return
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      if (stored) {
        const parsed: string[] = JSON.parse(stored)
        setFavorites(new Set(parsed))
      }
    } catch {
      // ignore parse errors
    }
  }, [])

  const toggle = useCallback((id: string) => {
    setFavorites(prev => {
      const next = new Set(prev)
      if (next.has(id)) {
        next.delete(id)
      } else {
        next.add(id)
      }
      if (typeof window !== 'undefined') {
        try {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(Array.from(next)))
        } catch {
          // ignore storage errors
        }
      }
      return next
    })
  }, [])

  const isFavorited = useCallback((id: string) => favorites.has(id), [favorites])

  return { favorites, toggle, isFavorited }
}
