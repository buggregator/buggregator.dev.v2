# Stage 8: Interactive Demo Section — iframe + Action Buttons

## Overview

A fullscreen-width section at the bottom of the page (before Community) where the visitor
can interact with a **real, live Buggregator instance** via iframe + action buttons.

**Goal:** Provide the final "aha moment" — after reading everything, the user sees the real
product working in real time, triggered by their own clicks. This converts understanding
into conviction.

**Design decision:** Use iframe (not a custom component). Reasons:
- Shows the *actual* product UI, not a mock — maximum authenticity
- The real Buggregator design is already polished and production-ready
- Iframe is acceptable here: CORS is assumed solved, the demo server is assumed stable
- Hidden on mobile — not usable on small screens, show a friendly message instead

**Position in page:** After `InstallSection`, before `CommunitySection`.

---

## Files

CREATE:
- `buggregator.dev/spa-v2/components/sections/DemoSection.vue` — full section wrapper
- `buggregator.dev/spa-v2/components/sections/DemoSection/DemoIframe.vue` — iframe wrapper with loading state
- `buggregator.dev/spa-v2/components/sections/DemoSection/DemoButtons.vue` — action buttons panel
- `buggregator.dev/spa-v2/components/sections/DemoSection/DemoMobileMessage.vue` — mobile placeholder

MODIFY:
- `buggregator.dev/spa-v2/pages/index.vue` — add `<DemoSection>` between `<InstallSection>` and `<CommunitySection>`
- `buggregator.dev/spa-v2/locales/en.json` — add `demo.*` keys

REFERENCE (port logic from):
- `buggregator.dev/spa/components/v1/Demo/Buttons.vue` — existing action definitions and API call logic
- `buggregator.dev/spa/components/v1/Demo/BuggregatorFrame.vue` — existing iframe implementation
- `buggregator.dev/spa/app/api/methods.ts` — existing `examples.call()` API method

---

## Code References

- `buggregator.dev/spa/components/v1/Demo/Buttons.vue` — full list of sections, groups, actions, and the `callAction` helper (camelToSnakeCase + API call pattern)
- `buggregator.dev/spa/components/v1/Demo/BuggregatorFrame.vue` — iframe with sticky positioning
- `buggregator.dev/spa/nuxt.config.ts` — `runtimeConfig.public.examples_url` and `buggregator_url` — port these two keys to Nuxt 4 config

---

## Section Layout

```
[DemoSection]
  bg: #0c0e14 (dark, same as Hero)
  py-24 on desktop, hidden on mobile

  [Header]
    H2: "Experience Buggregator in Action"
    Subtitle: one sentence

  [Two-column layout]
    Left  65%: DemoIframe (sticky, full viewport height)
    Right 35%: DemoButtons (scrollable panel)

[DemoMobileMessage]
  visible only on mobile (< 1024px)
  bg: #111318
  centered, py-16
  shows message with laptop icon
```

### Desktop layout detail

The iframe occupies the full viewport height and stays sticky as the user scrolls through
the buttons panel. This is the same UX as the old landing — it works well on desktop.

```
┌──────────────────────────────┬─────────────────┐
│                              │  SENTRY          │
│                              │  [Report] [Event]│
│    BUGGREGATOR               │                  │
│    IFRAME                    │  PROFILER        │
│    (sticky, 100vh)           │  [Report]        │
│                              │                  │
│    Events appear here        │  MONOLOG         │
│    as user clicks buttons →  │  [Debug] [Info]  │
│                              │  [Warning]...    │
│                              │                  │
│                              │  SMTP            │
│                              │  [Welcome Mail]  │
│                              │  [Order Shipped] │
│                              │                  │
│                              │  VAR DUMPER      │
│                              │  [String][Array] │
│                              │                  │
│                              │  HTTP            │
│                              │  [Get][Post]...  │
└──────────────────────────────┴─────────────────┘
```

---

## DemoIframe Component

```vue
<template>
  <div class="demo-iframe-wrapper">
    <!-- Loading state -->
    <div v-if="isLoading" class="demo-iframe-loading">
      <div class="demo-iframe-spinner" />
      <p class="text-sm text-muted font-mono mt-3">Connecting to demo...</p>
    </div>

    <iframe
      v-show="!isLoading"
      :src="buggregatorUrl"
      frameborder="0"
      class="demo-iframe"
      title="Buggregator live demo"
      @load="isLoading = false"
    />
  </div>
</template>

<script setup lang="ts">
const config = useRuntimeConfig()
const buggregatorUrl = config.public.buggregator_url
const isLoading = ref(true)
</script>

<style scoped>
.demo-iframe-wrapper {
  position: sticky;
  top: 64px; /* navbar height */
  height: calc(100vh - 64px);
  border-radius: 12px 0 0 12px;
  overflow: hidden;
  background: #1a1d24;
  border: 1px solid #1e2128;
  border-right: none;
}

.demo-iframe {
  width: 100%;
  height: 100%;
}

.demo-iframe-loading {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  color: #555b65;
}

.demo-iframe-spinner {
  width: 32px;
  height: 32px;
  border: 2px solid #1e2128;
  border-top-color: #3b82f6;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin { to { transform: rotate(360deg) } }
</style>
```

