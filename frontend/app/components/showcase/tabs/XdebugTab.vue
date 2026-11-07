<script setup lang="ts">
import EventCard from '~/components/showcase/shared/EventCard.vue'
import xdebug from '~/data/mocks/xdebug.json'

// Glyphs of the Xdebug page's control bar (frontend entities/xdebug, 24×24).
const ICON = {
  play: 'M8 5v14l11-7z',
  stepover: 'M12 6a7 7 0 0 1 6.7 5H21l-3.5 4-3.5-4h2.6A5 5 0 0 0 7 11H5a7 7 0 0 1 7-5zm-2 12a2 2 0 1 1 4 0 2 2 0 0 1-4 0z',
  stepinto: 'M11 3h2v9.2l3-3 1.4 1.4L12 16l-5.4-5.4L8 9.2l3 3zm-1 17a2 2 0 1 1 4 0 2 2 0 0 1-4 0z',
  stepout: 'M11 16V6.8l-3 3L6.6 8.4 12 3l5.4 5.4L16 9.8l-3-3V16zm-1 4a2 2 0 1 1 4 0 2 2 0 0 1-4 0z',
  ext: 'M14 3h7v7h-2V6.4l-9.3 9.3-1.4-1.4L17.6 5H14zM5 5h6v2H5v12h12v-6h2v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2z',
  stop: 'M6 6h12v12H6z',
  agent: 'M12 2a2 2 0 0 1 1 3.7V7h4a3 3 0 0 1 3 3v8a3 3 0 0 1-3 3H7a3 3 0 0 1-3-3v-8a3 3 0 0 1 3-3h4V5.7A2 2 0 0 1 12 2zM7 9a1 1 0 0 0-1 1v8a1 1 0 0 0 1 1h10a1 1 0 0 0 1-1v-8a1 1 0 0 0-1-1zm2 3h2v2H9zm4 0h2v2h-2zm-4 4h6v1H9zM1 12h2v4H1zm20 0h2v4h-2z',
}
const steps = [
  { icon: ICON.stepover, label: 'Step over' },
  { icon: ICON.stepinto, label: 'Step into' },
  { icon: ICON.stepout, label: 'Step out' },
]
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
          Mode: {{ xdebug.mode }}
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
          <!-- Control bar as on the Xdebug page; a picture, not controls: nothing here is focusable. -->
          <div
            class="flex flex-wrap items-center gap-1 px-2 py-1.5 border-b border-code-border text-xs"
            role="img"
            :aria-label="`Debugger controls: Continue, Step over, Step into, Step out, Release, Stop. Last step: ${xdebug.lastStep}`"
          >
            <span class="inline-flex items-center gap-1.5 h-7 px-2.5 rounded-md bg-accent-strong text-white font-medium">
              <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path :d="ICON.play" /></svg>Continue
            </span>
            <span
              v-for="s in steps"
              :key="s.label"
              class="inline-grid place-items-center w-7 h-7 rounded-md text-on-dark-secondary"
              :title="s.label"
            >
              <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path :d="s.icon" /></svg>
            </span>
            <span class="w-px h-4 mx-1 bg-code-border" aria-hidden="true" />
            <span class="inline-flex items-center gap-1.5 h-7 px-2 rounded-md text-on-dark-secondary">
              <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path :d="ICON.ext" /></svg>Release
            </span>
            <span class="inline-flex items-center gap-1.5 h-7 px-2 rounded-md text-[#fb7185]">
              <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path :d="ICON.stop" /></svg>Stop
            </span>
            <span class="ml-auto inline-flex items-center gap-1.5 px-1 text-[11px] font-semibold text-on-dark-secondary whitespace-nowrap">
              <svg class="w-3 h-3" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path :d="ICON.agent" /></svg>Last step: {{ xdebug.lastStep }}
            </span>
          </div>
          <div class="px-3 py-1.5 border-b border-code-border text-xs">
            <span class="font-mono text-on-dark-secondary truncate">{{ xdebug.file }}:{{ xdebug.currentLine }}</span>
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
