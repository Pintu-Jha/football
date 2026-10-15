import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'

import { CurrencySelect } from '@/components/layout/CurrencySelect'
import { LanguageSelect } from '@/components/layout/LanguageSelect'
import { Logo } from '@/components/layout/Logo'
import { footerColumns } from '@/data/home'
import { cn } from '@/lib/utils'

const socialLinks: { label: string; href: string; icon: ReactNode }[] = [
  {
    label: 'Facebook',
    href: 'https://facebook.com',
    icon: (
      <path d="M13.5 21v-7.5h2.5l.4-3h-2.9V8.6c0-.9.3-1.5 1.5-1.5h1.5V4.4c-.3 0-1.2-.1-2.2-.1-2.2 0-3.7 1.3-3.7 3.8v2.4H8v3h2.6V21h2.9Z" />
    ),
  },
  {
    label: 'Instagram',
    href: 'https://instagram.com',
    icon: (
      <path d="M12 7.4a4.6 4.6 0 1 0 0 9.2 4.6 4.6 0 0 0 0-9.2Zm0 7.6a3 3 0 1 1 0-6 3 3 0 0 1 0 6Zm4.8-8.9a1.1 1.1 0 1 0 0 2.2 1.1 1.1 0 0 0 0-2.2ZM12 3c-2.4 0-2.7 0-3.7.1-1 0-1.6.2-2.2.4a4.5 4.5 0 0 0-2.6 2.6c-.2.6-.4 1.2-.4 2.2C3 9.3 3 9.6 3 12s0 2.7.1 3.7c0 1 .2 1.6.4 2.2a4.5 4.5 0 0 0 2.6 2.6c.6.2 1.2.4 2.2.4 1 .1 1.3.1 3.7.1s2.7 0 3.7-.1c1 0 1.6-.2 2.2-.4a4.5 4.5 0 0 0 2.6-2.6c.2-.6.4-1.2.4-2.2.1-1 .1-1.3.1-3.7s0-2.7-.1-3.7c0-1-.2-1.6-.4-2.2a4.5 4.5 0 0 0-2.6-2.6c-.6-.2-1.2-.4-2.2-.4C14.7 3 14.4 3 12 3Zm0 1.6c2.4 0 2.6 0 3.6.1.9 0 1.4.2 1.7.3.4.2.7.4 1 .7.3.3.5.6.7 1 .1.3.3.8.3 1.7.1 1 .1 1.2.1 3.6s0 2.6-.1 3.6c0 .9-.2 1.4-.3 1.7-.2.4-.4.7-.7 1-.3.3-.6.5-1 .7-.3.1-.8.3-1.7.3-1 .1-1.2.1-3.6.1s-2.6 0-3.6-.1c-.9 0-1.4-.2-1.7-.3-.4-.2-.7-.4-1-.7-.3-.3-.5-.6-.7-1-.1-.3-.3-.8-.3-1.7-.1-1-.1-1.2-.1-3.6s0-2.6.1-3.6c0-.9.2-1.4.3-1.7.2-.4.4-.7.7-1 .3-.3.6-.5 1-.7.3-.1.8-.3 1.7-.3 1-.1 1.2-.1 3.6-.1Z" />
    ),
  },
  {
    label: 'X',
    href: 'https://x.com',
    icon: (
      <path d="M17.7 3.5h2.9l-6.4 7.3 7.5 9.7h-5.9l-4.6-6-5.3 6H3l6.8-7.8L2.6 3.5h6l4.2 5.5 4.9-5.5Zm-1 15.3h1.6L7.9 5.1H6.1l10.6 13.7Z" />
    ),
  },
  {
    label: 'YouTube',
    href: 'https://youtube.com',
    icon: (
      <path d="M21.6 7.2a2.5 2.5 0 0 0-1.8-1.8C18.2 5 12 5 12 5s-6.2 0-7.8.4A2.5 2.5 0 0 0 2.4 7.2C2 8.8 2 12 2 12s0 3.2.4 4.8a2.5 2.5 0 0 0 1.8 1.8C5.8 19 12 19 12 19s6.2 0 7.8-.4a2.5 2.5 0 0 0 1.8-1.8c.4-1.6.4-4.8.4-4.8s0-3.2-.4-4.8ZM10 15V9l5.2 3L10 15Z" />
    ),
  },
]

