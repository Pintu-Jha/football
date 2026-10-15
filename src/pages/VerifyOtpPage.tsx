import { AlertCircle, FlaskConical, RotateCw } from 'lucide-react'
import { type FormEvent, useEffect, useId, useRef, useState } from 'react'
import { Navigate, useNavigate, useSearchParams } from 'react-router-dom'

import { shake } from '@/components/auth/authMotion'
import { formatClock, maskEmail, withRedirect } from '@/components/auth/authUtils'
import { AuthShell } from '@/components/auth/AuthShell'
import { OtpInput, type OtpInputHandle } from '@/components/auth/OtpInput'
import { safeRedirect } from '@/components/auth/RequireAuth'
import { SubmitButton } from '@/components/auth/SubmitButton'
import { SuccessCheck } from '@/components/auth/SuccessCheck'
import { Seo } from '@/components/seo/Seo'
import { useNow } from '@/hooks/useNow'
import { useRouteScrollReset } from '@/hooks/useRouteScrollReset'
import {
  OTP_DEMO_MODE,
  OTP_LENGTH,
  OTP_MAX_ATTEMPTS,
  type OtpPurpose,
  type PendingOtp,
  useAuthStore,
} from '@/store/authStore'

const SUCCESS_DELAY_MS = 900

export function VerifyOtpPage() {
  useRouteScrollReset()

  const navigate = useNavigate()
  const [params] = useSearchParams()
  const redirectParam = params.get('redirect')
  const labelId = useId()
  const errorId = useId()

  const pending = useAuthStore((s) => s.pendingOtp)
  const verifyOtp = useAuthStore((s) => s.verifyOtp)
  const resendOtp = useAuthStore((s) => s.resendOtp)
  const cancelPendingOtp = useAuthStore((s) => s.cancelPendingOtp)

  // Verifying clears `pendingOtp` in the store; keep the last value around so
  // the page doesn't bounce to /signin while the success state is showing.
  const [lastPending, setLastPending] = useState<PendingOtp | null>(pending)
  if (pending && pending !== lastPending) {
    setLastPending(pending)
  }
  const view = pending ?? lastPending

  const [code, setCode] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [notice, setNotice] = useState('')
  const [successPurpose, setSuccessPurpose] = useState<OtpPurpose | null>(null)
  const [now, refreshNow] = useNow(Boolean(view) && successPurpose === null)

  const groupRef = useRef<HTMLDivElement | null>(null)
  const otpRef = useRef<OtpInputHandle | null>(null)

  useEffect(() => {
    if (!successPurpose) return undefined
    const id = window.setTimeout(() => {
      navigate(
        successPurpose === 'signup'
          ? safeRedirect(redirectParam, '/')
          : '/reset-password',
        { replace: true },
      )
    }, SUCCESS_DELAY_MS)
    return () => window.clearTimeout(id)
  }, [successPurpose, redirectParam, navigate])

  if (!view) {
    return <Navigate to="/signin" replace />
  }

  const purpose = view.purpose
  const expired = now >= view.expiresAt
  const locked = view.attempts >= OTP_MAX_ATTEMPTS
  const inputDisabled = expired || locked || successPurpose !== null
  const resendLeft = Math.max(0, Math.ceil((view.resendAvailableAt - now) / 1000))
  const expiresInSeconds = Math.max(0, Math.ceil((view.expiresAt - now) / 1000))
  const masked = maskEmail(view.email)

  const blockedMessage = expired
    ? 'This code has expired. Request a new one.'
    : locked
      ? 'Too many incorrect attempts. Request a new code.'
      : null
  const shownError = blockedMessage ?? error

  const liveMessage =
    notice || (resendLeft === 0 && !expired ? 'You can now request a new code.' : '')

  function attemptVerify(value: string) {
    if (inputDisabled) return
    const result = verifyOtp(value)
    if (result.ok) {
      setError(null)
      setNotice('')
      setSuccessPurpose(result.purpose)
      return
    }
    setError(result.error)
    setNotice('')
    setCode('')
    shake(groupRef.current)
    otpRef.current?.focusFirst()
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (code.length < OTP_LENGTH) {
      setError(`Enter all ${OTP_LENGTH} digits of your code.`)
      shake(groupRef.current)
      otpRef.current?.focusFirst()
      return
    }
    attemptVerify(code)
  }

  function handleResend() {
    const result = resendOtp()
    if (!result.ok) {
      setError(result.error)
      return
    }
    setError(null)
    setCode('')
    setNotice('A new code has been sent.')
    refreshNow()
    otpRef.current?.focusFirst()
  }

  function handleChangeEmail() {
    cancelPendingOtp()
    navigate(
      purpose === 'signup'
        ? withRedirect('/signup', redirectParam)
        : '/forgot-password',
    )
  }

  if (successPurpose) {
    const isSignup = successPurpose === 'signup'
    return (
      <>
        <Seo
          title="Code verified | FootballTicketClub"
          description="Your one-time code was verified."
        />
        <AuthShell
          revealKey="success"
          title={isSignup ? 'Email verified' : 'Code verified'}
          subtitle={
            isSignup
              ? 'Your account is ready. Taking you in\u2026'
              : 'Now choose a new password\u2026'
          }
        >
          <div role="status" className="py-4">
            <SuccessCheck />
            <span className="sr-only">
              {isSignup ? 'Email verified.' : 'Code verified.'}
            </span>
          </div>
        </AuthShell>
      </>
    )
  }

  const isSignup = purpose === 'signup'

  return (
    <>
      <Seo
        title={
          isSignup
            ? 'Verify your email | FootballTicketClub'
            : 'Enter reset code | FootballTicketClub'
        }
        description="Enter the one-time code to continue."
      />
      <AuthShell
        eyebrow={isSignup ? 'Email verification' : 'Password reset'}
        title={isSignup ? 'Verify your email' : 'Enter the reset code'}
        subtitle={
          <>
            {OTP_DEMO_MODE
              ? `Enter the ${OTP_LENGTH}-digit code for `
              : isSignup
                ? `We sent a ${OTP_LENGTH}-digit code to `
                : `If an account exists for it, we sent a ${OTP_LENGTH}-digit code to `}
            <strong className="font-semibold text-ink">{masked}</strong>.
          </>
        }
        panelTitle={
          <>
            Almost there
            <br />
            &mdash; one quick check
          </>
        }
        panelText="A one-time code keeps your account and bookings safe."
        footer={
          <button
            type="button"
            onClick={handleChangeEmail}
            className="rounded font-semibold text-brand hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand"
          >
            Use a different email
          </button>
        }
      >
        <form
          noValidate
          onSubmit={handleSubmit}
          className="space-y-5"
          aria-label="Verify one-time code"
        >
          {OTP_DEMO_MODE ? (
            <div
              data-auth-reveal
              className="flex items-start gap-3 rounded-xl border-2 border-dashed border-vip bg-vip-soft/60 px-4 py-3 text-sm text-ink"
            >
              <FlaskConical className="mt-0.5 size-4 shrink-0 text-vip" aria-hidden />
              <div>
                <p className="font-semibold">
                  Demo mode &mdash; no email is sent. Your code is{' '}
                  <span className="font-mono tracking-widest">{view.code}</span>
                </p>
                <p className="mt-1 text-xs text-muted">
                  This appears because there is no email service connected yet.
                </p>
              </div>
            </div>
          ) : null}

          <div data-auth-reveal className="space-y-2.5">
            <p id={labelId} className="text-sm font-semibold text-ink">
              {isSignup ? 'Verification code' : 'Reset code'}
            </p>
            <div ref={groupRef}>
              <OtpInput
                ref={otpRef}
                value={code}
                onChange={(next) => {
                  setCode(next)
                  if (error) setError(null)
                }}
                onComplete={attemptVerify}
                labelledBy={labelId}
                describedBy={shownError ? errorId : undefined}
                hasError={Boolean(shownError)}
                disabled={inputDisabled}
              />
            </div>
            <div aria-live="polite" className="min-h-5">
              {shownError ? (
                <p
                  id={errorId}
                  role="alert"
                  className="flex items-start gap-1.5 text-xs font-medium text-brand"
                >
                  <AlertCircle className="mt-px size-3.5 shrink-0" aria-hidden />
                  <span>{shownError}</span>
                </p>
              ) : !expired ? (
                <p className="text-xs text-muted">
                  Code expires in{' '}
                  <span className="font-semibold tabular-nums text-ink">
                    {formatClock(expiresInSeconds)}
                  </span>
                </p>
              ) : null}
            </div>
          </div>

          <div data-auth-reveal>
            <SubmitButton disabled={inputDisabled || code.length < OTP_LENGTH}>
              Verify code
            </SubmitButton>
          </div>

          <div
            data-auth-reveal
            className="flex flex-wrap items-center justify-center gap-x-2 gap-y-1 text-sm text-muted"
          >
            <span>Didn&rsquo;t get a code?</span>
            <button
              type="button"
              onClick={handleResend}
              disabled={resendLeft > 0}
              className="inline-flex items-center gap-1.5 rounded font-semibold text-brand hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand disabled:cursor-not-allowed disabled:text-muted-soft disabled:no-underline"
            >
              <RotateCw className="size-3.5" aria-hidden />
              {resendLeft > 0
                ? `Resend code in ${formatClock(resendLeft)}`
                : 'Resend code'}
            </button>
          </div>

          <p className="sr-only" role="status" aria-live="polite">
            {liveMessage}
          </p>
        </form>
      </AuthShell>
    </>
  )
}
