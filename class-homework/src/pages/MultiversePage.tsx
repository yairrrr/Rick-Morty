import { useCallback, useEffect, useState, type CSSProperties } from 'react'
import { useSearchParams } from 'react-router'
import DimensionPicker from '../components/DimensionPicker'
import LocationDialog from '../components/LocationDialog'
import Planet from '../components/Planet'
import SpaceBackdrop from '../components/SpaceBackdrop'
import Sphere from '../components/Sphere'
import { sizeVariety } from '../sphereLayout'
import {
  dimensionName,
  fetchLocations,
  UNKNOWN_DIMENSION,
  type Location,
} from '../locations'
import '../multiverse.css'

type Dimension = { name: string; count: number }

// The dimensions with the most locations first, the unknown one last
function groupByDimension(locations: Location[]): Dimension[] {
  const counts = new Map<string, number>()
  for (const location of locations) {
    const name = dimensionName(location)
    counts.set(name, (counts.get(name) ?? 0) + 1)
  }
  return [...counts]
    .map(([name, count]) => ({ name, count }))
    .sort(
      (a, b) =>
        Number(a.name === UNKNOWN_DIMENSION) -
          Number(b.name === UNKNOWN_DIMENSION) ||
        b.count - a.count ||
        a.name.localeCompare(b.name),
    )
}

function plural(n: number, word: string) {
  return `${n} ${word}${n === 1 ? '' : 's'}`
}

// Dimensions with more locations get a bigger bubble, but only a little,
// so none is huge: 1 location is 1, 57 locations is about 1.7
function bubbleRadius(count: number) {
  return 1 + Math.log2(count) * 0.12
}

// Planets with more residents are a little bigger: 0 residents is 1,
// 230 residents is about 1.6
function planetRadius(residents: number) {
  return 1 + Math.log2(residents + 1) * 0.08
}

// Each dimension is a bubble with a world inside, like in the show.
// The worlds come from src/assets/bubbles; bubble-00 is the Smiths' house
const bubbleFiles = import.meta.glob<string>('../assets/bubbles/*.webp', {
  eager: true,
  import: 'default',
})
const [homeWorld, ...otherWorlds] = Object.keys(bubbleFiles)
  .sort()
  .map((path) => bubbleFiles[path])

// The n-th dimension (not counting C-137): its world, and the colours of
// the world and of the glowing edge. When the worlds run out they come
// back in other colours
function bubbleLook(name: string, n: number) {
  if (name === 'Dimension C-137') {
    return { world: homeWorld, worldHue: 0, edgeHue: 140 }
  }
  return {
    world: otherWorlds[n % otherWorlds.length],
    worldHue: (Math.floor(n / otherWorlds.length) * 110) % 360,
    edgeHue: (n * 47 + 190) % 360,
  }
}

