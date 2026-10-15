import { CreditCard, Headphones, Scale, ShieldCheck } from 'lucide-react'

const items = [
  {
    icon: Scale,
    title: 'Compare prices',
    subtitle: 'Side-by-side ticket listings',
  },
  {
    icon: ShieldCheck,
    title: 'Verified sellers',
    subtitle: 'Trusted marketplace partners',
  },
  {
    icon: CreditCard,
    title: 'Secure checkout',
    subtitle: 'Encrypted payment on partner sites',
  },
  {
    icon: Headphones,
    title: '24/7 support',
    subtitle: 'Help before and after your match',
  },
] as const

export function MatchTrustStrip() {
  return (
    <section className="border-y border-border bg-surface-muted py-10 md:py-12">
      <div className="container-ftc">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4 lg:gap-6">
          {items.map(({ icon: Icon, title, subtitle }) => (
            <div key={title} className="flex gap-4">
              <div className="flex size-11 shrink-0 items-center justify-center rounded-full bg-brand-soft">
                <Icon className="size-5 text-brand" aria-hidden />
              </div>
              <div>
                <p className="text-sm font-bold capitalize text-ink md:text-base">
                  {title}
                </p>
                <p className="mt-0.5 text-sm text-muted">{subtitle}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
