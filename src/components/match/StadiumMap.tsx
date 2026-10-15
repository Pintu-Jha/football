import { useGSAP } from '@gsap/react'
import * as Popover from '@radix-ui/react-popover'
import { AlertTriangle, Minus, Plus, RotateCcw } from 'lucide-react'
import {
  type KeyboardEvent,
  type PointerEvent,
  useCallback,
  useMemo,
  useRef,
  useState,
} from 'react'

import {
  MAP_CENTER,
  MAP_VIEWBOX,
  PITCH,
  pitchSurroundPath,
  seatCategories,
  stadiumSections,
  stadiumShellPath,
  zonesWithTickets,
} from '@/data/stadium'
import { gsap, prefersReducedMotion } from '@/lib/gsap'
import { MOTION } from '@/lib/motion'
import { cn } from '@/lib/utils'

const MIN_SCALE = 1
const MAX_SCALE = 3
const SCALE_STEP = 0.5
const DIM_OPACITY = 0.38
const DRAG_THRESHOLD_PX = 4

export type StadiumMapProps = {
  selectedZoneId: string | null
  hoveredZoneId: string | null
  onZoneClick: (zoneId: string) => void
  onZoneHover: (zoneId: string | null) => void
  className?: string
}

const categoryColor = Object.fromEntries(
  seatCategories.map((c) => [c.id, c.color]),
) as Record<string, string>

const categoryLabel = Object.fromEntries(
  seatCategories.map((c) => [c.id, c.label]),
) as Record<string, string>

function brighten(hex: string, amount: number): string {
  const n = hex.replace('#', '')
  const channel = (start: number) =>
    Math.min(255, parseInt(n.slice(start, start + 2), 16) + Math.round(255 * amount))
      .toString(16)
      .padStart(2, '0')
  return `#${channel(0)}${channel(2)}${channel(4)}`
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value))
}

type View = { s: number; x: number; y: number }

function PitchMarkings() {
  const { x, y, width, height } = PITCH
  const midX = x + width / 2
  const midY = y + height / 2
  const boxW = width * 0.16
  const boxH = height * 0.58
  const goalW = width * 0.06
  const goalH = height * 0.28
  const stripes = 10
  const stripeW = width / stripes
  const line = 'rgba(255,255,255,0.7)'

  return (
    <g pointerEvents="none">
      <rect x={x} y={y} width={width} height={height} rx={2} fill="#2D7A3C" />
      {Array.from({ length: stripes }, (_, i) =>
        i % 2 === 0 ? (
          <rect
            key={i}
            x={x + i * stripeW}
            y={y}
            width={stripeW}
            height={height}
            fill="#348A45"
          />
        ) : null,
      )}
      <rect x={x} y={y} width={width} height={height} rx={2} fill="none" stroke={line} strokeWidth={0.9} />
      <line x1={midX} y1={y} x2={midX} y2={y + height} stroke={line} strokeWidth={0.9} />
      <circle cx={midX} cy={midY} r={height * 0.17} fill="none" stroke={line} strokeWidth={0.9} />
      <circle cx={midX} cy={midY} r={1.4} fill={line} />
      <rect x={x} y={midY - boxH / 2} width={boxW} height={boxH} fill="none" stroke={line} strokeWidth={0.9} />
      <rect x={x + width - boxW} y={midY - boxH / 2} width={boxW} height={boxH} fill="none" stroke={line} strokeWidth={0.9} />
      <rect x={x} y={midY - goalH / 2} width={goalW} height={goalH} fill="none" stroke={line} strokeWidth={0.9} />
      <rect x={x + width - goalW} y={midY - goalH / 2} width={goalW} height={goalH} fill="none" stroke={line} strokeWidth={0.9} />
    </g>
  )
}

