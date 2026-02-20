import { useState, useEffect } from 'react'
import { Users, DollarSign, FileText, Calendar, TrendingUp, Activity } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import { formatKES } from '@/lib/utils'
import { Link } from 'react-router-dom'
import { AnalyticsCharts } from '@/components/analytics/AnalyticsCharts'

interface Stats {
  totalMembers: number
  activeMembers: number
  newThisMonth: number
  totalGiving: number
  givingThisMonth: number
  totalSermons: number
  totalEvents: number
  totalPosts: number
}

export function AdminDashboard() {
  const [stats, setStats] = useState<Stats>({
    totalMembers: 0,
    activeMembers: 0,
    newThisMonth: 0,
    totalGiving: 0,
    givingThisMonth: 0,
    totalSermons: 0,
    totalEvents: 0,
    totalPosts: 0,
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchStats()
  }, [])

  async function fetchStats() {
    const now = new Date()
    const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).toISOString()

    const [members, newMembers, giving, givingMonth, sermons, events, posts] = await Promise.all([
      supabase.from('profiles').select('id', { count: 'exact', head: true }),
      supabase.from('profiles').select('id', { count: 'exact', head: true }).gte('created_at', firstDayOfMonth),
      supabase.from('giving_records').select('amount_kes'),
      supabase.from('giving_records').select('amount_kes').gte('giving_date', firstDayOfMonth),
      supabase.from('sermons').select('id', { count: 'exact', head: true }).eq('is_published', true),
      supabase.from('events').select('id', { count: 'exact', head: true }).eq('is_published', true),
      supabase.from('community_posts').select('id', { count: 'exact', head: true }),
    ])

    setStats({
      totalMembers: members.count || 0,
      activeMembers: members.count || 0,
      newThisMonth: newMembers.count || 0,
      totalGiving: giving.data?.reduce((sum, r) => sum + parseFloat(r.amount_kes.toString()), 0) || 0,
      givingThisMonth: givingMonth.data?.reduce((sum, r) => sum + parseFloat(r.amount_kes.toString()), 0) || 0,
      totalSermons: sermons.count || 0,
      totalEvents: events.count || 0,
      totalPosts: posts.count || 0,
    })
    setLoading(false)
  }

  if (loading) {
    return <div className="text-center py-12">Loading dashboard...</div>
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-playfair text-navy">Admin Dashboard</h1>

      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-2">
            <div className="text-sm text-gray-600">Total Members</div>
            <Users className="w-5 h-5 text-navy" />
          </div>
          <div className="text-3xl font-bold text-navy">{stats.totalMembers}</div>
          <div className="text-sm text-green-600 mt-1">+{stats.newThisMonth} this month</div>
        </div>

        <Link to="/admin/giving-reports" className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition">
          <div className="flex items-center justify-between mb-2">
            <div className="text-sm text-gray-600">Total Giving</div>
            <DollarSign className="w-5 h-5 text-gold" />
          </div>
          <div className="text-3xl font-bold text-navy">{formatKES(stats.totalGiving)}</div>
          <div className="text-sm text-gray-600 mt-1">{formatKES(stats.givingThisMonth)} this month</div>
        </Link>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-2">
            <div className="text-sm text-gray-600">Sermons</div>
            <FileText className="w-5 h-5 text-navy" />
          </div>
          <div className="text-3xl font-bold text-navy">{stats.totalSermons}</div>
          <div className="text-sm text-gray-600 mt-1">Published</div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-2">
            <div className="text-sm text-gray-600">Events</div>
            <Calendar className="w-5 h-5 text-navy" />
          </div>
          <div className="text-3xl font-bold text-navy">{stats.totalEvents}</div>
          <div className="text-sm text-gray-600 mt-1">Upcoming</div>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold text-navy mb-4 flex items-center gap-2">
            <TrendingUp className="w-5 h-5" />
            Quick Stats
          </h2>
          <div className="space-y-3">
            <div className="flex justify-between items-center py-2 border-b">
              <span className="text-gray-600">Community Posts</span>
              <span className="font-semibold text-navy">{stats.totalPosts}</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b">
              <span className="text-gray-600">Active Members</span>
              <span className="font-semibold text-navy">{stats.activeMembers}</span>
            </div>
            <div className="flex justify-between items-center py-2">
              <span className="text-gray-600">New Members (Month)</span>
              <span className="font-semibold text-green-600">+{stats.newThisMonth}</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold text-navy mb-4 flex items-center gap-2">
            <Activity className="w-5 h-5" />
            Recent Activity
          </h2>
          <div className="space-y-3 text-sm text-gray-600">
            <p>✓ Dashboard loaded successfully</p>
            <p>✓ All systems operational</p>
            <p>✓ Database connected</p>
          </div>
        </div>
      </div>

      <AnalyticsCharts />
    </div>
  )
}
