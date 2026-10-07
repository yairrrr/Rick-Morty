import type { Character } from './types'

export const FIRST_PAGE_URL = 'https://rickandmortyapi.com/api/character'

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
  if (!response.ok) {
    throw new Error(`Request failed with status ${response.status}`)
  }
  return response.json()
}
