const { nextui } = require("@nextui-org/react");

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
    './node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}'
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#0066CC',
          light: '#0077ED',
          dark: '#0055AA',
        },
        secondary: {
          DEFAULT: '#86868B',
          light: '#98989D',
          dark: '#6E6E73',
        },
        dark: {
          bg: '#0A0A0C',
          surface: '#1D1D1F',
          border: '#2D2D2F',
        },
        apple: {
          gray: {
            DEFAULT: '#F5F5F7',
            secondary: '#86868B',
            tertiary: '#98989D',
          },
          blue: {
            DEFAULT: '#0066CC',
            light: '#0077ED',
            dark: '#0055AA',
          },
        },
      },
      fontFamily: {
        sans: [
          '-apple-system',
          'BlinkMacSystemFont',
          '"SF Pro Display"',
          '"SF Pro Text"',
          'system-ui',
          'Helvetica',
          'Arial',
          'sans-serif',
        ],
      },
      fontSize: {
        'display': ['2.5rem', { lineHeight: '1.1', letterSpacing: '-0.025em' }],
        'title': ['2rem', { lineHeight: '1.2', letterSpacing: '-0.025em' }],
        'subtitle': ['1.5rem', { lineHeight: '1.3', letterSpacing: '-0.025em' }],
        'body': ['1rem', { lineHeight: '1.5', letterSpacing: '-0.01em' }],
        'caption': ['0.875rem', { lineHeight: '1.4', letterSpacing: '-0.01em' }],
      },
      borderRadius: {
        '2xl': '1rem',
        '3xl': '1.5rem',
        '4xl': '2rem',
      },
      boxShadow: {
        'apple': '0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03)',
        'apple-hover': '0 10px 20px -5px rgba(0, 0, 0, 0.08), 0 4px 6px -2px rgba(0, 0, 0, 0.04)',
        'dark': '0 4px 6px -1px rgba(0, 0, 0, 0.2), 0 2px 4px -1px rgba(0, 0, 0, 0.1)',
        'dark-hover': '0 10px 20px -5px rgba(0, 0, 0, 0.3), 0 4px 6px -2px rgba(0, 0, 0, 0.2)',
      },
    },
  },
  plugins: [nextui()],
};