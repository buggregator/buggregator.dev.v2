export default defineNuxtConfig({
  ssr: true,

  modules: [
    '@pinia/nuxt',
    '@nuxtjs/i18n',
  ],

  i18n: {
    locales: [
      { code: 'en', file: 'en.json', name: 'English' },
      { code: 'ru', file: 'ru.json', name: 'Русский' },
      { code: 'es', file: 'es.json', name: 'Español' },
    ],
    defaultLocale: 'en',
    lazy: false,
    langDir: 'locales/',
    strategy: 'prefix_except_default',
  },

  runtimeConfig: {
    apiBaseUrl: process.env.API_BASE_URL || 'http://localhost:8080',
    examplesUrl: process.env.EXAMPLES_URL || 'http://buggregator-examples:8000',

    public: {
      gaMeasurementId: process.env.PUBLIC_GA_MEASUREMENT_ID || '',
      appUrl: process.env.PUBLIC_APP_URL || '',
      siteUrl: process.env.SITE_URL || 'https://buggregator.dev',
      discordUrl: process.env.DISCORD_URL || 'https://discord.gg/uxr5gw2p',
      buggregatorUrl: process.env.BUGGREGATOR_URL || 'http://buggregator.app.localhost',
      patreonUrl: process.env.PATREON_URL || 'https://www.patreon.com/butschster',
      sponsorEmail: process.env.SPONSOR_EMAIL || 'butschster@gmail.com',
      heroVideoUrl: process.env.HERO_VIDEO_URL || '/video.webm',
      heroPosterUrl: process.env.HERO_POSTER_URL || '/img.png',
    },
  },

  app: {
    baseURL: '/',
    head: {
      title: 'App Template',
      htmlAttrs: {
        lang: 'en',
        class: 'dark',
      },
      bodyAttrs: {
        class: 'theme-dark',
      },
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'description', content: 'App Template — MCP server, Temporal workflows, and WebSocket support.' },
      ],
      style: [
        {
          innerHTML: `
            html.dark body { background-color: #0c0e14; color: #f8fafc; }
            #app-loader { position:fixed; inset:0; z-index:9999; display:flex; flex-direction:column; align-items:center; justify-content:center; background-color:#0c0e14; }
            #app-loader svg { width:200px; height:auto; opacity:0.4; animation:loader-pulse 2s ease-in-out infinite; }
            #app-loader .loader-dot { display:inline-block; width:6px; height:6px; border-radius:50%; background:#3b82f6; margin-top:16px; animation:loader-pulse 2s ease-in-out infinite 0.3s; }
            @keyframes loader-pulse { 0%,100%{opacity:0.2} 50%{opacity:0.6} }
            #app-loader.fade-out { opacity:0; transition:opacity 0.3s ease; pointer-events:none; }
          `.replace(/\n\s+/g, ' '),
        },
      ],
      link: [
        { rel: 'icon', type: 'image/png', sizes: '32x32', href: '/favicon/favicon-32x32.png' },
        { rel: 'icon', type: 'image/png', sizes: '16x16', href: '/favicon/favicon-16x16.png' },
        { rel: 'apple-touch-icon', sizes: '180x180', href: '/favicon/apple-touch-icon.png' },
        { rel: 'manifest', href: '/favicon/site.webmanifest' },
        { rel: 'mask-icon', href: '/favicon/safari-pinned-tab.svg', color: '#3b82f6' },
        { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
        { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' },
        { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,400;12..96,500;12..96,600;12..96,700;12..96,800&family=IBM+Plex+Mono:wght@400;500;600;700&display=swap' },
        { rel: 'stylesheet', href: 'https://cdn.jsdelivr.net/npm/primeicons@7/primeicons.min.css' },
      ]
    },
  },

  css: [
    '~/assets/css/styles.css',
    '~/assets/css/design-tokens.css',
    '~/assets/css/landing.css',
    '~/assets/css/symfony-var-dump.css',
  ],

  postcss: {
    plugins: {
      tailwindcss: {},
      autoprefixer: {},
    },
  },

  nitro: {
    preset: 'node-server',
    experimental: {
      websocket: true,
    },
  },

  compatibilityDate: '2025-06-01',
})
