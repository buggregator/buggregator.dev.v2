# Stage 6: Remaining Sections, Footer & Full QA

## Overview

Final stage. Completes the page with all secondary sections (Replaces, Frameworks, Ecosystem, Advanced Features, Community) and the footer. Closes out with a full QA pass across breakpoints, languages, and key interactions.

These sections have lower conversion weight than Hero/Showcase/Steps, but they close objections and build trust for visitors who scroll all the way through.

## Files

CREATE:
- `buggregator.dev/spa-v2/components/sections/ReplacesSection.vue`
- `buggregator.dev/spa-v2/components/sections/FrameworksSection.vue`
- `buggregator.dev/spa-v2/components/sections/EcosystemSection.vue`
- `buggregator.dev/spa-v2/components/sections/AdvancedFeaturesSection.vue`
- `buggregator.dev/spa-v2/components/sections/CommunitySection.vue`
- `buggregator.dev/spa-v2/components/layout/AppFooter.vue`
- `buggregator.dev/spa-v2/server/api/stars.get.ts` — GitHub stars API (if not already in Stage 3)

MODIFY:
- `buggregator.dev/spa-v2/pages/index.vue` — assemble all sections in final order
- `buggregator.dev/spa-v2/layouts/default.vue` — add `<AppFooter>`

## Code References

- `buggregator.dev/spa/components/v1/Frameworks.vue` — existing framework logos (reuse pattern)
- `buggregator.dev/spa/components/v1/Contribution.vue` — existing contribution section (reference)
- `buggregator.dev/spa/components/v1/Team.vue` — team section (reference, optional)
- `buggregator.dev/spa/components/v1/Features/SSO.vue` — SSO feature card pattern
- `frontend/docs/design-guide.md` — color palette for consistent section backgrounds

## Implementation Details

### Final Page Order

```
[AppNavbar]                     — sticky, dark
[HeroSection]                   — dark (--bg-deepest)
[ReplacesSection]               — light (#f8f9fa or white)
[MockShowcase]                  — white/light with dark tab panel
[StepsSection]                  — dark (--bg-deepest)
[InstallSection]                — dark (--bg-base: #111318)
[FrameworksSection]             — light
[EcosystemSection]              — white
[AdvancedFeaturesSection]       — light gray
[CommunitySection]              — dark (--bg-deepest)
[AppFooter]                     — dark (--bg-base)
```

### ReplacesSection

Light background. Simple comparison showing what Buggregator replaces:

```vue
<template>
  <section class="replaces bg-gray-50 py-20">
    <h2>{{ t('replaces.title') }}</h2>
    
    <div class="replaces__grid">
      <div v-for="item in tools" :key="item.key" class="replaces__item">
        <span class="replaces__tool">{{ item.tool }}</span>
        <span class="replaces__arrow">→</span>
        <span class="replaces__desc">{{ t(`replaces.tools.${item.key}`) }}</span>
      </div>
    </div>
    
    <p class="replaces__footer">{{ t('replaces.footer') }}</p>
  </section>
</template>
```

Tools list:
```ts
const tools = [
  { key: 'sentry',      tool: '🔴 Sentry (local)',        },
  { key: 'mailhog',     tool: '📧 Mailhog / Mailtrap',    },
  { key: 'ray',         tool: '🔵 Ray',                   },
  { key: 'blackfire',   tool: '📊 Blackfire / XHProf UI', },
  { key: 'logviewers',  tool: '📜 Log viewers',           },
  { key: 'requestbin',  tool: '🌐 RequestBin',            },
]
```

### FrameworksSection

Framework logos with grayscale → color hover. Subtitle: *«No vendor lock-in. Your existing SDK just works.»*. Link to integration guides in docs.

```
[Works with your framework]
[Laravel] [Symfony] [Spiral] [WordPress] [Yii3] [Drupal]
[Also: JavaScript · Python · Ruby via Sentry SDK]
[See integration guides →]
```

### EcosystemSection

Two cards side by side. White background.

**Card 1 — Trap:**
```
Heading: "No Docker? No problem."
Icon: CLI terminal icon
Description: "Trap is a lightweight PHP CLI alternative. Install it as a composer package — no containers, no configuration. All the same debug features, right in your terminal."
Code: composer require --dev buggregator/trap -W
[CopyCommand]
[⭐ GitHub Stars badge] [View on GitHub →] [Read docs →]
```

**Card 2 — JetBrains Plugin:**
```
Heading: "Never leave your IDE"
Icon: JetBrains logo
Description: "The Buggregator plugin for PhpStorm and IntelliJ brings dumps, logs, and debug data directly into your editor. See events in a panel next to your code."
[Install from Marketplace →] [Read docs →]
```

Both cards: `border border-gray-200 rounded-xl p-6`, subtle drop shadow.

### AdvancedFeaturesSection

Compact grid, light gray background. 3×2 on desktop, 2×3 on tablet, 1×6 on mobile.

