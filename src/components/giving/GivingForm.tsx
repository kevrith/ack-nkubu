import { useEffect, useState } from 'react'
import { useAuth } from '@/hooks/useAuth'
import { isPaystackEnabled } from '@/lib/paystack'
import { PaybillShortcut } from './PaybillShortcut'
import { PaystackGiving } from './PaystackGiving'

/**
 * Giving options.
 *
 * The M-Pesa paybill shortcut is the primary route and always shown. Paystack
 * (M-Pesa or card, in one step) appears underneath only once an admin switches
 * on the `paystack_enabled` setting — so nothing changes for givers until the
 * parish account is confirmed live.
 */
export function GivingForm() {
  const { user } = useAuth()
  const [paystackOn, setPaystackOn] = useState(false)
  const [checking, setChecking] = useState(true)

  useEffect(() => {
    isPaystackEnabled()
      .then(setPaystackOn)
      .finally(() => setChecking(false))
  }, [])

  if (!user) {
    return (
      <div className="bg-navy-50 border border-navy-200 rounded-lg p-6 text-center">
        <p className="text-navy">Please sign in to give</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <PaybillShortcut />

      {!checking && paystackOn && (
        <>
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-3 bg-white text-gray-500">or give in the app</span>
            </div>
          </div>

          <PaystackGiving />
        </>
      )}
    </div>
  )
}