**Runtime config key:** `buggregator_url` — same name as in existing `spa/nuxt.config.ts`.
Must be set to the URL of the demo Buggregator instance (e.g. `https://demo.buggregator.dev`).

---

## DemoButtons Component

Port the existing `Buttons.vue` logic with the following changes:

### Sections to include (ordered by importance)

**Include — primary (top of panel):**
1. **Sentry** — Report, Event
2. **Profiler (XHProf)** — Report
3. **Monolog** — Debug, Info, Warning, Error, Critical, Notice, Alert, Emergency, Exception
4. **SMTP** — WelcomeMail, OrderShipped
5. **VarDumper** — String, Array, Bool, Int, Object, Exception
6. **HTTP Dump** — Get, Post, Put, Patch, Delete

**Include — secondary (below a divider "More tools"):**
7. **Ray** — common actions only (Int, String, Array, Exception, Table, Json, Measure)
8. **Inspector** — Request, Command

**Remove entirely from buttons panel:**
- Ray Laravel-specific actions (too many, too niche)
- Ray logs group (redundant with Monolog)

### Button visual style (redesigned from old landing)

Old style used blue pill buttons. New style matches the landing's dark aesthetic:

```css
/* Button base */
.demo-btn {
  display: inline-flex;
  align-items: center;
  padding: 4px 12px;
  border: 1px solid #2a2f38;       /* --border-default */
  border-radius: 6px;
  background: transparent;
  color: #8b919a;                   /* --text-secondary */
  font-family: "JetBrains Mono";
  font-size: 12px;
  cursor: pointer;
  transition: all 150ms;
}

.demo-btn:hover {
  border-color: #3b82f6;            /* --accent-blue */
  color: #e8eaed;                   /* --text-primary */
  background: rgba(59, 130, 246, 0.08);
}

.demo-btn:active {
  transform: scale(0.96);
  background: rgba(59, 130, 246, 0.15);
}
```

### Section header style

```css
.demo-section-title {
  font-size: 11px;
  font-family: "JetBrains Mono";
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: #555b65;                   /* --text-muted */
  margin-bottom: 8px;
  padding-bottom: 6px;
  border-bottom: 1px solid #1e2128;
}
```

### Section color dot

Each section header has a 6px circle in the event type color before the name:

```
● SENTRY EXCEPTIONS      (rose #f43f5e)
● XHPROF PROFILER        (violet #8b5cf6)
● MONOLOG LOGS           (teal #6b7280)
● SMTP EMAIL             (amber #f59e0b)
● VAR DUMPER             (sky #ef4444)
● HTTP REQUESTS          (green #22c55e)
```

### API call logic (port from Buttons.vue)

```ts
const config = useRuntimeConfig()
const examplesUrl = config.public.examples_url

const camelToSnakeCase = (str: string) =>
  str.replace(/[A-Z]/g, l => `_${l.toLowerCase()}`).slice(1)

const callAction = async (section: string, group: string, action: string) => {
  const call = group !== 'common'
    ? `${section}_${group}:${camelToSnakeCase(action)}`
    : `${section}:${camelToSnakeCase(action)}`

  // Visual feedback: briefly highlight the clicked button
  activeAction.value = call
  setTimeout(() => activeAction.value = null, 600)

  await $fetch(`${examplesUrl}/api/call/${call}`, { method: 'POST' })
    .catch(() => { /* silently fail — demo server may be busy */ })
}
```

**Active state:** Clicked button gets `border-accent-blue + bg-accent-blue/15` for 600ms — gives tactile feedback that the action was sent.

### Panel layout

```vue
<template>
  <div class="demo-buttons-panel">
    <!-- Primary sections -->
    <div v-for="section in primarySections" :key="section.key" class="demo-section">
      <div class="demo-section-header">
        <span class="demo-section-dot" :style="{ background: section.color }" />
        <span class="demo-section-title">{{ section.title }}</span>
        <a :href="section.docs" target="_blank" class="demo-docs-link">docs →</a>
      </div>
      <p class="demo-section-desc">{{ section.description }}</p>
      <div class="demo-buttons-row">
        <button
          v-for="action in section.actions"
          :key="action"
          class="demo-btn"
          :class="{ 'demo-btn--active': activeAction === buildCall(section.key, action) }"
          @click="callAction(section.key, 'common', action)"
        >
          {{ action }}
        </button>
      </div>
    </div>

    <!-- Secondary divider -->
    <div class="demo-divider">More tools</div>

    <!-- Secondary sections (Ray, Inspector) -->
    <div v-for="section in secondarySections" :key="section.key" class="demo-section">
      <!-- same structure, slightly smaller -->
    </div>
  </div>
</template>
```

