import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import App from './App'
import { clearLocationsCache, type Location } from './locations'
import type { Character } from './types'

const API = 'https://rickandmortyapi.com/api/character'

function makeCharacter(id: number, name: string, episodes = 1): Character {
  return {
    id,
    name,
    image: `${API}/avatar/${id}.jpeg`,
    status: 'Alive',
    species: 'Human',
    type: '',
    gender: 'Male',
    origin: { name: 'Earth (C-137)' },
    location: { name: 'Citadel of Ricks' },
    episode: Array.from(
      { length: episodes },
      (_, i) => `https://rickandmortyapi.com/api/episode/${i + 1}`,
    ),
  }
}

function makePage(names: string[], firstId: number) {
  return names.map((name, i) => makeCharacter(firstId + i, name))
}

const allPage1 = [
  makeCharacter(1, 'Rick Sanchez', 51),
  makeCharacter(2, 'Morty Smith', 51),
  ...makePage(
    Array.from({ length: 18 }, (_, i) => `Character ${i + 3}`),
    3,
  ),
]
const allPage2 = makePage(
  Array.from({ length: 20 }, (_, i) => `Character ${i + 21}`),
  21,
)
const rickPage1 = makePage(
  Array.from({ length: 20 }, (_, i) => `Rick ${i + 1}`),
  100,
)

// A fake Rick and Morty API, so the tests do not depend on the network
function fakeApi(url: string) {
  const { searchParams } = new URL(url)
  const name = searchParams.get('name')
  const page = searchParams.get('page') ?? '1'

  const json = (count: number, next: string | null, results: Character[]) =>
    new Response(JSON.stringify({ info: { count, next }, results }))

  if (name === null && page === '1') return json(826, `${API}?page=2`, allPage1)
  if (name === null && page === '2') return json(826, `${API}?page=3`, allPage2)
  if (name?.toLowerCase() === 'rick' && page === '1') {
    return json(107, `${API}?page=2&name=rick`, rickPage1)
  }
  return new Response(JSON.stringify({ error: 'There is nothing here' }), {
    status: 404,
  })
}

// The app at an address, e.g. renderApp('/episodes?season=2')
function renderApp(path = '/') {
  return render(
    <MemoryRouter initialEntries={[path]}>
      <App />
    </MemoryRouter>,
  )
}

function cardNames() {
  const list = screen.getByRole('list')
  return within(list)
    .getAllByRole('listitem')
    .map((item) => item.textContent)
}

describe('PRD acceptance criteria', () => {
  beforeEach(() => {
    vi.stubGlobal(
      'fetch',
      vi.fn(async (url: string) => fakeApi(url)),
    )
  })

  it('When I open the app, I see 20 characters and the "Pick a character" message', async () => {
    renderApp()
    expect(await screen.findByText('Rick Sanchez')).toBeInTheDocument()
    expect(cardNames()).toHaveLength(20)
    expect(
      screen.getByText('Pick a character to see details'),
    ).toBeInTheDocument()
  })

  it('When I click a character, I see its picture, name, species and episode count', async () => {
    const user = userEvent.setup()
    renderApp()
    await user.click(await screen.findByText('Morty Smith'))

    const details = screen.getByRole('article')
    expect(within(details).getByRole('img')).toHaveAttribute(
      'alt',
      'Morty Smith',
    )
    expect(within(details).getByText('Morty Smith')).toBeInTheDocument()
    expect(within(details).getByText('Human')).toBeInTheDocument()
    expect(within(details).getByText('51 episodes')).toBeInTheDocument()
  })

  it('When I type "Rick" in the search box, I see only characters named Rick', async () => {
    const user = userEvent.setup()
    renderApp()
    await screen.findByText('Rick Sanchez')
    await user.type(screen.getByRole('searchbox'), 'Rick')

    expect(await screen.findByText('Rick 1')).toBeInTheDocument()
    expect(cardNames().every((name) => name?.includes('Rick'))).toBe(true)
  })

  it('When I click "Load more", I see 20 more characters added to the list', async () => {
    const user = userEvent.setup()
    renderApp()
    await screen.findByText('Rick Sanchez')
    await user.click(screen.getByRole('button', { name: 'Load more' }))

    expect(await screen.findByText('Character 40')).toBeInTheDocument()
    expect(cardNames()).toHaveLength(40)
    expect(cardNames()[0]).toBe('Rick Sanchez')
  })

  it('When I search for a name that does not exist, I see "No characters found"', async () => {
    const user = userEvent.setup()
    renderApp()
    await screen.findByText('Rick Sanchez')
    await user.type(screen.getByRole('searchbox'), 'zzzz')

    expect(await screen.findByText('No characters found')).toBeInTheDocument()
    expect(screen.queryByRole('alert')).not.toBeInTheDocument()
  })
})

