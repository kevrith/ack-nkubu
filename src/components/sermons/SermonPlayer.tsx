import { useRef, useState } from 'react'
import { X, Download, Gauge } from 'lucide-react'
import { Sermon } from '@/types/sermon'
import { formatDate } from '@/lib/utils'

interface SermonPlayerProps {
  sermon: Sermon
  onClose: () => void
}

const SPEED_OPTIONS = [0.5, 0.75, 1, 1.25, 1.5, 1.75, 2] as const
type PlaybackSpeed = typeof SPEED_OPTIONS[number]

export function SermonPlayer({ sermon, onClose }: SermonPlayerProps) {
  const [speed, setSpeed] = useState<PlaybackSpeed>(1)
  const [showSpeedMenu, setShowSpeedMenu] = useState(false)
  const mediaRef = useRef<HTMLAudioElement & HTMLVideoElement>(null)

  function handleSpeedChange(s: PlaybackSpeed) {
    setSpeed(s)
    if (mediaRef.current) {
      mediaRef.current.playbackRate = s
    }
    setShowSpeedMenu(false)
  }

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 p-4 flex items-center justify-between">
          <h2 className="text-xl font-playfair text-navy line-clamp-1">{sermon.title}</h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full ml-2 flex-shrink-0">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-5">
          {/* Audio player */}
          {sermon.type === 'audio' && sermon.media_url && (
            <div className="space-y-2">
              <audio
                ref={mediaRef}
                controls
                className="w-full"
                onLoadedMetadata={() => { if (mediaRef.current) mediaRef.current.playbackRate = speed }}
              >
                <source src={sermon.media_url} type="audio/mpeg" />
              </audio>
            </div>
          )}

          {/* Video player */}
          {sermon.type === 'video' && sermon.media_url && (
            <video
              ref={mediaRef}
              controls
              className="w-full rounded-lg"
              onLoadedMetadata={() => { if (mediaRef.current) mediaRef.current.playbackRate = speed }}
            >
              <source src={sermon.media_url} type="video/mp4" />
            </video>
          )}

          {/* Playback speed control */}
          {(sermon.type === 'audio' || sermon.type === 'video') && sermon.media_url && (
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1.5 text-sm text-gray-600">
                <Gauge className="w-4 h-4" />
                <span className="font-medium">Speed:</span>
              </div>
              <div className="flex gap-1 flex-wrap">
                {SPEED_OPTIONS.map((s) => (
                  <button
                    key={s}
                    onClick={() => handleSpeedChange(s)}
                    className={`px-2.5 py-1 rounded text-xs font-semibold transition-colors ${
                      speed === s
                        ? 'bg-navy text-white'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    {s}×
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Meta */}
          <div className="space-y-1.5 text-sm text-gray-600 border-t pt-4">
            {sermon.preacher && (
              <p><span className="font-semibold text-gray-800">Preacher:</span> {sermon.preacher.full_name}</p>
            )}
            <p><span className="font-semibold text-gray-800">Date:</span> {formatDate(sermon.sermon_date)}</p>
            {sermon.scripture_reference && (
              <p><span className="font-semibold text-gray-800">Scripture:</span> {sermon.scripture_reference}</p>
            )}
          </div>

          {/* Description */}
          {sermon.description && (
            <div>
              <h3 className="font-semibold text-navy mb-2">Description</h3>
              <p className="text-gray-700 leading-relaxed">{sermon.description}</p>
            </div>
          )}

          {/* PDF notes */}
          {sermon.pdf_url && (
            <a
              href={sermon.pdf_url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 bg-gold text-navy rounded-lg hover:bg-gold-600 font-medium text-sm"
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