```ts
const advancedFeatures = [
  { icon: '🔐', title: 'SSO Authentication',    desc: 'Auth0 & Kinde support for team environments' },
  { icon: '🗄️', title: 'External Database',     desc: 'PostgreSQL/MySQL for persistent event storage' },
  { icon: '☸️', title: 'Kubernetes Ready',      desc: 'Deploy as Deployment + Service in your cluster' },
  { icon: '🔔', title: 'Webhooks',              desc: 'Trigger external actions on incoming events' },
  { icon: '📊', title: 'Prometheus Metrics',    desc: 'Monitor event counts with Grafana' },
  { icon: '📁', title: 'Multi-project Support', desc: 'Separate events by project or team' },
]
```

Each card: icon + title + one-line description. No screenshots. Intentionally compact — these are not the main selling points.

Link below grid: `→ View all configuration options` (links to docs).

### CommunitySection

Dark background. GitHub-focused.

```
[Title: "Open source. Built with the community."]
[Stats row: ⭐ X stars · 🍴 X forks · 👥 X contributors · MIT License]
[Description: "Buggregator is free forever. No paid plans, no feature gates..."]

[Button row]
[⭐ Star on GitHub]  [Browse issues]  [Contribution guide]  [Join Discord]
```

GitHub stars/forks/contributors: fetch from `/api/stars` (cached). Stars already fetched in navbar — reuse. Forks and contributors need a separate call or hardcode reasonable approximation.

**Stars API server route (`server/api/stars.get.ts`):**
```ts
export default defineEventHandler(async () => {
  const storage = useStorage('cache')
  const cached = await storage.getItem('github:repo')
  if (cached) return cached

  const res = await fetch('https://api.github.com/repos/buggregator/server')
  const data = await res.json()
  
  const result = {
    stars: data.stargazers_count,
    forks: data.forks_count,
    openIssues: data.open_issues_count,
  }
  
  await storage.setItem('github:repo', result, { ttl: 3600 })
  return result
})
```

### AppFooter

4 columns: Product | Community | Resources | (logo + tagline)

```
[Buggregator logo]           Product              Community          Resources
[tagline]                    Docs                 GitHub             Changelog
[© 2025 Buggregator]        Features             Discord            Releases
[MIT License]                Trap                 Contributing       Docker Hub
                             PhpStorm Plugin      Bug Reports
                             Getting Started
```

Dark background `--bg-base`. Muted text for links, slightly brighter on hover.

### Full QA Checklist

**Responsive (test at: 375px, 768px, 1024px, 1280px, 1440px):**
- [ ] Hero: single column on mobile, two columns on 1024px+
- [ ] MockShowcase tabs wrap on mobile without overflow
- [ ] Profiler graph has `min-h-[300px]` on mobile, `min-h-[480px]` on desktop
- [ ] Step preview columns hidden on mobile (<768px)
- [ ] FrameworkTabs scroll horizontally on mobile
- [ ] Advanced features grid: 1 col → 2 col → 3 col

**i18n:**
- [ ] All sections render correctly with language switch (no missing keys = `[key]` placeholders)
- [ ] Language switcher in navbar works and persists in URL (`/es/`, `/` etc.)
- [ ] `en.json` has no duplicate keys

**Functionality:**
- [ ] All CopyCommand instances copy correct text; ✓ feedback appears for 2s
- [ ] Version badge shows real version from `/api/version`
- [ ] GitHub stars show real count from `/api/stars`
- [ ] All external links (`target="_blank"`) have `rel="noopener noreferrer"`
- [ ] All docs links point to `docs.buggregator.dev` (not dead links)
- [ ] All GitHub links point to `github.com/buggregator/server`
- [ ] Vue Flow graph renders without console errors
- [ ] Tab switching in MockShowcase animated correctly
- [ ] FrameworkTabs in StepsSection: all 4 tabs work

**Accessibility:**
- [ ] All images have `alt` text
- [ ] All icon-only buttons have `aria-label`
- [ ] Tab components use `role="tab"`, `aria-selected`, `role="tablist"`
- [ ] Color contrast: text on dark bg passes WCAG AA (4.5:1)
- [ ] Page can be navigated with keyboard only (Tab, Enter, Space)

**Performance:**
- [ ] Lighthouse score ≥ 90 (Performance) on desktop
- [ ] Vue Flow is loaded lazily (not in initial bundle)
- [ ] Mock JSON files are not included in the main bundle unnecessarily
- [ ] Images are WebP or SVG; no unoptimized PNGs > 100KB

**SEO:**
- [ ] `<title>` and `<meta description>` set (via `useHead` or `useSeoMeta`)
- [ ] `og:title`, `og:description`, `og:image` set for social sharing
- [ ] `lang` attribute on `<html>` reflects current locale
- [ ] Canonical URL set

## Definition of Done

- [ ] All 6 sections render without errors
- [ ] Full page scroll from top to footer works smoothly on desktop and mobile
- [ ] Full QA checklist above is passing
- [ ] No TypeScript errors (`npx nuxi typecheck`)
- [ ] No Vue warnings in console on full page load
- [ ] `npm run build` completes without errors
- [ ] Production build tested with `npm run preview` — all sections work

## Dependencies

**Requires:** Stages 1–5 (all previous stages complete)
**Enables:** Deployment / production release
