<script setup lang="ts">
import EventCard from '~/components/showcase/shared/EventCard.vue'

const transactions = [
  {
    name: 'GET /api/users',
    status: 'success',
    duration: '142ms',
    memory: '4.2 MB',
    segments: [
      { label: 'Middleware', width: '15%', color: '#3b82f6' },
      { label: 'Controller', width: '25%', color: '#8b5cf6' },
      { label: 'DB Query', width: '45%', color: '#f59e0b' },
      { label: 'Response', width: '15%', color: '#22c55e' },
    ],
  },
  {
    name: 'POST /api/orders',
    status: 'success',
    duration: '891ms',
    memory: '12.8 MB',
    segments: [
      { label: 'Validation', width: '10%', color: '#3b82f6' },
      { label: 'Business Logic', width: '35%', color: '#8b5cf6' },
      { label: 'DB Transaction', width: '40%', color: '#f59e0b' },
      { label: 'Event Dispatch', width: '15%', color: '#f43f5e' },
    ],
  },
  {
    name: 'artisan queue:work',
    status: 'error',
    duration: '3.2s',
    memory: '24.1 MB',
    segments: [
      { label: 'Job Resolve', width: '5%', color: '#3b82f6' },
      { label: 'Processing', width: '80%', color: '#f43f5e' },
      { label: 'Failed', width: '15%', color: '#ef4444' },
    ],
  },
]
</script>

<template>
  <div class="space-y-3">
    <EventCard
      v-for="(tx, i) in transactions"
      :key="i"
      type="profiler"
      :label="tx.name"
      :time="tx.duration"
    >
      <div>
        <!-- Status + metrics -->
        <div class="flex items-center gap-3 mb-3">
          <span
            class="px-2 py-0.5 rounded text-xs font-semibold font-mono"
            :class="tx.status === 'success'
              ? 'bg-[rgba(34,197,94,0.15)] text-[#4ade80]'
              : 'bg-[rgba(239,68,68,0.15)] text-[#f87171]'"
          >
            {{ tx.status }}
          </span>
          <span class="font-mono text-xs text-on-dark-muted">{{ tx.memory }} peak</span>
        </div>

        <!-- Timeline bar -->
        <div class="flex h-6 rounded overflow-hidden gap-px">
          <div
            v-for="seg in tx.segments"
            :key="seg.label"
            class="flex items-center justify-center text-[10px] font-mono text-white font-medium truncate px-1"
            :style="{ width: seg.width, background: seg.color }"
            :title="seg.label"
          >
            {{ seg.label }}
          </div>
        </div>
      </div>
    </EventCard>
  </div>
</template>
