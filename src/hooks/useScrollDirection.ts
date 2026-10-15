import { useEffect, useRef, useState } from 'react'

import { getLenis } from '@/hooks/useLenis'

export type ScrollDirection = 'up' | 'down' | null

export interface ScrollDirectionState {
  direction: ScrollDirection
  scrolled: boolean
  y: number
}

const SCROLL_THRESHOLD = 8
const SCROLLED_OFFSET = 24

function readScrollY(): number {
  if (typeof window === 'undefined') return 0
  return window.scrollY
}

export function useScrollDirection(): ScrollDirectionState {
  const [direction, setDirection] = useState<ScrollDirection>(null)
  const [scrolled, setScrolled] = useState(false)
  const [y, setY] = useState(0)
  const lastYRef = useRef(0)

  useEffect(() => {
    lastYRef.current = readScrollY()
    setY(lastYRef.current)
    setScrolled(lastYRef.current > SCROLLED_OFFSET)

    const handleScroll = (scrollY: number) => {
      setY(scrollY)
      setScrolled(scrollY > SCROLLED_OFFSET)

      const delta = scrollY - lastYRef.current
      if (Math.abs(delta) >= SCROLL_THRESHOLD) {
        setDirection(delta > 0 ? 'down' : 'up')
        lastYRef.current = scrollY
      }
    }

    let detach: (() => void) | undefined

    const attach = (): (() => void) => {
      const lenis = getLenis()
      if (lenis) {
        const onLenisScroll = (event: { scroll: number }) => {
          handleScroll(event.scroll)
        }
        lenis.on('scroll', onLenisScroll)
        handleScroll(lenis.scroll)
        return () => {
          lenis.off('scroll', onLenisScroll)
        }
      }

      const onWindowScroll = () => {
        handleScroll(readScrollY())
      }
      window.addEventListener('scroll', onWindowScroll, { passive: true })
      return () => {
        window.removeEventListener('scroll', onWindowScroll)
      }
    }

    detach = attach()

    const waitForLenis =
      getLenis() === null
        ? window.setInterval(() => {
            if (getLenis()) {
              detach?.()
              detach = attach()
              window.clearInterval(waitForLenis)
            }
          }, 50)
        : undefined

    return () => {
      if (waitForLenis !== undefined) {
        window.clearInterval(waitForLenis)
      }
      detach?.()
    }
  }, [])

  return { direction, scrolled, y }
}
