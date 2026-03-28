# Stage 5: Step-by-Step Install Section

## Overview

The "How it works" + "Install" sections combined into one guided flow. The visitor is walked through 4 steps, each with a code snippet and a visual preview on the right. This is the primary conversion moment — by Step 4, the user understands exactly what to do and what they'll get.

Dark background section (same `--bg-deepest` as Hero) to visually separate from the showcase.

## Files

CREATE:
- `buggregator.dev/spa-v2/components/sections/StepsSection.vue` — numbered stepper container
- `buggregator.dev/spa-v2/components/sections/StepsSection/StepItem.vue` — single step (number, title, description, code, preview)
- `buggregator.dev/spa-v2/components/sections/StepsSection/FrameworkTabs.vue` — Laravel/Symfony/Spiral/Any PHP tabs with `.env` snippets
- `buggregator.dev/spa-v2/components/sections/StepsSection/TerminalMockup.vue` — decorative terminal window
- `buggregator.dev/spa-v2/components/sections/InstallSection.vue` — "Get started in 60 seconds" with Docker/Compose/Trap tabs

MODIFY:
- `buggregator.dev/spa-v2/pages/index.vue` — add `<StepsSection>` and `<InstallSection>` after `<MockShowcase>`

## Code References

- `buggregator.dev/spa/components/v1/HowToRun.vue` — existing "How to run" block (reference, dark bg pattern)
- `buggregator.dev/spa/components/v1/CopyCommand.vue` — reuse the `CopyCommand` from Stage 3
- `frontend/docs/design-guide.md:section-7` — animation timing (200ms transitions)

## Implementation Details

### StepsSection layout

Two-column layout on desktop. Left column is wider (55%). Step items stack vertically with a vertical connector line between them.

```
[dark section, py-24]
  [section header: "How it works" / "Three steps. That's it."]

  [step connector layout]
    [step 1] ←→ [preview 1]
    [vertical line]
    [step 2] ←→ [preview 2]
    [vertical line]
    [step 3] ←→ [preview 3]
    [vertical line]
    [step 4] ←→ [preview 4]
```

### StepItem component

```vue
<template>
  <div class="step">
    <div class="step__left">
      <!-- Step number -->
      <div class="step__number">{{ number }}</div>

      <!-- Content -->
      <div class="step__content">
        <h3 class="step__title font-sans">{{ title }}</h3>
        <p class="step__description text-secondary">{{ description }}</p>
        <slot name="code" />
      </div>
    </div>

    <!-- Right: preview (hidden on mobile) -->
    <div class="step__preview">
      <slot name="preview" />
    </div>
  </div>
</template>
```

Step numbers: styled as large circles (`w-10 h-10 rounded-full bg-accent-blue text-white font-bold`).

### Step 1: Run one command

**Left:**
```
Title: "Run one command"
Description: "Start Buggregator with a single docker run. No installation, no registration, no configuration files."
Code: <CopyCommand :command="dockerRunCommand" />
```

`dockerRunCommand`:
```
docker run --pull always \
  -p 127.0.0.1:8000:8000 \
  -p 127.0.0.1:1025:1025 \
  -p 127.0.0.1:9912:9912 \
  ghcr.io/buggregator/server:latest
```

**Right:** `<TerminalMockup>` — fake terminal window with:
```
$ docker run ... ghcr.io/buggregator/server:latest
✓ Pulling image...
✓ Starting server on :8000
✓ Listening for events...
```
Dark terminal bg (`#0d1117`), green prompt `$`, white text, green checkmarks.

### Step 2: Add one env variable

**Left:**
```
Title: "Add one env variable"
Description: "Change one line in your .env file. Your existing Sentry SDK, VarDumper, Monolog, or Ray just work."
Code: <FrameworkTabs />
```

**FrameworkTabs** — horizontal tab buttons (Laravel · Symfony · Spiral · Any PHP), each showing the relevant `.env` snippet:

```ts
const frameworkSnippets = {
  laravel: `SENTRY_LARAVEL_DSN=http://sentry@127.0.0.1:8000/1
VAR_DUMPER_SERVER=127.0.0.1:9912
MAIL_HOST=127.0.0.1
MAIL_PORT=1025`,

  symfony: `SENTRY_DSN=http://sentry@127.0.0.1:8000/1
