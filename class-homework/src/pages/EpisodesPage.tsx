import { useEffect, useState } from 'react'
import { Link, useSearchParams } from 'react-router'
import { episodeCode, fetchEpisodes, summaryText, type Episode } from '../tvmaze'

function formatDate(isoDate: string) {
  return new Date(isoDate).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    // The airdate has no time, so read it as UTC or it can show the day before
    timeZone: 'UTC',
  })
}

function EpisodesPage() {
  const [episodes, setEpisodes] = useState<Episode[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  // The season lives in the address (/episodes?season=2),
  // so a link or a refresh opens the same season
  const [searchParams] = useSearchParams()

  useEffect(() => {
    let ignore = false
    fetchEpisodes()
      .then((all) => {
        if (!ignore) setEpisodes(all)
      })
      .catch((err: unknown) => {
        if (!ignore) {
          setError(err instanceof Error ? err.message : 'Something went wrong')
        }
      })
      .finally(() => {
        if (!ignore) setIsLoading(false)
      })
    return () => {
      ignore = true
    }
  }, [])

  const seasons = [...new Set(episodes.map((e) => e.season))]
  const requested = Number(searchParams.get('season'))
  const season = seasons.includes(requested) ? requested : (seasons[0] ?? 1)
  const seasonEpisodes = episodes.filter((e) => e.season === season)

  let content
  if (isLoading) {
    content = <p className="status">Loading...</p>
  } else if (error) {
    content = (
      <p className="status status-error" role="alert">
        Could not load episodes. {error}
      </p>
    )
  } else {
    content = (
      <>
        <nav className="season-tabs" aria-label="Seasons">
          {seasons.map((s) => (
            <Link
              key={s}
              to={`?season=${s}`}
              className="season-tab"
              aria-current={s === season ? 'page' : undefined}
            >
              Season {s}
            </Link>
          ))}
        </nav>
        <ul className="episode-list">
          {seasonEpisodes.map((episode) => (
            <li key={episode.id}>
              <article className="episode-card">
                <div className="episode-image">
                  {episode.image ? (
                    <img
                      src={episode.image.original}
                      alt=""
                      width="640"
                      height="360"
                      loading="lazy"
                    />
                  ) : (
                    <span className="portal" aria-hidden="true" />
                  )}
                  <span className="episode-code">{episodeCode(episode)}</span>
                </div>
                <div className="episode-body">
                  <h3>{episode.name}</h3>
                  <p className="episode-meta">
                    {formatDate(episode.airdate)}
                    {episode.runtime && ` · ${episode.runtime} min`}
                  </p>
                  <p className="episode-summary">
                    {summaryText(episode.summary) || 'No description yet.'}
                  </p>
                </div>
              </article>
            </li>
          ))}
        </ul>
      </>
    )
  }

  return (
    <div className="page">
      <h2 className="page-title">Episodes</h2>
      {content}
    </div>
  )
}

export default EpisodesPage
