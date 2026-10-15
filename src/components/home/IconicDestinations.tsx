import { Link } from 'react-router-dom'

import { CardArrow } from '@/components/home/CardArrow'
import { HomeSectionHeader } from '@/components/home/HomeSectionHeader'
import { destinationCards } from '@/data/homeContent'

export function IconicDestinations() {
  return (
    <section className="bg-white py-8">
      <div className="container-home">
        <HomeSectionHeader
          title="Iconic Destinations"
          viewAllHref="/football/premier-league"
          viewAllLabel="View all destinations"
        />

        <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
          {destinationCards.map((destination) => (
            <Link
              key={destination.id}
              to={destination.href}
              className="group relative aspect-[3/2] overflow-hidden rounded-lg bg-ink"
            >
              <img
                src={destination.image}
                alt={destination.name}
                loading="lazy"
                className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div
                className="absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-transparent"
                aria-hidden
              />
              <div className="absolute inset-x-0 bottom-0 flex items-center justify-between gap-2 p-3">
                <p className="truncate text-[13px] font-semibold text-white">
                  {destination.name}
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
