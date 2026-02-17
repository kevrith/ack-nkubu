import { SermonType } from '@/types/sermon'

interface SermonFiltersProps {
  selectedType: SermonType | 'all'
  onTypeChange: (type: SermonType | 'all') => void
}

export function SermonFilters({ selectedType, onTypeChange }: SermonFiltersProps) {
  const types: { value: SermonType | 'all'; label: string }[] = [
    { value: 'all', label: 'All' },
    { value: 'audio', label: 'Audio' },
    { value: 'video', label: 'Video' },
    { value: 'text', label: 'Text' },
  ]

  return (
    <div className="flex gap-2 flex-wrap">
      {types.map((type) => (
        <button
          key={type.value}
          onClick={() => onTypeChange(type.value)}
          className={`px-4 py-2 rounded-lg transition-colors ${
            selectedType === type.value
              ? 'bg-navy text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          {type.label}
        </button>
      ))}
    </div>
  )
}
