import { useState, useEffect } from 'react'
import { Save, Smartphone } from 'lucide-react'
import { supabase } from '@/lib/supabase'

export function PaybillSettingsPage() {
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

  if (loading) return <div>Loading...</div>

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-playfair text-navy">M-Pesa Paybill Settings</h1>
        <p className="text-gray-600 mt-2">Configure paybill details for the giving shortcut</p>
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
