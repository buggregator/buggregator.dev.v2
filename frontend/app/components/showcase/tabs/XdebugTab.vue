<script setup lang="ts">
import EventCard from '~/components/showcase/shared/EventCard.vue'
import xdebug from '~/data/mocks/xdebug.json'
</script>

<template>
  <EventCard type="xdebug" label="Xdebug" time="paused">
    <div class="space-y-3">
      <!-- Session -->
      <div class="flex items-center gap-2 flex-wrap text-xs">
        <span class="inline-flex items-center gap-1 px-1.5 rounded font-mono text-[10px] font-semibold leading-[18px] bg-[rgba(245,158,11,0.15)] text-[#fbbf24]">
          ❚❚ {{ xdebug.session.state }}
        </span>
        <span class="font-mono text-white truncate">{{ xdebug.session.title }}</span>
        <span class="font-mono text-on-dark-muted">{{ xdebug.session.where }} · #{{ xdebug.session.id }} · {{ xdebug.session.started }}</span>
        <span class="sm:ml-auto inline-flex items-center gap-1.5 px-2 py-0.5 rounded border border-landing-border-subtle font-mono text-[11px] text-on-dark-secondary">
          proxy :{{ xdebug.proxy.addr }} → IDE :{{ xdebug.proxy.ide }}
        </span>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-[minmax(0,17rem)_minmax(0,1fr)] gap-3">
        <!-- Variables + call stack -->
        <div class="space-y-3 min-w-0">
          <section class="rounded-lg border border-landing-border-subtle overflow-hidden" aria-label="Variables">
            <div class="px-3 py-2 bg-[rgba(255,255,255,0.02)] border-b border-landing-border-subtle text-xs font-semibold text-white">
              Variables <span class="font-normal text-on-dark-muted">· Locals</span>
            </div>
            <ul class="py-1.5 font-mono text-[11px]">
              <li
                v-for="(v, i) in xdebug.variables"
                :key="i"
                class="flex items-baseline gap-1.5 px-3 py-0.5 min-w-0"
                :style="{ paddingLeft: `${12 + v.depth * 14}px` }"
              >
                <span class="text-[#60a5fa] shrink-0">{{ v.name }}</span>
                <span class="text-on-dark-muted">=</span>
                <span class="truncate" :class="v.value === 'uninitialized' ? 'text-on-dark-muted italic' : 'text-code-string'">{{ v.value }}</span>
                <span v-if="v.type" class="text-on-dark-muted shrink-0">{{ v.type }}</span>
              </li>
            </ul>
          </section>

          <section class="rounded-lg border border-landing-border-subtle overflow-hidden" aria-label="Call stack">
            <div class="px-3 py-2 bg-[rgba(255,255,255,0.02)] border-b border-landing-border-subtle text-xs font-semibold text-white">
              Call stack
            </div>
            <ol class="py-1 font-mono text-[11px]">
              <li
                v-for="(f, i) in xdebug.stack"
                :key="i"
                class="px-3 py-1"
                :class="f.selected ? 'bg-[rgba(59,130,246,0.12)] border-l-2 border-accent' : 'border-l-2 border-transparent'"
              >
                <template v-if="f.group">
                  <span class="text-on-dark-muted">{{ f.group }} framework frames</span>
                </template>
                <template v-else>
                  <div class="text-white truncate">{{ f.fn }}</div>
                  <div class="text-on-dark-muted">{{ f.file }}</div>
                </template>
              </li>
            </ol>
          </section>
        </div>

        <!-- Source at the paused line -->
        <section class="rounded-lg border border-code-border overflow-hidden bg-code-bg min-w-0" aria-label="Source">
          <div class="flex items-center gap-2 px-3 py-2 border-b border-code-border text-xs">
            <span class="font-mono text-on-dark-secondary truncate">{{ xdebug.file }}:{{ xdebug.currentLine }}</span>
            <span class="ml-auto shrink-0 inline-flex items-center gap-1 px-2 py-0.5 rounded-full border border-code-border text-[11px] text-on-dark-secondary">
              <svg class="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><rect x="5" y="11" width="14" height="10" rx="2" /><path d="M8 11V7a4 4 0 0 1 8 0v4" /></svg>
              Stepping: in your IDE
            </span>
          </div>
          <div class="py-2 overflow-x-auto font-mono text-xs leading-6">
            <div
              v-for="line in xdebug.code"
              :key="line.n"
              class="flex items-center pr-4 min-w-max"
              :class="line.n === xdebug.currentLine ? 'bg-[rgba(245,158,11,0.12)]' : ''"
            >
              <span class="w-6 flex justify-center shrink-0" aria-hidden="true">
                <span v-if="line.n === xdebug.breakpointLine" class="w-2 h-2 rounded-full bg-[#ef4444]" />
              </span>
              <span class="w-8 text-right pr-3 text-on-dark-muted select-none shrink-0">{{ line.n }}</span>
              <span class="whitespace-pre" :class="line.text.trim().startsWith('//') ? 'text-code-comment' : 'text-code-text'">{{ line.text }}</span>
            </div>
          </div>
        </section>
      </div>
    </div>
  </EventCard>
</template>
