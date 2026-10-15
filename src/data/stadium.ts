import type {
  SeatCategory,
  StadiumSection,
  StadiumTicket,
  StadiumZone,
} from './types'

export const seatCategories: SeatCategory[] = [
  { id: 'premium', label: 'Premium', color: '#E11D2E' },
  { id: 'cat1', label: 'Category 1', color: '#2563EB' },
  { id: 'cat2', label: 'Category 2', color: '#14B8A6' },
  { id: 'cat3', label: 'Category 3', color: '#F97316' },
]

/* -------------------------------------------------------------------------- */
/*  Procedural oval stadium                                                   */
/* -------------------------------------------------------------------------- */

export const MAP_VIEWBOX = { width: 530, height: 400 } as const
export const MAP_CENTER = { x: 265, y: 200 } as const

/** Pitch rectangle, sits inside the innermost ring with a small gap */
export const PITCH = { x: 167, y: 138, width: 196, height: 124 } as const

const SEGMENTS_PER_RING = 32
const SEGMENT_DEG = 360 / SEGMENTS_PER_RING
const SEGMENT_GAP_DEG = 0.55
const ARC_STEPS = 4
const SUPERELLIPSE_EXPONENT = 3.2

/** Half-extents of the four ring boundaries, from the pitch outwards */
const RING_EDGES = [
  { a: 126, b: 82 },
  { a: 159, b: 114 },
  { a: 192, b: 146 },
  { a: 223, b: 177 },
] as const

type RingId = 'lower' | 'middle' | 'upper'

const RINGS: ReadonlyArray<{
  id: RingId
  prefix: string
  inner: number
  outer: number
}> = [
  { id: 'upper', prefix: 'U', inner: 2, outer: 3 },
  { id: 'middle', prefix: 'M', inner: 1, outer: 2 },
  { id: 'lower', prefix: 'L', inner: 0, outer: 1 },
]

const COMPASS = [
  { id: 'east', label: 'Tribune Est', corner: false },
  { id: 'northeast', label: 'Coin Nord-Est', corner: true },
  { id: 'north', label: 'Tribune Nord', corner: false },
  { id: 'northwest', label: 'Coin Nord-Ouest', corner: true },
  { id: 'west', label: 'Tribune Ouest', corner: false },
  { id: 'southwest', label: 'Coin Sud-Ouest', corner: true },
  { id: 'south', label: 'Tribune Sud', corner: false },
  { id: 'southeast', label: 'Coin Sud-Est', corner: true },
] as const

const RING_LABELS: Record<RingId, string> = {
  upper: 'Upper Tier',
  middle: 'Middle Tier',
  lower: 'Lower Tier',
}

function ringCategory(ring: RingId, corner: boolean): string {
  if (ring === 'upper') return corner ? 'cat3' : 'premium'
  if (ring === 'middle') return 'cat1'
  return 'cat2'
}

function superellipsePoint(
  thetaDeg: number,
  a: number,
  b: number,
): [number, number] {
  const rad = (thetaDeg * Math.PI) / 180
  const c = Math.cos(rad)
  const s = Math.sin(rad)
  const p = 2 / SUPERELLIPSE_EXPONENT
  const x = a * Math.sign(c) * Math.abs(c) ** p
  const y = b * Math.sign(s) * Math.abs(s) ** p
  return [MAP_CENTER.x + x, MAP_CENTER.y - y]
}

function arcPoints(
  fromDeg: number,
  toDeg: number,
  a: number,
  b: number,
): Array<[number, number]> {
  const points: Array<[number, number]> = []
  for (let i = 0; i <= ARC_STEPS; i += 1) {
    const theta = fromDeg + ((toDeg - fromDeg) * i) / ARC_STEPS
    points.push(superellipsePoint(theta, a, b))
  }
  return points
}

function toPath(points: Array<[number, number]>): string {
  return `${points
    .map(([x, y], i) => `${i === 0 ? 'M' : 'L'}${x.toFixed(1)},${y.toFixed(1)}`)
    .join(' ')} Z`
}

