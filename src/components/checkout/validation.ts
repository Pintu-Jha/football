import {
  type CardBrand,
  cvcLength,
  detectCardBrand,
  digitsOnly,
  luhnValid,
  maxCardDigits,
} from '@/components/checkout/cardUtils'
import { isValidEmail } from '@/store/authStore'
import type { BuyerDetails } from '@/store/bookingStore'

/* ---------- Buyer details ---------- */

export type BuyerErrors = Partial<Record<keyof BuyerDetails, string>>

export function validateFullName(value: string): string | undefined {
  const v = value.trim()
  if (!v) return 'Enter your full name.'
  if (v.length < 2) return 'Your name must be at least 2 characters.'
  return undefined
}

export function validateEmail(value: string): string | undefined {
  const v = value.trim()
  if (!v) return 'Enter your email address.'
  if (!isValidEmail(v)) return 'Enter a valid email address.'
  return undefined
}

export function validatePhone(value: string): string | undefined {
  const v = value.trim()
  if (!v) return 'Enter a phone number.'
  const cleaned = v.replace(/[\s\-().]/g, '')
  if (!/^\+?\d{7,15}$/.test(cleaned)) {
    return 'Enter 7–15 digits, optionally starting with +.'
  }
  return undefined
}

export function validateBuyer(buyer: BuyerDetails): BuyerErrors {
  const errors: BuyerErrors = {}
  const fullName = validateFullName(buyer.fullName)
  const email = validateEmail(buyer.email)
  const phone = validatePhone(buyer.phone)
  if (fullName) errors.fullName = fullName
  if (email) errors.email = email
  if (phone) errors.phone = phone
  return errors
}

/* ---------- Card ---------- */

export function validateCardNumber(value: string): string | undefined {
  const digits = digitsOnly(value)
  if (!digits) return 'Enter your card number.'
  const brand = detectCardBrand(digits)
  if (digits.length !== maxCardDigits(brand) || !luhnValid(digits)) {
    return 'Enter a valid card number.'
  }
  return undefined
}

export function validateExpiry(
  value: string,
  now: Date = new Date(),
): string | undefined {
  if (!value) return 'Enter the expiry date.'
  const match = /^(\d{2})\/(\d{2})$/.exec(value)
  if (!match) return 'Enter the expiry as MM/YY.'
  const month = Number(match[1])
  const year = 2000 + Number(match[2])
  if (month < 1 || month > 12) return 'Enter a valid month (01–12).'
  // Cards are valid through the end of the printed month.
  const firstOfNextMonth = new Date(year, month, 1)
  if (firstOfNextMonth <= now) return 'This card has expired.'
  if (year > now.getFullYear() + 20) return 'Enter a valid expiry year.'
  return undefined
}

export function validateCvc(
  value: string,
  brand: CardBrand | null,
): string | undefined {
  const digits = digitsOnly(value)
  if (!digits) return 'Enter the security code.'
  if (digits.length !== cvcLength(brand)) {
    return brand === 'amex'
      ? 'Amex security codes have 4 digits.'
      : 'Security codes have 3 digits.'
  }
  return undefined
}

export function validateCardName(value: string): string | undefined {
  const v = value.trim()
  if (!v) return 'Enter the name on your card.'
  if (v.length < 2) return 'Enter the name exactly as printed on the card.'
  return undefined
}
