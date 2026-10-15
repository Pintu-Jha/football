import { CustomCursor } from '@/components/motion/CustomCursor'
import { PageLoader } from '@/components/motion/PageLoader'
import { usePageTransition } from '@/hooks/usePageTransition'
import { useRevealOnScroll } from '@/hooks/useRevealOnScroll'
import { cn } from '@/lib/utils'

/**
 * Mounts global motion: page loader, custom cursor, route wipe,
 * and scroll reveals for `[data-reveal]` inside the document.
 */
export function MotionRoot() {
  const { overlayRef, active } = usePageTransition({ skipInitial: true })

  useRevealOnScroll({
    selector: 'main [data-reveal], footer [data-reveal]',
  })

  return (
    <>
      <PageLoader />
      <CustomCursor />
      <div
        ref={overlayRef}
        className={cn(
          'pointer-events-none fixed inset-0 z-[180] bg-ink',
          active ? 'opacity-0' : 'invisible opacity-0',
        )}
        aria-hidden
      />
    </>
  )
}
