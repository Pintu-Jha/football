import { Eye, EyeOff, Lock } from 'lucide-react'
import { forwardRef, useState } from 'react'

import { TextField, type TextFieldProps } from '@/components/auth/TextField'

export type PasswordFieldProps = Omit<TextFieldProps, 'type' | 'trailing'>

export const PasswordField = forwardRef<HTMLInputElement, PasswordFieldProps>(
  function PasswordField({ icon = Lock, ...props }, ref) {
    const [visible, setVisible] = useState(false)

    return (
      <TextField
        ref={ref}
        icon={icon}
        type={visible ? 'text' : 'password'}
        autoCapitalize="none"
        spellCheck={false}
        trailing={
          <button
            type="button"
            onClick={() => setVisible((v) => !v)}
            aria-label={visible ? 'Hide password' : 'Show password'}
            aria-pressed={visible}
            className="flex size-9 items-center justify-center rounded-lg text-muted transition-colors hover:bg-surface-subtle hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand"
          >
            {visible ? (
              <EyeOff className="size-[1.125rem]" aria-hidden />
            ) : (
              <Eye className="size-[1.125rem]" aria-hidden />
            )}
          </button>
        }
        {...props}
      />
    )
  },
)
