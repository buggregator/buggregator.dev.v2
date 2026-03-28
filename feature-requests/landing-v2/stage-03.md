# Stage 3: Navbar + Hero Section

## Overview

The two most critical UI elements of the landing. The Navbar establishes brand and navigation. The Hero delivers the
value proposition in under 5 seconds — it must convey \"what it is, why it matters, how to start\" above the fold.

This stage produces the first fully-rendered visible UI. Dark background (`--bg-deepest`), real version badge, framework
logos, and a copy-to-clipboard docker command.

**No mock showcase yet** — the right side of the hero uses a simplified static illustration (gradient card with event
type badges floating in, CSS animation only). The full mock showcase comes in Stage 4.

## Files

CREATE:

- `buggregator.dev/spa-v2/components/layout/AppNavbar.vue` — sticky top nav
- `buggregator.dev/spa-v2/components/layout/AppNavbar/GitHubStars.vue` — live star count badge
- `buggregator.dev/spa-v2/components/ui/CopyCommand.vue` — copyable code block
- `buggregator.dev/spa-v2/components/ui/VersionBadge.vue` — \"v1.4.0 · just released\" pill
- `buggregator.dev/spa-v2/components/sections/HeroSection.vue` — full hero block
- `buggregator.dev/spa-v2/components/sections/HeroSection/FrameworkLogos.vue` — logos strip
- `buggregator.dev/spa-v2/components/sections/HeroSection/HeroVisual.vue` — right-side visual

MODIFY:

- `buggregator.dev/spa-v2/layouts/default.vue` — add `<AppNavbar>` slot at top
- `buggregator.dev/spa-v2/pages/index.vue` — render `<HeroSection>`

## Code References

- `buggregator.dev/spa/components/v1/Hero.vue` — current hero structure (reference, do not copy)
- `buggregator.dev/spa/components/v1/GithubStars.vue` — existing GitHub stars fetch logic, port to Nuxt 4
- `buggregator.dev/spa/components/v1/CopyCommand.vue` — existing copy command, port to Nuxt 4
- `buggregator.dev/spa/assets/img/` — framework SVG logos (laravel.svg, symfony.svg, spiral.svg, wordpress.svg,
  yii3.svg, drupal.svg)
- `frontend/docs/design-guide.md:section-5.1` — sidebar nav spec (same active state pattern for navbar)
- `frontend/src/shared/ui/preview-card/preview-card-header.vue` — event type badge pattern for HeroVisual

## Implementation Details

### AppNavbar

```vue

<template>
  <nav class=\"navbar\">
    <!-- Left: Logo -->
    <NuxtLink to=\"/\" class=\"navbar__logo\">
      <img src=\"~/assets/img/logo.svg\" alt=\"Buggregator\"/>
      <span class=\"navbar__logo-text\">Buggregator</span>
    </NuxtLink>

    <!-- Center: Nav links (hidden on mobile) -->
    <div class=\"navbar__links\">
      <a href=\"#how-it-works\">{{ t('nav.howItWorks') }}</a>
      <a href=\"#showcase\">{{ t('nav.features') }}</a>
      <a :href=\"docsUrl\" target=\"_blank\">{{ t('nav.docs') }}</a>
      <NuxtLink to=\"/trap\">{{ t('nav.trap') }}</NuxtLink>
    </div>

    <!-- Right: GitHub stars + lang switcher + CTA -->
    <div class=\"navbar__right\">
      <GitHubStars/>
      <LanguageSwitcher/>
      <a href=\"#install\" class=\"navbar__cta\">{{ t('nav.getStarted') }}</a>
    </div>
  </nav>
</template>
```

- Sticky with `position: sticky; top: 0; z-index: 50`
- Background: `--bg-deepest` with `backdrop-filter: blur(12px)` + slight transparency on scroll
- Mobile: logo + hamburger menu; links in a slide-down drawer

### GitHubStars

Fetches from GitHub API (separate from the releases API):

```
GET https://api.github.com/repos/buggregator/server
→ stargazers_count
```

Create `server/api/stars.get.ts` — same cache pattern as `version.get.ts` (1 hour TTL).

