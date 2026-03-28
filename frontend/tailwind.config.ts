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
      },
    },
  },
  plugins: [PrimeUI],
}
