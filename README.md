# 🎸 Guitar Tuner Pro

![Guitar Tuner Preview](https://images.unsplash.com/photo-1510915361894-db8b60106cb1?w=1200&h=300&fit=crop&auto=format)

A professional-grade guitar tuning application with both reference tone playback and real-time pitch detection capabilities. Built with Next.js 15 and powered by Cosmic CMS for tuning configuration management.

## ✨ Features

- **Dual Tuning Modes**
  - Reference Tone Mode: Play standard tuning notes to tune by ear
  - Microphone Mode: Real-time pitch detection with visual feedback
- **Visual Tuning Meter**
  - Color-coded indicators (green = in-tune, orange = close, red = out-of-tune)
  - Precise cent deviation display
  - Animated needle for smooth visual feedback
- **Multiple Tuning Support**
  - Standard tuning (E-A-D-G-B-E)
  - Alternate tunings managed via Cosmic CMS
  - Easy switching between tuning configurations
- **Professional Audio Quality**
  - High-fidelity tone generation using Web Audio API
  - Accurate pitch detection with autocorrelation algorithm
  - Low-latency audio processing
- **Responsive Design**
  - Works on desktop, tablet, and mobile devices
  - Touch-friendly interface
  - Dark theme optimized for various lighting conditions

## Clone this Project

## Clone this Project

Want to create your own version of this project with all the content and structure? Clone this Cosmic bucket and code repository to get started instantly:

[![Clone this Project](https://img.shields.io/badge/Clone%20this%20Project-29abe2?style=for-the-badge&logo=cosmic&logoColor=white)](https://app.cosmicjs.com/projects/new?clone_bucket=68deda44260d9dd939d1b0be&clone_repository=68dedb90260d9dd939d1b0cb)

## Prompts

This application was built using the following prompts to generate the content structure and code:

### Content Model Prompt

> No content model prompt provided - app built from existing content structure

### Code Generation Prompt

> Create a guitar tuning app that I can both hear the different notes to tune to or have the app hear my guitar and provide the necessary feedback to tune it.

The app has been tailored to work with your existing Cosmic content structure and includes all the features requested above.

## 🛠️ Technologies Used

- **Next.js 15** - React framework with App Router
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first styling
- **Web Audio API** - Audio generation and pitch detection
- **Cosmic CMS** - Content management for tuning configurations
- **Bun** - Fast JavaScript runtime and package manager

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ or Bun
- A Cosmic account and bucket
- Microphone access for pitch detection mode

### Installation

1. Clone the repository
2. Install dependencies:
```bash
bun install
```

3. Create a `.env.local` file with your Cosmic credentials:
```env
COSMIC_BUCKET_SLUG=your-bucket-slug
COSMIC_READ_KEY=your-read-key
COSMIC_WRITE_KEY=your-write-key
```

4. Run the development server:
```bash
bun dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser

## 📚 Cosmic SDK Examples

### Fetching Tuning Configurations

```typescript
import { cosmic } from '@/lib/cosmic'

// Get all available tunings
export async function getTunings() {
  try {
    const response = await cosmic.objects
      .find({ type: 'tunings' })
      .props(['id', 'title', 'slug', 'metadata'])
      .depth(1)
    
    return response.objects
  } catch (error) {
    if (error.status === 404) {
      return []
    }
    throw new Error('Failed to fetch tunings')
  }
}

// Get a specific tuning by slug
export async function getTuning(slug: string) {
  try {
    const response = await cosmic.objects
      .findOne({ type: 'tunings', slug })
      .props(['id', 'title', 'slug', 'metadata'])
      .depth(1)
    
    return response.object
  } catch (error) {
    if (error.status === 404) {
      return null
    }
    throw error
  }
}
```

## 🎸 Cosmic CMS Integration

This application uses Cosmic to manage guitar tuning configurations. Create a "Tunings" object type with the following metafields:

- **name** (text): Display name (e.g., "Standard Tuning", "Drop D")
- **strings** (repeater): Array of string configurations
  - **string_number** (number): String position (1-6)
  - **note** (text): Note name (e.g., "E", "A", "D")
  - **frequency** (number): Target frequency in Hz
  - **octave** (number): Octave number
- **description** (textarea): Optional description of the tuning
- **difficulty** (select): Beginner, Intermediate, Advanced
- **is_default** (switch): Mark as default tuning

## 🌐 Deployment Options

### Vercel (Recommended)

1. Push your code to GitHub
2. Import project in Vercel
3. Add environment variables in Vercel dashboard
4. Deploy

### Netlify

1. Push your code to GitHub
2. Create new site in Netlify
3. Configure build settings:
   - Build command: `bun run build`
   - Publish directory: `.next`
4. Add environment variables in Netlify dashboard
5. Deploy

### Environment Variables

Set these in your hosting platform:

- `COSMIC_BUCKET_SLUG` - Your Cosmic bucket slug
- `COSMIC_READ_KEY` - Your Cosmic read key
- `COSMIC_WRITE_KEY` - Your Cosmic write key (if needed for future features)

<!-- README_END -->