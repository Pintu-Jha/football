import * as Select from '@radix-ui/react-select'
import { Check, ChevronDown, Globe } from 'lucide-react'

import { cn } from '@/lib/utils'
import {
  type CurrencyCode,
  useUiStore,
} from '@/store/uiStore'

const currencies: { value: CurrencyCode; label: string }[] = [
  { value: 'USD', label: 'USD' },
  { value: 'EUR', label: 'EUR' },
  { value: 'GBP', label: 'GBP' },
]

export interface CurrencySelectProps {
  className?: string
  /** Light text for dark backgrounds (navbar / footer) */
  tone?: 'light' | 'dark'
  compact?: boolean
}

export function CurrencySelect({
  className,
  tone = 'light',
  compact = true,
}: CurrencySelectProps) {
  const currency = useUiStore((s) => s.currency)
  const setCurrency = useUiStore((s) => s.setCurrency)

  const isLight = tone === 'light'

  return (
    <Select.Root
      value={currency}
      onValueChange={(value) => setCurrency(value as CurrencyCode)}
    >
      <Select.Trigger
        className={cn(
          'inline-flex items-center gap-1.5 rounded-md border border-transparent bg-transparent font-medium outline-none transition-colors',
          'focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 focus-visible:ring-offset-transparent',
          compact ? 'h-9 px-2 text-xs sm:text-sm' : 'h-10 px-3 text-sm',
          isLight
            ? 'text-white/90 hover:bg-white/10 data-[state=open]:bg-white/10'
            : 'text-muted hover:bg-surface-muted data-[state=open]:bg-surface-muted',
          className,
        )}
        aria-label="Select currency"
      >
        <Globe className="h-4 w-4 shrink-0 opacity-80" aria-hidden />
        <Select.Value />
        <Select.Icon>
          <ChevronDown className="h-3.5 w-3.5 opacity-70" aria-hidden />
        </Select.Icon>
      </Select.Trigger>
      <Select.Portal>
        <Select.Content
          className="z-[100] min-w-[8rem] overflow-hidden rounded-lg border border-border bg-surface shadow-card"
          position="popper"
          sideOffset={6}
        >
          <Select.Viewport className="p-1">
            {currencies.map((item) => (
              <Select.Item
                key={item.value}
                value={item.value}
                className={cn(
                  'relative flex cursor-pointer select-none items-center rounded-md py-2 pl-8 pr-3 text-sm text-ink outline-none',
                  'data-[highlighted]:bg-surface-muted data-[state=checked]:font-semibold',
                )}
              >
                <Select.ItemIndicator className="absolute left-2 inline-flex items-center">
                  <Check className="h-4 w-4 text-brand" aria-hidden />
                </Select.ItemIndicator>
                <Select.ItemText>{item.label}</Select.ItemText>
              </Select.Item>
            ))}
          </Select.Viewport>
        </Select.Content>
      </Select.Portal>
    </Select.Root>
  )
}
