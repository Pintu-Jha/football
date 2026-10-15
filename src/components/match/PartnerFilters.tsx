import { ArrowUpDown, CalendarDays, Users } from 'lucide-react'

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/Select'
import { useFilterStore } from '@/store/filterStore'

const TICKET_COUNTS = [1, 2, 3, 4, 5, 6] as const

const SORT_OPTIONS = [
  { value: 'lowest', label: 'Lowest price' },
  { value: 'highest', label: 'Highest price' },
  { value: 'availability', label: 'Availability' },
] as const

const AVAILABILITY_OPTIONS = [
  { value: 'all', label: 'All tickets' },
  { value: 'available', label: 'Available (10+)' },
  { value: 'limited', label: 'Limited (<10)' },
] as const

const triggerClass =
  'h-[58px] rounded-xl border-border bg-white px-4 [&>span]:line-clamp-none'

export function PartnerFilters() {
  const filters = useFilterStore((s) => s.partners)
  const setPartnerFilter = useFilterStore((s) => s.setPartnerFilter)

  return (
    <div className="grid gap-3 md:grid-cols-3">
      <Select
        value={String(filters.ticketCount)}
        onValueChange={(v) =>
          setPartnerFilter('ticketCount', Number.parseInt(v, 10))
        }
      >
        <SelectTrigger
          icon={<Users className="size-4" />}
          className={triggerClass}
          aria-label="Number of tickets"
        >
          <span className="flex min-w-0 flex-col items-start leading-tight">
            <span className="text-[11px] font-normal text-muted">
              Number of tickets
            </span>
            <SelectValue />
          </span>
        </SelectTrigger>
        <SelectContent>
          {TICKET_COUNTS.map((n) => (
            <SelectItem key={n} value={String(n)}>
              {n} {n === 1 ? 'ticket' : 'tickets'}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select
        value={filters.sort}
        onValueChange={(v) =>
          setPartnerFilter('sort', v as typeof filters.sort)
        }
      >
        <SelectTrigger
          icon={<ArrowUpDown className="size-4" />}
          className={triggerClass}
          aria-label="Sort by"
        >
          <span className="flex min-w-0 flex-col items-start leading-tight">
            <span className="text-[11px] font-normal text-muted">Sort by</span>
            <SelectValue />
          </span>
        </SelectTrigger>
        <SelectContent>
          {SORT_OPTIONS.map((opt) => (
            <SelectItem key={opt.value} value={opt.value}>
              {opt.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select
        value={filters.availability}
        onValueChange={(v) =>
          setPartnerFilter('availability', v as typeof filters.availability)
        }
      >
        <SelectTrigger
          icon={<CalendarDays className="size-4" />}
          className={triggerClass}
          aria-label="Availability"
        >
          <span className="flex min-w-0 flex-col items-start leading-tight">
            <span className="text-[11px] font-normal text-muted">
              Availability
            </span>
            <SelectValue />
          </span>
        </SelectTrigger>
        <SelectContent>
          {AVAILABILITY_OPTIONS.map((opt) => (
            <SelectItem key={opt.value} value={opt.value}>
              {opt.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}
