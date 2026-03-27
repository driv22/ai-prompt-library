'use client'
import { useState, useEffect, useCallback } from 'react'

const STORAGE_KEY = 'pv-recent'
const MAX_ITEMS = 10

export interface RecentItem {
  id: string
  type: 'prompt' | 'agent'
  title: string
  categorySlug: string
  viewedAt: number
}

export function useRecentlyViewed() {
  const [recent, setRecent] = useState<RecentItem[]>([])

  useEffect(() => {
    if (typeof window === 'undefined') return
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      if (stored) {
        const parsed: RecentItem[] = JSON.parse(stored)
        setRecent(parsed)
      }
    } catch {
      // ignore parse errors
    }
  }, [])

  const addRecent = useCallback((item: Omit<RecentItem, 'viewedAt'>) => {
    setRecent(prev => {
      // Remove existing entry for this id if present
      const filtered = prev.filter(r => r.id !== item.id)
      const newItem: RecentItem = { ...item, viewedAt: Date.now() }
      const next = [newItem, ...filtered].slice(0, MAX_ITEMS)
      if (typeof window !== 'undefined') {
        try {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
        } catch {
          // ignore storage errors
        }
      }
      return next
    })
  }, [])

  return { recent, addRecent }
}
