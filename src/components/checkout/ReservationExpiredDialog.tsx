import * as Dialog from '@radix-ui/react-dialog'
import { TimerOff } from 'lucide-react'

import { Button } from '@/components/ui/Button'

export interface ReservationExpiredDialogProps {
  open: boolean
  onStartAgain: () => void
}

/** Blocking dialog: cannot be dismissed, the only way out is "Start again". */
export function ReservationExpiredDialog({
  open,
  onStartAgain,
}: ReservationExpiredDialogProps) {
  return (
    <Dialog.Root open={open}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-[110] bg-ink/70 backdrop-blur-sm" />
        <Dialog.Content
          onEscapeKeyDown={(e) => e.preventDefault()}
          onPointerDownOutside={(e) => e.preventDefault()}
          onInteractOutside={(e) => e.preventDefault()}
          className="fixed left-1/2 top-1/2 z-[120] w-[calc(100%-2rem)] max-w-md -translate-x-1/2 -translate-y-1/2 rounded-xl bg-surface p-6 text-center shadow-lift focus-visible:outline-none sm:p-8"
        >
          <span className="mx-auto flex size-14 items-center justify-center rounded-full bg-brand-soft text-brand-hover">
            <TimerOff className="size-7" aria-hidden />
          </span>
          <Dialog.Title className="mt-5 text-xl font-extrabold text-ink">
            Your reservation expired
          </Dialog.Title>
          <Dialog.Description className="mt-2 text-sm leading-relaxed text-muted">
            We can only hold tickets for a few minutes while you check out.
            Nothing was charged. Head back to the match to pick your tickets
            again.
          </Dialog.Description>
          <Button className="mt-6 w-full" size="lg" onClick={onStartAgain}>
            Start again
          </Button>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}
