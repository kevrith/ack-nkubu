import { useBibleStore } from '@/store/bibleStore'
import { BibleVersion } from '@/types/bible'
import { AVAILABLE_VERSIONS } from '@/services/bible.service'

const versionInfo: Record<BibleVersion, { label: string; description: string }> = {
  NIV: { label: 'NIV', description: 'New International Version' },
  NLT: { label: 'NLT', description: 'New Living Translation' },
  KJV: { label: 'KJV', description: 'King James Version' },
  NRSV: { label: 'NRSV', description: 'New Revised Standard Version' },
  NKJV: { label: 'NKJV', description: 'New King James Version' },
}

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
          {versionInfo[v].label} - {versionInfo[v].description}
        </option>
      ))}
    </select>
  )
}
