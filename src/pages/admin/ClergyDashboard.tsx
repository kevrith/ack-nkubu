import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { formatKES } from '@/lib/utils'
import { MessageCircleHeart, Shield, CheckCircle, XCircle, Clock, Plus, Users, Calendar, Bell, TrendingUp, DollarSign } from 'lucide-react'
import { Testimony } from '@/types/testimony'
import { useAuth } from '@/hooks/useAuth'
import { Link } from 'react-router-dom'

export function ClergyDashboard() {
  const { user } = useAuth()
  const [activeTab, setActiveTab] = useState<'overview' | 'testimonies' | 'pastoral' | 'analytics'>('overview')
  const [pendingTestimonies, setPendingTestimonies] = useState<Testimony[]>([])
  const [pastoralRequests, setPastoralRequests] = useState<any[]>([])
  const [stats, setStats] = useState({
    pendingTestimonies: 0,
    pendingPastoral: 0,
    totalMembers: 0,
    thisWeekSermons: 0,
    totalGiving: 0,
    givingThisMonth: 0
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadStats()
    loadPendingTestimonies()
    loadPastoralRequests()
  }, [])

  async function loadStats() {
    const now = new Date()
    const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).toISOString()

    const [testimonies, pastoral, members, giving, givingMonth] = await Promise.all([
      supabase.from('testimonies').select('id', { count: 'exact', head: true }).eq('status', 'pending'),
      supabase.from('pastoral_care_requests').select('id', { count: 'exact', head: true }).eq('status', 'pending'),
      supabase.from('profiles').select('id', { count: 'exact', head: true }),
      supabase.from('giving_records').select('amount_kes'),
      supabase.from('giving_records').select('amount_kes').gte('giving_date', firstDayOfMonth)
    ])
    
    setStats({
      pendingTestimonies: testimonies.count || 0,
      pendingPastoral: pastoral.count || 0,
      totalMembers: members.count || 0,
      thisWeekSermons: 0,
      totalGiving: giving.data?.reduce((sum, r) => sum + parseFloat(r.amount_kes.toString()), 0) || 0,
      givingThisMonth: givingMonth.data?.reduce((sum, r) => sum + parseFloat(r.amount_kes.toString()), 0) || 0
    })
  }

  async function loadPastoralRequests() {
    const { data } = await supabase
      .from('pastoral_care_requests')
      .select(`
        *,
        requester:profiles!requester_id(full_name, phone)
      `)
      .eq('status', 'pending')
      .order('created_at', { ascending: false })
      .limit(5)
    setPastoralRequests(data || [])
  }

  async function loadPendingTestimonies() {
    setLoading(true)
    const { data } = await supabase
      .from('testimonies')
      .select(`
        *,
        author:profiles!author_id(full_name, avatar_url)
      `)
      .eq('status', 'pending')
      .order('created_at', { ascending: false })
    setPendingTestimonies(data || [])
    setLoading(false)
  }

  async function approveTestimony(id: string) {
    await supabase
      .from('testimonies')
      .update({
        status: 'approved',
        approved_by: user?.id,
        approved_at: new Date().toISOString()
      })
      .eq('id', id)
    loadPendingTestimonies()
  }

  async function rejectTestimony(id: string) {
    await supabase
      .from('testimonies')
      .update({
        status: 'rejected',
        approved_by: user?.id,
        approved_at: new Date().toISOString()
      })
      .eq('id', id)
    loadPendingTestimonies()
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-playfair text-navy">Clergy Dashboard</h1>
        <p className="text-gray-600">Manage testimonies and pastoral care requests</p>
      </div>

      <div className="bg-white rounded-lg shadow">
        <div className="border-b">
          <div className="flex">
            <button
              onClick={() => setActiveTab('overview')}
              className={`flex items-center gap-2 px-6 py-3 font-medium ${
                activeTab === 'overview'
                  ? 'text-navy border-b-2 border-navy'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <Calendar className="w-5 h-5" />
              Overview
            </button>
            <button
              onClick={() => setActiveTab('testimonies')}
              className={`flex items-center gap-2 px-6 py-3 font-medium ${
                activeTab === 'testimonies'
                  ? 'text-navy border-b-2 border-navy'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <MessageCircleHeart className="w-5 h-5" />
              Testimonies ({stats.pendingTestimonies})
            </button>
            <button
              onClick={() => setActiveTab('pastoral')}
              className={`flex items-center gap-2 px-6 py-3 font-medium ${
                activeTab === 'pastoral'
                  ? 'text-navy border-b-2 border-navy'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <Shield className="w-5 h-5" />
              Pastoral Care ({stats.pendingPastoral})
            </button>
            <button
              onClick={() => setActiveTab('analytics')}
              className={`flex items-center gap-2 px-6 py-3 font-medium ${
                activeTab === 'analytics'
                  ? 'text-navy border-b-2 border-navy'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <TrendingUp className="w-5 h-5" />
              Analytics
            </button>
          </div>
        </div>

        <div className="p-6">
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* Stats Cards */}
              <div className="grid md:grid-cols-4 gap-4">
                <StatCard
                  icon={<MessageCircleHeart className="w-6 h-6" />}
                  label="Pending Testimonies"
                  value={stats.pendingTestimonies}
                  color="blue"
                />
                <StatCard
                  icon={<Shield className="w-6 h-6" />}
                  label="Pastoral Requests"
                  value={stats.pendingPastoral}
                  color="purple"
                />
                <StatCard
                  icon={<Users className="w-6 h-6" />}
                  label="Total Members"
                  value={stats.totalMembers}
                  color="green"
                />
                <StatCard
                  icon={<Calendar className="w-6 h-6" />}
                  label="This Week"
                  value={stats.thisWeekSermons}
                  color="gold"
                />
              </div>

              {/* Quick Actions */}
              <div>
                <h3 className="text-lg font-semibold text-navy mb-4">Quick Actions</h3>
                <div className="grid md:grid-cols-3 gap-4">
                  <Link
                    to="/admin/content"
                    className="flex items-center gap-3 p-4 border-2 border-navy rounded-lg hover:bg-navy hover:text-white transition"
                  >
                    <Plus className="w-5 h-5" />
                    <div>
                      <div className="font-semibold">Add Content</div>
                      <div className="text-sm opacity-75">Sermons, notices, events</div>
                    </div>
                  </Link>
                  <Link
                    to="/clergy/pastoral-care"
                    className="flex items-center gap-3 p-4 border-2 border-purple-600 text-purple-600 rounded-lg hover:bg-purple-600 hover:text-white transition"
                  >
                    <Shield className="w-5 h-5" />
                    <div>
                      <div className="font-semibold">Pastoral Care</div>
                      <div className="text-sm opacity-75">Manage requests</div>
                    </div>
                  </Link>
                  <Link
                    to="/admin/notifications"
                    className="flex items-center gap-3 p-4 border-2 border-gold text-gold rounded-lg hover:bg-gold hover:text-navy transition"
                  >
                    <Bell className="w-5 h-5" />
                    <div>
                      <div className="font-semibold">Send Notice</div>
                      <div className="text-sm opacity-75">Notify members</div>
                    </div>
                  </Link>
                </div>
              </div>

              {/* Recent Pastoral Requests */}
              {pastoralRequests.length > 0 && (
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-navy">Recent Pastoral Requests</h3>
                    <Link to="/clergy/pastoral-care" className="text-sm text-navy hover:text-gold">
                      View All →
                    </Link>
                  </div>
                  <div className="space-y-3">
                    {pastoralRequests.map((request) => (
                      <div key={request.id} className="border rounded-lg p-4">
                        <div className="flex items-start justify-between mb-2">
                          <div className="font-medium text-navy">{request.requester?.full_name}</div>
                          <span className="text-xs bg-amber-100 text-amber-700 px-2 py-1 rounded">
                            {request.type.replace('_', ' ')}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 line-clamp-2">{request.details}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === 'testimonies' && (
            <div className="space-y-6">
              {loading ? (
                <div className="text-center py-12 text-gray-500">Loading testimonies...</div>
              ) : pendingTestimonies.length === 0 ? (
                <div className="text-center py-12">
                  <MessageCircleHeart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500">No pending testimonies to review</p>
                </div>
              ) : (
                pendingTestimonies.map((testimony) => (
                  <div key={testimony.id} className="border rounded-lg p-6 space-y-4">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        {testimony.author?.avatar_url ? (
                          <img src={testimony.author.avatar_url} alt="" className="w-12 h-12 rounded-full" />
                        ) : (
                          <div className="w-12 h-12 rounded-full bg-navy text-white flex items-center justify-center font-semibold">
                            {testimony.author?.full_name?.[0]}
                          </div>
                        )}
                        <div>
                          <div className="font-semibold text-navy">{testimony.author?.full_name}</div>
                          <div className="text-sm text-gray-500">
                            {new Date(testimony.created_at).toLocaleDateString()} at{' '}
                            {new Date(testimony.created_at).toLocaleTimeString()}
                          </div>
                        </div>
                      </div>
                      <span className="flex items-center gap-1 text-xs text-amber-600 bg-amber-50 px-3 py-1 rounded">
                        <Clock className="w-3 h-3" />
                        Pending Review
                      </span>
                    </div>

                    <div>
                      <h3 className="text-lg font-semibold text-navy mb-2">{testimony.title}</h3>
                      <span className="text-xs px-2 py-1 rounded bg-blue-100 text-blue-700">
                        {testimony.category.replace('_', ' ')}
                      </span>
                    </div>

                    <p className="text-gray-700 whitespace-pre-wrap">{testimony.content}</p>

                    {testimony.image_url && (
                      <img src={testimony.image_url} alt="" className="w-full max-w-md rounded-lg" />
                    )}

                    <div className="flex gap-3 pt-4 border-t">
                      <button
                        onClick={() => approveTestimony(testimony.id)}
                        className="flex items-center gap-2 px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 font-semibold"
                      >
                        <CheckCircle className="w-4 h-4" />
                        Approve
                      </button>
                      <button
                        onClick={() => rejectTestimony(testimony.id)}
                        className="flex items-center gap-2 px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 font-semibold"
                      >
                        <XCircle className="w-4 h-4" />
                        Reject
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {activeTab === 'pastoral' && (
            <div className="text-center py-12">
              <Shield className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 mb-4">View and manage pastoral care requests</p>
              <Link to="/clergy/pastoral-care" className="inline-block px-6 py-3 bg-navy text-white rounded-lg hover:bg-navy/90 font-semibold">
                Go to Pastoral Care Dashboard
              </Link>
            </div>
          )}

          {activeTab === 'analytics' && (
            <div className="space-y-6">
              <div className="grid md:grid-cols-2 gap-4">
                <StatCard
                  icon={<DollarSign className="w-6 h-6" />}
                  label="Total Giving"
                  value={formatKES(stats.totalGiving)}
                  color="green"
                />
                <StatCard
                  icon={<TrendingUp className="w-6 h-6" />}
                  label="This Month"
                  value={formatKES(stats.givingThisMonth)}
                  color="blue"
                />
              </div>
              <div className="text-center py-8">
                <TrendingUp className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500 mb-4">View detailed analytics and giving reports</p>
                <Link to="/admin/giving-reports" className="inline-block px-6 py-3 bg-navy text-white rounded-lg hover:bg-navy/90 font-semibold">
                  View Full Reports
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

function StatCard({ icon, label, value, color }: { icon: React.ReactNode; label: string; value: number | string; color: string }) {
  const colors: Record<string, string> = {
    blue: 'bg-blue-100 text-blue-600',
    purple: 'bg-purple-100 text-purple-600',
    green: 'bg-green-100 text-green-600',
    gold: 'bg-gold/20 text-gold-700'
  }

  return (
    <div className="bg-white border rounded-lg p-4">
      <div className={`w-12 h-12 rounded-lg ${colors[color]} flex items-center justify-center mb-3`}>
        {icon}
      </div>
      <div className="text-2xl font-bold text-navy mb-1">{value}</div>
      <div className="text-sm text-gray-600">{label}</div>
    </div>
  )
}
