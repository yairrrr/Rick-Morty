import { useEffect, useState } from 'react'
import { fetchCharacters, firstPageUrl } from './api'
import CharacterDetails from './components/CharacterDetails'
import CharacterList from './components/CharacterList'
import type { Character } from './types'

function errorMessage(err: unknown) {
  return err instanceof Error ? err.message : 'Something went wrong'
}

// Wait this long after the last keystroke before searching
const SEARCH_DELAY_MS = 300

function App() {
  const [query, setQuery] = useState('')
  const [characters, setCharacters] = useState<Character[]>([])
  const [nextUrl, setNextUrl] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isLoadingMore, setIsLoadingMore] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [loadMoreError, setLoadMoreError] = useState<string | null>(null)
  // Kept as the whole character so the details stay when a search hides it
  const [selectedCharacter, setSelectedCharacter] = useState<Character | null>(
    null,
  )
  const searchName = query.trim()

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
    }
  }, [searchName])

  function handleSelect(id: number) {
    setSelectedCharacter(characters.find((c) => c.id === id) ?? null)
  }

  async function handleLoadMore() {
    if (!nextUrl) return
    setIsLoadingMore(true)
    setLoadMoreError(null)
    try {
      const page = await fetchCharacters(nextUrl)
      setCharacters((current) => [...current, ...page.results])
      setNextUrl(page.info.next)
    } catch (err) {
      setLoadMoreError(errorMessage(err))
    } finally {
      setIsLoadingMore(false)
    }
  }

  let listContent
  if (isLoading) {
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
        <CharacterList
          characters={characters}
          selectedId={selectedCharacter?.id ?? null}
          onSelect={handleSelect}
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
    <div className="app">
      <header>
        <h1>Rick and Morty Characters</h1>
      </header>
      <main className="layout">
        <section className="list-panel">
          <input
            type="search"
            className="search"
            placeholder="Search by name"
            aria-label="Search characters by name"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          {listContent}
        </section>
        <section className="details-panel">
          <CharacterDetails character={selectedCharacter} />
        </section>
      </main>
    </div>
  )
}

export default App
