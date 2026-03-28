# Stage 4: Mock Showcase — Tabbed Event Preview

## Overview

The centerpiece of the new landing. Instead of an iframe demo or static screenshots, we render **real Vue components with real mock data** — the same components used in the production app, adapted for a read-only landing context.

Five tabs: Exceptions · Profiler · Emails · Logs · HTTP. Each tab shows a faithful representation of what the user would see inside Buggregator.

**Critical architectural decision:** All mock data comes from `frontend/src/entities/*/mocks/*.json`. These JSON files are copied into the landing project (or imported via a relative path alias). The Vue components are adapted/reimplemented for the landing — not directly imported from the frontend monorepo (different build context).

**On the Profiler tab:** Uses `@vue-flow/core` with `profiler-callgraph.json`. Read-only mode: no toolbar, no threshold controls. Hottest path is pre-highlighted (computed on mount). Caption overlay explains what the user is looking at.

## Files

CREATE:
- `buggregator.dev/spa-v2/components/showcase/MockShowcase.vue` — tabbed container
- `buggregator.dev/spa-v2/components/showcase/tabs/ExceptionsTab.vue` — Sentry exception mock
- `buggregator.dev/spa-v2/components/showcase/tabs/ProfilerTab.vue` — Vue Flow call graph
- `buggregator.dev/spa-v2/components/showcase/tabs/EmailsTab.vue` — SMTP preview card
- `buggregator.dev/spa-v2/components/showcase/tabs/LogsTab.vue` — Monolog cards list
- `buggregator.dev/spa-v2/components/showcase/tabs/HttpTab.vue` — HTTP dump card
- `buggregator.dev/spa-v2/components/showcase/shared/EventCard.vue` — reusable event card shell (type badge + left stripe + content slot)
- `buggregator.dev/spa-v2/components/showcase/shared/ExceptionFrame.vue` — stack frame row
- `buggregator.dev/spa-v2/data/mocks/sentry-exception.json` — custom Laravel exception mock
- `buggregator.dev/spa-v2/data/mocks/profiler-callgraph.json` — copied from `frontend/src/entities/profiler/mocks/profiler-callgraph.json`
- `buggregator.dev/spa-v2/data/mocks/smtp-welcome.json` — copied from `frontend/src/entities/smtp/mocks/smtp-welcome.json`
- `buggregator.dev/spa-v2/data/mocks/monolog-events.json` — 3 sample log events (custom)
- `buggregator.dev/spa-v2/data/mocks/http-dump.json` — 1 sample HTTP dump (custom)
- `buggregator.dev/spa-v2/composables/useCallGraph.ts` — maps profiler JSON → VueFlow nodes/edges

MODIFY:
- `buggregator.dev/spa-v2/pages/index.vue` — add `<MockShowcase>` section below Hero

## Code References

### Source components to study and adapt:
- `frontend/src/entities/profiler/lib/vue-flow/map-to-vue-flow.ts` — **copy this logic verbatim** into `useCallGraph.ts`; it maps `profiler-callgraph.json` format → VueFlow `nodes[]` + `edges[]`
- `frontend/src/entities/profiler/ui/render-graph/call-graph-node.vue` — **copy this component verbatim** into `components/showcase/CallGraphNode.vue`; it renders a single VueFlow node with color and percent
- `frontend/src/entities/sentry/ui/sentry-exception/sentry-exception.vue` — exception renderer pattern
- `frontend/src/entities/sentry/ui/sentry-exception/sentry-exception-frame.vue` — frame row pattern
- `frontend/src/shared/ui/preview-card/preview-card-header.vue` — event type badge + color system (lines 1-80 for the badge markup pattern)

### Mock data sources:
- `frontend/src/entities/profiler/mocks/profiler-callgraph.json` — 80-node Laravel call graph; copy to `data/mocks/`
- `frontend/src/entities/smtp/mocks/smtp-welcome.json` — HTML email mock; copy to `data/mocks/`

## Implementation Details

### MockShowcase container

