import { X, Download } from 'lucide-react'
import { Sermon } from '@/types/sermon'
import { formatDate } from '@/lib/utils'

interface SermonPlayerProps {
  sermon: Sermon
  onClose: () => void
}

export function SermonPlayer({ sermon, onClose }: SermonPlayerProps) {
  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 p-4 flex items-center justify-between">
          <h2 className="text-xl font-playfair text-navy">{sermon.title}</h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-4">
          {sermon.type === 'audio' && sermon.media_url && (
            <audio controls className="w-full">
              <source src={sermon.media_url} type="audio/mpeg" />
            </audio>
          )}

          {sermon.type === 'video' && sermon.media_url && (
            <video controls className="w-full rounded-lg">
              <source src={sermon.media_url} type="video/mp4" />
            </video>
          )}

          <div className="space-y-2 text-sm text-gray-600">
            {sermon.preacher && <p><strong>Preacher:</strong> {sermon.preacher.full_name}</p>}
            <p><strong>Date:</strong> {formatDate(sermon.sermon_date)}</p>
            {sermon.scripture_reference && <p><strong>Scripture:</strong> {sermon.scripture_reference}</p>}
          </div>

          {sermon.description && (
            <div>
              <h3 className="font-semibold text-navy mb-2">Description</h3>
              <p className="text-gray-700">{sermon.description}</p>
            </div>
          )}

          {sermon.pdf_url && (
            <a
              href={sermon.pdf_url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-4 py-2 bg-gold text-navy rounded-lg hover:bg-gold-600 w-fit"
            >
              <Download className="w-4 h-4" />
              Download Sermon Notes (PDF)
            </a>
          )}
        </div>
      </div>
    </div>
  )
}
