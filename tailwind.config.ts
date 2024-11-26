import type { Config } from 'tailwindcss'
const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx}',
    './pages/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
  ],

  theme: {
    extend: {
      colors: {
        primary: '#EC641D',      // Orange principal
        secondary: '#6B7280',    // Gris
        accent: '#F6BC9B',       // Orange clair
        background: '#FFFFFF',   // Blanc
        foreground: '#171717',   // Noir
        // Ajoutez d'autres couleurs si nécessaire
        // Wine Red Gradients
        bordeaux: {
          light: '#8B0000',
          deep: '#4B0082',
        },
        // Wine White Gradients
        'wine-white': {
          light: '#F5DEB3',
          deep: '#DEB887',
        },
        // Rose Gradients
        rose: {
          pale: '#FFB6C1',
          profond: '#C71585',
        },
        // Champagne/Sparkling Gradients
        champagne: {
          light: '#F0E68C',
          deep: '#DAA520',
        },
        // Liquoreux Gradients
        liquoreux: {
          light: '#D2691E',
          deep: '#8B4513',
        },
        // Wine-related color palette
        wine: {
          light: '#DEB887',
          deep: '#8B0000',
        },
      },
      backgroundImage: {
        'wine-droplet': "url(\"data:image/svg+xml,...\")",
      },
      fontSize: {
        xs: ['0.75rem', { lineHeight: '1rem' }],
        sm: ['0.875rem', { lineHeight: '1.25rem' }],
        base: ['1rem', { lineHeight: '1.5rem' }],
        lg: ['1.125rem', { lineHeight: '1.75rem' }],
        xl: ['1.25rem', { lineHeight: '1.75rem' }],
        '2xl': ['1.5rem', { lineHeight: '2rem' }],
        '3xl': ['1.875rem', { lineHeight: '2.25rem' }],
        '4xl': ['2.25rem', { lineHeight: '2.5rem' }],
        '5xl': ['3rem', { lineHeight: '1' }],
        '6xl': ['3.75rem', { lineHeight: '1' }],
        '7xl': ['4.5rem', { lineHeight: '1' }],
        '8xl': ['6rem', { lineHeight: '1' }],
      },
      animation: {
        'progress': 'progress 2s ease-in-out infinite'
      },
      keyframes: {
        progress: {
          '0%, 100%': { width: '0%' },
          '50%': { width: '100%' }
        }
      }
    }
  }
};

export default config;
