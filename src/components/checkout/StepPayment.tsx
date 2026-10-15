import * as LabelPrimitive from '@radix-ui/react-label'
import { useGSAP } from '@gsap/react'
import {
  AlertCircle,
  CreditCard,
  Info,
  Loader2,
  Lock,
  type LucideIcon,
  ShieldCheck,
  Smartphone,
  Wallet,
} from 'lucide-react'
import {
  type FormEvent,
  useEffect,
  useId,
  useRef,
  useState,
} from 'react'

import {
  CARD_BRAND_LABEL,
  cvcLength,
  detectCardBrand,
  digitsOnly,
  formatCardNumber,
  formatExpiry,
} from '@/components/checkout/cardUtils'
import { FormField } from '@/components/checkout/FormField'
import type {
  PaidPayment,
  PaymentFormState,
} from '@/components/checkout/types'
import {
  validateCardName,
  validateCardNumber,
  validateCvc,
  validateExpiry,
} from '@/components/checkout/validation'
import { Button } from '@/components/ui/Button'
import { Checkbox } from '@/components/ui/Checkbox'
import { formatPrice } from '@/lib/format'
import { gsap, prefersReducedMotion } from '@/lib/gsap'
import { cn } from '@/lib/utils'
import type { PaymentMethod } from '@/store/bookingStore'
import type { CurrencyCode } from '@/store/uiStore'

const PROCESSING_MS = 1800
const DECLINE_SUFFIX = '0002'
const DECLINE_MESSAGE =
  'Your card was declined. Try another payment method.'

const METHOD_OPTIONS: ReadonlyArray<{
  value: PaymentMethod
  label: string
  description: string
  Icon: LucideIcon
}> = [
  {
    value: 'card',
    label: 'Card',
    description: 'Credit or debit',
    Icon: CreditCard,
  },
  {
    value: 'paypal',
    label: 'PayPal',
    description: 'Pay with your account',
    Icon: Wallet,
  },
  {
    value: 'applepay',
    label: 'Apple Pay',
    description: 'Pay on your device',
    Icon: Smartphone,
  },
]

type FieldKey = 'cardNumber' | 'expiry' | 'cvc' | 'cardName' | 'terms'
const FIELD_ORDER: FieldKey[] = [
  'cardNumber',
  'expiry',
  'cvc',
  'cardName',
  'terms',
]

export interface StepPaymentProps {
  payment: PaymentFormState
  onChange: (patch: Partial<PaymentFormState>) => void
  /** Order total in EUR (shown in the selected currency). */
  totalEur: number
  currency: CurrencyCode
  /** Blocks paying (e.g. reservation expired). */
  disabled?: boolean
  onBack: () => void
  onPaid: (payment: PaidPayment) => void
}

