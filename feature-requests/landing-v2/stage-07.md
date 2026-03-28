# Stage 7: "Your App Stays Clean" Section — Zero-Dependency & Dev Environment Positioning

## Overview

A dedicated section combining two powerful differentiators into one narrative block:

1. **Architectural angle** — Buggregator is a standalone server, not a package in your app. Zero lines of Buggregator code in your codebase. No composer require, no migrations, no service providers.

2. **Dev environment angle** — Perfect for local development. No cloud accounts, no project setup, no waiting. Spin up in 60 seconds alongside your existing docker-compose services.

Together, these answer the two most common implied objections:
- *"But I'd have to install something in my app, right?"* → **No. Zero changes to your code.**
- *"But setting up Sentry/Mailtrap takes forever..."* → **No. 60 seconds. No account needed.**

**Placement:** Between the Step-by-Step section and the Mock Showcase.

**Design rationale:** Both angles reinforce the same core message — Buggregator removes friction, not adds it. They belong in one section with two sub-blocks.

---

## Files

CREATE:
- `buggregator.dev/spa-v2/components/sections/CleanAppSection.vue` — full section wrapper
- `buggregator.dev/spa-v2/components/sections/CleanAppSection/ArchDiagram.vue` — "beside vs inside" diagram
- `buggregator.dev/spa-v2/components/sections/CleanAppSection/DevEnvBlock.vue` — dev environment sub-block
- `buggregator.dev/spa-v2/components/sections/CleanAppSection/EnvComparison.vue` — before/after .env tabs
- `buggregator.dev/spa-v2/components/sections/CleanAppSection/ComparisonTable.vue` — vs Telescope vs Ray

MODIFY:
- `buggregator.dev/spa-v2/pages/index.vue` — insert `<CleanAppSection>` after `<StepsSection>`
- `buggregator.dev/spa-v2/locales/en.json` — add `cleanApp` key block (full spec below)

---

## Code References

- `buggregator.dev/spa-v2/components/ui/CopyCommand.vue` — reuse for copyable .env snippets
- `buggregator.dev/feature-requests/landing-v2/landing-style-guide.md` — section bg tokens, code block styling
- `frontend/src/entities/sentry/mocks/sentry-laravel.json` — real DSN format for before/after example

---

## Section Position in Page

```
[HeroSection]
[ReplacesSection]        ← "Replaces Sentry + Mailhog + Ray..."
[CleanAppSection]        ← THIS STAGE (two sub-blocks)
  └─ Architectural angle: "Your app doesn't know we exist."
  └─ Dev env angle:       "Made for dev environments."
[MockShowcase]
[StepsSection]
[InstallSection]
...
```

---

## Part 1 — Architectural Angle: "Your app doesn't know we exist."

### Headline & Copy

**Primary headline:**
```
"Your app doesn't know we exist."
```

**Subheadline (blue accent — `var(--accent-blue)`):**
```
"Not a package. A server."
```

**Body:**
```
"Buggregator runs beside your application as a standalone Docker container.
Your codebase doesn't change. Your dependencies don't change.
You already have Sentry SDK, VarDumper, Monolog, or Ray installed —
they just need a different address to send data to."
```

---

### Three Pillars

**Column 1 — No new dependencies**
```
Title: "No new dependencies"
Body:  "Your app's composer.json stays untouched.
        No service providers. No migrations.
        No Buggregator code inside your project."
```

**Column 2 — One env variable**
```
Title: "One env variable"
Body:  "Already using Sentry SDK, VarDumper, or Monolog?
        Change where they send data. That's it.
        Your code doesn't need to know about Buggregator."
```

**Column 3 — Cross-project**
```
Title: "One instance, all your apps"
Body:  "Run one Buggregator container.
        Point all your projects at it.
        Microservices, monorepos, multiple teams — one dashboard."
```

---

### ArchDiagram Component

Two-panel visual comparison. Background `#0d1117`, monospace font, styled as a code/architecture doc.

