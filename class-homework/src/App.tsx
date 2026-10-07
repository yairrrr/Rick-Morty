import { useEffect, useState } from 'react'
import { FIRST_PAGE_URL, fetchCharacters } from './api'
import CharacterDetails from './components/CharacterDetails'
import CharacterList from './components/CharacterList'
import type { Character } from './types'

function errorMessage(err: unknown) {
  return err instanceof Error ? err.message : 'Something went wrong'
}

function App() {
  const [characters, setCharacters] = useState<Character[]>([])
  const [nextUrl, setNextUrl] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isLoadingMore, setIsLoadingMore] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [loadMoreError, setLoadMoreError] = useState<string | null>(null)
  const [selectedId, setSelectedId] = useState<number | null>(null)
  const selectedCharacter = characters.find((c) => c.id === selectedId)

  useEffect(() => {
    // Cancels the request if the component unmounts before it finishes
    const controller = new AbortController()

    fetchCharacters(FIRST_PAGE_URL, controller.signal)
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

    return () => controller.abort()
  }, [])

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
  } else {
    listContent = (
      <>
        <CharacterList
          characters={characters}
          selectedId={selectedId}
          onSelect={setSelectedId}
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
        <section className="list-panel">{listContent}</section>
        <section className="details-panel">
          <CharacterDetails character={selectedCharacter} />
        </section>
      </main>
    </div>
  )
}

export default App
