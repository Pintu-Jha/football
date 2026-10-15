import { Link } from 'react-router-dom'

import { CardArrow } from '@/components/home/CardArrow'
import { HomeSectionHeader } from '@/components/home/HomeSectionHeader'
import { categoryCards } from '@/data/homeContent'

export function BrowseCategories() {
  return (
    <section className="bg-white py-8">
      <div className="container-home">
        <HomeSectionHeader title="Browse by Category" />

        <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {categoryCards.map((category) => (
            <Link
              key={category.id}
              to={category.href}
              className="group relative aspect-[330/184] overflow-hidden rounded-lg bg-ink"
            >
              <img
                src={category.image}
                alt={category.name}
                loading="lazy"
                className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div
                className="absolute inset-0 bg-gradient-to-r from-black/75 via-black/25 to-transparent"
                aria-hidden
              />
              <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-3 p-4">
                <div className="max-w-[60%]">
                  <h3 className="text-[16px] font-bold leading-tight text-white">
                    {category.name}
                  </h3>
                  <p className="mt-1 text-[12px] leading-snug text-white/85">
                    {category.description}
                  </p>
                </div>
                <CardArrow />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