```vue
<template>
  <section id="showcase" class="showcase">
    <div class="showcase__header">
      <h2>{{ t('showcase.title') }}</h2>
      <p>{{ t('showcase.subtitle') }}</p>
    </div>

    <!-- Tab buttons -->
    <div class="showcase__tabs" role="tablist">
      <button
        v-for="tab in tabs"
        :key="tab.id"
        role="tab"
        :aria-selected="activeTab === tab.id"
        :class="['showcase__tab', { 'showcase__tab--active': activeTab === tab.id }]"
        @click="activeTab = tab.id"
      >
        <span class="showcase__tab-dot" :style="{ background: tab.color }" />
        {{ t(`showcase.tabs.${tab.id}`) }}
      </button>
    </div>

    <!-- Tab panels -->
    <div class="showcase__panel">
      <Transition name="tab-fade" mode="out-in">
        <component :is="activeComponent" :key="activeTab" />
      </Transition>
    </div>
  </section>
</template>
```

Tab definitions:
```ts
const tabs = [
  { id: 'exceptions', color: '#f43f5e', component: ExceptionsTab },
  { id: 'profiler',   color: '#8b5cf6', component: ProfilerTab },
  { id: 'emails',     color: '#f59e0b', component: EmailsTab },
  { id: 'logs',       color: '#6b7280', component: LogsTab },
  { id: 'http',       color: '#22c55e', component: HttpTab },
]
```

Transition: `opacity 0→1, 150ms`. Default active tab: `exceptions`.

### Custom Sentry Exception Mock (`data/mocks/sentry-exception.json`)

Create a realistic but simple Laravel exception:

```json
{
  "type": "Illuminate\\Auth\\AuthenticationException",
  "value": "Unauthenticated. User session has expired.",
  "mechanism": { "type": "exception_handler", "handled": false },
  "stacktrace": {
    "frames": [
      {
        "filename": "vendor/laravel/framework/src/Illuminate/Auth/Middleware/Authenticate.php",
        "lineno": 44,
        "function": "unauthenticated",
        "context_line": "    throw new AuthenticationException(",
        "pre_context": ["    protected function unauthenticated($request, array $guards)", "    {"],
        "post_context": ["        'Unauthenticated.',", "        $guards, $this->redirectTo($request)", "    );"]
      },
      {
        "filename": "app/Http/Controllers/DashboardController.php",
        "lineno": 23,
        "function": "index",
        "context_line": "    $user = auth()->user();",
        "pre_context": ["    public function index(Request $request)", "    {"],
        "post_context": ["    $stats = $this->statsService->getFor($user);", "    return view('dashboard', compact('stats'));"]
      },
      {
        "filename": "routes/web.php",
        "lineno": 15,
        "function": null,
        "context_line": "Route::get('/dashboard', [DashboardController::class, 'index'])->middleware('auth');",
        "pre_context": [],
        "post_context": []
      }
    ]
  }
}
```

### ExceptionsTab component

```vue
<template>
  <div class="exceptions-tab">
    <EventCard type="sentry" label="AuthenticationException" time="2s ago">
      <!-- Exception header -->
      <div class="exception-header">
        <span class="exception-type">{{ mock.type }}</span>
        <span class="exception-badge exception-badge--unhandled">Unhandled</span>
      </div>
      <pre class="exception-message">{{ mock.value }}</pre>

      <!-- Stack frames -->
      <div class="exception-frames">
        <ExceptionFrame
          v-for="(frame, i) in reversedFrames"
          :key="i"
          :frame="frame"
          :is-open="i === 0"
        />
      </div>
    </EventCard>
  </div>
</template>
```

Show max 3 frames (newest first). First frame expanded by default. Others collapsed (click to expand). Style: dark bg for code lines, file path in muted mono, line number in accent color.

### ProfilerTab component

The most complex tab. Uses `@vue-flow/core` with real data.

```vue
<template>
  <div class="profiler-tab">
    <!-- Caption overlay (top-left) -->
    <div class="profiler-tab__caption">
      {{ t('showcase.profilerCaption') }}
    </div>

    <!-- Vue Flow graph -->
    <VueFlow
      id="landing-callgraph"
      :nodes="nodes"
      :edges="edges"
      :default-viewport="{ zoom: 0.6, x: 0, y: 0 }"
      :min-zoom="0.3"
      :max-zoom="1.5"
      fit-view-on-init
      :nodes-draggable="false"
      :nodes-connectable="false"
      :elements-selectable="false"
      class="profiler-tab__graph"
    >
      <template #node-callGraphNode="nodeProps">
        <CallGraphNode :data="nodeProps.data" :selected="false" />
      </template>
    </VueFlow>
  </div>
</template>

<script setup lang="ts">
import { VueFlow } from '@vue-flow/core'
import '@vue-flow/core/dist/style.css'
import '@vue-flow/core/dist/theme-default.css'
import graphData from '~/data/mocks/profiler-callgraph.json'
import { useCallGraph } from '~/composables/useCallGraph'
import CallGraphNode from '~/components/showcase/CallGraphNode.vue'

const { nodes, edges } = useCallGraph(graphData)
</script>
```

