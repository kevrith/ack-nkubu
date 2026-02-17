import { Play, FileText, Calendar, User } from 'lucide-react'
import { Sermon } from '@/types/sermon'
import { formatDate } from '@/lib/utils'

interface SermonCardProps {
  sermon: Sermon
  onPlay: (sermon: Sermon) => void
}

export function SermonCard({ sermon, onPlay }: SermonCardProps) {
  return (
    <div className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow">
      <div className="relative aspect-video bg-gray-200">
        {sermon.thumbnail_url ? (
          <img src={sermon.thumbnail_url} alt={sermon.title} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-navy">
            <Play className="w-16 h-16 text-gold" />
          </div>
        )}
        <div className="absolute top-2 right-2">
          <span className="px-2 py-1 bg-black/70 text-white text-xs rounded">
            {sermon.type.toUpperCase()}
          </span>
        </div>
      </div>
      
      <div className="p-4">
        <h3 className="font-semibold text-navy mb-2 line-clamp-2">{sermon.title}</h3>
        
        <div className="space-y-1 text-sm text-gray-600 mb-3">
          {sermon.preacher && (
            <div className="flex items-center gap-2">
              <User className="w-4 h-4" />
              <span>{sermon.preacher.full_name}</span>
            </div>
          )}
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4" />
            <span>{formatDate(sermon.sermon_date)}</span>
          </div>
          {sermon.scripture_reference && (
            <div className="flex items-center gap-2">
              <FileText className="w-4 h-4" />
              <span>{sermon.scripture_reference}</span>
            </div>
          )}
        </div>

        <button
          onClick={() => onPlay(sermon)}
          className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-navy text-white rounded-lg hover:bg-navy-600"
        >
          <Play className="w-4 h-4" />
          Play Sermon
        </button>
      </div>
    </div>
  )
}
