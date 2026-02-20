import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/hooks/useAuth'
import { normalizeKenyanPhone, isValidKenyanPhone, formatKES } from '@/lib/utils'
import { initiateMpesaPayment } from '@/lib/flutterwave'
import { GivingCategory } from '@/types/giving'
import { PaybillShortcut } from './PaybillShortcut'

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
    let givingId: string | null = null
    let mpesaRecordId: string | null = null

    try {
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

      if (error || !giving) {
        alert('Failed to process giving')
        setLoading(false)
        return
      }
      givingId = giving.id

      // Create M-Pesa transaction record
      const { data: mpesaRecord, error: mpesaError } = await supabase
        .from('mpesa_transactions')
        .insert({
          giving_record_id: giving.id,
          phone_number: normalizedPhone,
          amount_kes: amountNum,
          status: 'pending',
        })
        .select()
        .single()

      if (mpesaError || !mpesaRecord) {
        throw new Error('Failed to create transaction record')
      }
      mpesaRecordId = mpesaRecord.id

      const result = await initiateMpesaPayment({
        amount: amountNum,
        currency: 'KES',
        email: user.email || 'member@church.org',
        phone_number: normalizedPhone,
        tx_ref: mpesaRecord.id,
        mpesa_record_id: mpesaRecord.id,
        giving_record_id: giving.id,
      })

      if (result.status === 'success') {
        setSuccess(true)
        setAmount('')
        setTimeout(() => setSuccess(false), 5000)
      } else {
        throw new Error('Payment initiation failed')
      }
    } catch (error) {
      // Rollback: delete both records
      if (mpesaRecordId) {
        await supabase.from('mpesa_transactions').delete().eq('id', mpesaRecordId)
      }
      if (givingId) {
        await supabase.from('giving_records').delete().eq('id', givingId)
      }
      alert('Failed to initiate M-Pesa payment. Please try again.')
    } finally {
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
    <div className="space-y-6">
      <PaybillShortcut />
      
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-300"></div>
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="px-2 bg-white text-gray-500">STK Push - Under Construction 🚧</span>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow p-6 space-y-6 opacity-50 pointer-events-none">
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
        disabled={true}
        className="w-full px-6 py-3 bg-gray-400 text-gray-600 rounded-lg cursor-not-allowed font-medium"
      >
        STK Push Coming Soon
      </button>

      <p className="text-xs text-gray-500 text-center">
        STK Push feature is under construction. Please use the paybill option above.
      </p>
    </form>
    </div>
  )
}
