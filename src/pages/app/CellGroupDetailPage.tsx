import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/hooks/useAuth'
import { Users, Calendar, MapPin, Clock, Bell, Plus, MessageCircle } from 'lucide-react'
import { CellGroup, CellGroupMember, CellGroupAnnouncement, CellGroupMeeting } from '@/types/testimony'
import { shareToWhatsAppGroup } from '@/lib/whatsapp'

export function CellGroupDetailPage() {
  const { id } = useParams()
  const { user } = useAuth()
  const [group, setGroup] = useState<CellGroup | null>(null)
  const [members, setMembers] = useState<CellGroupMember[]>([])
  const [announcements, setAnnouncements] = useState<CellGroupAnnouncement[]>([])
  const [meetings, setMeetings] = useState<CellGroupMeeting[]>([])
  const [activeTab, setActiveTab] = useState<'announcements' | 'members' | 'meetings'>('announcements')

  const isLeader = group?.leader_id === user?.id || group?.assistant_leader_id === user?.id

  useEffect(() => {
    if (id) {
      loadGroup()
      loadMembers()
      loadAnnouncements()
      loadMeetings()
    }
  }, [id])

  async function loadGroup() {
    const { data } = await supabase
      .from('cell_groups')
      .select(`
        *,
        leader:profiles!leader_id(full_name, avatar_url, phone),
        assistant_leader:profiles!assistant_leader_id(full_name, avatar_url)
      `)
      .eq('id', id)
      .single()
    setGroup(data)
  }

  async function loadMembers() {
    const { data } = await supabase
      .from('cell_group_members')
      .select(`
        *,
        member:profiles!member_id(full_name, avatar_url, phone)
      `)
      .eq('cell_group_id', id)
      .eq('is_active', true)
      .order('joined_at')
    setMembers(data || [])
  }

  async function loadAnnouncements() {
    const { data } = await supabase
      .from('cell_group_announcements')
      .select(`
        *,
        author:profiles!created_by(full_name, avatar_url)
      `)
      .eq('cell_group_id', id)
      .order('created_at', { ascending: false })
    setAnnouncements(data || [])
  }

  async function loadMeetings() {
    const { data } = await supabase
      .from('cell_group_meetings')
      .select('*')
      .eq('cell_group_id', id)
      .order('meeting_date', { ascending: false })
      .limit(10)
    setMeetings(data || [])
  }

  if (!group) {
    return <div className="text-center py-12">Loading...</div>
  }

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h1 className="text-2xl font-playfair text-navy mb-2">{group.name}</h1>
            {group.description && <p className="text-gray-600">{group.description}</p>}
          </div>
          {isLeader && (
            <button className="px-4 py-2 bg-navy text-white rounded-lg hover:bg-navy/90">
              Manage
            </button>
          )}
        </div>

        <div className="grid md:grid-cols-3 gap-4">
          {group.meeting_day && (
            <div className="flex items-center gap-2 text-gray-700">
              <Calendar className="w-5 h-5 text-navy" />
              <div>
                <div className="text-xs text-gray-500">Meeting Day</div>
                <div className="font-medium">{group.meeting_day}s</div>
              </div>
            </div>
          )}
          {group.meeting_time && (
            <div className="flex items-center gap-2 text-gray-700">
              <Clock className="w-5 h-5 text-navy" />
              <div>
                <div className="text-xs text-gray-500">Time</div>
                <div className="font-medium">{group.meeting_time}</div>
              </div>
            </div>
          )}
          {group.location && (
            <div className="flex items-center gap-2 text-gray-700">
              <MapPin className="w-5 h-5 text-navy" />
              <div>
                <div className="text-xs text-gray-500">Location</div>
                <div className="font-medium">{group.location}</div>
              </div>
            </div>
          )}
        </div>

        <div className="flex items-center gap-4 mt-6 pt-6 border-t">
          <div className="flex items-center gap-2">
            {group.leader?.avatar_url ? (
              <img src={group.leader.avatar_url} alt="" className="w-10 h-10 rounded-full" />
            ) : (
              <div className="w-10 h-10 rounded-full bg-navy text-white flex items-center justify-center font-semibold">
                {group.leader?.full_name?.[0]}
              </div>
            )}
            <div>
              <div className="text-xs text-gray-500">Leader</div>
              <div className="font-medium text-navy">{group.leader?.full_name}</div>
            </div>
          </div>
          {group.assistant_leader && (
            <div className="flex items-center gap-2">
              {group.assistant_leader.avatar_url ? (
                <img src={group.assistant_leader.avatar_url} alt="" className="w-10 h-10 rounded-full" />
              ) : (
                <div className="w-10 h-10 rounded-full bg-navy text-white flex items-center justify-center font-semibold">
                  {group.assistant_leader.full_name?.[0]}
                </div>
              )}
              <div>
                <div className="text-xs text-gray-500">Assistant Leader</div>
                <div className="font-medium text-navy">{group.assistant_leader.full_name}</div>
              </div>
            </div>
          )}
        </div>

        {group.whatsapp_enabled && group.whatsapp_link && (
          <div className="mt-4 pt-4 border-t">
            <button
              onClick={() => shareToWhatsAppGroup(group.whatsapp_link!)}
              className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 w-full justify-center font-medium"
            >
              <MessageCircle className="w-5 h-5" />
              Join WhatsApp Group
            </button>
          </div>
        )}
      </div>

      <div className="bg-white rounded-lg shadow">
        <div className="border-b">
          <div className="flex">
            <button
              onClick={() => setActiveTab('announcements')}
              className={`flex-1 px-6 py-3 font-medium ${
                activeTab === 'announcements'
                  ? 'text-navy border-b-2 border-navy'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Announcements
            </button>
            <button
              onClick={() => setActiveTab('members')}
              className={`flex-1 px-6 py-3 font-medium ${
                activeTab === 'members'
                  ? 'text-navy border-b-2 border-navy'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Members ({members.length})
            </button>
            <button
              onClick={() => setActiveTab('meetings')}
              className={`flex-1 px-6 py-3 font-medium ${
                activeTab === 'meetings'
                  ? 'text-navy border-b-2 border-navy'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Meetings
            </button>
          </div>
        </div>

        <div className="p-6">
          {activeTab === 'announcements' && (
            <div className="space-y-4">
              {isLeader && (
                <button className="flex items-center gap-2 px-4 py-2 bg-gold text-navy rounded-lg hover:bg-gold/90 font-semibold">
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
                announcements.map((announcement) => (
                  <div key={announcement.id} className="border rounded-lg p-4">
                    <div className="flex items-start gap-3 mb-2">
                      {announcement.author?.avatar_url ? (
                        <img src={announcement.author.avatar_url} alt="" className="w-8 h-8 rounded-full" />
                      ) : (
                        <div className="w-8 h-8 rounded-full bg-navy text-white flex items-center justify-center text-sm font-semibold">
                          {announcement.author?.full_name?.[0]}
                        </div>
                      )}
                      <div className="flex-1">
                        <div className="font-medium text-navy">{announcement.title}</div>
                        <div className="text-xs text-gray-500">
                          {announcement.author?.full_name} • {new Date(announcement.created_at).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                    <p className="text-gray-700">{announcement.content}</p>
                  </div>
                ))
              )}
            </div>
          )}

          {activeTab === 'members' && (
            <div className="grid md:grid-cols-2 gap-4">
              {members.map((member) => (
                <div key={member.id} className="flex items-center gap-3 p-3 border rounded-lg">
                  {member.member?.avatar_url ? (
                    <img src={member.member.avatar_url} alt="" className="w-12 h-12 rounded-full" />
                  ) : (
                    <div className="w-12 h-12 rounded-full bg-navy text-white flex items-center justify-center font-semibold">
                      {member.member?.full_name?.[0]}
                    </div>
                  )}
                  <div>
                    <div className="font-medium text-navy">{member.member?.full_name}</div>
                    <div className="text-xs text-gray-500">
                      Joined {new Date(member.joined_at).toLocaleDateString()}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'meetings' && (
            <div className="space-y-4">
              {isLeader && (
                <button className="flex items-center gap-2 px-4 py-2 bg-gold text-navy rounded-lg hover:bg-gold/90 font-semibold">
                  <Plus className="w-4 h-4" />
                  Record Meeting
                </button>
              )}
              {meetings.length === 0 ? (
                <div className="text-center py-12 text-gray-500">
                  <Calendar className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                  <p>No meetings recorded yet</p>
                </div>
              ) : (
                meetings.map((meeting) => (
                  <div key={meeting.id} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <div className="font-medium text-navy">
                        {new Date(meeting.meeting_date).toLocaleDateString('en-US', {
                          weekday: 'long',
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </div>
                      <div className="text-sm text-gray-600">
                        <Users className="w-4 h-4 inline mr-1" />
                        {meeting.attendance_count} attended
                      </div>
                    </div>
                    {meeting.topic && (
                      <div className="text-sm text-gray-700 mb-1">
                        <span className="font-medium">Topic:</span> {meeting.topic}
                      </div>
                    )}
                    {meeting.notes && (
                      <p className="text-sm text-gray-600">{meeting.notes}</p>
                    )}
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
