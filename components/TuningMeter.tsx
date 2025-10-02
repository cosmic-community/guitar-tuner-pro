import { GuitarString, PitchDetectionResult, TunerMode } from '@/types'

interface TuningMeterProps {
  targetString: GuitarString | null
  detectedNote: PitchDetectionResult | null
  isListening: boolean
  mode: TunerMode
}

export default function TuningMeter({
  targetString,
  detectedNote,
  isListening,
  mode,
}: TuningMeterProps) {
  if (!targetString) {
    return (
      <div className="text-center py-12 text-gray-400">
        Select a string to begin tuning
      </div>
    )
  }

  const getMeterColor = () => {
    if (!detectedNote) return 'bg-gray-700'
    
    const cents = Math.abs(detectedNote.cents)
    if (cents <= 5) return 'bg-success'
    if (cents <= 15) return 'bg-warning'
    return 'bg-danger'
  }

  const getMeterPosition = () => {
    if (!detectedNote) return 50
    
    // Scale from -50 to +50 cents to 0-100%
    const position = 50 + (detectedNote.cents / 50) * 50
    return Math.max(0, Math.min(100, position))
  }

  const getTuningStatus = () => {
    if (!detectedNote) return 'Listening...'
    
    const cents = Math.abs(detectedNote.cents)
    if (cents <= 5) return '✓ In Tune!'
    if (detectedNote.cents < 0) return '↓ Too Low'
    return '↑ Too High'
  }

  return (
    <div className="space-y-6 py-8">
      {/* Target Info */}
      <div className="text-center">
        <div className="text-5xl font-bold text-white mb-2">
          {targetString.note}
          <span className="text-2xl text-gray-500 ml-2">{targetString.octave}</span>
        </div>
        <div className="text-gray-400 text-sm">
          Target: {Math.round(targetString.frequency)} Hz
        </div>
      </div>

      {/* Tuning Meter */}
      {mode === 'microphone' && isListening && (
        <div className="space-y-4">
          {/* Visual Meter */}
          <div className="relative h-24 bg-dark-lightest rounded-lg overflow-hidden">
            {/* Center Line */}
            <div className="absolute left-1/2 top-0 bottom-0 w-0.5 bg-gray-600 z-10" />
            
            {/* Meter Fill */}
            <div 
              className={`absolute top-0 bottom-0 w-1 ${getMeterColor()} transition-all duration-100`}
              style={{ left: `${getMeterPosition()}%`, transform: 'translateX(-50%)' }}
            />
            
            {/* Scale Markers */}
            <div className="absolute inset-0 flex justify-between px-4 items-center text-xs text-gray-600">
              <span>-50¢</span>
              <span>-25¢</span>
              <span className="text-white">0¢</span>
              <span>+25¢</span>
              <span>+50¢</span>
            </div>
          </div>

          {/* Status Display */}
          <div className="text-center space-y-2">
            <div className={`text-2xl font-bold ${detectedNote?.inTune ? 'text-success' : 'text-white'}`}>
              {getTuningStatus()}
            </div>
            
            {detectedNote && (
              <div className="space-y-1">
                <div className="text-gray-400">
                  Detected: {detectedNote.note}{detectedNote.octave} 
                  <span className="ml-2 text-white font-mono">
                    {detectedNote.cents > 0 ? '+' : ''}{detectedNote.cents}¢
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {mode === 'reference' && (
        <div className="text-center py-8 text-gray-400">
          <div className="text-lg mb-2">Reference Mode</div>
          <div className="text-sm">
            Click on a string above to hear its reference tone
          </div>
        </div>
      )}
    </div>
  )
}