export function StadiumMap({
  selectedZoneId,
  hoveredZoneId,
  onZoneClick,
  onZoneHover,
  className,
}: StadiumMapProps) {
  const [scale, setScale] = useState(1)
  const [dragging, setDragging] = useState(false)
  const rootRef = useRef<HTMLDivElement | null>(null)
  const layerRef = useRef<SVGGElement | null>(null)
  const view = useRef<View>({ s: 1, x: 0, y: 0 })
  const drag = useRef<{
    pointerId: number
    startX: number
    startY: number
    originX: number
    originY: number
    moved: boolean
  } | null>(null)
  const suppressClick = useRef(false)

  const applyView = useCallback(() => {
    const layer = layerRef.current
    if (!layer) return
    const { s, x, y } = view.current
    layer.setAttribute(
      'transform',
      `translate(${MAP_CENTER.x + x} ${MAP_CENTER.y + y}) scale(${s}) translate(${-MAP_CENTER.x} ${-MAP_CENTER.y})`,
    )
  }, [])

  const limits = (s: number) => ({
    x: (s - 1) * MAP_CENTER.x,
    y: (s - 1) * MAP_CENTER.y,
  })

  const animateTo = useCallback(
    (target: View) => {
      gsap.killTweensOf(view.current)
      if (prefersReducedMotion()) {
        Object.assign(view.current, target)
        applyView()
        return
      }
      gsap.to(view.current, {
        ...target,
        duration: MOTION.duration.fast,
        ease: MOTION.ease.out,
        onUpdate: applyView,
      })
    },
    [applyView],
  )

  const zoomTo = useCallback(
    (next: number) => {
      const s = clamp(next, MIN_SCALE, MAX_SCALE)
      const lim = limits(s)
      setScale(s)
      animateTo({
        s,
        x: clamp(view.current.x, -lim.x, lim.x),
        y: clamp(view.current.y, -lim.y, lim.y),
      })
    },
    [animateTo],
  )

  const resetView = useCallback(() => {
    setScale(1)
    animateTo({ s: 1, x: 0, y: 0 })
  }, [animateTo])

  useGSAP(
    () => {
      const root = rootRef.current
      if (!root || prefersReducedMotion()) return
      const paths = root.querySelectorAll<SVGPathElement>('[data-section-id]')
      gsap.fromTo(
        paths,
        { opacity: 0, scale: 0.9, transformOrigin: '50% 50%' },
        {
          opacity: (_index: number, el: Element) =>
            el.getAttribute('data-dim') === 'true' ? DIM_OPACITY : 1,
          scale: 1,
          duration: MOTION.duration.base,
          stagger: { each: 0.006, from: 'center' },
          ease: MOTION.ease.out,
          clearProps: 'transform',
        },
      )
    },
    { scope: rootRef },
  )

  const onPointerDown = (event: PointerEvent<SVGSVGElement>) => {
    if (view.current.s <= 1 || event.button !== 0) return
    drag.current = {
      pointerId: event.pointerId,
      startX: event.clientX,
      startY: event.clientY,
      originX: view.current.x,
      originY: view.current.y,
      moved: false,
    }
  }

  const onPointerMove = (event: PointerEvent<SVGSVGElement>) => {
    const d = drag.current
    if (!d || d.pointerId !== event.pointerId) return
    const dx = event.clientX - d.startX
    const dy = event.clientY - d.startY
    if (!d.moved && Math.hypot(dx, dy) < DRAG_THRESHOLD_PX) return
    if (!d.moved) {
      d.moved = true
      setDragging(true)
      event.currentTarget.setPointerCapture(event.pointerId)
    }
    const rect = event.currentTarget.getBoundingClientRect()
    const unit = MAP_VIEWBOX.width / rect.width
    const lim = limits(view.current.s)
    gsap.killTweensOf(view.current)
    view.current.x = clamp(d.originX + dx * unit, -lim.x, lim.x)
    view.current.y = clamp(d.originY + dy * unit, -lim.y, lim.y)
    applyView()
  }

  const endDrag = (event: PointerEvent<SVGSVGElement>) => {
    const d = drag.current
    if (!d || d.pointerId !== event.pointerId) return
    if (d.moved) {
      suppressClick.current = true
      window.setTimeout(() => {
        suppressClick.current = false
      }, 0)
      setDragging(false)
    }
    drag.current = null
  }

  const activate = (zoneId: string) => {
    if (suppressClick.current) return
    onZoneClick(zoneId)
  }

  const onSectionKeyDown = (event: KeyboardEvent<SVGPathElement>, zoneId: string) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault()
      onZoneClick(zoneId)
    }
  }

  const sliderPosition = ((scale - MIN_SCALE) / (MAX_SCALE - MIN_SCALE)) * 100

  const sections = useMemo(
    () =>
      stadiumSections.map((section) => ({
        ...section,
        hasTickets: zonesWithTickets.has(section.zoneId),
        color: categoryColor[section.categoryId] ?? '#9CA3AF',
      })),
    [],
  )

  return (
    <div ref={rootRef} className={cn('relative', className)}>
      <div className="relative overflow-hidden rounded-xl bg-surface">
        <svg
          viewBox={`0 0 ${MAP_VIEWBOX.width} ${MAP_VIEWBOX.height}`}
          className={cn(
            'block h-auto w-full touch-pan-y select-none',
            scale > 1 && (dragging ? 'cursor-grabbing' : 'cursor-grab'),
          )}
          role="group"
          aria-label="Interactive stadium seating map. Select a highlighted section to filter tickets."
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={endDrag}
          onPointerCancel={endDrag}
        >
          <defs>
            <filter id="zone-glow" x="-30%" y="-30%" width="160%" height="160%">
              <feDropShadow dx="0" dy="0" stdDeviation="2.2" floodColor="#0B0B0F" floodOpacity="0.55" />
            </filter>
          </defs>

          <g ref={layerRef}>
            <path d={stadiumShellPath} fill="#F1F2F6" stroke="#E2E5EC" strokeWidth={1} />

            {sections.map((section) => {
              const active =
                section.zoneId === selectedZoneId || section.zoneId === hoveredZoneId
              const interactive = section.hasTickets

              return (
                <path
                  key={section.id}
                  data-section-id={section.id}
                  data-zone-id={section.zoneId}
                  data-dim={interactive ? 'false' : 'true'}
                  d={section.path}
                  fill={active ? brighten(section.color, 0.12) : section.color}
                  stroke={active ? '#0B0B0F' : 'rgba(255,255,255,0.85)'}
                  strokeWidth={active ? 1.6 : 0.8}
                  strokeLinejoin="round"
                  opacity={interactive ? 1 : DIM_OPACITY}
                  filter={active ? 'url(#zone-glow)' : undefined}
                  className={cn(interactive && 'cursor-pointer')}
                  onClick={interactive ? () => activate(section.zoneId) : undefined}
                  onMouseEnter={interactive ? () => onZoneHover(section.zoneId) : undefined}
                  onMouseLeave={interactive ? () => onZoneHover(null) : undefined}
                  onFocus={interactive ? () => onZoneHover(section.zoneId) : undefined}
                  onBlur={interactive ? () => onZoneHover(null) : undefined}
                  onKeyDown={interactive ? (e) => onSectionKeyDown(e, section.zoneId) : undefined}
                  tabIndex={interactive ? 0 : undefined}
                  role={interactive ? 'button' : undefined}
                  aria-hidden={interactive ? undefined : true}
                  aria-pressed={interactive ? section.zoneId === selectedZoneId : undefined}
                  aria-label={
                    interactive
                      ? `${section.name}, ${categoryLabel[section.categoryId] ?? 'Seating'}. Tickets available`
                      : undefined
                  }
                >
                  <title>
                    {section.name} · {categoryLabel[section.categoryId]}
                    {interactive ? '' : ' · No tickets listed'}
                  </title>
                </path>
              )
            })}

            <g pointerEvents="none" aria-hidden>
              {sections.map((section) => (
                <text
                  key={section.id}
                  x={section.labelX}
                  y={section.labelY}
                  textAnchor="middle"
                  dominantBaseline="central"
                  fontSize={4.6}
                  fontWeight={600}
                  fill="#ffffff"
                  opacity={section.hasTickets ? 0.95 : 0.7}
                >
                  {section.label}
                </text>
              ))}
            </g>

            <path d={pitchSurroundPath} fill="#E4E7ED" pointerEvents="none" />
            <PitchMarkings />
          </g>
        </svg>

        <div className="absolute right-3 top-1/2 flex -translate-y-1/2 flex-col items-center gap-2">
          <button
            type="button"
            className="grid size-9 place-items-center rounded-full border border-border bg-white text-ink shadow-soft transition-colors hover:bg-surface-muted disabled:opacity-40"
            aria-label="Zoom in"
            disabled={scale >= MAX_SCALE}
            onClick={() => zoomTo(scale + SCALE_STEP)}
          >
            <Plus className="size-4" aria-hidden />
          </button>
          <div className="relative h-16 w-1 rounded-full bg-border" aria-hidden>
            <span
              className="absolute left-1/2 size-3 -translate-x-1/2 rounded-full border-2 border-white bg-brand shadow-soft transition-[bottom] duration-300"
              style={{ bottom: `calc(${sliderPosition}% - 6px)` }}
            />
          </div>
          <button
            type="button"
            className="grid size-9 place-items-center rounded-full border border-border bg-white text-ink shadow-soft transition-colors hover:bg-surface-muted disabled:opacity-40"
            aria-label="Zoom out"
            disabled={scale <= MIN_SCALE}
            onClick={() => zoomTo(scale - SCALE_STEP)}
          >
            <Minus className="size-4" aria-hidden />
          </button>
          <button
            type="button"
            className="grid size-9 place-items-center rounded-full border border-border bg-white text-ink shadow-soft transition-colors hover:bg-surface-muted"
            aria-label="Reset map view"
            onClick={resetView}
          >
            <RotateCcw className="size-4" aria-hidden />
          </button>
        </div>

        <Popover.Root>
          <Popover.Trigger asChild>
            <button
              type="button"
              className="absolute bottom-3 left-3 inline-flex items-center gap-2 rounded-lg border border-border bg-white px-3 py-2 text-xs font-semibold text-ink shadow-soft transition-colors hover:bg-surface-muted"
            >
              <AlertTriangle className="size-4 text-amber-600" aria-hidden />
              Warnings
            </button>
          </Popover.Trigger>
          <Popover.Portal>
            <Popover.Content
              side="top"
              align="start"
              sideOffset={8}
              className="z-50 w-72 rounded-xl border border-border bg-white p-4 text-sm text-ink-soft shadow-lift outline-none"
            >
              <p className="font-semibold text-ink">Before you buy</p>
              <ul className="mt-2 list-disc space-y-1.5 pl-4 text-muted">
                <li>The map is illustrative; exact seat views can differ.</li>
                <li>Faded sections have no tickets listed for this match.</li>
                <li>Seat numbers are confirmed on your e-ticket after booking.</li>
              </ul>
              <Popover.Arrow className="fill-white" />
            </Popover.Content>
          </Popover.Portal>
        </Popover.Root>
      </div>

      <ul className="mt-3 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs font-medium text-muted">
        {seatCategories.map((category) => (
          <li key={category.id} className="flex items-center gap-2">
            <span
              className="size-2.5 shrink-0 rounded-full"
              style={{ backgroundColor: category.color }}
              aria-hidden
            />
            {category.label}
          </li>
        ))}
      </ul>
    </div>
  )
}
