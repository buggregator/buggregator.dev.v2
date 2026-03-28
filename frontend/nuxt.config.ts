export default defineNuxtConfig({
  ssr: true,

  modules: [
    '@pinia/nuxt',
    '@nuxtjs/i18n',
    'nuxt-gtag',
  ],

  i18n: {
    locales: [
      { code: 'en', file: 'en.json', name: 'English' },
    ],
    defaultLocale: 'en',
    lazy: false,
    langDir: 'locales/',
    strategy: 'prefix_except_default',
  },

  gtag: {
    id: process.env.GTAG_ID || '',
    enabled: !!process.env.GTAG_ID,
  },

  runtimeConfig: {
    apiBaseUrl: process.env.API_BASE_URL || 'http://localhost:8080',
    githubToken: process.env.GITHUB_TOKEN || '',
    examplesUrl: process.env.EXAMPLES_URL || 'http://buggregator-examples:8000',

    public: {
      appUrl: process.env.PUBLIC_APP_URL || '',
      siteUrl: process.env.SITE_URL || 'https://buggregator.dev',
      discordUrl: process.env.DISCORD_URL || 'https://discord.gg/uxr5gw2p',
      buggregatorUrl: process.env.BUGGREGATOR_URL || 'http://buggregator.app.localhost',
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
            html.dark body { background-color: #09090b; color: #f8fafc; }
            #app-loader { position:fixed; inset:0; z-index:9999; display:flex; align-items:center; justify-content:center; background-color:#09090b; }
            #app-loader .loader-text { font-family:'Bricolage Grotesque',system-ui,sans-serif; font-size:1.25rem; font-weight:700; color:#f8fafc; opacity:0.4; animation:loader-pulse 1.5s ease-in-out infinite; }
            #app-loader .loader-dot { display:inline-block; width:6px; height:6px; border-radius:50%; background:#3b82f6; margin-left:8px; animation:loader-pulse 1.5s ease-in-out infinite 0.3s; }
            @keyframes loader-pulse { 0%,100%{opacity:0.3} 50%{opacity:1} }
            #app-loader.fade-out { opacity:0; transition:opacity 0.3s ease; pointer-events:none; }
          `.replace(/\n\s+/g, ' '),
        },
      ],
      link: [
        { rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg' },
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
