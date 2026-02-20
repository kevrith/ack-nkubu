import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Heart, TrendingUp, Users, Calendar, Plus } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/hooks/useAuth'
import { PledgeCampaign, CampaignProgress } from '@/types/pledge'

export function PledgesPage() {
  const { user } = useAuth()
  const [campaigns, setCampaigns] = useState<PledgeCampaign[]>([])
  const [progress, setProgress] = useState<Record<string, CampaignProgress>>({})
  const [myPledges, setMyPledges] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadData()
  }, [])

  async function loadData() {
    const { data: campaignsData } = await supabase
      .from('pledge_campaigns')
      .select('*')
      .eq('is_active', true)
      .order('end_date', { ascending: true })

    if (campaignsData) {
      setCampaigns(campaignsData)
      
      // Load progress for each campaign
      for (const campaign of campaignsData) {
        const { data } = await supabase.rpc('get_campaign_progress', { campaign_uuid: campaign.id })
        if (data && data.length > 0) {
          setProgress(prev => ({ ...prev, [campaign.id]: data[0] }))
        }
      }
    }

    if (user) {
      const { data: pledgesData } = await supabase
        .from('pledges')
        .select('*, pledge_campaigns(title)')
        .eq('user_id', user.id)
        .eq('is_active', true)
      setMyPledges(pledgesData || [])
    }

    setLoading(false)
  }

  if (loading) return <div className="text-center py-12">Loading...</div>

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-playfair text-navy">Pledge Campaigns</h1>
          <p className="text-gray-600 mt-1">Support our parish building and ministry projects</p>
        </div>
      </div>

      {/* Active Campaigns */}
      <div className="grid md:grid-cols-2 gap-6">
        {campaigns.map(campaign => {
          const prog = progress[campaign.id] || { total_pledged: 0, total_paid: 0, pledge_count: 0, donor_count: 0 }
          const percentPledged = (prog.total_pledged / campaign.goal_amount) * 100
          const percentPaid = (prog.total_paid / campaign.goal_amount) * 100

          return (
            <div key={campaign.id} className="bg-white rounded-lg shadow-lg overflow-hidden">
              {campaign.image_url && (
                <img src={campaign.image_url} alt={campaign.title} className="w-full h-48 object-cover" />
              )}
              <div className="p-6 space-y-4">
                <div>
                  <h3 className="text-xl font-semibold text-navy">{campaign.title}</h3>
                  <p className="text-gray-600 text-sm mt-1">{campaign.description}</p>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Goal: KES {campaign.goal_amount.toLocaleString()}</span>
                    <span className="font-semibold text-navy">
                      {percentPledged.toFixed(0)}% pledged
                    </span>
                  </div>
                  <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-blue-500 to-blue-600 transition-all" style={{ width: `${Math.min(percentPledged, 100)}%` }} />
                  </div>
                  <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-green-500 to-green-600 transition-all" style={{ width: `${Math.min(percentPaid, 100)}%` }} />
                  </div>
                  <div className="flex justify-between text-xs text-gray-500">
                    <span>Pledged: KES {prog.total_pledged.toLocaleString()}</span>
                    <span>Paid: KES {prog.total_paid.toLocaleString()}</span>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-3 pt-3 border-t">
                  <div className="text-center">
                    <Users className="w-4 h-4 text-gray-400 mx-auto mb-1" />
                    <p className="text-xs text-gray-500">Donors</p>
                    <p className="font-semibold text-navy">{prog.donor_count}</p>
                  </div>
                  <div className="text-center">
                    <TrendingUp className="w-4 h-4 text-gray-400 mx-auto mb-1" />
                    <p className="text-xs text-gray-500">Pledges</p>
                    <p className="font-semibold text-navy">{prog.pledge_count}</p>
                  </div>
                  <div className="text-center">
                    <Calendar className="w-4 h-4 text-gray-400 mx-auto mb-1" />
                    <p className="text-xs text-gray-500">Ends</p>
                    <p className="font-semibold text-navy text-xs">{new Date(campaign.end_date).toLocaleDateString()}</p>
                  </div>
                </div>

                <Link
                  to={`/pledges/${campaign.id}`}
                  className="block w-full text-center px-4 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 font-semibold"
                >
                  Make a Pledge
                </Link>
              </div>
            </div>
          )
        })}
      </div>

      {/* My Pledges */}
      {myPledges.length > 0 && (
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold text-navy mb-4">My Pledges</h2>
          <div className="space-y-3">
            {myPledges.map(pledge => (
              <Link
                key={pledge.id}
                to={`/pledges/my/${pledge.id}`}
                className="block p-4 border rounded-lg hover:border-navy transition"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-semibold text-navy">{pledge.pledge_campaigns?.title}</p>
                    <p className="text-sm text-gray-600">
                      KES {pledge.pledge_amount.toLocaleString()} • {pledge.frequency}
                    </p>
                  </div>
                  <Heart className="w-5 h-5 text-red-500" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
