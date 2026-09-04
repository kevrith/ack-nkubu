import { useState, useEffect, useRef, useCallback } from 'react'
import { Download, Check, Trash2, Loader2, WifiOff, AlertCircle } from 'lucide-react'
import {
  OFFLINE_VERSIONS,
  OfflineVersion,
  OfflineManifest,
  getManifest,
  getDownloadedCount,
  downloadVersion,
  removeVersion,
} from '@/services/offlineBible'
import { VERSION_INFO } from '@/services/bible.service'
import { useBibleStore } from '@/store/bibleStore'

interface VersionState {
  manifest: OfflineManifest | null
  downloaded: number
  error: string | null
}

type Progress = { done: number; total: number; book: string }

/**
 * Downloads whole translations onto the device.
 *
 * The text is served as static JSON from public/bible and stored in
 * IndexedDB, so once a version is downloaded it reads with no network at all.
 */
export function OfflineBibleDownloader() {
  const { setVersion } = useBibleStore()
  const [states, setStates] = useState<Record<string, VersionState>>({})
  const [busy, setBusy] = useState<OfflineVersion | null>(null)
  const [progress, setProgress] = useState<Progress | null>(null)
  const abortRef = useRef<AbortController | null>(null)

  const refresh = useCallback(async () => {
    const entries = await Promise.all(
      OFFLINE_VERSIONS.map(async (version) => {
        try {
          const [manifest, downloaded] = await Promise.all([
            getManifest(version),
            getDownloadedCount(version),
          ])
          return [version, { manifest, downloaded, error: null }] as const
        } catch (err) {
          return [
            version,
            {
              manifest: null,
              downloaded: 0,
              error: err instanceof Error ? err.message : 'Unavailable',
            },
          ] as const
        }
      }),
    )
    setStates(Object.fromEntries(entries))
  }, [])

  useEffect(() => {
    refresh()
    // Cancel an in-flight download if the user navigates away.
    return () => abortRef.current?.abort()
  }, [refresh])

  async function handleDownload(version: OfflineVersion) {
    const controller = new AbortController()
    abortRef.current = controller
    setBusy(version)
    setProgress({ done: 0, total: states[version]?.manifest?.books.length ?? 66, book: '' })

    try {
      await downloadVersion(version, setProgress, controller.signal)
    } catch (err) {
      if ((err as Error)?.name !== 'AbortError') {
        setStates((prev) => ({
          ...prev,
          [version]: {
            ...prev[version],
            error: err instanceof Error ? err.message : 'Download failed',
          },
        }))
      }
    } finally {
      abortRef.current = null
      setBusy(null)
      setProgress(null)
      refresh()
    }
  }

  async function handleRemove(version: OfflineVersion) {
    await removeVersion(version)
    refresh()
  }

  return (
    <div className="bg-white rounded-lg shadow p-4 sm:p-6 space-y-4">
      <div>
        <h3 className="text-lg font-semibold text-navy">Offline Bible</h3>
        <p className="text-sm text-gray-600 mt-1">
          Download a translation to read it with no internet connection. Each one is
          about 5&nbsp;MB and is stored on this device.
        </p>
      </div>

      <div className="space-y-3">
        {OFFLINE_VERSIONS.map((version) => {
          const state = states[version]
          const info = VERSION_INFO[version]
          const total = state?.manifest?.books.length ?? 66
          const downloaded = state?.downloaded ?? 0
          const isComplete = state?.manifest ? downloaded >= total : false
          const isBusy = busy === version
          const partial = downloaded > 0 && !isComplete

          return (
            <div key={version} className="border rounded-lg p-3 sm:p-4">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-semibold text-navy">{info.label}</span>
                    {isComplete && (
                      <span className="inline-flex items-center gap-1 text-xs font-medium text-green-700 bg-green-50 border border-green-200 rounded-full px-2 py-0.5">
                        <WifiOff className="w-3 h-3" />
                        Available offline
                      </span>
                    )}
                  </div>
                  <div className="text-sm text-gray-600">{info.description}</div>
                  <div className="text-xs text-gray-400 mt-0.5">{info.language}</div>
                </div>

                <div className="flex-shrink-0 flex items-center gap-2">
                  {isBusy ? (
                    <button
                      onClick={() => abortRef.current?.abort()}
                      className="text-sm px-3 py-1.5 rounded-lg border border-gray-300 hover:bg-gray-50"
                    >
                      Cancel
                    </button>
                  ) : isComplete ? (
                    <>
                      <Check className="w-5 h-5 text-green-600" />
                      <button
                        onClick={() => handleRemove(version)}
                        className="p-1.5 text-red-600 hover:text-red-700 hover:bg-red-50 rounded"
                        title={`Remove ${info.label} from this device`}
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </>
                  ) : (
                    <button
                      onClick={() => handleDownload(version)}
                      disabled={!!busy || !state?.manifest}
                      className="flex items-center gap-1.5 text-sm px-3 py-1.5 bg-navy text-white rounded-lg hover:bg-navy-600 disabled:opacity-50"
                    >
                      <Download className="w-4 h-4" />
                      {partial ? 'Finish' : 'Download'}
                    </button>
                  )}
                </div>
              </div>

              {isBusy && progress && (
                <div className="mt-3">
                  <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-navy transition-[width] duration-200"
                      style={{ width: `${Math.round((progress.done / progress.total) * 100)}%` }}
                    />
                  </div>
                  <div className="flex items-center gap-1.5 text-xs text-gray-500 mt-1.5">
                    <Loader2 className="w-3 h-3 animate-spin" />
                    {progress.book || 'Starting'} · {progress.done} of {progress.total} books
                  </div>
                </div>
              )}

              {!isBusy && partial && (
                <div className="mt-2 text-xs text-gray-500">
                  {downloaded} of {total} books stored
                </div>
              )}

              {state?.error && (
                <div className="mt-2 flex items-start gap-1.5 text-xs text-red-600">
                  <AlertCircle className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" />
                  {state.error}
                </div>
              )}

              {isComplete && (
                <button
                  onClick={() => setVersion(version)}
                  className="mt-3 text-sm text-navy underline underline-offset-2 hover:text-navy-600"
                >
                  Read in {info.label}
                </button>
              )}

              {/* Attribution is a licence condition for these texts. */}
              {state?.manifest && (
                <p className="mt-3 pt-2 border-t text-[11px] leading-snug text-gray-400">
                  {state.manifest.copyright}
                </p>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