function buildSections(): StadiumSection[] {
  const sections: StadiumSection[] = []

  for (const ring of RINGS) {
    const innerEdge = RING_EDGES[ring.inner]!
    const outerEdge = RING_EDGES[ring.outer]!

    for (let k = 0; k < SEGMENTS_PER_RING; k += 1) {
      const start = k * SEGMENT_DEG + SEGMENT_GAP_DEG
      const end = (k + 1) * SEGMENT_DEG - SEGMENT_GAP_DEG
      const mid = (k + 0.5) * SEGMENT_DEG

      const compass = COMPASS[Math.floor(((mid + 22.5) % 360) / 45)]!
      const outerArc = arcPoints(start, end, outerEdge.a, outerEdge.b)
      const innerArc = arcPoints(end, start, innerEdge.a, innerEdge.b)

      const [labelX, labelY] = superellipsePoint(
        mid,
        (innerEdge.a + outerEdge.a) / 2,
        (innerEdge.b + outerEdge.b) / 2,
      )

      const label = `${ring.prefix}${k + 1}`
      sections.push({
        id: `${ring.id}-${k + 1}`,
        label,
        name: `${compass.label} · Block ${label}`,
        categoryId: ringCategory(ring.id, compass.corner),
        zoneId: `${ring.id}-${compass.id}`,
        path: toPath([...outerArc, ...innerArc]),
        labelX: Number(labelX.toFixed(1)),
        labelY: Number(labelY.toFixed(1)),
      })
    }
  }

  return sections
}

export const stadiumSections: StadiumSection[] = buildSections()

function closedOutline(edgeIndex: number, grow = 0): string {
  const edge = RING_EDGES[edgeIndex]!
  const points: Array<[number, number]> = []
  const steps = 96
  for (let i = 0; i < steps; i += 1) {
    points.push(
      superellipsePoint((i * 360) / steps, edge.a + grow, edge.b + grow),
    )
  }
  return toPath(points)
}

/** Concourse area between the pitch and the first ring */
export const pitchSurroundPath: string = closedOutline(0)
/** Soft outer shell drawn behind the outermost ring */
export const stadiumShellPath: string = closedOutline(3, 7)

export const stadiumZones: StadiumZone[] = RINGS.flatMap((ring) =>
  COMPASS.map((compass) => ({
    id: `${ring.id}-${compass.id}`,
    name: `${RING_LABELS[ring.id]} · ${compass.label}`,
    categoryId: ringCategory(ring.id, compass.corner),
  })),
)

export function getZone(zoneId: string): StadiumZone | undefined {
  return stadiumZones.find((z) => z.id === zoneId)
}

export function getSeatCategory(categoryId: string): SeatCategory | undefined {
  return seatCategories.find((c) => c.id === categoryId)
}

/* -------------------------------------------------------------------------- */
/*  Ticket listings (Lille OSC vs Stade Brestois)                             */
/*  Prices are in EUR (base currency).                                        */
/* -------------------------------------------------------------------------- */

export const lilleStadiumTickets: StadiumTicket[] = [
  {
    id: 't1',
    rank: 1,
    zoneId: 'middle-east',
    tierName: 'Tribune Niveau 1',
    available: 10,
    price: 270,
    eTicket: true,
  },
  {
    id: 't2',
    rank: 2,
    zoneId: 'lower-north',
    tierName: 'Upper Tier',
    available: 10,
    price: 180,
    eTicket: true,
    cheapest: true,
  },
  {
    id: 't3',
    rank: 3,
    zoneId: 'lower-south',
    tierName: 'Upper Tier',
    available: 10,
    price: 200,
    eTicket: true,
    mostPopular: true,
  },
  {
    id: 't4',
    rank: 4,
    zoneId: 'middle-north',
    tierName: 'Lower Tier',
    available: 10,
    price: 350,
    eTicket: true,
  },
  {
    id: 't5',
    rank: 5,
    zoneId: 'upper-east',
    tierName: 'VIP Hospitality',
    available: 10,
    price: 700,
    eTicket: true,
  },
  {
    id: 't6',
    rank: 6,
    zoneId: 'upper-west',
    tierName: 'VIP Hospitality',
    available: 6,
    price: 890,
    eTicket: true,
  },
  {
    id: 't7',
    rank: 7,
    zoneId: 'upper-northeast',
    tierName: 'Corner Tier',
    available: 8,
    price: 210,
    eTicket: true,
  },
]

export function getStadiumTicket(id: string): StadiumTicket | undefined {
  return lilleStadiumTickets.find((t) => t.id === id)
}

export const zonesWithTickets: ReadonlySet<string> = new Set(
  lilleStadiumTickets.map((t) => t.zoneId),
)
