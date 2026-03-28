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
- [x] 1.1: Scaffold new Nuxt 4 project at `buggregator.dev/spa-v2/` (or migrate existing `spa/`)
- [x] 1.2: Install and configure TailwindCSS, `@nuxtjs/i18n` v9, `@vue-flow/core`, `@dagrejs/dagre`
- [x] 1.3: Set up CSS custom properties from design guide (`--bg-deepest`, `--accent-blue`, etc.) in `assets/css/design-tokens.css`
- [x] 1.4: Import and configure DM Sans + JetBrains Mono fonts (same as main app)
- [x] 1.5: Create base layout with dark/light theme support

**Notes:** Built within existing app-template/frontend project (not separate spa-v2). Landing uses `layout: 'landing'` and lives at `/landing` route. Fonts self-hosted as woff2 in `public/fonts/`. i18n locales in `i18n/locales/` (Nuxt 4 convention). Build passes cleanly.
**Status:** Completed
**Completed:** 2026-03-28

---

### Stage 2: GitHub Releases API + i18n Setup
- [x] 2.1: Create Nuxt server route `server/api/version.get.ts` — fetches `https://api.github.com/repos/buggregator/server/releases/latest`, returns `{ version, publishedAt, url }`, cached 1 hour via `useStorage`
- [x] 2.2: Create `useLatestRelease` composable in `composables/useLatestRelease.ts` — calls `/api/version`, exposes `version`, `isNew` (< 7 days), `releaseUrl`
- [x] 2.3: Set up `@nuxtjs/i18n` v9 in `nuxt.config.ts` — locales EN (default) + at least one more, `lazy: true`, `langDir: 'locales/'`
- [x] 2.4: Create `locales/en.json` with all string keys (hero, steps, features, nav, footer)
- [x] 2.5: Verify `/api/version` responds correctly and composable is reactive

**Notes:** i18n configured with `prefix_except_default` strategy, locales at `i18n/locales/`. LanguageSwitcher component created at `components/ui/LanguageSwitcher.vue`. Server route uses `$fetch` with optional GitHub token. Landing page updated to use `useLatestRelease()` and `t()` for all strings. Build passes.
**Status:** Completed
**Completed:** 2026-03-28

---

### Stage 3: Navbar + Hero Section
- [x] 3.1: Build `components/layout/AppNavbar.vue` — logo, nav links (Features, How it works, Docs, Trap), GitHub stars badge (live from API), language switcher, "Get Started" CTA
- [x] 3.2: Build `components/sections/HeroSection.vue` — dark bg (`--bg-deepest`), H1 (3 variants, variant 1 default), subheadline, version badge from `useLatestRelease`, framework logos strip
- [x] 3.3: Add `CopyCommand.vue` component — docker run command block with copy-to-clipboard, success feedback (icon → ✓ for 2s)
- [x] 3.4: Add animated entry for hero text (staggered fade-in, 200ms each element)
- [x] 3.5: Verify mobile layout: text top, framework logos below command, no overflow

**Notes:** Navbar: sticky with scroll-triggered bg blur + border. Mobile hamburger drawer. GitHub stars via `/api/stars` endpoint (1hr cache). HeroVisual: 4 animated event cards (CSS-only slideUpFade). CopyCommand uses navigator.clipboard with legacy fallback. SVG logos copied from buggregator.dev/spa. All strings via `t()`. Build clean.
**Status:** Completed
**Completed:** 2026-03-28

---

### Stage 4: Mock Showcase — Tabbed Event Preview
- [x] 4.1: Create `components/showcase/MockShowcase.vue` — tabbed container with tabs: Exceptions · Profiler · Emails · Logs · HTTP Requests
- [x] 4.2: Build `components/showcase/tabs/ExceptionsTab.vue` — renders custom Laravel exception mock (AuthenticationException with 3 frames: Middleware, Controller, Router)
- [x] 4.3: Build `components/showcase/tabs/ProfilerTab.vue` — renders `@vue-flow/core` graph with data from `profiler-callgraph.json`; read-only, fit-view, no toolbar controls; caption overlay
- [x] 4.4: Build `components/showcase/tabs/EmailsTab.vue` — static email preview card showing subject, from/to, HTML preview thumbnail
- [x] 4.5: Build `components/showcase/tabs/LogsTab.vue` and `HttpTab.vue` — 3 log events with level color badges + 1 HTTP dump card with headers and body
- [x] 4.6: Wire all tabs, verify tab switching is animated (150ms), verify graph renders without errors

