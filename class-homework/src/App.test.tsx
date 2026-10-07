import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import App from './App'
import type { Character } from './types'

const API = 'https://rickandmortyapi.com/api/character'

function makeCharacter(id: number, name: string, episodes = 1): Character {
  return {
    id,
    name,
    image: `${API}/avatar/${id}.jpeg`,
    species: 'Human',
    episode: Array.from({ length: episodes }, (_, i) => `ep${i + 1}`),
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
    render(<App />)
    expect(await screen.findByText('Rick Sanchez')).toBeInTheDocument()
    expect(cardNames()).toHaveLength(20)
    expect(
      screen.getByText('Pick a character to see details'),
    ).toBeInTheDocument()
  })

  it('When I click a character, I see its picture, name, species and episode count', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(await screen.findByText('Morty Smith'))

    const details = screen.getByRole('article')
    expect(within(details).getByRole('img')).toHaveAttribute(
      'alt',
      'Morty Smith',
    )
    expect(within(details).getByText('Morty Smith')).toBeInTheDocument()
    expect(within(details).getByText('Human')).toBeInTheDocument()
    expect(
      within(details).getByText('Appears in 51 episodes'),
    ).toBeInTheDocument()
  })

  it('When I type "Rick" in the search box, I see only characters named Rick', async () => {
    const user = userEvent.setup()
    render(<App />)
    await screen.findByText('Rick Sanchez')
    await user.type(screen.getByRole('searchbox'), 'Rick')

    expect(await screen.findByText('Rick 1')).toBeInTheDocument()
    expect(cardNames().every((name) => name?.includes('Rick'))).toBe(true)
  })

  it('When I click "Load more", I see 20 more characters added to the list', async () => {
    const user = userEvent.setup()
    render(<App />)
    await screen.findByText('Rick Sanchez')
    await user.click(screen.getByRole('button', { name: 'Load more' }))

    expect(await screen.findByText('Character 40')).toBeInTheDocument()
    expect(cardNames()).toHaveLength(40)
    expect(cardNames()[0]).toBe('Rick Sanchez')
  })

  it('When I search for a name that does not exist, I see "No characters found"', async () => {
    const user = userEvent.setup()
    render(<App />)
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
    render(<App />)
    await screen.findByText('Rick Sanchez')
    await user.type(screen.getByRole('searchbox'), 'rick')

    expect(await screen.findByText('107 characters found')).toBeInTheDocument()
  })
})
