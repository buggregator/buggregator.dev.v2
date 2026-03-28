export default defineNuxtConfig({
  ssr: true,

  modules: ['@pinia/nuxt'],

  runtimeConfig: {
    apiBaseUrl: process.env.API_BASE_URL || 'http://localhost:8080',

    public: {
      appUrl: process.env.PUBLIC_APP_URL || '',
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

  css: ['~/assets/css/styles.css'],

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
