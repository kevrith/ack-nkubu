import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/hooks/useAuth'
import { Heart, Calendar, ArrowLeft, TrendingUp } from 'lucide-react'
import { Pledge } from '@/types/pledge'

export function PledgeDetailPage() {
  const { pledgeId } = useParams()
  const { user } = useAuth()
  const [pledge, setPledge] = useState<Pledge & { pledge_campaigns?: { title: string; goal_amount: number } } | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (pledgeId && user) loadPledge()
  }, [pledgeId, user])

  async function loadPledge() {
    const { data } = await supabase
      .from('pledges')
      .select('*, pledge_campaigns(title, goal_amount)')
      .eq('id', pledgeId)
      .eq('user_id', user!.id)
      .single()
    setPledge(data)
    setLoading(false)
  }

  if (loading) return <div className="text-center py-12">Loading...</div>
  if (!pledge) return (
    <div className="text-center py-12">
      <p className="text-gray-500">Pledge not found.</p>
      <Link to="/pledges" className="text-navy hover:underline mt-2 inline-block">← Back to pledges</Link>
    </div>
  )

  const campaign = pledge.pledge_campaigns

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center gap-3">
        <Link to="/pledges" className="p-2 hover:bg-gray-100 rounded-lg">
          <ArrowLeft className="w-5 h-5 text-navy" />
        </Link>
        <div className="flex items-center gap-3">
          <Heart className="w-7 h-7 text-navy" />
          <h1 className="text-2xl font-playfair text-navy">My Pledge</h1>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-6 space-y-6">
        {campaign && (
          <div className="pb-4 border-b">
            <p className="text-sm text-gray-500">Campaign</p>
            <h2 className="text-xl font-semibold text-navy">{campaign.title}</h2>
          </div>
        )}

        <div className="grid grid-cols-2 gap-6">
          <div>
            <p className="text-sm text-gray-500">Pledge Amount</p>
            <p className="text-2xl font-bold text-navy">KES {pledge.pledge_amount.toLocaleString()}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Frequency</p>
            <p className="text-lg font-semibold text-navy capitalize">{pledge.frequency}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Status</p>
            <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
              pledge.is_active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'
            }`}>
              {pledge.is_active ? 'Active' : 'Inactive'}
            </span>
          </div>
          <div>
            <div className="flex items-center gap-1 text-sm text-gray-500 mb-1">
              <Calendar className="w-3 h-3" />
              Start Date
            </div>
            <p className="font-medium text-navy">{new Date(pledge.start_date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
          </div>
        </div>

        {pledge.notes && (
          <div className="pt-4 border-t">
            <p className="text-sm text-gray-500 mb-1">Notes</p>
            <p className="text-gray-700">{pledge.notes}</p>
          </div>
        )}

        <div className="pt-4 border-t">
          <div className="flex items-center gap-2 text-navy mb-3">
            <TrendingUp className="w-4 h-4" />
            <span className="text-sm font-medium">Pledge Summary</span>
          </div>
          <p className="text-sm text-gray-600">
            Pledged on {new Date(pledge.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
          {pledge.end_date && (
            <p className="text-sm text-gray-600">
              Until {new Date(pledge.end_date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
            </p>
          )}
        </div>
      </div>

      <Link
        to="/pledges"
        className="block text-center px-6 py-3 bg-navy text-white rounded-lg hover:bg-navy/90 font-medium"
      >
        View All Pledge Campaigns
      </Link>
    </div>
  )
}
