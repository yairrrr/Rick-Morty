import { useEffect, useState } from 'react'
import { fetchCharacters } from './api'
import CharacterDetails from './components/CharacterDetails'
import CharacterList from './components/CharacterList'
import type { Character } from './types'

function App() {
  const [characters, setCharacters] = useState<Character[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedId, setSelectedId] = useState<number | null>(null)
  const selectedCharacter = characters.find((c) => c.id === selectedId)

  useEffect(() => {
    // Cancels the request if the component unmounts before it finishes
    const controller = new AbortController()

    fetchCharacters(controller.signal)
      .then((page) => setCharacters(page.results))
      .catch((err: unknown) => {
        if (controller.signal.aborted) return
        setError(err instanceof Error ? err.message : 'Something went wrong')
      })
      .finally(() => {
        if (!controller.signal.aborted) setIsLoading(false)
      })

    return () => controller.abort()
  }, [])

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
      <CharacterList
        characters={characters}
        selectedId={selectedId}
        onSelect={setSelectedId}
      />
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
