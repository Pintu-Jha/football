import { Link } from 'react-router-dom'

import { CardArrow } from '@/components/home/CardArrow'
import { HomeSectionHeader } from '@/components/home/HomeSectionHeader'
import { popularClubCards } from '@/data/homeContent'

const CLUB_BG = '/images/club-stadium-bg.jpg'

export function PopularClubs() {
  return (
    <section className="bg-white py-8">
      <div className="container-home">
        <HomeSectionHeader
          title="Popular Clubs"
          viewAllHref="/football/premier-league"
          viewAllLabel="View all clubs"
        />

        <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
          {popularClubCards.map((club) => (
            <Link
              key={club.id}
              to={club.href}
              className="group relative aspect-[3/2] overflow-hidden rounded-lg bg-ink"
            >
              <img
                src={CLUB_BG}
                alt=""
                loading="lazy"
                className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div
                className="absolute inset-0 opacity-45 mix-blend-color"
                style={{ backgroundColor: club.tint }}
                aria-hidden
              />
              <img
                src={club.logo}
                alt={club.name}
                loading="lazy"
                className="absolute left-1/2 top-[40%] h-[46%] w-auto -translate-x-1/2 -translate-y-1/2 object-contain drop-shadow-[0_6px_14px_rgba(0,0,0,0.55)] transition-transform duration-500 group-hover:scale-110"
              />
              <div
                className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"
                aria-hidden
              />
              <div className="absolute inset-x-0 bottom-0 flex items-center justify-between gap-2 p-3">
                <p className="truncate text-[13px] font-semibold text-white">
                  {club.name}
                </p>
                <CardArrow />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
