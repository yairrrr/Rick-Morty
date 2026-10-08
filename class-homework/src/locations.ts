import { fetchWithRetry } from './api'
import type { Character } from './types'

const LOCATIONS_URL = 'https://rickandmortyapi.com/api/location'
const CHARACTER_URL = 'https://rickandmortyapi.com/api/character'

// The fields we use from https://rickandmortyapi.com/api/location
export type Location = {
  id: number
  name: string
  type: string
  dimension: string
  // Links to characters, e.g. https://rickandmortyapi.com/api/character/1
  residents: string[]
}

type LocationPage = {
  info: { pages: number }
  results: Location[]
}

// The API writes an unknown dimension in three ways
export const UNKNOWN_DIMENSION = 'Unknown dimension'

export function dimensionName(location: Location) {
  const name = location.dimension.trim()
  return !name || name.toLowerCase() === 'unknown' ? UNKNOWN_DIMENSION : name
}

async function fetchPage(url: string): Promise<LocationPage> {
  const response = await fetchWithRetry(url)
  if (!response.ok) {
    throw new Error(`Request failed with status ${response.status}`)
  }
  return response.json()
}

// All the locations (126, on 7 pages). The first page says how many pages
// there are, then the other pages load together instead of one by one
async function fetchAllLocations(): Promise<Location[]> {
  const first = await fetchPage(LOCATIONS_URL)
  const rest = await Promise.all(
    Array.from({ length: first.info.pages - 1 }, (_, i) =>
      fetchPage(`${LOCATIONS_URL}?page=${i + 2}`),
    ),
  )
  return [first, ...rest].flatMap((page) => page.results)
}

// The locations never change during a visit, so they are loaded once and
// shared by every visit to the Multiverse page
let locationsRequest: Promise<Location[]> | null = null

export function fetchLocations(): Promise<Location[]> {
  locationsRequest ??= fetchAllLocations()
  // Let the next visit try again if this one failed
  locationsRequest.catch(() => {
    locationsRequest = null
  })
  return locationsRequest
}

// The characters who live in a location, all in one request:
// /character/1,2,3 answers with the three characters
const residentsRequests = new Map<number, Promise<Character[]>>()

export function fetchResidents(location: Location): Promise<Character[]> {
  const ids = location.residents.map((url) => url.split('/').pop())
  if (ids.length === 0) return Promise.resolve([])

  let request = residentsRequests.get(location.id)
  if (!request) {
    request = fetchWithRetry(`${CHARACTER_URL}/${ids.join(',')}`).then(
      async (response) => {
        if (!response.ok) {
          throw new Error(`Request failed with status ${response.status}`)
        }
        const data: Character | Character[] = await response.json()
        // With only one id the API answers with the character, not a list
        return Array.isArray(data) ? data : [data]
      },
    )
    residentsRequests.set(location.id, request)
    request.catch(() => residentsRequests.delete(location.id))
  }
  return request
}

// For the tests, so each one starts without saved answers
export function clearLocationsCache() {
  locationsRequest = null
  residentsRequests.clear()
}
