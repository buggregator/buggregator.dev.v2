# Stage 1: Nuxt 4 Project Foundation & Design System

## Overview

Sets up the new Nuxt 4 landing project with all required dependencies, the shared design system from the main app, and base layout. Every subsequent stage builds on this foundation — nothing renders without it.

The existing landing is at `buggregator.dev/spa/` (Nuxt 3). The new project should be scaffolded fresh at `buggregator.dev/spa/` after a clean migration, or in parallel at `buggregator.dev/spa-v2/` during development.

## Files

CREATE:
- `buggregator.dev/spa-v2/nuxt.config.ts` — Nuxt 4 config with i18n, SSR mode, runtime config
- `buggregator.dev/spa-v2/package.json` — dependencies (nuxt@4, @nuxtjs/i18n, @vue-flow/core, @dagrejs/dagre, tailwindcss)
- `buggregator.dev/spa-v2/assets/css/design-tokens.css` — CSS custom properties from design guide
- `buggregator.dev/spa-v2/assets/css/main.css` — global styles, font imports
- `buggregator.dev/spa-v2/tailwind.config.ts` — Tailwind config with design system colors
- `buggregator.dev/spa-v2/layouts/default.vue` — base layout (slot only, no nav/footer yet)
- `buggregator.dev/spa-v2/pages/index.vue` — empty index page (placeholder)
- `buggregator.dev/spa-v2/app.vue` — Nuxt app entry

REFERENCE (do not modify):
- `frontend/docs/design-guide.md` — source of truth for all CSS variables and tokens

## Code References

- `frontend/docs/design-guide.md:section-3` — full color palette (`--bg-deepest: #0c0e14`, `--accent-blue: #3b82f6`, etc.)
- `frontend/docs/design-guide.md:section-4` — typography: DM Sans (UI) + JetBrains Mono (code/data)
- `frontend/docs/design-guide.md:section-6` — spacing scale and layout structure
- `buggregator.dev/spa/nuxt.config.ts` — current runtime config keys to replicate (`api_url`, `ws_url`, `buggregator_url`)
- `buggregator.dev/spa/tailwind.config.js` — existing Tailwind setup as reference

## Implementation Details

### Nuxt 4 key differences from Nuxt 3
- `app/` directory is used for components, composables, pages (moved from root)
- `defineNuxtConfig` is the same, but some modules have updated config syntax
- Server routes go in `server/api/` — same as Nuxt 3
- `@nuxtjs/i18n` v9 requires `vueI18n` option for configuration

### Package versions (pinned)
```json
{
  "nuxt": "^4.0.0",
  "@nuxtjs/i18n": "^9.0.0",
  "@vue-flow/core": "^1.41.0",
  "@dagrejs/dagre": "^1.1.4",
  "tailwindcss": "^3.4.0",
  "nuxt-gtag": "^2.0.0",
  "@pinia/nuxt": "^0.5.0"
}
```

### CSS Design Tokens (from design-guide.md)

```css
/* assets/css/design-tokens.css */
:root {
  /* Backgrounds */
  --bg-deepest:   #0c0e14;
  --bg-base:      #111318;
  --bg-surface:   #1a1d24;
  --bg-elevated:  #22262e;

  /* Borders */
  --border-subtle:  #1e2128;
  --border-default: #2a2f38;

  /* Text */
  --text-primary:   #e8eaed;
  --text-secondary: #8b919a;
  --text-muted:     #555b65;

  /* Accents */
  --accent-blue:        #3b82f6;
  --accent-blue-subtle: #1d4ed8;

  /* Event type colors */
  --color-sentry:    #f43f5e;
  --color-profiler:  #8b5cf6;
  --color-smtp:      #f59e0b;
  --color-http-dump: #22c55e;
  --color-ray:       #06b6d4;
  --color-monolog:   #6b7280;
  --color-var-dump:  #ef4444;
  --color-sms:       #a855f7;
}
```

### Tailwind config additions

Extend Tailwind to expose CSS variables as utility classes:

```ts
// tailwind.config.ts
export default {
  theme: {
    extend: {
      colors: {
        'bg-deepest': 'var(--bg-deepest)',
        'bg-surface': 'var(--bg-surface)',
        'accent-blue': 'var(--accent-blue)',
      },
      fontFamily: {
        sans: ['DM Sans', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'ui-monospace', 'monospace'],
      }
    }
  }
}
```

### nuxt.config.ts structure

```ts
export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  future: { compatibilityVersion: 4 },
  
  modules: [
    '@nuxtjs/i18n',
    '@pinia/nuxt',
    'nuxt-gtag',
  ],
  
  i18n: {
    locales: [
      { code: 'en', file: 'en.json', name: 'English' },
      // add more later
    ],
    defaultLocale: 'en',
    lazy: true,
    langDir: 'locales/',
    strategy: 'prefix_except_default',
  },

  css: ['~/assets/css/design-tokens.css', '~/assets/css/main.css'],
  
  runtimeConfig: {
    githubToken: process.env.GITHUB_TOKEN || '',
    public: {
      siteUrl: process.env.SITE_URL || 'https://buggregator.dev',
      gtag: process.env.GTAG_ID || '',
    }
  },

  postcss: {
    plugins: { tailwindcss: {}, autoprefixer: {} }
  }
})
```

## Definition of Done

- [ ] `pnpm dev` (or `npm run dev`) starts without errors
- [ ] `/` route renders an empty page (placeholder text visible)
- [ ] CSS variables are applied: `--bg-deepest` resolves to `#0c0e14` in browser DevTools
- [ ] DM Sans and JetBrains Mono fonts load (visible in Network tab)
- [ ] Tailwind classes like `bg-bg-deepest` and `font-mono` work
- [ ] No TypeScript errors in `nuxt.config.ts`
- [ ] `@vue-flow/core` is importable (test with `import { VueFlow } from '@vue-flow/core'` in a temp component)

## Dependencies

**Requires:** Nothing — this is the foundation stage
**Enables:** Stage 2 (i18n + GitHub API), all subsequent stages
