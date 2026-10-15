import { useGSAP } from '@gsap/react'
import { SearchX, TicketX } from 'lucide-react'
import {
  useCallback,
  useEffect,
  useMemo,
  useReducer,
  useRef,
} from 'react'
import {
  useNavigate,
  useParams,
  useSearchParams,
} from 'react-router-dom'

import { CheckoutHeader } from '@/components/checkout/CheckoutHeader'
import { CheckoutNotice } from '@/components/checkout/CheckoutNotice'
import { CheckoutStepper } from '@/components/checkout/CheckoutStepper'
import { OrderSummary } from '@/components/checkout/OrderSummary'
import { ReservationExpiredDialog } from '@/components/checkout/ReservationExpiredDialog'
import { StepDetails } from '@/components/checkout/StepDetails'
import { StepPayment } from '@/components/checkout/StepPayment'
import { StepTickets } from '@/components/checkout/StepTickets'
import {
  type CheckoutStep,
  type PaidPayment,
  parseStep,
  STEP_HEADINGS,
  type WizardState,
} from '@/components/checkout/types'
import { useCheckoutHold } from '@/components/checkout/useCheckoutHold'
import { validateBuyer } from '@/components/checkout/validation'
import { Seo } from '@/components/seo/Seo'
import {
  type CheckoutItem,
  type CheckoutSource,
  buildTicketsPath,
  computeTotals,
  resolveCheckoutItem,
} from '@/data/checkout'
import { getLenis } from '@/hooks/useLenis'
import { useRouteScrollReset } from '@/hooks/useRouteScrollReset'
import { gsap, prefersReducedMotion } from '@/lib/gsap'
import { MOTION } from '@/lib/motion'
import { useAuthStore } from '@/store/authStore'
import {
  type BuyerDetails,
  generateBookingReference,
  type Order,
  useBookingStore,
} from '@/store/bookingStore'
import { useUiStore } from '@/store/uiStore'

/* ---------- wizard state ---------- */

type WizardAction =
  | { type: 'setQuantity'; quantity: number }
  | { type: 'setBuyer'; patch: Partial<BuyerDetails> }
  | { type: 'setPayment'; patch: Partial<WizardState['payment']> }

function wizardReducer(state: WizardState, action: WizardAction): WizardState {
  switch (action.type) {
    case 'setQuantity':
      return { ...state, quantity: action.quantity }
    case 'setBuyer':
      return { ...state, buyer: { ...state.buyer, ...action.patch } }
    case 'setPayment':
      return { ...state, payment: { ...state.payment, ...action.patch } }
  }
}

function clampQuantity(value: number, max: number): number {
  if (!Number.isFinite(value)) return 1
  return Math.min(Math.max(Math.trunc(value), 1), Math.max(max, 1))
}

function isCheckoutSource(value: string | null): value is CheckoutSource {
  return value === 'stadium' || value === 'partner'
}

function scrollToTop(): void {
  const lenis = getLenis()
  if (lenis) {
    lenis.scrollTo(0, { immediate: true })
  } else {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' })
  }
}

/* ---------- page ---------- */

export function CheckoutPage() {
  useRouteScrollReset()

  const { slug = '' } = useParams()
  const [searchParams] = useSearchParams()
  const ticketId = searchParams.get('ticket') ?? ''
  const sourceParam = searchParams.get('source')

  const item = useMemo(
    () =>
      isCheckoutSource(sourceParam)
        ? resolveCheckoutItem(slug, ticketId, sourceParam)
        : null,
    [slug, ticketId, sourceParam],
  )

  if (!item) {
    return (
      <>
        <Seo
          title="Checkout unavailable | FootballTicketClub"
          description="We couldn't find the tickets you were trying to book."
        />
        <CheckoutNotice
          icon={SearchX}
          title="We couldn't find those tickets"
          message="The link may be out of date or the tickets are no longer listed. Head back to the home page to find your match."
          actionLabel="Back to Home"
          actionTo="/"
        />
      </>
    )
  }

  if (item.maxQuantity < 1) {
    return (
      <>
        <Seo
          title="Sold out | FootballTicketClub"
          description="These tickets are no longer available."
        />
        <CheckoutNotice
          icon={TicketX}
          title="These tickets just sold out"
          message="Someone else grabbed the last ones. Pick another option for this match."
          actionLabel="Back to tickets"
          actionTo={buildTicketsPath(item.match.slug)}
        />
      </>
    )
  }

  return <CheckoutFlow key={`${item.match.slug}:${item.ticketId}`} item={item} />
}

