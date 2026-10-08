import '@testing-library/jest-dom/vitest'
import { cleanup } from '@testing-library/react'
import { afterEach, vi } from 'vitest'

afterEach(() => {
  cleanup()
  // Favorites are saved here, so each test starts with none
  localStorage.clear()
  vi.unstubAllGlobals()
})

// jsdom has no matchMedia; the tests run as a wide (desktop) screen
window.matchMedia = (query: string) =>
  ({ matches: false, media: query }) as MediaQueryList
