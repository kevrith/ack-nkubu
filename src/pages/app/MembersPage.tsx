import { useState, useEffect, useMemo } from 'react'
import {
  Users, Search, X, Phone, UserCheck, UserX, Filter,
  ChevronDown, ChevronUp, Plus, Save, Smartphone, UserRound,
} from 'lucide-react'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/hooks/useAuth'

// ─── Types ────────────────────────────────────────────────────────────────────

interface CellGroup {
  id: string
  name: string
}

interface AppMember {
  source: 'app'
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

interface ManualMember {
  source: 'manual'
  id: string
  full_name: string
  phone: string | null
  email: string | null
  gender: string | null
  cell_group_id: string | null
  cell_group_name: string | null  // resolved from join
  membership_number: string | null
  date_joined: string | null
  address: string | null
  is_active: boolean
  notes: string | null
  created_at: string
}

type Member = AppMember | ManualMember

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

const EMPTY_FORM = {
  full_name: '', phone: '', email: '', gender: '',
  cell_group_id: '', membership_number: '', date_joined: '',
  address: '', notes: '', is_active: true,
}

function initials(name: string) {
  return name.split(' ').map(w => w[0]).slice(0, 2).join('').toUpperCase()
}

function memberCellGroup(member: Member): string | null {
  if (member.source === 'app') return (member as AppMember).cell_group
  return (member as ManualMember).cell_group_name
}

// ─── Add Member Modal ─────────────────────────────────────────────────────────

function AddMemberModal({ cellGroups, onSave, onClose }: {
  cellGroups: CellGroup[]
  onSave: (m: ManualMember) => void
  onClose: () => void
}) {
  const { user } = useAuth()
  const [form, setForm] = useState(EMPTY_FORM)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  function set(field: string, value: string | boolean) {
    setForm(f => ({ ...f, [field]: value }))
  }

  async function handleSave() {
    if (!form.full_name.trim()) { setError('Full name is required.'); return }
    setSaving(true); setError(null)
    const payload = {
      full_name: form.full_name.trim(),
      phone: form.phone.trim() || null,
      email: form.email.trim() || null,
      gender: form.gender || null,
      cell_group_id: form.cell_group_id || null,
      membership_number: form.membership_number.trim() || null,
      date_joined: form.date_joined || null,
      address: form.address.trim() || null,
      notes: form.notes.trim() || null,
      is_active: form.is_active,
      added_by: user?.id,
    }
    const { data, error: err } = await supabase
      .from('manual_members')
      .insert(payload)
      .select('*, cell_group:cell_groups(name)')
      .single()
    if (err) { setError(err.message); setSaving(false); return }
    const saved: ManualMember = {
      source: 'manual',
      ...data,
      cell_group_name: data.cell_group?.name ?? null,
    }
    onSave(saved)
    setSaving(false)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white w-full sm:max-w-lg sm:rounded-2xl rounded-t-2xl shadow-xl overflow-y-auto max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 sticky top-0 bg-white">
          <div>
            <h2 className="font-bold text-navy text-lg">Add Member</h2>
            <p className="text-xs text-gray-500">For members without the app</p>
          </div>
          <button onClick={onClose} className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="px-5 py-4 space-y-4">
          {error && <p className="text-sm text-red-600 bg-red-50 rounded-lg px-3 py-2">{error}</p>}

          {/* Full Name */}
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Full Name *</label>
            <input value={form.full_name} onChange={e => set('full_name', e.target.value)}
              placeholder="e.g. Jane Mwangi"
              className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-navy/20" />
          </div>

          {/* Phone + Gender */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Phone</label>
              <input value={form.phone} onChange={e => set('phone', e.target.value)}
                placeholder="07xx xxx xxx"
                className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-navy/20" />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Gender</label>
              <select value={form.gender} onChange={e => set('gender', e.target.value)}
                className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm bg-white focus:outline-none focus:ring-2 focus:ring-navy/20">
                <option value="">Select</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            </div>
          </div>

          {/* Email */}
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Email <span className="text-gray-400 font-normal">(optional)</span></label>
            <input type="email" value={form.email} onChange={e => set('email', e.target.value)}
              placeholder="jane@example.com"
              className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-navy/20" />
          </div>

          {/* Cell Group — real dropdown */}
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Cell Group</label>
            <select value={form.cell_group_id} onChange={e => set('cell_group_id', e.target.value)}
              className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm bg-white focus:outline-none focus:ring-2 focus:ring-navy/20">
              <option value="">None / Unassigned</option>
              {cellGroups.map(g => <option key={g.id} value={g.id}>{g.name}</option>)}
            </select>
            <p className="text-xs text-gray-400 mt-1">They will appear in the cell group's member list.</p>
          </div>

          {/* Membership No + Date Joined */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Membership No.</label>
              <input value={form.membership_number} onChange={e => set('membership_number', e.target.value)}
                placeholder="e.g. ACK-001"
                className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-navy/20" />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Date Joined</label>
              <input type="date" value={form.date_joined} onChange={e => set('date_joined', e.target.value)}
                className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm bg-white focus:outline-none focus:ring-2 focus:ring-navy/20" />
            </div>
          </div>

          {/* Address */}
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Address <span className="text-gray-400 font-normal">(optional)</span></label>
            <input value={form.address} onChange={e => set('address', e.target.value)}
              placeholder="e.g. Meru Town"
              className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-navy/20" />
          </div>

          {/* Notes */}
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Notes <span className="text-gray-400 font-normal">(optional)</span></label>
            <textarea value={form.notes} onChange={e => set('notes', e.target.value)}
              rows={2} placeholder="Any additional notes…"
              className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-navy/20 resize-none" />
          </div>

          {/* Active toggle */}
          <label className="flex items-center gap-3 cursor-pointer">
            <div onClick={() => set('is_active', !form.is_active)}
              className={`relative w-10 h-5 rounded-full transition-colors ${form.is_active ? 'bg-green-500' : 'bg-gray-300'}`}>
              <div className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform ${form.is_active ? 'translate-x-5' : ''}`} />
            </div>
            <span className="text-sm font-medium text-gray-700">Mark as Active</span>
          </label>
        </div>

        {/* Footer */}
        <div className="px-5 py-4 border-t border-gray-100 flex gap-3 sticky bottom-0 bg-white">
          <button onClick={handleSave} disabled={saving}
            className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-navy text-white rounded-xl text-sm font-semibold hover:bg-navy/90 disabled:opacity-50 transition-colors">
            <Save className="w-4 h-4" />
            {saving ? 'Saving…' : 'Save Member'}
          </button>
          <button onClick={onClose}
            className="px-5 py-2.5 border border-gray-200 rounded-xl text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors">
            Cancel
          </button>
        </div>
      </div>
    </div>
  )
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export function MembersPage() {
  const { user } = useAuth()
  const [appMembers, setAppMembers] = useState<AppMember[]>([])
  const [manualMembers, setManualMembers] = useState<ManualMember[]>([])
  const [cellGroups, setCellGroups] = useState<CellGroup[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all')
  const [roleFilter, setRoleFilter] = useState('all')
  const [groupFilter, setGroupFilter] = useState('all')
  const [sourceFilter, setSourceFilter] = useState<'all' | 'app' | 'manual'>('all')
  const [showFilters, setShowFilters] = useState(false)
  const [showAddForm, setShowAddForm] = useState(false)
  const [togglingId, setTogglingId] = useState<string | null>(null)

  const canManage = ['clergy', 'admin'].includes(user?.profile.role || '')

  useEffect(() => { fetchAll() }, [])

  async function fetchAll() {
    const [{ data: app }, { data: manual }, { data: groups }] = await Promise.all([
      supabase.from('profiles')
        .select('id, full_name, phone, avatar_url, role, cell_group, membership_number, date_joined, is_active, created_at')
        .order('full_name'),
      supabase.from('manual_members')
        .select('id, full_name, phone, email, gender, cell_group_id, cell_group:cell_groups(name), membership_number, date_joined, address, is_active, notes, created_at')
        .order('full_name'),
      supabase.from('cell_groups').select('id, name').order('name'),
    ])
    setAppMembers((app || []).map(m => ({ source: 'app' as const, ...m })))
    setManualMembers((manual || []).map((m: any) => ({
      source: 'manual' as const,
      ...m,
      cell_group_name: m.cell_group?.name ?? null,
    })))
    setCellGroups(groups || [])
    setLoading(false)
  }

  async function toggleActive(member: Member) {
    setTogglingId(member.id)
    const table = member.source === 'app' ? 'profiles' : 'manual_members'
    await supabase.from(table).update({ is_active: !member.is_active }).eq('id', member.id)
    if (member.source === 'app') {
      setAppMembers(prev => prev.map(m => m.id === member.id ? { ...m, is_active: !m.is_active } : m))
    } else {
      setManualMembers(prev => prev.map(m => m.id === member.id ? { ...m, is_active: !m.is_active } : m))
    }
    setTogglingId(null)
  }

  const allMembers: Member[] = useMemo(
    () => [...appMembers, ...manualMembers].sort((a, b) => a.full_name.localeCompare(b.full_name)),
    [appMembers, manualMembers]
  )

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase()
    return allMembers.filter(m => {
      if (statusFilter === 'active' && !m.is_active) return false
      if (statusFilter === 'dormant' && m.is_active) return false
      if (sourceFilter !== 'all' && m.source !== sourceFilter) return false
      if (roleFilter !== 'all') {
        if (m.source === 'manual') return false
        if ((m as AppMember).role !== roleFilter) return false
      }
      if (groupFilter !== 'all') {
        const grp = memberCellGroup(m)
        if (grp !== groupFilter) return false
      }
      if (q) return (
        m.full_name.toLowerCase().includes(q) ||
        m.phone?.includes(q) ||
        m.membership_number?.toLowerCase().includes(q) ||
        memberCellGroup(m)?.toLowerCase().includes(q)
      )
      return true
    })
  }, [allMembers, search, statusFilter, roleFilter, groupFilter, sourceFilter])

  const stats = useMemo(() => ({
    total: allMembers.length,
    active: allMembers.filter(m => m.is_active).length,
    dormant: allMembers.filter(m => !m.is_active).length,
    leadership: appMembers.filter(m => ['leader', 'clergy', 'admin'].includes(m.role)).length,
  }), [allMembers, appMembers])

  // Cell group names for filter dropdown (from app members + real groups)
  const groupNames = useMemo(() => {
    const fromApp = appMembers.map(m => m.cell_group).filter(Boolean) as string[]
    const fromGroups = cellGroups.map(g => g.name)
    return Array.from(new Set([...fromGroups, ...fromApp])).sort()
  }, [appMembers, cellGroups])

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24">
        <div className="w-8 h-8 border-4 border-navy border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 pb-24 space-y-5">

      {/* Header */}
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-navy rounded-xl flex items-center justify-center">
            <Users className="w-5 h-5 text-gold" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-navy">Members</h1>
            <p className="text-xs text-gray-500">{appMembers.length} on app · {manualMembers.length} manual</p>
          </div>
        </div>
        {canManage && (
          <button onClick={() => setShowAddForm(true)}
            className="flex items-center gap-2 px-4 py-2 bg-navy text-white rounded-xl text-sm font-semibold hover:bg-navy/90 transition-colors">
            <Plus className="w-4 h-4" /> Add Member
          </button>
        )}
      </div>

      {/* Stats cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-navy text-white rounded-2xl p-4">
          <p className="text-2xl font-bold">{stats.total}</p>
          <p className="text-xs font-semibold mt-0.5 opacity-80">Total Members</p>
          <p className="text-xs opacity-60 mt-0.5">registered</p>
        </div>
        <div className="bg-green-50 text-green-800 rounded-2xl p-4">
          <p className="text-2xl font-bold">{stats.active}</p>
          <p className="text-xs font-semibold mt-0.5 opacity-80">Active</p>
          <p className="text-xs opacity-60 mt-0.5">{stats.total ? Math.round(stats.active / stats.total * 100) : 0}%</p>
        </div>
        <div className="bg-orange-50 text-orange-800 rounded-2xl p-4">
          <p className="text-2xl font-bold">{stats.dormant}</p>
          <p className="text-xs font-semibold mt-0.5 opacity-80">Dormant</p>
          <p className="text-xs opacity-60 mt-0.5">{stats.total ? Math.round(stats.dormant / stats.total * 100) : 0}%</p>
        </div>
        <div className="bg-blue-50 text-blue-800 rounded-2xl p-4">
          <p className="text-2xl font-bold">{stats.leadership}</p>
          <p className="text-xs font-semibold mt-0.5 opacity-80">Leadership</p>
          <p className="text-xs opacity-60 mt-0.5">leaders & clergy</p>
        </div>
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

      {/* Search + filters */}
      <div className="space-y-2">
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input type="text" value={search} onChange={e => setSearch(e.target.value)}
              placeholder="Search name, phone, or membership no…"
              className="w-full pl-10 pr-8 py-2.5 border border-gray-200 rounded-xl text-sm bg-white focus:outline-none focus:ring-2 focus:ring-navy/20" />
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
            <select value={sourceFilter} onChange={e => setSourceFilter(e.target.value as typeof sourceFilter)}
              className="px-3 py-2 border border-gray-200 rounded-xl text-sm bg-white focus:outline-none focus:ring-2 focus:ring-navy/20">
              <option value="all">All Sources</option>
              <option value="app">App Users</option>
              <option value="manual">Manually Added</option>
            </select>
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
              {groupNames.map(g => <option key={g} value={g}>{g}</option>)}
            </select>
            {(roleFilter !== 'all' || groupFilter !== 'all' || sourceFilter !== 'all') && (
              <button onClick={() => { setRoleFilter('all'); setGroupFilter('all'); setSourceFilter('all') }}
                className="px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-xl border border-red-100 transition-colors">
                Clear
              </button>
            )}
          </div>
        )}
      </div>

      <p className="text-xs text-gray-500">Showing {filtered.length} of {allMembers.length} members</p>

      {/* Member list */}
      {filtered.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl border border-gray-100">
          <Users className="w-12 h-12 text-gray-200 mx-auto mb-3" />
          <p className="font-medium text-gray-600">No members found</p>
          <p className="text-sm text-gray-400 mt-1">Try adjusting your search or filters</p>
        </div>
      ) : (
        <div className="space-y-2">
          {filtered.map(member => {
            const grp = memberCellGroup(member)
            return (
              <div key={`${member.source}-${member.id}`}
                className={`bg-white rounded-xl border px-4 py-3 flex items-center gap-3 transition-all ${member.is_active ? 'border-gray-100' : 'border-orange-100 bg-orange-50/20'}`}>

                <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 text-sm font-bold ${member.is_active ? 'bg-navy/10 text-navy' : 'bg-gray-100 text-gray-400'}`}>
                  {member.source === 'app' && (member as AppMember).avatar_url
                    ? <img src={(member as AppMember).avatar_url!} alt={member.full_name} className="w-full h-full rounded-full object-cover" />
                    : initials(member.full_name)
                  }
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="font-semibold text-navy text-sm">{member.full_name}</p>
                    {member.membership_number && <span className="text-xs text-gray-400">#{member.membership_number}</span>}
                    <span className={`flex items-center gap-0.5 text-xs px-1.5 py-0.5 rounded-full font-medium ${member.source === 'app' ? 'bg-sky-50 text-sky-600' : 'bg-amber-50 text-amber-700'}`}>
                      {member.source === 'app' ? <Smartphone className="w-2.5 h-2.5" /> : <UserRound className="w-2.5 h-2.5" />}
                      {member.source === 'app' ? 'App' : 'Manual'}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 mt-0.5 flex-wrap">
                    {member.phone && (
                      <span className="flex items-center gap-1 text-xs text-gray-500">
                        <Phone className="w-3 h-3" />{member.phone}
                      </span>
                    )}
                    {grp && <span className="text-xs text-gray-400">{grp}</span>}
                    {member.date_joined && (
                      <span className="text-xs text-gray-400">
                        Joined {new Date(member.date_joined).toLocaleDateString('en-GB', { month: 'short', year: 'numeric' })}
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex flex-col items-end gap-1.5 flex-shrink-0">
                  {member.source === 'app' && (
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${ROLE_COLORS[(member as AppMember).role] || 'bg-gray-100 text-gray-700'}`}>
                      {ROLE_LABELS[(member as AppMember).role] || (member as AppMember).role}
                    </span>
                  )}
                  {canManage ? (
                    <button onClick={() => toggleActive(member)} disabled={togglingId === member.id}
                      className={`flex items-center gap-1 text-xs px-2 py-0.5 rounded-full font-medium transition-colors disabled:opacity-50 ${
                        member.is_active ? 'bg-green-100 text-green-700 hover:bg-green-200' : 'bg-orange-100 text-orange-700 hover:bg-orange-200'
                      }`}>
                      {member.is_active ? <><UserCheck className="w-3 h-3" /> Active</> : <><UserX className="w-3 h-3" /> Dormant</>}
                    </button>
                  ) : (
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${member.is_active ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'}`}>
                      {member.is_active ? 'Active' : 'Dormant'}
                    </span>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      )}

      {showAddForm && (
        <AddMemberModal
          cellGroups={cellGroups}
          onSave={m => { setManualMembers(prev => [...prev, m].sort((a, b) => a.full_name.localeCompare(b.full_name))); setShowAddForm(false) }}
          onClose={() => setShowAddForm(false)}
        />
      )}
    </div>
  )
}
