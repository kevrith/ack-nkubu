import { useBibleStore } from '@/store/bibleStore'
import { BibleVersion } from '@/types/bible'
import { AVAILABLE_VERSIONS, VERSION_INFO } from '@/services/bible.service'

export function VersionSelector() {
  const { version, setVersion } = useBibleStore()

  return (
    <select
      value={version}
      onChange={(e) => setVersion(e.target.value as BibleVersion)}
      className="px-4 py-2 border border-gray-300 rounded-lg bg-white text-navy font-medium focus:ring-2 focus:ring-navy focus:border-transparent"
    >
      {AVAILABLE_VERSIONS.map((v) => (
        <option key={v} value={v}>
          {VERSION_INFO[v].label} - {VERSION_INFO[v].description}
          {VERSION_INFO[v].offline ? ' (offline)' : ''}
        </option>
      ))}
    </select>
  )
}