---

## DemoMobileMessage Component

Shown **only on mobile** (< 1024px). The DemoSection itself is `hidden lg:block`.

```vue
<template>
  <div class="demo-mobile-msg lg:hidden">
    <div class="demo-mobile-msg__inner">
      <!-- Icon: laptop / desktop monitor -->
      <svg ...><!-- monitor icon --></svg>
      <h3>{{ t('demo.mobileTitle') }}</h3>
      <p>{{ t('demo.mobileBody') }}</p>
    </div>
  </div>
</template>
```

**Content:**
```
[🖥️ monitor icon, 48px, muted color]

"See it live on desktop"

"The interactive demo is best experienced on a larger screen.
 Visit buggregator.dev on your laptop or desktop to try it live."
```

**Style:** `bg #111318`, centered, `py-12 px-6`, `max-w-sm mx-auto`, muted text.

---

## Section Header Copy

**H2:** `"Experience Buggregator in Action"`

**Subtitle:**
```
"Click any button to send a real event to a live Buggregator instance.
 Watch it appear in the UI on the left — exactly as it would in your own project."
```

**Arrow annotation** (optional, echoes old landing's decorative arrow):
A small decorative arrow pointing from the subtitle toward the iframe, styled in muted gray.
This guides the eye and makes the interaction model instantly clear.

---

## i18n Keys

```json
"demo": {
  "headline": "Experience Buggregator in Action",
  "subtitle": "Click any button to send a real event to a live Buggregator instance. Watch it appear in the UI on the left — exactly as it would in your own project.",
  "loading": "Connecting to demo...",
  "mobileTitle": "See it live on desktop",
  "mobileBody": "The interactive demo is best experienced on a larger screen. Visit buggregator.dev on your laptop or desktop to try it live.",
  "sections": {
    "sentry": "Sentry Exceptions",
    "profiler": "XHProf Profiler",
    "monolog": "Monolog Logs",
    "smtp": "SMTP Email",
    "varDump": "Var Dumper",
    "http": "HTTP Requests",
    "more": "More tools",
    "ray": "Ray",
    "inspector": "Inspector"
  },
  "docs": "docs →"
}
```

---

## Runtime Config Requirements

In `nuxt.config.ts`, ensure these keys are present (same as existing landing):

```ts
runtimeConfig: {
  public: {
    buggregator_url: process.env.BUGGREGATOR_URL || 'https://demo.buggregator.dev',
    examples_url:    process.env.EXAMPLES_URL    || 'https://demo.buggregator.dev',
  }
}
```

`buggregator_url` → iframe `src`  
`examples_url` → base URL for POST API calls from buttons

---

## Definition of Done

- [ ] `DemoSection` renders correctly on lg+ screens with two-column layout
- [ ] `DemoSection` is `hidden` on screens < 1024px
- [ ] `DemoMobileMessage` is visible only on screens < 1024px
- [ ] `DemoIframe` renders with loading spinner → fades in when iframe `@load` fires
- [ ] iframe is sticky — stays in view as user scrolls the buttons panel
- [ ] All 6 primary sections render with correct color dots and titles
- [ ] "More tools" divider separates primary from secondary sections
- [ ] Clicking any button triggers POST to `examples_url/api/call/{action}`
- [ ] Clicked button shows active highlight state for 600ms
- [ ] Events appear in the iframe within ~1 second of clicking (assuming demo server is up)
- [ ] Ray section appears in "More tools" — only common actions, no Laravel-specific
- [ ] Each section has a "docs →" link to the correct docs page
- [ ] All text via `t()` — no hardcoded strings
- [ ] Section visible in page at correct position (after Install, before Community)
- [ ] `buggregator_url` and `examples_url` are configurable via `.env`

## Dependencies

**Requires:** Stage 1 (Nuxt 4), Stage 2 (runtimeConfig), Stage 6 (page structure assembled)  
**Enables:** Stage 9 (Hero can reference demo via `#demo` anchor link)

## Notes

- If `BUGGREGATOR_URL` env var is not set during development, the iframe will point to `https://demo.buggregator.dev` — ensure this instance is running
- The demo section intentionally does NOT have a mobile version with interactive elements. The "view on desktop" message is the correct UX decision — a small-screen iframe would be unusable
- Keep Ray in the "More tools" section (not primary) — it exists and works, just not the focus of the landing's messaging
