import type { Character } from '../types'

type Props = {
  characters: Character[]
  selectedId: number | null
  onSelect: (id: number) => void
}

function CharacterList({ characters, selectedId, onSelect }: Props) {
  return (
    <ul className="character-list">
      {characters.map((character) => (
        <li key={character.id}>
          <button
            type="button"
            className="character-card"
            aria-pressed={character.id === selectedId}
            onClick={() => onSelect(character.id)}
          >
            <img
              src={character.image}
              alt=""
              width="300"
              height="300"
              loading="lazy"
            />
            <span className="character-name">{character.name}</span>
          </button>
        </li>
      ))}
    </ul>
  )
}

export default CharacterList
