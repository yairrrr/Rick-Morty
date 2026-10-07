import type { Character } from '../types'

type Props = {
  characters: Character[]
}

function CharacterList({ characters }: Props) {
  return (
    <ul className="character-list">
      {characters.map((character) => (
        <li key={character.id} className="character-card">
          <img src={character.image} alt="" width="56" height="56" />
          <span>{character.name}</span>
        </li>
      ))}
    </ul>
  )
}

export default CharacterList
