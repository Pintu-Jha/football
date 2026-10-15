import * as Popover from '@radix-ui/react-popover'
import { ChevronDown, LogOut, Ticket } from 'lucide-react'
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

import { cn } from '@/lib/utils'
import { type AuthUser, useAuthStore } from '@/store/authStore'

function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean)
  const first = parts[0]?.charAt(0) ?? ''
  const last = parts.length > 1 ? (parts[parts.length - 1]?.charAt(0) ?? '') : ''
  return (first + last).toUpperCase() || '?'
}

function getFirstName(name: string): string {
  return name.trim().split(/\s+/)[0] ?? name
}

export interface UserMenuProps {
  user: AuthUser
  className?: string
}

export function UserMenu({ user, className }: UserMenuProps) {
  const [open, setOpen] = useState(false)
  const navigate = useNavigate()
  const signOut = useAuthStore((s) => s.signOut)

  const handleSignOut = () => {
    setOpen(false)
    signOut()
    navigate('/')
  }

  return (
    <Popover.Root open={open} onOpenChange={setOpen}>
      <Popover.Trigger asChild>
        <button
          type="button"
          aria-label={`Account menu for ${user.name}`}
          className={cn(
            'inline-flex h-10 items-center gap-2 rounded-full pl-1 pr-2 text-sm font-medium text-white/90 transition-colors sm:pr-3',
            'hover:bg-white/10 data-[state=open]:bg-white/10',
            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 focus-visible:ring-offset-transparent',
            className,
          )}
        >
          <span
            className="flex size-8 items-center justify-center rounded-full bg-brand text-xs font-bold text-white"
            aria-hidden
          >
            {getInitials(user.name)}
          </span>
          <span className="hidden max-w-[7rem] truncate sm:inline">
            {getFirstName(user.name)}
          </span>
          <ChevronDown className="hidden size-3.5 opacity-70 sm:block" aria-hidden />
        </button>
      </Popover.Trigger>
      <Popover.Portal>
        <Popover.Content
          align="end"
          sideOffset={8}
          aria-label="Account menu"
          className="z-[100] w-64 overflow-hidden rounded-xl border border-border bg-surface text-ink shadow-card outline-none"
        >
          <div className="border-b border-border px-4 py-3">
            <p className="truncate text-sm font-bold text-ink">{user.name}</p>
            <p className="truncate text-xs text-muted">{user.email}</p>
          </div>
          <div className="p-1.5">
            <Link
              to="/account/bookings"
              onClick={() => setOpen(false)}
              className="flex items-center gap-2.5 rounded-lg px-3 py-2.5 text-sm font-medium text-ink transition-colors hover:bg-surface-muted focus-visible:bg-surface-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand"
            >
              <Ticket className="size-4 text-muted" aria-hidden />
              My bookings
            </Link>
            <button
              type="button"
              onClick={handleSignOut}
              className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2.5 text-left text-sm font-medium text-ink transition-colors hover:bg-surface-muted focus-visible:bg-surface-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand"
            >
              <LogOut className="size-4 text-muted" aria-hidden />
              Sign out
            </button>
          </div>
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  )
}
