import * as Accordion from '@radix-ui/react-accordion'
import * as Dialog from '@radix-ui/react-dialog'
import { ChevronDown, X } from 'lucide-react'
import { useEffect } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'

import { Button } from '@/components/ui/Button'
import { CurrencySelect } from '@/components/layout/CurrencySelect'
import { LanguageSelect } from '@/components/layout/LanguageSelect'
import { Logo } from '@/components/layout/Logo'
import {
  footballCompetitions,
  getSimpleNavMenu,
  navItems,
} from '@/data/navigation'
import { useAuthStore } from '@/store/authStore'
import { useUiStore } from '@/store/uiStore'

export function MobileNav() {
  const open = useUiStore((s) => s.mobileNavOpen)
  const setMobileNavOpen = useUiStore((s) => s.setMobileNavOpen)
  const { pathname } = useLocation()
  const navigate = useNavigate()
  const user = useAuthStore((s) => s.user)
  const signOut = useAuthStore((s) => s.signOut)

  useEffect(() => {
    setMobileNavOpen(false)
  }, [pathname, setMobileNavOpen])

  useEffect(() => {
    if (!open) return undefined
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = prev
    }
  }, [open])

  const close = () => setMobileNavOpen(false)

  return (
    <Dialog.Root open={open} onOpenChange={setMobileNavOpen}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-[60] bg-ink/70 backdrop-blur-sm data-[state=open]:opacity-100 data-[state=closed]:opacity-0 transition-opacity duration-300" />
        <Dialog.Content
          className="fixed inset-y-0 left-0 z-[70] flex w-full max-w-sm flex-col bg-ink shadow-lift outline-none transition-transform duration-300 data-[state=closed]:-translate-x-full data-[state=open]:translate-x-0"
          aria-describedby={undefined}
        >
          <Dialog.Title className="sr-only">Site navigation</Dialog.Title>
          <div className="flex h-16 items-center justify-between border-b border-white/10 px-4">
            <Logo variant="light" />
            <Dialog.Close asChild>
              <Button
                type="button"
                variant="ghost-light"
                size="icon"
                aria-label="Close menu"
              >
                <X className="h-6 w-6" aria-hidden />
              </Button>
            </Dialog.Close>
          </div>

          <nav
            className="flex-1 overflow-y-auto px-4 py-4"
            aria-label="Mobile"
          >
            <Accordion.Root type="multiple" className="flex flex-col gap-2">
              <Accordion.Item value="football" className="border-b border-white/10 pb-2">
                <Accordion.Header>
                  <Accordion.Trigger className="group flex w-full items-center justify-between rounded-lg py-3 text-left text-base font-semibold text-white">
                    Football
                    <ChevronDown
                      className="h-5 w-5 text-white/60 transition-transform duration-200 group-data-[state=open]:rotate-180"
                      aria-hidden
                    />
                  </Accordion.Trigger>
                </Accordion.Header>
                <Accordion.Content className="overflow-hidden data-[state=closed]:hidden data-[state=open]:block">
                  <ul className="flex flex-col gap-1 pb-3 pl-1">
                    {footballCompetitions.map((competition) => (
                      <li key={competition.id}>
                        <Link
                          to={competition.href}
                          className="block rounded-lg px-3 py-2.5 text-sm text-white/85 hover:bg-white/10"
                          onClick={close}
                        >
                          {competition.label}
                        </Link>
                        <ul className="mb-2 ml-3 border-l border-white/10 pl-3">
                          {competition.teams.slice(0, 4).map((team) => (
                            <li key={team.href + team.label}>
                              <Link
                                to={team.href}
                                className="block py-1.5 text-xs text-white/60 hover:text-white"
                                onClick={close}
                              >
                                {team.label}
                              </Link>
                            </li>
                          ))}
                        </ul>
                      </li>
                    ))}
                  </ul>
                </Accordion.Content>
              </Accordion.Item>

              {navItems
                .filter((item) => item.type === 'simple')
                .map((item) => {
                  const menu = getSimpleNavMenu(item.id)
                  if (!menu) return null
                  return (
                    <Accordion.Item
                      key={item.id}
                      value={item.id}
                      className="border-b border-white/10 pb-2"
                    >
                      <Accordion.Header>
                        <Accordion.Trigger className="group flex w-full items-center justify-between rounded-lg py-3 text-left text-base font-semibold text-white">
                          {menu.label}
                          <ChevronDown
                            className="h-5 w-5 text-white/60 transition-transform duration-200 group-data-[state=open]:rotate-180"
                            aria-hidden
                          />
                        </Accordion.Trigger>
                      </Accordion.Header>
                      <Accordion.Content className="overflow-hidden">
                        <ul className="flex flex-col gap-0.5 pb-3">
                          {menu.links.map((link) => (
                            <li key={link.href + link.label}>
                              <Link
                                to={link.href}
                                className="block rounded-lg px-3 py-2.5 text-sm text-white/85 hover:bg-white/10"
                                onClick={close}
                              >
                                {link.label}
                              </Link>
                            </li>
                          ))}
                        </ul>
                      </Accordion.Content>
                    </Accordion.Item>
                  )
                })}
            </Accordion.Root>

            <div className="mt-6 flex flex-col gap-3 border-t border-white/10 pt-6">
              <Link
                to="/#help"
                className="rounded-lg px-3 py-2.5 text-sm font-medium text-white/90 hover:bg-white/10"
                onClick={close}
              >
                Help
              </Link>
              {user ? (
                <>
                  <Link
                    to="/account/bookings"
                    className="rounded-lg px-3 py-2.5 text-sm font-medium text-white/90 hover:bg-white/10"
                    onClick={close}
                  >
                    My bookings
                  </Link>
                  <button
                    type="button"
                    className="rounded-lg px-3 py-2.5 text-left text-sm font-medium text-white/90 hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand"
                    onClick={() => {
                      close()
                      signOut()
                      navigate('/')
                    }}
                  >
                    Sign out
                  </button>
                </>
              ) : (
                <Link
                  to="/signin"
                  className="rounded-lg px-3 py-2.5 text-sm font-medium text-white/90 hover:bg-white/10"
                  onClick={close}
                >
                  Sign in
                </Link>
              )}
              <Button asChild className="w-full">
                <Link to="/#sell" onClick={close}>
                  Sell Tickets
                </Link>
              </Button>
            </div>
          </nav>

          <div className="flex items-center justify-between gap-3 border-t border-white/10 p-4">
            <LanguageSelect tone="light" compact showIcon />
            <CurrencySelect tone="light" />
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}
