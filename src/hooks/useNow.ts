import { useCallback, useEffect, useState } from 'react'

/**
 * Ticking clock (ms epoch) for countdowns. Returns the current time and a
 * `refresh` function to sync immediately after state changes.
 */
export function useNow(active = true, intervalMs = 1000): [number, () => void] {
  const [now, setNow] = useState(() => Date.now())

  useEffect(() => {
    if (!active) return undefined
    const id = window.setInterval(() => setNow(Date.now()), intervalMs)
    return () => window.clearInterval(id)
  }, [active, intervalMs])

  const refresh = useCallback(() => setNow(Date.now()), [])

  return [now, refresh]
}
