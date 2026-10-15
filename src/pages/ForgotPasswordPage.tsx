import { ArrowLeft, KeyRound, Mail } from 'lucide-react'
import { type FormEvent, useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

import { shake } from '@/components/auth/authMotion'
import { validateEmail } from '@/components/auth/authUtils'
import { AuthShell } from '@/components/auth/AuthShell'
import { FormError } from '@/components/auth/FormError'
import { SubmitButton } from '@/components/auth/SubmitButton'
import { TextField } from '@/components/auth/TextField'
import { Seo } from '@/components/seo/Seo'
import { useRouteScrollReset } from '@/hooks/useRouteScrollReset'
import { useAuthStore } from '@/store/authStore'

export function ForgotPasswordPage() {
  useRouteScrollReset()

  const navigate = useNavigate()
  const requestPasswordReset = useAuthStore((s) => s.requestPasswordReset)

  const [email, setEmail] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [formError, setFormError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)

  const submittingRef = useRef(false)
  const formRef = useRef<HTMLFormElement | null>(null)
  const emailRef = useRef<HTMLInputElement | null>(null)

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (submittingRef.current) return

    const validation = validateEmail(email)
    setError(validation)
    setFormError(null)
    if (validation) {
      shake(formRef.current)
      emailRef.current?.focus()
      return
    }

    submittingRef.current = true
    setSubmitting(true)
    const result = await requestPasswordReset(email)
    submittingRef.current = false
    setSubmitting(false)

    if (!result.ok) {
      setFormError(result.error)
      shake(formRef.current)
      return
    }

    navigate('/verify-otp')
  }

  return (
    <>
      <Seo
        title="Forgot password | FootballTicketClub"
        description="Reset your FootballTicketClub password with a one-time code."
      />
      <AuthShell
        eyebrow="Account recovery"
        title="Forgot your password?"
        subtitle="Enter your email address. If an account exists for it, we&rsquo;ll send a 6-digit code to reset your password."
        panelTitle={
          <>
            Locked out?
            <br />
            We&rsquo;ve got you
          </>
        }
        panelText="Reset your password in a couple of minutes and get straight back to your matches."
        footer={
          <Link
            to="/signin"
            className="inline-flex items-center gap-1.5 rounded font-semibold text-brand hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand"
          >
            <ArrowLeft className="size-4" aria-hidden />
            Back to sign in
          </Link>
        }
      >
        <form
          ref={formRef}
          noValidate
          onSubmit={handleSubmit}
          className="space-y-5"
          aria-label="Request password reset"
        >
          {formError ? (
            <div>
              <FormError>{formError}</FormError>
            </div>
          ) : null}

          <div data-auth-reveal>
            <TextField
              ref={emailRef}
              label="Email address"
              name="email"
              type="email"
              icon={Mail}
              autoComplete="email"
              inputMode="email"
              autoCapitalize="none"
              spellCheck={false}
              placeholder="you@example.com"
              value={email}
              error={error}
              onChange={(e) => {
                setEmail(e.target.value)
                if (error) setError(null)
              }}
              onBlur={() => {
                if (email) setError(validateEmail(email))
              }}
            />
          </div>

          <div data-auth-reveal>
            <SubmitButton loading={submitting} loadingLabel={'Sending code\u2026'}>
              <KeyRound className="size-4" aria-hidden />
              Send reset code
            </SubmitButton>
          </div>
        </form>
      </AuthShell>
    </>
  )
}
