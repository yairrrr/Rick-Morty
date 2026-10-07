import { useState } from 'react'
import CharacterDetails from './components/CharacterDetails'
import CharacterList from './components/CharacterList'
import sampleCharacters from './data/characters.json'
import type { Character } from './types'

const characters: Character[] = sampleCharacters

function App() {
  const [selectedId, setSelectedId] = useState<number | null>(null)
  const selectedCharacter = characters.find((c) => c.id === selectedId)

  return (
    <div className="app">
      <header>
        <h1>Rick and Morty Characters</h1>
      </header>
      <main className="layout">
        <section className="list-panel">
          <CharacterList
            characters={characters}
            selectedId={selectedId}
            onSelect={setSelectedId}
          />
        </section>
        <section className="details-panel">
          <CharacterDetails character={selectedCharacter} />
        </section>
      </main>
    </div>
  )
}

export default App
