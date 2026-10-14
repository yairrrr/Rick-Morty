import { describe, expect, it, vi } from 'vitest'
import { fetchCharacters, firstPageUrl } from './api'
import { planetKind } from './components/Planet'
import { dimensionName, UNKNOWN_DIMENSION, type Location } from './locations'
import { packInSphere, sizeVariety, sphereWidth } from './sphereLayout'
import { episodeCode, summaryText, type Episode } from './tvmaze'

// Unit tests: each one checks one function on its own, without the app

function makeLocation(dimension: string): Location {
  return { id: 1, name: 'Earth', type: 'Planet', dimension, residents: [] }
}

function makeEpisode(season: number, number: number): Episode {
  return {
    id: 1,
    name: 'Pilot',
    season,
    number,
    airdate: '2013-12-02',
    runtime: 22,
    image: null,
    summary: null,
  }
}

describe('firstPageUrl (the search address)', () => {
  it('With no name, asks for all the characters', () => {
    expect(firstPageUrl('')).toBe('https://rickandmortyapi.com/api/character')
  })

  it('Puts the name in the address safely, even with spaces and &', () => {
    expect(firstPageUrl('Rick & Morty')).toBe(
      'https://rickandmortyapi.com/api/character?name=Rick%20%26%20Morty',
    )
  })
})

describe('fetchCharacters (reading the API answer)', () => {
  it('A search with no matches (404) gives an empty list, not an error', async () => {
    vi.stubGlobal('fetch', vi.fn(async () => new Response(null, { status: 404 })))
    const page = await fetchCharacters(firstPageUrl('nobody'))
    expect(page).toEqual({ info: { count: 0, next: null }, results: [] })
  })

  it('A server error (500) is reported as an error', async () => {
    vi.stubGlobal('fetch', vi.fn(async () => new Response(null, { status: 500 })))
    await expect(fetchCharacters(firstPageUrl(''))).rejects.toThrow('500')
  })
})

describe('dimensionName (cleaning the dimension from the API)', () => {
  it('Keeps a real dimension name', () => {
    expect(dimensionName(makeLocation('Dimension C-137'))).toBe('Dimension C-137')
  })

  it('"unknown", "Unknown" and an empty dimension all become one group', () => {
    for (const dimension of ['unknown', 'Unknown', '', '  ']) {
      expect(dimensionName(makeLocation(dimension))).toBe(UNKNOWN_DIMENSION)
    }
  })
})

describe('episodeCode', () => {
  it('Season 1 episode 1 is "S01E01"', () => {
    expect(episodeCode(makeEpisode(1, 1))).toBe('S01E01')
  })

  it('Two-digit numbers are not padded again', () => {
    expect(episodeCode(makeEpisode(10, 12))).toBe('S10E12')
  })
})

describe('summaryText (the TVMaze summary as plain text)', () => {
  it('Removes the HTML tags', () => {
    expect(summaryText('<p>Rick takes <b>Morty</b> on an adventure.</p>')).toBe(
      'Rick takes Morty on an adventure.',
    )
  })

  it('A missing summary gives an empty text', () => {
    expect(summaryText(null)).toBe('')
  })

  it('Never runs a script hidden in the summary', () => {
    const text = summaryText('<p>Hi</p><img src="x" onerror="window.hacked = true">')
    expect(text).toBe('Hi')
    expect((window as { hacked?: boolean }).hacked).toBeUndefined()
  })
})

describe('sizeVariety and sphereWidth (bubble sizes)', () => {
  it('The same name always gets the same size, between 0.85 and 1.18', () => {
    for (const name of ['Earth', 'Citadel of Ricks', 'Purge Planet']) {
      const size = sizeVariety(name)
      expect(size).toBe(sizeVariety(name))
      expect(size).toBeGreaterThanOrEqual(0.85)
      expect(size).toBeLessThanOrEqual(1.18)
    }
  })

  it('More items get a bigger sphere, but never more than 860px', () => {
    expect(sphereWidth(1)).toBeLessThan(sphereWidth(20))
    expect(sphereWidth(1000)).toBe(860)
  })
})

describe('packInSphere (placing the bubbles)', () => {
  it('The bubbles stay inside the sphere and do not cover each other', () => {
    const spots = packInSphere([3, 2, 2, 1, 1, 1, 0.5], 30)
    for (const s of spots) {
      // Inside the round sphere: centre (50, 50), radius 50
      expect(Math.hypot(s.x - 50, s.y - 50) + s.size / 2).toBeLessThanOrEqual(50)
    }
    for (let i = 0; i < spots.length; i++) {
      for (let j = i + 1; j < spots.length; j++) {
        const a = spots[i]
        const b = spots[j]
        const distance = Math.hypot(a.x - b.x, a.y - b.y)
        expect(distance).toBeGreaterThanOrEqual((a.size + b.size) / 2 - 1e-6)
      }
    }
  })

  it('A single bubble sits in the middle and is not bigger than allowed', () => {
    const [spot] = packInSphere([1], 20)
    expect(spot.x).toBeCloseTo(50)
    expect(spot.y).toBeCloseTo(50)
    expect(spot.size).toBeLessThanOrEqual(20)
  })
})

describe('planetKind (which kind of picture a place gets)', () => {
  const place = (name: string, type: string) => ({
    id: 1,
    name,
    type,
    dimension: 'unknown',
    residents: [],
  })

  it('A place named Earth gets an Earth picture, whatever its type', () => {
    expect(planetKind(place('Earth (C-137)', 'Planet'))).toBe('earth')
    expect(planetKind(place('Earth (Replacement Dimension)', 'Planet'))).toBe('earth')
  })

  it('Stations and ships get a station picture', () => {
    expect(planetKind(place('Citadel of Ricks', 'Space station'))).toBe('station')
    expect(planetKind(place('Death Star', 'Death Star'))).toBe('station')
  })

  it('Planets and asteroids get a rock picture', () => {
    expect(planetKind(place('Gazorpazorp', 'Planet'))).toBe('rock')
    expect(planetKind(place('Purge Planet', 'Asteroid'))).toBe('rock')
  })

  it('Microverses and other strange places get an anomaly picture', () => {
    expect(planetKind(place('Anatomy Park', 'Microverse'))).toBe('anomaly')
  })

  it('A type the app does not know yet falls back to anomaly', () => {
    expect(planetKind(place('Some new place', 'Moon'))).toBe('anomaly')
  })
})
