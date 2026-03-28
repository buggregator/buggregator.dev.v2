# Feature: Landing Page v2 — Multilingual, Versioned, Mock-Showcase

## Overview

Complete redesign of the buggregator.dev landing page on Nuxt 4. The new landing must:

- Explain Buggregator to first-time visitors (social/Reddit traffic) within 5 seconds
- Showcase real UI components as interactive mocks (no iframe demo)
- Guide the visitor through a step-by-step install flow
- Track and display the latest GitHub release version
- Support multiple languages via `@nuxtjs/i18n` v9
- Use the same design system (colors, fonts, CSS vars) as the main app

**Tech stack:** Nuxt 4 · `@vue-flow/core` · `@nuxtjs/i18n` v9 · TailwindCSS · TypeScript

**Primary conversion goal:** Copy the `docker run` command or click "Get Started → docs"

**Mock data source:** `frontend/src/entities/*/mocks/` — real production mock JSON already exists

## Stage Dependencies

```
Stage 1 (Foundation)
  → Stage 2 (i18n + Version API)
    → Stage 3 (Hero + Navbar)
      → Stage 4 (Mock Showcase — Tabbed)
        → Stage 5 (Step-by-Step Section)
          → Stage 6 (Remaining Sections + Footer)
```

---

## Development Progress

### Stage 1: Nuxt 4 Project Foundation & Design System
- [ ] 1.1: Scaffold new Nuxt 4 project at `buggregator.dev/spa-v2/` (or migrate existing `spa/`)
- [ ] 1.2: Install and configure TailwindCSS, `@nuxtjs/i18n` v9, `@vue-flow/core`, `@dagrejs/dagre`
- [ ] 1.3: Set up CSS custom properties from design guide (`--bg-deepest`, `--accent-blue`, etc.) in `assets/css/design-tokens.css`
- [ ] 1.4: Import and configure DM Sans + JetBrains Mono fonts (same as main app)
- [ ] 1.5: Create base layout with dark/light theme support

**Notes:** _____________
**Status:** Not Started
**Completed:** ___________

---

### Stage 2: GitHub Releases API + i18n Setup
- [ ] 2.1: Create Nuxt server route `server/api/version.get.ts` — fetches `https://api.github.com/repos/buggregator/server/releases/latest`, returns `{ version, publishedAt, url }`, cached 1 hour via `useStorage`
- [ ] 2.2: Create `useLatestRelease` composable in `composables/useLatestRelease.ts` — calls `/api/version`, exposes `version`, `isNew` (< 7 days), `releaseUrl`
- [ ] 2.3: Set up `@nuxtjs/i18n` v9 in `nuxt.config.ts` — locales EN (default) + at least one more, `lazy: true`, `langDir: 'locales/'`
- [ ] 2.4: Create `locales/en.json` with all string keys (hero, steps, features, nav, footer)
- [ ] 2.5: Verify `/api/version` responds correctly and composable is reactive

**Notes:** _____________
**Status:** Not Started
**Completed:** ___________

---

### Stage 3: Navbar + Hero Section
- [ ] 3.1: Build `components/layout/AppNavbar.vue` — logo, nav links (Features, How it works, Docs, Trap), GitHub stars badge (live from API), language switcher, "Get Started" CTA
- [ ] 3.2: Build `components/sections/HeroSection.vue` — dark bg (`--bg-deepest`), H1 (3 variants, variant 1 default), subheadline, version badge from `useLatestRelease`, framework logos strip
- [ ] 3.3: Add `CopyCommand.vue` component — docker run command block with copy-to-clipboard, success feedback (icon → ✓ for 2s)
- [ ] 3.4: Add animated entry for hero text (staggered fade-in, 200ms each element)
- [ ] 3.5: Verify mobile layout: text top, framework logos below command, no overflow

**Notes:** _____________
**Status:** Not Started
**Completed:** ___________

---

### Stage 4: Mock Showcase — Tabbed Event Preview
- [ ] 4.1: Create `components/showcase/MockShowcase.vue` — tabbed container with tabs: Exceptions · Profiler · Emails · Logs · HTTP Requests
- [ ] 4.2: Build `components/showcase/tabs/MockSentryTab.vue` — renders `SentryExceptionMock` with custom Laravel exception mock (AuthenticationException with 3 frames: Middleware, Controller, Router)
- [ ] 4.3: Build `components/showcase/tabs/MockProfilerTab.vue` — renders `@vue-flow/core` graph with data from `profiler-callgraph.json`; read-only, fit-view, hottest path pre-highlighted, no toolbar controls; caption overlay: "XHProf Call Graph · Laravel app · 891ms wall time"
- [ ] 4.4: Build `components/showcase/tabs/MockSmtpTab.vue` — static email preview card showing subject, from/to, HTML preview thumbnail; data from `smtp-welcome.json`
- [ ] 4.5: Build `components/showcase/tabs/MockLogsTab.vue` and `MockHttpTab.vue` — simplified card list with 2-3 sample events each using monolog and http-dump mock data
- [ ] 4.6: Wire all tabs, verify tab switching is animated (150ms), verify graph renders without errors

