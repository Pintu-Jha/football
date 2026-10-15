import { safeRedirect } from '@/components/auth/RequireAuth'
import { isValidEmail, PASSWORD_MIN_LENGTH } from '@/store/authStore'

export const NAME_MIN_LENGTH = 2

/** Appends a validated `?redirect=` param to an auth path (omitted for "/"). */
export function withRedirect(path: string, redirect: string | null): string {
  const safe = safeRedirect(redirect, '')
  if (!safe || safe === '/') return path
  return `${path}?redirect=${encodeURIComponent(safe)}`
}

export function validateName(value: string): string | null {
  const name = value.trim()
  if (name.length === 0) return 'Please enter your full name.'
  if (name.length < NAME_MIN_LENGTH) return 'Your name should be at least 2 characters.'
  return null
}

export function validateEmail(value: string): string | null {
  if (value.trim().length === 0) return 'Enter your email address.'
  if (!isValidEmail(value)) return 'That doesn\u2019t look like a valid email address.'
  return null
}

/** Sign-in only checks that something was typed; the store verifies it. */
export function validateRequiredPassword(value: string): string | null {
  return value.length === 0 ? 'Enter your password.' : null
}

export interface PasswordChecks {
  length: boolean
  letter: boolean
  number: boolean
  symbol: boolean
}

export function getPasswordChecks(password: string): PasswordChecks {
  return {
    length: password.length >= PASSWORD_MIN_LENGTH,
    letter: /[A-Za-z]/.test(password),
    number: /\d/.test(password),
    symbol: /[^A-Za-z0-9\s]/.test(password),
  }
}

export function validateNewPassword(value: string): string | null {
  if (value.length === 0) return 'Create a password.'
  const checks = getPasswordChecks(value)
  if (!checks.length) {
    return `Use at least ${PASSWORD_MIN_LENGTH} characters.`
  }
  if (!checks.letter || !checks.number) {
    return 'Include at least one letter and one number.'
  }
  return null
}

export function validateConfirmPassword(
  password: string,
  confirm: string,
): string | null {
  if (confirm.length === 0) return 'Re-enter your password to confirm it.'
  if (confirm !== password) return 'Passwords don\u2019t match yet.'
  return null
}

/** j***@gmail.com */
export function maskEmail(email: string): string {
  const at = email.lastIndexOf('@')
  if (at <= 0) return email
  const local = email.slice(0, at)
  const domain = email.slice(at)
  return `${local.charAt(0)}***${domain}`
}

/** Seconds -> m:ss */
export function formatClock(totalSeconds: number): string {
  const safe = Math.max(0, Math.floor(totalSeconds))
  const minutes = Math.floor(safe / 60)
  const seconds = safe % 60
  return `${minutes}:${String(seconds).padStart(2, '0')}`
}