describe('New feature: number of results', () => {
  beforeEach(() => {
    vi.stubGlobal(
      'fetch',
      vi.fn(async (url: string) => fakeApi(url)),
    )
  })

  it('When I type "rick" in the search box, I see "107 characters found"', async () => {
    const user = userEvent.setup()
    renderApp()
    await screen.findByText('Rick Sanchez')
    await user.type(screen.getByRole('searchbox'), 'rick')

    expect(await screen.findByText('107 characters found')).toBeInTheDocument()
  })
})

describe('New feature: Episodes and About pages', () => {
  const episode = (id: number, season: number, number: number, name: string) => ({
    id,
    name,
    season,
    number,
    airdate: '2013-12-02',
    runtime: 22,
    image: { medium: `ep${id}-small.jpg`, original: `ep${id}.jpg` },
    summary: `<p>Summary of <b>${name}</b>.</p>`,
  })

  beforeEach(() => {
    vi.stubGlobal(
      'fetch',
      vi.fn(async (url: string) => {
        if (url === 'https://api.tvmaze.com/shows/216/episodes') {
          return new Response(
            JSON.stringify([
              episode(1, 1, 1, 'Pilot'),
              episode(2, 1, 2, 'Lawnmower Dog'),
              episode(12, 2, 1, 'A Rickle in Time'),
            ]),
          )
        }
        return fakeApi(url)
      }),
    )
  })

  it('When I click "Episodes" in the menu, I see the season 1 episodes with a picture and a summary', async () => {
    const user = userEvent.setup()
    renderApp()
    await user.click(screen.getByRole('link', { name: 'Episodes' }))

    expect(await screen.findByText('Pilot')).toBeInTheDocument()
    expect(screen.getByText('Lawnmower Dog')).toBeInTheDocument()
    expect(screen.queryByText('A Rickle in Time')).not.toBeInTheDocument()
    expect(screen.getByText('S01E01')).toBeInTheDocument()
    // The summary is shown as text, without the HTML tags
    expect(screen.getByText('Summary of Pilot.')).toBeInTheDocument()
    const pilot = screen.getByText('Pilot').closest('article')!
    expect(pilot.querySelector('img')).toHaveAttribute('src', 'ep1.jpg')
  })

  it('When I click "Season 2", I see only the season 2 episodes', async () => {
    const user = userEvent.setup()
    renderApp('/episodes')
    await user.click(await screen.findByRole('link', { name: 'Season 2' }))

    expect(await screen.findByText('A Rickle in Time')).toBeInTheDocument()
    expect(screen.queryByText('Pilot')).not.toBeInTheDocument()
  })

  it('When I click "About" in the menu, I see the About page', async () => {
    const user = userEvent.setup()
    renderApp()
    await user.click(screen.getByRole('link', { name: 'About' }))

    expect(
      screen.getByRole('heading', { name: 'About' }),
    ).toBeInTheDocument()
    expect(screen.getByText('Where the data comes from')).toBeInTheDocument()
  })

  it('When I open an address that does not exist, I see "Wrong dimension!"', () => {
    renderApp('/no-such-page')

    expect(screen.getByText('Wrong dimension!')).toBeInTheDocument()
  })
})

