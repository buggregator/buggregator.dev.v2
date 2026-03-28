# Stage 9: Hero Section Redesign

## Overview

Complete rebuild of the Hero section with the approved headline, right-column pre-recorded
event feed, and a simplified layout that removes framework logos and Trap mention.

**Changes vs previous Hero spec (Stage 3):**

| Element | Old | New |
|---|---|---|
| Headline | "One docker run. All your debug data in one place." | **"Debug everything. Install nothing."** |
| Subheadline | Generic | **Focused on 4 tools: Sentry, Monolog, SMTP, Profiler** |
| Framework logos | In Hero | **Removed → moved to FrameworksSection** |
| Trap mention | Ghost link in Hero | **Removed → covered in EcosystemSection** |
| Right column | 4-5 static CSS cards | **Pre-recorded live event feed (auto-playing)** |

**Rationale:**
- Hero should answer "what is this" in 5 seconds — logos and Trap dilute focus
- Right column as live feed is more convincing than static cards
- Logos belong where integration is discussed (FrameworksSection)
- Trap belongs where ecosystem depth is shown (EcosystemSection)

---

## Files

MODIFY (replace Stage 3 implementation):
- `buggregator.dev/spa-v2/components/sections/HeroSection.vue` — full rebuild
- `buggregator.dev/spa-v2/components/sections/HeroSection/HeroVisual.vue` — replace static cards with LiveFeed
- `buggregator.dev/spa-v2/locales/en.json` — update `hero.*` keys

CREATE:
- `buggregator.dev/spa-v2/components/sections/HeroSection/LiveFeed.vue` — pre-recorded event card feed
- `buggregator.dev/spa-v2/data/hero-feed-events.ts` — pre-recorded event sequence (typed, ~20 events)

---

## Code References

- `frontend/src/shared/ui/preview-card/preview-card-header.vue` — type badge + left-stripe color pattern to replicate
- `frontend/src/shared/ui/preview-card/preview-card.vue` — card structure to mimic
- `frontend/src/entities/sentry/mocks/sentry-laravel.json` — real event label format
- `buggregator.dev/feature-requests/landing-v2/landing-style-guide.md` — hero layout spec, design tokens
- `buggregator.dev/feature-requests/landing-v2/hero-copy-final.md` — approved copy

---

## Section Layout

```
HeroSection
  bg: #0c0e14 (--section-dark)
  min-height: 100vh desktop, auto mobile
  padding: pt-32 pb-24 (account for sticky navbar)
  overflow: hidden

  [max-w-7xl mx-auto px-4 sm:px-6 lg:px-8]

  Desktop (lg+): CSS grid, 55% left / 45% right, gap-16
  Mobile (<lg): single column
```

---

## Left Column — Copy

### Version badge
```
● v{version} · just released
```
- Rendered by `VersionBadge.vue` (from Stage 2/3)
- Amber pulsing dot if `isNew === true`
- `font-mono text-sm`, blue tint pill
- `mb-6`

### H1 — Approved headline
```
Debug everything.
Install nothing.
```
- Font: DM Sans 700
- Size: 56px desktop (`text-6xl`), 36px mobile (`text-4xl`)
- Color: `#ffffff`
- Letter-spacing: `-0.02em`
- Line-height: `1.1`
- Natural line break after "everything." — do NOT force with `<br>`, use `max-w` to control wrapping
- `mb-5`

### Subheadline — Approved copy
```
One docker run. Exceptions, logs, emails and profiling —
all in one real-time UI. No cloud account. No code changes.
```
- Font: DM Sans 400
- Size: 18px (`text-lg`)
- Color: `#8b919a` (`--text-secondary`)
- Line-height: `1.6`
- Max-width: 520px
- `mb-8`

**No mention of Ray. No mention of Trap. No framework names in subheadline.**

The four capabilities mentioned implicitly map to:
- "Exceptions" → Sentry SDK
- "logs" → Monolog
- "emails" → SMTP
- "profiling" → XHProf

