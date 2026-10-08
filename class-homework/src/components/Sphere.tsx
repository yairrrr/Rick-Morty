import {
  useEffect,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
  type ReactNode,
} from 'react'
import { MAX_UNIT_PX, packInSphere, sphereWidth } from '../sphereLayout'

export type SphereItem = {
  key: string
  // How big it is, compared with the others (1 is the smallest)
  radius: number
  // What floats in the sphere: a bubble, a planet...
  picture: ReactNode
  // The name tag shown on hover
  tag: ReactNode
  ariaLabel?: string
  pressed?: boolean
  style?: CSSProperties
  onChoose: () => void
}

type Props = {
  label: string
  items: SphereItem[]
}

// Phones can't hover: the first tap grows the item and shows its name,
// the second tap opens it
function canHover() {
  return !window.matchMedia('(hover: none)').matches
}

function wantsLessMotion() {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

// How far from the mouse the neighbours still react, part of the sphere
const REACH = 0.2
// How far the sphere leans towards the mouse, in degrees
const TILT = 4

// One big round sphere that turns slowly, with all the items packed inside.
// The items stay upright while the sphere turns. Near the mouse the sphere
// comes alive: it leans towards it, the items close to it grow a little and
// move aside, and the one under it grows
function Sphere({ label, items }: Props) {
  const [peekKey, setPeekKey] = useState<string | null>(null)
  const sphereRef = useRef<HTMLDivElement>(null)
  const orbitRef = useRef<HTMLUListElement>(null)
  const pointer = useRef<{ x: number; y: number } | null>(null)
  const frame = useRef(0)

  const width = sphereWidth(items.length)
  const radiiKey = items.map((item) => item.radius).join(',')
  const spots = useMemo(
    () =>
      packInSphere(
        radiiKey.split(',').map(Number),
        (MAX_UNIT_PX / width) * 100,
      ),
    [radiiKey, width],
  )

  useEffect(() => () => cancelAnimationFrame(frame.current), [])

  // Runs once per screen frame while the mouse moves, and sets CSS
  // variables; the CSS transitions make the movement smooth
  function update() {
    frame.current = 0
    const sphere = sphereRef.current
    const orbit = orbitRef.current
    if (!sphere || !orbit) return
    const p = pointer.current
    const box = sphere.getBoundingClientRect()

    // -1 to 1: where the mouse is, from the middle of the sphere
    const mx = p ? ((p.x - box.left) / box.width) * 2 - 1 : 0
    const my = p ? ((p.y - box.top) / box.height) * 2 - 1 : 0
    sphere.style.setProperty('--tilt-x', `${(-my * TILT).toFixed(2)}deg`)
    sphere.style.setProperty('--tilt-y', `${(mx * TILT).toFixed(2)}deg`)
    sphere.style.setProperty('--light-x', `${(mx * 18).toFixed(1)}%`)
    sphere.style.setProperty('--light-y', `${(my * 18).toFixed(1)}%`)

    const reach = box.width * REACH
    for (const spot of Array.from(orbit.children) as HTMLElement[]) {
      let near = 0
      let pushX = 0
      let pushY = 0
      if (p) {
        const rect = spot.getBoundingClientRect()
        const dx = rect.left + rect.width / 2 - p.x
        const dy = rect.top + rect.height / 2 - p.y
        const distance = Math.hypot(dx, dy) || 1
        near = Math.max(0, 1 - distance / reach)
        // The one under the mouse stays put, its neighbours make room
        if (distance > spot.offsetWidth / 2) {
          const push = near * near * spot.offsetWidth * 0.35
          pushX = (dx / distance) * push
          pushY = (dy / distance) * push
        }
      }
      spot.style.setProperty('--near', near.toFixed(3))
      spot.style.setProperty('--push-x', `${pushX.toFixed(1)}px`)
      spot.style.setProperty('--push-y', `${pushY.toFixed(1)}px`)
    }
  }

  function follow(position: { x: number; y: number } | null) {
    if (wantsLessMotion()) return
    pointer.current = position
    frame.current ||= requestAnimationFrame(update)
  }

  return (
    <div
      className="sphere"
      ref={sphereRef}
      style={{ '--sphere-width': `${width}px` } as CSSProperties}
      onPointerMove={(e) => {
        if (e.pointerType === 'mouse') follow({ x: e.clientX, y: e.clientY })
      }}
      onPointerLeave={() => follow(null)}
    >
      <span className="sphere-glass" aria-hidden="true" />
      <ul className="sphere-orbit" ref={orbitRef} aria-label={label}>
        {items.map((item, i) => {
          const spot = spots[i]
          return (
            <li
              key={item.key}
              className="sphere-spot"
              style={
                {
                  ...item.style,
                  '--i': i,
                  left: `${spot.x}%`,
                  top: `${spot.y}%`,
                  width: `${spot.size}%`,
                } as CSSProperties
              }
            >
              <button
                type="button"
                className={`sphere-item ${peekKey === item.key ? 'is-peek' : ''}`}
                aria-label={item.ariaLabel}
                aria-pressed={item.pressed}
                onClick={() => {
                  if (canHover() || peekKey === item.key) {
                    item.onChoose()
                  } else {
                    setPeekKey(item.key)
                  }
                }}
                onBlur={() => setPeekKey(null)}
              >
                <span className="sphere-upright">
                  <span className="sphere-grow">{item.picture}</span>
                  <span className="sphere-tag">{item.tag}</span>
                </span>
              </button>
            </li>
          )
        })}
      </ul>
    </div>
  )
}

export default Sphere
