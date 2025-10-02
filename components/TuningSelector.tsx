import { Tuning } from '@/types'

interface TuningSelectorProps {
  tunings: Tuning[]
  selectedTuning: Tuning
  onTuningChange: (tuning: Tuning) => void
}

export default function TuningSelector({
  tunings,
  selectedTuning,
  onTuningChange,
}: TuningSelectorProps) {
  if (!tunings || tunings.length === 0) {
    return null
  }

  // Only show selector if there are multiple tunings
  if (tunings.length === 1) {
    return (
      <div className="text-center">
        <div className="inline-block bg-dark-lightest px-6 py-3 rounded-lg">
          <span className="text-gray-400 text-sm">Tuning: </span>
          <span className="text-white font-medium">{selectedTuning.metadata?.name || selectedTuning.title}</span>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      <label className="block text-center text-gray-400 text-sm font-medium">
        Select Tuning
      </label>
      <select
        value={selectedTuning.id}
        onChange={(e) => {
          const tuning = tunings.find(t => t.id === e.target.value)
          if (tuning) {
            onTuningChange(tuning)
          }
        }}
        className="w-full bg-dark-lightest border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-primary"
      >
        {tunings.map((tuning) => (
          <option key={tuning.id} value={tuning.id}>
            {tuning.metadata?.name || tuning.title}
          </option>
        ))}
      </select>
    </div>
  )
}