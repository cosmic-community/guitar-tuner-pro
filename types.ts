// Type definitions for Guitar Tuner Pro

// Base Cosmic object interface
export interface CosmicObject {
  id: string;
  slug: string;
  title: string;
  content?: string;
  metadata: Record<string, any>;
  type: string;
  created_at: string;
  modified_at: string;
}

// Guitar string configuration
export interface GuitarString {
  string_number: number;
  note: string;
  frequency: number;
  octave: number;
}

// Tuning difficulty levels
export type TuningDifficulty = 'Beginner' | 'Intermediate' | 'Advanced';

// Tuning configuration from Cosmic
export interface Tuning extends CosmicObject {
  type: 'tunings';
  metadata: {
    name: string;
    strings: GuitarString[];
    description?: string;
    difficulty?: TuningDifficulty;
    is_default?: boolean;
  };
}

// Pitch detection result
export interface PitchDetectionResult {
  frequency: number;
  note: string;
  octave: number;
  cents: number;
  inTune: boolean;
}

// Tuner mode
export type TunerMode = 'reference' | 'microphone';

// API response types
export interface CosmicResponse<T> {
  objects: T[];
  total: number;
  limit: number;
  skip: number;
}