```
Panel LEFT — "With Telescope or Ray":
┌─────────────────────────────────┐
│  your-laravel-app/              │
│  ├── app/                       │
│  ├── telescope/          ← 😰   │  ← rose color
│  ├── Providers/                 │
│  │   └── TelescopeServiceProvider│
│  └── database/migrations/      │
│      └── 2024_..._telescope  ← 😰│  ← rose color
└─────────────────────────────────┘

Panel RIGHT — "With Buggregator":
┌──────────────┐      ┌──────────────────┐
│  your-app/   │─────▶│   buggregator    │
│  (unchanged) │ .env │   :8000          │
└──────────────┘      └──────────────────┘
       ↑
  Zero changes in your code
```

Implementation: pure HTML + Tailwind, `font-mono`. Rose (`text-rose-400`) for problem elements. Green (`text-green-400`) for "unchanged". Arrow between panels: `→` with `text-blue-400`. No SVG library needed.

---

## Part 2 — Dev Environment Angle: "Made for dev environments."

This sub-block appears immediately after the three pillars and ArchDiagram, separated by a thin divider `border-t border-light-200`.

### DevEnvBlock Component

**Background:** slightly different shade — `#f3f4f6` (one step darker than section's `#f8f9fa`) to visually separate the two angles while staying within the same section.

**Headline:**
```
"Made for dev environments."
```

**Subheadline:**
```
"No account. No credit card. No project setup."
```

**Body:**
```
"Add Buggregator to your docker-compose.yml alongside your other services.
Change your .env. Start debugging. That's 60 seconds —
not 15 minutes of cloud dashboard configuration."
```

---

### Two-Column Setup Comparison

**Left column — "Cloud service setup"**

Label: `text-xs font-mono text-rose-400 uppercase tracking-wide mb-3`
Text: `"Getting started with Sentry / Mailtrap / Blackfire:"`

```
Step 1  Create an account
Step 2  Verify your email
Step 3  Create an organization
Step 4  Create a project
Step 5  Choose your platform / SDK
Step 6  Copy DSN or credentials
Step 7  Paste into your .env
Step 8  Wait for first event to arrive

⏱ ~15 minutes before you see a single debug event
```

Visual: numbered list with subtle `text-muted` numbers and `text-on-light-secondary` text. Last line (⏱) in `text-rose-400`.

**Right column — "Buggregator setup"**

Label: `text-xs font-mono text-green-500 uppercase tracking-wide mb-3`
Text: `"Getting started with Buggregator:"`

```
Step 1  Add to docker-compose.yml
Step 2  Change your .env

✓ Open http://127.0.0.1:8000 — done.
```

Visual: same numbered list style, but `text-green-500` numbers. Final line (✓) in `text-green-500`, `font-semibold`.

**Visual weight balance:** Both columns equal width. Cloud column intentionally longer — the contrast between 8 steps and 2 steps is the message.

---

### Docker Compose Snippet

After the two columns, show the actual docker-compose addition with CopyCommand:

```yaml
# Add to your docker-compose.yml:
services:
  # ... your existing services ...

  buggregator:
    image: ghcr.io/buggregator/server:latest
    ports:
      - 127.0.0.1:8000:8000
      - 127.0.0.1:1025:1025
      - 127.0.0.1:9912:9912
    # That's it. No volumes, no environment vars needed.
```

Code block: `bg #0d1117`, `border #21262d`, `radius 12px`. Comment lines in `--code-comment: #6e7681`. Key (`buggregator:`): `--code-keyword: #ff7b72`. Values: `--code-string: #a5d6ff`.

Caption below snippet: `text-xs text-muted italic` — "Buggregator requires no environment configuration of its own. It works out of the box."

---

### Privacy Note

Small pill below the docker-compose block:

```
🔒 Your debug data never leaves your machine.
   No cloud storage. No third-party servers. Full privacy.
```

Visual: `inline-flex`, `bg rgba(34,197,94,0.08)`, `border 1px solid rgba(34,197,94,0.2)`, `rounded-xl`, `px-4 py-2`, `text-sm text-green-600`.

---

## Part 3 — Before/After .env Comparison (EnvComparison.vue)

Tabbed before/after code blocks showing how minimal the change is. Tabs: **Sentry DSN** | **Email** | **VarDumper** | **Logs**

### Tab 1 — Sentry DSN (default)
```
BEFORE (Sentry Cloud):
SENTRY_LARAVEL_DSN=https://abc123@o123456.ingest.sentry.io/789

AFTER (Buggregator — no Sentry account needed):
SENTRY_LARAVEL_DSN=http://sentry@127.0.0.1:8000/1
                           ↑
                   Only the host changed.
```

Annotation note below: `"Your Sentry SDK keeps working exactly the same. Buggregator speaks the Sentry protocol."`

### Tab 2 — Email
```
BEFORE (Mailtrap / SMTP cloud):
MAIL_HOST=smtp.mailtrap.io
MAIL_PORT=2525
MAIL_USERNAME=your-username   ← needs account
MAIL_PASSWORD=your-password   ← needs account

AFTER (Buggregator — no Mailtrap account):
MAIL_HOST=127.0.0.1
MAIL_PORT=1025
# No username or password needed
```

### Tab 3 — VarDumper
```
BEFORE:
(dump() output goes to your browser — pollutes the UI)

AFTER:
VAR_DUMPER_FORMAT=server
VAR_DUMPER_SERVER=127.0.0.1:9912
```

### Tab 4 — Logs (Monolog)
```
BEFORE:
LOG_CHANNEL=stack
# logs go to storage/logs/laravel.log — grep required

AFTER:
LOG_CHANNEL=socket
LOG_SOCKET_URL=127.0.0.1:9913
# logs appear in Buggregator in real time
```

**Visual treatment:**
- Container: `bg #0d1117`, `border #21262d`, `radius 12px`
- "BEFORE" label: `text-xs font-mono text-rose-400`
- "AFTER" label: `text-xs font-mono text-green-400`
- Changed line background: `rgba(34, 197, 94, 0.10)` (green tint)
- Comments (`← needs account`, `# No username`): `#6e7681` (muted)
- Annotation: `text-xs font-mono text-muted italic`
- Default open: "Sentry DSN"

---

## Part 4 — Comparison Table (ComparisonTable.vue)

| Feature | Buggregator | Laravel Telescope | Ray (spatie) |
|---------|-------------|-------------------|--------------|
| Installed in your app | ❌ No | ✅ Yes | ✅ Yes |
| Needs `composer require` | ❌ No | ✅ Yes | ✅ Yes |
| Needs migrations | ❌ No | ✅ Yes | ❌ No |
| Adds routes to your app | ❌ No | ✅ Yes | ❌ No |
| Modifies your code | ❌ No | ✅ Yes | ✅ Yes |
| Requires cloud account | ❌ No | ❌ No | ❌ No |
| Requires paid license | ❌ No | ❌ No | ⚠️ Paid app |
| Production risk | ❌ None | ⚠️ Must disable | ⚠️ Remove calls |
| Works across projects | ✅ All | ❌ Per-project | ❌ Per-project |
| Email preview | ✅ Yes | ❌ No | ❌ No |
| Performance profiling | ✅ Yes | ⚠️ Limited | ❌ No |
| Data stays local | ✅ Always | ✅ Yes | ✅ Yes |

**Visual treatment:**
- `bg #ffffff`, `border #e5e7eb`, `border-radius 12px`
- Header row: `bg #f3f4f6`, `font-semibold`
- ❌ cells: `text-rose-500`
- ✅ cells: `text-green-600`
- ⚠️ cells: `text-amber-500`
- Buggregator column: subtle `bg-blue-50` full-column highlight
- Mobile: `overflow-x: auto`, first column `position: sticky; left: 0; bg: inherit`

**Disclaimer below table:**
```
text-xs text-muted italic, max-w-2xl mx-auto text-center:

"Telescope and Ray are excellent tools for their use cases.
 This comparison highlights the architectural difference:
 Buggregator is infrastructure, not a library."
```

---

## Full i18n Keys (`locales/en.json` — `cleanApp` block)

```json
"cleanApp": {
  "headline": "Your app doesn't know we exist.",
  "subheadline": "Not a package. A server.",
  "body": "Buggregator runs beside your application as a standalone Docker container. Your codebase doesn't change. Your dependencies don't change. You already have the SDKs installed — they just need a different address.",

  "pillars": {
    "noDeps": {
      "title": "No new dependencies",
      "body": "Your app's composer.json stays untouched. No service providers. No migrations. No Buggregator code inside your project."
    },
    "oneEnvVar": {
      "title": "One env variable",
      "body": "Already using Sentry SDK, VarDumper, or Monolog? Change where they send data. That's it. Your code doesn't need to know about Buggregator."
    },
    "crossProject": {
      "title": "One instance, all your apps",
      "body": "Run one Buggregator container. Point all your projects at it. Microservices, monorepos, multiple teams — one dashboard."
    }
  },

  "devEnv": {
    "headline": "Made for dev environments.",
    "subheadline": "No account. No credit card. No project setup.",
    "body": "Add Buggregator to your docker-compose.yml alongside your other services. Change your .env. Start debugging. That's 60 seconds — not 15 minutes of cloud dashboard configuration.",

    "cloudSetup": {
      "label": "Getting started with Sentry / Mailtrap / Blackfire:",
      "steps": [
        "Create an account",
        "Verify your email",
        "Create an organization",
        "Create a project",
        "Choose your platform / SDK",
        "Copy DSN or credentials",
        "Paste into your .env",
        "Wait for first event to arrive"
      ],
      "footer": "~15 minutes before you see a single debug event"
    },

    "buggregatorSetup": {
      "label": "Getting started with Buggregator:",
      "steps": [
        "Add to docker-compose.yml",
        "Change your .env"
      ],
      "footer": "Open http://127.0.0.1:8000 — done."
    },

    "composeCaption": "No environment configuration needed. Works out of the box.",
    "privacy": "Your debug data never leaves your machine. No cloud storage. No third-party servers. Full privacy."
  },

  "envComparison": {
    "title": "Just change the address",
    "tabs": {
      "sentry": "Sentry DSN",
      "email": "Email",
      "varDumper": "VarDumper",
      "logs": "Logs"
    },
    "beforeLabel": "BEFORE",
    "afterLabel": "AFTER",
    "sentryAnnotation": "Only the host changed. Your Sentry SDK keeps working exactly the same.",
    "sentryNote": "Buggregator speaks the Sentry protocol."
  },

  "table": {
    "title": "How does it compare?",
    "disclaimer": "Telescope and Ray are excellent tools for their use cases. This comparison highlights the architectural difference: Buggregator is infrastructure, not a library.",
    "cols": {
      "feature": "Feature",
      "buggregator": "Buggregator",
      "telescope": "Laravel Telescope",
      "ray": "Ray (spatie)"
    }
  }
}
```

---

## Full Section Layout (CleanAppSection.vue)

```vue
<template>
  <section id="why-buggregator" class="py-24" style="background: #f8f9fa">
    <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">

      <!-- ① HEADER -->
      <div class="text-center mb-16">
        <h2 class="text-4xl font-bold text-gray-900 mb-3 tracking-tight">
          {{ t('cleanApp.headline') }}
        </h2>
        <p class="text-xl font-semibold text-blue-500 mb-4">
          {{ t('cleanApp.subheadline') }}
        </p>
        <p class="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
          {{ t('cleanApp.body') }}
        </p>
      </div>

      <!-- ② THREE PILLARS -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
        <div v-for="p in pillars" :key="p.key"
             class="bg-white border border-gray-200 rounded-2xl p-6
                    hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200">
          <div class="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center mb-4">
            <!-- icon slot -->
          </div>
          <h3 class="font-semibold text-gray-900 mb-2">{{ p.title }}</h3>
          <p class="text-sm text-gray-500 leading-relaxed">{{ p.body }}</p>
        </div>
      </div>

      <!-- ③ ARCHITECTURE DIAGRAM -->
      <ArchDiagram class="mb-16" />

      <!-- ④ DIVIDER -->
      <div class="border-t border-gray-200 my-16" />

      <!-- ⑤ DEV ENVIRONMENT BLOCK -->
      <DevEnvBlock class="mb-16" />

      <!-- ⑥ ENV BEFORE/AFTER COMPARISON -->
      <EnvComparison class="mb-16" />

      <!-- ⑦ COMPARISON TABLE -->
      <ComparisonTable />

    </div>
  </section>
</template>
```

---

## Section Background Map (within CleanAppSection)

```
CleanAppSection outer:  #f8f9fa  (light gray — breaks from dark sections above/below)
├── Pillars:            #ffffff  (white cards on gray)
├── ArchDiagram:        #0d1117  (dark — "code world", stands out)
├── ─────── divider ────────────
├── DevEnvBlock:        #f3f4f6  (slightly darker gray — visual separation)
│   ├── Setup comparison: white cards
│   └── Docker compose: #0d1117 (code block)
├── EnvComparison:      #0d1117  (code block, dark)
└── ComparisonTable:    #ffffff  (light table on gray section)
```

---

## Definition of Done

- [ ] Section renders at `id="why-buggregator"` anchor
- [ ] H2 "Your app doesn't know we exist." visible with correct sizing
- [ ] Subheadline "Not a package. A server." renders in blue (`text-blue-500`)
- [ ] Three pillar cards: icons, titles, descriptions; hover lift animation works
- [ ] ArchDiagram: two panels side by side (desktop), stacked (mobile)
- [ ] ArchDiagram: rose text on Telescope problem elements, green on "unchanged"
- [ ] Divider line visible between architectural and dev env angles
- [ ] DevEnvBlock headline "Made for dev environments." visible
- [ ] Two-column setup comparison: left = 8 cloud steps, right = 2 Buggregator steps
- [ ] Visual imbalance between columns is intentional and clear
- [ ] "~15 minutes" footer on left column in rose color
- [ ] "Open http://127.0.0.1:8000 — done." in green on right column
- [ ] Docker compose snippet renders with syntax highlighting
- [ ] Privacy pill "🔒 Your debug data never leaves your machine." visible
- [ ] EnvComparison: 4 tabs switch correctly (Sentry DSN default open)
- [ ] "BEFORE" label in rose, "AFTER" in green on all tabs
- [ ] Changed lines in AFTER have green background tint
- [ ] ComparisonTable: all rows, 3 columns, Buggregator column in blue-50
- [ ] Table disclaimer note visible below table
- [ ] Mobile: table horizontal scroll, first column sticky
- [ ] Mobile: two-column setup comparison stacks vertically
- [ ] All text via `t()` — zero hardcoded English strings
- [ ] Section background `#f8f9fa` contrasts with dark sections above and below

---

## A/B Test Suggestions

**Test 1 — Section headline:**
- A: "Your app doesn't know we exist." (anthropomorphic)
- B: "Not a package. A server." (direct)
- B: "Debug without touching your app." (benefit)

**Test 2 — DevEnvBlock position:**
- A: After architectural angle (current — narrative order)
- B: Before architectural angle (lead with "no account" — stronger hook for social traffic)

**Test 3 — Setup comparison format:**
- A: Two-column numbered list (current)
- B: Horizontal bar chart (steps count as bar length — more visual)

---

## Expert Session Notes (summary for this stage)

All experts agreed: the dev environment angle is **complementary**, not competing with the architectural angle. They attack different objections and target different personas:

| Angle | Objection answered | Primary persona |
|-------|-------------------|-----------------|
| "Your app stays clean" | "Will I have to add code to my app?" | Alexey (mid-dev), any dev who used Telescope |
| "Made for dev environments" | "Setting this up sounds like work" | Mike (junior), Sarah (team lead onboarding new devs) |

Key phrase from Dana: *"Not a package. A server."* + *"No account. No credit card. No project setup."* — these two lines together are the most conversion-dense copy on the entire page. They should appear close together.

Key visual from Marcus: The two-column setup comparison (8 cloud steps vs 2 Buggregator steps) is the strongest visual argument in the section. The imbalance itself is the message — no caption needed.

Key insight from Artem: The privacy note ("Your data never leaves your machine") is underrated. Add it. Some teams cannot legally send debug traces to a cloud service — this is a hard requirement for them, not a nice-to-have.
