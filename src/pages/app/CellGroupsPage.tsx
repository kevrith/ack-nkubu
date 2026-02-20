import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/hooks/useAuth'
import { Users, MapPin, Clock, Calendar, Plus, UserPlus } from 'lucide-react'
import { CellGroup } from '@/types/testimony'
import { Link } from 'react-router-dom'

export function CellGroupsPage() {
  const { user } = useAuth()
  const [cellGroups, setCellGroups] = useState<CellGroup[]>([])
  const [myCellGroup, setMyCellGroup] = useState<CellGroup | null>(null)
  const [loading, setLoading] = useState(true)
  const isLeader = ['leader', 'clergy', 'admin'].includes(user?.profile.role || '')

  useEffect(() => {
    loadCellGroups()
    loadMyCellGroup()
  }, [])

  async function loadCellGroups() {
    const { data } = await supabase
      .from('cell_groups')
      .select(`
        *,
        leader:profiles!leader_id(full_name, avatar_url, phone),
        assistant_leader:profiles!assistant_leader_id(full_name, avatar_url)
      `)
      .eq('is_active', true)
      .order('name')

    if (data) {
      // Get member counts
      const groupsWithCounts = await Promise.all(
        data.map(async (group) => {
          const { count } = await supabase
            .from('cell_group_members')
            .select('*', { count: 'exact', head: true })
            .eq('cell_group_id', group.id)
            .eq('is_active', true)
          return { ...group, member_count: count || 0 }
        })
      )
      setCellGroups(groupsWithCounts)
    }
    setLoading(false)
  }

  async function loadMyCellGroup() {
    const { data } = await supabase
      .from('cell_group_members')
      .select('cell_group_id')
      .eq('member_id', user?.id)
      .eq('is_active', true)
      .maybeSingle()

    if (data?.cell_group_id) {
      const { data: groupData } = await supabase
        .from('cell_groups')
        .select(`
          *,
          leader:profiles!leader_id(full_name, avatar_url, phone)
        `)
        .eq('id', data.cell_group_id)
        .single()
      
      if (groupData) {
        setMyCellGroup(groupData as any)
      }
    }
  }

  async function joinCellGroup(groupId: string) {
    await supabase.from('cell_group_members').insert({
      cell_group_id: groupId,
      member_id: user?.id
    })
    loadCellGroups()
    loadMyCellGroup()
  }

  async function leaveCellGroup() {
    await supabase
      .from('cell_group_members')
      .update({ is_active: false })
      .eq('cell_group_id', myCellGroup?.id)
      .eq('member_id', user?.id)
    setMyCellGroup(null)
    loadCellGroups()
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-playfair text-navy">Cell Groups</h1>
          <p className="text-gray-600">Connect with a small group in your area</p>
        </div>
        {isLeader && (
          <Link
            to="/admin/cell-groups"
            className="flex items-center gap-2 px-4 py-2 bg-navy text-white rounded-lg hover:bg-navy/90"
          >
            <Plus className="w-5 h-5" />
            Manage Groups
          </Link>
        )}
      </div>

      {myCellGroup && (
        <div className="bg-gradient-to-r from-navy to-navy-600 text-white rounded-lg p-6">
          <div className="flex items-center gap-2 mb-3">
            <Users className="w-5 h-5" />
            <h2 className="text-lg font-semibold">My Cell Group</h2>
          </div>
          <h3 className="text-2xl font-playfair mb-2">{myCellGroup.name}</h3>
          <div className="space-y-2 text-navy-100">
            {myCellGroup.meeting_day && (
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                <span>{myCellGroup.meeting_day}s at {myCellGroup.meeting_time}</span>
              </div>
            )}
            {myCellGroup.location && (
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                <span>{myCellGroup.location}</span>
              </div>
            )}
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4" />
              <span>Leader: {myCellGroup.leader?.full_name}</span>
            </div>
          </div>
          <div className="flex gap-3 mt-4">
            <Link
              to={`/cell-groups/${myCellGroup.id}`}
              className="px-4 py-2 bg-white text-navy rounded-lg hover:bg-gray-100 font-semibold"
            >
              View Group
            </Link>
            <button
              onClick={leaveCellGroup}
              className="px-4 py-2 bg-white/20 text-white rounded-lg hover:bg-white/30"
            >
              Leave Group
            </button>
          </div>
        </div>
      )}

      {loading ? (
        <div className="text-center py-12 text-gray-500">Loading cell groups...</div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {cellGroups.map((group) => (
            <CellGroupCard
              key={group.id}
              group={group}
              isMember={myCellGroup?.id === group.id}
              onJoin={() => joinCellGroup(group.id)}
            />
          ))}
        </div>
      )}
    </div>
  )
}

function CellGroupCard({
  group,
  isMember,
  onJoin
}: {
  group: CellGroup
  isMember: boolean
  onJoin: () => void
}) {
  return (
    <div className="bg-white rounded-lg shadow p-6 space-y-4">
      <div>
        <h3 className="text-xl font-semibold text-navy mb-2">{group.name}</h3>
        {group.description && (
          <p className="text-sm text-gray-600">{group.description}</p>
        )}
      </div>

      <div className="space-y-2 text-sm">
        {group.meeting_day && (
          <div className="flex items-center gap-2 text-gray-700">
            <Calendar className="w-4 h-4 text-navy" />
            <span>{group.meeting_day}s</span>
          </div>
        )}
        {group.meeting_time && (
          <div className="flex items-center gap-2 text-gray-700">
            <Clock className="w-4 h-4 text-navy" />
            <span>{group.meeting_time}</span>
          </div>
        )}
        {group.location && (
          <div className="flex items-center gap-2 text-gray-700">
            <MapPin className="w-4 h-4 text-navy" />
            <span>{group.location}</span>
          </div>
        )}
        <div className="flex items-center gap-2 text-gray-700">
          <Users className="w-4 h-4 text-navy" />
          <span>{group.member_count || 0} members</span>
        </div>
      </div>

      <div className="pt-4 border-t">
        <div className="flex items-center gap-2 mb-3">
          {group.leader?.avatar_url ? (
            <img src={group.leader.avatar_url} alt="" className="w-8 h-8 rounded-full" />
          ) : (
            <div className="w-8 h-8 rounded-full bg-navy text-white flex items-center justify-center text-sm font-semibold">
              {group.leader?.full_name?.[0]}
            </div>
          )}
          <div>
            <div className="text-xs text-gray-500">Leader</div>
            <div className="text-sm font-medium text-navy">{group.leader?.full_name}</div>
          </div>
        </div>

        {isMember ? (
          <Link
            to={`/cell-groups/${group.id}`}
            className="block w-full text-center px-4 py-2 bg-navy text-white rounded-lg hover:bg-navy/90 font-semibold"
          >
            View Group
          </Link>
        ) : (
          <button
            onClick={onJoin}
            className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-gold text-navy rounded-lg hover:bg-gold/90 font-semibold"
          >
            <UserPlus className="w-4 h-4" />
            Join Group
          </button>
        )}
      </div>
    </div>
  )
}
