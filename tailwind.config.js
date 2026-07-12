/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        pixel: ['GeistPixelSquare', 'monospace'],
        'pixel-grid': ['GeistPixelGrid', 'monospace'],
        'pixel-circle': ['GeistPixelCircle', 'monospace'],
        'pixel-tri': ['GeistPixelTriangle', 'monospace'],
        'pixel-line': ['GeistPixelLine', 'monospace'],
        mono: ['Space Mono', 'ui-monospace', 'monospace'],
        inter: ['Inter', 'sans-serif'],
      },
      colors: {
        surface: {
          DEFAULT: '#0B0D0E',
          raised: '#111315',
          overlay: '#1A1C1E',
        },
      },
    },
  },
  plugins: [],
}
