import GuitarTuner from '@/components/GuitarTuner'
import { getTunings, getDefaultTuning } from '@/lib/cosmic'
import { Tuning } from '@/types'

export const dynamic = 'force-dynamic'

export default async function Home() {
  let tunings: Tuning[] = []
  let defaultTuning: Tuning | null = null

  try {
    tunings = await getTunings() as Tuning[]
    defaultTuning = await getDefaultTuning() as Tuning | null
  } catch (error) {
    console.error('Error loading tunings:', error)
  }

  // If no tunings exist, create a default standard tuning
  if (!tunings || tunings.length === 0) {
    const standardTuning = {
      id: 'default-standard',
      slug: 'standard',
      title: 'Standard Tuning',
      type: 'tunings',
      metadata: {
        name: 'Standard Tuning',
        strings: [
          { string_number: 1, note: 'E', frequency: 329.63, octave: 4 },
          { string_number: 2, note: 'B', frequency: 246.94, octave: 3 },
          { string_number: 3, note: 'G', frequency: 196.00, octave: 3 },
          { string_number: 4, note: 'D', frequency: 146.83, octave: 3 },
          { string_number: 5, note: 'A', frequency: 110.00, octave: 2 },
          { string_number: 6, note: 'E', frequency: 82.41, octave: 2 },
        ],
        description: 'Standard guitar tuning (E-A-D-G-B-E)',
        is_default: true,
      },
    } as Tuning

    tunings = [standardTuning]
    defaultTuning = standardTuning
  }

  // Ensure we have a valid default tuning - use first tuning if defaultTuning is null
  const selectedDefaultTuning = defaultTuning || tunings[0]

  // Safety check - this should never happen due to fallback above, but TypeScript needs it
  if (!selectedDefaultTuning) {
    return (
      <main className="min-h-screen py-8 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-red-400">Error: No tunings available</p>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <header className="text-center mb-12">
          <h1 className="text-5xl font-bold mb-4 text-gradient">
            🎸 Guitar Tuner Pro
          </h1>
          <p className="text-gray-400 text-lg">
            Professional guitar tuning with reference tones and real-time pitch detection
          </p>
        </header>

        <GuitarTuner 
          tunings={tunings} 
          defaultTuning={selectedDefaultTuning} 
        />

        <footer className="mt-16 text-center text-gray-500 text-sm">
          <p>
            For best results, use in a quiet environment and hold your guitar close to the microphone.
          </p>
          <p className="mt-2">
            Standard tuning: E - A - D - G - B - E (low to high)
          </p>
        </footer>
      </div>
    </main>
  )
}