**Key settings for landing (read-only):**
- `nodes-draggable: false` — nodes cannot be moved
- `nodes-connectable: false` — no edge creation
- `elements-selectable: false` — no selection (simplifies UX)
- Default zoom: `0.6` — shows enough of the graph without being overwhelming
- Height: `min-h-[480px]` — enough vertical space to appreciate the graph

**`useCallGraph.ts`** — copy the logic from `frontend/src/entities/profiler/lib/vue-flow/map-to-vue-flow.ts` verbatim, just adapted as a Nuxt composable:

```ts
// composables/useCallGraph.ts
import Dagre from '@dagrejs/dagre'
import { MarkerType } from '@vue-flow/core'

export function useCallGraph(serverData: any) {
  // ... exact same logic as map-to-vue-flow.ts
  // mapToVueFlow(serverData) → { nodes, edges }
  const { nodes, edges } = mapToVueFlow(serverData)
  return { nodes: ref(nodes), edges: ref(edges) }
}
```

**`CallGraphNode.vue`** — copy `frontend/src/entities/profiler/ui/render-graph/call-graph-node.vue` verbatim. It's self-contained with no external dependencies.

### EmailsTab

Simple card showing:
- From: "Buggregator <no-reply@example.com>"
- To: "user@example.com"
- Subject: "Welcome to Buggregator!"
- Preview: first 2 lines of HTML body (stripped tags)
- "View HTML preview" button (disabled/decorative on landing)

### LogsTab

3 stacked compact log entries:
```
[DEBUG] 14:23:01 · Request completed · GET /api/users · 142ms
[ERROR] 14:23:05 · DB Connection failed · attempt 3/3
[INFO]  14:23:07 · Cache warmed · 1,240 items loaded
```

Use colored badges: DEBUG=gray, ERROR=rose, INFO=blue/teal.

### HttpTab

One HTTP dump card:
```
POST /api/orders HTTP/1.1
Host: api.example.com
Authorization: Bearer eyJ0eXAiOiJKV1Q...

{
  "product_id": 42,
  "quantity": 1,
  "user_id": 7
}
```

With a "cURL" button (decorative).

### EventCard shared component

Wraps any content with the standard preview card shell:
```
[3px left border in type color] [type badge] [label] [time] [content slot]
```

Props: `type: 'sentry' | 'profiler' | 'smtp' | 'monolog' | 'http-dump'`, `label: string`, `time: string`

Color map matches production: sentry=rose, profiler=violet, smtp=amber, monolog=teal, http-dump=green.

## Definition of Done

- [ ] All 5 tabs render without errors
- [ ] Tab switching animates smoothly (150ms fade)
- [ ] ExceptionsTab shows the custom Laravel exception with 3 frames; first frame expanded
- [ ] ProfilerTab renders the Vue Flow call graph with nodes visible at default zoom; no console errors
- [ ] Graph is read-only: nodes cannot be dragged, no selection cursor
- [ ] ProfilerTab caption overlay visible: "XHProf Call Graph · Laravel app · 891ms wall time"
- [ ] EmailsTab shows SMTP data from smtp-welcome.json
- [ ] LogsTab shows 3 log entries with correct level color badges
- [ ] HttpTab shows POST request with body
- [ ] `@vue-flow/core` CSS imported: nodes have background colors, edges have arrows
- [ ] Section visible in page at `id="showcase"`
- [ ] All tab labels use `t()` strings
- [ ] Mobile: tabs wrap or scroll horizontally; graph height reduced to 300px

## Dependencies

**Requires:** Stage 1 (Nuxt 4 + `@vue-flow/core` installed), Stage 2 (i18n), Stage 3 (page exists)
**Enables:** Stage 5 (Step-by-step), Stage 6 (remaining sections)
