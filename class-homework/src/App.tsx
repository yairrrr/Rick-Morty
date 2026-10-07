import CharacterList from './components/CharacterList'
import sampleCharacters from './data/characters.json'
import type { Character } from './types'

const characters: Character[] = sampleCharacters

function App() {
  return (
    <div className="app">
      <header>
        <h1>Rick and Morty Characters</h1>
      </header>
      <main className="layout">
        <section className="list-panel">
          <CharacterList characters={characters} />
        </section>
      </main>
    </div>
  )
}

export default App
