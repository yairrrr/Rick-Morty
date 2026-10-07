import type { Character } from './types'

const BASE_URL = 'https://rickandmortyapi.com/api/character'

// The first page of characters, or of characters whose name includes `name`
export function firstPageUrl(name: string) {
  return name ? `${BASE_URL}?name=${encodeURIComponent(name)}` : BASE_URL
}

// The API returns one page of 20 characters plus a link to the next page
type CharacterPage = {
  info: { count: number; next: string | null }
  results: Character[]
}

// The API allows only about 30 requests (pictures included) every few seconds,
// then blocks for about 10 seconds.
// Going over looks like a network error in the browser, so wait and retry once.
const RETRY_DELAY_MS = 12_000

function wait(ms: number, signal?: AbortSignal) {
  return new Promise<void>((resolve, reject) => {
    const timer = setTimeout(resolve, ms)
    signal?.addEventListener(
      'abort',
      () => {
        clearTimeout(timer)
        reject(signal.reason)
      },
      { once: true },
    )
  })
}

export async function fetchCharacters(
  url: string,
  signal?: AbortSignal,
): Promise<CharacterPage> {
  let response: Response
  try {
    response = await fetch(url, { signal })
  } catch (err) {
    if (signal?.aborted) throw err
    await wait(RETRY_DELAY_MS, signal)
    response = await fetch(url, { signal })
  }
  // A search with no matches answers 404 instead of an empty list
  if (response.status === 404) {
    return { info: { count: 0, next: null }, results: [] }
  }
  if (!response.ok) {
    throw new Error(`Request failed with status ${response.status}`)
  }
  return response.json()
}
