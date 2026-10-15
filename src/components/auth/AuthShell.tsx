import { useGSAP } from '@gsap/react'
import {
  ArrowLeft,
  Bell,
  ShieldCheck,
  Ticket,
  type LucideIcon,
} from 'lucide-react'
import { type ReactNode, useRef } from 'react'
import { Link } from 'react-router-dom'

import { Logo } from '@/components/layout/Logo'
import { gsap, prefersReducedMotion } from '@/lib/gsap'
import { MOTION } from '@/lib/motion'
import { cn } from '@/lib/utils'

export interface AuthBenefit {
  icon: LucideIcon
  title: string
  text: string
}

const DEFAULT_BENEFITS: readonly AuthBenefit[] = [
  {
    icon: Bell,
    title: 'Price alerts',
    text: 'Get notified when tickets drop for the matches you follow.',
  },
  {
    icon: Ticket,
    title: 'Compare partner offers',
    text: 'See prices from trusted partners side by side.',
  },
  {
    icon: ShieldCheck,
    title: 'Verified sellers',
    text: 'Every listing comes from a vetted ticket partner.',
  },
]

export interface AuthShellProps {
  eyebrow?: string
  title: string
  subtitle?: ReactNode
  children: ReactNode
  /** Rendered below the form card content (e.g. "Already have an account?"). */
  footer?: ReactNode
  panelTitle?: ReactNode
  panelText?: string
  benefits?: readonly AuthBenefit[]
  /** Change this to replay the form entrance animation (e.g. step changes). */
  revealKey?: string
  className?: string
}

function WavyEdge() {
  return (
    <svg
      className="pointer-events-none absolute -right-px top-0 hidden h-full w-8 text-surface lg:block"
      viewBox="0 0 32 800"
      preserveAspectRatio="none"
      aria-hidden
    >
      {/* White area to the right of the wave, carving the panel's edge */}
      <path
        fill="currentColor"
        d="M32,0 L0,0 L0,40 C24,80 24,120 0,160 C24,200 24,240 0,280 C24,320 24,360 0,400 C24,440 24,480 0,520 C24,560 24,600 0,640 C24,680 24,720 0,760 L0,800 L32,800 Z"
      />
    </svg>
  )
}

/**
 * Standalone split-screen layout for the auth pages (rendered outside the
 * main Layout, so no navbar/footer).
 */
export function AuthShell({
  eyebrow,
  title,
  subtitle,
  children,
  footer,
  panelTitle = (
    <>
      Your seat at the
      <br />
      biggest matches
    </>
  ),
  panelText = 'Create a free account to track prices, compare offers and manage your bookings in one place.',
  benefits = DEFAULT_BENEFITS,
  revealKey = 'default',
  className,
}: AuthShellProps) {
  const panelRef = useRef<HTMLElement | null>(null)
  const formAreaRef = useRef<HTMLDivElement | null>(null)

  useGSAP(
    () => {
      const panel = panelRef.current
      if (!panel || prefersReducedMotion()) return
      const items = panel.querySelectorAll('[data-panel-item]')
      if (items.length === 0) return
      gsap.fromTo(
        items,
        { opacity: 0, y: 16 },
        {
          opacity: 1,
          y: 0,
          duration: MOTION.duration.fast,
          stagger: 0.08,
          delay: 0.1,
          ease: MOTION.ease.out,
          clearProps: 'opacity,transform',
        },
      )
    },
    { scope: panelRef },
  )

  useGSAP(
    () => {
      const area = formAreaRef.current
      if (!area || prefersReducedMotion()) return
      const items = area.querySelectorAll('[data-auth-reveal]')
      if (items.length === 0) return
      gsap.fromTo(
        items,
        { opacity: 0, y: 14 },
        {
          opacity: 1,
          y: 0,
          duration: MOTION.duration.fast,
          stagger: 0.06,
          ease: MOTION.ease.out,
          clearProps: 'opacity,transform',
        },
      )
    },
    { scope: formAreaRef, dependencies: [revealKey] },
  )

  return (
    <div
      className={cn(
        'min-h-screen bg-surface font-sans text-ink lg:grid lg:grid-cols-[minmax(22rem,30rem)_1fr]',
        className,
      )}
    >
      <aside
        ref={panelRef}
        className="relative hidden flex-col gradient-maroon px-10 py-10 text-white lg:flex"
        aria-label="About FootballTicketClub"
      >
        <WavyEdge />
        <div data-panel-item className="relative z-[1]">
          <Logo variant="light" />
          <div className="mt-4 h-1 w-10 rounded-full bg-brand" />
        </div>
        <h2
          data-panel-item
          className="relative z-[1] mt-6 text-balance text-3xl font-extrabold leading-tight tracking-tight"
        >
          {panelTitle}
        </h2>
        <p
          data-panel-item
          className="relative z-[1] mt-3 max-w-sm text-sm leading-relaxed text-white/80"
        >
          {panelText}
        </p>
        <ul className="relative z-[1] mt-8 flex flex-col gap-5">
          {benefits.map(({ icon: Icon, title: benefitTitle, text }) => (
            <li key={benefitTitle} data-panel-item className="flex gap-3">
              <span
                className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-brand text-white"
                aria-hidden
              >
                <Icon className="size-5" />
              </span>
              <span>
                <span className="block text-sm font-semibold leading-tight">
                  {benefitTitle}
                </span>
                <span className="mt-0.5 block text-sm text-white/70">{text}</span>
              </span>
            </li>
          ))}
        </ul>
        <p
          data-panel-item
          className="relative z-[1] mt-auto flex items-center gap-2 pt-10 text-xs text-white/65"
        >
          <ShieldCheck className="size-4 shrink-0" aria-hidden />
          Your details stay private. We never sell your data.
        </p>
      </aside>

      <main className="flex min-h-screen flex-col lg:min-h-0">
        <header className="flex items-center justify-between gap-4 px-5 py-4 sm:px-8 sm:py-5">
          <Logo variant="dark" className="lg:invisible lg:pointer-events-none" />
          <Link
            to="/"
            className="inline-flex items-center gap-1.5 rounded-full px-3 py-2 text-sm font-medium text-muted transition-colors hover:bg-surface-muted hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand"
          >
            <ArrowLeft className="size-4" aria-hidden />
            Back to home
          </Link>
        </header>

        <div
          ref={formAreaRef}
          className="flex flex-1 items-center justify-center px-5 pb-12 pt-2 sm:px-8"
        >
          <div className="w-full max-w-md">
            <div className="mb-7">
              {eyebrow ? (
                <p data-auth-reveal className="eyebrow text-brand">
                  {eyebrow}
                </p>
              ) : null}
              <h1
                data-auth-reveal
                className="mt-1.5 text-balance text-3xl font-extrabold leading-tight tracking-tight text-ink"
              >
                {title}
              </h1>
              {subtitle ? (
                <div
                  data-auth-reveal
                  className="mt-2.5 text-sm leading-relaxed text-muted"
                >
                  {subtitle}
                </div>
              ) : null}
            </div>

            {children}

            {footer ? (
              <div
                data-auth-reveal
                className="mt-7 text-center text-sm text-muted"
              >
                {footer}
              </div>
            ) : null}
          </div>
        </div>
      </main>
    </div>
  )
}
