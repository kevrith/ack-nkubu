import { useState } from 'react'
import { Plus, FileText, Calendar, Bell, Mic, BookOpen } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/hooks/useAuth'
import { MediaUploader } from '@/components/shared/MediaUploader'

type ContentType = 'sermon' | 'notice' | 'event' | 'article' | 'prayer'

export function AdminContentPage() {
  const { user } = useAuth()
  const [contentType, setContentType] = useState<ContentType>('notice')
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  const userRole = user?.profile.role
  const canEditSermons = userRole === 'clergy' || userRole === 'admin'
  const canEditPastorsCorner = userRole === 'clergy' || userRole === 'admin'
  const canEditNotices = true // All roles
  const canEditEvents = true // All roles

  // Notice form
  const [noticeTitle, setNoticeTitle] = useState('')
  const [noticeContent, setNoticeContent] = useState('')
  const [noticeCategory, setNoticeCategory] = useState('general')
  const [isUrgent, setIsUrgent] = useState(false)

  // Event form
  const [eventTitle, setEventTitle] = useState('')
  const [eventDescription, setEventDescription] = useState('')
  const [eventCategory, setEventCategory] = useState('service')
  const [eventLocation, setEventLocation] = useState('')
  const [eventDate, setEventDate] = useState('')
  const [eventTime, setEventTime] = useState('')

  // Sermon form
  const [sermonTitle, setSermonTitle] = useState('')
  const [sermonDescription, setSermonDescription] = useState('')
  const [sermonScripture, setSermonScripture] = useState('')
  const [sermonDate, setSermonDate] = useState('')
  const [sermonType, setSermonType] = useState('audio')
  const [sermonMediaUrl, setSermonMediaUrl] = useState('')
  const [sermonPublicId, setSermonPublicId] = useState('')

  // Article form
  const [articleTitle, setArticleTitle] = useState('')
  const [articleContent, setArticleContent] = useState('')
  const [articleCategory, setArticleCategory] = useState('message')

  // Prayer form
  const [prayerTitle, setPrayerTitle] = useState('')
  const [prayerContent, setPrayerContent] = useState('')
  const [prayerCategory, setPrayerCategory] = useState('morning')

  async function handleSubmitNotice(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)

    const { error } = await supabase.from('notices').insert({
      title: noticeTitle,
      content: noticeContent,
      category: noticeCategory,
      is_urgent: isUrgent,
      is_published: true,
      created_by: user?.id,
    })

    if (!error) {
      setSuccess(true)
      setNoticeTitle('')
      setNoticeContent('')
      setTimeout(() => setSuccess(false), 3000)
    }
    setLoading(false)
  }

  async function handleSubmitEvent(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)

    const datetime = `${eventDate}T${eventTime}:00`

    const { error } = await supabase.from('events').insert({
      title: eventTitle,
      description: eventDescription,
      category: eventCategory,
      location: eventLocation,
      start_datetime: datetime,
      is_published: true,
      rsvp_enabled: true,
      created_by: user?.id,
    })

    if (!error) {
      setSuccess(true)
      setEventTitle('')
      setEventDescription('')
      setEventLocation('')
      setTimeout(() => setSuccess(false), 3000)
    }
    setLoading(false)
  }

  async function handleSubmitSermon(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)

    const { error } = await supabase.from('sermons').insert({
      title: sermonTitle,
      description: sermonDescription,
      scripture_reference: sermonScripture,
      sermon_date: sermonDate,
      type: sermonType,
      media_url: sermonMediaUrl,
      cloudinary_public_id: sermonPublicId,
      is_published: true,
      preacher_id: user?.id,
    })

    if (!error) {
      setSuccess(true)
      setSermonTitle('')
      setSermonDescription('')
      setSermonScripture('')
      setSermonMediaUrl('')
      setSermonPublicId('')
      setTimeout(() => setSuccess(false), 3000)
    }
    setLoading(false)
  }

  async function handleSubmitArticle(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)

    const { error } = await supabase.from('pastors_corner').insert({
      title: articleTitle,
      content: articleContent,
      category: articleCategory,
      is_published: true,
      publish_date: new Date().toISOString(),
      author_id: user?.id,
    })

    if (!error) {
      setSuccess(true)
      setArticleTitle('')
      setArticleContent('')
      setTimeout(() => setSuccess(false), 3000)
    }
    setLoading(false)
  }

  async function handleSubmitPrayer(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)

    const { error } = await supabase.from('prayers').insert({
      title: prayerTitle,
      content: prayerContent,
      category: prayerCategory,
      created_by: user?.id,
    })

    if (!error) {
      setSuccess(true)
      setPrayerTitle('')
      setPrayerContent('')
      setTimeout(() => setSuccess(false), 3000)
    }
    setLoading(false)
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-playfair text-navy">Content Management</h1>

      {success && (
        <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded">
          ✓ Content published successfully!
        </div>
      )}

      <div className="flex gap-2 flex-wrap">
        {canEditNotices && (
          <button
            onClick={() => setContentType('notice')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg ${
              contentType === 'notice' ? 'bg-navy text-white' : 'bg-gray-100'
            }`}
          >
            <Bell className="w-4 h-4" />
            Notice
          </button>
        )}
        {canEditEvents && (
          <button
            onClick={() => setContentType('event')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg ${
              contentType === 'event' ? 'bg-navy text-white' : 'bg-gray-100'
            }`}
          >
            <Calendar className="w-4 h-4" />
            Event
          </button>
        )}
        {canEditSermons && (
          <button
            onClick={() => setContentType('sermon')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg ${
              contentType === 'sermon' ? 'bg-navy text-white' : 'bg-gray-100'
            }`}
          >
            <Mic className="w-4 h-4" />
            Sermon
          </button>
        )}
        {canEditPastorsCorner && (
          <button
            onClick={() => setContentType('article')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg ${
              contentType === 'article' ? 'bg-navy text-white' : 'bg-gray-100'
            }`}
          >
            <FileText className="w-4 h-4" />
            Pastor's Corner
          </button>
        )}
        <button
          onClick={() => setContentType('prayer')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg ${
            contentType === 'prayer' ? 'bg-navy text-white' : 'bg-gray-100'
          }`}
        >
          <BookOpen className="w-4 h-4" />
          Prayer
        </button>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        {contentType === 'notice' && (
          <form onSubmit={handleSubmitNotice} className="space-y-4">
            <h2 className="text-xl font-semibold text-navy mb-4">Create Notice</h2>
            <div>
              <label className="block text-sm font-medium mb-2">Title</label>
              <input
                type="text"
                value={noticeTitle}
                onChange={(e) => setNoticeTitle(e.target.value)}
                required
                className="w-full px-4 py-2 border rounded-lg"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Content</label>
              <textarea
                value={noticeContent}
                onChange={(e) => setNoticeContent(e.target.value)}
                required
                rows={4}
                className="w-full px-4 py-2 border rounded-lg"
              />
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Category</label>
                <select
                  value={noticeCategory}
                  onChange={(e) => setNoticeCategory(e.target.value)}
                  className="w-full px-4 py-2 border rounded-lg"
                >
                  <option value="general">General</option>
                  <option value="urgent">Urgent</option>
                  <option value="youth">Youth</option>
                  <option value="women">Women</option>
                  <option value="men">Men</option>
                  <option value="choir">Choir</option>
                </select>
              </div>
              <div className="flex items-center">
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={isUrgent}
                    onChange={(e) => setIsUrgent(e.target.checked)}
                    className="rounded"
                  />
                  <span className="text-sm">Mark as Urgent</span>
                </label>
              </div>
            </div>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2 bg-navy text-white rounded-lg hover:bg-navy-600 disabled:opacity-50"
            >
              {loading ? 'Publishing...' : 'Publish Notice'}
            </button>
          </form>
        )}

        {contentType === 'event' && (
          <form onSubmit={handleSubmitEvent} className="space-y-4">
            <h2 className="text-xl font-semibold text-navy mb-4">Create Event</h2>
            <div>
              <label className="block text-sm font-medium mb-2">Title</label>
              <input
                type="text"
                value={eventTitle}
                onChange={(e) => setEventTitle(e.target.value)}
                required
                className="w-full px-4 py-2 border rounded-lg"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Description</label>
              <textarea
                value={eventDescription}
                onChange={(e) => setEventDescription(e.target.value)}
                rows={3}
                className="w-full px-4 py-2 border rounded-lg"
              />
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Category</label>
                <select
                  value={eventCategory}
                  onChange={(e) => setEventCategory(e.target.value)}
                  className="w-full px-4 py-2 border rounded-lg"
                >
                  <option value="service">Service</option>
                  <option value="fellowship">Fellowship</option>
                  <option value="conference">Conference</option>
                  <option value="retreat">Retreat</option>
                  <option value="youth">Youth</option>
                  <option value="outreach">Outreach</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Location</label>
                <input
                  type="text"
                  value={eventLocation}
                  onChange={(e) => setEventLocation(e.target.value)}
                  className="w-full px-4 py-2 border rounded-lg"
                />
              </div>
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Date</label>
                <input
                  type="date"
                  value={eventDate}
                  onChange={(e) => setEventDate(e.target.value)}
                  required
                  className="w-full px-4 py-2 border rounded-lg"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Time</label>
                <input
                  type="time"
                  value={eventTime}
                  onChange={(e) => setEventTime(e.target.value)}
                  required
                  className="w-full px-4 py-2 border rounded-lg"
                />
              </div>
            </div>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2 bg-navy text-white rounded-lg hover:bg-navy-600 disabled:opacity-50"
            >
              {loading ? 'Publishing...' : 'Publish Event'}
            </button>
          </form>
        )}

        {contentType === 'sermon' && (
          <form onSubmit={handleSubmitSermon} className="space-y-4">
            <h2 className="text-xl font-semibold text-navy mb-4">Add Sermon</h2>
            <div>
              <label className="block text-sm font-medium mb-2">Title</label>
              <input
                type="text"
                value={sermonTitle}
                onChange={(e) => setSermonTitle(e.target.value)}
                required
                className="w-full px-4 py-2 border rounded-lg"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Description</label>
              <textarea
                value={sermonDescription}
                onChange={(e) => setSermonDescription(e.target.value)}
                rows={3}
                className="w-full px-4 py-2 border rounded-lg"
              />
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Scripture Reference</label>
                <input
                  type="text"
                  value={sermonScripture}
                  onChange={(e) => setSermonScripture(e.target.value)}
                  placeholder="e.g., John 3:16"
                  className="w-full px-4 py-2 border rounded-lg"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Date</label>
                <input
                  type="date"
                  value={sermonDate}
                  onChange={(e) => setSermonDate(e.target.value)}
                  required
                  className="w-full px-4 py-2 border rounded-lg"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Type</label>
              <select
                value={sermonType}
                onChange={(e) => setSermonType(e.target.value)}
                className="w-full px-4 py-2 border rounded-lg"
              >
                <option value="audio">Audio</option>
                <option value="video">Video</option>
                <option value="text">Text</option>
              </select>
            </div>
            <MediaUploader
              accept={sermonType === 'audio' ? 'audio/*' : sermonType === 'video' ? 'video/*' : '*'}
              resourceType={sermonType === 'text' ? 'raw' : sermonType as any}
              onUploadComplete={(url, publicId) => {
                setSermonMediaUrl(url)
                setSermonPublicId(publicId || "")
              }}
              maxSizeMB={sermonType === 'video' ? 500 : 100}
              label={`Upload ${sermonType === 'audio' ? 'Audio' : sermonType === 'video' ? 'Video' : 'File'}`}
            />
            {sermonMediaUrl && (
              <p className="text-sm text-green-600">✓ Media uploaded successfully</p>
            )}
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2 bg-navy text-white rounded-lg hover:bg-navy-600 disabled:opacity-50"
            >
              {loading ? 'Publishing...' : 'Publish Sermon'}
            </button>
          </form>
        )}

        {contentType === 'article' && (
          <form onSubmit={handleSubmitArticle} className="space-y-4">
            <h2 className="text-xl font-semibold text-navy mb-4">Write Article</h2>
            <div>
              <label className="block text-sm font-medium mb-2">Title</label>
              <input
                type="text"
                value={articleTitle}
                onChange={(e) => setArticleTitle(e.target.value)}
                required
                className="w-full px-4 py-2 border rounded-lg"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Content</label>
              <textarea
                value={articleContent}
                onChange={(e) => setArticleContent(e.target.value)}
                required
                rows={8}
                className="w-full px-4 py-2 border rounded-lg"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Category</label>
              <select
                value={articleCategory}
                onChange={(e) => setArticleCategory(e.target.value)}
                className="w-full px-4 py-2 border rounded-lg"
              >
                <option value="message">Message</option>
                <option value="devotional">Devotional</option>
                <option value="reflection">Reflection</option>
                <option value="announcement">Announcement</option>
              </select>
            </div>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2 bg-navy text-white rounded-lg hover:bg-navy-600 disabled:opacity-50"
            >
              {loading ? 'Publishing...' : 'Publish Article'}
            </button>
          </form>
        )}

        {contentType === 'prayer' && (
          <form onSubmit={handleSubmitPrayer} className="space-y-4">
            <h2 className="text-xl font-semibold text-navy mb-4">Add Prayer</h2>
            <div>
              <label className="block text-sm font-medium mb-2">Title</label>
              <input
                type="text"
                value={prayerTitle}
                onChange={(e) => setPrayerTitle(e.target.value)}
                required
                className="w-full px-4 py-2 border rounded-lg"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Prayer Content</label>
              <textarea
                value={prayerContent}
                onChange={(e) => setPrayerContent(e.target.value)}
                required
                rows={6}
                className="w-full px-4 py-2 border rounded-lg"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Category</label>
              <select
                value={prayerCategory}
                onChange={(e) => setPrayerCategory(e.target.value)}
                className="w-full px-4 py-2 border rounded-lg"
              >
                <option value="morning">Morning</option>
                <option value="evening">Evening</option>
                <option value="intercessory">Intercessory</option>
                <option value="liturgical">Liturgical</option>
                <option value="special">Special</option>
              </select>
            </div>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2 bg-navy text-white rounded-lg hover:bg-navy-600 disabled:opacity-50"
            >
              {loading ? 'Adding...' : 'Add Prayer'}
            </button>
          </form>
        )}
      </div>
    </div>
  )
}
