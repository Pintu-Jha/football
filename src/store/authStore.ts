import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'

/**
 * FRONT-END MOCK AUTH.
 * There is no backend yet: accounts live in localStorage, passwords are stored
 * only as a salted SHA-256 digest, and OTP codes are generated locally.
 * Replace the action bodies with API calls when the backend is ready; the
 * components only depend on the action signatures and result types below.
 */

/** While there is no email/SMS provider the code is shown on the OTP screen. */
export const OTP_DEMO_MODE = true
export const OTP_LENGTH = 6
export const OTP_TTL_MS = 5 * 60 * 1000
export const OTP_RESEND_COOLDOWN_MS = 30 * 1000
export const OTP_MAX_ATTEMPTS = 5
export const PASSWORD_MIN_LENGTH = 8

export type OtpPurpose = 'signup' | 'reset'

export interface AuthUser {
  id: string
  name: string
  email: string
}

interface StoredAccount extends AuthUser {
  passwordHash: string
}

export interface PendingOtp {
  purpose: OtpPurpose
  email: string
  code: string
  expiresAt: number
  resendAvailableAt: number
  attempts: number
  /** Only for signup: the account is created after the code is verified */
  name?: string
  passwordHash?: string
}

export type AuthResult = { ok: true } | { ok: false; error: string }
export type VerifyResult =
  | { ok: true; purpose: OtpPurpose }
  | { ok: false; error: string }

interface AuthState {
  user: AuthUser | null
  accounts: StoredAccount[]
  pendingOtp: PendingOtp | null
  /** Email whose reset code has been verified; allows the reset-password step */
  resetVerifiedEmail: string | null

  signUp: (input: {
    name: string
    email: string
    password: string
  }) => Promise<AuthResult>
  signIn: (email: string, password: string) => Promise<AuthResult>
  requestPasswordReset: (email: string) => Promise<AuthResult>
  verifyOtp: (code: string) => VerifyResult
  resendOtp: () => AuthResult
  resetPassword: (password: string) => Promise<AuthResult>
  signOut: () => void
  cancelPendingOtp: () => void
}

export function normalizeEmail(email: string): string {
  return email.trim().toLowerCase()
}

export function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email.trim())
}

async function hashPassword(email: string, password: string): Promise<string> {
  const data = new TextEncoder().encode(`ftc:${normalizeEmail(email)}:${password}`)
  const digest = await crypto.subtle.digest('SHA-256', data)
  return Array.from(new Uint8Array(digest))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('')
}

function generateOtpCode(): string {
  const values = new Uint32Array(1)
  crypto.getRandomValues(values)
  return String(values[0]! % 10 ** OTP_LENGTH).padStart(OTP_LENGTH, '0')
}

function newOtp(
  purpose: OtpPurpose,
  email: string,
  extra?: Pick<PendingOtp, 'name' | 'passwordHash'>,
): PendingOtp {
  const now = Date.now()
  return {
    purpose,
    email,
    code: generateOtpCode(),
    expiresAt: now + OTP_TTL_MS,
    resendAvailableAt: now + OTP_RESEND_COOLDOWN_MS,
    attempts: 0,
    ...extra,
  }
}

function toPublicUser(account: StoredAccount): AuthUser {
  return { id: account.id, name: account.name, email: account.email }
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      accounts: [],
      pendingOtp: null,
      resetVerifiedEmail: null,

      signUp: async ({ name, email, password }) => {
        const normalized = normalizeEmail(email)
        if (get().accounts.some((a) => a.email === normalized)) {
          return {
            ok: false,
            error: 'An account with this email already exists. Try signing in.',
          }
        }
        const passwordHash = await hashPassword(normalized, password)
        set({
          pendingOtp: newOtp('signup', normalized, {
            name: name.trim(),
            passwordHash,
          }),
          resetVerifiedEmail: null,
        })
        return { ok: true }
      },

      signIn: async (email, password) => {
        const normalized = normalizeEmail(email)
        const account = get().accounts.find((a) => a.email === normalized)
        const hash = await hashPassword(normalized, password)
        if (!account || account.passwordHash !== hash) {
          return { ok: false, error: 'Incorrect email or password.' }
        }
        set({ user: toPublicUser(account) })
        return { ok: true }
      },

      requestPasswordReset: async (email) => {
        // Always succeeds so the UI never reveals which emails are registered.
        set({
          pendingOtp: newOtp('reset', normalizeEmail(email)),
          resetVerifiedEmail: null,
        })
        return { ok: true }
      },

      verifyOtp: (code) => {
        const pending = get().pendingOtp
        if (!pending) {
          return { ok: false, error: 'Your session expired. Please start again.' }
        }
        if (Date.now() > pending.expiresAt) {
          return { ok: false, error: 'This code has expired. Request a new one.' }
        }
        if (pending.attempts >= OTP_MAX_ATTEMPTS) {
          return {
            ok: false,
            error: 'Too many incorrect attempts. Request a new code.',
          }
        }
        if (code !== pending.code) {
          const attempts = pending.attempts + 1
          set({ pendingOtp: { ...pending, attempts } })
          const left = OTP_MAX_ATTEMPTS - attempts
          return {
            ok: false,
            error:
              left > 0
                ? `Incorrect code. ${left} attempt${left === 1 ? '' : 's'} left.`
                : 'Too many incorrect attempts. Request a new code.',
          }
        }

        if (pending.purpose === 'signup') {
          const account: StoredAccount = {
            id: crypto.randomUUID(),
            name: pending.name ?? 'Fan',
            email: pending.email,
            passwordHash: pending.passwordHash ?? '',
          }
          set((state) => ({
            accounts: [...state.accounts, account],
            user: toPublicUser(account),
            pendingOtp: null,
          }))
          return { ok: true, purpose: 'signup' }
        }

        set({ resetVerifiedEmail: pending.email, pendingOtp: null })
        return { ok: true, purpose: 'reset' }
      },

      resendOtp: () => {
        const pending = get().pendingOtp
        if (!pending) {
          return { ok: false, error: 'Your session expired. Please start again.' }
        }
        const wait = pending.resendAvailableAt - Date.now()
        if (wait > 0) {
          return {
            ok: false,
            error: `Please wait ${Math.ceil(wait / 1000)}s before requesting another code.`,
          }
        }
        set({
          pendingOtp: newOtp(pending.purpose, pending.email, {
            name: pending.name,
            passwordHash: pending.passwordHash,
          }),
        })
        return { ok: true }
      },

      resetPassword: async (password) => {
        const email = get().resetVerifiedEmail
        if (!email) {
          return { ok: false, error: 'Verify your email before resetting.' }
        }
        const account = get().accounts.find((a) => a.email === email)
        if (!account) {
          // Same response as success to avoid account enumeration.
          set({ resetVerifiedEmail: null })
          return { ok: true }
        }
        const passwordHash = await hashPassword(email, password)
        set((state) => ({
          accounts: state.accounts.map((a) =>
            a.email === email ? { ...a, passwordHash } : a,
          ),
          resetVerifiedEmail: null,
        }))
        return { ok: true }
      },

      signOut: () => set({ user: null }),

      cancelPendingOtp: () => set({ pendingOtp: null }),
    }),
    {
      name: 'ftc-auth',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        user: state.user,
        accounts: state.accounts,
        pendingOtp: state.pendingOtp,
        resetVerifiedEmail: state.resetVerifiedEmail,
      }),
    },
  ),
)
