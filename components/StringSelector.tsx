import { GuitarString, TunerMode } from '@/types'

interface StringSelectorProps {
  strings: GuitarString[]
  selectedString: GuitarString | null
  onStringSelect: (string: GuitarString) => void
  mode: TunerMode
}

export default function StringSelector({
  strings,
  selectedString,
  onStringSelect,
  mode,
}: StringSelectorProps) {
  if (!strings || strings.length === 0) {
    return <div className="text-center text-gray-400">No strings configured</div>
  }

  // Sort strings by string_number (descending for display)
  const sortedStrings = [...strings].sort((a, b) => a.string_number - b.string_number)

  return (
    <div className="space-y-4">
      <h3 className="text-center text-gray-400 text-sm font-medium">
        Select String
      </h3>
      <div className="grid grid-cols-6 gap-2">
        {sortedStrings.map((string) => {
          const isSelected = selectedString?.string_number === string.string_number
          
          return (
            <button
              key={string.string_number}
              onClick={() => onStringSelect(string)}
              className={`
                relative py-6 rounded-lg font-bold text-lg transition-all duration-200
                ${isSelected 
                  ? 'bg-primary text-white scale-105 shadow-lg' 
                  : 'bg-dark-lightest text-gray-400 hover:bg-dark-lighter hover:text-white'
                }
              `}
            >
              <div className="text-sm text-gray-400 mb-1">
                {string.string_number}
              </div>
              <div className="text-2xl">
                {string.note}
              </div>
              <div className="text-xs text-gray-500 mt-1">
                {Math.round(string.frequency)}Hz
              </div>
            </button>
          )
        })}
      </div>
    </div>
  )
}