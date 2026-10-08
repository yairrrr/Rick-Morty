import { useEffect, useRef, useState } from 'react'
import { fetchCharacters, firstPageUrl } from '../api'
import CharacterDetails from '../components/CharacterDetails'
import CharacterList from '../components/CharacterList'
import CharacterVideo from '../components/CharacterVideo'
import { useFavorites } from '../favorites'
import type { Character } from '../types'

function errorMessage(err: unknown) {
  return err instanceof Error ? err.message : 'Something went wrong'
}

// Below this width the details sit under the list (same as in index.css)
const ONE_COLUMN_QUERY = '(max-width: 899px)'
// Where the details panel sticks on laptops (same as in index.css)
const STICKY_TOP_PX = 24

// Wait this long after the last keystroke before searching
const SEARCH_DELAY_MS = 300

function CharactersPage() {
  const [query, setQuery] = useState('')
  const [characters, setCharacters] = useState<Character[]>([])
  const [nextUrl, setNextUrl] = useState<string | null>(null)
  const [totalCount, setTotalCount] = useState(0)
  const [isLoading, setIsLoading] = useState(true)
  const [isLoadingMore, setIsLoadingMore] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [loadMoreError, setLoadMoreError] = useState<string | null>(null)
  // Kept as the whole character so the details stay when a search hides it
  const [selectedCharacter, setSelectedCharacter] = useState<Character | null>(
    null,
  )
  const [showFavorites, setShowFavorites] = useState(false)
  const { favorites, isFavorite, toggleFavorite } = useFavorites()
  const searchName = query.trim()
  // The search box also filters the favorites, without asking the API
  const shownFavorites = favorites.filter((c) =>
    c.name.toLowerCase().includes(searchName.toLowerCase()),
  )
  // Lets a new search cancel a "Load more" that is still loading
  const loadMoreController = useRef<AbortController | null>(null)
  const detailsRef = useRef<HTMLElement>(null)

  useEffect(() => {
    // Cancels the request if the search changes before it finishes
    const controller = new AbortController()

    const timer = setTimeout(
      () => {
        setIsLoading(true)
        setError(null)
        setLoadMoreError(null)

        fetchCharacters(firstPageUrl(searchName), controller.signal)
          .then((page) => {
            setCharacters(page.results)
            setNextUrl(page.info.next)
            setTotalCount(page.info.count)
          })
          .catch((err: unknown) => {
            if (controller.signal.aborted) return
            setError(errorMessage(err))
          })
          .finally(() => {
            if (!controller.signal.aborted) setIsLoading(false)
          })
      },
      searchName ? SEARCH_DELAY_MS : 0,
    )

    return () => {
      clearTimeout(timer)
      controller.abort()
      loadMoreController.current?.abort()
    }
  }, [searchName])

  function handleSelect(id: number) {
    const shown = showFavorites ? shownFavorites : characters
    setSelectedCharacter(shown.find((c) => c.id === id) ?? null)
    // Bring the details and the video into view: on phones they sit below
    // the list, on laptops the panel is still below the logo until it sticks
    const panel = detailsRef.current
    if (
      panel &&
      (window.matchMedia(ONE_COLUMN_QUERY).matches ||
        panel.getBoundingClientRect().top > STICKY_TOP_PX)
    ) {
      panel.scrollIntoView({ behavior: 'smooth' })
    }
  }

  async function handleLoadMore() {
    // nextUrl already holds the search, e.g. ?page=2&name=rick
    if (!nextUrl) return
    const controller = new AbortController()
    loadMoreController.current = controller
    setIsLoadingMore(true)
    setLoadMoreError(null)
    try {
      const page = await fetchCharacters(nextUrl, controller.signal)
      setCharacters((current) => [...current, ...page.results])
      setNextUrl(page.info.next)
    } catch (err) {
      if (controller.signal.aborted) return
      setLoadMoreError(errorMessage(err))
    } finally {
      setIsLoadingMore(false)
    }
  }

  let listContent
  if (showFavorites) {
    listContent =
      shownFavorites.length === 0 ? (
        <p className="status">
          {favorites.length === 0
            ? 'No favorites yet. Tap the heart on a character to add it'
            : 'No favorites found'}
        </p>
      ) : (
        <CharacterList
          characters={shownFavorites}
          selectedId={selectedCharacter?.id ?? null}
          onSelect={handleSelect}
          isFavorite={isFavorite}
          onToggleFavorite={toggleFavorite}
        />
      )
  } else if (isLoading) {
    listContent = <p className="status">Loading...</p>
  } else if (error) {
    listContent = (
      <p className="status status-error" role="alert">
        Could not load characters. {error}
      </p>
    )
  } else if (characters.length === 0) {
    listContent = <p className="status">No characters found</p>
  } else {
    listContent = (
      <>
        <p className="result-count">{totalCount} characters found</p>
        <CharacterList
          characters={characters}
          selectedId={selectedCharacter?.id ?? null}
          onSelect={handleSelect}
          isFavorite={isFavorite}
          onToggleFavorite={toggleFavorite}
        />
        {loadMoreError && (
          <p className="status status-error" role="alert">
            Could not load more characters. {loadMoreError}
          </p>
        )}
        {nextUrl && (
          <button
            type="button"
            className="load-more"
            onClick={handleLoadMore}
            disabled={isLoadingMore}
          >
            {isLoadingMore ? 'Loading...' : 'Load more'}
          </button>
        )}
      </>
    )
  }

  return (
    <div className="layout">
      <section className="list-panel">
        <input
          type="search"
          className="search"
          placeholder="Search by name"
          aria-label="Search characters by name"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <div className="list-tabs" role="group" aria-label="Which characters">
          <button
            type="button"
            aria-pressed={!showFavorites}
            onClick={() => setShowFavorites(false)}
          >
            All
          </button>
          <button
            type="button"
            aria-pressed={showFavorites}
            onClick={() => setShowFavorites(true)}
          >
            Favorites ({favorites.length})
          </button>
        </div>
        {listContent}
      </section>
      <section className="details-panel" ref={detailsRef}>
        <CharacterDetails
          character={selectedCharacter}
          isFavorite={selectedCharacter ? isFavorite(selectedCharacter.id) : false}
          onToggleFavorite={toggleFavorite}
        />
        {selectedCharacter && (
          <CharacterVideo
            key={selectedCharacter.id}
            name={selectedCharacter.name}
          />
        )}
      </section>
    </div>
  )
}

export default CharactersPage
