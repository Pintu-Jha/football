import { useGSAP } from '@gsap/react'
import * as Dialog from '@radix-ui/react-dialog'
import {
  Bell,
  Calendar,
  FileText,
  Globe,
  Lock,
  Mail,
  Percent,
  Shield,
  Trophy,
  User,
  X,
} from 'lucide-react'
import {
  type FormEvent,
  useCallback,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
} from 'react'

import { Logo } from '@/components/layout/Logo'
import { Button } from '@/components/ui/Button'
import { Checkbox } from '@/components/ui/Checkbox'
import {
  newsletterEuropean,
  newsletterOther,
  newsletterTeams,
} from '@/data/home'
import { gsap, prefersReducedMotion } from '@/lib/gsap'
import { MOTION } from '@/lib/motion'
import { cn } from '@/lib/utils'
import { useUiStore } from '@/store/uiStore'

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

const BENEFITS = [
  {
    icon: Bell,
    title: 'Match & price alerts',
    text: 'Know when tickets drop or prices change for your teams.',
  },
  {
    icon: Percent,
    title: 'Exclusive offers',
    text: 'Early access to deals from verified partners.',
  },
  {
    icon: Calendar,
    title: 'Fixture reminders',
    text: 'Never miss a big Premier League weekend.',
  },
  {
    icon: FileText,
    title: 'Travel guides',
    text: 'Stadium tips, transport, and match-day planning.',
  },
] as const

function WavyEdge() {
  return (
    <svg
      className="pointer-events-none absolute -right-px top-0 hidden h-full w-8 text-maroon-deep md:block"
      viewBox="0 0 32 800"
      preserveAspectRatio="none"
      aria-hidden
    >
      <path
        fill="currentColor"
        d="M0,0 L32,0 L32,40 C8,80 8,120 32,160 C8,200 8,240 32,280 C8,320 8,360 32,400 C8,440 8,480 32,520 C8,560 8,600 32,640 C8,680 8,720 32,760 L32,800 L0,800 Z"
      />
    </svg>
  )
}

