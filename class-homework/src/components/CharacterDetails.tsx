import type { Character } from '../types'

type Props = {
  character: Character | null
}

function CharacterDetails({ character }: Props) {
  if (!character) {
    return (
      <div className="details-empty">
        <span className="portal" aria-hidden="true" />
        <p>Pick a character to see details</p>
      </div>
    )
  }

  const episodeCount = character.episode.length

  return (
    <article className="character-details">
      <div className="details-image">
        <img src={character.image} alt={character.name} width="300" height="300" />
      </div>
      <h2>{character.name}</h2>
      <dl>
        <dt>Species</dt>
        <dd>{character.species}</dd>
        <dt>Episodes</dt>
        <dd>
          Appears in {episodeCount} {episodeCount === 1 ? 'episode' : 'episodes'}
        </dd>
      </dl>
    </article>
  )
}

export default CharacterDetails
