import { BadgeCheck, Headphones, Lock, Tag } from 'lucide-react'

import { featureStripItems } from '@/data/homeContent'

const icons = [BadgeCheck, Lock, Tag, Headphones] as const

export function ValueProps() {
  return (
    <section className="bg-white py-6">
      <div className="container-home">
        <div className="grid gap-6 border-y border-border py-6 sm:grid-cols-2 lg:grid-cols-4">
          {featureStripItems.map(({ title, description }, index) => {
            const Icon = icons[index] ?? BadgeCheck
            return (
              <div key={title} className="flex items-start gap-3">
                <Icon className="size-7 shrink-0 stroke-[1.5] text-brand" aria-hidden />
                <div>
                  <h3 className="text-[13px] font-semibold text-ink">{title}</h3>
                  <p className="mt-0.5 max-w-[220px] text-[12px] leading-snug text-muted">
                    {description}
                  </p>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
