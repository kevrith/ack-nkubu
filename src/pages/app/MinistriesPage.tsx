import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/hooks/useAuth'
import { Users, Calendar, MapPin, Clock, UserPlus, CheckCircle } from 'lucide-react'
import { Ministry } from '@/types/ministry'
import { Link } from 'react-router-dom'

export function MinistriesPage() {
  const { user } = useAuth()
  const [ministries, setMinistries] = useState<Ministry[]>([])
  const [myMinistries, setMyMinistries] = useState<string[]>([])
  const [filter, setFilter] = useState<string>('all')
  const [loading, setLoading] = useState(true)
  const isLeader = ['leader', 'clergy', 'admin'].includes(user?.profile.role || '')

  useEffect(() => {
    loadMinistries()
    loadMyMinistries()
  }, [filter])

  async function loadMinistries() {
    setLoading(true)
    let query = supabase
      .from('ministries')
      .select(`
        *,
        leader:profiles!leader_id(full_name, avatar_url, phone)
      `)
      .eq('is_active', true)
      .order('name')

    if (filter !== 'all') {
      query = query.eq('category', filter)
    }

    const { data } = await query

    if (data) {
      const ministriesWithCounts = await Promise.all(
        data.map(async (ministry) => {
          const { count } = await supabase
            .from('ministry_members')
            .select('*', { count: 'exact', head: true })
            .eq('ministry_id', ministry.id)
            .eq('is_active', true)
          return { ...ministry, member_count: count || 0 }
        })
      )
      setMinistries(ministriesWithCounts)
    }
    setLoading(false)
  }

  async function loadMyMinistries() {
    const { data } = await supabase
      .from('ministry_members')
      .select('ministry_id')
      .eq('member_id', user?.id)
      .eq('is_active', true)
    setMyMinistries(data?.map(m => m.ministry_id) || [])
  }

  async function joinMinistry(ministryId: string) {
    await supabase.from('ministry_members').insert({
      ministry_id: ministryId,
      member_id: user?.id,
      role: 'member'
    })
    loadMyMinistries()
  }

  async function leaveMinistry(ministryId: string) {
    await supabase
      .from('ministry_members')
      .update({ is_active: false })
      .eq('ministry_id', ministryId)
      .eq('member_id', user?.id)
    loadMyMinistries()
  }

  const categories = [
    { value: 'all', label: 'All Ministries' },
    { value: 'fellowship', label: 'Fellowship' },
    { value: 'service', label: 'Service' },
    { value: 'worship', label: 'Worship' },
    { value: 'education', label: 'Education' },
    { value: 'outreach', label: 'Outreach' }
  ]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-playfair text-navy">Ministries & Departments</h1>
          <p className="text-gray-600">Join a ministry and serve in the church</p>
        </div>
        {isLeader && (
          <Link
            to="/admin/ministries"
            className="px-4 py-2 bg-navy text-white rounded-lg hover:bg-navy/90"
          >
            Manage Ministries
          </Link>
        )}
      </div>

      <div className="flex gap-2 overflow-x-auto pb-2">
        {categories.map((cat) => (
          <button
            key={cat.value}
            onClick={() => setFilter(cat.value)}
            className={`px-4 py-2 rounded-lg font-medium whitespace-nowrap ${
              filter === cat.value ? 'bg-navy text-white' : 'bg-gray-100 text-gray-700'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="text-center py-12 text-gray-500">Loading ministries...</div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {ministries.map((ministry) => {
            const isMember = myMinistries.includes(ministry.id)
            return (
              <div key={ministry.id} className="bg-white rounded-lg shadow p-6 space-y-4">
                <div>
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="text-xl font-semibold text-navy">{ministry.name}</h3>
                    {isMember && (
                      <span className="flex items-center gap-1 text-xs bg-green-100 text-green-700 px-2 py-1 rounded">
                        <CheckCircle className="w-3 h-3" />
                        Joined
                      </span>
                    )}
                  </div>
                  {ministry.description && (
                    <p className="text-sm text-gray-600">{ministry.description}</p>
                  )}
                </div>

                <div className="space-y-2 text-sm">
                  {ministry.meeting_day && (
                    <div className="flex items-center gap-2 text-gray-700">
                      <Calendar className="w-4 h-4 text-navy" />
                      <span>{ministry.meeting_day}s</span>
                    </div>
                  )}
                  {ministry.meeting_time && (
                    <div className="flex items-center gap-2 text-gray-700">
                      <Clock className="w-4 h-4 text-navy" />
                      <span>{ministry.meeting_time}</span>
                    </div>
                  )}
                  {ministry.location && (
                    <div className="flex items-center gap-2 text-gray-700">
                      <MapPin className="w-4 h-4 text-navy" />
                      <span>{ministry.location}</span>
                    </div>
                  )}
                  <div className="flex items-center gap-2 text-gray-700">
                    <Users className="w-4 h-4 text-navy" />
                    <span>{ministry.member_count || 0} members</span>
                  </div>
                </div>

                {ministry.leader && (
                  <div className="pt-4 border-t">
                    <div className="flex items-center gap-2">
                      {ministry.leader.avatar_url ? (
                        <img src={ministry.leader.avatar_url} alt="" className="w-8 h-8 rounded-full" />
                      ) : (
                        <div className="w-8 h-8 rounded-full bg-navy text-white flex items-center justify-center text-sm font-semibold">
                          {ministry.leader.full_name?.[0]}
                        </div>
                      )}
                      <div>
                        <div className="text-xs text-gray-500">Leader</div>
                        <div className="text-sm font-medium text-navy">{ministry.leader.full_name}</div>
                      </div>
                    </div>
                  </div>
                )}

                <div className="pt-4">
                  {isMember ? (
                    <div className="flex gap-2">
                      <Link
                        to={`/ministries/${ministry.id}`}
                        className="flex-1 text-center px-4 py-2 bg-navy text-white rounded-lg hover:bg-navy/90 font-semibold"
                      >
                        View Ministry
                      </Link>
                      <button
                        onClick={() => leaveMinistry(ministry.id)}
                        className="px-4 py-2 border border-red-500 text-red-600 rounded-lg hover:bg-red-50"
                      >
                        Leave
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => joinMinistry(ministry.id)}
                      className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-gold text-navy rounded-lg hover:bg-gold/90 font-semibold"
                    >
                      <UserPlus className="w-4 h-4" />
                      Join Ministry
                    </button>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
