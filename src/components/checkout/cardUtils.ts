export type CardBrand = 'visa' | 'mastercard' | 'amex' | 'discover'

export const CARD_BRAND_LABEL: Record<CardBrand, string> = {
  visa: 'Visa',
  mastercard: 'Mastercard',
  amex: 'Amex',
  discover: 'Discover',
}

export function digitsOnly(value: string): string {
  return value.replace(/\D/g, '')
}

export function detectCardBrand(rawNumber: string): CardBrand | null {
  const n = digitsOnly(rawNumber)
  if (/^4/.test(n)) return 'visa'
  if (/^3[47]/.test(n)) return 'amex'
  if (/^(5[1-5]|2(2[2-9]|[3-6]\d|7[01]|720))/.test(n)) return 'mastercard'
  if (/^(6011|65|64[4-9])/.test(n)) return 'discover'
  return null
}

export function maxCardDigits(brand: CardBrand | null): number {
  return brand === 'amex' ? 15 : 16
}

export function formatCardNumber(raw: string): string {
  const brand = detectCardBrand(raw)
  const digits = digitsOnly(raw).slice(0, maxCardDigits(brand))
  if (brand === 'amex') {
    return [digits.slice(0, 4), digits.slice(4, 10), digits.slice(10, 15)]
      .filter(Boolean)
      .join(' ')
  }
  return (digits.match(/.{1,4}/g) ?? []).join(' ')
}

export function luhnValid(rawNumber: string): boolean {
  const digits = digitsOnly(rawNumber)
  if (digits.length < 12) return false
  let sum = 0
  let double = false
  for (let i = digits.length - 1; i >= 0; i -= 1) {
    let d = Number(digits[i])
    if (double) {
      d *= 2
      if (d > 9) d -= 9
    }
    sum += d
    double = !double
  }
  return sum % 10 === 0
}

/**
 * Formats to "MM/YY". Adds the slash automatically after two digits, but lets
 * the user delete back through it (`previous` is the value before the edit).
 */
export function formatExpiry(raw: string, previous = ''): string {
  let digits = digitsOnly(raw).slice(0, 4)
  const deleting = raw.length < previous.length

  // "3" can only be March → "03"
  if (digits.length === 1 && Number(digits) > 1 && !deleting) {
    digits = `0${digits}`
  }

  if (digits.length > 2) return `${digits.slice(0, 2)}/${digits.slice(2)}`
  if (digits.length === 2 && !deleting) return `${digits}/`
  return digits
}

export function cvcLength(brand: CardBrand | null): number {
  return brand === 'amex' ? 4 : 3
}
