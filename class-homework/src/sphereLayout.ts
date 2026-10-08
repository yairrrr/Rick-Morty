// Packs circles of different sizes into one big round sphere:
// the biggest in the middle, each next one in the free spot closest
// to the middle. Answers in % of the sphere, so it fits any screen

export type Spot = {
  x: number // centre, % from the left
  y: number // centre, % from the top
  size: number // diameter, % of the sphere
}

type Circle = { x: number; y: number; r: number }

const GAP = 0.08 // space between two circles, in "radius 1" units
const ANGLES = 48 // how many spots to try around each circle

// maxUnitSize: the most a circle of radius 1 may take of the sphere, in %,
// so a dimension with only a few planets doesn't show them huge
export function packInSphere(radii: number[], maxUnitSize: number): Spot[] {
  const order = radii.map((_, i) => i).sort((a, b) => radii[b] - radii[a])
  const placed: Circle[] = []
  const result: Circle[] = []

  for (const i of order) {
    const r = radii[i]
    let best: Circle = { x: 0, y: 0, r }
    if (placed.length > 0) {
      let bestDistance = Infinity
      // Try the spots that touch each circle already placed
      for (const p of placed) {
        for (let a = 0; a < ANGLES; a++) {
          const angle = (a / ANGLES) * Math.PI * 2 + p.r // turn a bit per circle
          const d = p.r + r + GAP
          const x = p.x + Math.cos(angle) * d
          const y = p.y + Math.sin(angle) * d
          const distance = Math.hypot(x, y)
          if (distance >= bestDistance) continue
          const free = placed.every(
            (q) => Math.hypot(q.x - x, q.y - y) >= q.r + r + GAP - 1e-9,
          )
          if (free) {
            best = { x, y, r }
            bestDistance = distance
          }
        }
      }
    }
    placed.push(best)
    result[i] = { ...best }
  }

  // Move the group to the middle of the sphere
  const left = Math.min(...result.map((c) => c.x - c.r))
  const right = Math.max(...result.map((c) => c.x + c.r))
  const top = Math.min(...result.map((c) => c.y - c.r))
  const bottom = Math.max(...result.map((c) => c.y + c.r))
  const cx = (left + right) / 2
  const cy = (top + bottom) / 2
  for (const c of result) {
    c.x -= cx
    c.y -= cy
  }

  // Shrink everything to fit inside the sphere, with a small margin
  const outer = Math.max(...result.map((c) => Math.hypot(c.x, c.y) + c.r), 1)
  const scale = Math.min(47 / outer, maxUnitSize / 2)
  return result.map((c) => ({
    x: 50 + c.x * scale,
    y: 50 + c.y * scale,
    size: c.r * 2 * scale,
  }))
}

// A size change between 0.85 and 1.18 that is always the same for the same
// name, so bubbles that would be the same size still look a little different
export function sizeVariety(name: string) {
  let hash = 0
  for (const char of name) hash = (hash * 31 + char.charCodeAt(0)) >>> 0
  return 0.85 + ((hash % 1000) / 1000) * 0.33
}

// A few items get a small sphere, many items a big one (at most 860px)
export function sphereWidth(count: number) {
  return Math.min(860, Math.round(380 + 70 * Math.sqrt(count)))
}

// The smallest items are at most 100px wide when the sphere is full size
export const MAX_UNIT_PX = 100