export function StepPayment({
  payment,
  onChange,
  totalEur,
  currency,
  disabled = false,
  onBack,
  onPaid,
}: StepPaymentProps) {
  const baseId = useId()
  const idFor = (key: FieldKey) => `${baseId}-${key}`
  const methodLabelId = `${baseId}-method`
  const termsErrorId = `${baseId}-terms-error`

  const [touched, setTouched] = useState<Partial<Record<FieldKey, boolean>>>(
    {},
  )
  const [processing, setProcessing] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [shakeKey, setShakeKey] = useState(0)

  const processingRef = useRef(false)
  const timerRef = useRef<number | null>(null)
  const alertRef = useRef<HTMLDivElement>(null)
  const onPaidRef = useRef(onPaid)
  const disabledRef = useRef(disabled)

  useEffect(() => {
    onPaidRef.current = onPaid
    disabledRef.current = disabled
  })

  useEffect(
    () => () => {
      if (timerRef.current !== null) window.clearTimeout(timerRef.current)
    },
    [],
  )

  useGSAP(
    () => {
      const el = alertRef.current
      if (!el || shakeKey === 0 || prefersReducedMotion()) return
      gsap.fromTo(
        el,
        { x: -10 },
        {
          x: 0,
          duration: 0.55,
          ease: 'elastic.out(1, 0.3)',
          clearProps: 'transform',
        },
      )
    },
    { dependencies: [shakeKey] },
  )

  const isCard = payment.method === 'card'
  const brand = detectCardBrand(payment.cardNumber)

  const errors: Partial<Record<FieldKey, string>> = {}
  if (isCard) {
    const cardNumber = validateCardNumber(payment.cardNumber)
    const expiry = validateExpiry(payment.expiry)
    const cvc = validateCvc(payment.cvc, brand)
    const cardName = validateCardName(payment.cardName)
    if (cardNumber) errors.cardNumber = cardNumber
    if (expiry) errors.expiry = expiry
    if (cvc) errors.cvc = cvc
    if (cardName) errors.cardName = cardName
  }
  if (!payment.acceptedTerms) {
    errors.terms = 'Please accept the terms to continue.'
  }

  const visibleError = (key: FieldKey): string | undefined =>
    touched[key] ? errors[key] : undefined
  const touch = (key: FieldKey) =>
    setTouched((t) => (t[key] ? t : { ...t, [key]: true }))

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (processingRef.current || disabled) return

    setTouched({
      cardNumber: true,
      expiry: true,
      cvc: true,
      cardName: true,
      terms: true,
    })
    const firstInvalid = FIELD_ORDER.find((key) => errors[key])
    if (firstInvalid) {
      document.getElementById(idFor(firstInvalid))?.focus()
      return
    }

    processingRef.current = true
    setProcessing(true)
    setSubmitError(null)

    const method = payment.method
    const digits = digitsOnly(payment.cardNumber)
    const cardBrand = detectCardBrand(digits)

    timerRef.current = window.setTimeout(() => {
      timerRef.current = null

      if (disabledRef.current) {
        processingRef.current = false
        setProcessing(false)
        return
      }

      if (method === 'card' && digits.endsWith(DECLINE_SUFFIX)) {
        processingRef.current = false
        setProcessing(false)
        setSubmitError(DECLINE_MESSAGE)
        setShakeKey((k) => k + 1)
        return
      }

      // Only brand + last four ever leave this component.
      onPaidRef.current(
        method === 'card'
          ? {
              method,
              last4: digits.slice(-4),
              ...(cardBrand ? { brand: CARD_BRAND_LABEL[cardBrand] } : {}),
            }
          : { method },
      )
    }, PROCESSING_MS)
  }

  const methodLabel =
    METHOD_OPTIONS.find((o) => o.value === payment.method)?.label ?? 'Card'
  const termsError = visibleError('terms')

  return (
    <form
      onSubmit={handleSubmit}
      noValidate
      className="space-y-5"
      aria-label="Payment"
    >
      {/* Payment method */}
      <section className="rounded-xl border border-border bg-surface p-5 shadow-soft sm:p-6">
        <h2 id={methodLabelId} className="text-base font-bold text-ink">
          Payment method
        </h2>
        <div
          role="radiogroup"
          aria-labelledby={methodLabelId}
          className="mt-4 grid gap-3 sm:grid-cols-3"
        >
          {METHOD_OPTIONS.map(({ value, label, description, Icon }) => (
            <label
              key={value}
              className={cn(
                'relative flex cursor-pointer items-center gap-3 rounded-lg border bg-surface p-3.5 transition-colors duration-fast',
                'has-checked:border-brand has-checked:bg-brand-soft/40',
                'has-focus-visible:ring-2 has-focus-visible:ring-brand has-focus-visible:ring-offset-2',
                'border-border-strong hover:border-ink/40',
                processing && 'cursor-not-allowed opacity-60',
              )}
            >
              <input
                type="radio"
                name={`${baseId}-method`}
                value={value}
                checked={payment.method === value}
                disabled={processing}
                onChange={() => {
                  setSubmitError(null)
                  onChange({ method: value })
                }}
                className="peer sr-only"
              />
              <span
                aria-hidden
                className="flex size-9 shrink-0 items-center justify-center rounded-full bg-surface-subtle text-ink peer-checked:bg-brand peer-checked:text-white"
              >
                <Icon className="size-4" />
              </span>
              <span className="min-w-0">
                <span className="block text-sm font-bold text-ink">
                  {label}
                </span>
                <span className="block truncate text-xs text-muted">
                  {description}
                </span>
              </span>
            </label>
          ))}
        </div>
      </section>

      {/* Method details */}
      {isCard ? (
        <section
          aria-label="Card details"
          className="space-y-5 rounded-xl border border-border bg-surface p-5 shadow-soft sm:p-6"
        >
          <FormField
            id={idFor('cardNumber')}
            label="Card number"
            required
            autoComplete="cc-number"
            inputMode="numeric"
            spellCheck={false}
            placeholder="1234 5678 9012 3456"
            value={payment.cardNumber}
            disabled={processing}
            onChange={(e) =>
              onChange({ cardNumber: formatCardNumber(e.target.value) })
            }
            onBlur={() => touch('cardNumber')}
            error={visibleError('cardNumber')}
            trailing={
              brand ? (
                <span className="rounded bg-surface-subtle px-2 py-0.5 text-xs font-bold text-ink">
                  {CARD_BRAND_LABEL[brand]}
                </span>
              ) : null
            }
          />
          <div className="grid grid-cols-2 gap-4">
            <FormField
              id={idFor('expiry')}
              label="Expiry (MM/YY)"
              required
              autoComplete="cc-exp"
              inputMode="numeric"
              spellCheck={false}
              placeholder="MM/YY"
              maxLength={5}
              value={payment.expiry}
              disabled={processing}
              onChange={(e) =>
                onChange({ expiry: formatExpiry(e.target.value, payment.expiry) })
              }
              onBlur={() => touch('expiry')}
              error={visibleError('expiry')}
            />
            <FormField
              id={idFor('cvc')}
              label={brand === 'amex' ? 'Security code (4 digits)' : 'CVC'}
              required
              autoComplete="cc-csc"
              inputMode="numeric"
              spellCheck={false}
              placeholder={'•'.repeat(cvcLength(brand))}
              maxLength={4}
              value={payment.cvc}
              disabled={processing}
              onChange={(e) =>
                onChange({ cvc: digitsOnly(e.target.value).slice(0, 4) })
              }
              onBlur={() => touch('cvc')}
              error={visibleError('cvc')}
            />
          </div>
          <FormField
            id={idFor('cardName')}
            label="Name on card"
            required
            autoComplete="cc-name"
            value={payment.cardName}
            disabled={processing}
            onChange={(e) => onChange({ cardName: e.target.value })}
            onBlur={() => touch('cardName')}
            error={visibleError('cardName')}
          />
        </section>
      ) : (
        <section className="flex items-start gap-3 rounded-xl border border-border bg-surface-muted p-5">
          <Info className="mt-0.5 size-5 shrink-0 text-ink" aria-hidden />
          <p className="text-sm text-muted">
            <span className="font-semibold text-ink">{methodLabel}:</span> You
            will confirm the payment in a secure window (demo).
          </p>
        </section>
      )}

      {/* Terms */}
      <section className="rounded-xl border border-border bg-surface p-5 shadow-soft sm:p-6">
        <div className="flex items-start gap-3">
          <Checkbox
            id={idFor('terms')}
            checked={payment.acceptedTerms}
            disabled={processing}
            onCheckedChange={(checked) => {
              touch('terms')
              onChange({ acceptedTerms: checked === true })
            }}
            aria-required
            aria-invalid={termsError ? true : undefined}
            aria-describedby={termsError ? termsErrorId : undefined}
            className="mt-0.5"
          />
          <LabelPrimitive.Root
            htmlFor={idFor('terms')}
            className="text-sm leading-relaxed text-muted"
          >
            I agree to the{' '}
            <strong className="font-semibold text-ink">Terms of Use</strong> and{' '}
            <strong className="font-semibold text-ink">Privacy Policy</strong>.
            I understand FootballTicketClub is an independent comparison
            marketplace and that this is a demo checkout.
          </LabelPrimitive.Root>
        </div>
        {termsError ? (
          <p
            id={termsErrorId}
            role="alert"
            className="mt-2 flex items-start gap-1.5 pl-8 text-xs font-medium text-brand-hover"
          >
            <AlertCircle className="mt-px size-3.5 shrink-0" aria-hidden />
            {termsError}
          </p>
        ) : null}
      </section>

      {submitError ? (
        <div
          ref={alertRef}
          role="alert"
          className="flex items-start gap-3 rounded-xl border border-brand-hover/30 bg-brand-soft p-4 text-sm font-semibold text-brand-hover"
        >
          <AlertCircle className="mt-0.5 size-5 shrink-0" aria-hidden />
          {submitError}
        </div>
      ) : null}

      <div className="space-y-3">
        <div className="flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-between">
          <Button
            variant="secondary"
            size="lg"
            onClick={onBack}
            disabled={processing}
          >
            Back
          </Button>
          <Button
            type="submit"
            size="lg"
            disabled={processing || disabled}
            aria-busy={processing}
            className="sm:min-w-56"
          >
            {processing ? (
              <>
                <Loader2 className="size-4 animate-spin" aria-hidden />
                Processing payment…
              </>
            ) : (
              <>
                <Lock className="size-4" aria-hidden />
                Pay {formatPrice(totalEur, currency)}
              </>
            )}
          </Button>
        </div>
        <p role="status" className="sr-only">
          {processing ? 'Processing your payment' : ''}
        </p>

        <p className="flex items-start justify-center gap-2 text-center text-xs text-muted sm:justify-end sm:text-right">
          <ShieldCheck className="mt-px size-4 shrink-0 text-success" aria-hidden />
          Demo checkout — no real payment is taken. Use 4242 4242 4242 4242.
        </p>
      </div>
    </form>
  )
}
