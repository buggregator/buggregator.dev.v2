import PrimeUI from 'tailwindcss-primeui'

export default {
  content: [
    './app/components/**/*.vue',
    './app/layouts/**/*.vue',
    './app/pages/**/*.vue',
    './app/plugins/**/*.ts',
    './app/composables/**/*.ts',
    './app/app.vue',
  ],
  theme: {
    extend: {
      fontFamily: {
        display: ['Bricolage Grotesque', 'system-ui', 'sans-serif'],
        'mono-display': ['IBM Plex Mono', 'ui-monospace', 'monospace'],
        // Landing fonts
        sans: ['"DM Sans"', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['"JetBrains Mono"', '"Fira Code"', 'ui-monospace', 'Menlo', 'monospace'],
      },
      colors: {
        // Landing sections
        'section-dark': '#0c0e14',
        'section-mid': '#111318',
        'section-light': '#f8f9fa',

        // Landing surfaces
        'landing-deepest': '#0c0e14',
        'landing-base': '#111318',
        'landing-surface': '#1a1d24',
        'landing-elevated': '#22262e',

        // Landing borders
        'landing-border-subtle': '#1e2128',
        'landing-border': '#2a2f38',

        // Landing text (dark bg)
        'on-dark': {
          primary: '#ffffff',
          secondary: '#8b919a',
          muted: '#555b65',
        },
        // Landing text (light bg)
        'on-light': {
          primary: '#111827',
          secondary: '#374151',
          muted: '#6b7280',
        },

        // Accent
        accent: {
          DEFAULT: '#3b82f6',
          hover: '#2563eb',
          subtle: 'rgba(59,130,246,0.12)',
        },

        // Code
        code: {
          bg: '#0d1117',
          border: '#21262d',
          text: '#c9d1d9',
          keyword: '#ff7b72',
          string: '#a5d6ff',
          comment: '#6e7681',
          prompt: '#22c55e',
        },

        // Event types
        sentry: '#f43f5e',
        profiler: '#8b5cf6',
        smtp: '#f59e0b',
        'http-dump': '#22c55e',
        ray: '#06b6d4',
        monolog: '#6b7280',
        'var-dump': '#ef4444',
        sms: '#a855f7',
      },
      fontSize: {
        '2xs': ['0.7rem', { lineHeight: '1.1rem' }],
        hero: ['3.5rem', { lineHeight: '1.1', letterSpacing: '-0.02em' }],
        'hero-sm': ['2.25rem', { lineHeight: '1.1', letterSpacing: '-0.02em' }],
        section: ['2rem', { lineHeight: '1.2', letterSpacing: '-0.01em' }],
      },
      animation: {
        fadeInUp: 'fadeInUp 400ms ease-out both',
        'pulse-dot': 'pulse 2s cubic-bezier(0.4,0,0.6,1) infinite',
      },
      keyframes: {
        fadeInUp: {
          '0%': { opacity: '0', transform: 'translateY(16px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
      boxShadow: {
        card: '0 1px 3px rgba(0,0,0,0.08), 0 4px 12px rgba(0,0,0,0.05)',
        'card-hover': '0 4px 20px rgba(0,0,0,0.12), 0 8px 32px rgba(0,0,0,0.08)',
        showcase: '0 25px 50px rgba(0,0,0,0.15), 0 10px 20px rgba(0,0,0,0.10)',
        'code-block': '0 8px 24px rgba(0,0,0,0.40)',
      },
    },
  },
  plugins: [PrimeUI],
}
