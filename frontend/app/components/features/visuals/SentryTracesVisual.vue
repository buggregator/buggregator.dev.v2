<script setup lang="ts">
import data from '~/data/mocks/sentry-trace-feature.json'

// Span colours by peer type, as in the product's trace waterfall
// (frontend src/entities/sentry/ui/trace-waterfall).
const BAR: Record<string, string> = {
  server: '#AFA9EC',
  db: '#EF9F27',
  http: '#85B7EB',
  cache: '#5DCAA5',
  queue: '#B4B2A9',
}
const BADGE: Record<string, string> = {
  server: 'bg-[rgba(139,92,246,0.15)] text-[#c4b5fd]',
  db: 'bg-[rgba(245,158,11,0.15)] text-[#fcd34d]',
  http: 'bg-[rgba(59,130,246,0.15)] text-[#93c5fd]',
  cache: 'bg-[rgba(20,184,166,0.15)] text-[#5eead4]',
  queue: 'bg-[rgba(148,163,184,0.15)] text-[#cbd5e1]',
}

const { trace } = data
const bar = (start: number, duration: number) => ({
  left: `${(start / trace.totalMs) * 100}%`,
  width: `${Math.max(0.8, (duration / trace.totalMs) * 100)}%`,
})
</script>

<template>
  <div class="space-y-3 font-sans">
    <!-- Sentry sub-navigation with counts -->
    <div class="flex flex-wrap items-center gap-x-1 gap-y-2 border-b border-landing-border-subtle pb-2">
      <span
        v-for="tab in data.tabs"
        :key="tab.label"
        class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs"
        :class="tab.active ? 'bg-landing-elevated text-white' : 'text-on-dark-secondary'"
      >
        {{ tab.label }}
        <span class="px-1.5 rounded-full font-mono text-[10px] leading-4 bg-[rgba(255,255,255,0.08)]">{{ tab.count }}</span>
      </span>
      <span class="ml-auto text-xs text-on-dark-muted">
        Period <span class="ml-1 px-2 py-0.5 rounded border border-landing-border-subtle text-on-dark-secondary">{{ data.period }}</span>
      </span>
    </div>

    <!-- View toggle -->
    <div class="inline-flex rounded-md border border-landing-border-subtle overflow-hidden text-xs">
      <span class="px-2.5 py-1 bg-landing-elevated text-white">Waterfall list</span>
      <span class="px-2.5 py-1 text-on-dark-secondary">Service map</span>
    </div>

    <!-- One trace as a waterfall -->
    <div class="rounded-lg border border-landing-border-subtle overflow-hidden">
      <div class="flex items-center justify-between px-3 py-2 border-b border-landing-border-subtle bg-[rgba(255,255,255,0.02)]">
        <span class="font-mono text-sm text-white truncate">{{ trace.name }}</span>
        <span class="font-mono text-xs text-on-dark-muted shrink-0 ml-3">{{ trace.totalMs }}ms</span>
      </div>
      <div
        class="grid grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)_auto] sm:grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)_4rem] gap-x-3 px-3 py-1.5 text-[11px] uppercase tracking-wide text-on-dark-muted border-b border-landing-border-subtle"
      >
        <span>Operation</span><span>Timeline</span><span class="text-right">Duration</span>
      </div>
      <ul>
        <li
          v-for="(span, i) in trace.spans"
          :key="i"
          class="grid grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)_auto] sm:grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)_4rem] gap-x-3 items-center px-3 py-2 border-b last:border-b-0 border-landing-border-subtle"
          :class="span.error ? 'bg-[rgba(239,68,68,0.06)]' : ''"
        >
          <!-- Phone: badge and error tag on line 1, the description on line 2. -->
          <div class="min-w-0 flex flex-wrap sm:flex-nowrap items-center gap-x-2 gap-y-0.5" :style="{ paddingLeft: `${span.depth * 14}px` }">
            <span class="shrink-0 px-1.5 rounded font-mono text-[10px] font-semibold leading-[18px]" :class="BADGE[span.type]">{{ span.op }}</span>
            <span class="order-last sm:order-none w-full sm:w-auto min-w-0 truncate font-mono text-[11px] sm:text-xs text-on-dark-secondary">{{ span.description }}</span>
            <span
              v-if="span.error"
              class="shrink-0 px-1 rounded font-mono text-[10px] leading-4 bg-[rgba(239,68,68,0.18)] text-[#fca5a5]"
            >error</span>
          </div>
          <div class="relative h-4">
            <span class="absolute top-1/2 -translate-y-1/2 h-2 rounded-sm" :style="{ ...bar(span.start, span.duration), backgroundColor: BAR[span.type] }" />
          </div>
          <span class="text-right font-mono text-xs text-on-dark-secondary">{{ span.duration }}ms</span>
        </li>
      </ul>
    </div>
  </div>
</template>
