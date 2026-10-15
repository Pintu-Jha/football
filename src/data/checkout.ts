import { getMatchBySlug } from './matches'
import { southamptonPartnerOffers } from './partners'
import { getSeatCategory, getStadiumTicket, getZone } from './stadium'
import type { Match } from './types'

export type CheckoutSource = 'stadium' | 'partner'

export interface CheckoutItem {
  match: Match
  ticketId: string
  source: CheckoutSource
  /** Product name, e.g. "Tribune Niveau 1" */
  title: string
  /** Secondary line, e.g. section / category */
  section: string
  /** Unit price in EUR (base currency) */
  unitPrice: number
  available: number
  maxQuantity: number
  eTicket: boolean
  partnerName?: string
  categoryLabel?: string
  categoryColor?: string
}

/** Max tickets per order */
export const MAX_TICKETS_PER_ORDER = 8
/** Service fee as a share of the subtotal */
export const SERVICE_FEE_RATE = 0.1
/** Minutes a selection is held during checkout */
export const HOLD_MINUTES = 10

export interface OrderTotals {
  subtotal: number
  serviceFee: number
  total: number
}

export function computeTotals(unitPrice: number, quantity: number): OrderTotals {
  const subtotal = Math.round(unitPrice * quantity * 100) / 100
  const serviceFee = Math.round(subtotal * SERVICE_FEE_RATE * 100) / 100
  return {
    subtotal,
    serviceFee,
    total: Math.round((subtotal + serviceFee) * 100) / 100,
  }
}

export function resolveCheckoutItem(
  slug: string,
  ticketId: string,
  source: CheckoutSource,
): CheckoutItem | null {
  const match = getMatchBySlug(slug)
  if (!match) return null

  if (source === 'stadium') {
    const ticket = getStadiumTicket(ticketId)
    if (!ticket) return null
    const zone = getZone(ticket.zoneId)
    const category = zone ? getSeatCategory(zone.categoryId) : undefined
    return {
      match,
      ticketId: ticket.id,
      source,
      title: ticket.tierName,
      section: zone?.name ?? 'General admission',
      unitPrice: ticket.price,
      available: ticket.available,
      maxQuantity: Math.min(ticket.available, MAX_TICKETS_PER_ORDER),
      eTicket: ticket.eTicket,
      categoryLabel: category?.label,
      categoryColor: category?.color,
    }
  }

  const offer = southamptonPartnerOffers.find((o) => o.id === ticketId)
  if (!offer || match.pageType !== 'partners') return null
  return {
    match,
    ticketId: offer.id,
    source,
    title: offer.ticketType,
    section: offer.section,
    unitPrice: offer.price,
    available: offer.available,
    maxQuantity: Math.min(offer.available, MAX_TICKETS_PER_ORDER),
    eTicket: /e-ticket|mobile/i.test(offer.ticketType),
    partnerName: offer.partnerName,
  }
}

export function buildCheckoutPath(
  slug: string,
  ticketId: string,
  source: CheckoutSource,
  quantity?: number,
): string {
  const params = new URLSearchParams({ ticket: ticketId, source })
  if (quantity) params.set('qty', String(quantity))
  return `/checkout/${slug}?${params.toString()}`
}

/** Seat map page — shown after “View tickets”, before checkout. */
export function buildTicketsPath(slug: string): string {
  return `/match/${slug}/tickets`
}
