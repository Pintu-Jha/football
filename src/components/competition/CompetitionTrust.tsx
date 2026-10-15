import { CreditCard, Headphones, ShieldCheck, Ticket } from 'lucide-react'

const features = [
  {
    icon: Ticket,
    title: 'Wide Selection',
    description: 'Tickets for all Premier League matches and teams',
  },
  {
    icon: ShieldCheck,
    title: '100% Buyer Guarantee',
    description: 'Safe and secure purchases',
  },
  {
    icon: Headphones,
    title: '24/7 Customer Support',
    description: "We're here to help",
  },
  {
    icon: CreditCard,
    title: 'Secure Payments',
    description: 'Your data is protected',
  },
] as const

export function CompetitionTrust({ competitionName }: { competitionName?: string }) {
  return (
    <section className="bg-white pt-8">
      <div className="container-home">
        <div className="grid gap-5 rounded-lg border border-border px-5 py-5 sm:grid-cols-2 lg:grid-cols-4">
          {features.map(({ icon: Icon, title, description }) => (
            <div key={title} className="flex items-start gap-3">
              <Icon className="size-7 shrink-0 stroke-[1.5] text-brand" aria-hidden />
              <div>
                <h3 className="text-[13px] font-semibold text-ink">{title}</h3>
                <p className="mt-0.5 max-w-[200px] text-[11px] leading-snug text-muted">
                  {competitionName
                    ? description.replace('Premier League', competitionName)
                    : description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
