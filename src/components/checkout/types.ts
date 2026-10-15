import type { BuyerDetails, PaymentMethod } from '@/store/bookingStore'

export type CheckoutStep = 'tickets' | 'details' | 'payment'

export const CHECKOUT_STEPS: ReadonlyArray<{
  key: CheckoutStep
  label: string
}> = [
  { key: 'tickets', label: 'Tickets' },
  { key: 'details', label: 'Your details' },
  { key: 'payment', label: 'Payment' },
]

export const STEP_HEADINGS: Record<CheckoutStep, string> = {
  tickets: 'Choose your tickets',
  details: 'Your details',
  payment: 'Payment',
}

export function parseStep(value: string | null): CheckoutStep {
  return value === 'details' || value === 'payment' ? value : 'tickets'
}

/**
 * In-memory only. The raw card number / CVC are never written to any storage
 * and are dropped as soon as the page unmounts.
 */
export interface PaymentFormState {
  method: PaymentMethod
  cardNumber: string
  expiry: string
  cvc: string
  cardName: string
  acceptedTerms: boolean
}

export interface WizardState {
  quantity: number
  buyer: BuyerDetails
  payment: PaymentFormState
}

export interface PaidPayment {
  method: PaymentMethod
  last4?: string
  brand?: string
}
