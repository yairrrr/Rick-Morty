import type { Character } from '../types'
import FavoriteButton from './FavoriteButton'

type Props = {
  characters: Character[]
  selectedId: number | null
  onSelect: (id: number) => void
  isFavorite: (id: number) => boolean
  onToggleFavorite: (character: Character) => void
}

function CharacterList({
  characters,
  selectedId,
  onSelect,
  isFavorite,
  onToggleFavorite,
}: Props) {
  return (
    <ul className="character-list">
      {characters.map((character) => (
        <li key={character.id} className="character-item">
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
          {/* Next to the card, not inside it: a button can't hold a button */}
          <FavoriteButton
            className="favorite-on-card"
            name={character.name}
            isFavorite={isFavorite(character.id)}
            onToggle={() => onToggleFavorite(character)}
          />
        </li>
      ))}
    </ul>
  )
}

export default CharacterList
