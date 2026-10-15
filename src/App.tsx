import { lazy, Suspense } from 'react'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'

import { RequireAuth } from '@/components/auth/RequireAuth'
import { Layout } from '@/components/layout/Layout'

const HomePage = lazy(() =>
  import('@/pages/HomePage').then((m) => ({ default: m.HomePage })),
)
const CompetitionPage = lazy(() =>
  import('@/pages/CompetitionPage').then((m) => ({
    default: m.CompetitionPage,
  })),
)
const MatchPage = lazy(() =>
  import('@/pages/MatchPage').then((m) => ({ default: m.MatchPage })),
)
const MatchTicketsPage = lazy(() =>
  import('@/pages/MatchTicketsPage').then((m) => ({
    default: m.MatchTicketsPage,
  })),
)

/* Auth (standalone split-screen pages, no navbar/footer) */
const SignInPage = lazy(() =>
  import('@/pages/SignInPage').then((m) => ({ default: m.SignInPage })),
)
const SignUpPage = lazy(() =>
  import('@/pages/SignUpPage').then((m) => ({ default: m.SignUpPage })),
)
const ForgotPasswordPage = lazy(() =>
  import('@/pages/ForgotPasswordPage').then((m) => ({
    default: m.ForgotPasswordPage,
  })),
)
const VerifyOtpPage = lazy(() =>
  import('@/pages/VerifyOtpPage').then((m) => ({ default: m.VerifyOtpPage })),
)
const ResetPasswordPage = lazy(() =>
  import('@/pages/ResetPasswordPage').then((m) => ({
    default: m.ResetPasswordPage,
  })),
)

/* Booking */
const CheckoutPage = lazy(() =>
  import('@/pages/CheckoutPage').then((m) => ({ default: m.CheckoutPage })),
)
const BookingConfirmationPage = lazy(() =>
  import('@/pages/BookingConfirmationPage').then((m) => ({
    default: m.BookingConfirmationPage,
  })),
)
const MyBookingsPage = lazy(() =>
  import('@/pages/MyBookingsPage').then((m) => ({ default: m.MyBookingsPage })),
)

function PageFallback() {
  return (
    <div
      className="flex min-h-[40vh] items-center justify-center pt-28"
      aria-busy="true"
      aria-live="polite"
    >
      <span className="sr-only">Loading page</span>
      <div
        className="size-8 animate-pulse rounded-full bg-brand/30"
        aria-hidden
      />
    </div>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <Suspense fallback={<PageFallback />}>
        <Routes>
          {/* Standalone pages */}
          <Route path="signin" element={<SignInPage />} />
          <Route path="signup" element={<SignUpPage />} />
          <Route path="forgot-password" element={<ForgotPasswordPage />} />
          <Route path="verify-otp" element={<VerifyOtpPage />} />
          <Route path="reset-password" element={<ResetPasswordPage />} />
          <Route
            path="checkout/:slug"
            element={
              <RequireAuth>
                <CheckoutPage />
              </RequireAuth>
            }
          />

          {/* Pages inside the main site layout */}
          <Route element={<Layout />}>
            <Route index element={<HomePage />} />
            <Route path="football/:competition" element={<CompetitionPage />} />
            <Route path="match/:slug/tickets" element={<MatchTicketsPage />} />
            <Route path="match/:slug" element={<MatchPage />} />
            <Route
              path="booking/confirmation/:orderId"
              element={
                <RequireAuth>
                  <BookingConfirmationPage />
                </RequireAuth>
              }
            />
            <Route
              path="account/bookings"
              element={
                <RequireAuth>
                  <MyBookingsPage />
                </RequireAuth>
              }
            />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>
        </Routes>
      </Suspense>
    </BrowserRouter>
  )
}
