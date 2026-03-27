'use client'
import { Heart } from 'lucide-react'
import { useFavorites } from '@/hooks/useFavorites'

interface FavoriteButtonProps {
  id: string
  size?: number
}

export function FavoriteButton({ id, size = 16 }: FavoriteButtonProps) {
  const { isFavorited, toggle } = useFavorites()
  const favorited = isFavorited(id)

  return (
    <button
      onClick={e => {
        e.preventDefault()
        e.stopPropagation()
        toggle(id)
      }}
      aria-label={favorited ? 'Remove from favorites' : 'Add to favorites'}
      style={{
        background: 'transparent',
        border: 'none',
        cursor: 'pointer',
        padding: '4px',
        borderRadius: '6px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: favorited ? '#ef4444' : 'var(--text-muted)',
        transition: 'color 0.2s ease, transform 0.15s ease',
        lineHeight: 1,
      }}
      onMouseEnter={e => {
        if (!favorited) (e.currentTarget as HTMLButtonElement).style.color = '#ef4444'
      }}
      onMouseLeave={e => {
        if (!favorited) (e.currentTarget as HTMLButtonElement).style.color = 'var(--text-muted)'
      }}
    >
      <Heart
        size={size}
        fill={favorited ? '#ef4444' : 'none'}
        style={{ transition: 'fill 0.2s ease' }}
      />
    </button>
  )
}
