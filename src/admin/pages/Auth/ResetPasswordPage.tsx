import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeft, Loader2, Mail, CheckCircle } from 'lucide-react'
import { supabase } from '@/admin/lib/supabase'

export function ResetPasswordPage() {
  const [email, setEmail] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [sent, setSent] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/admin/login`,
      })
      if (error) throw error
      setSent(true)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to send reset email')
    } finally {
      setIsLoading(false)
    }
  }

  if (sent) {
    return (
      <div className="min-h-screen bg-[var(--color-bg)] flex items-center justify-center p-4">
        <div className="w-full max-w-sm text-center">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-green-500/10 mb-4">
            <CheckCircle className="w-6 h-6 text-green-500" />
          </div>
          <h1 className="text-2xl font-bold text-[var(--color-text)]">Check your email</h1>
          <p className="mt-2 text-sm text-[var(--color-text-secondary)]">
            We've sent a password reset link to <strong className="text-[var(--color-text)]">{email}</strong>
          </p>
          <Link to="/admin/login" className="mt-6 inline-flex items-center gap-2 text-sm text-primary hover:text-primary-dark transition-colors">
            <ArrowLeft className="h-4 w-4" />
            Back to login
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[var(--color-bg)] flex items-center justify-center p-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-[var(--color-primary)]/10 mb-4">
            <Mail className="w-6 h-6 text-[var(--color-primary)]" />
          </div>
          <h1 className="text-2xl font-bold text-[var(--color-text)]">Reset password</h1>
          <p className="mt-1 text-sm text-[var(--color-text-secondary)]">Enter your email to receive a reset link</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-[var(--color-text)]">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@example.com"
              required
              autoFocus
              className="w-full px-3 py-2.5 text-sm rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-text)] placeholder:text-[var(--color-text-tertiary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/20 focus:border-[var(--color-primary)] transition-all"
            />
          </div>

          {error && (
            <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20">
              <p className="text-xs text-red-500">{error}</p>
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-2.5 text-sm font-medium rounded-xl bg-[var(--color-primary)] text-white hover:bg-[var(--color-primary-light)] disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
          >
            {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Send reset link'}
          </button>

          <div className="text-center">
            <Link to="/admin/login" className="text-sm text-primary hover:text-primary-dark transition-colors">
              Back to login
            </Link>
          </div>
        </form>
      </div>
    </div>
  )
}
