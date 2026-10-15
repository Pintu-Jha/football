import { create } from 'zustand'

export type CurrencyCode = 'USD' | 'EUR' | 'GBP'
export type LanguageCode = 'en' | 'de' | 'es' | 'fr'

interface UiState {
  currency: CurrencyCode
  language: LanguageCode
  newsletterOpen: boolean
  newsletterSource: 'auto' | 'notify' | 'banner' | null
  mobileNavOpen: boolean
  setCurrency: (currency: CurrencyCode) => void
  setLanguage: (language: LanguageCode) => void
  openNewsletter: (source?: UiState['newsletterSource']) => void
  closeNewsletter: () => void
  setMobileNavOpen: (open: boolean) => void
}

export const useUiStore = create<UiState>((set) => ({
  currency: 'USD',
  language: 'en',
  newsletterOpen: false,
  newsletterSource: null,
  mobileNavOpen: false,
  setCurrency: (currency) => set({ currency }),
  setLanguage: (language) => set({ language }),
  openNewsletter: (source = 'banner') =>
    set({ newsletterOpen: true, newsletterSource: source }),
  closeNewsletter: () =>
    set({ newsletterOpen: false, newsletterSource: null }),
  setMobileNavOpen: (open) => set({ mobileNavOpen: open }),
}))
