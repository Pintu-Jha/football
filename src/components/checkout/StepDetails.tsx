import { type FormEvent, useId, useState } from 'react'

import { FormField } from '@/components/checkout/FormField'
import {
  type BuyerErrors,
  validateBuyer,
} from '@/components/checkout/validation'
import { Button } from '@/components/ui/Button'
import type { BuyerDetails } from '@/store/bookingStore'

type FieldName = keyof BuyerDetails

const FIELD_ORDER: FieldName[] = ['fullName', 'email', 'phone']

export interface StepDetailsProps {
  buyer: BuyerDetails
  onChange: (patch: Partial<BuyerDetails>) => void
  onBack: () => void
  onContinue: () => void
}

export function StepDetails({
  buyer,
  onChange,
  onBack,
  onContinue,
}: StepDetailsProps) {
  const baseId = useId()
  const [touched, setTouched] = useState<Partial<Record<FieldName, boolean>>>(
    {},
  )

  const errors: BuyerErrors = validateBuyer(buyer)
  const visibleError = (field: FieldName): string | undefined =>
    touched[field] ? errors[field] : undefined

  const idFor = (field: FieldName) => `${baseId}-${field}`
  const touch = (field: FieldName) =>
    setTouched((t) => (t[field] ? t : { ...t, [field]: true }))

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const all = validateBuyer(buyer)
    setTouched({ fullName: true, email: true, phone: true })
    const firstInvalid = FIELD_ORDER.find((f) => all[f])
    if (firstInvalid) {
      document.getElementById(idFor(firstInvalid))?.focus()
      return
    }
    onContinue()
  }

  return (
    <form
      onSubmit={handleSubmit}
      noValidate
      className="space-y-5"
      aria-label="Your details"
    >
      <div className="space-y-5 rounded-xl border border-border bg-surface p-5 shadow-soft sm:p-6">
        <FormField
          id={idFor('fullName')}
          label="Full name"
          required
          autoComplete="name"
          value={buyer.fullName}
          onChange={(e) => onChange({ fullName: e.target.value })}
          onBlur={() => touch('fullName')}
          error={visibleError('fullName')}
        />
        <FormField
          id={idFor('email')}
          label="Email address"
          type="email"
          required
          autoComplete="email"
          inputMode="email"
          spellCheck={false}
          value={buyer.email}
          onChange={(e) => onChange({ email: e.target.value })}
          onBlur={() => touch('email')}
          hint="Your tickets will be sent to this email."
          error={visibleError('email')}
        />
        <FormField
          id={idFor('phone')}
          label="Phone number"
          type="tel"
          required
          autoComplete="tel"
          inputMode="tel"
          placeholder="+44 7700 900123"
          value={buyer.phone}
          onChange={(e) => onChange({ phone: e.target.value })}
          onBlur={() => touch('phone')}
          hint="Used only for urgent updates about your order."
          error={visibleError('phone')}
        />
      </div>

      <div className="flex flex-col-reverse gap-3 pt-1 sm:flex-row sm:justify-between">
        <Button variant="secondary" size="lg" onClick={onBack}>
          Back
        </Button>
        <Button type="submit" size="lg">
          Continue to payment
        </Button>
      </div>
    </form>
  )
}
