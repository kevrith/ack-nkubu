import { useState } from 'react'
import { Smartphone, CreditCard, Loader2, AlertTriangle } from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'
import { normalizeKenyanPhone, formatKES } from '@/lib/utils'
import { initializePaystackGiving, PaystackChannel } from '@/lib/paystack'
import { GivingCategory } from '@/types/giving'

const categories: { value: GivingCategory; label: string; icon: string; min: number }[] = [
  { value: 'tithe', label: 'Tithe', icon: '📿', min: 10 },
  { value: 'offering', label: 'Offering', icon: '🎁', min: 10 },
  { value: 'harambee', label: 'Harambee', icon: '🤝', min: 100 },
  { value: 'building_fund', label: 'Building Fund', icon: '🏛️', min: 100 },
  { value: 'missions', label: 'Missions', icon: '🌍', min: 100 },
  { value: 'welfare', label: 'Welfare', icon: '❤️', min: 50 },
  { value: 'other', label: 'Other', icon: '✨', min: 10 },
]

/**
 * Giving through Paystack.
 *
 * The giver picks M-Pesa or card up front and we pass only that channel to
 * Paystack, so the hosted page opens directly on the M-Pesa prompt or directly
 * on card entry — no method picker in between.
 */
export function PaystackGiving() {
  const { user } = useAuth()
  const [channel, setChannel] = useState<PaystackChannel>('mobile_money')
  const [category, setCategory] = useState<GivingCategory>('offering')
  const [amount, setAmount] = useState('')
  const [phone, setPhone] = useState(user?.profile.phone || '')
  const [isAnonymous, setIsAnonymous] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const selectedCategory = categories.find(c => c.value === category)!
  const normalizedPhone = normalizeKenyanPhone(phone)
  const amountNum = parseFloat(amount)

  const canSubmit =
    Number.isFinite(amountNum) &&
    amountNum >= selectedCategory.min &&
    (channel === 'card' || !!normalizedPhone) &&
    !loading

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)

    if (!Number.isFinite(amountNum) || amountNum < selectedCategory.min) {
      setError(`Minimum amount for ${selectedCategory.label} is ${formatKES(selectedCategory.min)}.`)
      return
    }
    if (channel === 'mobile_money' && !normalizedPhone) {
      setError('Enter a valid Kenyan M-Pesa number.')
      return
    }

    setLoading(true)
    try {
      const { authorization_url } = await initializePaystackGiving({
        amount: amountNum,
        category,
        channel,
        phone_number: channel === 'mobile_money' ? normalizedPhone! : undefined,
        is_anonymous: isAnonymous,
      })
      // Hand off to Paystack. We come back at /giving/callback?reference=…
      window.location.href = authorization_url
    } catch (err) {
      setError((err as Error).message)
      setLoading(false)
    }
  }

  if (!user) {
    return (
      <div className="bg-navy-50 border border-navy-200 rounded-lg p-6 text-center">
        <p className="text-navy">Please sign in to give</p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow p-6 space-y-6">
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 flex-shrink-0 mt-0.5" />
          <span className="text-sm">{error}</span>
        </div>
      )}

      {/* Channel first — it decides which Paystack page the giver lands on */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-3">Pay with</label>
        <div className="grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={() => setChannel('mobile_money')}
            className={`flex items-center justify-center gap-2 p-4 border-2 rounded-lg transition-colors ${
              channel === 'mobile_money' ? 'border-navy bg-navy-50 text-navy' : 'border-gray-200 hover:border-gray-300'
            }`}
          >
            <Smartphone className="w-5 h-5" />
            <span className="font-medium">M-Pesa</span>
          </button>
          <button
            type="button"
            onClick={() => setChannel('card')}
            className={`flex items-center justify-center gap-2 p-4 border-2 rounded-lg transition-colors ${
              channel === 'card' ? 'border-navy bg-navy-50 text-navy' : 'border-gray-200 hover:border-gray-300'
            }`}
          >
            <CreditCard className="w-5 h-5" />
            <span className="font-medium">Card</span>
          </button>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-3">Giving Category</label>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {categories.map((cat) => (
            <button
              key={cat.value}
              type="button"
              onClick={() => setCategory(cat.value)}
              className={`p-4 border-2 rounded-lg text-center transition-colors ${
                category === cat.value ? 'border-navy bg-navy-50' : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="text-2xl mb-1">{cat.icon}</div>
              <div className="text-sm font-medium">{cat.label}</div>
              <div className="text-xs text-gray-500">Min: {formatKES(cat.min)}</div>
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Amount (KES)</label>
        <input
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          required
          min={selectedCategory.min}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-navy focus:border-transparent"
          placeholder={`Minimum ${formatKES(selectedCategory.min)}`}
        />
        <div className="flex flex-wrap gap-2 mt-2">
          {[100, 500, 1000, 2500, 5000].map((amt) => (
            <button
              key={amt}
              type="button"
              onClick={() => setAmount(amt.toString())}
              className="px-3 py-1 bg-gray-100 rounded text-sm hover:bg-gray-200"
            >
              {amt}
            </button>
          ))}
        </div>
      </div>

      {channel === 'mobile_money' && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">M-Pesa Phone Number</label>
          <input
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-navy focus:border-transparent"
            placeholder="0712345678"
          />
          {phone && normalizedPhone && <p className="text-xs text-green-600 mt-1">✓ {normalizedPhone}</p>}
          {phone && !normalizedPhone && <p className="text-xs text-red-600 mt-1">Invalid Kenyan phone number</p>}
        </div>
      )}

      <label className="flex items-center gap-2">
        <input
          type="checkbox"
          checked={isAnonymous}
          onChange={(e) => setIsAnonymous(e.target.checked)}
          className="rounded"
        />
        <span className="text-sm text-gray-700">Give anonymously</span>
      </label>

      <button
        type="submit"
        disabled={!canSubmit}
        className="w-full px-6 py-3 bg-navy text-white rounded-lg font-medium hover:bg-navy-600 disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center justify-center gap-2"
      >
        {loading && <Loader2 className="w-4 h-4 animate-spin" />}
        {loading
          ? 'Opening Paystack...'
          : `Give ${amount ? formatKES(amountNum) : ''} with ${channel === 'mobile_money' ? 'M-Pesa' : 'card'}`}
      </button>

      <p className="text-xs text-gray-500 text-center">
        You'll be taken to Paystack's secure page to complete the payment, then brought back here.
      </p>
    </form>
  )
}
