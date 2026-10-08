// Episodes with a picture and a summary come from the free TVMaze API
// (the Rick and Morty API has no pictures or summaries for episodes).
// 216 is Rick and Morty's id on TVMaze: https://www.tvmaze.com/shows/216
const EPISODES_URL = 'https://api.tvmaze.com/shows/216/episodes'

// The fields we use from the TVMaze answer
export type Episode = {
  id: number
  name: string
  season: number
  number: number
  airdate: string
  runtime: number | null
  image: { medium: string; original: string } | null
  summary: string | null // HTML, e.g. "<p>Rick takes Morty...</p>"
}

// "S01E01", like the show's own episode codes
export function episodeCode({ season, number }: Episode) {
  const pad = (n: number) => String(n).padStart(2, '0')
  return `S${pad(season)}E${pad(number)}`
}

// The summary as plain text. DOMParser only reads the HTML, it never runs it,
// so this is safe (unlike dangerouslySetInnerHTML)
export function summaryText(html: string | null) {
  if (!html) return ''
  return new DOMParser().parseFromString(html, 'text/html').body.textContent ?? ''
}

// The list never changes during a visit, so it is loaded once and shared
// by every visit to the Episodes page
let episodesRequest: Promise<Episode[]> | null = null

export function fetchEpisodes(): Promise<Episode[]> {
  episodesRequest ??= fetch(EPISODES_URL).then((response) => {
    if (!response.ok) {
      throw new Error(`Request failed with status ${response.status}`)
    }
    return response.json()
  })
  // Let the next visit try again if this one failed
  episodesRequest.catch(() => {
    episodesRequest = null
  })
  return episodesRequest
}
