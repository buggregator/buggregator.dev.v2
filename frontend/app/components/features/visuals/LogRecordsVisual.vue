<script setup lang="ts">
import data from '~/data/mocks/logs-feature.json'

// Badge colours per PSR-3 level, as in the product's Logs view.
const LEVEL: Record<string, string> = {
  DEBUG: 'bg-[rgba(148,163,184,0.15)] text-[#cbd5e1]',
  INFO: 'bg-[rgba(59,130,246,0.15)] text-[#93c5fd]',
  NOTICE: 'bg-[rgba(6,182,212,0.15)] text-[#67e8f9]',
  WARNING: 'bg-[rgba(245,158,11,0.15)] text-[#fcd34d]',
  ERROR: 'bg-[rgba(239,68,68,0.15)] text-[#fca5a5]',
}

const selected = data.selected
</script>

<template>
  <div class="grid grid-cols-1 lg:grid-cols-[minmax(0,20rem)_minmax(0,1fr)] gap-3">
    <!-- Live list -->
    <ul class="space-y-1.5 min-w-0">
      <li
        v-for="(record, i) in data.records"
        :key="i"
        class="flex items-center gap-2 rounded-lg border px-3 py-2 font-mono text-xs"
        :class="record.message === selected.message ? 'border-landing-border bg-landing-elevated' : 'border-landing-border-subtle'"
      >
        <span class="shrink-0 px-1.5 rounded text-[10px] font-semibold leading-[18px]" :class="LEVEL[record.level]">{{ record.level }}</span>
        <span class="shrink-0 text-on-dark-muted">{{ record.channel }}</span>
        <span class="min-w-0 truncate text-on-dark-secondary">{{ record.message }}</span>
        <span class="ml-auto shrink-0 text-on-dark-muted">{{ record.time }}</span>
      </li>
    </ul>

    <!-- One record -->
    <div class="min-w-0 rounded-lg border border-landing-border-subtle overflow-hidden">
      <div class="flex items-center gap-2 px-3 py-2 border-b border-landing-border-subtle bg-[rgba(255,255,255,0.02)]">
        <span class="text-sm font-semibold text-white">Channel: {{ selected.channel }}</span>
        <span class="px-1.5 rounded font-mono text-[10px] font-semibold leading-[18px]" :class="LEVEL[selected.level]">{{ selected.level }}</span>
      </div>
      <div class="p-3 space-y-3">
        <section>
          <h4 class="mb-1 text-[11px] uppercase tracking-wide text-on-dark-muted">Message</h4>
          <pre class="bg-[var(--code-bg)] border border-[var(--code-border)] rounded p-2 font-mono text-xs text-[var(--code-text)] whitespace-pre-wrap">{{ selected.message }}</pre>
        </section>
        <section>
          <h4 class="mb-1 text-[11px] uppercase tracking-wide text-on-dark-muted">Context</h4>
          <pre class="bg-[var(--code-bg)] border border-[var(--code-border)] rounded p-2 font-mono text-xs text-[var(--code-string)] whitespace-pre-wrap [overflow-wrap:anywhere] sm:whitespace-pre sm:[overflow-wrap:normal] overflow-x-auto">{{ selected.context }}</pre>
        </section>
        <section>
          <h4 class="mb-1 text-[11px] uppercase tracking-wide text-on-dark-muted">Source</h4>
          <dl class="grid grid-cols-[auto_1fr] gap-x-4 gap-y-1 font-mono text-xs">
            <template v-for="(value, key) in selected.source" :key="key">
              <dt class="text-on-dark-muted">{{ key }}</dt>
              <dd class="text-on-dark-secondary [overflow-wrap:anywhere]">{{ value }}</dd>
            </template>
          </dl>
        </section>
      </div>
    </div>
  </div>
</template>
