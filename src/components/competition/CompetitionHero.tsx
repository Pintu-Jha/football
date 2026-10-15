import { ChevronRight } from 'lucide-react'
import { useCallback, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

import { getCompetitionCrest } from '@/data/crests'
import type { Competition } from '@/data/types'
import { cn } from '@/lib/utils'

const TABS = [
  { id: 'overview', label: 'Overview' },
  { id: 'tickets', label: 'Tickets' },
  { id: 'teams', label: 'Teams' },
  { id: 'venues', label: 'Venues' },
  { id: 'faqs', label: 'FAQs' },
] as const

export type CompetitionTabId = (typeof TABS)[number]['id']

export type CompetitionHeroProps = {
  competition: Competition
  onTabChange?: (tabId: CompetitionTabId) => void
}

export function CompetitionHero({ competition, onTabChange }: CompetitionHeroProps) {
  const [activeTab, setActiveTab] = useState<CompetitionTabId>('overview')
  const crest = getCompetitionCrest(competition.crestCode)

  const scrollToSection = useCallback((sectionId: CompetitionTabId) => {
    document
      .getElementById(sectionId)
      ?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }, [])

  useEffect(() => {
    const elements = TABS.map((t) => document.getElementById(t.id)).filter(
      (el): el is HTMLElement => el !== null,
    )
    if (elements.length === 0) return

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)
        if (visible[0]?.target.id) {
          const id = visible[0].target.id as CompetitionTabId
          setActiveTab(id)
          onTabChange?.(id)
        }
      },
      { rootMargin: '-20% 0px -55% 0px', threshold: [0, 0.1, 0.25, 0.5] },
    )
    for (const el of elements) observer.observe(el)
    return () => observer.disconnect()
  }, [onTabChange])

  const handleTabClick = (tabId: CompetitionTabId) => {
    setActiveTab(tabId)
    onTabChange?.(tabId)
    scrollToSection(tabId)
  }

  return (
    <section
      className="relative isolate overflow-hidden pt-14 text-white"
      style={{
        background:
          'radial-gradient(ellipse 42% 80% at 82% 45%, rgb(232 32 42 / 0.7) 0%, rgb(232 32 42 / 0) 68%), linear-gradient(90deg, #1a0508 0%, #3d0a12 52%, #6b1018 100%)',
      }}
    >
      <div className="container-home grid gap-8 pb-7 pt-5 lg:grid-cols-[1fr_auto] lg:items-center">
        <div className="min-w-0">
          <nav aria-label="Breadcrumb">
            <ol className="flex flex-wrap items-center gap-1 text-[11px] text-white/70">
              <li>
                <Link to="/" className="hover:text-white">
                  Home
                </Link>
              </li>
              <ChevronRight className="size-3 text-white/45" aria-hidden />
              <li>
                <Link to="/football/premier-league" className="hover:text-white">
                  Football
                </Link>
              </li>
              <ChevronRight className="size-3 text-white/45" aria-hidden />
              <li className="text-white" aria-current="page">
                {competition.name}
              </li>
            </ol>
          </nav>

          <h1 className="mt-4 text-[32px] font-bold leading-[1.15] tracking-[-0.02em] md:text-[40px]">
            {competition.name} Tickets
          </h1>
          <p className="mt-2 max-w-[540px] text-[14px] leading-relaxed text-white/85">
            {competition.description}
          </p>

          <nav
            className="mt-6 flex flex-wrap gap-2"
            aria-label="Competition sections"
          >
            {TABS.map((tab) => {
              const isActive = activeTab === tab.id
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => handleTabClick(tab.id)}
                  aria-current={isActive ? 'true' : undefined}
                  className={cn(
                    'inline-flex h-9 min-w-[88px] items-center justify-center rounded-md px-5 text-[13px] font-medium transition-colors',
                    isActive
                      ? 'bg-brand text-white'
                      : 'border border-white/25 bg-transparent text-white hover:bg-white/10',
                  )}
                >
                  {tab.label}
                </button>
              )
            })}
          </nav>
        </div>

        <div className="hidden items-center gap-6 lg:flex">
          {crest ? (
            <img
              src={crest}
              alt={`${competition.name} logo`}
              className="h-[88px] w-auto object-contain mix-blend-screen [filter:grayscale(1)_brightness(18)]"
            />
          ) : (
            <span className="flex size-[78px] items-center justify-center rounded-full border-2 border-white/30 text-2xl font-extrabold">
              {competition.logoLabel}
            </span>
          )}
          <p className="max-w-[250px] text-[12px] leading-relaxed text-white/85">
            {competition.tagline ?? competition.description}
          </p>
        </div>
      </div>
    </section>
  )
}
