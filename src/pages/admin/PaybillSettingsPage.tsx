import { useState, useEffect } from 'react'
import { Save, Smartphone, CreditCard, Loader2 } from 'lucide-react'
import { supabase } from '@/lib/supabase'

export function PaybillSettingsPage() {
  const [paystackOn, setPaystackOn] = useState(false)
  const [paystackSaving, setPaystackSaving] = useState(false)
  const [paystackError, setPaystackError] = useState<string | null>(null)
  const [paybill, setPaybill] = useState({
    paybill_number: '',
    account_number: '',
    business_name: '',
  })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [success, setSuccess] = useState(false)

  useEffect(() => {
    fetchPaybill()
    loadPaystackFlag()
  }, [])

  async function fetchPaybill() {
    const { data } = await supabase
      .from('paybill_info')
      .select('*')
      .eq('is_active', true)
      .limit(1)
      .single()

    if (data) {
      setPaybill({
        paybill_number: data.paybill_number,
        account_number: data.account_number,
        business_name: data.business_name,
      })
    }
    setLoading(false)
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)

    const { data: existing } = await supabase
      .from('paybill_info')
      .select('id')
      .eq('is_active', true)
      .limit(1)
      .single()

    if (existing) {
      await supabase
        .from('paybill_info')
        .update(paybill)
        .eq('id', existing.id)
    } else {
      await supabase
        .from('paybill_info')
        .insert(paybill)
    }

    setSaving(false)
    setSuccess(true)
    setTimeout(() => setSuccess(false), 3000)
  }

  async function loadPaystackFlag() {
    const { data } = await supabase
      .from('cms_settings')
      .select('value')
      .eq('key', 'paystack_enabled')
      .maybeSingle()
    setPaystackOn(data?.value === true || data?.value === 'true')
  }

  async function togglePaystack() {
    const next = !paystackOn
    setPaystackSaving(true)
    setPaystackError(null)

    const { error } = await supabase
      .from('cms_settings')
      .upsert({ key: 'paystack_enabled', value: next }, { onConflict: 'key' })

    if (error) {
      setPaystackError(error.message)
    } else {
      setPaystackOn(next)
    }
    setPaystackSaving(false)
  }

  if (loading) return <div>Loading...</div>

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-playfair text-navy">M-Pesa Paybill Settings</h1>
        <p className="text-gray-600 mt-2">Configure paybill details for the giving shortcut</p>
      </div>

      <div className="max-w-2xl bg-white rounded-lg shadow p-6 space-y-4">
        <div className="flex items-start gap-3">
          <CreditCard className="w-6 h-6 text-navy flex-shrink-0 mt-1" />
          <div className="flex-1">
            <h2 className="text-lg font-semibold text-navy">In-app giving (Paystack)</h2>
            <p className="text-sm text-gray-600 mt-1">
              Lets members give by M-Pesa or card without leaving the app. Turn this on only once
              Paystack has KES M-Pesa live on the parish account and{' '}
              <code className="text-xs bg-gray-100 px-1 rounded">PAYSTACK_SECRET_KEY</code> is set on
              the Supabase functions. While it is off, the paybill above is the only giving route.
            </p>
          </div>
        </div>

        {paystackError && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded text-sm">
            {paystackError}
          </div>
        )}

        <button
          type="button"
          onClick={togglePaystack}
          disabled={paystackSaving}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium disabled:opacity-50 ${
            paystackOn ? 'bg-green-600 text-white hover:bg-green-700' : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
          }`}
        >
          {paystackSaving && <Loader2 className="w-4 h-4 animate-spin" />}
          {paystackOn ? 'Paystack giving is ON — click to turn off' : 'Paystack giving is OFF — click to turn on'}
        </button>
      </div>

      <form onSubmit={handleSave} className="max-w-2xl bg-white rounded-lg shadow p-6 space-y-6">
        {success && (
          <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded">
            ✓ Paybill settings saved successfully
          </div>
        )}

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Business Name
          </label>
          <input
            type="text"
            value={paybill.business_name}
            onChange={(e) => setPaybill({ ...paybill, business_name: e.target.value })}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-navy focus:border-transparent"
            placeholder="ACK St Francis Nkubu"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Paybill Number
          </label>
          <input
            type="text"
            value={paybill.paybill_number}
            onChange={(e) => setPaybill({ ...paybill, paybill_number: e.target.value })}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-navy focus:border-transparent"
            placeholder="123456"
          />
          <p className="text-xs text-gray-500 mt-1">Your M-Pesa paybill number</p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Account Number
          </label>
          <input
            type="text"
            value={paybill.account_number}
            onChange={(e) => setPaybill({ ...paybill, account_number: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-navy focus:border-transparent"
            placeholder="CHURCH"
          />
          <p className="text-xs text-gray-500 mt-1">Account number for paybill (optional)</p>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <Smartphone className="w-5 h-5 text-blue-600 mt-0.5" />
            <div className="text-sm text-blue-800">
              <p className="font-medium mb-1">Preview</p>
              <p>Users will see: <span className="font-mono font-bold">{paybill.paybill_number}</span></p>
              <p>Account: <span className="font-mono font-bold">{paybill.account_number || 'N/A'}</span></p>
            </div>
          </div>
        </div>

        <button
          type="submit"
          disabled={saving}
          className="w-full px-6 py-3 bg-navy text-white rounded-lg hover:bg-navy-700 disabled:opacity-50 font-medium flex items-center justify-center gap-2"
        >
          <Save className="w-5 h-5" />
          {saving ? 'Saving...' : 'Save Settings'}
        </button>
      </form>
    </div>
  )
}
