import type { CSSProperties } from 'react'
import type { Location } from '../locations'

// The API has no pictures of the locations, so each one gets a planet
// drawn in the style of the show (src/assets/planets). The file name says
// which kind of place it fits: rock-01.webp, station-07.webp...
const files = import.meta.glob<string>('../assets/planets/*.webp', {
  eager: true,
  import: 'default',
})

type Kind = 'rock' | 'earth' | 'station' | 'anomaly'

const pictures: Record<Kind, string[]> = {
  rock: [],
  earth: [],
  station: [],
  anomaly: [],
}
for (const path of Object.keys(files).sort()) {
  const kind = path.split('/').pop()!.split('-')[0] as Kind
  pictures[kind].push(files[path])
}

const STATION_TYPES = [
  'Space station',
  'Spacecraft',
  'Base',
  'Death Star',
  'Machine',
]
const ROCK_TYPES = [
  'Planet',
  'Dwarf planet (Celestial Dwarf)',
  'Asteroid',
  'Quasar',
]

function planetKind(location: Location): Kind {
  if (location.name.startsWith('Earth')) return 'earth'
  if (STATION_TYPES.includes(location.type)) return 'station'
  if (ROCK_TYPES.includes(location.type)) return 'rock'
  // Microverses, dreams, TV shows... the strange ones
  return 'anomaly'
}

type Props = {
  location: Location
}

function Planet({ location }: Props) {
  const kind = planetKind(location)
  const list = pictures[kind]
  // The id picks the picture, so a location always looks the same.
  // When the pictures run out, the next round of locations gets other colours
  const round = Math.floor(location.id / list.length)
  const style = {
    '--planet-hue': kind === 'earth' ? '0deg' : `${(round * 75) % 360}deg`,
  } as CSSProperties

  return (
    <img
      className={`planet planet-${kind}`}
      src={list[location.id % list.length]}
      alt=""
      style={style}
      draggable={false}
      aria-hidden="true"
    />
  )
}

export default Planet
