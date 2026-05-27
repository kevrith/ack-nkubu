import { useState, useEffect, useMemo } from 'react'
import { Users, Search, X, Phone, UserCheck, UserX, ChevronDown, ChevronUp, Filter } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/hooks/useAuth'

interface Member {
  id: string
  full_name: string
  phone: string | null
  avatar_url: string | null
  role: string
  cell_group: string | null
  membership_number: string | null
  date_joined: string | null
  is_active: boolean
  created_at: string
}

type StatusFilter = 'all' | 'active' | 'dormant'

const ROLE_LABELS: Record<string, string> = {
  basic_member: 'Member',
  leader: 'Leader',
  clergy: 'Clergy',
  admin: 'Admin',
}

const ROLE_COLORS: Record<string, string> = {
  basic_member: 'bg-gray-100 text-gray-700',
  leader: 'bg-blue-100 text-blue-700',
  clergy: 'bg-purple-100 text-purple-700',
  admin: 'bg-red-100 text-red-700',
}

function initials(name: string) {
  return name.split(' ').map(w => w[0]).slice(0, 2).join('').toUpperCase()
}

export function MembersPage() {
  const { user } = useAuth()
  const [members, setMembers] = useState<Member[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all')
  const [roleFilter, setRoleFilter] = useState('all')
  const [groupFilter, setGroupFilter] = useState('all')
  const [showFilters, setShowFilters] = useState(false)
  const [togglingId, setTogglingId] = useState<string | null>(null)

  const canManage = ['clergy', 'admin'].includes(user?.profile.role || '')

  useEffect(() => { fetchMembers() }, [])

  async function fetchMembers() {
    const { data } = await supabase
      .from('profiles')
      .select('id, full_name, phone, avatar_url, role, cell_group, membership_number, date_joined, is_active, created_at')
      .order('full_name')
    setMembers(data || [])
    setLoading(false)
  }

  async function toggleActive(member: Member) {
    setTogglingId(member.id)
    await supabase.from('profiles').update({ is_active: !member.is_active }).eq('id', member.id)
    setMembers(prev => prev.map(m => m.id === member.id ? { ...m, is_active: !m.is_active } : m))
    setTogglingId(null)
  }

  const cellGroups = useMemo(() => Array.from(new Set(members.map(m => m.cell_group).filter(Boolean))).sort() as string[], [members])

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase()
    return members.filter(m => {
      if (statusFilter === 'active' && !m.is_active) return false
      if (statusFilter === 'dormant' && m.is_active) return false
      if (roleFilter !== 'all' && m.role !== roleFilter) return false
      if (groupFilter !== 'all' && m.cell_group !== groupFilter) return false
      if (q) {
        return (
          m.full_name.toLowerCase().includes(q) ||
          m.phone?.includes(q) ||
          m.membership_number?.toLowerCase().includes(q) ||
          m.cell_group?.toLowerCase().includes(q)
        )
      }
      return true
    })
  }, [members, search, statusFilter, roleFilter, groupFilter])

  const stats = useMemo(() => ({
    total: members.length,
    active: members.filter(m => m.is_active).length,
    dormant: members.filter(m => !m.is_active).length,
    leaders: members.filter(m => ['leader', 'clergy', 'admin'].includes(m.role)).length,
  }), [members])

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24">
        <div className="w-8 h-8 border-4 border-navy border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 pb-24 space-y-6">

      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-navy rounded-xl flex items-center justify-center">
          <Users className="w-5 h-5 text-gold" />
        </div>
        <div>
          <h1 className="text-xl font-bold text-navy">Members</h1>
          <p className="text-xs text-gray-500">Member overview and management</p>
        </div>
      </div>

      {/* Stats cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: 'Total Members', value: stats.total, color: 'bg-navy text-white', sub: 'registered' },
          { label: 'Active', value: stats.active, color: 'bg-green-50 text-green-800', sub: `${stats.total ? Math.round(stats.active / stats.total * 100) : 0}%` },
          { label: 'Dormant', value: stats.dormant, color: 'bg-orange-50 text-orange-800', sub: `${stats.total ? Math.round(stats.dormant / stats.total * 100) : 0}%` },
          { label: 'Leadership', value: stats.leaders, color: 'bg-blue-50 text-blue-800', sub: 'leaders & clergy' },
        ].map(s => (
          <div key={s.label} className={`rounded-2xl p-4 ${s.color}`}>
            <p className="text-2xl font-bold">{s.value}</p>
            <p className="text-xs font-semibold mt-0.5 opacity-80">{s.label}</p>
            <p className="text-xs opacity-60 mt-0.5">{s.sub}</p>
          </div>
        ))}
      </div>

      {/* Status tabs */}
      <div className="flex bg-gray-100 rounded-xl p-1 gap-1">
        {([
          { key: 'all', label: `All (${stats.total})` },
          { key: 'active', label: `Active (${stats.active})` },
          { key: 'dormant', label: `Dormant (${stats.dormant})` },
        ] as const).map(t => (
          <button key={t.key} onClick={() => setStatusFilter(t.key)}
            className={`flex-1 py-2 rounded-lg text-xs font-semibold transition-all ${statusFilter === t.key ? 'bg-white text-navy shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}>
            {t.label}
          </button>
        ))}
      </div>

      {/* Search + filter toggle */}
      <div className="space-y-2">
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text" value={search} onChange={e => setSearch(e.target.value)}
              placeholder="Search by name, phone, or membership no…"
              className="w-full pl-10 pr-8 py-2.5 border border-gray-200 rounded-xl text-sm bg-white focus:outline-none focus:ring-2 focus:ring-navy/20"
            />
            {search && (
              <button onClick={() => setSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
          <button onClick={() => setShowFilters(v => !v)}
            className={`flex items-center gap-1.5 px-3 py-2 border rounded-xl text-sm font-medium transition-colors ${showFilters ? 'bg-navy text-white border-navy' : 'border-gray-200 text-gray-600 hover:bg-gray-50'}`}>
            <Filter className="w-3.5 h-3.5" />
            {showFilters ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
          </button>
        </div>

        {showFilters && (
          <div className="flex gap-2 flex-wrap">
            <select value={roleFilter} onChange={e => setRoleFilter(e.target.value)}
              className="px-3 py-2 border border-gray-200 rounded-xl text-sm bg-white focus:outline-none focus:ring-2 focus:ring-navy/20">
              <option value="all">All Roles</option>
              <option value="basic_member">Members</option>
              <option value="leader">Leaders</option>
              <option value="clergy">Clergy</option>
              <option value="admin">Admin</option>
            </select>
            <select value={groupFilter} onChange={e => setGroupFilter(e.target.value)}
              className="px-3 py-2 border border-gray-200 rounded-xl text-sm bg-white focus:outline-none focus:ring-2 focus:ring-navy/20">
              <option value="all">All Cell Groups</option>
              {cellGroups.map(g => <option key={g} value={g}>{g}</option>)}
            </select>
            {(roleFilter !== 'all' || groupFilter !== 'all') && (
              <button onClick={() => { setRoleFilter('all'); setGroupFilter('all') }}
                className="px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-xl border border-red-100 transition-colors">
                Clear filters
              </button>
            )}
          </div>
        )}
      </div>

      {/* Results count */}
      <p className="text-xs text-gray-500">
        Showing {filtered.length} of {members.length} members
        {search && ` matching "${search}"`}
      </p>

      {/* Member list */}
      {filtered.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl border border-gray-100">
          <Users className="w-12 h-12 text-gray-200 mx-auto mb-3" />
          <p className="font-medium text-gray-600">No members found</p>
          <p className="text-sm text-gray-400 mt-1">Try adjusting your search or filters</p>
        </div>
      ) : (
        <div className="space-y-2">
          {filtered.map(member => (
            <div key={member.id}
              className={`bg-white rounded-xl border px-4 py-3 flex items-center gap-3 transition-all ${member.is_active ? 'border-gray-100' : 'border-orange-100 bg-orange-50/20'}`}>

              {/* Avatar */}
              <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 text-sm font-bold ${member.is_active ? 'bg-navy/10 text-navy' : 'bg-gray-100 text-gray-400'}`}>
                {member.avatar_url
                  ? <img src={member.avatar_url} alt={member.full_name} className="w-full h-full rounded-full object-cover" />
                  : initials(member.full_name)
                }
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <p className="font-semibold text-navy text-sm truncate">{member.full_name}</p>
                  {member.membership_number && (
                    <span className="text-xs text-gray-400">#{member.membership_number}</span>
                  )}
                </div>
                <div className="flex items-center gap-3 mt-0.5 flex-wrap">
                  {member.phone && (
                    <span className="flex items-center gap-1 text-xs text-gray-500">
                      <Phone className="w-3 h-3" />{member.phone}
                    </span>
                  )}
                  {member.cell_group && (
                    <span className="text-xs text-gray-400">{member.cell_group}</span>
                  )}
                  {member.date_joined && (
                    <span className="text-xs text-gray-400">
                      Joined {new Date(member.date_joined).toLocaleDateString('en-GB', { month: 'short', year: 'numeric' })}
                    </span>
                  )}
                </div>
              </div>

              {/* Right side: role + status */}
              <div className="flex flex-col items-end gap-1.5 flex-shrink-0">
                <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${ROLE_COLORS[member.role] || 'bg-gray-100 text-gray-700'}`}>
                  {ROLE_LABELS[member.role] || member.role}
                </span>
                {canManage ? (
                  <button
                    onClick={() => toggleActive(member)}
                    disabled={togglingId === member.id}
                    className={`flex items-center gap-1 text-xs px-2 py-0.5 rounded-full font-medium transition-colors disabled:opacity-50 ${
                      member.is_active
                        ? 'bg-green-100 text-green-700 hover:bg-green-200'
                        : 'bg-orange-100 text-orange-700 hover:bg-orange-200'
                    }`}
                  >
                    {member.is_active
                      ? <><UserCheck className="w-3 h-3" /> Active</>
                      : <><UserX className="w-3 h-3" /> Dormant</>
                    }
                  </button>
                ) : (
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${member.is_active ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'}`}>
                    {member.is_active ? 'Active' : 'Dormant'}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
