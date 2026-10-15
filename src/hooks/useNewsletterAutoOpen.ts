import { useEffect } from 'react'

import { useUiStore } from '@/store/uiStore'

const SESSION_KEY = 'ftc-newsletter-shown'
const DELAY_MS = 4000

export function useNewsletterAutoOpen(enabled = true) {
  const newsletterOpen = useUiStore((s) => s.newsletterOpen)
  const openNewsletter = useUiStore((s) => s.openNewsletter)

  useEffect(() => {
    if (!enabled) {
      return undefined
    }
    if (sessionStorage.getItem(SESSION_KEY) === '1') {
      return undefined
    }
    if (newsletterOpen) {
      return undefined
    }

    const timeoutId = window.setTimeout(() => {
      if (sessionStorage.getItem(SESSION_KEY) === '1') {
        return
      }
      if (useUiStore.getState().newsletterOpen) {
        return
      }
      sessionStorage.setItem(SESSION_KEY, '1')
      openNewsletter('auto')
    }, DELAY_MS)

    return () => {
      window.clearTimeout(timeoutId)
    }
  }, [enabled, newsletterOpen, openNewsletter])
}
