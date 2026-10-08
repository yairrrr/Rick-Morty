import { useEffect, useRef, useState } from 'react'
import { useFavorites } from '../favorites'
import { dimensionName, fetchResidents, type Location } from '../locations'
import type { Character } from '../types'
import CharacterDetails from './CharacterDetails'
import Planet from './Planet'

type Props = {
  location: Location
  onClose: () => void
}

// Pictures count toward the API's request limit, so show a few at a time
const RESIDENTS_PER_STEP = 24

function LocationDialog({ location, onClose }: Props) {
  const [residents, setResidents] = useState<Character[]>([])
  const [isLoading, setIsLoading] = useState(location.residents.length > 0)
  const [error, setError] = useState<string | null>(null)
  const [shownCount, setShownCount] = useState(RESIDENTS_PER_STEP)
  const [selected, setSelected] = useState<Character | null>(null)
  const { isFavorite, toggleFavorite } = useFavorites()
  const closeButton = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    let ignore = false
    fetchResidents(location)
      .then((all) => {
        if (!ignore) setResidents(all)
      })
      .catch((err: unknown) => {
        if (!ignore) {
          setError(err instanceof Error ? err.message : 'Something went wrong')
        }
      })
      .finally(() => {
        if (!ignore) setIsLoading(false)
      })
    return () => {
      ignore = true
    }
  }, [location])

  // Escape closes the window, the page behind it does not scroll,
  // and the keyboard goes back to the planet afterwards
  useEffect(() => {
    const before = document.activeElement as HTMLElement | null
    closeButton.current?.focus()
    const overflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    function handleKey(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', handleKey)
    return () => {
      document.removeEventListener('keydown', handleKey)
      document.body.style.overflow = overflow
      before?.focus()
    }
  }, [onClose])

  const count = location.residents.length

  let residentsContent
  if (selected) {
    residentsContent = (
      <>
        <button
          type="button"
          className="hud-button"
          onClick={() => setSelected(null)}
        >
          ← All residents
        </button>
        <CharacterDetails
          character={selected}
          isFavorite={isFavorite(selected.id)}
          onToggleFavorite={toggleFavorite}
        />
      </>
    )
  } else if (count === 0) {
    residentsContent = <p className="hud-message">No life forms detected</p>
  } else if (isLoading) {
    residentsContent = <p className="hud-message">Scanning for life...</p>
  } else if (error) {
    residentsContent = (
      <p className="hud-message hud-error" role="alert">
        Could not load the residents. {error}
      </p>
    )
  } else {
    residentsContent = (
      <>
        <ul className="life-forms">
          {residents.slice(0, shownCount).map((character) => (
            <li key={character.id}>
              <button
                type="button"
                className={`life-form life-${character.status.toLowerCase()}`}
                onClick={() => setSelected(character)}
              >
                <img
                  src={character.image}
                  alt=""
                  width="300"
                  height="300"
                  loading="lazy"
                />
                <span>{character.name}</span>
              </button>
            </li>
          ))}
        </ul>
        {shownCount < residents.length && (
          <button
            type="button"
            className="hud-button hud-button-center"
            onClick={() => setShownCount((n) => n + RESIDENTS_PER_STEP)}
          >
            Show more
          </button>
        )}
      </>
    )
  }

  return (
    // A click on the dark area around the window closes it
    <div className="dialog-backdrop" onClick={onClose}>
      <div
        className="location-dialog"
        role="dialog"
        aria-modal="true"
        aria-labelledby="location-dialog-title"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          ref={closeButton}
          type="button"
          className="dialog-close"
          aria-label="Close"
          onClick={onClose}
        >
          ×
        </button>
        <header className="dialog-header">
          <div className="dialog-planet">
            <span className="scan-ring" aria-hidden="true" />
            <Planet location={location} />
          </div>
          <div className="dialog-title">
            <p className="hud-label">Location scan</p>
            <h2 id="location-dialog-title">{location.name}</h2>
            <dl className="readout">
              <div>
                <dt>Type</dt>
                <dd>{location.type || 'Unknown'}</dd>
              </div>
              <div>
                <dt>Dimension</dt>
                <dd>{dimensionName(location)}</dd>
              </div>
              <div>
                <dt>Residents</dt>
                <dd>{count}</dd>
              </div>
            </dl>
          </div>
        </header>
        <section className="dialog-residents" aria-label="Residents">
          <p className="hud-label">Life forms detected</p>
          {residentsContent}
        </section>
      </div>
    </div>
  )
}

export default LocationDialog
