import type { Character } from '../types'

type Props = {
  character: Character | undefined
}

function CharacterDetails({ character }: Props) {
  if (!character) {
    return <p className="details-empty">Pick a character to see details</p>
  }

  const episodeCount = character.episode.length

  return (
    <article className="character-details">
      <img src={character.image} alt={character.name} width="300" height="300" />
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
