import { Mail, User } from 'lucide-react'
import { type FormEvent, useRef, useState } from 'react'
import { Link, Navigate, useNavigate, useSearchParams } from 'react-router-dom'

import { shake } from '@/components/auth/authMotion'
import { withRedirect } from '@/components/auth/authUtils'
import { AuthShell } from '@/components/auth/AuthShell'
import { FormError } from '@/components/auth/FormError'
import { PasswordField } from '@/components/auth/PasswordField'
import { PasswordStrength } from '@/components/auth/PasswordStrength'
import { safeRedirect } from '@/components/auth/RequireAuth'
import { SubmitButton } from '@/components/auth/SubmitButton'
import { TextField } from '@/components/auth/TextField'
import { Seo } from '@/components/seo/Seo'
import { Checkbox } from '@/components/ui/Checkbox'
import { useRouteScrollReset } from '@/hooks/useRouteScrollReset'
import { useAuthStore } from '@/store/authStore'

const LINK_CLASS =
  'font-semibold text-brand hover:underline focus-visible:rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand'

export function SignUpPage() {
  useRouteScrollReset()

  const navigate = useNavigate()
  const [params] = useSearchParams()
  const redirectParam = params.get('redirect')

  const user = useAuthStore((s) => s.user)
  const signUp = useAuthStore((s) => s.signUp)

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [terms, setTerms] = useState(false)
  const [formError, setFormError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)

  const submittingRef = useRef(false)
  const formRef = useRef<HTMLFormElement | null>(null)

  if (user) {
    return <Navigate to={safeRedirect(redirectParam, '/')} replace />
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (submittingRef.current) return

    setFormError(null)
    submittingRef.current = true
    setSubmitting(true)
    const result = await signUp({ name, email, password })
    submittingRef.current = false
    setSubmitting(false)

    if (!result.ok) {
      setFormError(result.error)
      shake(formRef.current)
      return
    }

    navigate(withRedirect('/verify-otp', redirectParam))
  }

  return (
    <>
      <Seo
        title="Create account | FootballTicketClub"
        description="Create a free FootballTicketClub account to track prices, compare offers and manage bookings."
      />
      <AuthShell
        eyebrow="Join the club"
        title="Create your account"
        subtitle="It takes less than a minute. We&rsquo;ll send a code to verify your email address."
        panelTitle={
          <>
            Never miss a
            <br />
            matchday again
          </>
        }
        footer={
          <>
            Already have an account?{' '}
            <Link to={withRedirect('/signin', redirectParam)} className={LINK_CLASS}>
              Sign in
            </Link>
          </>
        }
      >
        <form
          ref={formRef}
          noValidate
          onSubmit={handleSubmit}
          className="space-y-4"
          aria-label="Create account"
        >
          {formError ? (
            <div>
              <FormError>{formError}</FormError>
            </div>
          ) : null}

          <div data-auth-reveal>
            <TextField
              label="Full name"
              name="name"
              icon={User}
              autoComplete="name"
              placeholder="Jane Smith"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div data-auth-reveal>
            <TextField
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
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div data-auth-reveal className="space-y-3">
            <PasswordField
              label="Password"
              name="new-password"
              autoComplete="new-password"
              placeholder="Create a password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <PasswordStrength password={password} />
          </div>

          <div data-auth-reveal>
            <PasswordField
              label="Confirm password"
              name="confirm-password"
              autoComplete="new-password"
              placeholder="Re-enter your password"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
            />
          </div>

          <div data-auth-reveal>
            <div className="flex items-start gap-3">
              <Checkbox
                id="signup-terms"
                checked={terms}
                onCheckedChange={(value) => setTerms(value === true)}
                className="mt-0.5"
              />
              <label
                htmlFor="signup-terms"
                className="cursor-pointer text-sm leading-relaxed text-muted"
              >
                I agree to the{' '}
                <Link
                  to="/#terms"
                  target="_blank"
                  rel="noreferrer"
                  className={LINK_CLASS}
                >
                  Terms of Use
                </Link>{' '}
                and{' '}
                <Link
                  to="/#privacy"
                  target="_blank"
                  rel="noreferrer"
                  className={LINK_CLASS}
                >
                  Privacy Policy
                </Link>
              </label>
            </div>
          </div>

          <div data-auth-reveal className="pt-1">
            <SubmitButton
              loading={submitting}
              loadingLabel={'Creating account\u2026'}
            >
              Create account
            </SubmitButton>
          </div>
        </form>
      </AuthShell>
    </>
  )
}
