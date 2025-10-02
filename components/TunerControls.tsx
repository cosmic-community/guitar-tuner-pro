import { TunerMode } from '@/types'

interface TunerControlsProps {
  mode: TunerMode
  onModeChange: (mode: TunerMode) => void
  isListening: boolean
  onStartListening: () => void
  onStopListening: () => void
}

export default function TunerControls({
  mode,
  onModeChange,
  isListening,
  onStartListening,
  onStopListening,
}: TunerControlsProps) {
  return (
    <div className="space-y-4">
      <div className="flex gap-4 justify-center">
        <button
          onClick={() => onModeChange('reference')}
          className={`btn ${mode === 'reference' ? 'btn-primary' : 'btn-secondary'}`}
        >
          🔊 Reference Tones
        </button>
        <button
          onClick={() => onModeChange('microphone')}
          className={`btn ${mode === 'microphone' ? 'btn-primary' : 'btn-secondary'}`}
        >
          🎤 Microphone
        </button>
      </div>

      {mode === 'microphone' && (
        <div className="flex justify-center">
          {!isListening ? (
            <button
              onClick={onStartListening}
              className="btn btn-primary px-8 py-4 text-lg"
            >
              Start Listening
            </button>
          ) : (
            <button
              onClick={onStopListening}
              className="btn bg-danger hover:bg-red-600 text-white px-8 py-4 text-lg"
            >
              Stop Listening
            </button>
          )}
        </div>
      )}
    </div>
  )
}