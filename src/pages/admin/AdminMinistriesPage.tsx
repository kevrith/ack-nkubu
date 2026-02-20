import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { Plus, Edit, Trash, Users } from 'lucide-react'
import { Ministry } from '@/types/ministry'

export function AdminMinistriesPage() {
  const [ministries, setMinistries] = useState<Ministry[]>([])
  const [showForm, setShowForm] = useState(false)
  const [editingMinistry, setEditingMinistry] = useState<Ministry | null>(null)
  const [leaders, setLeaders] = useState<any[]>([])

  useEffect(() => {
    loadMinistries()
    loadLeaders()
  }, [])

  async function loadMinistries() {
    const { data } = await supabase
      .from('ministries')
      .select(`
        *,
        leader:profiles!leader_id(full_name, avatar_url)
      `)
      .order('name')

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
  }

  async function loadLeaders() {
    const { data } = await supabase
      .from('profiles')
      .select('id, full_name')
      .in('role', ['leader', 'clergy', 'admin'])
      .order('full_name')
    setLeaders(data || [])
  }

  async function deleteMinistry(id: string) {
    if (!confirm('Are you sure you want to delete this ministry?')) return
    await supabase.from('ministries').delete().eq('id', id)
    loadMinistries()
  }

  const categoryColors: Record<string, string> = {
    fellowship: 'bg-blue-100 text-blue-700',
    service: 'bg-green-100 text-green-700',
    worship: 'bg-purple-100 text-purple-700',
    education: 'bg-amber-100 text-amber-700',
    outreach: 'bg-red-100 text-red-700'
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-playfair text-navy">Manage Ministries</h1>
          <p className="text-gray-600">Create and manage church ministries</p>
        </div>
        <button
          onClick={() => {
            setEditingMinistry(null)
            setShowForm(true)
          }}
          className="flex items-center gap-2 px-4 py-2 bg-gold text-navy rounded-lg hover:bg-gold/90 font-semibold"
        >
          <Plus className="w-5 h-5" />
          New Ministry
        </button>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {ministries.map((ministry) => (
          <div key={ministry.id} className="bg-white rounded-lg shadow p-6 space-y-4">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-navy mb-2">{ministry.name}</h3>
                <span className={`text-xs px-2 py-1 rounded ${categoryColors[ministry.category]}`}>
                  {ministry.category}
                </span>
                {!ministry.is_active && (
                  <span className="ml-2 text-xs bg-red-100 text-red-700 px-2 py-1 rounded">Inactive</span>
                )}
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => {
                    setEditingMinistry(ministry)
                    setShowForm(true)
                  }}
                  className="p-2 text-navy hover:bg-gray-100 rounded"
                >
                  <Edit className="w-4 h-4" />
                </button>
                <button
                  onClick={() => deleteMinistry(ministry.id)}
                  className="p-2 text-red-600 hover:bg-red-50 rounded"
                >
                  <Trash className="w-4 h-4" />
                </button>
              </div>
            </div>

            {ministry.description && (
              <p className="text-sm text-gray-600">{ministry.description}</p>
            )}

            <div className="flex items-center gap-2 text-sm text-gray-700">
              <Users className="w-4 h-4 text-navy" />
              <span>{ministry.member_count || 0} members</span>
            </div>

            {ministry.leader && (
              <div className="pt-4 border-t">
                <div className="text-xs text-gray-500 mb-1">Leader</div>
                <div className="font-medium text-navy">{ministry.leader.full_name}</div>
              </div>
            )}
          </div>
        ))}
      </div>

      {showForm && (
        <MinistryForm
          ministry={editingMinistry}
          leaders={leaders}
          onClose={() => {
            setShowForm(false)
            setEditingMinistry(null)
          }}
          onSubmit={() => {
            setShowForm(false)
            setEditingMinistry(null)
            loadMinistries()
          }}
        />
      )}
    </div>
  )
}

function MinistryForm({
  ministry,
  leaders,
  onClose,
  onSubmit
}: {
  ministry: Ministry | null
  leaders: any[]
  onClose: () => void
  onSubmit: () => void
}) {
  const [name, setName] = useState(ministry?.name || '')
  const [description, setDescription] = useState(ministry?.description || '')
  const [category, setCategory] = useState(ministry?.category || 'fellowship')
  const [leaderId, setLeaderId] = useState(ministry?.leader_id || '')
  const [assistantLeaderId, setAssistantLeaderId] = useState(ministry?.assistant_leader_id || '')
  const [meetingDay, setMeetingDay] = useState(ministry?.meeting_day || '')
  const [meetingTime, setMeetingTime] = useState(ministry?.meeting_time || '')
  const [location, setLocation] = useState(ministry?.location || '')
  const [isActive, setIsActive] = useState(ministry?.is_active ?? true)
  const [submitting, setSubmitting] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSubmitting(true)

    const data = {
      name,
      description: description || null,
      category,
      leader_id: leaderId || null,
      assistant_leader_id: assistantLeaderId || null,
      meeting_day: meetingDay || null,
      meeting_time: meetingTime || null,
      location: location || null,
      is_active: isActive
    }

    if (ministry) {
      await supabase.from('ministries').update(data).eq('id', ministry.id)
    } else {
      await supabase.from('ministries').insert(data)
    }

    setSubmitting(false)
    onSubmit()
  }

  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6">
        <h2 className="text-2xl font-playfair text-navy mb-4">
          {ministry ? 'Edit Ministry' : 'New Ministry'}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Ministry Name *</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg"
              placeholder="e.g., KAMA, Youth Fellowship"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg h-24"
              placeholder="Brief description of the ministry..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Category *</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value as any)}
              className="w-full px-4 py-2 border rounded-lg"
              required
            >
              <option value="fellowship">Fellowship</option>
              <option value="service">Service</option>
              <option value="worship">Worship</option>
              <option value="education">Education</option>
              <option value="outreach">Outreach</option>
            </select>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Leader</label>
              <select
                value={leaderId}
                onChange={(e) => setLeaderId(e.target.value)}
                className="w-full px-4 py-2 border rounded-lg"
              >
                <option value="">Select Leader (Optional)</option>
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
              placeholder="e.g., Church Hall, Youth Room"
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
              {submitting ? 'Saving...' : ministry ? 'Update Ministry' : 'Create Ministry'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