function MultiversePage() {
  const [locations, setLocations] = useState<Location[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [query, setQuery] = useState('')
  // The dimension and the open location live in the address
  // (/multiverse?dimension=Dimension+C-137&location=1),
  // so the browser's Back button goes back one step
  const [searchParams, setSearchParams] = useSearchParams()
  const dimension = searchParams.get('dimension')
  const openId = Number(searchParams.get('location'))

  useEffect(() => {
    let ignore = false
    fetchLocations()
      .then((all) => {
        if (!ignore) setLocations(all)
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
  }, [])

  function chooseDimension(name: string | null) {
    setSearchParams(name ? { dimension: name } : {})
  }

  function openLocation(id: number) {
    setSearchParams((params) => {
      params.set('location', String(id))
      return params
    })
  }

  // Kept the same between renders, so the window does not
  // move the keyboard focus every time the page updates
  const closeLocation = useCallback(() => {
    setSearchParams((params) => {
      params.delete('location')
      return params
    })
  }, [setSearchParams])

  const dimensions = groupByDimension(locations)
  // The same look for a dimension in the sphere and in the filter
  const others = dimensions.filter((d) => d.name !== 'Dimension C-137')
  const looks = new Map(
    dimensions.map((d) => [d.name, bubbleLook(d.name, others.indexOf(d))]),
  )
  const searchName = query.trim().toLowerCase()
  const isMap = dimension !== null || searchName !== ''
  const shownLocations = locations.filter(
    (location) =>
      (dimension === null || dimensionName(location) === dimension) &&
      location.name.toLowerCase().includes(searchName),
  )
  const openLocationData = locations.find((l) => l.id === openId)

  let content
  if (isLoading) {
    content = <p className="hud-message">Opening portals...</p>
  } else if (error) {
    content = (
      <p className="hud-message hud-error" role="alert">
        Could not load the multiverse. {error}
      </p>
    )
  } else if (!isMap) {
    // Step 1: pick a dimension. Every dimension is a bubble in the sphere
    content = (
      <Sphere
        label="Dimensions"
        items={dimensions.map((d) => {
          const look = looks.get(d.name)!
          return {
            key: d.name,
            radius: bubbleRadius(d.count) * sizeVariety(d.name),
            style: {
              '--world-hue': `${look.worldHue}deg`,
              '--edge-hue': look.edgeHue,
            } as CSSProperties,
            picture: (
              <span className="bubble" aria-hidden="true">
                <img src={look.world} alt="" draggable={false} />
              </span>
            ),
            tag: (
              <>
                <span className="dimension-name">{d.name}</span>
                <span className="dimension-count">
                  {plural(d.count, 'location')}
                </span>
              </>
            ),
            onChoose: () => chooseDimension(d.name),
          }
        })}
      />
    )
  } else {
    // Step 2: the planets of the dimension (or of the search)
    content = (
      // A new key replays the warp animation on every jump
      <div className="warp" key={dimension ?? 'search'}>
        <div className="sector-heading">
          {dimension && (
            <button
              type="button"
              className="hud-button"
              onClick={() => chooseDimension(null)}
            >
              ← All dimensions
            </button>
          )}
          <p className="hud-label">{dimension ? 'Sector' : 'Deep scan'}</p>
          <h3>{dimension ?? 'Every dimension'}</h3>
          <p className="hud-readout">
            {plural(shownLocations.length, 'location')} detected
          </p>
        </div>
        {shownLocations.length === 0 ? (
          <p className="hud-message">No signal. No locations found</p>
        ) : (
          <Sphere
            label="Locations"
            items={shownLocations.map((location) => ({
              key: String(location.id),
              radius:
                planetRadius(location.residents.length) *
                sizeVariety(location.name),
              ariaLabel: location.name,
              pressed: location.id === openId,
              picture: <Planet location={location} />,
              tag: <span className="planet-name">{location.name}</span>,
              onChoose: () => openLocation(location.id),
            }))}
          />
        )}
      </div>
    )
  }

  return (
    <div className="page multiverse">
      <SpaceBackdrop />
      {/* Stars rush past on every jump to another dimension */}
      <span
        key={dimension ?? 'home'}
        className="hyperspace"
        aria-hidden="true"
      />
      <header className="multiverse-hero">
        <p className="hud-label">Interdimensional explorer</p>
        <h2 className="page-title">Multiverse</h2>
        <p className="multiverse-intro">
          {isMap
            ? 'Pick a planet to meet who lives there.'
            : 'Infinite realities. Pick one to jump into it.'}
        </p>
      </header>
      <div className="nav-console">
        <input
          type="search"
          className="console-input"
          placeholder="Search locations by name"
          aria-label="Search locations by name"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <DimensionPicker
          value={dimension}
          options={dimensions.map((d) => ({
            name: d.name,
            count: d.count,
            world: looks.get(d.name)!.world,
            edgeHue: looks.get(d.name)!.edgeHue,
          }))}
          onChange={chooseDimension}
        />
      </div>
      {content}
      {openLocationData && (
        <LocationDialog
          key={openLocationData.id}
          location={openLocationData}
          onClose={closeLocation}
        />
      )}
    </div>
  )
}

export default MultiversePage