/* ---------- flow ---------- */

function CheckoutFlow({ item }: { item: CheckoutItem }) {
  const navigate = useNavigate()
  const [searchParams, setSearchParams] = useSearchParams()
  const user = useAuthStore((s) => s.user)
  const currency = useUiStore((s) => s.currency)
  const addOrder = useBookingStore((s) => s.addOrder)
  const { match } = item
  const matchLabel = `${match.homeTeam} vs ${match.awayTeam}`

  const hold = useCheckoutHold(match.slug, item.ticketId)

  const [state, dispatch] = useReducer(
    wizardReducer,
    undefined,
    (): WizardState => ({
      quantity: clampQuantity(
        Number(searchParams.get('qty') ?? 1),
        item.maxQuantity,
      ),
      buyer: {
        fullName: user?.name ?? '',
        email: user?.email ?? '',
        phone: '',
      },
      payment: {
        method: 'card',
        cardNumber: '',
        expiry: '',
        cvc: '',
        cardName: '',
        acceptedTerms: false,
      },
    }),
  )

  /* --- step (lives in the URL) --- */
  const requestedStep = parseStep(searchParams.get('step'))
  const detailsValid = Object.keys(validateBuyer(state.buyer)).length === 0
  // Deep-linking / refreshing into a later step falls back to the first incomplete one.
  const step: CheckoutStep =
    requestedStep === 'payment' && !detailsValid ? 'details' : requestedStep

  const writeStep = useCallback(
    (next: CheckoutStep, replace: boolean) => {
      setSearchParams(
        (prev) => {
          const params = new URLSearchParams(prev)
          if (next === 'tickets') params.delete('step')
          else params.set('step', next)
          return params
        },
        { replace },
      )
    },
    [setSearchParams],
  )

  useEffect(() => {
    if (step !== requestedStep) writeStep(step, true)
  }, [step, requestedStep, writeStep])

  const goToStep = (next: CheckoutStep) => writeStep(next, false)

  const handleQuantityChange = (quantity: number) => {
    const next = clampQuantity(quantity, item.maxQuantity)
    dispatch({ type: 'setQuantity', quantity: next })
    // Keep the URL in sync (without adding history entries) so a refresh keeps the choice.
    setSearchParams(
      (prev) => {
        const params = new URLSearchParams(prev)
        params.set('qty', String(next))
        return params
      },
      { replace: true },
    )
  }

  /* --- focus + scroll on step change --- */
  const headingRef = useRef<HTMLHeadingElement>(null)
  const panelRef = useRef<HTMLDivElement>(null)
  const firstStepRender = useRef(true)

  useEffect(() => {
    if (firstStepRender.current) {
      firstStepRender.current = false
      return
    }
    scrollToTop()
    headingRef.current?.focus({ preventScroll: true })
  }, [step])

  useGSAP(
    () => {
      const el = panelRef.current
      if (!el || prefersReducedMotion()) return
      gsap.fromTo(
        el,
        { opacity: 0, y: 16 },
        {
          opacity: 1,
          y: 0,
          duration: MOTION.duration.base,
          ease: MOTION.ease.out,
          clearProps: 'transform,opacity',
        },
      )
    },
    { dependencies: [step] },
  )

  /* --- payment success --- */
  const handlePaid = (paid: PaidPayment) => {
    if (hold.expired) return
    const totals = computeTotals(item.unitPrice, state.quantity)
    const order: Order = {
      id: crypto.randomUUID(),
      reference: generateBookingReference(),
      createdAt: new Date().toISOString(),
      userEmail: user?.email ?? state.buyer.email.trim(),
      matchSlug: match.slug,
      matchLabel,
      competitionName: match.competitionName,
      venue: match.venue,
      city: match.city,
      datetime: match.datetime,
      ticketId: item.ticketId,
      ticketTitle: item.title,
      section: item.section,
      source: item.source,
      ...(item.partnerName ? { partnerName: item.partnerName } : {}),
      quantity: state.quantity,
      unitPrice: item.unitPrice,
      subtotal: totals.subtotal,
      serviceFee: totals.serviceFee,
      total: totals.total,
      displayCurrency: currency,
      buyer: {
        fullName: state.buyer.fullName.trim(),
        email: state.buyer.email.trim(),
        phone: state.buyer.phone.trim(),
      },
      payment: {
        method: paid.method,
        ...(paid.last4 ? { last4: paid.last4 } : {}),
        ...(paid.brand ? { brand: paid.brand } : {}),
      },
      status: 'confirmed',
    }
    addOrder(order)
    hold.clear()
    navigate(`/booking/confirmation/${order.id}`, { replace: true })
  }

  const handleStartAgain = () => {
    hold.clear()
    navigate(buildTicketsPath(match.slug), { replace: true })
  }

  const totals = computeTotals(item.unitPrice, state.quantity)

  return (
    <div className="min-h-screen bg-surface-muted text-ink">
      <Seo
        title={`Checkout — ${matchLabel} | FootballTicketClub`}
        description={`Secure demo checkout for ${matchLabel} at ${match.venue}, ${match.city}.`}
      />
      <a href="#checkout-main" className="skip-link">
        Skip to checkout
      </a>
      <CheckoutHeader matchSlug={match.slug} />

      <main
        id="checkout-main"
        tabIndex={-1}
        className="container-ftc py-6 focus-visible:outline-none md:py-10"
      >
        <div className="mx-auto max-w-lg lg:max-w-none">
          <CheckoutStepper current={step} onNavigate={goToStep} />
        </div>

        <div className="mt-8 grid gap-6 lg:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)] lg:items-start lg:gap-10">
          <div>
            <h1
              ref={headingRef}
              tabIndex={-1}
              className="mb-5 text-2xl font-extrabold tracking-tight text-ink focus-visible:outline-none md:text-3xl"
            >
              {STEP_HEADINGS[step]}
            </h1>

            <div ref={panelRef}>
              {step === 'tickets' ? (
                <StepTickets
                  item={item}
                  quantity={state.quantity}
                  currency={currency}
                  onQuantityChange={handleQuantityChange}
                  onContinue={() => goToStep('details')}
                />
              ) : null}
              {step === 'details' ? (
                <StepDetails
                  buyer={state.buyer}
                  onChange={(patch) => dispatch({ type: 'setBuyer', patch })}
                  onBack={() => goToStep('tickets')}
                  onContinue={() => goToStep('payment')}
                />
              ) : null}
              {step === 'payment' ? (
                <StepPayment
                  payment={state.payment}
                  onChange={(patch) => dispatch({ type: 'setPayment', patch })}
                  totalEur={totals.total}
                  currency={currency}
                  disabled={hold.expired}
                  onBack={() => goToStep('details')}
                  onPaid={handlePaid}
                />
              ) : null}
            </div>
          </div>

          <OrderSummary
            item={item}
            quantity={state.quantity}
            currency={currency}
            hold={hold}
            className="order-first lg:order-none lg:sticky lg:top-6"
          />
        </div>
      </main>

      <ReservationExpiredDialog
        open={hold.expired}
        onStartAgain={handleStartAgain}
      />
    </div>
  )
}
