# Stage 2: GitHub Releases API + i18n Setup

## Overview

Two parallel concerns that must be in place before any content sections are built:

1. **Version tracking** — a cached Nuxt server route that fetches the latest Buggregator release from GitHub. Used in Hero (version badge) and potentially in navbar.
2. **i18n infrastructure** — `@nuxtjs/i18n` v9 configured with locale files and a `useI18n`-aware pattern for all string usage.

Both are infrastructure — no visible UI yet, but every subsequent section depends on them.

## Files

CREATE:
- `buggregator.dev/spa-v2/server/api/version.get.ts` — GitHub Releases API endpoint with 1-hour cache
- `buggregator.dev/spa-v2/composables/useLatestRelease.ts` — composable wrapping `/api/version`
- `buggregator.dev/spa-v2/locales/en.json` — full English string map (all keys for all sections)
- `buggregator.dev/spa-v2/components/ui/LanguageSwitcher.vue` — locale picker (dropdown or flag buttons)

MODIFY:
- `buggregator.dev/spa-v2/nuxt.config.ts` — ensure i18n module config is wired (from Stage 1 skeleton)

## Code References

- `buggregator.dev/spa/app/api/methods.ts` — pattern for API calls in the existing landing (reference)
- `frontend/src/shared/lib/use-api-transport/` — fetch pattern from main app (reference only)

## Implementation Details

### Server Route: `server/api/version.get.ts`

```ts
import { defineEventHandler, useStorage } from 'h3'

const CACHE_KEY = 'version:latest'
const CACHE_TTL = 60 * 60 // 1 hour in seconds

export default defineEventHandler(async (event) => {
  const storage = useStorage('cache')
  const cached = await storage.getItem(CACHE_KEY)
  if (cached) return cached

  const config = useRuntimeConfig(event)
  const headers: HeadersInit = {
    'Accept': 'application/vnd.github+json',
    'X-GitHub-Api-Version': '2022-11-28',
  }
  if (config.githubToken) {
    headers['Authorization'] = `Bearer ${config.githubToken}`
  }

  const res = await fetch(
    'https://api.github.com/repos/buggregator/server/releases/latest',
    { headers }
  )
  
  if (!res.ok) {
    return { version: null, publishedAt: null, url: null }
  }

  const data = await res.json()
  const result = {
    version: data.tag_name?.replace(/^v/, '') ?? null, // "1.4.0"
    publishedAt: data.published_at ?? null,             // ISO string
    url: data.html_url ?? null,
  }

  await storage.setItem(CACHE_KEY, result, { ttl: CACHE_TTL })
  return result
})
```

**Notes:**
- `useStorage('cache')` uses Nuxt's built-in in-memory storage (no Redis needed)
- `githubToken` is optional but avoids rate limiting in CI/CD
- Returns `{ version: null }` on error — UI must handle gracefully (show nothing if null)

### Composable: `composables/useLatestRelease.ts`

```ts
export type ReleaseInfo = {
  version: string | null
  publishedAt: string | null
  url: string | null
  isNew: boolean  // true if published within last 7 days
}

export const useLatestRelease = () => {
  const { data, status } = useFetch<ReleaseInfo>('/api/version', {
    transform: (raw) => ({
      ...raw,
      isNew: raw.publishedAt
        ? (Date.now() - new Date(raw.publishedAt).getTime()) < 7 * 24 * 60 * 60 * 1000
        : false,
    }),
    lazy: true,
  })

  return {
    release: data,
    isLoading: computed(() => status.value === 'pending'),
  }
}
```

### i18n Locale Structure: `locales/en.json`

All string keys needed across the landing. Every section must use `t('key')` — no hardcoded strings in templates.

