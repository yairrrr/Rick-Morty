import type { Character } from './types'

const BASE_URL = 'https://rickandmortyapi.com/api/character'

// The first page of characters, or of characters whose name includes `name`
export function firstPageUrl(name: string) {
  return name ? `${BASE_URL}?name=${encodeURIComponent(name)}` : BASE_URL
}

// The API returns one page of 20 characters plus a link to the next page
type CharacterPage = {
  info: { next: string | null }
  results: Character[]
}

export async function fetchCharacters(
  url: string,
  signal?: AbortSignal,
): Promise<CharacterPage> {
  const response = await fetch(url, { signal })
  // A search with no matches answers 404 instead of an empty list
  if (response.status === 404) {
    return { info: { next: null }, results: [] }
  }
  if (!response.ok) {
    throw new Error(`Request failed with status ${response.status}`)
  }
  return response.json()
}
