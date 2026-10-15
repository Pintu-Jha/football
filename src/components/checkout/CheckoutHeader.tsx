import { ArrowLeft, Lock } from 'lucide-react'
import { Link } from 'react-router-dom'

import { CurrencySelect } from '@/components/layout/CurrencySelect'
import { Logo } from '@/components/layout/Logo'
import { buildTicketsPath } from '@/data/checkout'

export interface CheckoutHeaderProps {
  matchSlug: string
}

export function CheckoutHeader({ matchSlug }: CheckoutHeaderProps) {
  return (
    <header className="border-b border-border bg-surface">
      <div className="container-ftc flex h-16 items-center justify-between gap-3">
        <Logo variant="dark" />

        <p className="hidden items-center gap-2 text-sm font-semibold text-ink sm:flex">
          <Lock className="size-4 text-success" aria-hidden />
          Secure checkout
        </p>

        <div className="flex items-center gap-1 sm:gap-3">
          <Link
            to={buildTicketsPath(matchSlug)}
            className="inline-flex h-9 items-center gap-1.5 rounded-full px-2.5 text-sm font-medium text-muted transition-colors hover:bg-surface-muted hover:text-ink sm:px-3"
          >
            <ArrowLeft className="size-4" aria-hidden />
            <span className="hidden sm:inline">Back to tickets</span>
            <span className="sm:hidden">Back</span>
          </Link>
          <CurrencySelect tone="dark" />
        </div>
      </div>
      <p className="flex items-center justify-center gap-1.5 border-t border-border py-1.5 text-xs font-semibold text-muted sm:hidden">
        <Lock className="size-3.5 text-success" aria-hidden />
        Secure checkout
      </p>
    </header>
  )
}
