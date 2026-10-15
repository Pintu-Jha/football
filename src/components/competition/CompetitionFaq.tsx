import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/Accordion'
import { competitionFaqs } from '@/data/faqs'
import type { Competition } from '@/data/types'

export type CompetitionFaqProps = {
  competition: Competition
}

function personalizeQuestion(question: string, competitionName: string): string {
  return question.replace(/Premier League/g, competitionName)
}

export function CompetitionFaq({ competition }: CompetitionFaqProps) {
  return (
    <section id="faqs" className="scroll-mt-20 bg-white pb-12 pt-10">
      <div className="container-home">
        <h2 className="text-[22px] font-bold tracking-[-0.01em] text-ink">
          Frequently Asked Questions
        </h2>

        <Accordion type="single" collapsible className="mt-2">
          {competitionFaqs.map((faq) => (
            <AccordionItem key={faq.id} value={faq.id} className="first:border-t-0">
              <AccordionTrigger className="py-3 text-[13px] font-medium [&>svg]:size-4">
                {personalizeQuestion(faq.question, competition.name)}
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
