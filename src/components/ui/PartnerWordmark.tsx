import { cn } from '@/lib/utils'

export type PartnerWordmarkProps = {
  name: string
  className?: string
}

export function PartnerWordmark({ name, className }: PartnerWordmarkProps) {
  const mark = renderMark(name)

  return (
    <span
      className={cn('inline-flex max-w-[180px] items-center', className)}
      aria-label={name}
    >
      {mark}
    </span>
  )
}

function renderMark(name: string) {
  switch (name) {
    case 'livefootballtickets':
      return (
        <span className="text-[13px] font-bold lowercase tracking-tight text-[#21a15c]">
          livefootballtickets
        </span>
      )
    case 'StubHub':
      return (
        <span className="text-[18px] font-extrabold italic tracking-tight text-[#3f1d74]">
          StubHub
        </span>
      )
    case 'ticombo':
      return (
        <span className="text-[16px] font-bold lowercase tracking-tight text-[#00a3a1]">
          ticombo
        </span>
      )
    case 'HelloTickets':
      return (
        <span className="text-[14px] font-semibold tracking-tight text-ink">
          HelloTickets
        </span>
      )
    case 'FootballTicketNet':
      return (
        <span className="text-[12px] font-bold tracking-tight text-[#1b8f3a]">
          FootballTicketNet
        </span>
      )
    case '1BOX OFFICE':
      return (
        <span className="flex flex-col leading-none text-[#e8a317]">
          <span className="text-[15px] font-black tracking-tight">1BOX</span>
          <span className="text-[9px] font-black tracking-[0.18em]">OFFICE</span>
        </span>
      )
    case 'ticketliquidator':
      return (
        <span className="text-[13px] font-bold lowercase tracking-tight text-ink">
          ticketliquidator
        </span>
      )
    case 'vividseats':
      return (
        <span className="text-[15px] font-bold lowercase tracking-tight text-[#6d28d9]">
          vividseats
        </span>
      )
    case 'TicketNetwork':
      return (
        <span className="inline-flex items-center gap-0.5 text-[13px] font-bold tracking-tight text-ink">
          TicketNetwork
          <span
            className="mb-1 inline-block size-0 border-x-[3.5px] border-b-[6px] border-x-transparent border-b-brand"
            aria-hidden
          />
        </span>
      )
    case 'TicketSmarter':
      return (
        <span className="text-[13px] font-bold tracking-tight text-[#c9a227]">
          TicketSmarter
        </span>
      )
    case 'P1 Authenticated Agency':
      return (
        <span className="flex flex-col leading-tight">
          <span className="text-[17px] font-bold text-[#8b6914]">P1</span>
          <span className="text-[9px] font-medium text-muted">
            Authenticated Agency
          </span>
        </span>
      )
    default:
      return (
        <span className="text-[13px] font-bold tracking-tight text-ink">
          {name}
        </span>
      )
  }
}
