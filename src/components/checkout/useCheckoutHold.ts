import { useCallback, useEffect, useRef, useState } from 'react'

import { HOLD_MINUTES } from '@/data/checkout'

const HOLD_MS = HOLD_MINUTES * 60 * 1000
/** A hold that expired while the tab was alive this recently counts as a page refresh. */
const REFRESH_GRACE_MS = 5000
export const URGENT_SECONDS = 120

interface StoredHold {
  start: number
  seen: number
}

function storageKey(slug: string, ticketId: string): string {
  return `ftc-hold:${slug}:${ticketId}`
}

function readHold(key: string): StoredHold | null {
  try {
    const raw = window.sessionStorage.getItem(key)
    if (!raw) return null
    const parsed: unknown = JSON.parse(raw)
    if (
      typeof parsed === 'object' &&
      parsed !== null &&
      'start' in parsed &&
      'seen' in parsed &&
      typeof parsed.start === 'number' &&
      typeof parsed.seen === 'number'
    ) {
      return { start: parsed.start, seen: parsed.seen }
    }
  } catch {
    /* ignore corrupt / unavailable storage */
  }
  return null
}

function writeHold(key: string, hold: StoredHold): void {
  try {
    window.sessionStorage.setItem(key, JSON.stringify(hold))
  } catch {
    /* storage unavailable: the hold simply won't survive a refresh */
  }
}

function resolveStart(key: string): number {
  const now = Date.now()
  const stored = readHold(key)
  if (stored) {
    const age = now - stored.start
    const stillActive = age >= 0 && age < HOLD_MS
    // Expired hold + tab was alive moments ago → this is a refresh, keep it expired.
    const refreshedWhileExpired =
      age >= HOLD_MS && now - stored.seen < REFRESH_GRACE_MS
    if (stillActive || refreshedWhileExpired) return stored.start
  }
  writeHold(key, { start: now, seen: now })
  return now
}

export interface CheckoutHold {
  remainingSeconds: number
  expired: boolean
  urgent: boolean
  /** "mm:ss" */
  formatted: string
  /** Changes only at a handful of thresholds, so screen readers aren't spammed. */
  announcement: string
  /** Forget the hold (after a purchase or when starting again). */
  clear: () => void
}

function formatClock(totalSeconds: number): string {
  const m = Math.floor(totalSeconds / 60)
  const s = totalSeconds % 60
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
}

function announcementFor(seconds: number, expired: boolean): string {
  if (expired) return 'Your reservation has expired.'
  if (seconds <= 60) return 'Less than 1 minute left to complete your booking.'
  if (seconds <= URGENT_SECONDS) return '2 minutes left to complete your booking.'
  if (seconds <= 300) return '5 minutes left to complete your booking.'
  return ''
}

export function useCheckoutHold(slug: string, ticketId: string): CheckoutHold {
  const key = storageKey(slug, ticketId)
  const [start] = useState(() => resolveStart(key))
  const [now, setNow] = useState(() => Date.now())

  const clearedRef = useRef(false)

  useEffect(() => {
    const tick = () => {
      const current = Date.now()
      setNow(current)
      if (!clearedRef.current) writeHold(key, { start, seen: current })
    }
    const id = window.setInterval(tick, 1000)
    return () => window.clearInterval(id)
  }, [key, start])

  const remainingMs = Math.max(0, start + HOLD_MS - now)
  const remainingSeconds = Math.ceil(remainingMs / 1000)
  const expired = remainingMs <= 0

  const clear = useCallback(() => {
    clearedRef.current = true
    try {
      window.sessionStorage.removeItem(key)
    } catch {
      /* ignore */
    }
  }, [key])

  return {
    remainingSeconds,
    expired,
    urgent: !expired && remainingSeconds <= URGENT_SECONDS,
    formatted: formatClock(remainingSeconds),
    announcement: announcementFor(remainingSeconds, expired),
    clear,
  }
}
