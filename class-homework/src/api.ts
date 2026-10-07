import type { Character } from './types'

const API_URL = 'https://rickandmortyapi.com/api/character'

// The API returns one page of 20 characters plus a link to the next page
type CharacterPage = {
  info: { next: string | null }
  results: Character[]
}

export async function fetchCharacters(signal: AbortSignal): Promise<CharacterPage> {
  const response = await fetch(API_URL, { signal })
  if (!response.ok) {
    throw new Error(`Request failed with status ${response.status}`)
  }
  return response.json()
}