**Notes:** _____________
**Status:** Not Started
**Completed:** ___________

---

### Stage 5: Step-by-Step Install Section
- [ ] 5.1: Build `components/sections/StepByStepSection.vue` — dark bg, numbered steps (1-4), two-column layout on desktop (text+code left, preview right)
- [ ] 5.2: Step 1 "Run one command" — docker run snippet + CopyCommand component; right preview: terminal window mockup showing the running container
- [ ] 5.3: Step 2 "Add one env variable" — tabbed framework switcher (Laravel · Symfony · Spiral · Any PHP) with `.env` snippets per framework; right preview: code editor mockup showing `.env` file
- [ ] 5.4: Step 3 "Open your browser" — `http://127.0.0.1:8000` link; right preview: browser window mockup showing Buggregator sidebar with event types
- [ ] 5.5: Step 4 "See everything in one place" — summary of what the user gets; right preview: MockShowcase mini thumbnail (static screenshot or simplified card grid)
- [ ] 5.6: Verify mobile: steps stack vertically, preview images hidden or shown below text

**Notes:** _____________
**Status:** Not Started
**Completed:** ___________

---

### Stage 6: Remaining Sections + Footer + QA
- [ ] 6.1: Build `components/sections/ReplacesSection.vue` — "Replaces your local dev stack" comparison table (Sentry local / Mailhog / Ray / Blackfire / Log viewers / RequestBin → Buggregator)
- [ ] 6.2: Build `components/sections/FrameworksSection.vue` — framework logos grid (Laravel, Symfony, Spiral, WordPress, Yii3, Drupal) + "See integration guides →" link
- [ ] 6.3: Build `components/sections/EcosystemSection.vue` — two cards: Trap (composer install) + JetBrains Plugin; each with GitHub stars, install command, doc link
- [ ] 6.4: Build `components/sections/AdvancedFeaturesSection.vue` — compact 3×2 grid: SSO, External DB, Kubernetes, Webhooks, Prometheus, Multi-project
- [ ] 6.5: Build `components/sections/CommunitySection.vue` — GitHub stats (stars, forks, contributors), MIT badge, Discord link, optional team cards
- [ ] 6.6: Build `components/layout/AppFooter.vue` — 4-column links, copyright, MIT license
- [ ] 6.7: Full QA pass: mobile (375px, 768px), desktop (1280px, 1440px); all i18n strings present; version badge loading; graph renders; copy buttons work; all CTAs link correctly

**Notes:** _____________
**Status:** Not Started
**Completed:** ___________

---

## Codebase References

### Mock Data (use directly in landing)
- `frontend/src/entities/profiler/mocks/profiler-callgraph.json` — 80+ node Laravel call graph with colors and percents
- `frontend/src/entities/profiler/mocks/profiler-edges.json` — Spiral app edges (alternative graph data)
- `frontend/src/entities/sentry/mocks/sentry-laravel.json` — Full Laravel Sentry event with breadcrumbs
- `frontend/src/entities/smtp/mocks/smtp-welcome.json` — HTML email preview
- `frontend/src/entities/monolog/mocks/` — log event mocks

### Components to study and adapt
- `frontend/src/entities/profiler/ui/render-graph/render-graph.vue` — VueFlow wrapper; adapt for read-only landing use
- `frontend/src/entities/profiler/ui/render-graph/call-graph-node.vue` — custom VueFlow node; reuse as-is
- `frontend/src/entities/profiler/lib/vue-flow/map-to-vue-flow.ts` — maps JSON → VueFlow nodes/edges; reuse as-is
- `frontend/src/entities/sentry/ui/sentry-exception/sentry-exception.vue` — exception renderer; adapt for landing
- `frontend/src/shared/ui/preview-card/preview-card-header.vue` — event type badge + color system; copy pattern
- `buggregator.dev/spa/components/v1/CopyCommand.vue` — existing copy command component to reuse/port

### Design System
- `frontend/docs/design-guide.md` — full CSS variables, color palette, typography, spacing
- `frontend/docs/expert-panel-review.md` — UX/UI decisions and rationale

### Existing Landing (reference, not copy)
- `buggregator.dev/spa/pages/index.vue` — current block structure
- `buggregator.dev/spa/components/v1/Hero.vue` — current hero (to be replaced)
- `buggregator.dev/spa/nuxt.config.ts` — current Nuxt 3 config (reference for runtime config keys)

---

## Usage Instructions

⚠️ Keep this checklist updated:
- Mark completed substeps immediately with `[x]`
- Add notes about deviations or challenges after each stage
- Document decisions that differ from this plan
- Update status when starting (`In Progress`) and completing (`Completed`) stages

**Stage status values:** `Not Started` / `In Progress` / `Completed`
