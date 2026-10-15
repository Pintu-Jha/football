import type { FaqItem } from './types'

export const competitionFaqs: FaqItem[] = [
  {
    id: 'cf1',
    question: 'How can I buy Premier League tickets?',
    answer:
      'Choose a match from the list above, compare offers from our trusted partners, then click “View offers” to pick your seats and complete your purchase securely.',
  },
  {
    id: 'cf2',
    question: 'Are the tickets official and guaranteed?',
    answer:
      'Yes. Every order is covered by our 100% Buyer Guarantee — your tickets will be valid for entry and arrive in time for the match, or you get your money back.',
  },
  {
    id: 'cf3',
    question: 'Can I choose specific seats together?',
    answer:
      'Most listings let you select the section and number of tickets. Seats bought in a single order are seated together unless the listing states otherwise.',
  },
  {
    id: 'cf4',
    question: 'What happens if a match is rescheduled or cancelled?',
    answer:
      'If a match is rescheduled your tickets remain valid for the new date. If it is cancelled and not replayed, you will receive a full refund.',
  },
  {
    id: 'cf5',
    question: 'When will I receive my tickets?',
    answer:
      'Tickets are delivered as mobile e-tickets, PDF downloads or by courier depending on the club and seller. The delivery method is shown on each offer.',
  },
  {
    id: 'cf6',
    question: 'Do you offer hospitality or VIP tickets?',
    answer:
      'Yes. Look for the “VIP Ticket” and “VIP Ticket + Hotel” badges on match listings for premium seats, lounges and hotel packages.',
  },
  {
    id: 'cf7',
    question: 'Why are my Premier League tickets on your platform?',
    answer:
      'FootballTicketClub is a comparison marketplace. Partner sellers list official Premier League tickets here so you can compare prices in one place, then complete your booking with the partner you choose.',
  },
  {
    id: 'cf8',
    question: 'Are children allowed at Premier League matches?',
    answer:
      'Children are welcome at all Premier League grounds. Most clubs require under-16s to be accompanied by an adult, and every attendee needs their own ticket.',
  },
]

export const matchFaqs: FaqItem[] = [
  {
    id: 'mf1',
    question: 'How can I buy {match} tickets?',
    answer:
      'Compare partner offers in the table above, choose the seat type and price that suit you, then click “View tickets” to continue on the partner’s website.',
  },
  {
    id: 'mf2',
    question: 'Are the tickets official and guaranteed?',
    answer:
      'Yes. Every listing is covered by the selling partner’s authenticity guarantee. Your tickets will be valid for entry and delivered in time for the match, or you are entitled to a refund under the partner’s buyer protection policy.',
  },
  {
    id: 'mf3',
    question: 'When will I receive my tickets?',
    answer:
      'Most {match} tickets are delivered as mobile e-tickets shortly after purchase. Some partners also offer PDF print-at-home or stadium collection. The delivery method is shown on each offer.',
  },
  {
    id: 'mf4',
    question: 'What happens if the match is cancelled or rescheduled?',
    answer:
      'If {match} is rescheduled, your tickets usually remain valid for the new date. If the match is cancelled and not replayed, the partner will issue a refund according to their terms.',
  },
  {
    id: 'mf5',
    question: 'Do you offer hospitality or VIP tickets?',
    answer:
      'Yes. Look for VIP / Hospitality rows in the comparison table for premium seating, lounges and hospitality packages for {match}.',
  },
  {
    id: 'mf6',
    question: 'Can I choose my seat?',
    answer:
      'Most partners let you pick a section or stand. Exact seat numbers are confirmed on the partner site at checkout. Use the Section / Details column to compare areas of the ground.',
  },
  {
    id: 'mf7',
    question: 'Are there any additional fees?',
    answer:
      'The prices shown are per ticket from each partner. Booking fees, taxes and delivery charges may be added on the partner website before you pay. Always review the final total at checkout.',
  },
  {
    id: 'mf8',
    question: 'Who are the ticket sellers listed on this page?',
    answer:
      'FootballTicketClub is an independent comparison site. The names in the Partner column are trusted resale and hospitality agencies. The purchase is completed on their website, not on FootballTicketClub.',
  },
]

export function getMatchFaqs(matchLabel: string): FaqItem[] {
  return matchFaqs.map((faq) => ({
    ...faq,
    question: faq.question.replaceAll('{match}', matchLabel),
    answer: faq.answer.replaceAll('{match}', matchLabel),
  }))
}
