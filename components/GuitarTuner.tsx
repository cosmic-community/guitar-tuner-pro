'use client'

import { useState, useEffect } from 'react'
import { Tuning, TunerMode, GuitarString } from '@/types'
import TunerControls from '@/components/TunerControls'
import TuningMeter from '@/components/TuningMeter'
import StringSelector from '@/components/StringSelector'
import TuningSelector from '@/components/TuningSelector'
import { ToneGenerator, PitchDetector, frequencyToNote } from '@/lib/audio'

interface GuitarTunerProps {
  tunings: Tuning[]
  defaultTuning: Tuning
}

export default function GuitarTuner({ tunings, defaultTuning }: GuitarTunerProps) {
  const [mode, setMode] = useState<TunerMode>('reference')
  const [selectedTuning, setSelectedTuning] = useState<Tuning>(defaultTuning)
  const [selectedString, setSelectedString] = useState<GuitarString | null>(null)
  const [isListening, setIsListening] = useState(false)
  const [detectedFrequency, setDetectedFrequency] = useState<number | null>(null)
  const [toneGenerator] = useState(() => new ToneGenerator())
  const [pitchDetector] = useState(() => new PitchDetector())

  // Initialize audio on component mount
  useEffect(() => {
    toneGenerator.init()
    
    // Set first string as default
    if (selectedTuning?.metadata?.strings && selectedTuning.metadata.strings.length > 0) {
      setSelectedString(selectedTuning.metadata.strings[0])
    }

    return () => {
      toneGenerator.cleanup()
      pitchDetector.cleanup()
    }
  }, [])

  // Update selected string when tuning changes
  useEffect(() => {
    if (selectedTuning?.metadata?.strings && selectedTuning.metadata.strings.length > 0) {
      const strings = selectedTuning.metadata.strings
      if (!strings) return
      
      setSelectedString(strings[0])
    }
  }, [selectedTuning])

  const handlePlayTone = (frequency: number) => {
    if (mode === 'reference') {
      toneGenerator.play(frequency)
    }
  }

  const handleStartListening = async () => {
    if (mode === 'microphone') {
      const initialized = await pitchDetector.init()
      if (initialized) {
        setIsListening(true)
        startPitchDetection()
      } else {
        alert('Could not access microphone. Please allow microphone access and try again.')
      }
    }
  }

  const handleStopListening = () => {
    setIsListening(false)
    pitchDetector.cleanup()
    setDetectedFrequency(null)
  }

  const startPitchDetection = () => {
    const detect = () => {
      if (!isListening) return
      
      const frequency = pitchDetector.detectPitch()
      if (frequency > 0) {
        setDetectedFrequency(frequency)
      }
      
      requestAnimationFrame(detect)
    }
    
    detect()
  }

  useEffect(() => {
    if (isListening && mode === 'microphone') {
      startPitchDetection()
    }
  }, [isListening, mode])

  const handleModeChange = (newMode: TunerMode) => {
    setMode(newMode)
    if (newMode === 'reference') {
      handleStopListening()
    }
    toneGenerator.stop()
  }

  const calculateCents = (detected: number, target: number): number => {
    return Math.round(1200 * Math.log2(detected / target))
  }

  const getDetectedNote = () => {
    if (!detectedFrequency || !selectedString) return null
    
    const { note, octave, cents } = frequencyToNote(detectedFrequency)
    const targetCents = calculateCents(detectedFrequency, selectedString.frequency)
    
    return {
      note,
      octave,
      cents: targetCents,
      inTune: Math.abs(targetCents) <= 5
    }
  }

  const detectedNote = getDetectedNote()

  return (
    <div className="card space-y-8">
      <TuningSelector 
        tunings={tunings}
        selectedTuning={selectedTuning}
        onTuningChange={setSelectedTuning}
      />

      <TunerControls 
        mode={mode}
        onModeChange={handleModeChange}
        isListening={isListening}
        onStartListening={handleStartListening}
        onStopListening={handleStopListening}
      />

      <StringSelector
        strings={selectedTuning?.metadata?.strings || []}
        selectedString={selectedString}
        onStringSelect={(string) => {
          setSelectedString(string)
          if (mode === 'reference') {
            handlePlayTone(string.frequency)
          }
        }}
        mode={mode}
      />

      <TuningMeter
        targetString={selectedString}
        detectedNote={detectedNote}
        isListening={isListening}
        mode={mode}
      />

      {mode === 'microphone' && !isListening && (
        <div className="text-center text-gray-400 text-sm">
          Click "Start Listening" to begin tuning with the microphone
        </div>
      )}

      {mode === 'reference' && (
        <div className="text-center text-gray-400 text-sm">
          Click on a string to hear its reference tone
        </div>
      )}
    </div>
  )
}