// Audio utilities for tone generation and pitch detection

// Generate audio tone at specified frequency
export class ToneGenerator {
  private audioContext: AudioContext | null = null;
  private oscillator: OscillatorNode | null = null;
  private gainNode: GainNode | null = null;

  init() {
    if (typeof window === 'undefined') return;
    this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
  }

  play(frequency: number, duration: number = 2000) {
    if (!this.audioContext) return;

    // Stop any existing tone
    this.stop();

    // Create oscillator and gain nodes
    this.oscillator = this.audioContext.createOscillator();
    this.gainNode = this.audioContext.createGain();

    // Configure oscillator
    this.oscillator.type = 'sine';
    this.oscillator.frequency.setValueAtTime(frequency, this.audioContext.currentTime);

    // Configure gain (volume)
    this.gainNode.gain.setValueAtTime(0.3, this.audioContext.currentTime);
    this.gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + duration / 1000);

    // Connect nodes
    this.oscillator.connect(this.gainNode);
    this.gainNode.connect(this.audioContext.destination);

    // Start playing
    this.oscillator.start(this.audioContext.currentTime);
    this.oscillator.stop(this.audioContext.currentTime + duration / 1000);

    // Clean up after duration
    setTimeout(() => {
      this.stop();
    }, duration);
  }

  stop() {
    if (this.oscillator) {
      try {
        this.oscillator.stop();
        this.oscillator.disconnect();
      } catch (e) {
        // Oscillator may already be stopped
      }
      this.oscillator = null;
    }
    if (this.gainNode) {
      this.gainNode.disconnect();
      this.gainNode = null;
    }
  }

  cleanup() {
    this.stop();
    if (this.audioContext) {
      this.audioContext.close();
      this.audioContext = null;
    }
  }
}

// Pitch detection using autocorrelation
export class PitchDetector {
  private audioContext: AudioContext | null = null;
  private analyser: AnalyserNode | null = null;
  private mediaStream: MediaStream | null = null;
  private bufferLength: number = 0;
  private dataArray: Uint8Array | null = null;

  async init() {
    if (typeof window === 'undefined') return false;

    try {
      this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      this.analyser = this.audioContext.createAnalyser();
      this.analyser.fftSize = 2048;
      this.bufferLength = this.analyser.fftSize;
      
      // Create Uint8Array directly with buffer length to ensure correct type inference
      this.dataArray = new Uint8Array(this.bufferLength);

      // Request microphone access
      this.mediaStream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const source = this.audioContext.createMediaStreamSource(this.mediaStream);
      source.connect(this.analyser);

      return true;
    } catch (error) {
      console.error('Error initializing pitch detector:', error);
      return false;
    }
  }

  detectPitch(): number {
    if (!this.analyser || !this.dataArray || !this.audioContext) return -1;

    this.analyser.getByteTimeDomainData(this.dataArray);

    // Autocorrelation algorithm with proper type safety
    const correlations = new Array(this.bufferLength).fill(0);
    
    for (let lag = 0; lag < this.bufferLength; lag++) {
      let sum = 0;
      for (let i = 0; i < this.bufferLength - lag; i++) {
        // Safe array access with bounds checking
        if (i < this.dataArray.length && (i + lag) < this.dataArray.length) {
          const dataValue = this.dataArray[i];
          const lagValue = this.dataArray[i + lag];
          if (dataValue !== undefined && lagValue !== undefined) {
            sum += (dataValue - 128) * (lagValue - 128);
          }
        }
      }
      correlations[lag] = sum;
    }

    // Find first peak after the initial drop
    let maxCorrelation = 0;
    let maxLag = -1;
    
    for (let i = 1; i < correlations.length; i++) {
      const currentCorr = correlations[i];
      const prevCorr = correlations[i - 1];
      if (currentCorr !== undefined && prevCorr !== undefined && 
          currentCorr > maxCorrelation && currentCorr > prevCorr) {
        maxCorrelation = currentCorr;
        maxLag = i;
      }
    }

    if (maxLag === -1 || maxCorrelation < 0.01) {
      return -1; // No clear pitch detected
    }

    const frequency = this.audioContext.sampleRate / maxLag;
    
    // Filter out unrealistic frequencies
    if (frequency < 60 || frequency > 1200) {
      return -1;
    }

    return frequency;
  }

  cleanup() {
    if (this.mediaStream) {
      this.mediaStream.getTracks().forEach(track => track.stop());
      this.mediaStream = null;
    }
    if (this.audioContext) {
      this.audioContext.close();
      this.audioContext = null;
    }
    this.analyser = null;
    this.dataArray = null;
  }
}

// Convert frequency to note name and cents deviation
export function frequencyToNote(frequency: number): { note: string; octave: number; cents: number } {
  const A4 = 440;
  const C0 = A4 * Math.pow(2, -4.75);
  
  const halfSteps = 12 * Math.log2(frequency / C0);
  const octave = Math.floor(halfSteps / 12);
  const noteIndex = Math.round(halfSteps) % 12;
  const cents = Math.round((halfSteps - Math.round(halfSteps)) * 100);
  
  const noteNames = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
  
  return {
    note: noteNames[noteIndex] || 'C',
    octave,
    cents
  };
}