describe('New feature: character facts', () => {
  beforeEach(() => {
    vi.stubGlobal(
      'fetch',
      vi.fn(async (url: string) => fakeApi(url)),
    )
  })

  it('When I click a character, I see its status, gender, origin, location and first episode', async () => {
    const user = userEvent.setup()
    renderApp()
    await user.click(await screen.findByText('Rick Sanchez'))

    const details = screen.getByRole('article')
    expect(within(details).getByText('Alive')).toBeInTheDocument()
    expect(within(details).getByText('Male')).toBeInTheDocument()
    expect(within(details).getByText('Earth (C-137)')).toBeInTheDocument()
    expect(within(details).getByText('Citadel of Ricks')).toBeInTheDocument()
    expect(within(details).getByText('Episode 1')).toBeInTheDocument()
  })
})

describe('New feature: favorites', () => {
  beforeEach(() => {
    vi.stubGlobal(
      'fetch',
      vi.fn(async (url: string) => fakeApi(url)),
    )
  })

  it('When I tap the heart on a character, I see it under "Favorites"', async () => {
    const user = userEvent.setup()
    renderApp()
    await user.click(
      await screen.findByRole('button', {
        name: 'Add Morty Smith to favorites',
      }),
    )
    await user.click(screen.getByRole('button', { name: 'Favorites (1)' }))

    expect(cardNames()).toEqual(['Morty Smith'])
  })

  it('My favorites are still there after I reload the app', async () => {
    const user = userEvent.setup()
    const { unmount } = renderApp()
    await user.click(
      await screen.findByRole('button', {
        name: 'Add Rick Sanchez to favorites',
      }),
    )
    unmount()

    renderApp()
    expect(
      await screen.findByRole('button', {
        name: 'Remove Rick Sanchez from favorites',
      }),
    ).toBeInTheDocument()
  })

  it('With no favorites, I see how to add one', async () => {
    const user = userEvent.setup()
    renderApp()
    await user.click(screen.getByRole('button', { name: 'Favorites (0)' }))

    expect(screen.getByText(/No favorites yet/)).toBeInTheDocument()
  })
})

