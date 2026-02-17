import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/hooks/useAuth'
import { normalizeKenyanPhone, isValidKenyanPhone, formatKES } from '@/lib/utils'
import { initiateMpesaPayment } from '@/lib/flutterwave'
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

export function GivingForm() {
  const { user } = useAuth()
  const [category, setCategory] = useState<GivingCategory>('offering')
  const [amount, setAmount] = useState('')
  const [phone, setPhone] = useState(user?.profile.phone || '')
  const [isAnonymous, setIsAnonymous] = useState(false)
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  const selectedCategory = categories.find(c => c.value === category)!
  const normalizedPhone = normalizeKenyanPhone(phone)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!user || !normalizedPhone) return

    const amountNum = parseFloat(amount)
    if (amountNum < selectedCategory.min) {
      alert(`Minimum amount for ${selectedCategory.label} is ${formatKES(selectedCategory.min)}`)
      return
    }

    setLoading(true)

    // Create giving record
    const { data: giving, error } = await supabase
      .from('giving_records')
      .insert({
        donor_id: user.id,
        amount_kes: amountNum,
        category,
        is_anonymous: isAnonymous,
      })
      .select()
      .single()

    if (error) {
      alert('Failed to process giving')
      setLoading(false)
      return
    }

    // Create M-Pesa transaction record
    const { data: mpesaRecord } = await supabase
      .from('mpesa_transactions')
      .insert({
        giving_record_id: giving.id,
        phone_number: normalizedPhone,
        amount_kes: amountNum,
        status: 'pending',
      })
      .select()
      .single()

    try {
      // Initiate real Flutterwave M-Pesa payment
      const result = await initiateMpesaPayment({
        amount: amountNum,
        currency: 'KES',
        email: user.email || 'member@church.org',
        phone_number: normalizedPhone,
        tx_ref: mpesaRecord.id,
      })

      if (result.status === 'success') {
        // Update transaction with merchant request ID
        await supabase
          .from('mpesa_transactions')
          .update({
            merchant_request_id: result.data?.link || 'pending',
            status: 'pending',
          })
          .eq('id', mpesaRecord.id)

        setSuccess(true)
        setAmount('')
        setTimeout(() => setSuccess(false), 5000)
      } else {
        throw new Error('Payment initiation failed')
      }
    } catch (error) {
      // Update transaction as failed
      await supabase
        .from('mpesa_transactions')
        .update({ status: 'failed' })
        .eq('id', mpesaRecord.id)

      alert('Failed to initiate M-Pesa payment. Please try again.')
    }

    setLoading(false)
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
      {success && (
        <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded">
          ✓ Thank you for your giving! Your transaction was successful.
        </div>
      )}

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-3">
          Giving Category
        </label>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {categories.map((cat) => (
            <button
              key={cat.value}
              type="button"
              onClick={() => setCategory(cat.value)}
              className={`p-4 border-2 rounded-lg text-center transition-colors ${
                category === cat.value
                  ? 'border-navy bg-navy-50'
                  : 'border-gray-200 hover:border-gray-300'
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
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Amount (KES)
        </label>
        <input
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          required
          min={selectedCategory.min}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-navy focus:border-transparent"
          placeholder={`Minimum ${formatKES(selectedCategory.min)}`}
        />
        <div className="flex gap-2 mt-2">
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

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          M-Pesa Phone Number
        </label>
        <input
          type="tel"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          required
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-navy focus:border-transparent"
          placeholder="0712345678"
        />
        {phone && normalizedPhone && (
          <p className="text-xs text-green-600 mt-1">✓ {normalizedPhone}</p>
        )}
        {phone && !normalizedPhone && (
          <p className="text-xs text-red-600 mt-1">Invalid Kenyan phone number</p>
        )}
      </div>

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
        disabled={loading || !normalizedPhone}
        className="w-full px-6 py-3 bg-gold text-navy rounded-lg hover:bg-gold-600 disabled:opacity-50 font-medium"
      >
        {loading ? 'Processing...' : `Give ${amount ? formatKES(parseFloat(amount)) : ''}`}
      </button>

      <p className="text-xs text-gray-500 text-center">
        Secure M-Pesa payment. You will receive a prompt on your phone.
      </p>
    </form>
  )
}
