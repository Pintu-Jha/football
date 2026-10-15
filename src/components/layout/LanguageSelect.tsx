import * as Select from '@radix-ui/react-select'
import { Check, ChevronDown, Languages } from 'lucide-react'

import { cn } from '@/lib/utils'
import {
  type LanguageCode,
  useUiStore,
} from '@/store/uiStore'

const languages: { value: LanguageCode; label: string }[] = [
  { value: 'en', label: 'English' },
  { value: 'de', label: 'Deutsch' },
  { value: 'es', label: 'Español' },
  { value: 'fr', label: 'Français' },
]

export interface LanguageSelectProps {
  className?: string
  tone?: 'light' | 'dark'
  compact?: boolean
  showIcon?: boolean
}

export function LanguageSelect({
  className,
  tone = 'dark',
  compact = false,
  showIcon = true,
}: LanguageSelectProps) {
  const language = useUiStore((s) => s.language)
  const setLanguage = useUiStore((s) => s.setLanguage)

  const isLight = tone === 'light'

  return (
    <Select.Root
      value={language}
      onValueChange={(value) => setLanguage(value as LanguageCode)}
    >
      <Select.Trigger
        className={cn(
          'inline-flex items-center gap-1.5 rounded-md border font-medium outline-none transition-colors',
          'focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2',
          compact ? 'h-9 px-2.5 text-xs sm:text-sm' : 'h-10 px-3 text-sm',
          isLight
            ? 'border-white/15 bg-white/5 text-white/90 hover:bg-white/10 data-[state=open]:bg-white/10'
            : 'border-border bg-surface-muted text-ink hover:bg-surface-subtle data-[state=open]:bg-surface-subtle',
          className,
        )}
        aria-label="Select language"
      >
        {showIcon ? (
          <Languages className="h-4 w-4 shrink-0 opacity-80" aria-hidden />
        ) : null}
        <Select.Value />
        <Select.Icon>
          <ChevronDown className="h-3.5 w-3.5 opacity-70" aria-hidden />
        </Select.Icon>
      </Select.Trigger>
      <Select.Portal>
        <Select.Content
          className="z-[100] min-w-[10rem] overflow-hidden rounded-lg border border-border bg-surface shadow-card"
          position="popper"
          sideOffset={6}
        >
          <Select.Viewport className="p-1">
            {languages.map((item) => (
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
