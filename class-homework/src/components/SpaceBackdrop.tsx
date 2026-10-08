import type { CSSProperties } from 'react'

// Always the same "random" numbers, so the stars don't jump between visits
function seededRandom(seed: number) {
  return () => {
    seed = (seed * 16807) % 2147483647
    return seed / 2147483647
  }
}

const random = seededRandom(42)

const STARS = Array.from({ length: 160 }, () => ({
  left: random() * 100,
  top: random() * 100,
  size: random() < 0.85 ? 1 + random() : 2 + random() * 1.5,
  delay: random() * -6,
  duration: 3 + random() * 4,
}))

// Deep space behind the Multiverse page: twinkling stars, coloured nebulas,
// a spiral galaxy, two far-away portals and a shooting star now and then
function SpaceBackdrop() {
  return (
    <div className="space-backdrop" aria-hidden="true">
      <span className="nebula nebula-green" />
      <span className="nebula nebula-blue" />
      <span className="nebula nebula-pink" />
      <span className="galaxy" />
      {STARS.map((star, i) => (
        <span
          key={i}
          className="star"
          style={
            {
              left: `${star.left}%`,
              top: `${star.top}%`,
              '--star-size': `${star.size}px`,
              animationDelay: `${star.delay}s`,
              animationDuration: `${star.duration}s`,
            } as CSSProperties
          }
        />
      ))}
      <span className="far-portal far-portal-1" />
      <span className="far-portal far-portal-2" />
      <span className="shooting-star shooting-star-1" />
      <span className="shooting-star shooting-star-2" />
    </div>
  )
}

export default SpaceBackdrop