VAR_DUMPER_FORMAT=server
VAR_DUMPER_SERVER=127.0.0.1:9912`,

  spiral: `SENTRY_DSN=http://sentry@127.0.0.1:8000/1
PROFILER_ENDPOINT=http://profiler@127.0.0.1:8000
VAR_DUMPER_FORMAT=server
VAR_DUMPER_SERVER=127.0.0.1:9912`,

  any: `# Any PHP project with Sentry SDK:
SENTRY_DSN=http://sentry@127.0.0.1:8000/1

# With Symfony VarDumper:
VAR_DUMPER_FORMAT=server
VAR_DUMPER_SERVER=127.0.0.1:9912`,
}
```

Each tab content includes a `<CopyCommand>` for the snippet. Syntax highlight `.env` keys in accent-blue color.

**Right:** Code editor mockup (VS Code-like dark window) showing the `.env` file with the relevant variable highlighted. Static HTML/CSS — no actual editor.

### Step 3: Open your browser

**Left:**
```
Title: "Open your browser"
Description: "Navigate to http://127.0.0.1:8000 and Buggregator is ready. No login required."
Code: <a href="http://127.0.0.1:8000" class="step__url font-mono">http://127.0.0.1:8000 →</a>
```

**Right:** Browser window mockup (simple HTML/CSS):
- Browser chrome: three colored dots (close/minimize/maximize), URL bar showing `127.0.0.1:8000`
- Inside: simplified Buggregator sidebar with event type icons + "Waiting for events..." empty state

### Step 4: See everything in one place

**Left:**
```
Title: "See everything in one place"
Description: "Exceptions, logs, dumps, emails, profiling, HTTP requests — all in real time, all in one tab."
```

Then a horizontal icon row of event types with labels:
```
[🔴 Exceptions] [🟣 Profiler] [🟡 Emails] [🔵 Logs] [🟢 HTTP] [🩵 Ray]
```

**Right:** Simplified mini-mockup of the event list — 3-4 compact EventCards stacked (reuse the `EventCard` component from Stage 4, in a smaller/compact variant).

### InstallSection

Separate section immediately after StepsSection. Light or dark bg (author choice — recommend slightly different dark tone `--bg-base: #111318`).

```
[Title: "Get started in 60 seconds"]
[Three tabs: Docker | Docker Compose | Without Docker]

[Tab content: code block with CopyCommand]

[Trust badges row: ✓ Free forever · ✓ No registration · ✓ No credit card · ✓ Open source (MIT)]

[Links: "Full installation guide →" · "Configuration options →"]
```

**Docker Compose tab snippet:**
```yaml
services:
  buggregator:
    image: ghcr.io/buggregator/server:latest
    ports:
      - 127.0.0.1:8000:8000
      - 127.0.0.1:1025:1025
      - 127.0.0.1:9912:9912
      - 127.0.0.1:9913:9913
      - 127.0.0.1:9914:9914
```

**Without Docker tab:**
```bash
composer require --dev buggregator/trap -W
```
With note: *«No Docker needed. Trap runs as a PHP CLI tool in your project.»*

## Definition of Done

- [ ] Steps section renders with dark background, all 4 steps visible
- [ ] Step numbers (1-4) are visible as styled circles
- [ ] Step 1 docker run command is copyable
- [ ] Step 2 FrameworkTabs: all 4 tabs switch correctly, each shows correct `.env` snippet
- [ ] Step 2 snippets are copyable
- [ ] Step 3 browser URL `http://127.0.0.1:8000` is visible
- [ ] Step 4 event type icons row visible
- [ ] TerminalMockup renders in Step 1 preview column
- [ ] InstallSection: all 3 tabs (Docker / Compose / Trap) switch and show correct code
- [ ] Trust badges row visible below install section
- [ ] "Full installation guide" and "Configuration options" links go to `docs.buggregator.dev`
- [ ] All text uses `t()` strings
- [ ] Mobile: two-column layout collapses to single column; preview panels hidden on mobile

## Dependencies

**Requires:** Stage 3 (`CopyCommand` component), Stage 4 (`EventCard` for Step 4 preview), Stage 2 (i18n strings)
**Enables:** Stage 6 (remaining sections)
