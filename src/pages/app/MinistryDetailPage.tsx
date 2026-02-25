import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/hooks/useAuth'
import { Users, Calendar, MapPin, Clock, Bell, Plus, Settings, X } from 'lucide-react'
import { Ministry, MinistryMember, MinistryAnnouncement } from '@/types/ministry'

export function MinistryDetailPage() {
  const { id } = useParams()
  const { user } = useAuth()
  const navigate = useNavigate()
  const [ministry, setMinistry] = useState<Ministry | null>(null)
  const [members, setMembers] = useState<MinistryMember[]>([])
  const [announcements, setAnnouncements] = useState<MinistryAnnouncement[]>([])
  const [activeTab, setActiveTab] = useState<'announcements' | 'members'>('announcements')

  const [showAnnouncementModal, setShowAnnouncementModal] = useState(false)
  const [announcementTitle, setAnnouncementTitle] = useState('')
  const [announcementContent, setAnnouncementContent] = useState('')
  const [saving, setSaving] = useState(false)

  const isLeader = ministry?.leader_id === user?.id || ministry?.assistant_leader_id === user?.id
  const isAdmin = ['leader', 'clergy', 'admin'].includes(user?.profile.role || '')

  useEffect(() => {
    if (id) {
      loadMinistry()
      loadMembers()
      loadAnnouncements()
    }
  }, [id])

  async function loadMinistry() {
    const { data } = await supabase
      .from('ministries')
      .select(`
        *,
        leader:profiles!leader_id(full_name, avatar_url, phone),
        assistant_leader:profiles!assistant_leader_id(full_name, avatar_url)
      `)
      .eq('id', id)
      .single()
    setMinistry(data)
  }

  async function loadMembers() {
    const { data } = await supabase
      .from('ministry_members')
      .select(`
        *,
        member:profiles!member_id(full_name, avatar_url, phone)
      `)
      .eq('ministry_id', id)
      .eq('is_active', true)
      .order('joined_at')
    setMembers(data || [])
  }

  async function loadAnnouncements() {
    const { data } = await supabase
      .from('ministry_announcements')
      .select(`
        *,
        author:profiles!created_by(full_name, avatar_url)
      `)
      .eq('ministry_id', id)
      .order('created_at', { ascending: false })
    setAnnouncements(data || [])
  }

  async function handleSaveAnnouncement() {
    if (!announcementTitle.trim() || !announcementContent.trim() || !user) return
    setSaving(true)
    const { error } = await supabase.from('ministry_announcements').insert({
      ministry_id: id,
      title: announcementTitle.trim(),
      content: announcementContent.trim(),
      created_by: user.id,
    })
    setSaving(false)
    if (!error) {
      setShowAnnouncementModal(false)
      setAnnouncementTitle('')
      setAnnouncementContent('')
      loadAnnouncements()
    }
  }

  if (!ministry) return <div className="text-center py-12">Loading...</div>

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-start justify-between mb-4">
          <div>
            <span className="text-xs font-medium text-gold uppercase tracking-wide">{ministry.category}</span>
            <h1 className="text-2xl font-playfair text-navy mt-1 mb-2">{ministry.name}</h1>
            {ministry.description && <p className="text-gray-600">{ministry.description}</p>}
          </div>
          {(isLeader || isAdmin) && (
            <button
              onClick={() => navigate('/admin/ministries')}
              className="flex items-center gap-2 px-4 py-2 bg-navy text-white rounded-lg hover:bg-navy/90"
            >
              <Settings className="w-4 h-4" />
              Manage
            </button>
          )}
        </div>

        <div className="grid md:grid-cols-3 gap-4">
          {ministry.meeting_day && (
            <div className="flex items-center gap-2 text-gray-700">
              <Calendar className="w-5 h-5 text-navy" />
              <div>
                <div className="text-xs text-gray-500">Meeting Day</div>
                <div className="font-medium">{ministry.meeting_day}s</div>
              </div>
            </div>
          )}
          {ministry.meeting_time && (
            <div className="flex items-center gap-2 text-gray-700">
              <Clock className="w-5 h-5 text-navy" />
              <div>
                <div className="text-xs text-gray-500">Time</div>
                <div className="font-medium">{ministry.meeting_time}</div>
              </div>
            </div>
          )}
          {ministry.location && (
            <div className="flex items-center gap-2 text-gray-700">
              <MapPin className="w-5 h-5 text-navy" />
              <div>
                <div className="text-xs text-gray-500">Location</div>
                <div className="font-medium">{ministry.location}</div>
              </div>
            </div>
          )}
        </div>

        {ministry.leader && (
          <div className="flex items-center gap-4 mt-6 pt-6 border-t">
            <div className="flex items-center gap-2">
              {ministry.leader.avatar_url ? (
                <img src={ministry.leader.avatar_url} alt="" className="w-10 h-10 rounded-full" />
              ) : (
                <div className="w-10 h-10 rounded-full bg-navy text-white flex items-center justify-center font-semibold">
                  {ministry.leader.full_name?.[0]}
                </div>
              )}
              <div>
                <div className="text-xs text-gray-500">Leader</div>
                <div className="font-medium text-navy">{ministry.leader.full_name}</div>
              </div>
            </div>
            {ministry.assistant_leader && (
              <div className="flex items-center gap-2">
                {ministry.assistant_leader.avatar_url ? (
                  <img src={ministry.assistant_leader.avatar_url} alt="" className="w-10 h-10 rounded-full" />
                ) : (
                  <div className="w-10 h-10 rounded-full bg-gold text-navy flex items-center justify-center font-semibold">
                    {ministry.assistant_leader.full_name?.[0]}
                  </div>
                )}
                <div>
                  <div className="text-xs text-gray-500">Assistant</div>
                  <div className="font-medium text-navy">{ministry.assistant_leader.full_name}</div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      <div className="bg-white rounded-lg shadow">
        <div className="border-b">
          <div className="flex">
            <button
              onClick={() => setActiveTab('announcements')}
              className={`flex-1 px-6 py-3 font-medium ${
                activeTab === 'announcements' ? 'text-navy border-b-2 border-navy' : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Announcements
            </button>
            <button
              onClick={() => setActiveTab('members')}
              className={`flex-1 px-6 py-3 font-medium ${
                activeTab === 'members' ? 'text-navy border-b-2 border-navy' : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Members ({members.length})
            </button>
          </div>
        </div>

        <div className="p-6">
          {activeTab === 'announcements' && (
            <div className="space-y-4">
              {(isLeader || isAdmin) && (
                <button
                  onClick={() => setShowAnnouncementModal(true)}
                  className="flex items-center gap-2 px-4 py-2 bg-gold text-navy rounded-lg hover:bg-gold/90 font-semibold"
                >
                  <Plus className="w-4 h-4" />
                  New Announcement
                </button>
              )}
              {announcements.length === 0 ? (
                <div className="text-center py-12 text-gray-500">
                  <Bell className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                  <p>No announcements yet</p>
                </div>
              ) : (
                announcements.map((a) => (
                  <div key={a.id} className="border rounded-lg p-4">
                    <div className="flex items-start gap-3 mb-2">
                      {a.author?.avatar_url ? (
                        <img src={a.author.avatar_url} alt="" className="w-8 h-8 rounded-full" />
                      ) : (
                        <div className="w-8 h-8 rounded-full bg-navy text-white flex items-center justify-center text-sm font-semibold">
                          {a.author?.full_name?.[0]}
                        </div>
                      )}
                      <div className="flex-1">
                        <div className="font-medium text-navy">{a.title}</div>
                        <div className="text-xs text-gray-500">
                          {a.author?.full_name} • {new Date(a.created_at).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                    <p className="text-gray-700">{a.content}</p>
                  </div>
                ))
              )}
            </div>
          )}

          {activeTab === 'members' && (
            <div className="grid md:grid-cols-2 gap-4">
              {members.length === 0 ? (
                <div className="col-span-2 text-center py-12 text-gray-500">
                  <Users className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                  <p>No members yet</p>
                </div>
              ) : (
                members.map((m) => (
                  <div key={m.id} className="flex items-center gap-3 p-3 border rounded-lg">
                    {m.member?.avatar_url ? (
                      <img src={m.member.avatar_url} alt="" className="w-12 h-12 rounded-full" />
                    ) : (
                      <div className="w-12 h-12 rounded-full bg-navy text-white flex items-center justify-center font-semibold">
                        {m.member?.full_name?.[0]}
                      </div>
                    )}
                    <div>
                      <div className="font-medium text-navy">{m.member?.full_name}</div>
                      <div className="text-xs text-gray-500 capitalize">{m.role}</div>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </div>

      {showAnnouncementModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-md">
            <div className="flex items-center justify-between p-6 border-b">
              <h2 className="text-xl font-playfair font-semibold text-navy">New Announcement</h2>
              <button onClick={() => setShowAnnouncementModal(false)} className="text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                <input
                  type="text"
                  value={announcementTitle}
                  onChange={(e) => setAnnouncementTitle(e.target.value)}
                  placeholder="Announcement title"
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-navy focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Message</label>
                <textarea
                  value={announcementContent}
                  onChange={(e) => setAnnouncementContent(e.target.value)}
                  placeholder="Write your announcement..."
                  rows={4}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-navy focus:border-transparent resize-none"
                />
              </div>
            </div>
            <div className="flex gap-3 p-6 pt-0">
              <button
                onClick={handleSaveAnnouncement}
                disabled={saving || !announcementTitle.trim() || !announcementContent.trim()}
                className="flex-1 px-4 py-2 bg-navy text-white rounded-lg hover:bg-navy/90 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {saving ? 'Saving...' : 'Post Announcement'}
              </button>
              <button
                onClick={() => setShowAnnouncementModal(false)}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
