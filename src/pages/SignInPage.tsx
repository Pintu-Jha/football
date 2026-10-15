import { Mail } from 'lucide-react'
import { type FormEvent, useRef, useState } from 'react'
import { Link, Navigate, useNavigate, useSearchParams } from 'react-router-dom'

import { shake } from '@/components/auth/authMotion'
import { withRedirect } from '@/components/auth/authUtils'
import { AuthShell } from '@/components/auth/AuthShell'
import { FormError } from '@/components/auth/FormError'
import { PasswordField } from '@/components/auth/PasswordField'
import { safeRedirect } from '@/components/auth/RequireAuth'
import { SubmitButton } from '@/components/auth/SubmitButton'
import { TextField } from '@/components/auth/TextField'
import { Seo } from '@/components/seo/Seo'
import { useRouteScrollReset } from '@/hooks/useRouteScrollReset'
import { useAuthStore } from '@/store/authStore'

export function SignInPage() {
  useRouteScrollReset()

  const navigate = useNavigate()
  const [params] = useSearchParams()
  const redirectParam = params.get('redirect')
  const target = safeRedirect(redirectParam, '/')

  const user = useAuthStore((s) => s.user)
  const signIn = useAuthStore((s) => s.signIn)

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [formError, setFormError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)

  const submittingRef = useRef(false)
  const formRef = useRef<HTMLFormElement | null>(null)
  const passwordRef = useRef<HTMLInputElement | null>(null)

  if (user) {
    return <Navigate to={target} replace />
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (submittingRef.current) return

    setFormError(null)
    submittingRef.current = true
    setSubmitting(true)
    const result = await signIn(email, password)
    submittingRef.current = false
    setSubmitting(false)

    if (!result.ok) {
      setFormError(result.error)
      setPassword('')
      shake(formRef.current)
      passwordRef.current?.focus()
      return
    }

    navigate(target, { replace: true })
  }

  return (
    <>
      <Seo
        title="Sign in | FootballTicketClub"
        description="Sign in to FootballTicketClub to manage your bookings and price alerts."
      />
      <AuthShell
        eyebrow="Welcome back"
        title="Sign in to your account"
        subtitle="Access your bookings, saved matches and price alerts."
        footer={
          <>
            New to FootballTicketClub?{' '}
            <Link
              to={withRedirect('/signup', redirectParam)}
              className="font-semibold text-brand hover:underline focus-visible:rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand"
            >
              Create an account
            </Link>
          </>
        }
      >
        <form
          ref={formRef}
          noValidate
          onSubmit={handleSubmit}
          className="space-y-5"
          aria-label="Sign in"
        >
          {formError ? (
            <div>
              <FormError>{formError}</FormError>
            </div>
          ) : null}

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

          <div data-auth-reveal className="space-y-2">
            <PasswordField
              ref={passwordRef}
              label="Password"
              name="password"
              autoComplete="current-password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <div className="flex justify-end">
              <Link
                to="/forgot-password"
                className="rounded text-sm font-semibold text-brand hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand"
              >
                Forgot password?
              </Link>
            </div>
          </div>

          <div data-auth-reveal>
            <SubmitButton loading={submitting} loadingLabel={'Signing in\u2026'}>
              Sign in
            </SubmitButton>
          </div>
        </form>
      </AuthShell>
    </>
  )
}
