---
name: frontend
description: Build and modify the App Template frontend (Nuxt 4 SSR with PrimeVue, Tailwind, Pinia). Use when the user asks to create pages, components, stores, composables, or modify the frontend UI. Covers project-specific patterns, conventions, and anti-patterns.
---

# App Template Frontend Development

This skill covers building and modifying the App Template frontend — a Nuxt 4 SSR app at `frontend/`.

## Tech Stack

- **Nuxt ^4.0.0** — SSR enabled
- **Vue ^3.5.0** — Composition API (`<script setup>`)
- **PrimeVue ^4.0.0** — UI components (explicit imports, no Nuxt module)
- **Tailwind CSS 3** — utility classes via PostCSS (no `@nuxtjs/tailwindcss`)
- **Pinia** — state management (`@pinia/nuxt` module)

## Critical Rules

### 1. PrimeVue: Always Import Explicitly

There is NO `@primevue/nuxt-module`. Components must be imported per-file:

```vue
<script setup>
  import DataTable from 'primevue/datatable'
  import Column from 'primevue/column'
  import Button from 'primevue/button'
  import Tag from 'primevue/tag'
</script>
```

Plugin setup is in `app/plugins/primevue.ts` (Aura theme, dark mode, ToastService).

### 2. Nuxt 4 Routing: No file + directory with same name

In Nuxt 4, having both `pages/foo.vue` and `pages/foo/` directory makes `foo.vue` a nested layout wrapper. This breaks direct navigation to `/foo`.

```
# WRONG: foo.vue becomes a layout wrapper, /foo may not render
pages/foo.vue
pages/foo/bar.vue

# CORRECT: use index.vue inside the directory
pages/foo/index.vue    → /foo
pages/foo/bar.vue      → /foo/bar
```

### 3. SSR Hydration: Use `<ClientOnly>` for dynamic UI

Wrap dynamic content in `<ClientOnly>` to avoid hydration mismatches:

```vue
<ClientOnly>
  <DynamicComponent />
  <template #fallback>
    <div class="h-40 bg-surface-800 animate-pulse rounded-xl" />
  </template>
</ClientOnly>
```

### 4. API Calls: Use native `fetch()` in stores

```typescript
// In Pinia stores and composables — use native fetch()
const res = await fetch('/api/v1/app/some-endpoint')
const data = await res.json()
```

### 5. Tailwind: PostCSS Config Only

Tailwind is configured via PostCSS in `nuxt.config.ts`:

```typescript
postcss: {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
}
```

## Project Layout

```
frontend/app/
├── pages/              # Routes (dashboard, etc.)
├── components/         # Vue components organized by domain
├── stores/             # Pinia stores
│   └── appConfig.ts   # App name and config
├── composables/        # Hooks
│   ├── useApi.ts      # HTTP client (fetch wrapper)
│   ├── useAppConfig.ts  # App name and config
│   └── useRealtimeUpdates.ts # WebSocket composable
├── plugins/            # primevue.ts, appConfig.ts
├── layouts/            # default.vue (header + nav), public.vue
├── types/              # api.ts (TypeScript interfaces)
└── assets/css/         # styles.css (Tailwind layers + custom classes)
```

## Frontend Proxy

The Nuxt server proxy (`frontend/server/middleware/proxy.ts`) forwards API requests to the backend.
When adding a new backend router, add its prefix to `PROXY_PATHS`:

```typescript
const PROXY_PATHS = ['/api/', '/mcp/']
```

## Creating New Pages

1. Add `frontend/app/pages/my-page.vue`
2. Route is auto-registered as `/my-page`
3. Create store in `stores/` if page needs state
4. Import PrimeVue components explicitly

## Creating New Components

Components in `frontend/app/components/` auto-import by directory/filename:

- `PageHeader.vue` → `<PageHeader>`
- `example/ExampleCard.vue` → `<ExampleCard>`

Organize by domain subdirectory.

## Dev Server

```bash
make up         # Start dev stack with hot reload (via Docker + Traefik)
make fe-logs    # Tail frontend logs
make fe-run     # Run frontend locally (outside Docker)
```

Dev URL: `http://app.localhost` (via Traefik proxy)
