import { useEffect, useState } from 'react'
import type { Character } from './types'

const STORAGE_KEY = 'favorite-characters'

// The whole character is saved, so favorites show up
// even before their page of the list is loaded
function loadFavorites(): Character[] {
  try {
    const saved = localStorage.getItem(STORAGE_KEY)
    return saved ? JSON.parse(saved) : []
  } catch {
    // Private windows can block storage, start with no favorites
    return []
  }
}

export function useFavorites() {
  const [favorites, setFavorites] = useState<Character[]>(loadFavorites)

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(favorites))
    } catch {
      // Not saved, but favorites still work until the page is closed
    }
  }, [favorites])

  function isFavorite(id: number) {
    return favorites.some((c) => c.id === id)
  }

  function toggleFavorite(character: Character) {
    setFavorites((current) =>
      current.some((c) => c.id === character.id)
        ? current.filter((c) => c.id !== character.id)
        : [...current, character],
    )
  }

  return { favorites, isFavorite, toggleFavorite }
}
