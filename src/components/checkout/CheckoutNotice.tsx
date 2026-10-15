import type { LucideIcon } from 'lucide-react'
import { Link } from 'react-router-dom'

import { Button } from '@/components/ui/Button'

export interface CheckoutNoticeProps {
  icon: LucideIcon
  title: string
  message: string
  actionLabel: string
  actionTo: string
}

/** Friendly full-height notice (not found, sold out, ...). */
export function CheckoutNotice({
  icon: Icon,
  title,
  message,
  actionLabel,
  actionTo,
}: CheckoutNoticeProps) {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center bg-surface px-4 text-center">
      <span className="flex size-14 items-center justify-center rounded-full bg-brand-soft text-brand-hover">
        <Icon className="size-7" aria-hidden />
      </span>
      <h1 className="mt-6 text-2xl font-extrabold text-ink">{title}</h1>
      <p className="mt-3 max-w-md text-muted">{message}</p>
      <Button asChild className="mt-8">
        <Link to={actionTo}>{actionLabel}</Link>
      </Button>
    </div>
  )
}