function SuccessCheckIcon() {
  const svgRef = useRef<SVGSVGElement | null>(null)

  useGSAP(
    () => {
      const svg = svgRef.current
      if (!svg || prefersReducedMotion()) {
        return
      }
      const circle = svg.querySelector('[data-success-ring]')
      const tick = svg.querySelector('[data-success-tick]')
      gsap.fromTo(
        svg,
        { scale: 0.8, opacity: 0 },
        {
          scale: 1,
          opacity: 1,
          duration: MOTION.duration.fast,
          ease: MOTION.ease.out,
        },
      )
      if (circle) {
        gsap.fromTo(
          circle,
          { strokeDashoffset: 226 },
          {
            strokeDashoffset: 0,
            duration: MOTION.duration.base,
            ease: MOTION.ease.out,
          },
        )
      }
      if (tick) {
        gsap.fromTo(
          tick,
          { opacity: 0, scale: 0.6 },
          {
            opacity: 1,
            scale: 1,
            duration: MOTION.duration.fast,
            delay: 0.2,
            ease: MOTION.ease.out,
            transformOrigin: '50% 50%',
          },
        )
      }
    },
    { scope: svgRef },
  )

  return (
    <svg
      ref={svgRef}
      viewBox="0 0 80 80"
      className="mx-auto size-20 text-success"
      aria-hidden
    >
      <circle
        cx="40"
        cy="40"
        r="36"
        fill="none"
        stroke="currentColor"
        strokeWidth="3"
        className="text-success-soft"
      />
      <circle
        data-success-ring
        cx="40"
        cy="40"
        r="36"
        fill="none"
        stroke="currentColor"
        strokeWidth="3"
        strokeDasharray="226"
        strokeDashoffset="0"
        strokeLinecap="round"
      />
      <path
        data-success-tick
        d="M26 41 L36 51 L54 31"
        fill="none"
        stroke="currentColor"
        strokeWidth="4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

type PreferenceToggleProps = {
  id: string
  icon: typeof Bell
  checked: boolean
  onCheckedChange: (checked: boolean) => void
  title: string
  description: string
}

function PreferenceToggle({
  id,
  icon: Icon,
  checked,
  onCheckedChange,
  title,
  description,
}: PreferenceToggleProps) {
  return (
    <div
      className={cn(
        'flex items-start gap-3 rounded-xl border p-4',
        checked
          ? 'border-brand/30 bg-brand-soft/50'
          : 'border-border bg-surface',
      )}
    >
      <Checkbox
        id={id}
        checked={checked}
        onCheckedChange={(value) => onCheckedChange(value === true)}
        className="mt-0.5 size-5 rounded-md shrink-0"
        onClick={(event) => event.stopPropagation()}
      />
      <Icon className="size-5 text-muted shrink-0 mt-0.5" aria-hidden />
      <label htmlFor={id} className="min-w-0 flex-1 cursor-pointer">
        <span className="block text-sm font-semibold text-ink">{title}</span>
        <span className="mt-0.5 block text-xs text-muted">{description}</span>
      </label>
    </div>
  )
}

type SectionBlockProps = {
  sectionId: string
  icon: typeof Trophy
  heading: string
  subheading?: string
  items: readonly string[]
  selected: Set<string>
  onSelectedChange: (next: Set<string>) => void
  columns?: number
}

function SectionBlock({
  sectionId,
  icon: Icon,
  heading,
  subheading,
  items,
  selected,
  onSelectedChange,
  columns = 1,
}: SectionBlockProps) {
  const allSelected = items.length > 0 && items.every((item) => selected.has(item))
  const someSelected = items.some((item) => selected.has(item))
  const selectAllId = `${sectionId}-select-all`

  const toggleAll = () => {
    if (allSelected) {
      onSelectedChange(new Set())
    } else {
      onSelectedChange(new Set(items))
    }
  }

  const toggleItem = (item: string) => {
    const next = new Set(selected)
    if (next.has(item)) {
      next.delete(item)
    } else {
      next.add(item)
    }
    onSelectedChange(next)
  }

  return (
    <fieldset className="rounded-xl border border-border p-4 space-y-3">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-2.5">
          <Icon className="size-5 text-brand shrink-0 mt-0.5" aria-hidden />
          <div>
            <legend className="text-sm font-bold text-ink">{heading}</legend>
            {subheading && (
              <p className="text-xs text-muted mt-0.5">{subheading}</p>
            )}
          </div>
        </div>
        <label
          htmlFor={selectAllId}
          className="flex cursor-pointer items-center gap-1.5 shrink-0"
        >
          <Checkbox
            id={selectAllId}
            checked={allSelected ? true : someSelected ? 'indeterminate' : false}
            onCheckedChange={toggleAll}
          />
          <span className="text-xs font-medium text-muted">Select All</span>
        </label>
      </div>
      <ul
        className={cn(
          'gap-y-1 gap-x-2',
          columns === 4 && 'grid grid-cols-2 sm:grid-cols-4',
          columns === 2 && 'grid grid-cols-2',
          columns === 1 && 'flex flex-col',
        )}
      >
        {items.map((item) => {
          const itemId = `${sectionId}-${item.replace(/\s+/g, '-').toLowerCase()}`
          return (
            <li key={item}>
              <label
                htmlFor={itemId}
                className="flex cursor-pointer items-center gap-2 rounded-md py-0.5"
              >
                <Checkbox
                  id={itemId}
                  checked={selected.has(item)}
                  onCheckedChange={() => toggleItem(item)}
                />
                <span className="text-sm text-ink">{item}</span>
              </label>
            </li>
          )
        })}
      </ul>
    </fieldset>
  )
}

function resetFormState() {
  return {
    email: '',
    name: '',
    teams: new Set<string>(),
    european: new Set<string>(),
    other: new Set<string>(),
    matchAlerts: true,
    newsGuides: true,
    success: false,
  }
}

export function NewsletterModal() {
  const newsletterOpen = useUiStore((s) => s.newsletterOpen)
  const closeNewsletter = useUiStore((s) => s.closeNewsletter)
  const formId = useId()
  const overlayRef = useRef<HTMLDivElement | null>(null)
  const contentRef = useRef<HTMLDivElement | null>(null)
  const benefitsRef = useRef<HTMLUListElement | null>(null)

  const [email, setEmail] = useState('')
  const [name, setName] = useState('')
  const [teamsSelected, setTeamsSelected] = useState<Set<string>>(
    () => new Set(),
  )
  const [europeanSelected, setEuropeanSelected] = useState<Set<string>>(
    () => new Set(),
  )
  const [otherSelected, setOtherSelected] = useState<Set<string>>(
    () => new Set(),
  )
  const [matchAlerts, setMatchAlerts] = useState(true)
  const [newsGuides, setNewsGuides] = useState(true)
  const [success, setSuccess] = useState(false)

  const emailValid = useMemo(() => EMAIL_PATTERN.test(email.trim()), [email])

  const handleOpenChange = useCallback(
    (open: boolean) => {
      if (!open) {
        closeNewsletter()
      }
    },
    [closeNewsletter],
  )

  useEffect(() => {
    if (!newsletterOpen) {
      const initial = resetFormState()
      setEmail(initial.email)
      setName(initial.name)
      setTeamsSelected(initial.teams)
      setEuropeanSelected(initial.european)
      setOtherSelected(initial.other)
      setMatchAlerts(initial.matchAlerts)
      setNewsGuides(initial.newsGuides)
      setSuccess(initial.success)
    }
  }, [newsletterOpen])

  useGSAP(
    () => {
      if (!newsletterOpen || prefersReducedMotion()) {
        return
      }

      const overlay = overlayRef.current
      const content = contentRef.current
      const benefits = benefitsRef.current?.querySelectorAll('li')

      if (overlay) {
        gsap.fromTo(
          overlay,
          { opacity: 0 },
          { opacity: 1, duration: MOTION.duration.fast, ease: MOTION.ease.soft },
        )
      }
      if (content) {
        // Opacity + scale only — avoid fighting Tailwind -translate centering.
        gsap.fromTo(
          content,
          { opacity: 0, scale: 0.97 },
          {
            opacity: 1,
            scale: 1,
            duration: MOTION.duration.base,
            ease: MOTION.ease.out,
          },
        )
      }
      if (benefits && benefits.length > 0) {
        gsap.fromTo(
          benefits,
          { opacity: 0, y: 16 },
          {
            opacity: 1,
            y: 0,
            duration: MOTION.duration.fast,
            stagger: 0.07,
            delay: 0.15,
            ease: MOTION.ease.out,
          },
        )
      }
    },
    { dependencies: [newsletterOpen] },
  )

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!emailValid) {
      return
    }
    setSuccess(true)
  }

  return (
    <Dialog.Root open={newsletterOpen} onOpenChange={handleOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay
          ref={overlayRef}
          className="fixed inset-0 z-[80] bg-black/50 backdrop-blur-sm"
        />
        <Dialog.Content
          ref={contentRef}
          className={cn(
            'fixed z-[90] grid overflow-auto bg-surface p-0 shadow-lift outline-none',
            'inset-0 max-h-none w-full max-w-none rounded-none',
            'md:inset-auto md:left-1/2 md:top-1/2 md:max-h-[92vh] md:w-[min(96vw,960px)] md:-translate-x-1/2 md:-translate-y-1/2 md:rounded-2xl',
            'md:grid-cols-[320px_1fr]',
          )}
          aria-describedby={undefined}
        >
          <Dialog.Close asChild>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="absolute right-3 top-3 z-10 rounded-full bg-surface/90 shadow-sm md:right-4 md:top-4"
              aria-label="Close newsletter preferences"
            >
              <X className="size-5" aria-hidden />
            </Button>
          </Dialog.Close>

          <aside className="relative flex min-h-0 flex-col gradient-maroon px-6 py-8 text-white max-md:rounded-none md:rounded-l-2xl md:px-8 md:py-10">
            <WavyEdge />
            <Logo variant="light" className="relative z-[1]" to="/" />
            <div className="relative z-[1] mt-4 h-1 w-10 rounded-full bg-brand" />
            <h2 className="relative z-[1] mt-5 text-balance text-2xl font-extrabold leading-tight tracking-tight">
              Stay Updated<br />on Premier League
            </h2>
            <p className="relative z-[1] mt-3 text-sm leading-relaxed text-white/80">
              Get match schedules, ticket availability, exclusive offers and the latest updates.
            </p>
            <ul
              ref={benefitsRef}
              className="relative z-[1] mt-6 hidden flex-col gap-4 md:flex"
            >
              {BENEFITS.map(({ icon: Icon, title, text }) => (
                <li key={title} className="flex gap-3">
                  <span
                    className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-brand text-white"
                    aria-hidden
                  >
                    <Icon className="size-5" />
                  </span>
                  <span>
                    <span className="block text-sm font-semibold leading-tight">{title}</span>
                    <span className="block text-sm text-white/70">{text}</span>
                  </span>
                </li>
              ))}
            </ul>
            <p className="relative z-[1] mt-auto flex items-center gap-2 pt-8 text-xs text-white/65">
              <Shield className="size-4 shrink-0" aria-hidden />
              No spam. Unsubscribe anytime.
            </p>
          </aside>

          <div className="flex min-h-0 flex-col bg-surface px-5 py-7 pb-6 md:rounded-r-2xl md:px-7 md:py-8">
            {success ? (
              <div className="flex flex-1 flex-col items-center justify-center py-8 text-center">
                <SuccessCheckIcon />
                <Dialog.Title className="mt-6 text-2xl font-extrabold text-ink">
                  You&apos;re subscribed!
                </Dialog.Title>
                <p className="mt-2 max-w-sm text-sm text-muted">
                  We&apos;ll send updates based on your preferences. You can
                  change them anytime from your account emails.
                </p>
                <Dialog.Close asChild>
                  <Button type="button" className="mt-8 min-w-[10rem]">
                    Close
                  </Button>
                </Dialog.Close>
              </div>
            ) : (
              <>
                <p className="eyebrow text-muted">STAY UPDATED</p>
                <Dialog.Title className="mt-1 text-2xl font-extrabold tracking-tight text-ink md:text-[1.65rem]">
                  Premier League{' '}
                  <span className="text-brand">2026–2027 Season</span>
                </Dialog.Title>
                <p className="mt-2 text-sm leading-relaxed text-muted">
                  Select your interests to receive match schedules, ticket availability, exclusive offers
                  and the latest updates from{' '}
                  <strong className="font-bold text-ink">FootballTicketClub</strong>.
                </p>

                <form
                  id={formId}
                  onSubmit={handleSubmit}
                  className="mt-5 flex flex-1 flex-col gap-4"
                >
                  {/* Email + Name side by side */}
                  <div className="grid gap-3 sm:grid-cols-2">
                    <div className="relative">
                      <Mail
                        className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-muted-soft"
                        aria-hidden
                      />
                      <input
                        id={`${formId}-email`}
                        type="email"
                        name="email"
                        required
                        autoComplete="email"
                        value={email}
                        onChange={(event) => setEmail(event.target.value)}
                        placeholder="Your email address (required)"
                        className={cn(
                          'h-11 w-full rounded-lg border bg-surface pl-10 pr-4 text-sm text-ink outline-none placeholder:text-muted-soft',
                          'focus-visible:ring-2 focus-visible:ring-brand',
                          email.length > 0 && !emailValid
                            ? 'border-brand/50'
                            : 'border-border',
                        )}
                      />
                    </div>
                    <div className="relative">
                      <User
                        className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-muted-soft"
                        aria-hidden
                      />
                      <input
                        id={`${formId}-name`}
                        type="text"
                        name="name"
                        autoComplete="name"
                        value={name}
                        onChange={(event) => setName(event.target.value)}
                        placeholder="Your name (optional)"
                        className="h-11 w-full rounded-lg border border-border bg-surface pl-10 pr-4 text-sm text-ink outline-none placeholder:text-muted-soft focus-visible:ring-2 focus-visible:ring-brand"
                      />
                    </div>
                  </div>

                  {/* Premier League Teams */}
                  <SectionBlock
                    sectionId={`${formId}-teams`}
                    icon={Trophy}
                    heading="Premier League Teams"
                    subheading="Select your favourite teams to get updates and offers."
                    items={newsletterTeams}
                    selected={teamsSelected}
                    onSelectedChange={setTeamsSelected}
                    columns={4}
                  />

                  {/* European + Other side by side */}
                  <div className="grid gap-3 sm:grid-cols-2">
                    <SectionBlock
                      sectionId={`${formId}-european`}
                      icon={Trophy}
                      heading="European Competitions"
                      subheading="Select competitions to get updates."
                      items={newsletterEuropean}
                      selected={europeanSelected}
                      onSelectedChange={setEuropeanSelected}
                      columns={1}
                    />
                    <SectionBlock
                      sectionId={`${formId}-other`}
                      icon={Globe}
                      heading="Other Leagues & Tournaments"
                      subheading="Get updates from other competitions."
                      items={newsletterOther}
                      selected={otherSelected}
                      onSelectedChange={setOtherSelected}
                      columns={2}
                    />
                  </div>

                  {/* Preference Toggles */}
                  <div className="grid gap-3 sm:grid-cols-2">
                    <PreferenceToggle
                      id={`${formId}-match-alerts`}
                      icon={Bell}
                      checked={matchAlerts}
                      onCheckedChange={setMatchAlerts}
                      title="Match schedules and price alerts"
                      description="Be the first to know about ticket availability and offers."
                    />
                    <PreferenceToggle
                      id={`${formId}-news-guides`}
                      icon={FileText}
                      checked={newsGuides}
                      onCheckedChange={setNewsGuides}
                      title="News and travel guides"
                      description="Receive latest news, insights and stadium guides."
                    />
                  </div>

                  {/* CTA */}
                  <div className="space-y-2.5 pt-1">
                    <Button
                      type="submit"
                      disabled={!emailValid}
                      className="h-12 w-full rounded-lg text-sm font-bold uppercase tracking-widest"
                    >
                      CONFIRM MY PREFERENCES →
                    </Button>
                    <p className="flex items-center justify-center gap-1.5 text-xs text-muted">
                      <Lock
                        className="size-3 shrink-0 text-muted-soft"
                        aria-hidden
                      />
                      Your information is safe with us. We&apos;ll never spam you and you can unsubscribe anytime.
                    </p>
                  </div>
                </form>
              </>
            )}
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}
