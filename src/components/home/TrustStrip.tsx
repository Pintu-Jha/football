import { CreditCard, Headphones, Shield, Ticket } from 'lucide-react'

import { trustBarItems } from '@/data/homeContent'
import { cn } from '@/lib/utils'

const icons = [Shield, Ticket, Headphones, CreditCard] as const

export type TrustStripProps = {
  variant?: 'hero' | 'section'
  className?: string
}

export function TrustStrip({ variant = 'section', className }: TrustStripProps) {
  const items = trustBarItems.map((item, index) => ({
    ...item,
    icon: icons[index] ?? Shield,
  }))

  const list = (
    <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 lg:gap-6">
      {items.map(({ icon: Icon, title, subtitle }) => (
        <li key={title} className="flex items-center gap-3">
          <Icon className="size-8 shrink-0 stroke-[1.4] text-white" aria-hidden />
          <span className="min-w-0">
            <span className="block text-[13px] font-semibold leading-tight text-white">
              {title}
            </span>
            <span className="mt-0.5 block text-[12px] leading-tight text-white/65">
              {subtitle}
            </span>
          </span>
        </li>
      ))}
    </ul>
  )

  if (variant === 'hero') {
    return <div className={cn('py-1', className)}>{list}</div>
  }

  return (
    <section className={cn('bg-ink py-8', className)}>
      <div className="container-home">{list}</div>
    </section>
  )
}
