import type { Character } from '../types'
import FavoriteButton from './FavoriteButton'

type Props = {
  character: Character | null
  isFavorite: boolean
  onToggleFavorite: (character: Character) => void
}

// The API writes "unknown" in small letters
function show(value: string) {
  return !value || value === 'unknown' ? 'Unknown' : value
}

// https://rickandmortyapi.com/api/episode/28 -> 28
function episodeNumber(url: string) {
  return url.split('/').pop()
}

function CharacterDetails({ character, isFavorite, onToggleFavorite }: Props) {
  if (!character) {
    return (
      <div className="details-empty">
        <span className="portal" aria-hidden="true" />
        <p>Pick a character to see details</p>
      </div>
    )
  }

  const episodeCount = character.episode.length
  const firstEpisode = character.episode[0]

  const stats = [
    { label: 'Species', value: show(character.species) },
    { label: 'Type', value: character.type || 'None' },
    { label: 'Gender', value: show(character.gender) },
    {
      label: 'Episodes',
      value: `${episodeCount} ${episodeCount === 1 ? 'episode' : 'episodes'}`,
    },
    { label: 'Origin', value: show(character.origin.name), wide: true },
    { label: 'Last seen at', value: show(character.location.name), wide: true },
  ]
  if (firstEpisode) {
    stats.push({
      label: 'First seen in',
      value: `Episode ${episodeNumber(firstEpisode)}`,
      wide: true,
    })
  }

  return (
    <article className="character-details">
      <div className="details-image">
        <img src={character.image} alt={character.name} width="300" height="300" />
        <FavoriteButton
          className="favorite-on-details"
          name={character.name}
          isFavorite={isFavorite}
          onToggle={() => onToggleFavorite(character)}
        />
      </div>
      <h2>{character.name}</h2>
      <p className={`status-badge status-${character.status.toLowerCase()}`}>
        <span className="status-dot" aria-hidden="true" />
        {show(character.status)}
      </p>
      <dl className="stats">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className={stat.wide ? 'stat stat-wide' : 'stat'}
          >
            <dt>{stat.label}</dt>
            <dd>{stat.value}</dd>
          </div>
        ))}
      </dl>
    </article>
  )
}

export default CharacterDetails