### CopyCommand block
```bash
docker run --pull always \
  -p 127.0.0.1:8000:8000 \
  -p 127.0.0.1:1025:1025 \
  -p 127.0.0.1:9912:9912 \
  ghcr.io/buggregator/server:latest
```
- Component: `CopyCommand.vue` (from Stage 3)
- `bg #0d1117`, `border #21262d`, `radius 12px`
- `font-mono 14px`, green `$` prompt
- Copy button: ✓ feedback 2s
- Max-width: 600px
- `mb-4`

### "See it live" link (replaces old Trap ghost link)
```
See it in action → (scrolls to #demo)
```
- `text-sm font-medium`
- Color: `--text-muted` (#555b65)
- Hover: `--text-secondary` (#8b919a)
- `href="#demo"` — smooth scrolls to DemoSection (Stage 8)
- Only visible on desktop (lg+), since demo is hidden on mobile

### Trust row
```
⭐ {stars} GitHub Stars  ·  v{version} released  ·  MIT License  ·  Free forever
```
- Font: `text-sm font-mono`
- Color: `--text-muted`
- Separator: `·` with `mx-3`
- Stars from `useLatestRelease` / `useGitHubStars` composables
- `mt-8`

**Removed:** Framework logos. They moved to `FrameworksSection`.

---

## Right Column — LiveFeed Component

### Concept

A panel that looks like the Buggregator event list sidebar. Event cards appear automatically,
mimicking a real debugging session in progress. No backend required — all data is pre-recorded
and replayed via `setInterval`.

The goal is **ambient proof**: the visitor subconsciously understands "this product is alive,
events flow, it works" — without having to interact.

### Visual frame

```
┌──────────────────────────────────────┐
│  ● Live  [connection dot]            │
│ ─────────────────────────────────────│
│ [rose ]  AuthenticationException     │
│           Unhandled · 2s ago         │
│ ─────────────────────────────────────│
│ [amber]  Welcome email               │
│           user@example.com · 5s ago  │
│ ─────────────────────────────────────│
│ [violet] XHProf · 891ms             │
│           profiler report · 9s ago   │
│ ─────────────────────────────────────│
│ [teal ]  [ERROR] DB connection fail  │
│           attempt 3/3 · 14s ago      │
│ ─────────────────────────────────────│
│ [rose ]  QueryException · SQLSTATE   │
│           42S02 · 18s ago            │
└──────────────────────────────────────┘
```

- Background: `#1a1d24` (`--bg-surface` — same as in the real app)
- Border: `1px solid #1e2128` (`--border-subtle`)
- Border-radius: `12px`
- Overflow: hidden
- Height: `min-h-[500px]`, `max-h-[580px]`
- Hidden on mobile (`hidden lg:flex flex-col`)

**Connection dot** (top right of panel):
- 8px green circle (`#22c55e`), pulsing animation
- Label: `"● Live"` in `font-mono text-xs text-muted`
- Signals "this is a live feed" to developer audience

### Pre-recorded event data (`data/hero-feed-events.ts`)

```ts
export type FeedEvent = {
  id: string
  type: 'sentry' | 'smtp' | 'profiler' | 'monolog' | 'var-dump' | 'http-dump'
  label: string          // primary text (exception type, email subject, etc.)
  sublabel?: string      // secondary text (email address, log message, etc.)
  delay: number          // ms to wait before showing this card (from previous)
}

export const heroFeedEvents: FeedEvent[] = [
  { id: 'e1',  type: 'sentry',   label: 'AuthenticationException',  sublabel: 'Unhandled',                 delay: 0    },
  { id: 'e2',  type: 'smtp',     label: 'Welcome email',            sublabel: 'user@example.com',           delay: 2800 },
  { id: 'e3',  type: 'profiler', label: 'XHProf · 891ms',          sublabel: 'profiler report',            delay: 3200 },
  { id: 'e4',  type: 'monolog',  label: '[ERROR] DB connection',    sublabel: 'attempt 3/3',                delay: 2500 },
  { id: 'e5',  type: 'sentry',   label: 'QueryException',           sublabel: 'SQLSTATE[42S02]',            delay: 3000 },
  { id: 'e6',  type: 'smtp',     label: 'Order shipped',            sublabel: 'customer@shop.com',          delay: 2700 },
  { id: 'e7',  type: 'monolog',  label: '[INFO] Cache warmed',      sublabel: '1,240 keys loaded',          delay: 2000 },
  { id: 'e8',  type: 'profiler', label: 'XHProf · 234ms',          sublabel: 'Model::fill × 5000',         delay: 3500 },
  { id: 'e9',  type: 'sentry',   label: 'TypeError',                sublabel: 'Unhandled · routes/api.php', delay: 2900 },
  { id: 'e10', type: 'smtp',     label: 'Password reset',           sublabel: 'reset@example.com',          delay: 3100 },
  { id: 'e11', type: 'monolog',  label: '[WARNING] Slow query',     sublabel: '1.4s · users table',         delay: 2600 },
  { id: 'e12', type: 'var-dump', label: 'array(14)',                sublabel: 'App/Http/Controllers · :42', delay: 1800 },
  { id: 'e13', type: 'http-dump',label: 'POST /api/orders',         sublabel: 'HTTP dump · 200 OK',         delay: 2400 },
  { id: 'e14', type: 'sentry',   label: 'NotFoundHttpException',    sublabel: 'Handled · /api/users/99',    delay: 3300 },
  { id: 'e15', type: 'smtp',     label: 'Invoice #4821',            sublabel: 'billing@example.com',        delay: 2900 },
  { id: 'e16', type: 'monolog',  label: '[DEBUG] User logged in',   sublabel: 'user_id=42',                 delay: 2000 },
  { id: 'e17', type: 'profiler', label: 'XHProf · 1.2s',           sublabel: 'N+1 detected · Eloquent',    delay: 3600 },
  { id: 'e18', type: 'sentry',   label: 'ValidationException',      sublabel: 'Handled · field: email',     delay: 2700 },
  { id: 'e19', type: 'var-dump', label: 'App\Models\User {#42}',   sublabel: 'App/Services/Auth · :89',    delay: 2200 },
  { id: 'e20', type: 'smtp',     label: '2FA verification code',    sublabel: 'security@example.com',       delay: 3100 },
]
```

Sequence loops: when all 20 events have been shown, restart from `e1`.

### LiveFeed component logic

```vue
<script setup lang="ts">
import { heroFeedEvents, type FeedEvent } from '~/data/hero-feed-events'

const MAX_VISIBLE = 6  // max cards shown simultaneously
const visibleEvents = ref<(FeedEvent & { timestamp: Date })[]>([])
let eventIndex = 0
let timer: ReturnType<typeof setTimeout> | null = null

function scheduleNext() {
  const event = heroFeedEvents[eventIndex % heroFeedEvents.length]
  eventIndex++

  timer = setTimeout(() => {
    // Add new card at top
    visibleEvents.value.unshift({ ...event, timestamp: new Date() })

    // Keep only MAX_VISIBLE cards
    if (visibleEvents.value.length > MAX_VISIBLE) {
      visibleEvents.value = visibleEvents.value.slice(0, MAX_VISIBLE)
    }

    scheduleNext()
  }, event.delay)
}

onMounted(() => {
  // Seed 3 initial events instantly (no delay)
  const seed = heroFeedEvents.slice(0, 3).map(e => ({ ...e, timestamp: new Date() }))
  visibleEvents.value = seed.reverse()
  eventIndex = 3

  // Start the sequence
  scheduleNext()
})

onUnmounted(() => {
  if (timer) clearTimeout(timer)
})
</script>
```

### FeedCard sub-component (inline or separate file)

Each card in the feed is a simplified PreviewCard — no action buttons, no footer, just
the header with type badge + label + relative time.

```
[3px left stripe in type color]
[type badge pill] [label text] [Xs ago — mono, muted]
[sublabel — smaller, muted]
```

Colors map to the landing style guide event type colors:
```ts
const typeColors = {
  'sentry':    '#f43f5e',
  'smtp':      '#f59e0b',
  'profiler':  '#8b5cf6',
  'monolog':   '#6b7280',
  'var-dump':  '#ef4444',
  'http-dump': '#22c55e',
} as const
```

### Animation

```css
/* New card enters from top */
.feed-card-enter-active {
  transition: all 300ms cubic-bezier(0, 0, 0.2, 1);
}
.feed-card-enter-from {
  opacity: 0;
  transform: translateY(-12px);
}

/* Old cards shift down smoothly */
.feed-card-move {
  transition: transform 300ms cubic-bezier(0.4, 0, 0.2, 1);
}

/* Oldest card fades out at bottom */
.feed-card-leave-active {
  transition: all 200ms ease;
  position: absolute;
}
.feed-card-leave-to {
  opacity: 0;
  transform: translateY(8px);
}
```

Use Vue's `<TransitionGroup name="feed-card">` wrapping the cards list.

---

## Removed Elements

### Framework logos — REMOVED from Hero

**Where they go instead:** `FrameworksSection` (Stage 6), which has its own dedicated section
with proper context ("Works with your framework" + integration guides link).

**Why removed from Hero:**
- Hero already has Version badge + H1 + subheadline + CopyCommand + Trust row + LiveFeed
- Adding logos creates visual clutter above the fold
- Logos convey "I belong here" — this is better served after the user understands the product
- Trust row already contains enough proof signals for the first screen

### Trap ghost link — REMOVED from Hero

**Where it goes instead:** `EcosystemSection` (Stage 6) has a full Trap card with install
command, GitHub stars, and documentation link.

**Why removed from Hero:**
- Trap is an alternative to Docker — mentioning it in the Hero contradicts the "one docker run" CTA
- It splits the visitor's attention at the most critical conversion moment
- After the visitor understands the product (deeper in the page), Trap is a natural next step

---

## Updated Hero i18n Keys

```json
"hero": {
  "versionBadge": "v{version} · just released",
  "headline": "Debug everything.\nInstall nothing.",
  "subheadline": "One docker run. Exceptions, logs, emails and profiling — all in one real-time UI. No cloud account. No code changes.",
  "copyCommand": "docker run --pull always -p 127.0.0.1:8000:8000 -p 127.0.0.1:1025:1025 -p 127.0.0.1:9912:9912 ghcr.io/buggregator/server:latest",
  "seeItLive": "See it in action →",
  "trustRow": {
    "stars": "{count} GitHub Stars",
    "license": "MIT License",
    "free": "Free forever"
  },
  "liveFeed": {
    "connectionDot": "Live"
  }
}
```

---

## HeroSection.vue Structure

```vue
<template>
  <section class="hero">
    <div class="hero__container">

      <!-- LEFT COLUMN -->
      <div class="hero__left">
        <VersionBadge class="mb-6" />

        <h1 class="hero__headline">
          {{ t('hero.headline') }}
        </h1>

        <p class="hero__subheadline">
          {{ t('hero.subheadline') }}
        </p>

        <CopyCommand
          :command="t('hero.copyCommand')"
          class="hero__command"
        />

        <!-- "See it live" only on desktop (demo hidden on mobile) -->
        <a
          href="#demo"
          class="hero__demo-link hidden lg:inline-flex"
        >
          {{ t('hero.seeItLive') }}
        </a>

        <div class="hero__trust">
          <span>⭐ {{ formatStars(stars) }} {{ t('hero.trustRow.stars', { count: formatStars(stars) }) }}</span>
          <span class="hero__trust-sep">·</span>
          <span>{{ t('hero.trustRow.license') }}</span>
          <span class="hero__trust-sep">·</span>
          <span>{{ t('hero.trustRow.free') }}</span>
        </div>
      </div>

      <!-- RIGHT COLUMN — hidden on mobile -->
      <div class="hero__right hidden lg:flex">
        <LiveFeed />
      </div>

    </div>
  </section>
</template>
```

---

## CSS for Hero Layout

```css
.hero {
  background: #0c0e14;
  min-height: 100vh;
  padding-top: 128px;  /* 64px navbar + 64px breathing room */
  padding-bottom: 96px;
  overflow: hidden;
}

.hero__container {
  max-width: 1280px;
  margin: 0 auto;
  padding: 0 32px;
  display: grid;
  grid-template-columns: 55fr 45fr;
  gap: 64px;
  align-items: center;
}

.hero__headline {
  font-family: "DM Sans", sans-serif;
  font-weight: 700;
  font-size: 3.5rem;      /* 56px */
  line-height: 1.1;
  letter-spacing: -0.02em;
  color: #ffffff;
  white-space: pre-line;  /* respects \n in i18n string */
  margin-bottom: 20px;
}

.hero__subheadline {
  font-size: 1.125rem;    /* 18px */
  line-height: 1.6;
  color: #8b919a;
  max-width: 520px;
  margin-bottom: 32px;
}

.hero__command {
  max-width: 600px;
  margin-bottom: 16px;
}

.hero__demo-link {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 0.875rem;
  color: #555b65;
  text-decoration: none;
  margin-bottom: 32px;
  transition: color 150ms;
}
.hero__demo-link:hover { color: #8b919a; }

.hero__trust {
  display: flex;
  align-items: center;
  gap: 0;
  font-family: "JetBrains Mono", monospace;
  font-size: 0.8125rem;   /* 13px */
  color: #555b65;
  flex-wrap: wrap;
  row-gap: 4px;
}
.hero__trust-sep { margin: 0 10px; }

/* Mobile overrides */
@media (max-width: 1023px) {
  .hero {
    min-height: auto;
    padding-top: 100px;
    padding-bottom: 64px;
  }
  .hero__container {
    grid-template-columns: 1fr;
    gap: 0;
  }
  .hero__headline {
    font-size: 2.25rem;   /* 36px */
  }
}
```

---

## Definition of Done

- [ ] H1 "Debug everything. Install nothing." renders correctly at 56px desktop / 36px mobile
- [ ] Headline breaks naturally into two visual lines (no `<br>` hacks)
- [ ] Subheadline visible in muted color, max-width 520px, no mention of Ray or Trap
- [ ] CopyCommand renders, copies correct `docker run` command, shows ✓ feedback 2s
- [ ] VersionBadge shows real version, amber dot when `isNew === true`
- [ ] "See it in action →" link visible on desktop, hidden on mobile, scrolls to `#demo`
- [ ] Trust row shows live GitHub stars + MIT License + Free forever in monospace
- [ ] **No framework logos in Hero section**
- [ ] **No Trap mention in Hero section**
- [ ] LiveFeed panel visible on lg+ screens, hidden on mobile
- [ ] LiveFeed: 3 pre-seeded cards visible on initial mount (no empty state on load)
- [ ] LiveFeed: new card appears every ~3s, enters with slide-down animation
- [ ] LiveFeed: max 6 cards visible, oldest fades out when 7th arrives
- [ ] LiveFeed: connection dot "● Live" visible in top-right of panel
- [ ] LiveFeed: each card has correct left-stripe color for its event type
- [ ] LiveFeed: label + sublabel + relative time visible on each card
- [ ] LiveFeed: sequence loops after all 20 events shown
- [ ] LiveFeed: timer cleared on component unmount (no memory leak)
- [ ] `@media (prefers-reduced-motion)`: LiveFeed cards appear instantly, no animations
- [ ] Hero renders cleanly in SSR / SSG mode (LiveFeed is client-only, hydrates after mount)

## Dependencies

**Requires:** Stage 1 (Nuxt 4 setup), Stage 2 (useLatestRelease, GitHub stars), Stage 3 (CopyCommand, VersionBadge)  
**Enables:** Stage 8 (Demo section can be linked from hero via `#demo`), full page QA  
**Replaces:** Stage 3 HeroSection and HeroVisual — this stage supersedes those components
