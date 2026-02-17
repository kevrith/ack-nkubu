import { useState, useEffect } from 'react'
import { AlertCircle, Pin, Calendar, Paperclip } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import { Notice, NoticeCategory } from '@/types/notice'
import { formatDate } from '@/lib/utils'

const categoryColors: Record<NoticeCategory, string> = {
  general: 'bg-navy text-white',
  urgent: 'bg-red-600 text-white',
  youth: 'bg-green-600 text-white',
  women: 'bg-purple-600 text-white',
  men: 'bg-teal-600 text-white',
  choir: 'bg-gold text-navy',
  ushers: 'bg-orange-600 text-white',
}

export function NoticesPage() {
  const [notices, setNotices] = useState<Notice[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchNotices()
  }, [])

  async function fetchNotices() {
    const { data } = await supabase
      .from('notices')
      .select('*')
      .eq('is_published', true)
      .or(`expiry_date.is.null,expiry_date.gte.${new Date().toISOString()}`)
      .order('is_urgent', { ascending: false })
      .order('created_at', { ascending: false })
    
    setNotices(data || [])
    setLoading(false)
  }

  if (loading) {
    return <div className="text-center py-12">Loading notices...</div>
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-playfair text-navy">Parish Notices</h1>

      {notices.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          <p>No notices at this time.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {notices.map((notice) => (
            <div
              key={notice.id}
              className={`bg-white rounded-lg shadow p-6 border-l-4 ${
                notice.is_urgent ? 'border-red-600' : 'border-navy'
              }`}
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2">
                  {notice.is_urgent && (
                    <AlertCircle className="w-5 h-5 text-red-600" />
                  )}
                  <h2 className="text-xl font-semibold text-navy">{notice.title}</h2>
                </div>
                <span className={`px-3 py-1 rounded-full text-sm ${categoryColors[notice.category]}`}>
                  {notice.category}
                </span>
              </div>

              <p className="text-gray-700 mb-4 whitespace-pre-line">{notice.content}</p>

              <div className="flex items-center gap-4 text-sm text-gray-600">
                <div className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  <span>{formatDate(notice.publish_date || notice.created_at)}</span>
                </div>
                {notice.expiry_date && (
                  <span className="text-gray-500">
                    Expires: {formatDate(notice.expiry_date)}
                  </span>
                )}
                {notice.attachment_url && (
                  <a
                    href={notice.attachment_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 text-navy hover:text-gold"
                  >
                    <Paperclip className="w-4 h-4" />
                    Attachment
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
