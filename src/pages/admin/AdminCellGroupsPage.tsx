import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { Plus, Edit, Trash, Users, MapPin, Clock, Calendar, MessageCircle } from 'lucide-react'
import { CellGroup } from '@/types/testimony'

export function AdminCellGroupsPage() {
  const [cellGroups, setCellGroups] = useState<CellGroup[]>([])
  const [showForm, setShowForm] = useState(false)
  const [editingGroup, setEditingGroup] = useState<CellGroup | null>(null)
  const [leaders, setLeaders] = useState<any[]>([])

  useEffect(() => {
    loadCellGroups()
    loadLeaders()
  }, [])

  async function loadCellGroups() {
    const { data } = await supabase
      .from('cell_groups')
      .select(`
        *,
        leader:profiles!leader_id(full_name, avatar_url, phone)
      `)
      .order('name')

    if (data) {
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
  }

  async function loadLeaders() {
    const { data } = await supabase
      .from('profiles')
      .select('id, full_name, avatar_url')
      .in('role', ['leader', 'clergy', 'admin'])
      .order('full_name')
    setLeaders(data || [])
  }

  async function deleteGroup(id: string) {
    if (!confirm('Are you sure you want to delete this cell group?')) return
    await supabase.from('cell_groups').delete().eq('id', id)
    loadCellGroups()
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-playfair text-navy">Manage Cell Groups</h1>
          <p className="text-gray-600">Create and manage cell groups</p>
        </div>
        <button
          onClick={() => {
            setEditingGroup(null)
            setShowForm(true)
          }}
          className="flex items-center gap-2 px-4 py-2 bg-gold text-navy rounded-lg hover:bg-gold/90 font-semibold"
        >
          <Plus className="w-5 h-5" />
          New Cell Group
        </button>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {cellGroups.map((group) => (
          <div key={group.id} className="bg-white rounded-lg shadow p-6 space-y-4">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-xl font-semibold text-navy">{group.name}</h3>
                {!group.is_active && (
                  <span className="text-xs bg-red-100 text-red-700 px-2 py-1 rounded">Inactive</span>
                )}
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => {
                    setEditingGroup(group)
                    setShowForm(true)
                  }}
                  className="p-2 text-navy hover:bg-gray-100 rounded"
                >
                  <Edit className="w-4 h-4" />
                </button>
                <button
                  onClick={() => deleteGroup(group.id)}
                  className="p-2 text-red-600 hover:bg-red-50 rounded"
                >
                  <Trash className="w-4 h-4" />
                </button>
              </div>
            </div>

            {group.description && (
              <p className="text-sm text-gray-600">{group.description}</p>
            )}

            <div className="space-y-2 text-sm">
              {group.meeting_day && (
                <div className="flex items-center gap-2 text-gray-700">
                  <Calendar className="w-4 h-4 text-navy" />
                  <span>{group.meeting_day}s at {group.meeting_time}</span>
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
              <div className="text-xs text-gray-500 mb-1">Leader</div>
              <div className="font-medium text-navy">{group.leader?.full_name}</div>
            </div>

            {group.whatsapp_enabled && group.whatsapp_link && (
              <div className="pt-2">
                <div className="flex items-center gap-2 text-green-600 text-sm">
                  <MessageCircle className="w-4 h-4" />
                  <span>WhatsApp Group Active</span>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {showForm && (
        <CellGroupForm
          group={editingGroup}
          leaders={leaders}
          onClose={() => {
            setShowForm(false)
            setEditingGroup(null)
          }}
          onSubmit={() => {
            setShowForm(false)
            setEditingGroup(null)
            loadCellGroups()
          }}
        />
      )}
    </div>
  )
}

function CellGroupForm({
  group,
  leaders,
  onClose,
  onSubmit
}: {
  group: CellGroup | null
  leaders: any[]
  onClose: () => void
  onSubmit: () => void
}) {
  const [name, setName] = useState(group?.name || '')
  const [description, setDescription] = useState(group?.description || '')
  const [leaderId, setLeaderId] = useState(group?.leader_id || '')
  const [assistantLeaderId, setAssistantLeaderId] = useState(group?.assistant_leader_id || '')
  const [meetingDay, setMeetingDay] = useState(group?.meeting_day || '')
  const [meetingTime, setMeetingTime] = useState(group?.meeting_time || '')
  const [location, setLocation] = useState(group?.location || '')
  const [address, setAddress] = useState(group?.address || '')
  const [maxMembers, setMaxMembers] = useState(group?.max_members || 15)
  const [isActive, setIsActive] = useState(group?.is_active ?? true)
  const [whatsappEnabled, setWhatsappEnabled] = useState(group?.whatsapp_enabled ?? false)
  const [whatsappLink, setWhatsappLink] = useState(group?.whatsapp_link || '')
  const [submitting, setSubmitting] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSubmitting(true)

    const data = {
      name,
      description: description || null,
      leader_id: leaderId,
      assistant_leader_id: assistantLeaderId || null,
      meeting_day: meetingDay || null,
      meeting_time: meetingTime || null,
      location: location || null,
      address: address || null,
      max_members: maxMembers,
      is_active: isActive,
      whatsapp_enabled: whatsappEnabled,
      whatsapp_link: whatsappLink || null
    }

    if (group) {
      await supabase.from('cell_groups').update(data).eq('id', group.id)
    } else {
      await supabase.from('cell_groups').insert(data)
    }

    setSubmitting(false)
    onSubmit()
  }

  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6">
        <h2 className="text-2xl font-playfair text-navy mb-4">
          {group ? 'Edit Cell Group' : 'New Cell Group'}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Group Name *</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg"
              placeholder="e.g., Youth Fellowship, Nkubu East Cell"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg h-24"
              placeholder="Brief description of the cell group..."
            />
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Leader *</label>
              <select
                value={leaderId}
                onChange={(e) => setLeaderId(e.target.value)}
                className="w-full px-4 py-2 border rounded-lg"
                required
              >
                <option value="">Select Leader</option>
                {leaders.map((leader) => (
                  <option key={leader.id} value={leader.id}>
                    {leader.full_name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Assistant Leader</label>
              <select
                value={assistantLeaderId}
                onChange={(e) => setAssistantLeaderId(e.target.value)}
                className="w-full px-4 py-2 border rounded-lg"
              >
                <option value="">Select Assistant (Optional)</option>
                {leaders.map((leader) => (
                  <option key={leader.id} value={leader.id}>
                    {leader.full_name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Meeting Day</label>
              <select
                value={meetingDay}
                onChange={(e) => setMeetingDay(e.target.value)}
                className="w-full px-4 py-2 border rounded-lg"
              >
                <option value="">Select Day</option>
                {days.map((day) => (
                  <option key={day} value={day}>
                    {day}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Meeting Time</label>
              <input
                type="time"
                value={meetingTime}
                onChange={(e) => setMeetingTime(e.target.value)}
                className="w-full px-4 py-2 border rounded-lg"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg"
              placeholder="e.g., Church Hall, Leader's Home"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Full Address</label>
            <input
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg"
              placeholder="Complete address with directions"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Maximum Members</label>
            <input
              type="number"
              value={maxMembers}
              onChange={(e) => setMaxMembers(parseInt(e.target.value))}
              className="w-full px-4 py-2 border rounded-lg"
              min="5"
              max="50"
            />
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="isActive"
              checked={isActive}
              onChange={(e) => setIsActive(e.target.checked)}
              className="w-4 h-4"
            />
            <label htmlFor="isActive" className="text-sm text-gray-700">
              Active (visible to members)
            </label>
          </div>

          <div className="border-t pt-4">
            <h3 className="font-semibold text-navy mb-3 flex items-center gap-2">
              <MessageCircle className="w-5 h-5 text-green-600" />
              WhatsApp Integration
            </h3>
            
            <div className="flex items-center gap-2 mb-3">
              <input
                type="checkbox"
                id="whatsappEnabled"
                checked={whatsappEnabled}
                onChange={(e) => setWhatsappEnabled(e.target.checked)}
                className="w-4 h-4"
              />
              <label htmlFor="whatsappEnabled" className="text-sm text-gray-700">
                Enable WhatsApp Group Link
              </label>
            </div>

            {whatsappEnabled && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  WhatsApp Group Invite Link
                </label>
                <input
                  type="url"
                  value={whatsappLink}
                  onChange={(e) => setWhatsappLink(e.target.value)}
                  className="w-full px-4 py-2 border rounded-lg"
                  placeholder="https://chat.whatsapp.com/..."
                />
                <p className="text-xs text-gray-500 mt-1">
                  Get the invite link from your WhatsApp group settings
                </p>
              </div>
            )}
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border rounded-lg hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="flex-1 px-4 py-2 bg-gold text-navy rounded-lg hover:bg-gold/90 font-semibold disabled:opacity-50"
            >
              {submitting ? 'Saving...' : group ? 'Update Group' : 'Create Group'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
