import { type FormEvent, useRef, useState } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'

import { shake } from '@/components/auth/authMotion'
import {
  validateConfirmPassword,
  validateNewPassword,
} from '@/components/auth/authUtils'
import { AuthShell } from '@/components/auth/AuthShell'
import { FormError } from '@/components/auth/FormError'
import { PasswordField } from '@/components/auth/PasswordField'
import { PasswordStrength } from '@/components/auth/PasswordStrength'
import { SubmitButton } from '@/components/auth/SubmitButton'
import { SuccessCheck } from '@/components/auth/SuccessCheck'
import { Seo } from '@/components/seo/Seo'
import { Button } from '@/components/ui/Button'
import { useRouteScrollReset } from '@/hooks/useRouteScrollReset'
import { useAuthStore } from '@/store/authStore'

export function ResetPasswordPage() {
  useRouteScrollReset()

  const navigate = useNavigate()
  const verifiedEmail = useAuthStore((s) => s.resetVerifiedEmail)
  const resetPassword = useAuthStore((s) => s.resetPassword)

  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [errors, setErrors] = useState<{
    password: string | null
    confirm: string | null
  }>({ password: null, confirm: null })
  const [formError, setFormError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const [done, setDone] = useState(false)

  // Double-submit guard. (The store clears resetVerifiedEmail on success; the
  // `submitting`/`done` state keeps the page from redirecting away before the
  // success view renders.)
  const submittedRef = useRef(false)
  const formRef = useRef<HTMLFormElement | null>(null)
  const passwordRef = useRef<HTMLInputElement | null>(null)
  const confirmRef = useRef<HTMLInputElement | null>(null)

  if (!verifiedEmail && !submitting && !done) {
    return <Navigate to="/forgot-password" replace />
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (submittedRef.current) return

    const next = {
      password: validateNewPassword(password),
      confirm: validateConfirmPassword(password, confirm),
    }
    setErrors(next)
    setFormError(null)

    if (next.password || next.confirm) {
      shake(formRef.current)
      if (next.password) passwordRef.current?.focus()
      else confirmRef.current?.focus()
      return
    }

    submittedRef.current = true
    setSubmitting(true)
    const result = await resetPassword(password)
    setSubmitting(false)

    if (!result.ok) {
      submittedRef.current = false
      setFormError(result.error)
      shake(formRef.current)
      return
    }

    setPassword('')
    setConfirm('')
    setDone(true)
  }

  if (done) {
    return (
      <>
        <Seo
          title="Password updated | FootballTicketClub"
          description="Your FootballTicketClub password has been updated."
        />
        <AuthShell
          revealKey="done"
          eyebrow="All set"
          title="Password updated"
          subtitle="Your password has been changed. You can now sign in with your new password."
          panelTitle={
            <>
              You&rsquo;re back
              <br />
              in the game
            </>
          }
          panelText="Sign in to pick up where you left off."
        >
          <div className="space-y-6">
            <div role="status" data-auth-reveal>
              <SuccessCheck />
              <span className="sr-only">Password updated.</span>
            </div>
            <div data-auth-reveal>
              <Button
                type="button"
                size="lg"
                className="w-full"
                onClick={() => navigate('/signin', { replace: true })}
              >
                Back to sign in
              </Button>
            </div>
          </div>
        </AuthShell>
      </>
    )
  }

  return (
    <>
      <Seo
        title="Reset password | FootballTicketClub"
        description="Choose a new password for your FootballTicketClub account."
      />
      <AuthShell
        eyebrow="Almost done"
        title="Choose a new password"
        subtitle="Use at least 8 characters with a mix of letters and numbers."
        panelTitle={
          <>
            Fresh start,
            <br />
            same great matches
          </>
        }
        panelText="Pick a strong password you don&rsquo;t use anywhere else."
      >
        <form
          ref={formRef}
          noValidate
          onSubmit={handleSubmit}
          className="space-y-4"
          aria-label="Reset password"
        >
          {formError ? (
            <div>
              <FormError>{formError}</FormError>
            </div>
          ) : null}

          <div data-auth-reveal className="space-y-3">
            <PasswordField
              ref={passwordRef}
              label="New password"
              name="new-password"
              autoComplete="new-password"
              placeholder="Create a new password"
              value={password}
              error={errors.password}
              onChange={(e) => {
                setPassword(e.target.value)
                if (errors.password) setErrors((p) => ({ ...p, password: null }))
                if (confirm && errors.confirm) {
                  setErrors((p) => ({
                    ...p,
                    confirm: validateConfirmPassword(e.target.value, confirm),
                  }))
                }
              }}
              onBlur={() => {
                if (password) {
                  setErrors((p) => ({ ...p, password: validateNewPassword(password) }))
                }
              }}
            />
            <PasswordStrength password={password} />
          </div>

          <div data-auth-reveal>
            <PasswordField
              ref={confirmRef}
              label="Confirm new password"
              name="confirm-password"
              autoComplete="new-password"
              placeholder="Re-enter your new password"
              value={confirm}
              error={errors.confirm}
              onChange={(e) => {
                setConfirm(e.target.value)
                if (errors.confirm) setErrors((p) => ({ ...p, confirm: null }))
              }}
              onBlur={() => {
                if (confirm) {
                  setErrors((p) => ({
                    ...p,
                    confirm: validateConfirmPassword(password, confirm),
                  }))
                }
              }}
            />
          </div>

          <div data-auth-reveal className="pt-1">
            <SubmitButton
              loading={submitting}
              loadingLabel={'Updating password\u2026'}
            >
              Update password
            </SubmitButton>
          </div>
        </form>
      </AuthShell>
    </>
  )
}
