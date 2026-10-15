import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/Accordion'
import { getMatchFaqs } from '@/data/faqs'
import type { Match } from '@/data/types'

export type MatchFaqProps = {
  match: Match
}

export function MatchFaq({ match }: MatchFaqProps) {
  const matchLabel = `${match.homeTeam} vs ${match.awayTeam}`
  const faqs = getMatchFaqs(matchLabel)

  return (
    <section className="bg-white pb-8 pt-4">
      <div className="container-home">
        <h2 className="text-[22px] font-bold tracking-[-0.01em] text-ink">
          Frequently Asked Questions
        </h2>

        <Accordion type="single" collapsible className="mt-2">
          {faqs.map((faq) => (
            <AccordionItem key={faq.id} value={faq.id} className="first:border-t-0">
              <AccordionTrigger className="py-3 text-[13px] font-medium [&>svg]:size-4">
                {faq.question}
              </AccordionTrigger>
              <AccordionContent className="text-[13px]">
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  )
}
