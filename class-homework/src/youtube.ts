// Finds a short YouTube video about a character with the YouTube Data API:
// https://developers.google.com/youtube/v3/docs/search/list
const SEARCH_URL = 'https://www.googleapis.com/youtube/v3/search'

// The key lives in .env.local (never committed), see .env.example
function apiKey(): string | undefined {
  return import.meta.env.VITE_YOUTUBE_API_KEY || undefined
}

export function hasYoutubeKey() {
  return Boolean(apiKey())
}

function searchText(name: string) {
  return `${name} Rick and Morty`
}

// A normal YouTube results page, for when the API can't be used
export function youtubeSearchPageUrl(name: string) {
  return `https://www.youtube.com/results?search_query=${encodeURIComponent(searchText(name))}`
}

export function embedUrl(videoId: string) {
  // Browsers only autoplay muted videos
  return `https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1&mute=1&rel=0`
}

type SearchResponse = {
  items: { id: { videoId: string } }[]
}

// Every search costs 100 of the 10,000 free daily units,
// so each character is searched once per visit
const cache = new Map<string, string | null>()

// The id of a short video about the character, or null if none was found
export async function findCharacterVideo(
  name: string,
  signal?: AbortSignal,
): Promise<string | null> {
  const key = apiKey()
  if (!key) throw new Error('No YouTube API key')
  if (cache.has(name)) return cache.get(name) ?? null

  const params = new URLSearchParams({
    part: 'snippet',
    q: searchText(name),
    type: 'video',
    videoDuration: 'short', // under 4 minutes
    videoEmbeddable: 'true',
    safeSearch: 'moderate',
    maxResults: '1',
    key,
  })
  const response = await fetch(`${SEARCH_URL}?${params}`, { signal })
  if (!response.ok) {
    // 403 usually means the daily quota is used up or the key is wrong
    throw new Error(`YouTube request failed with status ${response.status}`)
  }
  const data: SearchResponse = await response.json()
  const videoId = data.items[0]?.id.videoId ?? null
  cache.set(name, videoId)
  return videoId
}
