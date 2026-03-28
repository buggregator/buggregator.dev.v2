<script setup lang="ts">
import { heroFeedEvents, type FeedEvent } from '~/data/hero-feed-events'

const { t } = useI18n()

const typeColors: Record<string, string> = {
  sentry: '#f43f5e',
  smtp: '#f59e0b',
  profiler: '#8b5cf6',
  monolog: '#6b7280',
  'var-dump': '#ef4444',
  'http-dump': '#22c55e',
}

const typeLabels: Record<string, string> = {
  sentry: 'Exception',
  smtp: 'Email',
  profiler: 'Profiler',
  monolog: 'Log',
  'var-dump': 'Dump',
  'http-dump': 'HTTP',
}

const MAX_VISIBLE = 6

type VisibleEvent = FeedEvent & { key: number; age: string }

const visibleEvents = ref<VisibleEvent[]>([])
let eventIndex = 0
let timer: ReturnType<typeof setTimeout> | null = null
let counter = 0

function formatAge(idx: number): string {
  const s = idx * 3
  if (s === 0) return 'just now'
  return `${s}s ago`
}

function scheduleNext() {
  const event = heroFeedEvents[eventIndex % heroFeedEvents.length]
  eventIndex++

  timer = setTimeout(() => {
    counter++
    visibleEvents.value.unshift({
      ...event,
      key: counter,
      age: 'just now',
    })

    // Update ages
    visibleEvents.value.forEach((e, i) => {
      e.age = formatAge(i)
    })

    if (visibleEvents.value.length > MAX_VISIBLE) {
      visibleEvents.value = visibleEvents.value.slice(0, MAX_VISIBLE)
    }

    scheduleNext()
  }, event.delay)
}

onMounted(() => {
  // Seed 3 initial events
  const seed = heroFeedEvents.slice(0, 3).map((e, i) => ({
    ...e,
    key: i,
    age: formatAge(2 - i),
  }))
  visibleEvents.value = seed
  eventIndex = 3
  counter = 3

  scheduleNext()
})

onUnmounted(() => {
  if (timer) clearTimeout(timer)
})
</script>

<template>
  <div class="rounded-xl bg-landing-surface border border-landing-border-subtle overflow-hidden min-h-[500px] max-h-[580px] flex flex-col">
    <!-- Header -->
    <div class="flex items-center justify-between px-4 py-3 border-b border-landing-border-subtle bg-landing-base">
      <span class="font-mono text-xs text-on-dark-muted">Events</span>
      <span class="inline-flex items-center gap-1.5 font-mono text-xs text-on-dark-muted">
        <span class="w-2 h-2 rounded-full bg-[#22c55e] animate-pulse-dot" />
        {{ t('hero.liveFeed.live') }}
      </span>
    </div>

    <!-- Feed -->
    <div class="flex-1 overflow-hidden px-2 py-2">
      <TransitionGroup name="feed-card" tag="div" class="flex flex-col gap-1.5">
        <div
          v-for="event in visibleEvents"
          :key="event.key"
          class="rounded-lg bg-[#0f1117] p-3 pl-4"
          :style="{ borderLeft: `3px solid ${typeColors[event.type]}` }"
        >
          <div class="flex items-center justify-between mb-1">
            <span
              class="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-semibold"
              :style="{ background: `${typeColors[event.type]}20`, color: typeColors[event.type] }"
            >
              <span class="w-1 h-1 rounded-full" :style="{ background: typeColors[event.type] }" />
              {{ typeLabels[event.type] }}
            </span>
            <span class="font-mono text-[10px] text-on-dark-muted">{{ event.age }}</span>
          </div>
          <p class="font-mono text-xs text-on-dark-secondary truncate">{{ event.label }}</p>
          <p v-if="event.sublabel" class="font-mono text-[10px] text-on-dark-muted truncate mt-0.5">{{ event.sublabel }}</p>
        </div>
      </TransitionGroup>
    </div>
  </div>
</template>

<style scoped>
.feed-card-enter-active {
  transition: all 300ms cubic-bezier(0, 0, 0.2, 1);
}
.feed-card-enter-from {
  opacity: 0;
  transform: translateY(-12px);
}
.feed-card-move {
  transition: transform 300ms cubic-bezier(0.4, 0, 0.2, 1);
}
.feed-card-leave-active {
  transition: all 200ms ease;
  position: absolute;
  width: calc(100% - 16px);
}
.feed-card-leave-to {
  opacity: 0;
  transform: translateY(8px);
}

@media (prefers-reduced-motion: reduce) {
  .feed-card-enter-active,
  .feed-card-move,
  .feed-card-leave-active {
    transition: none;
  }
}
</style>