describe('New feature: Multiverse page', () => {
  const LOCATIONS = 'https://rickandmortyapi.com/api/location'
  const location = (
    id: number,
    name: string,
    type: string,
    dimension: string,
    residentIds: number[] = [],
  ): Location => ({
    id,
    name,
    type,
    dimension,
    residents: residentIds.map((r) => `${API}/${r}`),
  })

  // Two pages, like the real API (which has seven)
  const page1 = [
    location(1, 'Earth (C-137)', 'Planet', 'Dimension C-137', [1, 2]),
    location(3, 'Citadel of Ricks', 'Space station', 'unknown', [1]),
  ]
  const page2 = [
    location(5, 'Anatomy Park', 'Microverse', 'Dimension C-137'),
    location(20, 'Earth (Replacement Dimension)', 'Planet', 'Replacement Dimension'),
  ]

  let fetchMock: ReturnType<typeof vi.fn>

  beforeEach(() => {
    clearLocationsCache()
    fetchMock = vi.fn(async (url: string) => {
      if (url === LOCATIONS) {
        return new Response(JSON.stringify({ info: { pages: 2 }, results: page1 }))
      }
      if (url === `${LOCATIONS}?page=2`) {
        return new Response(JSON.stringify({ info: { pages: 2 }, results: page2 }))
      }
      if (url === `${API}/1,2`) {
        return new Response(
          JSON.stringify([allPage1[0], allPage1[1]]),
        )
      }
      return fakeApi(url)
    })
    vi.stubGlobal('fetch', fetchMock)
  })

  const locationRequests = () =>
    fetchMock.mock.calls.filter(([url]) => String(url).startsWith(LOCATIONS))

  it('When I click "Multiverse" in the menu, I see a portal for each dimension', async () => {
    const user = userEvent.setup()
    renderApp()
    await user.click(screen.getByRole('link', { name: 'Multiverse' }))

    const dimensions = await screen.findByRole('list', { name: 'Dimensions' })
    const names = within(dimensions)
      .getAllByRole('button')
      .map((b) => b.textContent)
    expect(names).toEqual([
      'Dimension C-137' + '2 locations',
      'Replacement Dimension' + '1 location',
      'Unknown dimension' + '1 location',
    ])
  })

  it('When I pick a dimension, I see only its planets', async () => {
    const user = userEvent.setup()
    renderApp('/multiverse')
    await user.click(await screen.findByRole('button', { name: /Dimension C-137/ }))

    const map = screen.getByRole('list', { name: 'Locations' })
    expect(within(map).getByRole('button', { name: 'Earth (C-137)' })).toBeInTheDocument()
    expect(within(map).getByRole('button', { name: 'Anatomy Park' })).toBeInTheDocument()
    expect(within(map).queryByRole('button', { name: 'Citadel of Ricks' })).not.toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: '← All dimensions' }))
    expect(screen.getByRole('list', { name: 'Dimensions' })).toBeInTheDocument()
  })

  it('When I search "citadel", I see only the Citadel of Ricks', async () => {
    const user = userEvent.setup()
    renderApp('/multiverse')
    await screen.findByRole('list', { name: 'Dimensions' })
    await user.type(screen.getByRole('searchbox'), 'citadel')

    const map = screen.getByRole('list', { name: 'Locations' })
    expect(within(map).getAllByRole('button').map((b) => b.getAttribute('aria-label'))).toEqual(['Citadel of Ricks'])
  })

  it('When I choose a dimension in the filter, I see its locations', async () => {
    const user = userEvent.setup()
    renderApp('/multiverse')
    await screen.findByRole('list', { name: 'Dimensions' })
    await user.click(screen.getByRole('combobox', { name: 'Dimension' }))
    await user.click(
      screen.getByRole('option', { name: /Replacement Dimension/ }),
    )

    const map = screen.getByRole('list', { name: 'Locations' })
    expect(within(map).getAllByRole('button').map((b) => b.getAttribute('aria-label'))).toEqual([
      'Earth (Replacement Dimension)',
    ])
  })

  it('With the keyboard, I can choose a dimension in the filter', async () => {
    const user = userEvent.setup()
    renderApp('/multiverse')
    await screen.findByRole('list', { name: 'Dimensions' })
    screen.getByRole('combobox', { name: 'Dimension' }).focus()
    await user.keyboard('{ArrowDown}{ArrowDown}{Enter}')

    const map = screen.getByRole('list', { name: 'Locations' })
    expect(
      within(map)
        .getAllByRole('button')
        .map((b) => b.getAttribute('aria-label')),
    ).toEqual(['Earth (C-137)', 'Anatomy Park'])
    expect(screen.queryByRole('listbox')).not.toBeInTheDocument()
  })

  it('When I click a planet, I see its type, dimension and residents, and can open a resident', async () => {
    const user = userEvent.setup()
    renderApp('/multiverse?dimension=Dimension+C-137')
    await user.click(await screen.findByRole('button', { name: 'Earth (C-137)' }))

    const dialog = screen.getByRole('dialog', { name: 'Earth (C-137)' })
    expect(within(dialog).getByText('Planet')).toBeInTheDocument()
    expect(within(dialog).getByText('Dimension C-137')).toBeInTheDocument()
    expect(within(dialog).getByText('2')).toBeInTheDocument()
    expect(await within(dialog).findByText('Rick Sanchez')).toBeInTheDocument()

    await user.click(within(dialog).getByText('Morty Smith'))
    const details = within(dialog).getByRole('article')
    expect(within(details).getByText('Human')).toBeInTheDocument()

    await user.keyboard('{Escape}')
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  })

  it('The locations load only once, even after I leave the page and come back', async () => {
    const user = userEvent.setup()
    renderApp('/multiverse')
    await screen.findByRole('list', { name: 'Dimensions' })
    expect(locationRequests()).toHaveLength(2)

    await user.click(screen.getByRole('link', { name: 'About' }))
    await user.click(screen.getByRole('link', { name: 'Multiverse' }))
    await screen.findByRole('list', { name: 'Dimensions' })
    expect(locationRequests()).toHaveLength(2)
  })
})
