import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'

import type { CheckoutSource } from '@/data/checkout'
import type { CurrencyCode } from '@/store/uiStore'

export type PaymentMethod = 'card' | 'paypal' | 'applepay'

export interface BuyerDetails {
  fullName: string
  email: string
  phone: string
}

export interface Order {
  id: string
  /** Human readable booking reference, e.g. FTC-8K3Q9ZP2 */
  reference: string
  createdAt: string
  /** Owner (signed-in user's email) */
  userEmail: string
  matchSlug: string
  matchLabel: string
  competitionName: string
  venue: string
  city: string
  /** ISO datetime of the match */
  datetime: string
  ticketId: string
  ticketTitle: string
  section: string
  source: CheckoutSource
  partnerName?: string
  quantity: number
  /** All money fields are in EUR (base currency) */
  unitPrice: number
  subtotal: number
  serviceFee: number
  total: number
  /** Currency the buyer was shown at checkout */
  displayCurrency: CurrencyCode
  buyer: BuyerDetails
  payment: {
    method: PaymentMethod
    /** Only the last four digits are ever kept; never the full card number */
    last4?: string
    brand?: string
  }
  status: 'confirmed'
}

interface BookingState {
  orders: Order[]
  addOrder: (order: Order) => void
  getOrder: (id: string) => Order | undefined
  ordersFor: (email: string) => Order[]
}

const REFERENCE_ALPHABET = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'

export function generateBookingReference(): string {
  const bytes = new Uint8Array(8)
  crypto.getRandomValues(bytes)
  const code = Array.from(bytes, (b) => REFERENCE_ALPHABET[b % REFERENCE_ALPHABET.length]).join('')
  return `FTC-${code}`
}

export const useBookingStore = create<BookingState>()(
  persist(
    (set, get) => ({
      orders: [],
      addOrder: (order) => set((state) => ({ orders: [order, ...state.orders] })),
      getOrder: (id) => get().orders.find((o) => o.id === id),
      ordersFor: (email) =>
        get().orders.filter(
          (o) => o.userEmail.toLowerCase() === email.toLowerCase(),
        ),
    }),
    {
      name: 'ftc-bookings',
      storage: createJSONStorage(() => localStorage),
    },
  ),
)
