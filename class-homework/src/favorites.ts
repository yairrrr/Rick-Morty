import { useEffect, useState } from 'react'
import type { Character } from './types'

const STORAGE_KEY = 'favorite-characters'

// Anything can be in localStorage (an old version of the app, a browser
// extension, someone typing in the console), so only real characters are
// kept: anything else would crash the details panel
function isCharacter(value: unknown): value is Character {
  const c = value as Character
  return (
    typeof c === 'object' &&
    c !== null &&
    typeof c.id === 'number' &&
    typeof c.name === 'string' &&
    typeof c.image === 'string' &&
    c.image.startsWith('https://') &&
    typeof c.status === 'string' &&
    typeof c.species === 'string' &&
    typeof c.type === 'string' &&
    typeof c.gender === 'string' &&
    typeof c.origin?.name === 'string' &&
    typeof c.location?.name === 'string' &&
    Array.isArray(c.episode)
  )
}

// The whole character is saved, so favorites show up
// even before their page of the list is loaded
function loadFavorites(): Character[] {
  try {
    const saved: unknown = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '[]')
    return Array.isArray(saved) ? saved.filter(isCharacter) : []
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