function PaymentLogos() {
  return (
    <ul className="flex flex-wrap items-center gap-x-4 gap-y-2" aria-label="Accepted payment methods">
      <li className="text-[18px] font-extrabold italic tracking-tight text-white">VISA</li>
      <li aria-label="Mastercard" className="flex items-center">
        <span className="size-5 rounded-full bg-[#eb001b]" />
        <span className="-ml-2 size-5 rounded-full bg-[#f79e1b] mix-blend-screen" />
      </li>
      <li className="text-[16px] font-bold italic text-white">PayPal</li>
      <li className="flex items-center gap-0.5 text-[15px] font-semibold text-white">
        <svg viewBox="0 0 24 24" className="size-4 fill-white" aria-hidden>
          <path d="M16.4 12.6c0-2.4 2-3.5 2-3.6-1.1-1.6-2.8-1.8-3.4-1.8-1.4-.2-2.8.8-3.5.8-.7 0-1.9-.8-3-.8-1.6 0-3 .9-3.8 2.3-1.6 2.8-.4 7 1.2 9.3.8 1.1 1.7 2.4 2.9 2.3 1.2 0 1.6-.7 3-.7s1.8.7 3 .7c1.3 0 2.1-1.1 2.8-2.3.9-1.3 1.3-2.6 1.3-2.6s-2.5-1-2.5-3.6ZM14.1 5.6c.6-.8 1.1-1.9 1-2.9-.9 0-2.1.6-2.7 1.4-.6.7-1.1 1.8-1 2.8 1 .1 2.1-.5 2.7-1.3Z" />
        </svg>
        Pay
      </li>
      <li className="text-[15px] font-semibold text-white">
        <span className="text-[#4285f4]">G</span> Pay
      </li>
    </ul>
  )
}

export function Footer({ className }: { className?: string }) {
  return (
    <footer className={cn('bg-ink text-white', className)}>
      <div className="container-home pb-6 pt-10 lg:pt-12">
        <div className="grid gap-10 lg:grid-cols-[1.35fr_1fr_1fr_1fr_1fr] lg:gap-8">
          <div className="max-w-[320px]">
            <Logo variant="light" />
            <p className="mt-4 text-[12px] leading-relaxed text-white/70">
              Your global marketplace for football, concerts, sports and live
              event tickets.
              <br />
              Safe. Simple. Unforgettable.
            </p>
            <ul className="mt-5 flex gap-2">
              {socialLinks.map(({ label, href, icon }) => (
                <li key={label}>
                  <a
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={label}
                    className="inline-flex size-8 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-brand"
                  >
                    <svg viewBox="0 0 24 24" className="size-4 fill-current" aria-hidden>
                      {icon}
                    </svg>
                  </a>
                </li>
              ))}
            </ul>
            <div className="mt-6">
              <PaymentLogos />
            </div>
          </div>

          {footerColumns.map((column) => (
            <div key={column.title}>
              <h3 className="mb-3 text-[13px] font-semibold text-white">
                {column.title}
              </h3>
              <ul className="flex flex-col gap-2">
                {column.links.map((link) => (
                  <li key={link.href + link.label}>
                    <Link
                      to={link.href}
                      className="text-[12px] text-white/65 transition-colors hover:text-white"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-8 flex flex-col gap-4 border-t border-white/10 pt-5 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-[12px] text-white/60">
            © 2025 FootballTicketClub. All rights reserved.
          </p>
          <div className="flex flex-wrap items-center gap-2">
            <LanguageSelect tone="light" compact />
            <CurrencySelect tone="light" />
          </div>
        </div>
      </div>
    </footer>
  )
}