```json
{
  "nav": {
    "features": "Features",
    "howItWorks": "How it works",
    "docs": "Documentation",
    "trap": "Trap",
    "getStarted": "Get Started"
  },
  "hero": {
    "badge": {
      "version": "v{version} · just released",
      "stars": "{count} GitHub Stars",
      "free": "Free & Open Source"
    },
    "headline1": "One docker run. All your debug data in one place.",
    "headline2": "Stop switching tabs. Debug your PHP app from one place.",
    "subheadline": "Buggregator captures exceptions, logs, dumps, emails, profiling and HTTP requests in a real-time UI — using the Sentry SDK, VarDumper, Monolog and Ray you already have. Free, open-source, no registration.",
    "cta": {
      "copy": "Copy command",
      "copied": "Copied!",
      "docs": "Read the docs →",
      "trap": "Or use Trap (no Docker required) →"
    },
    "frameworks": "Works with:"
  },
  "replaces": {
    "title": "Replaces your local dev stack — for free",
    "footer": "All of this. One command. Zero cost.",
    "tools": {
      "sentry": "Exceptions & stack traces",
      "mailhog": "Email capture",
      "ray": "Variable dumps",
      "blackfire": "Performance profiling",
      "logviewers": "Application logs",
      "requestbin": "HTTP request inspection"
    }
  },
  "howItWorks": {
    "title": "How it works",
    "subtitle": "Three steps. That's it.",
    "steps": {
      "run": {
        "title": "Run one command",
        "description": "Start Buggregator with a single docker run. No installation, no registration, no configuration files."
      },
      "connect": {
        "title": "Add one env variable",
        "description": "Change one line in your .env file. Your existing Sentry SDK, VarDumper, Monolog, or Ray — they all just work."
      },
      "open": {
        "title": "Open your browser",
        "description": "Open http://127.0.0.1:8000 and see all your debug events in real time — exceptions, logs, dumps, emails, profiling — all in one place."
      }
    }
  },
  "showcase": {
    "title": "Everything in one dashboard",
    "subtitle": "8 debugging tools. One interface.",
    "tabs": {
      "exceptions": "Exceptions",
      "profiler": "Profiler",
      "emails": "Emails",
      "logs": "Logs",
      "http": "HTTP"
    },
    "profilerCaption": "XHProf Call Graph · Laravel app · 891ms wall time"
  },
  "install": {
    "title": "Get started in 60 seconds",
    "tabs": {
      "docker": "Docker",
      "compose": "Docker Compose",
      "trap": "Without Docker"
    },
    "trust": {
      "free": "Free forever",
      "noReg": "No registration",
      "noCard": "No credit card",
      "oss": "Open source (MIT)"
    },
    "links": {
      "fullGuide": "Full installation guide →",
      "config": "Configuration options →"
    }
  },
  "ecosystem": {
    "title": "The Buggregator ecosystem",
    "trap": {
      "title": "No Docker? No problem.",
      "description": "Trap is a lightweight PHP CLI alternative. Install it as a composer package — no containers, no configuration.",
      "github": "View on GitHub",
      "docs": "Read docs"
    },
    "jetbrains": {
      "title": "Never leave your IDE",
      "description": "The Buggregator plugin for PhpStorm brings dumps, logs, and debug data directly into your editor.",
      "install": "Install from Marketplace",
      "docs": "Read docs"
    }
  },
  "community": {
    "title": "Open source. Built with the community.",
    "description": "Buggregator is free forever. No paid plans, no feature gates. If it helps you, consider starring the repo.",
    "star": "Star on GitHub",
    "issues": "Browse issues",
    "contribute": "Contribution guide",
    "discord": "Join our Discord",
    "stats": {
      "stars": "GitHub Stars",
      "forks": "Forks",
      "contributors": "Contributors",
      "license": "MIT License"
    }
  },
  "footer": {
    "tagline": "Made with ❤️ for the PHP community",
    "product": "Product",
    "community": "Community",
    "resources": "Resources",
    "links": {
      "docs": "Documentation",
      "features": "Features",
      "trap": "Trap",
      "plugin": "PhpStorm Plugin",
      "gettingStarted": "Getting Started",
      "github": "GitHub",
      "discord": "Discord",
      "contributing": "Contributing",
      "bugs": "Bug Reports",
      "changelog": "Changelog",
      "releases": "Releases"
    }
  }
}
```

### LanguageSwitcher component

Simple dropdown or button group that calls `setLocale(code)` from `useI18n()`. Show current locale name or flag emoji. Keep it minimal — max 2-3 locales at launch.

## Definition of Done

- [ ] `GET /api/version` returns `{ version: "x.y.z", publishedAt: "...", url: "..." }` in browser
- [ ] Response is cached — second request does not hit GitHub API (verify in server logs)
- [ ] `useLatestRelease()` composable works in a test page: `{{ release?.version }}` renders
- [ ] `isNew` is `true` for a mock `publishedAt` of yesterday
- [ ] `useI18n().t('hero.headline1')` returns the correct English string
- [ ] `LanguageSwitcher` renders and `setLocale` switches the current locale
- [ ] All keys in `en.json` are valid JSON (no syntax errors)
- [ ] No TypeScript errors

## Dependencies

**Requires:** Stage 1 (Nuxt 4 project exists)
**Enables:** Stage 3 (Hero uses version badge and i18n strings), all subsequent stages use `t()`
