import { useGSAP } from '@gsap/react'
import { ChevronDown, Menu, User } from 'lucide-react'
import { useRef } from 'react'
import { Link, useLocation } from 'react-router-dom'

import { Button } from '@/components/ui/Button'
import { CurrencySelect } from '@/components/layout/CurrencySelect'
import { Logo } from '@/components/layout/Logo'
import { MegaMenu } from '@/components/layout/MegaMenu'
import { SimpleDropdown } from '@/components/layout/SimpleDropdown'
import { UserMenu } from '@/components/layout/UserMenu'
import { getSimpleNavMenu, navItems } from '@/data/navigation'
import { useScrollDirection } from '@/hooks/useScrollDirection'
import { gsap, prefersReducedMotion } from '@/lib/gsap'
import { MOTION } from '@/lib/motion'
import { cn } from '@/lib/utils'
import { useAuthStore } from '@/store/authStore'
import { useUiStore } from '@/store/uiStore'

export interface NavbarProps {
  /** Force transparent hero styling (ignored on home — design uses white sticky) */
  transparent?: boolean
}

export function Navbar({ transparent }: NavbarProps) {
  const { pathname } = useLocation()
  const { direction, scrolled } = useScrollDirection()
  const user = useAuthStore((s) => s.user)
  const mobileNavOpen = useUiStore((s) => s.mobileNavOpen)
  const setMobileNavOpen = useUiStore((s) => s.setMobileNavOpen)
  const footballGroupRef = useRef<HTMLDivElement | null>(null)
  const megaPanelRef = useRef<HTMLDivElement | null>(null)

  const isHome = pathname === '/'
  const isCompetition = pathname.startsWith('/football/')
  const isMatch = pathname.startsWith('/match/')
  void transparent
  /* Home + match pages: white sticky. Competition: transparent over the maroon hero, white after scroll. */
  const alwaysWhite = isHome || isMatch
  const useWhiteBar = alwaysWhite || scrolled
  const hideNav = scrolled && direction === 'down' && !alwaysWhite && !isCompetition

  useGSAP(
    () => {
      const group = footballGroupRef.current
      const panel = megaPanelRef.current
      if (!group || !panel || prefersReducedMotion()) {
        return
      }

      const open = () => {
        const menu = panel.querySelector('[data-mega-root]')
        const items = panel.querySelectorAll('[data-mega-item]')
        gsap.killTweensOf([menu, items])
        if (menu) {
          gsap.fromTo(
            menu,
            { y: -10, opacity: 0.6 },
            {
              y: 0,
              opacity: 1,
              duration: MOTION.duration.fast,
              ease: MOTION.ease.out,
            },
          )
        }
        if (items.length > 0) {
          gsap.fromTo(
            items,
            { opacity: 0, y: 8 },
            {
              opacity: 1,
              y: 0,
              duration: MOTION.duration.fast,
              stagger: 0.025,
              ease: MOTION.ease.out,
            },
          )
        }
      }

      group.addEventListener('mouseenter', open)
      group.addEventListener('focusin', open)

      return () => {
        group.removeEventListener('mouseenter', open)
        group.removeEventListener('focusin', open)
      }
    },
    { scope: footballGroupRef },
  )

  const linkClass = useWhiteBar
    ? 'text-ink hover:bg-surface-muted'
    : 'text-white/90 hover:bg-white/10'

  return (
    <header
      className={cn(
        'fixed inset-x-0 top-0 z-50 transition-transform duration-300 ease-out',
        hideNav ? '-translate-y-full' : 'translate-y-0',
      )}
    >
      <div
        className={cn(
          'border-b transition-[background-color,border-color,box-shadow] duration-300',
          useWhiteBar
            ? 'border-border bg-white shadow-nav'
            : 'border-transparent bg-transparent',
        )}
      >
        <div className="container-home flex h-14 items-center justify-between gap-4">
          <div className="flex min-w-0 items-center gap-5 lg:gap-8">
          <Logo
            variant={useWhiteBar ? 'dark' : 'light'}
            className="shrink-0"
          />

          <nav
            className="hidden items-center gap-0.5 lg:flex"
            aria-label="Primary"
          >
            {navItems.map((item) => {
              if (item.type === 'mega') {
                return (
                  <div
                    key={item.id}
                    ref={footballGroupRef}
                    className="group/football relative"
                  >
                    <Link
                      to="/football/premier-league"
                      className={cn(
                        'relative inline-flex items-center gap-1 px-2.5 py-2 text-xs font-medium transition-colors',
                        useWhiteBar
                          ? 'text-ink group-hover/football:text-brand group-focus-within/football:text-brand'
                          : 'text-white/90 group-hover/football:text-white',
                      )}
                      aria-haspopup="true"
                      aria-controls="football-mega-menu"
                      id="nav-football-trigger"
                    >
                      {item.label}
                      <ChevronDown className="size-3 opacity-70" aria-hidden />
                      <span
                        className="absolute inset-x-2 -bottom-px h-0.5 bg-brand opacity-0 transition-opacity group-hover/football:opacity-100 group-focus-within/football:opacity-100"
                        aria-hidden
                      />
                    </Link>
                    <div
                      ref={megaPanelRef}
                      id="football-mega-menu"
                      className={cn(
                        'pointer-events-none invisible absolute left-0 top-full z-50 pt-3 opacity-0 transition-opacity duration-200',
                        'group-hover/football:pointer-events-auto group-hover/football:visible group-hover/football:opacity-100',
                        'group-focus-within/football:pointer-events-auto group-focus-within/football:visible group-focus-within/football:opacity-100',
                      )}
                      role="region"
                      aria-labelledby="nav-football-trigger"
                    >
                      <MegaMenu />
                    </div>
                  </div>
                )
              }

              const menu = getSimpleNavMenu(item.id)
              if (!menu) return null

              return (
                <SimpleDropdown
                  key={item.id}
                  label={menu.label}
                  links={menu.links}
                  tone={useWhiteBar ? 'dark' : 'light'}
                />
              )
            })}
          </nav>
          </div>

          <div className="flex items-center gap-0.5 sm:gap-1">
            <CurrencySelect
              tone={useWhiteBar ? 'dark' : 'light'}
              className="hidden sm:inline-flex"
            />

            <Link
              to="/#help"
              className={cn(
                'hidden rounded-md px-2.5 py-2 text-xs font-medium transition-colors md:inline-block',
                linkClass,
              )}
            >
              Help
            </Link>

            {user ? (
              <UserMenu user={user} />
            ) : (
              <Link
                to="/signin"
                className={cn(
                  'hidden items-center gap-1.5 rounded-md px-2.5 py-2 text-xs font-medium transition-colors lg:inline-flex',
                  linkClass,
                )}
              >
                <User className="size-3.5 opacity-80" aria-hidden />
                Sign in
              </Link>
            )}

            <Button
              asChild
              size="sm"
              magnetic
              className="hidden h-9 rounded-lg px-4 text-xs font-semibold sm:inline-flex"
            >
              <Link to="/#sell">Sell Tickets</Link>
            </Button>

            <Button
              type="button"
              variant={useWhiteBar ? 'ghost' : 'ghost-light'}
              size="icon"
              className="lg:hidden"
              aria-label="Open menu"
              aria-expanded={mobileNavOpen}
              onClick={() => setMobileNavOpen(true)}
            >
              <Menu className="h-6 w-6" aria-hidden />
            </Button>
          </div>
        </div>
      </div>
    </header>
  )
}
