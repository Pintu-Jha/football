import { create } from 'zustand'

interface CompetitionFilters {
  city: string
  team: string
  date: string
  venue: string
  sort: 'upcoming' | 'price-asc' | 'price-desc'
}

interface PartnerFilters {
  ticketCount: number
  sort: 'lowest' | 'highest' | 'availability'
  availability: 'all' | 'available' | 'limited'
}

export interface StadiumTicketFilters {
  sort: 'recommended' | 'price-asc' | 'price-desc'
  zoneId: string | null
  hiddenSoldOut: boolean
}

interface FilterState {
  competition: CompetitionFilters
  partners: PartnerFilters
  stadium: StadiumTicketFilters
  setCompetitionFilter: <K extends keyof CompetitionFilters>(
    key: K,
    value: CompetitionFilters[K],
  ) => void
  resetCompetitionFilters: () => void
  setPartnerFilter: <K extends keyof PartnerFilters>(
    key: K,
    value: PartnerFilters[K],
  ) => void
  setStadiumFilter: <K extends keyof StadiumTicketFilters>(
    key: K,
    value: StadiumTicketFilters[K],
  ) => void
}

const defaultCompetition: CompetitionFilters = {
  city: '',
  team: '',
  date: '',
  venue: '',
  sort: 'upcoming',
}

const defaultPartners: PartnerFilters = {
  ticketCount: 2,
  sort: 'lowest',
  availability: 'all',
}

const defaultStadium: StadiumTicketFilters = {
  sort: 'recommended',
  zoneId: null,
  hiddenSoldOut: false,
}

export const useFilterStore = create<FilterState>((set) => ({
  competition: { ...defaultCompetition },
  partners: { ...defaultPartners },
  stadium: { ...defaultStadium },
  setCompetitionFilter: (key, value) =>
    set((state) => ({
      competition: { ...state.competition, [key]: value },
    })),
  resetCompetitionFilters: () =>
    set({ competition: { ...defaultCompetition } }),
  setPartnerFilter: (key, value) =>
    set((state) => ({
      partners: { ...state.partners, [key]: value },
    })),
  setStadiumFilter: (key, value) =>
    set((state) => ({
      stadium: { ...state.stadium, [key]: value },
    })),
}))
