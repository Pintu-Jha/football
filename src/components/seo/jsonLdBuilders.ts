export type BreadcrumbLdItem = {
  name: string
  /** Absolute or site-relative URL; omitted for the current page. */
  item?: string
}

export function buildBreadcrumbList(items: BreadcrumbLdItem[]) {
  const origin =
    typeof window !== 'undefined' ? window.location.origin : ''

  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((entry, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: entry.name,
      ...(entry.item
        ? {
            item: entry.item.startsWith('http')
              ? entry.item
              : `${origin}${entry.item}`,
          }
        : {}),
    })),
  }
}

export type FaqLdItem = {
  question: string
  answer: string
}

export function buildFaqPage(faqs: FaqLdItem[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  }
}
