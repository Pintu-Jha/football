import { useMemo } from 'react'

import { cn } from '@/lib/utils'

const GRID = 25
const QUIET = 2

/** FNV-1a: turns the reference into a 32-bit seed. */
function hashSeed(text: string): number {
  let h = 0x811c9dc5
  for (let i = 0; i < text.length; i += 1) {
    h ^= text.charCodeAt(i)
    h = Math.imul(h, 0x01000193)
  }
  return h >>> 0
}

/** mulberry32: small deterministic PRNG. */
function createRandom(seed: number): () => number {
  let a = seed
  return () => {
    a = (a + 0x6d2b79f5) | 0
    let t = Math.imul(a ^ (a >>> 15), 1 | a)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

function inFinder(x: number, y: number): boolean {
  const corners: ReadonlyArray<readonly [number, number]> = [
    [0, 0],
    [GRID - 7, 0],
    [0, GRID - 7],
  ]
  return corners.some(
    ([cx, cy]) => x >= cx - 1 && x <= cx + 7 && y >= cy - 1 && y <= cy + 7,
  )
}

function finderModule(x: number, y: number, cx: number, cy: number): boolean {
  const dx = x - cx
  const dy = y - cy
  if (dx < 0 || dx > 6 || dy < 0 || dy > 6) return false
  const ring = Math.max(Math.abs(dx - 3), Math.abs(dy - 3))
  return ring !== 2
}

function buildPath(reference: string): string {
  const random = createRandom(hashSeed(reference))
  const parts: string[] = []
  const finders: ReadonlyArray<readonly [number, number]> = [
    [0, 0],
    [GRID - 7, 0],
    [0, GRID - 7],
  ]

  for (let y = 0; y < GRID; y += 1) {
    for (let x = 0; x < GRID; x += 1) {
      let dark: boolean
      if (inFinder(x, y)) {
        dark = finders.some(([cx, cy]) => finderModule(x, y, cx, cy))
      } else {
        dark = random() > 0.5
      }
      if (dark) parts.push(`M${x} ${y}h1v1h-1z`)
    }
  }
  return parts.join('')
}

export interface PseudoQrProps {
  /** Seed: the same reference always draws the same pattern. */
  reference: string
  className?: string
}

/** Decorative, deterministic QR-style graphic. NOT a real, scannable code. */
export function PseudoQr({ reference, className }: PseudoQrProps) {
  const path = useMemo(() => buildPath(reference), [reference])
  const size = GRID + QUIET * 2

  return (
    <svg
      role="img"
      aria-label="Decorative placeholder QR code. Not scannable."
      viewBox={`${-QUIET} ${-QUIET} ${size} ${size}`}
      shapeRendering="crispEdges"
      className={cn('size-36 rounded-lg bg-white', className)}
    >
      <rect x={-QUIET} y={-QUIET} width={size} height={size} fill="#ffffff" />
      <path d={path} fill="#0b0b0f" />
    </svg>
  )
}