**Notes:** Tabs use `defineAsyncComponent` for code splitting (ProfilerTab with VueFlow not in initial bundle). CallGraphNode and useCallGraph adapted from frontend/src/entities/profiler/. EventCard shared component provides consistent left-stripe + badge + time pattern. ExceptionFrame supports expand/collapse with code context. Mock data: sentry-exception.json (custom), profiler-callgraph.json (copied), smtp-welcome.json (copied), monolog-events.json (custom 3 entries), http-dump.json (custom). All tab labels via `t()`. Build clean.
**Status:** Completed
**Completed:** 2026-03-28

---

### Stage 5: Step-by-Step Install Section
- [x] 5.1: Build `components/sections/StepsSection.vue` — dark bg, numbered steps (1-4), two-column layout on desktop (text+code left, preview right)
- [x] 5.2: Step 1 "Run one command" — docker run snippet + CopyCommand component; right preview: TerminalMockup showing the running container
- [x] 5.3: Step 2 "Add one env variable" — tabbed framework switcher (Laravel · Symfony · Spiral · Any PHP) with `.env` snippets per framework; right preview: code editor mockup showing `.env` file
- [x] 5.4: Step 3 "Open your browser" — `http://127.0.0.1:8000` link; right preview: BrowserMockup showing Buggregator sidebar with event types
- [x] 5.5: Step 4 "See everything in one place" — event type badges + right preview: mini event cards
- [x] 5.6: Build `components/sections/InstallSection.vue` — Docker/Compose/Trap tabs, trust badges, doc links
- [x] 5.7: Verify mobile: steps stack vertically, preview panels hidden on mobile

**Notes:** StepsSection: 4 steps with vertical connector line, StepItem reusable component. FrameworkTabs with syntax-highlighted .env snippets. TerminalMockup, BrowserMockup, code editor mockup as CSS-only window mockups. InstallSection: 3 install method tabs with CopyCommand, trust badges with green checkmarks, links to docs. All strings via `t()`. Build clean.
**Status:** Completed
**Completed:** 2026-03-28

---

### Stage 6: Remaining Sections + Footer + QA
- [x] 6.1: Build `components/sections/ReplacesSection.vue` — "Replaces your local dev stack" comparison cards with strikethrough tool names + Buggregator replacement description
- [x] 6.2: Build `components/sections/FrameworksSection.vue` — framework logos grid (Laravel, Symfony, Spiral, WordPress, Yii3, Drupal) + "Also: JS/Python/Ruby" + integration guides link
- [x] 6.3: Build `components/sections/EcosystemSection.vue` — two cards: Trap (composer install) + JetBrains Plugin with doc/GitHub links
- [x] 6.4: Build `components/sections/AdvancedFeaturesSection.vue` — compact 3×2 grid: SSO, External DB, Kubernetes, Webhooks, Prometheus, Multi-project
- [x] 6.5: Build `components/sections/CommunitySection.vue` — GitHub stats (stars, forks from /api/stars), MIT badge, Star/Issues/Contributing/Discord buttons
- [x] 6.6: Build `components/layout/AppFooter.vue` — 4-column layout (logo/tagline, Product, Community, Resources), copyright, MIT
- [ ] 6.7: Full QA pass (deferred to visual review)

**Notes:** All sections assembled in correct page order per style guide: Hero → Replaces (light) → MockShowcase (light/dark) → Steps (dark) → Install (mid-dark) → Frameworks (light) → Ecosystem (white) → Advanced (light gray) → Community (dark) → Footer (mid-dark). Stars API now returns forks+openIssues too. All strings via `t()`. i18n keys added for frameworks, advanced features. Build clean.
**Status:** Completed
**Completed:** 2026-03-28

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
