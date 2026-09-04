import { useEffect, useRef, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { CheckCircle, XCircle, Loader2, Clock } from 'lucide-react'
import { verifyPaystackGiving, VerifyResult } from '@/lib/paystack'
import { formatKES } from '@/lib/utils'

/**
 * Landing page after Paystack checkout.
 *
 * The webhook is what actually settles a payment; this asks Paystack directly so
 * the giver gets an answer immediately instead of staring at a blank page while
 * the webhook lands.
 */
export function GivingCallbackPage() {
  const [params] = useSearchParams()
  const reference = params.get('reference') || params.get('trxref')
  const [result, setResult] = useState<VerifyResult | null>(null)
  const [error, setError] = useState<string | null>(null)
  // React 18 StrictMode double-invokes effects in dev; verify once.
  const started = useRef(false)

  useEffect(() => {
    if (!reference || started.current) return
    started.current = true

    verifyPaystackGiving(reference)
      .then(setResult)
      .catch(err => setError((err as Error).message))
  }, [reference])

  if (!reference) {
    return (
      <Shell>
        <XCircle className="w-14 h-14 text-red-500 mx-auto mb-4" />
        <h1 className="text-2xl font-playfair text-navy mb-2">No payment reference</h1>
        <p className="text-gray-600 mb-6">We couldn't tell which payment this was. Nothing has been charged twice.</p>
        <BackLink />
      </Shell>
    )
  }

  if (error) {
    return (
      <Shell>
        <XCircle className="w-14 h-14 text-red-500 mx-auto mb-4" />
        <h1 className="text-2xl font-playfair text-navy mb-2">Couldn't confirm your payment</h1>
        <p className="text-gray-600 mb-2">{error}</p>
        <p className="text-sm text-gray-500 mb-6">
          If money left your account it will still be recorded — Paystack notifies us separately.
          Check your giving history in a few minutes before trying again.
        </p>
        <BackLink />
      </Shell>
    )
  }

  if (!result) {
    return (
      <Shell>
        <Loader2 className="w-14 h-14 text-navy mx-auto mb-4 animate-spin" />
        <h1 className="text-2xl font-playfair text-navy mb-2">Confirming your giving…</h1>
        <p className="text-gray-600">One moment while we check with Paystack.</p>
      </Shell>
    )
  }

  if (result.status === 'success') {
    return (
      <Shell>
        <CheckCircle className="w-14 h-14 text-green-600 mx-auto mb-4" />
        <h1 className="text-2xl font-playfair text-navy mb-2">Thank you for your giving</h1>
        <p className="text-gray-600 mb-6">
          {result.amount_kes ? `${formatKES(result.amount_kes)} ` : ''}
          received{result.category ? ` for ${result.category.replace('_', ' ')}` : ''}.
          {' '}It's on your giving history now.
        </p>
        <BackLink label="View giving history" />
      </Shell>
    )
  }

  if (result.status === 'pending') {
    return (
      <Shell>
        <Clock className="w-14 h-14 text-amber-500 mx-auto mb-4" />
        <h1 className="text-2xl font-playfair text-navy mb-2">Payment not completed yet</h1>
        <p className="text-gray-600 mb-6">
          Paystack hasn't confirmed this one. If you approved the M-Pesa prompt, it should appear
          in your giving history shortly.
        </p>
        <BackLink />
      </Shell>
    )
  }

  return (
    <Shell>
      <XCircle className="w-14 h-14 text-red-500 mx-auto mb-4" />
      <h1 className="text-2xl font-playfair text-navy mb-2">Payment did not go through</h1>
      <p className="text-gray-600 mb-6">{result.message || 'The payment was declined or cancelled. Nothing was charged.'}</p>
      <BackLink label="Try again" />
    </Shell>
  )
}

function Shell({ children }: { children: React.ReactNode }) {
  return (
    <div className="max-w-md mx-auto text-center bg-white rounded-lg shadow p-8 mt-8">{children}</div>
  )
}

function BackLink({ label = 'Back to giving' }: { label?: string }) {
  return (
    <Link to="/giving" className="inline-block px-6 py-2 bg-navy text-white rounded-lg hover:bg-navy-600">
      {label}
    </Link>
  )
}
