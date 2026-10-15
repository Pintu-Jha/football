import { AlarmClock, Star } from 'lucide-react'

import { EventList } from '@/components/home/EventList'
import { dontMissRows, featuredEventRows } from '@/data/homeContent'

export function EventLists() {
  return (
    <section className="bg-white py-8">
      <div className="container-home">
        <div className="grid gap-8 lg:grid-cols-2 lg:gap-6">
          <EventList title="Don't miss it" icon={AlarmClock} rows={dontMissRows} />
          <EventList
            title="Featured Events"
            icon={Star}
            rows={featuredEventRows}
            showFeaturedBadge
          />
        </div>
      </div>
    </section>
  )
}
