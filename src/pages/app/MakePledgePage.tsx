import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Heart, Calendar, DollarSign } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/hooks/useAuth'
import { PledgeCampaign, PledgeFrequency } from '@/types/pledge'

export function MakePledgePage() {
  const { campaignId } = useParams()
  const { user } = useAuth()
  const navigate = useNavigate()
  const [campaign, setCampaign] = useState<PledgeCampaign | null>(null)
  const [amount, setAmount] = useState('')
  const [frequency, setFrequency] = useState<PledgeFrequency>('monthly')
  const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0])
  const [notes, setNotes] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    loadCampaign()
  }, [campaignId])

  async function loadCampaign() {
    const { data } = await supabase
      .from('pledge_campaigns')
      .select('*')
      .eq('id', campaignId)
      .single()
    setCampaign(data)
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!user || !campaign) return

    setLoading(true)
    const { error } = await supabase.from('pledges').insert({
      campaign_id: campaign.id,
      user_id: user.id,
      pledge_amount: parseFloat(amount),
      frequency,
      start_date: startDate,
      notes
    })

    if (!error) {
      await supabase.from('notifications').insert({
        user_id: user.id,
        title: 'Pledge Created',
        message: `Thank you for pledging KES ${parseFloat(amount).toLocaleString()} to ${campaign.title}!`,
        type: 'pledge'
      })
      navigate('/pledges')
    }
    setLoading(false)
  }

  if (!campaign) return <div className="text-center py-12">Loading...</div>

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white rounded-lg shadow-lg p-6 space-y-6">
        <div className="flex items-center gap-3">
          <Heart className="w-8 h-8 text-red-500" />
          <div>
            <h1 className="text-2xl font-playfair text-navy">Make a Pledge</h1>
            <p className="text-gray-600">{campaign.title}</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Pledge Amount (KES)</label>
            <div className="relative">
              <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="number"
                value={amount}
                onChange={e => setAmount(e.target.value)}
                required
                min="100"
                step="100"
                className="w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-navy text-lg"
                placeholder="5000"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Payment Frequency</label>
            <div className="grid grid-cols-2 gap-3">
              {(['one-time', 'weekly', 'monthly', 'quarterly'] as PledgeFrequency[]).map(freq => (
                <button
                  key={freq}
                  type="button"
                  onClick={() => setFrequency(freq)}
                  className={`p-3 rounded-lg border-2 capitalize ${
                    frequency === freq ? 'border-navy bg-navy/5' : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  {freq}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Start Date</label>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="date"
                value={startDate}
                onChange={e => setStartDate(e.target.value)}
                required
                min={new Date().toISOString().split('T')[0]}
                className="w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-navy"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Notes (Optional)</label>
            <textarea
              value={notes}
              onChange={e => setNotes(e.target.value)}
              rows={3}
              className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-navy"
              placeholder="Any special instructions or dedication..."
            />
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-sm text-blue-800">
              <strong>Your Commitment:</strong> KES {amount ? parseFloat(amount).toLocaleString() : '0'} {frequency !== 'one-time' && `per ${frequency.replace('-', ' ')}`}
            </p>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-3 rounded-lg hover:from-blue-700 hover:to-blue-800 font-semibold disabled:opacity-50"
          >
            {loading ? 'Creating Pledge...' : 'Confirm Pledge'}
          </button>
        </form>
      </div>
    </div>
  )
}
