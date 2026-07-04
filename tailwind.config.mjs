/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,ts,tsx,md,mdx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        paper: {
          DEFAULT: '#FFFFFF',
          dim: '#E8EEF4',
        },
        ink: {
          50: '#F2F4F8',
          100: '#D8DFE8',
          400: '#8A94A6',
          700: '#4A5568',
          800: '#374151',
          900: '#1F2937',
          950: '#0F1218',
        },
        teal: {
          DEFAULT: '#2196F3',
          light: '#42A5F5',
          dark: '#1976D2',
        },
        mustard: {
          DEFAULT: '#FF9F0A',
          light: '#FFB94D',
        },
        neubg: '#E0E5EC',
        neulight: '#FFFFFF',
        neudark: '#A3B1C6',
      },
      fontFamily: {
        display: ['Fraunces', 'ui-serif', 'Georgia', 'serif'],
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'SFMono-Regular', 'monospace'],
      },
      boxShadow: {
        card: '0 1px 2px rgba(0,0,0,0.04), 0 8px 24px -8px rgba(0,0,0,0.10)',
        sheet: '0 20px 60px -20px rgba(0,0,0,0.25)',
        ios: '0 1px 3px rgba(0,0,0,0.05), 0 6px 16px -4px rgba(0,0,0,0.08)',
        neu: '6px 6px 12px #b8bec7, -6px -6px 12px #ffffff',
        'neu-sm': '3px 3px 6px #b8bec7, -3px -3px 6px #ffffff',
        'neu-lg': '10px 10px 20px #b8bec7, -10px -10px 20px #ffffff',
        'neu-inset': 'inset 3px 3px 6px #b8bec7, inset -3px -3px 6px #ffffff',
        'neu-inset-sm': 'inset 2px 2px 4px #b8bec7, inset -2px -2px 4px #ffffff',
        'neu-pressed': 'inset 4px 4px 8px #b8bec7, inset -4px -4px 8px #ffffff',
      },
      backgroundImage: {
        grain: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='120' height='120'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.035'/%3E%3C/svg%3E\")",
        neuGradient: 'linear-gradient(145deg, #f0f5fc, #d1d9e6)',
      },
      borderRadius: {
        'neu': '20px',
        'neu-xl': '28px',
      },
    },
  },
  plugins: [],
};
