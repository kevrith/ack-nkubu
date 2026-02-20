import { useState, useEffect } from 'react'
import { Plus, TrendingUp, Users, DollarSign, Edit, Trash2 } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import { PledgeCampaign, CampaignProgress } from '@/types/pledge'

export function AdminPledgesPage() {
  const [campaigns, setCampaigns] = useState<PledgeCampaign[]>([])
  const [progress, setProgress] = useState<Record<string, CampaignProgress>>({})
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    goal_amount: '',
    start_date: '',
    end_date: '',
    image_url: ''
  })

  useEffect(() => {
    loadCampaigns()
  }, [])

  async function loadCampaigns() {
    const { data } = await supabase
      .from('pledge_campaigns')
      .select('*')
      .order('created_at', { ascending: false })

    if (data) {
      setCampaigns(data)
      for (const campaign of data) {
        const { data: progData } = await supabase.rpc('get_campaign_progress', { campaign_uuid: campaign.id })
        if (progData && progData.length > 0) {
          setProgress(prev => ({ ...prev, [campaign.id]: progData[0] }))
        }
      }
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    await supabase.from('pledge_campaigns').insert({
      ...formData,
      goal_amount: parseFloat(formData.goal_amount)
    })
    setShowForm(false)
    setFormData({ title: '', description: '', goal_amount: '', start_date: '', end_date: '', image_url: '' })
    loadCampaigns()
  }

  async function toggleActive(id: string, isActive: boolean) {
    await supabase
      .from('pledge_campaigns')
      .update({ is_active: !isActive })
      .eq('id', id)
    loadCampaigns()
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-playfair text-navy">Pledge Campaigns</h1>
        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-2 px-4 py-2 bg-navy text-white rounded-lg hover:bg-navy-600"
        >
          <Plus className="w-4 h-4" />
          New Campaign
        </button>
      </div>

      {showForm && (
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold text-navy mb-4">Create Campaign</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={e => setFormData({...formData, title: e.target.value})}
                  required
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-navy"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Goal Amount (KES)</label>
                <input
                  type="number"
                  value={formData.goal_amount}
                  onChange={e => setFormData({...formData, goal_amount: e.target.value})}
                  required
                  min="1000"
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-navy"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
              <textarea
                value={formData.description}
                onChange={e => setFormData({...formData, description: e.target.value})}
                rows={3}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-navy"
              />
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Start Date</label>
                <input
                  type="date"
                  value={formData.start_date}
                  onChange={e => setFormData({...formData, start_date: e.target.value})}
                  required
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-navy"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">End Date</label>
                <input
                  type="date"
                  value={formData.end_date}
                  onChange={e => setFormData({...formData, end_date: e.target.value})}
                  required
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-navy"
                />
              </div>
            </div>
            <div className="flex gap-3">
              <button type="submit" className="px-6 py-2 bg-navy text-white rounded-lg hover:bg-navy-600">
                Create Campaign
              </button>
              <button type="button" onClick={() => setShowForm(false)} className="px-6 py-2 bg-gray-100 rounded-lg hover:bg-gray-200">
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="grid md:grid-cols-2 gap-6">
        {campaigns.map(campaign => {
          const prog = progress[campaign.id] || { total_pledged: 0, total_paid: 0, pledge_count: 0, donor_count: 0 }
          const percentPledged = (prog.total_pledged / campaign.goal_amount) * 100

          return (
            <div key={campaign.id} className="bg-white rounded-lg shadow p-6 space-y-4">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-navy">{campaign.title}</h3>
                  <p className="text-sm text-gray-600">{campaign.description}</p>
                </div>
                <button
                  onClick={() => toggleActive(campaign.id, campaign.is_active)}
                  className={`px-3 py-1 rounded text-xs font-medium ${
                    campaign.is_active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                  }`}
                >
                  {campaign.is_active ? 'Active' : 'Inactive'}
                </button>
              </div>

              <div className="grid grid-cols-4 gap-3">
                <div className="text-center p-3 bg-blue-50 rounded">
                  <DollarSign className="w-5 h-5 text-blue-600 mx-auto mb-1" />
                  <p className="text-xs text-gray-600">Goal</p>
                  <p className="font-semibold text-navy text-sm">{campaign.goal_amount.toLocaleString()}</p>
                </div>
                <div className="text-center p-3 bg-green-50 rounded">
                  <TrendingUp className="w-5 h-5 text-green-600 mx-auto mb-1" />
                  <p className="text-xs text-gray-600">Pledged</p>
                  <p className="font-semibold text-navy text-sm">{prog.total_pledged.toLocaleString()}</p>
                </div>
                <div className="text-center p-3 bg-purple-50 rounded">
                  <Users className="w-5 h-5 text-purple-600 mx-auto mb-1" />
                  <p className="text-xs text-gray-600">Donors</p>
                  <p className="font-semibold text-navy text-sm">{prog.donor_count}</p>
                </div>
                <div className="text-center p-3 bg-orange-50 rounded">
                  <TrendingUp className="w-5 h-5 text-orange-600 mx-auto mb-1" />
                  <p className="text-xs text-gray-600">Progress</p>
                  <p className="font-semibold text-navy text-sm">{percentPledged.toFixed(0)}%</p>
                </div>
              </div>

              <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-blue-500 to-blue-600 transition-all"
                  style={{ width: `${Math.min(percentPledged, 100)}%` }}
                />
              </div>

              <div className="text-xs text-gray-500">
                {new Date(campaign.start_date).toLocaleDateString()} - {new Date(campaign.end_date).toLocaleDateString()}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
