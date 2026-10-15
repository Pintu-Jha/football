import type { CurrencyCode } from '@/store/uiStore'

const localeByCurrency: Record<CurrencyCode, string> = {
  USD: 'en-US',
  EUR: 'en-GB',
  GBP: 'en-GB',
}

/**
 * All mock prices in /src/data are stored in EUR (the base currency).
 * Replace with live rates from the API when available.
 */
export const BASE_CURRENCY: CurrencyCode = 'EUR'

export const exchangeRates: Record<CurrencyCode, number> = {
  EUR: 1,
  USD: 1.08,
  GBP: 0.85,
}

export function convertFromBase(amountEur: number, currency: CurrencyCode): number {
  return Math.round(amountEur * exchangeRates[currency] * 100) / 100
}

/** Formats an amount that is expressed in the base currency (EUR) into `currency`. */
export function formatPrice(
  amountEur: number,
  currency: CurrencyCode,
  options?: Intl.NumberFormatOptions,
): string {
  const converted = convertFromBase(amountEur, currency)
  return new Intl.NumberFormat(localeByCurrency[currency], {
    style: 'currency',
    currency,
    minimumFractionDigits: converted % 1 === 0 ? 0 : 2,
    maximumFractionDigits: 2,
    ...options,
  }).format(converted)
}

/** Design format: "€270 EUR" */
export function formatPriceWithCode(
  amountEur: number,
  currency: CurrencyCode,
): string {
  return `${formatPrice(amountEur, currency)} ${currency}`
}

export function formatPriceFrom(
  amount: number,
  currency: CurrencyCode,
): string {
  return `From ${formatPrice(amount, currency)}`
}

/** Partner listing prices in the design are always euro with two decimals. */
export function formatEuro(amount: number): string {
  return new Intl.NumberFormat('en-GB', {
    style: 'currency',
    currency: 'EUR',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount)
}

export function formatEuroFrom(amount: number): string {
  return `From ${formatEuro(amount)}`
}

/** “Sat, 26 Apr 2025 · 15:00” listing format from the match-page design. */
export function formatListingDate(iso: string): { full: string; time: string } {
  const date = new Date(iso)
  return {
    full: date.toLocaleString('en-GB', {
      weekday: 'short',
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    }),
    time: date.toLocaleString('en-GB', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    }),
  }
}

export function formatMatchDate(iso: string): {
  month: string
  day: string
  weekday: string
  full: string
  time: string
} {
  const date = new Date(iso)
  return {
    month: date.toLocaleString('en-US', { month: 'short' }).toUpperCase(),
    day: date.toLocaleString('en-US', { day: '2-digit' }),
    weekday: date.toLocaleString('en-US', { weekday: 'short' }),
    full: date.toLocaleString('en-US', {
      weekday: 'short',
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    }),
    time: date.toLocaleString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    }),
  }
}
