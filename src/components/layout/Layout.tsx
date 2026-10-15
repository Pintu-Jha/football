import type { ReactNode } from 'react'
import { Outlet } from 'react-router-dom'

import { Footer } from '@/components/layout/Footer'
import { MobileNav } from '@/components/layout/MobileNav'
import { Navbar } from '@/components/layout/Navbar'
import { MotionRoot } from '@/components/motion/MotionRoot'
import { NewsletterModal } from '@/components/modal/NewsletterModal'
import { useLenis } from '@/hooks/useLenis'
import { useRouteScrollReset } from '@/hooks/useRouteScrollReset'

export interface LayoutProps {
  children?: ReactNode
}

export function Layout({ children }: LayoutProps) {
  useLenis()
  useRouteScrollReset()

  return (
    <div className="flex min-h-screen flex-col bg-surface text-ink">
      <a href="#main-content" className="skip-link">
        Skip to main content
      </a>
      <MotionRoot />
      <Navbar />
      <MobileNav />
      <main id="main-content" className="flex-1" tabIndex={-1}>
        {children ?? <Outlet />}
      </main>
      <Footer />
      <NewsletterModal />
    </div>
  )
}
