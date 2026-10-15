import { ChevronDown, ChevronUp } from 'lucide-react'
import { useState } from 'react'

import type { Competition } from '@/data/types'

const INITIAL_PARAGRAPHS = 2

export type AboutSectionProps = {
  competition: Competition
}

export function AboutSection({ competition }: AboutSectionProps) {
  const [expanded, setExpanded] = useState(false)
  const paragraphs = competition.about ?? [competition.longDescription]
  const canExpand = paragraphs.length > INITIAL_PARAGRAPHS
  const shown = expanded ? paragraphs : paragraphs.slice(0, INITIAL_PARAGRAPHS)

  return (
    <section className="bg-white pt-10">
      <div className="container-home">
        <h2 className="text-[22px] font-bold tracking-[-0.01em] text-ink">
          About {competition.name} Tickets
        </h2>
        <div className="mt-3 space-y-3 text-[13px] leading-relaxed text-muted">
          {shown.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
        </div>
        {canExpand ? (
          <div className="mt-4 flex justify-center">
            <button
              type="button"
              onClick={() => setExpanded((v) => !v)}
              className="inline-flex h-10 items-center gap-2 rounded-md border border-brand/40 bg-brand-soft/40 px-8 text-[13px] font-medium text-brand transition-colors hover:bg-brand-soft"
            >
              {expanded ? 'Show Less' : 'Load More Content'}
              {expanded ? (
                <ChevronUp className="size-4" aria-hidden />
              ) : (
                <ChevronDown className="size-4" aria-hidden />
              )}
            </button>
          </div>
        ) : null}
      </div>
    </section>
  )
}
