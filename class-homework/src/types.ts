// The fields we use from https://rickandmortyapi.com/api/character
export type Character = {
  id: number
  name: string
  image: string
  status: 'Alive' | 'Dead' | 'unknown'
  species: string
  // A sub-species, e.g. "Parasite". Often an empty string
  type: string
  gender: 'Female' | 'Male' | 'Genderless' | 'unknown'
  origin: { name: string }
  location: { name: string }
  // Links to episodes, e.g. https://rickandmortyapi.com/api/episode/1
  episode: string[]
}
