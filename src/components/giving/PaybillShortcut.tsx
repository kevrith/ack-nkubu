import { useState, useEffect } from 'react'
import { Copy, Check, Smartphone } from 'lucide-react'
import { supabase } from '@/lib/supabase'

interface PaybillInfo {
  paybill_number: string
  account_number: string
  business_name: string
}

export function PaybillShortcut() {
  const [paybill, setPaybill] = useState<PaybillInfo | null>(null)
  const [copied, setCopied] = useState<'paybill' | 'account' | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase
      .from('paybill_info')
      .select('*')
      .eq('is_active', true)
      .limit(1)
      .single()
      .then(({ data, error }) => {
        if (!error && data) setPaybill(data)
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [])

  if (loading) return <div className="text-sm text-gray-500">Loading paybill...</div>
  if (!paybill) return <div className="text-sm text-gray-500">No paybill configured</div>

  const copy = async (text: string, type: 'paybill' | 'account') => {
    await navigator.clipboard.writeText(text)
    setCopied(type)
    setTimeout(() => setCopied(null), 2000)
  }

  const openMpesaUSSD = () => {
    if (!paybill) return
    const ussd = `tel:*334*${paybill.paybill_number}*${paybill.account_number}#`
    window.location.href = ussd
  }

  return (
    <div className="bg-gradient-to-br from-green-50 to-green-100 border border-green-200 rounded-lg p-4 space-y-3">
      <div className="flex items-center gap-2 text-green-800 font-medium">
        <Smartphone className="w-5 h-5" />
        <span>M-Pesa Paybill</span>
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between bg-white rounded p-3">
          <div>
            <div className="text-xs text-gray-500">Paybill Number</div>
            <div className="font-mono font-bold text-lg">{paybill.paybill_number}</div>
          </div>
          <button
            onClick={() => copy(paybill.paybill_number, 'paybill')}
            className="p-2 hover:bg-gray-100 rounded"
          >
            {copied === 'paybill' ? <Check className="w-4 h-4 text-green-600" /> : <Copy className="w-4 h-4" />}
          </button>
        </div>

        <div className="flex items-center justify-between bg-white rounded p-3">
          <div>
            <div className="text-xs text-gray-500">Account Number</div>
            <div className="font-mono font-bold">{paybill.account_number}</div>
          </div>
          <button
            onClick={() => copy(paybill.account_number, 'account')}
            className="p-2 hover:bg-gray-100 rounded"
          >
            {copied === 'account' ? <Check className="w-4 h-4 text-green-600" /> : <Copy className="w-4 h-4" />}
          </button>
        </div>
      </div>

      <button
        onClick={openMpesaUSSD}
        className="w-full bg-green-600 text-white py-3 rounded-lg font-medium hover:bg-green-700 flex items-center justify-center gap-2"
      >
        <Smartphone className="w-5 h-5" />
        Open M-Pesa
      </button>

      <p className="text-xs text-gray-600 text-center">
        Tap to open M-Pesa with pre-filled paybill details
      </p>
    </div>
  )
}