Display: `⭐ 3.2k` — format large numbers with `Intl.NumberFormat` (compact notation).

### HeroSection layout

```
[dark bg section, min-height: 100vh on desktop]

  [Left column, max-w-2xl]
    [badge row: version pill + \"Free & Open Source\" pill]
    [H1: headline text, text-5xl font-extrabold]
    [Subheadline: text-lg text-secondary]
    [CopyCommand: docker run ...]
    [ghost link: \"Or use Trap (no Docker required) →\"]
    [FrameworkLogos]

  [Right column, hidden on mobile]
    [HeroVisual: animated event cards]
```

### HeroVisual (right column)

CSS-only animation — no JavaScript. Shows 4 event type cards floating in sequentially:

```
Card 1 (sentry, rose): \"AuthenticationException · 2s ago\"   → animates in at 0s
Card 2 (smtp, amber):  \"Welcome email · user@example.com\"   → animates in at 0.8s
Card 3 (ray, cyan):    \"ray() dump · User::find(42)\"        → animates in at 1.6s
Card 4 (profiler, violet): \"XHProf · 891ms wall time\"       → animates in at 2.4s
```

Each card uses the same left-stripe color pattern as `preview-card.vue`:

- 3px left border in event type color
- Type badge (pill with icon) in top-left
- Relative timestamp in top-right (muted mono)
- One-line content preview

Animation:
`@keyframes slideUpFade { from { opacity: 0; transform: translateY(20px) } to { opacity: 1; transform: translateY(0) } }`
with `animation-fill-mode: both`.

After all 4 cards appear, they stay visible. Loop is NOT needed — it distracts.

### CopyCommand component

```vue

<template>
  <div class=\"copy-command\">
    <code class=\"copy-command__text font-mono text-sm\">{{ command }}</code>
    <button @click=\"copy\" :aria-label=\"t('hero.cta.copy')\" class=\"copy-command__btn\">
      <span v-if=\"!copied\">⎘</span>
      <span v-else>✓</span>
    </button>
  </div>
</template>

<script setup lang=\"ts\">
  const { copy: copyToClipboard, copied } = useClipboard()
  const props = defineProps<{ command: string }>()
  const copy = () => copyToClipboard(props.command)
</script>
```

Use Nuxt's built-in `useClipboard()` composable. `copied` auto-resets after 2 seconds.

### VersionBadge

```vue

<template>
  <a v-if=\"release?.version\" :href=\"release.url\" target=\"_blank\" class=\"version-badge\">
    <span class=\"version-badge__dot\" :class=\"{ 'version-badge__dot--new': release.isNew }\" />
    v{{ release.version }}
    <span v-if=\"release.isNew\" class=\"version-badge__new\">· just released</span>
  </a>
</template>
```

- Orange dot + \"just released\" text when `isNew === true`
- Plain version number otherwise
- Links to GitHub release page

### FrameworkLogos

Grayscale logos, full color on hover. Inline SVG or `<img>` from `/assets/img/`.

```
[Works with:] [Laravel] [Symfony] [Spiral] [WordPress] [Yii3] [Drupal]
```

On mobile: wrap to two rows, slightly smaller.

## Definition of Done

- [ ] Navbar is visible at top of page, sticky on scroll
- [ ] GitHub stars badge shows a real number (not \"0\" or undefined)
- [ ] VersionBadge shows current Buggregator version from `/api/version`
- [ ] Hero headline visible and readable on dark background
- [ ] Docker run command is selectable and copyable; \"✓\" appears after copy
- [ ] \"Or use Trap\" ghost link is visible below command
- [ ] FrameworkLogos strip shows all 6 logos
- [ ] HeroVisual shows 4 event cards appearing sequentially (CSS animation)
- [ ] All strings come from `t()` — no hardcoded English in templates
- [ ] Mobile layout: single column, visual hidden, command scrollable horizontally
- [ ] No layout overflow at 375px viewport width

## Dependencies

**Requires:** Stage 1 (Nuxt 4), Stage 2 (i18n strings, version API, `useLatestRelease`)
**Enables:** Stage 4 (Showcase section below hero), Stage 5 (Step-by-step)