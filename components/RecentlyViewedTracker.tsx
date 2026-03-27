'use client'
import { useEffect } from 'react'
import { useRecentlyViewed } from '@/hooks/useRecentlyViewed'

interface Props {
  id: string
  type: 'prompt' | 'agent'
  title: string
  categorySlug: string
}

export function RecentlyViewedTracker({ id, type, title, categorySlug }: Props) {
  const { addRecent } = useRecentlyViewed()
  useEffect(() => {
    addRecent({ id, type, title, categorySlug })
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id])
  return null
}
